// Landing-domain careers models (WEB-006 §Model). Plain data (FND-005); the one import is the
// shared CMS result vocabulary, so blog and careers cannot drift on what a failure is called.
//
// Applicant PII never appears here: this is the READ model for published job posts. The
// application flow (CONV-002) owns its own request types and does not reuse these.

import type { UnavailableReason } from "@/shared/cms/degraded";

export interface Benefit {
  /** Mapper-owned stable identity (job slug + normalized title). */
  id: string;
  /** Icon name from the CMS `i` field. Presentation hint; the renderer may ignore it. */
  icon: string;
  title: string;
  description: string;
}

/** `responsibilities` is a CMS map of group heading → bullet lines. Flattened to an ordered
 *  list so the renderer never iterates object keys (whose order is not a contract). */
export interface ResponsibilityGroup {
  /** Mapper-owned stable identity (job slug + normalized heading). */
  id: string;
  heading: string;
  items: readonly { id: string; text: string }[];
}

export interface JobSummary {
  slug: string;
  title: string;
  category: string | null;
  /** CMS-set highlight flag; renders a badge, carries no ranking meaning. */
  hot: boolean;
  badge: string | null;
  tagline: string | null;
  location: string | null;
  employmentType: string | null;
  /** Pre-formatted by the CMS (`salary` + `salary_unit` + `salary_note`); never computed here. */
  salaryText: string | null;
  /** ISO `YYYY-MM-DD` or whatever the operator typed. Compared as a date only when parseable. */
  /** As the operator wrote it — free text, shown as-is. Never a machine value. */
  deadline: string | null;
  /** The deadline as a machine-readable ISO date, or null when it is not one. Separate for the
   *  same reason as the blog's publication date: `Date.parse` accepts "01/01/2030" and then
   *  `new Date(...).toISOString()` shifts it a day back in a positive-offset timezone, which
   *  advertised a JobPosting as closed before it was. */
  deadlineIso: string | null;
  experience: string | null;
  /** Unix SECONDS (CMS units, kept) — JobPosting.datePosted input. */
  postedAt: number;
}

export interface JobDetail extends JobSummary {
  /** Markdown body. Rendered through the shared renderer, never as HTML. */
  bodyMarkdown: string;
  lead: string | null;
  responsibilities: readonly ResponsibilityGroup[];
  /** Text-only CMS arrays, given mapper-owned identity so the renderer never keys by index.
   *  Duplicate lines are legitimate and are numbered, not deduplicated. */
  requirements: readonly { id: string; text: string }[];
  benefits: readonly Benefit[];
  bonuses: readonly { id: string; text: string }[];
}

/** True when the deadline has passed. Unparseable or absent → NOT expired: refusing to show a
 *  post because an operator typed a free-text deadline would hide a live vacancy. */
export function isExpired(deadline: string | null, now: Date = new Date()): boolean {
  if (!deadline) return false;
  const parsed = Date.parse(deadline);
  if (Number.isNaN(parsed)) return false;
  return parsed < now.getTime();
}

export type JobListResult =
  | { status: "ready"; jobs: readonly JobSummary[] }
  | { status: "empty"; jobs: readonly JobSummary[] }
  | { status: "unavailable"; jobs: readonly JobSummary[]; reason: UnavailableReason };

export type JobDetailResult =
  | { status: "ready"; job: JobDetail }
  | { status: "not-found" }
  | { status: "unavailable"; reason: UnavailableReason };
