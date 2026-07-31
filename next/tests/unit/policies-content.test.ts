import { describe, it, expect } from "vitest";

import { policyDetailFromDto, policySummariesFromDto } from "../../src/features/policies/mappers/policy";
import {
  shippingRouteDetailFromDto,
  shippingRouteSummariesFromDto,
} from "../../src/features/policies/mappers/shipping";
import { isPolicyContentEmpty } from "../../src/features/policies/models/policy";
import { isRouteContentEmpty } from "../../src/features/policies/models/shipping";
import {
  policiesResponseSchema,
  policyResponseSchema,
} from "../../src/features/policies/schemas/policies";
import {
  shippingRouteResponseSchema,
  shippingRoutesResponseSchema,
} from "../../src/features/policies/schemas/shipping";

// WEB-007 pure layer: schema → mapper → model. No network, no React.
// Fixtures mirror the frozen CMS contract exactly (CMS src/openapi/paths.ts).

const policyDetailDto = (over: Record<string, unknown> = {}) => ({
  locale: "vi" as const,
  policy: {
    slug: "shipping",
    title: "Chính sách vận chuyển",
    icon: "📦",
    mode: "text" as const,
    body_md: "",
    image_list: [],
    text_blocks: [],
    summary: null,
    position: 1,
    ...over,
  },
});

describe("policy mappers", () => {
  it("orders sections by the CMS position, never by title", () => {
    const dto = policiesResponseSchema.parse({
      locale: "vi",
      policies: [
        { slug: "z-last", title: "AAA", icon: null, mode: "text", summary: null, position: 3 },
        { slug: "a-first", title: "ZZZ", icon: null, mode: "text", summary: null, position: 1 },
      ],
    });
    // Alphabetically "AAA" would come first; the operator's ordering must win.
    expect(policySummariesFromDto(dto).map((p) => p.slug)).toEqual(["a-first", "z-last"]);
  });

  it("drops the wire position field from the model", () => {
    const dto = policiesResponseSchema.parse({
      locale: "vi",
      policies: [{ slug: "s", title: "T", icon: null, mode: "text", summary: null, position: 1 }],
    });
    expect(policySummariesFromDto(dto)[0]).not.toHaveProperty("position");
  });

  it("collapses a null body_md to an empty string rather than failing the page", () => {
    const dto = policyResponseSchema.parse(policyDetailDto({ body_md: null }));
    expect(policyDetailFromDto(dto).bodyMarkdown).toBe("");
  });

  it("drops blank paragraphs inside a text block", () => {
    const dto = policyResponseSchema.parse(
      policyDetailDto({
        text_blocks: [{ type: "warn", heading: "H", content: ["real", "   ", ""] }],
      }),
    );
    const [block] = policyDetailFromDto(dto).blocks;
    expect(block.tone).toBe("warn");
    expect(block.paragraphs).toEqual(["real"]);
  });

  it("recognizes a policy with no readable content in this locale (OQ-P-001 state)", () => {
    const empty = policyDetailFromDto(policyResponseSchema.parse(policyDetailDto()));
    expect(isPolicyContentEmpty(empty)).toBe(true);

    const withImages = policyDetailFromDto(
      policyResponseSchema.parse(policyDetailDto({ image_list: ["https://cms/x.jpg"] })),
    );
    expect(isPolicyContentEmpty(withImages)).toBe(false);
  });

  it("tolerates an additive CMS field without breaking (forward compatibility)", () => {
    const dto = policyResponseSchema.parse(
      policyDetailDto({ updated_at: 1_700_000_000, version: 4, block_key: "policy.shipping" }),
    );
    expect(policyDetailFromDto(dto).slug).toBe("shipping");
  });
});

const routeDetailDto = (over: Record<string, unknown> = {}) => ({
  locale: "vi" as const,
  route: {
    slug: "vn-us",
    position: 1,
    title: "VN → US",
    origin: "VN",
    destination: "US",
    kind: "air",
    body_md: "",
    notes: [],
    tables: [],
    updated_at: 1_700_000_000,
    ...over,
  },
});

describe("shipping mappers", () => {
  it("orders routes by CMS position", () => {
    const dto = shippingRoutesResponseSchema.parse({
      locale: "vi",
      routes: [
        { slug: "b", position: 2, title: "B", origin: null, destination: null, kind: null },
        { slug: "a", position: 1, title: "A", origin: null, destination: null, kind: null },
      ],
      total: 2,
    });
    expect(shippingRouteSummariesFromDto(dto).map((r) => r.slug)).toEqual(["a", "b"]);
  });

  it("renders a null table cell as an em dash, never the string null", () => {
    const dto = shippingRouteResponseSchema.parse(
      routeDetailDto({
        tables: [
          {
            caption: "Rates",
            columns: [
              { key: "w", label: "Weight" },
              { key: "p", label: "Price" },
            ],
            rows: [{ w: 1, p: null }],
          },
        ],
      }),
    );
    const [table] = shippingRouteDetailFromDto(dto).tables;
    // Numbers are stringified in the mapper so the renderer never picks a number format.
    expect(table.rows[0]).toEqual({ w: "1", p: "—" });
  });

  it("drops a column-less table (the CMS degradation for malformed columns_json)", () => {
    const dto = shippingRouteResponseSchema.parse(
      routeDetailDto({ tables: [{ caption: null, columns: [], rows: [] }] }),
    );
    expect(shippingRouteDetailFromDto(dto).tables).toEqual([]);
  });

  it("recognizes a route with no terms in this locale", () => {
    const empty = shippingRouteDetailFromDto(shippingRouteResponseSchema.parse(routeDetailDto()));
    expect(isRouteContentEmpty(empty)).toBe(true);

    const withNotes = shippingRouteDetailFromDto(
      shippingRouteResponseSchema.parse(routeDetailDto({ notes: ["Customs delay applies"] })),
    );
    expect(isRouteContentEmpty(withNotes)).toBe(false);
  });

  it("rejects a payload missing a documented field (contract violation fails loud)", () => {
    expect(() =>
      shippingRoutesResponseSchema.parse({
        locale: "vi",
        routes: [{ slug: "a", position: 1, title: "A" }],
        total: 1,
      }),
    ).toThrow();
  });
});
