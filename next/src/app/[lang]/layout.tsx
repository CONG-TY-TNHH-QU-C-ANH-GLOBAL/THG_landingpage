import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import "../globals.css";
import { SUPPORTED_LOCALES, HTML_LANG, isSupportedLocale } from "@/shared/i18n";
import { getMarketingCopy } from "@/shared/i18n/server/get-marketing-copy";
import { loadContactLocations, loadSiteSettings } from "@/features/home";
import Navbar from "@/shared/ui/site-shell/navbar";
import { ContactSection } from "@/shared/ui/site-shell/contact-section";
import { FloatingContact } from "@/shared/ui/site-shell/floating-contact";
import { UtmCapture } from "@/shared/ui/site-shell/utm-capture";
import { Toaster } from "@/shared/ui/sonner-toaster";

// The [lang] root layout owns <html>/<body> (no app/layout.tsx above it) and composes the
// global marketing shell (WEB-001 §6): server-rendered Navbar + footer ContactSection with
// client islands for interaction (mobile menu, floating contact, UTM capture, toasts).
// Shell-owned server data only: marketing copy, contact locations, site settings. Per-page
// metadata (title/robots/canonical) is owned by the pages via FND-003 buildPageMetadata.

export const dynamicParams = false; // unsupported locales are not rendered — they 404

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

type LocaleLayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{ lang: string }>;
}>;

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) {
    notFound();
  }
  const [copy, locations, settings] = await Promise.all([
    getMarketingCopy(lang),
    loadContactLocations(lang),
    loadSiteSettings(),
  ]);
  return (
    <html lang={HTML_LANG[lang]}>
      <body className="min-h-screen bg-background">
        <UtmCapture />
        <Navbar lang={lang} copy={copy} />
        {children}
        <ContactSection lang={lang} copy={copy} locations={locations} />
        <FloatingContact
          lang={lang}
          copy={copy}
          links={{
            telUrl: settings.telUrl,
            zaloUrl: settings.zaloUrl,
            messengerUrl: settings.messengerUrl,
          }}
        />
        <Toaster />
      </body>
    </html>
  );
}
