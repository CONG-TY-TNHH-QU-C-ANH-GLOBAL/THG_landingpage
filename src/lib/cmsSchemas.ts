// Zod schemas for every CMS public response — single source of truth that
// `cmsClient.ts` pipes responses through, and that exports the consumer-facing
// TypeScript types via `z.infer<...>`. When CMS adds a new optional field,
// nothing breaks (Zod strips unknown keys by default). When CMS drops a
// required field or changes a type, parsing throws a structured ZodError that
// surfaces in the ErrorBoundary instead of crashing components with `undefined
// is not iterable`-style runtime errors.
//
// Convention:
//   - File-private schemas (rows, sub-objects) are camelCase ending in Schema
//   - Response-wrapper schemas (the literal JSON body) suffix with ResponseSchema
//   - Exported types use the existing TS naming (CmsService, CmsFaq, ...) so
//     callers don't have to relearn imports.

import { z } from "zod";

/* ---------- Primitive helpers ---------- */

export const localeSchema = z.enum(["en", "vi", "zh"]);
export type Locale = z.infer<typeof localeSchema>;

/** A trilingual string bundle (used by site-settings.terminology). */
const trilingualSchema = z.object({
  vi: z.string(),
  en: z.string(),
  zh: z.string(),
});

/* ---------- Services ---------- */

const cmsServiceGalleryItemSchema = z.object({
  url: z.string().optional(),
  media_id: z.number().optional(),
  alt: z.string().optional(),
});

const cmsServiceVideoSchema = z.object({
  youtube_id: z.string(),
  caption_key: z.string().optional(),
  caption: z.string().optional(),
  thumb: z.string().optional(),
});

const cmsServiceProductSchema = z.object({
  name: z.string(),
  price: z.string().optional(),
  time: z.string().optional(),
  origin: z.string().optional(),
  image: z.string().optional(),
  media_id: z.number().optional(),
});

export const cmsServiceSchema = z.object({
  id: z.string(),
  position: z.number(),
  icon: z.string().nullable(),
  status: z.enum(["draft", "live", "archived"]),
  name: z.string(),
  tagline: z.string().nullable(),
  hero_eyebrow: z.string().nullable(),
  hero_title: z.string().nullable(),
  hero_sub: z.string().nullable(),
  cta_text: z.string().nullable(),
  cta_url: z.string().nullable(),
  body_md: z.string().nullable(),
  bullets: z.array(z.string()),
  gallery: z.array(cmsServiceGalleryItemSchema),
  videos: z.array(cmsServiceVideoSchema),
  products: z.array(cmsServiceProductSchema),
});

export type CmsServiceGalleryItem = z.infer<typeof cmsServiceGalleryItemSchema>;
export type CmsServiceVideo = z.infer<typeof cmsServiceVideoSchema>;
export type CmsServiceProduct = z.infer<typeof cmsServiceProductSchema>;
export type CmsService = z.infer<typeof cmsServiceSchema>;

export const servicesResponseSchema = z.object({
  locale: localeSchema,
  services: z.array(cmsServiceSchema),
});

/* ---------- FAQ ---------- */

export const cmsFaqSchema = z.object({
  id: z.number(),
  position: z.number(),
  question: z.string(),
  answer: z.string(),
});
export type CmsFaq = z.infer<typeof cmsFaqSchema>;

export const faqsResponseSchema = z.object({
  locale: localeSchema,
  scope: z.string(),
  faqs: z.array(cmsFaqSchema),
});

/* ---------- Testimonials ---------- */

export const cmsTestimonialSchema = z.object({
  id: z.number(),
  position: z.number(),
  quote: z.string(),
  author_name: z.string(),
  author_role: z.string().nullable(),
  avatar_media_id: z.number().nullable(),
});
export type CmsTestimonial = z.infer<typeof cmsTestimonialSchema>;

export const testimonialsResponseSchema = z.object({
  locale: localeSchema,
  testimonials: z.array(cmsTestimonialSchema),
});

/* ---------- Contact locations ---------- */

export const cmsContactLocationSchema = z.object({
  id: z.number(),
  position: z.number(),
  kind: z.enum(["office", "warehouse", "phone", "email", "website"]),
  label: z.string(),
  address: z.string().nullable(),
  phone: z.string().nullable(),
  url: z.string().nullable(),
  lang_class: z.string().nullable(),
});
export type CmsContactLocation = z.infer<typeof cmsContactLocationSchema>;

export const contactLocationsResponseSchema = z.object({
  locale: localeSchema,
  locations: z.array(cmsContactLocationSchema),
});

/* ---------- Partners ---------- */

export const cmsPartnerSchema = z.object({
  id: z.number(),
  position: z.number(),
  name: z.string(),
  /** Absolute URL resolved by the CMS, or null when no logo is set. Unlike
   *  integrations (which exposes a raw media id the landing cannot resolve),
   *  this can go straight into an <img src>. */
  logo_url: z.string().nullable(),
  url: z.string().nullable(),
  tier: z.string().nullable(),
});
export type CmsPartner = z.infer<typeof cmsPartnerSchema>;

export const partnersResponseSchema = z.object({
  partners: z.array(cmsPartnerSchema),
});

/* ---------- Integrations ---------- */

export const cmsIntegrationSchema = z.object({
  id: z.number(),
  position: z.number(),
  name: z.string(),
  url: z.string().nullable(),
  color_class: z.string().nullable(),
  logo_media_id: z.number().nullable(),
});
export type CmsIntegration = z.infer<typeof cmsIntegrationSchema>;

export const integrationsResponseSchema = z.object({
  integrations: z.array(cmsIntegrationSchema),
});

/* ---------- Marquee images ---------- */

export const cmsMarqueeImageSchema = z.object({
  id: z.number(),
  position: z.number(),
  src: z.string(),
  alt_text: z.string(),
});
export type CmsMarqueeImage = z.infer<typeof cmsMarqueeImageSchema>;

export const marqueeImagesResponseSchema = z.object({
  images: z.array(cmsMarqueeImageSchema),
});

/* ---------- Site settings ---------- */

export const cmsRemoteAreaLinkSchema = z.object({
  label: z.string(),
  icon: z.string().optional(),
  url: z.string(),
});
export type CmsRemoteAreaLink = z.infer<typeof cmsRemoteAreaLinkSchema>;

export const cmsTerminologyTermSchema = z.object({
  term: trilingualSchema,
  desc: trilingualSchema,
});
export type CmsTerminologyTerm = z.infer<typeof cmsTerminologyTermSchema>;

export const cmsTerminologyGroupSchema = z.object({
  title: trilingualSchema,
  terms: z.array(cmsTerminologyTermSchema),
});
export type CmsTerminologyGroup = z.infer<typeof cmsTerminologyGroupSchema>;

export const cmsSiteSettingsSchema = z.object({
  brand_name: z.string(),
  ga4_id: z.string().nullable(),
  gtm_id: z.string().nullable(),
  fb_pixel_id: z.string().nullable(),
  tiktok_pixel_id: z.string().nullable(),
  contact_phone: z.string().nullable(),
  contact_email: z.string().nullable(),
  facebook_url: z.string().nullable(),
  // `lead_form_destination` is deliberately NOT declared. The CMS removed it from
  // GET /site-settings (operator config published on an unauthenticated endpoint,
  // with no reader here). It was declared `.nullable()`, which in zod still REQUIRES
  // the key — an absent key is `undefined`, not `null` — so the whole site-settings
  // response stopped parsing and every consumer of this endpoint (glossary, remote
  // area links, og image, contact info) silently fell back to empty.
  logo_media_id: z.number().nullable(),
  default_og_image_id: z.number().nullable(),
  about_video_url: z.string().nullable(),
  og_image_url: z.string().nullable(),
  remote_area_links: z.array(cmsRemoteAreaLinkSchema),
  // Fail-soft: the backend's parseTerminology only guarantees the OUTER value
  // is an array — it does NOT validate inner items. A single malformed group
  // used to fail the whole site-settings parse, taking down analytics/contact/
  // terminology site-wide. Drop bad groups instead so one bad row only loses
  // itself from the glossary. Output type stays CmsTerminologyGroup[].
  terminology: z
    .array(z.unknown())
    .catch([])
    .transform((arr) =>
      arr.filter(
        (item): item is CmsTerminologyGroup =>
          cmsTerminologyGroupSchema.safeParse(item).success,
      ),
    ),
});
export type CmsSiteSettings = z.infer<typeof cmsSiteSettingsSchema>;

export const siteSettingsResponseSchema = z.object({
  settings: cmsSiteSettingsSchema.nullable(),
});

/* ---------- Translations ---------- */

export const translationsResponseSchema = z.object({
  locale: localeSchema,
  translations: z.record(z.string(), z.string()),
});

/* ---------- Homepage blocks ---------- */

export const cmsHomepageBlockKindSchema = z.enum([
  "hero",
  "trust",
  "services_grid",
  "about_video",
  "marquee",
  "sellers",
  "process",
  "advantages",
  "integrations",
  "testimonials",
  "faq",
  "contact",
]);

export const cmsHomepageBlockSchema = z.object({
  id: z.number(),
  kind: cmsHomepageBlockKindSchema,
  position: z.number(),
  payload: z.record(z.string(), z.string()),
  locale: localeSchema,
});
export type CmsHomepageBlock = z.infer<typeof cmsHomepageBlockSchema>;

export const homepageResponseSchema = z.object({
  locale: localeSchema,
  blocks: z.array(cmsHomepageBlockSchema),
});

/* ---------- Pricing ---------- */

const pricingTableMetaSchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  kind: z.enum(["weight_grid", "meta_kv"]),
  version: z.number(),
  status: z.enum(["draft", "live", "archived"]),
  updated_at: z.number(),
  row_count: z.number(),
  col_count: z.number(),
});

export const pricingResponseSchema = z.object({
  categories: z.array(
    z.object({
      name: z.string(),
      tables: z.array(pricingTableMetaSchema),
    }),
  ),
});

export const pricingTableResponseSchema = z.object({
  table: z.object({
    id: z.number(),
    slug: z.string(),
    name: z.string(),
    kind: z.enum(["weight_grid", "meta_kv"]),
    description: z.string().nullable(),
    /** Shape varies per table — left as unknown so consumers narrow. */
    schema: z.unknown(),
    data: z.unknown(),
    version: z.number(),
    status: z.enum(["draft", "live", "archived"]),
    updated_at: z.number(),
  }),
});

/* ---------- Blog ---------- */

export const blogCategoriesResponseSchema = z.object({
  locale: localeSchema,
  categories: z.array(z.string()),
});

const blogPostSummarySchema = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string().nullable(),
  thumbnail_url: z.string().nullable(),
  category: z.string().nullable(),
  published_date: z.string().nullable(),
  updated_at: z.number(),
});

export const blogListResponseSchema = z.object({
  locale: localeSchema,
  posts: z.array(blogPostSummarySchema),
  total: z.number(),
});

const blogPostSlideSchema = z.object({
  src: z.string(),
  alt_text: z.string(),
});

export const blogPostResponseSchema = z.object({
  locale: localeSchema,
  post: z.object({
    slug: z.string(),
    title: z.string(),
    excerpt: z.string().nullable(),
    body_md: z.string().nullable(),
    thumbnail_url: z.string().nullable(),
    category: z.string().nullable(),
    published_date: z.string().nullable(),
    seo_title: z.string().nullable(),
    seo_description: z.string().nullable(),
    updated_at: z.number(),
    slides: z.array(blogPostSlideSchema),
  }),
});

/* ---------- Jobs / careers ---------- */

const jobSummarySchema = z.object({
  slug: z.string(),
  position: z.number(),
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
  posted_at: z.number(), // required — must match the CMS generated type (cross-check gate)
});

export const jobsResponseSchema = z.object({
  locale: localeSchema,
  jobs: z.array(jobSummarySchema),
  total: z.number(),
});

const jobBenefitSchema = z.object({ i: z.string(), t: z.string(), d: z.string() });

export const jobResponseSchema = z.object({
  locale: localeSchema,
  job: z.object({
    slug: z.string(),
    category: z.string().nullable(),
    hot: z.boolean(),
    badge: z.string().nullable(),
    tagline: z.string().nullable(),
    title: z.string(),
    body_md: z.string(),
    location: z.string().nullable(),
    employment_type: z.string().nullable(),
    salary: z.string().nullable(),
    salary_unit: z.string().nullable(),
    salary_note: z.string().nullable(),
    deadline: z.string().nullable(),
    experience: z.string().nullable(),
    posted_at: z.number(), // required — must match the CMS generated type (cross-check gate)
    lead: z.string().nullable(),
    responsibilities: z.record(z.string(), z.array(z.string())),
    requirements: z.array(z.string()),
    benefits: z.array(jobBenefitSchema),
    bonuses: z.array(z.string()),
  }),
});

/* ---------- Shipping routes ---------- */

const shippingRouteSummarySchema = z.object({
  slug: z.string(),
  position: z.number(),
  title: z.string(),
  origin: z.string().nullable(),
  destination: z.string().nullable(),
  kind: z.string().nullable(),
});

export const shippingRoutesResponseSchema = z.object({
  locale: localeSchema,
  routes: z.array(shippingRouteSummarySchema),
  total: z.number(),
});

const shippingTableSchema = z.object({
  caption: z.string().nullable(),
  columns: z.array(z.object({ key: z.string(), label: z.string() })),
  rows: z.array(z.record(z.string(), z.union([z.string(), z.number(), z.null()]))),
});

export const shippingRouteResponseSchema = z.object({
  locale: localeSchema,
  route: z.object({
    slug: z.string(),
    position: z.number(),
    title: z.string(),
    origin: z.string().nullable(),
    destination: z.string().nullable(),
    kind: z.string().nullable(),
    body_md: z.string().nullable(),
    notes: z.array(z.string()),
    tables: z.array(shippingTableSchema),
    updated_at: z.number(),
  }),
});

/* ---------- Policies ---------- */

export const cmsPolicyTextBlockSchema = z.object({
  type: z.enum(["normal", "warn", "info"]),
  heading: z.string(),
  content: z.array(z.string()),
});
export type CmsPolicyTextBlock = z.infer<typeof cmsPolicyTextBlockSchema>;

const policySummarySchema = z.object({
  slug: z.string(),
  title: z.string(),
  icon: z.string().nullable(),
  mode: z.enum(["image", "text"]),
  summary: z.string().nullable(),
  position: z.number(),
});

export const policiesResponseSchema = z.object({
  locale: localeSchema,
  policies: z.array(policySummarySchema),
});

export const policyResponseSchema = z.object({
  locale: localeSchema,
  policy: z.object({
    slug: z.string(),
    title: z.string(),
    icon: z.string().nullable(),
    mode: z.enum(["image", "text"]),
    body_md: z.string(),
    image_list: z.array(z.string()),
    text_blocks: z.array(cmsPolicyTextBlockSchema),
    summary: z.string().nullable(),
    position: z.number(),
    updated_at: z.number(),
    version: z.number(),
  }),
});

/* ---------- Mutation responses ---------- */

/** Successful POST /leads or /applicants — server returns the new row id. */
export const mutationOkResponseSchema = z.object({
  ok: z.literal(true),
  id: z.number(),
});

/** Successful POST /applicant-cv — server returns the R2 URL + filename + size. */
export const applicantCvUploadResponseSchema = z.object({
  url: z.string(),
  filename: z.string(),
  size: z.number(),
});

/* ---------- Generic service blocks (per-page card sections) ---------- */

/** Block kind drives which payload fields are expected by each landing
 *  renderer. Keep this list in sync with cmsthgfulfill/db/migrations/0017_*.sql */
export const serviceBlockKindSchema = z.enum([
  "pain_point",
  "process_step",
  "solution",
  "shipping_lane",
  "policy",
  "stat",
]);
export type ServiceBlockKind = z.infer<typeof serviceBlockKindSchema>;

/** Raw row as the public API emits it. `payload` is already a parsed object;
 *  consumers narrow it per `kind` via the discriminated unions below. */
export const serviceBlockSchema = z.object({
  id: z.number(),
  kind: z.string(),
  position: z.number(),
  icon: z.string().nullable(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  payload: z.record(z.string(), z.unknown()),
});
export type ServiceBlock = z.infer<typeof serviceBlockSchema>;

export const serviceBlocksResponseSchema = z.object({
  locale: localeSchema,
  page_slug: z.string(),
  kind: z.string().nullable(),
  blocks: z.array(serviceBlockSchema),
});

/* ---------- Lead form input (request body, not a response) ---------- */

export const cmsLeadInputSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
  source_page: z.string(),
  locale: localeSchema,
  utm: z.record(z.string(), z.string()).optional(),
  turnstile_token: z.string(),
});
export type CmsLeadInput = z.infer<typeof cmsLeadInputSchema>;

/* ---------- Community Hub (Q&A) ---------- */

// Wire shapes mirror cmsthgfulfill src/features/community/community.schemas.ts.
// Privacy: author_email/ip/utm never appear on the public wire — only
// author_name does. `indexable` is computed by the CMS (published AND verified
// AND non-empty expert answer); the detail page derives noindex from it.

const cmsCommunityCategoryRefSchema = z
  .object({
    slug: z.string(),
    name: z.string(),
  })
  .nullable();

export const communityCategoriesResponseSchema = z.object({
  categories: z.array(
    z.object({
      slug: z.string(),
      name: z.string(),
      position: z.number(),
    }),
  ),
});
export type CmsCommunityCategory = z.infer<
  typeof communityCategoriesResponseSchema
>["categories"][number];

const communityQuestionSummarySchema = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  category: cmsCommunityCategoryRefSchema,
  has_expert_answer: z.boolean(),
  verified: z.boolean(),
  indexable: z.boolean(),
  same_issue_count: z.number(),
  published_at: z.number().nullable(),
});
export type CmsCommunityQuestionSummary = z.infer<typeof communityQuestionSummarySchema>;

export const communityQuestionsResponseSchema = z.object({
  questions: z.array(communityQuestionSummarySchema),
});

const communityQuestionDetailSchema = z.object({
  slug: z.string(),
  title: z.string(),
  body: z.string(),
  category: cmsCommunityCategoryRefSchema,
  author_name: z.string(),
  expert_answer: z.string().nullable(),
  expert_answer_updated_at: z.number().nullable(),
  verified: z.boolean(),
  indexable: z.boolean(),
  same_issue_count: z.number(),
  published_at: z.number().nullable(),
});
export type CmsCommunityQuestionDetail = z.infer<typeof communityQuestionDetailSchema>;

export const communityQuestionResponseSchema = z.object({
  question: communityQuestionDetailSchema,
});

/** Successful POST /community/questions — always lands as pending moderation.
 *  `owner_token` is returned ONCE here; the browser stores it (keyed by slug)
 *  so the submitter can later withdraw their own question. Never present in
 *  list/detail responses. */
export const communityQuestionSubmitResponseSchema = z.object({
  ok: z.literal(true),
  id: z.number(),
  slug: z.string(),
  status: z.literal("pending"),
  // Optional so a submit still parses if the landing is deployed ahead of the
  // CMS that adds this field; withdrawal is simply not offered until present.
  owner_token: z.string().optional(),
});

/** Successful POST /community/questions/{slug}/withdraw. */
export const communityWithdrawResponseSchema = z.object({
  ok: z.literal(true),
  withdrawn: z.literal(true),
});

/** Successful POST /community/questions/{slug}/same-issue. `deduped` is true
 *  when this visitor already reacted (server dedupes by hashed IP). */
export const communitySameIssueResponseSchema = z.object({
  ok: z.literal(true),
  same_issue_count: z.number(),
  deduped: z.boolean(),
});

/** Request body for POST /community/questions (validated before sending). */
export const cmsCommunityQuestionInputSchema = z.object({
  title: z.string().min(8).max(200),
  body: z.string().min(20).max(5000),
  category_slug: z.string().optional(),
  author_name: z.string().min(1).max(80),
  author_email: z.string().email(),
  locale: localeSchema,
  utm: z.record(z.string(), z.string()).optional(),
  turnstile_token: z.string(),
});
export type CmsCommunityQuestionInput = z.infer<typeof cmsCommunityQuestionInputSchema>;

// ─── Verified Reviews (Sprint 4) ───────────────────────────────────────────
// Hand-written mirror of the CMS public review wire shapes. Self-contained so
// the landing parses reviews even when deployed ahead of the CMS that ships
// them (defensive: an empty list simply renders the empty state). Private
// fields (reviewer_email, ip, evidence, order ref, owner_token_hash) are never
// part of these shapes — the CMS never sends them.

const communityReviewSummarySchema = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  category: cmsCommunityCategoryRefSchema,
  rating: z.number().nullable(),
  verified: z.boolean(),
  indexable: z.boolean(),
  published_at: z.number().nullable(),
});
export type CmsCommunityReviewSummary = z.infer<typeof communityReviewSummarySchema>;

export const communityReviewsResponseSchema = z.object({
  reviews: z.array(communityReviewSummarySchema),
});

const communityReviewDetailSchema = z.object({
  slug: z.string(),
  title: z.string(),
  body: z.string(),
  category: cmsCommunityCategoryRefSchema,
  reviewer_name: z.string(),
  rating: z.number().nullable(),
  public_summary: z.string().nullable(),
  verified: z.boolean(),
  indexable: z.boolean(),
  published_at: z.number().nullable(),
});
export type CmsCommunityReviewDetail = z.infer<typeof communityReviewDetailSchema>;

export const communityReviewResponseSchema = z.object({
  review: communityReviewDetailSchema,
});

/** Successful POST /community/reviews — always lands as pending moderation.
 *  `owner_token` is returned ONCE; the browser stores it (keyed by review slug)
 *  so the submitter can later withdraw. Never present in list/detail. */
export const communityReviewSubmitResponseSchema = z.object({
  ok: z.literal(true),
  id: z.number(),
  slug: z.string(),
  status: z.literal("pending"),
  owner_token: z.string().optional(),
});

/** Request body for POST /community/reviews (validated before sending). */
export const cmsCommunityReviewInputSchema = z.object({
  title: z.string().min(8).max(200),
  body: z.string().min(20).max(5000),
  category_slug: z.string().optional(),
  reviewer_name: z.string().min(1).max(80),
  reviewer_email: z.string().email(),
  rating: z.number().int().min(1).max(5).optional(),
  locale: localeSchema,
  private_evidence_note: z.string().max(2000).optional(),
  private_order_reference: z.string().max(200).optional(),
  utm: z.record(z.string(), z.string()).optional(),
  turnstile_token: z.string(),
});
export type CmsCommunityReviewInput = z.infer<typeof cmsCommunityReviewInputSchema>;
