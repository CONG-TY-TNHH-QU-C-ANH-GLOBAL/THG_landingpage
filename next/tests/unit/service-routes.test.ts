import { describe, it, expect } from "vitest";

import {
  serviceBlocksFromDto,
  serviceFaqsFromDto,
  serviceRecordFromDto,
} from "../../src/features/services/mappers/service-page";
import {
  faqsResponseSchema,
  serviceBlocksResponseSchema,
  servicesResponseSchema,
} from "../../src/features/services/schemas/service-page";
import {
  SERVICE_PAGE_SLUGS,
  isServicePageEmpty,
} from "../../src/features/services/models/service-page";
import { buildHubTrackingLink } from "../../src/integrations/hub";

// WEB-002 generic service pages + WEB-008 tracking link. Pure layer only.

const service = (over: Record<string, unknown> = {}) => ({
  id: "thg-express",
  position: 1,
  icon: null,
  status: "live",
  name: "THG Express",
  tagline: null,
  hero_eyebrow: null,
  hero_title: null,
  hero_sub: null,
  cta_text: null,
  cta_url: null,
  body_md: null,
  bullets: [],
  gallery: [],
  videos: [],
  products: [],
  ...over,
});

describe("service record mapper", () => {
  it("selects the record whose id matches the page slug", () => {
    const dto = servicesResponseSchema.parse({
      locale: "vi",
      services: [service({ id: "thg-warehouse" }), service({ id: "thg-express" })],
    });
    expect(serviceRecordFromDto(dto, "thg-express")?.id).toBe("thg-express");
  });

  it("refuses a draft or archived record — publish state is the CMS's call", () => {
    for (const status of ["draft", "archived"]) {
      const dto = servicesResponseSchema.parse({
        locale: "vi",
        services: [service({ status })],
      });
      expect(serviceRecordFromDto(dto, "thg-express")).toBeNull();
    }
  });

  it("drops a gallery entry with no resolved URL rather than guessing at media_id", () => {
    const dto = servicesResponseSchema.parse({
      locale: "vi",
      services: [
        service({
          gallery: [{ media_id: 7, alt: "unhydrated" }, { url: "https://cms/a.jpg", alt: "A" }],
        }),
      ],
    });
    expect(serviceRecordFromDto(dto, "thg-express")?.gallery).toEqual([
      { url: "https://cms/a.jpg", alt: "A" },
    ]);
  });

  it("passes product price, time and origin through verbatim", () => {
    const dto = servicesResponseSchema.parse({
      locale: "vi",
      services: [
        service({ products: [{ name: "Áo thun", price: "$3.20", time: "48h", origin: "VN" }] }),
      ],
    });
    // No currency conversion, no reformatting — a price claim comes from the CMS or not at all.
    expect(serviceRecordFromDto(dto, "thg-express")?.products[0]).toEqual({
      name: "Áo thun",
      price: "$3.20",
      time: "48h",
      origin: "VN",
      image: null,
    });
  });
});

const block = (over: Record<string, unknown> = {}) => ({
  id: 1,
  kind: "pain_point",
  position: 1,
  icon: null,
  title: "T",
  description: "D",
  payload: {},
  ...over,
});

describe("service block mapper", () => {
  it("groups by kind and orders each group by CMS position", () => {
    const dto = serviceBlocksResponseSchema.parse({
      locale: "vi",
      page_slug: "thg-order",
      kind: null,
      blocks: [
        block({ id: 2, kind: "process_step", position: 2 }),
        block({ id: 1, kind: "process_step", position: 1 }),
        block({ id: 3, kind: "solution", position: 1 }),
      ],
    });
    const grouped = serviceBlocksFromDto(dto);
    expect(grouped.process_step?.map((b) => b.id)).toEqual([1, 2]);
    expect(grouped.solution?.map((b) => b.id)).toEqual([3]);
  });

  it("drops an unregistered kind and reports it, instead of guessing a template", () => {
    const anomalies: string[] = [];
    const dto = serviceBlocksResponseSchema.parse({
      locale: "vi",
      page_slug: "thg-order",
      kind: null,
      blocks: [block({ id: 9, kind: "some_future_kind" })],
    });
    const grouped = serviceBlocksFromDto(dto, (kind, reason) => anomalies.push(`${kind}:${reason}`));
    expect(Object.keys(grouped)).toEqual([]);
    expect(anomalies).toEqual(["some_future_kind:unregistered-kind"]);
  });

  // Which fields keep a block alive is decided by what the two renderers actually output:
  // BlockCard renders num, tag, time, title, description, items and note; StatCard renders
  // value and title [FACT: ui/service-page-view.tsx:34-81]. The old guard tested only
  // title/description/value AND ran before the extras were parsed, so it silently discarded
  // whole legitimate block shapes. One case per renderable field.
  const kept = (over: Record<string, unknown>) => {
    const dto = serviceBlocksResponseSchema.parse({
      locale: "vi",
      page_slug: "thg-order",
      kind: null,
      blocks: [block({ id: 1, title: null, description: null, ...over })],
    });
    return Object.values(serviceBlocksFromDto(dto)).flat();
  };

  it.each([
    ["title only", { title: "Chỉ tiêu đề" }],
    ["description only", { description: "Chỉ mô tả" }],
    ["value only (stat)", { kind: "stat", payload: { val: "98%" } }],
    ["num only (process_step)", { kind: "process_step", payload: { num: 3 } }],
    ["tag only", { kind: "solution", payload: { tag: "Air" } }],
    ["time only", { kind: "shipping_lane", payload: { time: "7-10 ngày" } }],
    ["items only via features", { kind: "shipping_lane", payload: { features: ["Có tracking"] } }],
    ["items only via items", { kind: "policy", payload: { items: ["Không nhận hàng pin"] } }],
    ["note only", { kind: "shipping_lane", payload: { note: "Trừ hàng pin" } }],
  ])("keeps a block whose only content is %s", (_label, over) => {
    expect(kept(over)).toHaveLength(1);
  });

  it("keeps a shipping_lane that is only tag + time + items — the classic dropped shape", () => {
    const blocks = kept({
      kind: "shipping_lane",
      payload: { tag: "Air", time: "7-10 ngày", features: ["Có tracking", "Bảo hiểm"] },
    });
    expect(blocks).toHaveLength(1);
    expect(blocks[0].extras.tag).toBe("Air");
    expect(blocks[0].extras.items.map((i) => i.text)).toEqual(["Có tracking", "Bảo hiểm"]);
  });

  it("keeps a policy that is only items + note", () => {
    const blocks = kept({ kind: "policy", payload: { items: ["Điều khoản một"], note: "Ghi chú" } });
    expect(blocks).toHaveLength(1);
    expect(blocks[0].extras.note).toBe("Ghi chú");
  });

  it("still numbers duplicate item lines instead of dropping one", () => {
    const blocks = kept({ kind: "policy", payload: { items: ["Giống nhau", "Giống nhau"] } });
    const ids = blocks[0].extras.items.map((i) => i.id);
    expect(blocks[0].extras.items.map((i) => i.text)).toEqual(["Giống nhau", "Giống nhau"]);
    expect(new Set(ids).size).toBe(2);
    // Scoped to the block so two lanes sharing a feature line never collide.
    expect(ids[0]).toContain("policy-1");
  });

  it("drops a registered block that would render NOTHING readable", () => {
    const anomalies: string[] = [];
    const dto = serviceBlocksResponseSchema.parse({
      locale: "vi",
      page_slug: "thg-order",
      kind: null,
      // Whitespace everywhere, an empty item list, and an icon — which is aria-hidden, so it is
      // decoration, not readable content.
      blocks: [
        block({
          id: 7,
          title: "   ",
          description: "  ",
          icon: "📦",
          payload: { num: "", tag: "  ", items: ["  "], note: null, val: null },
        }),
      ],
    });
    const grouped = serviceBlocksFromDto(dto, (kind, reason) => anomalies.push(`${kind}:${reason}`));
    expect(Object.keys(grouped)).toEqual([]);
    expect(anomalies).toEqual(["pain_point:malformed"]);
  });

  it("drops a block with no title, description or value — a half-card reads as broken", () => {
    const anomalies: string[] = [];
    const dto = serviceBlocksResponseSchema.parse({
      locale: "vi",
      page_slug: "thg-order",
      kind: null,
      blocks: [block({ id: 5, title: "   ", description: null })],
    });
    serviceBlocksFromDto(dto, (kind, reason) => anomalies.push(`${kind}:${reason}`));
    expect(anomalies).toEqual(["pain_point:malformed"]);
  });

  it("survives the documented empty-payload degradation", () => {
    const dto = serviceBlocksResponseSchema.parse({
      locale: "vi",
      page_slug: "thg-order",
      kind: null,
      blocks: [block({ payload: {} })],
    });
    const [mapped] = serviceBlocksFromDto(dto).pain_point!;
    expect(mapped.extras).toEqual({
      num: null,
      tag: null,
      time: null,
      items: [],
      note: null,
      value: null,
    });
  });

  it("narrows payload values and never stringifies an object onto the page", () => {
    const dto = serviceBlocksResponseSchema.parse({
      locale: "vi",
      page_slug: "thg-express",
      kind: null,
      blocks: [
        block({
          kind: "shipping_lane",
          payload: {
            tag: "Air",
            time: "7-10d",
            features: ["Tracked", { nope: true }, ""],
            note: 42,
            bogus: { deep: 1 },
          },
        }),
      ],
    });
    const [mapped] = serviceBlocksFromDto(dto).shipping_lane!;
    // Non-string list entries are dropped, not String()'d into "[object Object]".
    expect(mapped.extras.items.map((i) => i.text)).toEqual(["Tracked"]);
    // Identity is scoped to the block, never the render-loop index.
    expect(mapped.extras.items[0].id).toContain("shipping_lane-1");
    // A finite number is a legitimate display value.
    expect(mapped.extras.note).toBe("42");
  });

  it("merges shipping_lane `features` and policy `items` into one list field", () => {
    const dto = serviceBlocksResponseSchema.parse({
      locale: "vi",
      page_slug: "thg-order",
      kind: null,
      blocks: [block({ kind: "policy", payload: { items: ["A", "B"] } })],
    });
    expect(serviceBlocksFromDto(dto).policy![0].extras.items.map((i) => i.text)).toEqual([
      "A",
      "B",
    ]);
  });

  it("keeps duplicate lane features, numbering the key instead of dropping one", () => {
    // A lane may legitimately list the same assurance twice; removing business content to
    // obtain a React key would be the wrong trade.
    const dto = serviceBlocksResponseSchema.parse({
      locale: "vi",
      page_slug: "thg-express",
      kind: null,
      blocks: [block({ kind: "shipping_lane", payload: { features: ["Tracked", "Tracked"] } })],
    });
    const items = serviceBlocksFromDto(dto).shipping_lane![0].extras.items;
    expect(items.map((i) => i.text)).toEqual(["Tracked", "Tracked"]);
    expect(new Set(items.map((i) => i.id)).size).toBe(2);
  });

  it("keeps a stat block that has only a value", () => {
    const dto = serviceBlocksResponseSchema.parse({
      locale: "vi",
      page_slug: "thg-order",
      kind: null,
      blocks: [block({ kind: "stat", title: null, description: null, payload: { val: "99%" } })],
    });
    expect(serviceBlocksFromDto(dto).stat![0].extras.value).toBe("99%");
  });
});

describe("service page emptiness", () => {
  it("is empty only when the record, every block group and the FAQs are empty", () => {
    expect(
      isServicePageEmpty({ slug: "thg-express", service: null, blocksByKind: {}, faqs: [] }),
    ).toBe(true);
    expect(
      isServicePageEmpty({
        slug: "thg-express",
        service: null,
        blocksByKind: {},
        faqs: [{ id: 1, question: "Q", answer: "A" }],
      }),
    ).toBe(false);
  });

  it("does not serve thg-fulfill — it has its own approved design", () => {
    expect(SERVICE_PAGE_SLUGS).not.toContain("thg-fulfill");
  });
});

describe("faq mapper", () => {
  it("orders by CMS position", () => {
    const dto = faqsResponseSchema.parse({
      locale: "vi",
      scope: "express",
      faqs: [
        { id: 2, position: 2, question: "Q2", answer: "A2" },
        { id: 1, position: 1, question: "Q1", answer: "A1" },
      ],
    });
    expect(serviceFaqsFromDto(dto).map((f) => f.id)).toEqual([1, 2]);
  });
});

describe("hub tracking link (WEB-008)", () => {
  it("builds an HTTPS Hub URL carrying only the locale", () => {
    const link = buildHubTrackingLink("vi");
    expect(link?.url).toBe("https://hub.thgfulfill.com/tracking?lang=vi");
    // No order id, no PII, no credential.
    expect(link?.url).not.toMatch(/id=|token|key/i);
  });

  it("refuses a non-allowlisted host — a CTA must not send visitors anywhere unexpected", () => {
    expect(buildHubTrackingLink("vi", "https://evil.example")).toBeNull();
  });

  it("refuses plain HTTP and a malformed origin", () => {
    expect(buildHubTrackingLink("vi", "http://hub.thgfulfill.com")).toBeNull();
    expect(buildHubTrackingLink("vi", "not a url")).toBeNull();
  });

  it("falls back to the established Hub origin when unset", () => {
    expect(buildHubTrackingLink("en", undefined)?.url).toContain("https://hub.thgfulfill.com");
    expect(buildHubTrackingLink("en", "   ")?.url).toContain("https://hub.thgfulfill.com");
  });

  it("normalizes an explicit default port away — so :443 is the same origin", () => {
    // Pins the WHATWG behaviour the port check relies on, rather than assuming it. Because the
    // scheme's default port canonicalizes to "", the invariant is `port === ""` and a
    // `|| port === "443"` branch would be unreachable.
    expect(new URL("https://hub.thgfulfill.com:443").port).toBe("");
    expect(buildHubTrackingLink("vi", "https://hub.thgfulfill.com:443")?.url).toBe(
      "https://hub.thgfulfill.com/tracking?lang=vi",
    );
  });

  it("refuses the approved host on a NON-default port", () => {
    // `hostname` excludes the port, so the allowlist alone let these through. A different port
    // is a different origin — approved name, unapproved server.
    for (const origin of [
      "https://hub.thgfulfill.com:8443",
      "https://hub.thgfulfill.com:444",
      "https://hub.thgfulfill.com:80",
    ]) {
      expect(buildHubTrackingLink("vi", origin), origin).toBeNull();
    }
  });

  it("refuses hostname spoofs that merely contain the approved host", () => {
    for (const origin of [
      "https://hub.thgfulfill.com.evil.example",
      "https://evil-hub.thgfulfill.com.attacker.test",
      "https://notthub.thgfulfill.com",
      "https://hub.thgfulfill.com.co",
      "https://sub.hub.thgfulfill.com",
    ]) {
      expect(buildHubTrackingLink("vi", origin), origin).toBeNull();
    }
  });

  it("drops credentials, path, query and fragment from a configured origin", () => {
    // The builder bases the link on URL.origin, which is scheme + host + port only. Documented
    // by test rather than by an extra rejection branch: nothing unexpected can reach the link.
    const link = buildHubTrackingLink("vi", "https://user:pw@hub.thgfulfill.com/other?a=b#frag");
    expect(link?.url).toBe("https://hub.thgfulfill.com/tracking?lang=vi");
    expect(link?.url).not.toMatch(/user|pw|frag|a=b/);
  });

  it("keeps encoding the locale as a query parameter", () => {
    expect(buildHubTrackingLink("zh")?.url).toBe("https://hub.thgfulfill.com/tracking?lang=zh");
  });
});
