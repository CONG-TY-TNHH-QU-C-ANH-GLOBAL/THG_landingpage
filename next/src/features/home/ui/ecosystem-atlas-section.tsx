// Connected ecosystem section (Open Design artifact "CONNECTED ECOSYSTEM") — Server
// Component wrapper: resolves the six stage strings from existing production i18n keys
// (hero.feature*, about.img2_title, process.s3/s4_title — verified terms, nothing
// invented) and hands them to the EcosystemAtlas client shell as serializable props.
// Replaces ProcessSection + EcosystemJourneySection + LogisticsAnimationSection with
// the approved single-route atlas.
import ScrollReveal from "@/shared/ui/scroll-reveal";
import { SectionHeader } from "@/shared/ui/section-header";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";
import { EcosystemAtlas, type EcosystemStage } from "./ecosystem-atlas";

const EcosystemAtlasSection = ({ copy }: Readonly<{ copy: MarketingCopy }>) => {
  const t = tFrom(copy);

  // Six operational stages, each owned by a real pillar (owner labels are the real
  // service names). Anchors: Warehouse + Fulfillment — the two infrastructure hubs.
  const stages: readonly EcosystemStage[] = [
    { owner: t("nav.thg_order"), title: t("hero.feature1"), anchor: false },
    { owner: t("nav.thg_fulfill"), title: t("about.img2_title"), anchor: false },
    { owner: t("nav.thg_warehouse"), title: t("hero.feature3"), anchor: true },
    { owner: t("nav.thg_express"), title: t("hero.feature4"), anchor: false },
    { owner: t("nav.thg_fulfill"), title: t("process.s3_title"), anchor: true },
    { owner: t("eco_flow.customer"), title: t("process.s4_title"), anchor: false },
  ];

  return (
    <section id="ecosystem" className="py-28 relative overflow-hidden bg-secondary/60">
      {/* cartographic dot texture — used sparingly (hero, ecosystem, pillar route only) */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--navy)) 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <SectionHeader
            align="left"
            className="mb-8 max-w-2xl"
            eyebrow={t("eco_flow.eyebrow")}
            title={t("eco_flow.title")}
            description={t("eco_flow.desc")}
          />
        </ScrollReveal>
        <EcosystemAtlas stages={stages} />
      </div>
    </section>
  );
};

export default EcosystemAtlasSection;
