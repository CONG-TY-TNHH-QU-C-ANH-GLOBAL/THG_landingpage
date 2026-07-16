import { readdirSync, statSync } from "node:fs";
import { join, dirname, relative, resolve, sep } from "node:path";

// Architecture-test boundary helper (not an application utility). Resolves import specifiers to
// a canonical `@/…`-form so relative (`./`, `../`) imports cannot bypass the boundary rules.

export function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return sourceFiles(p);
    return /\.(ts|tsx)$/.test(p) ? [p] : [];
  });
}

export function importSpecifiers(code: string): string[] {
  const specs: string[] = [];
  for (const m of code.matchAll(/(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g)) specs.push(m[1]);
  return specs;
}

const toPosix = (p: string) => p.split(sep).join("/");

/**
 * Canonicalize an import specifier to a `@/…` key rooted at `srcRoot`:
 * - package imports (e.g. `react`, `next/server`) are returned unchanged;
 * - `@/…` aliases are returned unchanged;
 * - `./` / `../` specifiers are resolved from `importerFile` and rewritten to `@/…` when they
 *   land under `srcRoot` (so `../../shared/i18n` becomes `@/shared/i18n`).
 * Does not execute the imported file.
 */
export function canonicalizeImport(importerFile: string, srcRoot: string, spec: string): string {
  if (spec.startsWith("@/")) return spec;
  if (spec.startsWith(".")) {
    const abs = resolve(dirname(importerFile), spec);
    const rel = toPosix(relative(srcRoot, abs));
    return rel.startsWith("..") ? spec : `@/${rel}`;
  }
  return spec;
}
