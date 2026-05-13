import { useMemo } from "react";

import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";
import { useCmsServiceBlocks } from "@/hooks/useCmsContent";

import { shippingLanes as staticShippingLanes } from "../data/shippingLanes";

interface RenderLane {
  emoji: string;
  tag: string;
  time: string;
  title: string;
  features: string[];
  note: string;
}

/** 3-lane shipping compare (Air/Express/Sea) + a navy "volume weight"
 *  explainer card below it. The explainer is conceptually a separate
 *  section but visually sits inside the same gradient band, so it stays
 *  colocated here rather than living in its own file. */
export function OrderShippingLanes() {
  const { t, language } = useI18n();
  const cms = useCmsServiceBlocks({ page_slug: "thg-order", locale: language, kind: "shipping_lane" });

  const lanes = useMemo<RenderLane[]>(() => {
    const rows = cms.data?.blocks ?? [];
    if (rows.length > 0) {
      return rows.map((b) => {
        const features = Array.isArray(b.payload.features)
          ? (b.payload.features as unknown[]).filter((x): x is string => typeof x === "string")
          : [];
        return {
          emoji: b.icon ?? "•",
          tag: typeof b.payload.tag === "string" ? b.payload.tag : "",
          time: typeof b.payload.time === "string" ? b.payload.time : "",
          title: b.title ?? "",
          features,
          note: typeof b.payload.note === "string" ? b.payload.note : "",
        };
      });
    }
    return staticShippingLanes.map((l) => ({
      emoji: l.emoji,
      tag: t(l.tagKey),
      time: t(l.timeKey),
      title: t(l.titleKey),
      features: l.features.map((fk) => t(fk)),
      note: t(l.noteKey),
    }));
  }, [cms.data, t]);

  return (
    <section className="py-20 md:py-24 bg-card">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16">
            <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-3">{t("op.ship_eye")}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("op.ship_title")}</h2>
            <p className="text-navy/70 font-medium mt-4 max-w-xl mx-auto leading-relaxed">{t("op.ship_sub")}</p>
          </div>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {lanes.map((lane, i) => (
            <ScrollReveal key={i} delay={i * 100} className="h-full">
              <div className="glass-card rounded-2xl p-7 hover-lift h-full border-2 border-primary/20 flex flex-col bg-white">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl flex-shrink-0">{lane.emoji}</span>
                  <div>
                    <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{lane.tag}</span>
                    <div className="text-2xl font-extrabold text-primary mt-1">{lane.time}</div>
                  </div>
                </div>
                <h3 className="text-[17px] font-bold text-navy mb-5 h-[48px] line-clamp-2">{lane.title}</h3>

                <div className="flex-1 flex flex-col gap-3 text-[14px] text-muted-foreground font-medium mb-6">
                  {lane.features.map((f, fi) => (
                    <div key={fi} className="flex items-start gap-2.5">
                      <span className="flex-shrink-0 mt-[2px]">{fi < lane.features.length - 1 ? "✅" : lane.emoji === "🚢" ? "⚠️" : "✅"}</span>
                      <span className="leading-relaxed">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto p-4 bg-primary/5 rounded-xl text-[13px] text-muted-foreground">
                  <span className="mr-1.5">💡</span>
                  <strong>{lane.note}</strong>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Volume weight explainer */}
        <ScrollReveal delay={200}>
          <div className="bg-navy rounded-2xl p-8 max-w-3xl mx-auto mt-10 text-center">
            <h3 className="text-lg font-bold text-white mb-2">{t("op.vol_title")}</h3>
            <p className="text-white/50 text-sm mb-6">{t("op.vol_sub")}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                <div className="text-[hsl(var(--gold))] text-xs font-bold uppercase tracking-wider mb-2">🇻🇳 Vietnam → USA</div>
                <div className="text-white font-bold text-lg">L × W × H</div>
                <div className="text-white/40 text-sm my-1">{t("op.vol_div")}</div>
                <div className="text-[hsl(var(--gold))] font-extrabold text-3xl">5,000</div>
                <div className="text-white/40 text-xs mt-1">{t("op.vol_result")}</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                <div className="text-[hsl(var(--gold))] text-xs font-bold uppercase tracking-wider mb-2">🇨🇳 China → USA</div>
                <div className="text-white font-bold text-lg">L × W × H</div>
                <div className="text-white/40 text-sm my-1">{t("op.vol_div")}</div>
                <div className="text-[hsl(var(--gold))] font-extrabold text-3xl">6,000</div>
                <div className="text-white/40 text-xs mt-1">{t("op.vol_result")}</div>
              </div>
            </div>
            <div className="bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))]/25 rounded-xl p-3 mt-4 text-sm text-white/75">
              {t("op.vol_ex")} <strong className="text-[hsl(var(--gold))]">1.1 kg</strong>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
