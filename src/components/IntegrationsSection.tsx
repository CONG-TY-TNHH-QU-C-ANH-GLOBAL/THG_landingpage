import { useI18n } from "@/lib/i18n";
import ScrollReveal from "@/components/ScrollReveal";
import thgLogo from "@/assets/thg-logo.png";

const platforms = [
  { name: "Etsy", icon: "🛍️", color: "bg-orange-50 border-orange-200" },
  { name: "Amazon", icon: "📦", color: "bg-amber-50 border-amber-200" },
  { name: "TikTok Shop", icon: "🎵", color: "bg-slate-50 border-slate-200" },
  { name: "eBay", icon: "🏷️", color: "bg-blue-50 border-blue-200" },
  { name: "Shopify", icon: "🛒", color: "bg-green-50 border-green-200" },
  { name: "WooCommerce", icon: "🔌", color: "bg-purple-50 border-purple-200" },
];

const IntegrationsSection = () => {
  const { t } = useI18n();

  return (
    <section className="py-28 bg-card relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-6">
            <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">
              {t("integrations.subtitle")}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-navy tracking-tight">
              {t("integrations.title")}{" "}
              <span className="text-gradient-gold">{t("integrations.title_highlight")}</span>
            </h2>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={50}>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            {t("integrations.desc")}
          </p>
        </ScrollReveal>

        {/* Sync visualization */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {platforms.map((p, i) => (
              <ScrollReveal key={p.name} delay={i * 80}>
                <div className={`rounded-2xl border ${p.color} p-6 flex flex-col items-center gap-3 hover-lift transition-all duration-300 group`}>
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{p.icon}</span>
                  <span className="text-sm font-semibold text-navy">{p.name}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-olive animate-pulse" />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                      {t("integrations.sync_ready")}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Center THG Hub */}
          <ScrollReveal delay={500}>
            <div className="mt-10 flex flex-col items-center">
              <div className="flex items-center gap-3 mb-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-8 h-px bg-primary/30" />
                ))}
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-8 h-px bg-primary/30" />
                ))}
              </div>
              <div className="glass-card rounded-2xl px-8 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">THG</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-navy">THG Fulfill OMS</p>
                  <p className="text-[10px] text-muted-foreground">{t("integrations.hub_desc")}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
