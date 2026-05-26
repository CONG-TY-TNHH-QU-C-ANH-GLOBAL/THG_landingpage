#!/usr/bin/env bun
/**
 * Drift check for the committed CMS OpenAPI-derived types.
 *
 * Workflow:
 *   1. Snapshot the currently-committed src/lib/cms-generated.d.ts.
 *   2. Run generate-cms-types.ts to fetch a fresh spec and regenerate.
 *   3. Compare the new file against the snapshot.
 *   4. Fail with an actionable, multi-line error if they diverge.
 *      Restore the snapshot so the working tree stays clean either way.
 *
 * Triggered by CI (`.github/workflows/deploy.yml`) on every push to main.
 * Also runnable locally: `bun run check:cms-types`.
 *
 * Bypass: this script has no env logic of its own; CI conditionally skips
 * invoking it when the `SKIP_CMS_TYPE_CHECK` repository variable is set
 * to "1" (audit-logged via a workflow notice). See deploy.yml.
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, "..");
const TARGET = resolve(ROOT, "src/lib/cms-generated.d.ts");

function readSnapshot(): string {
  // Normalize CRLF → LF so the check is portable across Windows checkouts
  // (where core.autocrlf can introduce \r) and CI Linux runners (always LF).
  // The .gitattributes also pins the file to eol=lf so this normalization
  // is belt-and-braces.
  return readFileSync(TARGET, "utf-8").replace(/\r\n/g, "\n");
}

function restoreSnapshot(snapshot: string): void {
  writeFileSync(TARGET, snapshot, "utf-8");
}

function printDriftReport(): void {
  process.stderr.write(`\n${"━".repeat(72)}\n`);
  process.stderr.write("✗ src/lib/cms-generated.d.ts is OUT OF DATE\n\n");
  process.stderr.write("WHY THIS FAILED\n");
  process.stderr.write("  The committed src/lib/cms-generated.d.ts no longer matches a\n");
  process.stderr.write("  fresh regeneration against the live CMS OpenAPI spec\n");
  process.stderr.write("  ($VITE_CMS_API_URL/openapi). Either:\n");
  process.stderr.write("    (a) the backend added/changed/removed an annotated route, or\n");
  process.stderr.write("    (b) someone edited the generated file by hand.\n");
  process.stderr.write("  Either way, the file in this PR no longer reflects the contract.\n\n");
  process.stderr.write("REGENERATE LOCALLY\n");
  process.stderr.write("  bun run generate:cms-types\n");
  process.stderr.write("  git add src/lib/cms-generated.d.ts\n");
  process.stderr.write("  git commit -m \"chore(cms-codegen): refresh generated types\"\n");
  process.stderr.write("  git push\n\n");
  process.stderr.write("WHEN BYPASS IS ALLOWED (SKIP_CMS_TYPE_CHECK=1)\n");
  process.stderr.write("  Only when ALL of the following hold:\n");
  process.stderr.write("    1. The CMS worker (cms.thgfulfill.com) is unreachable AND\n");
  process.stderr.write("    2. The PR does NOT touch landing's consumption of CMS types AND\n");
  process.stderr.write("    3. A reviewer has verified no backend schema change is in flight\n");
  process.stderr.write("       AND a follow-up issue is filed to refresh types post-incident.\n");
  process.stderr.write("  How: repo admin sets repository variable SKIP_CMS_TYPE_CHECK=1\n");
  process.stderr.write("       (Settings → Secrets and variables → Actions → Variables).\n");
  process.stderr.write("       The bypass emits a ::notice annotation in CI output for audit.\n");
  process.stderr.write("       UNSET the variable after the incident.\n");
  process.stderr.write(`${"━".repeat(72)}\n\n`);
  process.stderr.write("Diff (committed → fresh regeneration):\n");
  try {
    execSync(`git diff --no-color -- "${TARGET}"`, { stdio: "inherit" });
  } catch {
    /* git diff itself may exit non-zero; output already streamed */
  }
}

const snapshot = readSnapshot();
try {
  execSync("bun run generate:cms-types", { stdio: "inherit" });
} catch (err) {
  process.stderr.write(`\n✗ Regeneration failed before drift check could run.\n`);
  process.stderr.write(`  ${err instanceof Error ? err.message : String(err)}\n`);
  process.stderr.write(`  Check that VITE_CMS_API_URL is set and the CMS worker is reachable.\n`);
  process.exit(1);
}

const fresh = readSnapshot();
if (fresh === snapshot) {
  console.log("✓ src/lib/cms-generated.d.ts is in sync with live CMS spec.");
  process.exit(0);
}

// Drift detected — emit the report, restore the snapshot so the working
// tree is unchanged, and fail.
printDriftReport();
restoreSnapshot(snapshot);
process.exit(1);
