import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Currency = "USD" | "VND" | "CNY";

interface PricingState {
  origin: "vn" | "cn";
  destination: string;
  itemType: "normal" | "cosmetic" | "battery";
  weight: number | null;
  currency: Currency;
  activeMainTab: string;
  globalWeight: number | null;

  setOrigin: (o: "vn" | "cn") => void;
  setDestination: (d: string) => void;
  setItemType: (t: "normal" | "cosmetic" | "battery") => void;
  setWeight: (w: number | null) => void;
  setCurrency: (c: Currency) => void;
  setActiveTab: (tab: string) => void;
  updateGlobalQuery: (weight: number | null, origin: string, dest: string, itemType: string) => void;
  formatPrice: (val: number) => string;
}

const RATES: Record<Currency, { rate: number; locale: string; currency: string }> = {
  USD: { rate: 1, locale: "en-US", currency: "USD" },
  VND: { rate: 25400, locale: "vi-VN", currency: "VND" },
  CNY: { rate: 7.2, locale: "zh-CN", currency: "CNY" },
};

const PricingContext = createContext<PricingState | undefined>(undefined);

export const PricingProvider = ({ children }: { children: ReactNode }) => {
  const [origin, setOrigin] = useState<"vn" | "cn">("vn");
  const [destination, setDestination] = useState("all");
  const [itemType, setItemType] = useState<"normal" | "cosmetic" | "battery">("normal");
  const [weight, setWeightState] = useState<number | null>(null);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [activeMainTab, setActiveTab] = useState("vn");
  const [globalWeight, setGlobalWeight] = useState<number | null>(null);

  const setWeight = useCallback((w: number | null) => {
    setWeightState(w);
    setGlobalWeight(w);
  }, []);

  const updateGlobalQuery = useCallback(
    (w: number | null, o: string, d: string, it: string) => {
      setGlobalWeight(w);
      setOrigin(o as "vn" | "cn");
      setDestination(d);
      setItemType(it as "normal" | "cosmetic" | "battery");
    },
    []
  );

  const formatPrice = useCallback(
    (val: number) => {
      const { rate, locale, currency: cur } = RATES[currency];
      const converted = val * rate;
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: cur,
        maximumFractionDigits: currency === "VND" ? 0 : 2,
      }).format(converted);
    },
    [currency]
  );

  return (
    <PricingContext.Provider
      value={{
        origin, destination, itemType, weight, currency, activeMainTab, globalWeight,
        setOrigin, setDestination, setItemType, setWeight, setCurrency, setActiveTab,
        updateGlobalQuery, formatPrice,
      }}
    >
      {children}
    </PricingContext.Provider>
  );
};

export const usePricingStore = (): PricingState => {
  const context = useContext(PricingContext);
  if (!context) throw new Error("usePricingStore must be used within PricingProvider");
  return context;
};
