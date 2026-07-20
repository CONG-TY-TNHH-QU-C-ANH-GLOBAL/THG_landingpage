import { z } from "zod";

import { cmsCategoryRefSchema } from "./categories";

// CMS wire shapes for verified reviews (COM-002). Mirrors the CMS review privacy
// mapper allow-list. Never present here: reviewer_email, private_order_reference,
// private_evidence_note, ip, owner_token_hash, withdrawn_at, status.

export const cmsReviewSummarySchema = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  category: cmsCategoryRefSchema.nullable(),
  rating: z.number().nullable(),
  verified: z.boolean(),
  indexable: z.boolean(),
  published_at: z.number().int().nullable(),
});

export const reviewsResponseSchema = z.object({
  reviews: z.array(cmsReviewSummarySchema),
});

export const cmsReviewDetailSchema = z.object({
  slug: z.string(),
  title: z.string(),
  body: z.string(),
  category: cmsCategoryRefSchema.nullable(),
  reviewer_name: z.string(),
  rating: z.number().nullable(),
  /** Operator-authored summary, not UGC. */
  public_summary: z.string().nullable(),
  verified: z.boolean(),
  indexable: z.boolean(),
  published_at: z.number().int().nullable(),
});

export const reviewDetailResponseSchema = z.object({
  review: cmsReviewDetailSchema,
});

export type CmsReviewsResponse = z.infer<typeof reviewsResponseSchema>;
export type CmsReviewDetailResponse = z.infer<typeof reviewDetailResponseSchema>;
