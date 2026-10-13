// Catalog API base URL — override per environment via VITE_CATALOG_API_URL
// (set in .env.local / GitHub Actions secret). Falls back to the canonical
// hub origin (formerly dev.thgfulfill.com — DNS retired 2026-05-09).
//
// Uses `||` not `??` because an unset/empty GitHub Actions secret gets
// inlined by Vite as the empty string `""`. `?? fallback` short-circuits only
// on null/undefined, so an empty string would fall through and break the
// fetch URL. `|| fallback` covers empty + null + undefined.
const API_BASE = import.meta.env.VITE_CATALOG_API_URL || "https://hub.thgfulfill.com/api/public/catalog";

export interface CatalogProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  status: string;
  origin: string | null;
  sizes: string[];
  colors: string[];
  images: string[];
  videos?: string[]; // THG-CAT-006: link YouTube/Shorts giới thiệu (slot #1 slider)
  description: {
    material?: string[];
    features?: string[];
    care?: string[];
    prodTime?: string;
    shipTime?: string;
    subcategory?: string;
    moq?: number;
  } | null;
  templateUrl: string | null;
  priceFrom: number | null;
  priceTo: number | null;
  currency: string;
  thgSku: string | null;
  collections?: CatalogCollection[];
  createdAt: string;
  updatedAt: string;
  variants?: {
    id?: string;
    variant: string;
    series?: string | null;
    color?: string;
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
    priceSbtt?: number;
    priceSbsl?: number;
    thgSku?: string;
    supplierSku?: string;
    supplierOrigin?: string | null; // Ops 2026-07-25: xuất xứ riêng của biến thể (SP nhiều NCC)
  }[];
}

export interface CatalogCollection {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
  count?: number;
}

export interface CatalogResponse {
  data: CatalogProduct[];
  pagination: { page: number; limit: number; total: number; pages: number };
  categoryCounts: Record<string, number>;
  originCounts: Record<string, number>;
  collections?: CatalogCollection[];
  // THG-CAT: taxonomy động từ hub (product_categories, order theo sortOrder) —
  // sidebar/pill render theo list này thay vì mảng CATEGORIES hardcode.
  categories?: { name: string; slug: string }[];
}

export interface CatalogParams {
  page?: number;
  limit?: number;
  category?: string;
  origin?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  collection?: string[];
}

export async function fetchCatalog(params: CatalogParams = {}): Promise<CatalogResponse> {
  const sp = new URLSearchParams();
  if (params.page) sp.set("page", String(params.page));
  if (params.limit) sp.set("limit", String(params.limit));
  if (params.category) sp.set("category", params.category);
  if (params.origin) sp.set("origin", params.origin);
  if (params.search) sp.set("search", params.search);
  if (params.sortBy) sp.set("sortBy", params.sortBy);
  if (params.sortOrder) sp.set("sortOrder", params.sortOrder);
  if (params.collection && params.collection.length) sp.set("collection", params.collection.join(","));

  const res = await fetch(`${API_BASE}?${sp.toString()}`);
  if (!res.ok) throw new Error(`Catalog API error: ${res.status}`);
  return res.json();
}

export async function fetchProduct(id: string): Promise<CatalogProduct> {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error(`Product API error: ${res.status}`);
  return res.json();
}

const ORIGIN_SCAN_PAGE_LIMIT = 100;
const ORIGIN_SCAN_MAX_PAGES = 20;

/** Origin counts within a filtered scope (collection / category / search).
 *
 *  The Hub's `originCounts` always covers the WHOLE catalog, whatever filters
 *  the request carries — so inside "Christmas" the rail offered France (9),
 *  Germany (18)… and every one of them filtered down to zero products. This
 *  scans the scoped product list (no origin filter) and counts origins itself.
 *  Products without an origin are counted under "Unknown", as the Hub does.
 *  Throws when the scope is larger than the scan budget, so the caller can
 *  fall back instead of showing partial counts. */
export async function fetchOriginCounts(
  params: Pick<CatalogParams, "category" | "search" | "collection">,
): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (let page = 1; page <= ORIGIN_SCAN_MAX_PAGES; page++) {
    const res = await fetchCatalog({ ...params, page, limit: ORIGIN_SCAN_PAGE_LIMIT });
    for (const p of res.data) {
      const key = p.origin && p.origin.trim() ? p.origin : "Unknown";
      counts[key] = (counts[key] || 0) + 1;
    }
    if (page >= (res.pagination.pages || 1) || res.data.length === 0) return counts;
  }
  throw new Error("Origin scan exceeded its page budget");
}

/** Catalog page for a country the Hub stores under several codes (GB + UK).
 *
 *  The Hub filters on one `origin` value, so asking for "GB" alone silently
 *  drops the products filed under "UK". With more than one code, fetch every
 *  matching product per code, merge them (deduped by id, code order kept) and
 *  paginate here. A single code is a plain pass-through to fetchCatalog. */
export async function fetchCatalogForOrigins(
  params: Omit<CatalogParams, "origin">,
  origins: string[],
): Promise<CatalogResponse> {
  if (origins.length <= 1) return fetchCatalog({ ...params, origin: origins[0] || undefined });

  let meta: CatalogResponse | null = null;
  const seen = new Set<string>();
  const merged: CatalogProduct[] = [];
  for (const origin of origins) {
    for (let page = 1; ; page++) {
      if (page > ORIGIN_SCAN_MAX_PAGES) throw new Error("Origin merge exceeded its page budget");
      const res = await fetchCatalog({ ...params, origin, page, limit: ORIGIN_SCAN_PAGE_LIMIT });
      meta ??= res;
      for (const p of res.data) {
        if (seen.has(p.id)) continue;
        seen.add(p.id);
        merged.push(p);
      }
      if (page >= (res.pagination.pages || 1) || res.data.length === 0) break;
    }
  }

  const limit = params.limit || 20;
  const page = params.page || 1;
  return {
    ...(meta as CatalogResponse),
    data: merged.slice((page - 1) * limit, page * limit),
    pagination: { page, limit, total: merged.length, pages: Math.ceil(merged.length / limit) },
  };
}
