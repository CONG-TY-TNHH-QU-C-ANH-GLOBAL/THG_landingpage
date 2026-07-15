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
