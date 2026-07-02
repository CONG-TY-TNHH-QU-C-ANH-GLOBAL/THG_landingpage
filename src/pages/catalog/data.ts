// Static lookup tables for the catalog page. Living here (not inline in
// CatalogPage.tsx) keeps the page component focused on state + render logic
// — these tables are pure data and only change when product editorial copy
// or category taxonomy changes.

import { Car, Coffee, Crown, Frame, Gem, Home, Package, Phone, Shirt, PawPrint, Snowflake, GraduationCap, Sticker, Zap } from "lucide-react";

export interface CategoryDescription {
  material: string[];
  features: string[];
  care: string[];
  /** Production lead time in business days, e.g. "3 - 5". */
  prodTime: string;
  /** Shipping ETA in business days. */
  shipTime: string;
}

/** Editorial copy per category — the catalog API has no description fields
 *  so we synthesize defaults here. Operator-editable replacement lives on
 *  the Sprint 6 roadmap. */
export const categoryMeta: Record<string, CategoryDescription> = {
  Apparel: {
    material: ["Bird-Eye Pique (Polyester Blend)", "Lightweight, breathable", "Moisture-wicking", "Soft, flexible, easy to move"],
    features: ["Full button front: classic baseball design", "Customizable: add name, number or logo", "Great for sports events, team uniforms, group outings or streetwear", "Easy to mix with jeans, leggings or shorts", "Bulk discount available for large orders"],
    care: ["Machine wash inside out, cold water, same colors", "Gentle cycle", "Non-chlorine bleach only when needed", "Tumble dry low", "Cool iron if needed"],
    prodTime: "3 - 5",
    shipTime: "8 - 12",
  },
  "Phone Cases": {
    material: ["Premium TPU / Polycarbonate", "Shockproof protection", "Slim profile, lightweight", "Precise cutouts for ports & buttons"],
    features: ["All-over print with vivid colors", "Scratch-resistant surface", "Wireless charging compatible", "Supports most phone models"],
    care: ["Wipe clean with damp cloth", "Avoid prolonged sun exposure"],
    prodTime: "1 - 2",
    shipTime: "5 - 8",
  },
  Drinkware: {
    material: ["Stainless steel / Ceramic", "BPA-free, food-safe", "Double-wall insulation (tumblers)", "Durable sublimation print"],
    features: ["Keeps drinks hot/cold for hours", "Dishwasher safe (top rack)", "Full wrap-around printing", "Perfect for gifts & merchandise"],
    care: ["Hand wash recommended for printed items", "Do not microwave (metal items)", "Avoid abrasive cleaners"],
    prodTime: "1 - 3",
    shipTime: "5 - 8",
  },
  "Home & Living": {
    material: ["Polyester / Cotton blend", "Soft-touch fabric", "Vibrant dye-sublimation print", "Durable construction"],
    features: ["Full-color edge-to-edge printing", "Machine washable", "Multiple size options", "Perfect for home decor & gifts"],
    care: ["Machine wash cold, gentle cycle", "Tumble dry low", "Do not bleach", "Iron on low heat if needed"],
    prodTime: "2 - 4",
    shipTime: "5 - 10",
  },
  "Wall Art": {
    material: ["Premium canvas / Metal / Acrylic", "High-resolution giclée printing", "UV-resistant inks", "Ready to hang"],
    features: ["Gallery-quality finish", "Vibrant, long-lasting colors", "Multiple size options", "Frameless or framed options available"],
    care: ["Dust with soft, dry cloth", "Avoid direct sunlight for extended periods", "Do not use harsh chemicals"],
    prodTime: "2 - 4",
    shipTime: "5 - 10",
  },
  Jewelry: {
    material: ["Stainless steel / Zinc alloy", "Tarnish-resistant finish", "Hypoallergenic", "Lightweight & comfortable"],
    features: ["Custom engraving available", "High-detail photo printing", "Gift-ready packaging", "Multiple finish options"],
    care: ["Store in dry place", "Avoid contact with water & chemicals", "Polish with soft cloth"],
    prodTime: "2 - 4",
    shipTime: "5 - 10",
  },
  "Cap & Hat": {
    material: ["Cotton twill / Polyester", "Structured front panel", "Adjustable strap closure", "Breathable eyelets"],
    features: ["Embroidery or print customization", "One size fits most", "Available in multiple colors", "Pre-curved visor"],
    care: ["Spot clean recommended", "Hand wash with mild detergent", "Air dry — do not machine dry", "Do not iron on decoration"],
    prodTime: "2 - 3",
    shipTime: "5 - 8",
  },
  "Car Accessories": {
    material: ["Durable aluminum / Polyester", "Weather-resistant", "UV-protected print", "Rust-proof"],
    features: ["Easy installation", "Custom full-color printing", "Fits standard sizes", "Great for personalization & gifts"],
    care: ["Wipe clean with damp cloth", "Avoid abrasive cleaners"],
    prodTime: "2 - 3",
    shipTime: "5 - 8",
  },
  Accessories: {
    material: ["Mixed materials (product-specific)", "Durable construction", "High-quality print finish"],
    features: ["Full-color custom printing", "Multiple size/style options", "Great for gifts & merchandise"],
    care: ["Follow product-specific care instructions", "Store in cool, dry place"],
    prodTime: "2 - 4",
    shipTime: "5 - 10",
  },
};

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
