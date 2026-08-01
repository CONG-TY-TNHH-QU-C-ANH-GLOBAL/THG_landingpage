import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { applyCmsCachePolicy } from "@/shared/cms/degraded";
import { isSupportedLocale } from "@/shared/i18n";
import { getMarketingCopy } from "@/shared/i18n/server/get-marketing-copy";
import { tFrom } from "@/shared/i18n/marketing";
import { BreadcrumbJsonLd, buildPageMetadata, localeUrl } from "@/shared/seo";
import { BlogList, loadBlogList } from "@/features/blog";

// WEB-005 — /{lang}/blog. Server Component; thin route file. SSG + ISR per the migration map
// (tag: blog, 300s). The cmsFetch tag slots are already passed by the loader; on-demand
// invalidation is FND-006's to wire.
export const revalidate = 300;

type PageProps = Readonly<{ params: Promise<{ lang: string }> }>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) return {};
  const copy = await getMarketingCopy(lang);
  const t = tFrom(copy);
  // isSupportedLocale is a type guard, so lang is already Locale here.
  const result = await loadBlogList(lang);

  return buildPageMetadata({
    lang,
    routeId: "/blog",
    // Parity: BlogPage.tsx:54 built the title as `{t("blog.title")} — THG Fulfill`.
    title: `${t("blog.title")} — THG Fulfill`,
    description: t("blog.subtitle"),
    // An index page with no posts, or one that could not load them, is not a useful search
    // result — and indexing it as though it listed content would be a false claim.
    indexable: result.status === "ready",
  });
}

export default async function BlogPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) notFound();

  const [copy, result] = await Promise.all([getMarketingCopy(lang), loadBlogList(lang)]);
  // The one route that was still missing the degraded-cache policy its three siblings apply.
  // Without it a CMS outage was committed to the 300s window together with the noindex
  // generateMetadata emits for a non-ready list. `generateMetadata` needs no separate call:
  // metadata and the page body are one route render, so opting THIS render out covers both —
  // verified by building with the CMS unreachable and seeing /[lang]/blog leave the prerender
  // set. Success and confirmed-empty are untouched, so the 300s ISR still applies to them.
  await applyCmsCachePolicy(result.status);
  const t = tFrom(copy);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: t("nav.home"), url: localeUrl(lang, "/") },
          { name: t("blog.title"), url: localeUrl(lang, "/blog") },
        ]}
      />
      <BlogList result={result} copy={copy} lang={lang} />
    </>
  );
}
