import { afterEach, describe, expect, it, vi } from "vitest";
import { cmsClient } from "@/lib/cmsClient";
import { blogPreviewResponseSchema } from "@/lib/cmsSchemas";

const payload = {
  ok: true,
  preview: {
    externalId: "crm-preview:task:blog", versionId: "version-1", kind: "blog", locale: "vi",
    slug: "marketing-blog", expiresAt: "2026-10-14T00:00:00.000Z", title: "Preview title",
    excerpt: "Exact review copy", body_md: "# Exact body", category: "Operations", published_date: null,
    seo_title: null, seo_description: null, thumbnail_url: "https://cdn.example.test/hero.webp",
    slides: [{ src: "https://cdn.example.test/hero.webp", alt_text: "Hero" }],
  },
};
afterEach(() => vi.restoreAllMocks());

describe("CMS blog preview consumer contract", () => {
  it("accepts a public preview projection and rejects insecure image URLs", () => {
    expect(blogPreviewResponseSchema.parse(payload)).toEqual(payload);
    expect(blogPreviewResponseSchema.safeParse({ ...payload, preview: { ...payload.preview, thumbnail_url: "http://cdn.example.test/image" } }).success).toBe(false);
  });
  it("sends no-store/no-referrer and rejects malformed capability tokens before fetch", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json(payload));
    await expect(cmsClient.getBlogPreview("a".repeat(64))).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/blog-previews\/a{64}$/), expect.objectContaining({ cache: "no-store", referrerPolicy: "no-referrer" }));
    await expect(cmsClient.getBlogPreview("../contents")).rejects.toThrow("Preview token không hợp lệ");
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
