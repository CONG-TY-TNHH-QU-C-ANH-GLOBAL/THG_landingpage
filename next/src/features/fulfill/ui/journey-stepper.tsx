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

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const last = steps.length - 1;
    let next = active;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    setActive(next);
    btnRefs.current[next]?.focus();
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
                    {i < active ? "✓" : i === active ? "●" : "—"}
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

      {/* Step controls — keyboard-operable tablist. */}
      <div
        className="lg:col-span-5 space-y-2"
        role="tablist"
        aria-label={stepsLabel}
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
      >
        {steps.map((step, i) => {
          const selected = i === active;
          const stepIcon =
            i === 2 ? (
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            ) : i === 1 ? (
              <ScanLine className="w-4 h-4" aria-hidden="true" />
            ) : null;
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
              className={`${styles.stepBtn} ${selected ? styles.stepBtnActive : ""} py-6`}
            >
              <span
                className={`${styles.mono} text-[11px] tracking-widest mb-2 flex items-center gap-2`}
                style={{ color: "var(--fx-blue)" }}
              >
                {step.index}
                {stepIcon}
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
