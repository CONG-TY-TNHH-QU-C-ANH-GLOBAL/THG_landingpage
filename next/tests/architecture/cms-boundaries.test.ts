import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import {
  sourceFiles,
  moduleSpecifiers,
  dynamicImportSpecifiers,
  canonicalizeImport,
} from "./import-graph";

// FND-004 CMS-adapter boundary gate (CODE_STRUCTURE "Import boundaries", AC-30). Deterministic
// AST scan — asserts the server-only transport cannot enter a client bundle, the proxy, or the
// wrong dependency direction, and that shared/cms leaks no FND-005/FND-006 ownership. Enforcing,
// not documenting: the predicate helpers are unit-checked against synthetic violations below.

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "src");
const CMS_DIR = join(SRC, "shared", "cms");
const norm = (f: string) => f.replaceAll("\\", "/");

// The server-only transport surface: the barrel (which re-exports cmsFetch) and cmsFetch itself.
// The isomorphic error subtree ("@/shared/cms/errors") is intentionally NOT here — clients may
// import it.
const isCmsTransportImport = (spec: string): boolean =>
  /^@\/shared\/cms(\/(index|cmsFetch))?$/.test(spec);

// "use client" as a directive prologue: strip a UTF-8 BOM, then skip whitespace and leading
// comments; the first token must be the directive.
const stripBom = (s: string): string => (s.charCodeAt(0) === 0xfeff ? s.slice(1) : s);
const isClientModule = (code: string): boolean =>
  /^\s*(?:\/\/[^\n]*\n|\/\*[\s\S]*?\*\/|\s)*(['"])use client\1/.test(stripBom(code));

const isProxyModule = (file: string): boolean => norm(file).endsWith("/src/proxy.ts");

// Static and dynamic imports alike — a dynamic import("...") must not bypass the gate.
const allSpecifiers = (code: string): string[] => [
  ...moduleSpecifiers(code),
  ...dynamicImportSpecifiers(code),
];

const isFeatureAppOrIntegration = (spec: string): boolean =>
  /^@\/(app|features|integrations)\//.test(spec);

describe("CMS adapter boundaries (FND-004)", () => {
  it("no Client Component imports the server-only CMS transport (AC-30)", () => {
    const violations: string[] = [];
    for (const file of sourceFiles(SRC)) {
      const code = readFileSync(file, "utf8");
      if (!isClientModule(code)) continue;
      for (const raw of allSpecifiers(code)) {
        if (isCmsTransportImport(canonicalizeImport(file, SRC, raw))) {
          violations.push(`${norm(file)} ("use client") imports the CMS transport "${raw}"`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("proxy.ts does not import the CMS adapter", () => {
    const violations: string[] = [];
    for (const file of sourceFiles(SRC)) {
      if (!isProxyModule(file)) continue;
      for (const raw of allSpecifiers(readFileSync(file, "utf8"))) {
        const spec = canonicalizeImport(file, SRC, raw);
        if (isCmsTransportImport(spec) || /^@\/shared\/cms(\/|$)/.test(spec)) {
          violations.push(`proxy.ts imports the CMS adapter "${raw}"`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("shared/cms never imports app, features or integrations", () => {
    const violations: string[] = [];
    for (const file of sourceFiles(CMS_DIR)) {
      for (const raw of allSpecifiers(readFileSync(file, "utf8"))) {
        if (isFeatureAppOrIntegration(canonicalizeImport(file, SRC, raw))) {
          violations.push(`${norm(file)} imports "${raw}"`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("cmsFetch declares the server-only guard", () => {
    const code = readFileSync(join(CMS_DIR, "cmsFetch.ts"), "utf8");
    expect(moduleSpecifiers(code)).toContain("server-only");
  });

  it("shared/cms owns no FND-005 mappers/models nor FND-006 tags/revalidation", () => {
    const leaks = sourceFiles(CMS_DIR)
      .map(norm)
      .filter((f) => /\/(tags|revalidate|mappers?|models?)\.tsx?$/.test(f));
    expect(leaks).toEqual([]);
  });

  // ── Predicate self-checks: prove the gate catches violations (enforcing, not documenting) ──

  it("isCmsTransportImport flags the transport but not the isomorphic error subtree", () => {
    expect(isCmsTransportImport("@/shared/cms")).toBe(true);
    expect(isCmsTransportImport("@/shared/cms/cmsFetch")).toBe(true);
    expect(isCmsTransportImport("@/shared/cms/index")).toBe(true);
    expect(isCmsTransportImport("@/shared/cms/errors")).toBe(false);
    expect(isCmsTransportImport("@/shared/i18n")).toBe(false);
  });

  it("catches a dynamic import of the transport from a Client Component (synthetic violation)", () => {
    const code = '"use client";\nexport async function load() {\n  return import("@/shared/cms");\n}';
    expect(isClientModule(code)).toBe(true);
    const specs = allSpecifiers(code);
    expect(specs).toContain("@/shared/cms");
    const file = join(SRC, "features", "synthetic", "Client.tsx");
    expect(specs.some((s) => isCmsTransportImport(canonicalizeImport(file, SRC, s)))).toBe(true);
  });

  it("isClientModule detects the directive past comments but not incidental strings", () => {
    expect(isClientModule('"use client";\nimport x from "y";')).toBe(true);
    expect(isClientModule("// header\n'use client'\n")).toBe(true);
    expect(isClientModule('/* c */ "use client"')).toBe(true);
    expect(isClientModule('const s = "use client";')).toBe(false);
    expect(isClientModule('import "server-only";')).toBe(false);
  });
});
