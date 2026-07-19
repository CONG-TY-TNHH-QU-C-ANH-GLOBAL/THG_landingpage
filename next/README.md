# THG Public Web — Next application (`next/`)

Isolated **Next.js 16** application for the public platform. **ADR-001 Option A**: this app
lives under `THG_landingpage/next/` as a temporary, non-production side-by-side app through
M1–M10. The repository-root **Vite** application remains the recoverable production baseline;
production traffic stays on Vite until the M10 cutover. Root promotion is **M11-only**.

Spec: `THG_public_platform_specs/04-foundation-specs/FND-001-next-repository-foundation`.
Architecture: [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Ownership (isolation)

This app owns its own `package.json`, **application lockfile** (`bun.lock`), Next / TypeScript
/ ESLint config, source, tests, scripts, public assets and ops candidates. The root Vite
manifest and lockfile are untouched.

## Runtime

- Package manager: **Bun** (same as the repo root; not switched).
- Node: **≥ 20.9** (`.nvmrc` = 20).
- `next.config.ts`: `output: "standalone"`.

## Local CMS (dev content)

CMS-backed sections need the sibling CMS API running locally (the base URL defaults to
`http://localhost:8080/api/v1`; override via `next/.env.local`, template in `.env.example`):

```sh
cd ../CMS_management-
bun run db:migrate:local   # once — creates/updates the local D1 tables
bun run dev                # serves http://localhost:8080 (port fixed in its vite.config.ts)
```

Without it the app still renders: every CMS loader degrades to its approved static/model
fallback (the contact directory shows the verified production fallback rows) and the server
logs one redaction-safe `[CMS]` warning per endpoint per process.

### CMS configuration by phase (production must not use localhost)

| Variable | Scope | Missing in dev/test | Missing in production |
|---|---|---|---|
| `CMS_API_URL` | server **runtime** | localhost default | server refuses CMS reads (throws) |
| `NEXT_PUBLIC_CMS_API_URL` | client **build-time** (`next build`) | localhost default | **`next build` fails** |

`NEXT_PUBLIC_*` is inlined into the client bundle at build time, so `NEXT_PUBLIC_CMS_API_URL`
must be set **where `next build` runs** (CI/release), not just in the systemd runtime unit.
MIG-010 provides both. Both are public (the CMS base is not a secret) but must come from
approved deployment config, never an implicit localhost fallback.

## Commands (run inside `next/`)

```bash
bun install --frozen-lockfile
bun run lint
bun run typecheck
bun run test            # vitest: architecture + smoke
bun run build               # produces .next/standalone
bun run package:standalone  # self-contained: copies .next/static + public/ into it
node .next/standalone/server.js   # standalone runtime proof
curl -s http://127.0.0.1:3000/api/health
# performance (k6 binary, not npm): see tests/performance/README.md
```

## Standalone artifact strategy

The foundation ships a **self-contained** standalone artifact. `next build`
(`output: "standalone"`) emits `.next/standalone/server.js` but, by Next's design, does
**not** bundle static/public assets. `bun run package:standalone`
(`scripts/package-standalone.mjs`) copies them in:

- `.next/static` → `.next/standalone/.next/static` (served at `/_next/static/*`)
- `public/` → `.next/standalone/public` (served at `/*`)

So the single artifact serves HTML, `/api/health`, hashed `/_next/static/*` assets and
`public/*` with no external CDN/nginx asset owner required. (A future CDN/nginx ownership
model may front `/_next/static` for caching — that is FND-009/FND-010's decision; the
foundation defaults to self-contained.) The CI job `next-foundation` validates: HTML 200,
exact health contract, the `/foundation-probe.txt` public asset 200 with an exact body
(developer `/README.md` is **404** — never publicly served), a static JS/CSS asset 200, and
a missing static asset 404. Developer docs live only at `next/README.md`, outside `public/`.

## Health contract

`GET /api/health` → `200 {"status":"ok","service":"thg-public-web","runtime":"next"}`,
`Cache-Control: no-store`. No timestamps, no infra details, no secrets.

## Locale routing (FND-002)

Supported locales: **`vi` (default), `en`, `zh`**. `src/proxy.ts` (Next 16 proxy) does URL
mechanics only; server `[lang]` routes load local dictionaries and set `<html lang>`.

Run the Next candidate (does not affect the Vite dev server):

```bash
cd THG_landingpage/next && bun run dev
```

Expected local routes / behavior:

| URL | Behavior |
|---|---|
| `http://localhost:3000/` | **308** → `/vi` (query preserved) |
| `http://localhost:3000/vi` | 200, `<html lang="vi">` |
| `http://localhost:3000/en` | 200, `<html lang="en">` |
| `http://localhost:3000/zh` | 200, `<html lang="zh-CN">` |
| `http://localhost:3000/fr` (unsupported 2-letter) | **308** → `/vi` (`/fr/x` → `/vi/x`) |
| `http://localhost:3000/vi/anything` (unknown) | real **404** (localized) |
| `http://localhost:3000/anything` (unknown, non-locale) | real **404** (root) |
| `http://localhost:3000/api/health` | 200 (proxy bypass) |

The proxy never fetches CMS/dictionaries/network and sets no cookies; it bypasses `/api/*`,
`/_next/*`, `favicon.ico`, `/foundation-probe.txt` and any path with a file extension.
The Vite dev server (`cd THG_landingpage && bun run dev`) is unchanged.

## Scope

FND-001 (foundation) + FND-002 (locale gateway: proxy + `[lang]` routes + local dictionaries).
**Not** included: CMS/catalog fetching, translation overlay, homepage/product parity,
community, Ask THG, tracking, production deployment, AI. Those arrive in later specs.
