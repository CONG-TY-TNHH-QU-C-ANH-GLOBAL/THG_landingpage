import { createContext, useContext, ReactNode } from "react";
import { useLarkAllSheets } from "@/hooks/useLarkPricing";

/* ═══════════════════════════════════════════════════════════
   LarkPricingProvider
   
   Fetches ALL sheets from Lark and exposes raw data + metadata.
   Pages transform this data into their specific formats.
   Falls back to null (no override) when API is unavailable.
   ═══════════════════════════════════════════════════════════ */

interface LarkPricingContextType {
    /** Raw sheets data: sheetId → { title, data[][] } */
    sheets: Record<string, { title: string; data: any[][] }> | null;
    loading: boolean;
    error: string | null;
    lastUpdated: string | null;
    isLive: boolean;
    refetch: () => void;
}

const LarkPricingContext = createContext<LarkPricingContextType>({
    sheets: null,
    loading: false,
    error: null,
    lastUpdated: null,
    isLive: false,
    refetch: () => { },
});

export function transformSheetToEpacketData(rows: any[][], liveRates?: Record<string, number> | null): any[] {
    if (!rows || rows.length < 2) return [];

    const mapByKg: Record<number, any> = {};
    const meta: Record<string, string> = {};

    // ── Auto-detect which row is the ACTUAL header (contains "weight") ──
    // VN sheets: row 0 = header. CN sheets: row 0 = SLA, row 1 = header.
    let headerRowIdx = 0;
    for (let r = 0; r < Math.min(3, rows.length); r++) {
        if (rows[r] && rows[r].some((c: any) => typeof c === 'string' && c.toLowerCase().includes('weight'))) {
            headerRowIdx = r;
            break;
        }
    }

    const headers = rows[headerRowIdx].map((h: any) => String(h ?? "").toLowerCase().trim());
    const isVndColumn: boolean[] = headers.map(() => false);

    // ── Check for SLA info in the row ABOVE the header (CN sheets: row 0 = SLA) ──
    if (headerRowIdx > 0) {
        const slaRow = rows[headerRowIdx - 1];
        if (slaRow) {
            headers.forEach((h: string, i: number) => {
                const val = slaRow[i];
                if (val && typeof val === 'string' && (val.includes('bsd') || val.includes('days'))) {
                    const key = h.replace(/\d+-\d+\s*(?:working\s*days|bsd)/gi, "").replace(/\(.*?\)/g, "").replace(/[\n\r]/g, " ").replace(/\bvnd\b/gi, "").replace(/\busd\b/gi, "").trim().replace(/\s+/g, "_").replace(/_+$/, "").replace(/^_+/, "");
                    if (key && key !== '-' && key !== '') meta[key] = val.trim();
                }
            });
        }
    }

    // ── Scan rows BELOW the header for sub-headers (VND markers, SLA) ──
    let startRow = headerRowIdx + 1;
    for (let sr = headerRowIdx + 1; sr <= headerRowIdx + 2 && sr < rows.length; sr++) {
        const subRow = rows[sr];
        if (!subRow) break;
        const isSubHeader = subRow.some((val: any) =>
            typeof val === 'string' && (val.includes('days') || val.includes('bsd') || val.toUpperCase().includes('VND'))
        );
        if (!isSubHeader) break;

        startRow = sr + 1;
        headers.forEach((h: string, i: number) => {
            const val = subRow[i];
            if (val && typeof val === 'string') {
                if (val.includes('days') || val.includes('bsd')) {
                    const key = h.replace(/\d+-\d+\s*(?:working\s*days|bsd)/gi, "").replace(/\(.*?\)/g, "").replace(/[\n\r]/g, " ").replace(/\bvnd\b/gi, "").replace(/\busd\b/gi, "").trim().replace(/\s+/g, "_").replace(/_+$/, "").replace(/^_+/, "");
                    if (key && key !== '-' && key !== '') meta[key] = val.trim();
                }
                if (val.toUpperCase().includes('VND')) {
                    isVndColumn[i] = true;
                }
            }
        });
    }

    // ── Also detect VND in the header name itself (e.g. "United States\nVND") ──
    headers.forEach((h: string, i: number) => {
        if (h.includes('vnd') || h.includes('vnđ')) {
            isVndColumn[i] = true;
        }
    });

    // ── Extract SLA from merged CSV headers ──
    // Google Sheets CSV export merges multi-row headers into one string
    // Matches both "5-12 working days" (VN tabs) and "6-10 bsd" (CN tabs)
    const SLA_PATTERN = /(\d+-\d+\s*(?:working\s*days|bsd))/i;
    const SLA_STRIP = /\d+-\d+\s*(?:working\s*days|bsd)/gi;
    headers.forEach((h: string) => {
        const slaMatch = h.match(SLA_PATTERN);
        if (slaMatch) {
            const key = h
                .replace(SLA_STRIP, "")
                .replace(/\(.*?\)/g, "")
                .replace(/[\n\r]/g, " ")
                .replace(/\bvnd\b/gi, "")
                .replace(/\busd\b/gi, "")
                .trim()
                .replace(/\s+/g, "_")
                .replace(/_+$/, "")
                .replace(/^_+/, "");
            if (key && key !== '-' && key !== '') {
                meta[key] = slaMatch[1].trim();
            }
        }
    });

    // ── Skip empty rows between sub-headers and first data row ──
    while (startRow < rows.length && rows[startRow] && rows[startRow].every((v: any) => v === null || v === undefined || v === '')) {
        startRow++;
    }

    // ── Build column groups: each weight column defines weights for the following country columns ──
    const weightColIndices: number[] = [];
    headers.forEach((h, i) => {
        if (h === "kg" || h === "weight" || (h.includes("weight") && h.includes("kg"))) {
            weightColIndices.push(i);
        }
    });
    // For each country column, find which weight column governs it
    const colWeightSource: number[] = headers.map((_, i) => {
        let best = weightColIndices[0] ?? 0;
        for (const wi of weightColIndices) {
            if (wi <= i) best = wi; else break;
        }
        return best;
    });

    // Process data rows — track lastWeight per weight column independently
    const lastWeightPerCol: Record<number, number> = {};
    for (let r = startRow; r < rows.length; r++) {
        const row = rows[r];
        // Parse weight for each weight column first
        const weightForCol: Record<number, number | null> = {};
        for (const wi of weightColIndices) {
            const rawVal = row[wi];
            if (rawVal !== null && rawVal !== undefined && rawVal !== "") {
                let w: number | null = null;
                if (typeof rawVal === "number") {
                    w = rawVal;
                } else {
                    const str = String(rawVal).replace(/,/g, "");
                    const formulaMatch = str.match(/^([0-9.]+)\+[A-Za-z]/);
                    if (formulaMatch && lastWeightPerCol[wi] !== undefined) {
                        const increment = parseFloat(formulaMatch[1]);
                        w = isNaN(increment) ? null : Math.round((lastWeightPerCol[wi] + increment) * 1000) / 1000;
                    } else {
                        const parsed = parseFloat(str.replace(/\+.*/, ""));
                        w = isNaN(parsed) ? null : parsed;
                    }
                }
                if (w !== null) lastWeightPerCol[wi] = w;
                weightForCol[wi] = w;
            } else {
                weightForCol[wi] = null;
            }
        }

        // Process country columns
        headers.forEach((h, i) => {
            // Skip weight columns and empty/stt headers
            if (weightColIndices.includes(i)) return;
            if (!h || h === "" || h === "stt") return;

            const rawVal = row[i];
            const currentWeight = weightForCol[colWeightSource[i]];
            if (currentWeight === null || currentWeight === undefined || isNaN(currentWeight)) return;
            if (rawVal === null || rawVal === undefined || rawVal === "" || rawVal === "-") return;

            const isContact = String(rawVal).toLowerCase().includes("liên hệ") || String(rawVal).toLowerCase() === "contact";
            if (isContact) {
                if (!mapByKg[currentWeight]) mapByKg[currentWeight] = { kg: currentWeight };
                const cKey = h.replace(/\d+-\d+\s*(?:working\s*days|bsd)/gi, "").replace(/\(.*?\)/g, "").trim().replace(/\s+/g, "_").replace(/_+$/, "").replace(/^_+/, "");
                mapByKg[currentWeight][cKey] = "Liên hệ";
                return;
            }

            let num = typeof rawVal === "number" ? rawVal : parseFloat(String(rawVal).replace(/,/g, "").replace(/\$/g, ""));
            if (!isNaN(num)) {
                // Raw values from Lark — no VND→USD conversion

                if (!mapByKg[currentWeight]) mapByKg[currentWeight] = { kg: currentWeight };

                // Clean header key: strip (vnd), newlines, trailing _vnd/_usd, etc.
                const cKey = h
                    .replace(/\d+-\d+\s*(?:working\s*days|bsd)/gi, "")  // strip "5-12 working days" or "6-10 bsd"
                    .replace(/\(.*?\)/g, "")    // strip (vnd), (usd), etc.
                    .replace(/[\n\r]/g, " ")    // newlines → space
                    .replace(/\bvnd\b/gi, "")   // strip standalone "vnd"
                    .replace(/\busd\b/gi, "")   // strip standalone "usd"
                    .trim()
                    .replace(/\s+/g, "_")       // spaces → underscore
                    .replace(/_+$/, "")         // strip trailing underscores
                    .replace(/^_+/, "");        // strip leading underscores
                if (!cKey) return; // skip if key is empty after cleaning
                mapByKg[currentWeight][cKey] = num;

                // Also try mapping standard 2-letter codes for backward compatibility
                const fallbackMatches = ["us", "uk", "fr", "de", "it", "es", "au", "ca", "nz", "sg", "jp", "hk", "th", "tw", "nl", "be", "se"];
                for (const fb of fallbackMatches) {
                    if (h.startsWith(fb) || h.includes(` ${fb} `)) {
                        mapByKg[currentWeight][fb] = num;
                    }
                }
            }
        });
    }

    const result = Object.values(mapByKg).sort((a: any, b: any) => a.kg - b.kg);
    (result as any).meta = meta;
    return result;
}

/**
 * Transforms a 2D array from Lark into the domesticPricing format.
 * 
 * Expected sheet layout:
 *   Row 0 (header): ["STT", "Weight Not Over (in ounces)", "Gram", "Zone 1", ..., "Zone 9"]
 *   Row 1+:         ["1",   "4 oz",                      "113 gram", "5,04$", ...]
 */
export function transformSheetToDomesticData(rows: any[][]): any[] {
    if (!rows || rows.length < 2) return [];
    const headers = rows[0].map((h: any) => String(h).trim());
    return rows.slice(1).map(row => {
        const obj: any = {};
        headers.forEach((key, i) => {
            obj[key] = row[i] !== null && row[i] !== undefined ? String(row[i]) : "";
        });
        return obj;
    }).filter(r => r.STT || r["Weight Not Over (in ounces)"]);
}

/**
 * Transforms Lark sheet data into the BulkZone format for Express pricing.
 * 
 * Expected sheet layout:
 *   Row 0 (header): ["Zone", "12", "50", "100", "300", "500", "SLA"]
 *   Row 1+:         ["West", 4.5, 4.2, 3.8, 3.5, 3.2, "3-5 days"]
 */
export function transformSheetToBulkData(rows: any[][]): any[] {
    if (!rows || rows.length < 2) return [];
    const headers = rows[0].map((h: any) => String(h).trim());
    return rows.slice(1).map(row => {
        const name = String(row[0] ?? "");
        const sla = String(row[headers.length - 1] ?? "");
        const prices: Record<number, number> = {};
        headers.slice(1, -1).forEach((h, i) => {
            const w = parseFloat(h);
            const v = row[i + 1];
            if (!isNaN(w) && v !== null && v !== undefined) {
                const num = typeof v === "number" ? v : parseFloat(String(v).replace(/,/g, ""));
                if (!isNaN(num)) prices[w] = num;
            }
        });
        return { name, prices, sla };
    });
}

export function transformSheetToVnUsExpress(rows: any[][], liveRates?: Record<string, number> | null): any {
    if (!rows || rows.length < 2) return null;

    const hcm: { saver: any[], expedited: any[] } = { saver: [], expedited: [] };
    const hn: { saver: any[], expedited: any[] } = { saver: [], expedited: [] };

    // Function to parse price strings to numbers (VND usually)
    const parsePrice = (val: any) => {
        if (!val) return null;
        if (typeof val === "number") return val;
        // e.g. "1.387.634" -> 1387634, or "260.000 vnd/kg" -> 260000
        const str = String(val).toLowerCase();
        if (str.includes("liên hệ") || str.includes("contact")) return "Liên hệ";
        const num = parseFloat(str.replace(/\./g, "").replace(/,/g, "").replace(/\$|vnd|\/kg/g, "").trim());
        return isNaN(num) ? str : num;
    };

    // Keep raw price from Lark — no VND→USD conversion
    const toUsd = (val: any) => val;

    rows.slice(1).forEach(row => {
        // Col 0: Saver weight
        const w1 = row[0];
        if (w1 !== null && w1 !== undefined && String(w1).trim() !== "") {
            const kg = typeof w1 === "number" ? w1 : parseFloat(String(w1));
            const hcmPrice = toUsd(parsePrice(row[1]));
            const hnPrice = toUsd(parsePrice(row[2]));

            if (!isNaN(kg)) {
                hcm.saver.push({ kg, price: hcmPrice });
                hn.saver.push({ kg, price: hnPrice });
            }
        }

        // Col 3: Expedited weight bracket
        const w2 = row[3];
        if (w2 !== null && w2 !== undefined && String(w2).trim() !== "") {
            const bracket = String(w2).trim();
            const hcmPrice = toUsd(parsePrice(row[4]));
            const hnPrice = toUsd(parsePrice(row[5]));

            hcm.expedited.push({ bracket, price: hcmPrice });
            hn.expedited.push({ bracket, price: hnPrice });
        }
    });

    return { hcm, hn };
}

export function LarkPricingProvider({ children }: { children: ReactNode }) {
    const { data, loading, error, lastUpdated, isLive, refetch } = useLarkAllSheets<
        Record<string, { title: string; data: any[][] }>
    >({});

    return (
        <LarkPricingContext.Provider
            value={{
                sheets: data && Object.keys(data).length > 0 ? data : null,
                loading,
                error,
                lastUpdated,
                isLive,
                refetch,
            }}
        >
            {children}
        </LarkPricingContext.Provider>
    );
}

export function useLarkPricingContext() {
    return useContext(LarkPricingContext);
}

/**
 * SyncBadge — small UI indicator showing sync status.
 * Can be placed anywhere on the pricing pages.
 */
export function SyncBadge() {
    const { isLive, loading, lastUpdated } = useLarkPricingContext();

    if (loading) {
        return (
            <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                Đang đồng bộ bảng giá...
            </span>
        );
    }

    if (isLive && lastUpdated) {
        const time = new Date(lastUpdated).toLocaleString("vi-VN", {
            hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit"
        });
        return (
            <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Đồng bộ từ Google Sheets · {time}
            </span>
        );
    }

    return null;
}
