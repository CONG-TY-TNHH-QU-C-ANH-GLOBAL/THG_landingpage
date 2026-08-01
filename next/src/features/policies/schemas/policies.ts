import { z } from "zod";

// Transport DTOs for GET /policies and GET /policies/{slug}.
//
// Mirrors the frozen CMS contract [FACT: CMS src/features/policies/policies.schemas.ts,
// declared at /api/v1/policies and /api/v1/policies/{slug}]. Two deliberate widenings
// relative to the server schema, both defensive rather than speculative:
//
//   - `body_md` is `.nullable()` here. The CMS column is NOT NULL and the server declares
//     it non-null, but the landing must not hard-fail a whole page if a row ever lands
//     null; the mapper collapses null to "".
//   - `updated_at` / `version` are optional. They exist on the CMS wire but the landing
//     renders neither, and depending on them would couple this page to fields it does not
//     use.
//
// Unknown keys are stripped by Zod, so an additive CMS change (e.g. a future `block_key`)
// never breaks this consumer.

const localeSchema = z.enum(["en", "vi", "zh"]);
const policyModeSchema = z.enum(["image", "text"]);

const policyTextBlockDtoSchema = z.object({
  type: z.enum(["normal", "warn", "info"]),
  heading: z.string(),
  content: z.array(z.string()),
});

const policySummaryDtoSchema = z.object({
  slug: z.string(),
  title: z.string(),
  icon: z.string().nullable(),
  mode: policyModeSchema,
  summary: z.string().nullable(),
  position: z.number().int(),
});

export const policiesResponseSchema = z.object({
  locale: localeSchema,
  policies: z.array(policySummaryDtoSchema),
});

export type PoliciesResponseDto = z.infer<typeof policiesResponseSchema>;

const policyDetailDtoSchema = z.object({
  slug: z.string(),
  title: z.string(),
  icon: z.string().nullable(),
  mode: policyModeSchema,
  body_md: z.string().nullable(),
  image_list: z.array(z.string()),
  text_blocks: z.array(policyTextBlockDtoSchema),
  summary: z.string().nullable(),
  position: z.number().int(),
});

export const policyResponseSchema = z.object({
  locale: localeSchema,
  policy: policyDetailDtoSchema,
});

export type PolicyResponseDto = z.infer<typeof policyResponseSchema>;
