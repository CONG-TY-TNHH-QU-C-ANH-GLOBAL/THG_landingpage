/* Cài đặt sản phẩm do người vận hành đặt trên CMS (Sales › Catalog):
   link template design và cờ "giá đã gồm cước".
   - Cờ "giá đã gồm cước" có một mặc định chung cho cả catalog
     (`price_includes_shipping_default`); sản phẩm có dòng riêng trên CMS thì
     theo dòng đó (CMS đã tính sẵn giá trị cuối cùng).
   - CMS chưa tải được, hoặc CMS cũ chưa có mặc định chung: giá ghi chưa gồm
     cước, như trước đây. */
import type { CmsCatalogOverridesResponse } from "@/lib/cmsSchemas";

export interface CatalogExtras {
  templateUrl: string | null;
  priceIncludesShipping: boolean;
}

export function resolveCatalogExtras(
  productId: string,
  hubTemplateUrl: string | null | undefined,
  catalog: CmsCatalogOverridesResponse | undefined,
): CatalogExtras {
  const o = catalog?.overrides.find((x) => x.product_id === productId);
  return {
    // Link trên CMS thắng link Hub; CMS để trống thì vẫn dùng link Hub.
    templateUrl: o?.template_url?.trim() || hubTemplateUrl?.trim() || null,
    priceIncludesShipping:
      o?.price_includes_shipping ?? catalog?.price_includes_shipping_default ?? false,
  };
}

export function sellingPriceLabel(includesShipping: boolean): string {
  return includesShipping
    ? "Selling price (including shipping cost)"
    : "Selling price (not including shipping cost)";
}
