import "server-only";

import type { z } from "zod";

import { cmsFetch } from "@/shared/cms";
import { CmsError, CmsHttpError, CmsParseError, CmsShapeError } from "@/shared/cms/errors";
import { logCmsFallback } from "@/shared/cms/log-fallback";
import { siteSettingsResponseSchema } from "@/shared/cms/schemas";
import type { Locale } from "@/shared/i18n";

import { homepageResponseSchema } from "../schemas/homepage";
import { servicesResponseSchema } from "../schemas/services";
import { faqsResponseSchema } from "../schemas/faqs";
import { contactLocationsResponseSchema } from "../schemas/contact-locations";
import { integrationsResponseSchema } from "../schemas/integrations";
import { marqueeImagesResponseSchema } from "../schemas/marquee-images";
import { homepageContentFromDto, emptyHomepageContent } from "../mappers/homepageContent";
import { liveServicesFromDto } from "../mappers/service";
import { faqsFromDto } from "../mappers/faq";
import { contactLocationsFromDto } from "../mappers/contactLocation";
import { integrationsFromDto } from "../mappers/integration";
import { marqueeImagesFromDto } from "../mappers/marqueeImage";
import { siteSettingsFromDto, EMPTY_SITE_SETTINGS } from "../mappers/siteSettings";
import { FALLBACK_CONTACT_LOCATIONS } from "./contact-fallback";
import type { HomepageContent } from "../models/homepageContent";
import type { Service } from "../models/service";
import type { Faq } from "../models/faq";
import type { ContactLocation, ContactLocationsResult, ContactUnavailableReason } from "../models/contactLocation";
import type { Integration } from "../models/integration";
import type { MarqueeImage } from "../models/marqueeImage";
import type { SiteSettings } from "../models/siteSettings";

// Server-only home loaders (FND-005): cmsFetch → feature schema → pure mapper → model.
// Per-section degradation is the approved contract (WEB-001 DATA_FLOW: the page never
// hard-fails because one CMS resource is down): any CmsError yields that section's
// deterministic fallback and a redaction-safe log (endpoint + safeMeta, never bodies).
// Non-CMS errors are programming errors and rethrow.

async function loadOrFallback<S extends z.ZodTypeAny, M>(
  path: string,
  schema: S,
  map: (dto: z.infer<S>) => M,
  fallback: M,
): Promise<M> {
  try {
    return map(await cmsFetch(path, schema));
  } catch (err) {
    if (!(err instanceof CmsError)) throw err;
    logCmsFallback(path, err);
    return fallback;
  }
}

/** Operator homepage-block overrides; empty content (dictionary copy) when CMS is down. */
export function loadHomepageContent(lang: Locale): Promise<HomepageContent> {
  return loadOrFallback(
    `/homepage?lang=${lang}`,
    homepageResponseSchema,
    homepageContentFromDto,
    emptyHomepageContent(),
  );
}

/** Live services in display order; [] renders the explicit empty state. */
export function loadHomeServices(lang: Locale): Promise<Service[]> {
  return loadOrFallback(`/services?lang=${lang}`, servicesResponseSchema, liveServicesFromDto, []);
}

/** Home-scope FAQs (JSON-LD input); [] emits no FaqPage JSON-LD (parity: Index.tsx:52). */
export function loadHomeFaqs(lang: Locale): Promise<Faq[]> {
  return loadOrFallback(`/faqs?lang=${lang}&scope=home`, faqsResponseSchema, faqsFromDto, []);
}

function contactUnavailableReason(err: CmsError): ContactUnavailableReason {
  if (err instanceof CmsHttpError) return "http";
  if (err instanceof CmsShapeError || err instanceof CmsParseError) return "contract";
  return "network";
}

/** Footer contact directory with explicit observable states (WEB-001 owner requirement):
 *  a schema-valid empty list is a CONFIRMED "empty"; any CmsError is "unavailable" and
 *  carries the verified production fallback rows so an outage never reads as "no offices".
 *  Non-CMS programming errors rethrow unchanged. */
export async function loadContactLocations(lang: Locale): Promise<ContactLocationsResult> {
  const path = `/contact-locations?lang=${lang}`;
  try {
    const locations = contactLocationsFromDto(await cmsFetch(path, contactLocationsResponseSchema));
    return locations.length > 0 ? { status: "ready", locations } : { status: "empty", locations };
  } catch (err) {
    if (!(err instanceof CmsError)) throw err;
    logCmsFallback(path, err);
    return {
      status: "unavailable",
      locations: FALLBACK_CONTACT_LOCATIONS[lang],
      reason: contactUnavailableReason(err),
    };
  }
}

/** Integration tiles (locale-less endpoint). */
export function loadIntegrations(): Promise<Integration[]> {
  return loadOrFallback("/integrations", integrationsResponseSchema, integrationsFromDto, []);
}

/** Marquee-band images (locale-less endpoint). */
export function loadMarqueeImages(): Promise<MarqueeImage[]> {
  return loadOrFallback("/marquee-images", marqueeImagesResponseSchema, marqueeImagesFromDto, []);
}

/** Site-wide contact links + about-video default; all-null model hides the buttons. */
export function loadSiteSettings(): Promise<SiteSettings> {
  return loadOrFallback(
    "/site-settings",
    siteSettingsResponseSchema,
    siteSettingsFromDto,
    EMPTY_SITE_SETTINGS,
  );
}
