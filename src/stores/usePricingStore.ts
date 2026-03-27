import { create } from "zustand";

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

export const usePricingStore = create<PricingState>((set, get) => ({
  origin: "vn",
  destination: "all",
  itemType: "normal",
  weight: null,
  currency: "USD",
  activeMainTab: "vn",
  globalWeight: null,

  setOrigin: (o) => set({ origin: o }),
  setDestination: (d) => set({ destination: d }),
  setItemType: (t) => set({ itemType: t }),
  setWeight: (w) => set({ weight: w, globalWeight: w }),
  setCurrency: (c) => set({ currency: c }),
  setActiveTab: (tab) => set({ activeMainTab: tab }),
  updateGlobalQuery: (weight, origin, dest, itemType) =>
    set({
      globalWeight: weight,
      origin: origin as "vn" | "cn",
      destination: dest,
      itemType: itemType as "normal" | "cosmetic" | "battery",
    }),
  formatPrice: (val) => {
    const { currency } = get();
    const { rate, locale, currency: cur } = RATES[currency];
    const converted = val * rate;
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: cur,
      maximumFractionDigits: currency === "VND" ? 0 : 2,
    }).format(converted);
  },
}));
