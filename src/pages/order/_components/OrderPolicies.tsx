import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";

import { policies } from "../data/policies";

export function OrderPolicies() {
  const { t } = useI18n();

  return (
    <section className="py-20 md:py-24 bg-background">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16">
            <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-3">{t("op.pol_eye")}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("op.pol_title")}</h2>
            <p className="text-navy/70 font-medium mt-4 max-w-xl mx-auto leading-relaxed">{t("op.pol_sub")}</p>
          </div>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {policies.map((pol, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className="glass-card rounded-2xl p-6 hover-lift h-full border border-border/50">
                <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">{t(pol.tagKey)}</span>
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">{pol.icon}</div>
                  <h3 className="text-base font-bold text-navy pt-1">{t(pol.titleKey)}</h3>
                </div>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground mt-3">
                  {pol.items.map((ik, ii) => (
                    <div key={ii}>{t(ik)}</div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
