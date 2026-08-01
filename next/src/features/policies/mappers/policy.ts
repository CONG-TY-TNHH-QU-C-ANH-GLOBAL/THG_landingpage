import { withStableIds, withStableStringIds } from "@/shared/model/stable-id";

import type { PoliciesResponseDto, PolicyResponseDto } from "../schemas/policies";
import type { PolicyDetail, PolicySummary } from "../models/policy";

// Pure DTO → model mappers (FND-005). No I/O, no framework, no CMS types leaving this file.

/** Sort by the CMS `position` and drop the field. Ordering is the CMS's authority; the
 *  landing must not re-sort by title or slug, which would silently reorder a legal document
 *  set the operator arranged deliberately. */
export function policySummariesFromDto(dto: PoliciesResponseDto): PolicySummary[] {
  return dto.policies
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      icon: p.icon,
      mode: p.mode,
      summary: p.summary,
    }));
}

export function policyDetailFromDto(dto: PolicyResponseDto): PolicyDetail {
  const p = dto.policy;
  return {
    slug: p.slug,
    title: p.title,
    icon: p.icon,
    mode: p.mode,
    images: p.image_list,
    // Identity is scoped to the policy slug and derived from the heading, so a block keeps
    // its key when the operator reorders the document. Two blocks may legitimately share a
    // heading; withStableIds numbers the repeat rather than dropping it.
    blocks: withStableIds(p.slug, p.text_blocks, (b) => b.heading).map(({ id, value: b }) => ({
      id,
      tone: b.type,
      heading: b.heading,
      // Drop blank strings: an editor's trailing empty paragraph is not content, and an
      // empty <p> would open a gap in the rendered document.
      paragraphs: withStableStringIds(
        id,
        b.content.filter((line) => line.trim().length > 0),
      ).map(({ id: paragraphId, value }) => ({ id: paragraphId, text: value })),
    })),
    bodyMarkdown: p.body_md ?? "",
    summary: p.summary,
  };
}
