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
    receiving: {
        label: "Nhập kho",
        price: "Miễn phí"
    },
    inspection: {
        label: "Phí kiểm đếm",
        options: [
            { desc: "Hàng hóa đóng gói nhỏ lẻ, số lượng ít hơn 20 món/carton", price: "Miễn phí" },
            { desc: "Hàng hóa đóng kiện, chỉ có 1 loại sản phẩm, kiểm tra nhanh", price: "2.5$ /carton" },
            { desc: "Hàng hóa đóng kiện với nhiều món hàng lẫn lộn", price: "6.25$ /carton" },
            { desc: "Oversized/Bulky goods, priced per CBM", price: "38$ /CBM" },
            { desc: "Phí kiểm kê hàng hóa định kỳ (theo yêu cầu)", price: "30$ /hour hoặc 30$ cho 1500pcs", note: "Sẽ có xê dịch tùy thuộc vào mặt hàng" },
            { desc: "Các trường hợp khác", price: "Tính theo case cụ thể" },
        ]
    },
    storage: {
        label: "Phí lưu kho",
        options: [
            { desc: "Theo sản phẩm", price: "0.1$ /pc/tháng" },
            { desc: "Theo thể tích", price: "20$ / 1 CBM/ 1 tháng" },
        ]
    },
    packLabel: {
        label: "Phí đóng gói, dán label và mang hàng ra hãng vận chuyển",
        tiers: [
            { range: "Items ≤ 2 lbs", price: "1.2$ /pc" },
            { range: "Item > 2 lbs; ≤ 4 lbs", price: "1.7$ /pc" },
            { range: "Item > 4 lbs; ≤ 6 lbs", price: "2.2$ /pc" },
            { range: "Item > 6 lbs; ≤ 8 lbs", price: "2.7$ /pc" },
            { range: "Item > 8 lbs; ≤ 10 lbs", price: "3.2$ /pc" },
            { range: "Item > 10 lbs", price: "Tính theo case cụ thể" },
        ],
        note: "Nếu đơn hàng có nhiều hơn 1 pc thì sẽ cộng thêm $0.5/pc cho mỗi pc tiếp theo"
    },
};
