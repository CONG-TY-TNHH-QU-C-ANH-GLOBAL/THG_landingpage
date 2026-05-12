import { Shield, Clock, DollarSign, Headphones, Globe, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import ScrollReveal from "@/components/ScrollReveal";

const AdvantagesSection = () => {
  const { tVi } = useI18n();

  const advantages = [
    { icon: DollarSign, titleKey: "adv.a1_title", descKey: "adv.a1_desc" },
    { icon: Clock, titleKey: "adv.a2_title", descKey: "adv.a2_desc" },
    { icon: Globe, titleKey: "adv.a3_title", descKey: "adv.a3_desc" },
    { icon: Shield, titleKey: "adv.a4_title", descKey: "adv.a4_desc" },
    { icon: Zap, titleKey: "adv.a5_title", descKey: "adv.a5_desc" },
    { icon: Headphones, titleKey: "adv.a6_title", descKey: "adv.a6_desc" },
  ];

  return (
    <section className="py-28 relative overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="absolute -bottom-20 right-0 w-72 h-72 rounded-full bg-accent/5 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-20">
            <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">{tVi("adv.subtitle")}</p>
            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-navy tracking-tight">
              {tVi("adv.title")}{" "}
              <span className="text-gradient-gold">{tVi("adv.title_highlight")}</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((a, i) => (
            <ScrollReveal key={a.titleKey} delay={i * 100}>
              <div className="flex gap-5 group p-5 rounded-2xl hover:bg-card/60 hover:shadow-lg transition-all duration-500"
                style={{ transitionTimingFunction: "var(--motion-spring)" }}
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                  <a.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-navy mb-2 tracking-tight" >{tVi(a.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed" >{tVi(a.descKey)}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;
