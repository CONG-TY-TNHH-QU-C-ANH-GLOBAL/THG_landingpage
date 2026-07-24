// dev:doctor — read-only local dev diagnostics for the incident class in ops/DEV-RUNTIME.md
// (orphaned Next processes, stale Turbopack persistence cache). Reports, never mutates,
// never prints secrets. Run before/after a dev session that misbehaves.
import {
  findNextProcesses,
  cacheState,
  diskFreeGb,
  cmsOrigin,
  checkCmsReachable,
  mb,
  APP_ROOT,
} from "./dev-lib.mjs";
import { existsSync } from "node:fs";
import { join } from "node:path";

const { rows, enumerated } = findNextProcesses();
const cache = cacheState();
const disk = diskFreeGb();
const cms = await checkCmsReachable();

console.log("next dev doctor");
console.log("───────────────");
if (!enumerated) {
  console.log("processes         : (could not enumerate on this platform)");
} else if (rows.length === 0) {
  console.log("processes         : none for this app ✓");
} else {
  console.log(`processes         : ${rows.length} Next process(es) for this app ⚠`);
  for (const r of rows) console.log(`  - pid ${r.pid}`);
  console.log("  → more than one, or an unexpected orphan, is the top corruption risk.");
  console.log("    Stop them before `bun run dev:clean` (see ops/DEV-RUNTIME.md).");
}
console.log(`.next present     : ${cache.dotNextPresent ? "yes" : "no"}`);
console.log(
  `turbopack cache   : ${cache.turbo.sst} sst file(s), ${mb(cache.turbo.bytes)} MB` +
    (cache.turbo.sst > 0 ? "" : " (none)"),
);
console.log(`cms origin (dev)  : ${cmsOrigin()}`);
console.log(
  `cms reachable     : ${
    cms.reachable
      ? "yes ✓"
      : `no (${cms.error ?? `status ${cms.status}`}) — shell reads will use fallbacks`
  }`,
);
console.log(`.env.local        : ${existsSync(join(APP_ROOT, ".env.local")) ? "present" : "absent (dev defaults to localhost CMS)"}`);
console.log(`disk free         : ${disk == null ? "unknown" : disk + " GB"}`);

// Non-zero exit when a concurrency hazard is present, so CI/scripts can gate on it.
process.exit(rows.length > 1 ? 1 : 0);
