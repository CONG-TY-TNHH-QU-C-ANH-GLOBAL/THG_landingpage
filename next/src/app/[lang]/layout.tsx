import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Be_Vietnam_Pro, Inter } from "next/font/google";
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

// Typography foundation (WEB-001A — IMPLEMENTATION_BASELINE.md "Typography rules"):
// self-hosted via next/font/google (no manual asset copy, no manifest/lockfile change).
// "vietnamese" subset covers the full VI Latin-Extended range; "latin" covers en; Noto
// Sans SC stays the declared zh fallback in globals.css (neither face ships CJK glyphs).
const displayFont = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700", "800"],
  variable: "--font-display-face",
  display: "swap",
});
const bodyFont = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body-face",
  display: "swap",
});

// Existing approved brand assets only (copied from production public/): declaring them here
// emits the <link rel="icon"> set so browsers stop probing the absent /favicon.ico.
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
    ],
  },
};

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
  const [copy, contact, settings] = await Promise.all([
    getMarketingCopy(lang),
    loadContactLocations(lang),
    loadSiteSettings(),
  ]);
  return (
    <html lang={HTML_LANG[lang]}>
      <body className={`${displayFont.variable} ${bodyFont.variable} min-h-screen bg-background`}>
        <UtmCapture />
        <Navbar lang={lang} copy={copy} />
        {children}
        <ContactSection
          lang={lang}
          copy={copy}
          directory={{ status: contact.status, rows: contact.locations }}
        />
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
