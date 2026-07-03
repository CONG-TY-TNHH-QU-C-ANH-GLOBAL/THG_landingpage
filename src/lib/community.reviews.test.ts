import { describe, it, expect, beforeEach } from "vitest";

import {
  cmsCommunityReviewInputSchema,
  communityReviewResponseSchema,
  communityReviewsResponseSchema,
} from "@/lib/cmsSchemas";
import {
  forgetOwnerToken,
  getOwnerToken,
  rememberOwnerToken,
  reviewOwnerKey,
} from "@/lib/communityOwner";

describe("community review schemas", () => {
  it("parses a valid reviews list (public fields only)", () => {
    const parsed = communityReviewsResponseSchema.safeParse({
      reviews: [
        {
          slug: "reliable-pod",
          title: "Reliable POD fulfillment",
          excerpt: "Solid for US orders…",
          category: { slug: "pod", name: "Print on Demand" },
          rating: 5,
          verified: true,
          indexable: true,
          published_at: 1710000000,
        },
      ],
    });
    expect(parsed.success).toBe(true);
  });

  it("accepts a null rating and null category", () => {
    const parsed = communityReviewResponseSchema.safeParse({
      review: {
        slug: "s",
        title: "t",
        body: "b",
        category: null,
        reviewer_name: "Seller",
        rating: null,
        public_summary: null,
        verified: false,
        indexable: false,
        published_at: null,
      },
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects a summary missing the verified flag", () => {
    const parsed = communityReviewsResponseSchema.safeParse({
      reviews: [{ slug: "s", title: "t", excerpt: "e", category: null, rating: null, indexable: true, published_at: null }],
    });
    expect(parsed.success).toBe(false);
  });

  it("enforces rating 1–5 and length bounds on the submit input", () => {
    const base = {
      title: "A good enough title",
      body: "A body that is at least twenty characters long.",
      reviewer_name: "Seller",
      reviewer_email: "seller@example.com",
      locale: "vi" as const,
      turnstile_token: "tok",
    };
    expect(cmsCommunityReviewInputSchema.safeParse({ ...base, rating: 5 }).success).toBe(true);
    expect(cmsCommunityReviewInputSchema.safeParse({ ...base, rating: 6 }).success).toBe(false);
    expect(cmsCommunityReviewInputSchema.safeParse({ ...base, title: "short" }).success).toBe(false);
  });
});

describe("reviewOwnerKey namespacing", () => {
  beforeEach(() => localStorage.clear());

  it("keeps a review token separate from a question with the same slug", () => {
    rememberOwnerToken("my-slug", "question-token");
    rememberOwnerToken(reviewOwnerKey("my-slug"), "review-token");

    expect(getOwnerToken("my-slug")).toBe("question-token");
    expect(getOwnerToken(reviewOwnerKey("my-slug"))).toBe("review-token");

    forgetOwnerToken(reviewOwnerKey("my-slug"));
    expect(getOwnerToken(reviewOwnerKey("my-slug"))).toBeNull();
    // Withdrawing the review must not touch the question's token.
    expect(getOwnerToken("my-slug")).toBe("question-token");
  });
});
