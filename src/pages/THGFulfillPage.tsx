import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";
import { Package, CheckCircle2, ArrowRight, Zap, DollarSign, Image, Video, Users, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

const painPoints = [
  { num: "01", titleKey: "fulfill_page.pain1_title", descKey: "fulfill_page.pain1_desc" },
  { num: "02", titleKey: "fulfill_page.pain2_title", descKey: "fulfill_page.pain2_desc" },
  { num: "03", titleKey: "fulfill_page.pain3_title", descKey: "fulfill_page.pain3_desc" },
  { num: "04", titleKey: "fulfill_page.pain4_title", descKey: "fulfill_page.pain4_desc" },
];

const advantages = [
  { icon: Package, titleKey: "fulfill_page.adv1_title", descKey: "fulfill_page.adv1_desc" },
  { icon: Zap, titleKey: "fulfill_page.adv2_title", descKey: "fulfill_page.adv2_desc" },
  { icon: DollarSign, titleKey: "fulfill_page.adv3_title", descKey: "fulfill_page.adv3_desc" },
];

const processSteps = [
  { num: "01", titleKey: "fulfill_page.step1_title", descKey: "fulfill_page.step1_desc", icon: Palette },
  { num: "02", titleKey: "fulfill_page.step2_title", descKey: "fulfill_page.step2_desc", icon: Package },
  { num: "03", titleKey: "fulfill_page.step3_title", descKey: "fulfill_page.step3_desc", icon: Image },
  { num: "04", titleKey: "fulfill_page.step4_title", descKey: "fulfill_page.step4_desc", icon: Zap },
];

const podProducts = [
  { emoji: "👕", name: "T-Shirts" },
  { emoji: "👗", name: "Dresses" },
  { emoji: "🧢", name: "Caps" },
  { emoji: "☕", name: "Mugs" },
  { emoji: "📱", name: "Phone Cases" },
  { emoji: "🛍️", name: "Tote Bags" },
  { emoji: "🖼️", name: "Canvas" },
  { emoji: "👶", name: "Baby Clothes" },
];

const THGFulfillPage = () => {
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
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2.5 text-sm mb-8">
                  <Package className="w-4 h-4 text-primary" />
                  <span className="font-medium text-muted-foreground uppercase text-xs tracking-wider">POD & Dropship</span>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-navy tracking-tight mb-6">
                  THG <span className="text-gradient-gold">Fulfill</span>
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <p className="text-lg md:text-xl text-muted-foreground max-w-lg mb-4">{t("fulfill_page.hero_subtitle")}</p>
                <p className="text-base text-primary font-semibold tracking-wide uppercase">{t("fulfill_page.hero_tagline")}</p>
              </ScrollReveal>
              <ScrollReveal delay={300}>
                <div className="flex gap-4 mt-10">
                  <Button className="bg-primary hover:bg-gold-dark text-primary-foreground rounded-full px-8 py-6 text-base gap-2 shadow-lg">
                    {t("nav.consult")} <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </ScrollReveal>
            </div>
            {/* POD Illustration */}
            <ScrollReveal delay={300} direction="right" className="hidden lg:block">
              <div className="relative">
                <div className="glass-card rounded-3xl p-8 flex flex-col items-center">
                  <p className="text-xs font-semibold text-accent uppercase tracking-[0.2em] mb-6">POD Process</p>
                  <div className="flex items-center gap-6">
                    {/* Blank tee */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-28 h-32 bg-white rounded-xl border-2 border-dashed border-border flex items-center justify-center shadow-inner">
                        <span className="text-5xl">👕</span>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">Blank T-Shirt</span>
                    </div>
                    {/* Arrow + printer */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-3xl animate-pulse">🖨️</span>
                      <div className="flex items-center">
                        <div className="w-10 h-px bg-primary/40" />
                        <ArrowRight className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-[10px] text-muted-foreground">DTG / DTF Print</span>
                    </div>
                    {/* Branded tee */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-28 h-32 bg-gradient-to-br from-primary/15 to-accent/15 rounded-xl border-2 border-primary/30 flex items-center justify-center relative shadow-lg">
                        <span className="text-5xl">👕</span>
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[7px] font-bold px-2 py-1 rounded">
                          YOUR BRAND
                        </div>
                      </div>
                      <span className="text-xs text-primary font-semibold">Branded Product</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* POD Products */}
      <section className="py-16 bg-card border-y border-border/50">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <p className="text-center text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-8">100+ POD Product Types</p>
          </ScrollReveal>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 max-w-3xl mx-auto">
            {podProducts.map((p, i) => (
              <ScrollReveal key={i} delay={i * 50}>
                <div className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                  <span className="text-2xl">{p.emoji}</span>
                  <span className="text-[10px] text-muted-foreground font-medium">{p.name}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">{t("fulfill_page.pain_subtitle")}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("fulfill_page.pain_title")}</h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {painPoints.map((p, i) => (
              <ScrollReveal key={p.num} delay={i * 100}>
                <div className="glass-card rounded-2xl p-6 text-center hover-lift h-full">
                  <span className="text-3xl font-bold text-primary/20 block mb-3">{p.num}</span>
                  <h3 className="text-sm font-bold text-navy mb-2 uppercase tracking-wider">{t(p.titleKey)}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t(p.descKey)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <ScrollReveal>
              <div>
                <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">{t("fulfill_page.solution_subtitle")}</p>
                <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight mb-6">
                  THG Fulfill – <span className="text-gradient-gold">{t("fulfill_page.solution_highlight")}</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">{t("fulfill_page.solution_desc")}</p>
                <ul className="space-y-3">
                  {["fulfill_page.sol_b1", "fulfill_page.sol_b2", "fulfill_page.sol_b3", "fulfill_page.sol_b4", "fulfill_page.sol_b5"].map((k) => (
                    <li key={k} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/80">{t(k)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200} direction="right">
              <div className="grid grid-cols-1 gap-5">
                {advantages.map((a, i) => (
                  <div key={i} className="glass-card rounded-2xl p-6 flex gap-4 hover-lift">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                      <a.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-navy mb-1 tracking-tight">{t(a.titleKey)}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{t(a.descKey)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Video / Image placeholder */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              <div className="aspect-video rounded-3xl bg-secondary/60 border border-border/50 flex flex-col items-center justify-center gap-4 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-navy/5" />
                <Video className="w-16 h-16 text-primary/30" />
                <p className="text-sm text-muted-foreground font-medium">THG Fulfill Production Video</p>
                <p className="text-xs text-muted-foreground/60">Coming soon — See our POD production in action</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("fulfill_page.process_title")}</h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {processSteps.map((s, i) => (
              <ScrollReveal key={s.num} delay={i * 120}>
                <div className="relative glass-card rounded-2xl p-6 hover-lift h-full">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
                    <s.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-4xl font-bold text-primary/10 absolute top-4 right-4">{s.num}</span>
                  <h3 className="text-base font-bold text-navy mb-2 tracking-tight">{t(s.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(s.descKey)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery placeholder */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">Gallery</p>
              <h2 className="text-3xl font-bold text-navy tracking-tight">Our Production Facilities</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { label: "POD Printing", icon: "🖨️" },
              { label: "Quality Control", icon: "✅" },
              { label: "Packaging", icon: "📦" },
              { label: "Shipping", icon: "🚚" },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="aspect-square rounded-2xl bg-secondary/50 border border-border/40 flex flex-col items-center justify-center gap-3 hover-lift">
                  <span className="text-4xl">{item.icon}</span>
                  <span className="text-xs text-muted-foreground font-medium">{item.label}</span>
                  <div className="flex items-center gap-1 text-[10px] text-primary">
                    <Image className="w-3 h-3" />
                    <span>Photo coming soon</span>
                  </div>
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
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">{t("fulfill_page.cta_title")}</h2>
            <p className="text-primary-foreground/60 mb-8 max-w-lg mx-auto">{t("fulfill_page.cta_desc")}</p>
            <div className="flex justify-center gap-4">
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

export default THGFulfillPage;
