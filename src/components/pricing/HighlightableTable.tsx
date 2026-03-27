import { useMemo } from "react";
import { usePricingStore } from "@/stores/usePricingStore";
import type { PriceRow } from "@/data/pricingData";

interface Column {
  key: string;
  label: string;
}

interface HighlightableTableProps {
  columns: Column[];
  data: PriceRow[];
}

const HighlightableTable = ({ columns, data }: HighlightableTableProps) => {
  const store = usePricingStore();

  const isRowActive = (rowWeight: number) => {
    if (!store.weight) return false;
    return Math.abs(rowWeight - store.weight) < 0.01;
  };

  const visibleColumns = useMemo(() => {
    if (!store.destination || store.destination === "all") return columns;
    const target = columns.find((c) => c.key === store.destination);
    return target ? [target] : columns;
  }, [store.destination, columns]);

  return (
    <div className="overflow-x-auto relative">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-navy text-primary-foreground uppercase text-xs">
          <tr>
            <th className="px-4 py-3 border-r border-primary-foreground/10 sticky left-0 bg-navy z-10">Cân nặng</th>
            {visibleColumns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 border-r border-primary-foreground/10 transition-all duration-300 ${
                  store.destination === col.key
                    ? "bg-primary/60 shadow-inner"
                    : store.destination && store.destination !== "all"
                    ? "opacity-50"
                    : ""
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => {
            const active = isRowActive(row.kg);
            return (
              <tr
                key={idx}
                className={`border-b border-border/30 transition-colors duration-200 hover:bg-secondary/30 ${
                  active ? "bg-primary/5 border-primary/20" : ""
                }`}
              >
                <td
                  className={`px-4 py-2.5 font-semibold border-r border-border/30 sticky left-0 transition-all bg-card ${
                    active ? "!bg-primary/5 text-primary" : "text-foreground"
                  }`}
                >
                  {row.kg} KG
                </td>
                {visibleColumns.map((col) => {
                  const val = row[col.key];
                  const isCellActive = active && store.destination === col.key;
                  const isColActive = store.destination === col.key;
                  return (
                    <td
                      key={col.key}
                      className={`px-4 py-2.5 border-r border-border/30 tabular-nums transition-all duration-300 ${
                        isCellActive
                          ? "font-extrabold text-primary bg-primary/10 text-base shadow-inner"
                          : !active && isColActive
                          ? "font-semibold text-primary bg-primary/5"
                          : store.destination && store.destination !== "all" && !isColActive
                          ? "opacity-30 text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {val != null ? store.formatPrice(val as number) : "—"}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default HighlightableTable;
