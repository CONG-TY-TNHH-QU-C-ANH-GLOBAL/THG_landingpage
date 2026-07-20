// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import {
  CommunityApiError,
  reactSameIssue,
  submitQuestion,
  withdrawQuestion,
  withdrawReview,
} from "../../src/features/community/client/community-api";
import { communityErrorMessage } from "../../src/features/community/client/api-error-copy";
import {
  forgetOwnerToken,
  getOwnerToken,
  hasReacted,
  rememberOwnerToken,
  rememberReacted,
  reviewOwnerKey,
} from "../../src/features/community/client/owner-store";

// The write contracts and the owner-token handling rules (COM-001 §14, R-010).

const OWNER_TOKEN = "f".repeat(64);

function mockFetch(status = 200, body: unknown = { ok: true }) {
  // The parameters are declared so the mock's recorded call tuple keeps its real shape.
  const fn = vi.fn(
    async (_input: string | URL | Request, _init?: RequestInit) =>
      ({
        ok: status < 400,
        status,
        statusText: "OK",
        json: async () => body,
      }) as unknown as Response,
  );
  vi.stubGlobal("fetch", fn);
  return fn;
}

beforeEach(() => {
  globalThis.localStorage?.clear();
  vi.unstubAllGlobals();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("owner token handling", () => {
  it("sends the token in the POST body and never in the URL", async () => {
    const fetchMock = mockFetch();
    await withdrawQuestion("ship-vn-us", OWNER_TOKEN);

    const [rawUrl, rawInit] = fetchMock.mock.calls[0];
    const url = String(rawUrl);
    const init = rawInit as RequestInit;
    expect(url).toBe("http://localhost:8080/api/v1/community/questions/ship-vn-us/withdraw");
    expect(url).not.toContain(OWNER_TOKEN);
    // The CMS returns `owner_token` but consumes `ownerToken` — the case flip is real.
    expect(JSON.parse(String(init.body))).toEqual({ ownerToken: OWNER_TOKEN });
    expect(init.method).toBe("POST");
  });

  it("uses the same body-only transport for review withdraw", async () => {
    const fetchMock = mockFetch();
    await withdrawReview("pod-ok", OWNER_TOKEN);
    const [rawUrl, rawInit] = fetchMock.mock.calls[0];
    const url = String(rawUrl);
    const init = rawInit as RequestInit;
    expect(url).not.toContain(OWNER_TOKEN);
    expect(JSON.parse(String(init.body))).toEqual({ ownerToken: OWNER_TOKEN });
  });

  it("keeps a thrown error free of the token, the body and the payload", async () => {
    mockFetch(404, { error: "Không thể rút câu hỏi này." });
    const err = await withdrawQuestion("x", OWNER_TOKEN).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(CommunityApiError);
    const serialized = `${String(err)}${(err as Error).stack ?? ""}`;
    expect(serialized).not.toContain(OWNER_TOKEN);
    expect(serialized).not.toContain("Không thể rút");
  });

  it("namespaces review tokens so a shared slug cannot overwrite a question's token", () => {
    rememberOwnerToken("dup", "question-token");
    rememberOwnerToken(reviewOwnerKey("dup"), "review-token");
    expect(getOwnerToken("dup")).toBe("question-token");
    expect(getOwnerToken(reviewOwnerKey("dup"))).toBe("review-token");
  });

  it("returns null for an unknown key and forgets a token on demand", () => {
    expect(getOwnerToken("missing")).toBeNull();
    rememberOwnerToken("a", OWNER_TOKEN);
    forgetOwnerToken("a");
    expect(getOwnerToken("a")).toBeNull();
  });

  it("survives corrupt or hostile stored values instead of throwing", () => {
    globalThis.localStorage.setItem("thg_community_owner_v1", "not json");
    expect(getOwnerToken("a")).toBeNull();
    globalThis.localStorage.setItem("thg_community_owner_v1", '["array","not","object"]');
    expect(getOwnerToken("a")).toBeNull();
    globalThis.localStorage.setItem("thg_community_same_issue_v1", '{"not":"array"}');
    expect(hasReacted("a")).toBe(false);
  });

  it("records a reaction once and is idempotent", () => {
    expect(hasReacted("q")).toBe(false);
    rememberReacted("q");
    rememberReacted("q");
    expect(hasReacted("q")).toBe(true);
    expect(JSON.parse(String(globalThis.localStorage.getItem("thg_community_same_issue_v1")))).toEqual(["q"]);
  });
});

describe("community write contracts", () => {
  it("stores the owner token only when the CMS actually returned one", async () => {
    mockFetch(201, { ok: true, id: 1, slug: "s", status: "pending" });
    await expect(
      submitQuestion({
        title: "A title long enough",
        body: "A body long enough to pass validation",
        author_name: "N",
        author_email: "n@example.com",
        locale: "vi",
        turnstile_token: "DEV_BYPASS",
      }),
    ).resolves.toEqual({ slug: "s", ownerToken: null });
  });

  it("returns the slug and token when the CMS provides both", async () => {
    mockFetch(201, { ok: true, id: 1, slug: "s", status: "pending", owner_token: OWNER_TOKEN });
    await expect(
      submitQuestion({
        title: "A title long enough",
        body: "A body long enough to pass validation",
        author_name: "N",
        author_email: "n@example.com",
        locale: "vi",
        turnstile_token: "DEV_BYPASS",
      }),
    ).resolves.toEqual({ slug: "s", ownerToken: OWNER_TOKEN });
  });

  it("sends same-issue with no body and no Content-Type, matching the CMS handler", async () => {
    const fetchMock = mockFetch(200, { ok: true, same_issue_count: 5, deduped: false });
    await expect(reactSameIssue("q")).resolves.toEqual({ count: 5, deduped: false });
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(init.body).toBeUndefined();
    expect(init.headers).not.toHaveProperty("Content-Type");
  });

  it("treats a duplicate same-issue as a success, not an error", async () => {
    mockFetch(200, { ok: true, same_issue_count: 5, deduped: true });
    await expect(reactSameIssue("q")).resolves.toEqual({ count: 5, deduped: true });
  });
});

describe("error copy mapping", () => {
  const t = (key: string) => key;

  it("maps rate limiting and Turnstile failure to their own messages", () => {
    expect(communityErrorMessage(new CommunityApiError(429), t)).toBe("community.err_rate_limited");
    // Turnstile failure is 403, not 400 or 422.
    expect(communityErrorMessage(new CommunityApiError(403), t)).toBe("community.err_captcha_failed");
  });

  it("falls back to the generic message for validation, not-found and unknown failures", () => {
    expect(communityErrorMessage(new CommunityApiError(400), t)).toBe("community.form_err_generic");
    expect(communityErrorMessage(new CommunityApiError(404), t)).toBe("community.form_err_generic");
    expect(communityErrorMessage(new TypeError("network"), t)).toBe("community.form_err_generic");
  });
});
