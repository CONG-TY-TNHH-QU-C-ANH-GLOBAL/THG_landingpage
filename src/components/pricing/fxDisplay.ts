/* Hiển thị đổi VNĐ ⇄ USD trên bảng giá. Tỉ giá (VNĐ / 1 USD) do CMS lưu ở
   schema.fx_rate của từng bảng; không có tỉ giá hợp lệ thì không đổi gì và
   không hiện nút. Khoảng hợp lệ trùng CMS để gõ nhầm "25.4" không lên web. */
export type PriceCurrency = "VND" | "USD";

const MIN_FX = 1000;
const MAX_FX = 1_000_000;

export function readFxRate(schema: unknown): number | null {
    if (!schema || typeof schema !== "object" || Array.isArray(schema)) return null;
    const v = (schema as Record<string, unknown>).fx_rate;
    return typeof v === "number" && Number.isFinite(v) && v >= MIN_FX && v <= MAX_FX ? v : null;
}

/** Tiền tệ CMS ghi cho bảng (schema.currency). Bảng VN có thể đã được đổi cả
 *  bảng sang USD trên CMS, nên không được đoán theo tuyến. null = không ghi. */
export function readTableCurrency(schema: unknown): PriceCurrency | null {
    if (!schema || typeof schema !== "object" || Array.isArray(schema)) return null;
    const c = String((schema as Record<string, unknown>).currency ?? "").toUpperCase();
    return c === "VND" || c === "USD" ? c : null;
}

/** Ký hiệu cho PriceTable: theo tiền tệ CMS ghi, không có thì theo mặc định của panel. */
export function symbolFor(currency: PriceCurrency | null | undefined, fallback: "₫" | "$"): "₫" | "$" {
    if (currency === "VND") return "₫";
    if (currency === "USD") return "$";
    return fallback;
}

/** Tiền tệ gốc của bảng suy ra từ ký hiệu mà panel truyền vào PriceTable. */
export function baseCurrencyOf(currencySymbol: string): PriceCurrency {
    return currencySymbol === "₫" ? "VND" : "USD";
}

/** Hệ số nhân + ký hiệu để hiển thị `shown` từ số liệu gốc `base`. */
export function fxDisplay(
    base: PriceCurrency,
    shown: PriceCurrency,
    fxVndPerUsd: number | null | undefined,
): { factor: number; symbol: "₫" | "$" } {
    const symbol = shown === "VND" ? "₫" : "$";
    if (shown === base || !fxVndPerUsd) return { factor: 1, symbol: base === "VND" ? "₫" : "$" };
    return { factor: base === "VND" ? 1 / fxVndPerUsd : fxVndPerUsd, symbol };
}
