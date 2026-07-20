import { z } from "zod";

import { cmsCategoryRefSchema } from "./categories";

// CMS wire shapes for community questions. Verified field-by-field against the CMS
// privacy mapper (CMS_management-/src/features/community/community.mappers.ts:
// toPublicSummary / toPublicDetail) — that allow-list is the privacy boundary, so
// these schemas deliberately mirror it exactly and nothing more.
//
// Fields that exist on the CMS row and must NEVER appear here: author_email, ip,
// user_agent, utm_json, owner_token_hash, withdrawn_at, status, category_id, locale.
// Zod strips unknown keys, so an accidental CMS leak still cannot reach a model.

export const cmsQuestionSummarySchema = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  category: cmsCategoryRefSchema.nullable(),
  has_expert_answer: z.boolean(),
  verified: z.boolean(),
  indexable: z.boolean(),
  same_issue_count: z.number().int(),
  /** Unix SECONDS, not milliseconds. Nullable even though the list orders by it. */
  published_at: z.number().int().nullable(),
});

export const questionsResponseSchema = z.object({
  questions: z.array(cmsQuestionSummarySchema),
});

// Detail drops has_expert_answer and adds body + the answer pair. `has_expert_answer`
// genuinely does not exist on this shape — derive it from expert_answer.
export const cmsQuestionDetailSchema = z.object({
  slug: z.string(),
  title: z.string(),
  body: z.string(),
  category: cmsCategoryRefSchema.nullable(),
  author_name: z.string(),
  expert_answer: z.string().nullable(),
  expert_answer_updated_at: z.number().int().nullable(),
  verified: z.boolean(),
  indexable: z.boolean(),
  same_issue_count: z.number().int(),
  published_at: z.number().int().nullable(),
});

export const questionDetailResponseSchema = z.object({
  question: cmsQuestionDetailSchema,
});

export type CmsQuestionsResponse = z.infer<typeof questionsResponseSchema>;
export type CmsQuestionDetailResponse = z.infer<typeof questionDetailResponseSchema>;
