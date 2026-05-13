import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";

import { testimonials } from "../data/testimonials";

/** Horizontal-scroll testimonial cards — custom snap layout because the
 *  homepage's centred grid doesn't fit this page's gold-gradient design. */
export function OrderTestimonials() {
  const { t } = useI18n();

  return (
    <section className="py-20 md:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-3">{t("op.testi_eye")}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("op.testi_title")}</h2>
            <p className="text-navy/70 font-medium mt-4 max-w-xl mx-auto leading-relaxed">{t("op.testi_sub")}</p>
          </div>
        </ScrollReveal>
        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin snap-x snap-mandatory items-stretch">
          {testimonials.map((tm, i) => (
            <ScrollReveal key={i} delay={i * 80} className="min-w-[300px] max-w-[320px] flex-shrink-0 snap-start flex">
              <div className="glass-card rounded-2xl p-6 flex-1 hover-lift flex flex-col border border-border/50">
                <div className="text-[hsl(var(--gold))] text-lg mb-3">★★★★★</div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{t(tm.textKey)}</p>
                <div className="flex items-center gap-3 mt-auto pt-3 border-t border-border/30">
                  <img
                    loading="lazy"
                    src={tm.avatar}
                    alt={tm.nameKey}
                    className="w-10 h-10 rounded-full object-cover shadow-sm bg-secondary"
                  />
                  <div>
                    <div className="text-sm font-bold text-navy">{tm.nameKey}</div>
                    <div className="text-xs text-muted-foreground">{tm.locKey}</div>
                    <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full mt-1">
                      {t(tm.tagKey)}
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
