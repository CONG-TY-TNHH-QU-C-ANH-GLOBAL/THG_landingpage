import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { applyCmsCachePolicy } from "@/shared/cms/degraded";
import { isSupportedLocale, type Locale } from "@/shared/i18n";
import { getMarketingCopy } from "@/shared/i18n/server/get-marketing-copy";
import { tFrom } from "@/shared/i18n/marketing";
import {
  BreadcrumbJsonLd,
  JsonLdScript,
  buildPageMetadata,
  localeUrl,
  resolveSiteOrigin,
} from "@/shared/seo";

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
  // Same invariant the four blog/careers routes enforce on the canonical base, applied here
  // because these four service routes have the identical shape: a 300s route-level revalidate
  // plus a `noindex` that generateMetadata emits for any non-ready result. Without this a
  // transient CMS outage is committed to the success-path window together with that noindex,
  // and nothing invalidates an entry that was written successfully. Only `unavailable` opts
  // out; `ready` and `empty` keep the approved ISR behaviour.
  await applyCmsCachePolicy(result.status);
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
            // THG Fulfill is the PROVIDER ORGANIZATION, not a sibling of the service being
            // described, and it stays the provider on every one of these routes. Express,
            // Warehouse and Order are service names in one company's ecosystem, not separate
            // legal entities: the site declares exactly one Organization — one address, one
            // phone, one email, one set of social profiles [FACT: features/home/ui/home-jsonld
            // .tsx:7-30] — and the ecosystem copy lists "THG Fulfill — POD & Sourcing"
            // alongside Express and Warehouse as peer SERVICES of that company
            // [FACT: shared/i18n/marketing-copy.ts, ecosystem.step1..step3_title]. Naming the
            // provider after the service would invent three organizations that do not exist.
            //
            // What WAS missing is the link back to that one organization: a bare `name` is not
            // resolvable, so a consumer could not tell this provider is the same entity the
            // home page declares rather than a different company with a matching name. `url`
            // supplies that, matching how blog author/publisher already identify it.
            provider: {
              "@type": "Organization",
              name: "THG Fulfill",
              url: resolveSiteOrigin(),
            },
            url: canonical,
          }}
        />
      )}
      <ServicePageView result={result} copy={copy} lang={lang} />
    </>
  );
}
