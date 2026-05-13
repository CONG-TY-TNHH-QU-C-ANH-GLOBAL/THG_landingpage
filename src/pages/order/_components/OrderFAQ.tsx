import { useCallback, useState } from "react";
import { ChevronDown } from "lucide-react";

import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";

import { faqItems } from "../data/faq";

/** Custom-styled FAQ accordion. The shared `FAQAccordion` component uses
 *  a different colour palette and chevron position that didn't match this
 *  page's design, so the open/close state stays local. */
export function OrderFAQ() {
  const { t } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = useCallback((i: number) => setOpenFaq((prev) => (prev === i ? null : i)), []);

  return (
    <section className="py-20 md:py-24 bg-card">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16">
            <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-3">{t("op.faq_eye")}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{t("op.faq_title")}</h2>
            <p className="text-navy/70 font-medium mt-4 max-w-xl mx-auto leading-relaxed">{t("op.faq_sub")}</p>
          </div>
        </ScrollReveal>
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {faqItems.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 60}>
              <div className="glass-card rounded-2xl border border-border/50 overflow-hidden transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3 px-5 py-5 sm:py-4 cursor-pointer select-none" onClick={() => toggleFaq(i)}>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg flex-shrink-0">{faq.icon}</div>
                  <div className="flex-1 text-sm sm:text-base font-semibold text-navy leading-snug">{t(faq.qKey)}</div>
                  <div
                    className={`w-7 h-7 rounded-full bg-secondary flex items-center justify-center transition-transform duration-300 flex-shrink-0 ${
                      openFaq === i ? "rotate-180 bg-primary text-white" : "text-muted-foreground"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-[600px] pb-5 px-5 pl-[68px]" : "max-h-0"}`}>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{t(faq.aKey)}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
