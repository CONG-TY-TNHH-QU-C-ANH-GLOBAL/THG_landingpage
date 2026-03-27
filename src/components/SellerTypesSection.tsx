import { Store, TrendingUp, Users, Rocket } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import ScrollReveal from "@/components/ScrollReveal";

const SellerTypesSection = () => {
  const { t } = useI18n();

  const types = [
    { icon: Store, titleKey: "sellers.t1_title", descKey: "sellers.t1_desc" },
    { icon: TrendingUp, titleKey: "sellers.t2_title", descKey: "sellers.t2_desc" },
    { icon: Users, titleKey: "sellers.t3_title", descKey: "sellers.t3_desc" },
    { icon: Rocket, titleKey: "sellers.t4_title", descKey: "sellers.t4_desc" },
  ];

  return (
    <section className="py-28">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-20">
            <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">{t("sellers.subtitle")}</p>
            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-navy tracking-tight">
              {t("sellers.title")}{" "}
              <span className="text-gradient-gold">{t("sellers.title_highlight")}</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {types.map((item, i) => (
            <ScrollReveal key={item.titleKey} delay={i * 120}>
              <div className="text-center p-8 rounded-2xl bg-card border border-border/60 hover-lift cursor-pointer h-full">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-secondary flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-navy mb-3 tracking-tight">{t(item.titleKey)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(item.descKey)}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SellerTypesSection;
