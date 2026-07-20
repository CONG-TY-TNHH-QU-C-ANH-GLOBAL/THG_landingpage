// Client-side POSTs straight to the public CMS API — the same requests the Vite
// cmsClient made (method/path/headers/body identical). Islands cannot use the
// server-only "@/shared/cms" transport, so the three write contracts live here.
//
// Security: the CMS response BODY is never parsed on failure and never propagated.
// Backend diagnostics (which are Vietnamese operator strings) must not reach public UI
// or logs. Callers map the status code to their own localized copy.

import type { Locale } from "@/shared/i18n";
import { resolvePublicCmsApiUrl } from "@/shared/config/env.public";

const CMS_BASE = resolvePublicCmsApiUrl();

/** Keeps a hung CMS from pinning a form in its submitting state forever. */
const REQUEST_TIMEOUT_MS = 15_000;

/** Carries ONLY the HTTP status. No body, no headers, no request payload — so an owner
 *  token or Turnstile token can never reach an error string, a toast, or a log. */
export class CommunityApiError extends Error {
  constructor(readonly status: number) {
    super(`community request failed (${status})`);
    this.name = "CommunityApiError";
  }
}

async function post(path: string, body?: unknown): Promise<unknown> {
  const res = await fetch(`${CMS_BASE}${path}`, {
    method: "POST",
    // same-issue is sent with no body and no Content-Type, matching the CMS handler
    // which parses nothing and identifies the client by IP alone.
    headers: body === undefined
      ? { Accept: "application/json" }
      : { Accept: "application/json", "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) throw new CommunityApiError(res.status);
  return res.json();
}

export interface QuestionSubmitInput {
  title: string;
  body: string;
  category_slug?: string;
  author_name: string;
  author_email: string;
  locale: Locale;
  utm?: Record<string, string>;
  turnstile_token: string;
}

export interface ReviewSubmitInput {
  title: string;
  body: string;
  category_slug?: string;
  rating?: number;
  reviewer_name: string;
  reviewer_email: string;
  private_order_reference?: string;
  private_evidence_note?: string;
  locale: Locale;
  utm?: Record<string, string>;
  turnstile_token: string;
}

/** Submit result. `owner_token` is optional on the wire so the landing can deploy ahead
 *  of a CMS that lacks it — withdrawal is then simply never offered. */
interface SubmitResponse {
  slug?: unknown;
  owner_token?: unknown;
}

export interface SubmitOutcome {
  slug: string | null;
  ownerToken: string | null;
}

function readSubmitOutcome(raw: unknown): SubmitOutcome {
  const res = (raw ?? {}) as SubmitResponse;
  return {
    slug: typeof res.slug === "string" ? res.slug : null,
    ownerToken: typeof res.owner_token === "string" ? res.owner_token : null,
  };
}

export async function submitQuestion(input: QuestionSubmitInput): Promise<SubmitOutcome> {
  return readSubmitOutcome(await post("/community/questions", input));
}

export async function submitReview(input: ReviewSubmitInput): Promise<SubmitOutcome> {
  return readSubmitOutcome(await post("/community/reviews", input));
}

/** Server-side dedupe is by hashed IP and is idempotent: a duplicate is a 200 with
 *  `deduped: true` and the unchanged count, not an error. */
export async function reactSameIssue(slug: string): Promise<{ count: number; deduped: boolean }> {
  const raw = (await post(`/community/questions/${encodeURIComponent(slug)}/same-issue`)) as {
    same_issue_count?: unknown;
    deduped?: unknown;
  };
  return {
    count: typeof raw?.same_issue_count === "number" ? raw.same_issue_count : 0,
    deduped: raw?.deduped === true,
  };
}

/** The owner token travels ONLY in this POST body — never a URL, query param, cookie,
 *  header, analytics event or log line (COM-001 §14). Note the case change across the
 *  boundary: the CMS returns `owner_token` but consumes `ownerToken`. */
export async function withdrawQuestion(slug: string, ownerToken: string): Promise<void> {
  await post(`/community/questions/${encodeURIComponent(slug)}/withdraw`, { ownerToken });
}

export async function withdrawReview(slug: string, ownerToken: string): Promise<void> {
  await post(`/community/reviews/${encodeURIComponent(slug)}/withdraw`, { ownerToken });
}
