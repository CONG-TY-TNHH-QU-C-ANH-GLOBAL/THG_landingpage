import { localize, tr, type LocalizedText } from "@/shared/i18n";
import type { Locale } from "@/shared/i18n";

// Feature-local catalog copy, authored ONCE with LocalizedText leaves and resolved per request.
// Sourced from the Vite dictionary [src/lib/i18n/translations/catalog.ts] where a key already
// existed; new keys follow its voice. Deliberately NOT three sibling locale objects — that
// shape is what put the fulfill copy module over the duplication gate.

const SOURCE = {
  title: tr("Catalog mẫu sản phẩm", "Product catalog", "产品目录"),
  subtitle: tr(
    "Khám phá danh mục sản phẩm chất lượng cao sẵn sàng cho in ấn (POD) và vận chuyển toàn cầu.",
    "Explore our range of high-quality products ready for print-on-demand and global shipping.",
    "探索我们为定制和全球运输准备的全系列高质量产品。",
  ),
  eyebrow: tr("Sản phẩm POD", "POD products", "POD产品"),

  searchLabel: tr("Tìm sản phẩm", "Search products", "搜索产品"),
  searchPlaceholder: tr("Tìm theo tên hoặc SKU...", "Search by name or SKU...", "按名称或SKU搜索..."),
  searchSubmit: tr("Tìm", "Search", "搜索"),
  categoryLabel: tr("Danh mục", "Category", "类别"),
  originLabel: tr("Xuất xứ", "Origin", "产地"),
  filterAll: tr("Tất cả", "All products", "所有产品"),
  clearFilters: tr("Xoá bộ lọc", "Clear filters", "清除筛选"),

  resultsCount: tr("sản phẩm", "products", "个产品"),
  emptyTitle: tr("Không tìm thấy sản phẩm", "No products found", "未找到产品"),
  emptyHint: tr(
    "Hãy thử điều chỉnh từ khoá hoặc bộ lọc",
    "Try adjusting your search or filter",
    "请尝试调整搜索或筛选条件",
  ),
  degraded: tr(
    "Không tải được danh mục từ hệ thống. Vui lòng thử lại sau ít phút.",
    "The catalog could not be loaded right now. Please try again in a few minutes.",
    "目前无法加载目录。请稍后再试。",
  ),

  prevPage: tr("Trang trước", "Previous", "上一页"),
  nextPage: tr("Trang sau", "Next", "下一页"),
  pageStatus: tr("Trang", "Page", "第"),
  pageOf: tr("trên", "of", "页，共"),

  viewSpecs: tr("Xem thông số & giá", "View specifications", "查看规格与价格"),
  basecostLabel: tr("Base cost", "Base cost", "基础成本"),
  contactPrice: tr("Liên hệ báo giá", "Contact for pricing", "联系报价"),
  prodTimeLabel: tr("Sản xuất", "Production", "生产"),
  shipTimeLabel: tr("Vận chuyển", "Shipping", "运输"),
  businessDays: tr("ngày làm việc", "business days", "个工作日"),
  skuLabel: tr("SKU THG", "THG SKU", "THG SKU"),
  supplierSkuLabel: tr("SKU nhà cung cấp", "Supplier SKU", "供应商SKU"),
  sizeLabel: tr("Kích cỡ", "Sizes", "尺寸"),
  colorLabel: tr("Màu", "Colors", "颜色"),
  materialLabel: tr("Chất liệu", "Material", "材质"),
  featuresLabel: tr("Đặc điểm", "Features", "特点"),
  careLabel: tr("Bảo quản", "Care", "保养"),
  variantsLabel: tr("Phiên bản", "Variants", "版本"),
  notPublished: tr("Chưa công bố", "Not published", "未公布"),

  detailBack: tr("Quay lại danh mục", "Back to catalog", "返回目录"),
  detailNotFound: tr(
    "Không tìm thấy sản phẩm này. Sản phẩm có thể đã ngừng cung cấp.",
    "This product could not be found. It may no longer be offered.",
    "找不到该产品。该产品可能已停止供应。",
  ),
  consultCta: tr("Yêu cầu tư vấn sản phẩm này", "Request a consultation", "咨询此产品"),
} as const satisfies Record<string, LocalizedText>;

export type CatalogCopy = Readonly<Record<keyof typeof SOURCE, string>>;

/** Resolve the whole catalog copy tree for one locale. */
export function getCatalogCopy(lang: Locale): CatalogCopy {
  const out = {} as Record<keyof typeof SOURCE, string>;
  for (const key of Object.keys(SOURCE) as (keyof typeof SOURCE)[]) {
    out[key] = localize(lang, SOURCE[key]);
  }
  return out;
}
