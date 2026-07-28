import "server-only";

import type { z } from "zod";

import { cmsFetch } from "@/shared/cms";
import { CmsError } from "@/shared/cms/errors";
import { logCmsFallback } from "@/shared/cms/log-fallback";
import type { Locale } from "@/shared/i18n";

import { fullServicesResponseSchema } from "../schemas/services";
import { fulfillFaqsResponseSchema } from "../schemas/fulfill-faqs";
import { fulfillContentFromDto } from "../mappers/fulfillContent";
import { fulfillFaqsFromDto } from "../mappers/faq";
import { emptyFulfillContent, type FulfillContent } from "../models/fulfill";
import type { FulfillFaq } from "../models/faq";

// Server-only fulfill loaders (FND-005 pattern, mirrors features/home/server/loaders.ts):
// cmsFetch → feature schema → pure mapper → model, with per-resource degradation so the route
// never hard-fails when one CMS read is down — it renders the section's deterministic fallback
// and logs a redaction-safe warning (endpoint + safeMeta only). Non-CmsError faults rethrow.

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

/** The `thg-fulfill` service content; empty fallback when CMS is down or the service is absent. */
export function loadFulfillContent(lang: Locale): Promise<FulfillContent> {
  return loadOrFallback(
    `/services?lang=${lang}`,
    fullServicesResponseSchema,
    fulfillContentFromDto,
    emptyFulfillContent(),
  );
}

/** Fulfill-scope FAQs (visible accordion + JSON-LD input); [] omits both. */
export function loadFulfillFaqs(lang: Locale): Promise<FulfillFaq[]> {
  return loadOrFallback(
    `/faqs?lang=${lang}&scope=fulfill`,
    fulfillFaqsResponseSchema,
    fulfillFaqsFromDto,
    [],
  );
}
