"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

import styles from "./service.module.css";

export interface ServiceWorkflowStep {
  /** Stable key owned by the caller. */
  id: string;
  /** Short rail label, e.g. "01" or "STEP 1". "" renders nothing. */
  index?: string;
  title: string;
  description: string;
  /** Optional per-step rail glyph (already an element, so this layer stays icon-library agnostic). */
  icon?: ReactNode;
}

interface Props {
  /** 3–6 steps. Fewer than 2 is not a workflow; more than 6 stops being scannable. */
  steps: readonly ServiceWorkflowStep[];
  /** Accessible name for the step tablist. */
  label: string;
  /** Feature-owned illustration. Receives the active index through `data-step` on its wrapper,
   *  so the art can react in CSS without this layer knowing anything about it. */
  stage?: ReactNode;
  /** Class applied to the stage wrapper — the feature's own art container. */
  stageClassName?: string;
  /** Caption under the stage. */
  reference?: string;
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

/**
 * The interactive workflow timeline shared by every service page.
 *
 * The step buttons form a keyboard-operable vertical tablist (roving tabindex, arrows/Home/End);
 * the stage beside them is decorative and reflects the selected step through a data attribute the
 * feature's own CSS reads. The textual steps carry all meaning, so nothing is conveyed by motion
 * or colour alone, and the reduced-motion rule in service.module.css disables the transitions.
 *
 * This is the only client island in the template: the state is genuinely interactive and cannot
 * be expressed server-side.
 */
export function ServiceWorkflow({
  steps,
  label,
  stage,
  stageClassName = "",
  reference,
}: Readonly<Props>) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Handler lives on each tab button (the naturally-focusable, roving-tabindex targets) rather
  // than on the tablist container — the focused tab owns key handling, and the container stays a
  // plain structural role with no extra keyboard tab stop.
  function onTabKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const target = nextActiveIndex(e.key, active, steps.length - 1);
    if (target === null) return;
    e.preventDefault();
    setActive(target);
    btnRefs.current[target]?.focus();
  }

  return (
    <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
      {stage ? (
        <div className="lg:col-span-7 lg:sticky lg:top-28 self-start">
          <div className={stageClassName} data-step={active} aria-hidden="true">
            {stage}
          </div>
          {reference ? (
            <p
              className={`${styles.mono} mt-4 text-[11px] leading-relaxed`}
              style={{ color: "var(--svc-muted)" }}
            >
              {reference}
            </p>
          ) : null}
        </div>
      ) : null}

      <div
        className={`${stage ? "lg:col-span-5" : "lg:col-span-12"} space-y-2`}
        role="tablist"
        aria-label={label}
        aria-orientation="vertical"
      >
        {steps.map((step, i) => {
          const selected = i === active;
          return (
            <button
              key={step.id}
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
              {step.index || step.icon ? (
                <span
                  className={`${styles.mono} text-[11px] tracking-widest mb-2 flex items-center gap-2`}
                  style={{ color: "var(--svc-accent)" }}
                >
                  {step.index}
                  {step.icon}
                </span>
              ) : null}
              <span className="block text-2xl md:text-3xl font-bold mb-2 tracking-tight">
                {step.title}
              </span>
              <span className="block text-sm max-w-sm" style={{ color: "var(--svc-muted)" }}>
                {step.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
