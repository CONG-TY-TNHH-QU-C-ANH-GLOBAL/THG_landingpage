import { describe, expect, it } from "vitest";
import { priceIncludesShipping, sellingPriceLabel } from "./priceLabel";

describe("sellingPriceLabel", () => {
  it("Hoodie Washed (THG-018) ghi giá đã gồm cước, mọi size", () => {
    expect(sellingPriceLabel("THG-018-HDWSHED-L")).toBe("Selling price (including shipping cost)");
    expect(sellingPriceLabel("thg-018-hdwshed-s")).toBe("Selling price (including shipping cost)");
  });

  it("sản phẩm khác giữ nhãn mặc định: chưa gồm cước", () => {
    expect(sellingPriceLabel("THG-0180-X-L")).toBe("Selling price (not including shipping cost)");
    expect(sellingPriceLabel("THG-017-ABC")).toBe("Selling price (not including shipping cost)");
    expect(sellingPriceLabel(undefined)).toBe("Selling price (not including shipping cost)");
    expect(priceIncludesShipping("")).toBe(false);
  });
});
