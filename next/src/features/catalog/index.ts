// Public API of the catalog feature (WEB-004). Other features import from here and nowhere
// deeper — the Fulfill page uses `loadFeaturedProducts`, `ProductCard`, `getCatalogCopy` and
// `productHref`, which is exactly the contract this barrel promises to keep.
//
// Server loaders are re-exported from here on purpose: they carry `server-only`, so importing
// this barrel from a Client Component fails the build loudly instead of leaking the Hub
// transport into a browser bundle.
export { loadCatalogPage, loadCatalogProduct, loadFeaturedProducts } from "./server/loaders";
export type { CatalogPage, CatalogProduct, CatalogVariant } from "./models/product";
export { getCatalogCopy, type CatalogCopy } from "./localized-content";
export { catalogHref, productHref, CATALOG_ROUTE, type CatalogQuery } from "./routes";
export { default as ProductCard } from "./ui/product-card";
