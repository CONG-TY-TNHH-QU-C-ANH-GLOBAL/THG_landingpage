import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Phone, Mail, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import ScrollReveal from "@/components/ScrollReveal";
import thgLogo from "@/assets/thg-logo.png";

const ContactSection = () => {
  const { t, tVi } = useI18n();

  return (
    <section id="contact" className="py-28 relative overflow-hidden bg-secondary/30">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-accent/5 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">{t("contact.subtitle")}</p>
            <h2 className="text-4xl md:text-5xl font-bold text-navy tracking-tight leading-tight">
              {t("contact.title")}{" "}
              <span className="text-gradient-gold">{t("contact.title_highlight")}</span>{" "}
              {t("contact.title2")}
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <ScrollReveal direction="left">
            <div>
              <h3 className="text-2xl font-bold text-navy mb-8">{t("contact.offices_title")}</h3>
              <div className="space-y-6">
                {[
                  { icon: MapPin, label: t("contact.vn_office"), value: "121/5 Đ. Kênh 19/5, Sơn Kỳ, Tân Phú, TP.HCM" },
                  { icon: MapPin, label: t("contact.us_pa_warehouse"), value: "108 Almond CT, Milford, PA 18337", sub: "+1 (570) 618-1169" },
                  { icon: MapPin, label: t("contact.us_nc_warehouse"), value: "4136 Sunflower Circle, Winston-Salem, NC 27105" },
                  { icon: MapPin, label: t("contact.cn_warehouse"), value: "广东省东莞市常平镇霞坑新宅二区三街101", fontCN: true },
                  { icon: Phone, label: t("contact.hotline"), value: "0335.124.089" },
                  { icon: Mail, label: t("contact.email"), value: "info@thgfulfill.com" },
                  { icon: Globe, label: t("contact.website"), value: "thgofficial.thgfulfill.com", href: "https://thgofficial.thgfulfill.com" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                      <item.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-1">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm hover:text-accent transition-colors">{item.value}</a>
                      ) : (
                        <>
                          <p
                            className="text-muted-foreground text-sm"
                            style={item.fontCN ? { fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif" } : undefined}
                          >{item.value}</p>
                          {item.sub && <p className="text-muted-foreground text-xs mt-0.5">{item.sub}</p>}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={200}>
            <div className="bg-background rounded-3xl p-10 text-center tilt-card"
              style={{ boxShadow: "var(--shadow-3d)" }}
            >
              <div className="w-16 h-16 rounded-full bg-navy mx-auto mb-6 flex items-center justify-center p-3 glow-pulse">
                <img src={thgLogo} alt="THG" className="w-full h-full object-contain brightness-0 invert" />
              </div>
              <h3 className="text-2xl font-bold text-navy mb-3">{t("contact.cta_title")}</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                {t("contact.cta_desc")}
              </p>
              <Button
                className="w-full bg-primary hover:bg-gold-dark text-primary-foreground rounded-full py-6 text-base gap-2 hover:-translate-y-1 transition-all duration-300"
                style={{ boxShadow: "0 8px 25px hsl(36 45% 42% / 0.3)" }}
              >
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
