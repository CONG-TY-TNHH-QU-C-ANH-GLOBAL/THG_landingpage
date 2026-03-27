import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";
import { ShoppingCart, ArrowRight, CheckCircle2, Star, Shield, Clock, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const painPoints = [
  { emoji: "🔍", titleKey: "order_page.pain1_title", descKey: "order_page.pain1_desc" },
  { emoji: "🈷️", titleKey: "order_page.pain2_title", descKey: "order_page.pain2_desc" },
  { emoji: "⚠️", titleKey: "order_page.pain3_title", descKey: "order_page.pain3_desc" },
  { emoji: "💸", titleKey: "order_page.pain4_title", descKey: "order_page.pain4_desc" },
  { emoji: "🔄", titleKey: "order_page.pain5_title", descKey: "order_page.pain5_desc" },
  { emoji: "🕰️", titleKey: "order_page.pain6_title", descKey: "order_page.pain6_desc" },
];

const stats = [
  { val: "500+", labelKey: "order_page.stat1" },
  { val: "98%", labelKey: "order_page.stat2" },
  { val: "$0", labelKey: "order_page.stat3" },
  { val: "5★", labelKey: "order_page.stat4" },
  { val: "3", labelKey: "order_page.stat5" },
];

const steps = [
  { num: "01", titleKey: "order_page.step1_title", descKey: "order_page.step1_desc" },
  { num: "02", titleKey: "order_page.step2_title", descKey: "order_page.step2_desc" },
  { num: "03", titleKey: "order_page.step3_title", descKey: "order_page.step3_desc" },
  { num: "04", titleKey: "order_page.step4_title", descKey: "order_page.step4_desc" },
];

const THGOrderPage = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero - Dark theme like the reference */}
      <section className="pt-28 pb-20 bg-gradient-dark relative overflow-hidden text-primary-foreground">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <ScrollReveal>
            <div className="inline-flex items-center gap-3 rounded-full px-5 py-2 text-sm border border-primary-foreground/10 mb-8 bg-primary-foreground/5">
              <span>🇨🇳 Taobao · 1688 · Pinduoduo</span>
              <span className="text-primary-foreground/30">|</span>
              <span>✈️ Direct to USA</span>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              {t("order_page.hero_title1")} <span className="italic text-gradient-gold">{t("order_page.hero_highlight")}</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-lg text-primary-foreground/60 max-w-2xl mx-auto mb-10">{t("order_page.hero_desc")}</p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="flex justify-center gap-4">
              <Button className="bg-primary hover:bg-gold-dark text-primary-foreground rounded-full px-8 py-6 text-base gap-2 shadow-lg">
                🚀 {t("order_page.hero_cta")}
              </Button>
              <Button variant="outline" className="rounded-full px-8 py-6 text-base border-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/10">
                {t("order_page.hero_cta2")} →
              </Button>
            </div>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal delay={400}>
            <div className="flex flex-wrap justify-center gap-6 mt-14 border border-primary-foreground/10 rounded-2xl p-6 max-w-3xl mx-auto bg-primary-foreground/5">
              {stats.map((s, i) => (
                <div key={i} className="text-center px-4">
                  <p className="text-2xl font-bold text-gradient-gold">{s.val}</p>
                  <p className="text-xs text-primary-foreground/50 mt-1">{t(s.labelKey)}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("order_page.pain_title")}</h2>
              <p className="text-muted-foreground mt-3">{t("order_page.pain_subtitle")}</p>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {painPoints.map((p, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="glass-card rounded-2xl p-6 hover-lift h-full">
                  <span className="text-3xl block mb-3">{p.emoji}</span>
                  <h3 className="text-base font-bold text-navy mb-2">{t(p.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(p.descKey)}</p>
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
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("order_page.process_title")}</h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {steps.map((s, i) => (
              <ScrollReveal key={s.num} delay={i * 120}>
                <div className="glass-card rounded-2xl p-6 hover-lift h-full text-center">
                  <span className="text-4xl font-bold text-primary/15 block mb-3">{s.num}</span>
                  <h3 className="text-base font-bold text-navy mb-2 tracking-tight">{t(s.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(s.descKey)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-dark text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">{t("order_page.cta_title")}</h2>
            <p className="text-primary-foreground/60 mb-8 max-w-lg mx-auto">{t("order_page.cta_desc")}</p>
            <Button className="bg-primary hover:bg-gold-dark text-primary-foreground rounded-full px-10 py-6 text-base gap-2 shadow-lg">
              {t("nav.consult")} <ArrowRight className="w-4 h-4" />
            </Button>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default THGOrderPage;
