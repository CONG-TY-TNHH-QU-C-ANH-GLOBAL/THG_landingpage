import type { ShippingRouteDetail, ShippingTable } from "../models/shipping";
import { isRouteContentEmpty } from "../models/shipping";
import { MarkdownLines, renderInline, splitSections } from "@/shared/ui/markdown";

// One shipping route rendered in full. Server Component.

function RateTable({ table, label }: Readonly<{ table: ShippingTable; label: string }>) {
  return (
    <figure className="my-4">
      {/* Wide rate tables scroll inside their own container so the page body never scrolls
          horizontally at 320px. */}
      <div className="overflow-x-auto rounded-xl border border-border/60 bg-white">
        <table className="w-full border-collapse text-[13px]">
          <caption className="sr-only">{table.caption ?? label}</caption>
          <thead>
            <tr className="bg-[#fdf6e8]">
              {table.columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className="whitespace-nowrap border-b border-border/60 px-3 py-2 text-left font-semibold text-navy"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row.id} className="border-b border-border/40 last:border-0">
                {table.columns.map((col) => (
                  // Cells are TEXT (WEB-007 §14) — the mapper already stringified every
                  // value, and no inline markdown is parsed inside a table.
                  <td key={col.key} className="px-3 py-2 align-top">
                    {row.cells[col.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.caption && (
        <figcaption className="mt-1.5 text-[12px] text-muted-foreground">{table.caption}</figcaption>
      )}
    </figure>
  );
}

export interface RouteSectionCopy {
  tableLabel: string;
  notesLabel: string;
  /** Shown when the route carries no terms in the requested locale. */
  noContent: string;
}

export function RouteSection({
  route,
  copy,
}: Readonly<{ route: ShippingRouteDetail; copy: RouteSectionCopy }>) {
  const lane = [route.origin, route.destination].filter(Boolean).join(" → ");

  return (
    <section id={route.slug} className="mb-12 scroll-mt-28">
      <h2 className="mb-1 text-lg font-semibold text-navy">{route.title}</h2>
      {(lane || route.kind) && (
        <p className="mb-4 flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
          {lane && <span>{lane}</span>}
          {route.kind && (
            <span className="rounded-full border border-[#d4b96a] px-2 py-0.5 text-[12px] text-navy">
              {route.kind}
            </span>
          )}
        </p>
      )}

      {isRouteContentEmpty(route) ? (
        <p className="rounded-xl border border-border/60 bg-white p-4 text-[13px] text-muted-foreground">
          {copy.noContent}
        </p>
      ) : (
        <>
          {splitSections(route.bodyMarkdown).map((section) => (
            <div key={section.id} className="text-[13px] leading-relaxed text-foreground/90">
              {section.heading && (
                <h3 className="mt-4 mb-1 text-[15px] font-semibold text-navy">
                  {section.heading}
                </h3>
              )}
              {/* base 2: splitSections already consumed the `##` section headings, so the
                  shallowest construct left in these bodies is `###`, which lands at h4 —
                  directly under the h3 section heading above it. lineOffset keeps parsed-node
                  ids unique across sections of the same document. */}
              <MarkdownLines
                lines={section.lines}
                baseHeadingLevel={2}
                lineOffset={section.lineOffset}
              />
            </div>
          ))}

          {route.tables.map((table, position) => (
            // key is the mapper-owned table id; `position` only builds the visible caption
            // fallback ("Table 1"), which is display text and not identity.
            <RateTable key={table.id} table={table} label={`${copy.tableLabel} ${position + 1}`} />
          ))}

          {route.notes.length > 0 && (
            <div className="mt-4 rounded-xl border border-border/60 bg-white p-4">
              <h3 className="mb-2 text-[15px] font-semibold text-navy">{copy.notesLabel}</h3>
              <ul className="list-disc space-y-1 pl-5 text-[13px] text-foreground/90">
                {route.notes.map((note) => (
                  <li key={note.id}>{renderInline(note.text, note.id)}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  );
}
