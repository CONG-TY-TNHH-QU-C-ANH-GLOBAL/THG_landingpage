import type { ShippingRoutesResponseDto, ShippingRouteResponseDto } from "../schemas/shipping";
import type { ShippingRouteDetail, ShippingRouteSummary, ShippingTable } from "../models/shipping";

// Pure DTO → model mappers (FND-005).

export function shippingRouteSummariesFromDto(
  dto: ShippingRoutesResponseDto,
): ShippingRouteSummary[] {
  return dto.routes
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((r) => ({
      slug: r.slug,
      title: r.title,
      origin: r.origin,
      destination: r.destination,
      kind: r.kind,
    }));
}

/** Normalize one table cell to a display string. A null cell becomes an em dash rather than
 *  the string "null"; a numeric cell is stringified here so the renderer never has to decide
 *  a number format at render time (which would vary by locale and break table alignment). */
function cellText(value: string | number | null): string {
  if (value === null) return "—";
  return typeof value === "number" ? String(value) : value;
}

function tableFromDto(t: ShippingRouteResponseDto["route"]["tables"][number]): ShippingTable {
  return {
    caption: t.caption,
    columns: t.columns,
    rows: t.rows.map((row) =>
      Object.fromEntries(Object.entries(row).map(([k, v]) => [k, cellText(v)])),
    ),
  };
}

export function shippingRouteDetailFromDto(dto: ShippingRouteResponseDto): ShippingRouteDetail {
  const r = dto.route;
  return {
    slug: r.slug,
    title: r.title,
    origin: r.origin,
    destination: r.destination,
    kind: r.kind,
    bodyMarkdown: r.body_md ?? "",
    notes: r.notes.filter((n) => n.trim().length > 0),
    // Drop a table with no columns: it can only render an empty <table>, and the CMS
    // produces one whenever `columns_json` fails to parse (the documented degradation).
    tables: r.tables.filter((t) => t.columns.length > 0).map(tableFromDto),
  };
}
