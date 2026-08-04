// Journey section (WEB-002, R2) — Server Component adapter over the shared ServiceWorkflow.
//
// The section chrome and the visual stage now render entirely on the server; the only client
// boundary left is ServiceWorkflow's tablist, which is genuine interaction. Mapping the four
// Fulfill journey steps to generic workflow steps is all this file does — the timeline itself is
// shared and already supports 3–6 steps, which is what Express/Warehouse/Order will need.
import { ScanLine, ShieldCheck } from "lucide-react";

import { ServiceSectionHeader, ServiceWorkflow, type ServiceWorkflowStep } from "@/shared/service";
import type { FulfillCopy } from "../localized-content";
import JourneyStage from "./journey-stage";
import styles from "./fulfill.module.css";

/** Operational glyph on a step's index rail (processing → scan, QC → shield). */
const RAIL_ICONS: Readonly<Record<number, React.ReactNode>> = {
  1: <ScanLine className="w-4 h-4" aria-hidden="true" />,
  2: <ShieldCheck className="w-4 h-4" aria-hidden="true" />,
};

const STAGE_IMAGES = [
  { src: "/assets/fulfill/design-input.jpg", alt: "", step: 0, widthPct: 62 },
  { src: "/assets/fulfill/apparel.png", alt: "", step: 1, widthPct: 74 },
  { src: "/assets/fulfill/apparel.png", alt: "", step: 2, widthPct: 74 },
  { src: "/assets/fulfill/apparel.png", alt: "", step: 3, widthPct: 74 },
] as const;

export default function JourneySection({ copy }: Readonly<{ copy: FulfillCopy }>) {
  // Positional identity: two steps may legitimately share a title, so the index is the key.
  const steps: ServiceWorkflowStep[] = copy.steps.map((step, i) => ({
    id: `step-${i}`,
    index: step.index,
    title: step.title,
    description: step.description,
    icon: RAIL_ICONS[i],
  }));

  return (
    <section
      id="journey"
      className="py-24 border-y bg-white relative"
      style={{ borderColor: "var(--fx-border)" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <ServiceSectionHeader
          eyebrow={copy.journeyEyebrow}
          title={copy.journeyTitle}
          intro={copy.journeyIntro}
          size="lg"
          className="mb-14"
        />

        <ServiceWorkflow
          steps={steps}
          label={copy.journeyTitle}
          reference={copy.journeyReference}
          stageClassName={`${styles.stage} rounded-[2rem] border bg-[var(--fx-bg)]`}
          stage={
            <JourneyStage images={STAGE_IMAGES} hubStages={copy.hubStages} hubLabel="Hub System" />
          }
        />
      </div>
    </section>
  );
}
