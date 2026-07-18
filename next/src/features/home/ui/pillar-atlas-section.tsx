// Four service pillars — "Commerce Infrastructure Atlas" (Open Design artifact
// "FOUR SERVICE PILLARS", IMPLEMENTATION_BASELINE.md "Four pillars as one designed
// composition"). Replaces the four-equal-cards ServicesSection: one dominant anchor
// panel (Fulfill), a wide corridor banner (Express), two supporting tiles
// (Warehouse/Dropship), threaded by a shared low-opacity route. Server Component —
// all copy comes from the CMS Service model (name/tagline/heroEyebrow/bullets/CTA);
// icons and the background route are static design assets. The only client code is
// the InViewOnce shell that toggles the one-shot entry choreography class.
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

// The four-pillar portfolio is STRUCTURAL: the approved composition always presents
// all four THG businesses. The CMS services collection provides per-pillar content
// overrides; a pillar whose CMS entry is missing or not live degrades to the
// production-owned nav copy and its real locale-aware service route — never to an
// empty slot. (Root cause of the owner-reported regression: the CMS returned a
// single live service, and slot-by-id rendering left the other three slots blank.)
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

const VARIANT_CLASS: Readonly<Record<Variant, string>> = {
  fulfill: styles.cardFulfill,
  express: styles.cardExpress,
  warehouse: styles.cardWarehouse,
  dropship: styles.cardDropship,
};

/* Choreographed pillar icons, ported 1:1 from the approved artifact. Decorative
   (aria-hidden) — the pillar name/summary carry the information. */
function PillarIcon({ variant }: Readonly<{ variant: Variant }>) {
  if (variant === "fulfill") {
    return (
      <svg className={styles.icon} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path className={styles.capTop} d="M12 24 L32 14 L52 24 L32 34 Z" stroke="hsl(var(--navy))" strokeWidth="1.6" strokeLinejoin="round" />
        <path className={styles.capLeft} d="M12 24 V44 L32 54 V34" stroke="hsl(var(--navy))" strokeWidth="1.6" strokeLinejoin="round" />
        <path className={styles.capRight} d="M52 24 V44 L32 54" stroke="hsl(var(--navy))" strokeWidth="1.6" strokeLinejoin="round" />
        <circle className={styles.capBadge} cx="32" cy="24" r="6.5" fill="hsl(var(--gold))" />
        <path className={styles.capCheck} d="M29 24 l2 2.2 l4.5 -4.6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="24" r="1.3" fill="hsl(var(--muted-foreground))" />
        <circle cx="52" cy="24" r="1.3" fill="hsl(var(--muted-foreground))" />
      </svg>
    );
  }
  if (variant === "express") {
    return (
      <svg className={styles.icon} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle cx="12" cy="46" r="4" fill="hsl(var(--gold))" />
        <path className={styles.expRoute} d="M12 46 Q34 10 52 18" stroke="hsl(var(--navy))" strokeWidth="1.6" strokeLinecap="round" pathLength={100} />
        <path className={styles.expSignal} d="M40 20.5 l8 -3.2 l-2.2 8.2 Z" fill="hsl(var(--gold))" />
        <circle className={styles.expDest} cx="52" cy="18" r="4" fill="hsl(var(--navy))" />
      </svg>
    );
  }
  if (variant === "warehouse") {
    return (
      <svg className={styles.icon} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path className={styles.whShell} d="M8 28 L32 12 L56 28 V52 H8 Z" stroke="hsl(var(--navy))" strokeWidth="1.6" strokeLinejoin="round" />
        <rect className={`${styles.whCell} ${styles.whCell1}`} x="16" y="34" width="8" height="8" fill="var(--pillar-steel)" />
        <rect className={`${styles.whCell} ${styles.whCell2}`} x="28" y="34" width="8" height="8" fill="var(--pillar-steel)" />
        <rect className={`${styles.whCell} ${styles.whCell3}`} x="40" y="34" width="8" height="8" fill="var(--pillar-steel)" />
        <rect className={styles.whGate} x="16" y="44" width="8" height="8" fill="none" stroke="hsl(var(--navy))" strokeWidth="1.2" />
        <rect className={styles.whGate} x="40" y="44" width="8" height="8" fill="none" stroke="hsl(var(--navy))" strokeWidth="1.2" />
      </svg>
    );
  }
  return (
    <svg className={styles.icon} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect className={`${styles.dsItem} ${styles.dsItem1}`} x="10" y="14" width="10" height="10" rx="2" stroke="hsl(var(--navy))" strokeWidth="1.4" />
      <rect className={`${styles.dsItem} ${styles.dsItem2}`} x="10" y="30" width="10" height="10" rx="2" stroke="hsl(var(--navy))" strokeWidth="1.4" />
      <rect className={`${styles.dsItem} ${styles.dsItem3}`} x="10" y="46" width="10" height="10" rx="2" stroke="hsl(var(--navy))" strokeWidth="1.4" />
      <circle className={styles.dsHub} cx="42" cy="34" r="12" stroke="hsl(var(--navy))" strokeWidth="1.6" />
      <path className={styles.dsHandle} d="M50.5 42.5 L58 50" stroke="hsl(var(--navy))" strokeWidth="1.8" strokeLinecap="round" />
      <path className={styles.dsLink} d="M20 19 H30" stroke="hsl(var(--gold))" strokeWidth="1.4" strokeDasharray="2 4" />
      <path className={`${styles.dsLink} ${styles.dsLinkSelected}`} d="M20 35 H30" stroke="hsl(var(--gold))" strokeWidth="1.4" strokeDasharray="2 4" />
      <path className={styles.dsLink} d="M20 51 H30" stroke="hsl(var(--gold))" strokeWidth="1.4" strokeDasharray="2 4" />
    </svg>
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
            size="xl"
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
                <PillarIcon variant={p.variant} />
                <h3 className={styles.title}>{p.name}</h3>
                {p.summary && <p className={styles.summary}>{p.summary}</p>}
                {p.detail && <p className={styles.detail}>{p.detail}</p>}
                {p.bullets.length > 0 && (
                  <ul className={styles.caps}>
                    {p.bullets.slice(0, 4).map((b, j) => (
                      <li key={b}>
                        <span className={styles.capIdx}>{String(j + 1).padStart(2, "0")}</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                {p.ctaUrl && (
                  <Link prefetch={false} href={p.ctaUrl} className={styles.cta}>
                    {p.ctaText} <span aria-hidden="true">→</span>
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
