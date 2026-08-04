// FAQ section (WEB-002, R2) — Server Component adapter over the shared ServiceFaq.
//
// Behaviour is unchanged: only published fulfill-scope CMS FAQs render (empty → the localized
// empty state, never fabricated Q/A), and a new question routes to the existing moderation-first
// Community workflow through the link — the journey continues rather than ending at the answers.
import { ArrowRight, MessagesSquare } from "lucide-react";

import { ServiceFaq, type ServiceFaqItem } from "@/shared/service";
import type { Locale } from "@/shared/i18n";
import type { FulfillFaq } from "../models/faq";
import type { FulfillCopy } from "../localized-content";
import type { FulfillParityCopy } from "../parity-content";

interface Props {
  lang: Locale;
  copy: FulfillCopy;
  parity: FulfillParityCopy;
  faqs: readonly FulfillFaq[];
}

export default function FaqSection({ lang, copy, parity, faqs }: Readonly<Props>) {
  // MIGRATION FALLBACK (R3/B2). The CMS stays the long-term authority; while its fulfill FAQ set
  // is still being seeded, an empty read falls back to the localized questions the Vite page
  // shipped so a visitor never sees fewer answers than production has today. One renderer, one
  // shape — only the content differs, so when the CMS reaches parity this branch simply stops
  // being taken and can be deleted without touching the UI.
  const items: ServiceFaqItem[] =
    faqs.length > 0
      ? faqs.map((faq) => ({ id: String(faq.id), question: faq.question, answer: faq.answer }))
      : parity.faqFallback.map((f) => ({ id: f.id, question: f.question, answer: f.answer }));

  return (
    <ServiceFaq
      heading={{ eyebrow: copy.faqEyebrow, title: copy.faqTitle, intro: copy.faqIntro }}
      faqs={items}
      emptyLabel={copy.faqEmpty}
      community={{
        href: `/${lang}/community`,
        label: copy.faqAskCommunity,
        icon: <MessagesSquare className="w-4 h-4" aria-hidden="true" />,
        trailingIcon: <ArrowRight className="w-4 h-4" aria-hidden="true" />,
      }}
    />
  );
}
