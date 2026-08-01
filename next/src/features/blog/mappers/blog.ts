import { isoDateOrNull } from "@/shared/cms/iso-date";

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

/**
 * Split the CMS publication date into what a reader sees and what a machine may consume.
 *
 * `published_date` is a nullable free-text column, so four things arrive through it and they do
 * not all mean the same thing:
 *
 *   null / "" / whitespace  → the editor set nothing. Fall back to `updated_at`, which is the
 *                             already-approved contract [FACT: BlogPage.tsx:38] and is a real
 *                             timestamp, so both values are safe.
 *   a valid date            → use it for both.
 *   anything else           → the editor typed something that is NOT a date ("sắp ra mắt", a
 *                             half-finished value). Show it, because it is their content and
 *                             hiding it would make the CMS look broken — but the machine value
 *                             is null. Substituting `updated_at` here would FABRICATE a
 *                             publication date the operator never stated, and the approved
 *                             fallback covers "unset", not "invalid".
 */
function publicationDate(
  publishedDate: string | null,
  updatedAt: number,
): { displayDate: string; publishedDateIso: string | null } {
  const raw = publishedDate?.trim() ?? "";
  if (raw.length === 0) {
    const derived = new Date(updatedAt * 1000).toISOString().slice(0, 10);
    return { displayDate: derived, publishedDateIso: derived };
  }
  return { displayDate: raw, publishedDateIso: isoDateOrNull(raw) };
}

/** Blank → null, so an empty CMS override never overwrites a valid fallback with nothing. */
function optionalText(value: string | null): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}

/** One category-normalization rule for the whole feature: trim, and treat blank as absent.
 *  Case is preserved — these are human labels the operator chose, and folding them would
 *  merge "Case Study" with "case study" in the UI. */
function categoryOf(value: string | null): string {
  return optionalText(value) ?? DEFAULT_CATEGORY;
}

function summaryFrom(p: BlogListResponseDto["posts"][number]): BlogPostSummary {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? "",
    thumbnailUrl: p.thumbnail_url,
    category: categoryOf(p.category),
    ...publicationDate(p.published_date, p.updated_at),
  };
}

/** Newest first, ordered by the MACHINE date — sorting on display text would order "sắp ra
 *  mắt" alphabetically among real dates. Posts with no valid date sort last, keeping the
 *  comparator total so the order is deterministic rather than dependent on input order. */
export function blogSummariesFromDto(dto: BlogListResponseDto): BlogPostSummary[] {
  return dto.posts.map(summaryFrom).sort((a, b) => {
    if (a.publishedDateIso === b.publishedDateIso) return 0;
    if (a.publishedDateIso === null) return 1;
    if (b.publishedDateIso === null) return -1;
    return b.publishedDateIso.localeCompare(a.publishedDateIso);
  });
}

/** Drop blanks and de-duplicate. The CMS sorts already; re-sorting could disagree with the
 *  operator's collation, so the order is passed through.
 *
 *  The TRIMMED value is what is returned, not the original: comparing on `trim()` while
 *  emitting the raw string meant " Tin tức" and "Tin tức" deduplicated to one entry whose label
 *  still carried the stray space, and that label then failed to match the trimmed category on
 *  every post — so the section it was supposed to head rendered empty. Normalize once, here. */
export function blogCategoriesFromDto(dto: BlogCategoriesResponseDto): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const category of dto.categories) {
    const normalized = category.trim();
    if (normalized.length === 0 || seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(normalized);
  }
  return out;
}

export function blogArticleFromDto(dto: BlogPostResponseDto): BlogArticle {
  const p = dto.post;
  const slides = p.slides.map((s) => ({ src: s.src, altText: s.alt_text }));
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? "",
    thumbnailUrl: p.thumbnail_url,
    category: categoryOf(p.category),
    ...publicationDate(p.published_date, p.updated_at),
    bodyMarkdown: p.body_md,
    // Validated by the CMS contract but previously dropped here, so an operator's metadata
    // override could never reach generateMetadata — a silent migration-parity gap.
    seoTitle: optionalText(p.seo_title),
    seoDescription: optionalText(p.seo_description),
    slides,
    featuredSrc: slides[0]?.src ?? p.thumbnail_url,
    // `|| title` not `?? title`: an empty-string alt is as useless as a missing one here,
    // because this value is also the og:image alt (parity: BlogDetailPage.tsx:85).
    featuredAlt: slides[0]?.altText || p.title,
  };
}
