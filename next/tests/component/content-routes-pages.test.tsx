// @vitest-environment happy-dom
// Renders the real WEB-005 / WEB-006 route components — no test-only replicas — so what these
// assert is what the server actually sends. Everything here is in the SSR output, which is the
// same as saying both families work with JavaScript disabled.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";

const { cmsFetch } = vi.hoisted(() => ({ cmsFetch: vi.fn() }));
vi.mock("@/shared/cms", () => ({ cmsFetch }));
// The real component needs a Next image loader/config a unit render does not have. The stub
// forwards every prop so the loading/alt/src assertions still test what the page sets.
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => <img {...(props as Record<string, string>)} />,
}));
// notFound() stays real so the 404 assertions exercise Next's actual signal.
// connection() IS replaced: it throws outside a request scope, and a spy additionally lets
// these tests assert that the degraded-cache policy was actually applied rather than just
// that the page rendered.
const { connection } = vi.hoisted(() => ({ connection: vi.fn(async () => {}) }));
vi.mock("next/server", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  connection,
}));

/** The Next signal notFound() raises. Asserting on it — rather than on `rejects.toThrow()` —
 *  is what makes these tests prove a 404 instead of proving that SOMETHING threw; a TypeError
 *  from a mapper bug satisfies the bare form. Matches the convention already used by the
 *  community suite (tests/component/community-pages.test.tsx:287). */
const NEXT_NOT_FOUND = /NEXT_HTTP_ERROR_FALLBACK;404|NEXT_NOT_FOUND/;

import BlogPage, { generateMetadata as blogMetadata } from "@/app/[lang]/blog/page";
import BlogArticlePage, {
  generateMetadata as articleMetadata,
} from "@/app/[lang]/blog/[slug]/page";
import CareersPage from "@/app/[lang]/careers/page";
import JobPage, { generateMetadata as jobMetadata } from "@/app/[lang]/careers/[slug]/page";
import { resetLoggedCmsFallbacks } from "@/shared/cms/log-fallback";
import { CmsHttpError, CmsNetworkError } from "@/shared/cms/errors";

const params = (lang: string, slug?: string) => Promise.resolve({ lang, slug: slug ?? "" });
const translations = { locale: "vi", translations: {} };

/** Wire cmsFetch by request path so ordering between page and metadata reads is irrelevant. */
function routeCms(map: Record<string, unknown>) {
  cmsFetch.mockImplementation((path: string) => {
    const hit = Object.entries(map)
      .sort((a, b) => b[0].length - a[0].length) // longest prefix wins
      .find(([prefix]) => path.startsWith(prefix));
    if (!hit) return Promise.reject(new CmsNetworkError(path, "network"));
    const value = hit[1];
    return value instanceof Error ? Promise.reject(value) : Promise.resolve(value);
  });
}

const blogList = {
  locale: "vi",
  posts: [
    {
      slug: "post-a",
      title: "Bài viết A",
      excerpt: "Tóm tắt A",
      thumbnail_url: "https://cms/a.jpg",
      category: "Báo cáo",
      published_date: "2026-05-01",
      updated_at: 1,
    },
    {
      slug: "post-b",
      title: "Bài viết B",
      excerpt: null,
      thumbnail_url: null,
      category: "Hướng dẫn",
      published_date: "2026-04-01",
      updated_at: 1,
    },
  ],
  total: 2,
};
const blogCategories = { locale: "vi", categories: ["Báo cáo", "Hướng dẫn"] };
const blogPost = {
  locale: "vi",
  post: {
    slug: "post-a",
    title: "Bài viết A",
    excerpt: "Tóm tắt A",
    thumbnail_url: "https://cms/a.jpg",
    category: "Báo cáo",
    published_date: "2026-05-01",
    seo_title: null,
    seo_description: null,
    body_md: "## Phần một\n- điểm một\n1. bước một\n> trích dẫn\n**đậm** [link](https://thgfulfill.com/x)",
    updated_at: 1,
    slides: [{ src: "https://cms/s1.jpg", alt_text: "Slide một" }],
  },
};

const jobsList = {
  locale: "vi",
  jobs: [
    {
      slug: "ops-lead",
      position: 1,
      category: "Vận hành",
      hot: true,
      badge: null,
      tagline: "Dẫn dắt đội vận hành",
      title: "Trưởng nhóm vận hành",
      location: "TP.HCM",
      employment_type: "Full-time",
      salary: "15-20",
      salary_unit: "triệu",
      salary_note: null,
      deadline: "2030-01-01",
      experience: "2 năm",
      posted_at: 1_700_000_000,
    },
  ],
  total: 1,
};
// `position` is deliberately absent: the CMS detail projection does not send it
// [FACT: CMS careers.schemas.ts:74-95]. The fixture used to spread it in from the summary,
// which is why the suite stayed green while every real job detail failed shape validation.
const { position: _listOnlyPosition, ...jobDetailBase } = jobsList.jobs[0];
const jobDetail = {
  locale: "vi",
  job: {
    ...jobDetailBase,
    body_md: "## Mô tả\n- việc một",
    lead: "Tóm tắt vai trò",
    responsibilities: { "Hằng ngày": ["Kiểm hàng"] },
    requirements: ["2 năm kinh nghiệm"],
    benefits: [{ i: "heart", t: "Bảo hiểm", d: "Đầy đủ" }],
    bonuses: ["Thưởng quý"],
  },
};

beforeEach(() => {
  cmsFetch.mockReset();
  connection.mockClear();
  resetLoggedCmsFallbacks();
});
afterEach(cleanup);

describe("/[lang]/blog", () => {
  it("server-renders every post grouped by category, newest first", async () => {
    routeCms({
      "/translations": translations,
      "/blog/categories": blogCategories,
      "/blog": blogList,
    });

    render(await BlogPage({ params: params("vi") }));

    expect(screen.getByRole("heading", { level: 2, name: "Báo cáo" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Hướng dẫn" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 3, name: "Bài viết A" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 3, name: "Bài viết B" })).toBeTruthy();
  });

  it("links each card to its locale-prefixed detail route", async () => {
    routeCms({
      "/translations": translations,
      "/blog/categories": blogCategories,
      "/blog": blogList,
    });
    render(await BlogPage({ params: params("vi") }));
    expect(screen.getByRole("link", { name: /Bài viết A/ }).getAttribute("href")).toBe(
      "/vi/blog/post-a",
    );
  });

  it("emits a machine-readable date on every card", async () => {
    routeCms({
      "/translations": translations,
      "/blog/categories": blogCategories,
      "/blog": blogList,
    });
    const { container } = render(await BlogPage({ params: params("vi") }));
    const times = [...container.querySelectorAll("time")].map((t) => t.getAttribute("dateTime"));
    expect(times).toEqual(["2026-05-01", "2026-04-01"]);
  });

  it("omits dateTime when the CMS date is not a real date, keeping the visible text", async () => {
    routeCms({
      "/translations": translations,
      "/blog/categories": blogCategories,
      "/blog": {
        locale: "vi",
        total: 1,
        posts: [
          {
            slug: "soon",
            title: "Sắp ra mắt",
            excerpt: null,
            thumbnail_url: null,
            category: "Báo cáo",
            published_date: "sắp ra mắt",
            updated_at: 1_700_000_000,
          },
        ],
      },
    });
    const { container } = render(await BlogPage({ params: params("vi") }));
    const time = container.querySelector("time");
    // A machine value the CMS never supplied must not be invented for a crawler...
    expect(time?.getAttribute("dateTime")).toBeNull();
    // ...but the operator's own text still shows, so the CMS does not look broken.
    expect(time?.textContent).toBe("sắp ra mắt");
  });

  it("gives every category section an anchor its nav link actually resolves to", async () => {
    routeCms({
      "/translations": translations,
      "/blog/categories": blogCategories,
      "/blog": blogList,
    });
    const { container } = render(await BlogPage({ params: params("vi") }));

    const hrefs = [...container.querySelectorAll("nav a")].map((a) => a.getAttribute("href"));
    const ids = [...container.querySelectorAll("section[id]")].map((s) => s.getAttribute("id"));

    // ASCII-folded, so a browser decoding the fragment finds the element. The previous
    // encodeURIComponent pair produced href="#B%C3%A1o%20c%C3%A1o" against id="B%C3%A1o%20c%C3%A1o",
    // and the browser looked for the DECODED "Báo cáo" — every jump link was dead.
    expect(ids).toContain("bao-cao");
    expect(hrefs).toEqual(ids.map((id) => `#${id}`));
    for (const href of hrefs) {
      expect(container.querySelector(`section[id="${href?.slice(1)}"]`), href ?? "").toBeTruthy();
    }
  });

  it("keeps the list usable when only the category read fails", async () => {
    routeCms({
      "/translations": translations,
      "/blog/categories": new CmsNetworkError("/blog/categories", "network"),
      "/blog": blogList,
    });

    render(await BlogPage({ params: params("vi") }));

    // Categories are a filter affordance, not content — the posts still render.
    expect(screen.getByRole("heading", { level: 3, name: "Bài viết A" })).toBeTruthy();
  });

  it("distinguishes an outage from a confirmed-empty list", async () => {
    routeCms({ "/translations": translations });
    render(await BlogPage({ params: params("vi") }));
    expect(screen.getByText(/Hiện chưa tải được bài viết/)).toBeTruthy();
    expect(screen.queryByText(/Chưa có bài viết nào/)).toBeNull();

    cleanup();
    cmsFetch.mockReset();
    resetLoggedCmsFallbacks();
    routeCms({
      "/translations": translations,
      "/blog/categories": { locale: "vi", categories: [] },
      "/blog": { locale: "vi", posts: [], total: 0 },
    });
    render(await BlogPage({ params: params("vi") }));
    expect(screen.getByText(/Chưa có bài viết nào/)).toBeTruthy();
  });

  it("is noindex when no posts rendered", async () => {
    routeCms({ "/translations": translations });
    expect((await blogMetadata({ params: params("en") })).robots).toMatchObject({ index: false });
  });

  it("applies the degraded-cache policy on outage and on nothing else", async () => {
    // The blog list was the one route of the four that imported the shared policy without
    // calling it, so a CMS outage was committed to the 300s window along with the noindex.
    // ready → normal ISR.
    routeCms({
      "/translations": translations,
      "/blog/categories": blogCategories,
      "/blog": blogList,
    });
    render(await BlogPage({ params: params("vi") }));
    expect(connection).not.toHaveBeenCalled();

    // empty → a confirmed CMS answer, still normally cacheable.
    cleanup();
    cmsFetch.mockReset();
    resetLoggedCmsFallbacks();
    connection.mockClear();
    routeCms({
      "/translations": translations,
      "/blog/categories": { locale: "vi", categories: [] },
      "/blog": { locale: "vi", posts: [], total: 0 },
    });
    render(await BlogPage({ params: params("vi") }));
    expect(connection).not.toHaveBeenCalled();

    // unavailable → transient, must not persist under the success window.
    cleanup();
    cmsFetch.mockReset();
    resetLoggedCmsFallbacks();
    connection.mockClear();
    routeCms({ "/translations": translations });
    render(await BlogPage({ params: params("vi") }));
    expect(connection).toHaveBeenCalled();
    // ...and the metadata paired with that render stays noindex. One route render covers both,
    // so generateMetadata needs no separate opt-out.
    expect((await blogMetadata({ params: params("vi") })).robots).toMatchObject({ index: false });
  });

  it("serves fresh content once the CMS recovers", async () => {
    // What the unit harness can prove about recovery: the loader is not pinned to the failed
    // result, so the next render returns real posts. Not persisting the degraded render is what
    // lets that next render happen before the 300s window would have elapsed; the route-level
    // half of that is proven by the build (a degraded list leaves the prerender set).
    routeCms({ "/translations": translations });
    render(await BlogPage({ params: params("vi") }));
    expect(screen.getByText(/Hiện chưa tải được bài viết/)).toBeTruthy();

    cleanup();
    cmsFetch.mockReset();
    resetLoggedCmsFallbacks();
    connection.mockClear();
    routeCms({
      "/translations": translations,
      "/blog/categories": blogCategories,
      "/blog": blogList,
    });
    render(await BlogPage({ params: params("vi") }));
    expect(screen.getByRole("heading", { level: 3, name: "Bài viết A" })).toBeTruthy();
    expect(connection).not.toHaveBeenCalled();
    // The noindex the outage produced does not survive with it.
    expect((await blogMetadata({ params: params("vi") })).robots).toMatchObject({ index: true });
  });
});

describe("/[lang]/blog/[slug]", () => {
  const wired = {
    "/translations": translations,
    "/blog/categories": blogCategories,
    "/blog/post-a": blogPost,
    "/blog": blogList,
  };

  it("renders the markdown body as elements — headings, both list kinds, quote, bold, link", async () => {
    routeCms(wired);
    const { container } = render(await BlogArticlePage({ params: params("vi", "post-a") }));

    expect(screen.getByRole("heading", { level: 2, name: "Phần một" })).toBeTruthy();
    expect(container.querySelector("ul li")?.textContent).toContain("điểm một");
    expect(container.querySelector("ol li")?.textContent).toContain("bước một");
    expect(container.querySelector("blockquote")?.textContent).toContain("trích dẫn");
    expect(screen.getByText("đậm").tagName).toBe("STRONG");
    const link = screen.getByRole("link", { name: "link" });
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("never emits raw HTML from editor content", async () => {
    routeCms({
      ...wired,
      "/blog/post-a": {
        ...blogPost,
        post: { ...blogPost.post, body_md: '<script>alert(1)</script><img src=x onerror=alert(1)>' },
      },
    });
    const { container } = render(await BlogArticlePage({ params: params("vi", "post-a") }));

    expect(container.querySelector('script:not([type="application/ld+json"])')).toBeNull();
    expect(container.querySelector("img[onerror]")).toBeNull();
    expect(screen.getByText(/<script>alert\(1\)<\/script>/)).toBeTruthy();
  });

  it("turns a real CMS 404 into a real HTTP 404", async () => {
    routeCms({
      "/translations": translations,
      "/blog/missing": new CmsHttpError("/blog/missing", 404, "not found"),
    });
    await expect(BlogArticlePage({ params: params("vi", "missing") })).rejects.toThrow(
      NEXT_NOT_FOUND,
    );
    // A 404 is a cacheable answer from a healthy CMS, so it must NOT opt out of the cache.
    expect(connection).not.toHaveBeenCalled();
  });

  it("does NOT 404 on an outage — a transient failure must not drop a live URL", async () => {
    routeCms({
      "/translations": translations,
      "/blog/post-a": new CmsHttpError("/blog/post-a", 503, "down"),
    });

    render(await BlogArticlePage({ params: params("vi", "post-a") }));

    expect(screen.getByText(/Hiện chưa tải được bài viết/)).toBeTruthy();
    // And the apology must not be committed to the 3600s success cache together with the
    // noindex generateMetadata pairs with it — a blip would otherwise hide a live article for
    // an hour, with nothing to invalidate the entry.
    expect(connection).toHaveBeenCalled();
  });

  it("emits Article JSON-LD with a valid datePublished and the featured image", async () => {
    routeCms(wired);
    const { container } = render(await BlogArticlePage({ params: params("vi", "post-a") }));
    const scripts = [...container.querySelectorAll('script[type="application/ld+json"]')].map(
      (s) => JSON.parse(s.textContent ?? "{}"),
    );
    const article = scripts.find((d) => d["@type"] === "Article");
    expect(article).toMatchObject({
      headline: "Bài viết A",
      datePublished: "2026-05-01",
      image: "https://cms/s1.jpg",
      mainEntityOfPage: "https://thgfulfill.com/vi/blog/post-a",
    });
    const crumb = scripts.find((d) => d["@type"] === "BreadcrumbList");
    expect(crumb.itemListElement).toHaveLength(3);
  });

  it("marks the article as og:type article with a published time", async () => {
    routeCms(wired);
    const meta = await articleMetadata({ params: params("vi", "post-a") });
    expect(meta.openGraph).toMatchObject({ type: "article", publishedTime: "2026-05-01" });
  });

  it("lets the operator's CMS SEO fields override the derived metadata", async () => {
    // The CMS validates seo_title / seo_description, but the mapper dropped them, so an
    // operator override could never reach generateMetadata — a silent migration-parity gap.
    routeCms({
      ...wired,
      "/blog/post-a": {
        ...blogPost,
        post: { ...blogPost.post, seo_title: "Tiêu đề SEO", seo_description: "Mô tả SEO" },
      },
    });
    const meta = await articleMetadata({ params: params("vi", "post-a") });
    expect(meta.title).toBe("Tiêu đề SEO");
    expect(meta.description).toBe("Mô tả SEO");
  });

  it("falls back to the derived metadata when the override is blank, not to an empty title", async () => {
    routeCms({
      ...wired,
      "/blog/post-a": {
        ...blogPost,
        post: { ...blogPost.post, seo_title: "   ", seo_description: "" },
      },
    });
    const meta = await articleMetadata({ params: params("vi", "post-a") });
    expect(meta.title).toBe("Bài viết A — THG Fulfill");
    expect(meta.description).toBe("Tóm tắt A");
  });
});

describe("/[lang]/careers", () => {
  it("server-renders every open job under its category", async () => {
    routeCms({ "/translations": translations, "/jobs": jobsList });
    render(await CareersPage({ params: params("vi") }));

    expect(screen.getByRole("heading", { level: 2, name: "Vận hành" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Trưởng nhóm vận hành" }).getAttribute("href")).toBe(
      "/vi/careers/ops-lead",
    );
    expect(screen.getByText("15-20 triệu")).toBeTruthy();
  });

  it("renders the uncategorized group LAST even when it comes first from the CMS", async () => {
    // Map insertion order used to decide this, so a leading uncategorized job put the fallback
    // group at the top — contradicting what the code claimed. Ordering it explicitly also stops
    // a real CMS category named like the translated label from merging into the fallback.
    routeCms({
      "/translations": translations,
      "/jobs": {
        locale: "vi",
        total: 3,
        jobs: [
          { ...jobsList.jobs[0], slug: "loose-1", category: null, title: "Không phân loại 1" },
          { ...jobsList.jobs[0], slug: "ops-1", category: "Vận hành", title: "Vận hành 1" },
          { ...jobsList.jobs[0], slug: "loose-2", category: null, title: "Không phân loại 2" },
        ],
      },
    });
    const { container } = render(await CareersPage({ params: params("vi") }));

    const headings = [...container.querySelectorAll("h2")].map((h) => h.textContent);
    expect(headings).toEqual(["Vận hành", "Tất cả vị trí"]);
    // Both uncategorized jobs land in that one trailing group, in CMS order.
    const last = container.querySelectorAll("section")[headings.length - 1];
    expect([...last.querySelectorAll("h3")].map((h) => h.textContent)).toEqual([
      "Không phân loại 1",
      "Không phân loại 2",
    ]);
  });

  it("distinguishes an outage from no open positions", async () => {
    routeCms({ "/translations": translations });
    render(await CareersPage({ params: params("vi") }));
    expect(screen.getByText(/Hiện chưa tải được vị trí/)).toBeTruthy();
    expect(connection).toHaveBeenCalled();

    cleanup();
    cmsFetch.mockReset();
    resetLoggedCmsFallbacks();
    connection.mockClear();
    routeCms({ "/translations": translations, "/jobs": { locale: "vi", jobs: [], total: 0 } });
    render(await CareersPage({ params: params("vi") }));
    expect(screen.getByText(/Hiện chưa có vị trí tuyển dụng nào/)).toBeTruthy();
    // A CONFIRMED empty list is a healthy answer and keeps the normal 300s window; only the
    // outage above opts out. This is the pair that makes the policy meaningful.
    expect(connection).not.toHaveBeenCalled();
  });
});

describe("/[lang]/careers/[slug]", () => {
  it("renders the full job with responsibilities, requirements, benefits and bonuses", async () => {
    routeCms({ "/translations": translations, "/jobs/ops-lead": jobDetail, "/jobs": jobsList });
    render(await JobPage({ params: params("vi", "ops-lead") }));

    expect(screen.getByRole("heading", { level: 1, name: "Trưởng nhóm vận hành" })).toBeTruthy();
    expect(screen.getByText("Kiểm hàng")).toBeTruthy();
    expect(screen.getByText("2 năm kinh nghiệm")).toBeTruthy();
    expect(screen.getByText("Bảo hiểm")).toBeTruthy();
    expect(screen.getByText("Thưởng quý")).toBeTruthy();
  });

  it("emits JobPosting JSON-LD without a fabricated salary or location", async () => {
    routeCms({ "/translations": translations, "/jobs/ops-lead": jobDetail, "/jobs": jobsList });
    const { container } = render(await JobPage({ params: params("vi", "ops-lead") }));
    const posting = [...container.querySelectorAll('script[type="application/ld+json"]')]
      .map((s) => JSON.parse(s.textContent ?? "{}"))
      .find((d) => d["@type"] === "JobPosting");

    expect(posting).toMatchObject({
      title: "Trưởng nhóm vận hành",
      datePosted: "2023-11-14",
      validThrough: "2030-01-01",
    });
    // The CMS stores compensation as free text; a structured MonetaryAmount would require
    // inventing a currency and a unit.
    expect(posting).not.toHaveProperty("baseSalary");
    expect(posting.jobLocation.address.addressLocality).toBe("TP.HCM");
  });

  it("omits JobPosting and goes noindex once the deadline has passed", async () => {
    const expired = {
      ...jobDetail,
      job: { ...jobDetail.job, deadline: "2020-01-01" },
    };
    routeCms({ "/translations": translations, "/jobs/ops-lead": expired, "/jobs": jobsList });

    const { container } = render(await JobPage({ params: params("vi", "ops-lead") }));
    const types = [...container.querySelectorAll('script[type="application/ld+json"]')].map(
      (s) => JSON.parse(s.textContent ?? "{}")["@type"],
    );
    // Emitting JobPosting for an expired role is the structured-data violation that costs a
    // whole domain its rich results.
    expect(types).not.toContain("JobPosting");
    expect(screen.getByText(/đã hết hạn nộp hồ sơ/)).toBeTruthy();

    expect((await jobMetadata({ params: params("vi", "ops-lead") })).robots).toMatchObject({
      index: false,
    });
  });

  it("turns a closed or unknown job into a real 404", async () => {
    routeCms({
      "/translations": translations,
      "/jobs/gone": new CmsHttpError("/jobs/gone", 404, "closed"),
    });
    await expect(JobPage({ params: params("vi", "gone") })).rejects.toThrow(NEXT_NOT_FOUND);
    expect(connection).not.toHaveBeenCalled();
  });

  it("a non-notFound throw does NOT satisfy the 404 assertion", async () => {
    // The control for the two tests above. They used to assert a bare `rejects.toThrow()`,
    // which any TypeError from a mapper bug would have passed — so they proved nothing about
    // notFound(). This pins that the matcher actually discriminates.
    const boom = Promise.reject(new TypeError("mapper blew up"));
    await expect(boom).rejects.toThrow();
    await expect(
      expect(Promise.reject(new TypeError("mapper blew up"))).rejects.toThrow(NEXT_NOT_FOUND),
    ).rejects.toThrow();
  });

  it("does NOT 404 on an outage", async () => {
    routeCms({
      "/translations": translations,
      "/jobs/ops-lead": new CmsHttpError("/jobs/ops-lead", 502, "bad"),
    });
    render(await JobPage({ params: params("vi", "ops-lead") }));
    expect(screen.getByText(/Hiện chưa tải được vị trí/)).toBeTruthy();
    expect(connection).toHaveBeenCalled();
  });
});
