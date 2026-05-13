import { useMemo } from "react";

import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";
import { useCmsServiceBlocks } from "@/hooks/useCmsContent";

import { painPoints as staticPainPoints } from "../data/painPoints";

interface RenderItem {
  emoji: string;
  title: string;
  description: string;
}

export function OrderPainPoints() {
  const { t, language } = useI18n();
  const cms = useCmsServiceBlocks({ page_slug: "thg-order", locale: language, kind: "pain_point" });

  // CMS rows arrive in `position` order; static rows use the original i18n
  // key fallback. The renderer below only cares about the merged shape.
  const items = useMemo<RenderItem[]>(() => {
    const rows = cms.data?.blocks ?? [];
    if (rows.length > 0) {
      return rows.map((b) => ({
        emoji: b.icon ?? "•",
        title: b.title ?? "",
        description: b.description ?? "",
      }));
    }
    return staticPainPoints.map((p) => ({
      emoji: p.emoji,
      title: t(p.titleKey),
      description: t(p.descKey),
    }));
  }, [cms.data, t]);

  return (
    <section className="py-20 md:py-24 bg-card">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16">
            <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-3">{t("op.pain_eye")}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("op.pain_title")}</h2>
            <p className="text-navy/70 font-medium mt-4 max-w-xl mx-auto leading-relaxed">{t("op.pain_sub")}</p>
          </div>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {items.map((p, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className="glass-card rounded-2xl p-6 hover-lift h-full border border-border/50">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">{p.emoji}</div>
                  <h3 className="text-base font-bold text-navy pt-1">{p.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
