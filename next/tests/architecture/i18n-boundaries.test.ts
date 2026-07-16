import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { sourceFiles, importSpecifiers, canonicalizeImport } from "./import-graph";

// FND-002 i18n boundary proofs. Server/client separation for dictionaries + proxy
// request-safety, with relative imports resolved so they cannot bypass the checks.

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "src");
const I18N = join(SRC, "shared", "i18n");
const read = (p: string) => readFileSync(p, "utf8");
const norm = (p: string) => p.replaceAll("\\", "/");

describe("shared/i18n server/client boundaries", () => {
  it("the server dictionary loader declares an explicit server-only boundary", () => {
    expect(read(join(I18N, "server", "get-dictionary.ts"))).toMatch(/import\s+["']server-only["']/);
  });

  it("the public i18n index is client-safe (does not pull the server loader)", () => {
    const idx = read(join(I18N, "index.ts"));
    expect(idx).not.toMatch(/from\s+["'][^"']*server\/get-dictionary/);
    expect(idx).not.toMatch(/import\s+["']server-only["']/);
  });

  it("no i18n module imports app/features/integrations (relative resolved); only server imports server-only", () => {
    for (const f of sourceFiles(I18N)) {
      const src = read(f);
      for (const raw of importSpecifiers(src)) {
        const spec = canonicalizeImport(f, SRC, raw);
        expect(/^@\/(app|features|integrations)\//.test(spec), `${norm(f)} imports ${spec}`).toBe(false);
      }
      if (/import\s+["']server-only["']/.test(src)) expect(norm(f)).toContain("/server/");
    }
  });

  it("proxy.ts imports only the request-safe locale-routing primitive (relative resolved)", () => {
    const proxy = join(SRC, "proxy.ts");
    const specs = importSpecifiers(read(proxy)).map((s) => canonicalizeImport(proxy, SRC, s));
    expect(specs.some((s) => s.includes("shared/i18n/config/locale-routing"))).toBe(true);
    for (const s of specs) {
      expect(/server\/get-dictionary/.test(s)).toBe(false);
      expect(/^@\/(app|features|integrations)\//.test(s)).toBe(false);
    }
  });

  it("gate flags a forbidden i18n → app import via a relative path (fixture)", () => {
    const f = join(I18N, "server", "get-dictionary.ts");
    const forbidden = (spec: string) => /^@\/(app|features|integrations)\//.test(spec);
    expect(canonicalizeImport(f, SRC, "../../../app/page")).toBe("@/app/page");
    expect(forbidden(canonicalizeImport(f, SRC, "../../../app/page"))).toBe(true);
    expect(forbidden(canonicalizeImport(f, SRC, "../config/locales"))).toBe(false);
  });
});
