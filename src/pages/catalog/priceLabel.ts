/* Cài đặt từng sản phẩm do người vận hành đặt trên CMS (Sales › Catalog):
   link template design và cờ "giá đã gồm cước". Sản phẩm không có dòng nào
   trên CMS giữ mặc định: template lấy từ Hub, giá ghi chưa gồm cước. */
import type { CmsCatalogOverride } from "@/lib/cmsSchemas";

export interface CatalogExtras {
  templateUrl: string | null;
  priceIncludesShipping: boolean;
}

export function resolveCatalogExtras(
  productId: string,
  hubTemplateUrl: string | null | undefined,
  overrides: readonly CmsCatalogOverride[] | undefined,
): CatalogExtras {
  const o = overrides?.find((x) => x.product_id === productId);
  return {
    // Link trên CMS thắng link Hub; CMS để trống thì vẫn dùng link Hub.
    templateUrl: o?.template_url?.trim() || hubTemplateUrl?.trim() || null,
    priceIncludesShipping: o?.price_includes_shipping ?? false,
  };
}

export function sellingPriceLabel(includesShipping: boolean): string {
  return includesShipping
    ? "Selling price (including shipping cost)"
    : "Selling price (not including shipping cost)";
}
