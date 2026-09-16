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
    <section className="overflow-hidden rounded-[16px] border border-border/60 bg-card shadow-sm">
      <div className="flex items-center gap-3 bg-navy px-5 py-4 text-white">
        <Calculator className="h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />
        <div>
          <h2 className="rate-eyebrow">{t("domestic.estimator_title")}</h2>
          <p className="mt-1 text-xs text-white/60">{t("domestic.estimator_desc")}</p>
        </div>
      </div>
      <div className="grid gap-6 p-5 md:grid-cols-2 md:p-6">
        <div className="grid grid-cols-2 gap-4 self-start">
          <label className="block">
            <span className="rate-eyebrow block text-muted-foreground">{t("domestic.weight_lbs")}</span>
            <input type="number" min="0" step="0.1" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground" />
          </label>
          <label className="block">
            <span className="rate-eyebrow block text-muted-foreground">Zone</span>
            <select value={zone} onChange={(e) => setZone(Number(e.target.value))} className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground">
              {Array.from({ length: 8 }, (_, index) => index + 1).map((item) => <option key={item} value={item}>Zone {item}</option>)}
            </select>
          </label>
          {[t("domestic.length"), t("domestic.width"), t("domestic.height")].map((label, index) => {
            const value = [length, width, height][index];
            const setter = [setLength, setWidth, setHeight][index];
            return <label key={label} className="block">
              <span className="rate-eyebrow block text-muted-foreground">{label} (inch)</span>
              <input type="number" min="0" value={value} onChange={(e) => setter(Number(e.target.value))} className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground" />
            </label>;
          })}
          <label className="col-span-2 block">
            <span className="rate-eyebrow block text-muted-foreground">{t("domestic.packaging")}</span>
            <select value={packagingKey} onChange={(e) => setPackagingKey(e.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground">
              {THREE_PL_PACKAGING.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
            </select>
          </label>
        </div>
        <div className="rounded-[14px] bg-secondary/50 p-5" aria-live="polite">
          <p className="rate-eyebrow text-muted-foreground">{t("domestic.billable_weight")}</p>
          <p className="mt-1.5 text-2xl font-extrabold text-navy">{estimate.billable.toFixed(2)} lbs</p>
          <div className="mt-5 space-y-2.5 text-[13px]">
            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Pick &amp; pack</span><strong>{estimate.tier ? money(estimate.tier.price) : t("domestic.custom_quote")}</strong></div>
            <div className="flex justify-between gap-4"><span className="text-muted-foreground">{estimate.packaging.label}</span><strong>{estimate.packaging.note === "Included" ? t("domestic.packaging_included") : estimate.packaging.note === "No handling fee" ? t("domestic.no_handling_fee") : money(estimate.packaging.price)}</strong></div>
            <div className="flex justify-between gap-4"><span className="text-muted-foreground">USPS Ground Advantage</span><strong>{estimate.shipping != null ? money(estimate.shipping) : t("domestic.contact")}</strong></div>
          </div>
          <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
            <span className="rate-eyebrow text-muted-foreground">{t("domestic.estimated_total")}</span>
            <strong className="text-3xl font-extrabold leading-none text-primary">{total == null ? t("domestic.contact") : money(total)}</strong>
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">{t("domestic.estimator_disclaimer")}</p>
        </div>
      </div>
    </section>
  );
}
