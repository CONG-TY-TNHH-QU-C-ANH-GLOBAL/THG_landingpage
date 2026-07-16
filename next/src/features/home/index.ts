// Public surface of features/home (FND-005). Exports models and server loaders — NEVER
// schemas or Cms* DTO types (CODE_STRUCTURE "Import boundaries"). Loaders are server-only;
// future client islands take models as props or use `import type` (erased at build).

export type {
  HomepageContent,
  HomeHeroContent,
  AboutVideoContent,
  ProcessContent,
} from "./models/homepageContent";
export type { Service } from "./models/service";
export type { Faq } from "./models/faq";
export type { ContactLocation, ContactLocationKind } from "./models/contactLocation";
export type { Integration } from "./models/integration";
export type { MarqueeImage } from "./models/marqueeImage";
export type { SiteSettings } from "./models/siteSettings";

export {
  loadHomepageContent,
  loadHomeServices,
  loadHomeFaqs,
  loadContactLocations,
  loadIntegrations,
  loadMarqueeImages,
  loadSiteSettings,
} from "./server/loaders";
