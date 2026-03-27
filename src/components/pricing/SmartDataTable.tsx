import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { usePricingStore } from "@/stores/usePricingStore";
import type { PriceRow } from "@/data/pricingData";

interface Column {
  key: string;
  label: string;
  isMain?: boolean;
  isRaw?: boolean;
}

interface SmartDataTableProps {
  title: string;
  columns: Column[];
  tableData: PriceRow[];
  hideWeight?: boolean;
}

const SmartDataTable = ({ title, columns, tableData, hideWeight }: SmartDataTableProps) => {
  const store = usePricingStore();
  const [localSearchWeight, setLocalSearchWeight] = useState<number | null>(store.globalWeight);

  const filteredData = useMemo(() => {
    if (!localSearchWeight) return tableData;
    for (const row of tableData) {
      if (row.kg >= localSearchWeight) return [row];
    }
    return [];
  }, [localSearchWeight, tableData]);

  const visibleColumns = useMemo(() => {
    if (!store.destination || store.destination === "all") return columns;
    const target = columns.find((c) => c.key === store.destination);
    return target ? [target] : columns;
  }, [store.destination, columns]);

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-navy p-4 flex flex-wrap justify-between items-center gap-4">
        <h3 className="text-primary-foreground font-bold uppercase tracking-wide text-sm">{title}</h3>
        <div className="flex items-center bg-primary-foreground/10 px-3 py-1.5 rounded-lg border border-primary-foreground/20">
          <Search className="w-4 h-4 text-primary-foreground/70" />
          <input
            type="number"
            value={localSearchWeight ?? ""}
            onChange={(e) => setLocalSearchWeight(e.target.value ? Number(e.target.value) : null)}
            placeholder="Lọc KG..."
            step={0.1}
            className="bg-transparent text-primary-foreground placeholder-primary-foreground/50 outline-none ml-2 text-sm w-24"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy text-primary-foreground font-semibold text-xs uppercase border-t border-primary-foreground/10">
            <tr>
              <th className="px-4 py-3 border-r border-primary-foreground/10">STT</th>
              {!hideWeight && (
                <th className="px-4 py-3 border-r border-primary-foreground/10 whitespace-nowrap">Cân nặng</th>
              )}
              {visibleColumns.map((col) => (
                <th key={col.key} className="px-4 py-3 border-r border-primary-foreground/10 whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, idx) => {
              const isActive = store.globalWeight !== null && Math.abs(row.kg - store.globalWeight) < 0.01;
              return (
                <tr
                  key={idx}
                  className={`border-b border-border/50 transition-colors hover:bg-secondary/30 ${
                    isActive ? "bg-primary/5 border-primary/20" : ""
                  }`}
                >
                  <td className="px-4 py-3 border-r border-border/30 text-muted-foreground">{idx + 1}</td>
                  {!hideWeight && (
                    <td
                      className={`px-4 py-3 border-r border-border/30 font-bold whitespace-nowrap ${
                        isActive ? "text-primary bg-primary/5" : "text-foreground"
                      }`}
                    >
                      {row.kg} KG
                    </td>
                  )}
                  {visibleColumns.map((col) => {
                    const val = row[col.key];
                    const isHighlight = isActive && store.destination === col.key;
                    return (
                      <td
                        key={col.key}
                        className={`px-4 py-3 border-r border-border/30 tabular-nums whitespace-nowrap transition-all ${
                          isHighlight
                            ? "font-extrabold text-primary bg-primary/10 text-base"
                            : col.isMain
                            ? "text-primary font-semibold"
                            : "text-foreground"
                        }`}
                      >
                        {val != null ? (col.isRaw ? String(val) : store.formatPrice(val as number)) : "—"}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={columns.length + 2} className="px-4 py-8 text-center text-muted-foreground">
                  Không tìm thấy dữ liệu phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SmartDataTable;
