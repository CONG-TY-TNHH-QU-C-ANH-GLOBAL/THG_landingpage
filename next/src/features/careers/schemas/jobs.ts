import { z } from "zod";

import { SUPPORTED_LOCALES } from "@/shared/i18n";

// Transport DTOs for GET /jobs and GET /jobs/{slug}.
// Mirrors the frozen CMS contract [FACT: CMS src/features/careers/careers.schemas.ts].
// The four parsed-from-JSON detail fields are ALWAYS present on the wire (the handler falls
// back to {} / []), so they are required here rather than optional.

// Derived from the canonical locale list rather than restating it (shared/i18n owns the set).
const localeSchema = z.enum(SUPPORTED_LOCALES);

const jobSummaryDtoSchema = z.object({
  slug: z.string(),
  position: z.number().int(),
  category: z.string().nullable(),
  hot: z.boolean(),
  badge: z.string().nullable(),
  tagline: z.string().nullable(),
  title: z.string(),
  location: z.string().nullable(),
  employment_type: z.string().nullable(),
  salary: z.string().nullable(),
  salary_unit: z.string().nullable(),
  salary_note: z.string().nullable(),
  deadline: z.string().nullable(),
  experience: z.string().nullable(),
  posted_at: z.number().int(),
});

export const jobsResponseSchema = z.object({
  locale: localeSchema,
  jobs: z.array(jobSummaryDtoSchema),
  // Parsed then ignored: the list is unpaginated and `total` equals jobs.length.
  total: z.number().int(),
});

export type JobsResponseDto = z.infer<typeof jobsResponseSchema>;

// Abbreviated by CMS convention: i = icon name, t = title, d = description.
const jobBenefitDtoSchema = z.object({
  i: z.string(),
  t: z.string(),
  d: z.string(),
});

// The detail projection is the summary MINUS `position`, plus six fields. `position` is the
// operator's ordering for the LIST and the detail endpoint does not send it
// [FACT: CMS careers.schemas.ts:74-95 — jobDetailSchema declares no position].
//
// This was a plain `.extend()`, which made `position` a REQUIRED field of the detail contract.
// Every /jobs/{slug} response therefore failed shape validation, so every job detail page in
// production rendered the "temporarily unavailable" fallback — silently, because that fallback
// is indistinguishable from a real outage. Verified against the live CMS: 6 of 7 postings,
// in all three locales. `.omit()` keeps the fourteen shared fields tied to one definition
// while stating the one documented difference, rather than re-typing them and inviting drift.
const jobDetailDtoSchema = jobSummaryDtoSchema.omit({ position: true }).extend({
  body_md: z.string(),
  lead: z.string().nullable(),
  responsibilities: z.record(z.string(), z.array(z.string())),
  requirements: z.array(z.string()),
  benefits: z.array(jobBenefitDtoSchema),
  bonuses: z.array(z.string()),
});

export const jobResponseSchema = z.object({
  locale: localeSchema,
  job: jobDetailDtoSchema,
});

export type JobResponseDto = z.infer<typeof jobResponseSchema>;
