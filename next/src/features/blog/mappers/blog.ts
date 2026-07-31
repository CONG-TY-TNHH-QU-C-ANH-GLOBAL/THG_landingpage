import type {
  BlogCategoriesResponseDto,
  BlogListResponseDto,
  BlogPostResponseDto,
} from "../schemas/blog";
import type { BlogArticle, BlogPostSummary } from "../models/blog";

// Pure DTO → model mappers (FND-005). No I/O, no framework, no CMS types leaving this file.
// Rules extracted verbatim from the Vite inline mappings [FACT: BlogPage.tsx:32-44,
// BlogDetailPage.tsx:30-43].

/** The Vite pages substituted this literal whenever `category` was null. Kept as the single
 *  definition so the list filter and the detail chip cannot disagree about the bucket name. */
export const DEFAULT_CATEGORY = "Báo cáo";

/** `published_date` when the editor set one, else the row's `updated_at` epoch rendered as an
 *  ISO date. Both are `YYYY-MM-DD`, which is what makes the newest-first sort a plain string
 *  compare (parity: BlogPage.tsx:38) and what `datePublished` requires. */
function displayDate(publishedDate: string | null, updatedAt: number): string {
  return publishedDate ?? new Date(updatedAt * 1000).toISOString().slice(0, 10);
}

function summaryFrom(p: BlogListResponseDto["posts"][number]): BlogPostSummary {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? "",
    thumbnailUrl: p.thumbnail_url,
    category: p.category ?? DEFAULT_CATEGORY,
    displayDate: displayDate(p.published_date, p.updated_at),
  };
}

/** Newest first. The CMS list has no ordering guarantee, and the Vite page sorted client-side
 *  (BlogPage.tsx:44); doing it here keeps the order in the server-rendered HTML. */
export function blogSummariesFromDto(dto: BlogListResponseDto): BlogPostSummary[] {
  return dto.posts.map(summaryFrom).sort((a, b) => b.displayDate.localeCompare(a.displayDate));
}

/** Drop blanks and de-duplicate. The CMS sorts already; re-sorting could disagree with the
 *  operator's collation, so the order is passed through. */
export function blogCategoriesFromDto(dto: BlogCategoriesResponseDto): string[] {
  const seen = new Set<string>();
  return dto.categories.filter((c) => {
    const key = c.trim();
    if (key.length === 0 || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function blogArticleFromDto(dto: BlogPostResponseDto): BlogArticle {
  const p = dto.post;
  const slides = p.slides.map((s) => ({ src: s.src, altText: s.alt_text }));
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? "",
    thumbnailUrl: p.thumbnail_url,
    category: p.category ?? DEFAULT_CATEGORY,
    displayDate: displayDate(p.published_date, p.updated_at),
    bodyMarkdown: p.body_md,
    slides,
    featuredSrc: slides[0]?.src ?? p.thumbnail_url,
    // `|| title` not `?? title`: an empty-string alt is as useless as a missing one here,
    // because this value is also the og:image alt (parity: BlogDetailPage.tsx:85).
    featuredAlt: slides[0]?.altText || p.title,
  };
}
