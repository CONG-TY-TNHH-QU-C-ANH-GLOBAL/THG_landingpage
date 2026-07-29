// Canonical lead service/surface keys — the landing mirror of the CMS contract
// (CMS_management- src/features/leads/lead-request.ts). Code-owned identifiers, NOT CMS slugs or
// route paths. These keys are a CROSS-REPOSITORY public request contract: the BACKEND validation is
// authoritative and rejects unknown values, so these must stay compatible. Adding a service is a
// COORDINATED change (backend key + details schema; here a mirror key + optional field group).
import type { Locale } from "@/shared/i18n";
import type { MarketingCopy } from "@/shared/i18n/marketing";

export const LEAD_SERVICE_KEYS = ["fulfill", "express", "warehouse", "dropship"] as const;
export type LeadServiceKey = (typeof LEAD_SERVICE_KEYS)[number];

export const LEAD_SURFACE_KEYS = [
  "global-services-dialog",
  "fulfill-inline",
  "express-inline",
  "warehouse-inline",
  "dropship-inline",
  "home-conversion-inline",
] as const;
export type LeadSurfaceKey = (typeof LEAD_SURFACE_KEYS)[number];

/** Localized display label for a service — reuses the existing nav dictionary keys so the
 *  selector never introduces a second copy source. */
const SERVICE_LABEL_COPY_KEY: Readonly<Record<LeadServiceKey, string>> = {
  fulfill: "nav.thg_fulfill",
  express: "nav.thg_express",
  warehouse: "nav.thg_warehouse",
  dropship: "nav.thg_order",
};

export function serviceLabel(copy: MarketingCopy, service: LeadServiceKey): string {
  const key = SERVICE_LABEL_COPY_KEY[service];
  return copy[key] ?? service;
}

// Fulfill's one verified service-specific detail — grounded in the approved catalog categories,
// mirrors the backend FULFILL_PRODUCT_TYPES enum. Other services have no verified detail fields
// yet (common envelope only).
export const FULFILL_PRODUCT_TYPES = ["apparel", "drinkware", "fleece", "other"] as const;
export type FulfillProductType = (typeof FULFILL_PRODUCT_TYPES)[number];

// Localized product-type labels (mirror the fulfill catalog categories). Code-owned so the shared
// dialog can render them without importing the fulfill feature.
const FULFILL_PRODUCT_TYPE_LABELS: Readonly<Record<Locale, Record<FulfillProductType, string>>> = {
  en: { apparel: "Apparel", drinkware: "Drinkware", fleece: "Fleece & home", other: "Other" },
  vi: { apparel: "Áo & apparel", drinkware: "Drinkware", fleece: "Fleece & đồ nhà", other: "Khác" },
  zh: { apparel: "服装", drinkware: "杯具饮具", fleece: "抓绒与家居", other: "其他" },
};

export function fulfillProductTypeLabel(lang: Locale, type: FulfillProductType): string {
  return FULFILL_PRODUCT_TYPE_LABELS[lang][type];
}
