import { describe, it, expect } from "vitest";

import {
  blogArticleFromDto,
  blogCategoriesFromDto,
  blogSummariesFromDto,
  DEFAULT_CATEGORY,
} from "../../src/features/blog/mappers/blog";
import {
  blogCategoriesResponseSchema,
  blogListResponseSchema,
  blogPostResponseSchema,
} from "../../src/features/blog/schemas/blog";
import { isArticleContentEmpty } from "../../src/features/blog/models/blog";
import { jobDetailFromDto, jobSummariesFromDto } from "../../src/features/careers/mappers/job";
import { jobResponseSchema, jobsResponseSchema } from "../../src/features/careers/schemas/jobs";
import { isExpired } from "../../src/features/careers/models/job";

// WEB-005 / WEB-006 pure layer: schema → mapper → model. No network, no React.
// Fixtures mirror the frozen CMS contract.

const post = (over: Record<string, unknown> = {}) => ({
  slug: "s",
  title: "T",
  excerpt: null,
  thumbnail_url: null,
  category: null,
  published_date: null,
  updated_at: 1_700_000_000,
  ...over,
});

describe("blog mappers", () => {
  it("substitutes the default category and empties a null excerpt", () => {
    const dto = blogListResponseSchema.parse({ locale: "vi", posts: [post()], total: 1 });
    const [summary] = blogSummariesFromDto(dto);
    expect(summary.category).toBe(DEFAULT_CATEGORY);
    // "" not null — the card renders nothing rather than the string "null".
    expect(summary.excerpt).toBe("");
  });

  it("prefers published_date, falling back to updated_at as an ISO date", () => {
    const withDate = blogListResponseSchema.parse({
      locale: "vi",
      posts: [post({ published_date: "2026-03-04" })],
      total: 1,
    });
    expect(blogSummariesFromDto(withDate)[0].displayDate).toBe("2026-03-04");

    const withoutDate = blogListResponseSchema.parse({
      locale: "vi",
      posts: [post({ updated_at: 1_700_000_000 })],
      total: 1,
    });
    expect(blogSummariesFromDto(withoutDate)[0].displayDate).toBe("2023-11-14");
  });

  it("sorts newest first regardless of CMS order", () => {
    const dto = blogListResponseSchema.parse({
      locale: "vi",
      posts: [
        post({ slug: "old", published_date: "2024-01-01" }),
        post({ slug: "new", published_date: "2026-01-01" }),
        post({ slug: "mid", published_date: "2025-01-01" }),
      ],
      total: 3,
    });
    expect(blogSummariesFromDto(dto).map((p) => p.slug)).toEqual(["new", "mid", "old"]);
  });

  it("de-duplicates and drops blank categories while preserving CMS order", () => {
    const dto = blogCategoriesResponseSchema.parse({
      locale: "vi",
      categories: ["Zeta", "  ", "Alpha", "Zeta", ""],
    });
    expect(blogCategoriesFromDto(dto)).toEqual(["Zeta", "Alpha"]);
  });

  it("derives the featured image from the first slide, else the thumbnail", () => {
    const withSlides = blogPostResponseSchema.parse({
      locale: "vi",
      post: {
        ...post({ thumbnail_url: "https://cms/thumb.jpg" }),
        seo_title: null,
        seo_description: null,
        body_md: "body",
        slides: [{ src: "https://cms/s1.jpg", alt_text: "First" }],
      },
    });
    const article = blogArticleFromDto(withSlides);
    expect(article.featuredSrc).toBe("https://cms/s1.jpg");
    expect(article.featuredAlt).toBe("First");

    const noSlides = blogPostResponseSchema.parse({
      locale: "vi",
      post: {
        ...post({ thumbnail_url: "https://cms/thumb.jpg", title: "Fallback title" }),
        seo_title: null,
        seo_description: null,
        body_md: "body",
        slides: [],
      },
    });
    const fallback = blogArticleFromDto(noSlides);
    expect(fallback.featuredSrc).toBe("https://cms/thumb.jpg");
    // `|| title`, not `?? title` — an empty alt is as useless as a missing one for og:image.
    expect(fallback.featuredAlt).toBe("Fallback title");
  });

  it("recognizes an article published with no body and no slides", () => {
    const dto = blogPostResponseSchema.parse({
      locale: "en",
      post: { ...post(), seo_title: null, seo_description: null, body_md: "  ", slides: [] },
    });
    expect(isArticleContentEmpty(blogArticleFromDto(dto))).toBe(true);
  });

  it("refuses a null alt_text — the heightened-watch field must stay non-null", () => {
    expect(() =>
      blogPostResponseSchema.parse({
        locale: "vi",
        post: {
          ...post(),
          seo_title: null,
          seo_description: null,
          body_md: null,
          slides: [{ src: "https://cms/s1.jpg", alt_text: null }],
        },
      }),
    ).toThrow();
  });
});

const job = (over: Record<string, unknown> = {}) => ({
  slug: "ops-lead",
  position: 1,
  category: "Operations",
  hot: false,
  badge: null,
  tagline: null,
  title: "Ops Lead",
  location: null,
  employment_type: null,
  salary: null,
  salary_unit: null,
  salary_note: null,
  deadline: null,
  experience: null,
  posted_at: 1_700_000_000,
  ...over,
});

describe("careers mappers", () => {
  it("orders by CMS position and drops the wire field", () => {
    const dto = jobsResponseSchema.parse({
      locale: "vi",
      jobs: [job({ slug: "b", position: 2 }), job({ slug: "a", position: 1 })],
      total: 2,
    });
    const summaries = jobSummariesFromDto(dto);
    expect(summaries.map((j) => j.slug)).toEqual(["a", "b"]);
    expect(summaries[0]).not.toHaveProperty("position");
  });

  it("joins the CMS salary columns without inventing a currency or a number", () => {
    const dto = jobsResponseSchema.parse({
      locale: "vi",
      jobs: [job({ salary: "15-20", salary_unit: "triệu", salary_note: "thoả thuận" })],
      total: 1,
    });
    expect(jobSummariesFromDto(dto)[0].salaryText).toBe("15-20 triệu · thoả thuận");
  });

  it("returns null salary when the operator filled in nothing", () => {
    const dto = jobsResponseSchema.parse({ locale: "vi", jobs: [job()], total: 1 });
    expect(jobSummariesFromDto(dto)[0].salaryText).toBeNull();
  });

  it("flattens responsibilities into an ordered list and drops empty groups", () => {
    const dto = jobResponseSchema.parse({
      locale: "vi",
      job: {
        ...job(),
        body_md: "## Role",
        lead: null,
        responsibilities: { "Daily ops": ["Pick", "  "], Empty: ["   "] },
        requirements: ["3y experience", ""],
        benefits: [{ i: "heart", t: "Insurance", d: "Full cover" }],
        bonuses: ["Quarterly", " "],
      },
    });
    const detail = jobDetailFromDto(dto);
    expect(detail.responsibilities).toEqual([{ heading: "Daily ops", items: ["Pick"] }]);
    expect(detail.requirements).toEqual(["3y experience"]);
    expect(detail.bonuses).toEqual(["Quarterly"]);
    expect(detail.benefits[0]).toEqual({
      icon: "heart",
      title: "Insurance",
      description: "Full cover",
    });
  });

  it("treats an unparseable or absent deadline as NOT expired", () => {
    const now = new Date("2026-07-31T00:00:00Z");
    // Hiding a live vacancy because an operator typed free text would be the worse failure.
    expect(isExpired(null, now)).toBe(false);
    expect(isExpired("liên hệ để biết thêm", now)).toBe(false);
    expect(isExpired("2026-12-31", now)).toBe(false);
    expect(isExpired("2026-01-01", now)).toBe(true);
  });

  it("rejects a payload missing a documented field", () => {
    expect(() =>
      jobsResponseSchema.parse({ locale: "vi", jobs: [{ slug: "a", title: "A" }], total: 1 }),
    ).toThrow();
  });
});
