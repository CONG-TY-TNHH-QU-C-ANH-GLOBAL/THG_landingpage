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

// FND-005 boundary gate (CODE_STRUCTURE "Import boundaries"): DTOs never cross the feature
// boundary, models stay pure data, loaders stay server-only, and client code never pulls
// the server loader surface.

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "src");
const HOME = join(SRC, "features", "home");
const norm = (f: string) => f.replaceAll("\\", "/");

const allSpecifiers = (code: string): string[] => [
  ...moduleSpecifiers(code),
  ...dynamicImportSpecifiers(code),
];

const isClientModule = (code: string): boolean =>
  /^\s*(?:\/\/[^\n]*\n|\/\*[\s\S]*?\*\/|\s)*(['"])use client\1/.test(
    code.charCodeAt(0) === 0xfeff ? code.slice(1) : code,
  );

describe("home content boundaries (FND-005)", () => {
  it("the feature barrel never re-exports schemas or Cms* DTO types", () => {
    const code = readFileSync(join(HOME, "index.ts"), "utf8");
    for (const spec of allSpecifiers(code)) {
      expect(spec).not.toMatch(/\/schemas\//);
    }
    // Cms* names are reserved for DTO types and must not appear on the public surface.
    expect(code).not.toMatch(/\bCms\w+/);
  });

  it("models are plain data: no zod, no schema imports, no runtime imports at all", () => {
    for (const file of sourceFiles(join(HOME, "models"))) {
      expect(allSpecifiers(readFileSync(file, "utf8")), norm(file)).toEqual([]);
    }
  });

  it("every server loader module declares the server-only guard", () => {
    for (const file of sourceFiles(join(HOME, "server"))) {
      expect(moduleSpecifiers(readFileSync(file, "utf8")), norm(file)).toContain("server-only");
    }
  });

  it("features/home never imports app, other features, or the proxy", () => {
    const violations: string[] = [];
    for (const file of sourceFiles(HOME)) {
      for (const raw of allSpecifiers(readFileSync(file, "utf8"))) {
        const spec = canonicalizeImport(file, SRC, raw);
        if (/^@\/(app\/|proxy$)/.test(spec) || (/^@\/features\//.test(spec) && !spec.startsWith("@/features/home"))) {
          violations.push(`${norm(file)} imports "${raw}"`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("no Client Component imports the home server loaders", () => {
    const violations: string[] = [];
    for (const file of sourceFiles(SRC)) {
      const code = readFileSync(file, "utf8");
      if (!isClientModule(code)) continue;
      for (const raw of allSpecifiers(code)) {
        if (/^@\/features\/home(\/server)?(\/|$)/.test(canonicalizeImport(file, SRC, raw))) {
          violations.push(`${norm(file)} ("use client") imports "${raw}"`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("mappers import only their feature's schemas/models (pure DTO→model bridges)", () => {
    const violations: string[] = [];
    for (const file of sourceFiles(join(HOME, "mappers"))) {
      for (const raw of allSpecifiers(readFileSync(file, "utf8"))) {
        const spec = canonicalizeImport(file, SRC, raw);
        const allowed =
          spec.startsWith("@/features/home/") || spec === "@/shared/cms/schemas";
        if (!allowed) violations.push(`${norm(file)} imports "${raw}"`);
      }
    }
    expect(violations).toEqual([]);
  });
});
