// S10 · INDEX — "The specific thing I still want to look up."
//
// The canonical, addressable list of the seven answers, and the single source the FAQPage structured
// data is generated from. Visible content and structured data therefore cannot describe different
// things, which is the failure this movement exists to make impossible.
import Link from "next/link";
import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus, ArrowRight } from "lucide-react";

import type { Locale } from "@/shared/i18n";
import type { FulfillFaq } from "../models/faq";
import type { FulfillCopy } from "../localized-content";
import { Heading, Movement } from "./section";
import { MOVEMENT_INDEX, type MovementCopy } from "./movement-copy";

interface Props {
  lang: Locale;
  copy: FulfillCopy;
  movement: MovementCopy;
  faqs: readonly FulfillFaq[];
}

export default function IndexSection({ lang, copy, faqs }: Readonly<Props>) {
  return (
    <Movement id="qa">
      <Heading
        index={MOVEMENT_INDEX.index}
        eyebrow={copy.faqEyebrow}
        title={copy.faqTitle}
        lead={copy.faqIntro}
        aside={
          <Link 
            href={`/${lang}/community`} 
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-thg-border text-thg-textMain font-semibold text-sm hover:border-thg-gold hover:text-thg-gold transition-all duration-300 shadow-sm hover:shadow"
          >
            {copy.faqAskCommunity}
            <ArrowRight className="w-4 h-4" />
          </Link>
        }
      />

      {faqs.length > 0 ? (
        <div className="mt-16">
          <AccordionPrimitive.Root type="single" collapsible className="flex flex-col gap-4">
            {faqs.map((faq, idx) => (
              <AccordionPrimitive.Item 
                key={faq.id} 
                value={String(faq.id)} 
                className="group/item bg-white border border-thg-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-thg-borderHover hover:shadow-md data-[state=open]:border-thg-gold data-[state=open]:shadow-md"
              >
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger
                    className="flex flex-1 items-center justify-between p-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-thg-gold group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs font-bold text-thg-textSubtle group-hover:text-thg-gold transition-colors">
                        {(idx + 1).toString().padStart(2, '0')}
                      </span>
                      <span className="text-lg font-semibold text-thg-textMain text-left max-w-[800px] group-hover:text-thg-gold transition-colors">
                        {faq.question}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-thg-bg flex items-center justify-center border border-thg-border group-hover:border-thg-gold transition-colors group-data-[state=open]:bg-thg-gold group-data-[state=open]:border-thg-gold">
                      <Plus className="h-4 w-4 shrink-0 text-thg-textMuted group-hover:text-thg-gold transition-transform duration-300 group-data-[state=open]:rotate-45 group-data-[state=open]:text-white" />
                    </div>
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <div className="px-6 pb-6 pt-2 ml-8 max-w-[720px]">
                    <p className="text-base text-thg-textMuted m-0 leading-relaxed">
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
