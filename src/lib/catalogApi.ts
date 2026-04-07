const API_BASE = "https://dev.thgfulfill.com/api/public/catalog";

export interface CatalogVariant {
  id: string;
  variant: string | null;
  color: string | null;
  supplierSku: string;
  thgSku: string | null;
  priceSbsl: number | null;
  priceSbtt: number | null;
  weight: number | null;
  length: number | null;
  width: number | null;
  height: number | null;
}

export interface CatalogProduct {
  id: string;
  name: string;
  sku: string;
  thgSku: string | null;
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
    fulfillment?: string;
    prodTime?: string;
    shipTime?: string;
    subcategory?: string;
    shipPrices?: { toCustomer?: string; toUSPS?: string };
  } | null;
  templateUrl: string | null;
  priceFrom: number | null;
  priceTo: number | null;
  currency: string;
  variants?: CatalogVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface CatalogResponse {
  data: CatalogProduct[];
  pagination: { page: number; limit: number; total: number; pages: number };
  categoryCounts: Record<string, number>;
  originCounts: Record<string, number>;
}

export function formatPrice(product: { priceFrom: number | null; priceTo: number | null }): string {
  if (product.priceFrom == null) return "Liên hệ báo giá";
  if (product.priceTo == null || product.priceTo === product.priceFrom) {
    return `From $${product.priceFrom.toFixed(2)}`;
  }
  return `$${product.priceFrom.toFixed(2)} – $${product.priceTo.toFixed(2)}`;
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
