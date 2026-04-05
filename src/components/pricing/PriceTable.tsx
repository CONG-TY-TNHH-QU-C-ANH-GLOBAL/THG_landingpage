import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, FileSpreadsheet, FileText, FileIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { exportToExcel } from "@/lib/exportUtils";

const PriceTable = ({ title, badge, note, data, columns, rate = 1, currencySymbol = "$", sla }: {
    title: string; badge?: React.ReactNode; note?: React.ReactNode;
    data: any[]; columns: { key: string; label: string }[];
    rate?: number; currencySymbol?: string;
    sla?: Record<string, string>;
}) => {
    const { tVi } = useI18n();
    const [isExpanded, setIsExpanded] = useState(false);
    const tableId = useMemo(() => "table-price-" + Math.random().toString(36).substring(2, 9), []);
    if (!data || data.length === 0) return null;

    const exportConfig = useMemo(() => {
        const headers = ["Cân Nặng (KG)", ...columns.map(c => c.label)];
        const rows = data.map((row: any) => {
            return [
                row.kg ?? row.weight ?? "—",
                ...columns.map(c => {
                    const val = row[c.key];
                    if (val === null || val === undefined) return "—";
                    if (typeof val === "number") {
                        // Match currency symbol exactly as shown on web table
                        if (currencySymbol === "₫") {
                            return `${Math.round(val * rate).toLocaleString("vi-VN")} ₫`;
                        }
                        return `${currencySymbol}${(val * rate).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
                    }
                    return val;
                })
            ];
        });
        return { filename: title, headers, rows };
    }, [data, columns, title, currencySymbol, rate]);

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
                    <button onClick={() => exportToExcel(exportConfig)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Xuất Excel">
                        <FileSpreadsheet size={14} />
                    </button>
                </div>
            </div>
            {/* Mobile Cards (Hidden on md+) */}
            <div className="md:hidden flex flex-col gap-3 p-4 bg-secondary/10">
                {displayData.map((row: any, i: number) => (
                    <div key={i} className="bg-white border border-[var(--pricing-border)] rounded-xl p-4 shadow-sm relative">
                        <div className="font-bold text-navy text-[15px] mb-3 pb-2 border-b border-[var(--pricing-border)]/50 flex justify-between">
                            <span>Cân Nặng:</span>
                            <span className="text-primary notranslate">{row.kg ?? row.weight ?? "—"} kg</span>
                        </div>
                        <div className="space-y-2">
                            {columns.map(c => {
                                const val = row[c.key];
                                const isNull = val === null || val === undefined;
                                const isContact = typeof val === 'string' && val.includes('Liên hệ');
                                return (
                                    <div key={c.key} className="flex justify-between items-center">
                                        <span className="text-[13px] font-medium text-navy/70">{c.label}</span>
                                        <span className={`text-[14px] whitespace-nowrap ${isNull ? "text-muted-foreground/30" : isContact ? "text-primary font-bold" : "font-bold text-navy"}`}>
                                            {isNull ? (
                                                <span className="inline-block px-1.5 py-0 bg-muted/20 rounded text-[12px] backdrop-blur-sm">—</span>
                                            ) : typeof val === "number" ? (
                                                <span className="notranslate" translate="no">
                                                    {currencySymbol === "₫"
                                                        ? `${Math.round(val * rate).toLocaleString("vi-VN")} ₫`
                                                        : `${currencySymbol}${(val * rate).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`}
                                                </span>
                                            ) : val}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table (Hidden on mobile) */}
            <div className="hidden md:block overflow-x-auto">
                <table id={tableId} className="w-full border-collapse text-[13px]">
                    <thead>
                        <tr className="bg-[#FAFAF8]">
                            <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-muted-foreground border-b border-[var(--pricing-border)] whitespace-nowrap sticky left-0 bg-[#FAFAF8] z-10">Cân Nặng (KG)</th>
                            {columns.map(c => (
                                <th key={c.key} className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-muted-foreground border-b border-[var(--pricing-border)] whitespace-nowrap">{c.label}</th>
                            ))}
                        </tr>
                        {/* SLA working days sub-header */}
                        {sla && Object.keys(sla).length > 0 && (
                            <tr className="bg-[#FFF8E7]">
                                <td className="px-4 py-1.5 text-[11px] text-muted-foreground italic border-b border-[var(--pricing-border)]">—</td>
                                {columns.map(c => {
                                    const slaVal = sla[c.key] || sla[c.key.toLowerCase()] || "";
                                    return (
                                        <td key={c.key} className="px-4 py-1.5 text-[11px] text-amber-700 font-medium italic border-b border-[var(--pricing-border)] whitespace-nowrap">
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
                                <td className="px-4 py-2.5 font-medium whitespace-nowrap sticky left-0 bg-white z-10">{row.kg ?? row.weight ?? "—"}</td>
                                {columns.map(c => {
                                    const val = row[c.key];
                                    const isNull = val === null || val === undefined;
                                    const isContact = typeof val === 'string' && val.includes('Liên hệ');
                                    return (
                                        <td key={c.key} className={`px-4 py-2.5 whitespace-nowrap ${isNull ? "text-muted-foreground/30" : isContact ? "text-primary font-bold" : "font-bold"}`}>
                                            {isNull ? (
                                                <span className="inline-block px-1.5 py-0 bg-muted/20 rounded text-[12px] backdrop-blur-sm">—</span>
                                            ) : typeof val === "number" ? (
                                                <span className="notranslate" translate="no">
                                                    {currencySymbol === "₫"
                                                        ? `${Math.round(val * rate).toLocaleString("vi-VN")} ₫`
                                                        : `${currencySymbol}${(val * rate).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`}
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
