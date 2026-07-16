// Parity source: src/components/FAQSection.tsx. Server Component — the interactive part is
// the imported client Accordion primitives; the 5 Q/A pairs are static i18n (WEB-001 §5).
import Link from "next/link";
import { ArrowRight, MessagesSquare } from "lucide-react";

import ScrollReveal from "@/shared/ui/scroll-reveal";
import { SectionHeader } from "@/shared/ui/section-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";
import type { Locale } from "@/shared/i18n";

const FAQSection = ({ copy, lang }: Readonly<{ copy: MarketingCopy; lang: Locale }>) => {
  const tVi = tFrom(copy);

  const faqs = [
    { q: tVi("faq.q1"), a: tVi("faq.a1") },
    { q: tVi("faq.q2"), a: tVi("faq.a2") },
    { q: tVi("faq.q3"), a: tVi("faq.a3") },
    { q: tVi("faq.q4"), a: tVi("faq.a4") },
    { q: tVi("faq.q5"), a: tVi("faq.a5") },
  ];

  return (
    <section id="faq" className="py-28 bg-card relative overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary/3 blur-3xl" />

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <ScrollReveal>
          <SectionHeader size="lg" eyebrow={tVi("faq.subtitle")} title={tVi("nav.faq")} />
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={faq.q}
                value={`item-${i}`}
                className="border border-border/60 rounded-2xl px-6 bg-background hover:shadow-md transition-all duration-300"
                style={{ transitionTimingFunction: "var(--motion-spring)" }}
              >
                <AccordionTrigger className="text-left font-semibold text-navy hover:no-underline text-[15px]">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>

        {/* These FAQs are curated and read-only; new questions go to the
            interactive Community hub. */}
        <ScrollReveal delay={300}>
          <div className="mt-8 text-center">
            <Link prefetch={false}
              href={`/${lang}/community`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-gold-dark transition-colors"
            >
              <MessagesSquare className="w-4 h-4" aria-hidden="true" />
              {tVi("faq.ask_community")}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FAQSection;
