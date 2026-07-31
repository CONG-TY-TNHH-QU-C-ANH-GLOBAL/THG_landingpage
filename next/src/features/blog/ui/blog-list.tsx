import Image from "next/image";
import Link from "next/link";

import type { MarketingCopy } from "@/shared/i18n/marketing";
import { tFrom } from "@/shared/i18n/marketing";
import type { Locale } from "@/shared/i18n";

import type { BlogListResult, BlogPostSummary } from "../models/blog";

// Composed /{lang}/blog body. Server Component throughout.
//
// The Vite page filtered by category in `useState`, which meant the category a visitor picked
// was invisible to the server and to a crawler, and the grid was assembled in the browser.
// There is no filter island here: every published post is rendered, grouped under its category
// heading. That keeps the whole list in the SSR HTML, keeps the route static, and gives each
// category a `#category` anchor to link to — the same affordance the chips provided, without
// hiding content behind client state.

function PostCard({
  post,
  href,
  eager,
}: Readonly<{ post: BlogPostSummary; href: string; eager: boolean }>) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition-shadow hover:shadow-md">
      <Link href={href} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
        {post.thumbnailUrl && (
          <Image
            src={post.thumbnailUrl}
            alt=""
            width={640}
            height={360}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="h-44 w-full object-cover"
            // CMS-hosted media on a host with no configured remote pattern.
            unoptimized
            loading={eager ? "eager" : "lazy"}
          />
        )}
        <div className="p-4">
          <p className="mb-1 text-[12px] font-medium text-primary">{post.category}</p>
          <h3 className="mb-1 text-[15px] font-semibold text-navy group-hover:underline">
            {post.title}
          </h3>
          {/* Machine-readable date next to the human one; the card is the only place the
              published date appears in the list. */}
          <time dateTime={post.displayDate} className="text-[12px] text-muted-foreground">
            {post.displayDate}
          </time>
          {post.excerpt && (
            <p className="mt-2 line-clamp-3 text-[13px] text-muted-foreground">{post.excerpt}</p>
          )}
        </div>
      </Link>
    </article>
  );
}

export function BlogList({
  result,
  copy,
  lang,
}: Readonly<{ result: BlogListResult; copy: MarketingCopy; lang: Locale }>) {
  const t = tFrom(copy);

  // Group by category, preserving the newest-first order the mapper produced inside each
  // group, and using the CMS category order when it is available.
  const groups = new Map<string, BlogPostSummary[]>();
  for (const category of result.categories) groups.set(category, []);
  for (const post of result.posts) {
    const bucket = groups.get(post.category) ?? [];
    bucket.push(post);
    groups.set(post.category, bucket);
  }
  const nonEmpty = [...groups.entries()].filter(([, posts]) => posts.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 pt-28 pb-20 sm:px-6">
        <h1 className="mb-1 text-2xl font-semibold text-navy">{t("blog.title")}</h1>
        <p className="mb-6 text-[13px] text-muted-foreground">{t("blog.subtitle")}</p>

        {result.status === "unavailable" && (
          <p className="rounded-2xl border border-border/60 bg-card px-6 py-16 text-center text-muted-foreground">
            {t("blog.unavailable")}
          </p>
        )}
        {result.status === "empty" && (
          <p className="rounded-2xl border border-border/60 bg-card px-6 py-16 text-center text-muted-foreground">
            {t("blog.list_empty")}
          </p>
        )}

        {result.status === "ready" && (
          <>
            {nonEmpty.length > 1 && (
              <nav aria-label={t("blog.categories_label")} className="mb-8 flex flex-wrap gap-2">
                {nonEmpty.map(([category]) => (
                  <a
                    key={category}
                    href={`#${encodeURIComponent(category)}`}
                    className="rounded-lg border-[1.5px] border-[#d4b96a] bg-white px-4 py-2 text-[13px] font-medium text-navy transition-colors hover:bg-[#fdf6e8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {category}
                  </a>
                ))}
              </nav>
            )}

            {nonEmpty.map(([category, posts], groupIndex) => (
              <section key={category} id={encodeURIComponent(category)} className="mb-12 scroll-mt-28">
                <h2 className="mb-4 text-lg font-semibold text-navy">{category}</h2>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post, i) => (
                    <PostCard
                      key={post.slug}
                      post={post}
                      href={`/${lang}/blog/${post.slug}`}
                      // Only the first card of the first group is above the fold.
                      eager={groupIndex === 0 && i === 0}
                    />
                  ))}
                </div>
              </section>
            ))}
          </>
        )}
      </main>
    </div>
  );
}
