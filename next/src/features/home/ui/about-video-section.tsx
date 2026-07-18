// "Tại sao chọn THG Fulfill?" — the production Why-THG video section, restored on
// owner instruction (governance: IP-007 deviation log, WEB-001B addendum) and
// re-expressed in the approved design system: editorial two-column split, ivory
// surface, step-scale typography, manifest-style highlight rows. Content and the
// YouTube video are production-owned: about.* dictionary keys + the CMS aboutVideo
// block (EN block wins over site settings, composed by the page — parity with the
// pre-redesign homepage). Server Component — the iframe is plain lazy markup, no
// client JS. Owner-mandated behavior change vs. legacy: no autoplay/mute/loop, and
// the privacy-enhanced youtube-nocookie host.
import ScrollReveal from "@/shared/ui/scroll-reveal";
import { SectionHeader } from "@/shared/ui/section-header";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";
import type { AboutVideoContent } from "../models/homepageContent";

// Production fallback video (parity: src/components/AboutVideoSection.tsx).
const FALLBACK_VIDEO_ID = "AzlW2irPANQ";

// Extract the YouTube videoId from any common operator-entered URL shape:
// watch?v=ID · youtu.be/ID · /embed/ID · raw 11-char ID.
function extractYouTubeId(input: string | null | undefined): string {
  if (!input) return FALLBACK_VIDEO_ID;
  const trimmed = input.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    const v = url.searchParams.get("v");
    if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;
    const last = url.pathname.split("/").findLast(Boolean);
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
  const t = tFrom(copy);
  const videoId = extractYouTubeId(videoUrl);

  const highlights = [
    about.highlights[0] || t("about.highlight1"),
    about.highlights[1] || t("about.highlight2"),
    about.highlights[2] || t("about.highlight3"),
    about.highlights[3] || t("about.highlight4"),
  ];

  return (
    <section id="about-thg" className="py-28 relative overflow-hidden" data-testid="about-video">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Video — stable aspect ratio reserves the box before the iframe loads,
              so a slow YouTube response can never shift layout or block SSR. */}
          <ScrollReveal direction="left">
            <div className="relative rounded-2xl overflow-hidden aspect-video border border-border bg-navy/5 shadow-[var(--shadow-card)]">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                title={t("about.video_iframe_title")}
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <div>
              <SectionHeader
                align="left"
                className="mb-6"
                eyebrow={t("about.subtitle")}
                title={t("about.title")}
                titleHighlight={t("about.title_highlight")}
              />
              <h3 className="text-[length:var(--step-h3)] font-bold text-navy leading-snug mb-3">
                {t("about.video_title")}
              </h3>
              <p className="text-muted-foreground text-[length:var(--step-body)] leading-relaxed max-w-[58ch] mb-6">
                {t("about.video_desc")}
              </p>
              {/* verified capability highlights — manifest rows, not glass cards */}
              <ul className="m-0 p-0 list-none border-t border-border">
                {highlights.map((label, i) => (
                  <li
                    key={label}
                    className="flex items-baseline gap-3 py-2.5 border-b border-border text-sm text-navy"
                  >
                    <span className="font-mono text-[10px] text-muted-foreground w-4 flex-shrink-0" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default AboutVideoSection;
