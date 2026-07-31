import { z } from "zod";

// Transport DTOs for GET /jobs and GET /jobs/{slug}.
// Mirrors the frozen CMS contract [FACT: CMS src/features/careers/careers.schemas.ts].
// The four parsed-from-JSON detail fields are ALWAYS present on the wire (the handler falls
// back to {} / []), so they are required here rather than optional.

const localeSchema = z.enum(["en", "vi", "zh"]);

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

const jobDetailDtoSchema = jobSummaryDtoSchema.extend({
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
