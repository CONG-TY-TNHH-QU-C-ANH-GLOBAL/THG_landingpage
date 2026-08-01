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
  /** As the operator wrote it — free text ("30/08/2026"), shown as-is. Never a machine value:
   *  nothing downstream parses this. Use `deadlineIso`. */
  deadline: string | null;
  /** The deadline as a machine-readable ISO date, or null when the operator did not state one.
   *  The ONLY value eligible for expiry logic and for `validThrough` — see models/deadline.ts
   *  for the accepted formats and why they are careers-owned. */
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

/**
 * True when the application deadline has passed.
 *
 * Takes the MACHINE value. It used to take the display string and run `Date.parse` on it, which
 * is what made every live posting immortal: the CMS stores day-first text and
 * `Date.parse("30/07/2026")` is NaN, NaN was read as "not a date", and "not a date" means not
 * expired. Two postings past their deadline were still open, indexable and emitting JobPosting.
 *
 * A posting stays open THROUGH its deadline date and expires the day after — a date-only
 * comparison, matching the parity source, which compares against midnight rather than "now"
 * [FACT: legacy src/lib/deadline.ts:21-27]. Comparing timestamps instead would close a vacancy
 * at the START of its final day.
 *
 * Absent machine value → NOT expired. Refusing to show a post because an operator typed free
 * text would hide a live vacancy, which is the worse failure.
 *
 * The rollover is evaluated in UTC. Legacy used the viewer's local midnight, which server
 * rendering has no access to; in Vietnam (UTC+7) that makes a posting close up to seven hours
 * LATER than it used to — the conservative direction, and never earlier. Pinning
 * Asia/Ho_Chi_Minh is a product decision, not one to make silently here.
 */
export function isExpired(deadlineIso: string | null, now: Date = new Date()): boolean {
  if (!deadlineIso) return false;
  // Both sides are YYYY-MM-DD, so a lexicographic compare IS a chronological one.
  return deadlineIso < now.toISOString().slice(0, 10);
}

export type JobListResult =
  | { status: "ready"; jobs: readonly JobSummary[] }
  | { status: "empty"; jobs: readonly JobSummary[] }
  | { status: "unavailable"; jobs: readonly JobSummary[]; reason: UnavailableReason };

export type JobDetailResult =
  | { status: "ready"; job: JobDetail }
  | { status: "not-found" }
  | { status: "unavailable"; reason: UnavailableReason };
