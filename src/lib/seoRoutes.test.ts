import { describe, expect, it } from "vitest";

import { hrefLang, localizedUrl, normalizeSeoPath } from "./seoRoutes";

describe("SEO URL builder", () => {
  it("uses the canonical non-www host and removes trailing slashes", () => {
    expect(localizedUrl("vi", "/")).toBe("https://thgfulfill.com/vi");
    expect(localizedUrl("en", "/thg-express/")).toBe("https://thgfulfill.com/en/thg-express");
    expect(normalizeSeoPath("blog/example/")).toBe("/blog/example");
  });

  it("maps the Chinese locale to the supported hreflang code", () => {
    expect(hrefLang("zh")).toBe("zh-CN");
    expect(hrefLang("vi")).toBe("vi");
  });
});
