import { Sec, Warn } from "./PolicyUI";
import { useLarkPricingContext } from "@/components/pricing/LarkPricingProvider";
import { useI18n } from "@/lib/i18n";

/* ═══════════════════════════════════════════════════════════
   GSheetPolicyRoute — shared component for rendering a
   shipping policy tab from live Google Sheet data.

   Language: GSheet data is English-only. For Vietnamese and
   Chinese, falls back to children (hardcoded translated content).
   ═══════════════════════════════════════════════════════════ */

/** Map heading text → icon for Sec */
const ICON_RULES: [RegExp, string][] = [
    [/VAT|IOSS|General/i, "%"],
    [/Chargeable Weight/i, "⚖"],
    [/Weight/i, "⚖"],
    [/Serviceable|Service Countries/i, "🌍"],
    [/Declared Value/i, "$"],
    [/Cargo|Goods|Shipment/i, "📦"],
    [/Size/i, "📏"],
    [/Address|Delivery/i, "📍"],
    [/Pre[- ]?alert|Pre-?Shipment/i, "📋"],
    [/Handover|Order/i, "📋"],
    [/Returns|Re-?Delivery|Return/i, "↩"],
    [/Compensation/i, "🛡"],
    [/Other|Tracking|Enquiry/i, "📌"],
    [/Force Majeure/i, "⚡"],
    [/Special|Reminder/i, "⚠"],
];

function getIcon(title: string): string {
    for (const [re, icon] of ICON_RULES) {
        if (re.test(title)) return icon;
    }
    return "📋";
}

/** Strip leading emoji & roman numeral prefix */
function cleanTitle(raw: string): string {
    return raw
        .replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}%$⚖️🌍📦📏📍🛡📌🔍⚡⚠↩💵💠🔄🔋💄\s]+/u, "")
        .trim();
}

interface ParsedSection {
    title: string;
    icon: string;
    lines: string[];
}

// ── Regex patterns ──────────────────────────────────────────
const HEADING_RE = /(?:Ⅰ|Ⅱ|Ⅲ|Ⅳ|IⅤ|Ⅴ|Ⅵ|Ⅶ|Ⅷ|Ⅸ|IⅩ|Ⅹ|Ⅺ|XII|XI|X|IX|VIII|VII|VI|IV|V|III|II|I)\s*[、\-\.\/\,]\s*/;
const HEADING_START_RE = new RegExp("^" + HEADING_RE.source);

// CN-style split: whitespace before multi-char Roman numeral + separator + uppercase word.
// Single "I" only when followed by known keywords to avoid matching pronoun "I".
const CN_SPLIT_RE = /\s+(?=(?:XII|XI|IX|VIII|VII|VI|IV|III|II|X|V)[.\-]\s+[A-Z]|I[.\-]\s+(?:Chargeable|Serviceable|Service|Weight|General|VAT))/;

// Title extraction: grab capitalized words (2-5 words) at start of section text.
// Matches: "Chargeable Weight", "Declared Value & Notes", "Cargo Attributes", etc.
const TITLE_RE = /^([A-Z][a-zA-Zé]+(?:\s+[&\/]\s*[A-Z][a-zA-Zé]+)?(?:\s+[A-Z][a-zA-Zé]+){0,4})/;

/**
 * Parse raw CSV rows from a GSheet policy tab into sections.
 * VN tabs: each row is a line, headers on separate rows.
 * CN tabs: all text in few giant rows, headers inline.
 */
function parseSections(rows: any[][]): ParsedSection[] {
    if (!rows || rows.length === 0) return [];

    const rawLines = rows
        .map(row => String(row[0] ?? "").trim())
        .filter(Boolean);

    // Detect: VN-style (≥5 header rows, ≥15% ratio) vs CN-style
    const headerRowCount = rawLines.filter(l => HEADING_START_RE.test(l)).length;
    const headerRatio = rawLines.length > 0 ? headerRowCount / rawLines.length : 0;
    const isVnStyle = headerRowCount >= 5 && headerRatio >= 0.15;

    let allLines: string[];
    if (isVnStyle) {
        allLines = rawLines;
    } else {
        const fullText = rawLines.join(" ");
        allLines = fullText.split(CN_SPLIT_RE).map(s => s.trim()).filter(Boolean);
    }

    const sections: ParsedSection[] = [];
    let current: ParsedSection | null = null;

    for (const line of allLines) {
        if (HEADING_START_RE.test(line)) {
            if (current) sections.push(current);
            const rawAfter = line.replace(HEADING_START_RE, "").trim();

            // Extract short title from capitalized words
            const m = TITLE_RE.exec(rawAfter);
            let title: string;
            let extraLines: string[] = [];

            if (m && rawAfter.length > m[1].length + 5) {
                // Title is just the capitalized words
                title = cleanTitle(m[1].trim()) || m[1].trim();
                // Rest is body content
                const body = rawAfter.substring(m[0].length).trim();
                if (body) {
                    // Try to split body by numbered items (1. 2. 3.)
                    const items = body.split(/(?=\d+[.)]\s)/).map(s => s.trim()).filter(Boolean);
                    extraLines = items.length > 0 ? items : [body];
                }
            } else {
                title = cleanTitle(rawAfter) || rawAfter;
            }

            current = { title, icon: getIcon(title), lines: extraLines };
        } else if (current) {
            current.lines.push(line);
        } else {
            // Content before first heading → "VAT / IOSS" intro section
            if (!sections.length && !current) {
                current = { title: "VAT / IOSS", icon: "%", lines: [line] };
            } else if (current) {
                current.lines.push(line);
            }
        }
    }
    if (current) sections.push(current);
    return sections;
}

/** Render content lines within a section */
const SectionContent = ({ lines }: { lines: string[] }) => (
    <div className="space-y-1.5 mt-1">
        {lines.map((line, i) => {
            const t = line.trim();
            if (!t) return <div key={i} className="h-1" />;

            if (t.startsWith("⚠") || t.startsWith("❌")) {
                return <Warn key={i}>{t}</Warn>;
            }

            if (t.startsWith("•") || t.startsWith("- ")) {
                const text = t.replace(/^[•\-]\s*/, "");
                return (
                    <div key={i} className="flex gap-2 text-[12px] text-navy/80 leading-relaxed pl-1">
                        <span className="text-primary mt-0.5 shrink-0">•</span>
                        <span dangerouslySetInnerHTML={{
                            __html: text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                        }} />
                    </div>
                );
            }

            if (/^[\(（]?\d+[\)）\.]|^[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮]/.test(t)) {
                return (
                    <div key={i} className="text-[12px] text-navy/80 leading-relaxed pl-4">
                        <span dangerouslySetInnerHTML={{
                            __html: t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                        }} />
                    </div>
                );
            }

            if (t.startsWith("**") && t.endsWith("**")) {
                return <p key={i} className="text-[12px] font-semibold text-navy mt-1">{t.replace(/\*\*/g, "")}</p>;
            }

            if (t.startsWith("http")) {
                return (
                    <a key={i} href={t} target="_blank" rel="noopener noreferrer"
                        className="text-[11px] text-primary underline break-all pl-1 block">{t}</a>
                );
            }

            return (
                <p key={i} className="text-[12px] text-navy/80 leading-relaxed"
                    dangerouslySetInnerHTML={{
                        __html: t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                    }}
                />
            );
        })}
    </div>
);

interface GSheetPolicyRouteProps {
    gid: string;
    children: React.ReactNode;
}

export default function GSheetPolicyRoute({ gid, children }: GSheetPolicyRouteProps) {
    const { sheets } = useLarkPricingContext();
    const { effectiveLanguage: lang } = useI18n();

    // Always use the structured hardcoded content (children) for all languages.
    // The route components already have EN/VI/ZH content with clean sections.
    return <>{children}</>;
}
