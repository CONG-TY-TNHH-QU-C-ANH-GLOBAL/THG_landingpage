// Home-scope FAQ (FND-005) — input for the FaqPage JSON-LD only; the visible FAQ section
// is static dictionary content [FACT: WEB-001 SPEC §5]. Array order is display order.

export interface Faq {
  id: number;
  question: string;
  answer: string;
}
