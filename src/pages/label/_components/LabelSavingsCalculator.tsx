import { useState } from "react";

import { LeadFormDialog } from "@/components/lead/LeadFormDialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import "@/lib/i18n/translations/label";
import { estimateLabelSavings, formatUsd } from "../labelCalc";

interface SliderProps {
  id: string;
  label: string;
  output: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}

function CalcSlider({ id, label, output, min, max, step, value, onChange }: Readonly<SliderProps>) {
  return (
    <div className="mb-6 last:mb-0">
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 mb-2 text-sm font-semibold text-navy">
        <span>{label}</span>
        <output htmlFor={id} className="font-bold text-primary tabular-nums">
          {output}
        </output>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[hsl(var(--gold))] cursor-pointer"
      />
    </div>
  );
}

export function LabelSavingsCalculator() {
  const { t } = useI18n();
  const [labels, setLabels] = useState(2000);
  const [price, setPrice] = useState(6.5);
  const [discount, setDiscount] = useState(3);
  const est = estimateLabelSavings(labels, price, discount);

  const rows: [string, string][] = [
    [t("label_page.calc_retail"), formatUsd(est.retail)],
    [t("label_page.calc_th"), formatUsd(est.withThg)],
    [t("label_page.calc_year"), formatUsd(est.yearly)],
  ];

  return (
    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 max-w-5xl mx-auto">
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <CalcSlider
          id="label-calc-n"
          label={t("label_page.calc_n")}
          output={labels.toLocaleString("en-US")}
          min={50}
          max={20000}
          step={50}
          value={labels}
          onChange={setLabels}
        />
        <CalcSlider
          id="label-calc-c"
          label={t("label_page.calc_c")}
          output={`$${price.toFixed(2)}`}
          min={3}
          max={30}
          step={0.25}
          value={price}
          onChange={setPrice}
        />
        <CalcSlider
          id="label-calc-d"
          label={t("label_page.calc_d")}
          output={`${discount}%`}
          min={1}
          max={5}
          step={0.5}
          value={discount}
          onChange={setDiscount}
        />
        <p className="text-xs text-navy/60 leading-relaxed mt-4">{t("label_page.calc_note")}</p>
      </div>

      <div className="rounded-2xl p-6 md:p-8 bg-navy text-white flex flex-col" aria-live="polite">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">{t("label_page.calc_month")}</p>
        <p className="text-5xl font-extrabold tracking-tight text-[hsl(var(--gold))] my-2 tabular-nums">
          {formatUsd(est.monthly)}
        </p>
        <dl className="mt-3 divide-y divide-white/15 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-3 py-3">
              <dt className="text-white/75">{label}</dt>
              <dd className="font-bold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
        <LeadFormDialog
          sourcePage="/thg-label#calc"
          primaryService="label"
          surface="label-inline"
          trigger={
            <Button className="mt-auto w-full rounded-full bg-[hsl(var(--gold))] hover:bg-[hsl(var(--gold-dark))] text-white border-0 py-6 font-bold">
              {t("label_page.calc_cta")}
            </Button>
          }
        />
      </div>
    </div>
  );
}
