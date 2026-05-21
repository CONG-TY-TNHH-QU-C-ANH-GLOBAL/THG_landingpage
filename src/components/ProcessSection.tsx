import { useI18n } from "@/lib/i18n";
import ScrollReveal from "@/components/ScrollReveal";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { useHomepageBlock } from "@/hooks/useCmsContent";

const ProcessSection = () => {
  const { tVi, language } = useI18n();
  // Process block has step1..4 as single strings (operator-edited in admin).
  // We use them as TITLE overrides for each step; descriptions stay from i18n
  // because the block schema doesn't include per-step descriptions.
  const block = useHomepageBlock(language, "process");

  const steps = [
    { step: "01", title: block.step1 || tVi("process.s1_title"), descKey: "process.s1_desc" },
    { step: "02", title: block.step2 || tVi("process.s2_title"), descKey: "process.s2_desc" },
    { step: "03", title: block.step3 || tVi("process.s3_title"), descKey: "process.s3_desc" },
    { step: "04", title: block.step4 || tVi("process.s4_title"), descKey: "process.s4_desc" },
  ];

  return (
    <section className="py-28 bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-accent/5 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <SectionHeader
            size="xl"
            className="mb-20"
            eyebrow={tVi("process.subtitle")}
            title={tVi("process.title")}
            titleHighlight={tVi("process.title_highlight")}
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">
          {steps.map((s, i) => (
            <ScrollReveal key={s.step} delay={i * 150} className="relative">
              <div className="relative group text-left">
                {/* Connection line for desktop */}
                {i > 0 && (
                  <div className="hidden lg:block absolute top-10 -left-[3.5rem] w-8 h-[1px] bg-border/80" />
                )}

                <div className="text-6xl md:text-7xl font-bold text-[hsl(var(--gold))] mb-5 tracking-tight group-hover:scale-105 transition-all duration-300 drop-shadow-sm">
                  {s.step}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-navy mb-3 tracking-tight">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium pr-2">{tVi(s.descKey)}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
