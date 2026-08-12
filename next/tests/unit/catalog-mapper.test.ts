import { describe, it, expect } from "vitest";

import { catalogPageFromDto, catalogProductFromDto, formatPriceRange } from "@/features/catalog/mappers/product";
import { catalogHref, productHref } from "@/features/catalog/routes";
import type { HubCatalogProduct, HubCatalogResponse } from "@/integrations/hub/catalog";

// The Hub catalog boundary: money formatting, null-collapsing and URL building. These are the
// three places a wrong answer is silently plausible — a price that reads "$0.00" instead of
// "contact us", an `origin: null` printed as "null", or a deep link that 404s.

function hubProduct(over: Partial<HubCatalogProduct> = {}): HubCatalogProduct {
  return {
    id: "p1",
    name: "15oz Mug",
    sku: "S5W3JS",
    category: "Drinkware",
    status: "Active",
    origin: "CA",
    sizes: [],
    colors: [],
    images: ["https://cdn.thgfulfill.com/catalog/a_01.png", "https://cdn.thgfulfill.com/catalog/a_02.png"],
    videos: [],
    description: null,
    templateUrl: null,
    priceFrom: null,
    priceTo: null,
    currency: "USD",
    thgSku: null,
    collections: [],
    variants: [],
    createdAt: "",
    updatedAt: "",
    ...over,
  };
}

describe("formatPriceRange", () => {
  it("returns '' when the Hub publishes no price — the UI shows 'contact for pricing', never $0", () => {
    expect(formatPriceRange(null, null, "USD")).toBe("");
  });

  it("renders a single price when both ends are equal, and a range when they differ", () => {
    expect(formatPriceRange(6, 6, "USD")).toBe("$6.00");
    expect(formatPriceRange(6, 10.6, "USD")).toBe("$6.00 – $10.60");
  });

  it("uses the published end when only one is set", () => {
    expect(formatPriceRange(null, 4.5, "USD")).toBe("$4.50");
    expect(formatPriceRange(4.5, null, "USD")).toBe("$4.50");
  });

  it("survives a currency code Intl rejects instead of failing the whole page render", () => {
    expect(formatPriceRange(6, null, "NOT-A-CURRENCY")).toBe("6.00 NOT-A-CURRENCY");
  });
});

describe("catalogProductFromDto", () => {
  it("collapses every nullable Hub field to '' so components never branch on null", () => {
    const p = catalogProductFromDto(hubProduct({ origin: null, thgSku: null, description: null }));
    expect(p.origin).toBe("");
    expect(p.thgSku).toBe("");
    expect(p.prodTime).toBe("");
    expect(p.material).toEqual([]);
    expect(p.price).toBe("");
  });

  it("promotes the first image to `image` and keeps the gallery", () => {
    const p = catalogProductFromDto(hubProduct());
    expect(p.image).toBe("https://cdn.thgfulfill.com/catalog/a_01.png");
    expect(p.images).toHaveLength(2);
  });

  it("leaves an imageless product with '' rather than undefined", () => {
    expect(catalogProductFromDto(hubProduct({ images: [] })).image).toBe("");
  });

  it("carries the spec block through when the Hub supplies one", () => {
    const p = catalogProductFromDto(
      hubProduct({
        description: { prodTime: "3 - 5", shipTime: "8 - 12", material: ["Ceramic"], features: [], care: [] },
        priceFrom: 6,
        priceTo: 10.6,
      }),
    );
    expect(p.prodTime).toBe("3 - 5");
    expect(p.material).toEqual(["Ceramic"]);
    expect(p.price).toBe("$6.00 – $10.60");
  });

  it("falls back to the variant label when the Hub omits a variant id, so React keys stay stable", () => {
    const p = catalogProductFromDto(
      hubProduct({ variants: [{ variant: "Black / L", priceSbtt: 7 }] }),
    );
    expect(p.variants[0].id).toBe("Black / L");
    expect(p.variants[0].priceLabel).toBe("$7.00");
    expect(p.variants[0].priceMerchant).toBe(""); // unpublished, not "$0.00"
  });
});

describe("catalogPageFromDto", () => {
  it("marks a successful read as not degraded and carries pagination", () => {
    const dto: HubCatalogResponse = {
      data: [hubProduct()],
      pagination: { page: 2, limit: 24, total: 427, pages: 18 },
      categoryCounts: { Drinkware: 17 },
      originCounts: { CA: 41 },
      collections: [],
      categories: [{ name: "Drinkware", slug: "drinkware" }],
    };
    const page = catalogPageFromDto(dto);
    expect(page.degraded).toBe(false);
    expect(page.page).toBe(2);
    expect(page.pages).toBe(18);
    expect(page.total).toBe(427);
    expect(page.products).toHaveLength(1);
    expect(page.categories).toEqual([{ name: "Drinkware", slug: "drinkware" }]);
  });
});

describe("catalog routes", () => {
  it("omits empty filters and page 1 so a cleared view has a clean canonical URL", () => {
    expect(catalogHref("vi")).toBe("/vi/catalog");
    expect(catalogHref("vi", { q: "", category: "", page: 1 })).toBe("/vi/catalog");
  });

  it("builds the localized product deep link the Fulfill cards use", () => {
    expect(productHref("vi", "cmqv14yj601su01mmvr3whrk8")).toBe(
      "/vi/catalog?productId=cmqv14yj601su01mmvr3whrk8",
    );
    expect(productHref("en", "abc")).toBe("/en/catalog?productId=abc");
  });

  it("encodes filter values rather than emitting a broken query string", () => {
    expect(catalogHref("en", { q: "a&b=c", category: "Home & Living", page: 3 })).toBe(
      "/en/catalog?q=a%26b%3Dc&category=Home+%26+Living&page=3",
    );
  });
});
