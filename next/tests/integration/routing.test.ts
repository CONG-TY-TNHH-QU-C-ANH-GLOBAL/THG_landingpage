import { describe, it, expect } from "vitest";
import { decodeLocaleRoute, LOCALE_REDIRECT_STATUS } from "../../src/shared/i18n/config/locale-routing";
import { config } from "../../src/proxy";

// Pure locale-routing decision matrix (the runtime HTTP matrix is asserted against the
// packaged standalone artifact by scripts/validation/locale-routing-matrix.sh in CI).

describe("decodeLocaleRoute", () => {
  it("uses a permanent, method-preserving redirect status (approved contract)", () => {
    expect(LOCALE_REDIRECT_STATUS).toBe(308);
  });

  it("redirects / to the default locale", () => {
    expect(decodeLocaleRoute("/")).toEqual({ kind: "redirect", location: "/vi" });
  });

  it("passes supported locale roots and nested paths", () => {
    for (const p of ["/vi", "/en", "/zh", "/vi/anything", "/en/a/b"]) {
      expect(decodeLocaleRoute(p)).toEqual({ kind: "pass" });
    }
  });

  it("normalizes unsupported 2-letter locale prefixes to the default locale", () => {
    expect(decodeLocaleRoute("/fr")).toEqual({ kind: "redirect", location: "/vi" });
    expect(decodeLocaleRoute("/de")).toEqual({ kind: "redirect", location: "/vi" });
    expect(decodeLocaleRoute("/fr/policy")).toEqual({ kind: "redirect", location: "/vi/policy" });
    expect(decodeLocaleRoute("/EN")).toEqual({ kind: "redirect", location: "/vi" }); // case variant
  });

  it("passes non-locale unprefixed paths (fall through to Next → real 404 in foundation)", () => {
    for (const p of ["/foundation", "/some-slug", "/abc"]) {
      expect(decodeLocaleRoute(p)).toEqual({ kind: "pass" });
    }
  });

  it("normalizes uppercase locale-like prefixes to the default (parity with current Vite)", () => {
    expect(decodeLocaleRoute("/VI")).toEqual({ kind: "redirect", location: "/vi" });
    expect(decodeLocaleRoute("/EN")).toEqual({ kind: "redirect", location: "/vi" });
  });

  it("passes malformed locale-like prefixes (→ real 404); not 2-letter", () => {
    for (const p of ["/en-US", "/e1", "/1a", "/zzz"]) {
      expect(decodeLocaleRoute(p)).toEqual({ kind: "pass" });
    }
  });

  // Legacy unprefixed-route divergence (FND-002 foundation): a known Vite slug returns a real
  // 404 here — its redirect to /vi/{path} is owned by the migrating WEB/COM/CONV item, NOT
  // FND-002. This deterministic test records the intentional current behavior.
  it("intentionally passes a legacy unprefixed route (→ 404 until its owner migrates it)", () => {
    expect(decodeLocaleRoute("/thg-fulfill")).toEqual({ kind: "pass" });
  });

  it("never produces a redirect loop (a redirect target itself passes)", () => {
    for (const p of ["/", "/fr", "/de/x", "/EN", "/zz/a/b"]) {
      const d = decodeLocaleRoute(p);
      if (d.kind === "redirect") {
        expect(decodeLocaleRoute(d.location!)).toEqual({ kind: "pass" });
      }
    }
  });
});

describe("proxy matcher bypass", () => {
  // Approximation of Next's matcher intent; the authoritative bypass is the runtime probe.
  const pattern = (config.matcher as string[])[0];
  const re = new RegExp(`^${pattern.replace(/\\\\/g, "\\")}$`);
  const runsProxy = (path: string) => re.test(path);

  it("runs the proxy for locale routes", () => {
    for (const p of ["/", "/vi", "/en", "/fr", "/foundation"]) expect(runsProxy(p)).toBe(true);
  });

  it("bypasses api, next internals, health, probe and files with extensions", () => {
    for (const p of [
      "/api/health",
      "/_next/static/chunks/x.js",
      "/favicon.ico",
      "/foundation-probe.txt",
      "/README.md",
      "/img/logo.png",
    ]) {
      expect(runsProxy(p)).toBe(false);
    }
  });
});

// Runtime-community-route investigation (fix/Anh/runtime-community-route): the browser
// "Invalid or unexpected token" symptom would require an HTML body served where a
// script was requested. These cases pin the two mechanics that guarantee the proxy can
// never do that, and the exact community-path handling.
describe("proxy — community paths and script-request safety", () => {
  const pattern = (config.matcher as string[])[0];
  const re = new RegExp(`^${pattern.replace(/\\\\/g, "\\")}$`);
  const runsProxy = (path: string) => re.test(path);

  it("passes locale community paths straight to Next routing (no rewrite, no loop)", () => {
    for (const p of ["/vi/community", "/en/community", "/zh/community", "/vi/community/reviews"]) {
      expect(decodeLocaleRoute(p)).toEqual({ kind: "pass" });
    }
  });

  it("normalizes an unknown-locale community path to the default locale once", () => {
    const d = decodeLocaleRoute("/fr/community");
    expect(d).toEqual({ kind: "redirect", location: "/vi/community" });
    // the target passes — never a second locale prefix, never a loop
    expect(decodeLocaleRoute(d.location!)).toEqual({ kind: "pass" });
  });

  it("never double-prefixes an already-localized path", () => {
    expect(decodeLocaleRoute("/vi/en")).toEqual({ kind: "pass" });
    expect(decodeLocaleRoute("/vi/vi/community")).toEqual({ kind: "pass" });
  });

  it("script/static requests bypass the proxy entirely — an HTML response for a JS chunk is impossible here", () => {
    for (const p of [
      "/_next/static/chunks/app/%5Blang%5D/page.js",
      "/_next/static/chunks/main-app.js",
      "/_next/static/chunks/x.js.map",
      "/assets/globe-3d.avif",
      "/fonts/inter-400.woff2",
    ]) {
      expect(runsProxy(p)).toBe(false);
    }
  });
});
