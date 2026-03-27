import { Package, Truck, Warehouse, ArrowUpRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import ScrollReveal from "@/components/ScrollReveal";
import { Link } from "react-router-dom";

const ServicesSection = () => {
  const { t } = useI18n();

  const services = [
    {
      icon: Package,
      titleKey: "services.s1_title",
      subtitleKey: "services.s1_subtitle",
      descKey: "services.s1_desc",
      bulletsKey: ["services.s1_b1", "services.s1_b2", "services.s1_b3"],
      badgeKey: "services.s1_badge",
      href: "/thg-fulfill",
      learnKey: "services.learn_more",
    },
    {
      icon: Truck,
      titleKey: "services.s2_title",
      subtitleKey: "services.s2_subtitle",
      descKey: "services.s2_desc",
      bulletsKey: ["services.s2_b1", "services.s2_b2", "services.s2_b3"],
      badgeKey: "services.s2_badge",
      href: "/thg-express",
      learnKey: "services.learn_more",
    },
    {
      icon: Warehouse,
      titleKey: "services.s3_title",
      subtitleKey: "services.s3_subtitle",
      descKey: "services.s3_desc",
      bulletsKey: ["services.s3_b1", "services.s3_b2", "services.s3_b3"],
      badgeKey: "services.s3_badge",
      href: "/thg-warehouse",
      learnKey: "services.learn_more",
    },
  ];

  return (
    <section id="services" className="py-28 bg-card relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-secondary/50 blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-6">
            <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">{t("services.subtitle")}</p>
            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-navy tracking-tight">
              {t("services.title")}{" "}
              <span className="text-gradient-gold">{t("services.title_highlight")}</span>{" "}
              {t("services.title2")}
            </h2>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={50}>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">{t("services.tagline")}</p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <ScrollReveal key={s.titleKey} delay={i * 120}>
              <div className="group relative rounded-3xl border border-border/60 bg-background overflow-hidden hover-lift h-full flex flex-col">
                {/* Icon illustration area */}
                <div className="relative h-56 bg-secondary/40 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/10" />
                  <s.icon className="w-20 h-20 text-primary/30 group-hover:text-primary/50 transition-colors duration-500" />
                  {/* Badge */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <span className="inline-block glass-card rounded-full px-4 py-1.5 text-xs font-medium text-foreground/70">
                      {t(s.badgeKey)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-7 flex-1 flex flex-col">
                  <p className="text-xs font-semibold text-accent uppercase tracking-[0.15em] mb-2">{t(s.subtitleKey)}</p>
                  <h3 className="text-2xl font-bold text-navy mb-3 tracking-tight">{t(s.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{t(s.descKey)}</p>
                  
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {s.bulletsKey.map((bk) => (
                      <li key={bk} className="flex items-start gap-2.5 text-sm text-foreground/75">
                        <span className="text-primary mt-0.5 font-bold">•</span>
                        <span>{t(bk)}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={s.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-gold-dark transition-colors group/link"
                  >
                    {t(s.learnKey)}
                    <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
