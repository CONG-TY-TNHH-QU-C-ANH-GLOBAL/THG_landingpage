import "server-only";

import { cache } from "react";

import { cmsFetch } from "@/shared/cms";
import { CmsError, CmsHttpError, CmsParseError, CmsShapeError } from "@/shared/cms/errors";
import { logCmsFallback } from "@/shared/cms/log-fallback";
import { siteSettingsResponseSchema } from "@/shared/cms/schemas";
import type { Locale } from "@/shared/i18n";

import { contactLocationsResponseSchema } from "../schemas/contact-locations";
import { contactLocationsFromDto } from "../mappers/contactLocation";
import { siteSettingsFromDto, EMPTY_SITE_SETTINGS } from "../mappers/siteSettings";
import { FALLBACK_CONTACT_LOCATIONS } from "./contact-fallback";
import type { ContactLocationsResult, ContactUnavailableReason } from "../models/contactLocation";
import type { SiteSettings } from "../models/siteSettings";

// The two site-shell server reads (footer contact directory + floating-contact links), split
// out of ./loaders so the shared [lang] layout can import them WITHOUT pulling the homepage
// data graph (homepage/services/faqs/integrations/marquee schemas + mappers) into every
// non-home route's compiled module graph. Same cmsFetch → schema → pure mapper → model
// pipeline and same per-section degradation contract as the rest of the home loaders; only
// the import surface is narrower. Loaders stay aggregated on ./loaders via a re-export.

// Shorter timeout than cmsFetch's content default (DEFAULT_CMS_TIMEOUT_MS = 8000). These are
// footer chrome with verified static fallbacks; because they run in the layout that wraps
// EVERY route, a footer-only CMS stall would otherwise hold the whole route for the full
// content budget. Measured against the standalone runtime: with only /contact-locations and
// /site-settings black-holed and page content answering instantly, /vi/community still took
// ~8.1s; this bound caps that at ~2.5s while leaving healthy reads (sub-second) untouched.
// Primary page content keeps the 8s default — it is worth the wait; footer chrome is not.
const SHELL_CMS_TIMEOUT_MS = 2500;

function contactUnavailableReason(err: CmsError): ContactUnavailableReason {
  if (err instanceof CmsHttpError) return "http";
  if (err instanceof CmsShapeError || err instanceof CmsParseError) return "contract";
  return "network";
}

/** Footer contact directory with explicit observable states (WEB-001 owner requirement):
 *  a schema-valid empty list is a CONFIRMED "empty"; any CmsError is "unavailable" and
 *  carries the verified production fallback rows so an outage never reads as "no offices".
 *  Non-CMS programming errors rethrow unchanged. */
// cache() so the shell reads dedupe to one call per request even though the timeout signal
// makes each cmsFetch's options distinct (which defeats Next's fetch-level memoization);
// request-scoped, so cross-request freshness is unchanged.
export const loadContactLocations = cache(
  async (lang: Locale): Promise<ContactLocationsResult> => {
    const path = `/contact-locations?lang=${lang}`;
    try {
      const locations = contactLocationsFromDto(
        await cmsFetch(path, contactLocationsResponseSchema, { timeoutMs: SHELL_CMS_TIMEOUT_MS }),
      );
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
  },
);

/** Site-wide contact links + about-video default; all-null model hides the buttons. */
export const loadSiteSettings = cache(async (): Promise<SiteSettings> => {
  const path = "/site-settings";
  try {
    return siteSettingsFromDto(
      await cmsFetch(path, siteSettingsResponseSchema, { timeoutMs: SHELL_CMS_TIMEOUT_MS }),
    );
  } catch (err) {
    if (!(err instanceof CmsError)) throw err;
    logCmsFallback(path, err);
    return EMPTY_SITE_SETTINGS;
  }
});
