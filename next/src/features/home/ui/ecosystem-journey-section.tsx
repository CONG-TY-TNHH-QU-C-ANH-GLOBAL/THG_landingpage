// Parity source: src/components/EcosystemJourneySection.tsx
import Link from "next/link";
import { Plane, Warehouse, Printer, ArrowRight } from "lucide-react";

import ScrollReveal from "@/shared/ui/scroll-reveal";
import { SectionHeader } from "@/shared/ui/section-header";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";
import type { Locale } from "@/shared/i18n";

/**
 * EcosystemJourneySection — "land & expand" roadmap (audit Gap 3).
 *
 * Distinct from ServicesSection (which lists services) and SellerTypesSection:
 * this shows the *growth path* across services — start with Express, expand to
 * Warehouse, scale into Fulfill/POD — so sellers see the LTV roadmap of staying
 * inside one ecosystem. Fully hardcoded + i18n; links to existing service pages.
 */
const STEPS = [
  {
    icon: Plane,
    path: "/thg-express",
    tagKey: "ecosystem.step1_tag",
    titleKey: "ecosystem.step1_title",
    descKey: "ecosystem.step1_desc",
    whenKey: "ecosystem.step1_when",
    ctaKey: "ecosystem.step1_cta",
  },
  {
    icon: Warehouse,
    path: "/thg-warehouse",
    tagKey: "ecosystem.step2_tag",
    titleKey: "ecosystem.step2_title",
    descKey: "ecosystem.step2_desc",
    whenKey: "ecosystem.step2_when",
    ctaKey: "ecosystem.step2_cta",
  },
  {
    icon: Printer,
    path: "/thg-fulfill",
    tagKey: "ecosystem.step3_tag",
    titleKey: "ecosystem.step3_title",
    descKey: "ecosystem.step3_desc",
    whenKey: "ecosystem.step3_when",
    ctaKey: "ecosystem.step3_cta",
  },
] as const;

const EcosystemJourneySection = ({ copy, lang }: Readonly<{ copy: MarketingCopy; lang: Locale }>) => {
  const t = tFrom(copy);
  const lp = (path: string) => `/${lang}${path}`;

  return (
    <section className="py-28 relative overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="absolute -top-20 left-0 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <SectionHeader
            size="xl"
            className="mb-16"
            eyebrow={t("ecosystem.eyebrow")}
            title={t("ecosystem.title")}
            description={t("ecosystem.subtitle")}
          />
        </ScrollReveal>

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-4 items-stretch">
          {STEPS.map((step, i) => (
            <div key={step.path} className="contents">
              <ScrollReveal delay={i * 120}>
                <div className="relative h-full flex flex-col rounded-2xl border border-border/60 bg-card p-7 shadow-sm hover:shadow-lg transition-all duration-500">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent bg-accent/10 rounded-full px-3 py-1">
                      {`${i + 1}. ${t(step.tagKey)}`}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-navy mb-2 tracking-tight">{t(step.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t(step.descKey)}</p>

                  <div className="mt-auto space-y-4">
                    <p className="text-[13px] text-navy/80 font-medium border-l-2 border-primary/40 pl-3 italic">
                      {t(step.whenKey)}
                    </p>
                    <Link prefetch={false}
                      href={lp(step.path)}
                      className="inline-flex items-center gap-1.5 text-[13px] font-bold text-primary hover:gap-2.5 transition-all"
                    >
                      {t(step.ctaKey)} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Connector arrow to next step (desktop) */}
                  {i < STEPS.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 w-6 h-6 text-primary/40 z-20" aria-hidden="true" />
                  )}
                </div>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EcosystemJourneySection;
