// Why THG (Open Design artifact "WHY THG" — "Operational advantages, not marketing
// claims" composition) — editorial split with manifest-style capability rows instead
// of the previous six icon cards. All copy is the existing verified production
// adv.a1–a6 set plus the brand promise line. Server Component.
import ScrollReveal from "@/shared/ui/scroll-reveal";
import { SectionHeader } from "@/shared/ui/section-header";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";

const ADVANTAGES = [1, 2, 3, 4, 5, 6] as const;

const WhyThgSection = ({ copy }: Readonly<{ copy: MarketingCopy }>) => {
  const t = tFrom(copy);
  return (
    <section id="why" className="py-28 relative overflow-hidden bg-card">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <SectionHeader
            size="xl"
            align="left"
            className="mb-6 max-w-2xl"
            eyebrow={t("adv.subtitle")}
            title={t("adv.title")}
            titleHighlight={t("adv.title_highlight")}
          />
        </ScrollReveal>
        <ScrollReveal delay={80}>
          <p className="text-[length:var(--step-lead)] text-navy/80 font-medium border-l-2 border-primary/50 pl-4 max-w-2xl mb-14">
            {t("brand.promise")}
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-x-12">
          {ADVANTAGES.map((i, idx) => (
            <ScrollReveal key={i} delay={idx * 70}>
              <div className="flex items-baseline gap-4 py-6 border-t border-border">
                <span className="font-mono text-[11px] text-primary tabular-nums flex-shrink-0 w-6" aria-hidden="true">
                  {`0${i}`}
                </span>
                <div>
                  <h3 className="text-base font-bold text-navy tracking-tight mb-1.5">{t(`adv.a${i}_title`)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(`adv.a${i}_desc`)}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyThgSection;
