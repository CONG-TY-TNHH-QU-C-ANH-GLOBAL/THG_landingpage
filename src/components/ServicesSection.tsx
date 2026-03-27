import { Package, Truck, Warehouse, ShoppingCart, Globe, BarChart3 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import ScrollReveal from "@/components/ScrollReveal";

const ServicesSection = () => {
  const { t } = useI18n();

  const services = [
    { icon: Package, titleKey: "services.s1_title", descKey: "services.s1_desc" },
    { icon: Truck, titleKey: "services.s2_title", descKey: "services.s2_desc" },
    { icon: Warehouse, titleKey: "services.s3_title", descKey: "services.s3_desc" },
    { icon: ShoppingCart, titleKey: "services.s4_title", descKey: "services.s4_desc" },
    { icon: Globe, titleKey: "services.s5_title", descKey: "services.s5_desc" },
    { icon: BarChart3, titleKey: "services.s6_title", descKey: "services.s6_desc" },
  ];

  return (
    <section id="services" className="py-28 bg-card relative overflow-hidden">
      {/* Decorative circle */}
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-secondary/50 blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-20">
            <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">{t("services.subtitle")}</p>
            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-navy tracking-tight">
              {t("services.title")}{" "}
              <span className="text-gradient-gold">{t("services.title_highlight")}</span>{" "}
              {t("services.title2")}
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <ScrollReveal key={s.titleKey} delay={i * 100}>
              <div className="group p-7 rounded-2xl border border-border/60 bg-background hover:bg-navy transition-all duration-500 cursor-pointer hover-lift h-full">
                <s.icon className="w-9 h-9 text-primary group-hover:text-gold-light mb-5 transition-colors duration-500" />
                <h3 className="text-lg font-bold text-navy group-hover:text-primary-foreground mb-3 transition-colors duration-500 tracking-tight">
                  {t(s.titleKey)}
                </h3>
                <p className="text-sm text-muted-foreground group-hover:text-primary-foreground/70 transition-colors duration-500 leading-relaxed">
                  {t(s.descKey)}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
