import type { CmsFullServicesResponse, CmsServiceProduct } from "../schemas/services";
import type { FulfillContent, FulfillCatalogItem } from "../models/fulfill";
import { emptyFulfillContent } from "../models/fulfill";

/** The CMS service id that backs this route [FACT: live /services returns id:"thg-fulfill"]. */
const FULFILL_SERVICE_ID = "thg-fulfill";

/** A product only becomes a catalog card if it has a display name; a resolved `image` wins over
 *  the legacy direct `image` field, and a missing image ("") lets the UI show its local fallback.
 *  price/time collapse to one operational note — never invented, only surfaced when the CMS set it. */
function catalogItemFromProduct(p: CmsServiceProduct): FulfillCatalogItem | null {
  const name = p.name.trim();
  if (!name) return null;
  const note = [p.price?.trim(), p.time?.trim()].filter(Boolean).join(" · ");
  return { name, image: p.image?.trim() ?? "", note };
}

/** Select the live `thg-fulfill` service and normalize it to the landing view model. When the
 *  service is absent, archived, or not live, return the empty fallback so the route degrades to
 *  its static-copy form instead of rendering a broken hero (WEB-001 per-section degradation). */
export function fulfillContentFromDto(dto: CmsFullServicesResponse): FulfillContent {
  const svc = dto.services.find((s) => s.id === FULFILL_SERVICE_ID && s.status === "live");
  if (!svc) return emptyFulfillContent();

  const catalog = svc.products
    .map(catalogItemFromProduct)
    .filter((c): c is FulfillCatalogItem => c !== null);

  return {
    present: true,
    serviceLabel: svc.hero_title?.trim() ?? "",
    heroSubtitle: svc.hero_sub?.trim() || svc.tagline?.trim() || "",
    heroEyebrow: svc.hero_eyebrow?.trim() ?? "",
    points: svc.bullets.map((b) => b.trim()).filter(Boolean),
    catalog,
  };
}
