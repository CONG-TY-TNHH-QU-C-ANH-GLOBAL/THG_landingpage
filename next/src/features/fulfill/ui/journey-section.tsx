// Journey section (WEB-002) — Server Component shell around the JourneyStepper client island.
// The section chrome (heading, intro) renders on the server; only the interactive stepper is a
// client boundary, and it receives minimal serializable props (copy + local asset paths).
import type { FulfillCopy } from "../copy";
import JourneyStepper from "./journey-stepper";
import styles from "./fulfill.module.css";

export default function JourneySection({ copy }: Readonly<{ copy: FulfillCopy }>) {
  return (
    <section
      id="journey"
      className="py-24 border-y bg-white relative"
      style={{ borderColor: "var(--fx-border)" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-14">
          <span className={styles.sectionIndex}>{copy.journeyEyebrow}</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-4 mb-4">{copy.journeyTitle}</h2>
          <p className="font-medium max-w-xl" style={{ color: "var(--fx-gray)" }}>
            {copy.journeyIntro}
          </p>
        </div>

        <JourneyStepper
          steps={copy.steps}
          images={[
            { src: "/assets/fulfill/design-input.jpg", alt: "", step: 0, widthPct: 62 },
            { src: "/assets/fulfill/apparel.png", alt: "", step: 1, widthPct: 74 },
            { src: "/assets/fulfill/apparel.png", alt: "", step: 2, widthPct: 74 },
            { src: "/assets/fulfill/apparel.png", alt: "", step: 3, widthPct: 74 },
          ]}
          hubStages={copy.hubStages}
          hubLabel="Hub System"
          reference={copy.journeyReference}
          stepsLabel={copy.journeyTitle}
        />
      </div>
    </section>
  );
}
