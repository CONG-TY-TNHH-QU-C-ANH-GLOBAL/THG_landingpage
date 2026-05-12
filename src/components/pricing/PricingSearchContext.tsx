// Bundles the international-pricing search state so SearchWidget consumes one
// hook instead of 11 props. The parent page derives `searchCountries` and
// `estimatedPrice` from this state via `usePricingSearch()`; those derived
// values stay outside the context and flow into SearchWidget as direct props.

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export interface PricingSearchState {
  searchFrom: string;
  searchTo: string;
  searchSvc: string;
  searchCargo: string;
  searchWeight: number;
  showResult: boolean;
  searchTrigger: number;
}

export interface PricingSearchSetters {
  setSearchFrom: (v: string) => void;
  setSearchTo: (v: string) => void;
  setSearchSvc: (v: string) => void;
  setSearchCargo: (v: string) => void;
  setSearchWeight: (v: number) => void;
  /** Bump trigger + flip showResult on; subscribers re-run their derivations. */
  runSearch: () => void;
}

type ContextValue = PricingSearchState & PricingSearchSetters;

const PricingSearchContext = createContext<ContextValue | null>(null);

export function PricingSearchProvider({ children }: { children: ReactNode }) {
  const [searchFrom, setSearchFrom] = useState("VN");
  const [searchTo, setSearchTo] = useState("ALL");
  const [searchSvc, setSearchSvc] = useState("epacket");
  const [searchCargo, setSearchCargo] = useState("standard");
  const [searchWeight, setSearchWeight] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [searchTrigger, setSearchTrigger] = useState(0);

  const value = useMemo<ContextValue>(
    () => ({
      searchFrom, searchTo, searchSvc, searchCargo, searchWeight,
      showResult, searchTrigger,
      setSearchFrom, setSearchTo, setSearchSvc, setSearchCargo, setSearchWeight,
      runSearch: () => {
        setSearchTrigger((p) => p + 1);
        setShowResult(true);
      },
    }),
    [searchFrom, searchTo, searchSvc, searchCargo, searchWeight, showResult, searchTrigger],
  );

  return <PricingSearchContext.Provider value={value}>{children}</PricingSearchContext.Provider>;
}

export function usePricingSearch(): ContextValue {
  const ctx = useContext(PricingSearchContext);
  if (!ctx) throw new Error("usePricingSearch must be used inside <PricingSearchProvider>");
  return ctx;
}
