# R2 — Premium Service Experience

**Status:** IN IMPLEMENTATION · Base `migration/next-main` @ `0afcf2f` · Branch `feat/Anh/r2-service-experience`

## Goal

Turn THG Fulfill into the reusable **Service Experience** presentation template, without changing
content, CMS contracts or SEO. Express / Warehouse / Order adopt the same components later by
writing an adapter, not new UI.

## Key constraint discovered (drives the design)

`src/features/services/models/service-page.ts:5-7` records an approved decision: Fulfill must not
be folded into the generic `ServicePageContent` pipeline, because the two content models are
genuinely different —

| | Fulfill | Express / Warehouse / Order |
|---|---|---|
| Source | feature-local `FulfillCopy` + CMS overlay by stable role key | fully CMS-driven `blocksByKind` |
| Shape | fixed registries (4 journey, 7 capabilities, 3 sections) | variable-length block groups |

**Resolution:** separate *presentation* from *content*. `shared/service/` holds generic components
that accept plain view props. Each feature maps its own model → view props. The content pipelines
stay separate (the decision above holds); the presentation template becomes shared.

```text
CMS → schema → mapper → feature model → feature adapter → shared/service view props → UI
```

No DTO reaches a component. No mapper is bypassed.

## Components — `src/shared/service/`

All Server Components except where noted. All content-agnostic: no Fulfill vocabulary, no CMS types.

| Component | Props (view model) | Fulfill source | Later source |
|---|---|---|---|
| `ServiceSectionHeader` | `eyebrow, title, intro, align` | every section | same |
| `ServiceHero` | `eyebrow, headline, subtitle, points[], cta, media` | hero copy + CMS hero/bullets | `ServiceRecord` |
| `ServiceWorkflow` | `steps[] (3–6), reference, label` | 4 journey steps | `process_step` blocks |
| `ServiceFeatureGrid` | `features[] {icon,title,description,value?,tag?,metric?}, feature` | 7 capabilities | `solution` blocks |
| `ServiceIntegrationFlow` | `stages[], caption, title, description, icon` | `hubStages` + `hubCaption` | `shipping_lane` blocks |
| `ServiceFaq` | `faqs[], empty, community{href,label}` | fulfill FAQs | `ServiceFaq[]` |

`ServiceWorkflow` keeps the existing `JourneyStepper` client island as its interactive tab layer —
it is already accessible (`tablist`/`tab`, keyboard) and reduced-motion aware. It moves to
`shared/service/` and loses its Fulfill-shaped 4-tuple prop type so it accepts 3–6 steps.

**Deliberately NOT built** — each would be an abstraction with one shape and no second consumer,
which the DoD forbids. Each is built in the slice that first has a real second case:

- `ServiceMetrics`, `ServiceProblemSolution` — Fulfill has no metric or pain-point content, and
  inventing numbers or problem copy would violate "no rewritten copy / no placeholder". The CMS
  kinds that will feed them already exist (`stat`, `pain_point`, `solution`).
- `ServiceCta` — Fulfill's consultation is a bespoke dark surface (pill eyebrow, white heading,
  icon checklist, embedded form). Generalising it now would mean a tone system plus an eyebrow
  variant for a single caller. The section keeps its own markup; the generic CTA anatomy gets
  designed against Express/Warehouse/Order's `ctaText`/`ctaUrl` when they arrive.
- `ServiceProductGrid` — the catalog is three cards with a fallback; extracting it buys nothing
  until a second service page has products.

## Story order (Fulfill page)

Hero → Workflow → Features → Integration flow → Products → CTA → FAQ → Community.
Community stays attached to the FAQ/CTA tail as today (`ServiceFaq.community`), continuing the
journey rather than becoming a separate section with no content of its own.

## Preserved exactly

- Every existing string, every CMS field, every fallback path and empty state.
- `revalidate = 300`, SSG-first, server components; only the stepper and the lead CTA are client.
- SEO: metadata, canonical, hreflang, OpenGraph, Service + FAQ JSON-LD, sitemap registry — untouched.
- CMS schemas, mappers, models, loaders, `applyServiceBlocks` role registries — untouched.
- Section `id`s (`top`, `journey`, `capabilities`, `qa`) so existing anchors/tests keep working.

## Non-goals

Branding, copy, CMS/DTO/API/DB/migration changes, SEO contract changes, Express/Warehouse/Order
migration (this slice only makes it possible), metrics/problem-solution content.

## Acceptance

1. `bun run typecheck`, `lint`, `test`, `build` green.
2. `locale-routing-matrix.sh` + `seo-acceptance.sh` pass against the standalone artifact.
3. `/vi|/en|/zh /thg-fulfill` render every section with identical business content.
4. No `features/fulfill` type appears in `shared/service/` (architecture test).
5. Existing fulfill hero/stepper component tests still pass unchanged.
