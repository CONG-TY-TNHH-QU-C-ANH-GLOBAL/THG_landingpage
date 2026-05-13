import { useI18n } from "@/lib/i18n";
import { useCmsIntegrations } from "@/hooks/useCmsContent";
import ScrollReveal from "@/components/ScrollReveal";
import { SectionHeader } from "@/components/sections/SectionHeader";
import thgLogo from "@/assets/thg-logo.png";

const TikTokSVG = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9 text-black">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34l.04-8.55a8.18 8.18 0 0 0 4.77 1.52V6.25a4.85 4.85 0 0 1-1.04-.56Z" />
  </svg>
);

// Visual config (icons/svgs) hardcoded by platform name; CMS provides name + color + url.
// When a CMS row's name matches one of these keys, use the visual; else fall back to emoji.
const VISUAL_BY_NAME: Record<string, { icon: string | null; svg?: React.ReactNode }> = {
  Etsy: { icon: "🛍️" },
  Amazon: { icon: "📦" },
  "TikTok Shop": { icon: null, svg: <TikTokSVG /> },
  eBay: { icon: "🏷️" },
  Shopify: { icon: "🛒" },
  WooCommerce: { icon: "🔌" },
};

interface Platform {
  id: number;
  position: number;
  name: string;
  url: string | null;
  color_class: string | null;
  logo_media_id: number | null;
}

const IntegrationsSection = () => {
  const { tVi } = useI18n();
  const { data } = useCmsIntegrations();
  const platforms: Platform[] = data?.integrations ?? [];
  const sortedPlatforms = [...platforms].sort((a, b) => a.position - b.position);

  return (
    <section className="py-28 bg-card relative overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <SectionHeader
            size="lg"
            className="mb-6"
            eyebrow={tVi("integrations.subtitle")}
            title={tVi("integrations.title")}
            titleHighlight={tVi("integrations.title_highlight")}
          />
        </ScrollReveal>
        <ScrollReveal delay={50}>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto" >
            {tVi("integrations.desc")}
          </p>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {sortedPlatforms.map((p, i) => {
              const visual = VISUAL_BY_NAME[p.name];
              return (
                <ScrollReveal key={p.id} delay={i * 80}>
                  <div className={`rounded-2xl border ${p.color_class ?? "bg-card border-border"} p-6 flex flex-col items-center gap-3 tilt-card transition-all duration-300 group`}>
                    <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                      {visual?.svg ?? visual?.icon ?? "🔌"}
                    </span>
                    <span className="text-sm font-semibold text-navy">{p.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-olive animate-pulse" />
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                        {tVi("integrations.sync_ready")}
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal delay={500}>
            <div className="mt-10 flex flex-col items-center">
              <div className="flex items-center gap-3 mb-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-8 h-px bg-primary/30" />
                ))}
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse glow-pulse" />
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-8 h-px bg-primary/30" />
                ))}
              </div>
              <div className="glass-card rounded-2xl px-8 py-4 flex items-center gap-3 glow-pulse">
                <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center overflow-hidden p-1.5">
                  <img src={thgLogo} alt="THG" className="w-full h-full object-contain brightness-0 invert" />
                </div>
                <div>
                  <p className="text-sm font-bold text-navy" >THG Fulfill OMS</p>
                  <p className="text-[10px] text-muted-foreground" >{tVi("integrations.hub_desc")}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
