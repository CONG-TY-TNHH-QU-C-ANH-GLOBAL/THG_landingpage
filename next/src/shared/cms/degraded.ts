import "server-only";

import { connection } from "next/server";

import { CmsError, CmsHttpError, CmsParseError, CmsShapeError } from "./errors";

// What a CMS-backed route does when the read did not succeed.
//
// Two things were duplicated per feature and one was missing entirely.
//
// DUPLICATED: blog and careers each declared the same `UnavailableReason` union and the same
// error→reason classifier. Two copies of one CMS semantic is a second source of truth, and
// PR85 would have made a third.
//
// MISSING: a degraded render was being persisted under the SUCCESS-path cache lifetime. Both
// detail routes export a route-level `revalidate` (blog 3600s, careers 300s), so when the CMS
// blipped, the resulting "temporarily unavailable" page — together with the
// `robots: noindex` that generateMetadata correctly emits for it — was baked into the full
// route cache for the whole window. A one-second outage could therefore hide a live article
// from crawlers for an hour, and it would not self-heal when the CMS came back: nothing
// invalidates a cache entry that was written successfully. The failure is not that the
// fallback renders, it is that the fallback INHERITS the TTL of content it is not.
//
// The fix is to make a degraded render dynamic. `connection()` resolves immediately during a
// real request and never resolves during prerender, which is exactly the semantics wanted:
// serve the fallback now, and do not commit it to the static output.
//
// WHY THIS IS CALLED FROM THE ROUTE AND NOT THE LOADER. The loaders are the natural boundary,
// but they are also reached from `generateStaticParams` — `jobStaticParams` calls `loadJobs`
// directly — and a `connection()` inside that path would hang the build instead of degrading
// one page. The loaders are additionally wrapped in React `cache()`, so a dynamic marker
// placed there would be memoized alongside the data. The decision therefore stays here, as one
// shared and directly testable policy, and the routes apply it at the point where a render is
// actually happening.

/** Reason a CMS read failed, coarse enough to log and to branch on, with nothing sensitive in
 *  it. `http` is a non-2xx, `contract` is a 2xx whose body did not match the schema (or was not
 *  JSON at all), `network` is everything that never produced a response. */
export type UnavailableReason = "http" | "contract" | "network";

/** The outcome vocabulary every CMS-backed loader in this app reports. `empty` is a CONFIRMED
 *  empty collection and `unavailable` is a failure — the distinction is the whole point. */
export type CmsResultStatus = "ready" | "empty" | "not-found" | "unavailable";

export function unavailableReason(err: CmsError): UnavailableReason {
  if (err instanceof CmsHttpError) return "http";
  if (err instanceof CmsShapeError || err instanceof CmsParseError) return "contract";
  return "network";
}

/** True when a result represents a transient failure rather than a confirmed state of the
 *  content, and so must not be persisted under the route's success-path revalidate window.
 *
 *  `empty` and `not-found` are deliberately NOT degraded: both are answers from a healthy CMS,
 *  and caching them normally is correct. */
export function isDegradedResult(status: CmsResultStatus): boolean {
  return status === "unavailable";
}

/** Apply the degraded-render cache policy for a result the route is about to render.
 *
 *  A no-op on the success path, so the approved ISR windows are untouched. On a degraded read
 *  it opts this render out of the full-route cache, which means the next request retries the
 *  CMS instead of being served an hour-old apology. */
export async function applyCmsCachePolicy(status: CmsResultStatus): Promise<void> {
  if (isDegradedResult(status)) await connection();
}
