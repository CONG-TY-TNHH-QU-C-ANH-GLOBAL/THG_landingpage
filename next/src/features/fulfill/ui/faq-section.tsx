// FAQ section (WEB-002) — Server Component. Renders ONLY published fulfill-scope FAQs from the
// CMS (empty → the empty state, never fabricated Q/A). New questions route to the existing
// moderation-first Community workflow via the link — the prototype's inline "publish my
// question" behavior is intentionally not reproduced.
import Link from "next/link";
import { ArrowRight, MessagesSquare } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import type { Locale } from "@/shared/i18n";
import type { FulfillFaq } from "../models/faq";
import type { FulfillCopy } from "../localized-content";
import styles from "./fulfill.module.css";

interface Props {
  lang: Locale;
  copy: FulfillCopy;
  faqs: readonly FulfillFaq[];
}

export default function FaqSection({ lang, copy, faqs }: Readonly<Props>) {
  return (
    <section id="qa" className="py-24 border-t bg-white" style={{ borderColor: "var(--fx-border)" }}>
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <div className="mb-12 text-center">
          <span className={`${styles.sectionIndex} justify-center`}>{copy.faqEyebrow}</span>
          <h2 className="text-3xl font-bold mt-4 mb-3">{copy.faqTitle}</h2>
          <p style={{ color: "var(--fx-gray)" }}>{copy.faqIntro}</p>
        </div>

        {faqs.length > 0 ? (
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={`faq-${faq.id}`}
                className="border rounded-2xl px-6 bg-white"
                style={{ borderColor: "var(--fx-border)" }}
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline text-[15px]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed" style={{ color: "var(--fx-gray)" }}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p
            className="text-center rounded-2xl border py-10 px-6 text-sm"
            style={{ color: "var(--fx-gray)", borderColor: "var(--fx-border)" }}
          >
            {copy.faqEmpty}
          </p>
        )}

        <div className="mt-8 text-center">
          <Link
            prefetch={false}
            href={`/${lang}/community`}
            className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
            style={{ color: "var(--fx-blue)" }}
          >
            <MessagesSquare className="w-4 h-4" aria-hidden="true" />
            {copy.faqAskCommunity}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
