// The four export-paperwork templates shown on /chinh-ngach-pricing, lifted
// from the XKCN Hub v6.0 sheet (thg_xkcn_v14), tab "Mẫu giấy tờ".
//
// The sheet embedded its nine sample files as base64 data URIs, which is most
// of why it weighs 3.2 MB. They are extracted to public/chinh-ngach-docs/ and
// referenced by path, so a visitor downloads one only when they ask for it.
// They were also named .png while being JPEG throughout; the extensions now
// match the bytes.
//
// Hardcoded for the same reason as the commodity lookup — see chinhNgachDocs.ts.

export type Tone = "green" | "amber" | "blue" | "red" | "gray" | "plain";

export type TemplateBlock =
    | { kind: "prose"; title: string; paras: readonly string[] }
    | { kind: "facts"; title: string; items: readonly { label: string; value: string }[] }
    | { kind: "columns"; title: string; boxes: readonly { tone: Tone; heading: string; items: readonly string[] }[] }
    | { kind: "steps"; title: string; items: readonly { n: string; heading: string; body: string }[] }
    /** The sheet's "⚠️ Lỗi phổ biến" warnings — the mistakes that get a shipment
     *  fined or held. Carries inline <strong>. */
    /** The three Vietnamese customs inspection lanes a declaration can be
     *  routed into, green through red. Each carries its own colour in the
     *  source and the colour is the information. */
    | { kind: "lanes"; title: string; items: readonly { tone: string; name: string; tag: string; desc: string }[] }
    | { kind: "callout"; tone: Tone; html: string }
    /**  is the support line printed under the buttons — it carries a
     *  contact address and phone, and inline <strong>. */
    | { kind: "files"; title: string; note: string; footer: string; files: readonly { file: string; label: string }[] };

export interface DocTemplate {
    id: string;
    icon: string;
    title: string;
    sub: string;
    blocks: readonly TemplateBlock[];
}

/** Served from public/, so the path is absolute and needs no import. */
export const DOC_ASSET_BASE = "/chinh-ngach-docs/";

export const DOC_TEMPLATES: readonly DocTemplate[] = [
    {
        id: "ci", icon: "🧾",
        title: "Commercial Invoice",
        sub: "Hóa đơn thương mại — hướng dẫn điền theo chuẩn CBP",
        blocks: [
            { kind: "prose", title: "📘 Commercial Invoice là gì?", paras: [
                "<strong>Commercial Invoice (Hóa đơn thương mại)</strong> là chứng từ thương mại quan trọng nhất trong bộ hồ sơ xuất khẩu. Đây là căn cứ để hải quan Mỹ (<strong>CBP</strong>) xác định giá trị hàng hóa, áp mã HS Code, tính thuế nhập khẩu, và xét duyệt thông quan.",
                "Commercial Invoice khác với Invoice nội địa — phải ghi đầy đủ thông tin theo yêu cầu của <strong>19 CFR Part 141</strong> (Quy định hải quan Mỹ).",
            ] },
            { kind: "facts", title: "", items: [
                { label: "Ai lập?", value: "Người bán / Exporter (doanh nghiệp Việt Nam)" },
                { label: "Ngôn ngữ", value: "Tiếng Anh — bắt buộc khi nhập vào Mỹ" },
                { label: "Số bản cần có", value: "Tối thiểu 3 bản gốc (Exporter / Forwarder / Importer)" },
                { label: "Căn cứ pháp lý", value: "19 CFR §141.86 — CBP Commercial Invoice Requirements" },
            ] },
            { kind: "columns", title: "📋 Các thông tin bắt buộc trên Commercial Invoice (theo CBP)", boxes: [
                { tone: "green", heading: "✅ Thông tin người mua / bán", items: [
                    "Tên + địa chỉ đầy đủ của Exporter (Seller)",
                    "Tên + địa chỉ đầy đủ của Consignee (Buyer/IOR)",
                    "Số Invoice + ngày lập",
                    "Điều kiện giao hàng (Incoterms 2020)",
                    "Phương thức thanh toán (TT, LC, DP...)",
                ] },
                { tone: "blue", heading: "📦 Thông tin hàng hóa", items: [
                    "Mô tả hàng hóa đầy đủ (tên, quy cách, chất liệu)",
                    "HS Code (6 chữ số trở lên)",
                    "Số lượng, đơn vị tính",
                    "Đơn giá + tổng giá (USD)",
                    "Nước xuất xứ (Country of Origin: Vietnam)",
                    "Trọng lượng tịnh / gross",
                ] },
            ] },
            { kind: "callout", tone: "amber", html: "⚠️ <strong>Lỗi phổ biến:</strong> Ghi giá thấp hơn thực tế (undervalue) để tránh thuế → CBP phát hiện sẽ phạt gấp đôi thuế + tịch thu hàng. Ghi sai HS Code → truy thu thuế + penalize." },
            { kind: "files", title: "🖼️ Mẫu Commercial Invoice tham khảo", note: "Bấm vào từng mẫu để xem và tải về (JPG). Các mẫu dưới đây được sử dụng thực tế trong xuất nhập khẩu quốc tế.", footer: "", files: [
                { file: "CI_Mau_1.jpg", label: "⬇️ Tải mẫu CI — Dạng bảng chuẩn" },
                { file: "CI_Mau_2.jpg", label: "⬇️ Tải mẫu CI — Casio format" },
                { file: "CI_Mau_3.jpg", label: "⬇️ Tải mẫu CI — Microdyn Singapore" },
                { file: "CI_Mau_4.jpg", label: "⬇️ Tải mẫu CI — Trương Phú Vinh" },
            ] },
        ],
    },
    {
        id: "pl", icon: "📦",
        title: "Packing List",
        sub: "Phiếu đóng gói — cấu trúc chuẩn và cách điền theo từng loại hàng",
        blocks: [
            { kind: "prose", title: "📘 Packing List là gì?", paras: [
                "<strong>Packing List (Phiếu đóng gói)</strong> là chứng từ mô tả chi tiết cách đóng gói hàng hóa trong lô hàng xuất khẩu. Cùng với Commercial Invoice, Packing List giúp hải quan CBP và người nhận hàng kiểm tra, đối chiếu hàng hóa thực tế.",
                "Packing List không có giá trị hàng hóa (không ghi giá), chỉ tập trung vào <strong>số lượng, đóng gói, trọng lượng và thể tích</strong>.",
            ] },
            { kind: "facts", title: "", items: [
                { label: "Ai lập?", value: "Người bán / Exporter (doanh nghiệp Việt Nam)" },
                { label: "Ngôn ngữ", value: "Tiếng Anh — phải khớp với Commercial Invoice" },
                { label: "Số bản cần có", value: "Tối thiểu 3 bản (Exporter / Forwarder / Importer)" },
                { label: "Lưu ý quan trọng", value: "Số lượng, trọng lượng phải khớp 100% với B/L và Invoice" },
            ] },
            { kind: "columns", title: "📋 Thông tin bắt buộc trong Packing List", boxes: [
                { tone: "green", heading: "✅ Thông tin chung", items: [
                    "Tên + địa chỉ Shipper và Consignee",
                    "Số Invoice tham chiếu + ngày",
                    "Số B/L (nếu đã có)",
                    "Cảng xếp hàng → Cảng dỡ hàng",
                    "Phương thức vận chuyển (Sea / Air)",
                ] },
                { tone: "blue", heading: "📦 Chi tiết từng kiện hàng", items: [
                    "Số thứ tự kiện / mark & number",
                    "Mô tả hàng hóa trong kiện",
                    "Số lượng (PCS / CTN / SET...)",
                    "Trọng lượng tịnh (Net Weight) — kg",
                    "Trọng lượng cả bì (Gross Weight) — kg",
                    "Thể tích (CBM)",
                ] },
            ] },
            { kind: "callout", tone: "amber", html: "⚠️ <strong>Lỗi phổ biến:</strong> Trọng lượng trong Packing List không khớp với B/L → hải quan nghi ngờ, có thể kiểm tra thực tế hàng (Luồng đỏ). Số kiện sai → delay thông quan." },
            { kind: "files", title: "🖼️ Mẫu Packing List tham khảo", note: "Bấm vào từng mẫu để xem và tải về (JPG).", footer: "", files: [
                { file: "PL_Mau_1.jpg", label: "⬇️ Tải mẫu PL — Dạng bảng quốc tế" },
                { file: "PL_Mau_2.jpg", label: "⬇️ Tải mẫu PL — Long Uyen format" },
                { file: "PL_Mau_3.jpg", label: "⬇️ Tải mẫu PL — Shandong CHT format" },
                { file: "PL_Mau_4.jpg", label: "⬇️ Tải mẫu PL — Trương Phú Vinh format" },
            ] },
        ],
    },
    {
        id: "ior", icon: "🛡️",
        title: "Hợp đồng ủy thác nhập khẩu (IOR)",
        sub: "Warehouse & Order Fulfillment Service Agreement — tải file mẫu THG",
        blocks: [
            { kind: "prose", title: "📘 IOR là gì?", paras: [
                "<strong>IOR (Importer of Record)</strong> — Người Nhập Khẩu Chính Thức — là cá nhân hoặc tổ chức <strong>chịu trách nhiệm pháp lý</strong> về việc hàng hóa được nhập khẩu hợp pháp vào Mỹ. IOR phải có mã số thuế hoặc EIN tại Mỹ, đứng tên trên tờ khai hải quan CBP, và chịu trách nhiệm nộp thuế nhập khẩu.",
                "Với doanh nghiệp Việt Nam <strong>chưa có công ty LLC tại Mỹ</strong>, THG cung cấp dịch vụ IOR thông qua đối tác <strong>RES Trade &amp; Transit LLC</strong> — đứng tên nhập khẩu hàng hóa thay mặt khách hàng.",
            ] },
            { kind: "facts", title: "", items: [
                { label: "Bên cung cấp IOR", value: "RES Trade & Transit LLC502 W 7th ST STE 100, Erie, PA 16592" },
                { label: "Mã số doanh nghiệp", value: "EIN: 33-5019901" },
                { label: "Kho nhận hàng", value: "4136 Sunflower CircleWinston-Salem, NC 27105" },
                { label: "Phương thức thanh toán", value: "Bank transfer USDBank of America · SWIFT: BOFAUS3N" },
            ] },
            { kind: "columns", title: "⚡ Khi nào cần IOR?", boxes: [
                { tone: "green", heading: "✅ Bắt buộc phải có IOR khi", items: [
                    "Hàng trị giá trên $800 USD vào Mỹ",
                    "Doanh nghiệp VN chưa có LLC tại Mỹ",
                    "Nhập hàng theo đường sea/air chính ngạch",
                    "Cần thông quan CBP hợp lệ",
                ] },
                { tone: "blue", heading: "📋 Nội dung hợp đồng IOR bao gồm", items: [
                    "Lưu kho và quản lý tồn kho tại Mỹ",
                    "Xử lý đơn hàng (pick, pack, ship)",
                    "Mua nhãn vận chuyển USPS/UPS/FedEx",
                    "Báo cáo tồn kho hàng tháng",
                ] },
            ] },
            { kind: "steps", title: "📋 Quy trình ký kết và sử dụng IOR", items: [
                { n: "01", heading: "Tải file hợp đồng mẫu", body: "Tải về file DOCX bên dưới, điền thông tin Bên A (doanh nghiệp của bạn): tên, địa chỉ, mã số thuế, người đại diện." },
                { n: "02", heading: "Gửi cho THG review", body: "Gửi bản điền về sale@thgfulfill.com để THG kiểm tra và kết nối với đối tác RES Trade & Transit LLC tại Mỹ." },
                { n: "03", heading: "Ký kết & hiệu lực", body: "Hai bên ký kết điện tử hoặc bản cứng. Hợp đồng có hiệu lực ngay — THG cung cấp số hợp đồng để gắn vào bộ chứng từ xuất khẩu." },
                { n: "04", heading: "Sử dụng IOR cho lô hàng", body: "Ghi thông tin RES Trade & Transit LLC vào Commercial Invoice và bộ chứng từ. THG đứng tên thông quan tại CBP thay bạn." },
            ] },
            { kind: "files", title: "", note: "📁 File hợp đồng mẫu song ngữ Anh–Việt. Mở bằng Microsoft Word hoặc Google Docs để chỉnh sửa thông tin Bên A.", footer: "Cần hỗ trợ điền và ký hợp đồng? Liên hệ <strong>sale@thgfulfill.com</strong> · <strong>033 512 4089</strong>", files: [
                { file: "THG_IOR_Agreement_Mau.docx", label: "⬇️Tải hợp đồng IOR mẫu (.docx)" },
            ] },
        ],
    },
    {
        id: "tk", icon: "📋",
        title: "Tờ khai hải quan xuất khẩu",
        sub: "Hướng dẫn khai báo hải quan điện tử VNACCS",
        blocks: [
            { kind: "prose", title: "📘 Tờ khai hải quan xuất khẩu là gì?", paras: [
                "<strong>Tờ khai hải quan xuất khẩu</strong> là văn bản pháp lý khai báo thông tin hàng hóa với Hải quan Việt Nam khi xuất khẩu. Từ năm 2014, Việt Nam áp dụng hệ thống khai báo điện tử <strong>VNACCS/VCIS</strong> — doanh nghiệp khai báo online và nhận kết quả phân luồng tự động.",
            ] },
            { kind: "columns", title: "", boxes: [
                { tone: "gray", heading: "📌 Thông tin bắt buộc phải khai", items: [
                    "Tên hàng hóa + HS Code chính xác",
                    "Số lượng, trọng lượng, trị giá (USD)",
                    "Điều kiện giao hàng (Incoterms)",
                    "Cảng xếp hàng và cảng dỡ hàng",
                    "Phương tiện vận chuyển",
                ] },
                { tone: "amber", heading: "⚠️ Lỗi hay gặp khi khai tờ khai", items: [
                    "Sai HS Code → truy thu thuế",
                    "Trị giá thấp hơn thực tế → vi phạm",
                    "Thiếu giấy phép XK (nếu có)",
                    "Không khớp với Commercial Invoice",
                ] },
            ] },
            { kind: "lanes", title: "🚦 Ba luồng phân loại sau khi khai", items: [
                { tone: "xanh", name: "🟢 Luồng Xanh", tag: "Thông ngay", desc: "Không cần kiểm tra thêm · Phổ biến nhất" },
                { tone: "vang", name: "🟡 Luồng Vàng", tag: "Kiểm CT", desc: "Hải quan kiểm tra chứng từ giấy tờ" },
                { tone: "do", name: "🔴 Luồng Đỏ", tag: "Kiểm hàng", desc: "Kiểm tra thực tế hàng hóa · Mất thêm 1–3 ngày" },
            ] },
            { kind: "callout", tone: "blue", html: "💡 <strong>THG hỗ trợ toàn bộ:</strong> Khai báo tờ khai hải quan điện tử, nộp ISF, và thông quan nhập khẩu tại CBP — doanh nghiệp chỉ cần cung cấp thông tin hàng hóa và chứng từ. Liên hệ <strong>sale@thgfulfill.com</strong> để được hỗ trợ." },
        ],
    },
];
