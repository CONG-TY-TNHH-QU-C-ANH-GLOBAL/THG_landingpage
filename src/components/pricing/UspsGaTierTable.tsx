// USPS Ground Advantage label rate card, laid out like the source workbook:
// one tab per tier, each with the title line, the volume/unit line and a
// 24-row table (No., weight ceiling in oz, grams, Zone 1-9). Every tier's panel
// is in the DOM (inactive ones are `hidden`) so the prerendered HTML carries
// all five rate cards.

import { useState } from "react";

import { USPS_GA_ZONE_KEYS, type UspsGaRow } from "@/data/uspsGaLabelRates";
import { useI18n } from "@/lib/i18n";
import "@/lib/i18n/translations/label";

const TIERS = [1, 2, 3, 4, 5] as const;

const money = (n: number) => n.toFixed(2);

export function UspsGaTierTable({ tiers }: { tiers: UspsGaRow[][] }) {
  const { t } = useI18n();
  const [active, setActive] = useState(1);

  return (
    <div className="max-w-6xl mx-auto">
      <div role="tablist" aria-label={t("label_page.rates_tabs")} className="flex flex-wrap justify-center gap-2 mb-6">
        {TIERS.map((n) => (
          <button
            key={n}
            type="button"
            role="tab"
            id={`usps-ga-tab-${n}`}
            aria-controls={`usps-ga-panel-${n}`}
            aria-selected={active === n}
            onClick={() => setActive(n)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              active === n ? "bg-navy text-white shadow" : "glass-card text-navy hover:bg-secondary"
            }`}
          >
            {t("label_page.tier")} {n}
          </button>
        ))}
      </div>

      {TIERS.map((n) => (
        <div
          key={n}
          role="tabpanel"
          id={`usps-ga-panel-${n}`}
          aria-labelledby={`usps-ga-tab-${n}`}
          hidden={active !== n}
          className="glass-card rounded-2xl p-4 md:p-6"
        >
          <h3 className="text-center text-base md:text-lg font-bold uppercase tracking-wide text-navy">
            {t("label_page.rates_title")} {n}
          </h3>
          <p className="mt-1 mb-4 text-center text-sm text-navy/70">
            {t("label_page.rates_volume_prefix")} {t(`label_page.rates_volume_t${n}`)} · {t("label_page.rates_unit")}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm tabular-nums">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="px-2 py-2 text-center font-semibold">{t("label_page.rates_col_no")}</th>
                  <th className="px-2 py-2 text-left font-semibold">{t("label_page.rates_col_weight")}</th>
                  <th className="px-2 py-2 text-right font-semibold">{t("label_page.rates_col_gram")}</th>
                  {USPS_GA_ZONE_KEYS.map((_, z) => (
                    <th key={z} className="px-2 py-2 text-right font-semibold whitespace-nowrap">
                      Zone {z + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(tiers[n - 1] ?? []).map((row, i) => (
                  <tr key={row.oz} className="border-b border-border even:bg-secondary/40">
                    <td className="px-2 py-1.5 text-center text-navy/60">{i + 1}</td>
                    <td className="px-2 py-1.5 font-medium text-navy whitespace-nowrap">{row.oz} oz</td>
                    <td className="px-2 py-1.5 text-right text-navy/70">{row.g}</td>
                    {USPS_GA_ZONE_KEYS.map((key) => (
                      <td key={key} className="px-2 py-1.5 text-right text-navy">
                        {money(row[key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
