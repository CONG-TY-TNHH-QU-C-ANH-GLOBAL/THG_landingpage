# tests/

| Dir | Purpose | Status in FND-001 |
|---|---|---|
| `architecture/` | import-boundary gate (+ forbidden-import fixtures) | **implemented** |
| `smoke/` | foundation contract checks (health, errors, env) | **implemented** |
| `performance/` | k6 load scenarios (smoke / baseline / capacity) | **implemented** (scripts) |
| `contract/` | cross-product contract conformance | reserved — first contract consumer |
| `integration/` | feature loader ↔ integration tests | reserved — M2+ |
| `e2e/` | Playwright end-to-end | reserved — FND-002/WEB-001 |

Reserved dirs are documented here, not pre-generated as empty directories. Unit/smoke/
architecture tests run under `bun run test` (vitest). Performance runs via the k6 binary.
