# R3 — THG Fulfill Content Parity (audit + progress)

**Status:** PARITY REACHED except the logistics gallery — 10 of 11 restored.
Base `migration/next-main` @ `d827066` · Branch `feat/Anh/r3-fulfill-premium-experience`

Sources compared:
`src/pages/THGFulfillPage.tsx` (434 L), `src/components/service-pages/FulfillHubSystemGuide.tsx`
(251 L), `src/lib/i18n/translations/fulfill.ts` (151 L) — vs `next/src/app/[lang]/thg-fulfill/`
and `next/src/features/fulfill/**`.

## Content parity matrix

| # | Vite section | Content source | Next status |
|---|---|---|---|
| 1 | Hero headline / subtitle / CTA | `hero_subtitle`, `hero_tagline`, CMS | ✅ present (different art direction) |
| 1a | Hero badge `POD & Dropship` | `pod_dropship_badge` | ✅ hero eyebrow pill |
| 1b | Platform logos | `platforms_label` + 5 literals | ✅ **restored** |
| 1c | POD transformation | `pod_process`, `blank_tshirt`, `dtg_print`, `your_brand`, `branded_product` | ✅ **restored** as a text-first process strip |
| 2 | YouTube Shorts ×2 | ids `AveVks7bdMM`, `UrnZpvRVb0U` | ✅ **restored (R3)** |
| 3 | Overview films ×3 | ids `UwaZw5Eh-Yg`, `ZA37yjN-_x8`, `6GkUcZhun90` | ✅ **restored (R3)** |
| 4 | Pain points ×4 | `pain_subtitle`, `pain_title`, `pain1–4_*` | ✅ **restored (R3)** |
| 5 | POD advantages | `solution_*`, `adv1_*`, `adv3_*` + image + video `2VEEFotO42I` | ✅ **restored** |
| 6 | Featured products | CMS `products[]` + labels | ✅ **restored** — basecost / in-house time / origin now separate model fields (B1 resolved) |
| 7 | Workflow / process ×4 | `process_title`, `step1–4_*` | ✅ present as the journey stepper (equivalent business steps) |
| 8 | Order-placement guide | `fulfill_ecount.*`, video `AzlW2irPANQ`, SKU sheet link | ✅ **restored** |
| 9 | HUB System guide (6 chapters) | `hub.*` | ✅ **restored** as an anchored document |
| 10 | HUB Fulfill System CTA | `hub_title/_desc/_cta` | ✅ **restored** |
| 11 | Policy CTA | `policy_*` → `/{lang}/policy` | ✅ **restored** |
| 12 | Logistics gallery (marquee) | `gallery_title` + CMS `gallery[]` | ❌ **still missing** — the only gap |
| 13 | FAQ | Vite 7 hardcoded; Next CMS-driven | ✅ **restored** — CMS first, localized 7-item fallback (B2 resolved) |
| 14 | Contact section | global | ✅ in the shared layout |

`fulfill.s1`–`s8` (warehouse fee table) are **not** on the Vite Fulfill page — they belong to
another route and are correctly absent here.

## Blockers — both RESOLVED

**B1 — product price / time / origin. RESOLVED by view-model evolution.** The CMS schema already
validated all three (`features/fulfill/schemas/services.ts`); the mapper was collapsing them into
one `note` string. `FulfillCatalogItem` now also carries `price`, `leadTime` and `origin`, and
`note` keeps its collapsed form as the fallback for products that carry none of them. No CMS
schema, DTO or API change.

**B2 — FAQ source of truth. RESOLVED by a graceful fallback.** The page reads the CMS first and
falls back to the seven localized questions the Vite page shipped when the CMS set is empty. The
decision lives in the page, which hands the SAME list to the accordion and to the FAQPage JSON-LD
— so visible answers and structured data cannot diverge. When the CMS reaches parity the fallback
simply stops being taken and can be deleted without touching the UI.

## Delivered in this branch

- `shared/service/service-video.tsx` — framed lazy YouTube embed, Server Component, zero client
  JS, privacy-enhanced `youtube-nocookie` host, per-video aspect ratio so CLS stays at zero.
  Reuses the pattern already proven in `features/home/ui/about-video-section`.
- `features/fulfill/ui/video-section.tsx` — Shorts ×2 (9/16) + overview films ×3. Ids and titles
  verbatim from the Vite page.
- `features/fulfill/ui/pain-points-section.tsx` — the four seller challenges, presented through
  the R2 `ServiceFeatureGrid` (pain number → `metric` slot) rather than a bespoke card.
- `features/fulfill/localized-content.ts` — `painEyebrow`, `painTitle`, `pains[4]` ported
  **verbatim** in vi/en/zh. Note the repos' `tr()` argument order differs (Vite `(en, vi, zh)`,
  Next `(vi, en, zh)`); the port swaps accordingly, which is the easiest way to silently ship
  mixed-language copy if missed.
- Page order now follows the Vite narrative: hero → problem → proof (video) → workflow.

Architecture untouched: no CMS schema/DTO/mapper/loader change, no SEO/metadata/JSON-LD change,
no route change, no change to any existing `shared/service` component's API (one additive export).

## Remaining work

**Logistics gallery — the only outstanding chapter.** Needs the CMS `gallery[]` field plumbed into
the fulfill model plus a marquee component. Its copy (`galleryTitle`) is already ported and is
deliberately retained in `parity-content.ts` for that slice.

## Architecture as implemented

- Restored copy lives in `features/fulfill/parity-content.ts`, a domain-shaped `LocalizedText`
  tree resolved once per locale — the same pattern as `localized-content.ts`.
- Sections are Server Components composed from the R2 shared template
  (`ServiceSectionHeader` / `ServiceFeatureGrid` / `ServiceVideo`). The only additive change to
  `shared/service` is the new `ServiceVideo` export; no existing component API changed.
- Every restored embed is a lazy iframe on the privacy-enhanced host, so full parity added **zero
  client JavaScript**.
- The FAQ decision is made once in the route and shared by the accordion and the JSON-LD.
- `tr()` argument order differs between the repos (Vite `(en, vi, zh)`, Next `(vi, en, zh)`); every
  ported value is swapped accordingly.
