import "server-only";

import type { CmsError } from "./errors";

// Logging for INTENTIONAL CMS fallbacks (WEB-001 §15: one unavailable CMS resource degrades
// its section, never the page). A recoverable CmsError is an expected runtime state, so it
// must be a WARNING — Next dev promotes every console.error into an error-overlay entry,
// turning one stopped local CMS into a wall of apparent bugs. Metadata stays redaction-safe
// (CmsError.safeMeta(): name/path/status — never bodies, headers, tokens or full URLs).
// Programming failures never come through here: callers rethrow non-CmsError unchanged.
//
// ponytail: per-process dedupe (endpoint+error name) — the same dead endpoint logs once per
// server process instead of once per render; a restart (or reset, in tests) clears it.
const logged = new Set<string>();

export function logCmsFallback(path: string, err: CmsError): void {
  const key = `${path}|${err.name}`;
  if (logged.has(key)) return;
  logged.add(key);
  console.warn(`[CMS] fallback for ${path}:`, err.safeMeta());
}

/** Redaction-safe diagnostic for a service block dropped during role resolution (missing/duplicate
 *  payload.key, or a malformed block). Logs ONLY the kind, reason and the code-owned key or numeric
 *  row id — never a title/description or any editor content. Deduped like logCmsFallback so a
 *  persistent bad block warns once per process. */
export function logServiceBlockAnomaly(kind: string, reason: string, keyOrId: string | number): void {
  const key = `sb|${kind}|${reason}|${keyOrId}`;
  if (logged.has(key)) return;
  logged.add(key);
  console.warn(`[CMS] service-block ${reason}: kind=${kind} key=${keyOrId}`);
}

/** Test hook: clear the dedupe set between cases. */
export function resetLoggedCmsFallbacks(): void {
  logged.clear();
}
