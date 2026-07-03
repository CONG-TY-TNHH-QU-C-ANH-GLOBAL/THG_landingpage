import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import { SeoHead } from "@/components/seo/SeoHead";
import { JsonLdService, JsonLdBreadcrumb } from "@/components/seo/JsonLd";

import ScrollReveal from "@/components/ScrollReveal";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import FAQAccordion from "@/components/FAQAccordion";
import { useI18n } from "@/lib/i18n";
import { Truck, Plane, Shield, MapPin, Globe, CheckCircle2, Lock, Users, Headphones, CircleDollarSign, Rocket, Warehouse, UsersRound, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadFormDialog } from "@/components/lead/LeadFormDialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";
import { EXPRESS_HERO_URL } from "@/config/cmsAssets";

/* ─── Data ─── */
const features = [
  { icon: CircleDollarSign, titleKey: "express_page.feat2_title", descKey: "express_page.feat2_desc" },
  { icon: Plane, titleKey: "express_page.feat1_title", descKey: "express_page.feat1_desc" },
  { icon: Users, titleKey: "express_page.feat4_title", descKey: "express_page.feat4_desc" },
  { icon: Rocket, titleKey: "express_page.feat3_title", descKey: "express_page.feat3_desc" },
];

const processSteps = [
  { num: "01", titleKey: "express_page.step1_title", descKey: "express_page.step1_desc", icon: Globe },
  { num: "02", titleKey: "express_page.step2_title", descKey: "express_page.step2_desc", icon: Truck },
  { num: "03", titleKey: "express_page.step3_title", descKey: "express_page.step3_desc", icon: Plane },
  { num: "04", titleKey: "express_page.step4_title", descKey: "express_page.step4_desc", icon: MapPin },
];

const galleryImages = [
  EXPRESS_HERO_URL,
  "https://w.ladicdn.com/s750x450/67e69e24e8a7ba001127c80a/standee-thg-7-20250721100534-85tng.png",
  "https://w.ladicdn.com/s750x450/67e69e24e8a7ba001127c80a/img_9979-20250724025706-v7ewy.jpg",
  "https://w.ladicdn.com/s750x450/67e69e24e8a7ba001127c80a/img_7303-20250724025705-mco7x.jpg",
  "https://w.ladicdn.com/s750x450/67e69e24e8a7ba001127c80a/img_9554-20250726042334--dcox.jpg",
  "https://w.ladicdn.com/s750x450/67e69e24e8a7ba001127c80a/img_4390-20250726042334-q7ti-.jpg"
];

/* ─── Page ─── */
const THGExpressPage = () => {
  const { t, language } = useI18n();

  const faqItems = [
    { question: t("express_page.faq1_q"), answer: t("express_page.faq1_a") },
    { question: t("express_page.faq2_q"), answer: t("express_page.faq2_a") },
    { question: t("express_page.faq3_q"), answer: t("express_page.faq3_a") },
    { question: t("express_page.faq4_q"), answer: t("express_page.faq4_a") },
    { question: t("express_page.faq5_q"), answer: t("express_page.faq5_a") },
    { question: t("express_page.faq6_q"), answer: t("express_page.faq6_a") },
    { question: t("express_page.faq7_q"), answer: t("express_page.faq7_a") },
    { question: t("express_page.faq8_q"), answer: t("express_page.faq8_a") },
    { question: t("express_page.faq9_q"), answer: t("express_page.faq9_a") },
    { question: t("express_page.faq10_q"), answer: t("express_page.faq10_a") },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SeoHead
        title={t("seo.express_title")}
        description={t("seo.express_desc")}
        path="/thg-express"
        ogImage={EXPRESS_HERO_URL}
      />
      <JsonLdService
        name="THG Express — International Shipping"
        description="Multi-route international shipping from Vietnam and China to USA: Sea 20-25 days, Air 3-5 days, Express 6-10 days. TikTok Shop supported."
        url="https://thgfulfill.com/thg-express"
      />
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://thgfulfill.com/" },
          { name: "THG Express", url: "https://thgfulfill.com/thg-express" },
        ]}
      />
      <Navbar />

      {/* 1. HERO & TRACKING */}
      <section className="pt-32 pb-24 bg-gradient-hero relative overflow-hidden flex flex-col items-center justify-center min-h-[60vh]">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(220 25% 12%) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }} />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <ScrollReveal direction="up">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-navy mb-6 tracking-tight">
              THG <span className="text-gradient-gold">EXPRESS</span>
            </h1>
            <h2 className="text-xl md:text-2xl text-muted-foreground font-medium mb-4">
              {t("express_page.hero_subtitle")}
            </h2>
            <p className="text-base text-primary font-semibold tracking-wide uppercase mb-10 drop-shadow-sm">
              {t("express_page.hero_tagline")}
            </p>
            <LeadFormDialog
              sourcePage="/thg-express#hero"
              trigger={
                <Button className="bg-primary hover:bg-gold-dark text-white px-10 py-6 rounded-full text-lg font-bold shadow-lg transition-transform hover:-translate-y-1">
                  {t("express_page.get_quote_cta")}
                </Button>
              }
            />
          </ScrollReveal>
        </div>
      </section>

      {/* 2. ĐA DẠNG CHUYẾN TÀU (SHIPPING GRID OVERLAY) */}
      <section className="py-24 bg-card relative overflow-hidden">
        {/* Top Text & CTA */}
        <div className="container mx-auto px-4 mb-16 text-center">
          <ScrollReveal direction="up">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6 tracking-tight leading-tight uppercase">
                <span>{t("express_page.partnership_title_sub")}</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                {t("express_page.partnership_desc")}
              </p>
              <LeadFormDialog
                sourcePage="/thg-express#partnership"
                trigger={
                  <Button className="bg-primary hover:bg-gold-dark text-white px-10 py-7 rounded-full text-lg font-bold shadow-lg transition-transform hover:-translate-y-1">
                    {t("express_page.shipping_comprehensive_cta")}
                  </Button>
                }
              />
            </div>
          </ScrollReveal>
        </div>

        {/* 4 Cards Grid at the bottom */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <ScrollReveal key={idx} delay={idx * 100} direction="up" className="h-full">
                <div className="bg-white p-8 rounded-[20px] h-full shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col items-center text-center group hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300 border border-gray-100">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-3 uppercase text-navy">{t(feature.titleKey)}</h3>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">{t(feature.descKey)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. VIDEO LOGISTICS PARTNERSHIP */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 max-w-5xl mx-auto">
            <ScrollReveal delay={100} direction="up">
              <div className="rounded-2xl flex border-4 border-white shadow-xl overflow-hidden aspect-video relative group">
                <YouTubeEmbed videoId="BJmuA108gok" title="Bảng Giá THG Line Tiktok" aspectRatio="auto" />
                <div className="absolute inset-0 pointer-events-none border border-black/5 rounded-2xl"></div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={300} direction="up">
              <div className="rounded-2xl flex border-4 border-white shadow-xl overflow-hidden aspect-video relative group">
                <YouTubeEmbed videoId="fIg0fhQlVXg" title="Ship Hàng Đi Mỹ" aspectRatio="auto" />
                <div className="absolute inset-0 pointer-events-none border border-black/5 rounded-2xl"></div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={400} direction="up">
              <div className="rounded-2xl flex border-4 border-white shadow-xl overflow-hidden aspect-video relative group">
                <YouTubeEmbed videoId="MXpMVfLgKTw" title="Thủ Tục Hải Quan Global" aspectRatio="auto" />
                <div className="absolute inset-0 pointer-events-none border border-black/5 rounded-2xl"></div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. HỆ THỐNG KHO TẠI CHINA */}
      <section className="relative py-24 min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://w.ladicdn.com/s1700x1700/67e69e24e8a7ba001127c80a/ec23ddd3a6407152891b589f3e4cb74f-20251024025219-ty5zp.jpg"
            alt="China Warehouse"
            className="w-full h-full object-cover scale-105"
          />
          {/* Dark overlay to replicate the legacy design's contrast */}
          <div className="absolute inset-0 bg-black/65" />
        </div>
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight uppercase drop-shadow-md">
                {t("express_page.warehouse_title")}
              </h2>
              <p className="text-lg md:text-[20px] text-white/95 font-medium max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
                {t("express_page.warehouse_desc")}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-10 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <ScrollReveal delay={100} direction="up" className="h-full">
              <div className="h-full bg-black/20 backdrop-blur-sm p-8 lg:p-10 rounded-[20px] flex flex-col border-2 border-[#F27125]/90 hover:bg-black/40 transition-colors duration-300">
                <div className="text-[#F27125] mb-6 inline-flex">
                  <Warehouse className="w-10 h-10" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">
                  {t("express_page.warehouse_feature1_title")}
                </h3>
                <p className="text-[#f5f5f5] text-[15px] font-medium leading-relaxed">
                  {t("express_page.warehouse_feature1_desc")}
                </p>
              </div>
            </ScrollReveal>

            {/* Feature 2 */}
            <ScrollReveal delay={200} direction="up" className="h-full">
              <div className="h-full bg-black/20 backdrop-blur-sm p-8 lg:p-10 rounded-[20px] flex flex-col border-2 border-[#F27125]/90 hover:bg-black/40 transition-colors duration-300">
                <div className="text-[#F27125] mb-6 inline-flex">
                  <UsersRound className="w-10 h-10" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">
                  {t("express_page.warehouse_feature2_title")}
                </h3>
                <p className="text-[#f5f5f5] text-[15px] font-medium leading-relaxed">
                  {t("express_page.warehouse_feature2_desc")}
                </p>
              </div>
            </ScrollReveal>

            {/* Feature 3 */}
            <ScrollReveal delay={300} direction="up" className="h-full">
              <div className="h-full bg-black/20 backdrop-blur-sm p-8 lg:p-10 rounded-[20px] flex flex-col border-2 border-[#F27125]/90 hover:bg-black/40 transition-colors duration-300">
                <div className="text-[#F27125] mb-6 inline-flex">
                  <Network className="w-10 h-10" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">
                  {t("express_page.warehouse_feature3_title")}
                </h3>
                <p className="text-[#f5f5f5] text-[15px] font-medium leading-relaxed">
                  {t("express_page.warehouse_feature3_desc")}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 5. VẬN CHUYỂN TOÀN DIỆN */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="right">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://w.ladicdn.com/s850x850/67e69e24e8a7ba001127c80a/img_9979-20250724025706-v7ewy.jpg"
                  alt="THG Express Boxes"
                  className="w-full h-auto object-cover"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="left">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6 tracking-tight uppercase leading-tight">
                  {t("express_page.shipping_comprehensive_title")}
                </h2>
                <div className="space-y-4 mb-8">
                  <p className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{t("express_page.shipping_comprehensive_feat1")}</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{t("express_page.shipping_comprehensive_feat2")}</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{t("express_page.shipping_comprehensive_feat3")}</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{t("express_page.shipping_comprehensive_feat4")}</span>
                  </p>
                </div>
                <LeadFormDialog
                  sourcePage="/thg-express#comprehensive"
                  trigger={
                    <Button className="bg-[hsl(var(--gold))] hover:bg-[hsl(var(--gold-dark))] text-white px-8 py-6 rounded-full text-lg font-bold shadow-xl transition-transform hover:-translate-y-1">
                      {t("express_page.shipping_comprehensive_cta")}
                    </Button>
                  }
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 6. TẠI SAO CHỌN THG EXPRESS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight uppercase">
                {t("express_page.trust_title")}
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <ScrollReveal direction="left">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://w.ladicdn.com/s800x750/67e69e24e8a7ba001127c80a/img_9554-20250726042334--dcox.jpg"
                  alt="Customer Trust"
                  className="w-full h-auto object-cover"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { icon: Globe, title: "trust_feat1", desc: "trust_feat1_desc" },
                  { icon: Lock, title: "trust_feat2", desc: "trust_feat2_desc" },
                  { icon: Shield, title: "trust_feat3", desc: "trust_feat3_desc" },
                  { icon: Headphones, title: "trust_feat4", desc: "trust_feat4_desc" }
                ].map((f, i) => (
                  <div key={i} className="flex flex-col items-start bg-card p-6 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-navy/5 text-[hsl(var(--gold))] rounded-full flex items-center justify-center mb-4">
                      <f.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-navy mb-2">{t(`express_page.${f.title}`)}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{t(`express_page.${f.desc}`)}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 7. QUY TRÌNH VẬN HÀNH */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight uppercase">
                {t("express_page.process_title")}
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <ScrollReveal direction="left">
              <div className="space-y-6">
                {processSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-6 items-start bg-white p-6 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-navy text-white font-bold text-xl rounded-full flex items-center justify-center flex-shrink-0 font-serif shadow-inner">
                      {step.num}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-navy mb-2">{t(step.titleKey)}</h3>
                      <p className="text-muted-foreground">{t(step.descKey)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://w.ladicdn.com/s750x750/67e69e24e8a7ba001127c80a/img_9554-20250726042205-ztjpi.jpg"
                  alt="Process"
                  className="w-full h-auto object-cover"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 8. CHÍNH SÁCH VÀ ĐIỀU KHOẢN (Screenshot 3) */}
      <section className="py-20 bg-[hsl(36_30%_98%)]">
        <div className="container mx-auto px-4 max-w-5xl">
          <ScrollReveal direction="up">
            <div className="flex flex-col md:flex-row bg-[#F27125] rounded-3xl overflow-hidden shadow-2xl items-center border-[6px] border-white">
              {/* Image Side (Left) */}
              <div className="w-full md:w-1/2 aspect-video md:aspect-square overflow-hidden bg-white">
                <img
                  src="https://w.ladicdn.com/s700x550/67e69e24e8a7ba001127c80a/z6885389848678_da4c0cadd5309d50a02fbbda381b4b93-20250808082501-kbm5f.jpg"
                  alt="USPS Tracking Boxes"
                  className="w-full h-full object-cover scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://w.ladicdn.com/s600x700/67e69e24e8a7ba001127c80a/img_9554-20250726042205-ztjpi.jpg";
                  }}
                />
              </div>
              {/* Text Side (Right) */}
              <div className="w-full md:w-1/2 p-10 md:p-16 text-center text-white flex flex-col justify-center items-center">
                <h3 className="text-xl md:text-2xl font-bold uppercase mb-2">{t("express_page.policy_section_subtitle")}</h3>
                <h2 className="text-4xl md:text-5xl font-black mb-8 uppercase drop-shadow-md">{t("express_page.policy_section_title")}</h2>
                <Link to={`/${language}/shipping-policy#express`}>
                  <Button className="bg-white text-[#F27125] hover:bg-white/90 font-bold px-10 py-6 rounded-md text-lg shadow-lg">
                    {t("express_page.policy_cta")}
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 9. {t("express_page.line_routes_title")} (Simplified Centered Layout) */}
      <section className="bg-[hsl(36_30%_98%)] relative py-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-4 max-w-5xl relative z-10">

          {/* Text Container: Centered */}
          <div className="w-full text-center lg:text-left mb-16 pt-8 max-w-4xl mx-auto">
            <ScrollReveal direction="up" className="bg-white/90 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-6 lg:p-0 rounded-2xl">
              <h2 className="text-4xl md:text-5xl lg:text-[46px] font-bold text-[#F27125] uppercase leading-tight mb-5 tracking-tight drop-shadow-sm text-center">
                {t("express_page.line_routes_title")}
              </h2>
              <p className="text-navy/85 text-[15px] lg:text-[16px] font-semibold mb-8 leading-relaxed text-justify drop-shadow-sm">
                {t("express_page.line_routes_desc")}
              </p>
              <div className="flex justify-center">
                <LeadFormDialog
                  sourcePage="/thg-express#routes"
                  trigger={
                    <Button className="bg-[#F27125] text-white hover:bg-[#d95c1a] font-black px-10 py-[1.4rem] rounded-full text-sm lg:text-[15px] shadow-2xl shadow-orange-500/30 uppercase tracking-widest transition-transform hover:-translate-y-1">
                      {t("express_page.get_quote_cta")}
                    </Button>
                  }
                />
              </div>
            </ScrollReveal>
          </div>

          {/* Cards Container: Centered Grid (Ultra Compact) */}
          <div className="w-full relative mx-auto max-w-3xl">
            <div className="grid md:grid-cols-2 gap-4 md:gap-6 relative z-20">

              {/* Center Decal */}
              <div className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none z-0">
                <div className="text-[#3b73cd]/10 text-[8rem] font-black italic tracking-tighter leading-none select-none">&gt;</div>
              </div>

              {/* Card 01 */}
              <ScrollReveal delay={100} direction="up" className="relative group rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.1)] aspect-[16/10] bg-white">
                <img loading="lazy" src="https://w.ladicdn.com/s500x400/67e69e24e8a7ba001127c80a/img_4390-20250726042334-q7ti-.jpg" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#df7238]/95 via-[#d46535]/85 to-[#3b73cd]/95 mix-blend-normal"></div>
                <div className="relative z-10 p-5 lg:p-6 flex flex-col h-full text-white justify-between">
                  <div>
                    <h3 className="text-lg lg:text-[19px] font-bold mb-2 drop-shadow-md tracking-wide">{t("express_page.route1_title")}</h3>
                    <p className="text-[12px] font-bold opacity-95 mb-1 drop-shadow-sm">{t("express_page.route1_bulk")}</p>
                    <p className="text-[12px] font-bold opacity-95 drop-shadow-sm">{t("express_page.route1_epacket")}</p>
                  </div>
                  <div className="absolute bottom-1 right-2 text-[70px] lg:text-[85px] leading-none font-black italic opacity-95 drop-shadow-2xl tracking-tighter mix-blend-overlay select-none">01</div>
                </div>
              </ScrollReveal>

              {/* Card 02 */}
              <ScrollReveal delay={200} direction="up" className="relative group rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.1)] aspect-[16/10] bg-white">
                <img loading="lazy" src="https://w.ladicdn.com/s500x400/67e69e24e8a7ba001127c80a/img_9554-20250726042334--dcox.jpg" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#df7238]/95 via-[#d46535]/85 to-[#3b73cd]/95 mix-blend-normal"></div>
                <div className="relative z-10 p-5 lg:p-6 flex flex-col h-full text-white justify-between">
                  <div>
                    <h3 className="text-lg lg:text-[19px] font-bold mb-2 drop-shadow-md tracking-wide">{t("express_page.route2_title")}</h3>
                    <p className="text-[12px] font-bold opacity-95 mb-1 drop-shadow-sm">{t("express_page.route1_bulk")}</p>
                    <p className="text-[12px] font-bold opacity-95 mb-1 drop-shadow-sm">{t("express_page.route1_epacket")}</p>
                    <p className="text-[12px] font-bold opacity-95 drop-shadow-sm">{t("express_page.route2_tiktok")}</p>
                  </div>
                  <div className="absolute bottom-1 right-2 text-[70px] lg:text-[85px] leading-none font-black italic opacity-95 drop-shadow-2xl tracking-tighter mix-blend-overlay select-none">02</div>
                </div>
              </ScrollReveal>

              {/* Card 03 */}
              <ScrollReveal delay={300} direction="up" className="relative group rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.1)] aspect-[16/10] bg-white">
                <img loading="lazy" src="https://w.ladicdn.com/s500x400/67e69e24e8a7ba001127c80a/img_7919-20250811065942-lqajy.jpg" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#df7238]/95 via-[#d46535]/85 to-[#3b73cd]/95 mix-blend-normal"></div>
                <div className="relative z-10 p-5 lg:p-6 flex flex-col h-full text-white justify-between">
                  <div>
                    <h3 className="text-lg lg:text-[19px] font-bold mb-2 drop-shadow-md tracking-wide">{t("express_page.route3_title")}</h3>
                    <p className="text-[12px] font-bold opacity-95 mb-1 drop-shadow-sm">{t("express_page.route1_bulk")}</p>
                    <p className="text-[12px] font-bold opacity-95 drop-shadow-sm">{t("express_page.route1_epacket")}</p>
                  </div>
                  <div className="absolute bottom-1 right-2 text-[70px] lg:text-[85px] leading-none font-black italic opacity-95 drop-shadow-2xl tracking-tighter mix-blend-overlay select-none">03</div>
                </div>
              </ScrollReveal>

              {/* Card 04 */}
              <ScrollReveal delay={400} direction="up" className="relative group rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.1)] aspect-[16/10] bg-white">
                <img loading="lazy" src="https://w.ladicdn.com/s500x400/67e69e24e8a7ba001127c80a/cong-ty-van-chuyen-quoc-te-20250808094223-li7pn.jpg" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#df7238]/95 via-[#d46535]/85 to-[#3b73cd]/95 mix-blend-normal"></div>
                <div className="relative z-10 p-5 lg:p-6 flex flex-col h-full text-white justify-between">
                  <div>
                    <h3 className="text-lg lg:text-[19px] font-bold mb-2 drop-shadow-md tracking-wide">{t("express_page.route4_title")}</h3>
                    <p className="text-[12px] font-bold opacity-95 mb-1 drop-shadow-sm">{t("express_page.route4_us")}</p>
                    <p className="text-[12px] font-bold opacity-95 mb-1 drop-shadow-sm">{t("express_page.route4_uk")}</p>
                    <p className="text-[12px] font-bold opacity-95 drop-shadow-sm">{t("express_page.route4_de")}</p>
                  </div>
                  <div className="absolute bottom-1 right-2 text-[70px] lg:text-[85px] leading-none font-black italic opacity-95 drop-shadow-2xl tracking-tighter mix-blend-overlay select-none">04</div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Awesome Slidekick Carousel (Cleaned of faulty texts and AI images) */}
      <section className="py-16 bg-muted/30">
        <ScrollReveal direction="up">
          <div className="max-w-6xl mx-auto px-8">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 2500,
                  stopOnInteraction: false,
                  stopOnMouseEnter: true,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {galleryImages.map((src, index) => (
                  <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <div className="rounded-2xl overflow-hidden aspect-[16/10] border-4 border-white shadow-xl group relative bg-white flex items-center justify-center">
                        <img
                          src={src}
                          alt={`Gallery slide ${index}`}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-navy/20 group-hover:bg-transparent transition-colors duration-300"></div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 w-12 h-12 bg-white text-navy hover:bg-navy hover:text-white border-2 transition-all shadow-md" />
              <CarouselNext className="hidden md:flex -right-12 w-12 h-12 bg-white text-navy hover:bg-navy hover:text-white border-2 transition-all shadow-md" />
            </Carousel>
          </div>
        </ScrollReveal>
      </section>

      {/* EVRI, USPS LOGO STRIP (From Bottom of Screenshot 3) */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal delay={200} direction="up">
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-80 mix-blend-multiply">
              <img loading="lazy" src="https://w.ladicdn.com/s500x500/67e69e24e8a7ba001127c80a/2-20250817133921-avbgq.png" alt="EVRi" className="h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              <img loading="lazy" src="https://w.ladicdn.com/s550x550/67e69e24e8a7ba001127c80a/1-20250817133921-ocutm.png" alt="USPS" className="h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              <img loading="lazy" src="https://w.ladicdn.com/s500x500/67e69e24e8a7ba001127c80a/3-20250817133921-gvcob.png" alt="YunExpress" className="h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 10. FAQ SECTION */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4 tracking-tight">{t("express_page.faq_title")}</h2>
              <p className="text-muted-foreground">{t("express_page.faq_eyebrow")}</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100} direction="up">
            <div className="glass-card bg-white/50 border border-border/50 rounded-2xl p-6 md:p-10">
              <FAQAccordion items={faqItems} />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <ContactSection />

    </div>
  );
};

export default THGExpressPage;
