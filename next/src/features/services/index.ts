// Public API of the services feature (WEB-002 generic service pages): landing models, the
// server loader and the composed view. Wire schemas and DTO types never cross this boundary.
//
// THG Fulfill is NOT served from here — it has an approved bespoke design in features/fulfill,
// and rendering it through this template would merge two distinct service propositions.

export type {
  ServicePageSlug,
  ServicePageContent,
  ServicePageResult,
  ServiceBlock,
  ServiceRecord,
  ServiceFaq,
} from "./models/service-page";
export { SERVICE_PAGE_SLUGS, isServicePageEmpty } from "./models/service-page";

export { loadServicePage } from "./server/loaders";
export { ServicePageView } from "./ui/service-page-view";
