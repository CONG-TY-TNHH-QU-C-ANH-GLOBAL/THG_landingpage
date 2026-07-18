// Four service pillars — "Commerce Infrastructure Atlas" with merged service
// visual stages (owner addendum, artifact callout 16 / IMPLEMENTATION_BASELINE.md
// "Operational Blueprint Cards"). Each pillar renders ONE stage that unifies the
// production homepage's service metaphor with its operational blueprint sub-layer:
//   Fulfill   — blank garment → POD/prep → branded garment, over the orthogonal
//               Receive→Prep/POD→Pack→Dispatch route.
//   Express   — parcel origin + VN/CN → checkpoints → US·UK·EU arc with a
//               one-shot travelling signal (hover/focus only).
//   Warehouse — floor plan (IN → storage cells → OUT) under the building roof,
//               with the production "PA & NC · USA" location context.
//   Dropship  — Taobao·1688 supplier → THG hub → USA customer, no warehouse
//               intermediate.
// Structure/labels are always visible at rest; only the activity layer is
// hover/focus-gated (see the CSS module for the hover:none / reduced-motion
// fully-resolved states). Server Component — content stays CMS/production-owned.
import Link from "next/link";

import InViewOnce from "@/shared/ui/in-view-once";
import ScrollReveal from "@/shared/ui/scroll-reveal";
import { SectionHeader } from "@/shared/ui/section-header";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";
import type { Locale } from "@/shared/i18n";
import type { Service } from "../models/service";
import styles from "./pillar-atlas.module.css";

type Variant = "fulfill" | "express" | "warehouse" | "dropship";

// CMS service ids → atlas slot. Unknown ids fall back to remaining slots by position.
const VARIANT_BY_ID: Readonly<Record<string, Variant>> = {
  "thg-fulfill": "fulfill",
  "thg-express": "express",
  "thg-warehouse": "warehouse",
  "thg-order": "dropship",
};
const SLOT_ORDER: readonly Variant[] = ["fulfill", "express", "warehouse", "dropship"];

const VARIANT_CLASS: Readonly<Record<Variant, string>> = {
  fulfill: styles.cardFulfill,
  express: styles.cardExpress,
  warehouse: styles.cardWarehouse,
  dropship: styles.cardDropship,
};

// Always-visible mono service-code plates (artifact callout 16).
const SERVICE_CODE: Readonly<Record<Variant, string>> = {
  fulfill: "FUL‑01",
  express: "EXP‑02",
  warehouse: "WHS‑03",
  dropship: "DRP‑04",
};

// The four-pillar portfolio is STRUCTURAL: the approved composition always presents
// all four THG businesses. The CMS services collection provides per-pillar content
// overrides; a pillar whose CMS entry is missing or not live degrades to the
// production-owned nav copy and its real locale-aware service route — never to an
// empty slot.
const FALLBACK_CONTENT: Readonly<Record<Variant, { nameKey: string; descKey: string; path: string }>> = {
  fulfill: { nameKey: "nav.thg_fulfill", descKey: "nav.fulfill_desc", path: "/thg-fulfill" },
  express: { nameKey: "nav.thg_express", descKey: "nav.express_desc", path: "/thg-express" },
  warehouse: { nameKey: "nav.thg_warehouse", descKey: "nav.warehouse_desc", path: "/thg-warehouse" },
  dropship: { nameKey: "nav.thg_order", descKey: "nav.order_desc", path: "/thg-order" },
};

interface PillarView {
  readonly variant: Variant;
  readonly name: string;
  readonly summary: string;
  readonly detail: string;
  readonly bullets: readonly string[];
  readonly ctaText: string;
  readonly ctaUrl: string | null;
}

// Minimal garment outline used twice in the Fulfill stage (blank → branded).
const TEE_PATH = "M6 8 L20 2 a8 8 0 0 0 16 0 L50 8 L44 22 L38 18 V50 H18 V18 L12 22 Z";

/* Merged service visual stages — static design assets (aria-hidden); the pillar
   name/summary/capabilities carry the information. Diagram micro-labels are mono
   design glyphs from the approved artifact, not localized copy. */
function PillarStage({ variant }: Readonly<{ variant: Variant }>) {
  if (variant === "fulfill") {
    return (
      <div className={styles.stage} aria-hidden="true">
        <svg viewBox="0 0 220 210" fill="none">
          {/* production metaphor: blank product → POD/prep → branded product */}
          <g transform="translate(14,4)">
            <path className={styles.opMetaphor} d={TEE_PATH} />
          </g>
          <path className={styles.opRouteDashed} d="M72 30 H98" />
          <circle cx="110" cy="30" r="8" fill="hsl(var(--gold))" />
          <path d="M106.5 30 l2.5 2.7 5-5.4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path className={styles.opRouteDashed} d="M122 30 H148" />
          <g transform="translate(150,4)">
            <path className={styles.opMetaphor} d={TEE_PATH} />
            <rect x="21" y="26" width="14" height="9" rx="1" fill="hsl(var(--gold))" />
          </g>
          {/* blueprint sub-layer: orthogonal Receive→Prep/POD→Pack→Dispatch route */}
          <path className={`${styles.opRoute} ${styles.opStep1}`} d="M36,84 H184 V118" pathLength={100} />
          <path className={`${styles.opRoute} ${styles.opStep2}`} d="M184,118 H36 V152" pathLength={100} />
          <path className={`${styles.opRoute} ${styles.opStep3}`} d="M36,152 H184 V186" pathLength={100} />
          <circle className={`${styles.opNode} ${styles.opStep1}`} cx="36" cy="84" r="5" />
          <circle className={`${styles.opNode} ${styles.opStep2}`} cx="184" cy="118" r="5" />
          <circle className={`${styles.opNode} ${styles.opStep3}`} cx="36" cy="152" r="5" />
          <circle className={`${styles.opNode} ${styles.opStep4}`} cx="184" cy="186" r="5" />
          <text className={styles.opLabel} x="36" y="100" textAnchor="middle">RECEIVE</text>
          <text className={styles.opLabel} x="184" y="134" textAnchor="middle">PREP / POD</text>
          <text className={styles.opLabel} x="36" y="168" textAnchor="middle">PACK</text>
          <text className={styles.opLabel} x="184" y="202" textAnchor="middle">DISPATCH</text>
        </svg>
      </div>
    );
  }
  if (variant === "express") {
    return (
      <div className={styles.stage} aria-hidden="true">
        <svg viewBox="0 0 440 82" fill="none">
          {/* production metaphor: parcel leaving VN/CN for the US·UK·EU corridor */}
          <rect className={styles.opMetaphor} x="16" y="38" width="9" height="9" rx="1.5" strokeWidth="1.3" />
          <path className={`${styles.opRoute} ${styles.opStep1}`} d="M25,58 Q90,18 160,22" pathLength={100} />
          <path className={`${styles.opRoute} ${styles.opStep2}`} d="M160,22 Q220,8 280,18" pathLength={100} />
          <path className={`${styles.opRoute} ${styles.opStep3}`} d="M280,18 Q350,12 415,46" pathLength={100} />
          <circle className={styles.opSignal} r="3.5" fill="hsl(var(--gold))" />
          <circle className={`${styles.opNode} ${styles.opStep1}`} cx="25" cy="58" r="5" />
          <circle className={`${styles.opNode} ${styles.opStep2}`} cx="160" cy="22" r="3.5" />
          <circle className={`${styles.opNode} ${styles.opStep3}`} cx="280" cy="18" r="3.5" />
          <circle className={`${styles.opNode} ${styles.opStep4}`} cx="415" cy="46" r="5" />
          <path className={styles.opArrow} d="M415,38 L423,46 L415,54 L418,46 Z" />
          <text className={styles.opLabel} x="8" y="74" textAnchor="start">VN / CN</text>
          <text className={styles.opLabel} x="432" y="74" textAnchor="end">US · UK · EU</text>
        </svg>
      </div>
    );
  }
  if (variant === "warehouse") {
    return (
      <div className={styles.stage} aria-hidden="true">
        <svg viewBox="0 0 200 126" fill="none">
          {/* production metaphor: the THG building + US location context */}
          <path className={styles.opFrame} d="M6 26 L100 6 L194 26" />
          <text className={styles.opLabel} x="194" y="18" textAnchor="end">PA &amp; NC · USA</text>
          {/* blueprint floor plan: inbound → storage cells → outbound */}
          <rect className={styles.opFrame} x="8" y="26" width="184" height="72" rx="2" />
          <path className={styles.opGridLine} d="M68,26 V98 M128,26 V98" />
          <rect className={`${styles.opZone} ${styles.opStep1}`} x="14" y="32" width="24" height="60" rx="1.5" />
          <rect className={`${styles.opCell} ${styles.opStep2}`} x="70" y="32" width="26" height="26" rx="1.5" />
          <rect className={styles.opCell} x="100" y="32" width="26" height="26" rx="1.5" />
          <rect className={styles.opCell} x="70" y="62" width="26" height="26" rx="1.5" />
          <rect className={styles.opCell} x="100" y="62" width="26" height="26" rx="1.5" />
          <rect className={`${styles.opZone} ${styles.opStep3}`} x="154" y="32" width="24" height="60" rx="1.5" />
          <path className={`${styles.opRoute} ${styles.opStep2}`} d="M38,62 L83,45 L154,62" pathLength={100} />
          {/* inbound / outbound transport */}
          <path className={styles.opArrow} d="M1,58 l7,4 -7,4 Z" />
          <path className={styles.opArrow} d="M193,58 l7,4 -7,4 Z" />
          <text className={styles.opLabel} x="26" y="112" textAnchor="middle">IN</text>
          <text className={styles.opLabel} x="98" y="112" textAnchor="middle">STORAGE</text>
          <text className={styles.opLabel} x="166" y="112" textAnchor="middle">OUT</text>
        </svg>
      </div>
    );
  }
  return (
    <div className={styles.stage} aria-hidden="true">
      <svg viewBox="0 0 200 78" fill="none">
        {/* production metaphor as blueprint: Taobao·1688 supplier → THG → USA,
            no warehouse intermediate */}
        <path className={`${styles.opRouteDashed} ${styles.opStep1}`} d="M33,33 H87" />
        <path className={`${styles.opRouteDashed} ${styles.opStep2}`} d="M113,33 H165" />
        <rect className={`${styles.opNode} ${styles.opStep1}`} x="23.5" y="28.5" width="9" height="9" rx="2" />
        <circle className={`${styles.opNode} ${styles.opNodeHub} ${styles.opStep2}`} cx="100" cy="33" r="13" />
        <circle className={`${styles.opNode} ${styles.opStep3}`} cx="172" cy="33" r="7" />
        <text className={styles.opLabel} x="28" y="60" textAnchor="middle">TAOBAO · 1688</text>
        <text className={styles.opLabel} x="100" y="60" textAnchor="middle">THG</text>
        <text className={styles.opLabel} x="172" y="60" textAnchor="middle">USA</text>
      </svg>
    </div>
  );
}

/** Build all four pillar views: CMS services land on their brand slot (unknown ids fill
 *  remaining slots in CMS position order); every slot left without a CMS service renders
 *  the production nav copy + real locale-aware route. Always returns exactly four. */
function buildPillars(
  t: (key: string) => string,
  lang: Locale,
  services: readonly Service[],
): PillarView[] {
  const byVariant = new Map<Variant, Service>();
  const unknown: Service[] = [];
  for (const s of services) {
    const v = VARIANT_BY_ID[s.id];
    if (v && !byVariant.has(v)) byVariant.set(v, s);
    else unknown.push(s);
  }
  return SLOT_ORDER.map((variant) => {
    const s = byVariant.get(variant) ?? unknown.shift();
    if (s) {
      return {
        variant,
        name: s.name,
        summary: s.tagline || s.body,
        detail: s.heroEyebrow,
        bullets: s.bullets,
        ctaText: s.ctaText || t("services.learn_more"),
        ctaUrl: s.ctaUrl,
      };
    }
    const fallback = FALLBACK_CONTENT[variant];
    return {
      variant,
      name: t(fallback.nameKey),
      summary: t(fallback.descKey),
      detail: "",
      bullets: [],
      ctaText: t("services.learn_more"),
      ctaUrl: `/${lang}${fallback.path}`,
    };
  });
}

const PillarAtlasSection = ({
  lang,
  copy,
  services,
}: Readonly<{ lang: Locale; copy: MarketingCopy; services: readonly Service[] }>) => {
  const t = tFrom(copy);
  const pillars = buildPillars(t, lang, services);

  return (
    <section id="services" className="py-28 relative overflow-hidden" data-testid="pillar-atlas">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <SectionHeader
            align="left"
            className="mb-10 max-w-2xl"
            eyebrow={t("services.subtitle")}
            title={t("services.title")}
            titleHighlight={t("services.title_highlight")}
            titleSuffix={t("services.title2")}
            description={t("services.tagline")}
          />
        </ScrollReveal>

        <div className={styles.atlas}>
          {/* shared low-opacity route threading all four panels */}
          <div className={styles.atlasBg} aria-hidden="true">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              <path className={styles.atlasRoute} d="M8,70 C20,40 30,20 42,18 C60,15 62,45 78,42 C88,40 90,55 94,60" />
            </svg>
          </div>
          <div className={styles.grid}>
            {pillars.map((p, i) => (
              <InViewOnce
                key={p.variant}
                className={`${styles.card} ${VARIANT_CLASS[p.variant]}`}
                motionClassName={styles.motion}
                inViewClassName={styles.inView}
                data-testid={`pillar-${p.variant}`}
              >
                <span className={styles.edge} aria-hidden="true" />
                <span className={styles.indexGhost} aria-hidden="true">{`0${i + 1}`}</span>
                <span className={styles.code} aria-hidden="true">{SERVICE_CODE[p.variant]}</span>
                <PillarStage variant={p.variant} />
                <h3 className={styles.title}>{p.name}</h3>
                {p.summary && <p className={styles.summary}>{p.summary}</p>}
                {p.detail && <p className={styles.detail}>{p.detail}</p>}
                {p.bullets.length > 0 && (
                  <ul className={styles.caps}>
                    {p.bullets.map((b, j) => (
                      <li key={b}>
                        <span className={styles.capIdx}>{String(j + 1).padStart(2, "0")}</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                {p.ctaUrl && (
                  <Link prefetch={false} href={p.ctaUrl} className={styles.cta}>
                    {p.ctaText}{" "}
                    <span className={styles.ctaArrow} aria-hidden="true">
                      →
                    </span>
                  </Link>
                )}
              </InViewOnce>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PillarAtlasSection;
