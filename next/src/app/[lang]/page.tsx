import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isSupportedLocale, type Locale } from "@/shared/i18n";
import { getMarketingCopy } from "@/shared/i18n/server/get-marketing-copy";
import { buildPageMetadata, resolveSiteOrigin } from "@/shared/seo";
import { loadHomepageContent, loadHomeFaqs } from "@/features/home";
import FAQSection from "@/features/home/ui/faq-section";
import { HomeOrganizationJsonLd, HomeFaqJsonLd } from "@/features/home/ui/home-jsonld";
import {
  CorridorRoot,
  CorridorProvider,
  ThresholdSection,
  CorridorTrack,
  MatrixSection,
  DiagnosticSection,
  RecommendationSection,
  WaybillSection,
  WaybillDossier,
} from "@/features/home/corridor";

// The THG homepage — "Khoảng giữa" (visual authority: src/reference/thg-world-camera-ro.html).
//
// Narrative, and it is one continuous argument rather than a stack of panels: threshold → the
// eleven-gate corridor, which asks three questions while the seller walks it → the matrix that
// shows them where they just landed → the two remaining questions → the recommendation the answers
// produce → the waybill, next to the exact payload Sales will receive. The FAQ stays as the tail:
// it carries the FAQPage JSON-LD and it is the `#faq` target the shared Navbar links to from every
// route, so removing it would break navigation that lives outside this page.
//
// Rendering: the page itself and the threshold stay Server Components; the corridor and the four
// answer-driven sections are client islands under one provider, because they share a single piece
// of state (see corridor/ui/corridor-provider.client.tsx). Data flow is unchanged — FND-005
// loaders → landing models → props. SSG + ISR as before.
export const revalidate = 300;

type PageProps = Readonly<{ params: Promise<{ lang: string }> }>;

// Per-locale SEO copy — values byte-identical to src/pages/Index.tsx:33-46.
const HOME_SEO: Readonly<Record<Locale, { title: string; description: string }>> = {
  en: {
    title: "THG Fulfill — Global fulfillment for eCommerce sellers",
    description:
      "Comprehensive fulfillment ecosystem connecting Vietnam – China – to US warehouses. POD printing, dropship support, US domestic fulfillment from $1.2.",
  },
  vi: {
    title: "THG Fulfill — Giải pháp fulfillment toàn cầu cho seller TMĐT",
    description:
      "Hệ sinh thái fulfillment kết nối Việt Nam – Trung Quốc – đến kho Mỹ. POD printing, hỗ trợ dropship, fulfill nội địa Mỹ từ $1.2.",
  },
  zh: {
    title: "THG Fulfill — 面向电商卖家的全球履约方案",
    description: "全面的履约生态系统，无缝连接越南-中国-美国仓库。POD印刷、代发支持、美国国内履约低至1.2美元。",
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) return {};
  return buildPageMetadata({
    lang,
    routeId: "/",
    title: HOME_SEO[lang].title,
    description: HOME_SEO[lang].description,
    image: `${resolveSiteOrigin()}/assets/THG.jpg`,
    indexable: true,
  });
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) notFound();

  const [copy, content, faqs] = await Promise.all([
    getMarketingCopy(lang),
    loadHomepageContent(lang),
    loadHomeFaqs(lang),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <HomeOrganizationJsonLd />
      <HomeFaqJsonLd faqs={faqs} />
      <CorridorRoot>
        <CorridorProvider lang={lang}>
          {/* Server-rendered; the CMS hero badge becomes the eyebrow, the H1 stays art-directed. */}
          <ThresholdSection lang={lang} eyebrow={content.hero.badge} />
          <CorridorTrack />
          <MatrixSection />
          <DiagnosticSection />
          <RecommendationSection />
          <WaybillSection copy={copy} />
          <WaybillDossier />
        </CorridorProvider>
      </CorridorRoot>
      <FAQSection copy={copy} lang={lang} />
    </div>
  );
}
