import { describe, expect, it } from "vitest";
import { baseCurrencyOf, fxDisplay, readFxRate, readTableCurrency, symbolFor } from "./fxDisplay";

describe("readFxRate", () => {
    it("đọc tỉ giá hợp lệ, bỏ qua thiếu/ngoài khoảng/không phải số", () => {
        expect(readFxRate({ fx_rate: 25400 })).toBe(25400);
        expect(readFxRate({ fx_rate: 25.4 })).toBeNull();
        expect(readFxRate({ fx_rate: "25400" })).toBeNull();
        expect(readFxRate({})).toBeNull();
        expect(readFxRate(null)).toBeNull();
    });
});

describe("fxDisplay", () => {
    it("VNĐ → USD chia theo tỉ giá", () => {
        const d = fxDisplay("VND", "USD", 25000);
        expect(d.symbol).toBe("$");
        expect(147758 * d.factor).toBeCloseTo(5.91, 2);
    });
    it("USD → VNĐ nhân theo tỉ giá", () => {
        const d = fxDisplay("USD", "VND", 25000);
        expect(d.symbol).toBe("₫");
        expect(2 * d.factor).toBe(50000);
    });
    it("cùng tiền tệ hoặc thiếu tỉ giá thì giữ nguyên", () => {
        expect(fxDisplay("VND", "VND", 25000)).toEqual({ factor: 1, symbol: "₫" });
        expect(fxDisplay("VND", "USD", null)).toEqual({ factor: 1, symbol: "₫" });
    });
});

describe("readTableCurrency / symbolFor", () => {
    it("bảng VN đã đổi sang USD trên CMS thì hiện $, không đoán theo tuyến", () => {
        expect(symbolFor(readTableCurrency({ currency: "USD" }), "₫")).toBe("$");
        expect(symbolFor(readTableCurrency({ currency: "vnd" }), "$")).toBe("₫");
    });
    it("không ghi hoặc ghi lạ thì dùng mặc định của panel", () => {
        expect(readTableCurrency({})).toBeNull();
        expect(readTableCurrency({ currency: "EUR" })).toBeNull();
        expect(symbolFor(null, "₫")).toBe("₫");
    });
});

describe("baseCurrencyOf", () => {
    it("₫ là VND, còn lại là USD", () => {
        expect(baseCurrencyOf("₫")).toBe("VND");
        expect(baseCurrencyOf("$")).toBe("USD");
    });
});
