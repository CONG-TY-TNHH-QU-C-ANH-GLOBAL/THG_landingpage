import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
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

// Build-time configuration gate. `NEXT_PUBLIC_CMS_API_URL` is inlined into the client bundle
// during `next build`, so a missing value must fail the BUILD (not the runtime) — otherwise a
// production bundle would silently ship the localhost dev CMS as the lead-form endpoint. The
// value is public (the CMS base is not a secret), but it must come from approved deployment
// config (MIG-010 sets it in the build environment) rather than an implicit localhost default.
// Dev (`next dev`) and other phases are unaffected — local zero-config still works.
export default function config(phase: string): NextConfig {
  if (phase === PHASE_PRODUCTION_BUILD && !process.env.NEXT_PUBLIC_CMS_API_URL?.trim()) {
    throw new Error(
      "NEXT_PUBLIC_CMS_API_URL must be set for `next build`: it is build-time browser config for the lead-form POST and must not fall back to localhost in a production bundle. Set it in the build environment (see next/.env.example and ops/systemd/thg-next.service.candidate).",
    );
  }
  return nextConfig;
}
