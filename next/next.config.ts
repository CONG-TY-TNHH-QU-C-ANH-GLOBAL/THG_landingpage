import type { NextConfig } from "next";

// ADR-001 Option A: isolated, non-production Next app under `next/` through M1–M10.
// ADR-000 / P4: standalone Node on the current VPS is the initial runtime.
// Pin the tracing/turbopack root to this app so the standalone output is self-contained
// and never traverses the repo-root Vite application (which owns the root lockfiles).
const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: import.meta.dirname,
  turbopack: { root: import.meta.dirname },
  // The root layout lives under the [lang] dynamic segment (per-locale <html lang>), so a
  // standalone document renders global (non-localized) 404s via app/global-not-found.tsx.
  experimental: { globalNotFound: true },
};

export default nextConfig;
