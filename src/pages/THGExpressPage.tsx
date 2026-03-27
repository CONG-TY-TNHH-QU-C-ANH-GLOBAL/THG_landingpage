import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import ImageMarquee from "@/components/ImageMarquee";
import FAQAccordion from "@/components/FAQAccordion";
import { useI18n } from "@/lib/i18n";
import { Truck, ArrowRight, Plane, Ship, Shield, Clock, Search, MapPin, Globe } from "lucide-react";
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

      {/* Hero with Background Image */}
      <section
        className="pt-28 pb-20 relative overflow-hidden"
        style={{
          backgroundImage: "url('https://w.ladicdn.com/s1440x957/67e69e24e8a7ba001127c80a/x1ws5joh20250728082550.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/65 z-0" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 text-sm mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="font-semibold text-blue-600 text-xs uppercase tracking-wider">THG Express</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white tracking-tight mb-4" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
              {t("express_page.hero_title1")} <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{t("express_page.hero_title_highlight")}</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="text-base sm:text-lg text-slate-100/90 max-w-xl mx-auto mb-8" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
              {t("express_page.hero_subtitle")}
            </p>
          </ScrollReveal>

          {/* Tracking Widget */}
          <ScrollReveal delay={300}>
            <div className="max-w-xl mx-auto bg-white rounded-2xl p-5 shadow-xl border border-slate-200">
              <h3 className="text-sm font-bold text-navy mb-3 text-left">{t("express_page.track_title")}</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    placeholder={t("express_page.track_placeholder")}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-navy"
                    onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                  />
                </div>
                <Button onClick={handleTrack} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 font-semibold">
                  <Search className="w-4 h-4 mr-1" /> {t("express_page.track_btn")}
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* YouTube Shorts Grid */}
      <section className="py-12 bg-card border-b border-border/50 -mt-6 relative z-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-4 md:gap-6 flex-wrap">
            {[
              { id: "n5t6sHIKv4A", title: "THG Warehouse Ops" },
              { id: "ZgoqBsujyC0", title: "THG Shipping Facility" },
              { id: "KDq7-tEikgg", title: "Scale of THG Express" },
            ].map((vid, i) => (
              <ScrollReveal key={vid.id} delay={i * 100}>
                <div className={`w-[260px] md:w-[280px] rounded-2xl overflow-hidden border-4 border-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 ${i === 1 ? "hidden sm:block" : ""} ${i === 2 ? "hidden lg:block" : ""}`}>
                  <YouTubeEmbed videoId={vid.id} title={vid.title} aspectRatio="315/560" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">{t("express_page.features_eyebrow")}</p>
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

      {/* Main Video Presentation */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-xl border border-border/50">
              <YouTubeEmbed
                videoId="AaZJmRFfiqM"
                title="Quy trình vận hành kho bãi THG"
                autoplay
                muted
                loop
                controls={false}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-background border-t border-border/50">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">{t("express_page.process_eyebrow")}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("express_page.process_title")}</h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {processSteps.map((s, i) => (
              <ScrollReveal key={s.num} delay={i * 120}>
                <div className="glass-card rounded-2xl p-6 hover-lift h-full relative">
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

      {/* Shipping Routes */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">{t("express_page.routes_eyebrow")}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("express_page.lines_title")}</h2>
              <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">{t("express_page.lines_desc")}</p>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {shippingLines.map((l, i) => (
              <ScrollReveal key={l.num} delay={i * 100}>
                <Link
                  to={l.link}
                  className={`flex items-center gap-4 p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-md group ${l.special
                      ? "border-pink-200 bg-pink-50/50 hover:border-pink-400"
                      : "border-border bg-card hover:border-primary/30"
                    }`}
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0 ${l.special ? "bg-pink-100 text-pink-600" : "bg-secondary text-primary"
                    }`}>
                    {l.flags.split(" → ")[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-base font-bold mb-1 ${l.special ? "text-pink-600" : "text-navy"}`}>{t(l.routeKey)}</h4>
                    <p className="text-sm text-muted-foreground">{t(l.typesKey)}</p>
                  </div>
                  <span className={`text-xl font-bold transition-transform group-hover:translate-x-1 ${l.special ? "text-pink-500" : "text-muted-foreground/30"}`}>→</span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Image Marquee */}
      <section className="py-8 bg-background border-y border-border/50">
        <ScrollReveal>
          <div className="container mx-auto px-4 text-center mb-6">
            <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em]">{t("express_page.marquee_label")}</p>
          </div>
        </ScrollReveal>
        <ImageMarquee images={sliderImages} speed={40} height="180px" />
      </section>

      {/* FAQ */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">{t("express_page.faq_eyebrow")}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("express_page.faq_title")}</h2>
            </div>
          </ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <FAQAccordion items={faqItems} />
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
