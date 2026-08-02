// Landing-domain blog models (WEB-005 §2). Plain data (FND-005); the one import is the shared
// CMS result vocabulary, so blog and careers cannot drift on what a failure is called.
// Wire names (`body_md`, `thumbnail_url`, `published_date`, `alt_text`) stop at the mapper.

import type { UnavailableReason } from "@/shared/cms/degraded";

export interface ArticleSlide {
  src: string;
  altText: string;
}

export interface BlogPostSummary {
  slug: string;
  title: string;
  /** "" when the CMS excerpt is null — the card renders nothing rather than "null". */
  excerpt: string;
  thumbnailUrl: string | null;
  /** Never empty, always trimmed: falls back to the CMS-wide default category
   *  (parity: BlogPage.tsx:37). */
  category: string;
  /** What a reader sees. Usually an ISO date, but when the operator typed something that is not
   *  a date this is that text, shown as written. NEVER put this in `<time dateTime>`,
   *  `datePublished` or a sort key — use `publishedDateIso` for all three. */
  displayDate: string;
  /** The machine-readable date, or null when the CMS has no valid one. Separate from
   *  `displayDate` because the two genuinely differ: a display string is whatever the operator
   *  typed, and claiming it is a date to a crawler when it is not is a false statement. Null
   *  means "omit the property" everywhere it is consumed. */
  publishedDateIso: string | null;
}

export interface BlogArticle extends BlogPostSummary {
  bodyMarkdown: string | null;
  /** Operator metadata overrides. Normalized to null when blank so an empty CMS field cannot
   *  erase a good fallback (an empty override is "no override", not "no title"). */
  seoTitle: string | null;
  seoDescription: string | null;
  slides: readonly ArticleSlide[];
  /** First slide, else the thumbnail (parity: BlogDetailPage.tsx:84). null → no OG image. */
  featuredSrc: string | null;
  /** First slide's alt, else the title (parity: BlogDetailPage.tsx:85). */
  featuredAlt: string;
}

/** True when the article has no readable body and no gallery in this locale. */
export function isArticleContentEmpty(article: BlogArticle): boolean {
  return (article.bodyMarkdown ?? "").trim().length === 0 && article.slides.length === 0;
}

/** List outcome. `empty` is a CONFIRMED empty list; `unavailable` is a CMS failure — keeping
 *  them apart stops an outage from rendering as "no posts yet". */
export type BlogListResult =
  | { status: "ready"; posts: readonly BlogPostSummary[]; categories: readonly string[] }
  | { status: "empty"; posts: readonly BlogPostSummary[]; categories: readonly string[] }
  | {
      status: "unavailable";
      posts: readonly BlogPostSummary[];
      categories: readonly string[];
      reason: UnavailableReason;
    };

/** Detail outcome. `not-found` is a real CMS 404 — the route turns it into a real HTTP 404.
 *  `unavailable` is an outage and must NOT 404, or a crawler would drop a live URL. */
export type BlogArticleResult =
  | { status: "ready"; article: BlogArticle }
  | { status: "not-found" }
  | { status: "unavailable"; reason: UnavailableReason };
