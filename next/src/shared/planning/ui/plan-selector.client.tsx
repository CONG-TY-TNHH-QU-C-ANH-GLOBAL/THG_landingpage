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
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

import { rovingIndex } from "@/shared/ui/roving";
import { SITUATIONS, SUPPLY_MODELS, type SituationId, type SupplyModel } from "../plan";

type Labels = Readonly<Record<string, string>>;

interface Props {
  labels: Labels;
  /** The server-rendered plans. Each must carry `data-situation` and `data-supply`. */
  children: ReactNode;
  /** The choices this selector offers. Narrowing either to a single member removes its question and
   *  pre-commits that answer — the group is hidden rather than rendered as a control with one option,
   *  because a radio group of one is a decision the reader is not actually being asked to make. */
  situations?: readonly SituationId[];
  supplyModels?: readonly SupplyModel[];
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
  // Generated rather than derived from `prefix`, so two planners on one page cannot label each
  // other's groups.
  const legendId = useId();
  // Before anything is chosen the first control is the tab stop, so the group is always reachable.
  const activeIndex = value ? options.indexOf(value) : 0;

  return (
    <div className="grid gap-3 content-start">
      <p className="type-label text-muted-foreground m-0" id={legendId}>
        {legend}
      </p>
      <div role="radiogroup" aria-labelledby={legendId} className="flex flex-wrap gap-2">
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
              className={`min-h-[44px] px-3.5 py-2 border rounded-md type-small text-left transition-colors duration-[260ms] ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                selected
                  ? "border-primary bg-primary text-primary-foreground font-semibold"
                  : "border-border bg-transparent text-foreground hover:border-primary"
              }`}
            >
              {labels[`${prefix}.${option}`]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function PlanSelector({ 
  labels, 
  children,
  situations = SITUATIONS,
  supplyModels = SUPPLY_MODELS
}: Readonly<Props>) {
  const [situation, setSituation] = useState<SituationId | null>(situations.length === 1 ? situations[0] : null);
  const [supply, setSupply] = useState<SupplyModel | null>(supplyModels.length === 1 ? supplyModels[0] : null);

  const showSituation = situations.length > 1;
  const showSupply = supplyModels.length > 1;
  const showSelectorPanel = showSituation || showSupply;

  return (
    <div className="w-full">
      {showSelectorPanel && (
        <div className={`grid grid-cols-1 ${showSituation && showSupply ? "md:grid-cols-2" : ""} gap-6 p-6 md:px-8 md:py-7 border border-border rounded-lg bg-card mb-6`}>
          {showSituation && (
            <ChoiceGroup
              legend={labels["ui.q_situation"]}
              options={situations}
              value={situation}
              onChange={setSituation}
              labels={labels}
              prefix="situation"
            />
          )}
          {showSupply && (
            <ChoiceGroup
              legend={labels["ui.q_supply"]}
              options={supplyModels}
              value={supply}
              onChange={setSupply}
              labels={labels}
              prefix="supply"
            />
          )}
        </div>
      )}

      {/* The narrowing surface. An attribute appears only once an answer exists, so the unanswered
          state needs no special handling anywhere. A live region announces what the set was narrowed
          to rather than re-reading every plan, and focus is never moved. */}
      <p className="my-6 type-label text-muted-foreground" role="status" aria-live="polite">
        {situation || supply ? (
          <span className="text-foreground">
            {[
              situation ? labels[`situation.${situation}`] : null,
              supply ? labels[`supply.${supply}`] : null
            ].filter(Boolean).join(" · ")}
          </span>
        ) : (
          labels["ui.all_plans"]
        )}
      </p>

      {/* Wrapping the children with transition-all to handle opacity and layout shifts over 260ms.
          Non-matching elements are zeroed out (h-0, opacity-0, overflow-hidden) instead of display: none 
          to allow the transition to run. */}
      <div
        className={`flex flex-col xl:flex-row xl:flex-wrap gap-6 [&>div]:w-full ${situation && supply ? "xl:[&>div]:w-full" : "xl:[&>div]:w-[calc(50%-12px)]"} [&>div]:transition-all [&>div]:duration-[260ms] [&>div]:ease-[cubic-bezier(0.16,1,0.3,1)] [&>div]:opacity-100 [&>div]:h-auto [&[data-situation="starting"]>[data-situation]:not([data-situation="starting"])]:opacity-0 [&[data-situation="starting"]>[data-situation]:not([data-situation="starting"])]:!h-0 [&[data-situation="starting"]>[data-situation]:not([data-situation="starting"])]:overflow-hidden [&[data-situation="starting"]>[data-situation]:not([data-situation="starting"])]:pointer-events-none [&[data-situation="starting"]>[data-situation]:not([data-situation="starting"])]:!m-0 [&[data-situation="starting"]>[data-situation]:not([data-situation="starting"])]:!p-0 [&[data-situation="starting"]>[data-situation]:not([data-situation="starting"])]:!border-0 [&[data-situation="expanding"]>[data-situation]:not([data-situation="expanding"])]:opacity-0 [&[data-situation="expanding"]>[data-situation]:not([data-situation="expanding"])]:!h-0 [&[data-situation="expanding"]>[data-situation]:not([data-situation="expanding"])]:overflow-hidden [&[data-situation="expanding"]>[data-situation]:not([data-situation="expanding"])]:pointer-events-none [&[data-situation="expanding"]>[data-situation]:not([data-situation="expanding"])]:!m-0 [&[data-situation="expanding"]>[data-situation]:not([data-situation="expanding"])]:!p-0 [&[data-situation="expanding"]>[data-situation]:not([data-situation="expanding"])]:!border-0 [&[data-situation="operating"]>[data-situation]:not([data-situation="operating"])]:opacity-0 [&[data-situation="operating"]>[data-situation]:not([data-situation="operating"])]:!h-0 [&[data-situation="operating"]>[data-situation]:not([data-situation="operating"])]:overflow-hidden [&[data-situation="operating"]>[data-situation]:not([data-situation="operating"])]:pointer-events-none [&[data-situation="operating"]>[data-situation]:not([data-situation="operating"])]:!m-0 [&[data-situation="operating"]>[data-situation]:not([data-situation="operating"])]:!p-0 [&[data-situation="operating"]>[data-situation]:not([data-situation="operating"])]:!border-0 [&[data-supply="custom"]>[data-supply]:not([data-supply="custom"])]:opacity-0 [&[data-supply="custom"]>[data-supply]:not([data-supply="custom"])]:!h-0 [&[data-supply="custom"]>[data-supply]:not([data-supply="custom"])]:overflow-hidden [&[data-supply="custom"]>[data-supply]:not([data-supply="custom"])]:pointer-events-none [&[data-supply="custom"]>[data-supply]:not([data-supply="custom"])]:!m-0 [&[data-supply="custom"]>[data-supply]:not([data-supply="custom"])]:!p-0 [&[data-supply="custom"]>[data-supply]:not([data-supply="custom"])]:!border-0 [&[data-supply="sourced"]>[data-supply]:not([data-supply="sourced"])]:opacity-0 [&[data-supply="sourced"]>[data-supply]:not([data-supply="sourced"])]:!h-0 [&[data-supply="sourced"]>[data-supply]:not([data-supply="sourced"])]:overflow-hidden [&[data-supply="sourced"]>[data-supply]:not([data-supply="sourced"])]:pointer-events-none [&[data-supply="sourced"]>[data-supply]:not([data-supply="sourced"])]:!m-0 [&[data-supply="sourced"]>[data-supply]:not([data-supply="sourced"])]:!p-0 [&[data-supply="sourced"]>[data-supply]:not([data-supply="sourced"])]:!border-0`}
        {...(situation ? { "data-situation": situation } : {})}
        {...(supply ? { "data-supply": supply } : {})}
      >
        {children}
      </div>
    </div>
  );
}
