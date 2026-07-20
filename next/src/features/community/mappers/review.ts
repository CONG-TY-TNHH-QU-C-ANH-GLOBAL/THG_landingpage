import type { CmsReviewsResponse, CmsReviewDetailResponse } from "../schemas/reviews";
import type { ReviewSummary, ReviewDetail } from "../models/review";

const toMillis = (seconds: number | null): number | null => (seconds === null ? null : seconds * 1000);

export function reviewSummariesFromDto(dto: CmsReviewsResponse): ReviewSummary[] {
  return dto.reviews.map((r) => ({
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    category: r.category,
    rating: r.rating,
    verified: r.verified,
    indexable: r.indexable,
    publishedAt: toMillis(r.published_at),
  }));
}

export function reviewDetailFromDto(dto: CmsReviewDetailResponse): ReviewDetail {
  const r = dto.review;
  return {
    slug: r.slug,
    title: r.title,
    body: r.body,
    category: r.category,
    reviewerName: r.reviewer_name,
    rating: r.rating,
    publicSummary: r.public_summary?.trim() ? r.public_summary : null,
    verified: r.verified,
    indexable: r.indexable,
    publishedAt: toMillis(r.published_at),
  };
}
