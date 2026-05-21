import { useState, useEffect, useCallback } from "react";

export interface CurrencyRates {
    base: string;
    rates: Record<string, number>;
    lastUpdate: string;
}

const SUPPORTED = ["USD", "VND", "CNY", "EUR", "AUD", "GBP"] as const;
export type SupportedCurrency = typeof SUPPORTED[number];

export const CURRENCY_META: Record<SupportedCurrency, { flag: string; symbol: string }> = {
    USD: { flag: "us", symbol: "$" },
    VND: { flag: "vn", symbol: "₫" },
    CNY: { flag: "cn", symbol: "¥" },
    EUR: { flag: "eu", symbol: "€" },
    AUD: { flag: "au", symbol: "A$" },
    GBP: { flag: "gb", symbol: "£" },
};

export const SUPPORTED_CURRENCIES = SUPPORTED;

export function useCurrencyRates() {
    const [rates, setRates] = useState<Record<string, number>>({ USD: 1 });
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState("");

    const fetchRates = useCallback(async () => {
        try {
            // Always fetch from USD as base
            const res = await fetch("https://open.er-api.com/v6/latest/USD");
            const data = await res.json();
            if (data.result === "success") {
                setRates(data.rates);
                const d = new Date(data.time_last_update_utc);
                setLastUpdate(d.toLocaleDateString("vi-VN"));
            }
        } catch {
            // fallback silently — tables will keep showing USD
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRates();
    }, [fetchRates]);

    /**
     * Convert a USD price to the target currency.
     * Returns the formatted string with symbol.
     */
    const convert = useCallback(
        (usdAmount: number | undefined, targetCurrency: SupportedCurrency): string => {
            if (usdAmount === undefined || usdAmount === null) return "—";
            const rate = rates[targetCurrency] ?? 1;
            const converted = usdAmount * rate;
            const meta = CURRENCY_META[targetCurrency];

            if (targetCurrency === "VND") {
                return `${meta.symbol}${Math.round(converted).toLocaleString("vi-VN")}`;
            }
            return `${meta.symbol}${converted.toFixed(2)}`;
        },
        [rates]
    );

    return { rates, loading, lastUpdate, convert, fetchRates };
}
