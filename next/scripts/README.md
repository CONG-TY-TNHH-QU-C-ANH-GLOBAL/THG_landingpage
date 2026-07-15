# scripts/

Application scripts, reserved by area. **No script is implemented in FND-001** (the
architecture gate is a vitest test, not a script).

| Dir | Purpose | Owner |
|---|---|---|
| `validation/` | build/parity/boundary validation scripts | first real consumer (e.g. FND-003 head-parity, M9) |
| `migration/` | one-off migration/codemod scripts | first real consumer (M2+) |

Created on first use; not pre-generated as empty directories.
