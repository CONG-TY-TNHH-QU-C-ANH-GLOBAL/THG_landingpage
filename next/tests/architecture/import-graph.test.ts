import { describe, it, expect } from "vitest";
import { importSpecifiers, canonicalizeImport } from "./import-graph";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "src");

describe("importSpecifiers (TypeScript AST)", () => {
  it("detects default/named/namespace/type-only/side-effect imports in source order", () => {
    const code = [
      'import def from "a";',
      'import { x, y } from "b";',
      'import * as ns from "c";',
      'import type { T } from "d";',
      'import "e";',
      'import type Def2 from "f";',
    ].join("\n");
    expect(importSpecifiers(code)).toEqual(["a", "b", "c", "d", "e", "f"]);
  });

  it("detects a side-effect import that contains an inline annotation/comment", () => {
    expect(importSpecifiers('import /* keep */ "side-effect";')).toEqual(["side-effect"]);
    expect(importSpecifiers('import "server-only"; // guard')).toEqual(["server-only"]);
  });

  it("ignores imports written inside comments", () => {
    const code = '// import fake from "in-line-comment";\n/* import fake2 from "block-comment"; */\nimport real from "real";';
    expect(importSpecifiers(code)).toEqual(["real"]);
  });

  it("ignores imports written inside strings and template strings", () => {
    const code = ['const s = \'import z from "in-string"\';', "const t = `import q from \"in-template\"`;", 'import real from "real";'].join("\n");
    expect(importSpecifiers(code)).toEqual(["real"]);
  });

  it("ignores dynamic import(...) expressions", () => {
    const code = 'const m = import("dynamic");\nfunction f() { return import("dynamic2"); }\nimport real from "real";';
    expect(importSpecifiers(code)).toEqual(["real"]);
  });

  it("preserves exact module-specifier strings", () => {
    const code = 'import a from "@/shared/i18n";\nimport b from "../config/locales";\nimport c from "next/server";';
    expect(importSpecifiers(code)).toEqual(["@/shared/i18n", "../config/locales", "next/server"]);
  });

  it("returns [] for a file with no static imports", () => {
    expect(importSpecifiers('export const x = 1;\nconst y = import("z");')).toEqual([]);
  });
});

describe("canonicalizeImport (unchanged behavior)", () => {
  it("resolves relative specifiers to @/… and leaves packages/aliases unchanged", () => {
    const f = join(SRC, "integrations", "cms", "client.ts");
    expect(canonicalizeImport(f, SRC, "../../shared/i18n")).toBe("@/shared/i18n");
    expect(canonicalizeImport(f, SRC, "react")).toBe("react");
    expect(canonicalizeImport(f, SRC, "@/contracts/events")).toBe("@/contracts/events");
  });
});
