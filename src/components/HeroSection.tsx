import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import ScrollReveal from "@/components/ScrollReveal";
import globeImage from "@/assets/globe-3d.png";

const HeroSection = () => {
  const { t } = useI18n();

  const features = [t("hero.feature1"), t("hero.feature2"), t("hero.feature3"), t("hero.feature4")];

  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-10 md:pt-20 overflow-hidden bg-gradient-hero">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(220 25% 12%) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-4 flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-12 items-center relative z-10">
        <div className="space-y-6 md:space-y-8 text-center lg:text-left">
          <ScrollReveal delay={100}>
            <div className="inline-flex max-w-full items-center gap-2 glass-card rounded-full px-4 py-2 md:px-5 md:py-2.5 text-sm">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse flex-shrink-0" />
              <span className="font-medium text-muted-foreground tracking-wide uppercase text-[10px] md:text-xs truncate">
                {t("hero.badge")}
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-[4.2rem] font-bold leading-[1.1] text-navy tracking-tight mx-auto lg:mx-0">
              {t("hero.title1")}{" "}
              <span className="text-gradient-gold">{t("hero.title_highlight")}</span>{" "}
              {t("hero.title2")}{" "}
              <span className="text-gradient-gold">{t("hero.title3")}</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed mx-auto lg:mx-0">
              {t("hero.subtitle")}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-sm sm:max-w-none mx-auto lg:mx-0">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                  <span className="text-sm text-foreground/75">{f}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={500}>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:justify-center lg:justify-start">
              <Button className="bg-primary hover:bg-gold-dark text-primary-foreground rounded-full px-8 py-6 text-base gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                {t("hero.cta")} <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="rounded-full px-8 py-6 text-base border-foreground/15 hover:bg-secondary hover:border-foreground/25 transition-all duration-300"
              >
                {t("hero.learn_more")}
              </Button>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal
          direction="scale"
          delay={400}
          className="relative flex justify-center items-center min-h-[250px] sm:min-h-[320px] md:min-h-[460px] lg:min-h-[560px] mt-6 lg:mt-0"
        >
          <div className="relative scale-[0.5] sm:scale-[0.62] md:scale-[0.8] lg:scale-100 origin-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[420px] h-[420px] rounded-full bg-primary/10 blur-[80px] animate-pulse" />
            </div>

            <div className="globe-real-container">
              <img src={globeImage} alt="THG Global Network" className="globe-real-image" />
              <div className="globe-orbit" />
              <div className="globe-orbit globe-orbit-2" />

              <div className="airplane-orbit">
                <div className="airplane airplane-1">✈️</div>
              </div>
              <div className="airplane-orbit airplane-orbit-reverse">
                <div className="airplane airplane-2">✈️</div>
              </div>

              <div className="package-orbit">
                <div className="package-item">📦</div>
              </div>
              <div className="package-orbit package-orbit-2">
                <div className="package-item package-item-2">📦</div>
              </div>
            </div>

            <div className="absolute top-10 left-0 sm:-left-8 md:-left-12 glass-card rounded-2xl px-3 sm:px-4 md:px-5 py-3 md:py-4 animate-float z-10">
              <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground mb-1">🇪🇺 EU</div>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-navy tracking-tight">5-8</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{t("hero.delivery_days")}</p>
            </div>

            <div className="absolute top-24 right-6 sm:right-2 glass-card rounded-xl px-3 md:px-4 py-2 flex items-center gap-2 animate-float z-10">
              <span>🇺🇸</span>
              <span className="text-xs font-semibold">USA</span>
            </div>

            <div className="absolute top-44 -right-6 md:-right-10 glass-card rounded-2xl px-4 md:px-5 py-3 md:py-4 animate-float z-10 hidden sm:block">
              <p className="text-2xl md:text-3xl font-bold text-navy tracking-tight">3</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{t("hero.countries")}</p>
            </div>

            <div className="absolute bottom-36 right-2 md:right-4 glass-card rounded-xl px-3 md:px-4 py-2 items-center gap-2 animate-float z-10 hidden sm:flex">
              <span>🇨🇳</span>
              <span className="text-xs font-semibold">China</span>
            </div>

            <div className="absolute bottom-24 right-0 md:-right-4 glass-card rounded-xl px-3 md:px-4 py-2 items-center gap-2 animate-float z-10 hidden sm:flex">
              <span>🇻🇳</span>
              <span className="text-xs font-semibold">Vietnam</span>
            </div>

            <div className="absolute bottom-8 left-2 sm:-left-4 md:-left-8 glass-card rounded-2xl px-3 sm:px-4 md:px-5 py-3 md:py-4 animate-float z-10">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-navy tracking-tight">
                từ <span className="text-gradient-gold">1$</span>
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{t("hero.us_fulfill")}</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default HeroSection;
