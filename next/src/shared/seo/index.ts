// Public surface of shared/seo (FND-003). Isomorphic and secret-free; metadata builders are
// consumed by route `generateMetadata` and the app robots/sitemap files.
export { resolveSiteOrigin, localePath, localeUrl } from "./site";
export { buildAlternates, type AlternateLinkSet } from "./buildAlternates";
export { buildPageMetadata, type PageMetadataInput } from "./buildPageMetadata";
export { serializeJsonLd, JsonLdScript, FaqPageJsonLd } from "./jsonld";
