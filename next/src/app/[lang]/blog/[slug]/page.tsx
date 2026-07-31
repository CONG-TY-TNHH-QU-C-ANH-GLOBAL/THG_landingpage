import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
  const metadata = buildPageMetadata({
    lang,
    routeId: `/blog/${slug}`,
    // Parity: BlogDetailPage.tsx:91.
    title: `${article.title} — THG Fulfill`,
    description: article.excerpt || `${article.title} — THG Fulfill`,
    image: article.featuredSrc ?? undefined,
    indexable: true,
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: article.displayDate,
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
          // Only emitted when the value is a real ISO date — an invalid datePublished is
          // worse than an absent one (parity: JsonLd.tsx:342 gated the same way).
          datePublished: /^\d{4}-\d{2}-\d{2}$/.test(article.displayDate)
            ? article.displayDate
            : undefined,
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
