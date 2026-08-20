import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutVideoSection from "@/components/AboutVideoSection";
import SellerTypesSection from "@/components/SellerTypesSection";
import ProcessSection from "@/components/ProcessSection";
import AdvantagesSection from "@/components/AdvantagesSection";
import EcosystemJourneySection from "@/components/EcosystemJourneySection";
import IntegrationsSection from "@/components/IntegrationsSection";
import PartnersSection from "@/components/PartnersSection";
import LogisticsAnimationSection from "@/components/LogisticsAnimationSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import TrustBadgesSection from "@/components/TrustBadgesSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import ImageMarquee from "@/components/ImageMarquee";
import ScrollReveal from "@/components/ScrollReveal";
import thgHeroImage from "@/assets/THG.jpg";
import { useI18n } from "@/lib/i18n";
import { useCmsMarqueeImages, useCmsFaqs } from "@/hooks/useCmsContent";
import { SeoHead } from "@/components/seo/SeoHead";
import { JsonLdOrganization, JsonLdFaqPage } from "@/components/seo/JsonLd";


const Index = () => {
  const { t, language } = useI18n();
  const { data: marqueeData } = useCmsMarqueeImages();
  const { data: faqsData } = useCmsFaqs(language, "home");
  const sliderImages = marqueeData?.images
    ? [...marqueeData.images].sort((a, b) => a.position - b.position).map((img) => img.src)
    : [];

  // Per-locale SEO copy (audit P0.3, P0.4, P1.1)
  const seo = {
    en: {
      title: "THG Fulfill — Global fulfillment for eCommerce sellers",
      description: "Comprehensive fulfillment ecosystem connecting Vietnam – China – to US warehouses. POD printing, dropship support, US domestic fulfillment from $1.2.",
    },
    vi: {
      title: "THG Fulfill — Giải pháp fulfillment toàn cầu cho seller TMĐT",
      description: "Hệ sinh thái fulfillment kết nối Việt Nam – Trung Quốc – đến kho Mỹ. POD printing, hỗ trợ dropship, fulfill nội địa Mỹ từ $1.2.",
    },
    zh: {
      title: "THG Fulfill — 面向电商卖家的全球履约方案",
      description: "全面的履约生态系统，无缝连接越南-中国-美国仓库。POD印刷、代发支持、美国国内履约低至1.2美元。",
    },
  }[language];

  return (
    <div className="min-h-screen bg-background">
      <SeoHead title={seo.title} description={seo.description} path="/" ogImage={thgHeroImage} />
      <JsonLdOrganization />
      {faqsData?.faqs && faqsData.faqs.length > 0 && <JsonLdFaqPage faqs={faqsData.faqs} />}
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <AboutVideoSection />
      <SellerTypesSection />
      <ProcessSection />
      <AdvantagesSection />
      <EcosystemJourneySection />
      <PartnersSection />
      <IntegrationsSection />
      <LogisticsAnimationSection />
      <TestimonialsSection />
      <TrustBadgesSection />
      <FAQSection />

      {/* ════════════════════ IMAGE MARQUEE ════════════════════ */}
      <section className="py-14 bg-background relative overflow-hidden">
        <div className="section-divider absolute top-0 left-0 right-0" />
        <ScrollReveal>
          <div className="container mx-auto px-4 text-center mb-8">
            <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em]">{t("express_page.marquee_label")}</p>
          </div>
        </ScrollReveal>
        <ImageMarquee images={sliderImages} speed={40} height="200px" />
      </section>

      <ContactSection />

    </div>
  );
};

export default Index;
