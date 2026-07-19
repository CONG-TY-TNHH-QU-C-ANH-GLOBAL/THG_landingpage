// Client-side POST straight to the public CMS API — same request cmsClient.postLead
// made in Vite (method/path/headers/body identical). Shared by LeadFormDialog and the
// homepage ConversationSection so the /leads contract lives in exactly one place.
// The server-only "@/shared/cms" transport is off-limits in client islands.
import type { Locale } from "@/shared/i18n";
import { resolvePublicCmsApiUrl } from "@/shared/config/env.public";

// Build-time-resolved, normalized public CMS base (env.public policy: localhost only for
// dev/test; production builds require an explicit NEXT_PUBLIC_CMS_API_URL — never localhost).
export const CMS_BASE = resolvePublicCmsApiUrl();

// Mirrors the verified POST /api/v1/leads contract (CMS routes/api/v1/(public)/leads):
// name + email + turnstile_token required; phone/message/source_page/locale/utm optional.
// The contract has NO region/primary-market and NO service-interest field — do not add
// fields here without re-verifying the CMS schema.
export interface LeadInput {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source_page: string;
  locale: Locale;
  utm?: Record<string, string>;
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
