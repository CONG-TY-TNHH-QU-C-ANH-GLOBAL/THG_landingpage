import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";
import { ArrowRight, ChevronDown, ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import imgLanHuong from "@/assets/Ms Lan Huong.jpg";
import imgMinhKhoa from "@/assets/Mr Minh Khoa.jpg";
import imgThuyPhuong from "@/assets/Ms. Thuy Phuong.jpg";
import imgQuangTri from "@/assets/Mr. Quang Tri.jpg";
import imgBaoNgoc from "@/assets/Ms.Bao Ngoc.jpg";

/* ───────────────────── DATA ───────────────────── */
const stats = [
  { val: "500+", labelKey: "op.stat1" },
  { val: "98%", labelKey: "op.stat2" },
  { val: "$0", labelKey: "op.stat3" },
  { val: "5★", labelKey: "op.stat4" },
  { val: "3", labelKey: "op.stat5" },
];

const painPoints = [
  { emoji: "🔍", titleKey: "op.pain1_t", descKey: "op.pain1_d" },
  { emoji: "🈷️", titleKey: "op.pain2_t", descKey: "op.pain2_d" },
  { emoji: "⚠️", titleKey: "op.pain3_t", descKey: "op.pain3_d" },
  { emoji: "💸", titleKey: "op.pain4_t", descKey: "op.pain4_d" },
  { emoji: "🔄", titleKey: "op.pain5_t", descKey: "op.pain5_d" },
  { emoji: "🕰️", titleKey: "op.pain6_t", descKey: "op.pain6_d" },
];

const processSteps = [
  { num: 1, emoji: "🔗", titleKey: "op.step1_t", descKey: "op.step1_d" },
  { num: 2, emoji: "💬", titleKey: "op.step2_t", descKey: "op.step2_d" },
  { num: 3, emoji: "🛒", titleKey: "op.step3_t", descKey: "op.step3_d" },
  { num: 4, emoji: "📹", titleKey: "op.step4_t", descKey: "op.step4_d" },
  { num: 5, emoji: "🏠", titleKey: "op.step5_t", descKey: "op.step5_d" },
];

const solutions = [
  { icon: "🛡️", tagKey: "op.sol1_tag", titleKey: "op.sol1_t", descKey: "op.sol1_d" },
  { icon: "🇨🇳", tagKey: "op.sol2_tag", titleKey: "op.sol2_t", descKey: "op.sol2_d" },
  { icon: "📹", tagKey: "op.sol3_tag", titleKey: "op.sol3_t", descKey: "op.sol3_d" },
  { icon: "↩️", tagKey: "op.sol4_tag", titleKey: "op.sol4_t", descKey: "op.sol4_d" },
  { icon: "✈️", tagKey: "op.sol5_tag", titleKey: "op.sol5_t", descKey: "op.sol5_d" },
  { icon: "📡", tagKey: "op.sol6_tag", titleKey: "op.sol6_t", descKey: "op.sol6_d" },
];

const shippingLanes = [
  { emoji: "✈️", color: "primary", tagKey: "op.ship1_tag", timeKey: "op.ship1_time", titleKey: "op.ship1_t", features: ["op.ship1_f1", "op.ship1_f2", "op.ship1_f3", "op.ship1_f4", "op.ship1_f5"], noteKey: "op.ship1_note" },
  { emoji: "🚀", color: "gold", tagKey: "op.ship2_tag", timeKey: "op.ship2_time", titleKey: "op.ship2_t", features: ["op.ship2_f1", "op.ship2_f2", "op.ship2_f3", "op.ship2_f4", "op.ship2_f5"], noteKey: "op.ship2_note" },
  { emoji: "🚢", color: "navy", tagKey: "op.ship3_tag", timeKey: "op.ship3_time", titleKey: "op.ship3_t", features: ["op.ship3_f1", "op.ship3_f2", "op.ship3_f3", "op.ship3_f4", "op.ship3_f5"], noteKey: "op.ship3_note" },
];

const epacketRows = [
  { wt: "0.1 kg", price: "$6.84", perKg: "$68.4/kg" },
  { wt: "0.2 kg", price: "$9.00", perKg: "$45.0/kg" },
  { wt: "0.3 kg", price: "$11.07", perKg: "$36.9/kg" },
  { wt: "0.4 kg", price: "$13.50", perKg: "$33.8/kg" },
  { wt: "0.5 kg", price: "$15.89", perKg: "$31.8/kg" },
  { wt: "0.6 kg", price: "$18.36", perKg: "$30.6/kg" },
  { wt: "0.7 kg", price: "$20.71", perKg: "$29.6/kg" },
  { wt: "0.8 kg", price: "$23.99", perKg: "$30.0/kg" },
  { wt: "0.9 kg", price: "$27.28", perKg: "$30.3/kg" },
  { wt: "1.0 kg", price: "$28.82", perKg: "$28.8/kg", gold: true },
  { wt: "1.5 kg", price: "$45.44", perKg: "$30.3/kg", gold: true },
  { wt: "2.0 kg", price: "$46.36", perKg: "$23.2/kg", gold: true },
  { wt: "3.0 kg", price: "$60.80", perKg: "$20.3/kg", gold: true },
  { wt: "5.0 kg", price: "$82.01", perKg: "$16.4/kg", gold: true },
  { wt: "10.0 kg", price: "$149.00", perKg: "$14.9/kg", gold: true },
  { wt: "15.0 kg", price: "$215.36", perKg: "$14.4/kg", gold: true },
  { wt: "20.0 kg", price: "$281.71", perKg: "$14.1/kg", gold: true },
];

const bulkRows = [
  { zone: "Zone 1 🗺️", zipKey: "op.bulk_z1", p12: "$11.79", p21: "$11.25", p71: "$10.54", p100: "$10.18" },
  { zone: "Zone 2 🗺️", zipKey: "op.bulk_z2", p12: "$11.96", p21: "$11.43", p71: "$10.71", p100: "$10.36" },
  { zone: "Zone 3 🗺️", zipKey: "op.bulk_z3", p12: "$12.14", p21: "$11.61", p71: "$10.89", p100: "$10.54" },
];

const policies = [
  { icon: "💰", tagKey: "op.pol1_tag", titleKey: "op.pol1_t", items: ["op.pol1_i1", "op.pol1_i2", "op.pol1_i3", "op.pol1_i4"] },
  { icon: "🚫", tagKey: "op.pol2_tag", titleKey: "op.pol2_t", items: ["op.pol2_i1", "op.pol2_i2", "op.pol2_i3", "op.pol2_i4", "op.pol2_i5", "op.pol2_i6"] },
  { icon: "📋", tagKey: "op.pol3_tag", titleKey: "op.pol3_t", items: ["op.pol3_i1", "op.pol3_i2", "op.pol3_i3", "op.pol3_i4", "op.pol3_i5"] },
  { icon: "📣", tagKey: "op.pol4_tag", titleKey: "op.pol4_t", items: ["op.pol4_i1", "op.pol4_i2", "op.pol4_i3", "op.pol4_i4"] },
];

const faqItems = [
  { icon: "🛒", qKey: "op.faq1_q", aKey: "op.faq1_a" },
  { icon: "⏱️", qKey: "op.faq2_q", aKey: "op.faq2_a" },
  { icon: "💳", qKey: "op.faq3_q", aKey: "op.faq3_a" },
  { icon: "📦", qKey: "op.faq4_q", aKey: "op.faq4_a" },
  { icon: "🛃", qKey: "op.faq5_q", aKey: "op.faq5_a" },
  { icon: "🏷️", qKey: "op.faq6_q", aKey: "op.faq6_a" },
  { icon: "📍", qKey: "op.faq7_q", aKey: "op.faq7_a" },
];

const testimonials = [
  { nameKey: "Ms. Lan Huong", locKey: "📍 California, USA", tagKey: "op.testi1_tag", textKey: "op.testi1_text", avatar: imgLanHuong },
  { nameKey: "Mr. Minh Khoa", locKey: "📍 Texas, USA", tagKey: "op.testi2_tag", textKey: "op.testi2_text", avatar: imgMinhKhoa },
  { nameKey: "Ms. Thuy Phuong", locKey: "📍 Virginia, USA", tagKey: "op.testi3_tag", textKey: "op.testi3_text", avatar: imgThuyPhuong },
  { nameKey: "Mr. Quang Tri", locKey: "📍 New York, USA", tagKey: "op.testi4_tag", textKey: "op.testi4_text", avatar: imgQuangTri },
  { nameKey: "Ms. Bao Ngoc", locKey: "📍 Georgia, USA", tagKey: "op.testi5_tag", textKey: "op.testi5_text", avatar: imgBaoNgoc },
];

const videos = [
  { id: "KPhQYnkYA68", capKey: "op.vid1_cap" },
  { id: "ZgoqBsujyC0", capKey: "op.vid2_cap" },
  { id: "ZgoqBsujyC0", capKey: "op.vid3_cap" },
];

/* ───────────────────── COMPONENT ───────────────────── */
const THGOrderPage = () => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<"ep" | "bulk">("ep");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [playingVideo, setPlayingVideo] = useState<Record<number, boolean>>({});

  const toggleFaq = useCallback((i: number) => setOpenFaq(prev => prev === i ? null : i), []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(36_30%_96%)] via-[hsl(36_25%_93%)] to-[hsl(36_20%_90%)] pt-32 pb-24">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, hsl(36 45% 65%) 1px, transparent 0)`, backgroundSize: "32px 32px" }} />
        <div className="absolute inset-0 shimmer-effect opacity-10 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent opacity-40" />
        <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-[hsl(var(--gold))]/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] left-0 w-[400px] h-[400px] bg-[hsl(var(--gold))]/5 rounded-full blur-[120px]" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <ScrollReveal direction="scale">
            <div className="inline-flex items-center gap-3 rounded-full px-5 py-2 text-sm border border-[hsl(var(--gold))]/25 mb-8 bg-[hsl(var(--gold))]/10 shadow-[0_4px_12px_rgba(216,180,111,0.15)] glow-pulse">
              <span className="font-medium text-navy">{t("order_page.badge_taobao")}</span>
              <span className="text-[hsl(var(--gold))]/50">|</span>
              <span className="font-medium text-navy">{t("order_page.badge_direct")}</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-navy leading-[1.1] mb-6">
              {t("op.hero_t1")} <br className="hidden md:block" />
              <span className="italic text-gradient-gold">{t("op.hero_hl")}</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="text-base sm:text-lg text-navy/70 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">{t("op.hero_desc")}</p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="flex justify-center gap-4 flex-wrap">
              <a href="https://zalo.me/g/jhbhjc184" target="_blank" rel="noopener noreferrer">
                <Button className="bg-[hsl(var(--gold))] hover:bg-[hsl(var(--gold-dark))] text-white rounded-full px-8 py-6 text-base gap-2 shadow-[0_8px_24px_hsl(36_45%_42%/0.4)] hover:shadow-[0_12px_32px_hsl(36_45%_42%/0.6)] transition-all duration-500 font-semibold tracking-wide hover:-translate-y-1">
                  🚀 {t("op.hero_cta")}
                </Button>
              </a>
              <Button variant="outline" className="rounded-full px-8 py-6 text-base border-[hsl(var(--gold))]/40 text-navy hover:bg-[hsl(var(--gold))]/10 transition-all duration-300 font-semibold" onClick={() => document.getElementById('how-section')?.scrollIntoView({ behavior: 'smooth' })}>
                {t("op.hero_cta2")} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 mt-12 md:mt-16 glass-card border border-border/40 rounded-3xl p-6 md:p-8 max-w-4xl mx-auto bg-white/60 shadow-[var(--shadow-3d)]">
              {stats.map((s, i) => (
                <div key={i} className="text-center px-4 md:px-6">
                  <p className="text-3xl font-bold text-gradient-gold tabular-nums">{s.val}</p>
                  <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/50 mt-2">{t(s.labelKey)}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-card to-transparent" />
      </section>

      {/* ═══════════ PAIN POINTS ═══════════ */}
      <section className="py-20 md:py-24 bg-card">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12 md:mb-16">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-3">{t("op.pain_eye")}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("op.pain_title")}</h2>
              <p className="text-navy/70 font-medium mt-4 max-w-xl mx-auto leading-relaxed">{t("op.pain_sub")}</p>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {painPoints.map((p, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="glass-card rounded-2xl p-6 hover-lift h-full border border-border/50">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">{p.emoji}</div>
                    <h3 className="text-base font-bold text-navy pt-1">{t(p.titleKey)}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(p.descKey)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section id="how-section" className="py-20 md:py-24 bg-background">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12 md:mb-16">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-3">{t("op.how_eye")}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("op.how_title")}</h2>
              <p className="text-navy/70 font-medium mt-4 max-w-xl mx-auto leading-relaxed">{t("op.how_sub")}</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {processSteps.map((s, i) => (
              <ScrollReveal key={s.num} delay={i * 100}>
                <div className="glass-card rounded-2xl p-5 hover-lift h-full text-center border border-border/50">
                  <div className="w-12 h-12 rounded-full bg-primary text-white font-bold text-lg flex items-center justify-center mx-auto mb-3 shadow-[0_0_0_6px_rgba(var(--primary-rgb),0.1)]">{s.num}</div>
                  <div className="text-3xl mb-2">{s.emoji}</div>
                  <h3 className="text-sm font-bold text-navy mb-1">{t(s.titleKey)}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t(s.descKey)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SOLUTIONS ═══════════ */}
      <section className="py-20 md:py-24 bg-card">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-12 md:mb-16">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-3">{t("op.sol_eye")}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("op.sol_title")}</h2>
              <p className="text-navy/70 font-medium mt-4 max-w-xl leading-relaxed">{t("op.sol_sub")}</p>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {solutions.map((s, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="glass-card rounded-2xl p-6 hover-lift h-full border border-border/50">
                  <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">{t(s.tagKey)}</span>
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">{s.icon}</div>
                    <h3 className="text-base font-bold text-navy pt-1">{t(s.titleKey)}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(s.descKey)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ VIDEOS ═══════════ */}
      <section className="py-24 bg-navy text-white">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-[hsl(var(--gold))] uppercase tracking-[0.2em] mb-3">{t("op.vid_eye")}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{t("op.vid_title")}</h2>
              <p className="text-white/50 mt-3 max-w-xl mx-auto">{t("op.vid_sub")}</p>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {videos.map((v, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                  <div className="aspect-video relative bg-navy">
                    {playingVideo[i] ? (
                      <iframe src={`https://www.youtube.com/embed/${v.id}?autoplay=1`} className="absolute inset-0 w-full h-full" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
                    ) : (
                      <div className="absolute inset-0 bg-navy/80 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group hover:bg-navy/60" onClick={() => setPlayingVideo(p => ({ ...p, [i]: true }))}>
                        <img src={`https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`} onError={(e) => { e.currentTarget.src = `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`; }} alt="Video Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay group-hover:opacity-80 transition-opacity duration-500" />
                        <div className="relative z-10 w-16 h-16 rounded-full bg-red-600/90 border border-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 group-hover:bg-red-600 transition-all shadow-[0_4px_12px_rgba(220,38,38,0.4)]">
                          <Play className="w-6 h-6 text-white fill-white ml-1" />
                        </div>
                        <span className="relative z-10 text-white font-bold text-xs uppercase tracking-wider">{t("op.vid_tap")}</span>
                      </div>
                    )}
                  </div>
                  <p className="px-4 py-3 text-white/70 text-sm font-medium">{t(v.capKey)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="https://www.youtube.com/@thgfulfillment" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-red-600/15 border border-red-500/30 text-white px-6 py-3 rounded-full text-sm font-semibold transition-all hover:bg-red-600/30">
              ▶️ {t("op.vid_more")} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section className="py-20 md:py-24 bg-background overflow-hidden">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-3">{t("op.testi_eye")}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("op.testi_title")}</h2>
              <p className="text-navy/70 font-medium mt-4 max-w-xl mx-auto leading-relaxed">{t("op.testi_sub")}</p>
            </div>
          </ScrollReveal>
          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin snap-x snap-mandatory items-stretch">
            {testimonials.map((tm, i) => (
              <ScrollReveal key={i} delay={i * 80} className="min-w-[300px] max-w-[320px] flex-shrink-0 snap-start flex">
                <div className="glass-card rounded-2xl p-6 flex-1 hover-lift flex flex-col border border-border/50">
                  <div className="text-[hsl(var(--gold))] text-lg mb-3">★★★★★</div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{t(tm.textKey)}</p>
                  <div className="flex items-center gap-3 mt-auto pt-3 border-t border-border/30">
                    <img src={tm.avatar} alt={tm.nameKey} className="w-10 h-10 rounded-full object-cover shadow-sm bg-secondary" />
                    <div>
                      <div className="text-sm font-bold text-navy">{tm.nameKey}</div>
                      <div className="text-xs text-muted-foreground">{tm.locKey}</div>
                      <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full mt-1">{t(tm.tagKey)}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SHIPPING OPTIONS ═══════════ */}
      <section className="py-20 md:py-24 bg-card">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12 md:mb-16">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-3">{t("op.ship_eye")}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("op.ship_title")}</h2>
              <p className="text-navy/70 font-medium mt-4 max-w-xl mx-auto leading-relaxed">{t("op.ship_sub")}</p>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {shippingLanes.map((lane, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="glass-card rounded-2xl p-7 hover-lift h-full border-2 border-primary/20">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-3xl">{lane.emoji}</span>
                    <div>
                      <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{t(lane.tagKey)}</span>
                      <div className="text-2xl font-extrabold text-primary mt-1">{t(lane.timeKey)}</div>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-navy mb-4">{t(lane.titleKey)}</h3>
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    {lane.features.map((fk, fi) => (
                      <div key={fi}>{fi < lane.features.length - 1 ? "✅" : lane.emoji === "🚢" ? "⚠️" : "✅"} {t(fk)}</div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-primary/5 rounded-xl text-xs text-muted-foreground">💡 <strong>{t(lane.noteKey)}</strong></div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Volume weight explainer */}
          <ScrollReveal delay={200}>
            <div className="bg-navy rounded-2xl p-8 max-w-3xl mx-auto mt-10 text-center">
              <h3 className="text-lg font-bold text-white mb-2">{t("op.vol_title")}</h3>
              <p className="text-white/50 text-sm mb-6">{t("op.vol_sub")}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                  <div className="text-[hsl(var(--gold))] text-xs font-bold uppercase tracking-wider mb-2">🇻🇳 Vietnam → USA</div>
                  <div className="text-white font-bold text-lg">L × W × H</div>
                  <div className="text-white/40 text-sm my-1">{t("op.vol_div")}</div>
                  <div className="text-[hsl(var(--gold))] font-extrabold text-3xl">5,000</div>
                  <div className="text-white/40 text-xs mt-1">{t("op.vol_result")}</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                  <div className="text-[hsl(var(--gold))] text-xs font-bold uppercase tracking-wider mb-2">🇨🇳 China → USA</div>
                  <div className="text-white font-bold text-lg">L × W × H</div>
                  <div className="text-white/40 text-sm my-1">{t("op.vol_div")}</div>
                  <div className="text-[hsl(var(--gold))] font-extrabold text-3xl">6,000</div>
                  <div className="text-white/40 text-xs mt-1">{t("op.vol_result")}</div>
                </div>
              </div>
              <div className="bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))]/25 rounded-xl p-3 mt-4 text-sm text-white/75">
                {t("op.vol_ex")} <strong className="text-[hsl(var(--gold))]">1.1 kg</strong>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════ PRICE TABLES ═══════════ */}
      <section className="py-24 bg-navy text-white">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-[hsl(var(--gold))] uppercase tracking-[0.2em] mb-3">{t("op.price_eye")}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{t("op.price_title")}</h2>
              <p className="text-white/50 mt-3 max-w-xl mx-auto">{t("op.price_sub")}</p>
            </div>
          </ScrollReveal>

          {/* Tabs */}
          <div className="flex justify-center gap-3 mb-8">
            <button onClick={() => setActiveTab("ep")} className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${activeTab === "ep" ? "bg-primary text-white shadow-lg" : "bg-white/10 text-white/60 hover:bg-white/15"}`}>
              ✈️ {t("op.tab_ep")}
            </button>
            <button onClick={() => setActiveTab("bulk")} className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${activeTab === "bulk" ? "bg-primary text-white shadow-lg" : "bg-white/10 text-white/60 hover:bg-white/15"}`}>
              🚢 {t("op.tab_bulk")}
            </button>
          </div>

          {/* Epacket Table */}
          {activeTab === "ep" && (
            <ScrollReveal>
              <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="bg-primary/10 px-6 py-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--gold))] mb-1">{t("op.ep_lane")}</div>
                  <h3 className="text-lg font-bold text-white">{t("op.ep_title")}</h3>
                  <p className="text-xs text-white/50 mt-1">{t("op.ep_note")}</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/50">{t("op.th_weight")}</th>
                        <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/50">🇺🇸 USA (USD)</th>
                        <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/50">$/kg</th>
                      </tr>
                    </thead>
                    <tbody>
                      {epacketRows.map((r, i) => (
                        <tr key={i} className={`border-b border-white/5 ${i % 2 === 1 ? "bg-white/[0.02]" : ""}`}>
                          <td className="px-5 py-2.5 text-white/75">{r.wt}</td>
                          <td className={`px-5 py-2.5 text-right font-bold ${r.gold ? "text-[hsl(var(--gold))]" : "text-white"}`}>{r.price}</td>
                          <td className="px-5 py-2.5 text-right text-white/40 text-xs">{r.perKg}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-3 border-t border-white/10 text-xs text-white/30 leading-relaxed">{t("op.ep_foot")}</div>
              </div>
            </ScrollReveal>
          )}

          {/* Bulk Table */}
          {activeTab === "bulk" && (
            <ScrollReveal>
              <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="bg-[hsl(var(--gold))]/7 px-6 py-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--gold))] mb-1">{t("op.bulk_lane")}</div>
                  <h3 className="text-lg font-bold text-white">{t("op.bulk_title")}</h3>
                  <p className="text-xs text-white/50 mt-1">{t("op.bulk_note")}</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/50">{t("op.th_zone")}</th>
                        <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/50">12kg+</th>
                        <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/50">21kg+</th>
                        <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/50">71kg+</th>
                        <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/50">100kg+</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bulkRows.map((r, i) => (
                        <tr key={i} className={`border-b border-white/5 ${i % 2 === 1 ? "bg-white/[0.02]" : ""}`}>
                          <td className="px-5 py-3">
                            <div className="font-bold text-white">{r.zone}</div>
                            <div className="text-xs text-white/40">{t(r.zipKey)}</div>
                          </td>
                          <td className="px-5 py-3 text-right font-bold text-white">{r.p12}</td>
                          <td className="px-5 py-3 text-right text-white/75">{r.p21}</td>
                          <td className="px-5 py-3 text-right text-white/75">{r.p71}</td>
                          <td className="px-5 py-3 text-right font-bold text-[hsl(var(--gold))]">{r.p100}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-3 border-t border-white/10 text-xs text-white/30 leading-relaxed">
                  <p>{t("op.bulk_foot1")}</p>
                  <p className="mt-1">{t("op.bulk_foot2")}</p>
                </div>
              </div>
            </ScrollReveal>
          )}

          <div className="text-center mt-8">
            <a href="https://zalo.me/g/jhbhjc184" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl text-base font-bold transition-all hover:bg-primary/90 hover:-translate-y-1 shadow-lg">
              💬 {t("op.price_cta")}
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ POLICY ═══════════ */}
      <section className="py-20 md:py-24 bg-background">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12 md:mb-16">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-3">{t("op.pol_eye")}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("op.pol_title")}</h2>
              <p className="text-navy/70 font-medium mt-4 max-w-xl mx-auto leading-relaxed">{t("op.pol_sub")}</p>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {policies.map((pol, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="glass-card rounded-2xl p-6 hover-lift h-full border border-border/50">
                  <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">{t(pol.tagKey)}</span>
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">{pol.icon}</div>
                    <h3 className="text-base font-bold text-navy pt-1">{t(pol.titleKey)}</h3>
                  </div>
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground mt-3">
                    {pol.items.map((ik, ii) => (
                      <div key={ii}>{t(ik)}</div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <section className="py-20 md:py-24 bg-card">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12 md:mb-16">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-3">{t("op.faq_eye")}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("op.faq_title")}</h2>
              <p className="text-navy/70 font-medium mt-4 max-w-xl mx-auto leading-relaxed">{t("op.faq_sub")}</p>
            </div>
          </ScrollReveal>
          <div className="max-w-3xl mx-auto flex flex-col gap-3">
            {faqItems.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <div className="glass-card rounded-2xl border border-border/50 overflow-hidden transition-shadow hover:shadow-md">
                  <div className="flex items-center gap-3 px-5 py-5 sm:py-4 cursor-pointer select-none" onClick={() => toggleFaq(i)}>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg flex-shrink-0">{faq.icon}</div>
                    <div className="flex-1 text-sm sm:text-base font-semibold text-navy leading-snug">{t(faq.qKey)}</div>
                    <div className={`w-7 h-7 rounded-full bg-secondary flex items-center justify-center transition-transform duration-300 flex-shrink-0 ${openFaq === i ? "rotate-180 bg-primary text-white" : "text-muted-foreground"}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-[600px] pb-5 px-5 pl-[68px]" : "max-h-0"}`}>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{t(faq.aKey)}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ TRUST CTA ═══════════ */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">{t("op.trust_title")}</h2>
            <p className="text-white/75 mb-8 max-w-lg mx-auto">{t("op.trust_sub")}</p>
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {["op.chip1", "op.chip2", "op.chip3", "op.chip4", "op.chip5", "op.chip6"].map(ck => (
                <span key={ck} className="bg-white/15 text-white px-4 py-1.5 rounded-full text-xs font-semibold border border-white/20">{t(ck)}</span>
              ))}
            </div>
            <Link to="/catalog">
              <Button className="bg-white text-primary hover:bg-white/90 rounded-full px-10 py-6 text-base font-bold shadow-lg hover:-translate-y-1 transition-all">
                🚀 {t("op.trust_cta")}
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════ CONTACT ═══════════ */}
      <div id="order-cta">
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
};

export default THGOrderPage;
