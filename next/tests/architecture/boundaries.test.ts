import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

// Architecture import gate (FND-001 §10). Deterministic — no ESLint plugin resolution.
// Scans src/** and asserts no zone imports a forbidden target; fixtures below prove the
// gate FAILS correctly on representative violations.

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "src");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return sourceFiles(p);
    return /\.(ts|tsx)$/.test(p) ? [p] : [];
  });
}

function importSpecifiers(code: string): string[] {
  const specs: string[] = [];
  for (const m of code.matchAll(/(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g)) specs.push(m[1]);
  return specs;
}

interface Rule {
  name: string;
  inZone: (file: string) => boolean;
  forbidden: (spec: string) => boolean;
  message: string;
}

const norm = (f: string) => f.replaceAll("\\", "/");

const RULES: Rule[] = [
  {
    name: "contracts",
    inZone: (f) => norm(f).includes("/src/contracts/"),
    forbidden: (s) =>
      /^(react|react-dom|next)(\/|$)/.test(s) ||
      /^@\/(app|features|integrations)\//.test(s) ||
      /^@\/shared\/ui(\/|$)/.test(s),
    message: "contracts must not import framework, app, features, integrations or UI",
  },
  {
    name: "shared",
    inZone: (f) => norm(f).includes("/src/shared/"),
    forbidden: (s) => /^@\/(app|features|integrations)\//.test(s),
    message: "shared must not import app, features or integrations",
  },
  {
    name: "integrations",
    inZone: (f) => norm(f).includes("/src/integrations/"),
    forbidden: (s) => /^@\/(app|features)\//.test(s),
    message: "integrations may import only contracts, shared/config and shared/errors",
  },
];

describe("architecture boundaries", () => {
  it("no source file violates a boundary rule", () => {
    const violations: string[] = [];
    for (const file of sourceFiles(SRC)) {
      const specs = importSpecifiers(readFileSync(file, "utf8"));
      for (const rule of RULES) {
        if (!rule.inZone(file)) continue;
        for (const spec of specs) {
          if (rule.forbidden(spec)) violations.push(`${norm(file)} imports "${spec}" — ${rule.message}`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  // Fixtures: prove the gate actually fails on forbidden imports.
  it("gate flags forbidden contracts imports", () => {
    const contracts = RULES.find((r) => r.name === "contracts")!;
    expect(contracts.forbidden("react")).toBe(true);
    expect(contracts.forbidden("next/server")).toBe(true);
    expect(contracts.forbidden("@/app/page")).toBe(true);
    expect(contracts.forbidden("@/shared/ui/button")).toBe(true);
    expect(contracts.forbidden("@/contracts/experience")).toBe(false);
  });

  it("gate flags forbidden shared → features import", () => {
    const shared = RULES.find((r) => r.name === "shared")!;
    expect(shared.forbidden("@/features/home/server/loader")).toBe(true);
    expect(shared.forbidden("@/shared/errors")).toBe(false);
  });

  it("gate flags forbidden integrations → app/features import", () => {
    const integ = RULES.find((r) => r.name === "integrations")!;
    expect(integ.forbidden("@/app/page")).toBe(true);
    expect(integ.forbidden("@/features/catalog/index")).toBe(true);
    expect(integ.forbidden("@/contracts/events")).toBe(false);
    expect(integ.forbidden("@/shared/config/env.public")).toBe(false);
  });
});
