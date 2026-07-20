import "server-only";

import { cmsFetch } from "@/shared/cms";
import { CmsError, CmsHttpError, CmsParseError, CmsShapeError, isCmsNotFound } from "@/shared/cms/errors";
import { logCmsFallback } from "@/shared/cms/log-fallback";

import { categoriesResponseSchema } from "../schemas/categories";
import { questionsResponseSchema, questionDetailResponseSchema } from "../schemas/questions";
import { reviewsResponseSchema, reviewDetailResponseSchema } from "../schemas/reviews";
import { categoriesFromDto } from "../mappers/category";
import { questionSummariesFromDto, questionDetailFromDto } from "../mappers/question";
import { reviewSummariesFromDto, reviewDetailFromDto } from "../mappers/review";
import type { CommunityCategory, CommunityUnavailableReason } from "../models/category";
import type { QuestionListResult, QuestionDetailResult } from "../models/question";
import type { ReviewListResult, ReviewDetailResult } from "../models/review";

// Server-only community loaders: cmsFetch → feature schema → pure mapper → model.
//
// Community reads carry NO `lang` param on purpose. Community UGC has no locale
// dimension in the CMS data model — questions and reviews are served as submitted
// (VI-canonical). Adding `?lang=` would be silently ignored and would misrepresent the
// contract. Only UI chrome is localized.
//
// Failure policy differs from the homepage: community IS the page, so a CMS outage
// cannot degrade to a fallback dataset without inventing content. Lists surface an
// explicit `unavailable` state, and detail distinguishes a real 404 (route → notFound())
// from an outage (route → error notice, still noindex).

function unavailableReason(err: CmsError): CommunityUnavailableReason {
  if (err instanceof CmsHttpError) return "http";
  if (err instanceof CmsShapeError || err instanceof CmsParseError) return "contract";
  return "network";
}

/** `?category=` takes a category SLUG. Passing a display name returns an empty list
 *  rather than an error, so an unknown slug reads as a confirmed-empty filter. */
function listPath(base: string, category: string | undefined): string {
  return category ? `${base}?category=${encodeURIComponent(category)}` : base;
}

export async function loadCommunityCategories(): Promise<CommunityCategory[]> {
  const path = "/community/categories";
  try {
    return categoriesFromDto(await cmsFetch(path, categoriesResponseSchema));
  } catch (err) {
    if (!(err instanceof CmsError)) throw err;
    logCmsFallback(path, err);
    // Categories are a filter affordance, not content: an outage drops the chips to
    // just "All" rather than failing the list the user actually came for.
    return [];
  }
}

export async function loadCommunityQuestions(category?: string): Promise<QuestionListResult> {
  const path = listPath("/community/questions", category);
  try {
    const questions = questionSummariesFromDto(await cmsFetch(path, questionsResponseSchema));
    return questions.length > 0 ? { status: "ready", questions } : { status: "empty", questions };
  } catch (err) {
    if (!(err instanceof CmsError)) throw err;
    logCmsFallback(path, err);
    return { status: "unavailable", questions: [], reason: unavailableReason(err) };
  }
}

export async function loadCommunityQuestion(slug: string): Promise<QuestionDetailResult> {
  const path = `/community/questions/${encodeURIComponent(slug)}`;
  try {
    return { status: "ready", question: questionDetailFromDto(await cmsFetch(path, questionDetailResponseSchema)) };
  } catch (err) {
    if (!(err instanceof CmsError)) throw err;
    // A 404 is the CMS's single answer for pending, rejected, withdrawn and
    // never-existed — deliberately non-enumerable. It is an expected outcome, not a
    // fallback, so it is not logged as one.
    if (isCmsNotFound(err)) return { status: "not-found" };
    logCmsFallback(path, err);
    return { status: "unavailable", reason: unavailableReason(err) };
  }
}

export async function loadCommunityReviews(category?: string): Promise<ReviewListResult> {
  const path = listPath("/community/reviews", category);
  try {
    const reviews = reviewSummariesFromDto(await cmsFetch(path, reviewsResponseSchema));
    return reviews.length > 0 ? { status: "ready", reviews } : { status: "empty", reviews };
  } catch (err) {
    if (!(err instanceof CmsError)) throw err;
    logCmsFallback(path, err);
    return { status: "unavailable", reviews: [], reason: unavailableReason(err) };
  }
}

export async function loadCommunityReview(slug: string): Promise<ReviewDetailResult> {
  const path = `/community/reviews/${encodeURIComponent(slug)}`;
  try {
    return { status: "ready", review: reviewDetailFromDto(await cmsFetch(path, reviewDetailResponseSchema)) };
  } catch (err) {
    if (!(err instanceof CmsError)) throw err;
    if (isCmsNotFound(err)) return { status: "not-found" };
    logCmsFallback(path, err);
    return { status: "unavailable", reason: unavailableReason(err) };
  }
}
