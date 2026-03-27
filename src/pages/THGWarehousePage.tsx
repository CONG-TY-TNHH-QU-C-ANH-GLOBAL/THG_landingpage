import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";
import { Warehouse, ArrowRight, CheckCircle2, MapPin, DollarSign, Clock, Video, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

const strengths = [
  { icon: DollarSign, titleKey: "warehouse_page.str1_title", descKey: "warehouse_page.str1_desc" },
  { icon: MapPin, titleKey: "warehouse_page.str2_title", descKey: "warehouse_page.str2_desc" },
  { icon: Clock, titleKey: "warehouse_page.str3_title", descKey: "warehouse_page.str3_desc" },
  { icon: Monitor, titleKey: "warehouse_page.str4_title", descKey: "warehouse_page.str4_desc" },
  { icon: Video, titleKey: "warehouse_page.str5_title", descKey: "warehouse_page.str5_desc" },
];

const processSteps = [
  { num: "01", titleKey: "warehouse_page.step1_title", descKey: "warehouse_page.step1_desc" },
  { num: "02", titleKey: "warehouse_page.step2_title", descKey: "warehouse_page.step2_desc" },
  { num: "03", titleKey: "warehouse_page.step3_title", descKey: "warehouse_page.step3_desc" },
  { num: "04", titleKey: "warehouse_page.step4_title", descKey: "warehouse_page.step4_desc" },
  { num: "05", titleKey: "warehouse_page.step5_title", descKey: "warehouse_page.step5_desc" },
];

const THGWarehousePage = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(220 25% 12%) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2.5 text-sm mb-8">
              <Warehouse className="w-4 h-4 text-primary" />
              <span className="font-medium text-muted-foreground uppercase text-xs tracking-wider">{t("warehouse_page.badge")}</span>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-navy tracking-tight mb-6">
              THG <span className="text-gradient-gold">Warehouse</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">{t("warehouse_page.hero_subtitle")}</p>
            <p className="text-base text-primary font-semibold tracking-wide uppercase">{t("warehouse_page.hero_tagline")}</p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="flex justify-center gap-4 mt-10">
              <Button className="bg-primary hover:bg-gold-dark text-primary-foreground rounded-full px-8 py-6 text-base gap-2 shadow-lg">
                {t("nav.consult")} <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-16 bg-card border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { val: "$1", labelKey: "warehouse_page.stat1" },
              { val: "90", labelKey: "warehouse_page.stat2" },
              { val: "2-5", labelKey: "warehouse_page.stat3" },
              { val: "24/7", labelKey: "warehouse_page.stat4" },
            ].map((s, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div>
                  <p className="text-3xl md:text-4xl font-bold text-gradient-gold">{s.val}</p>
                  <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{t(s.labelKey)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight mb-4">{t("warehouse_page.solution_title")}</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">{t("warehouse_page.solution_desc")}</p>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
            <ScrollReveal>
              <ul className="space-y-3">
                {["warehouse_page.sol_b1", "warehouse_page.sol_b2", "warehouse_page.sol_b3"].map((k) => (
                  <li key={k} className="flex items-start gap-3 glass-card rounded-xl p-4">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground/80">{t(k)}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <ul className="space-y-3">
                {["warehouse_page.sol_b4", "warehouse_page.sol_b5", "warehouse_page.sol_b6"].map((k) => (
                  <li key={k} className="flex items-start gap-3 glass-card rounded-xl p-4">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground/80">{t(k)}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Strengths */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("warehouse_page.strengths_title")}</h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {strengths.map((s, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="glass-card rounded-2xl p-6 hover-lift h-full">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                    <s.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-base font-bold text-navy mb-2 tracking-tight">{t(s.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(s.descKey)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("warehouse_page.process_title")}</h2>
            </div>
          </ScrollReveal>
          <div className="max-w-3xl mx-auto space-y-4">
            {processSteps.map((s, i) => (
              <ScrollReveal key={s.num} delay={i * 80}>
                <div className="flex gap-6 glass-card rounded-2xl p-6 hover-lift">
                  <span className="text-3xl font-bold text-primary/20 flex-shrink-0">{s.num}</span>
                  <div>
                    <h3 className="text-base font-bold text-navy mb-1 tracking-tight">{t(s.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(s.descKey)}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Warehouse Locations */}
      <section className="py-20 bg-gradient-dark text-primary-foreground">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{t("warehouse_page.locations_title")}</h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <ScrollReveal delay={100}>
              <div className="border border-primary-foreground/10 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3"><span className="text-2xl">🇺🇸</span><h3 className="font-bold">Pennsylvania</h3></div>
                <p className="text-sm text-primary-foreground/60">108 Almond CT, Milford, PA 18337</p>
                <p className="text-sm text-primary-foreground/60">📞 +1 (570) 618-1169</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="border border-primary-foreground/10 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3"><span className="text-2xl">🇺🇸</span><h3 className="font-bold">Winston-Salem, NC</h3></div>
                <p className="text-sm text-primary-foreground/60">4136 Sunflower Circle, Winston-Salem, NC 27105</p>
              </div>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={300}>
            <div className="text-center mt-10">
              <Button className="bg-primary hover:bg-gold-dark text-primary-foreground rounded-full px-10 py-6 text-base gap-2 shadow-lg">
                {t("nav.consult")} <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default THGWarehousePage;
