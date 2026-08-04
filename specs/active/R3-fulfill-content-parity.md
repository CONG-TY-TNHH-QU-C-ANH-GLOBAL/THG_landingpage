# R3 — THG Fulfill Content Parity (audit + progress)

**Status:** PARTIAL — 2 of 11 missing sections restored. **Not done.**
Base `migration/next-main` @ `d827066` · Branch `feat/Anh/r3-fulfill-premium-experience`

Sources compared:
`src/pages/THGFulfillPage.tsx` (434 L), `src/components/service-pages/FulfillHubSystemGuide.tsx`
(251 L), `src/lib/i18n/translations/fulfill.ts` (151 L) — vs `next/src/app/[lang]/thg-fulfill/`
and `next/src/features/fulfill/**`.

## Content parity matrix

| # | Vite section | Content source | Next status |
|---|---|---|---|
| 1 | Hero headline / subtitle / CTA | `hero_subtitle`, `hero_tagline`, CMS | ✅ present (different art direction) |
| 1a | Hero badge `POD & Dropship` | `pod_dropship_badge` | ❌ **missing** |
| 1b | Platform logos (Shopify, Etsy, WooCommerce, Amazon, TikTok Shop) | `platforms_label` + 5 literals | ❌ **missing** |
| 1c | POD illustration (blank → DTG/DTF → branded) | `pod_process`, `blank_tshirt`, `dtg_print`, `your_brand`, `branded_product` | ❌ **missing** (Next shows a different product stage) |
| 2 | YouTube Shorts ×2 | ids `AveVks7bdMM`, `UrnZpvRVb0U` | ✅ **restored (R3)** |
| 3 | Overview films ×3 | ids `UwaZw5Eh-Yg`, `ZA37yjN-_x8`, `6GkUcZhun90` | ✅ **restored (R3)** |
| 4 | Pain points ×4 | `pain_subtitle`, `pain_title`, `pain1–4_*` | ✅ **restored (R3)** |
| 5 | POD advantages | `solution_subtitle/_highlight/_desc`, `adv1_*`, `adv3_*` + ladicdn image + video `2VEEFotO42I` | ❌ **missing** |
| 6 | Featured products | CMS `products[]` + `products_subtitle/_title`, `basecost_label`, `time_label` | ⚠️ **partial** — Next renders name/image/note only; **price, time, origin are not in the Next model** (see Blocker B1) |
| 7 | Workflow / process ×4 | `process_title`, `step1–4_*` | ✅ present as the journey stepper (equivalent business steps) |
| 8 | Ecount / order-placement guide | `fulfill_ecount.*` (~20 strings), video `AzlW2irPANQ`, Google-Sheets SKU link | ❌ **missing** |
| 9 | HUB System guide (6 chapters) | `hub.*` (~25 strings) | ❌ **missing** |
| 10 | HUB Fulfill System CTA | `hub_title`, `hub_desc`, `hub_cta` | ❌ **missing** |
| 11 | Policy CTA | `policy_title`, `policy_desc`, `policy_cta` → `/{lang}/policy` | ❌ **missing** |
| 12 | Logistics gallery (marquee) | `gallery_title` + CMS `gallery[]` | ❌ **missing** |
| 13 | FAQ | Vite: 7 hardcoded `faq1–7_*`. Next: CMS-driven | ⚠️ **not comparable** — see Blocker B2 |
| 14 | Contact section | global | ✅ in the shared layout |

`fulfill.s1`–`s8` (warehouse fee table) are **not** on the Vite Fulfill page — they belong to
another route and are correctly absent here.

## Blockers found (need a decision — cannot be fixed inside R3's constraints)

**B1 — product price / time / origin.** Vite renders `product.price`, `product.time`,
`product.origin`. The Next model `FulfillCatalogItem` is `{ name, image, note }`
(`features/fulfill/models/fulfill.ts`), so those three fields do not exist in the landing model.
Restoring them means editing the fulfill mapper/model — explicitly forbidden by this sprint
("DO NOT touch CMS schema, DTO, mapper, loader"). Either the constraint is relaxed for the
catalog mapper, or product parity stays open.

**B2 — FAQ source of truth.** Vite ships 7 FAQs hardcoded in the i18n dictionary. Next reads
published fulfill-scope FAQs from the CMS. "Do not reduce FAQ count" is only checkable against
CMS content, and hardcoding the 7 back would bypass the CMS pipeline the migration exists to
establish. Needs an owner decision: seed the 7 into the CMS, or accept CMS as the authority.

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

## Remaining work, in dependency order

1. Hero completion (1a, 1b, 1c) — copy exists, no CMS dependency.
2. POD advantages (5) — copy exists; needs the ladicdn image and video `2VEEFotO42I`.
3. Policy CTA (11) and HUB Fulfill CTA (10) — copy exists, no CMS dependency.
4. Ecount guide (8) and HUB System guide (9) — ~45 strings to port; the largest remaining chunk.
5. Logistics gallery (12) — needs a marquee component and the CMS `gallery[]` field.
6. Products (6) — blocked on B1.
7. FAQ (13) — blocked on B2.
