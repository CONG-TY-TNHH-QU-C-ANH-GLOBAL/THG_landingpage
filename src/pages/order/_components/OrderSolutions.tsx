import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";

import { solutions } from "../data/solutions";

export function OrderSolutions() {
  const { t } = useI18n();

  return (
    <section className="py-20 md:py-24 bg-card">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-12 md:mb-16">
            <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-3">{t("op.sol_eye")}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("op.sol_title")}</h2>
            <p className="text-navy/70 font-medium mt-4 max-w-xl leading-relaxed">{t("op.sol_sub")}</p>
          </div>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {solutions.map((s, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className="glass-card rounded-2xl p-6 hover-lift h-full border border-border/50">
                <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">{t(s.tagKey)}</span>
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">{s.icon}</div>
                  <h3 className="text-base font-bold text-navy pt-1">{t(s.titleKey)}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(s.descKey)}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
