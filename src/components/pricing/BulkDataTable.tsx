import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, FileSpreadsheet, FileText, FileIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { exportToExcel } from "@/lib/exportUtils";

const BulkDataTable = ({ title, badge, data, rate = 1, currencySymbol = "$" }: {
    title: string; badge: React.ReactNode; data: any[]; rate?: number; currencySymbol?: string;
}) => {
    const { tVi } = useI18n();
    const [isExpanded, setIsExpanded] = useState(false);
    const tableId = useMemo(() => "table-bulk-" + Math.random().toString(36).substring(2, 9), []);
    if (!data || data.length === 0) return null;

    const weightKeys = data[0]?.prices ? Object.keys(data[0].prices).sort((a, b) => Number(a) - Number(b)) : [];

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
        const headers = ["Vùng (Zone)", ...weightKeys.map(k => k + " kg"), "Thời gian (SLA)"];
        const rows = data.map((row: any) => [
            row.name,
            ...weightKeys.map(k => {
                const val = row.prices[k];
                if (val === null || val === undefined || val === "") return "—";
                const num = toNumeric(val);
                if (num === null) return String(val);
                if (currencySymbol === "₫") {
                    return `${Math.round(num * rate).toLocaleString("vi-VN")} ₫`;
                }
                return `${currencySymbol}${(num * rate).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
            }),
            row.sla || "—"
        ]);
        return { filename: title, headers, rows };
    }, [data, weightKeys, title, currencySymbol, rate]);
    const displayData = isExpanded ? data : data.slice(0, 6);

    const fmtPrice = (price: unknown) => {
        if (price === null || price === undefined || price === "") return "—";
        const num = toNumeric(price);
        if (num === null) return String(price);
        const sym = currencySymbol;
        if (sym === "₫") {
            return `${Math.round(num * rate).toLocaleString("vi-VN")} ₫`;
        }
        return `${sym}${(num * rate).toLocaleString("en-US", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        })}`;
    };

    return (
        <div className="bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden shadow-sm">
            <div className="bg-navy px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
                <span className="text-white font-bold text-[13px] flex items-center gap-2">
                    {title}
                    <span className="bg-[rgba(184,146,42,0.25)] text-[#D4A843] text-[12px] font-bold px-2 py-0.5 rounded-full">{badge}</span>
                </span>
                <div className="flex items-center gap-1.5 ml-auto">
                    <button onClick={() => exportToExcel(exportConfig)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Xuất Excel"><FileSpreadsheet size={14} /></button>
                </div>
            </div>
            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col gap-3 p-4 bg-secondary/10">
                {displayData.map((row: any, i: number) => (
                    <div key={i} className="bg-white border border-[var(--pricing-border)] rounded-xl p-4 shadow-sm relative">
                        <div className="font-bold text-navy text-[15px] mb-3 pb-2 border-b border-[var(--pricing-border)]/50">
                            <span className="notranslate">{row.name}</span>
                            <div className="text-[12px] text-muted-foreground font-normal mt-0.5">⏱ {row.sla}</div>
                        </div>
                        <div className="space-y-2">
                            {weightKeys.map(w => (
                                <div key={w} className="flex justify-between items-center">
                                    <span className="text-[13px] font-medium text-navy/70 notranslate" translate="no">{w} KG+</span>
                                    <span className="text-[14px] font-bold text-navy whitespace-nowrap">
                                        <span className="notranslate" translate="no">{fmtPrice(row.prices?.[w])}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table id={tableId} className="w-full border-collapse text-[13px]">
                    <thead>
                        <tr className="bg-[#FAFAF8]">
                            <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-muted-foreground border-b border-[var(--pricing-border)] whitespace-nowrap">Zone / SLA</th>
                            {weightKeys.map(w => (
                                <th key={w} className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-muted-foreground border-b border-[var(--pricing-border)] whitespace-nowrap">
                                    <span className="notranslate" translate="no">{w} KG+</span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {displayData.map((row: any, i: number) => (
                            <tr key={i} className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors">
                                <td className="px-4 py-2.5 whitespace-nowrap">
                                    <div className="font-bold text-navy text-[13px]"><span className="notranslate">{row.name}</span></div>
                                    <div className="text-[12px] text-muted-foreground mt-0.5">⏱ {row.sla}</div>
                                </td>
                                {weightKeys.map(w => (
                                    <td key={w} className="px-4 py-2.5 font-bold whitespace-nowrap">
                                        <span className="notranslate" translate="no">{fmtPrice(row.prices?.[w])}</span>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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

export default BulkDataTable;
