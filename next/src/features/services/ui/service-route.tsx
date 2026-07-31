import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isSupportedLocale, type Locale } from "@/shared/i18n";
import { getMarketingCopy } from "@/shared/i18n/server/get-marketing-copy";
import { tFrom } from "@/shared/i18n/marketing";
import { BreadcrumbJsonLd, JsonLdScript, buildPageMetadata, localeUrl } from "@/shared/seo";

import { loadServicePage } from "../server/loaders";
import { isServicePageEmpty, type ServicePageSlug } from "../models/service-page";
import { ServicePageView } from "./service-page-view";

// The three service route files are identical except for their slug and SEO strings, so the
// shared body lives here and each page.tsx stays a genuinely thin binding. This is composition
// of one repeated route shape, NOT a generic page engine: the slug set is closed
// (SERVICE_PAGE_SLUGS), every page reads its own CMS content, and Fulfill is excluded.

export interface ServiceSeo {
  title: string;
  description: string;
  /** Localized nav label used in the breadcrumb trail. */
  navKey: string;
}

export async function serviceMetadata(
  slug: ServicePageSlug,
  seo: Readonly<Record<Locale, ServiceSeo>>,
  params: Promise<{ lang: string }>,
): Promise<Metadata> {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) return {};
  const result = await loadServicePage(slug, lang);

  return buildPageMetadata({
    lang,
    routeId: `/${slug}`,
    title: seo[lang].title,
    description: seo[lang].description,
    // A service page with nothing published — or one that could not load — must not be
    // indexed as though it described a service on offer.
    indexable: result.status === "ready" && !isServicePageEmpty(result.content),
  });
}

export async function ServiceRoute({
  slug,
  seo,
  params,
}: Readonly<{
  slug: ServicePageSlug;
  seo: Readonly<Record<Locale, ServiceSeo>>;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) notFound();

  const [copy, result] = await Promise.all([
    getMarketingCopy(lang),
    loadServicePage(slug, lang),
  ]);
  const t = tFrom(copy);
  const canonical = localeUrl(lang, `/${slug}`);
  const hasContent = result.status === "ready" && !isServicePageEmpty(result.content);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: t("nav.home"), url: localeUrl(lang, "/") },
          { name: t(seo[lang].navKey), url: canonical },
        ]}
      />
      {/* Service JSON-LD only when the CMS actually published something. Describing a service
          that has no content would be a structured-data claim with nothing behind it. */}
      {hasContent && (
        <JsonLdScript
          data={{
            "@context": "https://schema.org",
            "@type": "Service",
            name: result.content.service?.name ?? seo[lang].title,
            description: seo[lang].description,
            provider: { "@type": "Organization", name: "THG Fulfill" },
            url: canonical,
          }}
        />
      )}
      <ServicePageView result={result} copy={copy} lang={lang} />
    </>
  );
}
