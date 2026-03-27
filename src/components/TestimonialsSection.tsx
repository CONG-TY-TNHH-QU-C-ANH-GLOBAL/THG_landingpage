import { Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import ScrollReveal from "@/components/ScrollReveal";

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

const TestimonialsSection = () => {
  const { t } = useI18n();

  return (
    <section className="py-28 bg-background relative overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">
              {t("testimonials.subtitle")}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-navy tracking-tight">
              {t("testimonials.title")}{" "}
              <span className="text-gradient-gold">{t("testimonials.title_highlight")}</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((item, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="glass-card rounded-2xl p-7 tilt-card h-full flex flex-col">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: item.rating }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-sm text-foreground/80 leading-relaxed flex-1 italic">
                  "{t(item.quoteKey)}"
                </p>
                {/* Author */}
                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-border/50">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg">
                    {item.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy">{t(item.nameKey)}</p>
                    <p className="text-xs text-muted-foreground">{t(item.roleKey)}</p>
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
