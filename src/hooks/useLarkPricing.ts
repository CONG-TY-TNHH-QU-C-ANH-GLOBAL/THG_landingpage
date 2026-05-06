import { useState, useEffect, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   useLarkPricing — fetches pricing from Google Sheets API
   Live sync: every page load fetches fresh data from GSheet
   Dynamic tab discovery: auto-detects all sheet tabs
   ═══════════════════════════════════════════════════════════ */

const SPREADSHEET_ID = "1woNrfCqybDs0zYKbGnilchhXE6JaWLAsOJxN-pQO0e4";

interface UseLarkPricingResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    lastUpdated: string | null;
    isLive: boolean;
    refetch: () => void;
}

/**
 * Parse a CSV string into a 2D array.
 * Handles: quoted fields, newlines in quotes, $-prefixed prices, European numbers.
 */
function parseCSV(csv: string): any[][] {
    const rows: any[][] = [];
    let i = 0;
    const len = csv.length;

    while (i < len) {
        const row: any[] = [];
        while (i < len) {
            let value = "";
            if (csv[i] === '"') {
                i++;
                while (i < len) {
                    if (csv[i] === '"') {
                        if (i + 1 < len && csv[i + 1] === '"') {
                            value += '"';
                            i += 2;
                        } else {
                            i++;
                            break;
                        }
                    } else {
                        value += csv[i];
                        i++;
                    }
                }
            } else {
                while (i < len && csv[i] !== ',' && csv[i] !== '\n' && csv[i] !== '\r') {
                    value += csv[i];
                    i++;
                }
            }

            row.push(parseCSVValue(value.trim()));

            if (i < len && csv[i] === ',') {
                i++;
            } else {
                if (i < len && csv[i] === '\r') i++;
                if (i < len && csv[i] === '\n') i++;
                break;
            }
        }
        if (row.length > 0 && !(row.length === 1 && row[0] === null)) {
            rows.push(row);
        }
    }
    return rows;
}

/**
 * Parse a single CSV cell value intelligently.
 * Handles: "$9,92" → 9.92, "147.758" → 147758, "0,05" → 0.05, etc.
 */
function parseCSVValue(trimmed: string): any {
    if (trimmed === "") return null;
    if (trimmed === "-") return trimmed;

    // Strip currency symbols first: $, ₫, €
    const stripped = trimmed.replace(/^[$₫€]\s*/, "").replace(/\s*[$₫€]$/, "");

    // If it had a currency symbol, treat as a number
    if (stripped !== trimmed) {
        // Currency value like "$9,92" → strip $ → "9,92" → parse
        // Handle comma as decimal separator: "9,92" → 9.92
        const commaDecimal = stripped.match(/^(-?\d+),(\d{1,2})$/);
        if (commaDecimal) {
            const num = parseFloat(stripped.replace(",", "."));
            return isNaN(num) ? trimmed : num;
        }
        // Handle dot as thousands: "$1.234,56" → 1234.56
        const euroFull = stripped.match(/^(-?\d{1,3}(?:\.\d{3})*),(\d{1,2})$/);
        if (euroFull) {
            const num = parseFloat(stripped.replace(/\./g, "").replace(",", "."));
            return isNaN(num) ? trimmed : num;
        }
        // Standard number: "$12.50"
        const num = parseFloat(stripped.replace(/,/g, ""));
        return isNaN(num) ? trimmed : num;
    }

    // European integer: "147.758" → 147758 (dot as thousands separator)
    const euroIntMatch = trimmed.match(/^(-?\d{1,3}(?:\.\d{3})+)$/);
    if (euroIntMatch) {
        const num = parseInt(trimmed.replace(/\./g, ""), 10);
        return isNaN(num) ? trimmed : num;
    }

    // European decimal: "0,05" → 0.05
    const commaDecimalMatch = trimmed.match(/^(-?\d+),(\d+)$/);
    if (commaDecimalMatch) {
        const num = parseFloat(trimmed.replace(",", "."));
        return isNaN(num) ? trimmed : num;
    }

    // Standard number: "123.45" or "1,234"
    const num = parseFloat(trimmed.replace(/,/g, ""));
    if (!isNaN(num) && /^-?[\d.,]+$/.test(trimmed)) {
        return num;
    }

    return trimmed;
}

/**
 * Fetch a single sheet tab's data as CSV from Google Sheets.
 */
async function fetchSheetCSV(gid: string): Promise<any[][]> {
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}&_t=${Date.now()}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status} for gid=${gid}`);
    const csv = await res.text();
    return parseCSV(csv);
}

/**
 * Discover all sheet tab names and GIDs from the Google Sheet HTML page.
 * Falls back to a hardcoded list if discovery fails.
 */
async function discoverSheetTabs(): Promise<{ gid: string; title: string }[]> {
    try {
        // Fetch the published HTML version to discover tabs
        const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/htmlembed?_t=${Date.now()}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();

        // Parse tab names and GIDs from the HTML
        // The HTML contains <li> elements with id="sheet-button-XXX" where XXX is the gid
        const tabRegex = /id="sheet-button-(\d+)"[^>]*>(?:<[^>]+>)*([^<]+)/g;
        const tabs: { gid: string; title: string }[] = [];
        let match;
        while ((match = tabRegex.exec(html)) !== null) {
            tabs.push({ gid: match[1], title: match[2].trim() });
        }

        if (tabs.length > 0) {
            console.log(`[GSheet] 🔍 Auto-discovered ${tabs.length} sheet tabs`);
            return tabs;
        }
    } catch (e: any) {
        console.warn("[GSheet] Tab discovery failed, using fallback list:", e.message);
    }

    // Fallback: hardcoded tab list (will still fetch live data from each tab)
    return [
        { gid: "1339656958", title: "US domestic pricing" },
        { gid: "1726547706", title: "Epacket - Standard VN - WW (VNTHZXR)" },
        { gid: "460331483", title: "Epacket - Standard VN-WW Cosmestic (VNMUZXR)" },
        { gid: "1354933282", title: "Epacket - Priority USPS VN-US (YTYCPREC)" },
        { gid: "1303526787", title: "Epacket - Priority USPS CN-US (YTYCPREC)" },
        { gid: "1724664735", title: "Epacket - Standard CN - WW Regular (THPHR)" },
        { gid: "816556145", title: "Epacket - Standard CN - WW Cosmestic (MUZXR)" },
        { gid: "517556374", title: "Epacket - Standard CN - WW Battery (THZXR)" },
        { gid: "2081899437", title: "Ship by label CN-US" },
        { gid: "2067910410", title: "Express VN-US" },
        { gid: "283139992", title: "Express CN-US" },
        { gid: "1437367264", title: "Policy VN-YTYCPREC VN priority US" },
        { gid: "1366777313", title: "Policy VNTHZXR VN standard WW" },
        { gid: "1663964711", title: "Policy YTYCPREC priority CN US" },
        { gid: "1764855107", title: "Policy VNMUZXR standard VN WW(comestic)" },
        { gid: "535541764", title: "Policy THPHR (Standard CN hàng thường)" },
        { gid: "1814177658", title: "Policy MUZXR(Stand CN WW comestic)" },
        { gid: "1808506806", title: "Policy THZXR(Stand CN WW pin điện)" },
        { gid: "881296518", title: "EU Rate" },
        { gid: "520292955", title: "US remote zipcode" },
        { gid: "1481029298", title: "JP remote zipcode" },
        { gid: "949197496", title: "HR remote zipcode" },
        { gid: "690019559", title: "GB remote zipcode" },
        { gid: "540077708", title: "SE remote zipcode" },
        { gid: "141599363", title: "Re-delivery charge summary (Epacket)" },
    ];
}

/**
 * Fetches ALL sheets from Google Sheets.
 * Step 1: Auto-discover all tab names + GIDs
 * Step 2: Fetch each tab's CSV data in parallel
 * No caching — every page load gets the latest data.
 */
export function useLarkAllSheets<T = Record<string, { title: string; data: any[][] }>>(
    fallback: T
): UseLarkPricingResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);
    const [isLive, setIsLive] = useState(false);

    const fallbackRef = useRef(fallback);
    fallbackRef.current = fallback;

    const doFetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Step 1: Discover all tabs dynamically
            const tabs = await discoverSheetTabs();

            // Step 2: Fetch all sheet tabs in parallel
            const results = await Promise.allSettled(
                tabs.map(async (tab) => {
                    const csvData = await fetchSheetCSV(tab.gid);
                    return { gid: tab.gid, title: tab.title, data: csvData };
                })
            );

            const sheets: Record<string, { title: string; data: any[][] }> = {};
            let successCount = 0;

            results.forEach((result, idx) => {
                if (result.status === "fulfilled") {
                    const { gid, title, data: sheetData } = result.value;
                    sheets[gid] = { title, data: sheetData };
                    successCount++;
                } else {
                    console.warn(`[GSheet] Failed to fetch tab "${tabs[idx].title}":`, result.reason);
                }
            });

            if (successCount === 0) {
                throw new Error("All sheet fetches failed");
            }

            setData(sheets as unknown as T);
            setLastUpdated(new Date().toISOString());
            setIsLive(true);

            console.log(`[GSheet] ✅ Synced ${successCount}/${tabs.length} sheets from Google Sheets`);
        } catch (e: any) {
            console.warn("[GSheet] API failed, using fallback:", e.message);
            setError(e.message);
            setData(fallbackRef.current);
            setIsLive(false);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        doFetch();
    }, [doFetch]);

    return { data: data ?? fallback, loading, error, lastUpdated, isLive, refetch: doFetch };
}

/**
 * Fetch a specific sheet range (kept for backward compatibility).
 */
export function useLarkSheetRange<T = any[][]>(
    sheetId: string,
    _range: string,
    fallback: T
): UseLarkPricingResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);
    const [isLive, setIsLive] = useState(false);

    const doFetch = useCallback(async () => {
        setLoading(true);
        try {
            const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&gid=${encodeURIComponent(sheetId)}&_t=${Date.now()}`;
            const res = await fetch(url, { cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const csv = await res.text();
            const parsed = parseCSV(csv);
            setData(parsed as T);
            setLastUpdated(new Date().toISOString());
            setIsLive(true);
        } catch (e: any) {
            setError(e.message);
            setData(fallback);
            setIsLive(false);
        } finally {
            setLoading(false);
        }
    }, [sheetId]);

    useEffect(() => { doFetch(); }, [doFetch]);

    return { data: data ?? fallback, loading, error, lastUpdated, isLive, refetch: doFetch };
}

export default function useLarkPricing() {
    return null;
}
