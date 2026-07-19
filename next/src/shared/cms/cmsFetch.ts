import "server-only";

import type { z } from "zod";

import { CmsHttpError, CmsNetworkError, CmsParseError, CmsShapeError } from "./errors";

// The single server-side CMS read transport (SPEC §6, CONTRACTS §1). It preserves the Vite
// fetchJson request/error/parse semantics exactly [FACT: src/lib/cmsClient.ts:83-116] and adds
// the Next fetch-cache option slots (revalidate/tags). Those slots are RESERVED for FND-006 —
// this layer defines no tag vocabulary and no revalidation policy of its own (SPEC §3).
// ponytail: revalidate/tags are pass-through only; wire the FND-006 vocabulary when it lands.

const DEFAULT_BASE_URL = "http://localhost:8080/api/v1";

export interface CmsFetchOptions {
  /** Next fetch-cache revalidation window in seconds — reserved slot; values owned by FND-006. */
  revalidate?: number;
  /** Next cache tags — reserved slot; tag vocabulary owned by FND-006. */
  tags?: string[];
  /** Header/method escape hatch (parity with fetchJson's `init`). */
  init?: RequestInit;
  /** Bounded timeout in ms covering the whole request including body read. Omitted → no
   *  timeout (exact parity with today's no-timeout fetch). */
  timeoutMs?: number;
  /** Caller abort signal; composed with any timeout signal. */
  signal?: AbortSignal;
}

/** Resolve and normalize the server-only CMS base URL. Trailing slashes are trimmed so
 *  `base + path` never double-slashes; a malformed configured value fails loud rather than
 *  emitting a broken request URL. Exported for deterministic tests.
 *
 *  Environment policy (owner-mandated): the localhost default exists ONLY for local
 *  development/tests and the CI production BUILD (prerender bakes the approved fallbacks;
 *  the deployment contract — ops/systemd candidate — injects CMS_API_URL at runtime and ISR
 *  revalidation replaces the baked content). A production RUNTIME request without an
 *  explicit CMS_API_URL fails loud instead of silently calling localhost. */
export function resolveCmsBaseUrl(raw: string | undefined = process.env.CMS_API_URL): string {
  const configured = raw?.trim();
  if (!configured) {
    const isProductionRuntime =
      process.env.NODE_ENV === "production" &&
      process.env.NEXT_PHASE !== "phase-production-build";
    if (isProductionRuntime) {
      throw new Error(
        "CMS_API_URL is required in production: refusing to fall back to the local dev default (set it in the service environment; see ops/systemd/thg-next.service.candidate)",
      );
    }
  }
  const base = configured || DEFAULT_BASE_URL;
  try {
    new URL(base);
  } catch {
    // Value deliberately not echoed (AC-41: no env base in thrown errors).
    throw new Error("Invalid CMS_API_URL: not a valid URL (value redacted; check the server env)");
  }
  return base.replace(/\/+$/, "");
}

interface Timeout {
  signal: AbortSignal;
  clear: () => void;
  fired: () => boolean;
}

function createTimeout(ms: number | undefined): Timeout | undefined {
  if (ms === undefined) return undefined;
  const controller = new AbortController();
  let fired = false;
  const id = setTimeout(() => {
    fired = true;
    controller.abort();
  }, ms);
  return { signal: controller.signal, clear: () => clearTimeout(id), fired: () => fired };
}

function composeSignals(...signals: (AbortSignal | undefined)[]): AbortSignal | undefined {
  const present = signals.filter((s): s is AbortSignal => s !== undefined);
  if (present.length === 0) return undefined;
  if (present.length === 1) return present[0];
  return AbortSignal.any(present);
}

function classifyAbort(
  err: unknown,
  timeout: Timeout | undefined,
  callerSignal: AbortSignal | undefined,
): "timeout" | "aborted" | "network" {
  const aborted =
    typeof err === "object" && err !== null && (err as { name?: unknown }).name === "AbortError";
  if (!aborted) return "network";
  if (timeout?.fired()) return "timeout";
  if (callerSignal?.aborted) return "aborted";
  return "aborted";
}

/**
 * Fetch and validate a CMS read. Returns the parsed DTO or throws one typed transport error:
 * CmsHttpError (non-2xx), CmsParseError (2xx non-JSON body), CmsShapeError (schema mismatch),
 * or CmsNetworkError (fetch rejected — timeout / caller-abort / network). Locale-agnostic: any
 * `?lang=` stays exactly as the loader put it in `path` (SPEC §11, AC-15).
 */
export async function cmsFetch<T extends z.ZodTypeAny>(
  path: string,
  schema: T,
  opts: CmsFetchOptions = {},
): Promise<z.infer<T>> {
  const { revalidate, tags, init, timeoutMs, signal } = opts;
  const url = `${resolveCmsBaseUrl()}${path}`;

  const timeout = createTimeout(timeoutMs);
  // Headers built via the Headers API so callers may pass any HeadersInit form (plain object,
  // Headers instance, entries array) without silent loss; a caller-provided Accept still wins.
  const headers = new Headers(init?.headers);
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  const requestInit: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {
    ...init,
    headers,
    next: { revalidate, tags },
    signal: composeSignals(signal, init?.signal ?? undefined, timeout?.signal),
  };

  try {
    let res: Response;
    try {
      res = await fetch(url, requestInit);
    } catch (err) {
      throw new CmsNetworkError(path, classifyAbort(err, timeout, signal));
    }

    if (!res.ok) {
      let message = `${res.status} ${res.statusText}`;
      try {
        const body = (await res.json()) as { error?: string };
        if (body.error) message = body.error;
      } catch {
        // Non-JSON error body: keep the "{status} {statusText}" default (parity: cmsClient.ts:101).
      }
      throw new CmsHttpError(path, res.status, message);
    }

    let json: unknown;
    try {
      json = await res.json();
    } catch {
      // An abort mid-body is a transport failure, not a malformed payload.
      if (timeout?.fired() || signal?.aborted || init?.signal?.aborted) {
        throw new CmsNetworkError(path, timeout?.fired() ? "timeout" : "aborted");
      }
      throw new CmsParseError(path);
    }

    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      // Structured Zod issues only (never the raw body) — parity with cmsClient.ts:112 and the
      // FND-008 observability hook point (SPEC §17).
      console.error(`[CMS] Schema validation failed for ${path}:`, parsed.error.issues);
      throw new CmsShapeError(path);
    }
    return parsed.data;
  } finally {
    // Cleared only after the body is consumed, so timeoutMs bounds the entire exchange.
    timeout?.clear();
  }
}
