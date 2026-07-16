import * as ts from "typescript";
import { readdirSync, statSync } from "node:fs";
import { join, dirname, relative, resolve, sep } from "node:path";

// Architecture-test boundary helper (not an application utility). Extracts import specifiers
// via the TypeScript AST and resolves relative (`./`, `../`) imports to a canonical `@/…` form
// so relative imports cannot bypass the boundary rules.

export function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return sourceFiles(p);
    return /\.(ts|tsx)$/.test(p) ? [p] : [];
  });
}

/**
 * Module specifiers from real static `import` declarations only, in source order. Handles
 * default / named / namespace / type-only / side-effect imports (incl. with annotations).
 * Ignores imports inside comments, strings/templates and dynamic `import(...)` expressions —
 * those are not `ImportDeclaration` nodes. Does not execute the code.
 */
export function importSpecifiers(code: string): string[] {
  const sourceFile = ts.createSourceFile("module.tsx", code, ts.ScriptTarget.Latest, false, ts.ScriptKind.TSX);
  const specifiers: string[] = [];
  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
      specifiers.push(statement.moduleSpecifier.text);
    }
  }
  return specifiers;
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
