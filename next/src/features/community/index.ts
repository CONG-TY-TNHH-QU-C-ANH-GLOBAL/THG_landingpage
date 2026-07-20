// Public API of the community feature: landing models and server loaders only.
// Wire schemas and Cms* DTO types deliberately never appear here — they must not cross
// the feature boundary (FND-005, enforced by tests/architecture/community-content-boundaries).

export type { CommunityCategory, CommunityUnavailableReason } from "./models/category";
export type {
  QuestionSummary,
  QuestionDetail,
  QuestionListResult,
  QuestionDetailResult,
} from "./models/question";
export type {
  ReviewSummary,
  ReviewDetail,
  ReviewListResult,
  ReviewDetailResult,
} from "./models/review";

export {
  loadCommunityCategories,
  loadCommunityQuestions,
  loadCommunityQuestion,
  loadCommunityReviews,
  loadCommunityReview,
} from "./server/loaders";
