// "Hướng dẫn đọc bảng giá" — the second view inside the rates tab, lifted
// from the XKCN Hub v6.0 sheet (thg_xkcn_v14), tab "Hướng dẫn đọc bảng giá".
//
// Section order, numbering and the colour of every box follow the sheet: the
// numbered navy/gold banners, the green-vs-amber "when to use which" pair, the
// three-mode comparison table with its highlighted row, and the glossary grid.
// The sheet's own page heading is dropped — this page already has a hero.

export type GuideTone = "green" | "amber" | "blue" | "gray";

export type GuideBlock =
    | { kind: "banner"; num: string; title: string; sub: string }
    | { kind: "para"; html: string }
    | { kind: "cols"; boxes: readonly { tone: GuideTone; heading: string; items: readonly string[]; text: string }[] }
    /**  is the sheet's cross-reference to the quotation view. Its
     *  anchor is stripped from  and re-rendered as a real control, so
     *  it switches tabs instead of navigating to "#". */
    | { kind: "note"; tone: GuideTone; html: string; link: string }
    | { kind: "table"; head: readonly string[]; rows: readonly { hl: boolean; cells: readonly { txt: string; pr: boolean }[] }[] }
    | { kind: "gloss"; items: readonly { term: string; def: string }[] }
    | { kind: "divider" };

export const GUIDE_BLOCKS: readonly GuideBlock[] = [
    { kind: "banner", num: "?", title: "Vận chuyển chính ngạch là gì?", sub: "Đọc phần này trước" },
    { kind: "para", html: "<strong>Chính ngạch</strong> là vận chuyển hàng hóa thương mại <strong>hợp pháp, đầy đủ giấy tờ, khai báo hải quan đúng quy định</strong> tại cả Việt Nam lẫn Mỹ." },
    { kind: "cols", boxes: [
        { tone: "green", heading: "✅ Nên dùng chính ngạch khi", text: "", items: [
            "Hàng từ 50 kg trở lên",
            "Nhập kho FBA Amazon",
            "Cần hóa đơn xuất nhập khẩu hợp lệ",
            "Muốn giá rẻ hơn DHL/FedEx",
            "Hàng giá trị cao, cần bảo hiểm",
        ] },
        { tone: "amber", heading: "⚡ Dùng Air Express (DHL) khi", text: "", items: [
            "Hàng nhỏ, dưới 50 kg",
            "Cần giao trong 3–5 ngày",
            "POD đơn lẻ (từng đơn hàng)",
            "Hàng mẫu, thử nghiệm",
        ] },
    ] },
    { kind: "divider" },
    { kind: "banner", num: "1", title: "Ba hình thức vận chuyển trong bảng giá", sub: "Sea Matson · Sea thường · Air" },
    { kind: "table", head: ["Hình thức", "Thời gian", "Phù hợp với", "Giá tương đối"], rows: [
        { hl: true, cells: [{ txt: "🚢 MATSON (Line Hỏa Tốc)", pr: false }, { txt: "17–18 ngày", pr: false }, { txt: "Cần nhanh, lịch cố định Thứ 5", pr: false }, { txt: "Cao hơn Sea thường", pr: false }] },
        { hl: false, cells: [{ txt: "🌊 Sea thường", pr: false }, { txt: "18–40 ngày", pr: false }, { txt: "Không gấp, muốn giá rẻ", pr: false }, { txt: "Rẻ nhất", pr: false }] },
        { hl: false, cells: [{ txt: "✈️ Air (Hàng không)", pr: false }, { txt: "7–8 ngày port-to-port", pr: false }, { txt: "Hàng gấp, giá trị cao", pr: false }, { txt: "Đắt nhất", pr: false }] },
    ] },
    { kind: "divider" },
    { kind: "banner", num: "2", title: "LCL vs FCL — Hàng lẻ hay nguyên container?", sub: "Khái niệm cần hiểu trước khi xem giá Sea" },
    { kind: "cols", boxes: [
        { tone: "green", heading: "📦 LCL — Hàng lẻ", text: "Nhiều khách gom chung 1 container. Tính theo CBM hoặc MT, lấy số nào lớn hơn.", items: [
            "Phù hợp dưới ~12 CBM",
            "Mới bắt đầu, chưa đủ hàng",
        ] },
        { tone: "blue", heading: "🚢 FCL — Nguyên container", text: "Thuê riêng 1 container. Giá mỗi CBM rẻ hơn LCL đáng kể khi hàng đủ nhiều.", items: [
            "Phù hợp từ ~12 CBM trở lên",
            "20GP: ~25 CBM · 40HC: ~68 CBM",
        ] },
    ] },
    { kind: "note", tone: "green", html: "💡 <strong>Quy tắc:</strong> Dưới 10 CBM → LCL. Trên 12 CBM → FCL. Từ 10–12 CBM → hỏi TH Group.", link: "" },
    { kind: "divider" },
    { kind: "banner", num: "3", title: "MATSON · Sea thường · Air — Chi tiết giá và phụ phí", sub: "Xem tab Bảng giá để tra cứu đầy đủ" },
    { kind: "para", html: "Tất cả giá cước, phụ phí, địa chỉ CFS, lịch cut-off và bảng hải quan luồng xanh/vàng/đỏ được hiển thị đầy đủ trong tab <strong>Bảng giá</strong>." },
    { kind: "note", tone: "blue", html: "📋 Muốn xem dự toán chi phí trọn gói cho 1 lô hàng cụ thể (HPH → HOU, 1×40HC)?", link: "Xem tab Dự toán chi phí →" },
    { kind: "divider" },
    { kind: "banner", num: "📖", title: "Bảng giải thích thuật ngữ", sub: "Tra cứu khi gặp từ lạ" },
    { kind: "gloss", items: [
        { term: "LCL / FCL", def: "Hàng lẻ gom chung / Nguyên container thuê riêng" },
        { term: "CBM / MT / W/M", def: "Mét khối / Tấn (1.000 kg) / Lấy số lớn hơn giữa CBM và MT" },
        { term: "CFS", def: "Kho tập kết hàng LCL trước khi lên container" },
        { term: "ETD / ETA / Cut-off", def: "Ngày tàu khởi hành / Đến nơi / Deadline nộp hàng" },
        { term: "HBL / AMS / ISF", def: "Vận đơn nhà / Khai báo điện tử / An ninh nhập khẩu Mỹ" },
        { term: "FAF / MAF", def: "Phụ phí nhiên liệu & cảng biển — đã gộp vào giá Matson FCL" },
        { term: "FBA / All-in / DDP", def: "Kho Amazon / Báo giá trọn gói / Delivered Duty Paid" },
        { term: "Luồng xanh/vàng/đỏ", def: "Phân loại kiểm tra HQ: xanh=thông ngay · vàng=kiểm chứng từ · đỏ=kiểm hàng" },
    ] },
];
