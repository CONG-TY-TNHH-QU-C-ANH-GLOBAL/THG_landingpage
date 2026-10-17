import { describe, expect, it } from "vitest";

import {
    airGroupLabel,
    exclusion,
    groupFcl,
    money,
    parseAirSurcharges,
    parseCfs,
    parseCutoffBar,
    parseCutoffs,
    parseTransit,
    splitTail,
} from "@/components/pricing/chinhNgachRateSheet.parse";

// Inputs are the live chinhNgachMeta / rate-card values, so these pin the
// parsers to what production actually serves.

describe("chinh ngach rate sheet parsers", () => {
    it("prints amounts with the sheet's tilde, cents only where present", () => {
        expect(money(155)).toBe("~$155");
        expect(money(16901)).toBe("~$16,901");
        expect(money(4.5)).toBe("~$4.50");
        expect(money(6.05)).toBe("~$6.05");
        expect(money("")).toBe("—");
    });

    it("reads the three transit meta strings into number, unit and note", () => {
        expect(parseTransit("HCM / Hải Phòng → Long Beach, CA: 17–18 ngày")).toEqual({
            label: "HCM / Hải Phòng → Long Beach, CA", value: "17–18", unit: "ngày", sub: "" });
        expect(parseTransit("Long Beach → Door US: 6–8 ngày (rail/truck nội địa, đã gồm thời gian chờ)")).toEqual({
            label: "Long Beach → Door US", value: "6–8", unit: "ngày", sub: "rail/truck nội địa, đã gồm thời gian chờ" });
        expect(parseTransit(undefined)).toBeNull();
    });

    it("keeps an unparseable transit as raw text rather than dropping it", () => {
        expect(parseTransit("Khoảng 3 tuần")).toEqual({ label: "", value: "Khoảng 3 tuần", unit: "", sub: "" });
    });

    it("spells out weekdays and splits time from action in the cut-off pills", () => {
        expect(parseCutoffs("T2 12:00 đặt booking · T3 16:00 AMS & ISF · T5 ETD")).toEqual([
            { when: "Thứ 2 12:00", what: "Đặt booking" },
            { when: "Thứ 3 16:00", what: "AMS & ISF" },
            { when: "Thứ 5", what: "ETD" },
        ]);
    });

    it("separates CFS name, code and address", () => {
        expect(parseCfs("CFS CTY Gemadept (03TGC16) — Lô CN3, KCN MP Đình Vũ, Q. Hải An, Hải Phòng")).toEqual({
            name: "CFS CTY Gemadept", code: "03TGC16", address: "Lô CN3, KCN MP Đình Vũ, Q. Hải An, Hải Phòng" });
    });

    it("labels cut-off bar parts with and without a colon", () => {
        expect(parseCutoffBar("FCL: ETD−2 ngày · LCL: ETD−3 ngày · tàu chạy 2–3 chuyến/tuần")).toEqual([
            { label: "FCL:", value: "ETD−2 ngày" },
            { label: "LCL:", value: "ETD−3 ngày" },
            { label: "Tàu chạy:", value: "2–3 chuyến/tuần" },
        ]);
    });

    it("reorders air destinations the way the sheet titles them, and passes bare codes through", () => {
        expect(airGroupLabel("LAX (Los Angeles) — Bờ Tây")).toBe("Bờ Tây — Los Angeles (LAX)");
        expect(airGroupLabel("LAX")).toBe("LAX");
    });

    it("splits the muted tails the sheet prints in grey", () => {
        expect(splitTail("Đà Nẵng (DAD) — via HCM hoặc HPH")).toEqual({ main: "Đà Nẵng (DAD)", tail: "via HCM hoặc HPH" });
        expect(splitTail("HCM → Los Angeles, CA (Bờ Tây)")).toEqual({ main: "HCM → Los Angeles, CA", tail: "(Bờ Tây)" });
        expect(splitTail("Hồ Chí Minh (HCM)")).toEqual({ main: "Hồ Chí Minh (HCM)", tail: "" });
    });

    it("turns excl_air into the sheet's surcharge chips plus the plain exclusions", () => {
        const { chips, rest } = parseAirSurcharges(
            "Chưa gồm: Handling (~$0.022/CW, min ~$22/lô), AWB fee (~$5.5/set), AMS (~$11/MAWB cộng ~$11/HAWB), trucking ra sân bay, hải quan nhập Mỹ, door delivery",
        );
        expect(chips).toEqual([
            { label: "Handling", value: "~$0.022/CW" },
            { label: "Handling min", value: "~$22/lô" },
            { label: "AWB fee", value: "~$5.5/set" },
            { label: "AMS Master", value: "~$11/MAWB" },
            { label: "AMS House", value: "~$11/HAWB" },
        ]);
        expect(rest).toEqual(["trucking ra sân bay", "hải quan nhập Mỹ", "door delivery"]);
    });

    it("uses the sheet's wording for exclusion notes", () => {
        expect(exclusion("Chưa gồm: trucking nội địa VN")).toBe("Chưa bao gồm: trucking nội địa VN");
    });

    it("groups FCL by service then route, and puts the total last", () => {
        const cols = ["d20", "d40"];
        const g = groupFcl([
            { service: "CLX", origin: "HPH", charge: "Total", d20: 9, d40: 9, transit: "25–26 ngày" },
            { service: "CLX", origin: "HPH", charge: "Ocean Freight", d20: 1, d40: 2, transit: "25–26 ngày" },
            { service: "MAX", origin: "HCM", charge: "FAF", d20: 3, d40: 4, transit: "26–27 ngày" },
        ], cols);
        expect([...g.keys()]).toEqual(["CLX", "MAX"]);
        const clx = g.get("CLX")?.[0];
        expect(clx?.rows.map((r) => r.charge)).toEqual(["Ocean Freight", "Tổng cước"]);
        expect(clx?.rows[1].total).toBe(true);
        expect(clx?.transit).toBe("25–26 ngày");
    });

    // CMS migration 0060 rewords the meta to the v14 sheet's own copy. These
    // pin that each reworded value reads back as the exact text the sheet prints.
    it("reads the sheet-worded meta (CMS 0060) as the sheet prints it", () => {
        expect(parseTransit("Long Beach → Door (nội địa Mỹ): 6–8 ngày (Rail / Truck nội địa · Bao gồm thời gian chờ)")).toEqual({
            label: "Long Beach → Door (nội địa Mỹ)", value: "6–8", unit: "ngày", sub: "Rail / Truck nội địa · Bao gồm thời gian chờ" });
        expect(parseTransit("HCM → Door US (tổng): 25–26 ngày (Sea + vận chuyển nội địa Mỹ kết hợp)")).toEqual({
            label: "HCM → Door US (tổng)", value: "25–26", unit: "ngày", sub: "Sea + vận chuyển nội địa Mỹ kết hợp" });
        expect(
            parseCutoffs("T2 12:00 đặt booking · T2 16:00 nộp CDS (Khai báo HQ) · T3 12:00 nhận hàng tại kho CFS · T3 16:00 AMS & ISF cutoff · T5 ETD (tàu khởi hành)")
                .map((c) => `${c.when} — ${c.what}`),
        ).toEqual([
            "Thứ 2 12:00 — Đặt booking",
            "Thứ 2 16:00 — Nộp CDS (Khai báo HQ)",
            "Thứ 3 12:00 — Nhận hàng tại kho CFS",
            "Thứ 3 16:00 — AMS & ISF cutoff",
            "Thứ 5 — ETD (tàu khởi hành)",
        ]);
        expect(parseCutoffBar("FCL: ETD − 2 ngày · LCL: ETD − 3 ngày · Tàu chạy: 2–3 chuyến/tuần")).toEqual([
            { label: "FCL:", value: "ETD − 2 ngày" },
            { label: "LCL:", value: "ETD − 3 ngày" },
            { label: "Tàu chạy:", value: "2–3 chuyến/tuần" },
        ]);
        expect(exclusion("Chưa bao gồm: trucking nội địa VN, thủ tục hải quan VN & US, door delivery tại Mỹ."))
            .toBe("Chưa bao gồm: trucking nội địa VN, thủ tục hải quan VN & US, door delivery tại Mỹ.");
        expect(parseAirSurcharges("Chưa bao gồm: Handling (~$0.022/CW, min ~$22/lô), AWB fee (~$5.5/set), AMS (~$11/MAWB cộng ~$11/HAWB), trucking ra sân bay, hải quan nhập Mỹ, door delivery tại Mỹ").rest)
            .toEqual(["trucking ra sân bay", "hải quan nhập Mỹ", "door delivery tại Mỹ"]);
        expect(splitTail("ISF Filing Fee (nếu có)")).toEqual({ main: "ISF Filing Fee", tail: "(nếu có)" });
    });
});
