import { Play, Package, Truck, Globe, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import ScrollReveal from "@/components/ScrollReveal";

const AboutVideoSection = () => {
  const { t } = useI18n();

  const highlights = [
    { icon: Package, label: t("about.highlight1") },
    { icon: Truck, label: t("about.highlight2") },
    { icon: Globe, label: t("about.highlight3") },
    { icon: ShieldCheck, label: t("about.highlight4") },
  ];

  return (
    <section className="py-16 md:py-24 bg-background" id="about-thg">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">
              {t("about.subtitle")}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy tracking-tight">
              {t("about.title")}{" "}
              <span className="text-gradient-gold">{t("about.title_highlight")}</span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Video + Text */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center mb-16 md:mb-20">
          <ScrollReveal delay={100}>
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video bg-navy/5">
              <iframe
                className="w-full h-full absolute inset-0"
                src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                title="THG Fulfill Introduction"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              {/* Placeholder overlay – will disappear once a real video ID is set */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy/80 text-primary-foreground pointer-events-none">
                <Play className="w-14 h-14 mb-3 opacity-60" />
                <p className="text-sm opacity-60">{t("about.video_placeholder")}</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="space-y-5">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-navy leading-snug">
                {t("about.video_title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {t("about.video_desc")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {highlights.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 glass-card rounded-xl px-4 py-3"
                  >
                    <item.icon className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground/80">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Service gallery */}
        <ScrollReveal delay={100}>
          <h3 className="text-xl sm:text-2xl font-bold text-navy text-center mb-8">
            {t("about.gallery_title")}
          </h3>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {[
            { emoji: "📦", title: t("about.img1_title"), desc: t("about.img1_desc") },
            { emoji: "🖨️", title: t("about.img2_title"), desc: t("about.img2_desc") },
            { emoji: "🏭", title: t("about.img3_title"), desc: t("about.img3_desc") },
            { emoji: "🚚", title: t("about.img4_title"), desc: t("about.img4_desc") },
          ].map((item, i) => (
            <ScrollReveal key={i} delay={100 + i * 80}>
              <div className="glass-card rounded-2xl p-5 md:p-6 text-center hover-lift group">
                <div className="text-4xl md:text-5xl mb-3 group-hover:scale-110 transition-transform">
                  {item.emoji}
                </div>
                <h4 className="font-semibold text-navy text-sm md:text-base mb-1">{item.title}</h4>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutVideoSection;
