import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IBM_Plex_Mono } from "next/font/google";

import { isSupportedLocale, type Locale } from "@/shared/i18n";
import { getMarketingCopy } from "@/shared/i18n/server/get-marketing-copy";
import { buildPageMetadata, resolveSiteOrigin, localeUrl } from "@/shared/seo";
import {
  loadFulfillContent,
  loadFulfillFaqs,
  loadFulfillServiceBlocks,
  loadFulfillFeaturedProducts,
  getFulfillContent,
  applyServiceBlocks,
} from "@/features/fulfill";
import { getCatalogCopy } from "@/features/catalog";
import { getFulfillParityContent } from "@/features/fulfill/parity-content";
import { getMovementCopy } from "@/features/fulfill/ui/movement-copy";

// ── ACT 1: Hero (replaces QualifySection) ─────────────────────────────────
import HeroSection from "@/features/fulfill/ui/hero-section";
// ── ACT 2: Pain Bento Grid (replaces RecogniseSection) ────────────────────
import PainBentoGrid from "@/features/fulfill/ui/pain-bento-grid";
// ── ACT 3: Process Timeline (unchanged) ───────────────────────────────────
import ProcessSection from "@/features/fulfill/ui/process-section";
import HubGuideSection from "@/features/fulfill/ui/hub-guide-section";
// ── ACT 4: Operational Plan + Catalogue ───────────────────────────────────
import CommitmentSection from "@/features/fulfill/ui/commitment-section";
import ConsultCTASection from "@/features/fulfill/ui/consult-cta-section";
import ScopeSection from "@/features/fulfill/ui/scope-section";
import FulfillmentVisualShowcase from "@/features/fulfill/ui/fulfillment-visual-showcase";
// ── Supporting sections ───────────────────────────────────────────────────
import LibrarySection from "@/features/fulfill/ui/library-section";
import EcosystemSection from "@/features/fulfill/ui/ecosystem-section";
import IndexSection from "@/features/fulfill/ui/index-section";
import { ConsultOverlay } from "@/features/fulfill/ui/consult-overlay.client";

import { FulfillServiceJsonLd, FulfillFaqJsonLd } from "@/features/fulfill/ui/fulfill-jsonld";

export const revalidate = 300;

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono-face",
  display: "swap",
});

type PageProps = Readonly<{ params: Promise<{ lang: string }> }>;

const FULFILL_SEO: Readonly<Record<Locale, { title: string; description: string }>> = {
  en: {
    title: "THG Fulfill — POD fulfillment with item-level QC | VN·CN·US",
    description: "Operational POD fulfillment for eCommerce sellers: printing in Vietnam, China and the US, item-level quality control, and US-standard packing with tracking.",
  },
  vi: {
    title: "THG Fulfill — Fulfillment POD với QC từng đơn | VN·CN·US",
    description: "Fulfillment POD vận hành cho seller TMĐT: in tại Việt Nam, Trung Quốc và Mỹ, QC từng đơn, đóng gói chuẩn Mỹ kèm tracking.",
  },
  zh: {
    title: "THG Fulfill — 逐单质检的POD履约 | 越南·中国·美国",
    description: "面向电商卖家的运营级POD履约：在越南、中国和美国印刷，逐单质检，美国标准包装并附追踪。",
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) return {};
  return buildPageMetadata({
    lang,
    routeId: "/thg-fulfill",
    title: FULFILL_SEO[lang].title,
    description: FULFILL_SEO[lang].description,
    image: `${resolveSiteOrigin()}/assets/THG.jpg`,
    indexable: true,
  });
}

export default async function FulfillPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) notFound();

  const [marketingCopy, content, faqs, serviceBlocks] = await Promise.all([
    getMarketingCopy(lang),
    loadFulfillContent(lang),
    loadFulfillFaqs(lang),
    loadFulfillServiceBlocks(lang),
  ]);

  // Sequenced after `content` on purpose: which products are featured can come from the CMS
  // service catalog, so the ids are only known once that read resolves.
  const featuredProducts = await loadFulfillFeaturedProducts(content);

  const copy = applyServiceBlocks(getFulfillContent(lang), serviceBlocks);
  const catalogCopy = getCatalogCopy(lang);
  const parity = getFulfillParityContent(lang);
  const movement = getMovementCopy(lang);

  const displayedFaqs = faqs.length > 0 ? faqs : parity.faqFallback;
  const canonical = localeUrl(lang, "/thg-fulfill");

  return (
    <div className={monoFont.variable}>
      <FulfillServiceJsonLd name={FULFILL_SEO[lang].title} description={FULFILL_SEO[lang].description} url={canonical} />
      <FulfillFaqJsonLd faqs={displayedFaqs} />

      <main className="w-full flex flex-col bg-background relative selection:bg-primary/20">

        {/* ACT 1 — Hero: Headline + Flow Diagram + Scope Bar */}
        <HeroSection copy={copy} parity={parity} content={content} />

        {/* ACT 2 — Pain Recognition: Editorial bento mosaic */}
        <PainBentoGrid copy={copy} />

        {/* ACT 3 — Process: 5-stage interactive timeline */}
        <ProcessSection copy={copy} lang={lang} />

        {/* Hub System Guide */}
        <HubGuideSection parity={parity} />

        {/* Fulfillment Terms & Commitment */}
        <CommitmentSection lang={lang} parity={parity} />

        {/* ACT 4 — High-Impact CTA + Catalogue */}
        <ConsultCTASection copy={copy} />
        <ScopeSection
          content={content}
          copy={copy}
          catalogCopy={catalogCopy}
          products={featuredProducts}
          lang={lang}
        />
        <FulfillmentVisualShowcase copy={copy} />

        {/* Supporting: Library, Ecosystem, Index */}
        <LibrarySection lang={lang} movement={movement} />
        <EcosystemSection lang={lang} marketingCopy={marketingCopy} copy={copy} parity={parity} movement={movement} />
        <IndexSection lang={lang} copy={copy} movement={movement} faqs={displayedFaqs} />

        {/* Global Overlay Controller */}
        <ConsultOverlay lang={lang} copy={marketingCopy} consultLabel={marketingCopy.contact} triggerLabel="" triggerContext="" />
      </main>
    </div>
  );
}
