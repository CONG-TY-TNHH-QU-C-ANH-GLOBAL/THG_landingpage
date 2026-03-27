import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { useI18n } from "@/lib/i18n";
import { Warehouse, ArrowRight, CheckCircle2, MapPin, DollarSign, Clock, Monitor, Package, Truck, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const THGWarehousePage = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero – Dark Blue */}
      <section className="pt-28 pb-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #172554 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }} />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <ScrollReveal>
            <p className="text-indigo-200 text-sm md:text-base font-medium mb-4 tracking-wide">{t("warehouse_page.badge")}</p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-tight" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
              THG <span className="text-gradient-gold">Warehouse</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-lg text-indigo-100/80 max-w-xl mx-auto mb-8">{t("warehouse_page.hero_subtitle")}</p>
          </ScrollReveal>
          {/* Hero image */}
          <ScrollReveal delay={300}>
            <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 hover:-translate-y-1 transition-transform mb-8">
              <img
                src="https://w.ladicdn.com/s1500x1100/67e69e24e8a7ba001127c80a/kho-my-14-1-20250729095528-dcsxm.jpg"
                alt="THG Warehouse Operations"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <Button className="bg-white hover:bg-slate-50 text-blue-900 rounded-full px-8 py-6 text-base font-bold gap-2 shadow-lg">
              {t("nav.consult")} <ArrowRight className="w-4 h-4" />
            </Button>
          </ScrollReveal>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-16 bg-card border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { val: "$1", labelKey: "warehouse_page.stat1" },
              { val: "90", labelKey: "warehouse_page.stat2" },
              { val: "2-5", labelKey: "warehouse_page.stat3" },
              { val: "24/7", labelKey: "warehouse_page.stat4" },
            ].map((s, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div>
                  <p className="text-3xl md:text-4xl font-bold text-gradient-gold">{s.val}</p>
                  <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{t(s.labelKey)}</p>
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
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">THG Warehouse</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("warehouse_page.solution_title")}</h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((f, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="glass-card rounded-2xl p-8 text-center hover-lift h-full">
                  <span className="text-4xl block mb-4">{f.icon}</span>
                  <h3 className="text-lg font-bold text-navy mb-3">{t(f.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: t(f.descKey) }} />
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
                  <p className="text-muted-foreground leading-relaxed">{t("warehouse_page.str2_desc")}</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Block 2: Cost */}
            <ScrollReveal delay={100}>
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div className="order-2 lg:order-1">
                  <h3 className="text-2xl font-bold text-navy mb-4">{t("warehouse_page.str1_title")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("warehouse_page.str1_desc")}</p>
                </div>
                <div className="order-1 lg:order-2 rounded-2xl overflow-hidden shadow-lg border border-border/40 hover:shadow-xl transition-all hover:-translate-y-1">
                  <img
                    src="https://w.ladicdn.com/s1500x1100/67e69e24e8a7ba001127c80a/kho-my-11-1-20250729095528-nzruq.jpg"
                    alt="Optimized Fulfill Cost"
                    className="w-full h-72 object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Operation Videos */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">{t("warehouse_page.ops_badge")}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("warehouse_page.ops_title")}</h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: "warehouse_page.vid1_title", desc: "warehouse_page.vid1_desc", src: "/videos/Donghuang scan.mp4" },
              { title: "warehouse_page.vid2_title", desc: "warehouse_page.vid2_desc", src: "/videos/Huang Huan scan.mp4" },
              { title: "warehouse_page.vid3_title", desc: "warehouse_page.vid3_desc", src: "/videos/FeatherSoft Feel Case.mp4" },
            ].map((vid, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="glass-card rounded-2xl overflow-hidden hover-lift h-full">
                  <div className="aspect-video bg-black rounded-t-2xl overflow-hidden">
                    <video
                      src={vid.src}
                      controls
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h4 className="text-base font-bold text-navy mb-2">{t(vid.title)}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(vid.desc)}</p>
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
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">Infrastructure & Tech</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("warehouse_page.gallery_title")}</h2>
              <p className="text-muted-foreground mt-3 max-w-xl mx-auto">{t("warehouse_page.gallery_desc")}</p>
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
                    <p className="text-xs text-muted-foreground leading-relaxed">{t(card.desc)}</p>
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
                <p className="text-muted-foreground leading-relaxed mb-4">{t("warehouse_page.oms_desc1")}</p>
                <p className="text-muted-foreground leading-relaxed mb-8">{t("warehouse_page.oms_desc2")}</p>
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
                      <span className="text-xs font-bold text-primary/40">Step {s.num}</span>
                      <h3 className="text-base font-bold text-navy tracking-tight">{t(s.titleKey)}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(s.descKey)}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Warehouse Locations */}
      <section className="py-20 bg-gradient-dark text-primary-foreground">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{t("warehouse_page.locations_title")}</h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <ScrollReveal delay={100}>
              <div className="border border-primary-foreground/10 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3"><span className="text-2xl">🇺🇸</span><h3 className="font-bold">Pennsylvania</h3></div>
                <p className="text-sm text-primary-foreground/60">108 Almond CT, Milford, PA 18337</p>
                <p className="text-sm text-primary-foreground/60">📞 +1 (570) 618-1169</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="border border-primary-foreground/10 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3"><span className="text-2xl">🇺🇸</span><h3 className="font-bold">Winston-Salem, NC</h3></div>
                <p className="text-sm text-primary-foreground/60">4136 Sunflower Circle, Winston-Salem, NC 27105</p>
              </div>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={300}>
            <div className="text-center mt-10">
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

export default THGWarehousePage;
