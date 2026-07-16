import type { CmsFaqsResponse } from "../schemas/faqs";
import type { Faq } from "../models/faq";

/** Home-scope FAQs in position order — JSON-LD input only (WEB-001 SPEC §5). */
export function faqsFromDto(dto: CmsFaqsResponse): Faq[] {
  return [...dto.faqs]
    .sort((a, b) => a.position - b.position)
    .map((f) => ({ id: f.id, question: f.question, answer: f.answer }));
}
