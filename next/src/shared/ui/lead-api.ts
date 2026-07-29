// Client-side POST straight to the public CMS API — same request cmsClient.postLead
// made in Vite (method/path/headers/body identical). Shared by LeadFormDialog and the
// homepage ConversationSection so the /leads contract lives in exactly one place.
// The server-only "@/shared/cms" transport is off-limits in client islands.
import type { Locale } from "@/shared/i18n";
import { resolvePublicCmsApiUrl } from "@/shared/config/env.public";
import type { LeadServiceKey, LeadSurfaceKey } from "@/shared/ui/lead-services";

// Build-time-resolved, normalized public CMS base (env.public policy: localhost only for
// dev/test; production builds require an explicit NEXT_PUBLIC_CMS_API_URL — never localhost).
export const CMS_BASE = resolvePublicCmsApiUrl();

// Mirrors the verified POST /api/v1/leads contract (CMS routes/api/v1/(public)/leads +
// lead-request.ts): name + email + turnstile_token required; phone/message/source_page/locale/utm
// optional. MULTI-INTENT (migration 0038, land-and-expand): a lead has an optional primary_service
// plus service_interests[] (primary must be a member), with service_details keyed by service and
// validated per-service by the backend. surface is a SEPARATE attribution dimension. Legacy callers
// omit all intent fields and persist unclassified.
export interface LeadInput {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source_page: string;
  locale: Locale;
  utm?: Record<string, string>;
  /** Highest-priority intent at capture; omit for a generic lead. When set, include it in `service_interests`. */
  primary_service?: LeadServiceKey;
  /** All service interests (primary + secondaries), de-duplicated. Omit/empty for a generic lead. */
  service_interests?: LeadServiceKey[];
  /** Per-service validated details, keyed by service key (subset of service_interests). */
  service_details?: Record<string, Record<string, unknown>>;
  /** Canonical UI-surface key (the form that produced the lead). */
  surface?: LeadSurfaceKey;
  turnstile_token: string;
}

// Keep a hung CMS from pinning the form in its submitting state forever — the
// abort surfaces as a DOMException the callers' existing error paths handle.
const REQUEST_TIMEOUT_MS = 15_000;

export async function postLead(input: LeadInput): Promise<void> {
  const res = await fetch(`${CMS_BASE}/leads`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) {
    // Stable application-owned failure (owner-accepted CodeRabbit security
    // finding): the CMS response body is never parsed or propagated, so backend
    // diagnostics cannot reach public UI or logs. Callers show the localized
    // lead_form.err_generic copy and keep retry enabled. The status code in the
    // message is for debuggers only — no caller renders Error messages.
    throw new Error(`lead submit failed (${res.status})`);
  }
  // A 2xx status is the success signal; the response body is unused.
}
