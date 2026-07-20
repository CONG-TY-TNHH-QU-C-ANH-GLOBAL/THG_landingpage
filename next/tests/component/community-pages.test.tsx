// @vitest-environment happy-dom
// Renders the real route components — no test-only replicas — so what these assert is
// what the server actually sends. Everything checked here is present in the SSR output,
// which is the same thing as saying the page works with JavaScript disabled.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";

import CommunityPage from "@/app/[lang]/community/page";
import CommunityQuestionPage from "@/app/[lang]/community/[slug]/page";
import CommunityReviewsPage from "@/app/[lang]/community/reviews/page";
import { WithdrawButton } from "@/features/community/client/withdraw-button";
import { rememberOwnerToken, reviewOwnerKey } from "@/features/community/client/owner-store";
import type { MarketingCopy } from "@/shared/i18n/marketing";
import { resetLoggedCmsFallbacks } from "@/shared/cms/log-fallback";

// Only useRouter is replaced — there is no app-router context in a unit render. notFound()
// stays real so the 404 assertion exercises Next's actual signal.
vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/navigation")>()),
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

const CATEGORIES = {
  categories: [
    { slug: "van-chuyen", name: "Vận chuyển & Tracking", position: 1 },
    { slug: "pod", name: "Print on Demand", position: 2 },
  ],
};

const QUESTIONS = {
  questions: [
    {
      slug: "ship-vn-us",
      title: "Ship VN → US mất bao lâu?",
      excerpt: "Mình bán POD, khách ở Mỹ.",
      category: { slug: "van-chuyen", name: "Vận chuyển & Tracking" },
      has_expert_answer: true,
      verified: true,
      indexable: true,
      same_issue_count: 4,
      published_at: 1_700_000_000,
    },
    {
      slug: "chua-tra-loi",
      title: "Câu hỏi chưa có chuyên gia trả lời",
      excerpt: "Nội dung tóm tắt.",
      category: null,
      has_expert_answer: false,
      verified: false,
      indexable: false,
      same_issue_count: 0,
      published_at: null,
    },
  ],
};

/** Routes the mock by URL so one setup serves categories + list/detail together. */
function mockCms(routes: Array<[RegExp, unknown, number?]>) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string | URL | Request) => {
      const url = String(input);
      const hit = routes.find(([pattern]) => pattern.test(url));
      const [, body, status = 200] = hit ?? [null, { error: "unmocked" }, 500];
      return {
        ok: status < 400,
        status,
        statusText: "OK",
        json: async () => body,
      } as unknown as Response;
    }),
  );
}

beforeEach(() => {
  globalThis.localStorage?.clear();
  vi.unstubAllGlobals();
  resetLoggedCmsFallbacks();
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const listPage = (lang = "vi", searchParams: Record<string, string> = {}) =>
  CommunityPage({ params: Promise.resolve({ lang }), searchParams: Promise.resolve(searchParams) });

describe("community listing (SSR)", () => {
  it("renders the question list, badges and counts as server markup", async () => {
    mockCms([
      [/community\/categories/, CATEGORIES],
      [/community\/questions/, QUESTIONS],
    ]);
    render(await listPage());

    expect(screen.getByRole("heading", { level: 1, name: "Hỏi đáp dành cho Seller" })).toBeTruthy();

    const answered = screen.getByRole("link", { name: /Ship VN → US mất bao lâu/ });
    expect(answered.getAttribute("href")).toBe("/vi/community/ship-vn-us");
    expect(within(answered).getByText("THG xác thực")).toBeTruthy();
    expect(within(answered).getByText("Chuyên gia THG trả lời")).toBeTruthy();
    expect(within(answered).getByText("Vận chuyển & Tracking")).toBeTruthy();
    expect(within(answered).getByText(/4 ×/)).toBeTruthy();

    // Badges are driven by CMS flags, never derived: the unverified, unanswered question
    // shows neither.
    const unanswered = screen.getByRole("link", { name: /Câu hỏi chưa có chuyên gia/ });
    expect(within(unanswered).queryByText("THG xác thực")).toBeNull();
    expect(within(unanswered).queryByText("Chuyên gia THG trả lời")).toBeNull();
  });

  it("renders category filters as real links carrying ?category=", async () => {
    mockCms([
      [/community\/categories/, CATEGORIES],
      [/community\/questions/, QUESTIONS],
    ]);
    render(await listPage());

    const filters = screen.getByRole("navigation", { name: "Lọc theo chủ đề" });
    expect(within(filters).getByRole("link", { name: "Tất cả" }).getAttribute("href")).toBe("/vi/community");
    expect(within(filters).getByRole("link", { name: "Print on Demand" }).getAttribute("href")).toBe(
      "/vi/community?category=pod",
    );
  });

  it("marks the active filter and forwards it to the CMS request", async () => {
    const fetchMock = vi.fn(async (input: string | URL | Request) => {
      const url = String(input);
      const body = /categories/.test(url) ? CATEGORIES : QUESTIONS;
      return { ok: true, status: 200, statusText: "OK", json: async () => body } as unknown as Response;
    });
    vi.stubGlobal("fetch", fetchMock);

    render(await listPage("vi", { category: "pod" }));

    expect(
      fetchMock.mock.calls.some(([url]) => String(url).endsWith("/community/questions?category=pod")),
    ).toBe(true);
    const active = screen.getByRole("link", { name: "Print on Demand" });
    expect(active.getAttribute("aria-current")).toBe("page");
  });

  it("links the Q&A and Reviews tabs and marks the current one", async () => {
    mockCms([
      [/community\/categories/, CATEGORIES],
      [/community\/questions/, QUESTIONS],
    ]);
    render(await listPage("en"));

    const tabs = screen.getByRole("navigation", { name: "Community sections" });
    const qa = within(tabs).getByRole("link", { name: "Q&A" });
    const reviews = within(tabs).getByRole("link", { name: "Reviews" });
    expect(qa.getAttribute("href")).toBe("/en/community");
    expect(qa.getAttribute("aria-current")).toBe("page");
    expect(reviews.getAttribute("href")).toBe("/en/community/reviews");
    expect(reviews.getAttribute("aria-current")).toBeNull();
  });

  it("renders UI chrome in the requested locale while the list stays server-driven", async () => {
    mockCms([
      [/community\/categories/, CATEGORIES],
      [/community\/questions/, { questions: [] }],
    ]);
    render(await listPage("zh"));
    expect(screen.getByRole("heading", { level: 1, name: "卖家问答中心" })).toBeTruthy();
  });

  it("shows the empty state only for a confirmed empty list", async () => {
    mockCms([
      [/community\/categories/, CATEGORIES],
      [/community\/questions/, { questions: [] }],
    ]);
    render(await listPage());
    expect(screen.getByText(/Chưa có câu hỏi nào/)).toBeTruthy();
  });

  it("shows an outage notice — never 'no questions yet' — when the CMS is down", async () => {
    mockCms([
      [/community\/categories/, CATEGORIES],
      [/community\/questions/, { error: "down" }, 500],
    ]);
    render(await listPage());

    expect(screen.queryByText(/Chưa có câu hỏi nào/)).toBeNull();
    expect(screen.getByRole("status").textContent).toMatch(/tạm thời không truy cập được/);
  });

  it("renders the reviews listing with its own empty copy", async () => {
    mockCms([
      [/community\/categories/, CATEGORIES],
      [/community\/reviews/, { reviews: [] }],
    ]);
    render(
      await CommunityReviewsPage({
        params: Promise.resolve({ lang: "vi" }),
        searchParams: Promise.resolve({}),
      }),
    );
    expect(screen.getByRole("heading", { level: 1, name: "Đánh giá Seller đã xác thực" })).toBeTruthy();
    expect(screen.getByText(/Hãy là tiếng nói xác thực đầu tiên/)).toBeTruthy();
  });
});

describe("question detail (SSR)", () => {
  const detail = (overrides: Record<string, unknown> = {}) => ({
    question: {
      slug: "ship-vn-us",
      title: "Ship VN → US mất bao lâu?",
      body: "Mình bán POD.\nKhách ở Mỹ.",
      category: { slug: "van-chuyen", name: "Vận chuyển & Tracking" },
      author_name: "Minh",
      expert_answer: "Trung bình 7–12 ngày.",
      expert_answer_updated_at: null,
      verified: true,
      indexable: true,
      same_issue_count: 4,
      published_at: 1_700_000_000,
      ...overrides,
    },
  });

  const renderDetail = async (body: unknown, status = 200) => {
    mockCms([[/community\/questions/, body, status]]);
    render(await CommunityQuestionPage({ params: Promise.resolve({ lang: "vi", slug: "ship-vn-us" }) }));
  };

  it("renders the question, author and expert answer", async () => {
    await renderDetail(detail());
    expect(screen.getByRole("heading", { level: 1, name: /Ship VN → US/ })).toBeTruthy();
    expect(screen.getByText(/Minh/)).toBeTruthy();
    expect(screen.getByText(/Trung bình 7–12 ngày/)).toBeTruthy();
    expect(screen.getByText("Chuyên gia THG trả lời")).toBeTruthy();
  });

  it("shows the awaiting-answer panel instead of an empty answer card", async () => {
    await renderDetail(detail({ expert_answer: null }));
    expect(screen.getByText(/Chuyên gia THG đang xem xét/)).toBeTruthy();
    expect(screen.queryByText("Chuyên gia THG trả lời")).toBeNull();
  });

  it("renders user-generated content as text, never as markup", async () => {
    const hostile = '<script>alert(1)</script><img src=x onerror="alert(2)">';
    await renderDetail(detail({ body: hostile }));

    // The payload is visible as literal text and produced no elements.
    expect(screen.getByText(hostile)).toBeTruthy();
    expect(document.querySelector("script")).toBeNull();
    expect(document.querySelector("img")).toBeNull();
  });

  it("offers Same Issue and Share, and hides Withdraw without an owner token", async () => {
    await renderDetail(detail());
    expect(screen.getByRole("button", { name: /Tôi cũng gặp vấn đề này/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Chia sẻ/ })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Rút câu hỏi/ })).toBeNull();
  });

  it("renders an outage notice rather than a 404 when the CMS is unavailable", async () => {
    await renderDetail({ error: "boom" }, 503);
    expect(screen.getByRole("status").textContent).toMatch(/tạm thời không truy cập được/);
  });

  it("throws the Next not-found signal for an unknown, pending, rejected or withdrawn slug", async () => {
    mockCms([[/community\/questions/, { error: "No published question" }, 404]]);
    await expect(
      CommunityQuestionPage({ params: Promise.resolve({ lang: "vi", slug: "gone" }) }),
    ).rejects.toThrow(/NEXT_HTTP_ERROR_FALLBACK;404|NEXT_NOT_FOUND/);
  });
});

describe("withdraw affordance", () => {
  const copy: MarketingCopy = {
    "community.withdraw": "Rút câu hỏi",
    "reviews.withdraw": "Rút đánh giá",
  };

  it("stays hidden when this browser holds no owner token", () => {
    render(<WithdrawButton slug="ship-vn-us" kind="question" lang="vi" copy={copy} />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("appears only for the browser that submitted the item", () => {
    rememberOwnerToken("ship-vn-us", "f".repeat(64));
    render(<WithdrawButton slug="ship-vn-us" kind="question" lang="vi" copy={copy} />);
    expect(screen.getByRole("button", { name: /Rút câu hỏi/ })).toBeTruthy();
  });

  it("does not unlock a review from a question token of the same slug", () => {
    rememberOwnerToken("dup", "f".repeat(64));
    render(<WithdrawButton slug="dup" kind="review" lang="vi" copy={copy} />);
    expect(screen.queryByRole("button")).toBeNull();

    cleanup();
    rememberOwnerToken(reviewOwnerKey("dup"), "e".repeat(64));
    render(<WithdrawButton slug="dup" kind="review" lang="vi" copy={copy} />);
    expect(screen.getByRole("button", { name: /Rút đánh giá/ })).toBeTruthy();
  });
});
