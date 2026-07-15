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

## Commands (run inside `next/`)

```
bun install --frozen-lockfile
bun run lint
bun run typecheck
bun run test            # vitest: architecture + smoke
bun run build           # produces .next/standalone
node .next/standalone/server.js   # standalone runtime proof
curl -s http://127.0.0.1:3000/api/health
# performance (k6 binary, not npm): see tests/performance/README.md
```

## Health contract

`GET /api/health` → `200 {"status":"ok","service":"thg-public-web","runtime":"next"}`,
`Cache-Control: no-store`. No timestamps, no infra details, no secrets.

## Scope (FND-001)

Foundation only. **Not** included: locale routes, `proxy.ts`, CMS/catalog fetching, homepage
parity, community, Ask THG, tracking, production deployment, AI. Those arrive in later specs.
