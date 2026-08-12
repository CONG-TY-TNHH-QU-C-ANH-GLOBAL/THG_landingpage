// Landing-owned catalog view model (WEB-004). The Hub DTO never reaches a component:
// `origin: string | null` becomes `""`, a price pair becomes a formatted range, and a
// nullable `description` block becomes four always-present arrays. Every string is
// presentation-ready — "" means "render nothing", so components branch on emptiness and
// never on null (same rule as the fulfill and home models).

export interface CatalogProduct {
  /** Hub id — the deep-link key: `/{lang}/catalog?productId={id}`. */
  id: string;
  name: string;
  /** Supplier SKU; "" renders nothing. */
  sku: string;
  /** THG's own SKU, the one a seller maps against; "" renders nothing. */
  thgSku: string;
  /** Taxonomy name as the Hub publishes it, e.g. "Apparel". "" renders nothing. */
  category: string;
  /** ISO country code, e.g. "VN". "" when the Hub has no origin for this product. */
  origin: string;
  /** Primary image URL; "" renders the placeholder. Always `images[0]` when present. */
  image: string;
  images: readonly string[];
  videos: readonly string[];
  /** Formatted base cost, e.g. "$6.00 – $10.60" or "$6.00"; "" when unpublished
   *  (the Hub returns null prices for products that are quote-only). */
  price: string;
  /** Production time in business days as published, e.g. "3 - 5". The UNIT is not baked in —
   *  the UI appends the localized label. "" renders nothing. */
  prodTime: string;
  /** Shipping ETA in business days, same convention as prodTime. */
  shipTime: string;
  material: readonly string[];
  features: readonly string[];
  care: readonly string[];
  sizes: readonly string[];
  colors: readonly string[];
  /** Campaign/collection chips, already reduced to what a chip needs. */
  collections: readonly { id: string; name: string; slug: string; icon: string }[];
  variants: readonly CatalogVariant[];
}

export interface CatalogVariant {
  id: string;
  variant: string;
  series: string;
  color: string;
  /** Label-shipping base cost, formatted; "" when unpublished. */
  priceLabel: string;
  /** Merchant-shipping base cost, formatted; "" when unpublished. */
  priceMerchant: string;
  thgSku: string;
}

export interface CatalogPage {
  products: readonly CatalogProduct[];
  page: number;
  pages: number;
  total: number;
  /** Live taxonomy from the Hub; [] hides the category filter rather than showing a stale list. */
  categories: readonly { name: string; slug: string }[];
  /** Product count per category name, for the filter labels. */
  categoryCounts: Readonly<Record<string, number>>;
  /** Product count per origin code, for the origin filter. */
  originCounts: Readonly<Record<string, number>>;
  /** True when the Hub read failed and this is the deterministic empty page. */
  degraded: boolean;
}

export function emptyCatalogPage(): CatalogPage {
  return {
    products: [],
    page: 1,
    pages: 0,
    total: 0,
    categories: [],
    categoryCounts: {},
    originCounts: {},
    degraded: true,
  };
}
