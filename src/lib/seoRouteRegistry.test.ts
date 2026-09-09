import { describe, expect, it } from "vitest";

import registry from "../../scripts/seo-route-registry.json";

describe("SEO route registry", () => {
  it("has unique normalized routes and supported locales", () => {
    expect(registry.siteBase).toBe("https://thgfulfill.com");
    expect(registry.locales).toEqual(["vi", "en", "zh"]);
    expect(new Set(registry.staticRoutes).size).toBe(registry.staticRoutes.length);
    expect(registry.staticRoutes.every((route) => route.startsWith("/") && (route === "/" || !route.endsWith("/")))).toBe(true);
  });

  it("keeps every commercial route in the prerender registry", () => {
    expect(registry.commercialRoutes.every((route) => registry.staticRoutes.includes(route))).toBe(true);
  });
});
