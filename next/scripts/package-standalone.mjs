// Make the standalone build self-contained (FND-001 artifact strategy).
// Next's `output: "standalone"` server does NOT include static/public assets by design;
// this packaging step copies them in so the artifact serves HTML + /_next/static + public
// without a separate CDN/nginx asset owner:
//   - .next/static  → .next/standalone/.next/static   (served at /_next/static/*)
//   - public/       → .next/standalone/public          (served at /*)
import { cpSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const standalone = join(root, ".next", "standalone");

if (!existsSync(standalone)) {
  console.error("No .next/standalone — run `bun run build` (output: standalone) first.");
  process.exit(1);
}

cpSync(join(root, ".next", "static"), join(standalone, ".next", "static"), { recursive: true });
if (existsSync(join(root, "public"))) {
  cpSync(join(root, "public"), join(standalone, "public"), { recursive: true });
}

console.log("packaged standalone: copied .next/static and public/ into .next/standalone");
