import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import warehouseUS from "@/assets/warehouse_US.jpg";
import ScrollReveal from "@/components/ScrollReveal";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import FAQAccordion from "@/components/FAQAccordion";
import ImageMarquee from "@/components/ImageMarquee";
import { useI18n } from "@/lib/i18n";
import { Warehouse, ArrowRight, CheckCircle2, MapPin, DollarSign, Clock, Monitor, Package, Truck, Video, Mail, Layers, Box } from "lucide-react";
import { Button } from "@/components/ui/button";

const sliderImages = [
  "https://w.ladicdn.com/s1400x1000/67e69e24e8a7ba001127c80a/kho-my-1-20250729095528-wnjai.jpg",
  "https://w.ladicdn.com/s1400x1000/67e69e24e8a7ba001127c80a/kho-my-4-1-20250729095528-l-gl2.jpg",
  "https://w.ladicdn.com/s1400x1000/67e69e24e8a7ba001127c80a/kho-my-6-1-20250729095528-0lr5c.jpg",
  "https://w.ladicdn.com/s1400x1000/67e69e24e8a7ba001127c80a/kho-my-10-1-20250729095528-mkcfd.jpg",
  "https://w.ladicdn.com/s1400x1000/67e69e24e8a7ba001127c80a/kho-my-11-1-20250729095528-nzruq.jpg",
  "https://w.ladicdn.com/s1400x1000/67e69e24e8a7ba001127c80a/kho-my-14-1-20250729095528-dcsxm.jpg",
  "https://w.ladicdn.com/s1400x1000/67e69e24e8a7ba001127c80a/photo_2025-04-10_22-12-24-20250724025351-uqljo.jpg",
  "https://w.ladicdn.com/s1400x1000/67e69e24e8a7ba001127c80a/kho-my-13-20250724024632-bt6u-.jpg"
];

// Videos

const THGWarehousePage = () => {
  const { t } = useI18n();

  const warehouseFAQs = [
    { question: t("wh_faq.q1"), answer: t("wh_faq.a1") },
    { question: t("wh_faq.q2"), answer: t("wh_faq.a2") },
    { question: t("wh_faq.q3"), answer: t("wh_faq.a3") },
    { question: t("wh_faq.q4"), answer: t("wh_faq.a4") },
    { question: t("wh_faq.q5"), answer: t("wh_faq.a5") },
    { question: t("wh_faq.q6"), answer: t("wh_faq.a6") },
    { question: t("wh_faq.q7"), answer: t("wh_faq.a7") },
    { question: t("wh_faq.q8"), answer: t("wh_faq.a8") },
    { question: t("wh_faq.q9"), answer: t("wh_faq.a9") },
    { question: t("wh_faq.q10"), answer: t("wh_faq.a10") },
    { question: t("wh_faq.q11"), answer: t("wh_faq.a11") },
    { question: t("wh_faq.q12"), answer: t("wh_faq.a12") },
    { question: t("wh_faq.q13"), answer: t("wh_faq.a13") },
  ];

  const features = [
    { icon: "🏷️", titleKey: "warehouse_page.feat1_title", descKey: "warehouse_page.feat1_desc" },
    { icon: "📦", titleKey: "warehouse_page.feat2_title", descKey: "warehouse_page.feat2_desc" },
    { icon: "🚚", titleKey: "warehouse_page.feat3_title", descKey: "warehouse_page.feat3_desc" },
  ];

  const strengths = [
    { icon: DollarSign, titleKey: "warehouse_page.str1_title", descKey: "warehouse_page.str1_desc" },
    { icon: MapPin, titleKey: "warehouse_page.str2_title", descKey: "warehouse_page.str2_desc" },
    { icon: Clock, titleKey: "warehouse_page.str3_title", descKey: "warehouse_page.str3_desc" },
    { icon: Monitor, titleKey: "warehouse_page.str4_title", descKey: "warehouse_page.str4_desc" },
    { icon: Video, titleKey: "warehouse_page.str5_title", descKey: "warehouse_page.str5_desc" },
  ];

  const processSteps = [
    { num: "01", titleKey: "warehouse_page.step1_title", descKey: "warehouse_page.step1_desc", icon: Package },
    { num: "02", titleKey: "warehouse_page.step2_title", descKey: "warehouse_page.step2_desc", icon: Truck },
    { num: "03", titleKey: "warehouse_page.step3_title", descKey: "warehouse_page.step3_desc", icon: Warehouse },
    { num: "04", titleKey: "warehouse_page.step4_title", descKey: "warehouse_page.step4_desc", icon: Monitor },
    { num: "05", titleKey: "warehouse_page.step5_title", descKey: "warehouse_page.step5_desc", icon: ArrowRight },
  ];

  const operationCards = [
    {
      title: "warehouse_page.op1_title",
      desc: "warehouse_page.op1_desc",
      image: "https://w.ladicdn.com/s700x700/67e69e24e8a7ba001127c80a/kho-my-14-1-20250729095528-dcsxm.jpg",
    },
    {
      title: "warehouse_page.op2_title",
      desc: "warehouse_page.op2_desc",
      image: "https://w.ladicdn.com/s700x700/67e69e24e8a7ba001127c80a/kho-my-11-1-20250729095528-nzruq.jpg",
    },
    {
      title: "warehouse_page.op3_title",
      desc: "warehouse_page.op3_desc",
      image: "https://w.ladicdn.com/s700x700/67e69e24e8a7ba001127c80a/kho-my-10-1-20250729095528-mkcfd.jpg",
    },
    {
      title: "warehouse_page.op4_title",
      desc: "warehouse_page.op4_desc",
      image: "https://w.ladicdn.com/s700x700/67e69e24e8a7ba001127c80a/img_9988-20250801074609-jjvij.jpg",
    },
  ];


  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero – Gold Mint */}
      <section className="pt-28 pb-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(220 25% 12%) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }} />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2.5 text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse flex-shrink-0" />
              <span className="font-medium text-navy/70 uppercase text-xs tracking-wider">{t("warehouse_page.badge")}</span>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-navy tracking-tight mb-6 leading-tight uppercase" >
              {t("warehouse_page.hero_title")} <br />
              <span className="text-gradient-gold text-2xl md:text-3xl lg:text-4xl normal-case mt-3 inline-block">{t("warehouse_page.hero_subtitle")}</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={250}>
            <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
              <span className="text-primary font-bold text-base md:text-lg uppercase tracking-widest">{t("warehouse_page.hero_tagline")}</span>
              <span className="hidden sm:inline text-navy/30 font-bold text-lg">|</span>
              <span className="text-primary font-bold text-base md:text-lg uppercase tracking-widest">{t("warehouse_page.hero_tagline2")}</span>
            </div>
          </ScrollReveal>
          {/* Hero videos */}
          <ScrollReveal delay={300}>
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 lg:gap-8 mb-8">
              <div className="rounded-2xl flex overflow-hidden shadow-2xl border border-border/40 hover:-translate-y-1 transition-transform aspect-video bg-black relative group">
                <YouTubeEmbed videoId="KPhQYnkYA68" className="w-full h-full" />
                <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-2xl"></div>
              </div>
              <div className="rounded-2xl flex overflow-hidden shadow-2xl border border-border/40 hover:-translate-y-1 transition-transform aspect-video bg-black relative group">
                <YouTubeEmbed videoId="blS1dmH_xb8" className="w-full h-full" />
                <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-2xl"></div>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <a href="https://www.facebook.com/thgwarehouse" target="_blank" rel="noopener noreferrer">
              <Button className="bg-[hsl(var(--gold))] hover:bg-[hsl(var(--gold-dark))] text-white border-0 shadow-[0_0_20px_rgba(201,162,86,0.3)] hover:shadow-[0_0_30px_rgba(201,162,86,0.5)] px-8 py-6 rounded-full text-lg font-bold transition-all hover:-translate-y-1 mt-6">
                {t("warehouse_page.cta")}
              </Button>
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-16 bg-card border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {[
              "warehouse_page.stat1",
              "warehouse_page.stat2",
              "warehouse_page.stat3",
              "warehouse_page.stat4",
            ].map((key, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-background border border-border/50">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <p className="text-sm md:text-base font-semibold text-navy">{t(key)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4" >THG Warehouse</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("warehouse_page.solution_title")}</h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((f, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="glass-card rounded-2xl p-8 text-center hover-lift h-full">
                  <span className="text-4xl block mb-4">{f.icon}</span>
                  <h3 className="text-xl font-bold text-navy mb-3">{t(f.titleKey)}</h3>
                  <p className="text-base text-navy/70 leading-relaxed" dangerouslySetInnerHTML={{ __html: t(f.descKey) }} />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Warehouse Strengths with Images */}
      <section className="py-24 bg-card relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("warehouse_page.strengths_title")}</h2>
            </div>
          </ScrollReveal>

          <div className="max-w-5xl mx-auto space-y-16">
            {/* Block 1: Dual Warehouse */}
            <ScrollReveal>
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div className="rounded-2xl overflow-hidden shadow-lg border border-border/40 hover:shadow-xl transition-all hover:-translate-y-1">
                  <img
                    src="https://w.ladicdn.com/s1500x1100/67e69e24e8a7ba001127c80a/kho-my-10-1-20250729095528-mkcfd.jpg"
                    alt="Dual Warehouse PA & NC"
                    className="w-full h-72 object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-navy mb-4">{t("warehouse_page.str2_title")}</h3>
                  <p className="text-navy/70 leading-relaxed">{t("warehouse_page.str2_desc")}</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Block 2: Cost */}
            <ScrollReveal delay={100}>
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div className="order-2 lg:order-1">
                  <h3 className="text-2xl font-bold text-navy mb-4">{t("warehouse_page.str1_title")}</h3>
                  <p className="text-navy/70 leading-relaxed mb-6">{t("warehouse_page.str1_desc")}</p>
                </div>
                <div className="order-1 lg:order-2 rounded-2xl overflow-hidden shadow-lg border border-border/40 hover:shadow-xl transition-all hover:-translate-y-1 bg-black aspect-video">
                  <YouTubeEmbed videoId="eJF-6mn2APQ" className="w-full h-full" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
      {/* Packing Video Feature */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("warehouse_page.str5_title")}</h2>
              <p className="text-navy/70 mt-4 leading-relaxed text-lg">{t("warehouse_page.str5_desc")}</p>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {["wcJ_iwwDcBM", "Gi_zlY_Hmw4", "qeADCwk23JU"].map((videoId, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="glass-card rounded-2xl overflow-hidden hover-lift h-full shadow-lg border border-border/40">
                  <div className="bg-black relative">
                    <YouTubeEmbed
                      videoId={videoId}
                      aspectRatio="9/16"
                      className="rounded-2xl"
                    />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Operation Images Grid */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">{t("warehouse_page.ops_badge")}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("warehouse_page.gallery_title")}</h2>
              <p className="text-navy/70 mt-3 max-w-xl mx-auto">{t("warehouse_page.gallery_desc")}</p>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {operationCards.map((card, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="glass-card rounded-2xl overflow-hidden hover-lift h-full group">
                  <div className="h-52 overflow-hidden">
                    <img
                      src={card.image}
                      alt={t(card.title)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-bold text-navy mb-2">{t(card.title)}</h4>
                    <p className="text-xs text-navy/70 leading-relaxed">{t(card.desc)}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* OMS Detail – Split */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-center">
            <ScrollReveal>
              <div>
                <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">{t("warehouse_page.oms_badge")}</p>
                <h2 className="text-2xl md:text-3xl font-bold text-navy tracking-tight mb-6">{t("warehouse_page.oms_title")}</h2>
                <p className="text-navy/70 leading-relaxed mb-4">{t("warehouse_page.oms_desc1")}</p>
                <p className="text-navy/70 leading-relaxed mb-8">{t("warehouse_page.oms_desc2")}</p>
                <a href="https://oms.thgfulfill.com/" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="rounded-full px-6 py-5 gap-2">
                    {t("warehouse_page.oms_cta")} <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200} direction="right">
              <YouTubeEmbed videoId="o46X3StSbnY" title="THG Warehouse OMS" />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-card">
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
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <s.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold text-primary/40">{t("wh_faq.step_prefix")} {s.num}</span>
                      <h3 className="text-base font-bold text-navy tracking-tight">{t(s.titleKey)}</h3>
                    </div>
                    <p className="text-sm text-navy/70 leading-relaxed">{t(s.descKey)}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Logistics Gallery */}
      <section className="py-20 bg-background overflow-hidden relative">
        <ImageMarquee images={sliderImages} />
      </section>

      {/* FAQ – Q&A Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">Q&A</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("wh_faq.title")}</h2>
              <p className="text-navy/70 mt-3 max-w-xl mx-auto">{t("wh_faq.subtitle")}</p>
            </div>
          </ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <FAQAccordion items={warehouseFAQs} />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />

    </div>
  );
};

export default THGWarehousePage;
