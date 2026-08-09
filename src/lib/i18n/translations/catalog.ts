// catalog translation keys (prefixes: catalog, catalog_page).
// Values are moved verbatim from the original src/lib/i18n.tsx dictionary.

import { tr } from "../helpers";
import type { TranslationDict } from "../types";

export const catalogTranslations: TranslationDict = {
  "catalog_page.title": tr("Product Catalog", "Catalog Mẫu Sản Phẩm", "产品目录"),
  "catalog_page.subtitle": tr("Explore our comprehensive range of high-quality products ready for customization and global shipping.", "Khám phá danh mục các sản phẩm chất lượng cao sẵn sàng cho in ấn (POD) và vận chuyển toàn cầu.", "探索我们为定制和全球运输准备的全系列高质量产品。"),
  // VI reads "All category", not "Tất cả": the category names beside it come
  // from the Hub taxonomy and are English-only ("Phone Cases", "Apparel"), so a
  // Vietnamese label sat alone among them and operations asked for it to match.
  // EN/ZH keep their own wording — the clash only exists on the VI rail.
  "catalog_page.filter_all": tr("All Products", "All category", "所有产品"),
  "catalog.pod_badge": tr("POD Products", "Sản phẩm POD", "POD产品"),
  "catalog.search_placeholder": tr("Search by name or SKU...", "Tìm theo tên hoặc SKU...", "按名称或SKU搜索..."),
  "catalog.products_count": tr("products", "sản phẩm", "个产品"),
  "catalog.product_count": tr("product", "sản phẩm", "个产品"),
  "catalog.origin_label": tr("Origin", "Xuất xứ", "产地"),
  "catalog.tags_label": tr("Tags / Campaign", "Thẻ / Chiến dịch", "标签 / 活动"),
  "catalog.origin_vn": tr("Vietnam", "Việt Nam", "越南"),
  "catalog.origin_us": tr("USA", "Mỹ", "美国"),
  "catalog.origin_cn": tr("China", "Trung Quốc", "中国"),
  "catalog.contact_price": tr("Contact for pricing", "Liên hệ báo giá", "联系报价"),
  "catalog.size_label": tr("Size:", "Kích cỡ:", "尺寸:"),
  // Mobile pill row — same rail, same English category names beside it.
  "catalog.all": tr("All", "All category", "全部"),
  "catalog.contact_quote_hint": tr("Contact us for pricing", "Liên hệ để nhận báo giá", "联系我们获取报价"),
  "catalog.empty_title": tr("No products found", "Không tìm thấy sản phẩm", "未找到产品"),
  "catalog.empty_hint": tr("Try adjusting your search or filter", "Hãy thử điều chỉnh từ khóa hoặc bộ lọc", "请尝试调整搜索或筛选条件"),
};
