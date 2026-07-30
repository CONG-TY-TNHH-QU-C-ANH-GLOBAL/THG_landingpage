import { describe, it, expect, vi } from "vitest";

import { serviceBlocksResponseSchema, type CmsServiceBlock } from "../../src/features/fulfill/schemas/service-blocks";
import { fulfillServiceContentFromDto } from "../../src/features/fulfill/mappers/serviceBlocks";
import {
  applyServiceBlocks,
  emptyServiceContent,
  FULFILL_JOURNEY_KEYS,
  type FulfillServiceContent,
} from "../../src/features/fulfill/models/service-content";
import { getFulfillContent } from "../../src/features/fulfill";

// WEB-002 service-block consumption: CMS supplies localized journey/capability/section text keyed
// by a code-owned payload.key; the landing owns the roles, order and fallback. Identity is
// payload.key ONLY — never id/position/CMS order/title.

let nextId = 1;
function block(
  kind: string,
  key: string | null,
  title: string | null,
  description: string | null,
  extraPayload: Record<string, unknown> = {},
): CmsServiceBlock {
  const payload = key === null ? { ...extraPayload } : { key, ...extraPayload };
  return { id: nextId++, kind, position: 0, icon: null, title, description, payload };
}

function dto(blocks: CmsServiceBlock[]) {
  return serviceBlocksResponseSchema.parse({ locale: "vi", page_slug: "thg-fulfill", kind: null, blocks });
}

describe("service-blocks contract + mapper", () => {
  it("parses the verified /service-blocks response shape", () => {
    const parsed = dto([block("journey_step", "design-input", "Nhận thiết kế", "Mô tả")]);
    expect(parsed.page_slug).toBe("thg-fulfill");
    expect(parsed.blocks[0].payload.key).toBe("design-input");
  });

  it("maps journey and capability blocks by their stable payload.key", () => {
    const content = fulfillServiceContentFromDto(
      dto([
        block("journey_step", "quality-assurance", "QA (CMS)", "QC mô tả (CMS)"),
        block("capability", "hub", "Hub (CMS)", "Hub desc (CMS)"),
      ]),
    );
    expect(content.journey.get("quality-assurance")).toEqual({ title: "QA (CMS)", description: "QC mô tả (CMS)" });
    expect(content.capabilities.get("hub")).toEqual({ title: "Hub (CMS)", description: "Hub desc (CMS)" });
  });

  it("ignores unknown kinds and unknown keys without touching known roles", () => {
    const onAnomaly = vi.fn();
    const content = fulfillServiceContentFromDto(
      dto([
        block("pain_point", "whatever", "x", "y"), // unknown kind for our roles
        block("journey_step", "not-a-real-step", "x", "y"), // unknown key
        block("journey_step", "processing", "P (CMS)", "P desc"),
      ]),
      onAnomaly,
    );
    expect(content.journey.size).toBe(1);
    expect(content.journey.get("processing")?.title).toBe("P (CMS)");
    // Unknown key/kind are ignored silently (not our role) — no anomaly noise.
    expect(onAnomaly).not.toHaveBeenCalled();
  });

  it("flags a missing payload.key and does not map the block", () => {
    const onAnomaly = vi.fn();
    const content = fulfillServiceContentFromDto(dto([block("journey_step", null, "no key", "desc")]), onAnomaly);
    expect(content.journey.size).toBe(0);
    expect(onAnomaly).toHaveBeenCalledWith("journey_step", "missing-key", expect.any(Number));
  });

  it("poisons a DUPLICATE known key (no arbitrary winner) and flags it", () => {
    const onAnomaly = vi.fn();
    const content = fulfillServiceContentFromDto(
      dto([
        block("capability", "qc", "QC A", "first"),
        block("capability", "qc", "QC B", "second"),
      ]),
      onAnomaly,
    );
    expect(content.capabilities.has("qc")).toBe(false); // dropped → role falls back
    expect(onAnomaly).toHaveBeenCalledWith("capability", "duplicate-key", "qc");
  });

  it("drops a MALFORMED known block (blank title + description) and flags it", () => {
    const onAnomaly = vi.fn();
    const content = fulfillServiceContentFromDto(dto([block("journey_step", "dispatch-ready", "  ", "")]), onAnomaly);
    expect(content.journey.has("dispatch-ready")).toBe(false);
    expect(onAnomaly).toHaveBeenCalledWith("journey_step", "malformed", "dispatch-ready");
  });

  it("returns the empty model for an empty block set", () => {
    const content = fulfillServiceContentFromDto(dto([]));
    expect(content.journey.size + content.capabilities.size + content.sections.size).toBe(0);
  });
});

describe("applyServiceBlocks overlay (CMS wins, else fallback; order stays code-owned)", () => {
  const base = getFulfillContent("vi");

  it("overlays CMS journey/capability/section text onto the fallback by role", () => {
    const content = fulfillServiceContentFromDto(
      dto([
        block("journey_step", "design-input", "Design (CMS)", "Design desc (CMS)"),
        block("capability", "network", "Network (CMS)", "Network desc (CMS)"),
        block("section_copy", "consult-heading", "Mở hồ sơ (CMS)", ""),
        block("section_copy", "hub-caption", "", "Hub caption (CMS)"),
      ]),
    );
    const merged = applyServiceBlocks(base, content);
    expect(merged.steps[0].title).toBe("Design (CMS)");
    expect(merged.steps[0].index).toBe(base.steps[0].index); // code-owned rail preserved
    expect(merged.capabilities.network.title).toBe("Network (CMS)");
    expect(merged.consultTitle).toBe("Mở hồ sơ (CMS)");
    expect(merged.hubCaption).toBe("Hub caption (CMS)");
  });

  it("resolves by key regardless of CMS block ORDER (landing order is code-owned)", () => {
    // Blocks arrive shuffled/reversed; the merged journey must still be design-input → dispatch-ready.
    const content = fulfillServiceContentFromDto(
      dto([
        block("journey_step", "dispatch-ready", "D4", "d4"),
        block("journey_step", "design-input", "D1", "d1"),
        block("journey_step", "quality-assurance", "D3", "d3"),
        block("journey_step", "processing", "D2", "d2"),
      ]),
    );
    const merged = applyServiceBlocks(base, content);
    expect(merged.steps.map((s) => s.title)).toEqual(["D1", "D2", "D3", "D4"]);
  });

  it("keeps the localized fallback for a missing role", () => {
    const content = fulfillServiceContentFromDto(dto([block("journey_step", "processing", "only P", "p")]));
    const merged = applyServiceBlocks(base, content);
    expect(merged.steps[1].title).toBe("only P"); // CMS
    expect(merged.steps[0].title).toBe(base.steps[0].title); // fallback
    expect(merged.capabilities.hub.title).toBe(base.capabilities.hub.title); // fallback
  });

  it("keeps the fallback field when a CMS block supplies only one side (no blank render)", () => {
    const content = fulfillServiceContentFromDto(dto([block("capability", "pack", "Pack (CMS)", "")]));
    const merged = applyServiceBlocks(base, content);
    expect(merged.capabilities.pack.title).toBe("Pack (CMS)");
    expect(merged.capabilities.pack.description).toBe(base.capabilities.pack.description); // fallback kept
  });

  it("produces value-identical copy when the model is empty (no visual change until seeded)", () => {
    const merged = applyServiceBlocks(base, emptyServiceContent());
    expect(merged).toEqual(base);
  });

  it("pins the journey registry length to the step tuple (index alignment invariant)", () => {
    expect(FULFILL_JOURNEY_KEYS).toHaveLength(base.steps.length);
  });
});

describe("provenance is explicit in the model", () => {
  it("presence in the map means CMS; absence means fallback", () => {
    const content: FulfillServiceContent = fulfillServiceContentFromDto(
      dto([block("capability", "qc", "QC (CMS)", "d")]),
    );
    expect(content.capabilities.has("qc")).toBe(true); // cms
    expect(content.capabilities.has("network")).toBe(false); // fallback
  });
});
