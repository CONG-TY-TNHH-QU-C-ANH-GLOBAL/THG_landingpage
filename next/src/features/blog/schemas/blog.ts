import { z } from "zod";

import { SUPPORTED_LOCALES } from "@/shared/i18n";

// Transport DTOs for GET /blog, /blog/{slug} and /blog/categories.
// Mirrors the frozen CMS contract [FACT: CMS src/features/blog/blog.schemas.ts].
//
// `alt_text` is NON-nullable here on purpose. It is a heightened-watch field on both sides
// (CMS blog.schemas.ts documents incident 11e9230, where an unrelated-history merge relaxed
// it and silently desynced four layers). The DB column is NOT NULL. Do not widen it.
//
// Unknown keys are stripped by Zod, so an additive CMS change never breaks this consumer.

// Derived from the canonical locale list rather than restating it: a fourth locale must not be
// something this file can silently disagree with (shared/i18n owns the set).
const localeSchema = z.enum(SUPPORTED_LOCALES);

const blogPostSummaryDtoSchema = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string().nullable(),
  thumbnail_url: z.string().nullable(),
  category: z.string().nullable(),
  published_date: z.string().nullable(),
  updated_at: z.number().int(),
});

export const blogListResponseSchema = z.object({
  locale: localeSchema,
  posts: z.array(blogPostSummaryDtoSchema),
  // Parsed so a shape change is caught, then ignored: the list is unpaginated and `total` is
  // just posts.length. Rendering a count from it would imply a paging affordance that the
  // endpoint does not offer.
  total: z.number().int(),
});

export type BlogListResponseDto = z.infer<typeof blogListResponseSchema>;

const blogSlideDtoSchema = z.object({
  src: z.string(),
  alt_text: z.string(),
});

// The detail projection IS the summary plus four fields [FACT: CMS blog.schemas.ts:59-63 — "Adds
// seo_title / seo_description over the summary"]. Extending states that relationship instead of
// re-typing seven shared fields that must never drift apart from the list's copy of them.
const blogPostDetailDtoSchema = blogPostSummaryDtoSchema.extend({
  seo_title: z.string().nullable(),
  seo_description: z.string().nullable(),
  body_md: z.string().nullable(),
  slides: z.array(blogSlideDtoSchema),
});

export const blogPostResponseSchema = z.object({
  locale: localeSchema,
  post: blogPostDetailDtoSchema,
});

export type BlogPostResponseDto = z.infer<typeof blogPostResponseSchema>;

export const blogCategoriesResponseSchema = z.object({
  locale: localeSchema,
  categories: z.array(z.string()),
});

export type BlogCategoriesResponseDto = z.infer<typeof blogCategoriesResponseSchema>;

/** Slug feed used by generateStaticParams. Only the `blog` field is consumed, so the rest of
 *  the sitemap payload is left unvalidated rather than duplicating a contract this route does
 *  not depend on. */
export const blogSitemapResponseSchema = z.object({
  blog: z.array(
    z.object({
      slug: z.string(),
      locale: z.string(),
    }),
  ),
});

export type BlogSitemapResponseDto = z.infer<typeof blogSitemapResponseSchema>;
