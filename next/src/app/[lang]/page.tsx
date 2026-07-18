import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isSupportedLocale, type Locale } from "@/shared/i18n";
import { getMarketingCopy } from "@/shared/i18n/server/get-marketing-copy";
import { buildPageMetadata, resolveSiteOrigin } from "@/shared/seo";
import { loadHomepageContent, loadHomeServices, loadHomeFaqs } from "@/features/home";
import HeroSection from "@/features/home/ui/hero-section";
import ProofStripSection from "@/features/home/ui/proof-strip-section";
import PillarAtlasSection from "@/features/home/ui/pillar-atlas-section";
import EcosystemAtlasSection from "@/features/home/ui/ecosystem-atlas-section";
import CoverageSection from "@/features/home/ui/coverage-section";
import WhoWeServeSection from "@/features/home/ui/who-we-serve-section";
import WhyThgSection from "@/features/home/ui/why-thg-section";
import ConversionSection from "@/features/home/ui/conversion-section";
import FAQSection from "@/features/home/ui/faq-section";
import { HomeOrganizationJsonLd, HomeFaqJsonLd } from "@/features/home/ui/home-jsonld";

// The real THG homepage — WEB-001B completes the approved Open Design baseline
// (visual authority: homepage-concept-global-fulfillment-orbit.html; rules:
// IMPLEMENTATION_BASELINE.md). Narrative: hero → proof handoff → four-pillar
// atlas → connected ecosystem → coverage → who we serve → why THG → private
// consultation + Community Knowledge Loop → FAQ → shared footer (layout).
// Sections not present in the approved artifact (about-video, integrations,
// testimonials, trust-badge placeholders, image marquee, logistics counters)
// are intentionally omitted — see the WEB-001B execution record in
// THG_public_platform_specs for the per-section disposition.
// Rendering stays SSG + ISR: FND-005 loaders → landing models → Server Components.
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

  const [copy, content, services, faqs] = await Promise.all([
    getMarketingCopy(lang),
    loadHomepageContent(lang),
    loadHomeServices(lang),
    loadHomeFaqs(lang),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <HomeOrganizationJsonLd />
      <HomeFaqJsonLd faqs={faqs} />
      <HeroSection lang={lang} copy={copy} hero={content.hero} />
      <ProofStripSection copy={copy} />
      <PillarAtlasSection lang={lang} copy={copy} services={services} />
      <EcosystemAtlasSection copy={copy} />
      <CoverageSection copy={copy} />
      <WhoWeServeSection copy={copy} />
      <WhyThgSection copy={copy} />
      <ConversionSection lang={lang} copy={copy} />
      <FAQSection copy={copy} lang={lang} />
    </div>
  );
}
