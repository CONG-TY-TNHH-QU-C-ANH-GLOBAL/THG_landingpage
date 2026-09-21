import { useMemo, useState } from "react";
import { Calculator, Info, PackageCheck } from "lucide-react";

import { useCmsPricingTable } from "@/hooks/useCmsContent";
import { useI18n } from "@/lib/i18n";
import {
  calculateFormalEstimate,
  type EstimateSurcharge,
  type FormalEstimateMode,
} from "@/components/pricing/chinhNgachEstimator";

type Cell = string | number | null | undefined;
type Row = Record<string, Cell>;

function liveRows(query: ReturnType<typeof useCmsPricingTable>): Row[] {
  const table = query.data?.table;
  return table?.status === "live" && Array.isArray(table.data) ? table.data as Row[] : [];
}

function numberCell(row: Row | undefined, key: string): number {
  const value = row?.[key];
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function rowLabel(row: Row, mode: FormalEstimateMode): string {
  if (mode === "matson-lcl") return `${row.origin ?? ""} → ${row.destination ?? ""}`;
  if (mode === "sea-lcl") return String(row.route ?? "");
  return `${row.destination ?? ""} · ${row.carrier ?? ""}`;
}

const money = (value: number) => value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

export function ChinhNgachCostEstimator() {
  const { t } = useI18n();
  const matsonQuery = useCmsPricingTable("chinhNgachMatsonLcl");
  const seaQuery = useCmsPricingTable("chinhNgachSeaLcl");
  const airQuery = useCmsPricingTable("chinhNgachAir");
  const surchargeQuery = useCmsPricingTable("chinhNgachMatsonSurcharge");
  const customsQuery = useCmsPricingTable("chinhNgachCustoms");

  const [mode, setMode] = useState<FormalEstimateMode>("sea-lcl");
  const [routeIndex, setRouteIndex] = useState(0);
  const [weightKg, setWeightKg] = useState(500);
  const [volumeCbm, setVolumeCbm] = useState(1);
  const [customsIndex, setCustomsIndex] = useState(-1);
  const [includeIsf, setIncludeIsf] = useState(false);

  const matsonRows = liveRows(matsonQuery);
  const seaRows = liveRows(seaQuery);
  const airRows = liveRows(airQuery);
  const surchargeRows = liveRows(surchargeQuery);
  const customsRows = liveRows(customsQuery);
  const routeRows = mode === "matson-lcl" ? matsonRows : mode === "sea-lcl" ? seaRows : airRows;
  const selectedRoute = routeRows[Math.min(routeIndex, Math.max(routeRows.length - 1, 0))];
  const selectedCustoms = customsIndex >= 0 ? customsRows[customsIndex] : undefined;

  const estimate = useMemo(() => {
    if (!selectedRoute || (weightKg <= 0 && volumeCbm <= 0)) return null;
    const dense = mode === "matson-lcl" && volumeCbm > 0 && weightKg / volumeCbm > 1_000;
    const freightRate = mode === "matson-lcl"
      ? numberCell(selectedRoute, dense ? "dense_mt" : "light_cbm")
      : mode === "sea-lcl"
        ? numberCell(selectedRoute, "price_wm")
        : numberCell(selectedRoute, weightKg >= 1_000 ? "price_1000kg" : "price_500kg");
    if (freightRate <= 0) return null;

    const surcharges: EstimateSurcharge[] = mode === "matson-lcl"
      ? surchargeRows.flatMap((row) => {
          const label = String(row.fee ?? "");
          if (/ISF/i.test(label) && !includeIsf) return [];
          const rate = numberCell(row, "amount");
          if (rate <= 0) return [];
          return [{ label, rate, basis: /CBM/i.test(String(row.unit ?? "")) ? "cbm" as const : "shipment" as const }];
        })
      : [];

    return calculateFormalEstimate({
      mode,
      weightKg,
      volumeCbm,
      freightRate,
      customsFee: numberCell(selectedCustoms, "fee"),
      surcharges,
    });
  }, [includeIsf, mode, selectedCustoms, selectedRoute, surchargeRows, volumeCbm, weightKg]);

  const handleMode = (next: FormalEstimateMode) => {
    setMode(next);
    setRouteIndex(0);
  };

  const inputClass = "mt-1.5 w-full rounded-lg border border-[var(--pricing-border)] bg-white px-3 py-2.5 text-[13px] text-navy outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy via-[#142b4c] to-[#1c3b63] p-5 text-white sm:p-7">
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-primary/10" />
        <div className="relative flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-navy">
            <Calculator className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">{t("chinhngach.estimate_badge")}</p>
            <h3 className="mt-1 text-xl font-black sm:text-2xl">{t("chinhngach.estimate_title")}</h3>
            <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-white/70">{t("chinhngach.estimate_desc")}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-xl border border-[var(--pricing-border)] bg-white p-4 sm:p-5">
          <h4 className="flex items-center gap-2 text-sm font-black text-navy">
            <PackageCheck className="h-4 w-4 text-primary" aria-hidden="true" />
            {t("chinhngach.estimate_shipment")}
          </h4>
          <div className="mt-4 space-y-4">
            <label className="block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              {t("chinhngach.estimate_mode")}
              <select value={mode} onChange={(event) => handleMode(event.target.value as FormalEstimateMode)} className={inputClass}>
                <option value="matson-lcl">MATSON LCL</option>
                <option value="sea-lcl">Sea LCL</option>
                <option value="air">Air</option>
              </select>
            </label>
            <label className="block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              {t("chinhngach.estimate_route")}
              <select value={Math.min(routeIndex, Math.max(routeRows.length - 1, 0))} onChange={(event) => setRouteIndex(Number(event.target.value))} className={inputClass}>
                {routeRows.map((row, index) => <option key={`${rowLabel(row, mode)}-${index}`} value={index}>{rowLabel(row, mode)}</option>)}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                {t("chinhngach.estimate_weight")}
                <input type="number" min="0" step="1" value={weightKg} onChange={(event) => setWeightKg(Number(event.target.value))} className={inputClass} />
              </label>
              <label className="block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                {t("chinhngach.estimate_volume")}
                <input type="number" min="0" step="0.1" value={volumeCbm} onChange={(event) => setVolumeCbm(Number(event.target.value))} className={inputClass} />
              </label>
            </div>
            <label className="block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              {t("chinhngach.estimate_customs")}
              <select value={customsIndex} onChange={(event) => setCustomsIndex(Number(event.target.value))} className={inputClass}>
                <option value={-1}>{t("chinhngach.estimate_customs_none")}</option>
                {customsRows.map((row, index) => <option key={`${row.lane}-${index}`} value={index}>{String(row.lane)} · {money(numberCell(row, "fee"))}</option>)}
              </select>
            </label>
            {mode === "matson-lcl" && (
              <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-primary/25 bg-[#FFF8E7] px-3 py-2.5 text-[12px] font-semibold text-navy">
                <input type="checkbox" checked={includeIsf} onChange={(event) => setIncludeIsf(event.target.checked)} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                {t("chinhngach.estimate_isf")}
              </label>
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-[var(--pricing-border)] bg-white">
          <div className="bg-navy px-4 py-3.5 sm:px-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-primary">{t("chinhngach.estimate_result")}</p>
            {estimate && <p className="mt-1 text-[12px] text-white/70">{t("chinhngach.estimate_billable")}: <strong className="text-white">{estimate.billableQuantity} {estimate.billableUnit}</strong></p>}
          </div>
          {estimate ? (
            <>
              <div className="divide-y divide-[var(--pricing-border)]">
                {estimate.lines.map((line) => (
                  <div key={`${line.label}-${line.formula}`} className="grid grid-cols-[1fr_auto] gap-4 px-4 py-3 sm:px-5">
                    <div>
                      <p className="text-[12.5px] font-bold text-navy">{line.label}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{line.formula}</p>
                    </div>
                    <p className="self-center font-mono text-[13px] font-black text-emerald-700">{money(line.amount)}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-end justify-between gap-4 bg-[#FFF8E7] px-4 py-4 sm:px-5">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">{t("chinhngach.estimate_subtotal")}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{t("chinhngach.estimate_subtotal_note")}</p>
                </div>
                <p className="whitespace-nowrap font-mono text-xl font-black text-navy">~{money(estimate.subtotal)}</p>
              </div>
            </>
          ) : (
            <p className="p-8 text-center text-sm italic text-muted-foreground">{t("chinhngach.estimate_unavailable")}</p>
          )}
        </section>
      </div>

      <div className="flex gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4 text-[12px] leading-relaxed text-sky-950/75">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" aria-hidden="true" />
        <p><strong className="text-sky-950">{t("chinhngach.estimate_note_label")}</strong> {t("chinhngach.estimate_note")}</p>
      </div>
    </div>
  );
}
