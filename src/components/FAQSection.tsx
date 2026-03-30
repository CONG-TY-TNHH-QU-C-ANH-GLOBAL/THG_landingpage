import { useI18n } from "@/lib/i18n";
import ScrollReveal from "@/components/ScrollReveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const { t, tVi } = useI18n();

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
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">{tVi("faq.subtitle")}</p>
            <h2 className="text-4xl md:text-5xl font-bold text-navy tracking-tight">Q&A</h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-border/60 rounded-2xl px-6 bg-background hover:shadow-md transition-all duration-300"
                style={{ transitionTimingFunction: "var(--motion-spring)" }}
              >
                <AccordionTrigger className="text-left font-semibold text-navy hover:no-underline text-[15px]" >
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm" >
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FAQSection;
