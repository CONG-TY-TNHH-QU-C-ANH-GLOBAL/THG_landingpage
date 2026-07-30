// THG Fulfill hero (WEB-002) — Server Component. The art-directed headline (copy.heroHeadline)
// is the page's single H1; the CMS `hero_sub` supplies the supporting paragraph and the CMS
// bullets drive the operational rail (both fall back to localized defaults when the CMS read is
// empty). The cleanroom product stage uses an approved brand product photo, not fabricated data.
import Image from "next/image";
import { BadgeCheck, ShieldCheck } from "lucide-react";

import type { Locale } from "@/shared/i18n";
import type { MarketingCopy } from "@/shared/i18n/marketing";
import type { FulfillContent } from "../models/fulfill";
import type { FulfillCopy } from "../localized-content";
import { ConsultCta } from "./consult-cta";
import styles from "./fulfill.module.css";

interface Props {
  lang: Locale;
  marketingCopy: MarketingCopy;
  copy: FulfillCopy;
  content: FulfillContent;
}

export default function HeroSection({ lang, marketingCopy, copy, content }: Readonly<Props>) {
  const subtitle = content.heroSubtitle || copy.heroSubtitleFallback;
  const points = content.points.length > 0 ? content.points.slice(0, 3) : copy.pointsFallback;
  // Eyebrow = CMS hero_eyebrow when the editor set one, else the CMS service identity (hero_title),
  // else the localized default badge. The H1 is always the feature-owned art-directed headline
  // (copy.heroHeadline) — CMS never supplies the H1.
  const eyebrow = content.heroEyebrow || content.serviceLabel || copy.heroBadge;

  return (
    <section className="relative pt-28 pb-20 overflow-hidden" id="top">
      <div className={`${styles.blueprint} absolute inset-0 opacity-70 z-0 pointer-events-none`} />
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16 items-center lg:min-h-[68vh] relative z-10">
        <div>
          <div
            className={`${styles.mono} inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-white shadow-sm mb-8 text-[10px] uppercase tracking-widest`}
            style={{ borderColor: "var(--fx-border)", color: "var(--fx-gray)" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "var(--fx-blue)" }}
            />
            {eyebrow}
          </div>

          {/* Mobile-first ramp: small enough not to dominate/overflow at 320px, scaling up to the
              approved prototype scale (3.4rem / 5.3rem) on larger screens. */}
          <h1
            className="text-[2.4rem] sm:text-[3.4rem] lg:text-[5.3rem] font-bold leading-[0.95] mb-6 text-balance"
            style={{ letterSpacing: "-0.04em" }}
          >
            {copy.heroHeadline}
          </h1>

          <p className="text-lg max-w-md leading-relaxed mb-10 font-medium" style={{ color: "var(--fx-gray)" }}>
            {subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-10">
            {points.map((point, i) => (
              <div
                key={point}
                className={`${styles.mono} flex items-center gap-2 text-xs font-semibold pl-3`}
                style={{ borderLeft: "2px solid var(--fx-blue)" }}
              >
                <span style={{ color: "var(--fx-gray)" }}>{String(i + 1).padStart(2, "0")}</span>
                {point}
              </div>
            ))}
          </div>

          <ConsultCta lang={lang} copy={marketingCopy} label={copy.consultCta} variant="ink" />
        </div>

        {/* Cleanroom product stage */}
        <div
          className="relative h-[440px] md:h-[520px] rounded-3xl bg-white border flex items-center justify-center"
          style={{ borderColor: "var(--fx-border)", boxShadow: "0 30px 60px -20px rgba(0,0,0,0.12)" }}
        >
          <div className={`${styles.blueprint} absolute inset-0 rounded-3xl opacity-60`} />
          <div
            className="absolute w-[320px] h-[320px] rounded-full blur-[80px]"
            style={{ background: "rgba(8,145,178,0.1)" }}
          />
          <div className="relative w-[66%] max-w-[350px] z-10">
            <Image
              src="/assets/fulfill/apparel.png"
              alt=""
              width={700}
              height={700}
              priority
              sizes="(max-width: 768px) 60vw, 350px"
              className="w-full h-auto"
              style={{ mixBlendMode: "multiply" }}
            />
            <div
              className={`${styles.glass} ${styles.floaty} absolute top-[6%] -left-[16%] md:-left-[20%] px-3.5 py-2.5 rounded-xl flex items-center gap-3 z-20`}
            >
              <BadgeCheck className="w-5 h-5" style={{ color: "var(--fx-cyan)" }} aria-hidden="true" />
              <div>
                <div className={`${styles.mono} text-[8px] uppercase tracking-wider`} style={{ color: "var(--fx-gray)" }}>
                  Unit
                </div>
                <div className="font-bold text-xs">THG POD</div>
              </div>
            </div>
            <div
              className={`${styles.glass} ${styles.floatyDelayed} absolute bottom-[18%] -right-[12%] md:-right-[16%] px-3.5 py-2.5 rounded-xl flex items-center gap-3 z-20`}
            >
              <ShieldCheck className="w-5 h-5" style={{ color: "var(--fx-blue)" }} aria-hidden="true" />
              <div>
                <div className={`${styles.mono} text-[8px] uppercase tracking-wider`} style={{ color: "var(--fx-gray)" }}>
                  Quality
                </div>
                <div className="font-bold text-xs">QC passed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
