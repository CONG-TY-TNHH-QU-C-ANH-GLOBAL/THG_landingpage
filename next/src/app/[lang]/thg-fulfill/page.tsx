import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JetBrains_Mono } from "next/font/google";

import { isSupportedLocale, type Locale } from "@/shared/i18n";
import { getMarketingCopy } from "@/shared/i18n/server/get-marketing-copy";
import { buildPageMetadata, resolveSiteOrigin, localeUrl } from "@/shared/seo";
import {
  loadFulfillContent,
  loadFulfillFaqs,
  loadFulfillServiceBlocks,
  getFulfillContent,
  applyServiceBlocks,
} from "@/features/fulfill";
import HeroSection from "@/features/fulfill/ui/hero-section";
import JourneySection from "@/features/fulfill/ui/journey-section";
import CapabilitiesSection from "@/features/fulfill/ui/capabilities-section";
import CatalogSection from "@/features/fulfill/ui/catalog-section";
import ConsultationSection from "@/features/fulfill/ui/consultation-section";
import FaqSection from "@/features/fulfill/ui/faq-section";
import { FulfillServiceJsonLd, FulfillFaqJsonLd } from "@/features/fulfill/ui/fulfill-jsonld";
import styles from "@/features/fulfill/ui/fulfill.module.css";

// WEB-002 — the approved THG Fulfill redesign as a production vertical slice. Server Component:
// CMS reads (service + fulfill FAQs) → landing models → composed sections; the only client
// islands are the JourneyStepper (interaction) and the ConsultCta (reuses the secured /leads
// dialog). Rendering stays static-first (SSG + ISR) like the homepage.
export const revalidate = 300;

// Scoped mono face for the operational typography posture — the shared type system (Be Vietnam
// Pro / Inter) has no monospace. Self-hosted via next/font (no CDN); its CSS variable is read by
// the feature's scoped CSS (var(--font-mono-face)) and never leaks to other routes.
const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono-face",
  display: "swap",
});

type PageProps = Readonly<{ params: Promise<{ lang: string }> }>;

const FULFILL_SEO: Readonly<Record<Locale, { title: string; description: string }>> = {
  en: {
    title: "THG Fulfill — POD fulfillment with item-level QC | VN·CN·US",
    description:
      "Operational POD fulfillment for eCommerce sellers: printing in Vietnam, China and the US, item-level quality control, and US-standard packing with tracking.",
  },
  vi: {
    title: "THG Fulfill — Fulfillment POD với QC từng đơn | VN·CN·US",
    description:
      "Fulfillment POD vận hành cho seller TMĐT: in tại Việt Nam, Trung Quốc và Mỹ, QC từng đơn, đóng gói chuẩn Mỹ kèm tracking.",
  },
  zh: {
    title: "THG Fulfill — 逐单质检的POD履约 | 越南·中国·美国",
    description:
      "面向电商卖家的运营级POD履约：在越南、中国和美国印刷，逐单质检，美国标准包装并附追踪。",
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
  // Feature-local copy is the fallback; published CMS service-blocks overlay journey/capability/
  // consult/hub text by stable role key. Empty blocks ⇒ value-identical copy (no visual change).
  const copy = applyServiceBlocks(getFulfillContent(lang), serviceBlocks);
  const canonical = localeUrl(lang, "/thg-fulfill");

  return (
    <div className={`${styles.root} ${monoFont.variable}`}>
      <div className={styles.noise} aria-hidden="true" />
      <FulfillServiceJsonLd
        name={FULFILL_SEO[lang].title}
        description={FULFILL_SEO[lang].description}
        url={canonical}
      />
      <FulfillFaqJsonLd faqs={faqs} />

      <main>
        <HeroSection lang={lang} marketingCopy={marketingCopy} copy={copy} content={content} />
        <JourneySection copy={copy} />
        <CapabilitiesSection copy={copy} />
        <CatalogSection content={content} copy={copy} />
        <ConsultationSection lang={lang} marketingCopy={marketingCopy} copy={copy} content={content} />
        <FaqSection lang={lang} copy={copy} faqs={faqs} />
      </main>
    </div>
  );
}
