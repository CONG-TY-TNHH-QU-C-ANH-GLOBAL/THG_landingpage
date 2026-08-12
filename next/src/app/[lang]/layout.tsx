import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Be_Vietnam_Pro, Inter } from "next/font/google";
import "../globals.css";
import { SUPPORTED_LOCALES, HTML_LANG, isSupportedLocale, type Locale } from "@/shared/i18n";
import { getMarketingCopy } from "@/shared/i18n/server/get-marketing-copy";
import { pickCopy, NAVBAR_COPY, FLOATING_CONTACT_COPY } from "@/shared/i18n/shell-copy";
// Direct shell-loader import (not the @/features/home barrel) so this shared layout — rendered
// on every locale route — does not pull the homepage data graph into each route's module graph.
import { loadContactLocations, loadSiteSettings } from "@/features/home/server/shell-loaders";
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

// Keyboard affordance, not marketing copy: the public pages run a dozen sections deep behind a
// fixed navbar, so a keyboard user needs one stop that jumps past the navigation. Localized here
// rather than in the marketing dictionary because it is shell scaffolding, not business content.
const SKIP_LINK_LABEL: Readonly<Record<Locale, string>> = {
  vi: "Bỏ qua điều hướng, đến nội dung chính",
  en: "Skip to main content",
  zh: "跳到主要内容",
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
    // The font-face variables belong on <html>, NOT on <body>. globals.css composes the brand
    // stacks at `:root` (`--font-body: var(--font-body-face), …`), and a custom property is
    // substituted once, where it is declared: with the faces defined only on <body>, `var(--font-
    // body-face)` was unresolvable at :root, which makes the whole `--font-body` declaration
    // compute to the guaranteed-invalid value — and custom properties inherit their COMPUTED value,
    // so redefining the face lower down could never repair it. Every route was rendering in the
    // browser's default serif. Measured before/after with getComputedStyle on /vi, /vi/blog and
    // /vi/thg-fulfill.
    <html lang={HTML_LANG[lang]} className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="min-h-screen bg-background">
        <UtmCapture />
        <a href="#main-content" className="skip-link">
          {SKIP_LINK_LABEL[lang]}
        </a>
        {/* Client islands receive only the copy they render (Navbar/FloatingContact are
            "use client"); ContactSection is a Server Component and keeps the full map free. */}
        <Navbar lang={lang} copy={pickCopy(copy, NAVBAR_COPY)} />
        <div id="main-content" tabIndex={-1} className="outline-none">
          {children}
        </div>
        <ContactSection
          lang={lang}
          copy={copy}
          directory={{ status: contact.status, rows: contact.locations }}
        />
        <FloatingContact
          lang={lang}
          copy={pickCopy(copy, FLOATING_CONTACT_COPY)}
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
