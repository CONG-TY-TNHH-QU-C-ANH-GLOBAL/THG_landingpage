import type { HubCatalogProduct, HubCatalogResponse } from "@/integrations/hub/catalog";

import type { CatalogPage, CatalogProduct, CatalogVariant } from "../models/product";

// Pure DTO → model. No I/O, no locale: the mapper decides SHAPE, the UI decides LANGUAGE.
// Money is the one thing formatted here, because currency formatting is a property of the
// price data (its currency code), not of the surface rendering it.

/** One price, or a range when the Hub publishes both ends and they differ. "" when the product
 *  is quote-only (both null) — the UI shows its "contact for pricing" line instead of "$0". */
export function formatPriceRange(
  from: number | null,
  to: number | null,
  currency: string,
): string {
  const fmt = (n: number) => {
    try {
      return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);
    } catch {
      // An unknown/garbage currency code must not break a whole page render.
      return `${n.toFixed(2)} ${currency}`;
    }
  };
  if (from === null && to === null) return "";
  if (from === null) return fmt(to as number);
  if (to === null || to === from) return fmt(from);
  return `${fmt(from)} – ${fmt(to)}`;
}

function toVariant(v: NonNullable<HubCatalogProduct["variants"]>[number], currency: string): CatalogVariant {
  return {
    // Hub variant ids are optional; fall back to the variant label so React keys and the
    // selected-variant lookup stay stable within a product.
    id: v.id ?? v.variant,
    variant: v.variant,
    series: v.series ?? "",
    color: v.color ?? "",
    priceLabel: v.priceSbtt === undefined ? "" : formatPriceRange(v.priceSbtt, null, currency),
    priceMerchant: v.priceSbsl === undefined ? "" : formatPriceRange(v.priceSbsl, null, currency),
    thgSku: v.thgSku ?? "",
  };
}

export function catalogProductFromDto(dto: HubCatalogProduct): CatalogProduct {
  const d = dto.description;
  return {
    id: dto.id,
    name: dto.name,
    sku: dto.sku,
    thgSku: dto.thgSku ?? "",
    category: dto.category,
    origin: dto.origin ?? "",
    image: dto.images[0] ?? "",
    images: dto.images,
    videos: dto.videos,
    price: formatPriceRange(dto.priceFrom, dto.priceTo, dto.currency),
    prodTime: d?.prodTime ?? "",
    shipTime: d?.shipTime ?? "",
    material: d?.material ?? [],
    features: d?.features ?? [],
    care: d?.care ?? [],
    sizes: dto.sizes,
    colors: dto.colors,
    collections: dto.collections.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      icon: c.icon ?? "",
    })),
    variants: (dto.variants ?? []).map((v) => toVariant(v, dto.currency)),
  };
}

export function catalogPageFromDto(dto: HubCatalogResponse): CatalogPage {
  return {
    products: dto.data.map(catalogProductFromDto),
    page: dto.pagination.page,
    pages: dto.pagination.pages,
    total: dto.pagination.total,
    categories: dto.categories ?? [],
    categoryCounts: dto.categoryCounts,
    originCounts: dto.originCounts,
    degraded: false,
  };
}
