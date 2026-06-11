// TanStack Query hooks for fetching CMS content.
// Each hook is keyed by content type + locale (where applicable).
// Cache strategy: stale 5 min, refetch on focus/reconnect for freshness.

import { useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";

import { cmsClient, type Locale } from "@/lib/cmsClient";

const STALE_MS = 5 * 60 * 1000; // 5 minutes — matches CMS edge cache TTL
const GC_MS = 30 * 60 * 1000;   // 30 minutes

export function useCmsTranslations(locale: Locale) {
  return useQuery({
    queryKey: ["cms", "translations", locale],
    queryFn: () => cmsClient.getTranslations(locale),
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
}

/**
 * Fetches homepage_blocks for the given locale. Each block has a `kind`
 * (hero/trust/process/about_video/...) and a `payload` of string key/value.
 * Components read their block payload via .find((b) => b.kind === "hero")
 * and fall back to translation keys when CMS hasn't been edited yet.
 */
export function useCmsHomepageBlocks(locale: Locale) {
  return useQuery({
    queryKey: ["cms", "homepage", locale],
    queryFn: () => cmsClient.getHomepageBlocks(locale),
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
}

/**
 * Convenience: returns the payload object for a specific homepage block kind,
 * or `{}` when the block is missing / still loading. Components use this to
 * override i18n keys with CMS-edited copy.
 */
export function useHomepageBlock(
  locale: Locale,
  kind: import("@/lib/cmsClient").CmsHomepageBlock["kind"],
): Record<string, string> {
  const { data } = useCmsHomepageBlocks(locale);
  return data?.blocks.find((b) => b.kind === kind)?.payload ?? {};
}

export function useCmsServices(locale: Locale) {
  return useQuery({
    queryKey: ["cms", "services", locale],
    queryFn: () => cmsClient.getServices(locale),
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
}

export function useCmsFaqs(locale: Locale, scope = "home") {
  return useQuery({
    queryKey: ["cms", "faqs", locale, scope],
    queryFn: () => cmsClient.getFaqs(locale, scope),
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
}

/** Fetch generic service blocks for one page+locale, optionally filtered to
 *  a single kind. Returns the parent query result so callers can render
 *  loading/error/fallback states explicitly. */
export function useCmsServiceBlocks(input: { page_slug: string; locale: Locale; kind?: string }) {
  return useQuery({
    queryKey: ["cms", "service-blocks", input.page_slug, input.locale, input.kind ?? "all"],
    queryFn: () => cmsClient.getServiceBlocks(input),
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
}

export function useCmsTestimonials(locale: Locale) {
  return useQuery({
    queryKey: ["cms", "testimonials", locale],
    queryFn: () => cmsClient.getTestimonials(locale),
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
}

export function useCmsContactLocations(locale: Locale) {
  return useQuery({
    queryKey: ["cms", "contact-locations", locale],
    queryFn: () => cmsClient.getContactLocations(locale),
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
}

export function useCmsIntegrations() {
  return useQuery({
    queryKey: ["cms", "integrations"],
    queryFn: () => cmsClient.getIntegrations(),
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
}

export function useCmsMarqueeImages() {
  return useQuery({
    queryKey: ["cms", "marquee-images"],
    queryFn: () => cmsClient.getMarqueeImages(),
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
}

export function useCmsSiteSettings() {
  return useQuery({
    queryKey: ["cms", "site-settings"],
    queryFn: () => cmsClient.getSiteSettings(),
    select: (res) => res.settings,
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
}

// Pricing data is operator-edited frequently. Refetch on every page mount so
// admins see their just-saved changes without a hard refresh / 5-minute wait.
export function useCmsPricing() {
  return useQuery({
    queryKey: ["cms", "pricing"],
    queryFn: () => cmsClient.getPricing(),
    staleTime: STALE_MS,
    gcTime: GC_MS,
    refetchOnMount: "always",
  });
}

export function useCmsPricingTable(slug: string) {
  return useQuery({
    queryKey: ["cms", "pricing", slug],
    queryFn: () => cmsClient.getPricingTable(slug),
    staleTime: STALE_MS,
    gcTime: GC_MS,
    enabled: !!slug,
    refetchOnMount: "always",
  });
}

export function useCmsBlogCategories(locale: Locale) {
  return useQuery({
    queryKey: ["cms", "blog", "categories", locale],
    queryFn: () => cmsClient.getBlogCategories(locale),
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
}

export function useCmsBlogList(locale: Locale, category?: string) {
  return useQuery({
    queryKey: ["cms", "blog", "list", locale, category ?? "all"],
    queryFn: () => cmsClient.getBlogList(locale, category),
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
}

export function useCmsJobs(locale: Locale, category?: string) {
  return useQuery({
    queryKey: ["cms", "jobs", "list", locale, category ?? "all"],
    queryFn: () => cmsClient.getJobs(locale, category),
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
}

export function useCmsJob(slug: string, locale: Locale) {
  return useQuery({
    queryKey: ["cms", "job", slug, locale],
    queryFn: () => cmsClient.getJob(slug, locale),
    staleTime: STALE_MS,
    gcTime: GC_MS,
    enabled: !!slug,
    retry: false,
  });
}

export function useCmsShippingRoutes(locale: Locale) {
  return useQuery({
    queryKey: ["cms", "shipping-routes", "list", locale],
    queryFn: () => cmsClient.getShippingRoutes(locale),
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
}

export function useCmsShippingRoute(slug: string, locale: Locale) {
  return useQuery({
    queryKey: ["cms", "shipping-route", slug, locale],
    queryFn: () => cmsClient.getShippingRoute(slug, locale),
    staleTime: STALE_MS,
    gcTime: GC_MS,
    enabled: !!slug,
    retry: false,
  });
}

export function useCmsPolicies(locale: Locale) {
  return useQuery({
    queryKey: ["cms", "policies", "list", locale],
    queryFn: () => cmsClient.getPolicies(locale),
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
}

export function useCmsPolicy(slug: string, locale: Locale) {
  return useQuery({
    queryKey: ["cms", "policy", slug, locale],
    queryFn: () => cmsClient.getPolicy(slug, locale),
    staleTime: STALE_MS,
    gcTime: GC_MS,
    enabled: !!slug,
    retry: false,
  });
}

export function useCmsBlogPost(slug: string, locale: Locale) {
  return useQuery({
    queryKey: ["cms", "blog", "post", slug, locale],
    queryFn: () => cmsClient.getBlogPost(slug, locale),
    staleTime: STALE_MS,
    gcTime: GC_MS,
    enabled: !!slug,
    retry: false,
  });
}

/**
 * Aggregator: fetches the full list of pricing tables, then in parallel pulls each
 * table's data and exposes it as a flat map { slug: dataArray }.
 * Mirrors the historic Lark sheets overlay shape so InternationalPricingPage /
 * DomesticPricingPage can use it as a drop-in replacement for the dead stub overlay.
 *
 * Returns {} while loading or on error — pages handle empty overlay
 * by showing a "data unavailable" message.
 */
export function useCmsPricingOverlay(): {
  overlay: Record<string, unknown>;
  isLoading: boolean;
  isLive: boolean;
  lastUpdated: number | null;
} {
  const list = useCmsPricing();
  const slugs = useMemo(() => {
    if (!list.data) return [] as string[];
    return list.data.categories.flatMap((c) => c.tables.map((t) => t.slug));
  }, [list.data]);

  const tableQueries = useQueries({
    queries: slugs.map((slug) => ({
      queryKey: ["cms", "pricing", slug],
      queryFn: () => cmsClient.getPricingTable(slug),
      staleTime: STALE_MS,
      gcTime: GC_MS,
      refetchOnMount: "always" as const,
    })),
  });

  return useMemo(() => {
    // CMS pricing data shape varies per slug — weight_grid tables are arrays
    // (e.g. vnThuong, cnThuong), while meta_kv tables are objects (e.g.
    // expressVnUs has { hcm: { saver, expedited }, hn: {...} }). Pass through
    // whatever the table holds, as long as the row was loaded.
    const overlay: Record<string, unknown> = {};
    let allLoaded = true;
    for (const q of tableQueries) {
      if (q.isLoading) allLoaded = false;
      const t = q.data?.table;
      if (!t || t.data == null) continue;
      overlay[t.slug] = t.data;
    }
    return {
      overlay,
      isLoading: list.isLoading || (slugs.length > 0 && !allLoaded),
      isLive: slugs.length > 0 && Object.keys(overlay).length > 0,
      lastUpdated: Date.now(),
    };
  }, [tableQueries, list.isLoading, slugs.length]);
}
