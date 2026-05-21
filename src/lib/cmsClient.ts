// Fetch wrapper to CMS REST API. Used by useCmsContent hooks via TanStack Query.
// Base URL configured via VITE_CMS_API_URL env var.
//
// Every response runs through a Zod schema (see ./cmsSchemas) so a malformed
// CMS payload throws a structured ZodError caught by the route ErrorBoundary,
// instead of crashing components with `undefined is not iterable` runtime
// errors. The full set of consumer-facing types still ship from this module
// for backward compat — they are re-exported from cmsSchemas via z.infer.

import type { z } from "zod";

import {
  applicantCvUploadResponseSchema,
  blogListResponseSchema,
  blogPostResponseSchema,
  cmsLeadInputSchema,
  contactLocationsResponseSchema,
  faqsResponseSchema,
  homepageResponseSchema,
  integrationsResponseSchema,
  jobResponseSchema,
  jobsResponseSchema,
  marqueeImagesResponseSchema,
  mutationOkResponseSchema,
  policiesResponseSchema,
  policyResponseSchema,
  pricingResponseSchema,
  pricingTableResponseSchema,
  serviceBlocksResponseSchema,
  servicesResponseSchema,
  shippingRouteResponseSchema,
  shippingRoutesResponseSchema,
  siteSettingsResponseSchema,
  testimonialsResponseSchema,
  translationsResponseSchema,
} from "@/lib/cmsSchemas";

// Re-export every consumer-facing type so existing imports
// (`import type { CmsService } from "@/lib/cmsClient"`) keep working.
export type {
  CmsContactLocation,
  CmsFaq,
  CmsHomepageBlock,
  CmsIntegration,
  CmsLeadInput,
  CmsMarqueeImage,
  CmsPolicyTextBlock,
  CmsRemoteAreaLink,
  CmsService,
  CmsServiceGalleryItem,
  CmsServiceProduct,
  CmsServiceVideo,
  CmsSiteSettings,
  CmsTerminologyGroup,
  CmsTerminologyTerm,
  CmsTestimonial,
  Locale,
} from "@/lib/cmsSchemas";
import type { Locale } from "@/lib/cmsSchemas";

const BASE = import.meta.env.VITE_CMS_API_URL || "http://localhost:8080/api/v1";

// ---------- Internal fetch helper ----------

/** Fetch JSON from CMS and validate against a Zod schema. The returned type
 *  is inferred from the schema so callers never restate the shape inline. */
async function fetchJson<T extends z.ZodTypeAny>(
  path: string,
  schema: T,
  init?: RequestInit,
): Promise<z.infer<T>> {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(`CMS ${path}: ${message}`);
  }
  const json: unknown = await res.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    // Log structured errors then re-throw so TanStack Query treats this as a
    // failed fetch — ErrorBoundary catches and shows the fallback UI.
    // eslint-disable-next-line no-console
    console.error(`[CMS] Schema validation failed for ${path}:`, parsed.error.issues);
    throw new Error(`CMS ${path}: response shape mismatch`);
  }
  return parsed.data;
}

// ---------- API methods ----------

export const cmsClient = {
  getTranslations(locale: Locale) {
    return fetchJson(`/translations?lang=${locale}`, translationsResponseSchema);
  },

  getHomepageBlocks(locale: Locale) {
    return fetchJson(`/homepage?lang=${locale}`, homepageResponseSchema);
  },

  getServices(locale: Locale) {
    return fetchJson(`/services?lang=${locale}`, servicesResponseSchema);
  },

  /** Generic per-page card blocks (pain_point / process_step / solution /
   *  shipping_lane / policy / stat). Omit `kind` to fetch every block on
   *  the page in one round-trip. */
  getServiceBlocks(input: { page_slug: string; locale: Locale; kind?: string }) {
    const qs = new URLSearchParams({ page_slug: input.page_slug, lang: input.locale });
    if (input.kind) qs.set("kind", input.kind);
    return fetchJson(`/service-blocks?${qs.toString()}`, serviceBlocksResponseSchema);
  },

  getFaqs(locale: Locale, scope = "home") {
    return fetchJson(`/faqs?lang=${locale}&scope=${scope}`, faqsResponseSchema);
  },

  getTestimonials(locale: Locale) {
    return fetchJson(`/testimonials?lang=${locale}`, testimonialsResponseSchema);
  },

  getContactLocations(locale: Locale) {
    return fetchJson(`/contact-locations?lang=${locale}`, contactLocationsResponseSchema);
  },

  getIntegrations() {
    return fetchJson("/integrations", integrationsResponseSchema);
  },

  getMarqueeImages() {
    return fetchJson("/marquee-images", marqueeImagesResponseSchema);
  },

  getSiteSettings() {
    return fetchJson("/site-settings", siteSettingsResponseSchema);
  },

  getPricing() {
    return fetchJson("/pricing", pricingResponseSchema);
  },

  getPricingTable(slug: string) {
    return fetchJson(`/pricing/${encodeURIComponent(slug)}`, pricingTableResponseSchema);
  },

  getBlogList(locale: Locale, category?: string) {
    const qs = new URLSearchParams({ lang: locale });
    if (category) qs.set("category", category);
    return fetchJson(`/blog?${qs.toString()}`, blogListResponseSchema);
  },

  getBlogPost(slug: string, locale: Locale) {
    return fetchJson(`/blog/${encodeURIComponent(slug)}?lang=${locale}`, blogPostResponseSchema);
  },

  getJobs(locale: Locale, category?: string) {
    const qs = new URLSearchParams({ lang: locale });
    if (category) qs.set("category", category);
    return fetchJson(`/jobs?${qs.toString()}`, jobsResponseSchema);
  },

  getJob(slug: string, locale: Locale) {
    return fetchJson(`/jobs/${encodeURIComponent(slug)}?lang=${locale}`, jobResponseSchema);
  },

  postApplicant(input: {
    job_slug: string;
    name: string;
    email: string;
    phone?: string;
    cv_url?: string;
    cover_letter?: string;
    locale: Locale;
    source_page?: string;
    utm?: Record<string, string>;
    turnstile_token: string;
  }) {
    return fetchJson("/applicants", mutationOkResponseSchema, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  },

  /** Upload a CV (PDF/DOC/DOCX, ≤10MB) before submitting the applicant form. */
  async uploadApplicantCv(file: File) {
    const form = new FormData();
    form.append("file", file);
    const url = `${BASE}/applicant-cv`;
    const res = await fetch(url, { method: "POST", body: form });
    if (!res.ok) {
      let message = `${res.status} ${res.statusText}`;
      try {
        const body = (await res.json()) as { error?: string };
        if (body.error) message = body.error;
      } catch { /* ignore */ }
      throw new Error(message);
    }
    const parsed = applicantCvUploadResponseSchema.safeParse(await res.json());
    if (!parsed.success) {
      // eslint-disable-next-line no-console
      console.error("[CMS] /applicant-cv response shape mismatch:", parsed.error.issues);
      throw new Error("Applicant CV upload: response shape mismatch");
    }
    return parsed.data;
  },

  getShippingRoutes(locale: Locale) {
    return fetchJson(`/shipping-routes?lang=${locale}`, shippingRoutesResponseSchema);
  },

  getShippingRoute(slug: string, locale: Locale) {
    return fetchJson(`/shipping-routes/${encodeURIComponent(slug)}?lang=${locale}`, shippingRouteResponseSchema);
  },

  getPolicies(locale: Locale) {
    return fetchJson(`/policies?lang=${locale}`, policiesResponseSchema);
  },

  getPolicy(slug: string, locale: Locale) {
    return fetchJson(`/policies/${encodeURIComponent(slug)}?lang=${locale}`, policyResponseSchema);
  },

  postLead(input: z.infer<typeof cmsLeadInputSchema>) {
    // Validate the OUTGOING payload too — saves a server-side 400 round-trip
    // when a form field somehow ends up wrong-typed before submit.
    const parsed = cmsLeadInputSchema.parse(input);
    return fetchJson("/leads", mutationOkResponseSchema, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    });
  },
};
