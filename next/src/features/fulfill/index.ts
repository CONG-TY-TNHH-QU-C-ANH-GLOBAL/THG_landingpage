// Public surface of features/fulfill (WEB-002). Exports models, the localized copy accessor
// and server loaders — NEVER schemas or Cms* DTO types (import boundaries). Loaders are
// server-only; client islands take models/copy as props or `import type`.

export type { FulfillContent, FulfillCatalogItem } from "./models/fulfill";
export type { FulfillFaq } from "./models/faq";
export type { FulfillCopy, FulfillStepCopy, FulfillCapabilityCopy } from "./localized-content";

export { getFulfillContent } from "./localized-content";
export { loadFulfillContent, loadFulfillFaqs } from "./server/loaders";
