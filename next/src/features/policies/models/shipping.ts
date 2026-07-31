// Landing-domain shipping-route models (WEB-007 §7). Plain data, zero imports (FND-005).

/** A rate/coverage table attached to a route. Cells render as TEXT — never as markup. */
export interface ShippingTable {
  /** Mapper-owned stable identity (route slug + normalized caption). */
  id: string;
  caption: string | null;
  columns: readonly { key: string; label: string }[];
  /** One row per shipment band; `cells` keys correspond to `columns[].key`. Each row carries a
   *  stable id because rate tables legitimately contain repeated values. */
  rows: readonly { id: string; cells: Record<string, string> }[];
}

export interface ShippingRouteSummary {
  slug: string;
  title: string;
  origin: string | null;
  destination: string | null;
  /** Free-form lane classifier from the CMS (e.g. "air", "sea"); null renders no chip. */
  kind: string | null;
}

export interface ShippingRouteDetail extends ShippingRouteSummary {
  /** Markdown body. Parsed into typed sections by the renderer — never injected as HTML. */
  bodyMarkdown: string;
  notes: readonly { id: string; text: string }[];
  tables: readonly ShippingTable[];
}

/** True when the route has no readable terms in the requested locale. */
export function isRouteContentEmpty(route: ShippingRouteDetail): boolean {
  return (
    route.bodyMarkdown.trim().length === 0 &&
    route.notes.length === 0 &&
    route.tables.length === 0
  );
}

export type ShippingPageResult =
  | { status: "ready"; routes: readonly ShippingRouteDetail[] }
  | { status: "empty"; routes: readonly ShippingRouteDetail[] }
  | {
      status: "unavailable";
      routes: readonly ShippingRouteDetail[];
      reason: "http" | "contract" | "network";
    };
