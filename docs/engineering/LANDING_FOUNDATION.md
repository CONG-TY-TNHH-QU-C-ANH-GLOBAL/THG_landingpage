# Landing Foundation Conventions

> THG_landingpage is the **public client and rendering layer**. The CMS
> (cmsthgfulfill) is the backend and source of truth: it owns data,
> validation, moderation, and every visibility decision. This repo calls CMS
> APIs, renders the results, and owns the public trust/conversion surface.
>
> Community-specific boundaries live in [docs/community/](../community/ARCHITECTURE.md).

## Client boundary

| File | Owns |
|---|---|
| `src/lib/cmsClient.ts` | All CMS HTTP calls (base URL from `VITE_CMS_API_URL`) |
| `src/lib/cmsSchemas.ts` | Runtime Zod mirrors of CMS payloads |
| `src/hooks/useCmsContent.ts` | React Query hooks + cache policy (short staleTime for fast-moving lists, 5m for details) |
| `src/lib/cms-generated.d.ts` | **Generated** types from the CMS OpenAPI spec |

Pages and components never construct raw CMS URLs or parse raw responses —
they consume hooks. Landing never computes `verified`/`indexable` or any
other server-owned flag locally; it renders what the payload says.

## Generated CMS types rule

`cms-generated.d.ts` is regenerated with `bun run generate:cms-types` after
every CMS deploy that touches the contract, and gated in CI by
`check:cms-types`. Never hand-edit. Locally, point `VITE_CMS_API_URL` at a
running CMS (deployed URL works: `https://cms.thgfulfill.com/api/v1`).

## Route / page / component / hook / lib conventions

- `src/pages/` — route-level components: orchestrate data fetching, SEO
  (`SeoHead` + JSON-LD), layout, and page copy composition. No reusable UI
  definitions inline when two pages need them.
- `src/components/` — reusable presentational UI. Feature subfolders
  (`community/`, `lead/`, `sections/`, `seo/`) own their widgets;
  `components/ui/` is the shadcn-style primitive kit.
- `src/hooks/` — client mechanics as hooks (`useCmsContent`, `useFormFields`).
- `src/lib/` — non-React client mechanics (i18n, sanitize, storage, clients).
- `src/lib/i18n.tsx` holds the locale dictionary via the `tr(en, vi, zh)`
  helper; it is large (1300+ lines) and stays one file until a repo-wide
  split pattern exists — do not ad-hoc split it.

## SEO / prerender conventions

- Every public page renders `SeoHead` (title, description, canonical path,
  hreflang ×3 langs) and JSON-LD where a schema.org type fits
  (`src/components/seo/JsonLd.tsx`).
- `scripts/generate-sitemap.ts` (prebuild) and `scripts/prerender.mjs`
  (postbuild) consume public CMS GETs; content detail URLs are included only
  when the CMS-computed `indexable` flag is true.
- `noindex` is the safe default for loading/404/user-private states.
- Service/marketing pages are always indexable; never noindex them.

## Public service page design conventions

Express / Fulfill / Warehouse (and future service pages) share one visual
language:

- Navy + gold palette via theme tokens (`text-navy`, `bg-gradient-hero`,
  `text-gradient-gold`, `glass-card`); page-local hardcoded hex only where a
  sub-brand legitimately owns a color.
- Icons come from lucide-react (the installed family) — no emoji glyphs as
  icons.
- Sections use `SectionHeader` (`src/components/sections/`) and shared
  service-page pieces (`ServiceProcessSteps`, `ServiceFeatureCard`,
  `ServiceVideoCard` in `src/components/service-pages/`) where pages repeat a
  pattern; do not build a generic ServicePageBuilder.
- Community pages share their presentational shells via
  `src/components/community/communityPageBits.tsx`: `CommunityPageHeader`
  (hero), `CommunityStateNotice` (loading/error), `CommunityEmptyState`
  (icon-chip empty), plus the existing filters/badges/withdraw button. New
  community surfaces reuse these instead of hand-rolling state divs.
- Every page: hero with a visible CTA above the fold, `ScrollReveal` entry
  animation, `ContactSection` footer CTA, FAQ via `FAQAccordion`.
- All copy through `useI18n()` keys — no hardcoded user-facing strings
  (brand names excepted).

## Generated files rule

`cms-generated.d.ts` and anything `.gen.*` — never hand-edit.

## Where future service pages go

`src/pages/<Name>Page.tsx` + route in `App.tsx`; shared pieces in
`src/components/sections/`; copy keys in `i18n.tsx` under a `<page>_page.*`
prefix; SEO keys under `seo.*`; add the route to the sitemap's static list.
