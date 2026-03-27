import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import ScrollReveal from "@/components/ScrollReveal";
import heroGlobe from "@/assets/hero-globe.png";

const HeroSection = () => {
  const { t } = useI18n();

  const features = [t("hero.feature1"), t("hero.feature2"), t("hero.feature3"), t("hero.feature4")];

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-hero">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(220 25% 12%) 1px, transparent 0)`,
        backgroundSize: "40px 40px",
      }} />

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left */}
        <div className="space-y-8">
          <ScrollReveal delay={100}>
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2.5 text-sm">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-medium text-muted-foreground tracking-wide uppercase text-xs">
                {t("hero.badge")}
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <h2 className="text-5xl md:text-6xl lg:text-[4.2rem] font-bold leading-[1.08] text-navy tracking-tight">
              {t("hero.title1")}{" "}
              <span className="text-gradient-gold">{t("hero.title_highlight")}</span>
              <br />
              {t("hero.title2")}
              <br />
              <span className="text-gradient-gold">{t("hero.title3")}</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="grid grid-cols-2 gap-3">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-accent flex-shrink-0" />
                  <span className="text-sm text-foreground/75">{f}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={500}>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button className="bg-primary hover:bg-gold-dark text-primary-foreground rounded-full px-8 py-6 text-base gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                {t("hero.cta")} <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="rounded-full px-8 py-6 text-base border-foreground/15 hover:bg-secondary hover:border-foreground/25 transition-all duration-300">
                {t("hero.learn_more")}
              </Button>
            </div>
          </ScrollReveal>
        </div>

        {/* Right - Globe with floating cards */}
        <ScrollReveal direction="scale" delay={400} className="relative hidden lg:flex justify-center items-center">
          <div className="relative">
            <img src={heroGlobe} alt="Global fulfillment network" className="w-[520px] h-[520px] object-contain" />

            {/* Floating cards */}
            <div className="absolute top-16 -left-8 glass-card rounded-2xl px-5 py-4 animate-float" style={{ animationDelay: "0s" }}>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">🇪🇺 EU</div>
              <p className="text-3xl font-bold text-navy tracking-tight">5-8</p>
              <p className="text-xs text-muted-foreground">{t("hero.delivery_days")}</p>
            </div>

            <div className="absolute bottom-28 -left-4 glass-card rounded-2xl px-5 py-4 animate-float" style={{ animationDelay: "1s" }}>
              <p className="text-3xl font-bold text-navy tracking-tight">$1</p>
              <p className="text-xs text-muted-foreground">{t("hero.us_fulfill")}</p>
            </div>

            <div className="absolute top-32 -right-6 glass-card rounded-2xl px-5 py-4 animate-float" style={{ animationDelay: "0.5s" }}>
              <p className="text-3xl font-bold text-navy tracking-tight">3</p>
              <p className="text-xs text-muted-foreground">{t("hero.countries")}</p>
            </div>

            <div className="absolute bottom-44 right-0 glass-card rounded-xl px-4 py-2 flex items-center gap-2 animate-float" style={{ animationDelay: "1.5s" }}>
              <span>🇨🇳</span><span className="text-xs font-semibold">China</span>
            </div>

            <div className="absolute bottom-32 -right-4 glass-card rounded-xl px-4 py-2 flex items-center gap-2 animate-float" style={{ animationDelay: "2s" }}>
              <span>🇻🇳</span><span className="text-xs font-semibold">Vietnam</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default HeroSection;
