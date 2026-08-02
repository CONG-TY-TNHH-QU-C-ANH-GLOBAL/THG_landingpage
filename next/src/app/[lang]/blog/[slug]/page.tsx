import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { applyCmsCachePolicy } from "@/shared/cms/degraded";
import { isSupportedLocale } from "@/shared/i18n";
import { getMarketingCopy } from "@/shared/i18n/server/get-marketing-copy";
import { tFrom } from "@/shared/i18n/marketing";
import {
  BreadcrumbJsonLd,
  JsonLdScript,
  buildPageMetadata,
  localeUrl,
  resolveSiteOrigin,
} from "@/shared/seo";
import {
  BlogArticleUnavailable,
  BlogArticleView,
  blogStaticParams,
  loadBlogArticle,
} from "@/features/blog";

// WEB-005 — /{lang}/blog/{slug}. Longer window than the list: an article changes rarely, and
// the tag (`blog:<slug>`) is what an editor's publish will invalidate once FND-006 lands.
export const revalidate = 3600;

// A post published after the last build renders on first request instead of 404ing. That is
// why the empty-slug-feed case in blogStaticParams is safe.
export const dynamicParams = true;

export async function generateStaticParams() {
  return blogStaticParams();
}

type PageProps = Readonly<{ params: Promise<{ lang: string; slug: string }> }>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isSupportedLocale(lang)) return {};
  const result = await loadBlogArticle(slug, lang);

  // Unknown slug: the page will 404, and metadata for a 404 is never served.
  if (result.status !== "ready") return { robots: { index: false, follow: false } };

  const { article } = result;
  // Precedence: operator override → the article's own field → the existing default. The
  // overrides are normalized to null in the mapper, so a CMS field the operator cleared falls
  // through to the fallback instead of erasing the title with an empty string.
  const metadata = buildPageMetadata({
    lang,
    routeId: `/blog/${slug}`,
    // Parity: BlogDetailPage.tsx:91.
    title: article.seoTitle ?? `${article.title} — THG Fulfill`,
    description:
      article.seoDescription ?? (article.excerpt || `${article.title} — THG Fulfill`),
    image: article.featuredSrc ?? undefined,
    indexable: true,
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      // Omitted unless the CMS supplied a real date — see BlogPostSummary.publishedDateIso.
      publishedTime: article.publishedDateIso ?? undefined,
    },
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!isSupportedLocale(lang)) notFound();

  const [copy, result] = await Promise.all([
    getMarketingCopy(lang),
    loadBlogArticle(slug, lang),
  ]);
  const t = tFrom(copy);

  // A real CMS 404 becomes a real HTTP 404. An outage deliberately does NOT — answering 404
  // for a transient failure gets a live URL dropped from the index.
  if (result.status === "not-found") notFound();
  if (result.status === "unavailable") {
    // Without this the apology page — and the noindex generateMetadata pairs with it — would be
    // committed to the 3600s route cache, so a one-second CMS blip could hide a live article
    // from crawlers for an hour with nothing to invalidate it.
    await applyCmsCachePolicy(result.status);
    return <BlogArticleUnavailable copy={copy} lang={lang} />;
  }

  const { article } = result;
  const canonical = localeUrl(lang, `/blog/${slug}`);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: t("nav.home"), url: localeUrl(lang, "/") },
          { name: t("blog.title"), url: localeUrl(lang, "/blog") },
          { name: article.title, url: canonical },
        ]}
      />
      <JsonLdScript
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt || undefined,
          // The mapper already decided whether the CMS value is a real date; the route no
          // longer re-guesses with its own regex (parity: JsonLd.tsx:342 gated the same way).
          datePublished: article.publishedDateIso ?? undefined,
          image: article.featuredSrc ?? undefined,
          mainEntityOfPage: canonical,
          author: { "@type": "Organization", name: "THG Fulfill", url: resolveSiteOrigin() },
          publisher: { "@type": "Organization", name: "THG Fulfill", url: resolveSiteOrigin() },
        }}
      />
      <BlogArticleView article={article} copy={copy} lang={lang} />
    </>
  );
}
