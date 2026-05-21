import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQAccordionProps {
    items: FAQItem[];
    className?: string;
}

const FAQAccordion = ({ items, className = "" }: FAQAccordionProps) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={`flex flex-col gap-3 ${className}`}>
            {items.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                    <ScrollReveal key={index} delay={index * 60}>
                        <div
                            className={`glass-card rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? "ring-2 ring-primary/20 shadow-lg" : ""
                                }`}
                        >
                            <button
                                onClick={() => toggle(index)}
                                className="w-full flex items-center justify-between p-5 text-left cursor-pointer group"
                            >
                                <span className="text-sm font-semibold text-navy pr-4 leading-relaxed">
                                    {item.question}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""
                                        }`}
                                />
                            </button>
                            <div
                                className="overflow-hidden transition-all duration-300 ease-in-out"
                                style={{
                                    maxHeight: isOpen ? "500px" : "0",
                                    opacity: isOpen ? 1 : 0,
                                }}
                            >
                                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3 whitespace-pre-line">
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                );
            })}
        </div>
    );
};

export default FAQAccordion;
