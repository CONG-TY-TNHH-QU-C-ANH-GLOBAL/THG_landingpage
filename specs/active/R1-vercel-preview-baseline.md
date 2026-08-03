# R1 — Vercel Preview Qualification

## 1. Status

**READY FOR IMPLEMENTATION REVIEW** — P1 is closed by CMS-P1, production-verified (§7.3). P2 is
closed by owner approval for Preview qualification only (§13). R1 is **not** implemented; no
implementation branch exists yet.

| Field | Value |
|---|---|
| Slice | R1 (repository-local; not a registered governance spec — see P2 in §13) |
| Landing base | `migration/next-main` @ `6c14fb3` (unchanged since this spec was written) |
| CMS evidence base | `CONG-TY-TNHH-QU-C-ANH-GLOBAL/CMS_management-` `origin/main` @ `d9a404d` (CMS-P1, PR #74). §3–§7 findings were captured at `5ca1750`; every cited file was byte-identical to `origin/main` then, and the boundary they describe is now enforced |
| Spec branch | `spec/Anh/vercel-preview-baseline` |
| Production impact | none — no DNS, no runtime change, no `main`, no `deploy.yml`. `production_runtime_changed` stays **false** |

**Governance framing.** R1 qualifies Vercel as a **Preview environment for the migration line**.
R1 does **not** replace the approved VPS standalone production runtime, does not cut production
traffic to Vercel, does not change production DNS, does not authorize Vercel production hosting,
and does not supersede existing production deployment governance (`IMPLEMENTATION_QUEUE.yaml`:
Q-023/MIG-010 remains the sole authority to change the deployment runtime;
`production_runtime_changed` stays `false`). Production hosting or cutover requires a later,
explicit owner/governance decision that R1 neither makes nor pre-empts.

---

## 2. Goal

A protected Vercel Preview of `next/`, built from `migration/next-main` and its PRs, that:
renders real CMS content; **cannot mutate production data**; is not publicly reachable or
indexable; passes the three existing acceptance scripts unmodified; and is removable by
reverting one commit and deleting one project.

---

## 3. Verified Current State

Only findings that change an implementation decision. Landing paths at `6c14fb3`, CMS paths at
`5ca1750`.

### 3.1 Two fail-closed env guards (landing)

| Guard | Location | Behaviour |
|---|---|---|
| Build gate | `next/next.config.ts:28-35` | `next build` **throws** at `PHASE_PRODUCTION_BUILD` when `NEXT_PUBLIC_CMS_API_URL` is blank |
| Runtime guard | `next/src/shared/cms/cmsFetch.ts` `resolveCmsBaseUrl` | **throws** when `NODE_ENV=production`, `NEXT_PHASE≠phase-production-build`, and `CMS_API_URL` is blank. The throw is a plain `Error`, and loaders rethrow non-`CmsError` (`next/src/features/blog/server/loaders.ts`), so this is a 500, not a degraded state |

Both must be satisfied in Preview or the deployment fails.

### 3.2 Environment inventory — complete, code-verified

Nothing else is read from `process.env` in `next/src`. **No `VERCEL_*` variable is read anywhere.**

| Variable | Owner | Binding | Unset behaviour |
|---|---|---|---|
| `CMS_API_URL` | `shared/cms/cmsFetch.ts` | server runtime | §3.1 runtime guard |
| `NEXT_PUBLIC_CMS_API_URL` | `shared/config/env.public.ts` | **build-time, inlined** | §3.1 build gate |
| `NEXT_PUBLIC_SITE_URL` | `shared/config/env.public.ts` → `shared/seo/site.ts` | build-time | defaults `https://thgfulfill.com` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `shared/config/env.public.ts` → `shared/ui/turnstile.ts` | build-time | client sends literal `DEV_BYPASS` |
| `NODE_ENV`, `PORT` | `shared/config/env.server.ts` | runtime | platform-supplied; validated, throws on unexpected values — **never set manually** |

**Decisive structural fact: reads and writes use different variables.**
Server reads go through `CMS_API_URL`; browser writes go through `NEXT_PUBLIC_CMS_API_URL`
(`next/src/shared/ui/lead-api.ts`, `next/src/features/community/client/community-api.ts`).
They can be pointed at different origins independently. This is what makes a safe Preview
possible at all (§7).

### 3.3 SEO acceptance constrains Preview configuration

`next/scripts/validation/seo-acceptance.sh:4-8` asserts the **production** origin independent of
`BASE_URL` (`SITE="${SITE_ORIGIN:-https://thgfulfill.com}"`), and asserts `lacks "noindex"` in
the HTML of `/vi`, `/en`, `/zh`. Therefore:

- Preview **must not** set `NEXT_PUBLIC_SITE_URL` to the preview host — it would change
  canonical/hreflang away from the production origin and fail the script.
- Preview **must not** be de-indexed via HTML metadata — the script asserts its absence.
  Preview privacy belongs at the transport/platform layer.

All three scripts (`locale-routing-matrix.sh`, `seo-acceptance.sh`, `community-acceptance.sh`)
are already `BASE_URL`-parameterised and are reused **unmodified** as R1 acceptance.

### 3.4 Repository facts that shape the Vercel project

- Repo root is a **separate Vite application** with its own manifests; the Next app is `next/`
  with its own committed `next/bun.lock`. Vercel Root Directory must be `next`.
- `next/next.config.ts:14-16` pins `output: "standalone"`, `outputFileTracingRoot`,
  `turbopack.root` to `next/`. `output: "standalone"` is load-bearing for the VPS artifact and
  for the standalone smoke in `.github/workflows/migration-ci.yml:60-95`.
- `engines.node >= 20.9.0`; root `.node-version`/`.nvmrc` pin `20`; **`next/` has no Node pin**.
- `migration-ci.yml` is non-deploying by design; `deploy.yml` is guarded
  `if: github.ref == 'refs/heads/main'`.
- No tracked Vercel artefact exists (the single `vercel` match is `next/.next/`-generated
  `@vercel/og` types from Next itself). Root `.gitignore` ignores `.env*` but **not** `.vercel`.

---

## 4. R1 Scope

1. Create/verify a Vercel project for this repo with Root Directory `next`.
2. Build a Preview from `migration/next-main` with the env inventory of §3.2, **current config
   unchanged** — including `output: "standalone"` (§6 C-2).
3. Establish that Preview can be protected (capability, not automation — §13 V2).
4. Prove production is untouched.
5. Run the three existing scripts unmodified against the Preview URL.
6. Record the effective Node version and the `output: "standalone"` result as deployment evidence.

---

## 5. Explicit Non-Goals

Production DNS/domain assignment · any Vercel production deployment or `main` branch mapping ·
replacing or retiring the VPS runtime, `ops/`, or `package:standalone` · CMS on-demand
revalidation, `REVALIDATE_SECRET`, cache-tag architecture (FND-006) · observability/analytics
(FND-007/008) · CSP/HSTS/security headers (FND-009) · Next.js or bundler changes, including any
response to the Turbopack dev-mode memory defect · additional route migration · automated
acceptance bypass in CI (**R2 owns that**) · reading `VERCEL_*` in `next/src` · any change to
the CMS repository.

---

## 6. Load-Bearing Contracts

**C-1 — Build scope.** Vercel builds `next/` only; a root-directory build would build the Vite app.

**C-2 — `output: "standalone"` is an experiment, not a change.** Deploy with the current config
unchanged and record the result. If the Preview builds and serves, **no repository change**. If
it fails, capture the exact platform/build error and open a spec blocker — do **not** remove or
weaken `output: "standalone"`, which is part of the approved VPS artifact contract and its CI proof.

**C-3 — Preview env contract.** `NEXT_PUBLIC_CMS_API_URL` in the build scope and `CMS_API_URL` in
the runtime scope are both mandatory (§3.1). `NODE_ENV`/`PORT` are never set manually.

**C-4 — Site origin unchanged.** `NEXT_PUBLIC_SITE_URL` stays unset in Preview (§3.3). Accepted
and intended consequence: Preview canonical/hreflang/`sitemap.xml`/`robots.txt` name the
production origin. This must not be "fixed" by adding environment branching to `robots.ts`,
`sitemap.ts`, or `shared/seo/**`.

**C-5 — Privacy at the transport layer.** Preview de-indexing/protection is achieved by access
protection and/or an `X-Robots-Tag` response header, never by application metadata (§3.3).

**C-6 — Data plane.** Cloudflare remains the CMS/API plane. Preview is a read client only; the
write origin is governed by §7. R1 adds no loader, mapper, route or fallback, assigns no
`revalidate` value and no cache tag, and leaves READY / EMPTY / NOT_FOUND / UNAVAILABLE and the
`cmsFetch` reserved slots untouched.

**C-7 — Reversibility.** Removable by reverting one commit plus deleting one Vercel project. No
application module acquires a Vercel dependency.

---

## 7. Preview CMS Safety Decision

### 7.1 CMS evidence (all files verified identical to CMS `origin/main` @ `5ca1750`)

| # | Question | Answer | Evidence |
|---|---|---|---|
| 1 | What protects `POST /leads`? | IP rate limit 10/hr, Zod parse, **server-side Turnstile** → 403. No auth, no origin check. Rate limiter **fails open** on Durable-Object error | `src/routes/api/v1/(public)/leads/index.ts`; `src/core/middlewares/rate-limit.ts` |
| 2 | What protects community mutations? | questions/reviews: rate limit 5/hr + schema + **server-side Turnstile** → 403 (`guardCommunitySubmit`). withdraw: 20/hr + owner token. **`same-issue`: rate limit 30/hr + IP-presence only — NO Turnstile** | `src/features/community/community.http.ts`; `src/routes/api/v1/(public)/community/questions/$slug.same-issue.ts` |
| 3 | Turnstile enforced server-side? | Yes, `verifyTurnstile` is called before every lead/question/review insert | `src/core/middlewares/rate-limit.ts` |
| 4 | What happens on literal `DEV_BYPASS`? | If `TURNSTILE_SECRET_KEY` is set → siteverify fails → 403. **If the secret is empty → `return token.length > 0`, i.e. `DEV_BYPASS` is ACCEPTED.** The secret is a Wrangler secret, **not in the repository — its production value is unverifiable from source** | `src/core/middlewares/rate-limit.ts` `verifyTurnstile` |
| 5 | Origin/Host checks enforced? | **No.** `getAllowedOrigin` never rejects: an unknown Origin returns `list[0]` (`https://thgfulfill.com`) as the `Access-Control-Allow-Origin` header. The handler always executes. CORS here is a response-header policy, not a request gate. (`isLocalhostOrigin` is correctly anchored — a Vercel host cannot spoof it) | `src/core/middlewares/cors.ts`; `src/core/middlewares/cors-origin.ts` |
| 6 | Are Vercel preview origins rejected or accepted? | **Server-side: accepted and executed.** `CORS_ORIGIN` is `https://thgfulfill.com,https://www.thgfulfill.com` — a preview origin is merely absent from the allow-list, which only changes the response header | `wrangler.jsonc` `vars.CORS_ORIGIN` |
| 7 | Auth required for any relevant mutation? | **No.** All are `(public)` routes; none requires a session or bearer token | route files above |
| 8 | Non-production/staging CMS deployment contract? | **None.** `wrangler.jsonc` declares a single production Worker on the custom domain `cms.thgfulfill.com`, with **no `env.*` sections** and no preview/staging environment | `wrangler.jsonc` |
| 9 | Can one origin serve Preview reads while making mutations impossible? | **No — not the production CMS as-is.** See §7.2 | — |
| 10 | Environment-specific mutation disabling? | **None.** No read-only flag exists; `isProduction()` is used only for auth-cookie `Secure` flags | `src/features/auth/auth.service.ts` |

### 7.2 Proven production mutation from a Preview origin

`reactSameIssue` issues `POST /community/questions/{slug}/same-issue` with **no body and only an
`Accept` header** (`next/src/features/community/client/community-api.ts`). `Accept` is a
CORS-safelisted request header, so this is a **simple request: the browser sends it without a
preflight**. The Worker executes `addSameIssueReaction` against production D1; the browser merely
cannot read the response. The `same-issue` handler has **no Turnstile** (§7.1 #2), so nothing
else stops it.

Lead and community submit POSTs send `Content-Type: application/json` and are therefore
preflighted — a browser blocks those when the preview Origin is absent from `CORS_ORIGIN`. That
is a *browser-enforced* effect, not a server-side boundary, and it does not cover the
non-preflighted path above.

### 7.3 Conclusion — CLOSED by CMS-P1, production-verified

The original finding stands as written: at `5ca1750` a Preview carrying the production
`NEXT_PUBLIC_CMS_API_URL` could mutate production data, without a preflight and without
Turnstile. That was resolved in the CMS, by **option C** of the three recorded here — a
server-side mutation boundary — not by a configuration workaround in this repository.

**CMS-P1 — Public Browser Mutation Origin Boundary**, merged to CMS `origin/main` as `d9a404d`
(PR #74). All eight public write endpoints now reject a disallowed browser Origin **before** rate
limiting, body parsing, Turnstile, owner-token checks and any D1/R2/Telegram effect. Matching is
exact after URL normalization; a missing, malformed or opaque Origin is refused; an empty
`CORS_ORIGIN` fails closed. No Vercel origin is in the production allow-list, and none may be
added.

**Runtime verification against the Production Worker** (`https://cms.thgfulfill.com`, deployed by
`push:[main]` → `wrangler deploy`). Probes used `POST /community/questions/{slug}/same-issue` — a
CORS-simple path that the boundary guards — with a deliberately non-existent random slug, so
nothing could be written:

| Probe Origin | Result | Meaning |
|---|---|---|
| `https://<probe>.vercel.app` | **403** `Nguồn gọi không được phép thực hiện thao tác này.` | boundary live; that message exists only in CMS-P1 |
| `https://thgfulfill.com.evil.example`, `https://evil-thgfulfill.com` | **403**, same message | exact matching, no suffix/substring admission |
| `https://thgfulfill.com`, `https://www.thgfulfill.com` | **404** `No published question with slug "…"` | passed the boundary, reached domain logic, wrote nothing |
| read regression: `GET /site-settings`, `/homepage?lang=vi`, `/community/categories` | **200** JSON | reads unaffected |

The 403-vs-404 split is the deployment proof: before CMS-P1 the preview Origin would have
received the same 404. **No production record was created by any probe.**

**Server reads remain separately safe.** `cmsFetch` sends only `Accept` and no credential
(`next/src/shared/cms/cmsFetch.ts`). Pointing **`CMS_API_URL`** at the production CMS is a
load/exposure decision, not a mutation risk.

**Resulting Preview CMS strategy.** `NEXT_PUBLIC_CMS_API_URL` **may** point at the production CMS
origin, because a Preview browser's writes are now refused server-side. Expected and accepted
Preview behaviour: submit actions return 403 and the forms show their existing generic error
copy. Standing prohibitions: do **not** add any Vercel Preview origin to production
`CORS_ORIGIN`; do **not** give Preview mutation credentials; do **not** hide or disable mutation
UI as a substitute for the server-side boundary.

---

## 8. External Vercel Configuration Required

Performed in Vercel project settings, not in this repository.

| Setting | Required value |
|---|---|
| Git repository | `CONG-TY-TNHH-QU-C-ANH-GLOBAL/THG_landingpage` |
| Root Directory | `next` |
| Install/build | project defaults resolving `next/bun.lock` and the existing `build` script — add no script |
| Node.js major | must satisfy `engines.node >= 20.9.0`; align with the repo pin (`20`). Set as a **project/runtime setting**; verify the effective version from build-log evidence (§13 V3) |
| Production Branch | must **not** be `main`, and no THG domain may be attached to any production deployment |
| Preview deployments | enabled for `migration/next-main` and PRs targeting it |
| Deployment Protection | enabled for Preview; record which mechanism the account/plan offers |
| Custom domains | **none** |

**Preview-scope environment variables — this list is exhaustive:**

| Variable | Value |
|---|---|
| `CMS_API_URL` | approved read origin (production CMS is acceptable for reads — §7.3) |
| `NEXT_PUBLIC_CMS_API_URL` | production CMS origin — permitted now that CMS-P1 refuses Preview-origin writes server-side (§7.3). Preview submits are expected to 403 |
| `NEXT_PUBLIC_SITE_URL` | **unset** (C-4) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | **unset** unless P1's resolution requires it |
| `NODE_ENV`, `PORT` | never set manually |

No entry above is a credential. No production mutation credential, CMS admin token, Cloudflare
token, SSH key or `REVALIDATE_SECRET` may be created in any Vercel scope under R1.
DNS and Cloudflare configuration are unchanged.

---

## 9. Expected Repository Diff

**Target: zero application-source changes. Prefer Vercel project settings over repository files.**

| File | Expectation |
|---|---|
| root `.gitignore` | **+1 line `.vercel`** — only if the Vercel CLI is used locally and creates `.vercel/` (root `.gitignore` covers `.env*` but not `.vercel`) |
| `next/vercel.json` | **Conditional — expected NOT to be created.** Only if a concrete platform requirement cannot be expressed through project settings. Do not create it to document settings |
| `next/.env.example` | comment-only Preview-scoping note, **only if** implementation evidence justifies it; no new variable name |
| `specs/active/R1-vercel-preview-baseline.md` | this document |

Realistic expected diff: **0–1 functional lines.**

**Do not touch** (unless a blocker proves R1 impossible without it, which then requires a spec
amendment first): `next/package.json` · lockfiles · `next/next.config.ts` · `next/scripts/validation/*.sh` ·
`.github/workflows/**` · `next/src/shared/seo/**`, `robots.ts`, `sitemap.ts` · `next/src/shared/config/env.*.ts` ·
runtime loaders · `next/src/app/[lang]/layout.tsx`, `global-not-found.tsx` · `next/ops/**` · the CMS repository.

---

## 10. Acceptance Matrix

`<PREVIEW>` = the Preview deployment URL.

| ID | Criterion | Evidence |
|---|---|---|
| AC-1 | Preview of `migration/next-main` builds with Root Directory `next`, **config unchanged**, and the deployed SHA matches the branch HEAD | build log |
| AC-2 | `output: "standalone"` outcome recorded: built and served, or exact platform error captured (C-2) | build log |
| AC-3 | Effective Node major recorded and ≥ 20.9 | build log |
| AC-4 | `GET <PREVIEW>/api/health` → `{"status":"ok","service":"thg-public-web","runtime":"next"}` with `Cache-Control: no-store` | `curl -i` |
| AC-5 | `BASE_URL=<PREVIEW> bash next/scripts/validation/locale-routing-matrix.sh` passes **unmodified** | script output |
| AC-6 | `BASE_URL=<PREVIEW> bash next/scripts/validation/seo-acceptance.sh` passes **unmodified** — canonical/hreflang still name `https://thgfulfill.com`, no server-env leak (proves C-4) | script output |
| AC-7 | `BASE_URL=<PREVIEW> bash next/scripts/validation/community-acceptance.sh` passes **unmodified** | script output |
| AC-8 | Preview is de-indexed at the transport layer: `X-Robots-Tag` containing `noindex`, and/or an unauthenticated request returns no page HTML | `curl -I`, authorised and unauthorised |
| AC-9 | Vercel env inventory contains only §8's variables, each scoped to Preview | environment listing, values redacted |
| AC-10 | One READY route and one degraded route each render their correct distinct state (no 500, no fabricated content) | rendered-page evidence |
| AC-11 | `thgfulfill.com` still serves the Vite production app, unchanged | `curl -sI` + body marker, before/after |
| AC-12 | `main` HEAD and `deploy.yml` byte-identical before and after | `git log origin/main`, `git diff` |
| AC-13 | Diff touches no file listed as do-not-touch in §9 | `git diff --stat` |
| AC-14 | No `VERCEL_` string in `next/src`; footprint removable per §12 | grep + diff review |

Documentation is not evidence; each AC needs a captured artefact.

---

## 11. Negative / Safety Checks

| ID | Test | Expected | Proves |
|---|---|---|---|
| NT-1 | Preview build with `NEXT_PUBLIC_CMS_API_URL` removed | build **fails** with the `next.config.ts` gate message | build gate live on Vercel |
| NT-2 | Preview served with `CMS_API_URL` removed | render **fails loudly** — no silent localhost fallback, no fabricated page | runtime guard live |
| NT-3 | Set `NEXT_PUBLIC_SITE_URL` to the preview host, rebuild, run `seo-acceptance.sh` unmodified | script **fails** | C-4 is tool-enforced, not merely documented |
| NT-4 | `<PREVIEW>/vi` with no authorisation | no rendered page HTML | C-5 |
| NT-5 | **Click "same issue" on a Preview community question** | **no increment in the production CMS**, confirmed by the CMS owner inspecting production data — not inferred from a client-side error | the §7.2 mutation path is actually closed by P1's resolution |
| NT-6 | Submit the lead form on Preview | no production lead record, confirmed CMS-side | P1 resolution covers the preflighted path too |
| NT-7 | `<PREVIEW>/vi/catalog`, `<PREVIEW>/vi/international-pricing` | hard `404` | Preview does not resurrect `BLOCKED_BY_CONTRACT` routes |
| NT-8 | Push to `migration/next-main` after R1 | `deploy.yml` does **not** run | Preview cannot trigger production deploy |

NT-1/NT-2/NT-3 are destructive to a preview only; run on a throwaway deployment and revert.
**NT-5 and NT-6 are the P1 verification and cannot be waived.**

---

## 12. Rollback

1. Delete/disconnect the Vercel project → all Previews unreachable.
2. `git revert` the single R1 commit (if any repository change was made at all).
3. Delete local `.vercel/` directories.
4. Re-run `migration-ci.yml` on `migration/next-main` to confirm green without any Vercel artefact.

Production requires no rollback action — it was never touched. No data migration, no DNS change.

**Partial-failure path:** if any AC cannot be met, delete the Vercel project and leave the branch
unchanged. A half-configured Preview — reachable but unprotected, or able to write to production
— is strictly worse than no Preview.

---

## 13. Remaining Blockers / Preconditions

**P1 — Preview CMS mutation safety. CLOSED.**
Resolved in the CMS by CMS-P1 (`origin/main` @ `d9a404d`, PR #74) and verified live on the
Production Worker: Preview and hostile-lookalike Origins receive a 403 from the mutation-origin
boundary, both production landing Origins pass it, reads are unaffected, and no production record
was created during verification (§7.3). NT-5 and NT-6 in §11 remain as the Preview-side
confirmation of the same property once a Preview exists.

**P2 — Governance authorization. CLOSED by owner decision.**
The owner approved proceeding with **Vercel Preview Qualification only**. That approval is
explicitly **not** production DNS cutover, not final Vercel production-hosting approval, not a
replacement of VPS deployment governance, and does not supersede Q-023/MIG-010.
`production_runtime_changed` stays **false**. Vercel production hosting remains a separate,
later owner decision, and this slice must not be cited as precedent for it.

**Verification/configuration items — not blockers:**

| ID | Item | Resolution |
|---|---|---|
| V1 | `output: "standalone"` on Vercel | empirical, AC-2. No preemptive config change |
| V2 | Deployment Protection | R1 establishes only that Preview *can* be protected (AC-8). **Automated acceptance bypass is R2's.** Record the mechanism the account/plan offers |
| V3 | Node version with Root Directory `next` | project/runtime setting + build-log evidence (AC-3). Add `next/.node-version` **only** if the observed version is non-compliant, and then matching the root pin `20` |
| V4 | Vercel account/team/plan | external prerequisite; gates V2 |

---

## 14. Definition of Done

1. P1 and P2 closed and recorded (§7.3, §13) — done.
2. V1–V4 resolved and reported with evidence.
3. AC-1..AC-14 each have a captured artefact.
4. NT-1..NT-8 executed with expected outcomes; NT-5/NT-6 confirmed CMS-side.
5. Diff stays inside §9; `git diff --stat` attached.
6. `migration-ci.yml` green on `migration/next-main`.
7. `main`, `deploy.yml`, DNS and `thgfulfill.com` demonstrably unchanged (AC-11, AC-12).

Partial completion is not done — §12's partial-failure path applies. Do not mark IMPLEMENTED.

---

## 15. Implementation-Agent Guardrails

1. **Do not start until this spec has been reviewed and approved.** §1 reads READY FOR
   IMPLEMENTATION REVIEW, not approved-to-build; the implementation branch is created in a
   separate session from the approved spec.
2. `git fetch origin`; re-verify every §3 and §7 claim against **current** HEAD of both repos, not
   against `6c14fb3` / `5ca1750`. If repository evidence contradicts a contract, **stop and
   report** — the spec is wrong and must be amended by its owner. Never adapt code to fit a spec.
3. Prefer **zero** repository changes. Use Vercel project settings. Do not create `vercel.json`
   merely to document settings.
4. Deploy with the config **unchanged** first (C-2). Do not preemptively touch
   `next/next.config.ts`, `package.json`, lockfiles, workflows, SEO code, loaders, layouts, the
   acceptance scripts, or the CMS repository.
5. Do not modify the three validation scripts. If one must change to pass, that is a contract
   violation to report, not a script bug.
6. Do not "fix" Preview canonical URLs, `robots.txt` or the sitemap (C-4). Do not add a `VERCEL_*`
   read to `next/src`. Do not implement Preview noindex through application metadata (C-5).
7. Do not build automated bypass tooling for protected Previews — that is R2.
8. Create no secret in any Vercel scope; §8's table is exhaustive.
9. Change no production DNS, domain, or Cloudflare configuration. Modify nothing in the CMS repo.
10. Validate locally first, mirroring CI: in `next/` run `bun run lint`, `bun run typecheck`,
    `bun run test`, and `NEXT_PUBLIC_CMS_API_URL=http://localhost:8080/api/v1 bun run build`.
11. Report **contract by contract** (C-1..C-7) and **criterion by criterion** (AC-1..AC-14), each
    with its artefact; state plainly anything unmet. Report V1–V4 outcomes and the observed Node
    version. If any AC is unmet, apply §12 and say so — do not report R1 as done.
