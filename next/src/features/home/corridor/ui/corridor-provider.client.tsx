"use client";

// The one piece of state the whole homepage shares. Five sections read it — the corridor's own
// questions, the matrix highlight, the two diagnostics, the recommendation and the waybill form —
// and they are deliberately separate components rather than one screen-sized island, so the state
// lives here instead of in any of them.
//
// Everything derived (the recommendation, the completion meter) is computed here from the pure
// model, never stored: an answer has exactly one home, so no two surfaces can disagree.
import { createContext, useContext, useState, type ReactNode } from "react";

import type { Locale } from "@/shared/i18n";
import {
  EMPTY_ANSWERS,
  generateWaybillCode,
  inferRecommendation,
  waybillCompletion,
  type CorridorAnswers,
  type Recommendation,
} from "../model/corridor-state";
import type { AskField } from "../model/questions";

interface CorridorContextValue {
  readonly lang: Locale;
  readonly answers: CorridorAnswers;
  readonly recommendation: Recommendation | null;
  readonly completion: { filled: number; total: number; percent: number };
  /** "" until the seller answers something — see the note on the code generator below. */
  readonly waybillCode: string;
  /** Tapping the selected option again clears it (every answer stays reversible). */
  setAsk: (field: AskField, value: string) => void;
  toggleChannel: (value: string) => void;
  setPain: (value: string) => void;
}

const CorridorContext = createContext<CorridorContextValue | null>(null);

export function useCorridor(): CorridorContextValue {
  const value = useContext(CorridorContext);
  if (!value) throw new Error("useCorridor must be used inside <CorridorProvider>");
  return value;
}

export function CorridorProvider({ lang, children }: Readonly<{ lang: Locale; children: ReactNode }>) {
  const [answers, setAnswers] = useState<CorridorAnswers>(EMPTY_ANSWERS);
  // Minted on the first answer rather than at mount: it is derived from Date + Math.random, so
  // producing it during render would mismatch hydration and producing it in an effect would be a
  // set-state-in-effect. The first answer is always a user event — a safe place to mint it — and
  // the code is never shown before then anyway.
  const [waybillCode, setWaybillCode] = useState("");

  function record(next: (current: CorridorAnswers) => CorridorAnswers) {
    const firstCode = generateWaybillCode(new Date(), Math.random());
    setWaybillCode((code) => code || firstCode);
    setAnswers(next);
  }

  const recommendation = inferRecommendation(answers);
  // Not memoised on purpose: this component re-renders only when an answer changes, which is
  // exactly when every consumer has to re-render anyway.
  const value: CorridorContextValue = {
    lang,
    answers,
    recommendation,
    completion: waybillCompletion(answers, recommendation),
    waybillCode,
    setAsk: (field, choice) =>
      record((current) => ({ ...current, [field]: current[field] === choice ? null : choice })),
    toggleChannel: (choice) =>
      record((current) => ({
        ...current,
        channels: current.channels.includes(choice)
          ? current.channels.filter((c) => c !== choice)
          : [...current.channels, choice],
      })),
    setPain: (choice) => record((current) => ({ ...current, pain: current.pain === choice ? null : choice })),
  };

  return <CorridorContext.Provider value={value}>{children}</CorridorContext.Provider>;
}
