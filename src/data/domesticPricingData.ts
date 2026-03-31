import rawData from "./domesticPricing.json";

export interface DomesticPricingRow {
    STT: string;
    weight: string;      // "4 oz", "8 oz", etc.
    gram: string;        // "113 gram", etc.
    zones: Record<number, string>; // zone 1-9 prices
}

export const domesticPricingRows: DomesticPricingRow[] = (rawData as any[]).map((r) => ({
    STT: r.STT,
    weight: r["Weight Not Over (in ounces)"],
    gram: r.Gram,
    zones: {
        1: r["Zone 1"],
        2: r["Zone 2"],
        3: r["Zone 3"],
        4: r["Zone 4"],
        5: r["Zone 5"],
        6: r["Zone 6"],
        7: r["Zone 7"],
        8: r["Zone 8"],
        9: r["Zone 9"],
    },
}));

export const fulfillmentServices = {
    receiving: { label: "Nhập kho (Inbound)", price: "MIỄN PHÍ", note: "Không thu phí nhập kho" },
    storage: {
        label: "Lưu kho",
        options: [
            { desc: "Mỗi sản phẩm / tháng", price: "$0.10" },
            { desc: "Mỗi CBM / tháng", price: "$20.00" },
        ],
        note: "Miễn phí 90 ngày đầu tiên",
    },
    packLabel: {
        label: "Đóng gói & Dán nhãn",
        tiers: [
            { range: "≤ 2 lbs", price: "$1.20 / pc" },
            { range: "2 – 4 lbs", price: "$1.70 / pc" },
            { range: "4 – 6 lbs", price: "$2.20 / pc" },
        ],
    },
};
