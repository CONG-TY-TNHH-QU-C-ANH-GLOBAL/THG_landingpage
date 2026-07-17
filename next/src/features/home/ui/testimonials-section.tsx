// Parity source: src/components/TestimonialsSection.tsx (static grid, not a carousel).
import { Star } from "lucide-react";
import ScrollReveal from "@/shared/ui/scroll-reveal";
import { SectionHeader } from "@/shared/ui/section-header";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";

const testimonials = [
  {
    nameKey: "testimonials.t1_name",
    roleKey: "testimonials.t1_role",
    quoteKey: "testimonials.t1_quote",
    rating: 5,
    avatar: "🇻🇳",
  },
  {
    nameKey: "testimonials.t2_name",
    roleKey: "testimonials.t2_role",
    quoteKey: "testimonials.t2_quote",
    rating: 5,
    avatar: "🇺🇸",
  },
  {
    nameKey: "testimonials.t3_name",
    roleKey: "testimonials.t3_role",
    quoteKey: "testimonials.t3_quote",
    rating: 5,
    avatar: "🇻🇳",
  },
  {
    nameKey: "testimonials.t4_name",
    roleKey: "testimonials.t4_role",
    quoteKey: "testimonials.t4_quote",
    rating: 5,
    avatar: "🇺🇸",
  },
];

const TestimonialsSection = ({ copy }: Readonly<{ copy: MarketingCopy }>) => {
  const tVi = tFrom(copy);

  return (
    <section className="py-28 bg-background relative overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <SectionHeader
            size="lg"
            eyebrow={tVi("testimonials.subtitle")}
            title={tVi("testimonials.title")}
            titleHighlight={tVi("testimonials.title_highlight")}
          />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((item, i) => (
            <ScrollReveal key={item.nameKey} delay={i * 100}>
              <div className="glass-card rounded-2xl p-7 tilt-card h-full flex flex-col">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: item.rating }, (_, idx) => `${item.nameKey}-star-${idx}`).map((starKey) => (
                    <Star key={starKey} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-sm text-foreground/80 leading-relaxed flex-1 italic">
                  &quot;{tVi(item.quoteKey)}&quot;
                </p>
                {/* Author */}
                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-border/50">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg">
                    {item.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy">{tVi(item.nameKey)}</p>
                    <p className="text-xs text-muted-foreground">{tVi(item.roleKey)}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
