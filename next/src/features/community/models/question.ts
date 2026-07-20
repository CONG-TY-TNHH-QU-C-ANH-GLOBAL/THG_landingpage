// Landing-domain community question models. Plain data, zero imports (FND-005).
//
// Privacy: these are the ONLY shapes the UI ever sees. No author email, no moderation
// status, no owner-token material — the CMS strips them and the mappers never add them.
// `indexable` is the CMS's computed SEO authority and is copied through verbatim; the
// landing never derives it (COM-001 §12).

export interface QuestionSummary {
  slug: string;
  title: string;
  excerpt: string;
  /** null renders no category chip. */
  category: { slug: string; name: string } | null;
  hasExpertAnswer: boolean;
  verified: boolean;
  indexable: boolean;
  sameIssueCount: number;
  /** Unix MILLISECONDS (CMS sends seconds; the mapper converts). null hides the date. */
  publishedAt: number | null;
}

export interface QuestionDetail {
  slug: string;
  title: string;
  /** User-submitted text. Rendered as plain text, never as HTML. */
  body: string;
  category: { slug: string; name: string } | null;
  authorName: string;
  /** null selects the "awaiting answer" panel instead of the answer card. */
  expertAnswer: string | null;
  expertAnswerUpdatedAt: number | null;
  verified: boolean;
  indexable: boolean;
  sameIssueCount: number;
  publishedAt: number | null;
}

/** List outcome. `empty` is a CONFIRMED empty list; `unavailable` is a CMS failure —
 *  keeping them apart stops an outage from rendering as "no questions yet", which is
 *  the bug the legacy list had (`!isLoading && length === 0`). */
export type QuestionListResult =
  | { status: "ready"; questions: readonly QuestionSummary[] }
  | { status: "empty"; questions: readonly QuestionSummary[] }
  | {
      status: "unavailable";
      questions: readonly QuestionSummary[];
      reason: "http" | "contract" | "network";
    };

/** Detail outcome. `not-found` is a real CMS 404 — pending, rejected, withdrawn and
 *  never-existed are deliberately indistinguishable server-side, so all four land here
 *  and the route turns them into a real HTTP 404 (COM-001 §6). */
export type QuestionDetailResult =
  | { status: "ready"; question: QuestionDetail }
  | { status: "not-found" }
  | { status: "unavailable"; reason: "http" | "contract" | "network" };
