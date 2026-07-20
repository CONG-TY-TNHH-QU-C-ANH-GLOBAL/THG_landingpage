import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { generateMetadata as listMetadata } from "../../src/app/[lang]/community/page";
import { generateMetadata as detailMetadata } from "../../src/app/[lang]/community/[slug]/page";
import { generateMetadata as reviewsMetadata } from "../../src/app/[lang]/community/reviews/page";
import { generateMetadata as reviewDetailMetadata } from "../../src/app/[lang]/community/reviews/[slug]/page";
import sitemap from "../../src/app/sitemap";
import { resetLoggedCmsFallbacks } from "../../src/shared/cms/log-fallback";

// COM-001 §12 / FND-003 / OQ-P-002.
//
// Community indexability is deliberately held: OQ-P-002 selects NONE of its five
// candidate localized-UGC policies, and both COM specs are DRAFT. Every community route
// is therefore noindex with no canonical and no hreflang in every locale, and no
// community URL enters the sitemap. These tests pin that hold so it cannot be relaxed by
// accident — they must be updated deliberately when OQ-P-002 is decided.

const QUESTION = {
  question: {
    slug: "ship-vn-us",
    title: "Ship VN → US mất bao lâu?",
    body: "Nội dung   với     nhiều khoảng trắng.",
    category: null,
    author_name: "Minh",
    expert_answer: "Trả lời.",
    expert_answer_updated_at: null,
    verified: true,
    // Even a fully indexable question stays noindex while the policy is unresolved.
    indexable: true,
    same_issue_count: 0,
    published_at: 1_700_000_000,
  },
};

function mockFetch(body: unknown, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn(
      async () =>
        ({ ok: status < 400, status, statusText: "OK", json: async () => body }) as unknown as Response,
    ),
  );
}

beforeEach(() => {
  vi.unstubAllGlobals();
  resetLoggedCmsFallbacks();
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const LOCALES = ["vi", "en", "zh"] as const;

describe("community indexability hold (OQ-P-002)", () => {
  it("marks every community listing noindex,nofollow in all three locales", async () => {
    mockFetch({ questions: [] });
    for (const lang of LOCALES) {
      const meta = await listMetadata({
        params: Promise.resolve({ lang }),
        searchParams: Promise.resolve({}),
      });
      expect(meta.robots, lang).toEqual({ index: false, follow: false });
    }
  });

  it("marks the reviews listing noindex,nofollow in all three locales", async () => {
    mockFetch({ reviews: [] });
    for (const lang of LOCALES) {
      const meta = await reviewsMetadata({
        params: Promise.resolve({ lang }),
        searchParams: Promise.resolve({}),
      });
      expect(meta.robots, lang).toEqual({ index: false, follow: false });
    }
  });

  it("keeps a backend-indexable question noindex while the locale policy is unresolved", async () => {
    mockFetch(QUESTION);
    const meta = await detailMetadata({ params: Promise.resolve({ lang: "vi", slug: "ship-vn-us" }) });
    expect(meta.robots).toEqual({ index: false, follow: false });
  });

  it("emits no canonical and no hreflang alternates for any community route", async () => {
    mockFetch(QUESTION);
    const metas = [
      await listMetadata({ params: Promise.resolve({ lang: "vi" }), searchParams: Promise.resolve({}) }),
      await detailMetadata({ params: Promise.resolve({ lang: "en", slug: "ship-vn-us" }) }),
    ];
    mockFetch({ reviews: [] });
    metas.push(
      await reviewsMetadata({ params: Promise.resolve({ lang: "zh" }), searchParams: Promise.resolve({}) }),
    );
    for (const meta of metas) {
      // A self-canonical per locale would itself select the unapproved
      // three-independent-duplicates policy; a noindex page needs no canonical.
      expect(meta.alternates).toBeUndefined();
    }
  });

  it("excludes every community URL from the sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls.filter((url) => url.includes("/community"))).toEqual([]);
  });

  it("returns empty metadata for an unsupported locale instead of inventing a page", async () => {
    await expect(
      listMetadata({ params: Promise.resolve({ lang: "fr" }), searchParams: Promise.resolve({}) }),
    ).resolves.toEqual({});
  });
});

describe("community detail metadata safety", () => {
  it("derives a whitespace-collapsed, length-capped description from the question body", async () => {
    mockFetch(QUESTION);
    const meta = await detailMetadata({ params: Promise.resolve({ lang: "vi", slug: "ship-vn-us" }) });
    expect(meta.description).toBe("Nội dung với nhiều khoảng trắng.");
    expect(meta.title).toContain("Ship VN → US mất bao lâu?");
  });

  it("caps a long body rather than emitting the whole question as a description", async () => {
    mockFetch({ question: { ...QUESTION.question, body: "a".repeat(500) } });
    const meta = await detailMetadata({ params: Promise.resolve({ lang: "vi", slug: "x" }) });
    expect(String(meta.description).length).toBeLessThanOrEqual(160);
  });

  it("leaks no question title for an unknown, pending, rejected or withdrawn slug", async () => {
    mockFetch({ error: "No published question" }, 404);
    const meta = await detailMetadata({ params: Promise.resolve({ lang: "vi", slug: "gone" }) });
    expect(String(meta.title)).not.toContain("Ship VN");
    expect(meta.robots).toEqual({ index: false, follow: false });
  });

  it("stays noindex when the CMS is unavailable", async () => {
    mockFetch({ error: "boom" }, 503);
    const meta = await detailMetadata({ params: Promise.resolve({ lang: "vi", slug: "x" }) });
    expect(meta.robots).toEqual({ index: false, follow: false });
  });

  it("prefers the operator summary over the raw review body for the description", async () => {
    mockFetch({
      review: {
        slug: "pod-ok",
        title: "Ổn định",
        body: "Nội dung đánh giá dài của người dùng.",
        category: null,
        reviewer_name: "Lan",
        rating: 5,
        public_summary: "THG xác nhận đơn hàng.",
        verified: true,
        indexable: true,
        published_at: null,
      },
    });
    const meta = await reviewDetailMetadata({ params: Promise.resolve({ lang: "vi", slug: "pod-ok" }) });
    expect(meta.description).toBe("THG xác nhận đơn hàng.");
  });
});
