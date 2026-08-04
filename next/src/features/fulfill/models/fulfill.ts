// Landing-owned THG Fulfill view model (WEB-002). Derived from the CMS `thg-fulfill` service
// by the mapper — CMS storage terms (body_md, hero_sub, media_id) never reach the UI. Every
// string is presentation-ready: "" means "render nothing" (parity with the home service model),
// so components branch on emptiness, never on null.

export interface FulfillCatalogItem {
  /** Product label, e.g. "Premium Apparel". */
  name: string;
  /** Resolved media URL; "" when the CMS has not attached one (renders the local fallback). */
  image: string;
  /** Optional operational note (basecost / lead time); "" renders nothing. */
  note: string;
  /** Basecost as the CMS published it, e.g. "$7.5"; "" renders nothing. (R3 parity: the Vite
   *  card shows basecost, lead time and origin as separate labelled facts, so the landing model
   *  now carries them separately instead of only the collapsed `note`.) */
  price: string;
  /** In-house handling time, e.g. "2-4 days"; "" renders nothing. */
  leadTime: string;
  /** Production origin badge, e.g. "US"; "" renders nothing. */
  origin: string;
}

export interface FulfillContent {
  /** True when the CMS returned a live `thg-fulfill` service; false → the static-copy fallback
   *  is in effect (hero/points come from the localized chrome, catalog is empty). */
  readonly present: boolean;
  /** CMS service identity (hero_title) shown as the hero eyebrow/badge; "" → the component uses
   *  its localized default badge. This is the visible service label — NOT the page H1, which is the
   *  feature-owned art-directed headline. */
  serviceLabel: string;
  /** Hero supporting line (hero_sub → tagline → ""). */
  heroSubtitle: string;
  /** Small uppercase eyebrow (hero_eyebrow); "" renders nothing. */
  heroEyebrow: string;
  /** Verified operational highlights (bullets) — the hero rail + consultation checklist. */
  points: readonly string[];
  /** Product ecosystem cards; [] renders the explicit empty state (no fabricated SKUs). */
  catalog: readonly FulfillCatalogItem[];
}

/** The deterministic fallback when the CMS is unavailable or has no live `thg-fulfill` service:
 *  the route still renders (static-first), driven entirely by the localized chrome copy. */
export function emptyFulfillContent(): FulfillContent {
  return {
    present: false,
    serviceLabel: "",
    heroSubtitle: "",
    heroEyebrow: "",
    points: [],
    catalog: [],
  };
}
