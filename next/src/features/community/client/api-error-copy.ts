import { CommunityApiError } from "./community-api";

// Maps a CMS status code to application-owned localized copy.
//
// The CMS error body is never read: its messages are Vietnamese operator strings, and the
// Vite client surfaced them verbatim (prefixed with the endpoint path) in user-facing
// toasts. Mapping by status keeps backend diagnostics out of the UI and out of any log.
//
// Status meanings, verified against the CMS handlers:
//   429 → rate limited. No Retry-After header and no resetAt in the body, so the copy
//         states the fixed 1-hour window rather than a computed time.
//   403 → Turnstile verification failed (NOT 400/422 — easy to get wrong).
//   400 → validation failure; the body carries only the first Zod message with no field
//         name, so it cannot drive per-field feedback. Client-side checks mirror the
//         server bounds instead, and this falls back to the generic message.
//   404 → withdraw refused. Bad token, unknown slug and already-withdrawn are
//         deliberately indistinguishable so ownership failures reveal no item existence.
export function communityErrorMessage(err: unknown, t: (key: string) => string): string {
  if (err instanceof CommunityApiError) {
    if (err.status === 429) return t("community.err_rate_limited");
    if (err.status === 403) return t("community.err_captcha_failed");
  }
  return t("community.form_err_generic");
}
