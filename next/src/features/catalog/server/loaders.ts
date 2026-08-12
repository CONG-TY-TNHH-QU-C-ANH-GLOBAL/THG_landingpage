import "server-only";

import {
  fetchHubCatalog,
  fetchHubProduct,
  HubCatalogError,
  isHubProductNotFound,
  type HubCatalogParams,
} from "@/integrations/hub/catalog";

import { catalogPageFromDto, catalogProductFromDto } from "../mappers/product";
import { emptyCatalogPage, type CatalogPage, type CatalogProduct } from "../models/product";

// Server-only catalog loaders. Same degradation contract as the CMS loaders: a Hub outage
// degrades the catalog surface to its deterministic empty state and logs one redaction-safe
// warning — it never throws a page render. Non-HubCatalogError faults (programming errors)
// rethrow unchanged.

const logged = new Set<string>();

function logHubFallback(err: HubCatalogError): void {
  const key = `${err.path}|${err.reason}`;
  if (logged.has(key)) return;
  logged.add(key);
  // warn, not error: Next dev turns console.error into overlay entries, so an unreachable
  // Hub during local development would look like a wall of bugs.
  console.warn(`[HUB] catalog fallback:`, err.safeMeta());
}

/** Test hook: clear the per-process dedupe between cases. */
export function resetLoggedHubFallbacks(): void {
  logged.clear();
}

/** A page of catalog products. Never throws — a Hub failure yields `degraded: true`. */
export async function loadCatalogPage(params: HubCatalogParams): Promise<CatalogPage> {
  try {
    return catalogPageFromDto(await fetchHubCatalog(params));
  } catch (err) {
    if (!(err instanceof HubCatalogError)) throw err;
    logHubFallback(err);
    return emptyCatalogPage();
  }
}

/**
 * One product by Hub id, for the `?productId=` deep link.
 *
 * `null` covers BOTH "no such product" and "Hub unavailable", and that conflation is
 * deliberate: the surface response is identical either way — the detail panel is replaced by
 * a "product not found" notice while the rest of the page still renders. Distinguishing them
 * would only let the page say something it cannot verify.
 */
export async function loadCatalogProduct(id: string): Promise<CatalogProduct | null> {
  try {
    return catalogProductFromDto(await fetchHubProduct(id));
  } catch (err) {
    if (!(err instanceof HubCatalogError)) throw err;
    if (!isHubProductNotFound(err)) logHubFallback(err);
    return null;
  }
}

/**
 * Resolve a code- or CMS-owned list of product ids to live Hub products, in the order given.
 *
 * Used by surfaces that FEATURE specific products (the Fulfill capability grid) rather than
 * browse the catalog. Ids that 404 are dropped, not faked: a retired product disappears from
 * the surface instead of rendering a card whose link is dead.
 */
export async function loadFeaturedProducts(
  ids: readonly string[],
): Promise<readonly CatalogProduct[]> {
  const resolved = await Promise.all(ids.map(loadCatalogProduct));
  return resolved.filter((p): p is CatalogProduct => p !== null);
}
