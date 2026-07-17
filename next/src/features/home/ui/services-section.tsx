// Parity source: src/components/ServicesSection.tsx. Server Component — services arrive
// live-filtered and position-sorted from the FND-005 loader; the client-side loading branch
// is gone (server-rendered), the explicit empty state stays.
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import ScrollReveal from "@/shared/ui/scroll-reveal";
import { SectionHeader } from "@/shared/ui/section-header";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";
import type { Service } from "../models/service";

/** Illustration block per service id. Add new entries here when CMS gets new services. */
const ILLUSTRATIONS: Record<string, () => React.JSX.Element> = {
  "thg-fulfill": () => (
    <div className="relative flex items-center gap-4">
      <div className="w-20 h-24 relative">
        <div className="absolute inset-0 bg-white rounded-lg shadow-md border border-border/30 flex items-center justify-center">
          <span className="text-3xl">👕</span>
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground font-medium">Blank</div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="text-xl animate-pulse">🖨️</div>
        <div className="w-8 h-0.5 bg-primary/30" />
        <span className="text-[9px] text-muted-foreground">POD Print</span>
      </div>
      <div className="w-20 h-24 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg shadow-md border border-primary/30 flex items-center justify-center">
          <span className="text-3xl">👕</span>
        </div>
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-6 h-4 bg-primary/40 rounded-sm flex items-center justify-center">
          <span className="text-[6px] font-bold text-primary-foreground">BRAND</span>
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-primary font-medium">Branded</div>
      </div>
    </div>
  ),
  "thg-express": () => (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1 items-center">
          <span className="text-lg">🇻🇳</span>
          <span className="text-lg">🇨🇳</span>
        </div>
        <div className="relative w-32">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-primary/20 -translate-y-1/2" />
          <div className="absolute top-1/2 -translate-y-1/2 shipping-package-fly">
            <span className="text-2xl">📦</span>
          </div>
          <div className="absolute top-1/2 -translate-y-[150%] shipping-airplane-fly">
            <span className="text-xl">✈️</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <span className="text-lg">🇺🇸</span>
          <span className="text-lg">🇪🇺</span>
        </div>
      </div>
    </div>
  ),
  "thg-warehouse": () => (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-end gap-2">
          <div className="w-28 h-20 bg-navy/10 rounded-t-lg border border-border/40 flex items-center justify-center relative">
            <span className="text-3xl">🏭</span>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary/80 text-primary-foreground text-[8px] font-bold px-2 py-0.5 rounded-full">THG</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="warehouse-truck-arrive">
            <span className="text-xl">🚛</span>
          </div>
          <div className="text-xs text-muted-foreground">PA & NC, USA</div>
          <div className="warehouse-truck-depart">
            <span className="text-xl">🚚</span>
          </div>
        </div>
      </div>
    </div>
  ),
  "thg-order": () => (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center gap-1">
          <span className="text-3xl">🛒</span>
          <span className="text-[10px] text-muted-foreground font-medium">Taobao · 1688</span>
        </div>
        <div className="relative w-24">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-primary/20 -translate-y-1/2" />
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
            <span className="text-xl">📦</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-3xl">🇺🇸</span>
          <span className="text-[10px] text-muted-foreground font-medium">Door delivery</span>
        </div>
      </div>
    </div>
  ),
};

function defaultIllustration(icon: string) {
  const DefaultIllustration = () => <div className="text-6xl">{icon || "🎯"}</div>;
  return DefaultIllustration;
}

const ServicesSection = ({ copy, services }: Readonly<{ copy: MarketingCopy; services: readonly Service[] }>) => {
  const t = tFrom(copy);
  const tVi = t;

  if (services.length === 0) {
    return (
      <section id="services" className="py-28 bg-card relative overflow-hidden">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          {t("services.empty")}
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-28 bg-card relative overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-secondary/50 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <SectionHeader
            size="xl"
            className="mb-6"
            eyebrow={tVi("services.subtitle")}
            title={tVi("services.title")}
            titleHighlight={tVi("services.title_highlight")}
            titleSuffix={tVi("services.title2")}
          />
        </ScrollReveal>
        <ScrollReveal delay={50}>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">{tVi("services.tagline")}</p>
        </ScrollReveal>

        <div className={`grid gap-6 ${services.length === 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3"}`}>
          {services.map((s, i) => {
            const Illustration = ILLUSTRATIONS[s.id] ?? defaultIllustration(s.icon);
            let direction: "left" | "up" | "right" = "up";
            if (i === 0) direction = "left";
            else if (i === services.length - 1) direction = "right";
            return (
              <ScrollReveal key={s.id} delay={i * 120} direction={direction}>
                <div className="group relative rounded-3xl border border-border/60 bg-background overflow-hidden tilt-card h-full flex flex-col">
                  {/* Illustration area */}
                  <div className="relative h-56 bg-secondary/40 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/10" />
                    <Illustration />
                    {s.tagline && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                        <span className="inline-block glass-card rounded-full px-4 py-1.5 text-xs font-medium text-foreground/70">
                          {s.tagline}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-7 flex-1 flex flex-col">
                    {s.heroEyebrow && (
                      <p className="text-xs font-semibold text-accent uppercase tracking-[0.15em] mb-2">{s.heroEyebrow}</p>
                    )}
                    <h3 className="text-2xl font-bold text-navy mb-3 tracking-tight">{s.name}</h3>
                    {s.body && (
                      <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3">{s.body}</p>
                    )}

                    {s.bullets.length > 0 && (
                      <ul className="space-y-2.5 mb-6 flex-1">
                        {s.bullets.slice(0, 3).map((b) => (
                          <li key={b} className="flex items-start gap-2.5 text-sm text-foreground/75">
                            <span className="text-primary mt-0.5 font-bold">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {s.ctaUrl && (
                      <Link prefetch={false}
                        href={s.ctaUrl}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-gold-dark transition-colors group/link"
                      >
                        {s.ctaText || t("services.learn_more")}
                        <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                      </Link>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
