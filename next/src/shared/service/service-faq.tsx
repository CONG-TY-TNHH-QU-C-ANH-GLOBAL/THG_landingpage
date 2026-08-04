// Service FAQ — Server Component.
//
// Renders only the questions the caller supplies; an empty set renders the caller's honest empty
// state rather than fabricated Q/A. The community link is part of this section by design: an
// unanswered question is exactly the moment to continue the journey into the moderated community
// flow, so it sits at the tail of the answers rather than in a section of its own.
import Link from "next/link";
import type { ReactNode } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";

import { ServiceSectionHeader, type ServiceSectionHeading } from "./service-section-header";

export interface ServiceFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ServiceCommunityLink {
  href: string;
  label: string;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
}

interface Props {
  heading: ServiceSectionHeading;
  faqs: readonly ServiceFaqItem[];
  /** Shown when `faqs` is empty. */
  emptyLabel: string;
  /** Continuation into the community flow. Omitted → no link. */
  community?: ServiceCommunityLink;
  id?: string;
  className?: string;
}

export function ServiceFaq({
  heading,
  faqs,
  emptyLabel,
  community,
  id = "qa",
  className = "",
}: Readonly<Props>) {
  return (
    <section
      id={id}
      className={`py-24 border-t bg-white ${className}`}
      style={{ borderColor: "var(--svc-border)" }}
    >
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <ServiceSectionHeader {...heading} align="center" introClassName="" className="mb-12" />

        {faqs.length > 0 ? (
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={`faq-${faq.id}`}
                className="border rounded-2xl px-6 bg-white"
                style={{ borderColor: "var(--svc-border)" }}
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline text-[15px]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed" style={{ color: "var(--svc-muted)" }}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p
            className="text-center rounded-2xl border py-10 px-6 text-sm"
            style={{ color: "var(--svc-muted)", borderColor: "var(--svc-border)" }}
          >
            {emptyLabel}
          </p>
        )}

        {community ? (
          <div className="mt-8 text-center">
            <Link
              prefetch={false}
              href={community.href}
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
              style={{ color: "var(--svc-accent)" }}
            >
              {community.icon}
              {community.label}
              {community.trailingIcon}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
