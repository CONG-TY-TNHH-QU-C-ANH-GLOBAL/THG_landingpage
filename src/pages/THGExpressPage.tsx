import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import ImageMarquee from "@/components/ImageMarquee";
import FAQAccordion from "@/components/FAQAccordion";
import { useI18n } from "@/lib/i18n";
import { Truck, ArrowRight, Plane, Ship, Shield, Clock, Search, MapPin, Globe, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/* ─── Data ─── */
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

const warehousePhotos = [
  { src: "https://w.ladicdn.com/s1500x1100/67e69e24e8a7ba001127c80a/kho-my-10-1-20250729095528-mkcfd.jpg", alt: "THG US Warehouse" },
  { src: "https://w.ladicdn.com/s1500x1100/67e69e24e8a7ba001127c80a/kho-my-14-1-20250729095528-dcsxm.jpg", alt: "THG Packing Station" },
  { src: "https://w.ladicdn.com/s1500x1100/67e69e24e8a7ba001127c80a/img_9988-20250801074609-jjvij.jpg", alt: "THG Logistics" },
  { src: "https://w.ladicdn.com/s1500x1100/67e69e24e8a7ba001127c80a/kho-my-11-1-20250729095528-nzruq.jpg", alt: "THG Sorting Area" },
];

/* ─── Animated counter ─── */
const useCounter = (end: number, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.unobserve(el);
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * end));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);
  return { count, ref };
};

const StatCounter = ({ value, suffix, label }: { value: number; suffix: string; label: string }) => {
  const { count, ref } = useCounter(value);
  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl sm:text-5xl font-bold text-gradient-gold tabular-nums">
        {count}<span className="text-2xl sm:text-3xl">{suffix}</span>
      </p>
      <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/40 mt-2 font-medium">{label}</p>
    </div>
  );
};

/* ─── Page ─── */
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

      {/* ══════════════════════════════════════════════════════════
          MEGA HERO — Immersive multi-panel: text + images + video
          ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(36_30%_96%)] via-[hsl(36_25%_93%)] to-[hsl(36_20%_90%)]">
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

        {/* ── Panel 1: Title + Image Bento ── */}
        <div className="container mx-auto px-4 relative z-10 pt-32 pb-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left — Text */}
            <div>
              <ScrollReveal direction="scale">
                <div className="inline-flex items-center gap-2.5 glass-card glow-pulse rounded-full px-5 py-2.5 mb-8 bg-[hsl(var(--gold))]/10 border-[hsl(var(--gold))]/25">
                  <Sparkles className="w-4 h-4 text-[hsl(var(--gold))]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[hsl(var(--gold))]">THG Express</span>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.5rem] font-bold tracking-tight text-navy leading-[1.08] mb-6">
                  {t("express_page.hero_title1")}
                  <br />
                  <span className="text-gradient-gold">{t("express_page.hero_title_highlight")}</span>
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed mb-8 font-light">
                  {t("express_page.hero_subtitle")}
                </p>
              </ScrollReveal>

              {/* Feature checklist */}
              <ScrollReveal delay={300}>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-10 max-w-md">
                  {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5 group">
                      <CheckCircle2 className="w-4 h-4 text-[hsl(var(--gold))] flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-sm text-foreground/60 group-hover:text-foreground/90 transition-colors">{t(f.titleKey)}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              {/* Tracking Widget */}
              <ScrollReveal delay={400} direction="left">
                <div className="max-w-md glass-card rounded-2xl p-5 bg-white/70 border-[hsl(var(--gold))]/15 shadow-[0_24px_48px_rgba(0,0,0,0.08)]">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[hsl(var(--gold))] mb-3 flex items-center gap-2">
                    <Search className="w-3.5 h-3.5" />
                    {t("express_page.track_title")}
                  </h3>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value)}
                      placeholder={t("express_page.track_placeholder")}
                      className="flex-1 px-4 py-3 rounded-xl bg-background/80 border border-border text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gold))]/30 focus:border-[hsl(var(--gold))]/40 transition-all backdrop-blur-sm"
                      onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                    />
                    <Button
                      onClick={handleTrack}
                      className="bg-[hsl(var(--gold))] hover:bg-[hsl(var(--gold-dark))] text-white rounded-xl px-6 font-semibold shadow-[0_8px_24px_hsl(36_45%_42%/0.4)] hover:shadow-[0_12px_32px_hsl(36_45%_42%/0.6)] transition-all duration-500"
                    >
                      {t("express_page.track_btn")}
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right — Image Bento Grid */}
            <ScrollReveal delay={200} direction="right">
              <div className="grid grid-cols-12 grid-rows-2 gap-3 max-w-lg mx-auto lg:mx-0 h-[400px]">
                {/* Large main image */}
                <div className="col-span-7 row-span-2 rounded-2xl overflow-hidden border border-border/40 shadow-[var(--shadow-3d)] hover:shadow-[var(--shadow-3d-hover)] transition-all duration-700 hover:-translate-y-1 group">
                  <img
                    src={warehousePhotos[0].src}
                    alt={warehousePhotos[0].alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="eager"
                  />
                </div>
                {/* Top-right */}
                <div className="col-span-5 rounded-2xl overflow-hidden border border-border/40 shadow-[var(--shadow-3d)] hover:shadow-[var(--shadow-3d-hover)] transition-all duration-700 hover:-translate-y-1 group">
                  <img
                    src={warehousePhotos[1].src}
                    alt={warehousePhotos[1].alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="eager"
                  />
                </div>
                {/* Bottom-right */}
                <div className="col-span-5 rounded-2xl overflow-hidden border border-border/40 shadow-[var(--shadow-3d)] hover:shadow-[var(--shadow-3d-hover)] transition-all duration-700 hover:-translate-y-1 group relative">
                  <img
                    src={warehousePhotos[2].src}
                    alt={warehousePhotos[2].alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="eager"
                  />
                  {/* Overlay badge */}
                  <div className="absolute bottom-3 left-3 right-3 glass-card rounded-lg px-3 py-2 bg-white/80 backdrop-blur-md border-border/30">
                    <p className="text-[10px] font-bold text-navy uppercase tracking-wider text-center">4 Kho tại Mỹ</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* ── Panel 2: Animated Stats ── */}
        <div className="container mx-auto px-4 relative z-10 py-10">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[hsl(var(--gold))]/20 to-transparent mb-10" />
          <ScrollReveal delay={100}>
            <div className="flex flex-wrap justify-center gap-12 sm:gap-20">
              <StatCounter value={5} suffix=" days" label="Air Express" />
              <StatCounter value={20} suffix="+" label="Shipping routes" />
              <StatCounter value={99} suffix="%" label="On-time delivery" />
              <StatCounter value={4} suffix="" label="US Warehouses" />
            </div>
          </ScrollReveal>
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[hsl(var(--gold))]/20 to-transparent mt-10" />
        </div>

        {/* ── Panel 3: Video Shorts ── */}
        <div className="container mx-auto px-4 relative z-10 py-10">
          <ScrollReveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[hsl(var(--gold))]/60 text-center mb-8">Behind the scenes</p>
          </ScrollReveal>
          <div className="flex justify-center gap-4 md:gap-6 flex-wrap">
            {[
              { id: "n5t6sHIKv4A", title: "THG Warehouse Ops" },
              { id: "ZgoqBsujyC0", title: "THG Shipping Facility" },
              { id: "KDq7-tEikgg", title: "Scale of THG Express" },
            ].map((vid, i) => (
              <ScrollReveal key={vid.id} delay={i * 150} direction={i === 0 ? "left" : i === 2 ? "right" : "up"}>
                <div className={`w-[200px] md:w-[240px] rounded-2xl overflow-hidden tilt-card border border-border/40 shadow-[var(--shadow-3d)] ${i === 1 ? "hidden sm:block" : ""} ${i === 2 ? "hidden lg:block" : ""}`}>
                  <YouTubeEmbed videoId={vid.id} title={vid.title} aspectRatio="315/560" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* ── Panel 4: Main Showcase Video ── */}
        <div className="container mx-auto px-4 relative z-10 pb-24 pt-12">
          <ScrollReveal direction="scale">
            <div className="max-w-4xl mx-auto relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-[hsl(var(--gold))]/12 to-transparent rounded-[2rem] blur-xl" />
              <div className="relative rounded-3xl overflow-hidden shadow-[var(--shadow-3d-hover)] border border-border/40">
                <YouTubeEmbed videoId="AaZJmRFfiqM" title="Quy trình vận hành kho bãi THG" autoplay muted loop controls={false} />
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom gradient fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-card to-transparent" />
      </section>

      {/* ════════════════════ FEATURES ════════════════════ */}
      <section className="py-28 bg-card relative overflow-hidden">
        <div className="section-divider absolute top-0 left-0 right-0" />
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-secondary/50 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-60 h-60 rounded-full bg-[hsl(var(--gold))]/5 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-20">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">{t("express_page.features_eyebrow")}</p>
              <h2 className="text-4xl md:text-5xl font-bold text-navy tracking-tight">{t("express_page.features_title")}</h2>
              <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-6" />
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <ScrollReveal key={i} delay={i * 120} direction={i % 2 === 0 ? "rotate3d" : "up"}>
                <div className="group tilt-card glass-card rounded-2xl p-8 text-center h-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-5 group-hover:shadow-[var(--shadow-glow)] transition-all duration-500 group-hover:scale-110">
                      <f.icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-sm font-bold text-navy mb-3 uppercase tracking-wider">{t(f.titleKey)}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{t(f.descKey)}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ PROCESS — Timeline ════════════════════ */}
      <section className="py-28 bg-background relative overflow-hidden">
        <div className="section-divider absolute top-0 left-0 right-0" />
        <div className="absolute top-1/2 left-0 right-0 h-[1px] hidden lg:block bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2" />
        <div className="absolute -bottom-32 right-0 w-72 h-72 rounded-full bg-[hsl(var(--gold))]/5 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-20">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">{t("express_page.process_eyebrow")}</p>
              <h2 className="text-4xl md:text-5xl font-bold text-navy tracking-tight">{t("express_page.process_title")}</h2>
              <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-6" />
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {processSteps.map((s, i) => (
              <ScrollReveal key={s.num} delay={i * 150} direction={i % 2 === 0 ? "left" : "right"}>
                <div className="group glass-card rounded-2xl p-7 hover-lift h-full relative overflow-hidden">
                  <span className="absolute -top-2 -right-1 text-6xl font-black text-accent/[0.06] select-none leading-none">{s.num}</span>
                  <div className="absolute -top-3 -right-2 w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center glow-pulse">
                    <span className="text-xs font-bold text-accent">{s.num}</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5 group-hover:shadow-[var(--shadow-glow)] transition-all duration-500 group-hover:scale-110">
                    <s.icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-base font-bold text-navy mb-2 tracking-tight pr-8">{t(s.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(s.descKey)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ SHIPPING ROUTES ════════════════════ */}
      <section className="py-28 bg-gradient-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(var(--gold-light))]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(var(--gold-light))]/20 to-transparent" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, hsl(40 35% 70%) 1px, transparent 0)`, backgroundSize: "40px 40px" }} />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-[hsl(var(--gold))]/5 rounded-full blur-[100px]" />

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-20">
              <p className="text-sm font-semibold text-[hsl(var(--gold-light))] uppercase tracking-[0.2em] mb-4">{t("express_page.routes_eyebrow")}</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{t("express_page.lines_title")}</h2>
              <p className="text-white/35 mt-4 max-w-2xl mx-auto font-light">{t("express_page.lines_desc")}</p>
              <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[hsl(var(--gold-light))]/30 to-transparent mx-auto mt-6" />
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {shippingLines.map((l, i) => (
              <ScrollReveal key={l.num} delay={i * 120} direction={i % 2 === 0 ? "left" : "right"}>
                <Link
                  to={l.link}
                  className={`group flex items-center gap-5 p-6 rounded-2xl border backdrop-blur-md transition-all duration-500 hover:-translate-y-2 ${l.special
                      ? "border-pink-500/25 bg-pink-500/[0.04] hover:border-pink-400/50 hover:bg-pink-500/[0.08] hover:shadow-[0_20px_50px_rgba(236,72,153,0.15)]"
                      : "border-white/8 bg-white/[0.02] hover:border-[hsl(var(--gold-light))]/25 hover:bg-white/[0.05] hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                    }`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0 transition-all duration-500 group-hover:scale-110 ${l.special ? "bg-pink-500/10 border border-pink-500/20 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]" : "bg-white/5 border border-white/10 group-hover:shadow-[var(--shadow-glow)]"
                    }`}>
                    {l.flags.split(" → ")[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-lg font-bold mb-1 ${l.special ? "text-pink-400" : "text-white"}`}>{t(l.routeKey)}</h4>
                    <p className="text-sm text-white/35">{t(l.typesKey)}</p>
                  </div>
                  <ArrowRight className={`w-5 h-5 transition-all duration-300 group-hover:translate-x-1.5 ${l.special ? "text-pink-400/50 group-hover:text-pink-400" : "text-white/15 group-hover:text-[hsl(var(--gold-light))]"}`} />
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ IMAGE MARQUEE ════════════════════ */}
      <section className="py-14 bg-background relative overflow-hidden">
        <div className="section-divider absolute top-0 left-0 right-0" />
        <ScrollReveal>
          <div className="container mx-auto px-4 text-center mb-8">
            <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em]">{t("express_page.marquee_label")}</p>
          </div>
        </ScrollReveal>
        <ImageMarquee images={sliderImages} speed={40} height="200px" />
      </section>

      {/* ════════════════════ FAQ ════════════════════ */}
      <section className="py-28 bg-card relative overflow-hidden">
        <div className="section-divider absolute top-0 left-0 right-0" />
        <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-secondary/40 blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">{t("express_page.faq_eyebrow")}</p>
              <h2 className="text-4xl md:text-5xl font-bold text-navy tracking-tight">{t("express_page.faq_title")}</h2>
              <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-6" />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="max-w-3xl mx-auto">
              <FAQAccordion items={faqItems} />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════ CTA ════════════════════ */}
      <section className="relative py-32 bg-gradient-dark overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(var(--gold-light))]/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[hsl(var(--gold))]/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, hsl(40 35% 70%) 1px, transparent 0)`, backgroundSize: "32px 32px" }} />
        <div className="absolute top-16 right-[15%] w-2 h-2 bg-[hsl(var(--gold-light))]/20 rounded-full animate-pulse" />
        <div className="absolute bottom-20 left-[18%] w-3 h-3 bg-[hsl(var(--gold-light))]/10 rounded-full animate-pulse" style={{ animationDelay: "0.7s" }} />

        <div className="container mx-auto px-4 text-center relative z-10">
          <ScrollReveal direction="scale">
            <div className="inline-flex items-center gap-2 glow-pulse mb-8">
              <Sparkles className="w-7 h-7 text-[hsl(var(--gold-light))]" />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">{t("express_page.cta_title")}</h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-white/35 mb-12 max-w-lg mx-auto font-light leading-relaxed text-lg">{t("express_page.cta_desc")}</p>
          </ScrollReveal>
          <ScrollReveal delay={300} direction="up">
            <Button className="bg-[hsl(var(--gold))] hover:bg-[hsl(var(--gold-dark))] text-white rounded-full px-14 py-7 text-base gap-3 shadow-[0_12px_40px_hsl(36_45%_42%/0.4)] hover:shadow-[0_20px_60px_hsl(36_45%_42%/0.6)] transition-all duration-500 font-semibold tracking-wide hover:scale-105">
              {t("nav.consult")} <ArrowRight className="w-5 h-5" />
            </Button>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default THGExpressPage;
