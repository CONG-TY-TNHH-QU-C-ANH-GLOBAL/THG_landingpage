// Shared step-card list for the service pages: icon chip + step number +
// title + description in a glass card. Used by the Fulfill and Warehouse
// process sections (Express uses a different numbered-circle layout and
// keeps its own markup). Pages own the section wrapper, heading, and copy.

import type { LucideIcon } from "lucide-react";

import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";

export interface ServiceProcessStep {
  num: string;
  titleKey: string;
  descKey: string;
  icon: LucideIcon;
}

export function ServiceProcessSteps({
  steps,
  numPrefix,
}: Readonly<{
  steps: ServiceProcessStep[];
  /** Optional localized label rendered before the step number (e.g. "Bước"). */
  numPrefix?: string;
}>) {
  const { t } = useI18n();
  return (
    <div className="space-y-4">
      {steps.map((s, i) => (
        <ScrollReveal key={s.num} delay={i * 80}>
          <div className="flex gap-5 glass-card rounded-2xl p-5 hover-lift">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
              <s.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-bold text-primary/40">
                  {numPrefix ? `${numPrefix} ${s.num}` : s.num}
                </span>
                <h3 className="text-base font-bold text-navy tracking-tight">{t(s.titleKey)}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(s.descKey)}</p>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
