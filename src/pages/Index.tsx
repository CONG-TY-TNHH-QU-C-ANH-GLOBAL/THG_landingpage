import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutVideoSection from "@/components/AboutVideoSection";
import SellerTypesSection from "@/components/SellerTypesSection";
import ProcessSection from "@/components/ProcessSection";
import AdvantagesSection from "@/components/AdvantagesSection";
import IntegrationsSection from "@/components/IntegrationsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import ImageMarquee from "@/components/ImageMarquee";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";
import Footer from "@/components/Footer";

const sliderImages = [
  "https://w.ladicdn.com/s1500x1100/67e69e24e8a7ba001127c80a/kho-my-10-1-20250729095528-mkcfd.jpg",
  "https://w.ladicdn.com/s1500x1100/67e69e24e8a7ba001127c80a/kho-my-11-1-20250729095528-nzruq.jpg",
  "https://w.ladicdn.com/s1500x1100/67e69e24e8a7ba001127c80a/kho-my-14-1-20250729095528-dcsxm.jpg",
  "https://w.ladicdn.com/s1500x1100/67e69e24e8a7ba001127c80a/1-20250724024641-4oczs.png",
  "https://w.ladicdn.com/s1500x1100/67e69e24e8a7ba001127c80a/kho-my-13-20250724024632-bt6u-.jpg",
  "https://w.ladicdn.com/s1500x1100/67e69e24e8a7ba001127c80a/img_9873-20250801074610-q-tfu.jpg",
  "https://w.ladicdn.com/s1500x1100/67e69e24e8a7ba001127c80a/img_9988-20250801074609-jjvij.jpg",
  "https://w.ladicdn.com/s1500x1100/67e69e24e8a7ba001127c80a/retouch_2025072518361201-20250801074608-tsi9a.jpg",
  "https://w.ladicdn.com/s1500x1100/67e69e24e8a7ba001127c80a/img_7181-20250801190217-bvrod.jpg",
];

const Index = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <AboutVideoSection />
      <SellerTypesSection />
      <ProcessSection />
      <AdvantagesSection />
      <IntegrationsSection />
      <TestimonialsSection />
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
      <Footer />
    </div>
  );
};

export default Index;
