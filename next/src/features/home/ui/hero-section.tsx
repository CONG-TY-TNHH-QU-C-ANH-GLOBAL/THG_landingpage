// Parity source: src/components/HeroSection.tsx
import { CheckCircle2, MapPin, Package, Plane } from "lucide-react";
import Link from "next/link";

import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";
import type { Locale } from "@/shared/i18n";
import { Button } from "@/shared/ui/button";
import ScrollReveal from "@/shared/ui/scroll-reveal";
import { HeroPrimaryCta } from "./hero-primary-cta";

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
    <section className="relative flex items-center pt-28 pb-6 md:pt-20 md:pb-10 overflow-hidden bg-gradient-hero">
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(220 25% 12%) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Shimmer overlay */}
      <div className="absolute inset-0 shimmer-effect opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-12 items-center relative z-10">
        <div className="space-y-6 md:space-y-8 text-center lg:text-left">
          <ScrollReveal delay={100}>
            <div className="inline-flex max-w-full items-center gap-2 glass-card rounded-full px-4 py-2 md:px-5 md:py-2.5 text-sm glow-pulse">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse flex-shrink-0" />
              <span className="font-medium text-muted-foreground tracking-wide uppercase text-[10px] md:text-xs truncate" >
                {badge}
              </span>
            </div>
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
                className="rounded-full px-8 py-6 text-base border-foreground/15 hover:bg-secondary hover:border-foreground/25 hover:-translate-y-0.5 transition-all duration-300"
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

        <ScrollReveal
          direction="scale"
          delay={400}
          className="relative flex justify-center items-center w-full overflow-hidden mx-auto lg:mx-0 mt-2 lg:mt-0 max-w-[280px] sm:max-w-none aspect-square sm:aspect-auto"
        >
          <div className="relative flex items-center justify-center scale-[0.55] sm:scale-[0.65] md:scale-[0.8] lg:scale-100 origin-center -my-16 sm:-my-12 md:-my-8 lg:my-0">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[420px] h-[420px] rounded-full bg-primary/10 blur-[80px] animate-pulse" />
            </div>

            <div className="globe-real-container">
              {/* LCP candidate — AVIF/WebP fallbacks shrink from 536KB PNG → ~43KB.
                  Width/height attrs reserve aspect ratio so CSS scaling doesn't shift layout. */}
              <picture>
                <source srcSet={globeImageAvif} type="image/avif" />
                <source srcSet={globeImageWebp} type="image/webp" />
                <img
                  src={globeImage}
                  alt="THG Global Network"
                  className="globe-real-image"
                  width={1024}
                  height={1024}
                  fetchPriority="high"
                  decoding="async"
                />
              </picture>
              <div className="globe-orbit" />
              <div className="globe-orbit globe-orbit-2" />

              <div className="airplane-orbit">
                <div className="airplane airplane-1"><Plane className="w-5 h-5 text-navy fill-navy/20" aria-hidden="true" /></div>
              </div>
              <div className="airplane-orbit airplane-orbit-reverse">
                <div className="airplane airplane-2"><Plane className="w-5 h-5 text-navy fill-navy/20" aria-hidden="true" /></div>
              </div>

              <div className="package-orbit">
                <div className="package-item"><Package className="w-4 h-4 text-primary" aria-hidden="true" /></div>
              </div>
              <div className="package-orbit package-orbit-2">
                <div className="package-item package-item-2"><Package className="w-4 h-4 text-primary" aria-hidden="true" /></div>
              </div>
            </div>

            <div className="absolute top-10 left-0 sm:-left-8 md:-left-12 glass-card rounded-2xl px-3 sm:px-4 md:px-5 py-3 md:py-4 animate-float z-10 glow-pulse">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground mb-1">
                <MapPin className="w-3 h-3 text-primary" aria-hidden="true" /> EU
              </div>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-navy tracking-tight">5-8</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground" >{t("hero.delivery_days")}</p>
            </div>

            <div className="absolute top-24 right-6 sm:right-2 glass-card rounded-xl px-3 md:px-4 py-2 flex items-center gap-2 animate-float z-10">
              <MapPin className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
              <span className="text-xs font-semibold">USA</span>
            </div>

            <div className="absolute top-44 -right-10 md:-right-10 glass-card rounded-2xl px-4 md:px-5 py-3 md:py-4 animate-float z-10 block glow-pulse">
              <p className="text-2xl md:text-3xl font-bold text-navy tracking-tight">4</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{t("hero.warehouses")}</p>
            </div>

            <div className="absolute bottom-36 right-2 md:right-4 glass-card rounded-xl px-3 md:px-4 py-2 flex items-center gap-2 animate-float z-10">
              <MapPin className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
              <span className="text-xs font-semibold">China</span>
            </div>

            <div className="absolute bottom-24 right-0 md:-right-4 glass-card rounded-xl px-3 md:px-4 py-2 flex items-center gap-2 animate-float z-10">
              <MapPin className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
              <span className="text-xs font-semibold">Vietnam</span>
            </div>

            <div className="absolute bottom-8 left-2 sm:-left-4 md:-left-8 glass-card rounded-2xl px-3 sm:px-4 md:px-5 py-3 md:py-4 animate-float z-10 glow-pulse">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-navy tracking-tight">
                {t("hero.from_price")} <span className="text-gradient-gold">1.2$</span>
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground" >{t("hero.us_fulfill")}</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default HeroSection;
