#!/usr/bin/env bun
/**
 * Generate TypeScript types from the CMS OpenAPI spec.
 *
 * Source:  ${VITE_CMS_API_URL}/openapi  (live fetch from the deployed
 *          cmsthgfulfill worker; falls back to OPENAPI_URL env when
 *          VITE_CMS_API_URL is unset).
 * Output:  src/lib/cms-generated.d.ts (committed; D3.3 will CI-enforce
 *          that this file stays in sync via `git diff --exit-code`).
 *
 * Workflow
 *   - Local refresh:      bun run generate:cms-types
 *   - CI drift check:     bun run check:cms-types  (added in D3.3)
 *   - Backend changed:    regenerate locally, commit the diff, push.
 *
 * Why not bundle the spec at build time?
 *   The types are committed so:
 *     (1) builds remain offline-reproducible,
 *     (2) the spec drift becomes a Git-reviewable diff in PRs,
 *     (3) D5 cross-checks operate on a stable type artifact.
 */

import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import openapiTS, { astToString } from "openapi-typescript";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, "..");
const OUTPUT_PATH = resolve(ROOT, "src/lib/cms-generated.d.ts");

function resolveSpecUrl(): string {
  // Prefer explicit OPENAPI_URL (e.g. for ad-hoc testing against a preview
  // worker); otherwise derive from VITE_CMS_API_URL by appending /openapi.
  if (process.env.OPENAPI_URL) return process.env.OPENAPI_URL;
  const base = process.env.VITE_CMS_API_URL;
  if (!base) {
    throw new Error(
      "Missing VITE_CMS_API_URL (or OPENAPI_URL). Set in .env.local for local " +
        "regeneration, or in CI secrets for `bun run check:cms-types`.",
    );
  }
  // Trailing-slash safety: VITE_CMS_API_URL may end with /api/v1 or /api/v1/.
  return `${base.replace(/\/+$/, "")}/openapi`;
}

const HEADER = (specUrl: string) => `/**
 * THIS FILE IS AUTO-GENERATED — DO NOT EDIT BY HAND.
 *
 * Source:  ${specUrl}
 * Run:     bun run generate:cms-types
 * CI:      bun run check:cms-types  (added in D3.3)
 *
 * Manual edits will be overwritten on next regeneration. To change a type,
 * change the backend OpenAPI annotation (cmsthgfulfill/src/openapi/paths.ts)
 * and re-register the schema in cmsthgfulfill/src/features/<f>/<f>.schemas.ts.
 */
`;

async function main() {
  const specUrl = resolveSpecUrl();
  // Cache-bust to defeat the worker's `Cache-Control: s-maxage=300` edge
  // cache (the same reason the D2.0 deploy smoke test sets `?_t=...`).
  const fetchUrl = specUrl.includes("?")
    ? `${specUrl}&_t=${Date.now()}`
    : `${specUrl}?_t=${Date.now()}`;
  const ast = await openapiTS(new URL(fetchUrl));
  const types = astToString(ast);
  writeFileSync(OUTPUT_PATH, `${HEADER(specUrl)}\n${types}`, "utf-8");
  console.log(`✓ Wrote ${OUTPUT_PATH}`);
  console.log(`  Source: ${specUrl}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
