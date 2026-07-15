import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { SUPPORTED_LOCALES, HTML_LANG, isSupportedLocale } from "@/shared/i18n";

// Owns `<html lang>` so the document language reflects the route locale. Server Component;
// no "use client". `lang` is validated BEFORE any dictionary load; an unsupported locale is a
// real 404 with no silent fallback.
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
