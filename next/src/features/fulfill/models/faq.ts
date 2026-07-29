// Fulfill-scope FAQ (WEB-002). Feeds both the visible accordion and the FAQPage JSON-LD, so
// it is a rendered content model — not JSON-LD-only like the home FAQ. `id` is stable for keys.

export interface FulfillFaq {
  id: number;
  question: string;
  answer: string;
}
