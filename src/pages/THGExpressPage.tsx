import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";
import { Truck, ArrowRight, Plane, Ship, Shield, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const features = [
  { icon: Plane, titleKey: "express_page.feat1_title", descKey: "express_page.feat1_desc" },
  { icon: Shield, titleKey: "express_page.feat2_title", descKey: "express_page.feat2_desc" },
  { icon: Clock, titleKey: "express_page.feat3_title", descKey: "express_page.feat3_desc" },
  { icon: Ship, titleKey: "express_page.feat4_title", descKey: "express_page.feat4_desc" },
];

const shippingLines = [
  { num: "01", routeKey: "express_page.route1", typesKey: "express_page.route1_types" },
  { num: "02", routeKey: "express_page.route2", typesKey: "express_page.route2_types" },
  { num: "03", routeKey: "express_page.route3", typesKey: "express_page.route3_types" },
  { num: "04", routeKey: "express_page.route4", typesKey: "express_page.route4_types" },
];

const processSteps = [
  { num: "01", titleKey: "express_page.step1_title", descKey: "express_page.step1_desc" },
  { num: "02", titleKey: "express_page.step2_title", descKey: "express_page.step2_desc" },
  { num: "03", titleKey: "express_page.step3_title", descKey: "express_page.step3_desc" },
  { num: "04", titleKey: "express_page.step4_title", descKey: "express_page.step4_desc" },
];

const THGExpressPage = () => {
  const { t } = useI18n();
  const [trackingCode, setTrackingCode] = useState("");

  const handleTrack = () => {
    if (trackingCode.trim()) {
      window.open(`https://t.17track.net/en#nums=${trackingCode}`, "_blank");
    }
  };

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
              <Truck className="w-4 h-4 text-primary" />
              <span className="font-medium text-muted-foreground uppercase text-xs tracking-wider">{t("express_page.badge")}</span>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-navy tracking-tight mb-6">
              THG <span className="text-gradient-gold">Express</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">{t("express_page.hero_subtitle")}</p>
            <p className="text-base text-primary font-semibold tracking-wide uppercase">{t("express_page.hero_tagline")}</p>
          </ScrollReveal>

          {/* Tracking box */}
          <ScrollReveal delay={300}>
            <div className="max-w-xl mx-auto mt-10 glass-card rounded-2xl p-6">
              <h3 className="text-base font-bold text-navy mb-2">{t("express_page.track_title")}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t("express_page.track_desc")}</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  placeholder={t("express_page.track_placeholder")}
                  className="flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                />
                <Button onClick={handleTrack} className="bg-primary hover:bg-gold-dark text-primary-foreground rounded-full px-6">
                  <Search className="w-4 h-4 mr-1" /> {t("express_page.track_btn")}
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("express_page.features_title")}</h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="glass-card rounded-2xl p-6 text-center hover-lift h-full">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4">
                    <f.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-sm font-bold text-navy mb-2 uppercase tracking-wider">{t(f.titleKey)}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t(f.descKey)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Lines */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("express_page.lines_title")}</h2>
              <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">{t("express_page.lines_desc")}</p>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {shippingLines.map((l, i) => (
              <ScrollReveal key={l.num} delay={i * 100}>
                <div className="glass-card rounded-2xl p-6 hover-lift">
                  <span className="text-3xl font-bold text-primary/15 block mb-2">{l.num}</span>
                  <h3 className="text-lg font-bold text-navy mb-2 tracking-tight">{t(l.routeKey)}</h3>
                  <p className="text-sm text-muted-foreground">{t(l.typesKey)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("express_page.process_title")}</h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {processSteps.map((s, i) => (
              <ScrollReveal key={s.num} delay={i * 120}>
                <div className="glass-card rounded-2xl p-6 hover-lift h-full">
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
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">{t("express_page.cta_title")}</h2>
            <p className="text-primary-foreground/60 mb-8 max-w-lg mx-auto">{t("express_page.cta_desc")}</p>
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

export default THGExpressPage;
