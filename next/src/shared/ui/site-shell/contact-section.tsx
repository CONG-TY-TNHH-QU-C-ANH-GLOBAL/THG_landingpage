// Parity source: src/components/ContactSection.tsx (the de-facto site footer). Server
// Component — the only interactivity is the LeadFormDialog client island it renders.
// The shell declares its own row shape (structurally identical to the FND-005
// ContactLocation model): shared/ must not import features/, and the models graduate to
// shared/cms/models in a dedicated PR per the FND-005 graduation rule.
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import ScrollReveal from "@/shared/ui/scroll-reveal";
import { SectionHeader } from "@/shared/ui/section-header";
import { ContactCtaTrigger } from "@/shared/ui/site-shell/contact-cta-trigger";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";
import type { Locale } from "@/shared/i18n";

export interface ContactRow {
  id: number;
  kind: "office" | "warehouse" | "phone" | "email" | "website";
  label: string;
  address: string | null;
  phone: string | null;
  url: string | null;
  langClass: string | null;
}

const ContactSection = ({
  lang,
  copy,
  locations,
}: Readonly<{ lang: Locale; copy: MarketingCopy; locations: readonly ContactRow[] }>) => {
  const t = tFrom(copy);

  return (
    <section id="contact" className="py-28 relative overflow-hidden bg-secondary/30">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-accent/5 blur-3xl" />

      {/* measured parity with the artifact's .wrap (1280px + 32px inline padding
          at 1440); mobile keeps 16px for 320px readability — recorded deviation */}
      <div className="container mx-auto max-w-[1280px] px-4 md:px-8 relative z-10">
        <ScrollReveal>
          <SectionHeader
            size="lg"
            eyebrow={t("contact.subtitle")}
            title={t("contact.title")}
            titleHighlight={t("contact.title_highlight")}
            titleSuffix={t("contact.title2")}
          />
        </ScrollReveal>

        {/* WEB-001B: when the CMS has no location records the offices column
            collapses entirely — never a heading over an empty area — and the
            endcap card takes a balanced centered one-column composition. */}
        {locations.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <ScrollReveal direction="left">
              <div>
                <h3 className="text-[length:var(--step-h3)] font-bold text-navy mb-8">{t("contact.offices_title")}</h3>
                <ContactList locations={locations} />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={200}>
              <div className="bg-card border border-border rounded-2xl p-8 md:p-10 text-center shadow-[var(--shadow-card)]">
                <ContactCtaCard lang={lang} copy={copy} />
              </div>
            </ScrollReveal>
          </div>
        ) : (
          <ScrollReveal>
            <div className="max-w-xl mx-auto bg-card border border-border rounded-2xl p-8 md:p-10 text-center shadow-[var(--shadow-card)]">
              <ContactCtaCard lang={lang} copy={copy} />
            </div>
          </ScrollReveal>
        )}

        {/* Footer bar — existing brand info and links only, no invented legal copy. */}
        <div className="mt-20 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} THG Fulfill · Transport Happiness Group</p>
          <a
            href="https://hub.thgfulfill.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Hub System
          </a>
        </div>
      </div>
    </section>
  );
};

const KIND_ICONS = {
  phone: Phone,
  email: Mail,
  website: Globe,
  office: MapPin,
  warehouse: MapPin,
} as const;

function ContactList({ locations }: Readonly<{ locations: readonly ContactRow[] }>) {
  // Rows arrive already position-sorted from the FND-005 loader.
  return (
    <div className="space-y-6">
      {locations.map((item) => {
        const Icon = KIND_ICONS[item.kind];
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
                    item.langClass === "font-cn"
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

function ContactCtaCard({ lang, copy }: Readonly<{ lang: Locale; copy: MarketingCopy }>) {
  const t = tFrom(copy);
  return (
    <>
      {/* WEB-001B endcap alignment: no continuous glow-pulse (anti-pattern:
          looping decorative motion), token radii/shadows, step-scale heading.
          Offer/response copy is verified production dictionary content
          (parity: src/lib/i18n/translations/contact.ts:18-19, live today). */}
      <div className="w-14 h-14 rounded-full bg-navy mx-auto mb-5 flex items-center justify-center p-3">
        <img src="/assets/thg-logo.png" alt="THG" className="w-full h-full object-contain brightness-0 invert" />
      </div>
      <h3 className="text-[length:var(--step-h3)] font-bold text-navy mb-2.5">{t("contact.cta_title")}</h3>
      <p className="text-muted-foreground text-sm mb-7 leading-relaxed max-w-[44ch] mx-auto">{t("contact.cta_desc")}</p>

      <div className="flex flex-col gap-3 w-full">
        {/* Submit Inquiry */}
        <ContactCtaTrigger lang={lang} copy={copy} />

        <div className="relative flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">{t("contact.or_via")}</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Secondary channels beneath the primary consultation CTA: token radius
            (no pill shapes), uniform height/icon size, aligned baselines; hover
            never shifts layout; brand colors kept per channel. Real production
            URLs only — never a "#" placeholder. */}
        {SOCIAL_LINKS.map((s) => (
          <a
            key={s.href}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full min-h-[44px] px-4 py-2.5 rounded-lg border border-black/10 font-semibold text-sm text-white transition-[filter,box-shadow] duration-200 hover:brightness-110 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            style={{ background: s.background }}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {s.icon}
            </svg>
            <span className="leading-none">{t(s.labelKey)}</span>
          </a>
        ))}
      </div>
    </>
  );
}

// Brand icons stay inline SVG paths (no icon-library equivalents shipped for
// these marks). Labels resolve through i18n so EN/ZH visitors see their locale.
const SOCIAL_LINKS = [
  {
    labelKey: "contact.via_facebook",
    href: "https://www.facebook.com/THGFulfill",
    background: "#1877F2",
    icon: (
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    ),
  },
  {
    labelKey: "contact.via_youtube",
    href: "https://www.youtube.com/@thgfulfillment",
    background: "#FF0000",
    icon: (
      <>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
        <polygon fill="white" points="9.545 15.568 15.818 12 9.545 8.432" />
      </>
    ),
  },
  {
    labelKey: "contact.via_tiktok",
    href: "https://www.tiktok.com/@thgfulfillment",
    background: "#010101",
    icon: (
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z" />
    ),
  },
];

export { ContactSection };
