"use client";

// PLAN SELECTOR — the only interactive part of the planner, and it is deliberately tiny.
//
// It holds two answers. It does not evaluate anything, it does not hold plan content, and it never
// receives a Plan: the server renders EVERY plan as static HTML and this component only narrows which
// ones remain visible, by setting two attributes that CSS matches against.
//
// Consequences of that split, all of them the point:
//
//   · a crawler and a JS-disabled visitor see ALL plans in full — a real answer, not a stub
//   · the planning engine never ships to the browser
//   · answering ONE question narrows six plans to two, which is progressive disclosure achieved
//     through data rather than through choreography
//   · before either question is answered there are no attributes, so the server's markup is already
//     the correct "nothing known yet" state — no mount effect, no hydration flicker
//
// Generic on purpose: it knows situations, supply models and its own label keys. Any service that can
// produce plans reuses it unchanged.
//
// Labels arrive as a plain record, not a resolver function: this is a client boundary, and a function
// cannot cross it. The ids read below are the contract; the server resolves them and passes strings,
// so the label system — and every locale in it — stays server-side.
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

import { rovingIndex } from "@/shared/ui/roving";
import { SITUATIONS, SUPPLY_MODELS, type SituationId, type SupplyModel } from "../plan";
import styles from "./plan-selector.module.css";

type Labels = Readonly<Record<string, string>>;

interface Props {
  labels: Labels;
  /** The server-rendered plans. Each must carry `data-situation` and `data-supply`. */
  children: ReactNode;
}

function ChoiceGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
  labels,
  prefix,
}: Readonly<{
  legend: string;
  options: readonly T[];
  value: T | null;
  onChange: (next: T) => void;
  labels: Labels;
  prefix: string;
}>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  // Before anything is chosen the first control is the tab stop, so the group is always reachable.
  const activeIndex = value ? options.indexOf(value) : 0;

  return (
    <div className={styles.group}>
      <p className={`${styles.legend} type-label`} id={`${prefix}-legend`}>
        {legend}
      </p>
      <div role="radiogroup" aria-labelledby={`${prefix}-legend`} className={styles.options}>
        {options.map((option, i) => {
          const selected = option === value;
          return (
            <button
              key={option}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={i === activeIndex ? 0 : -1}
              onClick={() => onChange(option)}
              onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
                const target = rovingIndex(e.key, activeIndex, options.length - 1);
                if (target === null) return;
                e.preventDefault();
                onChange(options[target]);
                refs.current[target]?.focus();
              }}
              className={`${styles.option} ${selected ? styles.optionOn : ""}`}
            >
              {labels[`${prefix}.${option}`]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function PlanSelector({ labels, children }: Readonly<Props>) {
  const [situation, setSituation] = useState<SituationId | null>(null);
  const [supply, setSupply] = useState<SupplyModel | null>(null);

  return (
    <div className={styles.selector}>
      <div className={styles.questions}>
        <ChoiceGroup
          legend={labels["ui.q_situation"]}
          options={SITUATIONS}
          value={situation}
          onChange={setSituation}
          labels={labels}
          prefix="situation"
        />
        <ChoiceGroup
          legend={labels["ui.q_supply"]}
          options={SUPPLY_MODELS}
          value={supply}
          onChange={setSupply}
          labels={labels}
          prefix="supply"
        />
      </div>

      {/* The narrowing surface. An attribute appears only once an answer exists, so the unanswered
          state needs no special handling anywhere. A live region announces what the set was narrowed
          to rather than re-reading every plan, and focus is never moved. */}
      <p className={styles.status} role="status" aria-live="polite">
        {situation && supply ? (
          <span className={styles.statusValue}>
            {labels[`situation.${situation}`]} · {labels[`supply.${supply}`]}
          </span>
        ) : (
          labels["ui.all_plans"]
        )}
      </p>

      <div
        className={styles.stack}
        {...(situation ? { "data-situation": situation } : {})}
        {...(supply ? { "data-supply": supply } : {})}
      >
        {children}
      </div>
    </div>
  );
}
