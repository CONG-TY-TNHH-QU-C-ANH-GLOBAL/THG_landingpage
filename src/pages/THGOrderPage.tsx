import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import TestimonialsSection from "@/components/TestimonialsSection";
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

      {/* ══════════════════════════════════════════════════════════
          MEGA HERO — Gold Luxury Theme
          ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(36_30%_96%)] via-[hsl(36_25%_93%)] to-[hsl(36_20%_90%)] pt-32 pb-24">
        {/* ── BG texture layers ── */}
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, hsl(36 45% 65%) 1px, transparent 0)`, backgroundSize: "32px 32px" }} />
        <div className="absolute inset-0 shimmer-effect opacity-10 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent opacity-40" />
        <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-[hsl(var(--gold))]/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] left-0 w-[400px] h-[400px] bg-[hsl(var(--gold))]/5 rounded-full blur-[120px]" />

        {/* Floating particles */}
        <div className="absolute top-24 left-[12%] w-2 h-2 bg-[hsl(var(--gold))]/25 rounded-full animate-pulse" />
        <div className="absolute top-48 right-[18%] w-3 h-3 bg-[hsl(var(--gold))]/15 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-[30%] w-1.5 h-1.5 bg-[hsl(var(--gold))]/30 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />

        <div className="container mx-auto px-4 text-center relative z-10">
          <ScrollReveal direction="scale">
            <div className="inline-flex items-center gap-3 rounded-full px-5 py-2 text-sm border border-[hsl(var(--gold))]/25 mb-8 bg-[hsl(var(--gold))]/10 shadow-[0_4px_12px_rgba(216,180,111,0.15)] glow-pulse">
              <span className="font-medium text-navy">{t("order_page.badge_taobao")}</span>
              <span className="text-[hsl(var(--gold))]/50">|</span>
              <span className="font-medium text-navy">{t("order_page.badge_direct")}</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-navy leading-[1.08] mb-6">
              {t("order_page.hero_title1")} <br className="hidden md:block" />
              <span className="italic text-gradient-gold">{t("order_page.hero_highlight")}</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 font-light leading-relaxed">{t("order_page.hero_desc")}</p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button className="bg-[hsl(var(--gold))] hover:bg-[hsl(var(--gold-dark))] text-white rounded-full px-8 py-6 text-base gap-2 shadow-[0_8px_24px_hsl(36_45%_42%/0.4)] hover:shadow-[0_12px_32px_hsl(36_45%_42%/0.6)] transition-all duration-500 font-semibold tracking-wide hover:-translate-y-1">
                🚀 {t("order_page.hero_cta")}
              </Button>
              <Button variant="outline" className="rounded-full px-8 py-6 text-base border-[hsl(var(--gold))]/40 text-navy hover:bg-[hsl(var(--gold))]/10 transition-all duration-300 font-semibold" onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}>
                {t("order_page.hero_cta2")} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button asChild variant="outline" className="rounded-full px-8 py-6 text-base border-[hsl(var(--gold))]/40 text-navy hover:bg-[hsl(var(--gold))]/10 transition-all duration-300 font-semibold">
                <a href="https://thg.vn/collections/all" target="_blank" rel="noopener noreferrer">
                  📋 {t("order_page.btn_catalog")}
                </a>
              </Button>
            </div>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal delay={400}>
            <div className="flex flex-wrap justify-center gap-8 mt-16 glass-card border border-border/40 rounded-3xl p-8 max-w-4xl mx-auto bg-white/60 shadow-[var(--shadow-3d)]">
              {stats.map((s, i) => (
                <div key={i} className="text-center px-6">
                  <p className="text-3xl font-bold text-gradient-gold tabular-nums">{s.val}</p>
                  <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40 mt-2">{t(s.labelKey)}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom gradient fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-card to-transparent" />
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

      {/* Customer Feedback / Testimonials */}
      <div className="bg-card pt-10 pb-6">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-navy mb-4 tracking-tight">
            {t("order_page.feedback_title")}
          </h2>
        </div>
      </div>
      <TestimonialsSection />

      {/* Contact Section */}
      <ContactSection />
      <Footer />
    </div>
  );
};

export default THGOrderPage;
