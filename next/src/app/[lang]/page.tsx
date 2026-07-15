import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SUPPORTED_LOCALES, isSupportedLocale } from "@/shared/i18n";
import { getDictionary } from "@/shared/i18n/server/get-dictionary";

// Foundation locale page (NOT the migrated homepage). Fully static per locale; proves locale
// resolution, server dictionary loading and correct document language. No client component.
export const dynamic = "force-static";

type PageProps = Readonly<{ params: Promise<{ lang: string }> }>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) return {};
  const dict = getDictionary(lang);
  return { title: dict.foundation.title, robots: { index: false, follow: false } };
}

export default async function LocaleFoundationPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) notFound();
  const dict = getDictionary(lang);
  return (
    <main>
      <h1>{dict.foundation.title}</h1>
      <p>{dict.foundation.description}</p>
      <p data-testid="locale-label">{dict.foundation.localeLabel}</p>
      <p data-testid="active-locale">{lang}</p>
      <nav aria-label="locale switch">
        {SUPPORTED_LOCALES.map((locale) => (
          <Link key={locale} href={`/${locale}`} hrefLang={locale} prefetch={false}>
            {locale}
          </Link>
        ))}
      </nav>
    </main>
  );
}
