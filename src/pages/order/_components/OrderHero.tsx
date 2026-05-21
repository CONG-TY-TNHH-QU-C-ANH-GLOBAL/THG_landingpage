import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LeadFormDialog } from "@/components/lead/LeadFormDialog";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";

import { stats } from "../data/stats";

/** Hero section for /thg-order. Gold-themed gradient with badge + headline +
 *  dual CTAs + a stats card. Distinct from the other Service pages so the
 *  layout stays inline rather than going through a shared PageHero. */
export function OrderHero() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(36_30%_96%)] via-[hsl(36_25%_93%)] to-[hsl(36_20%_90%)] pt-32 pb-24">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(36 45% 65%) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute inset-0 shimmer-effect opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent opacity-40" />
      <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-[hsl(var(--gold))]/8 rounded-full blur-[150px]" />
      <div className="absolute bottom-[10%] left-0 w-[400px] h-[400px] bg-[hsl(var(--gold))]/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <ScrollReveal direction="scale">
          <div className="inline-flex items-center gap-3 rounded-full px-5 py-2 text-sm border border-[hsl(var(--gold))]/25 mb-8 bg-[hsl(var(--gold))]/10 shadow-[0_4px_12px_rgba(216,180,111,0.15)] glow-pulse">
            <span className="font-medium text-navy">{t("order_page.badge_taobao")}</span>
            <span className="text-[hsl(var(--gold))]/50">|</span>
            <span className="font-medium text-navy">{t("order_page.badge_direct")}</span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-navy leading-[1.1] mb-6">
            {t("op.hero_t1")} <br className="hidden md:block" />
            <span className="italic text-gradient-gold">{t("op.hero_hl")}</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="text-base sm:text-lg text-navy/70 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            {t("op.hero_desc")}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <div className="flex justify-center gap-4 flex-wrap">
            <LeadFormDialog
              sourcePage="/thg-order"
              trigger={
                <Button className="bg-[hsl(var(--gold))] hover:bg-[hsl(var(--gold-dark))] text-white rounded-full px-8 py-6 text-base gap-2 shadow-[0_8px_24px_hsl(36_45%_42%/0.4)] hover:shadow-[0_12px_32px_hsl(36_45%_42%/0.6)] transition-all duration-500 font-semibold tracking-wide hover:-translate-y-1">
                  🚀 {t("op.hero_cta")}
                </Button>
              }
            />
            <Button
              variant="outline"
              className="rounded-full px-8 py-6 text-base border-[hsl(var(--gold))]/40 text-navy hover:bg-[hsl(var(--gold))]/10 transition-all duration-300 font-semibold"
              onClick={() => document.getElementById("how-section")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t("op.hero_cta2")} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 mt-12 md:mt-16 glass-card border border-border/40 rounded-3xl p-6 md:p-8 max-w-4xl mx-auto bg-white/60 shadow-[var(--shadow-3d)]">
            {stats.map((s, i) => (
              <div key={i} className="text-center px-4 md:px-6">
                <p className="text-3xl font-bold text-gradient-gold tabular-nums">{s.val}</p>
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/50 mt-2">{t(s.labelKey)}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-card to-transparent" />
    </section>
  );
}
