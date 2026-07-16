import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

// ADR-001 Option A: isolated, non-production Next app under `next/` through M1–M10.
// ADR-000 / P4: standalone Node on the current VPS is the initial runtime.
// `import.meta.dirname` needs Node >= 20.11, but the enforced floor is 20.9.0 — derive the
// project root the portable way instead. Pin the tracing/turbopack root to this app so the
// standalone output is self-contained and never traverses the repo-root Vite application.
const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: projectRoot,
  turbopack: { root: projectRoot },
  // The root layout lives under the [lang] dynamic segment (per-locale <html lang>), so a
  // standalone document renders global (non-localized) 404s via app/global-not-found.tsx.
  experimental: { globalNotFound: true },
};

export default nextConfig;
