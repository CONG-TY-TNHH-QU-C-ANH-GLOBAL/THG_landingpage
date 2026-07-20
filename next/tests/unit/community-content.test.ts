import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import {
  loadCommunityCategories,
  loadCommunityQuestions,
  loadCommunityQuestion,
  loadCommunityReviews,
  loadCommunityReview,
} from "../../src/features/community";
import { resetLoggedCmsFallbacks } from "../../src/shared/cms/log-fallback";

// COM-001 / COM-002 data layer: transport wiring, DTO→model mapping, the privacy
// boundary, and every explicit failure state.

type FetchImpl = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

function mockFetch(impl: FetchImpl) {
  const fn = vi.fn(impl);
  vi.stubGlobal("fetch", fn);
  return fn;
}

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status < 400,
    status,
    statusText: status === 200 ? "OK" : "Error",
    json: async () => body,
  } as unknown as Response;
}

// A question row as the CMS actually sends it, plus the private fields that must never
// survive the boundary even if the CMS regressed and started emitting them.
const LEAKY_QUESTION = {
  slug: "ship-vn-us-bao-lau",
  title: "Ship VN → US mất bao lâu?",
  body: "Mình bán POD, khách ở Mỹ.\nThời gian giao thực tế là bao nhiêu?",
  category: { slug: "van-chuyen", name: "Vận chuyển & Tracking" },
  author_name: "Minh",
  expert_answer: "Trung bình 7–12 ngày.",
  expert_answer_updated_at: 1_700_000_500,
  verified: true,
  indexable: true,
  same_issue_count: 4,
  published_at: 1_700_000_000,
  // Private / moderation fields — none of these may reach a model.
  author_email: "minh@example.com",
  ip: "203.0.113.7",
  user_agent: "Mozilla/5.0",
  utm_json: '{"utm_source":"fb"}',
  owner_token_hash: "a".repeat(64),
  withdrawn_at: null,
  status: "published",
  category_id: 1,
  locale: "vi",
};

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  resetLoggedCmsFallbacks();
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("community transport wiring", () => {
  it("sends no lang param: community UGC has no locale dimension in the CMS", async () => {
    const fetchMock = mockFetch(async () => jsonResponse({ questions: [] }));
    await loadCommunityQuestions();
    expect(fetchMock.mock.calls[0][0]).toBe("http://localhost:8080/api/v1/community/questions");
    expect(String(fetchMock.mock.calls[0][0])).not.toContain("lang");
  });

  it("passes the category filter as a URL-encoded slug", async () => {
    const fetchMock = mockFetch(async () => jsonResponse({ questions: [] }));
    await loadCommunityQuestions("chi-phi-thanh-toan");
    expect(fetchMock.mock.calls[0][0]).toBe(
      "http://localhost:8080/api/v1/community/questions?category=chi-phi-thanh-toan",
    );

    const encoded = mockFetch(async () => jsonResponse({ reviews: [] }));
    await loadCommunityReviews("a b&c=d");
    expect(encoded.mock.calls[0][0]).toBe(
      "http://localhost:8080/api/v1/community/reviews?category=a%20b%26c%3Dd",
    );
  });

  it("encodes the slug so a crafted slug cannot escape the detail path", async () => {
    const fetchMock = mockFetch(async () => jsonResponse({ error: "nope" }, 404));
    await loadCommunityQuestion("../../admin/secrets?x=1");
    expect(fetchMock.mock.calls[0][0]).toBe(
      "http://localhost:8080/api/v1/community/questions/..%2F..%2Fadmin%2Fsecrets%3Fx%3D1",
    );
  });
});

describe("community mapping and privacy", () => {
  it("maps a question detail end to end and drops every private field", async () => {
    mockFetch(async () => jsonResponse({ question: LEAKY_QUESTION }));
    const result = await loadCommunityQuestion("ship-vn-us-bao-lau");
    expect(result.status).toBe("ready");
    if (result.status !== "ready") return;

    expect(result.question).toEqual({
      slug: "ship-vn-us-bao-lau",
      title: "Ship VN → US mất bao lâu?",
      body: "Mình bán POD, khách ở Mỹ.\nThời gian giao thực tế là bao nhiêu?",
      category: { slug: "van-chuyen", name: "Vận chuyển & Tracking" },
      authorName: "Minh",
      expertAnswer: "Trung bình 7–12 ngày.",
      // unix seconds → milliseconds
      expertAnswerUpdatedAt: 1_700_000_500_000,
      verified: true,
      indexable: true,
      sameIssueCount: 4,
      publishedAt: 1_700_000_000_000,
    });

    // Observable privacy assertion: nothing private is reachable anywhere in the model.
    const serialized = JSON.stringify(result.question);
    for (const secret of ["minh@example.com", "203.0.113.7", "Mozilla", "utm_source", "a".repeat(64)]) {
      expect(serialized).not.toContain(secret);
    }
    for (const key of ["author_email", "ip", "user_agent", "utm_json", "owner_token_hash", "withdrawn_at", "status", "locale"]) {
      expect(Object.keys(result.question)).not.toContain(key);
    }
  });

  it("treats a whitespace-only expert answer as absent, matching the CMS list flag", async () => {
    mockFetch(async () => jsonResponse({ question: { ...LEAKY_QUESTION, expert_answer: "   " } }));
    const result = await loadCommunityQuestion("s");
    expect(result.status === "ready" && result.question.expertAnswer).toBeNull();
  });

  it("keeps a null publishedAt null rather than mapping it to the epoch", async () => {
    mockFetch(async () => jsonResponse({ question: { ...LEAKY_QUESTION, published_at: null } }));
    const result = await loadCommunityQuestion("s");
    expect(result.status === "ready" && result.question.publishedAt).toBeNull();
  });

  it("orders categories by CMS position and drops the position key from the model", async () => {
    mockFetch(async () =>
      jsonResponse({
        categories: [
          { slug: "pod", name: "Print on Demand", position: 2 },
          { slug: "van-chuyen", name: "Vận chuyển", position: 1 },
        ],
      }),
    );
    await expect(loadCommunityCategories()).resolves.toEqual([
      { slug: "van-chuyen", name: "Vận chuyển" },
      { slug: "pod", name: "Print on Demand" },
    ]);
  });

  it("maps a review detail and never exposes the moderator-only fields", async () => {
    mockFetch(async () =>
      jsonResponse({
        review: {
          slug: "pod-ok",
          title: "Ổn định cho đơn US",
          body: "Giao đúng hẹn trong 3 tháng.",
          category: null,
          reviewer_name: "Lan",
          rating: 5,
          public_summary: "THG xác nhận đơn hàng.",
          verified: true,
          indexable: true,
          published_at: 1_700_000_000,
          reviewer_email: "lan@example.com",
          private_order_reference: "ORD-99",
          private_evidence_note: "ảnh chụp",
        },
      }),
    );
    const result = await loadCommunityReview("pod-ok");
    expect(result.status).toBe("ready");
    if (result.status !== "ready") return;
    const serialized = JSON.stringify(result.review);
    for (const secret of ["lan@example.com", "ORD-99", "ảnh chụp"]) {
      expect(serialized).not.toContain(secret);
    }
    expect(result.review.rating).toBe(5);
    expect(result.review.publicSummary).toBe("THG xác nhận đơn hàng.");
  });
});

describe("community list states", () => {
  it("reports a confirmed empty list as empty, not as an outage", async () => {
    mockFetch(async () => jsonResponse({ questions: [] }));
    await expect(loadCommunityQuestions()).resolves.toEqual({ status: "empty", questions: [] });
  });

  it("reports a populated list as ready", async () => {
    mockFetch(async () =>
      jsonResponse({
        questions: [
          {
            slug: "a",
            title: "T",
            excerpt: "E",
            category: null,
            has_expert_answer: false,
            verified: false,
            indexable: false,
            same_issue_count: 0,
            published_at: null,
          },
        ],
      }),
    );
    const result = await loadCommunityQuestions();
    expect(result.status).toBe("ready");
    expect(result.questions).toHaveLength(1);
    expect(result.questions[0].hasExpertAnswer).toBe(false);
  });

  it("distinguishes an outage from an empty list so the UI never claims 'no questions yet'", async () => {
    mockFetch(async () => jsonResponse({ error: "down" }, 500));
    await expect(loadCommunityQuestions()).resolves.toEqual({
      status: "unavailable",
      questions: [],
      reason: "http",
    });

    resetLoggedCmsFallbacks();
    mockFetch(async () => {
      throw new TypeError("fetch failed");
    });
    const network = await loadCommunityReviews();
    expect(network).toEqual({ status: "unavailable", reviews: [], reason: "network" });
  });

  it("classifies a schema-valid-JSON-but-wrong-shape payload as a contract failure", async () => {
    mockFetch(async () => jsonResponse({ questions: "not-an-array" }));
    const result = await loadCommunityQuestions();
    expect(result).toEqual({ status: "unavailable", questions: [], reason: "contract" });
    // The raw payload never reaches any log.
    expect(JSON.stringify((console.warn as ReturnType<typeof vi.fn>).mock.calls)).not.toContain(
      "not-an-array",
    );
  });

  it("degrades categories to an empty filter bar without failing the list", async () => {
    mockFetch(async () => jsonResponse({ error: "down" }, 500));
    await expect(loadCommunityCategories()).resolves.toEqual([]);
  });
});

describe("community detail states", () => {
  it("maps a CMS 404 to not-found — pending, rejected, withdrawn and unknown are one answer", async () => {
    mockFetch(async () => jsonResponse({ error: 'No published question with slug "x"' }, 404));
    await expect(loadCommunityQuestion("x")).resolves.toEqual({ status: "not-found" });
    await expect(loadCommunityReview("x")).resolves.toEqual({ status: "not-found" });
  });

  it("does not log a 404 as a fallback: it is an expected outcome, not a degradation", async () => {
    mockFetch(async () => jsonResponse({ error: "nope" }, 404));
    await loadCommunityQuestion("x");
    const fallbackWarns = (console.warn as ReturnType<typeof vi.fn>).mock.calls.filter((c) =>
      String(c[0]).includes("[CMS] fallback"),
    );
    expect(fallbackWarns).toHaveLength(0);
  });

  it("separates an outage from a 404 so a down CMS never renders as a deleted question", async () => {
    mockFetch(async () => jsonResponse({ error: "boom" }, 503));
    await expect(loadCommunityQuestion("x")).resolves.toEqual({
      status: "unavailable",
      reason: "http",
    });
  });

  it("never leaks the CMS error body into a log", async () => {
    mockFetch(async () => jsonResponse({ error: "Quá nhiều yêu cầu. Thử lại sau 1 giờ." }, 500));
    await loadCommunityQuestion("x");
    const logged = JSON.stringify([
      ...(console.warn as ReturnType<typeof vi.fn>).mock.calls,
      ...(console.error as ReturnType<typeof vi.fn>).mock.calls,
    ]);
    expect(logged).not.toContain("Quá nhiều yêu cầu");
  });
});
