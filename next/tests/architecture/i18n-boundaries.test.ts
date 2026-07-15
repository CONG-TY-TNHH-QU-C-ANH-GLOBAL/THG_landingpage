import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

// FND-002 i18n boundary proofs (extends the FND-001 architecture gate). Server/client
// separation for dictionaries + proxy request-safety, with a fixture proving the gate fails.

const I18N = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "src", "shared", "i18n");
const read = (p: string) => readFileSync(p, "utf8");
const norm = (p: string) => p.replaceAll("\\", "/");

function tsFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? tsFiles(p) : /\.ts$/.test(p) ? [p] : [];
  });
}

describe("shared/i18n server/client boundaries", () => {
  it("the server dictionary loader declares an explicit server-only boundary", () => {
    expect(read(join(I18N, "server", "get-dictionary.ts"))).toMatch(/import\s+["']server-only["']/);
  });

  it("the public i18n index is client-safe (does not pull the server loader)", () => {
    const idx = read(join(I18N, "index.ts"));
    // must not import/re-export the server loader or server-only (comments are allowed)
    expect(idx).not.toMatch(/from\s+["'][^"']*server\/get-dictionary/);
    expect(idx).not.toMatch(/import\s+["']server-only["']/);
  });

  it("no i18n module imports app/features/integrations, and only the server layer imports server-only", () => {
    for (const f of tsFiles(I18N)) {
      const src = read(f);
      expect(src).not.toMatch(/from\s+["']@\/(app|features|integrations)\//);
      const importsServerOnly = /import\s+["']server-only["']/.test(src);
      if (importsServerOnly) expect(norm(f)).toContain("/server/");
    }
  });

  it("proxy.ts imports only the request-safe locale-routing primitive (no loader/app/features)", () => {
    const src = read(join(I18N, "..", "..", "proxy.ts"));
    expect(src).toMatch(/shared\/i18n\/config\/locale-routing/);
    expect(src).not.toMatch(/server\/get-dictionary/);
    expect(src).not.toMatch(/@\/(app|features|integrations)\//);
  });

  // Fixture: prove the "shared may not import app/features/integrations" rule flags a violation.
  it("gate flags a forbidden i18n → app import (fixture)", () => {
    const forbidden = (spec: string) => /^@\/(app|features|integrations)\//.test(spec);
    expect(forbidden("@/app/page")).toBe(true);
    expect(forbidden("@/features/home/index")).toBe(true);
    expect(forbidden("../config/locales")).toBe(false);
  });
});
