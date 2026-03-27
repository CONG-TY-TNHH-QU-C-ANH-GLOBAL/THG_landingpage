import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";
import { Package, CheckCircle2, ArrowRight, Zap, DollarSign, Globe, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

const painPoints = [
  { num: "01", iconKey: "shipping", titleKey: "fulfill_page.pain1_title", descKey: "fulfill_page.pain1_desc" },
  { num: "02", iconKey: "cost", titleKey: "fulfill_page.pain2_title", descKey: "fulfill_page.pain2_desc" },
  { num: "03", iconKey: "system", titleKey: "fulfill_page.pain3_title", descKey: "fulfill_page.pain3_desc" },
  { num: "04", iconKey: "control", titleKey: "fulfill_page.pain4_title", descKey: "fulfill_page.pain4_desc" },
];

const advantages = [
  { icon: Package, titleKey: "fulfill_page.adv1_title", descKey: "fulfill_page.adv1_desc" },
  { icon: Zap, titleKey: "fulfill_page.adv2_title", descKey: "fulfill_page.adv2_desc" },
  { icon: DollarSign, titleKey: "fulfill_page.adv3_title", descKey: "fulfill_page.adv3_desc" },
];

const processSteps = [
  { num: "01", titleKey: "fulfill_page.step1_title", descKey: "fulfill_page.step1_desc" },
  { num: "02", titleKey: "fulfill_page.step2_title", descKey: "fulfill_page.step2_desc" },
  { num: "03", titleKey: "fulfill_page.step3_title", descKey: "fulfill_page.step3_desc" },
  { num: "04", titleKey: "fulfill_page.step4_title", descKey: "fulfill_page.step4_desc" },
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
        <div className="container mx-auto px-4 text-center relative z-10">
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
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">{t("fulfill_page.hero_subtitle")}</p>
            <p className="text-base text-primary font-semibold tracking-wide uppercase">{t("fulfill_page.hero_tagline")}</p>
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

      {/* Pain Points */}
      <section className="py-24 bg-card">
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
      <section className="py-24 bg-background">
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
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">{t("fulfill_page.cta_title")}</h2>
            <p className="text-primary-foreground/60 mb-8 max-w-lg mx-auto">{t("fulfill_page.cta_desc")}</p>
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

export default THGFulfillPage;
