// Static lookup tables for the catalog page. Living here (not inline in
// CatalogPage.tsx) keeps the page component focused on state + render logic
// — these tables are pure data and only change when product editorial copy
// or category taxonomy changes.

import { Car, Coffee, Crown, Frame, Gem, Home, Package, Phone, Shirt, PawPrint, Snowflake, GraduationCap, Sticker, Zap } from "lucide-react";

/* THG-CAT-006 (2026-07-30): bảng `categoryMeta` (chữ cứng material/features/care/
   prodTime/shipTime theo danh mục) ĐÃ BỎ. Chú thích cũ "the catalog API has no
   description fields so we synthesize defaults here" nay đã sai — cột description
   có sẵn cả 5 ô và API trả về nguyên vẹn.
   Nội dung cũ đã được backfill vào DB (scripts/backfill-product-description.sql
   ở repo Hub, chạy prod 2026-07-30, UPDATE 470) nên trang này không đổi một chữ,
   nhưng từ nay ops sửa được ở Hub. Lý do phải bỏ: áo thun 100% cotton bị tả là
   "Bird-Eye Pique (Polyester Blend)" — mô tả áo polo thể thao. */

/* THG-CAT-005: originFlags (hardcode 3 nước) đã bỏ — thay bằng resolver động
   @/lib/country-flags (countryFlag/countryName) auto theo ISO cho mọi nước. */

/** Lucide icon component to render next to each category label in the filter
 *  chips. Missing entries fall back to a generic Package icon at the call site. */
export const categoryIcons: Record<string, typeof Shirt> = {
  Apparel: Shirt,
  "Phone Cases": Phone,
  Drinkware: Coffee,
  "Home & Living": Home,
  Jewelry: Gem,
  "Car Accessories": Car,
  "Wall Art": Frame,
  Accessories: Package,
  "Cap & Hat": Crown,
  "Pet Supplies": PawPrint,
  Seasonal: Snowflake,
  "Back to School": GraduationCap,
  Sticker: Sticker,
  Decal: Sticker,
  "Drop - Fashion": Shirt,
  "Drop - Electronics": Zap,
  "Drop - Home": Home,
};

/** THG-CAT: fallback order khi hub API chưa trả `categories`. Nguồn chính là
 *  res.categories (product_categories, order theo sortOrder). */
export const CATEGORIES = [
  "Apparel",
  "Phone Cases",
  "Cap & Hat",
  "Drinkware",
  "Home & Living",
  "Jewelry",
  "Car Accessories",
  "Wall Art",
  "Accessories",
];

/** Sentinel key for variants without a `series` value — bucketed into an
 *  "Other" tab alongside real series groups. Chosen so it never collides
 *  with an operator-entered free-text series label. */
export const NO_SERIES_KEY = "__no_series__";
