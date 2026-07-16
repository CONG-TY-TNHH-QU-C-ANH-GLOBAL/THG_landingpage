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

// FND-003 boundary gate: the SEO plane stays a shared leaf (no app/feature/UI imports), the
// proxy stays SEO-free, client code never bundles the metadata builders, and no Vite-era
// SEO/routing library or Vite env API enters next/.

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "src");
const SEO_DIR = join(SRC, "shared", "seo");
const norm = (f: string) => f.replaceAll("\\", "/");

const allSpecifiers = (code: string): string[] => [
  ...moduleSpecifiers(code),
  ...dynamicImportSpecifiers(code),
];

const FORBIDDEN_LIBS = /^(react-helmet-async|react-router-dom|react-router)(\/|$)/;

const isClientModule = (code: string): boolean =>
  /^\s*(?:\/\/[^\n]*\n|\/\*[\s\S]*?\*\/|\s)*(['"])use client\1/.test(
    code.charCodeAt(0) === 0xfeff ? code.slice(1) : code,
  );

describe("SEO plane boundaries (FND-003)", () => {
  it("shared/seo never imports app, features or integrations", () => {
    const violations: string[] = [];
    for (const file of sourceFiles(SEO_DIR)) {
      for (const raw of allSpecifiers(readFileSync(file, "utf8"))) {
        if (/^@\/(app|features|integrations)\//.test(canonicalizeImport(file, SRC, raw))) {
          violations.push(`${norm(file)} imports "${raw}"`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("proxy.ts does not import the SEO plane", () => {
    const violations: string[] = [];
    for (const file of sourceFiles(SRC)) {
      if (!norm(file).endsWith("/src/proxy.ts")) continue;
      for (const raw of allSpecifiers(readFileSync(file, "utf8"))) {
        if (/^@\/shared\/seo(\/|$)/.test(canonicalizeImport(file, SRC, raw))) {
          violations.push(`proxy.ts imports "${raw}"`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("no Client Component imports the SEO plane (metadata is a server concern)", () => {
    const violations: string[] = [];
    for (const file of sourceFiles(SRC)) {
      const code = readFileSync(file, "utf8");
      if (!isClientModule(code)) continue;
      for (const raw of allSpecifiers(code)) {
        if (/^@\/shared\/seo(\/|$)/.test(canonicalizeImport(file, SRC, raw))) {
          violations.push(`${norm(file)} ("use client") imports "${raw}"`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("no module in next/src imports react-helmet-async or react-router (Vite-era libraries)", () => {
    const violations: string[] = [];
    for (const file of sourceFiles(SRC)) {
      for (const raw of allSpecifiers(readFileSync(file, "utf8"))) {
        if (FORBIDDEN_LIBS.test(raw)) {
          violations.push(`${norm(file)} imports "${raw}"`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("no module in next/src uses the Vite env API (import.meta.env)", () => {
    const violations = sourceFiles(SRC)
      .filter((file) => /import\.meta\.env/.test(readFileSync(file, "utf8")))
      .map(norm);
    expect(violations).toEqual([]);
  });

  // ── Predicate self-check: the gate catches violations (enforcing, not documenting) ──

  it("flags the forbidden Vite-era libraries but not similar names", () => {
    expect(FORBIDDEN_LIBS.test("react-helmet-async")).toBe(true);
    expect(FORBIDDEN_LIBS.test("react-router-dom")).toBe(true);
    expect(FORBIDDEN_LIBS.test("react-router")).toBe(true);
    expect(FORBIDDEN_LIBS.test("react-router-dom/server")).toBe(true);
    expect(FORBIDDEN_LIBS.test("react")).toBe(false);
    expect(FORBIDDEN_LIBS.test("next/router")).toBe(false);
  });
});
