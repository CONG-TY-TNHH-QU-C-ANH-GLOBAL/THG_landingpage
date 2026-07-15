# THG Public Web — Architecture (`next/`)

Stable target architecture for M1–M10 under **ADR-001 Option A** (isolated `next/`; root
Vite is the recoverable production baseline; root promotion is M11-only). This document is
the ownership map; FND-001 implements only the foundation. No business feature is
implemented here.

## Layering

```
app         → composes feature public APIs; parses routes; owns metadata
features    → vertical slices; each exposes one public API (index.ts)
integrations→ external-system boundaries (transport/config/validation)
contracts   → versioned, framework-free cross-product contracts
shared      → cross-cutting primitives (config, errors, i18n, seo, analytics, security, ui, testing)
```

## Import & dependency rules (§10 — enforced by ESLint + `tests/architecture`)

- `app` may import: feature public APIs, `contracts`, `shared`.
- `features` may import: integration public APIs, `contracts`, `shared`.
- `integrations` may import: `contracts`, `shared/config`, `shared/errors`.
- `contracts` may **not** import: framework/application modules (React, Next, DB models,
  provider SDKs, UI types, CMS transport).
- `shared` may **not** import: `app`, `features`, `integrations`.
- A feature may **not** import another feature's internals.
- `app` routes may **not** import integration internals directly (go through a feature).
- `client` modules may **not** import server-only modules; server-only modules must not
  enter browser bundles (`server-only`).

Representative forbidden-import fixtures live in `tests/architecture/boundaries.test.ts` and
prove the gate fails correctly.

## App Router rules (§11)

- App Router, **strict TypeScript**, **Server Components by default**.
- **No page-level or layout-level `"use client"`.** Interactive behavior lives in explicit
  `*.client.tsx` files or a feature's `client/` directory.
- Route files only parse routes and compose feature public APIs — no raw CMS parsing, no
  feature mappers, no large UI in route files.
- Metadata belongs at route / page-family boundaries.
- **`proxy.ts` is not created in FND-001.** FND-002 introduces it for locale normalization.
  **Permanent rule:** `proxy.ts` may contain only URL normalization and approved redirects.
  It may **never** fetch CMS data, load dictionaries, or contain business logic.

## Feature map (§5)

`shell · home · services · pricing · catalog · blog · careers · policies · shipping-routes ·
community/{questions,reviews} · ask-thg · lead-capture · job-application · campaign-experience
· assistant (deferred)`. See `src/features/README.md`.

**Ownership correction — tracking:** the Landing owns **public catalog discovery** for
sellers. The Landing does **not** own tracking, order or shipment truth. There is **no
`features/tracking`**. The legacy `/{lang}/tracking` route becomes a safe deep-link to the
authenticated THG Hub under WEB-008 (via `integrations/hub`) — not in FND-001.

## Integration map (§6) — `src/integrations/README.md`

`cms` (public content transport; OpenAPI types; runtime DTO validation; transport/config/
errors only) · `catalog` (public catalog API boundary; no order/inventory/shipment/
workspace-private authority) · `hub` (approved Hub origin; safe deep-link builders; no
tracking API, no private Hub API, no arbitrary redirect URL, no forwarding of order/tracking
IDs or raw query strings) · `growth-os` (future cross-product boundary; no FND-001 work).

## Contracts map (§7) — `src/contracts/README.md`

`experience · intake · events · attribution`. Versioned cross-product contracts only; may
not import framework/app/UI/DB/provider modules.

## Shared map (§8) — `src/shared/README.md`

`config` (**implemented**: typed env, server/public split) · `errors` (**implemented**:
public-safe redaction) · `i18n · seo · analytics · security · ui · testing` (reserved by
owning specs). No `utils`/`helpers`/`common`/`misc`/ambiguous `lib` dumping grounds.

## Standard feature package (§9)

```
features/<feature>/
├── model/      # landing-domain models
├── schemas/    # runtime validation
├── mappers/    # external DTO → feature model
├── server/     # server-only loaders, queries, services
├── actions/    # mutation boundary
├── ui/         # Server Component-compatible UI by default
├── client/     # explicit interactive islands
├── tests/      # feature-local behavior tests
├── index.ts    # the feature public API
└── README.md
```

A feature creates only the subdirectories it uses, but may not invent a different topology
without an approved architecture change. **Raw CMS DTOs may never become public React
component props** (DTO → schema → mapper → model → props).

## Request-efficiency architecture (§13)

- Public page data is loaded **server-side**; the browser must not perform one CMS request
  per page section.
- Independent server fetches may run in parallel; duplicate requests are deduplicated.
- Public content receives an explicit cache/revalidation policy (FND-006); dynamic
  user-specific operations stay uncached and isolated.
- Client islands receive **mapped feature models**, not raw DTOs.
- **React Query is not introduced for public CMS reads by default**; no client-side fetch
  waterfall for initial public page content; no N+1 HTTP calls per list item/component.
- Content-hashed static assets use immutable caching.

The architecture test / performance budget (`tests/architecture`, `tests/performance`) lets
later phases detect browser request fan-out.
