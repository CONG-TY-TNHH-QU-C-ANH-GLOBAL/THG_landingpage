import * as ts from "typescript";
import { readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";

// Architecture-test boundary helper (not an application utility). Extracts module specifiers
// via the TypeScript AST and resolves relative (`./`, `../`) imports to a canonical `@/…` form
// so relative imports cannot bypass the boundary rules.

export function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);

    if (statSync(path).isDirectory()) {
      return sourceFiles(path);
    }

    return /\.(ts|tsx)$/.test(path) ? [path] : [];
  });
}

/**
 * Returns the static dependency module specifier carried by an import or re-export statement.
 *
 * Supported:
 * - import x from "..."
 * - import type { X } from "..."
 * - import "..."
 * - export { x } from "..."
 * - export type { X } from "..."
 * - export * from "..."
 * - export * as ns from "..."
 *
 * Returns undefined for local exports, dynamic imports and other statements.
 */
function staticModuleSpecifier(statement: ts.Statement): string | undefined {
  if (!ts.isImportDeclaration(statement) && !ts.isExportDeclaration(statement)) {
    return undefined;
  }

  const { moduleSpecifier } = statement;

  return moduleSpecifier && ts.isStringLiteral(moduleSpecifier)
    ? moduleSpecifier.text
    : undefined;
}

/**
 * Module specifiers of the dependency graph, in source order.
 *
 * Ignores import-like text inside comments, strings and templates, dynamic
 * `import(...)` expressions, and local exports without a module specifier.
 * Does not execute the source code.
 */
export function moduleSpecifiers(code: string): string[] {
  const sourceFile = ts.createSourceFile(
    "module.tsx",
    code,
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TSX,
  );

  const specifiers: string[] = [];

  for (const statement of sourceFile.statements) {
    const specifier = staticModuleSpecifier(statement);

    if (specifier !== undefined) {
      specifiers.push(specifier);
    }
  }

  return specifiers;
}

function toPosix(path: string): string {
  return path.split(sep).join("/");
}

/**
 * Canonicalizes an import specifier to an `@/…` key rooted at `srcRoot`:
 * - package imports such as `react` and `next/server` remain unchanged;
 * - `@/…` aliases remain unchanged;
 * - relative specifiers are resolved from `importerFile` and converted to
 *   `@/…` when they land under `srcRoot`.
 *
 * Does not execute the imported module.
 */
export function canonicalizeImport(
  importerFile: string,
  srcRoot: string,
  specifier: string,
): string {
  if (specifier.startsWith("@/")) {
    return specifier;
  }

  if (!specifier.startsWith(".")) {
    return specifier;
  }

  const absolutePath = resolve(dirname(importerFile), specifier);
  const relativePath = toPosix(relative(srcRoot, absolutePath));

  return relativePath.startsWith("..")
    ? specifier
    : `@/${relativePath}`;
}