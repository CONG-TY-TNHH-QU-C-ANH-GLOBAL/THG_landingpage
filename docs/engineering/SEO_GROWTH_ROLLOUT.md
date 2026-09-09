# SEO Growth System rollout

## Release order

1. Back up the production D1 database.
2. Deploy CMS migration `0045_seo_pages_and_qualified_leads.sql`.
3. Deploy the CMS Worker and verify `/api/v1/openapi`, `/api/v1/seo-pages`, and `/api/v1/sitemap`.
4. In CMS, review the seeded `route × locale` SEO records. Publish only records whose copy and translation have been reviewed.
5. Regenerate landing CMS types against production and commit the generated file.
6. Deploy landing. The production workflow must run with `SEO_BUILD_STRICT=1`; discovery, prerender, HTML validation, or production smoke failures are release failures.

Do not deploy landing before the CMS API. Strict mode intentionally rejects the missing SEO endpoint instead of silently using fallback metadata.

## Account-owned setup

- Set exactly one of `GTM_CONTAINER_ID` or `GA4_MEASUREMENT_ID` in CMS site settings. Prefer GTM; the direct GA4 loader is fallback only.
- Configure GA4 custom events for `form_start`, `select_service`, `view_pricing`, `generate_lead`, and `outbound_click`.
- Mark `generate_lead` as a key event only after validating it fires after a successful CMS response.
- Connect and verify the `https://thgfulfill.com` Search Console property, then submit `/sitemap.xml`.
- Export a 16-month GSC baseline and a GA4 baseline from the activation date. Segment by brand/non-brand, country, locale, landing page, and device.
- Never send form values, email, phone, company URL, or free-text content to analytics.

## Content and claim approval

Every price, SLA, capacity, warehouse-area, order-volume, address, partner, or customer claim needs an Ops/CEO owner and a stored source before publication. Placeholder ratings, certification badges, and unsupported KPIs are prohibited.

Use the CMS translation status as follows:

- `draft`: unfinished or not reviewed; do not publish/index.
- `reviewed`: approved for the locale and eligible for hreflang/sitemap.
- `stale`: source changed after review; remove from index eligibility until reviewed again.

AI may prepare drafts and outlines. A human must verify sources, add operational experience, assign an author/reviewer, and approve the final locale before it becomes live.

## Weekly scorecard

Track indexed URLs, Google-selected canonical, non-brand clicks, organic landing pages, lead conversion rate, qualified organic leads, pipeline stage, and first-response time. Compare day 90 with the 28-day period immediately before release.

Evaluate a framework migration only after day 45 when prerender is still incomplete, takes more than 10 minutes, or fails the 99% reliability target across three consecutive releases.
