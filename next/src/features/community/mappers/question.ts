import type { CmsQuestionsResponse, CmsQuestionDetailResponse } from "../schemas/questions";
import type { QuestionSummary, QuestionDetail } from "../models/question";

// Pure DTO→model bridges. Explicit field-by-field construction (never a spread) so a new
// CMS field can never reach the UI without a deliberate edit here — the same allow-list
// discipline the CMS privacy mapper uses on the other side of the wire.

/** CMS timestamps are unix SECONDS; the landing works in milliseconds. */
const toMillis = (seconds: number | null): number | null => (seconds === null ? null : seconds * 1000);

export function questionSummariesFromDto(dto: CmsQuestionsResponse): QuestionSummary[] {
  return dto.questions.map((q) => ({
    slug: q.slug,
    title: q.title,
    excerpt: q.excerpt,
    category: q.category,
    hasExpertAnswer: q.has_expert_answer,
    verified: q.verified,
    indexable: q.indexable,
    sameIssueCount: q.same_issue_count,
    publishedAt: toMillis(q.published_at),
  }));
}

export function questionDetailFromDto(dto: CmsQuestionDetailResponse): QuestionDetail {
  const q = dto.question;
  return {
    slug: q.slug,
    title: q.title,
    body: q.body,
    category: q.category,
    authorName: q.author_name,
    // "" and whitespace-only are treated as absent so the answer card matches the CMS's
    // own has_expert_answer rule (Boolean(expert_answer?.trim())) on the list side.
    expertAnswer: q.expert_answer?.trim() ? q.expert_answer : null,
    expertAnswerUpdatedAt: toMillis(q.expert_answer_updated_at),
    verified: q.verified,
    indexable: q.indexable,
    sameIssueCount: q.same_issue_count,
    publishedAt: toMillis(q.published_at),
  };
}
