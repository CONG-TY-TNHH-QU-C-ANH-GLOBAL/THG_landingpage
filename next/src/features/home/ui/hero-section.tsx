// Parity source: src/components/HeroSection.tsx
// WEB-001A: right column recomposed to the approved Open Design baseline (visual
// authority: homepage-concept-global-fulfillment-orbit.html; rules:
// IMPLEMENTATION_BASELINE.md "Hero with 3D globe" / "Real scroll-driven parallax") —
// decorative floating stat cards + continuously-looping orbit icons (an anti-pattern
// per the baseline: "every entry animation fires once, no continuous/looping decorative
// motion") replaced by <HeroParallaxScene>, a one-shot-per-scroll, reduced-motion-safe
// client island. Left column content/i18n keys are unchanged production copy.
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";
import type { Locale } from "@/shared/i18n";
import { Button } from "@/shared/ui/button";
import ScrollReveal from "@/shared/ui/scroll-reveal";
import { HeroPrimaryCta } from "./hero-primary-cta";
import { HeroParallaxScene } from "./hero-parallax-scene";

import type { HomeHeroContent } from "../models/homepageContent";

// AVIF (~43KB) and WebP (~57KB) siblings — regenerate via
// `bun run scripts/optimize-hero-images.mjs` after replacing the source PNG.
const globeImage = "/assets/globe-3d.png";
const globeImageAvif = "/assets/globe-3d.avif";
const globeImageWebp = "/assets/globe-3d.webp";

// Parse `**word**` markers into gold-highlighted spans. Odd-indexed chunks
// of split() are the matches; even-indexed are the surrounding plain text.
function renderTitle(raw: string) {
  const parts = raw.split(/\*\*([^*]+)\*\*/g);
  return parts.map((p, i) =>
    i % 2 === 1 ? <span key={`gold-${p}-${i}`} className="text-gradient-gold">{p}</span> : p,
  );
}

interface HeroSectionProps {
  lang: Locale;
  copy: MarketingCopy;
  hero: HomeHeroContent;
}

const HeroSection = ({ lang, copy, hero }: HeroSectionProps) => {
  const t = tFrom(copy);
  // FND-005 hero model overrides i18n keys when operator edits in admin.
  // Title supports `**word**` syntax to mark gold-highlighted spans, so
  // operators can edit one string in CMS while keeping the design's gold
  // accents. Falls back to the 4-key i18n composition when CMS has no title.
  const subtitle = hero.subtitle || t("hero.subtitle");
  const badge = hero.badge || t("hero.badge");
  const cta = hero.primaryCta || t("hero.cta");
  const ctaSecondary = hero.secondaryCta || t("hero.learn_more");
  const cmsTitle = hero.title.trim();

  const features = [t("hero.feature1"), t("hero.feature2"), t("hero.feature3"), t("hero.feature4")];

  return (
    // WEB-001A fix-up (root cause of both the vertical-fit and parallax-clarity defects):
    // `overflow-hidden` on this section broke `position:sticky` for the parallax scene's
    // sticky viewport nested inside it — any ancestor with overflow != visible disables
    // sticky positioning for its descendants (a well-known CSS behavior), degrading the
    // sticky element to a permanent +top-offset relative shift with NO pinning at all
    // (measured: it scrolled 1:1 with the page instead of holding at top:80px). The
    // decorative dot-grid pattern below is `inset-0`, self-contained within the section's
    // own box, so it does not depend on this section clipping — dropping overflow-hidden
    // does not reintroduce visible overflow (verified: no horizontal scrollbar).
    <section className="relative flex items-center pt-28 pb-6 md:pt-20 md:pb-10 bg-gradient-hero">
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(220 25% 12%) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Real scroll-driven parallax (IMPLEMENTATION_BASELINE.md "Motion phases and
          interaction rules") — HeroParallaxScene owns the outer scroll-track/sticky/grid
          structure (matching the artifact 1:1) and takes this copy as `children`, so the
          tall scroll track applies to the whole hero, not just the globe side. Node copy
          reuses the same production i18n strings the previous floating stat cards showed
          (delivery days / US fulfillment price), just relocated onto the network layer. */}
      <div className="container mx-auto px-4 relative z-10">
        <HeroParallaxScene
          imageSrc={globeImage}
          imageSrcAvif={globeImageAvif}
          imageSrcWebp={globeImageWebp}
          imageAlt="THG Fulfill global logistics network"
          apac={{ value: "Vietnam · China", caption: "Asia-Pacific" }}
          us={{ value: "$1.2", caption: t("hero.us_fulfill") }}
          eu={{ value: "5-8", caption: t("hero.delivery_days") }}
        >
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
            <ScrollReveal delay={100}>
              {/* Plain eyebrow label, not a pulsing pill — IMPLEMENTATION_BASELINE.md
                  anti-patterns: "decorative floating cards without informational purpose". */}
              <p className="font-semibold text-accent tracking-[0.2em] uppercase text-[length:var(--step-label)]">
                {badge}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-[4.2rem] font-bold leading-[1.1] text-navy tracking-tight mx-auto lg:mx-0" >
                {cmsTitle ? (
                  renderTitle(cmsTitle)
                ) : (
                  <>
                    {t("hero.title1")}{" "}
                    <span className="text-gradient-gold">{t("hero.title_highlight")}</span>{" "}
                    {t("hero.title2")}{" "}
                    <span className="text-gradient-gold">{t("hero.title3")}</span>
                  </>
                )}
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed mx-auto lg:mx-0" >
                {subtitle}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-sm sm:max-w-none mx-auto lg:mx-0">
                {features.map((f) => (
                  <div key={f} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                    <span className="text-sm text-foreground/75" >{f}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={500}>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:justify-center lg:justify-start">
                {/* Primary CTA — "Nhận báo giá miễn phí" → open lead form modal */}
                <HeroPrimaryCta lang={lang} copy={copy} cta={cta} />
                {/* Secondary CTA — "Xem dịch vụ" → catalog page. Kept unprefixed like
                    Vite's navigate('/catalog'); the proxy preserves today's redirect. */}
                <Button
                  variant="outline"
                  asChild
                  className="rounded-lg px-8 py-6 text-base border-foreground/15 hover:bg-secondary hover:border-foreground/25 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Link prefetch={false} href="/catalog">
                    <span>{ctaSecondary}</span>
                  </Link>
                </Button>
              </div>
              {/* Trust microcopy — soft reassurance after the commit-heavy CTAs. */}
              <p className="text-[11px] sm:text-xs text-muted-foreground/80 mt-3 text-center lg:text-left">
                {t("trust.cta_micro")}
              </p>
            </ScrollReveal>
          </div>
        </HeroParallaxScene>
      </div>
    </section>
  );
};

export default HeroSection;
