// Who We Serve (Open Design artifact "SELLER PATHWAYS" composition) — editorial
// split, not a four-card grid. Content: the four verified production seller groups
// (sellers.t1–t4) — the prototype's three invented pathway personas are NOT used
// (IMPLEMENTATION_BASELINE.md: production content authority). Server Component.
import ScrollReveal from "@/shared/ui/scroll-reveal";
import { SectionHeader } from "@/shared/ui/section-header";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";

const GROUPS = [1, 2, 3, 4] as const;

const WhoWeServeSection = ({ copy }: Readonly<{ copy: MarketingCopy }>) => {
  const t = tFrom(copy);
  return (
    <section id="who-we-serve" className="py-28 relative overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-[2fr_3fr] gap-10 lg:gap-16 items-start">
          <ScrollReveal direction="left">
            <SectionHeader
              align="left"
              className="mb-0 lg:sticky lg:top-28"
              eyebrow={t("sellers.subtitle")}
              title={t("sellers.title")}
              titleHighlight={t("sellers.title_highlight")}
            />
          </ScrollReveal>

          <div>
            {GROUPS.map((i, idx) => (
              <ScrollReveal key={i} delay={idx * 90}>
                <div className="group grid grid-cols-[3rem_1fr] gap-4 py-7 border-t border-border last:border-b items-baseline">
                  <span
                    className="font-display font-extrabold text-3xl text-navy/10 tabular-nums group-hover:text-primary/30 transition-colors"
                    aria-hidden="true"
                  >
                    {`0${i}`}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-navy tracking-tight mb-1.5">{t(`sellers.t${i}_title`)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">{t(`sellers.t${i}_desc`)}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeServeSection;
