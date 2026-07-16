// Isomorphic CMS transport errors — no "server-only": these classes are safe to import from a
// Client Component so it can branch on isCmsNotFound() without pulling the server transport
// (CODE_STRUCTURE "Import boundaries"). Every error carries ONLY non-sensitive metadata — the
// request path, an HTTP status, or a coarse network reason — never request headers, bodies,
// tokens or env values (SPEC §14, AC-41).

/** Base for every CMS transport failure. `path` is the request path (e.g. "/faqs?lang=vi"),
 *  which is loader-derived and safe to surface — it never carries a secret. Abstract so a bare
 *  CmsError is never thrown; callers catch this to mean "any CMS transport error" (CONTRACTS §4). */
export abstract class CmsError extends Error {
  constructor(
    readonly path: string,
    message: string,
  ) {
    super(message);
    this.name = new.target.name;
  }

  /** Redaction-safe structured view for logging/observability (FND-008 hook point, SPEC §17).
   *  Deliberately allow-lists fields — nothing returned here can carry a header, body or secret. */
  safeMeta(): Record<string, string | number> {
    return { name: this.name, path: this.path };
  }
}

/** Non-2xx CMS response. `message` is "CMS {path}: {status} {statusText}", where the tail is
 *  replaced by the JSON body's `error` string when the body parses (parity with fetchJson
 *  [FACT: src/lib/cmsClient.ts:96-105]). */
export class CmsHttpError extends CmsError {
  constructor(
    path: string,
    readonly status: number,
    message: string,
  ) {
    super(path, `CMS ${path}: ${message}`);
  }

  override safeMeta(): Record<string, string | number> {
    return { ...super.safeMeta(), status: this.status };
  }
}

/** A 2xx body that parsed as JSON but failed the caller's Zod schema. The message string is
 *  FIXED and must not change — parity scripts and existing log greps rely on it (CONTRACTS §1.4,
 *  parity: cmsClient.ts:113). */
export class CmsShapeError extends CmsError {
  constructor(path: string) {
    super(path, `CMS ${path}: response shape mismatch`);
  }
}

/** A 2xx body that was not valid JSON at all (res.json() threw) — kept distinct from a shape
 *  mismatch (valid JSON, wrong shape) so callers and observability can tell them apart. */
export class CmsParseError extends CmsError {
  constructor(path: string) {
    super(path, `CMS ${path}: invalid JSON response`);
  }
}

/** The fetch itself never produced a response. `reason` distinguishes a bounded-timeout abort,
 *  a caller-initiated abort, and any other transport failure (DNS, reset, TypeError) so timeout
 *  and external-abort behaviour are deterministic and separable. */
export class CmsNetworkError extends CmsError {
  constructor(
    path: string,
    readonly reason: "timeout" | "aborted" | "network",
  ) {
    super(path, `CMS ${path}: request ${reason === "network" ? "failed" : reason}`);
  }

  override safeMeta(): Record<string, string | number> {
    return { ...super.safeMeta(), reason: this.reason };
  }
}

/** True iff the error is a CMS 404 — the signal a {slug} loader turns into notFound()
 *  (CONTRACTS §2, §4). */
export const isCmsNotFound = (e: unknown): boolean =>
  e instanceof CmsHttpError && e.status === 404;
