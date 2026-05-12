import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, FileSpreadsheet, FileText, FileIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";

// xlsx + jspdf weigh ~290KB combined; lazy-load only when user actually exports.
async function lazyExportToExcel(config: import("@/lib/exportUtils").ExportConfig) {
    const { exportToExcel } = await import("@/lib/exportUtils");
    exportToExcel(config);
}

const CompactAccordionTable = ({ headers, data, renderRow, title = "Data Table", extractRowData }: { headers: string[], data: any[], renderRow: (row: any, i: number) => React.ReactNode, title?: string, extractRowData?: (row: any) => (string | number)[] }) => {
    const { tVi } = useI18n();
    const [isExpanded, setIsExpanded] = useState(false);
    const tableId = useMemo(() => "table-compact-" + Math.random().toString(36).substring(2, 9), []);

    const exportConfig = useMemo(() => {
        const safe = data ?? [];
        const rows = extractRowData ? safe.map(extractRowData) : safe.map((r: any) => Object.values(r) as string[]);
        return { filename: title, headers, rows };
    }, [data, headers, title, extractRowData]);

    if (!data || data.length === 0) return null;

    const displayData = isExpanded ? data : data.slice(0, 6);

    return (
        <div className="relative">
            <div className="absolute top-[-36px] right-0 flex items-center gap-1">
                <button onClick={() => lazyExportToExcel(exportConfig)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Xuất Excel">
                    <FileSpreadsheet size={13} />
                </button>
            </div>
            <table id={tableId} className="w-full border-collapse text-[13px]">
                <thead>
                    <tr className="bg-[#FAFAF8]">
                        {headers.map((h, i) => (
                            <th key={i} className="px-4 py-3 text-left text-[12px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)] whitespace-nowrap">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {displayData.map((row, i) => renderRow(row, i))}
                    {!isExpanded && data.length > 6 && (
                        <tr>
                            <td colSpan={100} className="p-0 border-t border-[var(--pricing-border)]">
                                <button onClick={() => setIsExpanded(true)} className="w-full py-2.5 text-[13px] font-bold text-primary hover:bg-[#FFFBF0] transition-colors flex items-center justify-center gap-1">
                                    {tVi("pricing.btn_expand").replace("{count}", (data.length - 6).toString())} <ChevronDown size={14} />
                                </button>
                            </td>
                        </tr>
                    )}
                    {isExpanded && data.length > 6 && (
                        <tr>
                            <td colSpan={100} className="p-0 border-t border-[var(--pricing-border)]">
                                <button onClick={() => setIsExpanded(false)} className="w-full py-2.5 text-[13px] font-bold text-primary hover:bg-[#FFFBF0] transition-colors flex items-center justify-center gap-1">
                                    {tVi("pricing.btn_collapse")} <ChevronUp size={14} />
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CompactAccordionTable;
