import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import ScrollReveal from "@/components/ScrollReveal";
import { Link } from "react-router-dom";

const ServicesSection = () => {
  const { t } = useI18n();

  const services = [
    {
      titleKey: "services.s1_title",
      subtitleKey: "services.s1_subtitle",
      descKey: "services.s1_desc",
      bulletsKey: ["services.s1_b1", "services.s1_b2", "services.s1_b3"],
      badgeKey: "services.s1_badge",
      href: "/thg-fulfill",
      learnKey: "services.learn_more",
      illustration: "pod-illustration",
    },
    {
      titleKey: "services.s2_title",
      subtitleKey: "services.s2_subtitle",
      descKey: "services.s2_desc",
      bulletsKey: ["services.s2_b1", "services.s2_b2", "services.s2_b3"],
      badgeKey: "services.s2_badge",
      href: "/thg-express",
      learnKey: "services.learn_more",
      illustration: "express-illustration",
    },
    {
      titleKey: "services.s3_title",
      subtitleKey: "services.s3_subtitle",
      descKey: "services.s3_desc",
      bulletsKey: ["services.s3_b1", "services.s3_b2", "services.s3_b3"],
      badgeKey: "services.s3_badge",
      href: "/thg-warehouse",
      learnKey: "services.learn_more",
      illustration: "warehouse-illustration",
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
                {/* Illustration area */}
                <div className="relative h-56 bg-secondary/40 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/10" />
                  
                  {/* POD T-shirt illustration */}
                  {s.illustration === "pod-illustration" && (
                    <div className="relative flex items-center gap-4">
                      {/* White blank tee */}
                      <div className="w-20 h-24 relative">
                        <div className="absolute inset-0 bg-white rounded-lg shadow-md border border-border/30 flex items-center justify-center">
                          <span className="text-3xl">👕</span>
                        </div>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground font-medium">Blank</div>
                      </div>
                      {/* Arrow */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="text-xl animate-pulse">🖨️</div>
                        <div className="w-8 h-0.5 bg-primary/30" />
                        <span className="text-[9px] text-muted-foreground">POD Print</span>
                      </div>
                      {/* Branded tee */}
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
                  )}
                  
                  {/* Express - packages flying */}
                  {s.illustration === "express-illustration" && (
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
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground font-medium">5-8 days delivery</div>
                    </div>
                  )}
                  
                  {/* Warehouse illustration */}
                  {s.illustration === "warehouse-illustration" && (
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
                          <div className="text-xs text-muted-foreground">
                            PA & NC, USA
                          </div>
                          <div className="warehouse-truck-depart">
                            <span className="text-xl">🚚</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

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
