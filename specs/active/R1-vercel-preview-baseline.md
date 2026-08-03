# R1 — Vercel Preview & Environment Baseline

## 1. Status

| Field | Value |
|---|---|
| Slice ID | R1 (repository-local; **not** a registered governance spec — see §15 blocker B2) |
| State | **DRAFT — specification only, not approved, not implemented** |
| Spec branch | `spec/Anh/vercel-preview-baseline` |
| Canonical base | `migration/next-main` @ `6c14fb36d3d774b261cdd725574ff1c3e2d5bbc0` ("feat(landing): migrate service and tracking routes (#85)") |
| Target repository | `THG_landingpage` (nested app `next/`) |
| Production impact | **None.** R1 changes no production DNS, no production runtime, no `main`, no `deploy.yml`. |
| Blocking | B1, B2, B3, B4, B5 (§15) must be resolved by the owner before implementation begins |

This document is derived **only** from inspected repository state at the base SHA above and
from the governance workspace `THG_public_platform_specs` (a sibling working directory, not a
git repository). Every current-state claim below carries a file/line citation. Statements about
Vercel platform behaviour that this repository cannot prove are marked **UNVERIFIED** and are
converted into acceptance evidence the implementer must produce, never into assumed fact.

---

## 2. Problem

The Next migration application under `next/` has, at the base SHA, exactly one runtime story:
a self-contained standalone Node artifact intended for the existing VPS behind nginx +
systemd. Evidence:

- `next/next.config.ts:14-16` — `output: "standalone"`, `outputFileTracingRoot: projectRoot`,
  header comment "ADR-000 / P4: standalone Node on the current VPS is the initial runtime".
- `next/ops/README.md` — `systemd/thg-next.service.candidate`, `nginx/thg-next.conf.candidate`,
  explicitly "not installed", "not enabled", "do not switch traffic".
- `.github/workflows/migration-ci.yml:60-95` — CI builds the standalone artifact, packages it,
  boots `node .next/standalone/server.js` on `127.0.0.1:3000` and probes it.

Consequences today:

1. **No shared, reviewable, browser-reachable environment exists for the migration line.** Every
   review of a migrated route is either a local `bun dev` session or a CI log. `migration-ci.yml`
   is deliberately non-deploying (`.github/workflows/migration-ci.yml:5-8`: "NON-DEPLOYING by
   design ... NEVER deploys").
2. **Route-migration slices are accumulating on `migration/next-main` without runtime review
   evidence.** The queue records this directly: every merged item carries a blocker of the form
   "MERGED into migration/next-main only ... NOT VERIFIED" (`IMPLEMENTATION_QUEUE.yaml`, Q-001,
   Q-004..Q-008), and human VERIFIED is defined as requiring "non-production build/e2e/staging
   parity" evidence that no current environment produces.
3. **The local dev path is currently degraded.** Measured on the maintainer machine on the same
   codebase: `next dev` (Turbopack, Next 16.2.10) leaks ~20–34 MB per rendered page request and
   terminates with a V8 heap OOM; `next dev --webpack` is flat. This makes long local review
   sessions unreliable and increases the value of a hosted preview. It is **context, not a
   goal**: R1 must not upgrade or change the framework (§5).

R1 exists to close gap (1) with the smallest possible, fully reversible platform footprint, and
to do so without granting a Preview environment any capability to affect production.

---

## 3. Verified Current State

All paths relative to repository root. Line numbers are at base SHA `6c14fb3`.

### 3.1 Application and runtime declarations

| Fact | Evidence |
|---|---|
| Next `16.2.10`, React/ReactDOM `19.2.7`, Zod `4.4.3` | `next/package.json` dependencies |
| Package manager: bun; the nested app has **its own** lockfile | `next/bun.lock` present and committed; `next/.gitignore` comment "the application lockfile bun.lock IS committed" |
| Repository root is a **separate** Vite application with its own `package.json`, `bun.lock`, `package-lock.json` | root `package.json`, `bun.lock`, `package-lock.json` |
| Node floor `>=20.9.0` | `next/package.json` `engines.node` |
| Repo-root Node pin is `20` | `.node-version` (root), `.nvmrc` (root) |
| **`next/` contains no `.node-version` and no `.nvmrc`** | directory listing of `next/` |
| Scripts: `dev`, `dev:webpack`, `dev:doctor`, `dev:clean`, `build`, `package:standalone`, `start`, `lint`, `typecheck`, `test`, `test:watch`, `perf:*` | `next/package.json` scripts |
| CI installs with `bun install --frozen-lockfile`, bun pinned to `1.3.13` | `.github/workflows/migration-ci.yml:44-49` |

### 3.2 `next/next.config.ts`

- `output: "standalone"`, `outputFileTracingRoot: projectRoot`, `turbopack: { root: projectRoot }`,
  `experimental: { globalNotFound: true }` (`next/next.config.ts:13-19`).
- The default export is a **phase function**. At `PHASE_PRODUCTION_BUILD` it **throws** when
  `NEXT_PUBLIC_CMS_API_URL` is unset or blank (`next/next.config.ts:28-35`).
- There is **no** `headers()`, `redirects()`, `rewrites()`, `images`, or `env` configuration.
  Global security headers are therefore not owned by the app at this SHA (FND-009 is
  `NOT_READY` in `IMPLEMENTATION_QUEUE.yaml`, Q-003).

### 3.3 Request-edge configuration

- `next/src/proxy.ts` performs **URL mechanics only**: locale decision via
  `decodeLocaleRoute`, 308 redirect (`LOCALE_REDIRECT_STATUS = 308`,
  `next/src/shared/i18n/config/locale-routing.ts:6`), query preserved verbatim.
- Matcher: `"/((?!api|_next|favicon.ico|foundation-probe.txt|.*[.][^/]*$).*)"`
  (`next/src/proxy.ts` `config`).
- The module header states a permanent prohibition: proxy "must never fetch CMS data, load
  dictionaries, make network requests, do auth/identity/PII/lead/analytics work, set locale
  cookies, or detect browser language / geolocation".

### 3.4 Environment access — the complete, code-verified inventory

There is exactly one owner per class. **No new env owner is needed for R1.**

| Variable | Read by | Binding time | Behaviour when unset |
|---|---|---|---|
| `CMS_API_URL` | `next/src/shared/cms/cmsFetch.ts` → `resolveCmsBaseUrl` | server runtime | dev/test/build → `http://localhost:8080/api/v1`. **Production runtime → throws** ("CMS_API_URL is required in production") when `NODE_ENV==="production"` and `NEXT_PHASE!=="phase-production-build"` |
| `NEXT_PUBLIC_CMS_API_URL` | `next/src/shared/config/env.public.ts` → `resolvePublicCmsApiUrl`; consumed by `next/src/shared/ui/lead-api.ts` and `next/src/features/community/client/community-api.ts` | **build time** (inlined into client bundle) | dev/test → localhost default. **Production → throws**, and `next.config.ts` fails the build first |
| `NEXT_PUBLIC_SITE_URL` | `next/src/shared/config/env.public.ts` → `next/src/shared/seo/site.ts` `resolveSiteOrigin` | build time | defaults to `https://thgfulfill.com`; invalid or non-http(s) value throws |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `next/src/shared/config/env.public.ts` → `next/src/shared/ui/turnstile.ts` | build time | `TURNSTILE_SITE_KEY = ""` → forms send the literal `DEV_BYPASS` token |
| `NODE_ENV` | `next/src/shared/config/env.server.ts` `parseNodeEnv` | runtime | defaults `development`; any value outside `development\|production\|test` throws |
| `PORT` | `next/src/shared/config/env.server.ts` `parsePort` | runtime | defaults `3000`; non-integer or out-of-range throws |

Nothing else is read from `process.env` in `next/src`. **No `VERCEL_*` variable is read
anywhere in the repository.**

Documented template: `next/.env.example` (all values optional for local dev; production values
described as deployment-owned, "MIG-010").

### 3.5 CMS access semantics

- Reads are **unauthenticated**: `cmsFetch` sets only `Accept: application/json` unless a caller
  passes `init.headers`; no callers pass credentials (`next/src/shared/cms/cmsFetch.ts`).
  A read-only Preview therefore needs **no secret**.
- Reads are bounded (`DEFAULT_CMS_TIMEOUT_MS = 8000`), single-attempt, no retry.
- Failure taxonomy is typed and distinct: `CmsHttpError` / `CmsParseError` / `CmsShapeError` /
  `CmsNetworkError` (`next/src/shared/cms/errors.ts`), mapped to degraded states via
  `next/src/shared/cms/degraded.ts`. Loaders keep READY / EMPTY / NOT_FOUND / UNAVAILABLE
  distinct (e.g. `next/src/features/blog/server/loaders.ts` returns `status: "unavailable"`
  rather than fabricating content).
- **Writes go from the browser directly to `NEXT_PUBLIC_CMS_API_URL`**:
  - `next/src/shared/ui/lead-api.ts` → `POST ${CMS_BASE}/leads`
  - `next/src/features/community/client/community-api.ts` → question / review / same-issue POSTs
  There is no server-side write path and no Next Route Handler proxying writes.

### 3.6 SEO / indexing behaviour

- `next/src/app/robots.ts` emits **allow-all**: explicit `allow: "/"` for ten named bots plus
  `{ userAgent: "*", allow: "/" }`, and `Sitemap: ${resolveSiteOrigin()}/sitemap.xml`.
  There is **no** environment branch and **no** noindex path in this file.
- `next/src/app/sitemap.ts` expands the static registry in
  `next/src/shared/seo/indexable-routes.ts` × locales, using `localeUrl` (built on
  `resolveSiteOrigin`). `/catalog` and `/international-pricing` are recorded in
  `NON_INDEXABLE_ROUTES` as `BLOCKED_BY_CONTRACT` — they are intentionally absent routes, which
  is why they 404.
- Per-route `noindex` is emitted by individual `generateMetadata` implementations for
  locale-empty content, not globally.

### 3.7 Existing acceptance tooling (reusable as-is)

All three runtime validation scripts are **`BASE_URL`-parameterised**:

| Script | Usage header | Notes |
|---|---|---|
| `next/scripts/validation/locale-routing-matrix.sh` | `BASE_URL=http://127.0.0.1:3000 ...` | asserts 308 + `Location` equal to `${BASE}/vi`, `<html lang>` per locale, dotted-route normalisation, bypasses, 404s |
| `next/scripts/validation/seo-acceptance.sh` | `BASE_URL=... [SITE_ORIGIN=...]` | **asserts the PRODUCTION origin independent of `BASE_URL`** — see its line 4-8 header and `SITE="${SITE_ORIGIN:-https://thgfulfill.com}"`. Also asserts `lacks "noindex"` in the HTML of `/vi`, `/en`, `/zh` |
| `next/scripts/validation/community-acceptance.sh` | `BASE_URL=http://127.0.0.1:3000 ...` | HTTP-status and rendered-HTML facts, notably hard 404s |

Two consequences, load-bearing for R1:

- **(C1)** If Preview sets `NEXT_PUBLIC_SITE_URL` to the preview hostname, `seo-acceptance.sh`
  fails unless `SITE_ORIGIN` is also overridden. Leaving it unset keeps canonical/hreflang/og:url
  pointing at production and lets the script run unmodified.
- **(C2)** If Preview indexing is suppressed by injecting an HTML `noindex` meta tag,
  `seo-acceptance.sh` **fails** (`lacks "${URL}" "noindex"`). Preview de-indexing must therefore
  be achieved at the transport/platform layer (response header or access protection), not in
  rendered HTML.

Health contract: `GET /api/health` → `{"status":"ok","service":"thg-public-web","runtime":"next"}`
with `Cache-Control: no-store`, `dynamic = "force-dynamic"` (`next/src/app/api/health/route.ts`).
Public probe: `public/foundation-probe.txt`.

### 3.8 CI / deployment workflows

| Workflow | Trigger | Deploys? |
|---|---|---|
| `.github/workflows/migration-ci.yml` | `pull_request` and `push` on `migration/next-main` | **No** — "NON-DEPLOYING by design ... NEVER deploys" |
| `.github/workflows/deploy.yml` | `push:[main]`, `workflow_dispatch`, `repository_dispatch: cms-content-updated`; guarded by `if: github.ref == 'refs/heads/main'` | Yes — the **current production** Vite deploy line |
| `.github/workflows/pr-check.yml` | `pull_request` on `main`; `migration/*` is an explicit bypass pattern | No |

### 3.9 Vercel footprint today

**Zero in tracked source.** A case-insensitive content search for `vercel` across the repository
matches exactly one path, `next/.next/dev/types/server.d.ts` — generated, gitignored build
output re-exporting Next's own bundled `@vercel/og` types, i.e. a framework internal, not a
project decision. The same search across the governance workspace `THG_public_platform_specs`
returns no files at all. There is no `vercel.json`, no `.vercel/` entry in `.gitignore` (root `.gitignore`
ignores `.env`, `.env.*`, but not `.vercel`), and no Vercel reference in any ADR, FND spec, MIG
document, `SPEC_REGISTRY.yaml` or `IMPLEMENTATION_QUEUE.yaml`.

### 3.10 Governance position

- `ADR-001` selected Option A: isolated `next/`; root Vite remains the recoverable production
  baseline (`next/ARCHITECTURE.md` header; `next/next.config.ts:6`).
- `IMPLEMENTATION_QUEUE.yaml` header: "Q-023 (MIG-010, M10) is the ONLY queue item authorized to
  integrate the migration line into `main` and change the deployment runtime; ...
  `production_runtime_changed` stays false for every item until Q-023."
- `06-migration/06-environment-migration-map.csv` defines the target env vocabulary and assigns
  deployment-time values to MIG-010; it lists no hosting platform other than the VPS
  (`SERVER_HOST/USER/SSH_KEY/PORT` GitHub secrets, `PORT` + supervisor unit on VPS).
- There is **no** governance identifier `R1` and no queue item for a Vercel platform
  introduction.

---

## 4. Goal

Establish a **Preview-only** Vercel baseline for the `next/` application such that:

1. The `next/` app builds and serves on Vercel from a Preview deployment produced from
   `migration/next-main` and from pull requests targeting it.
2. The environment variable inventory required by that Preview is **explicit, minimal, and
   scoped to Preview** — derived from §3.4, not invented.
3. Preview reads real CMS content over an approved read-only origin and **cannot** write to
   production data.
4. Preview deployments are **not publicly indexable and not publicly reachable** as an
   unprotected mirror of the site.
5. Production is provably unaffected: `main`, `deploy.yml`, the VPS runtime, DNS, and
   `thgfulfill.com` behaviour are unchanged.
6. The existing acceptance scripts (§3.7) run **unmodified** against the Preview URL and pass.
7. The platform footprint in the repository is small enough to delete in one revert
   ("Vercel-first, not Vercel-trapped").

---

## 5. Non-Goals

R1 **must not** do any of the following. Each is either owned elsewhere or explicitly deferred.

| Excluded | Owner / reason |
|---|---|
| Production DNS cutover, domain assignment, `thgfulfill.com` changes | MIG-010 / Q-023 (M10) |
| Any Vercel **Production** deployment or production-branch mapping | Q-023 only |
| Replacing or retiring the VPS/standalone runtime, `ops/` candidates, `package:standalone` | FND-010 / MIG-010 |
| CMS on-demand revalidation, `REVALIDATE_SECRET`, `/api/revalidate` | FND-006 / MIG-003 (M9) |
| Cache-tag architecture; assigning meaning to the reserved `revalidate`/`tags` slots in `cmsFetch` | FND-006 (`cmsFetch.ts` marks them "RESERVED") |
| Observability / analytics framework, Sentry, Vercel Analytics or Speed Insights | FND-008 / FND-007 |
| CSP, HSTS or HSTS preload, global security headers | FND-009 (Q-003, `NOT_READY`, blocked on OQ-P-004) |
| Next.js version change, bundler default change, or any response to the Turbopack dev memory issue | out of scope; the dev-mode defect does not justify a framework move under R1 |
| Migrating additional routes, or changing any migrated route's behaviour | route slices (WEB-*) |
| Introducing Kubernetes, Redis, a custom CDN, or an edge runtime | no evidence, no approved need |
| Reading `VERCEL_ENV` / `VERCEL_URL` inside `next/src` | would couple application code to one platform; violates "Vercel-first, not Vercel-trapped" |
| Modifying `deploy.yml`, `pr-check.yml`, or `migration-ci.yml` | R1 needs none of them (§8) |

---

## 6. Architecture / Runtime Contracts

### C-1 — Deployment topology

The Vercel project builds **only** `next/`. The repository root is a distinct Vite application
with its own manifest and lockfiles (§3.1); building from the root would build the wrong app.
The Vercel project's Root Directory must therefore be `next`, and the build must resolve
`next/bun.lock`.

`outputFileTracingRoot`/`turbopack.root` are already pinned to `next/`
(`next/next.config.ts:15-16`), which is consistent with a `next/`-rooted build. R1 must not
widen them.

### C-2 — `output: "standalone"` (**UNVERIFIED — blocker B1**)

`output: "standalone"` exists to serve the VPS artifact and is depended on by
`package:standalone` and by the `migration-ci.yml` standalone smoke step (§3.1, §3.8). Whether
Vercel's build pipeline accepts this app unchanged with `output: "standalone"` is **not
knowable from this repository** and must be established empirically before R1 is considered
implementable. Permitted resolutions, in preference order, are recorded in §15/B1. Deleting
`output: "standalone"` is **not** an acceptable resolution, because it would break the VPS
artifact path and the CI proof that guards it.

### C-3 — Runtime environment contract on Preview

A Vercel Preview is produced by `next build` and served as a production build, so both build and
runtime are expected to observe `NODE_ENV=production`. That expectation follows from Next's own
build semantics; it is **not** independently verified against Vercel here, and NT-1/NT-2 exist
precisely to prove it empirically. Combined with §3.4 it yields two **hard** requirements, both
derived from repository code rather than platform documentation:

- **`NEXT_PUBLIC_CMS_API_URL` must be present in the Preview BUILD environment**, or
  `next.config.ts` throws and the deployment fails (`next/next.config.ts:28-35`).
- **`CMS_API_URL` must be present in the Preview RUNTIME environment**, or `resolveCmsBaseUrl`
  throws on the first server-side CMS read. That throw is a plain `Error`, not a `CmsError`;
  loaders rethrow non-`CmsError` values (e.g. `next/src/features/blog/server/loaders.ts`
  `if (!(postsSettled.reason instanceof CmsError)) throw postsSettled.reason;`), so it becomes
  a render failure, not a degraded state. Every locale route would 500.

`PORT` and `NODE_ENV` must **not** be set manually on Vercel; the platform supplies them and
`env.server.ts` validates them (`parseNodeEnv` throws on any unexpected value).

### C-4 — Site origin contract on Preview

`NEXT_PUBLIC_SITE_URL` **must remain unset** in the Preview scope. Rationale, both directions
evidenced:

- Unset → `resolveSiteOrigin` returns `https://thgfulfill.com`
  (`next/src/shared/seo/site.ts` `DEFAULT_SITE_ORIGIN`), so canonical / hreflang / og:url /
  `robots.txt` `Sitemap:` on a Preview point at production. A Preview page can never present
  itself as a self-canonical duplicate of the production site.
- Set to the preview hostname → the preview becomes self-canonical (an indexing hazard if
  protection ever lapses) **and** `seo-acceptance.sh` fails (§3.7 C1).

Consequence to accept explicitly: Preview `sitemap.xml` lists production URLs, and Preview
`robots.txt` points at the production sitemap. This is correct behaviour for R1 and must not be
"fixed" by adding environment branching to `robots.ts` or `site.ts`.

### C-5 — Indexing and reachability contract

Preview deployments must be non-indexable and non-public. Because §3.7 C2 forbids an HTML
`noindex`, the control must be one or both of:

- an access-protection layer in front of Preview deployments (requests without authorisation do
  not receive page HTML), and/or
- a response **header** (`X-Robots-Tag`) applied by the platform to preview hostnames.

Whether Vercel applies `X-Robots-Tag: noindex` to preview deployments by default is
**UNVERIFIED here** and must be proven by observed response headers (§12 AC-8), not asserted.

### C-6 — Data-plane contract

Cloudflare remains the CMS/API plane; the Vercel Preview is a **read client only**:

- Server reads: unauthenticated `GET`s via `cmsFetch` to `CMS_API_URL` (§3.5). No credential is
  required and none may be added.
- Browser writes: `POST` to `NEXT_PUBLIC_CMS_API_URL` from `lead-api.ts` /
  `community-api.ts` (§3.5). **This is the only production-mutation vector a Preview has**, and
  it is a build-time inlined value. Its Preview value is blocker B5.
- The degraded-state taxonomy is untouched: R1 adds no loader, no mapper, no fallback, and does
  not alter READY / EMPTY / NOT_FOUND / UNAVAILABLE.
- `UNAVAILABLE` cache poisoning: R1 assigns **no** `revalidate` value and **no** cache tag, and
  changes no existing one. The reserved slots in `cmsFetch` stay reserved (FND-006).

### C-7 — Reversibility contract

The full R1 footprint must be removable by (a) reverting one commit in this repository and
(b) deleting one Vercel project. No application module, route, loader, layout, or SEO file may
acquire a Vercel dependency.

---

## 7. Expected Ownership / Codebase Impact

**Existing canonical owners are sufficient. R1 creates no new `shared/`, `platform/`,
`integration/`, `config/`, or `environment/` owner.**

| Concern | Existing canonical owner | R1 action |
|---|---|---|
| Public/browser env | `next/src/shared/config/env.public.ts` | **no change** — values are supplied by the platform, not by new code |
| Server env | `next/src/shared/config/env.server.ts` | **no change** |
| Server CMS base | `next/src/shared/cms/cmsFetch.ts` (`resolveCmsBaseUrl`) | **no change** |
| Site origin / SEO | `next/src/shared/seo/site.ts` | **no change** (C-4) |
| Robots / sitemap | `next/src/app/robots.ts`, `next/src/app/sitemap.ts`, `next/src/shared/seo/indexable-routes.ts` | **no change** (C-4, C-5) |
| Request edge | `next/src/proxy.ts` | **no change** — permanently restricted to URL mechanics |
| Env documentation | `next/.env.example` | **may gain comment-only lines** documenting Preview scoping; no new variable |
| Runtime/ops documentation | `next/README.md` ("Runtime", "CMS configuration by phase") | **may gain one short Preview subsection** |
| VPS operational candidates | `next/ops/**` | **no change** — VPS remains the approved runtime path |

The only genuinely new artefacts R1 may introduce are platform-boundary files that have no
existing owner:

1. `next/vercel.json` — **conditional**. Add only if a required setting cannot be expressed in
   project settings, or if review auditability of a specific setting is required. Every key must
   carry a comment-free justification in the PR description. If no key is needed, do not create
   the file.
2. `.gitignore` (repository root) — add `.vercel`. Justification: linking a Vercel project
   locally creates a `.vercel/` directory containing project and org identifiers; root
   `.gitignore` currently ignores `.env`/`.env.*` but **not** `.vercel` (§3.9), so without this
   the directory is untracked-but-offered on every `git status`.
3. `specs/active/R1-vercel-preview-baseline.md` — this document (already created on the spec
   branch).

Estimated implementation diff: **1–3 files, well under 100 lines**, none of them application
code.

---

## 8. Controlled Files

| File | R1 verdict | Reason |
|---|---|---|
| `next/package.json` | **DO NOT MODIFY** | R1 needs no new script and no new dependency. A Vercel build invokes the existing `build` script. |
| `next/bun.lock` | **DO NOT MODIFY** | no dependency change; CI installs `--frozen-lockfile` |
| root `package.json`, `bun.lock`, `package-lock.json` | **DO NOT MODIFY** | root Vite app is the production baseline |
| `next/next.config.ts` | **DO NOT MODIFY under default resolution** | Only blocker B1 could force a change here, and only via an owner-approved resolution recorded in this spec before the edit. |
| `.github/workflows/deploy.yml` | **DO NOT MODIFY** | production deploy line; `if: github.ref == 'refs/heads/main'` guard must stay exactly as-is |
| `.github/workflows/migration-ci.yml` | **DO NOT MODIFY** | R1 adds no CI step; Preview acceptance is run against a deployed URL, and wiring that into CI would require a preview URL and a protection-bypass secret that do not exist yet (B3) |
| `.github/workflows/pr-check.yml` | **DO NOT MODIFY** | unrelated to `migration/*` |
| `next/src/app/[lang]/layout.tsx`, `next/src/app/global-not-found.tsx` | **DO NOT MODIFY** | global layout; no Preview-specific rendering is permitted |
| `next/src/app/robots.ts`, `next/src/app/sitemap.ts`, `next/src/shared/seo/**` | **DO NOT MODIFY** | C-4, C-5 |
| `next/scripts/validation/*.sh` | **DO NOT MODIFY** | already `BASE_URL`-parameterised; reuse unchanged is an acceptance criterion (AC-5..AC-7) |
| `next/src/shared/config/env.*.ts` | **DO NOT MODIFY** | inventory is complete; Preview supplies values, not code |
| `next/ops/**` | **DO NOT MODIFY** | VPS candidate plane, FND-010-owned |
| root `.gitignore` | **ONE LINE ADD** (`.vercel`) | §7 item 2 |
| `next/.env.example` | **COMMENTS ONLY, OPTIONAL** | may document Preview scoping; must introduce no new variable name |
| `next/README.md` | **ADDITIVE SECTION, OPTIONAL** | existing runtime-documentation owner |

---

## 9. External Configuration Impact

Configuration performed **outside** the repository, by the platform owner. R1 records intent and
required evidence; it does not and cannot assert current Vercel account state.

### 9.1 Vercel project

| Setting | Required value | Status |
|---|---|---|
| Git repository | `CONG-TY-TNHH-QU-C-ANH-GLOBAL/THG_landingpage` | to be created by owner (B7) |
| Root Directory | `next` | C-1 |
| Framework preset | Next.js (auto-detected) | expected; verify |
| Install / build commands | project defaults resolving `next/bun.lock` and `next/package.json` `build` | verify; do not add custom scripts to `package.json` |
| Node.js version | must satisfy `>=20.9.0`; repo pin at root is `20` and `next/` has no pin (§3.1) | **UNKNOWN whether the root `.node-version` is honoured when Root Directory is `next` — B6** |
| **Production Branch** | must **not** be `main` and must **not** auto-deploy this project to any THG domain | see §11 |
| Preview deployments | enabled for `migration/next-main` and PRs targeting it | goal 1 |
| Deployment Protection | enabled for Preview (C-5) | B3 |
| Custom domains | **none assigned** | §11 |

### 9.2 Environment variables — Preview scope only

Derived strictly from §3.4. Set **nothing else**.

| Variable | Scope | Value | Secret? |
|---|---|---|---|
| `CMS_API_URL` | Preview | approved read-only CMS origin — **B4** | No (base URL, non-secret; §3.5 reads are unauthenticated) |
| `NEXT_PUBLIC_CMS_API_URL` | Preview | **B5** — must not be a value that permits production writes | No (public by design; `06-environment-migration-map.csv`) |
| `NEXT_PUBLIC_SITE_URL` | Preview | **unset** | — |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Preview | **unset unless B5's resolution requires it** | No (site key is public by design) |
| `NODE_ENV`, `PORT` | — | **never set manually** | — |

No variable in this table is a credential. **No production mutation credential, CMS admin
token, Cloudflare API token, SSH key, or `REVALIDATE_SECRET` may be created in any Vercel
scope under R1.**

### 9.3 DNS / Cloudflare

**No change.** R1 assigns no domain, creates no DNS record, and modifies no Cloudflare
configuration. `thgfulfill.com` continues to resolve to the existing production infrastructure.

---

## 10. Security Boundaries

| # | Boundary | Enforcement | Evidence basis |
|---|---|---|---|
| S-1 | No secret may exist in any Vercel scope under R1 | §9.2 table is exhaustive; PR review + `vercel env` listing evidence | §3.5 (reads unauthenticated) |
| S-2 | Server-only values must not reach the browser | Existing controls unchanged: `server-only` imports, `env.public.ts` restricted to `NEXT_PUBLIC_*`, and `seo-acceptance.sh` asserts `lacks "CMS_API_URL"` in rendered HTML | `next/scripts/validation/seo-acceptance.sh` "no server env leak" |
| S-3 | Preview must not write production data | Governed entirely by the Preview value of `NEXT_PUBLIC_CMS_API_URL` (C-6). **Turnstile must not be treated as the control**: with `NEXT_PUBLIC_TURNSTILE_SITE_KEY` unset the client sends the literal `DEV_BYPASS` token (`next/src/shared/ui/turnstile.ts`), and whether the target CMS rejects it depends on that CMS's own `TURNSTILE_SECRET_KEY`, which is **not** verifiable from this repository | §3.5, `next/src/shared/ui/turnstile.ts` |
| S-4 | Preview must not be publicly reachable or indexable | C-5; proven by AC-8/AC-9 | §3.6, §3.7 C2 |
| S-5 | Preview must not be able to trigger production deployment | R1 changes no workflow; `deploy.yml` remains `main`-guarded | §3.8 |
| S-6 | No new attack surface in application code | R1 adds no route, no handler, no header, no middleware branch | §7 |
| S-7 | Error bodies stay unpropagated | unchanged: `postLead` and `CommunityApiError` carry status only | `next/src/shared/ui/lead-api.ts`, `next/src/features/community/client/community-api.ts` |

Out of scope by §5: CSP, HSTS, security headers (FND-009).

---

## 11. Preview / Production Separation

Production, at this SHA, is: the **root Vite application**, deployed by `deploy.yml` on
`push:[main]` to the VPS, serving `thgfulfill.com`. `migration/next-main` is **not** public
production (`migration-ci.yml:5-8`; `IMPLEMENTATION_QUEUE.yaml` "MERGE TARGET" note).

R1 preserves that separation on five independent axes:

1. **Branch axis.** Vercel deploys only `migration/next-main` and PRs targeting it. `main` must
   not be the Vercel Production Branch. If the Vercel project model requires *some* production
   branch, it must be set to `migration/next-main` **and** no domain may be attached, so the
   "production" deployment remains an unaliased URL with no traffic — or the project must be
   configured so that no production deployment is created at all. The chosen mechanism must be
   recorded as evidence (AC-3), not assumed.
2. **Domain axis.** No custom domain is attached; DNS unchanged (§9.3).
3. **Pipeline axis.** `deploy.yml` is untouched and remains `main`-guarded; a Vercel deployment
   cannot invoke it.
4. **Data axis.** Preview reads only; the sole write vector is B5 and must be resolved before
   implementation.
5. **Identity axis.** Preview canonical/hreflang/sitemap continue to name the production origin
   (C-4), so a Preview never competes with production in search, and Preview is not reachable by
   the public anyway (C-5).

**`production_runtime_changed` remains `false`.** R1 does not satisfy, pre-empt, or partially
discharge Q-023 / MIG-010.

---

## 12. Acceptance Criteria

Every criterion is observable. `<PREVIEW>` is the Preview deployment URL; where protection is
enabled, probes run with the authorised bypass established under B3.

| ID | Criterion | Evidence |
|---|---|---|
| AC-1 | A Preview deployment of `migration/next-main` at a known commit SHA builds successfully with Root Directory `next` | Vercel build log showing the commit SHA and `next build` success |
| AC-2 | The deployed commit SHA equals the branch HEAD used for review | build log + `git rev-parse` |
| AC-3 | No Vercel **production** deployment is aliased to any THG domain, and `main` is not the deploying branch | project settings screenshot/CLI output + domain list showing no THG domain |
| AC-4 | `GET <PREVIEW>/api/health` returns exactly `{"status":"ok","service":"thg-public-web","runtime":"next"}` with `Cache-Control: no-store` | `curl -i` capture |
| AC-5 | `BASE_URL=<PREVIEW> bash next/scripts/validation/locale-routing-matrix.sh` passes **unmodified** | script output |
| AC-6 | `BASE_URL=<PREVIEW> bash next/scripts/validation/seo-acceptance.sh` passes **unmodified**, i.e. canonical/hreflang/og:url still name `https://thgfulfill.com` and no server env leaks | script output (proves C-4 and S-2) |
| AC-7 | `BASE_URL=<PREVIEW> bash next/scripts/validation/community-acceptance.sh` passes **unmodified** | script output |
| AC-8 | A Preview response is de-indexed at the transport layer: either an `X-Robots-Tag` containing `noindex`, or an unauthenticated request that returns no page HTML | `curl -I` capture of both an authorised and an unauthorised request |
| AC-9 | An unauthenticated request to `<PREVIEW>/vi` from outside the Vercel session does not return the rendered page | `curl` from a clean context |
| AC-10 | The Vercel environment inventory for this project contains **only** the variables in §9.2 and each is scoped to Preview | environment listing (values redacted) |
| AC-11 | `thgfulfill.com` still serves the Vite production application, unchanged, after R1 | `curl -sI https://thgfulfill.com` before/after + a body marker comparison |
| AC-12 | `main` HEAD and `deploy.yml` are byte-identical before and after R1 | `git diff` of `origin/main` before/after; `git log origin/main` unchanged |
| AC-13 | The R1 diff touches no file marked DO NOT MODIFY in §8 | `git diff --stat` on the implementation PR |
| AC-14 | The R1 footprint is removable by reverting one commit plus deleting one Vercel project, with no application-code residue | diff review; no `VERCEL_` string in `next/src` |
| AC-15 | Preview server-side CMS reads succeed against the approved read origin, and a route whose content is genuinely absent still renders its distinct EMPTY/UNAVAILABLE state rather than a 500 | rendered-page evidence for one READY route and one degraded route |

Documentation is not evidence. Every AC requires a captured artefact.

---

## 13. Required Negative Tests

| ID | Test | Expected | Proves |
|---|---|---|---|
| NT-1 | Trigger a Preview build with `NEXT_PUBLIC_CMS_API_URL` removed from the Preview scope | Build **fails** with the `next.config.ts` gate message | The build gate is live on Vercel; no localhost CMS can be baked into a Preview client bundle (`next/next.config.ts:28-35`) |
| NT-2 | Serve a Preview with `CMS_API_URL` removed from the runtime scope | Server-side render **fails loudly** (not a silent localhost fallback, not a fabricated fallback page) | `resolveCmsBaseUrl` production guard is active in the Vercel runtime (C-3) |
| NT-3 | Set `NEXT_PUBLIC_SITE_URL` to the preview hostname, rebuild, run `seo-acceptance.sh` unmodified | Script **fails** on canonical/hreflang | C-4 is enforced by existing tooling, so the "leave it unset" decision is guarded, not merely documented (§3.7 C1) |
| NT-4 | Attempt to reach `<PREVIEW>/vi` with no authorisation | No rendered page HTML returned | S-4 / AC-9 |
| NT-5 | Submit the lead form on a Preview deployment | **No record is created in the production CMS.** Must be confirmed by the CMS owner inspecting the production data store, not inferred from a client-side error | S-3 — the only production-mutation vector |
| NT-6 | Request `<PREVIEW>/vi/catalog` and `<PREVIEW>/vi/international-pricing` | Hard `404` | Preview does not resurrect `BLOCKED_BY_CONTRACT` routes (`indexable-routes.ts` `NON_INDEXABLE_ROUTES`) |
| NT-7 | Push a commit to `migration/next-main` after R1 | `deploy.yml` does **not** run; no VPS deployment occurs | S-5, §11 axis 3 |
| NT-8 | Inject an HTML `noindex` meta on Preview (exploratory only, reverted) | `seo-acceptance.sh` **fails** | Documents why C-5 forbids the HTML-meta approach (§3.7 C2) |

NT-1, NT-2 and NT-8 are destructive to a Preview deployment only; they must be run on a
throwaway preview and reverted.

---

## 14. Rollback

Rollback is complete and fast because the footprint is deliberately tiny.

| Step | Action | Effect |
|---|---|---|
| 1 | Delete or disconnect the Vercel project | All Preview deployments become unreachable |
| 2 | `git revert` the single R1 commit on `migration/next-main` | Removes `next/vercel.json` (if created), the `.gitignore` line, and doc additions |
| 3 | Delete local `.vercel/` directories | Removes local project linkage |
| 4 | Re-run `migration-ci.yml` on `migration/next-main` | Confirms the branch is green without any Vercel artefact |

Production requires **no** rollback action: it was never touched (§11). There is no data
migration, no DNS change, and no state outside the Vercel project to unwind.

Partial-failure rollback: if AC-1..AC-15 cannot all be met, the correct outcome is to delete the
Vercel project and leave `migration/next-main` unchanged. A half-configured Preview — reachable
but unprotected, or writing to production CMS — is strictly worse than no Preview.

---

## 15. Explicit Open Blockers

These are unresolved. **Implementation must not start until B1, B2, B4 and B5 are decided by
the owner**; B3, B6, B7 must be resolved during implementation and recorded.

**B1 — `output: "standalone"` on Vercel (technical, blocking).**
Unknown whether Vercel builds this app unchanged with `output: "standalone"`
(`next/next.config.ts:14`). The setting is load-bearing for the VPS artifact and for the
`migration-ci.yml` standalone smoke, so it cannot simply be deleted. Resolution must be
empirical: attempt one throwaway Preview build and record the result. If it fails, permitted
resolutions — in order — are (a) express the override in `next/vercel.json` only, (b) make the
setting conditional on an explicitly non-application signal in `next.config.ts`, with owner
approval and a recorded justification, (c) abandon R1. Option (b) modifies a controlled file and
requires this spec to be amended first.

**B2 — Governance authorisation (process, blocking).**
No ADR, FND spec, MIG document, `SPEC_REGISTRY.yaml` entry or `IMPLEMENTATION_QUEUE.yaml` item
mentions Vercel (§3.9, §3.10). The approved runtime story is standalone Node on the VPS
(ADR-000/P4, ADR-001 Option A, FND-010), and only Q-023 may change the deployment runtime. R1 as
specified does **not** change the production runtime, so it does not contradict that constraint —
but introducing a hosting platform without a registry entry is outside the ADR-000 spec system.
Required: an owner decision to either register R1 in the governance workspace (new queue item and,
if Vercel is intended beyond Preview, an ADR) or explicitly record it as an accepted,
Preview-only, non-governed exception.

**B3 — Preview protection vs automated acceptance (blocking implementation).**
C-5 requires Preview to be unreachable publicly; AC-5..AC-7 require `curl`-based scripts to
reach it. A documented, auditable authorised-access mechanism for automation must therefore be
identified and configured. The exact Vercel mechanism is **UNVERIFIED in this repository** and
must be confirmed against current Vercel documentation by the implementer. If such a mechanism
requires a secret, that secret must live in the operator's hands for manual runs — R1 does not
add it to GitHub Actions (§8).

**B4 — Preview CMS read origin (blocking, owner decision).**
No approved non-production CMS environment is documented anywhere in the repository or the
governance workspace. The only origins evidenced are `http://localhost:8080/api/v1` (dev
default) and a production CMS base described as deployment-owned
(`next/.env.example`; `06-environment-migration-map.csv` — "e.g. `https://cms.thgfulfill.com/api/v1`").
Reads are unauthenticated and non-mutating (§3.5), so pointing Preview at the production CMS for
**reads** is technically safe, but it is a load and data-exposure decision the CMS owner must
make. Options: (a) production CMS, read-only; (b) a dedicated preview CMS environment, which
does not exist and would be new work outside R1; (c) no CMS, accepting that every CMS-backed
section renders its degraded state — which materially reduces R1's review value.

**B5 — `NEXT_PUBLIC_CMS_API_URL` on Preview (blocking, security).**
This value is inlined into the Preview client bundle and is the **only** path by which a Preview
can mutate production data (leads, community questions, reviews — §3.5). Setting it to the
production CMS means anyone with Preview access can create real production records. Turnstile
cannot be relied on as the control (S-3). The owner must choose and record one of: (a) a
non-production write endpoint; (b) an accepted, monitored risk with the CMS owner's explicit
sign-off and a plan to identify and purge preview-originated records; (c) a value that makes
writes fail closed. Option (c) must be verified to fail *closed* and not to break page rendering,
since `resolvePublicCmsApiUrl` throws on an empty value in a production build.

**B6 — Node version resolution with Root Directory `next` (non-blocking, must be recorded).**
`next/` has no `.node-version`/`.nvmrc`; the pins live at repository root (§3.1). Whether Vercel
honours a root-level pin when Root Directory is `next` is unknown. The implementer must observe
the build log's Node version and confirm it satisfies `engines.node >= 20.9.0`. Adding
`next/.node-version` is permitted **only** if the observed version is non-compliant, and must
then match the root pin.

**B7 — Vercel account, team and plan (external, unknown).**
No Vercel account, team, project, seat allocation or plan is evidenced anywhere. Whether the
required Deployment Protection capability is available on the owner's plan is unknown and gates
B3.

---

## 16. Definition of Done

R1 is done when **all** of the following hold:

1. B1, B2, B4, B5 are resolved and each decision is recorded in this document (spec amended and
   re-committed before implementation).
2. B3, B6, B7 are resolved and recorded in the implementation PR.
3. AC-1 through AC-15 each have a captured evidence artefact attached to the PR.
4. NT-1 through NT-8 have been executed with the expected outcome, on a throwaway preview where
   destructive.
5. The implementation diff touches only files permitted in §7/§8, and `git diff --stat` is
   attached.
6. `migration-ci.yml` is green on `migration/next-main` at the merge commit.
7. `main`, `deploy.yml`, DNS, and `thgfulfill.com` are demonstrably unchanged (AC-11, AC-12).
8. The rollback procedure in §14 has been walked through at least once on a throwaway project,
   or its steps are individually evidenced.
9. A short execution record is filed in the governance workspace if B2 is resolved in favour of
   registration.

Partial completion is not "done". If any AC cannot be met, §14's partial-failure path applies.

---

## 17. Implementation Agent Instructions

You are implementing R1. Read this section fully before touching anything.

**Before you edit**

1. `git fetch origin`; verify `origin/migration/next-main` and re-read this spec against the
   **current** HEAD, not against SHA `6c14fb3`. Route-migration slices merge frequently.
2. Re-verify every §3 claim you intend to rely on. If any repository evidence contradicts a
   contract in §6, **stop** and report the contradiction. Do not adapt the code to fit the spec;
   the spec is wrong in that case and must be amended by the specification owner first.
3. Confirm B1, B2, B4 and B5 carry recorded owner decisions in §15. If any is still open,
   **stop** — configuring a Vercel project without B5 resolved risks creating production records
   from a preview.
4. Verify the working tree is clean and you are on a branch created from the current
   `migration/next-main`. No rebase of the canonical branch. No force push.

**While you work**

5. Keep the diff limited to R1. Permitted files are enumerated in §7 and §8. If you believe you
   need a file marked DO NOT MODIFY, stop and report why — do not proceed on judgement.
6. Reuse the canonical owners in §7. Do **not** create a new `shared/`, `platform/`,
   `config/`, `environment/` or `integration/` module. Do not add a `VERCEL_*` read to `next/src`.
7. Do not change `next/package.json` or `next/bun.lock`. No new dependency, no new script. If a
   Vercel setting appears to require one, that is a signal to express it in project settings or
   `next/vercel.json` instead — report the tradeoff rather than deciding silently.
8. Do not change production DNS, Cloudflare configuration, or any domain assignment.
9. Create no secret in any Vercel scope. The §9.2 table is exhaustive; anything beyond it needs a
   spec amendment.
10. Preserve existing route-migration behaviour exactly. R1 renders no page differently. If a
    Preview renders a route differently from local `bun run build && bun run start`, that is a
    finding to report, not something to patch in a route file.
11. Do not "fix" Preview canonical URLs, Preview `robots.txt`, or the Preview sitemap. C-4 makes
    production-pointing metadata the intended behaviour, and `seo-acceptance.sh` enforces it.
12. Prefer no `next/vercel.json` at all. Create it only when a required setting has no other
    home, and justify every key in the PR description.

**Validation — run all of it**

13. In `next/`: `bun run lint`, `bun run typecheck`, `bun run test`, and
    `NEXT_PUBLIC_CMS_API_URL=http://localhost:8080/api/v1 bun run build` — mirroring
    `migration-ci.yml` so a local failure is caught before CI.
14. Against the Preview URL, run all three validation scripts **unmodified** (AC-5..AC-7). If a
    script needs modification to pass, stop: that is a contract violation, not a script bug.
15. Execute NT-1..NT-8. Capture output for each.
16. Confirm `migration-ci.yml` is green on the PR.

**Reporting**

17. Report **contract by contract** (C-1..C-7) and **criterion by criterion** (AC-1..AC-15),
    each with its evidence artefact. State plainly which criteria you could not meet and why.
18. Report the resolved values of B3, B6, B7 and the observed Node version from the build log.
19. Report the exact `git diff --stat` and confirm no §8 DO-NOT-MODIFY file appears in it.
20. If you finish with any AC unmet, apply §14's partial-failure path — delete the Vercel project
    and leave the branch clean — and say so explicitly. Do not report R1 as done.
