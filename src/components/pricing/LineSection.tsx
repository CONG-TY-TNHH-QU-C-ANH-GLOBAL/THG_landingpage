import { ReactNode } from "react";
import ScrollReveal from "@/components/ScrollReveal";

interface LineSectionProps {
  id: string;
  title: string;
  description?: string;
  badges?: ReactNode;
  children: ReactNode;
}

const LineSection = ({ id, title, description, badges, children }: LineSectionProps) => (
  <ScrollReveal>
    <section id={id} className="glass-card rounded-2xl overflow-hidden border border-border/50">
      <div className="p-6 lg:p-8 border-b border-border/30">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {badges}
        </div>
        <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">{description}</p>
      </div>
      <div>{children}</div>
    </section>
  </ScrollReveal>
);

export default LineSection;
