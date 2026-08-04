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

interface Props {
  lang: Locale;
  copy: FulfillCopy;
  faqs: readonly FulfillFaq[];
}

export default function FaqSection({ lang, copy, faqs }: Readonly<Props>) {
  const items: ServiceFaqItem[] = faqs.map((faq) => ({
    id: String(faq.id),
    question: faq.question,
    answer: faq.answer,
  }));

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
