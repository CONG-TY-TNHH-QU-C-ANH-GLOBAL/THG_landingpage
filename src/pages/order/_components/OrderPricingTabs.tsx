import { useState } from "react";

import { LeadFormDialog } from "@/components/lead/LeadFormDialog";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";

import { bulkRows, epacketRows } from "../data/pricing";

/** Interactive ePacket vs Bulk pricing tabs. Owns its own `activeTab` state
 *  (no need to lift — nothing outside this section reads which tab is open). */
export function OrderPricingTabs() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<"ep" | "bulk">("ep");

  return (
    <section className="py-24 bg-navy text-white">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[hsl(var(--gold))] uppercase tracking-[0.2em] mb-3">{t("op.price_eye")}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{t("op.price_title")}</h2>
            <p className="text-white/50 mt-3 max-w-xl mx-auto">{t("op.price_sub")}</p>
          </div>
        </ScrollReveal>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-8">
          <button
            onClick={() => setActiveTab("ep")}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${
              activeTab === "ep" ? "bg-primary text-white shadow-lg" : "bg-white/10 text-white/60 hover:bg-white/15"
            }`}
          >
            ✈️ {t("op.tab_ep")}
          </button>
          <button
            onClick={() => setActiveTab("bulk")}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${
              activeTab === "bulk" ? "bg-primary text-white shadow-lg" : "bg-white/10 text-white/60 hover:bg-white/15"
            }`}
          >
            🚢 {t("op.tab_bulk")}
          </button>
        </div>

        {activeTab === "ep" && (
          <ScrollReveal>
            <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="bg-primary/10 px-6 py-4">
                <div className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--gold))] mb-1">{t("op.ep_lane")}</div>
                <h3 className="text-lg font-bold text-white">{t("op.ep_title")}</h3>
                <p className="text-xs text-white/50 mt-1">{t("op.ep_note")}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/50">{t("op.th_weight")}</th>
                      <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/50">🇺🇸 USA (USD)</th>
                      <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/50">$/kg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {epacketRows.map((r, i) => (
                      <tr key={i} className={`border-b border-white/5 ${i % 2 === 1 ? "bg-white/[0.02]" : ""}`}>
                        <td className="px-5 py-2.5 text-white/75">{r.wt}</td>
                        <td className={`px-5 py-2.5 text-right font-bold ${r.gold ? "text-[hsl(var(--gold))]" : "text-white"}`}>{r.price}</td>
                        <td className="px-5 py-2.5 text-right text-white/40 text-xs">{r.perKg}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-3 border-t border-white/10 text-xs text-white/30 leading-relaxed">{t("op.ep_foot")}</div>
            </div>
          </ScrollReveal>
        )}

        {activeTab === "bulk" && (
          <ScrollReveal>
            <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="bg-[hsl(var(--gold))]/7 px-6 py-4">
                <div className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--gold))] mb-1">{t("op.bulk_lane")}</div>
                <h3 className="text-lg font-bold text-white">{t("op.bulk_title")}</h3>
                <p className="text-xs text-white/50 mt-1">{t("op.bulk_note")}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/50">{t("op.th_zone")}</th>
                      <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/50">12kg+</th>
                      <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/50">21kg+</th>
                      <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/50">71kg+</th>
                      <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/50">100kg+</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkRows.map((r, i) => (
                      <tr key={i} className={`border-b border-white/5 ${i % 2 === 1 ? "bg-white/[0.02]" : ""}`}>
                        <td className="px-5 py-3">
                          <div className="font-bold text-white">{r.zone}</div>
                          <div className="text-xs text-white/40">{t(r.zipKey)}</div>
                        </td>
                        <td className="px-5 py-3 text-right font-bold text-white">{r.p12}</td>
                        <td className="px-5 py-3 text-right text-white/75">{r.p21}</td>
                        <td className="px-5 py-3 text-right text-white/75">{r.p71}</td>
                        <td className="px-5 py-3 text-right font-bold text-[hsl(var(--gold))]">{r.p100}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-3 border-t border-white/10 text-xs text-white/30 leading-relaxed">
                <p>{t("op.bulk_foot1")}</p>
                <p className="mt-1">{t("op.bulk_foot2")}</p>
              </div>
            </div>
          </ScrollReveal>
        )}

        <div className="text-center mt-8">
          <LeadFormDialog
            sourcePage="/thg-order#pricing"
            trigger={
              <button
                type="button"
                className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl text-base font-bold transition-all hover:bg-primary/90 hover:-translate-y-1 shadow-lg"
              >
                💬 {t("op.price_cta")}
              </button>
            }
          />
        </div>
      </div>
    </section>
  );
}
