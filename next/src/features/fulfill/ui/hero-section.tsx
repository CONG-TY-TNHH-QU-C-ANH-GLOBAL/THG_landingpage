// THG Fulfill hero (WEB-002, R2) — Server Component, now an ADAPTER over the shared
// ServiceHero template. This file maps the Fulfill view model to generic view props and owns the
// route's bespoke art (blueprint backdrop + cleanroom product stage); the layout, trust rail and
// heading semantics live in shared/service and are identical across service pages.
//
// Content behaviour is unchanged: the art-directed headline is the single H1, CMS `hero_sub`
// supplies the supporting paragraph and CMS bullets drive the operational rail, each falling back
// to the localized default when the CMS read is empty.
import Image from "next/image";
import { BadgeCheck, ShieldCheck } from "lucide-react";

import { ServiceHero, type ServiceTrustPoint } from "@/shared/service";
import type { Locale } from "@/shared/i18n";
import type { MarketingCopy } from "@/shared/i18n/marketing";
import type { FulfillContent } from "../models/fulfill";
import type { FulfillCopy } from "../localized-content";
import type { FulfillParityCopy } from "../parity-content";
import { ConsultCta } from "./consult-cta";
import styles from "./fulfill.module.css";

interface Props {
  lang: Locale;
  marketingCopy: MarketingCopy;
  copy: FulfillCopy;
  parity: FulfillParityCopy;
  content: FulfillContent;
}

/** Storefront platforms the service plugs into — restored from the Vite hero (R3 parity). */
function PlatformRail({ label, platforms }: Readonly<{ label: string; platforms: readonly string[] }>) {
  return (
    <div className="mt-10">
      <p
        className={`${styles.mono} text-[10px] font-semibold uppercase tracking-[0.15em] mb-3`}
        style={{ color: "var(--fx-gray)" }}
      >
        {label}
      </p>
      <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 list-none p-0">
        {platforms.map((name) => (
          <li key={name} className="text-sm font-bold" style={{ color: "var(--fx-gray)" }}>
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The POD transformation the Vite hero illustrated: blank unit → print → branded product.
 *  Text-first so the meaning survives without the artwork. */
function PodProcessStrip({ parity }: Readonly<{ parity: FulfillParityCopy }>) {
  const stages = [parity.blankTshirt, parity.dtgPrint, parity.brandedProduct];
  return (
    <div className="mt-6">
      <p
        className={`${styles.mono} text-[10px] uppercase tracking-[0.2em] mb-3 text-center`}
        style={{ color: "var(--fx-gray)" }}
      >
        {parity.podProcess}
      </p>
      <ol className="flex items-center justify-center gap-3 list-none p-0 flex-wrap">
        {stages.map((stage, i) => (
          <li key={stage} className="flex items-center gap-3">
            <span
              className="rounded-xl border px-3 py-2 text-xs font-semibold bg-white"
              style={{ borderColor: "var(--fx-border)" }}
            >
              {stage}
            </span>
            {i < stages.length - 1 ? (
              <span aria-hidden="true" style={{ color: "var(--fx-blue)" }}>
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <p className={`${styles.mono} mt-3 text-center text-[10px]`} style={{ color: "var(--fx-blue)" }}>
        {parity.yourBrand}
      </p>
    </div>
  );
}

/** Cleanroom product stage — the route's own art, passed to the template as a slot. */
function ProductStage() {
  return (
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
  );
}

export default function HeroSection({ lang, marketingCopy, copy, parity, content }: Readonly<Props>) {
  const subtitle = content.heroSubtitle || copy.heroSubtitleFallback;
  const rawPoints = content.points.length > 0 ? content.points.slice(0, 3) : copy.pointsFallback;
  // Identity is positional: a CMS bullet list may legitimately repeat a line, so the index — not
  // the text — is the stable key.
  const points: ServiceTrustPoint[] = rawPoints.map((label, i) => ({ id: `${i}-${label}`, label }));
  // Eyebrow = CMS hero_eyebrow when the editor set one, else the CMS service identity (hero_title),
  // else the localized default badge. The H1 is always the feature-owned art-directed headline
  // (copy.heroHeadline) — CMS never supplies the H1.
  const eyebrow = content.heroEyebrow || content.serviceLabel || copy.heroBadge;

  return (
    <ServiceHero
      eyebrow={eyebrow}
      headline={copy.heroHeadline}
      subtitle={subtitle}
      points={points}
      cta={
        <>
          <ConsultCta lang={lang} copy={marketingCopy} label={copy.consultCta} variant="ink" />
          <PlatformRail label={parity.platformsLabel} platforms={parity.platforms} />
        </>
      }
      media={
        <div>
          <ProductStage />
          <PodProcessStrip parity={parity} />
        </div>
      }
      backdrop={
        <div className={`${styles.blueprint} absolute inset-0 opacity-70 z-0 pointer-events-none`} />
      }
    />
  );
}
