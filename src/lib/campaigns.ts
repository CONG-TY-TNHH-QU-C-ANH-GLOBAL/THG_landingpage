// Campaigns ("Chương trình") — seasonal / discount programs managed in the CMS.
//
// Types are defined here, not in cms-generated.d.ts: that file is regenerated
// from the live CMS OpenAPI spec, and the campaigns endpoint ships in a
// separate CMS deploy. The shapes follow the CMS ↔ landing contract:
//   GET /api/v1/campaigns?lang=      → { locale, campaigns: Campaign[] }
//   GET /api/v1/campaigns/:slug?lang= → { campaign: CampaignDetail, available_locales }
//
// `nav_featured` / `home_featured` are EFFECTIVE flags computed by the CMS
// (toggle on AND live AND not past end_date), so the landing never re-checks
// dates — it only picks the first flagged campaign in array order.

import { z } from "zod";

import { localeSchema } from "@/lib/cmsSchemas";

export const campaignMenuItemSchema = z.object({
  icon: z.string(),
  title: z.string(),
  subtitle: z.string().nullable(),
  href: z.string(),
});
export type CampaignMenuItem = z.infer<typeof campaignMenuItemSchema>;

export const campaignSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string().nullable(),
  cover_url: z.string().nullable(),
  og_image_url: z.string().nullable(),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
  position: z.number(),
  landing_path: z.string().nullable(),
  cta_label: z.string().nullable(),
  nav_featured: z.boolean(),
  nav_label: z.string().nullable(),
  nav_badge: z.string().nullable(),
  home_featured: z.boolean(),
  menu_items: z.array(campaignMenuItemSchema),
  updated_at: z.number(),
});
export type Campaign = z.infer<typeof campaignSchema>;

export const campaignDetailSchema = campaignSchema.extend({
  body_md: z.string().nullable(),
  seo_title: z.string().nullable(),
  seo_description: z.string().nullable(),
});
export type CampaignDetail = z.infer<typeof campaignDetailSchema>;

export const campaignsResponseSchema = z.object({
  locale: localeSchema,
  campaigns: z.array(campaignSchema),
});
export const campaignResponseSchema = z.object({
  campaign: campaignDetailSchema,
  available_locales: z.array(localeSchema).optional().default([]),
});

/** First campaign the CMS flags for the navbar, or null when none. */
export function pickNavFeatured(campaigns: readonly Campaign[] | undefined): Campaign | null {
  return campaigns?.find((c) => c.nav_featured) ?? null;
}

/** First campaign the CMS flags for the home banner, or null when none. */
export function pickHomeFeatured(campaigns: readonly Campaign[] | undefined): Campaign | null {
  return campaigns?.find((c) => c.home_featured) ?? null;
}

/** A resolved link: internal paths go through the router with the language
 *  prefix, absolute https URLs stay plain anchors. */
export type CampaignHref = { kind: "internal"; to: string } | { kind: "external"; href: string };

/**
 * Resolve a contract href (`landing_path` or `menu_items[].href`).
 * Internal = starts with a single "/" and carries no language prefix;
 * external = absolute https URL. Anything else (http:, javascript:, "//host",
 * bare relative paths) is rejected so a CMS typo can never render an unsafe
 * or broken link.
 */
export function resolveCampaignHref(href: string | null | undefined, language: string): CampaignHref | null {
  const value = href?.trim();
  if (!value) return null;
  if (value.startsWith("/") && !value.startsWith("//")) {
    return { kind: "internal", to: `/${language}${value}` };
  }
  if (/^https:\/\/[^/\s]+/i.test(value)) return { kind: "external", href: value };
  return null;
}

/** Where a campaign leads: its landing when set, otherwise its detail page. */
export function campaignLandingHref(campaign: Pick<Campaign, "slug" | "landing_path">, language: string): CampaignHref {
  return (
    resolveCampaignHref(campaign.landing_path, language) ?? {
      kind: "internal",
      to: `/${language}/campaigns/${encodeURIComponent(campaign.slug)}`,
    }
  );
}

function formatDay(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
}

/** "20/10/2026 – 25/12/2026"; either side may be missing. Empty when both are. */
export function formatCampaignDates(start: string | null, end: string | null): string {
  if (start && end && start !== end) return `${formatDay(start)} – ${formatDay(end)}`;
  if (start) return formatDay(start);
  if (end) return `→ ${formatDay(end)}`;
  return "";
}
