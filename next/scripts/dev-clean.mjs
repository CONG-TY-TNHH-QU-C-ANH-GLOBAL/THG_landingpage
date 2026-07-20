// dev:clean — safely remove the generated `.next` output. REFUSES while a Next process for
// this app is still alive, because deleting `.next` under a live Turbopack process is the
// proven trigger for the persistence-cache corruption (ops/DEV-RUNTIME.md). It never kills
// processes and never touches env files — the operator stays in control.
import { rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import { findNextProcesses, APP_ROOT } from "./dev-lib.mjs";

const { rows, enumerated } = findNextProcesses();

if (rows.length > 0) {
  console.error(`✗ Refusing to delete .next: ${rows.length} Next process(es) for this app are still running.`);
  for (const r of rows) console.error(`  - pid ${r.pid}`);
  console.error("  Stop them first (this script will not kill them), then re-run `bun run dev:clean`.");
  console.error("  Deleting .next under a live Turbopack process corrupts the persistence cache.");
  process.exit(1);
}

if (!enumerated) {
  console.error("✗ Refusing to delete .next: could not confirm no Next process is running on this platform.");
  console.error("  Verify manually that dev is stopped, then delete .next by hand if needed.");
  process.exit(1);
}

const dotNext = join(APP_ROOT, ".next");
if (!existsSync(dotNext)) {
  console.log("✓ .next already absent — nothing to clean.");
  process.exit(0);
}
rmSync(dotNext, { recursive: true, force: true });
console.log("✓ Removed .next (generated output only). Warm cache is gone; the next `bun run dev` rebuilds it.");
