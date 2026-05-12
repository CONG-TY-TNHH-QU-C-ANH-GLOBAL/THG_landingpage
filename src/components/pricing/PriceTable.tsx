import { useState, useMemo, useRef, useEffect, useCallback, useId } from "react";
import { ChevronDown, ChevronUp, FileSpreadsheet, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { PricingRow } from "@/components/pricing/types";

// xlsx + jspdf weigh ~290KB combined; lazy-load only when user actually exports.
async function lazyExportToExcel(config: import("@/lib/exportUtils").ExportConfig) {
    const { exportToExcel } = await import("@/lib/exportUtils");
    exportToExcel(config);
}

const PriceTable = ({ title, badge, note, data, columns, rate = 1, currencySymbol = "$", sla }: {
    title: string; badge?: React.ReactNode; note?: React.ReactNode;
    data: PricingRow[]; columns: { key: string; label: string }[];
    rate?: number; currencySymbol?: string;
    sla?: Record<string, string>;
}) => {
    const { t, tVi } = useI18n();
    const [isExpanded, setIsExpanded] = useState(false);
    // useId — stable across SSR/prerender + client hydration. Previously used
    // Math.random which produced different IDs on server vs client and tripped
    // React hydration warnings once we started prerendering.
    const tableId = `table-price-${useId()}`;
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 2);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        checkScroll();
        el.addEventListener("scroll", checkScroll, { passive: true });
        const ro = new ResizeObserver(checkScroll);
        ro.observe(el);
        return () => { el.removeEventListener("scroll", checkScroll); ro.disconnect(); };
    }, [checkScroll, data, columns]);

    const scrollBy = (dir: number) => {
        scrollRef.current?.scrollBy({ left: dir * 120, behavior: "smooth" });
    };

    // CMS may serialize numeric cells as strings (e.g. "147758"). Coerce defensively.
    const toNumeric = (v: unknown): number | null => {
        if (typeof v === "number" && Number.isFinite(v)) return v;
        if (typeof v === "string") {
            const cleaned = v.trim().replace(/\s/g, "").replace(/,/g, "");
            if (/^-?\d+(\.\d+)?$/.test(cleaned)) {
                const n = Number(cleaned);
                if (Number.isFinite(n)) return n;
            }
        }
        return null;
    };

    const exportConfig = useMemo(() => {
        if (!data || data.length === 0) return { filename: title, headers: [], rows: [] };
        const headers = [t("pt.weight_header"), ...columns.map(c => c.label)];
        const rows = data.map((row) => {
            return [
                row.kg ?? row.weight ?? "—",
                ...columns.map(c => {
                    const val = row[c.key];
                    if (val === null || val === undefined || val === "") return "—";
                    const num = toNumeric(val);
                    if (num !== null) {
                        if (currencySymbol === "₫") {
                            return `${Math.round(num * rate).toLocaleString("vi-VN")} ₫`;
                        }
                        return `${currencySymbol}${(num * rate).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
                    }
                    return val;
                })
            ];
        });
        return { filename: title, headers, rows };
    }, [data, columns, title, currencySymbol, rate]);

    if (!data || data.length === 0) return null;

    const displayData = isExpanded ? data : data.slice(0, 6);

    return (
        <div className="bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden shadow-sm">
            <div className="bg-navy px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-bold text-[13px]">📋 {title}</span>
                    {badge && <span className="bg-[rgba(184,146,42,0.25)] text-[#D4A843] text-[12px] font-bold px-2 py-0.5 rounded-full">{badge}</span>}
                </div>
                <div className="flex items-center gap-2 ml-auto">
                    {note && <span className="text-[#9CA3AF] text-[12px] mr-2">{note}</span>}
                    <button onClick={() => lazyExportToExcel(exportConfig)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title={t("pt.export_excel")}>
                        <FileSpreadsheet size={14} />
                    </button>
                </div>
            </div>

            {/* Scroll hint for mobile */}
            {(canScrollLeft || canScrollRight) && (
                <div className="flex items-center justify-between px-3 py-1.5 bg-[#FFF8E7] border-b border-[var(--pricing-border)] md:hidden">
                    <span className="text-[10px] text-amber-700 font-medium">{t("pt.swipe_hint")}</span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => scrollBy(-1)}
                            disabled={!canScrollLeft}
                            className="p-1 rounded bg-white border border-amber-200 disabled:opacity-30 transition-opacity"
                        >
                            <ChevronLeft size={12} className="text-amber-700" />
                        </button>
                        <button
                            onClick={() => scrollBy(1)}
                            disabled={!canScrollRight}
                            className="p-1 rounded bg-white border border-amber-200 disabled:opacity-30 transition-opacity"
                        >
                            <ChevronRight size={12} className="text-amber-700" />
                        </button>
                    </div>
                </div>
            )}

            {/* Horizontally-scrollable table with sticky weight column */}
            <div className="relative">
                <div ref={scrollRef} className="overflow-x-auto scroll-smooth">
                    <table id={tableId} className="w-full border-collapse text-[12px] md:text-[13px]">
                        <thead>
                            <tr className="bg-[#FAFAF8]">
                                <th className="px-2 py-2 md:py-2.5 text-center text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-[var(--pricing-border)] border-r border-r-[var(--pricing-border)] whitespace-nowrap sticky left-0 bg-[#FAFAF8] z-10 min-w-[48px] shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]">KG</th>
                                {columns.map((c, ci) => (
                                    <th key={c.key} className={`px-2 md:px-3 py-2 md:py-2.5 text-center text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-[var(--pricing-border)] whitespace-nowrap min-w-[100px] ${ci < columns.length - 1 ? "border-r border-r-[var(--pricing-border)]" : ""}`}>{c.label}</th>
                                ))}
                            </tr>
                            {sla && Object.keys(sla).length > 0 && (
                                <tr className="bg-[#FFF8E7]">
                                    <td className="px-2 py-1 md:py-1.5 text-[9px] md:text-[11px] text-muted-foreground italic border-b border-[var(--pricing-border)] border-r border-r-[var(--pricing-border)] sticky left-0 bg-[#FFF8E7] z-10 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]">—</td>
                                    {columns.map((c, ci) => {
                                        const slaVal = sla[c.key] || sla[c.key.toLowerCase()] || "";
                                        return (
                                            <td key={c.key} className={`px-2 md:px-3 py-1 md:py-1.5 text-center text-[9px] md:text-[11px] text-amber-700 font-medium italic border-b border-[var(--pricing-border)] whitespace-nowrap ${ci < columns.length - 1 ? "border-r border-r-[var(--pricing-border)]" : ""}`}>
                                                {slaVal ? `⏱ ${slaVal}` : "—"}
                                            </td>
                                        );
                                    })}
                                </tr>
                            )}
                        </thead>
                        <tbody>
                            {displayData.map((row: any, i: number) => (
                                <tr key={i} className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors">
                                    <td className="px-2 py-1.5 md:py-2 text-center font-bold whitespace-nowrap sticky left-0 bg-white z-10 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)] border-r border-r-[var(--pricing-border)]">{row.kg ?? row.weight ?? "—"}</td>
                                    {columns.map((c, ci) => {
                                        const val = row[c.key];
                                        const isNull = val === null || val === undefined || val === "";
                                        const num = isNull ? null : toNumeric(val);
                                        const isContact = typeof val === 'string' && val.includes('Liên hệ');
                                        return (
                                            <td key={c.key} className={`px-2 md:px-3 py-1.5 md:py-2 text-center whitespace-nowrap ${ci < columns.length - 1 ? "border-r border-r-[var(--pricing-border)]" : ""} ${isNull ? "text-muted-foreground/30" : isContact ? "text-primary font-bold" : "font-bold"}`}>
                                                {isNull ? (
                                                    <span className="inline-block px-1 py-0 bg-muted/20 rounded text-[11px]">—</span>
                                                ) : num !== null ? (
                                                    <span className="notranslate" translate="no">
                                                        {currencySymbol === "₫"
                                                            ? `${Math.round(num * rate).toLocaleString("vi-VN")} ₫`
                                                            : `${currencySymbol}${(num * rate).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`}
                                                    </span>
                                                ) : val}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Fade edges to hint scrollability */}
                {canScrollRight && (
                    <div className="absolute top-0 right-0 bottom-0 w-6 pointer-events-none bg-gradient-to-l from-white to-transparent z-20 md:hidden" />
                )}
            </div>

            {/* Expand/Collapse Buttons */}
            {!isExpanded && data.length > 6 && (
                <div className="border-t border-[var(--pricing-border)]">
                    <button onClick={() => setIsExpanded(true)} className="w-full py-3 md:py-2.5 text-[13px] font-bold text-primary hover:bg-[#FFFBF0] transition-colors flex items-center justify-center gap-1">
                        {tVi("pricing.btn_expand").replace("{count}", (data.length - 6).toString())} <ChevronDown size={14} />
                    </button>
                </div>
            )}
            {isExpanded && data.length > 6 && (
                <div className="border-t border-[var(--pricing-border)]">
                    <button onClick={() => setIsExpanded(false)} className="w-full py-3 md:py-2.5 text-[13px] font-bold text-primary hover:bg-[#FFFBF0] transition-colors flex items-center justify-center gap-1">
                        {tVi("pricing.btn_collapse")} <ChevronUp size={14} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default PriceTable;
