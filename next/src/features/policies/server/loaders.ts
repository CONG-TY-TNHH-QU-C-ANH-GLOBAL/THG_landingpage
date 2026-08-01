import "server-only";

import { cache } from "react";

import { cmsFetch } from "@/shared/cms";
import {
  CmsError,
  CmsHttpError,
  CmsParseError,
  CmsShapeError,
  isCmsNotFound,
} from "@/shared/cms/errors";
import { logCmsFallback } from "@/shared/cms/log-fallback";
import type { Locale } from "@/shared/i18n";

import { policiesResponseSchema, policyResponseSchema } from "../schemas/policies";
import { shippingRouteResponseSchema, shippingRoutesResponseSchema } from "../schemas/shipping";
import { policyDetailFromDto, policySummariesFromDto } from "../mappers/policy";
import { shippingRouteDetailFromDto, shippingRouteSummariesFromDto } from "../mappers/shipping";
import type { PolicyDetail, PolicyPageResult } from "../models/policy";
import type { ShippingPageResult, ShippingRouteDetail } from "../models/shipping";

// Server-only WEB-007 loaders: cmsFetch → feature schema → pure mapper → model.
//
// Both pages render EVERY section server-side rather than fetching a selected slug on
// click. That is the substantive change from the Vite pages, and it is deliberate:
//
//   1. The legacy pages fetched the detail for the active tab in the browser, so only one
//      policy was ever in the HTML and the rest were invisible to a crawler. Rendering all
//      of them makes the whole document indexable at one stable URL.
//   2. It keeps the route statically renderable. Selection is a fragment (`#slug`), which
//      the server never sees, so there is no searchParams-induced dynamic rendering.
//
// The cost is a list read plus one detail read per section. Both are ISR-cached at the
// route, so the fan-out happens on revalidation, not per visitor.
//
// Failure policy mirrors community, not the homepage: these pages ARE the content, so a
// CMS outage surfaces an explicit `unavailable` state instead of a fabricated fallback.

type UnavailableReason = "http" | "contract" | "network";

function unavailableReason(err: CmsError): UnavailableReason {
  if (err instanceof CmsHttpError) return "http";
  if (err instanceof CmsShapeError || err instanceof CmsParseError) return "contract";
  return "network";
}

/** Load one detail, or null when that single section is unavailable.
 *
 *  A per-section failure must not fail the page: a 404 means the operator unpublished this
 *  policy between the list read and the detail read, and any other CmsError is one bad
 *  section. Either way the remaining sections still render, which is why the caller filters
 *  nulls rather than propagating. */
async function loadOneOrNull<T>(
  path: string,
  load: () => Promise<T>,
): Promise<T | null> {
  try {
    return await load();
  } catch (err) {
    if (!(err instanceof CmsError)) throw err;
    // A 404 here is an expected race, not a fault — log the rest.
    if (!isCmsNotFound(err)) logCmsFallback(path, err);
    return null;
  }
}

/** Every published policy for the locale, in CMS order, each with its full body.
 *
 *  React cache() wrapped: `generateMetadata` needs the result to decide indexability and the
 *  page needs it to render, and this loader issues 1 + N CMS reads. Without memoization every
 *  render would run that fan-out twice. Same reasoning as getMarketingCopy — cmsFetch's
 *  per-request timeout signal defeats Next's own fetch-level dedupe, so cache() on the
 *  argument is what actually collapses the two calls. */
export const loadPolicies = cache(async (lang: Locale): Promise<PolicyPageResult> => {
  const listPath = `/policies?lang=${lang}`;
  let slugs: readonly string[];
  try {
    slugs = policySummariesFromDto(await cmsFetch(listPath, policiesResponseSchema)).map(
      (p) => p.slug,
    );
  } catch (err) {
    if (!(err instanceof CmsError)) throw err;
    logCmsFallback(listPath, err);
    return { status: "unavailable", policies: [], reason: unavailableReason(err) };
  }

  if (slugs.length === 0) return { status: "empty", policies: [] };

  const settled = await Promise.all(
    slugs.map((slug) => {
      const path = `/policies/${encodeURIComponent(slug)}?lang=${lang}`;
      return loadOneOrNull<PolicyDetail>(path, async () =>
        policyDetailFromDto(await cmsFetch(path, policyResponseSchema)),
      );
    }),
  );
  const policies = settled.filter((p): p is PolicyDetail => p !== null);

  // The list said there are policies but every detail read failed — that is an outage, and
  // reporting it as `empty` would be the exact "no policies yet" lie the legacy page told.
  if (policies.length === 0) {
    return { status: "unavailable", policies: [], reason: "http" };
  }
  return { status: "ready", policies };
});

/** Every live shipping route for the locale, in CMS order, each with its full terms.
 *  cache()-wrapped for the same reason as loadPolicies. */
export const loadShippingRoutes = cache(async (lang: Locale): Promise<ShippingPageResult> => {
  const listPath = `/shipping-routes?lang=${lang}`;
  let slugs: readonly string[];
  try {
    slugs = shippingRouteSummariesFromDto(
      await cmsFetch(listPath, shippingRoutesResponseSchema),
    ).map((r) => r.slug);
  } catch (err) {
    if (!(err instanceof CmsError)) throw err;
    logCmsFallback(listPath, err);
    return { status: "unavailable", routes: [], reason: unavailableReason(err) };
  }

  if (slugs.length === 0) return { status: "empty", routes: [] };

  const settled = await Promise.all(
    slugs.map((slug) => {
      const path = `/shipping-routes/${encodeURIComponent(slug)}?lang=${lang}`;
      return loadOneOrNull<ShippingRouteDetail>(path, async () =>
        shippingRouteDetailFromDto(await cmsFetch(path, shippingRouteResponseSchema)),
      );
    }),
  );
  const routes = settled.filter((r): r is ShippingRouteDetail => r !== null);

  if (routes.length === 0) {
    return { status: "unavailable", routes: [], reason: "http" };
  }
  return { status: "ready", routes };
});
