import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";

import { THREE_PL_PACKAGING, THREE_PL_PACK_TIERS, THREE_PL_USPS_RATES } from "@/data/threePlPricing";
import { useI18n } from "@/lib/i18n";

const money = (value: number) => `$${value.toFixed(2)}`;

export function ThreePlEstimator() {
  const { t } = useI18n();
  const [weight, setWeight] = useState(1);
  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [zone, setZone] = useState(1);
  const [packagingKey, setPackagingKey] = useState("poly");

  const estimate = useMemo(() => {
    const dimensional = length && width && height ? (length * width * height) / 166 : 0;
    const billable = Math.max(weight, dimensional);
    const tier = THREE_PL_PACK_TIERS.find((item) => billable <= item.maxLbs);
    const packaging = THREE_PL_PACKAGING.find((item) => item.key === packagingKey) ?? THREE_PL_PACKAGING[0];
    const shipping = THREE_PL_USPS_RATES.find((row) => billable * 16 <= row[0])?.[zone];
    return { billable, tier, packaging, shipping };
  }, [height, length, packagingKey, weight, width, zone]);

  const total = estimate.tier && estimate.shipping != null
    ? estimate.tier.price + estimate.packaging.price + estimate.shipping
    : null;

  return (
    <section className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden mb-7">
      <div className="bg-navy px-5 py-4 text-white flex items-center gap-3">
        <Calculator className="h-5 w-5 text-primary" aria-hidden="true" />
        <div>
          <h2 className="font-bold">{t("domestic.estimator_title")}</h2>
          <p className="text-xs text-white/70">{t("domestic.estimator_desc")}</p>
        </div>
      </div>
      <div className="grid gap-6 p-5 md:grid-cols-[1.3fr_1fr]">
        <div className="grid grid-cols-2 gap-4">
          <label className="text-sm font-medium">{t("domestic.weight_lbs")}
            <input type="number" min="0" step="0.1" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2" />
          </label>
          <label className="text-sm font-medium">Zone
            <select value={zone} onChange={(e) => setZone(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2">
              {Array.from({ length: 8 }, (_, index) => index + 1).map((item) => <option key={item} value={item}>Zone {item}</option>)}
            </select>
          </label>
          {[t("domestic.length"), t("domestic.width"), t("domestic.height")].map((label, index) => {
            const value = [length, width, height][index];
            const setter = [setLength, setWidth, setHeight][index];
            return <label key={label} className="text-sm font-medium">{label} (inch)
              <input type="number" min="0" value={value} onChange={(e) => setter(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2" />
            </label>;
          })}
          <label className="text-sm font-medium">{t("domestic.packaging")}
            <select value={packagingKey} onChange={(e) => setPackagingKey(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2">
              {THREE_PL_PACKAGING.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
            </select>
          </label>
        </div>
        <div className="rounded-xl bg-secondary/40 p-5" aria-live="polite">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{t("domestic.billable_weight")}</p>
          <p className="text-2xl font-bold text-navy">{estimate.billable.toFixed(2)} lbs</p>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4"><span>Pick & pack</span><strong>{estimate.tier ? money(estimate.tier.price) : t("domestic.custom_quote")}</strong></div>
            <div className="flex justify-between gap-4"><span>{estimate.packaging.label}</span><strong>{estimate.packaging.note === "Included" ? t("domestic.packaging_included") : estimate.packaging.note === "No handling fee" ? t("domestic.no_handling_fee") : money(estimate.packaging.price)}</strong></div>
            <div className="flex justify-between gap-4"><span>USPS Ground Advantage</span><strong>{estimate.shipping != null ? money(estimate.shipping) : t("domestic.contact")}</strong></div>
          </div>
          <div className="mt-5 border-t border-border pt-4 flex items-end justify-between">
            <span className="font-semibold">{t("domestic.estimated_total")}</span>
            <strong className="text-3xl text-primary">{total == null ? t("domestic.contact") : money(total)}</strong>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{t("domestic.estimator_disclaimer")}</p>
        </div>
      </div>
    </section>
  );
}
