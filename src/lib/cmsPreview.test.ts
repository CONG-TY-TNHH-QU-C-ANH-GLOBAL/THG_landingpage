import { afterEach, describe, expect, it, vi } from "vitest";
import { cmsClient } from "@/lib/cmsClient";
import { blogPreviewResponseSchema } from "@/lib/cmsSchemas";

const token = "a".repeat(64);
const payload = {
  ok: true,
  preview: {
    externalId: "crm-preview:task:blog",
    versionId: "version-1",
    kind: "blog",
    locale: "vi",
    slug: "marketing-blog",
    expiresAt: "2026-09-29T00:00:00.000Z",
    title: "Preview title",
    excerpt: "Exact review copy",
    body_md: "# Exact body",
    category: "Operations",
    published_date: null,
    seo_title: null,
    seo_description: null,
    thumbnail_url: "https://cdn.example.test/hero.webp",
    slides: [{ src: "https://cdn.example.test/hero.webp", alt_text: "Hero" }],
  },
};

afterEach(() => vi.restoreAllMocks());

describe("CMS blog preview contract", () => {
  it("accepts the exact blog projection including production image fields", () => {
    expect(blogPreviewResponseSchema.parse(payload)).toEqual(payload);
  });

  it("fetches only a bounded opaque token and validates the response", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(Response.json(payload));
    await expect(cmsClient.getBlogPreview(token)).resolves.toEqual(payload);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`/api/v1/blog-previews/${token}$`)),
      expect.objectContaining({ headers: expect.objectContaining({ Accept: "application/json" }) }),
    );
    await expect(cmsClient.getBlogPreview("../contents")).rejects.toThrow(
      "Preview token không hợp lệ",
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
