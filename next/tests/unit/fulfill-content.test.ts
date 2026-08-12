import { describe, it, expect } from "vitest";

import { fullServicesResponseSchema } from "../../src/features/fulfill/schemas/services";
import { fulfillContentFromDto } from "../../src/features/fulfill/mappers/fulfillContent";
import { fulfillFaqsFromDto } from "../../src/features/fulfill/mappers/faq";
import { fulfillFaqsResponseSchema } from "../../src/features/fulfill/schemas/fulfill-faqs";

// WEB-002 fulfill slice (data plane): the mapper must select the live `thg-fulfill` service,
// normalize CMS wire fields to presentation-ready strings, honor the empty catalog / empty FAQ
// states, and reject malformed payloads conservatively (schema is the gate).

/** A minimal but schema-valid `/services` response containing the fulfill service. */
function servicesDto(overrides: Record<string, unknown> = {}) {
  return {
    locale: "en",
    services: [
      {
        id: "thg-express",
        position: 1,
        icon: "✈️",
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
      },
      {
        id: "thg-fulfill",
        position: 2,
        icon: "📦",
        status: "live",
        name: "THG Fulfill",
        tagline: "Fulfill Ecosystem A-Z",
        hero_eyebrow: null,
        hero_title: "THG Fulfill",
        hero_sub: "POD printing in Vietnam, China and USA.",
        cta_text: "Learn more",
        cta_url: "/thg-fulfill",
        body_md: "POD printing...",
        bullets: ["  VN/CN/US POD  ", "Item-level QC", ""],
        gallery: [],
        videos: [],
        products: [],
        ...overrides,
      },
    ],
  };
}

describe("fulfillContentFromDto", () => {
  it("selects the live thg-fulfill service and normalizes hero fields", () => {
    const dto = fullServicesResponseSchema.parse(servicesDto());
    const content = fulfillContentFromDto(dto);

    expect(content.present).toBe(true);
    expect(content.serviceLabel).toBe("THG Fulfill");
    expect(content.heroSubtitle).toBe("POD printing in Vietnam, China and USA.");
    // Blank/whitespace-only bullets are dropped; kept ones are trimmed.
    expect(content.points).toEqual(["VN/CN/US POD", "Item-level QC"]);
    expect(content.catalog).toEqual([]);
  });

  it("falls back to tagline when hero_sub is absent", () => {
    const dto = fullServicesResponseSchema.parse(servicesDto({ hero_sub: null }));
    expect(fulfillContentFromDto(dto).heroSubtitle).toBe("Fulfill Ecosystem A-Z");
  });

  it("returns the empty fallback when the fulfill service is missing", () => {
    const dto = fullServicesResponseSchema.parse({
      locale: "en",
      services: [
        {
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
        },
      ],
    });
    const content = fulfillContentFromDto(dto);
    expect(content.present).toBe(false);
    expect(content.serviceLabel).toBe("");
    expect(content.catalog).toEqual([]);
  });

  it("ignores the fulfill service when it is not live", () => {
    const dto = fullServicesResponseSchema.parse(servicesDto({ status: "draft" }));
    expect(fulfillContentFromDto(dto).present).toBe(false);
  });

  it("maps products to catalog items, dropping nameless ones and joining price/time/origin", () => {
    const dto = fullServicesResponseSchema.parse(
      servicesDto({
        products: [
          { name: "  Premium Tee  ", price: "$3.20", time: "48h", origin: "VN", image: "https://cdn/x.png" },
          { name: "", price: "$1.00" },
          { name: "Mug", origin: "US" },
        ],
      }),
    );
    const { catalog } = fulfillContentFromDto(dto);
    expect(catalog).toEqual([
      // origin is surfaced in the operational note (previously validated but dropped).
      // R3: price/leadTime/origin are also surfaced individually for the product card; `note`
      // keeps the collapsed one-line form for consumers that still use it.
      {
        name: "Premium Tee",
        image: "https://cdn/x.png",
        note: "$3.20 · 48h · VN",
        price: "$3.20",
        leadTime: "48h",
        origin: "VN",
        // "" until the CMS publishes `product_id` — the section then resolves its own featured
        // Hub ids instead of deep-linking to nothing.
        productId: "",
      },
      { name: "Mug", image: "", note: "US", price: "", leadTime: "", origin: "US", productId: "" },
    ]);
  });

  it("rejects a malformed services payload", () => {
    expect(() =>
      fullServicesResponseSchema.parse({ locale: "en", services: [{ id: "thg-fulfill" }] }),
    ).toThrow();
  });
});

describe("fulfill faqs", () => {
  it("accepts scope 'fulfill' and sorts by position", () => {
    const dto = fulfillFaqsResponseSchema.parse({
      locale: "en",
      scope: "fulfill",
      faqs: [
        { id: 2, position: 2, question: "B?", answer: "b" },
        { id: 1, position: 1, question: "A?", answer: "a" },
      ],
    });
    expect(fulfillFaqsFromDto(dto).map((f) => f.id)).toEqual([1, 2]);
  });

  it("rejects a mismatched scope (contract violation must not reach the route)", () => {
    expect(() =>
      fulfillFaqsResponseSchema.parse({ locale: "en", scope: "home", faqs: [] }),
    ).toThrow();
  });
});
