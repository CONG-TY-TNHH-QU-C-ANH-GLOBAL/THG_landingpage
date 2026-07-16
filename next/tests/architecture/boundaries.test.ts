import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { sourceFiles, moduleSpecifiers, canonicalizeImport } from "./import-graph";

// Architecture import gate (FND-001 §10 + FND-002 review). Deterministic — no ESLint plugin
// resolution. Scans src/**, resolves relative imports to a canonical `@/…` form (so `../`
// imports cannot bypass the rules), and asserts no zone imports a forbidden target.

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "src");
const norm = (f: string) => f.replaceAll("\\", "/");

// A shared import that is NOT the allowlisted config/errors subtree.
const isDisallowedSharedForIntegrations = (s: string) =>
  /^@\/shared\//.test(s) && !/^@\/shared\/(config|errors)(\/|$)/.test(s);

interface Rule {
  name: string;
  inZone: (file: string) => boolean;
  forbidden: (canonicalSpec: string) => boolean;
  message: string;
}

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
    // allowlist: only contracts, shared/config, shared/errors (+ packages/contracts).
    forbidden: (s) => /^@\/(app|features)\//.test(s) || isDisallowedSharedForIntegrations(s),
    message: "integrations may import only contracts, shared/config and shared/errors",
  },
];

describe("architecture boundaries", () => {
  it("no source file violates a boundary rule (relative imports resolved)", () => {
    const violations: string[] = [];
    for (const file of sourceFiles(SRC)) {
      for (const raw of moduleSpecifiers(readFileSync(file, "utf8"))) {
        const spec = canonicalizeImport(file, SRC, raw);
        for (const rule of RULES) {
          if (rule.inZone(file) && rule.forbidden(spec)) {
            violations.push(`${norm(file)} imports "${raw}" (→ ${spec}) — ${rule.message}`);
          }
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("resolves relative imports so they cannot bypass the rules", () => {
    const integFile = join(SRC, "integrations", "cms", "client.ts");
    expect(canonicalizeImport(integFile, SRC, "../../shared/i18n")).toBe("@/shared/i18n");
    expect(canonicalizeImport(integFile, SRC, "../../app/page")).toBe("@/app/page");
    expect(canonicalizeImport(integFile, SRC, "../../shared/config/env.public")).toBe("@/shared/config/env.public");
    expect(canonicalizeImport(integFile, SRC, "react")).toBe("react"); // package unchanged
    expect(canonicalizeImport(integFile, SRC, "@/contracts/events")).toBe("@/contracts/events"); // alias unchanged
  });

  it("contracts rule flags framework/app/features/integrations/UI", () => {
    const r = RULES.find((x) => x.name === "contracts")!;
    expect(r.forbidden("react")).toBe(true);
    expect(r.forbidden("next/server")).toBe(true);
    expect(r.forbidden("@/app/page")).toBe(true);
    expect(r.forbidden("@/shared/ui/button")).toBe(true);
    expect(r.forbidden("@/contracts/experience")).toBe(false);
  });

  it("shared rule flags app/features/integrations", () => {
    const r = RULES.find((x) => x.name === "shared")!;
    expect(r.forbidden("@/features/home/server/loader")).toBe(true);
    expect(r.forbidden("@/app/page")).toBe(true);
    expect(r.forbidden("@/integrations/hub/deepLink")).toBe(true);
    expect(r.forbidden("@/shared/errors")).toBe(false);
  });

  it("integrations allowlist: only contracts + shared/config + shared/errors", () => {
    const r = RULES.find((x) => x.name === "integrations")!;
    // allowed
    expect(r.forbidden("@/contracts/events")).toBe(false);
    expect(r.forbidden("@/shared/config/env.public")).toBe(false);
    expect(r.forbidden("@/shared/errors")).toBe(false);
    // rejected: app + features
    expect(r.forbidden("@/app/page")).toBe(true);
    expect(r.forbidden("@/features/catalog/index")).toBe(true);
    // rejected: every other shared subtree
    for (const s of ["ui", "i18n", "seo", "analytics", "security", "testing"]) {
      expect(r.forbidden(`@/shared/${s}/x`)).toBe(true);
      expect(r.forbidden(`@/shared/${s}`)).toBe(true);
    }
  });
});
