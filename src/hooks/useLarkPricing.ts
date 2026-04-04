import { useState, useEffect, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   useLarkPricing — fetches pricing from Lark Sheet API
   with localStorage caching and hardcoded fallback
   ═══════════════════════════════════════════════════════════ */

const CACHE_PREFIX = "thg_lark_pricing_";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

interface CacheEntry<T> {
    data: T;
    fetchedAt: string;
    expiresAt: number;
}

interface UseLarkPricingResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    lastUpdated: string | null;
    isLive: boolean; // true = from Lark, false = fallback
    refetch: () => void;
}

function getCached<T>(key: string): CacheEntry<T> | null {
    try {
        const raw = localStorage.getItem(CACHE_PREFIX + key);
        if (!raw) return null;
        const entry: CacheEntry<T> = JSON.parse(raw);
        if (Date.now() > entry.expiresAt) {
            localStorage.removeItem(CACHE_PREFIX + key);
            return null;
        }
        return entry;
    } catch {
        return null;
    }
}

function setCache<T>(key: string, data: T, fetchedAt: string) {
    const entry: CacheEntry<T> = {
        data,
        fetchedAt,
        expiresAt: Date.now() + CACHE_TTL_MS,
    };
    try {
        localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
    } catch {
        // storage full — silently ignore
    }
}

/**
 * Fetch ALL sheets from the Lark spreadsheet.
 * Returns a map of sheetId → { title, data[][] }
 */
export function useLarkAllSheets<T = Record<string, { title: string; data: any[][] }>>(
    fallback: T
): UseLarkPricingResult<T> {
    return useLarkPricing<T>("__all__", null, null, fallback, async () => {
        const res = await fetch("https://lark-pricing-api.aged-glitter-6ca8.workers.dev/?sheets=all");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!json.ok) throw new Error(json.error || "API error");
        return { data: json.sheets as T, fetchedAt: json.fetchedAt };
    });
}

/**
 * Fetch a specific sheet range.
 */
export function useLarkSheetRange<T = any[][]>(
    sheetId: string,
    range: string,
    fallback: T
): UseLarkPricingResult<T> {
    return useLarkPricing<T>(sheetId, sheetId, range, fallback, async () => {
        const res = await fetch(`https://lark-pricing-api.aged-glitter-6ca8.workers.dev/?sheet=${encodeURIComponent(sheetId)}&range=${encodeURIComponent(range)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!json.ok) throw new Error(json.error || "API error");
        return { data: json.data as T, fetchedAt: json.fetchedAt };
    });
}

/** Core implementation */
function useLarkPricing<T>(
    cacheKey: string,
    _sheetId: string | null,
    _range: string | null,
    fallback: T,
    fetcher: () => Promise<{ data: T; fetchedAt: string }>
): UseLarkPricingResult<T> {
    const [data, setData] = useState<T | null>(() => {
        const cached = getCached<T>(cacheKey);
        return cached ? cached.data : null;
    });
    const [loading, setLoading] = useState(!getCached(cacheKey));
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string | null>(() => {
        const cached = getCached<T>(cacheKey);
        return cached ? cached.fetchedAt : null;
    });
    const [isLive, setIsLive] = useState(!!getCached(cacheKey));

    const fetcherRef = useRef(fetcher);
    fetcherRef.current = fetcher;
    const fallbackRef = useRef(fallback);
    fallbackRef.current = fallback;

    const doFetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetcherRef.current();
            setData(result.data);
            setLastUpdated(result.fetchedAt);
            setIsLive(true);
            setCache(cacheKey, result.data, result.fetchedAt);
        } catch (e: any) {
            console.warn("[useLarkPricing] API failed, using fallback:", e.message);
            setError(e.message);
            if (!getCached(cacheKey)) {
                setData(fallbackRef.current);
                setIsLive(false);
            }
        } finally {
            setLoading(false);
        }
    }, [cacheKey]);

    useEffect(() => {
        // If cache exists and is fresh, skip API call
        const cached = getCached<T>(cacheKey);
        if (cached) {
            setData(cached.data);
            setLastUpdated(cached.fetchedAt);
            setIsLive(true);
            setLoading(false);
            return;
        }
        doFetch();
    }, [cacheKey]); // Removed doFetch to prevent infinite loop

    return { data: data ?? fallback, loading, error, lastUpdated, isLive, refetch: doFetch };
}

export default useLarkPricing;
