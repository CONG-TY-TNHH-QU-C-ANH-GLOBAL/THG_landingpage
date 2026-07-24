import { describe, it, expect } from "vitest";

import { MARKETING_COPY } from "../../src/shared/i18n/marketing-copy";
import type { MarketingCopy } from "../../src/shared/i18n/marketing";
import {
  pickCopy,
  NAVBAR_COPY,
  FLOATING_CONTACT_COPY,
  CONTACT_CTA_COPY,
} from "../../src/shared/i18n/shell-copy";

// The real dictionary, so a renamed namespace fails here rather than shipping a raw key.
const copy: MarketingCopy = Object.fromEntries(
  Object.entries(MARKETING_COPY).map(([key, entry]) => [key, entry.vi]),
);

const keysWithPrefix = (prefix: string) => Object.keys(copy).filter((k) => k.startsWith(prefix));

describe("pickCopy", () => {
  it("keeps only prefix-matched keys and preserves their exact values", () => {
    const src: MarketingCopy = { "nav.a": "A", "nav.b": "B", "home.x": "X" };
    expect(pickCopy(src, { prefixes: ["nav."] })).toEqual({ "nav.a": "A", "nav.b": "B" });
  });

  it("includes explicit keys alongside prefixes, and nothing else", () => {
    const src: MarketingCopy = { "floating.call": "C", "nav.consult": "K", "nav.services": "S" };
    expect(pickCopy(src, { prefixes: ["floating."], keys: ["nav.consult"] })).toEqual({
      "floating.call": "C",
      "nav.consult": "K",
    });
  });

  it("returns an empty map when nothing matches (never throws)", () => {
    expect(pickCopy({ "home.x": "X" }, { prefixes: ["nav."] })).toEqual({});
  });
});

describe("shell-copy selections cover exactly what each island reads", () => {
  it("NAVBAR_COPY carries every nav.* and lead_form.* key and no other namespace", () => {
    const picked = pickCopy(copy, NAVBAR_COPY);
    for (const k of [...keysWithPrefix("nav."), ...keysWithPrefix("lead_form.")]) {
      expect(picked[k]).toBe(copy[k]);
    }
    // no unrelated namespace leaks through (e.g. homepage/hero/contact-directory copy)
    expect(Object.keys(picked).every((k) => k.startsWith("nav.") || k.startsWith("lead_form."))).toBe(true);
    // and it is a genuine reduction of the full dictionary
    expect(Object.keys(picked).length).toBeLessThan(Object.keys(copy).length);
  });

  it("FLOATING_CONTACT_COPY carries floating.* + lead_form.* + nav.consult only", () => {
    const picked = pickCopy(copy, FLOATING_CONTACT_COPY);
    for (const k of [...keysWithPrefix("floating."), ...keysWithPrefix("lead_form.")]) {
      expect(picked[k]).toBe(copy[k]);
    }
    expect(picked["nav.consult"]).toBe(copy["nav.consult"]);
    // other nav.* strings do not ride along (the floating bar never renders them)
    expect(picked["nav.services"]).toBeUndefined();
  });

  it("CONTACT_CTA_COPY carries lead_form.* + contact.leave_info only", () => {
    const picked = pickCopy(copy, CONTACT_CTA_COPY);
    for (const k of keysWithPrefix("lead_form.")) expect(picked[k]).toBe(copy[k]);
    expect(picked["contact.leave_info"]).toBe(copy["contact.leave_info"]);
    // the directory/heading strings stay server-side, not in the CTA island's payload
    expect(picked["contact.title"]).toBeUndefined();
  });
});

describe("shell client namespaces resolve in every locale (vi/en/zh) — no raw key ships", () => {
  // getMarketingCopy resolves byLocale[lang] || byLocale.en || key; a raw key would only ship
  // if BOTH the locale and the en fallback were blank. Navbar/FloatingContact/LeadFormDialog
  // read the nav./floating./lead_form. namespaces, so every such key must resolve non-empty in
  // all three locales — this covers LeadFormDialog's strings without opening the dialog.
  const NS = ["nav.", "floating.", "lead_form."];
  const shellKeys = Object.keys(MARKETING_COPY).filter((k) => NS.some((p) => k.startsWith(p)));

  it.each(["vi", "en", "zh"] as const)("locale %s resolves every shell key non-empty", (locale) => {
    expect(shellKeys.length).toBeGreaterThan(0);
    const missing = shellKeys.filter((k) => {
      const entry = MARKETING_COPY[k as keyof typeof MARKETING_COPY];
      const resolved = entry[locale] || entry.en || k;
      return !resolved || resolved === k;
    });
    expect(missing).toEqual([]);
  });
});
