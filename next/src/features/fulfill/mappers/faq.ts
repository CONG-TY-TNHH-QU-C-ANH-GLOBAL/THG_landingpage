import type { CmsFulfillFaqsResponse } from "../schemas/fulfill-faqs";
import type { FulfillFaq } from "../models/faq";

/** Fulfill-scope FAQs in position order (parity with the home faq mapper). Drives the visible
 *  accordion and the FAQPage JSON-LD; [] omits both (no empty FAQPage, no fabricated Q/A). */
export function fulfillFaqsFromDto(dto: CmsFulfillFaqsResponse): FulfillFaq[] {
  return [...dto.faqs]
    .sort((a, b) => a.position - b.position)
    .map((f) => ({ id: f.id, question: f.question, answer: f.answer }));
}
