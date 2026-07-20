// Landing-domain verified-review models. Plain data, zero imports (FND-005).
// Private submit fields (reviewer email, order reference, evidence note) never reach
// these shapes — the CMS mapper strips them and the schemas do not declare them.

export interface ReviewSummary {
  slug: string;
  title: string;
  excerpt: string;
  category: { slug: string; name: string } | null;
  /** null hides the star row entirely (0 would otherwise render five empty stars). */
  rating: number | null;
  verified: boolean;
  indexable: boolean;
  publishedAt: number | null;
}

export interface ReviewDetail {
  slug: string;
  title: string;
  /** User-submitted text. Rendered as plain text, never as HTML. */
  body: string;
  category: { slug: string; name: string } | null;
  reviewerName: string;
  rating: number | null;
  /** Operator-authored, not UGC. null hides the summary card. */
  publicSummary: string | null;
  verified: boolean;
  indexable: boolean;
  publishedAt: number | null;
}

export type ReviewListResult =
  | { status: "ready"; reviews: readonly ReviewSummary[] }
  | { status: "empty"; reviews: readonly ReviewSummary[] }
  | {
      status: "unavailable";
      reviews: readonly ReviewSummary[];
      reason: "http" | "contract" | "network";
    };

export type ReviewDetailResult =
  | { status: "ready"; review: ReviewDetail }
  | { status: "not-found" }
  | { status: "unavailable"; reason: "http" | "contract" | "network" };
