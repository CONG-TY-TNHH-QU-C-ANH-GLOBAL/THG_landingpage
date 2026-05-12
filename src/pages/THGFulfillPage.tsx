import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import { SeoHead } from "@/components/seo/SeoHead";
import { JsonLdService, JsonLdBreadcrumb } from "@/components/seo/JsonLd";

import ScrollReveal from "@/components/ScrollReveal";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import ImageMarquee from "@/components/ImageMarquee";
import FAQAccordion from "@/components/FAQAccordion";
import { useI18n } from "@/lib/i18n";
import { useCmsServices } from "@/hooks/useCmsContent";
import { Package, ArrowRight, Zap, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LeadFormDialog } from "@/components/lead/LeadFormDialog";

const painPoints = [
  { num: "01", titleKey: "fulfill_page.pain1_title", descKey: "fulfill_page.pain1_desc" },
  { num: "02", titleKey: "fulfill_page.pain2_title", descKey: "fulfill_page.pain2_desc" },
  { num: "03", titleKey: "fulfill_page.pain3_title", descKey: "fulfill_page.pain3_desc" },
  { num: "04", titleKey: "fulfill_page.pain4_title", descKey: "fulfill_page.pain4_desc" },
];

const processSteps = [
  { num: "01", titleKey: "fulfill_page.step1_title", descKey: "fulfill_page.step1_desc", icon: Palette },
  { num: "02", titleKey: "fulfill_page.step2_title", descKey: "fulfill_page.step2_desc", icon: Package },
  { num: "03", titleKey: "fulfill_page.step3_title", descKey: "fulfill_page.step3_desc", icon: Zap },
  { num: "04", titleKey: "fulfill_page.step4_title", descKey: "fulfill_page.step4_desc", icon: ArrowRight },
];

const THGFulfillPage = () => {
  const { t, language } = useI18n();
  const { data: servicesData } = useCmsServices(language);
  const service = servicesData?.services.find((s) => s.id === "thg-fulfill");
  const products = service?.products ?? [];
  const sliderImages = (service?.gallery ?? []).map((g) => g.url).filter((u): u is string => !!u);

  const faqItems = [
    { question: t("fulfill_page.faq1_q"), answer: t("fulfill_page.faq1_a") },
    { question: t("fulfill_page.faq2_q"), answer: t("fulfill_page.faq2_a") },
    { question: t("fulfill_page.faq3_q"), answer: t("fulfill_page.faq3_a") },
    { question: t("fulfill_page.faq4_q"), answer: t("fulfill_page.faq4_a") },
    { question: t("fulfill_page.faq5_q"), answer: t("fulfill_page.faq5_a") },
    { question: t("fulfill_page.faq6_q"), answer: t("fulfill_page.faq6_a") },
    { question: t("fulfill_page.faq7_q"), answer: t("fulfill_page.faq7_a") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="THG Fulfill — POD & Dropship Fulfillment for US Sellers"
        description={t("fulfill_page.hero_subtitle")}
        path="/thg-fulfill"
      />
      <JsonLdService
        name="THG Fulfill — POD & Dropship Fulfillment"
        description="End-to-end Print-on-Demand and Dropship fulfillment from Vietnam, China and USA warehouses. Optimized basecost, multi-route shipping, transparent pricing."
        url="https://thgfulfill.com/thg-fulfill"
      />
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://thgfulfill.com/" },
          { name: "THG Fulfill", url: "https://thgfulfill.com/thg-fulfill" },
        ]}
      />
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
                  <span className="font-medium text-muted-foreground uppercase text-xs tracking-wider">{t("fulfill_page.pod_dropship_badge")}</span>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-navy tracking-tight mb-6" >
                  THG <span className="text-gradient-gold">Fulfill</span>
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <p className="text-lg md:text-xl text-muted-foreground max-w-lg mb-4">{t("fulfill_page.hero_subtitle")}</p>
                <p className="text-base text-primary font-semibold tracking-wide uppercase">{t("fulfill_page.hero_tagline")}</p>
              </ScrollReveal>
              <ScrollReveal delay={300}>
                <div className="flex flex-wrap gap-4 mt-10">
                  <LeadFormDialog
                    sourcePage="/thg-fulfill"
                    trigger={
                      <Button className="bg-primary hover:bg-gold-dark text-primary-foreground rounded-full px-8 py-6 text-base gap-2 shadow-lg">
                        {t("nav.consult")} <ArrowRight className="w-4 h-4" />
                      </Button>
                    }
                  />
                </div>
              </ScrollReveal>
              {/* Platform logos */}
              <ScrollReveal delay={400}>
                <div className="mt-10">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-3">{t("fulfill_page.platforms_label")}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-muted-foreground/60">
                    {["Shopify", "Etsy", "WooCommerce", "Amazon", "TikTok Shop"].map((p, i) => (
                      <span key={i} className="hover:text-navy transition-colors">{p}</span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
            {/* POD Illustration */}
            <ScrollReveal delay={300} direction="right" className="hidden lg:block">
              <div className="relative">
                <div className="glass-card rounded-3xl p-8 flex flex-col items-center">
                  <p className="text-xs font-semibold text-accent uppercase tracking-[0.2em] mb-6">{t("fulfill_page.pod_process")}</p>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-28 h-32 bg-white rounded-xl border-2 border-dashed border-border flex items-center justify-center shadow-inner">
                        <span className="text-5xl">👕</span>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">{t("fulfill_page.blank_tshirt")}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-3xl animate-pulse">🖨️</span>
                      <div className="flex items-center">
                        <div className="w-10 h-px bg-primary/40" />
                        <ArrowRight className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{t("fulfill_page.dtg_print")}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-28 h-32 bg-gradient-to-br from-primary/15 to-accent/15 rounded-xl border-2 border-primary/30 flex items-center justify-center relative shadow-lg">
                        <span className="text-5xl">👕</span>
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[7px] font-bold px-2 py-1 rounded">
                          {t("fulfill_page.your_brand")}
                        </div>
                      </div>
                      <span className="text-xs text-primary font-semibold">{t("fulfill_page.branded_product")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* YouTube Shorts */}
      <section className="py-12 bg-card border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-6 flex-wrap">
            <ScrollReveal delay={100}>
              <div className="w-[280px] md:w-[300px] rounded-2xl overflow-hidden border-4 border-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
                <YouTubeEmbed videoId="AveVks7bdMM" title="THG Fulfill Short 1" aspectRatio="315/560" />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="w-[280px] md:w-[300px] rounded-2xl overflow-hidden border-4 border-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
                <YouTubeEmbed videoId="UrnZpvRVb0U" title="THG Fulfill Short 2" aspectRatio="315/560" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Overview Videos */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <ScrollReveal delay={100} direction="up">
              <div className="rounded-2xl flex border-4 border-white shadow-xl overflow-hidden aspect-[9/16]">
                <YouTubeEmbed videoId="UwaZw5Eh-Yg" title="THG Fulfill Overview 1" aspectRatio="auto" />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200} direction="up">
              <div className="rounded-2xl flex border-4 border-white shadow-xl overflow-hidden aspect-[9/16]">
                <YouTubeEmbed videoId="ZA37yjN-_x8" title="THG Fulfill Overview 2" aspectRatio="auto" />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={300} direction="up">
              <div className="rounded-2xl flex border-4 border-white shadow-xl overflow-hidden aspect-[9/16]">
                <YouTubeEmbed videoId="6GkUcZhun90" title="THG Fulfill Overview 3" aspectRatio="auto" />
              </div>
            </ScrollReveal>
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
                <div className={`glass-card rounded-2xl p-6 text-center hover-lift h-full ${i === 1 ? "ring-2 ring-primary/30 bg-primary/5" : ""}`}>
                  <span className="text-3xl font-bold text-primary/20 block mb-3">{p.num}</span>
                  <h3 className="text-sm font-bold text-navy mb-2 uppercase tracking-wider">{t(p.titleKey)}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t(p.descKey)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* POD Advantages */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">{t("fulfill_page.solution_subtitle")}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight mb-6">
                <span  >THG Fulfill</span> – <span className="text-gradient-gold">{t("fulfill_page.solution_highlight")}</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">{t("fulfill_page.solution_desc")}</p>
            </div>
          </ScrollReveal>

          {/* Advantage blocks with images */}
          <div className="max-w-5xl mx-auto space-y-16">
            <ScrollReveal>
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-navy mb-4 tracking-tight">{t("fulfill_page.adv1_title")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("fulfill_page.adv1_desc")}</p>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg border border-border/40 hover:shadow-xl transition-all hover:-translate-y-1">
                  <img
                    src="https://w.ladicdn.com/s750x750/67e69e24e8a7ba001127c80a/img_9873-20250801074610-q-tfu.jpg"
                    alt="All-in-one POD & Dropship ecosystem"
                    className="w-full h-64 object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="order-2 lg:order-1 rounded-2xl overflow-hidden shadow-lg border border-border/40 hover:shadow-xl transition-all hover:-translate-y-1 bg-black aspect-video flex">
                  <YouTubeEmbed videoId="2VEEFotO42I" title="THG Fulfill Introduction" aspectRatio="16/9" />
                </div>
                <div className="order-1 lg:order-2">
                  <h3 className="text-2xl font-bold text-navy mb-4 tracking-tight">{t("fulfill_page.adv3_title")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("fulfill_page.adv3_desc")}</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
              <div>
                <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">{t("fulfill_page.products_subtitle")}</p>
                <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("fulfill_page.products_title")}</h2>
              </div>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {products.map((product, i) => (
              <ScrollReveal key={product.name} delay={i * 120}>
                <div className="glass-card rounded-2xl overflow-hidden hover-lift h-full group">
                  <div className="relative h-72 bg-secondary/30 p-6 flex items-center justify-center overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <span className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-navy shadow-sm border border-border/40">
                      {product.origin}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-navy mb-4 tracking-tight group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="space-y-3 border-t-2 border-dashed border-border/50 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground font-medium">{t("fulfill_page.basecost_label")}</span>
                        <span className="text-lg font-bold text-gradient-gold">{product.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground font-medium">{t("fulfill_page.time_label")}</span>
                        <span className="text-sm font-semibold text-navy">{product.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Process */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("fulfill_page.process_title")}</h2>
            </div>
          </ScrollReveal>
          <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-center">
            {/* Left: Image */}
            <ScrollReveal>
              <div className="rounded-3xl overflow-hidden shadow-lg border border-border/40">
                <img
                  src="https://w.ladicdn.com/s800x750/67e69e24e8a7ba001127c80a/img_9873-20250801074610-q-tfu.jpg"
                  alt="Fulfillment Standard"
                  className="w-full h-[400px] object-cover"
                  loading="lazy"
                />
              </div>
            </ScrollReveal>
            {/* Right: Steps */}
            <div className="space-y-4">
              {processSteps.map((s, i) => (
                <ScrollReveal key={s.num} delay={i * 100}>
                  <div className="flex gap-5 glass-card rounded-2xl p-5 hover-lift">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <s.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-bold text-primary/40">{s.num}</span>
                        <h3 className="text-base font-bold text-navy tracking-tight">{t(s.titleKey)}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{t(s.descKey)}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ecount Guide - I: Video hướng dẫn */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">{t("fulfill_ecount.section_title")}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">
                <span className="text-gradient-gold">{t("fulfill_ecount.video_title")}</span>
              </h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                {t("fulfill_ecount.video_desc")}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="rounded-2xl overflow-hidden shadow-xl border border-border/40 max-w-3xl mx-auto">
              <YouTubeEmbed videoId="hMWmBlUVhAI" title="THG - Hướng dẫn cách lên đơn trên Ecount ERP" aspectRatio="16/9" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="mt-8 flex justify-center">
              <a
                href="https://docs.google.com/spreadsheets/d/1CE_mzKMyfFK93iS1Dm8Sk9-zijjsxdKRO786EweoCUI/edit?gid=0#gid=0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-6 py-3 font-semibold text-sm shadow-md hover:bg-gold-dark transition-colors"
              >
                {t("fulfill_ecount.sku_link")}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Ecount Guide - II: Lên đơn lẻ trên hệ thống ERP */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">
                <span className="text-gradient-gold">{t("fulfill_ecount.single_title")}</span>
              </h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                {t("fulfill_ecount.single_desc")}
              </p>
            </div>
          </ScrollReveal>

          {/* Step-by-step Guide */}
          <div className="space-y-10">
            {/* Step 1 */}
            <ScrollReveal>
              <div className="glass-card rounded-2xl p-6 md:p-8 border border-border/40 shadow-lg">
                <div className="flex items-center gap-4 mb-5">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold text-lg shadow-md">1</span>
                  <h3 className="text-xl font-bold text-navy">{t("fulfill_ecount.step1_title")}</h3>
                </div>
                <p className="text-muted-foreground mb-5 leading-relaxed">
                  {t("fulfill_ecount.step1_desc")}{" "}
                  <a href="https://login.ecount.com/Login/" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">
                    login.ecount.com
                  </a>
                  {t("fulfill_ecount.step1_desc2")}
                </p>
                <div className="rounded-xl overflow-hidden border border-border/30 shadow-sm">
                  <img
                    src="https://w.ladicdn.com/s1050x650/67e69e24e8a7ba001127c80a/1280x1280-1-20251230034756-auffc.png"
                    alt="Ecount Login Form"
                    className="w-full object-contain bg-white"
                    loading="lazy"
                  />
                </div>
              </div>
            </ScrollReveal>

            {/* Step 2 */}
            <ScrollReveal delay={50}>
              <div className="glass-card rounded-2xl p-6 md:p-8 border border-border/40 shadow-lg">
                <div className="flex items-center gap-4 mb-5">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold text-lg shadow-md">2</span>
                  <h3 className="text-xl font-bold text-navy">{t("fulfill_ecount.step2_title")}</h3>
                </div>
                <p className="text-muted-foreground mb-5 leading-relaxed">
                  {t("fulfill_ecount.step2_desc")}
                </p>
                <div className="rounded-xl overflow-hidden border border-border/30 shadow-sm">
                  <img
                    src="https://w.ladicdn.com/s1100x600/67e69e24e8a7ba001127c80a/1280x1280-2-20251230034755-5fcp-.png"
                    alt="Email Recovery Setup"
                    className="w-full object-contain bg-white"
                    loading="lazy"
                  />
                </div>
              </div>
            </ScrollReveal>

            {/* Step 3 */}
            <ScrollReveal delay={100}>
              <div className="glass-card rounded-2xl p-6 md:p-8 border border-border/40 shadow-lg">
                <div className="flex items-center gap-4 mb-5">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold text-lg shadow-md">3</span>
                  <h3 className="text-xl font-bold text-navy">{t("fulfill_ecount.step3_title")}</h3>
                </div>
                <p className="text-muted-foreground mb-5 leading-relaxed">
                  {t("fulfill_ecount.step3_desc")}
                </p>
                <div className="rounded-xl overflow-hidden border border-border/30 shadow-sm mb-5">
                  <img
                    src="https://w.ladicdn.com/s1100x650/67e69e24e8a7ba001127c80a/319aab8c-ea63-45af-9ec6-c0e2ccb1a7cd-20251230034755-miwjh.png"
                    alt="Ecount Personal Page - New Sale"
                    className="w-full object-contain bg-white"
                    loading="lazy"
                  />
                </div>
                {/* Form fields breakdown */}
                <div className="bg-[#FFFBF0] rounded-xl p-5 border border-[#F5D78E]/50">
                  <h4 className="font-bold text-navy text-sm mb-3">{t("fulfill_ecount.fields_title")}</h4>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    {[
                      { label: "Location", desc: t("fulfill_ecount.field_location") },
                      { label: "Order ID", desc: t("fulfill_ecount.field_orderid") },
                      { label: "Lastmile tracking", desc: t("fulfill_ecount.field_tracking") },
                      { label: "Seller code", desc: t("fulfill_ecount.field_seller") },
                      { label: "Service", desc: t("fulfill_ecount.field_service") },
                      { label: "Shipping label", desc: t("fulfill_ecount.field_label") },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="font-semibold text-navy whitespace-nowrap">{item.label}:</span>
                        <span className="text-muted-foreground">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-5 rounded-xl overflow-hidden border border-border/30 shadow-sm">
                  <img
                    src="https://w.ladicdn.com/s1100x650/67e69e24e8a7ba001127c80a/15351a69-d84c-47e9-a975-3cd9bf0d1d71-20251230034755-ksrwa.png"
                    alt="Ecount Form Fields Breakdown"
                    className="w-full object-contain bg-white"
                    loading="lazy"
                  />
                </div>
              </div>
            </ScrollReveal>

            {/* Step 4 */}
            <ScrollReveal delay={150}>
              <div className="glass-card rounded-2xl p-6 md:p-8 border border-border/40 shadow-lg">
                <div className="flex items-center gap-4 mb-5">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold text-lg shadow-md">4</span>
                  <h3 className="text-xl font-bold text-navy">{t("fulfill_ecount.step4_title")}</h3>
                </div>
                <p className="text-muted-foreground mb-5 leading-relaxed">
                  {t("fulfill_ecount.step4_desc")}
                </p>
                <div className="rounded-xl overflow-hidden border border-border/30 shadow-sm mb-5">
                  <img
                    src="https://w.ladicdn.com/s1150x750/67e69e24e8a7ba001127c80a/410028fe-7792-478e-9acb-fca06bec4a87-20251230034755-6btjj.png"
                    alt="SKU Selection"
                    className="w-full object-contain bg-white"
                    loading="lazy"
                  />
                </div>
                <div className="bg-[#F0F7FF] rounded-xl p-4 border border-blue-200/50 text-sm">
                  <p className="text-navy">
                    <strong>{t("fulfill_ecount.step4_example")}</strong> <code className="bg-navy/10 px-2 py-0.5 rounded text-xs font-mono">2-PC01-ip12pr-wht</code> {t("fulfill_ecount.step4_example2")}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* SKU Link button */}
          <ScrollReveal delay={200}>
            <div className="mt-10 flex justify-center">
              <a
                href="https://docs.google.com/spreadsheets/d/1CE_mzKMyfFK93iS1Dm8Sk9-zijjsxdKRO786EweoCUI/edit?gid=0#gid=0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-6 py-3 font-semibold text-sm shadow-md hover:bg-gold-dark transition-colors"
              >
                📋 Link SKU for THG FULFILL
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* HUB Fulfill Section */}
      <section className="py-24 bg-card border-y border-border/50">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">Dashboard</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("fulfill_page.hub_title")}</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                {t("fulfill_page.hub_desc")}
              </p>
            </div>
          </ScrollReveal>
          <div className="max-w-5xl mx-auto">
            <ScrollReveal delay={100}>
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://w.ladicdn.com/s1100x650/67e69e24e8a7ba001127c80a/319aab8c-ea63-45af-9ec6-c0e2ccb1a7cd-20251230034755-miwjh.png"
                  alt="HUB Fulfill Dashboard"
                  className="w-full h-auto object-cover bg-white"
                  loading="lazy"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="mt-12 flex justify-center">
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-3 bg-navy text-white hover:bg-navy/90 px-8 py-4 rounded-full font-bold text-lg transition-transform hover:-translate-y-1 shadow-xl notranslate"
                  translate="no"
                >
                  🚀 {t("fulfill_page.hub_cta")}
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Policy CTA */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <ScrollReveal>
            <div className="bg-gradient-to-r from-navy to-[#1a233b] rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between shadow-2xl border border-white/10 relative overflow-hidden">
              {/* Decorative glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(var(--gold))]/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

              <div className="relative z-10 text-center md:text-left mb-8 md:mb-0 max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">{t("fulfill_page.policy_title")}</h2>
                <p className="text-white/80 text-lg leading-relaxed">{t("fulfill_page.policy_desc")}</p>
              </div>
              <div className="relative z-10 shrink-0">
                <Link
                  to="/policy"
                  className="inline-flex items-center gap-2 bg-[hsl(var(--gold))] hover:bg-[hsl(var(--gold-dark))] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(201,162,86,0.3)] transition-all hover:shadow-[0_0_30px_rgba(201,162,86,0.5)] hover:-translate-y-1 notranslate"
                  translate="no"
                >
                  {t("fulfill_page.policy_cta")} <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Logistics Gallery */}
      <section className="py-20 bg-card overflow-hidden">
        <div className="container mx-auto px-4 mb-12">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-navy tracking-tight">{t("fulfill_page.gallery_title")}</h2>
            </div>
          </ScrollReveal>
        </div>
        <ImageMarquee images={sliderImages} />
      </section>

      {/* FAQ */}

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">{t("fulfill_page.faq_subtitle")}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("fulfill_page.faq_title")}</h2>
            </div>
          </ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <FAQAccordion items={faqItems} />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />


    </div>
  );
};

export default THGFulfillPage;
