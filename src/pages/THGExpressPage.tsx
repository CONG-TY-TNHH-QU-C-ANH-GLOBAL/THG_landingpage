import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import ImageMarquee from "@/components/ImageMarquee";
import FAQAccordion from "@/components/FAQAccordion";
import { useI18n } from "@/lib/i18n";
import { Truck, ArrowRight, Plane, Ship, Shield, Clock, Search, MapPin, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";

const features = [
  { icon: Plane, titleKey: "express_page.feat1_title", descKey: "express_page.feat1_desc" },
  { icon: Shield, titleKey: "express_page.feat2_title", descKey: "express_page.feat2_desc" },
  { icon: Clock, titleKey: "express_page.feat3_title", descKey: "express_page.feat3_desc" },
  { icon: Ship, titleKey: "express_page.feat4_title", descKey: "express_page.feat4_desc" },
];

const shippingLines = [
  { num: "01", routeKey: "express_page.route1", typesKey: "express_page.route1_types", flags: "🇻🇳 → 🇺🇸", link: "/bang-gia-quoc-te?from=vn&to=US" },
  { num: "02", routeKey: "express_page.route2", typesKey: "express_page.route2_types", flags: "🇨🇳 → 🇺🇸", link: "/bang-gia-quoc-te?from=cn&to=US" },
  { num: "03", routeKey: "express_page.route3", typesKey: "express_page.route3_types", flags: "🌏 → 🌎", link: "/bang-gia-quoc-te" },
  { num: "04", routeKey: "express_page.route4", typesKey: "express_page.route4_types", flags: "🎵 → 🛍️", link: "/bang-gia-quoc-te?from=cn&to=US&goods=tiktok", special: true },
];

const processSteps = [
  { num: "01", titleKey: "express_page.step1_title", descKey: "express_page.step1_desc", icon: Globe },
  { num: "02", titleKey: "express_page.step2_title", descKey: "express_page.step2_desc", icon: Truck },
  { num: "03", titleKey: "express_page.step3_title", descKey: "express_page.step3_desc", icon: Plane },
  { num: "04", titleKey: "express_page.step4_title", descKey: "express_page.step4_desc", icon: MapPin },
];

const sliderImages = [
  "https://w.ladicdn.com/s1500x1100/67e69e24e8a7ba001127c80a/kho-my-10-1-20250729095528-mkcfd.jpg",
  "https://w.ladicdn.com/s1500x1100/67e69e24e8a7ba001127c80a/kho-my-11-1-20250729095528-nzruq.jpg",
  "https://w.ladicdn.com/s1500x1100/67e69e24e8a7ba001127c80a/kho-my-14-1-20250729095528-dcsxm.jpg",
  "https://w.ladicdn.com/s1500x1100/67e69e24e8a7ba001127c80a/1-20250724024641-4oczs.png",
  "https://w.ladicdn.com/s1500x1100/67e69e24e8a7ba001127c80a/kho-my-13-20250724024632-bt6u-.jpg",
  "https://w.ladicdn.com/s1500x1100/67e69e24e8a7ba001127c80a/img_9873-20250801074610-q-tfu.jpg",
  "https://w.ladicdn.com/s1500x1100/67e69e24e8a7ba001127c80a/img_9988-20250801074609-jjvij.jpg",
  "https://w.ladicdn.com/s1500x1100/67e69e24e8a7ba001127c80a/retouch_2025072518361201-20250801074608-tsi9a.jpg",
  "https://w.ladicdn.com/s1500x1100/67e69e24e8a7ba001127c80a/img_7181-20250801190217-bvrod.jpg",
];

const THGExpressPage = () => {
  const { t } = useI18n();
  const [trackingCode, setTrackingCode] = useState("");

  const handleTrack = () => {
    if (trackingCode.trim()) {
      window.open(`https://t.17track.net/en#nums=${trackingCode}`, "_blank");
    }
  };

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
    { question: t("express_page.faq11_q"), answer: t("express_page.faq11_a") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ═══ HERO — Cinematic Full-bleed ═══ */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://w.ladicdn.com/s1440x957/67e69e24e8a7ba001127c80a/x1ws5joh20250728082550.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--navy))]/80 via-[hsl(var(--navy))]/60 to-[hsl(var(--navy))]/90" />
        
        {/* Decorative gold line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[hsl(var(--gold-light))] to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10 py-32">
          <div className="max-w-3xl">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2.5 bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold-light))]/30 backdrop-blur-md rounded-full px-5 py-2 mb-8">
                <Sparkles className="w-4 h-4 text-[hsl(var(--gold-light))]" />
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[hsl(var(--gold-light))]">THG Express</span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
                {t("express_page.hero_title1")}
                <br />
                <span className="text-gradient-gold">{t("express_page.hero_title_highlight")}</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <p className="text-lg sm:text-xl text-white/60 max-w-xl leading-relaxed mb-10 font-light">
                {t("express_page.hero_subtitle")}
              </p>
            </ScrollReveal>

            {/* Tracking Widget — Luxury glassmorphism */}
            <ScrollReveal delay={300}>
              <div className="max-w-lg bg-white/[0.06] backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-[0_24px_48px_rgba(0,0,0,0.3)]">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--gold-light))] mb-4 flex items-center gap-2">
                  <Search className="w-3.5 h-3.5" />
                  {t("express_page.track_title")}
                </h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    placeholder={t("express_page.track_placeholder")}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gold))]/40 focus:border-[hsl(var(--gold-light))]/50 transition-all"
                    onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                  />
                  <Button 
                    onClick={handleTrack} 
                    className="bg-[hsl(var(--gold))] hover:bg-[hsl(var(--gold-dark))] text-white rounded-xl px-6 font-semibold shadow-[0_8px_24px_hsl(36_45%_42%/0.3)] transition-all hover:shadow-[0_12px_32px_hsl(36_45%_42%/0.5)]"
                  >
                    {t("express_page.track_btn")}
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Stats strip */}
          <ScrollReveal delay={400}>
            <div className="mt-16 flex flex-wrap gap-8 sm:gap-16">
              {[
                { value: "3-5", label: "Days Air" },
                { value: "20+", label: "Routes" },
                { value: "99%", label: "On-time" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-gradient-gold">{stat.value}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ Video Shorts — Floating cards ═══ */}
      <section className="py-16 bg-background relative">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[hsl(var(--navy))] to-transparent" />
        <div className="container mx-auto px-4 relative z-10 -mt-20">
          <div className="flex justify-center gap-5 md:gap-8 flex-wrap">
            {[
              { id: "n5t6sHIKv4A", title: "THG Warehouse Ops" },
              { id: "ZgoqBsujyC0", title: "THG Shipping Facility" },
              { id: "KDq7-tEikgg", title: "Scale of THG Express" },
            ].map((vid, i) => (
              <ScrollReveal key={vid.id} delay={i * 120}>
                <div className={`w-[240px] md:w-[260px] rounded-2xl overflow-hidden border border-border/50 shadow-[var(--shadow-3d)] hover:shadow-[var(--shadow-3d-hover)] transition-all duration-500 hover:-translate-y-3 ${i === 1 ? "hidden sm:block" : ""} ${i === 2 ? "hidden lg:block" : ""}`}>
                  <YouTubeEmbed videoId={vid.id} title={vid.title} aspectRatio="315/560" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Features — Bento grid ═══ */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-20">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4">{t("express_page.features_eyebrow")}</span>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">{t("express_page.features_title")}</h2>
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-6" />
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="group tilt-card rounded-2xl p-8 bg-card border border-border/50 text-center h-full relative overflow-hidden">
                  {/* Subtle glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-5 group-hover:shadow-[var(--shadow-glow)] transition-shadow duration-500">
                      <f.icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">{t(f.titleKey)}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{t(f.descKey)}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Main Video ═══ */}
      <section className="py-20 bg-card border-y border-border/30">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              <div className="rounded-3xl overflow-hidden shadow-[var(--shadow-3d)] border border-border/30">
                <YouTubeEmbed
                  videoId="AaZJmRFfiqM"
                  title="Quy trình vận hành kho bãi THG"
                  autoplay
                  muted
                  loop
                  controls={false}
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ Process — Timeline style ═══ */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-20">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4">{t("express_page.process_eyebrow")}</span>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">{t("express_page.process_title")}</h2>
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-6" />
            </div>
          </ScrollReveal>

          <div className="max-w-5xl mx-auto relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2" />
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((s, i) => (
                <ScrollReveal key={s.num} delay={i * 150}>
                  <div className="group relative bg-card rounded-2xl p-7 border border-border/50 hover-lift h-full">
                    {/* Step number — gold accent */}
                    <div className="absolute -top-3 -right-2 w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-accent">{s.num}</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5 group-hover:shadow-[var(--shadow-glow)] transition-shadow duration-500">
                      <s.icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-2 tracking-tight">{t(s.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(s.descKey)}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Shipping Routes — Premium cards ═══ */}
      <section className="py-28 bg-gradient-dark relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(var(--gold-light))]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(var(--gold-light))]/20 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-20">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-[hsl(var(--gold-light))] mb-4">{t("express_page.routes_eyebrow")}</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">{t("express_page.lines_title")}</h2>
              <p className="text-white/40 mt-4 max-w-2xl mx-auto font-light">{t("express_page.lines_desc")}</p>
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[hsl(var(--gold-light))]/40 to-transparent mx-auto mt-6" />
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {shippingLines.map((l, i) => (
              <ScrollReveal key={l.num} delay={i * 100}>
                <Link
                  to={l.link}
                  className={`group flex items-center gap-5 p-6 rounded-2xl border backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 ${
                    l.special
                      ? "border-pink-500/30 bg-pink-500/5 hover:border-pink-400/60 hover:bg-pink-500/10 hover:shadow-[0_20px_40px_rgba(236,72,153,0.15)]"
                      : "border-white/10 bg-white/[0.03] hover:border-[hsl(var(--gold-light))]/30 hover:bg-white/[0.06] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                  }`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0 ${
                    l.special ? "bg-pink-500/15 border border-pink-500/20" : "bg-white/5 border border-white/10"
                  }`}>
                    {l.flags.split(" → ")[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-lg font-bold mb-1 ${l.special ? "text-pink-400" : "text-white"}`}>
                      {t(l.routeKey)}
                    </h4>
                    <p className="text-sm text-white/40">{t(l.typesKey)}</p>
                  </div>
                  <ArrowRight className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${
                    l.special ? "text-pink-400/60" : "text-white/20"
                  }`} />
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Image Marquee ═══ */}
      <section className="py-12 bg-background border-b border-border/30">
        <ScrollReveal>
          <div className="container mx-auto px-4 text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent">{t("express_page.marquee_label")}</span>
          </div>
        </ScrollReveal>
        <ImageMarquee images={sliderImages} speed={40} height="200px" />
      </section>

      {/* ═══ FAQ — Clean minimal ═══ */}
      <section className="py-28 bg-card">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4">{t("express_page.faq_eyebrow")}</span>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">{t("express_page.faq_title")}</h2>
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-6" />
            </div>
          </ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <FAQAccordion items={faqItems} />
          </div>
        </div>
      </section>

      {/* ═══ CTA — Grand finale ═══ */}
      <section className="relative py-28 bg-gradient-dark overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(var(--gold-light))]/20 to-transparent" />
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[hsl(var(--gold))]/5 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <ScrollReveal>
            <Sparkles className="w-8 h-8 text-[hsl(var(--gold-light))] mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">{t("express_page.cta_title")}</h2>
            <p className="text-white/40 mb-10 max-w-lg mx-auto font-light leading-relaxed">{t("express_page.cta_desc")}</p>
            <Button className="bg-[hsl(var(--gold))] hover:bg-[hsl(var(--gold-dark))] text-white rounded-full px-12 py-7 text-base gap-2.5 shadow-[0_12px_32px_hsl(36_45%_42%/0.4)] hover:shadow-[0_16px_48px_hsl(36_45%_42%/0.6)] transition-all duration-500 font-semibold tracking-wide">
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
