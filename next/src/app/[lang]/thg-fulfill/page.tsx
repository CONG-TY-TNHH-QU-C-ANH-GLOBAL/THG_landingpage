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
  getFulfillContent,
  applyServiceBlocks,
} from "@/features/fulfill";
import { getFulfillParityContent } from "@/features/fulfill/parity-content";
import { getMovementCopy } from "@/features/fulfill/ui/movement-copy";
import QualifySection from "@/features/fulfill/ui/qualify-section";
import RecogniseSection from "@/features/fulfill/ui/recognise-section";
import PlanSection from "@/features/fulfill/ui/plan-section";
import ProcessSection from "@/features/fulfill/ui/process-section";
import ScopeSection from "@/features/fulfill/ui/scope-section";
import ProofSection from "@/features/fulfill/ui/proof-section";
import LibrarySection from "@/features/fulfill/ui/library-section";
import CommitmentSection from "@/features/fulfill/ui/commitment-section";
import OperateSection from "@/features/fulfill/ui/operate-section";
import EcosystemSection from "@/features/fulfill/ui/ecosystem-section";
import IndexSection from "@/features/fulfill/ui/index-section";
import ActSection from "@/features/fulfill/ui/act-section";
import { FulfillServiceJsonLd, FulfillFaqJsonLd } from "@/features/fulfill/ui/fulfill-jsonld";
import styles from "@/features/fulfill/ui/fulfill.module.css";

// THG Fulfill — the public decision surface for the service.
//
// Static-first: prerendered for all three locales and revalidated on a content clock, because
// nothing here is per-request. Two kinds of client island exist on the whole route (the plan
// narrowing control and the lead surfaces); everything else — every plan, every obligation, every
// commitment, every answer — is in the server's HTML, which is what lets a crawler, a JS-disabled
// visitor and a screen reader each receive a complete document rather than a shell.
export const revalidate = 300;

// The operational typography posture. IBM Plex Mono is the brand's registered mono face and carries
// identifiers, labels and figures; the shared type system has no monospace. Self-hosted through
// next/font — no third-party origin — and its variable is scoped to this route's wrapper.
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

  // Feature-local copy is the fallback; published CMS service-blocks overlay journey, capability,
  // consultation and Hub text by stable role key. Empty blocks ⇒ value-identical copy.
  const copy = applyServiceBlocks(getFulfillContent(lang), serviceBlocks);
  const parity = getFulfillParityContent(lang);
  const movement = getMovementCopy(lang);

  // ONE source of truth for the seven answers. The CMS stays the authority; while its fulfill set is
  // still being seeded, an empty read falls back to the localized questions. Deriving it here — not
  // inside a section — is what guarantees that the answers shown at their points of doubt, the
  // canonical index, and the FAQPage structured data can never describe different content.
  const displayedFaqs = faqs.length > 0 ? faqs : parity.faqFallback;
  const canonical = localeUrl(lang, "/thg-fulfill");

  return (
    <div className={`${styles.root} ${monoFont.variable}`}>
      <FulfillServiceJsonLd
        name={FULFILL_SEO[lang].title}
        description={FULFILL_SEO[lang].description}
        url={canonical}
      />
      <FulfillFaqJsonLd faqs={displayedFaqs} />

      {/* ELEVEN MOVEMENTS. The order is load-bearing and is not a layout preference.
       *
       *   01 QUALIFY     is this for my operation?      scope, and the first clean exit
       *   02 RECOGNISE   is my problem their problem?   the four constraints, in severity order
       *   03 PLAN        what do you propose for me?    two answers → one operational plan
       *   04 PROCESS     what happens to my unit?       the mechanism, and who owns each failure
       *   05 SCOPE       can you make what I sell?      the catalogue AND its boundary
       *   06 PROOF       does this operation exist?     the floor, then the films
       *   07 COMMITMENT  what if it goes wrong?         liability, compensation, payment
       *   08 OPERATE     can my team run this daily?    order placement, then the Hub
       *   09 ECOSYSTEM   where does Fulfill sit?        navigation, safely after the decision
       *   10 INDEX       the one thing I want to check  canonical answers + structured data
       *   11 ACT         how do I start?                the second and last conversion moment
       *
       * Three of these placements are the ones a redesign keeps wanting to undo, so they are stated:
       * recognition precedes the plan, or the plan is a pitch rather than a diagnosis. The mechanism
       * precedes the proof, or the photograph has nothing to prove. Ecosystem links follow the
       * decision, or they become an invitation to shop the menu instead of reading the plan.
       */}
      <main>
        <QualifySection copy={copy} content={content} movement={movement} faqs={displayedFaqs} />

        <RecogniseSection copy={copy} />

        <PlanSection
          lang={lang}
          marketingCopy={marketingCopy}
          copy={copy}
          parity={parity}
          content={content}
          movement={movement}
        />

        <ProcessSection copy={copy} parity={parity} movement={movement} />

        <ScopeSection
          content={content}
          copy={copy}
          parity={parity}
          movement={movement}
          faqs={displayedFaqs}
        />

        <ProofSection copy={copy} parity={parity} movement={movement} />
        <LibrarySection lang={lang} movement={movement} />

        <CommitmentSection lang={lang} parity={parity} movement={movement} faqs={displayedFaqs} />

        <OperateSection parity={parity} movement={movement} faqs={displayedFaqs} />

        <EcosystemSection
          lang={lang}
          marketingCopy={marketingCopy}
          copy={copy}
          parity={parity}
          movement={movement}
        />

        <IndexSection lang={lang} copy={copy} movement={movement} faqs={displayedFaqs} />

        <ActSection
          lang={lang}
          marketingCopy={marketingCopy}
          copy={copy}
          parity={parity}
          content={content}
          movement={movement}
        />
      </main>
    </div>
  );
}
