// Landing-domain blog models (WEB-005 §2). Plain data, zero imports (FND-005).
// Wire names (`body_md`, `thumbnail_url`, `published_date`, `alt_text`) stop at the mapper.

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
  /** Never empty: falls back to the CMS-wide default category (parity: BlogPage.tsx:37). */
  category: string;
  /** ISO `YYYY-MM-DD`. `published_date` when set, else `updated_at` converted. */
  displayDate: string;
}

export interface BlogArticle extends BlogPostSummary {
  bodyMarkdown: string | null;
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
      reason: "http" | "contract" | "network";
    };

/** Detail outcome. `not-found` is a real CMS 404 — the route turns it into a real HTTP 404.
 *  `unavailable` is an outage and must NOT 404, or a crawler would drop a live URL. */
export type BlogArticleResult =
  | { status: "ready"; article: BlogArticle }
  | { status: "not-found" }
  | { status: "unavailable"; reason: "http" | "contract" | "network" };
