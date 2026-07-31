import { withStableIds, withStableStringIds } from "@/shared/model/stable-id";

import type { JobResponseDto, JobsResponseDto } from "../schemas/jobs";
import type { JobDetail, JobSummary } from "../models/job";

// Pure DTO → model mappers (FND-005).

/** Compose the human salary line from the CMS's three columns.
 *
 *  The CMS owns the wording and the currency; this only joins the parts the operator filled
 *  in. It never formats a number, converts a currency, or invents a range — a compensation
 *  claim must come from approved source content, not from the landing. */
function salaryText(
  salary: string | null,
  unit: string | null,
  note: string | null,
): string | null {
  const head = [salary, unit].filter((v): v is string => !!v && v.trim().length > 0).join(" ");
  const parts = [head, note?.trim()].filter((v): v is string => !!v && v.length > 0);
  return parts.length > 0 ? parts.join(" · ") : null;
}

function summaryFrom(j: JobsResponseDto["jobs"][number]): JobSummary {
  return {
    slug: j.slug,
    title: j.title,
    category: j.category,
    hot: j.hot,
    badge: j.badge,
    tagline: j.tagline,
    location: j.location,
    employmentType: j.employment_type,
    salaryText: salaryText(j.salary, j.salary_unit, j.salary_note),
    deadline: j.deadline,
    experience: j.experience,
    postedAt: j.posted_at,
  };
}

/** Ordered by the CMS `position`, which is the operator's arrangement. `position` itself does
 *  not reach the model. */
export function jobSummariesFromDto(dto: JobsResponseDto): JobSummary[] {
  return dto.jobs
    .slice()
    .sort((a, b) => a.position - b.position)
    .map(summaryFrom);
}

export function jobDetailFromDto(dto: JobResponseDto): JobDetail {
  const j = dto.job;
  return {
    ...summaryFrom(j),
    bodyMarkdown: j.body_md,
    lead: j.lead,
    // Object key order is not a contract, so the map is flattened into an explicit ordered
    // list here — the renderer must never depend on Object.entries ordering.
    responsibilities: withStableIds(
      `${j.slug}:resp`,
      Object.entries(j.responsibilities)
        .map(([heading, items]) => ({ heading, items: items.filter((i) => i.trim().length > 0) }))
        .filter((g) => g.items.length > 0),
      (g) => g.heading,
    ).map(({ id, value: g }) => ({
      id,
      heading: g.heading,
      items: withStableStringIds(id, g.items).map(({ id: itemId, value }) => ({
        id: itemId,
        text: value,
      })),
    })),
    requirements: withStableStringIds(
      `${j.slug}:req`,
      j.requirements.filter((r) => r.trim().length > 0),
    ).map(({ id, value }) => ({ id, text: value })),
    benefits: withStableIds(`${j.slug}:benefit`, j.benefits, (b) => b.t).map(
      ({ id, value: b }) => ({ id, icon: b.i, title: b.t, description: b.d }),
    ),
    bonuses: withStableStringIds(
      `${j.slug}:bonus`,
      j.bonuses.filter((b) => b.trim().length > 0),
    ).map(({ id, value }) => ({ id, text: value })),
  };
}
