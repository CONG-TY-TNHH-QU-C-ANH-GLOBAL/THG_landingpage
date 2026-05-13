import { useMemo } from "react";

import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";
import { useCmsServiceBlocks } from "@/hooks/useCmsContent";

import { processSteps as staticProcessSteps } from "../data/processSteps";

interface RenderItem {
  num: number;
  emoji: string;
  title: string;
  description: string;
}

export function OrderProcessSteps() {
  const { t, language } = useI18n();
  const cms = useCmsServiceBlocks({ page_slug: "thg-order", locale: language, kind: "process_step" });

  const items = useMemo<RenderItem[]>(() => {
    const rows = cms.data?.blocks ?? [];
    if (rows.length > 0) {
      return rows.map((b, i) => {
        const num = typeof b.payload.num === "number" ? b.payload.num : i + 1;
        return {
          num,
          emoji: b.icon ?? "•",
          title: b.title ?? "",
          description: b.description ?? "",
        };
      });
    }
    return staticProcessSteps.map((s) => ({
      num: s.num,
      emoji: s.emoji,
      title: t(s.titleKey),
      description: t(s.descKey),
    }));
  }, [cms.data, t]);

  return (
    <section id="how-section" className="py-20 md:py-24 bg-background">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16">
            <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-3">{t("op.how_eye")}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("op.how_title")}</h2>
            <p className="text-navy/70 font-medium mt-4 max-w-xl mx-auto leading-relaxed">{t("op.how_sub")}</p>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
          {items.map((s, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="glass-card rounded-2xl p-5 hover-lift h-full text-center border border-border/50">
                <div className="w-12 h-12 rounded-full bg-primary text-white font-bold text-lg flex items-center justify-center mx-auto mb-3 shadow-[0_0_0_6px_rgba(var(--primary-rgb),0.1)]">
                  {s.num}
                </div>
                <div className="text-3xl mb-2">{s.emoji}</div>
                <h3 className="text-sm font-bold text-navy mb-1">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
