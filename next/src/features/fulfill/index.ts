// Public surface of features/fulfill (WEB-002). Exports models, the localized copy accessor
// and server loaders — NEVER schemas or Cms* DTO types (import boundaries). Loaders are
// server-only; client islands take models/copy as props or `import type`.

export type { FulfillContent, FulfillCatalogItem } from "./models/fulfill";
export type { FulfillFaq } from "./models/faq";
export type { FulfillCopy, FulfillStepCopy, FulfillCapabilityCopy } from "./localized-content";
export type { FulfillServiceContent } from "./models/service-content";

export { getFulfillContent } from "./localized-content";
export { applyServiceBlocks } from "./models/service-content";
export {
  loadFulfillContent,
  loadFulfillFaqs,
  loadFulfillServiceBlocks,
  loadFulfillFeaturedProducts,
} from "./server/loaders";
