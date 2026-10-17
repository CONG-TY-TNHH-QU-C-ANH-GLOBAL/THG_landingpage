// "Dự toán chi phí" — four worked quotations from the XKCN Hub v6.0 sheet
// (thg_xkcn_v14), tab "Dự toán chi phí".
//
// GENERATED from the sheet's markup, one entry per container pane, so every
// cell keeps the sheet's formatting: which amounts are green prices, which are
// at-cost / if-applicable / TBC tags, which are dimmed. THG is folded to
// TH Group, the site's brand.
//
// These are REFERENCE QUOTATIONS, not a calculator: each is one real shipment
// priced line by line, so a seller can see which charges exist at all and
// roughly what each costs. The sheet groups them by origin — three lanes out
// of Hai Phong and one out of Yantian — and that grouping is the tab's
// navigation.
//
// The sheet also attached three source PDFs (a MATSON debit note and two China
// agent quotes). They are deliberately NOT published: they carry TH Group's
// buy-side rates, a counterparty's invoice references and a specific B/L and
// voyage, which would let any reader derive the margin on these lanes.

/** How a cell's content is drawn: plain text, a green price (price / the
 *  smaller priceS), one of the three status tags, or the muted aside the
 *  sheet prints after a subtotal. */
export type CellKind = "text" | "price" | "priceS" | "atcost" | "tbc" | "ifapp" | "note";

export interface CostCell {
    txt: string;
    kind: CellKind;
    /** Right-aligned. */
    cr?: boolean;
    mono?: boolean;
    dim?: boolean;
    span?: number;
}

export interface CostRow {
    /** group = navy/gold band, item = a charge, sub = subtotal. */
    kind: "group" | "item" | "sub";
    cells: readonly CostCell[];
}

export interface Quotation {
    id: string;
    lane: "vn" | "cn";
    icon: string;
    size: string;
    carrier: string;
    kicker: string;
    badge: string;
    facts: readonly { k: string; v: string; gold?: boolean }[];
    rows: readonly CostRow[];
    /** lines = the included/excluded pair printed under the name; suffix =
     *  the "plus what nobody can price yet" line under the figure. Both
     *  change what the number means. */
    total: { label: string; name: string; lines: readonly string[]; excl: string; amount: string; unit: string; suffix: string };
    disclTitle: string;
    /** May carry inline <strong>. */
    discl: readonly string[];
}

export const QUOTATION_HEAD = {tag: "📋 Quotation / Ước tính chi phí", title: "Dự Toán Chi Phí Nhập Khẩu Chính Ngạch", sub: "1 lô hàng thực tế · Giá tham khảo · Liên hệ TH Group để xác nhận chính thức"} as const;

export const LANES = [{kind: "vn", head: "🇻🇳 Từ Việt Nam (HPH)"}, {kind: "cn", head: "🇨🇳 Từ Trung Quốc"}] as const;

/** Shared by several quotations: Custom Entry Fee … Courier & Messenger. */
const SHARED_ROWS_1: readonly CostRow[] = [
    {kind: "item", cells: [{txt: "Custom Entry Fee", kind: "text"}, {txt: "$95", kind: "text", cr: true, mono: true}, {txt: "/ ENTRY", kind: "text"}, {txt: "~$95", kind: "priceS", cr: true}, {txt: "Incl. 3 HTS lines · +$4/add. line · FDA +$30/line", kind: "text"}]},
    {kind: "item", cells: [{txt: "ISF Filing", kind: "text"}, {txt: "$35", kind: "text", cr: true, mono: true}, {txt: "/ BILL", kind: "text"}, {txt: "~$35", kind: "priceS", cr: true}, {txt: "", kind: "text"}]},
    {kind: "item", cells: [{txt: "ADF (Advance Duty Fee)", kind: "text"}, {txt: "Min $15 or 3% of Duty", kind: "text", cr: true, mono: true}, {txt: "", kind: "text"}, {txt: "Nếu phát sinh", kind: "text", cr: true, dim: true}, {txt: "Only if TH Group layouts duty/tax", kind: "text"}]},
    {kind: "item", cells: [{txt: "Single Bond", kind: "text"}, {txt: "$6 / $1,000 cargo+duty", kind: "text", cr: true, mono: true}, {txt: "min $150", kind: "text"}, {txt: "IF APPLICABLE", kind: "ifapp", cr: true}, {txt: "Nếu importer chưa có annual bond", kind: "text"}]},
    {kind: "item", cells: [{txt: "ISF Bond Fee", kind: "text"}, {txt: "$85", kind: "text", cr: true, mono: true}, {txt: "/ ENTRY", kind: "text"}, {txt: "IF APPLICABLE", kind: "ifapp", cr: true}, {txt: "Nếu dùng single bond", kind: "text"}]},
    {kind: "item", cells: [{txt: "Foreign Tax ID Apply", kind: "text"}, {txt: "$100", kind: "text", cr: true, mono: true}, {txt: "/ SHIPMENT", kind: "text"}, {txt: "~$100", kind: "priceS", cr: true}, {txt: "Nếu shipper chưa có U.S. Tax ID", kind: "text"}]},
    {kind: "item", cells: [{txt: "Import Handling", kind: "text"}, {txt: "$65", kind: "text", cr: true, mono: true}, {txt: "/ SHIPMENT", kind: "text"}, {txt: "~$65", kind: "priceS", cr: true}, {txt: "", kind: "text"}]},
    {kind: "item", cells: [{txt: "Courier & Messenger", kind: "text"}, {txt: "$25", kind: "text", cr: true, mono: true}, {txt: "/ SHIPMENT", kind: "text"}, {txt: "~$25", kind: "priceS", cr: true}, {txt: "", kind: "text"}]},
];

/** Shared by several quotations: Chassis Rental … Exam / Storage / Congestion. */
const SHARED_ROWS_2: readonly CostRow[] = [
    {kind: "item", cells: [{txt: "Chassis Rental", kind: "text"}, {txt: "$45", kind: "text", cr: true, mono: true}, {txt: "/ DAY / CONT", kind: "text"}, {txt: "~$90", kind: "priceS", cr: true}, {txt: "Min 2 days", kind: "text"}]},
    {kind: "item", cells: [{txt: "Pre-pull", kind: "text"}, {txt: "$150", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "IF APPLICABLE", kind: "ifapp", cr: true}, {txt: "Nếu cần kéo cont sớm", kind: "text"}]},
    {kind: "item", cells: [{txt: "Yard Storage", kind: "text"}, {txt: "$50", kind: "text", cr: true, mono: true}, {txt: "/ DAY", kind: "text"}, {txt: "IF APPLICABLE", kind: "ifapp", cr: true}, {txt: "", kind: "text"}]},
    {kind: "item", cells: [{txt: "Chassis Split Fee", kind: "text"}, {txt: "$85", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "IF APPLICABLE", kind: "ifapp", cr: true}, {txt: "", kind: "text"}]},
    {kind: "item", cells: [{txt: "Overweight", kind: "text"}, {txt: "$350", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "IF APPLICABLE", kind: "ifapp", cr: true}, {txt: "20DC: 37,000–44,000 lbs", kind: "text"}]},
    {kind: "item", cells: [{txt: "Terminal Destination Charge", kind: "text"}, {txt: "AT COST", kind: "atcost", cr: true}, {txt: "/ BILL", kind: "text"}, {txt: "Nếu phát sinh", kind: "text", cr: true, dim: true}, {txt: "Only if applicable", kind: "text"}]},
    {kind: "item", cells: [{txt: "Exam / Storage / Congestion", kind: "text"}, {txt: "AT COST", kind: "atcost", cr: true}, {txt: "/ BILL", kind: "text"}, {txt: "Theo thực tế", kind: "text", cr: true, dim: true}, {txt: "Base on shipping line's charge", kind: "text"}]},
];

/** Shared by several quotations: 4 · THUẾ & PHÍ HẢI QUAN … Subtotal — Thuế & hải quan. */
const SHARED_ROWS_3: readonly CostRow[] = [
    {kind: "group", cells: [{txt: "4 · THUẾ & PHÍ HẢI QUAN", kind: "text", span: 5}]},
    {kind: "item", cells: [{txt: "Customs Duty", kind: "text"}, {txt: "AT COST / TBC", kind: "atcost", cr: true}, {txt: "/ BILL", kind: "text"}, {txt: "Chưa bao gồm", kind: "text", cr: true, dim: true}, {txt: "MPF 0.3464% (min $33.58/max $651.50) · HMF 0.125% of invoice", kind: "text"}]},
    {kind: "item", cells: [{txt: "ADF (Advance Duty Fee)", kind: "text"}, {txt: "Min $15 or 3% of Duty", kind: "text", cr: true, mono: true}, {txt: "", kind: "text"}, {txt: "Nếu phát sinh", kind: "text", cr: true, dim: true}, {txt: "Only if TH Group layouts duty/tax", kind: "text"}]},
    {kind: "sub", cells: [{txt: "Subtotal — Thuế & hải quan", kind: "text", span: 3}, {txt: "Xem ghi chú", kind: "text", cr: true, dim: true}, {txt: "", kind: "text"}]},
];

export const QUOTATIONS: readonly Quotation[] = [
    {
        id: "40",
        lane: "vn",
        icon: "🚢",
        size: "40HC",
        carrier: "MATSON CLX · HPH→HOU",
        kicker: "QUOTATION / ƯỚC TÍNH CHI PHÍ 1 LÔ HÀNG",
        badge: "MATSON CLX · DDP · HPH → HOU",
        facts: [{k: "Term", v: "DDP", gold: true}, {k: "Route", v: "HPH → HOU"}, {k: "Carrier", v: "MATSON"}, {k: "Container", v: "1 × 40HC"}, {k: "Transit — CLX", v: "17 ngày", gold: true}, {k: "Transit — MAX", v: "18 ngày", gold: true}, {k: "POL", v: "Hai Phong"}, {k: "POD", v: "Houston"}, {k: "Commodity", v: "General Cargo"}, {k: "Service", v: "FCL"}],
        total: {label: "Total Estimated Import Cost", name: "Tổng dự toán chi phí nhập khẩu", lines: ["Đã bao gồm: VN origin fees · US destination fees · Unloading", "Chưa bao gồm: Ocean Freight · Customs Duty · Pre-pull · PGA · Arrival at cost"], excl: "Subtotal các khoản có định giá", amount: "~6,584", unit: "USD", suffix: "+ Ocean Freight (liên hệ TH Group) + Duty (TBC)"},
        disclTitle: "Lưu ý",
        discl: ["Customs Duty chưa bao gồm — mức thuế xác định theo mã HS code của lô hàng thực tế.", "Ocean Freight cần xác nhận với TH Group theo ngày ETD cụ thể — giá thay đổi theo tuần.", "Advance Duty Fee: 8% of Duty, min $50 — chỉ áp dụng khi TH Group ứng trước thuế thay mặt importer.", "Các khoản <strong>If Applicable / At Cost</strong> (Pre-pull, PGA, Arrival Fees) tính theo thực tế phát sinh.", "Báo giá áp dụng cho ETD 20-Aug-2026. Trên giá VND quy đổi theo tỷ giá ~25,000 VND/USD."],
        rows: [
            {kind: "group", cells: [{txt: "1 · PHÍ ĐẦU XUẤT VIỆT NAM (LCC tại HPH)", kind: "text", span: 5}]},
            {kind: "item", cells: [{txt: "THC — Terminal Handling Charge", kind: "text"}, {txt: "$220", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$220", kind: "priceS", cr: true}, {txt: "Phí xếp dỡ tại cảng", kind: "text"}]},
            {kind: "item", cells: [{txt: "Seal", kind: "text"}, {txt: "$10", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$10", kind: "priceS", cr: true}, {txt: "Chì niêm phong", kind: "text"}]},
            {kind: "item", cells: [{txt: "Bill of Lading", kind: "text"}, {txt: "$40", kind: "text", cr: true, mono: true}, {txt: "/ BILL", kind: "text"}, {txt: "~$40", kind: "priceS", cr: true}, {txt: "Phí phát hành vận đơn", kind: "text"}]},
            {kind: "item", cells: [{txt: "Telex Fee", kind: "text"}, {txt: "$35", kind: "text", cr: true, mono: true}, {txt: "/ BILL", kind: "text"}, {txt: "~$35", kind: "priceS", cr: true}, {txt: "Điện giao hàng (surrender B/L)", kind: "text"}]},
            {kind: "item", cells: [{txt: "AMS", kind: "text"}, {txt: "$50", kind: "text", cr: true, mono: true}, {txt: "/ BILL", kind: "text"}, {txt: "~$50", kind: "priceS", cr: true}, {txt: "Khai manifest điện tử CBP, bắt buộc trước ETD 24h", kind: "text"}]},
            {kind: "item", cells: [{txt: "Trucking (kéo cont → cảng)", kind: "text"}, {txt: "2,500,000 VND", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$100", kind: "priceS", cr: true}, {txt: "Đóng hàng 4–5h; ca thêm 500K–1tr/ca; neo đêm 1.5–2tr VND", kind: "text"}]},
            {kind: "item", cells: [{txt: "Phí hun trùng", kind: "text"}, {txt: "900,000 VND", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$36", kind: "priceS", cr: true}, {txt: "", kind: "text"}]},
            {kind: "item", cells: [{txt: "Phí mộc pallet", kind: "text"}, {txt: "500,000 VND", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$20", kind: "priceS", cr: true}, {txt: "", kind: "text"}]},
            {kind: "item", cells: [{txt: "Phí lên TKHQ (khai báo hải quan)", kind: "text"}, {txt: "3,000,000 VND", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$120", kind: "priceS", cr: true}, {txt: "Luồng Đỏ · Phí dịch vụ, không phải thuế", kind: "text"}]},
            {kind: "item", cells: [{txt: "Phí chi xử lý nhanh", kind: "text"}, {txt: "15,000,000 VND", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$600", kind: "priceS", cr: true}, {txt: "Luồng Đỏ · Không hóa đơn", kind: "text"}]},
            {kind: "item", cells: [{txt: "Phí chi cảng thuê bãi hun trùng", kind: "text"}, {txt: "700,000 VND", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$28", kind: "priceS", cr: true}, {txt: "Không hóa đơn", kind: "text"}]},
            {kind: "item", cells: [{txt: "Phí trả giám sát đóng hàng", kind: "text"}, {txt: "500,000 VND", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$20", kind: "priceS", cr: true}, {txt: "Không hóa đơn", kind: "text"}]},
            {kind: "item", cells: [{txt: "Phí thanh lý + vô sổ tàu ngoài giờ", kind: "text"}, {txt: "300,000 VND", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$12", kind: "priceS", cr: true}, {txt: "Không hóa đơn", kind: "text"}]},
            {kind: "item", cells: [{txt: "Phí nâng cont", kind: "text"}, {txt: "2,246,400 VND", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$90", kind: "priceS", cr: true}, {txt: "Chi hộ · HĐ 39502", kind: "text"}]},
            {kind: "item", cells: [{txt: "Phí hạ cont", kind: "text"}, {txt: "1,900,800 VND", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$76", kind: "priceS", cr: true}, {txt: "Chi hộ · HĐ 250792", kind: "text"}]},
            {kind: "item", cells: [{txt: "Phí cơ sở hạ tầng", kind: "text"}, {txt: "500,000 VND", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$20", kind: "priceS", cr: true}, {txt: "Chi hộ · HĐ 1855493", kind: "text"}]},
            {kind: "item", cells: [{txt: "Phí kiểm hóa", kind: "text"}, {txt: "5,043,600 VND", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$202", kind: "priceS", cr: true}, {txt: "Chi hộ · HĐ 251908", kind: "text"}]},
            {kind: "sub", cells: [{txt: "Subtotal — Phí đầu xuất VN", kind: "text", span: 3}, {txt: "~$1,679", kind: "price", cr: true}, {txt: "≈ 25,000 VND/USD", kind: "note"}]},
            {kind: "group", cells: [{txt: "2 · CƯỚC VẬN CHUYỂN QUỐC TẾ", kind: "text", span: 5}]},
            {kind: "item", cells: [{txt: "Ocean Freight (MATSON CLX · HPH → HOU)", kind: "text"}, {txt: "LIÊN HỆ TH GROUP", kind: "tbc", cr: true}, {txt: "/ CONT", kind: "text"}, {txt: "—", kind: "text", cr: true, dim: true}, {txt: "Xác nhận theo ngày ETD cụ thể", kind: "text"}]},
            {kind: "sub", cells: [{txt: "Subtotal — Cước quốc tế", kind: "text", span: 3}, {txt: "Xem ghi chú", kind: "text", cr: true, dim: true}, {txt: "", kind: "text"}]},
            {kind: "group", cells: [{txt: "3 · PHÍ ĐẦU NHẬP MỸ (DDP Charges tại HOU)", kind: "text", span: 5}]},
            {kind: "item", cells: [{txt: "Agent Fee", kind: "text"}, {txt: "$100", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$100", kind: "priceS", cr: true}, {txt: "Phí đại lý điều phối", kind: "text"}]},
            {kind: "item", cells: [{txt: "Trucking (drayage cảng HOU → kho)", kind: "text"}, {txt: "$865", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$865", kind: "priceS", cr: true}, {txt: "", kind: "text"}]},
            {kind: "item", cells: [{txt: "Fuel", kind: "text"}, {txt: "$125", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$125", kind: "priceS", cr: true}, {txt: "", kind: "text"}]},
            {kind: "item", cells: [{txt: "Chassis Rental", kind: "text"}, {txt: "$65", kind: "text", cr: true, mono: true}, {txt: "/ DAY / CONT", kind: "text"}, {txt: "~$130", kind: "priceS", cr: true}, {txt: "Min 2 days", kind: "text"}]},
            {kind: "item", cells: [{txt: "Pre-pull", kind: "text"}, {txt: "$200", kind: "text", cr: true, mono: true}, {txt: "/ DAY / CONT", kind: "text"}, {txt: "IF APPLICABLE", kind: "ifapp", cr: true}, {txt: "Kéo cont sớm tránh demurrage", kind: "text"}]},
            {kind: "item", cells: [{txt: "Entry Fee (CBP Form 7501)", kind: "text"}, {txt: "$125", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$125", kind: "priceS", cr: true}, {txt: "Tờ khai nhập chính thức", kind: "text"}]},
            {kind: "item", cells: [{txt: "Additional Classifications", kind: "text"}, {txt: "$5", kind: "text", cr: true, mono: true}, {txt: "/ LINE", kind: "text"}, {txt: "Nếu phát sinh", kind: "text", cr: true, dim: true}, {txt: "Miễn 3 dòng HTS đầu", kind: "text"}]},
            {kind: "item", cells: [{txt: "Additional Invoices", kind: "text"}, {txt: "$15", kind: "text", cr: true, mono: true}, {txt: "/ ATT", kind: "text"}, {txt: "Nếu phát sinh", kind: "text", cr: true, dim: true}, {txt: "Mỗi commercial invoice bổ sung", kind: "text"}]},
            {kind: "item", cells: [{txt: "Trade Actions Surcharge", kind: "text"}, {txt: "$30", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$30", kind: "priceS", cr: true}, {txt: "Quản lý tariff (từ Section 301)", kind: "text"}]},
            {kind: "item", cells: [{txt: "Annual Bond", kind: "text"}, {txt: "$600", kind: "text", cr: true, mono: true}, {txt: "/ YEAR", kind: "text"}, {txt: "~$600", kind: "priceS", cr: true}, {txt: "Bond bảo lãnh CBP — bắt buộc mọi entry", kind: "text"}]},
            {kind: "item", cells: [{txt: "ISF (Importer Security Filing)", kind: "text"}, {txt: "$150", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$150", kind: "priceS", cr: true}, {txt: "Nộp trước 24h khi tàu load tại HPH", kind: "text"}]},
            {kind: "item", cells: [{txt: "PGA (FDA, FWS, EPA, USDA…)", kind: "text"}, {txt: "$50", kind: "text", cr: true, mono: true}, {txt: "/ PGA", kind: "text"}, {txt: "IF NEEDED", kind: "ifapp", cr: true}, {txt: "$50/PGA · first line free · $5/add. line", kind: "text"}]},
            {kind: "item", cells: [{txt: "Arrival Fees (cảng & hãng tàu)", kind: "text"}, {txt: "AT COST", kind: "atcost", cr: true}, {txt: "", kind: "text"}, {txt: "Theo thực tế", kind: "text", cr: true, dim: true}, {txt: "LOCA / tariff charges tại đầu nhập", kind: "text"}]},
            {kind: "sub", cells: [{txt: "Subtotal — Phí đầu nhập Mỹ", kind: "text", span: 3}, {txt: "~$2,125", kind: "price", cr: true}, {txt: "excl. Pre-pull, Add. Class/Inv., PGA, Arrival", kind: "note"}]},
            {kind: "group", cells: [{txt: "4 · THUẾ & PHÍ HẢI QUAN", kind: "text", span: 5}]},
            {kind: "item", cells: [{txt: "Customs Duty", kind: "text"}, {txt: "AT COST", kind: "atcost", cr: true}, {txt: "", kind: "text"}, {txt: "Chưa bao gồm", kind: "text", cr: true, dim: true}, {txt: "Tùy mã HS code của lô hàng thực tế", kind: "text"}]},
            {kind: "item", cells: [{txt: "Advance Duty Fee", kind: "text"}, {txt: "8% of Duty", kind: "text", cr: true, mono: true}, {txt: "min $50", kind: "text"}, {txt: "Nếu phát sinh", kind: "text", cr: true, dim: true}, {txt: "Chỉ áp dụng khi TH Group ứng trước thuế", kind: "text"}]},
            {kind: "sub", cells: [{txt: "Subtotal — Thuế & hải quan", kind: "text", span: 3}, {txt: "Xem ghi chú", kind: "text", cr: true, dim: true}, {txt: "", kind: "text"}]},
            {kind: "group", cells: [{txt: "5 · PHÍ DỠ HÀNG / UNLOADING — IF APPLICABLE", kind: "text", span: 5}]},
            {kind: "item", cells: [{txt: "Forklift Rental", kind: "text"}, {txt: "$890", kind: "text", cr: true, mono: true}, {txt: "/ DAY", kind: "text"}, {txt: "~$890", kind: "priceS", cr: true}, {txt: "", kind: "text"}]},
            {kind: "item", cells: [{txt: "Forklift Driver", kind: "text"}, {txt: "$575", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$575", kind: "priceS", cr: true}, {txt: "", kind: "text"}]},
            {kind: "item", cells: [{txt: "Forklift Delivery", kind: "text"}, {txt: "$530", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$530", kind: "priceS", cr: true}, {txt: "", kind: "text"}]},
            {kind: "item", cells: [{txt: "Lumper Fee", kind: "text"}, {txt: "$785", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$785", kind: "priceS", cr: true}, {txt: "2h free · sau $120/h", kind: "text"}]},
            {kind: "sub", cells: [{txt: "Subtotal — Unloading", kind: "text", span: 3}, {txt: "~$2,780", kind: "price", cr: true}, {txt: "if applicable", kind: "note"}]},
        ],
    },
    {
        id: "20",
        lane: "vn",
        icon: "📦",
        size: "20DC",
        carrier: "ZIM · HPH→LAX→HOU · 17 days",
        kicker: "QUOTATION / ƯỚC TÍNH CHI PHÍ 1 LÔ HÀNG",
        badge: "ZIM · DDP · HPH → LAX → HOU",
        facts: [{k: "Term", v: "DDP", gold: true}, {k: "Route", v: "HPH → LAX → HOU"}, {k: "Carrier", v: "ZIM"}, {k: "Transit Time", v: "17 ngày", gold: true}, {k: "Container", v: "1 × 20DC"}, {k: "POL", v: "Hai Phong"}, {k: "POD", v: "Houston"}, {k: "Commodity", v: "Machine"}],
        total: {label: "Total Estimated Import Cost", name: "Tổng dự toán chi phí nhập khẩu", lines: ["Đã bao gồm: VN origin fees · Ocean Freight + SJJ · US destination fees (excl. bond, pre-pull, yard, overweight, at-cost)", "Chưa bao gồm: Customs Duty · ADF · Single Bond · If-applicable items"], excl: "Subtotal các khoản có định giá", amount: "~18,572", unit: "USD", suffix: "+ Customs Duty (TBC) + If-applicable items"},
        disclTitle: "Lưu ý",
        discl: ["Customs Duty chưa bao gồm — MPF 0.3464% (min $33.58 / max $651.50) và HMF 0.125% trên giá trị commercial invoice.", "Single Bond ($6/$1,000, min $150) áp dụng nếu importer chưa có Annual Bond với CBP. ISF Bond $85 tính thêm nếu dùng single bond.", "Trucking $10,150 là dock-to-dock, legal weight. Overweight (37,000–44,000 lbs) phụ thu $350. Layover sau 4h: $550/day.", "Các khoản <strong>If Applicable / At Cost</strong> (Pre-pull, Yard Storage, Chassis Split, Overweight, Terminal Dest., Exam/Storage) tính theo thực tế.", "Báo giá có hiệu lực đến 31-Aug-2026. Cut-off: 27-Aug · ETD HPH: 29-Aug · ETA LAX: 15-Sep · ETA HOU: 20-Sep."],
        rows: [
            {kind: "group", cells: [{txt: "1 · PHÍ ĐẦU XUẤT VIỆT NAM (Local Charge HPH)", kind: "text", span: 5}]},
            {kind: "item", cells: [{txt: "THC — Terminal Handling Charge", kind: "text"}, {txt: "$145", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$145", kind: "priceS", cr: true}, {txt: "", kind: "text"}]},
            {kind: "item", cells: [{txt: "Seal", kind: "text"}, {txt: "$12", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$12", kind: "priceS", cr: true}, {txt: "", kind: "text"}]},
            {kind: "item", cells: [{txt: "Bill of Lading", kind: "text"}, {txt: "$50", kind: "text", cr: true, mono: true}, {txt: "/ BILL", kind: "text"}, {txt: "~$50", kind: "priceS", cr: true}, {txt: "", kind: "text"}]},
            {kind: "item", cells: [{txt: "AMS / ACI", kind: "text"}, {txt: "$45", kind: "text", cr: true, mono: true}, {txt: "/ BILL", kind: "text"}, {txt: "~$45", kind: "priceS", cr: true}, {txt: "", kind: "text"}]},
            {kind: "item", cells: [{txt: "Telex Fee", kind: "text"}, {txt: "$40", kind: "text", cr: true, mono: true}, {txt: "/ BILL", kind: "text"}, {txt: "~$40", kind: "priceS", cr: true}, {txt: "", kind: "text"}]},
            {kind: "item", cells: [{txt: "Handling", kind: "text"}, {txt: "$65", kind: "text", cr: true, mono: true}, {txt: "/ SHIPMENT", kind: "text"}, {txt: "~$65", kind: "priceS", cr: true}, {txt: "", kind: "text"}]},
            {kind: "sub", cells: [{txt: "Subtotal — Phí đầu xuất VN", kind: "text", span: 3}, {txt: "~$357", kind: "price", cr: true}, {txt: "", kind: "text"}]},
            {kind: "group", cells: [{txt: "2 · CƯỚC VẬN CHUYỂN QUỐC TẾ", kind: "text", span: 5}]},
            {kind: "item", cells: [{txt: "Ocean Freight (ZIM · HPH → LAX)", kind: "text"}, {txt: "$7,350", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$7,350", kind: "priceS", cr: true}, {txt: "OWS +$200 nếu GW 18.1–22 tấn", kind: "text"}]},
            {kind: "item", cells: [{txt: "SJJ Surcharge", kind: "text"}, {txt: "$305", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$305", kind: "priceS", cr: true}, {txt: "Validity 31-Aug-2026", kind: "text"}]},
            {kind: "sub", cells: [{txt: "Subtotal — Cước quốc tế", kind: "text", span: 3}, {txt: "~$7,655", kind: "price", cr: true}, {txt: "", kind: "text"}]},
            {kind: "group", cells: [{txt: "3 · PHÍ ĐẦU NHẬP MỸ (DDP Charges)", kind: "text", span: 5}]},
            ...SHARED_ROWS_1,
            {kind: "item", cells: [{txt: "Trucking (Dock-to-dock · LAX → 2425 S Shaver St, Pasadena TX)", kind: "text"}, {txt: "$10,150", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$10,150", kind: "priceS", cr: true}, {txt: "Legal weight · non-Haz · 1h free load/unload · $85/h sau · layover >4h: $550/day", kind: "text"}]},
            ...SHARED_ROWS_2,
            {kind: "sub", cells: [{txt: "Subtotal — Phí đầu nhập Mỹ", kind: "text", span: 3}, {txt: "~$10,560", kind: "price", cr: true}, {txt: "excl. ADF, bond, if-applicable items", kind: "note"}]},
            ...SHARED_ROWS_3,
        ],
    },
    {
        id: "lcl",
        lane: "vn",
        icon: "🗂️",
        size: "LCL",
        carrier: "ZIM · HPH→LAX→HOU · 18 days",
        kicker: "QUOTATION / ƯỚC TÍNH CHI PHÍ 1 LÔ HÀNG LCL",
        badge: "ZIM · DDP · HPH → LAX → HOU · LCL · 23 CBM",
        facts: [{k: "Term", v: "DDP", gold: true}, {k: "Route", v: "HPH → LAX → HOU"}, {k: "Carrier", v: "ZIM"}, {k: "Transit Time", v: "18 ngày", gold: true}, {k: "Khối lượng", v: "23 CBM", gold: true}, {k: "POL", v: "Hai Phong"}, {k: "POD", v: "Houston"}, {k: "Commodity", v: "Machine"}],
        total: {label: "Total Estimated Import Cost", name: "Tổng dự toán chi phí nhập khẩu", lines: ["Đã bao gồm: VN origin fees · Ocean Freight + DDC + SJJ · US DDP fees (excl. bond, if-applicable)", "Chưa bao gồm: Customs Duty · ADF · Single Bond · Chassis Split · Lift Gate · Residential"], excl: "Subtotal các khoản có định giá · 23 CBM", amount: "~10,356", unit: "USD", suffix: "+ Customs Duty (TBC) + If-applicable items"},
        disclTitle: "Lưu ý",
        discl: ["Giá tính cho lô hàng <strong>23 CBM</strong>. Tất cả phí theo CBM/RT sẽ điều chỉnh theo khối lượng thực tế.", "DDC ($28.1/RT) đã bao gồm trong tổng — \"Subject to\" nghĩa là có thể thay đổi theo thực tế tại cảng đến.", "Customs Duty chưa bao gồm — MPF 0.3464% (min $33.58/max $651.50) và HMF 0.125% trên commercial invoice value.", "Single Bond ($6/$1,000, min $150) + ISF Bond ($85) áp dụng nếu importer chưa có Annual Bond với CBP.", "Chassis Split ($6/CBM min $10), Residential ($75), Lift Gate ($75) tính thêm nếu phát sinh.", "Báo giá có hiệu lực đến 31-Aug-2026. Cut-off: 24-Aug · ETD HPH: 28-Aug · ETA LAX: 18-Sep · ETA HOU: 23-Sep."],
        rows: [
            {kind: "group", cells: [{txt: "1 · PHÍ ĐẦU XUẤT VIỆT NAM (Local Charge HPH)", kind: "text", span: 5}]},
            {kind: "item", cells: [{txt: "THC — Terminal Handling Charge", kind: "text"}, {txt: "$8", kind: "text", cr: true, mono: true}, {txt: "/ CBM", kind: "text"}, {txt: "~$184", kind: "priceS", cr: true}, {txt: "23 CBM × $8", kind: "text"}]},
            {kind: "item", cells: [{txt: "CFS — Container Freight Station", kind: "text"}, {txt: "$11", kind: "text", cr: true, mono: true}, {txt: "/ CBM", kind: "text"}, {txt: "~$253", kind: "priceS", cr: true}, {txt: "23 CBM × $11", kind: "text"}]},
            {kind: "item", cells: [{txt: "EBS — Emergency Bunker Surcharge", kind: "text"}, {txt: "$4", kind: "text", cr: true, mono: true}, {txt: "/ CBM", kind: "text"}, {txt: "~$92", kind: "priceS", cr: true}, {txt: "23 CBM × $4", kind: "text"}]},
            {kind: "item", cells: [{txt: "AMS / ACI", kind: "text"}, {txt: "$25", kind: "text", cr: true, mono: true}, {txt: "/ HBL", kind: "text"}, {txt: "~$25", kind: "priceS", cr: true}, {txt: "", kind: "text"}]},
            {kind: "item", cells: [{txt: "FUMI — Fumigation", kind: "text"}, {txt: "$25", kind: "text", cr: true, mono: true}, {txt: "/ SHIPMENT", kind: "text"}, {txt: "~$25", kind: "priceS", cr: true}, {txt: "", kind: "text"}]},
            {kind: "sub", cells: [{txt: "Subtotal — Phí đầu xuất VN", kind: "text", span: 3}, {txt: "~$579", kind: "price", cr: true}, {txt: "", kind: "text"}]},
            {kind: "group", cells: [{txt: "2 · CƯỚC VẬN CHUYỂN QUỐC TẾ", kind: "text", span: 5}]},
            {kind: "item", cells: [{txt: "Ocean Freight (HPH → LAX)", kind: "text"}, {txt: "$77", kind: "text", cr: true, mono: true}, {txt: "/ RT", kind: "text"}, {txt: "~$1,771", kind: "priceS", cr: true}, {txt: "23 RT × $77 · transit 18 days", kind: "text"}]},
            {kind: "item", cells: [{txt: "DDC — Destination Delivery Charge", kind: "text"}, {txt: "$28.1", kind: "text", cr: true, mono: true}, {txt: "/ RT", kind: "text"}, {txt: "~$646", kind: "priceS", cr: true}, {txt: "23 RT × $28.1 · Subject to", kind: "text"}]},
            {kind: "item", cells: [{txt: "SJJ Surcharge", kind: "text"}, {txt: "$305", kind: "text", cr: true, mono: true}, {txt: "/ SHIPMENT", kind: "text"}, {txt: "~$305", kind: "priceS", cr: true}, {txt: "Validity 31-Aug-2026", kind: "text"}]},
            {kind: "sub", cells: [{txt: "Subtotal — Cước quốc tế", kind: "text", span: 3}, {txt: "~$2,722", kind: "price", cr: true}, {txt: "incl. DDC", kind: "note"}]},
            {kind: "group", cells: [{txt: "3 · PHÍ ĐẦU NHẬP MỸ (DDP Charges)", kind: "text", span: 5}]},
            ...SHARED_ROWS_1,
            {kind: "item", cells: [{txt: "Trucking (LAX CFS → 2425 South Shaver St, Pasadena TX 77502)", kind: "text"}, {txt: "$5,445", kind: "text", cr: true, mono: true}, {txt: "/ SHIPMENT", kind: "text"}, {txt: "~$5,445", kind: "priceS", cr: true}, {txt: "", kind: "text"}]},
            {kind: "item", cells: [{txt: "Residential Delivery", kind: "text"}, {txt: "$75", kind: "text", cr: true, mono: true}, {txt: "/ SHIPMENT", kind: "text"}, {txt: "IF APPLICABLE", kind: "ifapp", cr: true}, {txt: "", kind: "text"}]},
            {kind: "item", cells: [{txt: "Lift Gate", kind: "text"}, {txt: "$75", kind: "text", cr: true, mono: true}, {txt: "/ SHIPMENT", kind: "text"}, {txt: "IF APPLICABLE", kind: "ifapp", cr: true}, {txt: "", kind: "text"}]},
            {kind: "item", cells: [{txt: "Exam / Storage / Congestion", kind: "text"}, {txt: "AT COST", kind: "atcost", cr: true}, {txt: "", kind: "text"}, {txt: "Nếu phát sinh", kind: "text", cr: true, dim: true}, {txt: "Only if applicable", kind: "text"}]},
            {kind: "item", cells: [{txt: "Chassis Split", kind: "text"}, {txt: "$6/CBM", kind: "text", cr: true, mono: true}, {txt: "min $10", kind: "text"}, {txt: "IF APPLICABLE", kind: "ifapp", cr: true}, {txt: "Direct consignee", kind: "text"}]},
            {kind: "item", cells: [{txt: "Chassis", kind: "text"}, {txt: "$8/CBM", kind: "text", cr: true, mono: true}, {txt: "min $10", kind: "text"}, {txt: "~$184", kind: "priceS", cr: true}, {txt: "Direct consignee · 23 CBM × $8", kind: "text"}]},
            {kind: "item", cells: [{txt: "Pier Pass", kind: "text"}, {txt: "$6", kind: "text", cr: true, mono: true}, {txt: "/ CBM", kind: "text"}, {txt: "~$138", kind: "priceS", cr: true}, {txt: "For direct consignee · 23 CBM × $6", kind: "text"}]},
            {kind: "item", cells: [{txt: "Clean Truck", kind: "text"}, {txt: "$3", kind: "text", cr: true, mono: true}, {txt: "/ CBM", kind: "text"}, {txt: "~$69", kind: "priceS", cr: true}, {txt: "For direct consignee · 23 CBM × $3", kind: "text"}]},
            {kind: "item", cells: [{txt: "Handling Charge / DO Fee", kind: "text"}, {txt: "$95", kind: "text", cr: true, mono: true}, {txt: "/ BILL", kind: "text"}, {txt: "~$95", kind: "priceS", cr: true}, {txt: "For direct consignee", kind: "text"}]},
            {kind: "item", cells: [{txt: "I.T. (Inland Transportation)", kind: "text"}, {txt: "$25", kind: "text", cr: true, mono: true}, {txt: "/ SHIPMENT", kind: "text"}, {txt: "~$25", kind: "priceS", cr: true}, {txt: "For direct consignee / IPI shipment only", kind: "text"}]},
            {kind: "item", cells: [{txt: "Fuel Adjustment Surcharge", kind: "text"}, {txt: "$6/CBM or /800 lbs", kind: "text", cr: true, mono: true}, {txt: "min $6", kind: "text"}, {txt: "~$138", kind: "priceS", cr: true}, {txt: "Based on arrival date · 23 CBM × $6", kind: "text"}]},
            {kind: "item", cells: [{txt: "Forklift", kind: "text"}, {txt: "$0.75/CWT or $6/CBM", kind: "text", cr: true, mono: true}, {txt: "min $60", kind: "text"}, {txt: "~$138", kind: "priceS", cr: true}, {txt: "Collected at window · 23 CBM × $6", kind: "text"}]},
            {kind: "item", cells: [{txt: "Terminal FSC", kind: "text"}, {txt: "$3/CBM or /800 lbs", kind: "text", cr: true, mono: true}, {txt: "min $20", kind: "text"}, {txt: "~$69", kind: "priceS", cr: true}, {txt: "Collected at window · 23 CBM × $3", kind: "text"}]},
            {kind: "item", cells: [{txt: "Doc Fee", kind: "text"}, {txt: "$10", kind: "text", cr: true, mono: true}, {txt: "/ SHIPMENT", kind: "text"}, {txt: "~$10", kind: "priceS", cr: true}, {txt: "Collected at window", kind: "text"}]},
            {kind: "item", cells: [{txt: "Window Fee", kind: "text"}, {txt: "$125", kind: "text", cr: true, mono: true}, {txt: "/ SHIPMENT", kind: "text"}, {txt: "~$125", kind: "priceS", cr: true}, {txt: "Collected at window", kind: "text"}]},
            {kind: "item", cells: [{txt: "ILTF", kind: "text"}, {txt: "$13/CBM or /800 lbs", kind: "text", cr: true, mono: true}, {txt: "min $13", kind: "text"}, {txt: "~$299", kind: "priceS", cr: true}, {txt: "Collected at window · 23 CBM × $13", kind: "text"}]},
            {kind: "sub", cells: [{txt: "Subtotal — Phí đầu nhập Mỹ", kind: "text", span: 3}, {txt: "~$7,055", kind: "price", cr: true}, {txt: "excl. ADF, bond, if-applicable items", kind: "note"}]},
            ...SHARED_ROWS_3,
        ],
    },
    {
        id: "cn",
        lane: "cn",
        icon: "🚀",
        size: "20DC",
        carrier: "ZIM FAST · YANTIAN→HOU",
        kicker: "QUOTATION / ƯỚC TÍNH CHI PHÍ 1 LÔ HÀNG — FROM CHINA",
        badge: "ZIM FAST · DDP · YANTIAN → LAX → HOU",
        facts: [{k: "Term", v: "DDP", gold: true}, {k: "Route", v: "YANTIAN → LAX → HOU"}, {k: "Carrier", v: "ZIM FAST"}, {k: "Transit Time", v: "14 ngày", gold: true}, {k: "Container", v: "1 × 20DC"}, {k: "POL", v: "Yantian, Shenzhen"}, {k: "POD", v: "Houston"}, {k: "Commodity", v: "Machine"}],
        total: {label: "Total Estimated Import Cost", name: "Tổng dự toán chi phí nhập khẩu", lines: ["Đã bao gồm: POL charges (China) · Ocean Freight + SJJ · US DDP fees (excl. bond, pre-pull, if-applicable)", "Chưa bao gồm: Customs Duty · ADF · Dead Freight · Single Bond · If-applicable items"], excl: "Subtotal các khoản có định giá", amount: "~19,597", unit: "USD", suffix: "+ Customs Duty (TBC) + If-applicable items"},
        disclTitle: "Lưu ý",
        discl: ["Dead Freight +$200/CONT sẽ áp dụng nếu hàng không đủ trọng lượng theo cam kết với hãng tàu.", "Customs Duty chưa bao gồm — MPF 0.3464% (min $33.58/max $651.50) và HMF 0.125% trên commercial invoice value.", "Single Bond ($6/$1,000, min $150) + ISF Bond ($85) áp dụng nếu importer chưa có Annual Bond với CBP.", "Trucking $10,155 là dock-to-dock, legal weight. Overweight (37,000–44,000 lbs) phụ thu $350. Layover sau 4h: $550/day.", "Các khoản <strong>If Applicable / At Cost</strong> (Pre-pull, Yard Storage, Chassis Split, Overweight, Terminal Dest., Exam/Storage) tính theo thực tế phát sinh.", "Báo giá có hiệu lực đến 31-Aug-2026. Cut-off: 31-Aug · ETD China: 02-Sep · ETA LAX: 17-Sep · ETA HOU: 22-Sep."],
        rows: [
            {kind: "group", cells: [{txt: "1 · CHI PHÍ ĐẦU POL (Yantian, Shenzhen)", kind: "text", span: 5}]},
            {kind: "item", cells: [{txt: "ORC — Origin Receiving Charge", kind: "text"}, {txt: "$160", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$160", kind: "priceS", cr: true}, {txt: "", kind: "text"}]},
            {kind: "item", cells: [{txt: "DOC — Documentation Fee", kind: "text"}, {txt: "$80", kind: "text", cr: true, mono: true}, {txt: "/ BILL", kind: "text"}, {txt: "~$80", kind: "priceS", cr: true}, {txt: "", kind: "text"}]},
            {kind: "item", cells: [{txt: "Seal", kind: "text"}, {txt: "$11", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$11", kind: "priceS", cr: true}, {txt: "", kind: "text"}]},
            {kind: "item", cells: [{txt: "EIR — Equipment Interchange Receipt", kind: "text"}, {txt: "$10", kind: "text", cr: true, mono: true}, {txt: "/ ENTRY", kind: "text"}, {txt: "~$10", kind: "priceS", cr: true}, {txt: "", kind: "text"}]},
            {kind: "item", cells: [{txt: "ENS / AMS", kind: "text"}, {txt: "$30", kind: "text", cr: true, mono: true}, {txt: "/ BILL", kind: "text"}, {txt: "~$30", kind: "priceS", cr: true}, {txt: "", kind: "text"}]},
            {kind: "item", cells: [{txt: "ISPS — Port Security Surcharge", kind: "text"}, {txt: "$12", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$12", kind: "priceS", cr: true}, {txt: "", kind: "text"}]},
            {kind: "item", cells: [{txt: "Handling", kind: "text"}, {txt: "$66", kind: "text", cr: true, mono: true}, {txt: "/ SHIPMENT", kind: "text"}, {txt: "~$66", kind: "priceS", cr: true}, {txt: "", kind: "text"}]},
            {kind: "item", cells: [{txt: "Trucking (pickup → cảng Yantian)", kind: "text"}, {txt: "$380", kind: "text", cr: true, mono: true}, {txt: "/ BILL", kind: "text"}, {txt: "~$380", kind: "priceS", cr: true}, {txt: "Từ địa chỉ Foshan, Shunde", kind: "text"}]},
            {kind: "item", cells: [{txt: "Custom (hải quan xuất China)", kind: "text"}, {txt: "$66", kind: "text", cr: true, mono: true}, {txt: "/ BILL", kind: "text"}, {txt: "~$66", kind: "priceS", cr: true}, {txt: "", kind: "text"}]},
            {kind: "item", cells: [{txt: "Port Construction Fee", kind: "text"}, {txt: "$17", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$17", kind: "priceS", cr: true}, {txt: "", kind: "text"}]},
            {kind: "item", cells: [{txt: "VGM — Verified Gross Mass", kind: "text"}, {txt: "$15", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$15", kind: "priceS", cr: true}, {txt: "Cân trọng lượng cont bắt buộc", kind: "text"}]},
            {kind: "sub", cells: [{txt: "Subtotal — Chi phí đầu POL", kind: "text", span: 3}, {txt: "~$847", kind: "price", cr: true}, {txt: "", kind: "text"}]},
            {kind: "group", cells: [{txt: "2 · CƯỚC VẬN CHUYỂN QUỐC TẾ", kind: "text", span: 5}]},
            {kind: "item", cells: [{txt: "Ocean Freight (ZIM FAST · YANTIAN → LAX)", kind: "text"}, {txt: "$7,880", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$7,880", kind: "priceS", cr: true}, {txt: "Dead Freight: +$200/CONT nếu phát sinh", kind: "text"}]},
            {kind: "item", cells: [{txt: "SJJ Surcharge", kind: "text"}, {txt: "$305", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$305", kind: "priceS", cr: true}, {txt: "Validity 31-Aug-2026", kind: "text"}]},
            {kind: "sub", cells: [{txt: "Subtotal — Cước quốc tế", kind: "text", span: 3}, {txt: "~$8,185", kind: "price", cr: true}, {txt: "", kind: "text"}]},
            {kind: "group", cells: [{txt: "3 · CHI PHÍ DDP LAX → HOU", kind: "text", span: 5}]},
            ...SHARED_ROWS_1,
            {kind: "item", cells: [{txt: "Trucking (Dock-to-dock · LAX → Houston)", kind: "text"}, {txt: "$10,155", kind: "text", cr: true, mono: true}, {txt: "/ CONT", kind: "text"}, {txt: "~$10,155", kind: "priceS", cr: true}, {txt: "Legal weight · non-Haz · 1h free · $85/h sau · layover >4h: $550/day", kind: "text"}]},
            ...SHARED_ROWS_2,
            {kind: "sub", cells: [{txt: "Subtotal — Chi phí DDP tại Mỹ", kind: "text", span: 3}, {txt: "~$10,565", kind: "price", cr: true}, {txt: "excl. ADF, bond, if-applicable items", kind: "note"}]},
            ...SHARED_ROWS_3,
        ],
    },
];
