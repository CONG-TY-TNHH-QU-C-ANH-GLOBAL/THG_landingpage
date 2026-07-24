import type { MarketingCopy } from "./marketing";

// Narrow the resolved marketing dictionary before it crosses a client boundary. The full
// map is ~340 keys; the shell client islands (Navbar, FloatingContact, the contact-card CTA)
// each read only their own namespace plus the shared lead-form strings, so passing the whole
// dictionary ships the entire site's copy into the RSC/client payload for a handful of labels.
//
// Selection is PREFIX-based on purpose: Navbar resolves many of its keys dynamically
// (`t(item.titleKey)` over the service/pricing/community arrays), so a hand-listed key set
// would silently drop a label the day someone adds a nav item. A prefix can't: every current
// and future `nav.*` / `floating.*` / `lead_form.*` key is included by construction. Exact
// strings and locale behavior are preserved — this only drops keys nothing here renders.

export interface CopySelection {
  /** Include any key beginning with one of these prefixes. */
  prefixes?: readonly string[];
  /** Include these exact keys (for lone cross-namespace strings, e.g. "nav.consult"). */
  keys?: readonly string[];
}

/** Build a copy subset. Never widens the type — the result is still a MarketingCopy, so the
 *  islands' `copy: MarketingCopy` props and `tFrom` are unchanged (a missing key still falls
 *  back to the key itself, exactly as before). */
export function pickCopy(copy: MarketingCopy, { prefixes = [], keys = [] }: CopySelection): MarketingCopy {
  const wanted = new Set(keys);
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(copy)) {
    if (wanted.has(key) || prefixes.some((p) => key.startsWith(p))) out[key] = value;
  }
  return out;
}

// The lead-form dialog is embedded in every shell island, so its namespace rides along with each.
const LEAD_FORM_PREFIX = "lead_form.";

/** Navbar: all nav labels/descriptions (many resolved dynamically) + the embedded lead form. */
export const NAVBAR_COPY: CopySelection = { prefixes: ["nav.", LEAD_FORM_PREFIX] };

/** FloatingContact: its own labels + the shared consult label + the embedded lead form. */
export const FLOATING_CONTACT_COPY: CopySelection = {
  prefixes: ["floating.", LEAD_FORM_PREFIX],
  keys: ["nav.consult"],
};

/** Contact-card CTA client island: its trigger label + the embedded lead form. */
export const CONTACT_CTA_COPY: CopySelection = {
  prefixes: [LEAD_FORM_PREFIX],
  keys: ["contact.leave_info"],
};
