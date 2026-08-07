// S10 · INDEX — "The specific thing I still want to look up."
//
// The canonical, addressable list of the seven answers, and the single source the FAQPage structured
// data is generated from. Visible content and structured data therefore cannot describe different
// things, which is the failure this movement exists to make impossible.
import Link from "next/link";
import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

import type { Locale } from "@/shared/i18n";
import type { FulfillFaq } from "../models/faq";
import type { FulfillCopy } from "../localized-content";
import { Heading, Movement } from "./section";
import { MOVEMENT_INDEX, type MovementCopy } from "./movement-copy";
import { cn } from "@/shared/ui/cn";

interface Props {
  lang: Locale;
  copy: FulfillCopy;
  movement: MovementCopy;
  faqs: readonly FulfillFaq[];
}

export default function IndexSection({ lang, copy, movement, faqs }: Readonly<Props>) {
  return (
    <Movement id="qa">
      <Heading
        index={MOVEMENT_INDEX.index}
        eyebrow={copy.faqEyebrow}
        title={copy.faqTitle}
        lead={copy.faqIntro}
        aside={
          // The path for a question this page does not answer. Moderation-first: it goes to the
          // community, not to a form that implies an immediate reply.
          <Link href={`/${lang}/community`} className="font-mono text-[13.5px] text-muted-foreground hover:text-primary transition-colors no-underline">
            {copy.faqAskCommunity}
          </Link>
        }
      />

      {faqs.length > 0 ? (
        <div className="mt-12 lg:mt-16 bg-card border border-border rounded-lg px-6 py-2">
          <AccordionPrimitive.Root type="single" collapsible className="flex flex-col">
            {faqs.map((faq) => (
              <AccordionPrimitive.Item 
                key={faq.id} 
                value={faq.id} 
                className="border-b border-border/50 last:border-0"
              >
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger
                    className="flex flex-1 items-center justify-between py-6 transition-colors hover:text-primary group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                  >
                    <span className="type-h4 text-foreground text-left">{faq.question}</span>
                    <Plus className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary transition-transform duration-260 group-data-[state=open]:rotate-45 group-data-[state=open]:text-primary" />
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <div className="pb-6 max-w-[720px]">
                    <p className="type-body text-muted-foreground m-0">
                      {faq.answer}
                    </p>
                  </div>
                </AccordionPrimitive.Content>
              </AccordionPrimitive.Item>
            ))}
          </AccordionPrimitive.Root>
        </div>
      ) : (
        <p className="mt-12 lg:mt-16 py-8 border-t border-border type-small italic text-muted-foreground m-0">{copy.faqEmpty}</p>
      )}
    </Movement>
  );
}
