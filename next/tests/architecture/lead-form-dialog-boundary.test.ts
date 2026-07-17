import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { sourceFiles, moduleSpecifiers, canonicalizeImport } from "./import-graph";

// Regression gate for WEB-001: a Server Component building a `<Button>` and passing it as
// LeadFormDialog's `trigger` prop crosses the RSC boundary as a lazy reference that
// @radix-ui/react-slot's cloneElement cannot resolve during SSR, so the trigger silently
// renders nothing server-side (recoverable hydration mismatch). LeadFormDialog must only be
// composed from within an already-"use client" file (see hero-primary-cta.tsx,
// contact-cta-trigger.tsx, navbar.tsx, floating-contact.tsx).

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "src");
const norm = (f: string) => f.replaceAll("\\", "/");
const LEAD_FORM_DIALOG = "@/shared/ui/lead-form-dialog";

function isClientFile(code: string): boolean {
  return /^\s*(\/\/[^\n]*\n|\/\*[\s\S]*?\*\/\n?)*\s*["']use client["'];/.test(code);
}

describe("LeadFormDialog boundary", () => {
  it("is only imported by files that declare \"use client\"", () => {
    const violations: string[] = [];
    for (const file of sourceFiles(SRC)) {
      if (norm(file).endsWith("/shared/ui/lead-form-dialog.tsx")) continue;
      const code = readFileSync(file, "utf8");
      const importsLeadFormDialog = moduleSpecifiers(code).some(
        (raw) => canonicalizeImport(file, SRC, raw) === LEAD_FORM_DIALOG,
      );
      if (importsLeadFormDialog && !isClientFile(code)) {
        violations.push(norm(file));
      }
    }
    expect(violations).toEqual([]);
  });
});
