// The Fulfill journey's visual stage (WEB-002, R2) — Server Component, decorative.
//
// This is the route's own art and stays in the feature: a cleanroom product stage with a QC
// reticle, a pack label and an illustrative Hub visibility rail. It is passed to the shared
// ServiceWorkflow as a slot, which wraps it in an element carrying `data-step`; every
// step-dependent visual — including the Hub row markers — is therefore expressed in scoped CSS
// rather than in client state, so none of this ships JavaScript.
//
// Illustrative only: no live order data and no fabricated statuses.
import Image from "next/image";
import { Package } from "lucide-react";

import styles from "./fulfill.module.css";

interface StepImage {
  src: string;
  alt: string;
  /** Which journey step this reference belongs to (0 = design input, 1–3 = finished unit). */
  step: number;
  /** Rendered width fraction of the stage (matches the approved per-state scale). */
  widthPct: number;
}

interface Props {
  images: readonly StepImage[];
  hubStages: readonly string[];
  hubLabel: string;
}

export default function JourneyStage({ images, hubStages, hubLabel }: Readonly<Props>) {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle at center, rgba(0,0,0,0.03) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {images.map((img) => (
        <Image
          key={img.step}
          src={img.src}
          alt=""
          width={640}
          height={640}
          className={styles.stateImg}
          data-step={img.step}
          style={{ width: `${img.widthPct}%`, height: "auto" }}
          sizes="(max-width: 1024px) 90vw, 45vw"
          priority={img.step === 0}
        />
      ))}

      <div className={styles.laser} />

      {/* QC reticle (step 3 / index 2) */}
      <div className={styles.reticle}>
        <span className={`${styles.reticleCorner} -top-1 -left-1 border-t-2 border-l-2`} />
        <span className={`${styles.reticleCorner} -top-1 -right-1 border-t-2 border-r-2`} />
        <span className={`${styles.reticleCorner} -bottom-1 -left-1 border-b-2 border-l-2`} />
        <span className={`${styles.reticleCorner} -bottom-1 -right-1 border-b-2 border-r-2`} />
      </div>

      {/* Pack label (step 4 / index 3) */}
      <div className={`${styles.packLabel} flex flex-col justify-between p-4`}>
        <div className="w-full bg-white border border-gray-300 p-2 flex flex-col gap-1">
          <div className={`${styles.mono} text-[8px] font-bold`}>THG LOGISTICS</div>
          <div className="w-full h-px bg-gray-200 my-1" />
          <div
            className="h-6 w-full"
            style={{
              background:
                "repeating-linear-gradient(90deg,#000 0,#000 2px,transparent 2px,transparent 4px)",
            }}
          />
        </div>
        <Package className="w-9 h-9 text-gray-400 mx-auto" aria-hidden="true" />
      </div>

      {/* Hub visibility rail — markers are CSS-driven from the wrapper's data-step. */}
      <div className={`${styles.hub} ${styles.glass} p-4 rounded-2xl`}>
        <div
          className={`${styles.mono} text-[10px] tracking-widest uppercase mb-3`}
          style={{ color: "var(--fx-gray)" }}
        >
          {hubLabel}
        </div>
        <div className="space-y-1.5">
          {hubStages.map((stage) => (
            <div key={stage} className={`${styles.hubRow} flex justify-between items-center text-xs`}>
              <span className="font-semibold">{stage}</span>
              <span className={`${styles.mono} text-[10px] ${styles.hubMarker}`} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
