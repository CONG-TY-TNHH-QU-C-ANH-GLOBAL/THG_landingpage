// WEB-008 — the THG Hub tracking deep-link. The landing's ENTIRE tracking surface.
//
// Ownership boundary (WEB-008 CONTRACTS): THG Hub owns authenticated order, shipment and
// tracking truth. The landing implements no tracking business logic, holds no shipment or
// order data, and defines no tracking schema. The only value produced here is a validated
// absolute HTTPS Hub URL.
//
// What the Vite page did, and why it is not reproduced: it rendered an order-ID form and
// fetched `VITE_TRACKING_LOOKUP_URL?id=<orderId>` from the browser. That endpoint has no
// default and is not configured in this repository, so the form's real behavior in production
// is to accept an order ID and then answer "lookup unavailable" — it asks for input it cannot
// serve. It also put an order identifier on the public plane. WEB-008 §6 replaces it with a
// deep-link, and this module is that link.

/** Hostnames allowed to serve tracking. An allowlist, not a pattern: a typo'd or attacker-set
 *  origin must fail closed rather than send a visitor somewhere unexpected from our own CTA. */
const ALLOWED_HUB_HOSTS = ["hub.thgfulfill.com"] as const;

/** The Hub origin. `hub.thgfulfill.com` is the established Hub host in this repository — the
 *  catalog API already points there (.env.example: VITE_CATALOG_API_URL). Overridable so a
 *  staging Hub can be pointed at, but only to an allowlisted host. */
const DEFAULT_HUB_ORIGIN = "https://hub.thgfulfill.com";

/** Path on the Hub that serves order tracking. */
const TRACKING_PATH = "/tracking";

export interface HubTrackingLink {
  url: string;
  /** Locale forwarded as a query param so the Hub can open in the visitor's language. */
  lang: string;
}

/**
 * Build the tracking deep-link, or null when the configured origin is missing, malformed, not
 * HTTPS, or not on the allowlist.
 *
 * null is a first-class outcome: the route renders its explanation WITHOUT a CTA rather than
 * emitting a broken or unexpected link. No order ID, no PII and no Hub credential is ever part
 * of this URL.
 */
export function buildHubTrackingLink(
  lang: string,
  rawOrigin: string | undefined = process.env.NEXT_PUBLIC_HUB_ORIGIN,
): HubTrackingLink | null {
  const configured = rawOrigin?.trim() || DEFAULT_HUB_ORIGIN;

  let origin: URL;
  try {
    origin = new URL(configured);
  } catch {
    // The configured value is deliberately not echoed into an error or a log line.
    return null;
  }
  if (origin.protocol !== "https:") return null;
  if (!(ALLOWED_HUB_HOSTS as readonly string[]).includes(origin.hostname.toLowerCase())) {
    return null;
  }
  // `hostname` excludes the port, so the allowlist alone accepted
  // `https://hub.thgfulfill.com:8443` — the approved name on an origin nobody approved, which
  // is a different server as far as the browser's origin model is concerned. The approved
  // policy is the default HTTPS origin only.
  //
  // The test is `port === ""`, not `port === "" || port === "443"`: WHATWG canonicalizes the
  // scheme's default port away, so `new URL("https://host:443").port` is already the empty
  // string. Pinned in tests rather than assumed — an explicit `:443` must still be accepted.
  if (origin.port !== "") return null;

  // `origin` is used as the base, never `href`: URL.origin is scheme + host + port only, so any
  // credentials, path, query or fragment on the configured value are dropped here rather than
  // leaking into a link we publish. Also covered by tests.
  const url = new URL(TRACKING_PATH, origin.origin);
  url.searchParams.set("lang", lang);
  return { url: url.toString(), lang };
}
