import "server-only";

import { cmsFetch } from "@/shared/cms";
import { CmsError } from "@/shared/cms/errors";
import { logCmsFallback } from "@/shared/cms/log-fallback";
import type { Locale } from "../config/locales";
import { MARKETING_COPY } from "../marketing-copy";
import type { MarketingCopy } from "../marketing";
import { translationsResponseSchema } from "../schemas/translations";

// Server-side copy resolution (WEB-001 §8, parity: src/lib/i18n/index.tsx effectiveMap):
// static base resolved per locale (static[lang] || static.en || key), then the CMS
// `/translations` overlay wins per key. CMS unavailability falls back to the static copy —
// the shell never hard-fails on the overlay (same offline behavior as today).

export async function getMarketingCopy(lang: Locale): Promise<MarketingCopy> {
  const base: Record<string, string> = {};
  for (const [key, byLocale] of Object.entries(MARKETING_COPY)) {
    base[key] = byLocale[lang] || byLocale.en || key;
  }
  try {
    const dto = await cmsFetch(`/translations?lang=${lang}`, translationsResponseSchema);
    Object.assign(base, dto.translations);
  } catch (err) {
    if (!(err instanceof CmsError)) throw err;
    logCmsFallback(`/translations?lang=${lang}`, err);
  }
  return base;
}
