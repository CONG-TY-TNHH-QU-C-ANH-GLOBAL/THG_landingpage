// Parity source: src/components/AboutVideoSection.tsx. Server Component — `videoUrl` is the
// already-composed raw operator URL (EN block wins over site settings, composed by the page);
// text content follows the active locale via `about`.
import { Package, Truck, Globe, ShieldCheck } from "lucide-react";
import ScrollReveal from "@/shared/ui/scroll-reveal";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";
import type { AboutVideoContent } from "../models/homepageContent";

const FALLBACK_VIDEO_ID = "AzlW2irPANQ";

// Extract YouTube videoId from any common URL shape:
//   https://www.youtube.com/watch?v=ID
//   https://youtu.be/ID
//   https://www.youtube.com/embed/ID
//   raw ID (11 chars alnum/_-)
function extractYouTubeId(input: string | null | undefined): string {
  if (!input) return FALLBACK_VIDEO_ID;
  const trimmed = input.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    const v = url.searchParams.get("v");
    if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;
    const parts = url.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    if (last && /^[A-Za-z0-9_-]{11}$/.test(last)) return last;
  } catch {
    // not a URL — fall through
  }
  return FALLBACK_VIDEO_ID;
}

const AboutVideoSection = ({
  copy,
  about,
  videoUrl,
}: Readonly<{ copy: MarketingCopy; about: AboutVideoContent; videoUrl: string }>) => {
  const tVi = tFrom(copy);
  const videoId = extractYouTubeId(videoUrl);

  const highlights = [
    { icon: Package, label: about.highlights[0] || tVi("about.highlight1") },
    { icon: Truck, label: about.highlights[1] || tVi("about.highlight2") },
    { icon: Globe, label: about.highlights[2] || tVi("about.highlight3") },
    { icon: ShieldCheck, label: about.highlights[3] || tVi("about.highlight4") },
  ];

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden" id="about-thg">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">
              {tVi("about.subtitle")}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy tracking-tight">
              {tVi("about.title")}{" "}
              <span className="text-gradient-gold">{tVi("about.title_highlight")}</span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Video + Text */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center mb-16 md:mb-20">
          <ScrollReveal delay={100} direction="rotate3d">
            <div
              className="relative rounded-2xl overflow-hidden aspect-video bg-navy/5"
              style={{ boxShadow: "var(--shadow-3d)" }}
            >
              <iframe
                className="w-full h-full absolute inset-0"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`}
                title="THG Fulfill Introduction"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="space-y-5">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-navy leading-snug">
                {tVi("about.video_title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {tVi("about.video_desc")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 glass-card rounded-xl px-4 py-3 hover:shadow-lg transition-all duration-300"
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
            {tVi("about.gallery_title")}
          </h3>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-4">
          {[
            { emoji: "📦", title: tVi("about.img1_title"), desc: tVi("about.img1_desc") },
            { emoji: "🖨️", title: tVi("about.img2_title"), desc: tVi("about.img2_desc") },
            { emoji: "🏭", title: tVi("about.img3_title"), desc: tVi("about.img3_desc") },
            { emoji: "🚚", title: tVi("about.img4_title"), desc: tVi("about.img4_desc") },
          ].map((item, i) => (
            <ScrollReveal key={item.title} delay={100 + i * 80} className="h-full">
              <div className="bg-white rounded-[24px] p-6 lg:p-8 text-center group h-full flex flex-col items-center justify-start shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                <div className="text-5xl md:text-6xl mb-5 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                  {item.emoji}
                </div>
                <h4 className="font-bold text-navy text-base md:text-lg mb-3">{item.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutVideoSection;
