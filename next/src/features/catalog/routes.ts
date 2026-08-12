import type { Locale } from "@/shared/i18n";

// Every catalog URL in the app is built here. No component composes a catalog path from string
// literals — that is what let a landing card ship a hand-written `?productId=<made-up id>`.
// One builder also means the query vocabulary (`productId`, `q`, `category`, `origin`, `page`)
// has exactly one definition to change.

export const CATALOG_ROUTE = "/catalog";

export interface CatalogQuery {
  q?: string;
  category?: string;
  origin?: string;
  page?: number;
  productId?: string;
}

/** Localized catalog URL. Empty/default values are omitted so a cleared filter produces a clean
 *  canonical URL rather than `?q=&category=&page=1`. */
export function catalogHref(lang: Locale, query: CatalogQuery = {}): string {
  const sp = new URLSearchParams();
  if (query.q) sp.set("q", query.q);
  if (query.category) sp.set("category", query.category);
  if (query.origin) sp.set("origin", query.origin);
  if (query.page && query.page > 1) sp.set("page", String(query.page));
  if (query.productId) sp.set("productId", query.productId);
  const qs = sp.toString();
  return `/${lang}${CATALOG_ROUTE}${qs ? `?${qs}` : ""}`;
}

/** Deep link to one product's specification. The single source for product links across the
 *  landing — the Fulfill capability grid uses this, so a featured product and a browsed
 *  product resolve to the same URL. */
export function productHref(lang: Locale, productId: string): string {
  return catalogHref(lang, { productId });
}
