import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isSupportedLocale, type Locale } from "@/shared/i18n";
import { getMarketingCopy } from "@/shared/i18n/server/get-marketing-copy";
import { buildPageMetadata, resolveSiteOrigin } from "@/shared/seo";
import {
  loadHomepageContent,
  loadHomeServices,
  loadHomeFaqs,
  loadIntegrations,
  loadMarqueeImages,
  loadSiteSettings,
} from "@/features/home";
import HeroSection from "@/features/home/ui/hero-section";
import ServicesSection from "@/features/home/ui/services-section";
import AboutVideoSection from "@/features/home/ui/about-video-section";
import SellerTypesSection from "@/features/home/ui/seller-types-section";
import ProcessSection from "@/features/home/ui/process-section";
import AdvantagesSection from "@/features/home/ui/advantages-section";
import EcosystemJourneySection from "@/features/home/ui/ecosystem-journey-section";
import IntegrationsSection from "@/features/home/ui/integrations-section";
import LogisticsAnimationSection from "@/features/home/ui/logistics-animation-section";
import TestimonialsSection from "@/features/home/ui/testimonials-section";
import TrustBadgesSection from "@/features/home/ui/trust-badges-section";
import FAQSection from "@/features/home/ui/faq-section";
import ImageMarquee from "@/features/home/ui/image-marquee";
import { HomeOrganizationJsonLd, HomeFaqJsonLd } from "@/features/home/ui/home-jsonld";
import ScrollReveal from "@/shared/ui/scroll-reveal";
import { tFrom } from "@/shared/i18n/marketing";

// The real THG homepage (WEB-001) — section order is exact parity with src/pages/Index.tsx.
// This route file only orchestrates: FND-005 loaders → landing models → Server Components;
// metadata and JSON-LD derive from the same models. Rendering: SSG + ISR (WEB-001 §6,
// 06-migration/07-rendering-cache-matrix.csv row 1).
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

  const [copy, content, services, faqs, integrations, marqueeImages, settings, enContent] =
    await Promise.all([
      getMarketingCopy(lang),
      loadHomepageContent(lang),
      loadHomeServices(lang),
      loadHomeFaqs(lang),
      loadIntegrations(),
      loadMarqueeImages(),
      loadSiteSettings(),
      // The about video always uses the EN block's URL so all locales show the same video
      // (parity: AboutVideoSection.tsx:38-39); site settings stay the global default.
      loadHomepageContent("en"),
    ]);
  const t = tFrom(copy);
  const aboutVideoUrl = enContent.aboutVideo.videoUrl || settings.aboutVideoUrl || "";
  const sliderImages = marqueeImages.map((img) => img.src);

  return (
    <div className="min-h-screen bg-background">
      <HomeOrganizationJsonLd />
      <HomeFaqJsonLd faqs={faqs} />
      <HeroSection lang={lang} copy={copy} hero={content.hero} />
      <ServicesSection copy={copy} services={services} />
      <AboutVideoSection copy={copy} about={content.aboutVideo} videoUrl={aboutVideoUrl} />
      <SellerTypesSection copy={copy} />
      <ProcessSection copy={copy} process={content.process} />
      <AdvantagesSection copy={copy} />
      <EcosystemJourneySection copy={copy} lang={lang} />
      <IntegrationsSection copy={copy} integrations={integrations} />
      <LogisticsAnimationSection />
      <TestimonialsSection copy={copy} />
      <TrustBadgesSection copy={copy} />
      <FAQSection copy={copy} lang={lang} />

      {/* ════════════════════ IMAGE MARQUEE ════════════════════ (parity: Index.tsx) */}
      <section className="py-14 bg-background relative overflow-hidden">
        <div className="section-divider absolute top-0 left-0 right-0" />
        <ScrollReveal>
          <div className="container mx-auto px-4 text-center mb-8">
            <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em]">
              {t("express_page.marquee_label")}
            </p>
          </div>
        </ScrollReveal>
        <ImageMarquee images={sliderImages} speed={40} height="200px" />
      </section>
    </div>
  );
}
