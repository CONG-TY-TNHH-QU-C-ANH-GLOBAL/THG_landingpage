// Generic route renderer — renders any shipping route from CMS data.
// The CMS body_md is markdown (## section headings, - bullets, ### subheadings,
// inline **bold** / [links], and 🚨/⚠/📌 callout lines). We parse it into
// collapsible sections so each policy topic is a click-to-expand accordion
// instead of one long wall of text.

import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  DollarSign,
  Globe,
  MapPin,
  Package,
  Percent,
  Ruler,
  Scale,
  ShieldCheck,
  TriangleAlert,
  Undo2,
} from "lucide-react";

import { useCmsShippingRoute } from "@/hooks/useCmsContent";
import { useI18n } from "@/lib/i18n";
import { Sec, Warn, Note, Danger, SubTitle } from "./PolicyUI";
import { SafeHtml } from "@/lib/sanitizeHtml";

interface Props {
  slug: string;
}

// ── markdown → sections ─────────────────────────────────────────────────────
interface Section {
  title: string;
  icon: LucideIcon;
  lines: string[];
}

/** Small icon chip element for a Sec header (decorative). */
const secIcon = (Icon: LucideIcon) => <Icon className="w-3.5 h-3.5" aria-hidden="true" />;

// Pick a topic icon from the heading text (best-effort, falls back to a list icon).
function iconForHeading(h: string): LucideIcon {
  const t = h.toLowerCase();
  if (/vat|ioss|tax|thuế|税/.test(t)) return Percent;
  if (/weight|cân nặng|trọng lượng|重量|chargeable/.test(t)) return Scale;
  if (/size|dimension|kích thước|尺寸/.test(t)) return Ruler;
  if (/countr|quốc gia|国家|service|restrict|hạn chế/.test(t)) return Globe;
  if (/declared|value|giá trị|khai báo|申报/.test(t)) return DollarSign;
  if (/goods|hàng hóa|properties|货物|battery|pin|电池/.test(t)) return Package;
  if (/address|địa chỉ|地址|delivery|giao hàng/.test(t)) return MapPin;
  if (/return|trả hàng|re-delivery|giao lại|退/.test(t)) return Undo2;
  if (/compensation|bồi thường|claim|khiếu nại|赔偿/.test(t)) return ShieldCheck;
  return ClipboardList;
}

function parseSections(md: string): { intro: string[]; sections: Section[] } {
  const intro: string[] = [];
  const sections: Section[] = [];
  let cur: Section | null = null;
  for (const raw of md.split("\n")) {
    const line = raw.replace(/\s+$/, "");
    const h = line.match(/^##\s+(.*)$/);
    if (h) {
      const title = h[1].trim();
      cur = { title, icon: iconForHeading(title), lines: [] };
      sections.push(cur);
    } else if (cur) {
      cur.lines.push(line);
    } else {
      intro.push(line);
    }
  }
  return { intro, sections };
}

// Inline markdown → safe HTML (bold + links only; everything else escaped).
function inlineHtml(s: string): string {
  const esc = s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return esc
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline break-all">$1</a>',
    );
}

// Render a block of lines (bullets grouped into <ul>, callouts boxed, etc.)
function renderLines(lines: string[], keyBase: string) {
  const out: React.ReactNode[] = [];
  let bullets: string[] = [];
  const flush = () => {
    if (bullets.length === 0) return;
    out.push(
      <ul key={`${keyBase}-ul-${out.length}`} className="pl-4 list-disc space-y-1 my-1.5">
        {bullets.map((b, i) => (
          <SafeHtml key={i} as="li" html={inlineHtml(b)} />
        ))}
      </ul>,
    );
    bullets = [];
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) { flush(); continue; }
    if (line.startsWith("🚨")) { flush(); out.push(<Danger key={`${keyBase}-d-${i}`}><SafeHtml as="span" html={inlineHtml(line.replace(/^🚨\s*/, ""))} /></Danger>); continue; }
    if (line.startsWith("⚠")) { flush(); out.push(<Warn key={`${keyBase}-w-${i}`}><SafeHtml as="span" html={inlineHtml(line.replace(/^⚠\s*/, ""))} /></Warn>); continue; }
    if (line.startsWith("📌")) { flush(); out.push(<Note key={`${keyBase}-n-${i}`}><SafeHtml as="span" html={inlineHtml(line.replace(/^📌\s*/, ""))} /></Note>); continue; }
    const sub = line.match(/^###\s+(.*)$/);
    if (sub) { flush(); out.push(<SubTitle key={`${keyBase}-s-${i}`}>{sub[1]}</SubTitle>); continue; }
    if (/^[-*]\s+/.test(line)) { bullets.push(line.replace(/^[-*]\s+/, "")); continue; }
    flush();
    out.push(<SafeHtml key={`${keyBase}-p-${i}`} as="p" className="my-1.5" html={inlineHtml(line)} />);
  }
  flush();
  return out;
}

export function RouteRenderer({ slug }: Props) {
  const { language, t } = useI18n();
  const { data, isLoading, error } = useCmsShippingRoute(slug, language);

  const route = data?.route;
  const parsed = useMemo(
    () => (route?.body_md ? parseSections(route.body_md) : { intro: [], sections: [] }),
    [route?.body_md],
  );

  if (isLoading) {
    return (
      <div className="py-8 text-center text-muted-foreground text-sm">{t("spolicy.loading_content")}</div>
    );
  }

  if (error || !route) {
    return (
      <div className="py-8 text-center text-muted-foreground text-sm">
        {t("spolicy.no_data")}
      </div>
    );
  }

  const hasBody = parsed.intro.some((l) => l.trim()) || parsed.sections.length > 0;

  return (
    <div className="space-y-2">
      {/* Intro paragraphs before the first ## heading */}
      {parsed.intro.some((l) => l.trim()) ? (
        <div className="bg-white border border-[var(--pricing-border)] rounded-[10px] px-4 py-3 text-[13px] text-[#333] leading-relaxed">
          {renderLines(parsed.intro, "intro")}
        </div>
      ) : null}

      {/* Each ## section as a collapsible accordion (first one open). */}
      {parsed.sections.map((sec, i) => (
        // Key on the section title, not the array index: Sec holds its own
        // open/closed state, so an index key would leak that state onto the
        // wrong section when CMS body_md is edited to reorder/insert sections.
        <Sec key={sec.title || `sec-${i}`} icon={secIcon(sec.icon)} title={sec.title} defaultOpen={i === 0}>
          {renderLines(sec.lines, `sec-${i}`)}
        </Sec>
      ))}

      {/* Structured tables from CMS (shipping_route_tables), if any. Keyed on
          caption + column signature (not index) so a Sec's open state stays
          with its table when the CMS reorders or inserts tables. */}
      {route.tables.map((table, tIdx) => (
        <Sec
          key={`${table.caption ?? ""}|${table.columns.map((c) => c.key).join(",")}`}
          icon={secIcon(Scale)}
          title={table.caption ?? `${t("spolicy.table_label")} ${tIdx + 1}`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[var(--pricing-border)]">
                  {table.columns.map((col) => (
                    <th key={col.key} className="text-left px-3 py-2 font-semibold text-navy">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="border-b border-[var(--pricing-border)] hover:bg-[#fdf6e8]">
                    {table.columns.map((col) => (
                      <td key={col.key} className="px-3 py-1.5">
                        {row[col.key] == null ? "" : String(row[col.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Sec>
      ))}

      {/* Operator notes (shipping_routes.notes_json), if any. */}
      {route.notes.length > 0 && (
        <Sec icon={secIcon(TriangleAlert)} title={t("spolicy.notes")}>
          <ul className="space-y-1.5 text-sm pl-4 list-disc">
            {route.notes.map((note, i) => (
              <li key={i} className="leading-relaxed">{note}</li>
            ))}
          </ul>
        </Sec>
      )}

      {!hasBody && route.tables.length === 0 && route.notes.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground text-sm">
          {t("spolicy.no_detail")}
        </div>
      ) : null}
    </div>
  );
}
