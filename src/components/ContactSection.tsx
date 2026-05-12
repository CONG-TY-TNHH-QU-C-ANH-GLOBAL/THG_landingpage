import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Phone, Mail, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useCmsContactLocations } from "@/hooks/useCmsContent";
import { LeadFormDialog } from "@/components/lead/LeadFormDialog";
import ScrollReveal from "@/components/ScrollReveal";
import thgLogo from "@/assets/thg-logo.png";

const ContactSection = () => {
  const { t } = useI18n();

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
              <ContactList />
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={200}>
            <div className="bg-background rounded-3xl p-10 text-center tilt-card" style={{ boxShadow: "var(--shadow-3d)" }}>
              <ContactCtaCard />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

interface ContactLocation {
  id: number;
  position: number;
  kind: "office" | "warehouse" | "phone" | "email" | "website";
  label: string;
  address: string | null;
  phone: string | null;
  url: string | null;
  lang_class: string | null;
}

function ContactList() {
  const { language } = useI18n();
  const { data } = useCmsContactLocations(language);
  const locations: ContactLocation[] = data?.locations ?? [];

  return (
    <div className="space-y-6">
      {[...locations]
        .sort((a, b) => a.position - b.position)
        .map((item) => {
          const Icon =
            item.kind === "phone" ? Phone : item.kind === "email" ? Mail : item.kind === "website" ? Globe : MapPin;
          const display =
            item.address ?? item.phone ?? item.url?.replace(/^mailto:/, "").replace(/^https?:\/\//, "") ?? "";
          const externalHref =
            item.url && (item.url.startsWith("http") || item.url.startsWith("mailto:")) ? item.url : undefined;
          return (
            <div key={item.id} className="flex gap-4 group">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-1">{item.label}</p>
                {externalHref ? (
                  <a
                    href={externalHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground text-sm hover:text-accent transition-colors"
                  >
                    {display}
                  </a>
                ) : (
                  <p
                    className="text-muted-foreground text-sm"
                    style={
                      item.lang_class === "font-cn"
                        ? { fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif" }
                        : undefined
                    }
                  >
                    {display}
                  </p>
                )}
                {item.phone && item.address && (
                  <p className="text-muted-foreground text-xs mt-0.5">{item.phone}</p>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}

function ContactCtaCard() {
  const { t } = useI18n();
  return (
    <>
      <div className="w-16 h-16 rounded-full bg-navy mx-auto mb-6 flex items-center justify-center p-3 glow-pulse">
        <img src={thgLogo} alt="THG" className="w-full h-full object-contain brightness-0 invert" />
      </div>
      <h3 className="text-2xl font-bold text-navy mb-3">{t("contact.cta_title")}</h3>
      <p className="text-muted-foreground mb-8 leading-relaxed">{t("contact.cta_desc")}</p>
      <LeadFormDialog
        sourcePage="contact-section"
        trigger={
          <Button
            className="w-full bg-primary hover:bg-gold-dark text-primary-foreground rounded-full py-6 text-base gap-2 hover:-translate-y-1 transition-all duration-300"
            style={{ boxShadow: "0 8px 25px hsl(36 45% 42% / 0.3)" }}
          >
            {t("contact.submit")} <ArrowRight className="w-4 h-4" />
          </Button>
        }
      />
      {/* Trust microcopy — same line we render under the hero CTA. */}
      <p className="mt-3 text-[11px] text-muted-foreground/80">{t("trust.cta_micro")}</p>
      {/* Backup channel — Facebook page (audit P0.6: keep as secondary, not primary CTA) */}
      <p className="mt-2 text-[10px] text-muted-foreground">
        Hoặc{" "}
        <a href="https://www.facebook.com/THGFulfill" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
          chat trực tiếp Facebook page
        </a>
      </p>
      <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
        <span>Shopify</span>
        <span>Etsy</span>
        <span>TikTok</span>
        <span>Amazon</span>
      </div>
      <div className="flex items-center justify-center gap-4 mt-5">
        <a
          href="https://www.facebook.com/THGFulfill"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="w-9 h-9 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </a>
        <a
          href="https://www.youtube.com/@thgfulfillment"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
          className="w-9 h-9 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all duration-300"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
            <polygon fill="white" points="9.545 15.568 15.818 12 9.545 8.432" />
          </svg>
        </a>
      </div>
    </>
  );
}

export default ContactSection;
