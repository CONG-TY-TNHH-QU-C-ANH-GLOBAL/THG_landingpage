import { useI18n } from "@/lib/i18n";
import ScrollReveal from "@/components/ScrollReveal";

const ProcessSection = () => {
  const { t, tVi } = useI18n();

  const steps = [
    { step: "01", titleKey: "process.s1_title", descKey: "process.s1_desc" },
    { step: "02", titleKey: "process.s2_title", descKey: "process.s2_desc" },
    { step: "03", titleKey: "process.s3_title", descKey: "process.s3_desc" },
    { step: "04", titleKey: "process.s4_title", descKey: "process.s4_desc" },
  ];

  return (
    <section className="py-28 bg-gradient-dark text-primary-foreground relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-light/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-light/30 to-transparent" />
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gold/5 blur-3xl" />
      <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-accent/5 blur-3xl" />

      {/* Shimmer overlay */}
      <div className="absolute inset-0 shimmer-effect opacity-10 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-20">
            <p className="text-sm font-semibold text-gold-light uppercase tracking-[0.2em] mb-4">{tVi("process.subtitle")}</p>
            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight">
              {tVi("process.title")}{" "}
              <span className="text-gold-light">{tVi("process.title_highlight")}</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map((s, i) => (
            <ScrollReveal key={s.step} delay={i * 150}>
              <div className="relative group">
                <span className="text-7xl font-bold text-accent/70 tracking-tighter group-hover:text-accent transition-colors duration-500">{s.step}</span>
                <h3 className="text-xl font-bold mt-1 mb-3 tracking-tight" >{tVi(s.titleKey)}</h3>
                <p className="text-sm text-primary-foreground/60 leading-relaxed" >{tVi(s.descKey)}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-5 w-10 h-px bg-gold-light/20" />
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
