// UTM / referrer attribution capture.
//
// On the very first page load we snapshot any utm_* / gclid / fbclid params
// (and the document.referrer) into sessionStorage. The lead form reads that
// blob back on submit and ships it to the CMS so marketing can attribute the
// conversion even when the user wanders across several pages before filling
// the form. sessionStorage scope is intentional — once the tab closes the
// next visit starts a fresh attribution window.

const STORAGE_KEY = "thg_utm_v1";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "msclkid",
  "ttclid",
] as const;

export type UtmPayload = Record<string, string>;

function readStored(): UtmPayload {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as UtmPayload;
  } catch {
    return {};
  }
}

/** Capture the current URL's tracking params + referrer if we haven't already.
 *  Safe to call from any mount (it short-circuits when storage already populated). */
export function captureUtmOnce(): void {
  if (typeof window === "undefined") return;
  try {
    const stored = readStored();
    const params = new URLSearchParams(window.location.search);
    let mutated = false;

    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value && !stored[key]) {
        stored[key] = value;
        mutated = true;
      }
    }

    // Stash the first non-empty referrer too — useful when no UTMs are present
    // but the user arrived from a recognisable channel (Google organic, etc.).
    if (!stored.referrer && document.referrer && !document.referrer.startsWith(window.location.origin)) {
      stored.referrer = document.referrer;
      mutated = true;
    }
    if (!stored.landing_page) {
      stored.landing_page = window.location.pathname + window.location.search;
      mutated = true;
    }

    if (mutated) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    /* sessionStorage may be blocked (Safari ITP private mode) — ignore. */
  }
}

/** Read the captured attribution payload. Empty object when nothing recorded. */
export function getUtmPayload(): UtmPayload {
  return readStored();
}
