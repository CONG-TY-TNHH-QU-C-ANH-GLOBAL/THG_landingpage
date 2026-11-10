import { describe, expect, it } from "vitest";
import { resolveCatalogExtras, sellingPriceLabel } from "./priceLabel";

const overrides = [
  { product_id: "cmvaoi0av0a4201sciqgwlhpa", template_url: "https://drive.google.com/nb", price_includes_shipping: true },
  { product_id: "cmvj0lyc401v801obxylh5mfo", template_url: null, price_includes_shipping: true },
  { product_id: "cmother000000000000000000", template_url: "  ", price_includes_shipping: false },
];

describe("resolveCatalogExtras", () => {
  it("sản phẩm có cài đặt CMS: dùng link template và cờ đã gồm cước", () => {
    expect(resolveCatalogExtras("cmvaoi0av0a4201sciqgwlhpa", "https://hub/tpl", overrides)).toEqual({
      templateUrl: "https://drive.google.com/nb",
      priceIncludesShipping: true,
    });
  });

  it("CMS không có link thì giữ link Hub", () => {
    expect(resolveCatalogExtras("cmvj0lyc401v801obxylh5mfo", "https://hub/tpl", overrides).templateUrl).toBe("https://hub/tpl");
    expect(resolveCatalogExtras("cmother000000000000000000", "https://hub/tpl", overrides).templateUrl).toBe("https://hub/tpl");
  });

  it("sản phẩm không có cài đặt, hoặc CMS chưa tải được: giữ mặc định", () => {
    expect(resolveCatalogExtras("cmunknown", null, overrides)).toEqual({ templateUrl: null, priceIncludesShipping: false });
    expect(resolveCatalogExtras("cmvaoi0av0a4201sciqgwlhpa", null, undefined)).toEqual({ templateUrl: null, priceIncludesShipping: false });
  });
});

describe("sellingPriceLabel", () => {
  it("ghi đúng theo cờ", () => {
    expect(sellingPriceLabel(true)).toBe("Selling price (including shipping cost)");
    expect(sellingPriceLabel(false)).toBe("Selling price (not including shipping cost)");
  });
});
