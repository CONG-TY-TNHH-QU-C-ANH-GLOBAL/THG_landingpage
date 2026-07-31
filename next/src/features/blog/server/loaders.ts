import "server-only";

import { cache } from "react";

import { cmsFetch } from "@/shared/cms";
import {
  CmsError,
  CmsHttpError,
  CmsParseError,
  CmsShapeError,
  isCmsNotFound,
} from "@/shared/cms/errors";
import { logCmsFallback } from "@/shared/cms/log-fallback";
import { SUPPORTED_LOCALES, type Locale } from "@/shared/i18n";

import {
  blogCategoriesResponseSchema,
  blogListResponseSchema,
  blogPostResponseSchema,
  blogSitemapResponseSchema,
} from "../schemas/blog";
import {
  blogArticleFromDto,
  blogCategoriesFromDto,
  blogSummariesFromDto,
} from "../mappers/blog";
import type { BlogArticleResult, BlogListResult } from "../models/blog";

// Server-only WEB-005 loaders: cmsFetch → feature schema → pure mapper → model.
//
// Failure policy mirrors community, not the homepage: the blog IS the page, so a CMS outage
// surfaces an explicit `unavailable` state instead of a fabricated fallback. The critical
// distinction on detail is 404 vs outage — a 404 becomes a real HTTP 404, an outage must NOT,
// because a crawler that sees 404 for a transient failure drops a live URL from the index.

type UnavailableReason = "http" | "contract" | "network";

function unavailableReason(err: CmsError): UnavailableReason {
  if (err instanceof CmsHttpError) return "http";
  if (err instanceof CmsShapeError || err instanceof CmsParseError) return "contract";
  return "network";
}

/** Posts plus the category filter set for one locale.
 *
 *  Categories degrade to `[]` independently: they are a filter affordance, not content, so an
 *  outage there must not fail the list the visitor actually came for. */
export const loadBlogList = cache(async (lang: Locale): Promise<BlogListResult> => {
  const listPath = `/blog?lang=${lang}`;
  const categoriesPath = `/blog/categories?lang=${lang}`;

  const [postsSettled, categoriesSettled] = await Promise.allSettled([
    cmsFetch(listPath, blogListResponseSchema, { tags: ["blog"] }),
    cmsFetch(categoriesPath, blogCategoriesResponseSchema, { tags: ["blog"] }),
  ]);

  let categories: readonly string[] = [];
  if (categoriesSettled.status === "fulfilled") {
    categories = blogCategoriesFromDto(categoriesSettled.value);
  } else {
    if (!(categoriesSettled.reason instanceof CmsError)) throw categoriesSettled.reason;
    logCmsFallback(categoriesPath, categoriesSettled.reason);
  }

  if (postsSettled.status === "rejected") {
    if (!(postsSettled.reason instanceof CmsError)) throw postsSettled.reason;
    logCmsFallback(listPath, postsSettled.reason);
    return {
      status: "unavailable",
      posts: [],
      categories,
      reason: unavailableReason(postsSettled.reason),
    };
  }

  const posts = blogSummariesFromDto(postsSettled.value);
  return posts.length > 0
    ? { status: "ready", posts, categories }
    : { status: "empty", posts, categories };
});

export const loadBlogArticle = cache(
  async (slug: string, lang: Locale): Promise<BlogArticleResult> => {
    const path = `/blog/${encodeURIComponent(slug)}?lang=${lang}`;
    try {
      const article = blogArticleFromDto(
        await cmsFetch(path, blogPostResponseSchema, { tags: ["blog", `blog:${slug}`] }),
      );
      return { status: "ready", article };
    } catch (err) {
      if (!(err instanceof CmsError)) throw err;
      if (isCmsNotFound(err)) return { status: "not-found" };
      logCmsFallback(path, err);
      return { status: "unavailable", reason: unavailableReason(err) };
    }
  },
);

/** {lang, slug} pairs to prerender, from the CMS slug feed.
 *
 *  An empty result is NOT a failure: with `dynamicParams = true` an unlisted slug simply
 *  renders on first request. That is why a CMS outage here returns [] rather than throwing —
 *  the build must not depend on the CMS being reachable. */
export async function blogStaticParams(): Promise<{ lang: string; slug: string }[]> {
  const path = "/sitemap";
  try {
    const dto = await cmsFetch(path, blogSitemapResponseSchema);
    const byLocale = new Map<string, Set<string>>();
    for (const row of dto.blog) {
      // The feed carries every locale; keep only the ones this app serves, and de-duplicate —
      // the same slug appears once per locale row.
      if (!SUPPORTED_LOCALES.includes(row.locale as Locale)) continue;
      const set = byLocale.get(row.locale) ?? new Set<string>();
      set.add(row.slug);
      byLocale.set(row.locale, set);
    }
    return [...byLocale.entries()].flatMap(([lang, slugs]) =>
      [...slugs].map((slug) => ({ lang, slug })),
    );
  } catch (err) {
    if (!(err instanceof CmsError)) throw err;
    logCmsFallback(path, err);
    return [];
  }
}
