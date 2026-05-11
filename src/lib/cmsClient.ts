// Fetch wrapper to CMS REST API. Used by useCmsContent hooks via TanStack Query.
// Base URL configured via VITE_CMS_API_URL env var.

const BASE = import.meta.env.VITE_CMS_API_URL || "http://localhost:8080/api/v1";

export type Locale = "en" | "vi" | "zh";

// ---------- Response types (mirror server) ----------

export interface CmsServiceGalleryItem {
  url?: string;
  media_id?: number;
  alt?: string;
}

export interface CmsServiceVideo {
  youtube_id: string;
  caption_key?: string;
  caption?: string;
  thumb?: string;
}

export interface CmsServiceProduct {
  name: string;
  price?: string;
  time?: string;
  origin?: string;
  image?: string;
  media_id?: number;
}

export interface CmsService {
  id: string;
  position: number;
  icon: string | null;
  status: "draft" | "live" | "archived";
  name: string;
  tagline: string | null;
  hero_eyebrow: string | null;
  hero_title: string | null;
  hero_sub: string | null;
  cta_text: string | null;
  cta_url: string | null;
  body_md: string | null;
  bullets: string[];
  gallery: CmsServiceGalleryItem[];
  videos: CmsServiceVideo[];
  products: CmsServiceProduct[];
}

export interface CmsFaq {
  id: number;
  position: number;
  question: string;
  answer: string;
}

export interface CmsTestimonial {
  id: number;
  position: number;
  quote: string;
  author_name: string;
  author_role: string | null;
  avatar_media_id: number | null;
}

export interface CmsContactLocation {
  id: number;
  position: number;
  kind: "office" | "warehouse" | "phone" | "email" | "website";
  label: string;
  address: string | null;
  phone: string | null;
  url: string | null;
  lang_class: string | null;
}

export interface CmsIntegration {
  id: number;
  position: number;
  name: string;
  url: string | null;
  color_class: string | null;
  logo_media_id: number | null;
}

export interface CmsMarqueeImage {
  id: number;
  position: number;
  src: string;
  alt_text: string;
}

export interface CmsRemoteAreaLink {
  label: string;
  icon?: string;
  url: string;
}

export interface CmsTerminologyTerm {
  term: { vi: string; en: string; zh: string };
  desc: { vi: string; en: string; zh: string };
}

export interface CmsTerminologyGroup {
  title: { vi: string; en: string; zh: string };
  terms: CmsTerminologyTerm[];
}

export interface CmsSiteSettings {
  brand_name: string;
  ga4_id: string | null;
  gtm_id: string | null;
  fb_pixel_id: string | null;
  tiktok_pixel_id: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  facebook_url: string | null;
  lead_form_destination: string | null;
  logo_media_id: number | null;
  default_og_image_id: number | null;
  about_video_url: string | null;
  remote_area_links: CmsRemoteAreaLink[];
  terminology: CmsTerminologyGroup[];
}

export interface CmsPolicyTextBlock {
  type: "normal" | "warn" | "info";
  heading: string;
  content: string[];
}

export interface CmsLeadInput {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source_page: string;
  locale: Locale;
  utm?: Record<string, string>;
  turnstile_token: string;
}

// ---------- Internal fetch helper ----------

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
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
  return (await res.json()) as T;
}

// ---------- API methods ----------

export interface CmsHomepageBlock {
  id: number;
  kind:
    | "hero"
    | "trust"
    | "services_grid"
    | "about_video"
    | "marquee"
    | "sellers"
    | "process"
    | "advantages"
    | "integrations"
    | "testimonials"
    | "faq"
    | "contact";
  position: number;
  payload: Record<string, string>;
  locale: Locale;
}

export const cmsClient = {
  getTranslations(locale: Locale) {
    return fetchJson<{ locale: Locale; translations: Record<string, string> }>(
      `/translations?lang=${locale}`,
    );
  },

  getHomepageBlocks(locale: Locale) {
    return fetchJson<{ locale: Locale; blocks: CmsHomepageBlock[] }>(
      `/homepage?lang=${locale}`,
    );
  },

  getServices(locale: Locale) {
    return fetchJson<{ locale: Locale; services: CmsService[] }>(
      `/services?lang=${locale}`,
    );
  },

  getFaqs(locale: Locale, scope = "home") {
    return fetchJson<{ locale: Locale; scope: string; faqs: CmsFaq[] }>(
      `/faqs?lang=${locale}&scope=${scope}`,
    );
  },

  getTestimonials(locale: Locale) {
    return fetchJson<{ locale: Locale; testimonials: CmsTestimonial[] }>(
      `/testimonials?lang=${locale}`,
    );
  },

  getContactLocations(locale: Locale) {
    return fetchJson<{ locale: Locale; locations: CmsContactLocation[] }>(
      `/contact-locations?lang=${locale}`,
    );
  },

  getIntegrations() {
    return fetchJson<{ integrations: CmsIntegration[] }>("/integrations");
  },

  getMarqueeImages() {
    return fetchJson<{ images: CmsMarqueeImage[] }>("/marquee-images");
  },

  getSiteSettings() {
    return fetchJson<{ settings: CmsSiteSettings | null }>("/site-settings");
  },

  getPricing() {
    return fetchJson<{
      categories: Array<{
        name: string;
        tables: Array<{
          slug: string;
          name: string;
          kind: "weight_grid" | "meta_kv";
          version: number;
          status: string;
          row_count: number;
          col_count: number;
        }>;
      }>;
    }>("/pricing");
  },

  getPricingTable(slug: string) {
    return fetchJson<{
      table: {
        slug: string;
        name: string;
        kind: "weight_grid" | "meta_kv";
        schema: unknown;
        data: unknown;
        version: number;
        status: string;
      };
    }>(`/pricing/${encodeURIComponent(slug)}`);
  },

  getBlogList(locale: Locale, category?: string) {
    const qs = new URLSearchParams({ lang: locale });
    if (category) qs.set("category", category);
    return fetchJson<{
      locale: Locale;
      posts: Array<{
        slug: string;
        title: string;
        excerpt: string | null;
        thumbnail_url: string | null;
        category: string | null;
        published_date: string | null;
        updated_at: number;
      }>;
      total: number;
    }>(`/blog?${qs.toString()}`);
  },

  getBlogPost(slug: string, locale: Locale) {
    return fetchJson<{
      locale: Locale;
      post: {
        slug: string;
        title: string;
        excerpt: string | null;
        thumbnail_url: string | null;
        category: string | null;
        published_date: string | null;
        seo_title: string | null;
        seo_description: string | null;
        updated_at: number;
        slides: Array<{ src: string; alt_text: string }>;
      };
    }>(`/blog/${encodeURIComponent(slug)}?lang=${locale}`);
  },

  getJobs(locale: Locale, category?: string) {
    const qs = new URLSearchParams({ lang: locale });
    if (category) qs.set("category", category);
    return fetchJson<{
      locale: Locale;
      jobs: Array<{
        slug: string;
        position: number;
        category: string | null;
        hot: boolean;
        badge: string | null;
        tagline: string | null;
        title: string;
        location: string | null;
        employment_type: string | null;
        salary: string | null;
        salary_unit: string | null;
        salary_note: string | null;
        deadline: string | null;
        experience: string | null;
      }>;
      total: number;
    }>(`/jobs?${qs.toString()}`);
  },

  getJob(slug: string, locale: Locale) {
    return fetchJson<{
      locale: Locale;
      job: {
        slug: string;
        category: string | null;
        hot: boolean;
        badge: string | null;
        tagline: string | null;
        title: string;
        body_md: string;
        location: string | null;
        employment_type: string | null;
        salary: string | null;
        salary_unit: string | null;
        salary_note: string | null;
        deadline: string | null;
        experience: string | null;
        lead: string | null;
        responsibilities: Record<string, string[]>;
        requirements: string[];
        benefits: Array<{ i: string; t: string; d: string }>;
        bonuses: string[];
      };
    }>(`/jobs/${encodeURIComponent(slug)}?lang=${locale}`);
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
    return fetchJson<{ ok: true; id: number }>("/applicants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  },

  /** Upload a CV (PDF/DOC/DOCX, ≤10MB) before submitting the applicant form. */
  async uploadApplicantCv(file: File): Promise<{ url: string; filename: string; size: number }> {
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
    return (await res.json()) as { url: string; filename: string; size: number };
  },

  getShippingRoutes(locale: Locale) {
    return fetchJson<{
      locale: Locale;
      routes: Array<{
        slug: string;
        position: number;
        title: string;
        origin: string | null;
        destination: string | null;
        kind: string | null;
      }>;
      total: number;
    }>(`/shipping-routes?lang=${locale}`);
  },

  getShippingRoute(slug: string, locale: Locale) {
    return fetchJson<{
      locale: Locale;
      route: {
        slug: string;
        position: number;
        title: string;
        origin: string | null;
        destination: string | null;
        kind: string | null;
        body_md: string | null;
        notes: string[];
        tables: Array<{
          caption: string | null;
          columns: Array<{ key: string; label: string }>;
          rows: Array<Record<string, string | number | null>>;
        }>;
        updated_at: number;
      };
    }>(`/shipping-routes/${encodeURIComponent(slug)}?lang=${locale}`);
  },

  getPolicies(locale: Locale) {
    return fetchJson<{
      locale: Locale;
      policies: Array<{
        slug: string;
        title: string;
        icon: string | null;
        mode: "image" | "text";
        summary: string | null;
        position: number;
      }>;
    }>(`/policies?lang=${locale}`);
  },

  getPolicy(slug: string, locale: Locale) {
    return fetchJson<{
      locale: Locale;
      policy: {
        slug: string;
        title: string;
        icon: string | null;
        mode: "image" | "text";
        body_md: string | null;
        image_list: string[];
        text_blocks: CmsPolicyTextBlock[];
        summary: string | null;
        position: number;
        updated_at: number;
        version: number;
      };
    }>(`/policies/${encodeURIComponent(slug)}?lang=${locale}`);
  },

  postLead(input: CmsLeadInput) {
    return fetchJson<{ ok: true; id: number }>("/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  },
};
