import Image from "next/image";
import Link from "next/link";

import type { MarketingCopy } from "@/shared/i18n/marketing";
import { tFrom } from "@/shared/i18n/marketing";
import type { Locale } from "@/shared/i18n";
import { MarkdownLines, splitSections } from "@/shared/ui/markdown";

import { isArticleContentEmpty, type BlogArticle } from "../models/blog";

// Composed /{lang}/blog/{slug} body. Server Component.
//
// The Vite detail page had a click-to-zoom lightbox island. It is not reproduced: the gallery
// renders every slide at full width in document order, which is what the lightbox existed to
// let you reach, and it removes a keyboard-trap surface. If a zoom affordance is wanted later
// it is an additive island over this markup, not a rewrite.

export function BlogArticleView({
  article,
  copy,
  lang,
}: Readonly<{ article: BlogArticle; copy: MarketingCopy; lang: Locale }>) {
  const t = tFrom(copy);
  const sections = splitSections(article.bodyMarkdown ?? "");
  const gallery = article.slides;

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-3xl px-4 pt-28 pb-20 sm:px-6">
        <Link
          href={`/${lang}/blog`}
          className="mb-6 inline-block text-[13px] text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          ← {t("blog.back")}
        </Link>

        <p className="mb-1 text-[12px] font-medium text-primary">{article.category}</p>
        <h1 className="mb-2 text-2xl font-semibold text-navy">{article.title}</h1>
        <time dateTime={article.displayDate} className="text-[12px] text-muted-foreground">
          {article.displayDate}
        </time>
        {article.excerpt && (
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{article.excerpt}</p>
        )}

        {isArticleContentEmpty(article) ? (
          // Published with no body in this locale. Say so rather than rendering a bare header
          // that reads like a broken page.
          <p className="mt-8 rounded-xl border border-border/60 bg-card p-4 text-[13px] text-muted-foreground">
            {t("blog.no_content")}
          </p>
        ) : (
          <>
            {sections.length > 0 && (
              <div className="mt-8 text-[15px] leading-relaxed text-foreground/90">
                {sections.map((section, i) => (
                  <div key={i}>
                    {section.heading && (
                      <h2 className="mt-6 mb-2 text-lg font-semibold text-navy">
                        {section.heading}
                      </h2>
                    )}
                    {/* baseHeadingLevel 3: a `#` inside the body sits under the section h2,
                        so the document outline stays valid under the page h1. */}
                    <MarkdownLines lines={section.lines} baseHeadingLevel={3} />
                  </div>
                ))}
              </div>
            )}

            {gallery.length > 0 && (
              <section className="mt-10">
                <h2 className="mb-3 text-lg font-semibold text-navy">
                  {gallery.length} {t("blog.slides")}
                </h2>
                <div className="space-y-4">
                  {gallery.map((slide, i) => (
                    <Image
                      key={slide.src}
                      src={slide.src}
                      alt={slide.altText}
                      width={1200}
                      height={800}
                      sizes="(max-width: 768px) 100vw, 768px"
                      className="h-auto w-full rounded-xl border border-border/60"
                      unoptimized
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

/** Rendered when the CMS is unreachable. Deliberately NOT a 404: a transient outage that
 *  answers 404 gets a live URL dropped from the index. */
export function BlogArticleUnavailable({
  copy,
  lang,
}: Readonly<{ copy: MarketingCopy; lang: Locale }>) {
  const t = tFrom(copy);
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-3xl px-4 pt-28 pb-20 sm:px-6">
        <Link href={`/${lang}/blog`} className="mb-6 inline-block text-[13px] text-primary hover:underline">
          ← {t("blog.back")}
        </Link>
        <p className="rounded-2xl border border-border/60 bg-card px-6 py-16 text-center text-muted-foreground">
          {t("blog.unavailable")}
        </p>
      </main>
    </div>
  );
}
