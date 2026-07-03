# THG Community — Landing Boundaries

Landing-side view of the community system (Q&A + Verified Reviews). The
system-wide architecture, flow diagrams, and full reuse survey live in the
CMS repo: `cmsthgfulfill/docs/community/` (`ARCHITECTURE.md`,
`FLOW_DIAGRAMS.md`, `REUSE_BOUNDARIES.md`). This doc covers what the landing
repo owns and the rules it must not break.

## What landing is

A **public rendering client** of the CMS. It renders published community
content, hosts the submit dialogs, and keeps owner tokens in the browser.
It computes no moderation, verification, or indexability state — ever.

## Contract rules (landing side)

1. **Never derive `verified` or `indexable`.** Both arrive server-computed in
   every payload. Sitemap, prerender, `noindex`, and JSON-LD all key off the
   `indexable` flag as received.
2. **`noindex` is the safe default.** Detail pages emit
   `noindex={!item?.indexable}` — loading and 404 states are noindex.
3. **Sitemap/prerender include only `indexable === true` detail URLs**
   (`scripts/generate-sitemap.ts`, `scripts/prerender.mjs`), expanded ×3
   languages.
4. **Types are generated, never hand-edited.** `src/lib/cms-generated.d.ts`
   comes from `bun run generate:cms-types` (live CMS OpenAPI); CI runs
   `check:cms-types`. Regenerate after every CMS deploy that touches the
   contract.
5. **POST endpoints (submit/withdraw/same-issue) are hand-written client
   calls** — the CMS deliberately keeps them out of OpenAPI.
6. **Owner tokens stay in localStorage** (`thg_community_owner_v1`; review
   slugs namespaced via `reviewOwnerKey` → `review:{slug}`). The raw token is
   shown once by the CMS and never sent anywhere except the matching
   withdraw endpoint. It is **browser ownership, not authentication** — it
   must never gate anything beyond withdrawing that one item.

## Reusable mechanics (reuse these for future community UI)

| Mechanic | File |
|---|---|
| Q&A ↔ Reviews tabs | `src/components/community/CommunityTabs.tsx` |
| Category filter chips | `CommunityCategoryFilters` in `src/components/community/communityPageBits.tsx` |
| Review badge row (category/verified/rating) | `CommunityReviewBadges` in `communityPageBits.tsx` |
| Submit dialog shell + success panel | `CommunitySubmitDialog`, `SubmitSuccess` in `src/components/community/communityFormBits.tsx` |
| Form primitives (text, textarea, name/email, category select, submit button, Turnstile) | `communityFormBits.tsx` |
| Submit orchestration (validate → Turnstile → POST → done) | `useCommunitySubmitDialog` in `src/components/community/communitySubmit.ts` |
| Form field state | `src/hooks/useFormFields.ts` |
| Owner-token storage (namespaced) | `src/lib/communityOwner.ts` |
| Withdraw mechanics + button | `useCommunityWithdraw` (`src/components/community/communityWithdraw.ts`) + `CommunityWithdrawButton` (`communityPageBits.tsx`) — pages own the endpoint, copy, query key, redirect |
| Public data hooks (lists 15s staleTime, details 5m) | `useCommunity*` in `src/hooks/useCmsContent.ts` |
| SEO utilities | `SeoHead` noindex + `JsonLdQaPage`/`JsonLdReview`/`JsonLdBreadcrumb` in `src/components/seo/JsonLd.tsx` |
| i18n | `tr` + `useI18n` in `src/lib/i18n.tsx` |

## Domain-specific UI that must stay explicit

Keep these readable per domain — do not generalize into a "community entity
renderer":

- **Q&A**: question card copy, expert answer block, same-issue button
  (`CommunityPage.tsx`, `CommunityQuestionPage.tsx`).
- **Reviews**: rating stars input, verified badge semantics, public summary
  block (`CommunityReviewsListPage.tsx`, `CommunityReviewDetailPage.tsx`).
- **Future submission status page**: own page + copy, consuming a new
  server-computed status field.
- **Future shipping route filters**: own filter component — don't turn
  `CommunityCategoryFilters` into a filter framework.
- **Future compare-page SEO copy**: page-owned.

## Route map

| Route | Page |
|---|---|
| `/:lang/community` | `src/pages/community/CommunityPage.tsx` (Q&A list) |
| `/:lang/community/:slug` | `CommunityQuestionPage.tsx` (Q&A detail) |
| `/:lang/community/reviews` | `CommunityReviewsListPage.tsx` |
| `/:lang/community/reviews/:slug` | `CommunityReviewDetailPage.tsx` |
