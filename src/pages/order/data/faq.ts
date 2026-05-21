// 7 FAQ items rendered in a custom accordion (the FAQAccordion component
// styling didn't match this page's design language).

export interface FaqItem {
  icon: string;
  qKey: string;
  aKey: string;
}

export const faqItems: FaqItem[] = [
  { icon: "🛒", qKey: "op.faq1_q", aKey: "op.faq1_a" },
  { icon: "⏱️", qKey: "op.faq2_q", aKey: "op.faq2_a" },
  { icon: "💳", qKey: "op.faq3_q", aKey: "op.faq3_a" },
  { icon: "📦", qKey: "op.faq4_q", aKey: "op.faq4_a" },
  { icon: "🛃", qKey: "op.faq5_q", aKey: "op.faq5_a" },
  { icon: "🏷️", qKey: "op.faq6_q", aKey: "op.faq6_a" },
  { icon: "📍", qKey: "op.faq7_q", aKey: "op.faq7_a" },
];
