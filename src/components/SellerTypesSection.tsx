import { Store, TrendingUp, Users, Rocket } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import ScrollReveal from "@/components/ScrollReveal";
import { SectionHeader } from "@/components/sections/SectionHeader";

const SellerTypesSection = () => {
  const { tVi } = useI18n();

  const types = [
    { icon: Store, titleKey: "sellers.t1_title", descKey: "sellers.t1_desc" },
    { icon: TrendingUp, titleKey: "sellers.t2_title", descKey: "sellers.t2_desc" },
    { icon: Users, titleKey: "sellers.t3_title", descKey: "sellers.t3_desc" },
    { icon: Rocket, titleKey: "sellers.t4_title", descKey: "sellers.t4_desc" },
  ];

  return (
    <section className="py-28 relative overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="absolute -top-20 right-0 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <SectionHeader
            size="xl"
            className="mb-20"
            eyebrow={tVi("sellers.subtitle")}
            title={tVi("sellers.title")}
            titleHighlight={tVi("sellers.title_highlight")}
          />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {types.map((item, i) => (
            <ScrollReveal key={item.titleKey} delay={i * 120}>
              <div className="text-center p-8 rounded-2xl bg-card border border-border/60 tilt-card cursor-pointer h-full">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-navy mb-3 tracking-tight" >{tVi(item.titleKey)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed" >{tVi(item.descKey)}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SellerTypesSection;
