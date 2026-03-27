import { useMemo } from "react";
import { usePricingStore } from "@/stores/usePricingStore";
import { AlertTriangle } from "lucide-react";
import type { BulkZone } from "@/data/pricingData";

const WEIGHT_TIERS = [12, 21, 71, 100];

interface BulkTableProps {
  data: BulkZone[];
  title?: string;
}

const BulkTable = ({ data, title }: BulkTableProps) => {
  const store = usePricingStore();

  const activeTier = useMemo(() => {
    const w = store.weight ?? 0;
    if (w >= 100) return 100;
    if (w >= 71) return 71;
    if (w >= 21) return 21;
    return 12;
  }, [store.weight]);

  const isUnderMin = (store.weight ?? 0) > 0 && (store.weight ?? 0) < 12;

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {title && (
        <div className="bg-navy p-3 text-primary-foreground font-bold uppercase text-sm tracking-wide">{title}</div>
      )}

      {isUnderMin && (
        <div className="p-3 bg-destructive/10 border-b border-destructive/20 flex items-center gap-2 text-sm text-destructive font-medium">
          <AlertTriangle className="w-4 h-4" />
          Khối lượng ({store.weight}kg) chưa đạt mức tối thiểu ≥ 12KG. Cước vẫn tính theo mốc 12KG.
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary text-foreground uppercase text-xs font-bold">
            <tr>
              <th className="px-4 py-3 border-r border-border/30">Khu vực / Zone</th>
              {WEIGHT_TIERS.map((tier) => (
                <th
                  key={tier}
                  className={`px-4 py-3 border-r border-border/30 transition-all ${
                    activeTier === tier ? "bg-primary/20 text-primary" : ""
                  }`}
                >
                  ≥ {tier} KG
                </th>
              ))}
              <th className="px-4 py-3">Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {data.map((zone) => (
              <tr key={zone.name} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3 font-semibold text-foreground border-r border-border/30">{zone.name}</td>
                {WEIGHT_TIERS.map((tier) => (
                  <td
                    key={tier}
                    className={`px-4 py-3 border-r border-border/30 tabular-nums ${
                      activeTier === tier ? "font-bold text-primary bg-primary/5" : "text-muted-foreground"
                    }`}
                  >
                    {store.formatPrice(zone.prices[tier])} / kg
                  </td>
                ))}
                <td className="px-4 py-3 text-muted-foreground text-xs">{zone.sla}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BulkTable;
