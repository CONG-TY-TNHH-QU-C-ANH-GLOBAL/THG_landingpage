"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { ScanLine, ShieldCheck, Package } from "lucide-react";

import type { FulfillStepCopy } from "../copy";
import styles from "./fulfill.module.css";

interface StepImage {
  src: string;
  alt: string;
  /** Which journey step this reference belongs to (0 = design input, 1–3 = finished unit). */
  step: number;
  /** Rendered width fraction of the stage (matches the prototype's per-state scale). */
  widthPct: number;
}

interface Props {
  steps: readonly FulfillStepCopy[];
  images: readonly StepImage[];
  hubStages: readonly string[];
  hubLabel: string;
  reference: string;
  /** Accessible name for the step tablist. */
  stepsLabel: string;
}

/** Roving-tabindex key handling: the next active tab index for a navigation key (with wraparound),
 *  or null when the key is not a tab-navigation key. */
function nextActiveIndex(key: string, active: number, last: number): number | null {
  switch (key) {
    case "ArrowDown":
    case "ArrowRight":
      return active === last ? 0 : active + 1;
    case "ArrowUp":
    case "ArrowLeft":
      return active === 0 ? last : active - 1;
    case "Home":
      return 0;
    case "End":
      return last;
    default:
      return null;
  }
}

/** Hub-panel marker for a stage relative to the viewed step: done ✓ / current ● / upcoming —. */
function hubStatusMarker(index: number, active: number): string {
  if (index < active) return "✓";
  if (index === active) return "●";
  return "—";
}

/** The operational icon shown on a step's index rail (QC step → shield, processing step → scan). */
function stepRailIcon(index: number) {
  if (index === 2) return <ShieldCheck className="w-4 h-4" aria-hidden="true" />;
  if (index === 1) return <ScanLine className="w-4 h-4" aria-hidden="true" />;
  return null;
}

// Focused client island: the journey's interactive state (WEB-002). The 4 step buttons form a
// keyboard-operable tablist; the visual stage is a decorative illustration (aria-hidden) that
// reflects the selected step through a data-attribute the scoped CSS reads — the textual steps
// carry all meaning, so no information is conveyed by motion or color alone. Props are minimal
// serializable presentation values (copy + local asset paths), never the page view model.
export default function JourneyStepper({
  steps,
  images,
  hubStages,
  hubLabel,
  reference,
  stepsLabel,
}: Readonly<Props>) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Handler lives on each tab button (the naturally-focusable, roving-tabindex targets) rather than
  // on the tablist container — the focused tab owns key handling, and the container stays a plain
  // structural role with no extra keyboard tab stop.
  function onTabKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const target = nextActiveIndex(e.key, active, steps.length - 1);
    if (target === null) return;
    e.preventDefault();
    setActive(target);
    btnRefs.current[target]?.focus();
  }

  return (
    <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
      {/* Visual stage — decorative illustration of the selected step. */}
      <div className="lg:col-span-7 lg:sticky lg:top-28 self-start">
        <div
          className={`${styles.stage} rounded-[2rem] border bg-[var(--fx-bg)]`}
          style={{ borderColor: "var(--fx-border)" }}
          data-step={active}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at center, rgba(0,0,0,0.03) 1px, transparent 1px)",
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

          {/* Static, illustrative Hub visibility panel — highlights the stage the viewer is on;
              no live order data, no fabricated statuses. */}
          <div className={`${styles.hub} ${styles.glass} p-4 rounded-2xl`}>
            <div
              className={`${styles.mono} text-[10px] tracking-widest uppercase mb-3`}
              style={{ color: "var(--fx-gray)" }}
            >
              {hubLabel}
            </div>
            <div className="space-y-1.5">
              {hubStages.map((stage, i) => (
                <div key={stage} className="flex justify-between items-center text-xs">
                  <span className="font-semibold">{stage}</span>
                  <span
                    className={`${styles.mono} text-[10px] ${styles.hubStage} ${
                      i === active ? styles.hubStageActive : ""
                    }`}
                    style={i === active ? undefined : { color: "var(--fx-gray)" }}
                  >
                    {hubStatusMarker(i, active)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className={`${styles.mono} mt-4 text-[11px] leading-relaxed`} style={{ color: "var(--fx-gray)" }}>
          {reference}
        </p>
      </div>

      {/* Step controls — keyboard-operable tablist. Key handling lives on the focusable tabs. */}
      <div
        className="lg:col-span-5 space-y-2"
        role="tablist"
        aria-label={stepsLabel}
        aria-orientation="vertical"
      >
        {steps.map((step, i) => {
          const selected = i === active;
          return (
            <button
              key={step.title}
              ref={(el) => {
                btnRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${i}`}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onTabKeyDown}
              className={`${styles.stepBtn} ${selected ? styles.stepBtnActive : ""} py-6`}
            >
              <span
                className={`${styles.mono} text-[11px] tracking-widest mb-2 flex items-center gap-2`}
                style={{ color: "var(--fx-blue)" }}
              >
                {step.index}
                {stepRailIcon(i)}
              </span>
              <span className="block text-2xl md:text-3xl font-bold mb-2 tracking-tight">
                {step.title}
              </span>
              <span className="block text-sm max-w-sm" style={{ color: "var(--fx-gray)" }}>
                {step.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
