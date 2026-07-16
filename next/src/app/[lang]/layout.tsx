import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { SUPPORTED_LOCALES, HTML_LANG, isSupportedLocale } from "@/shared/i18n";

// The SUPPORTED dynamic-segment root layout: this is the topmost `layout.tsx` (there is no
// `app/layout.tsx`), so it owns `<html>`/`<body>` and the document language reflects the
// route locale. Server Component; no "use client". Non-production foundation → noindex.
export const metadata: Metadata = {
  title: "THG Public Web — foundation",
  description: "Next.js locale routing foundation (FND-002, ADR-001 Option A). Non-production.",
  robots: { index: false, follow: false },
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
  return (
    <html lang={HTML_LANG[lang]}>
      <body>{children}</body>
    </html>
  );
}
