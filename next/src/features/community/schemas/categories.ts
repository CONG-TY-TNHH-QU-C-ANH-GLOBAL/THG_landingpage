import { z } from "zod";

// CMS wire shapes for community categories (GET /community/categories).
// Verified against CMS_management-/src/features/community/community.schemas.ts —
// categories are a CMS-managed table (community_categories), not a code enum, and
// carry NO locale dimension: names are Vietnamese literals shared by questions and
// reviews. Do not add a `lang` param; the endpoint rejects nothing but ignores it.

/** Denormalized category reference embedded in question/review payloads. */
export const cmsCategoryRefSchema = z.object({
  slug: z.string(),
  name: z.string(),
});

export const cmsCategorySchema = z.object({
  slug: z.string(),
  name: z.string(),
  position: z.number().int(),
});

export const categoriesResponseSchema = z.object({
  categories: z.array(cmsCategorySchema),
});

export type CmsCategoriesResponse = z.infer<typeof categoriesResponseSchema>;
