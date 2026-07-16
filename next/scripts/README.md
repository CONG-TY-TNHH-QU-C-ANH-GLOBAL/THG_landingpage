# scripts/

Application scripts.

| Script / dir | Purpose | Owner |
|---|---|---|
| `package-standalone.mjs` | copy `.next/static` + `public/` into `.next/standalone` (self-contained artifact) | FND-001 |
| `validation/locale-routing-matrix.sh` | runtime locale routing matrix vs the standalone artifact | FND-002 |
| `validation/` (more) | build/parity/boundary validation scripts | first real consumer (e.g. FND-003 head-parity, M9) |
| `migration/` | one-off migration/codemod scripts | first real consumer (M2+) |

Reserved subdirectories are created on first use; not pre-generated as empty directories.
