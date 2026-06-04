import { Award, ShieldCheck, Star } from "lucide-react";

import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";

const badges = [
  { icon: Star, nameKey: "trust_badges.badge1_name", valueKey: "trust_badges.badge1_value" },
  { icon: Award, nameKey: "trust_badges.badge2_name", valueKey: "trust_badges.badge2_value" },
  { icon: ShieldCheck, nameKey: "trust_badges.badge3_name", valueKey: "trust_badges.badge3_value" },
] as const;

const TrustBadgesSection = () => {
  const { t } = useI18n();

  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden">
      <div className="absolute -top-24 left-1/3 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em]">{t("trust_badges.eyebrow")}</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("trust_badges.title")}</h2>
            <p className="mt-4 text-base md:text-lg font-semibold text-navy/90">{t("brand.promise")}</p>
            <p className="mt-3 text-muted-foreground">{t("trust_badges.subtitle")}</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {badges.map((badge, idx) => (
            <ScrollReveal key={badge.nameKey} direction="up" delay={idx * 100}>
              <div className="rounded-2xl border border-border/60 bg-card p-6 h-full shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <badge.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{t("trust_badges.placeholder")}</p>
                <h3 className="mt-2 text-xl font-bold text-navy">{t(badge.nameKey)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t(badge.valueKey)}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadgesSection;
