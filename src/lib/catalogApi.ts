// Canonical hub URL (was dev.thgfulfill.com — domain rename
// 2026-05-09). Cloudflare DNS for the dev hostname is being retired
// so the public catalog page must point at the new origin.
const API_BASE = "https://hub.thgfulfill.com/api/public/catalog";

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
  }[];
}

export interface CatalogResponse {
  data: CatalogProduct[];
  pagination: { page: number; limit: number; total: number; pages: number };
  categoryCounts: Record<string, number>;
  originCounts: Record<string, number>;
}

export interface CatalogParams {
  page?: number;
  limit?: number;
  category?: string;
  origin?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
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

  const res = await fetch(`${API_BASE}?${sp.toString()}`);
  if (!res.ok) throw new Error(`Catalog API error: ${res.status}`);
  return res.json();
}

export async function fetchProduct(id: string): Promise<CatalogProduct> {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error(`Product API error: ${res.status}`);
  return res.json();
}
