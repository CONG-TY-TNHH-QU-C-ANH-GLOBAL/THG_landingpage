// Client-side POST straight to the public CMS API — same request cmsClient.postLead
// made in Vite (method/path/headers/body identical). Shared by LeadFormDialog and the
// homepage ConversationSection so the /leads contract lives in exactly one place.
// The server-only "@/shared/cms" transport is off-limits in client islands.
import type { Locale } from "@/shared/i18n";
import { publicEnv } from "@/shared/config/env.public";

function stripTrailingSlashes(value: string): string {
  let v = value;
  while (v.endsWith("/")) v = v.slice(0, -1);
  return v;
}

export const CMS_BASE = stripTrailingSlashes(publicEnv.cmsApiUrl ?? "http://localhost:8080/api/v1");

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

export async function postLead(input: LeadInput): Promise<void> {
  const res = await fetch(`${CMS_BASE}/leads`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(`CMS /leads: ${message}`);
  }
  // ponytail: Vite validated the { ok } response with Zod; the result is unused
  // here, so a 2xx status is the success signal.
}
