import "server-only";

import type { z } from "zod";

import { cmsFetch } from "@/shared/cms";
import { CmsError } from "@/shared/cms/errors";
import { logCmsFallback, logServiceBlockAnomaly } from "@/shared/cms/log-fallback";
import type { Locale } from "@/shared/i18n";

import { fullServicesResponseSchema } from "../schemas/services";
import { fulfillFaqsResponseSchema } from "../schemas/fulfill-faqs";
import { serviceBlocksResponseSchema } from "../schemas/service-blocks";
import { loadFeaturedProducts, type CatalogProduct } from "@/features/catalog";

import { FULFILL_FEATURED_PRODUCT_IDS } from "../featured-products";
import { fulfillContentFromDto } from "../mappers/fulfillContent";
import { fulfillFaqsFromDto } from "../mappers/faq";
import { fulfillServiceContentFromDto } from "../mappers/serviceBlocks";
import { emptyFulfillContent, type FulfillContent } from "../models/fulfill";
import {
  emptyServiceContent,
  FULFILL_PAGE_SLUG,
  type FulfillServiceContent,
} from "../models/service-content";
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

/**
 * The real THG Hub products the "products we can fulfill" section shows.
 *
 * Source of ids, in order of authority: the CMS service catalog when an editor has linked
 * entries to Hub products, otherwise the feature's own verified featured list. Either way the
 * DISPLAYED data (name, image, origin, price, lead time) comes from the Hub, never from copy —
 * so a card is always the SKU it claims to be and its deep link always resolves.
 *
 * `[]` on a Hub outage; the section then renders its static illustrative cards.
 */
export function loadFulfillFeaturedProducts(
  content: FulfillContent,
): Promise<readonly CatalogProduct[]> {
  const cmsIds = content.catalog.map((item) => item.productId).filter(Boolean);
  return loadFeaturedProducts(cmsIds.length > 0 ? cmsIds : FULFILL_FEATURED_PRODUCT_IDS);
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

/** Published service-block business content (journey/capability/section copy) for the Fulfill page.
 *  An empty model on a CMS failure OR an empty block set — either way the page renders its
 *  feature-local fallback copy; anomalies (missing/duplicate key, malformed block) are logged
 *  redaction-safe and drop only the affected role. */
export function loadFulfillServiceBlocks(lang: Locale): Promise<FulfillServiceContent> {
  return loadOrFallback(
    `/service-blocks?page_slug=${FULFILL_PAGE_SLUG}&lang=${lang}`,
    serviceBlocksResponseSchema,
    (dto) => fulfillServiceContentFromDto(dto, logServiceBlockAnomaly),
    emptyServiceContent(),
  );
}
