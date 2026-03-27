import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Phone, Mail, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import ScrollReveal from "@/components/ScrollReveal";
import thgLogo from "@/assets/thg-logo.png";

const ContactSection = () => {
  const { t } = useI18n();

  return (
    <section id="contact" className="py-28 relative overflow-hidden bg-secondary/30">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">{t("contact.subtitle")}</p>
            <h2 className="text-4xl md:text-5xl font-bold text-navy tracking-tight leading-tight font-serif italic">
              {t("contact.title")}{" "}
              <span className="text-gradient-gold not-italic">{t("contact.title_highlight")}</span>{" "}
              {t("contact.title2")}
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Office & Warehouse Info */}
          <ScrollReveal direction="left">
            <div>
              <h3 className="text-2xl font-bold text-navy mb-8 font-serif italic">{t("contact.offices_title")}</h3>
              <div className="space-y-6">
                {/* VN Office */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-1">{t("contact.vn_office")}</p>
                    <p className="text-muted-foreground text-sm">121/5 Đ. Kênh 19/5, Sơn Kỳ, Tân Phú, TP.HCM</p>
                  </div>
                </div>

                {/* US Warehouse */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-1">{t("contact.us_warehouse")}</p>
                    <p className="text-muted-foreground text-sm">108 Almond CT, Milford, PA 18337</p>
                  </div>
                </div>

                {/* CN Warehouse */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-1">{t("contact.cn_warehouse")}</p>
                    <p className="text-muted-foreground text-sm">广东省东莞市常平镇霞坑新宅二区三街101</p>
                    <p className="text-muted-foreground text-xs mt-0.5">阿文物流 431391</p>
                  </div>
                </div>

                {/* Hotline */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Phone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-1">HOTLINE</p>
                    <p className="text-muted-foreground text-sm">0335.124.089</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Mail className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-1">EMAIL</p>
                    <p className="text-muted-foreground text-sm">info@thgfulfill.com</p>
                  </div>
                </div>

                {/* Website */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Globe className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-1">WEBSITE</p>
                    <a href="https://www.thgfulfill.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm hover:text-accent transition-colors">www.thgfulfill.com</a>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right: CTA Card */}
          <ScrollReveal direction="right" delay={200}>
            <div className="bg-background rounded-3xl p-10 shadow-xl text-center">
              <div className="w-16 h-16 rounded-full bg-navy mx-auto mb-6 flex items-center justify-center p-3">
                <img src={thgLogo} alt="THG" className="w-full h-full object-contain brightness-0 invert" />
              </div>
              <h3 className="text-2xl font-bold text-navy mb-3">{t("contact.cta_title")}</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                {t("contact.cta_desc")}
              </p>
              <Button className="w-full bg-primary hover:bg-gold-dark text-primary-foreground rounded-full py-6 text-base gap-2 shadow-lg hover:shadow-xl transition-all duration-300">
                {t("contact.submit")} <ArrowRight className="w-4 h-4" />
              </Button>
              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
                <span>Shopify</span>
                <span>Etsy</span>
                <span>TikTok</span>
                <span>Amazon</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
