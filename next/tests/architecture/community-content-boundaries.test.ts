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

// FND-005 boundary gate for the community feature — the same contract home is held to:
// DTOs never cross the feature boundary, models stay pure data, loaders stay server-only,
// and client islands never pull the server loader surface.

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "src");
const COMMUNITY = join(SRC, "features", "community");
const norm = (f: string) => f.replaceAll("\\", "/");

const allSpecifiers = (code: string): string[] => [
  ...moduleSpecifiers(code),
  ...dynamicImportSpecifiers(code),
];

const isClientModule = (code: string): boolean =>
  /^\s*(?:\/\/[^\n]*\n|\/\*[\s\S]*?\*\/|\s)*(['"])use client\1/.test(
    code.charCodeAt(0) === 0xfeff ? code.slice(1) : code,
  );

describe("community content boundaries (FND-005)", () => {
  it("the feature barrel never re-exports schemas or Cms* DTO types", () => {
    const code = readFileSync(join(COMMUNITY, "index.ts"), "utf8");
    for (const spec of allSpecifiers(code)) {
      expect(spec).not.toMatch(/\/schemas\//);
    }
    expect(code).not.toMatch(/\bCms\w+/);
  });

  it("models are plain data: no zod, no schema imports, no runtime imports at all", () => {
    for (const file of sourceFiles(join(COMMUNITY, "models"))) {
      expect(allSpecifiers(readFileSync(file, "utf8")), norm(file)).toEqual([]);
    }
  });

  it("every server loader module declares the server-only guard", () => {
    for (const file of sourceFiles(join(COMMUNITY, "server"))) {
      expect(moduleSpecifiers(readFileSync(file, "utf8")), norm(file)).toContain("server-only");
    }
  });

  it("features/community never imports app, other features, or the proxy", () => {
    const violations: string[] = [];
    for (const file of sourceFiles(COMMUNITY)) {
      for (const raw of allSpecifiers(readFileSync(file, "utf8"))) {
        const spec = canonicalizeImport(file, SRC, raw);
        if (
          /^@\/(app\/|proxy$)/.test(spec) ||
          (/^@\/features\//.test(spec) && !spec.startsWith("@/features/community"))
        ) {
          violations.push(`${norm(file)} imports "${raw}"`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("no Client Component imports the community server loaders", () => {
    const FORBIDDEN = /^@\/features\/community$|^@\/features\/community\/server(\/|$)/;
    const violations: string[] = [];
    for (const file of sourceFiles(SRC)) {
      const code = readFileSync(file, "utf8");
      if (!isClientModule(code)) continue;
      for (const raw of allSpecifiers(code)) {
        if (FORBIDDEN.test(canonicalizeImport(file, SRC, raw))) {
          violations.push(`${norm(file)} ("use client") imports "${raw}"`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("community UI consumes landing models only — never schemas, loaders or the CMS transport", () => {
    const violations: string[] = [];
    for (const file of sourceFiles(join(COMMUNITY, "ui"))) {
      for (const raw of allSpecifiers(readFileSync(file, "utf8"))) {
        const spec = canonicalizeImport(file, SRC, raw);
        if (/\/schemas(\/|$)/.test(spec) || /\/server(\/|$)/.test(spec) || /^@\/shared\/cms(\/|$)/.test(spec)) {
          violations.push(`${norm(file)} imports "${raw}"`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("mappers import only their feature's schemas/models (pure DTO→model bridges)", () => {
    const violations: string[] = [];
    for (const file of sourceFiles(join(COMMUNITY, "mappers"))) {
      for (const raw of allSpecifiers(readFileSync(file, "utf8"))) {
        const spec = canonicalizeImport(file, SRC, raw);
        const allowed = spec.startsWith("@/features/community/") || spec === "@/shared/cms/schemas";
        if (!allowed) violations.push(`${norm(file)} imports "${raw}"`);
      }
    }
    expect(violations).toEqual([]);
  });

  it("the server never touches owner-token or reaction storage (COM-001 §14, R-010)", () => {
    // Owner tokens are client-only by design. If a storage key or the withdraw field name
    // ever appears in server-rendered code, a token could reach a server log.
    //
    // Comments are stripped first: the schema files name the private CMS columns in prose
    // precisely to document that they must never be mapped, and documenting a forbidden
    // field is the opposite of using it.
    const stripComments = (code: string) =>
      code.replaceAll(/\/\*[\s\S]*?\*\//g, "").replaceAll(/(^|[^:])\/\/[^\n]*/g, "$1");

    const serverSurfaces = [
      ...sourceFiles(join(COMMUNITY, "server")),
      ...sourceFiles(join(COMMUNITY, "ui")),
      ...sourceFiles(join(COMMUNITY, "mappers")),
      ...sourceFiles(join(COMMUNITY, "models")),
      ...sourceFiles(join(COMMUNITY, "schemas")),
    ];
    const violations: string[] = [];
    for (const file of serverSurfaces) {
      const code = stripComments(readFileSync(file, "utf8"));
      if (/thg_community_owner|ownerToken|owner_token|localStorage/.test(code)) {
        violations.push(norm(file));
      }
    }
    expect(violations).toEqual([]);
  });
});
