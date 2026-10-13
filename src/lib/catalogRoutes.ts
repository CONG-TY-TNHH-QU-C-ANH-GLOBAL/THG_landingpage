// Catalog collection URLs — /:lang/catalog/:collection.
//
// A campaign tag (Christmas, Halloween, …) is part of the path so operations can
// share a link straight to one campaign. The slug is the Hub's collection slug,
// passed through as-is (URL-encoded) so nothing here depends on its format.

/** Path for the catalog, optionally narrowed to one collection. */
export function catalogPath(lang: string, collection?: string | null): string {
  const base = `/${lang}/catalog`;
  return collection ? `${base}/${encodeURIComponent(collection)}` : base;
}

const CATALOG_COLLECTION = /^(\/[^/]+\/catalog)\/[^/]+\/?$/;

/** Route identity used to decide when a navigation is a "new page".
 *
 *  Switching collections is a filter change inside one page: it must not remount
 *  the catalog (refetch, lost search box) or jump the scroll back to the hero.
 *  Every /:lang/catalog/:collection collapses to /:lang/catalog; all other paths
 *  are returned unchanged. */
export function routeIdentity(pathname: string): string {
  const match = CATALOG_COLLECTION.exec(pathname);
  return match ? match[1] : pathname;
}
