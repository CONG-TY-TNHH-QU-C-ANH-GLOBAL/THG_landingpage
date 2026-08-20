import { useCmsPricingTable } from "@/hooks/useCmsContent";
import { useI18n } from "@/lib/i18n";

/** One column of a `weight_grid` rate card, as authored in the CMS Rate Card
 *  Builder. `semantic`/`currency` are optional: CMS infers them from the label
 *  when absent, and we mirror that only as far as formatting needs. */
interface RateColumn {
    code: string;
    label: string;
    position: number;
    type?: "number" | "currency" | "text";
    semantic?: string;
    currency?: string;
}

type CellValue = string | number | null | undefined;
type RateRow = Record<string, CellValue>;

function readColumns(schema: unknown): RateColumn[] {
    if (!schema || typeof schema !== "object") return [];
    const cols = (schema as { columns?: unknown }).columns;
    if (!Array.isArray(cols)) return [];
    return cols
        .filter((c): c is RateColumn =>
            !!c && typeof c === "object" && typeof (c as RateColumn).code === "string")
        .slice()
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
}

function isMoney(col: RateColumn): boolean {
    if (col.semantic) return col.semantic === "money_usd" || col.semantic === "money_vnd";
    if (col.currency) return true;
    return col.type === "currency";
}

/** Cents appear only on amounts that have them: $4.50 and $6.05 keep both
 *  digits, $84 and $16,901 stay whole. A uniform 2-dp column would read as
 *  false precision on the whole-dollar rows, and 0-dp would print "$4.5". */
function formatCell(value: CellValue, col: RateColumn): string {
    if (value === null || value === undefined || value === "") return "—";
    if (!isMoney(col)) return String(value);
    const num = typeof value === "number" ? value : Number(String(value).replace(/[$,]/g, ""));
    if (!Number.isFinite(num)) return String(value);
    const isUsd = col.semantic === "money_usd" || (col.currency ?? "").toUpperCase() === "USD";
    if (!isUsd) return num.toLocaleString("vi-VN");
    const dp = Number.isInteger(num) ? 0 : 2;
    return `$${num.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;
}

/**
 * Renders one CMS rate card by slug, driven entirely by the table's own column
 * schema — add or reorder a column in the Rate Card Builder and this follows,
 * with no landing deploy.
 *
 * DRAFT AND ARCHIVED TABLES RENDER NOTHING. GET /api/v1/pricing does not filter
 * on status, so a draft's numbers are already fetchable from the API; gating
 * here is what keeps unreviewed rates off the public page. It also lets this
 * page ship before operations has verified the figures — the section simply
 * stays in its "being updated" state until the table is flipped to live.
 */
export function CmsRateTable({ slug }: Readonly<{ slug: string }>) {
    const { t } = useI18n();
    const { data, isLoading } = useCmsPricingTable(slug);
    const table = data?.table;

    if (isLoading) {
        return (
            <div className="bg-white border border-[var(--pricing-border)] rounded-xl p-8 text-center">
                <div className="w-6 h-6 mx-auto rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    const columns = readColumns(table?.schema);
    const rows = Array.isArray(table?.data) ? (table.data as RateRow[]) : [];

    if (!table || table.status !== "live" || columns.length === 0 || rows.length === 0) {
        return (
            <div className="bg-white border border-[var(--pricing-border)] rounded-xl p-8 text-center text-muted-foreground text-sm italic">
                {t("chinhngach.table_pending")}
            </div>
        );
    }

    return (
        <div className="bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-3 bg-navy">
                <p className="text-white font-bold text-[13px]">{table.name}</p>
                {table.description && (
                    <p className="text-white/70 text-[12px] mt-0.5">{table.description}</p>
                )}
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[13px]">
                    <thead>
                        <tr className="bg-[#FAFAF8]">
                            {columns.map((col) => (
                                <th
                                    key={col.code}
                                    className="px-5 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)] whitespace-nowrap"
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr
                                key={i}
                                className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors"
                            >
                                {columns.map((col) => {
                                    const money = isMoney(col);
                                    return (
                                        <td
                                            key={col.code}
                                            className={`px-5 py-3 ${money ? "font-bold text-navy notranslate" : "text-foreground/80"}`}
                                            translate={money ? "no" : undefined}
                                        >
                                            {formatCell(row[col.code], col)}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/** Renders the `meta_kv` companion table (schedules, CFS addresses, exclusion
 *  lists) as a definition list. Keys are looked up through i18n so the labels
 *  stay translatable while the values remain operator-authored. */
export function CmsMetaList({ slug, keys }: Readonly<{ slug: string; keys: readonly string[] }>) {
    const { t } = useI18n();
    const { data } = useCmsPricingTable(slug);
    const table = data?.table;
    const meta = (table && table.status === "live" && table.data && typeof table.data === "object" && !Array.isArray(table.data)
        ? (table.data as Record<string, string>)
        : {});
    const present = keys.filter((k) => typeof meta[k] === "string" && meta[k].trim() !== "");
    if (present.length === 0) return null;

    return (
        <dl className="bg-white border border-[var(--pricing-border)] rounded-xl divide-y divide-[var(--pricing-border)]">
            {present.map((k) => (
                <div key={k} className="px-5 py-3 sm:flex sm:gap-4">
                    <dt className="text-[12px] font-bold uppercase tracking-wide text-muted-foreground sm:w-48 sm:flex-shrink-0">
                        {t(`chinhngach.meta_${k}`)}
                    </dt>
                    <dd className="text-[13px] text-foreground/80 mt-0.5 sm:mt-0">{meta[k]}</dd>
                </div>
            ))}
        </dl>
    );
}
