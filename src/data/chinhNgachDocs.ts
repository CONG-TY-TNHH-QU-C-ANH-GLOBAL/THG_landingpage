// Export-document lookup for /chinh-ngach-pricing, lifted from the XKCN Hub v6.0
// sheet (thg_xkcn_v14), tab "Tra cứu giấy tờ xuất khẩu".
//
// HARDCODED ON PURPOSE, unlike the rate cards on the same page. Those move with
// the market and are edited by operations through the CMS Rate Card Builder.
// This is regulatory reference data: which certificates a commodity needs to
// leave Vietnam and clear US customs. It changes when a regulator changes it,
// which is rare and never urgent, and it has no CMS table, no admin screen and
// no API. Adding all three to edit 30 rows a year is not worth the surface —
// a pull request is the right review gate for a claim about what the law wants.
//
// 30 commodities, 296 document entries, 139 distinct certificate types.

/** Inspection tiers as the source sheet groups them: required for every
 *  shipment of this commodity, required only when a condition holds, or
 *  commercially useful but never demanded. */
export interface GoodsDocs {
    req: readonly string[];
    cond: readonly string[];
    opt: readonly string[];
}

export interface GoodsItem {
    id: number;
    cat: CategoryKey;
    name: string;
    /** Heading-level HS code, e.g. "HS 0901" or a range. */
    hs: string;
    docs: GoodsDocs;
    /** Carries inline <strong> from the source sheet. */
    note: string;
}

export type CategoryKey = "all" | "nong" | "che" | "may" | "go" | "dien" | "hoa" | "khac";

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
    all: "Tất cả mặt hàng",
    nong: "Nông sản / Thực phẩm",
    che: "Hàng chế biến",
    may: "Dệt may / Da giày",
    go: "Gỗ / Thủ công mỹ nghệ",
    dien: "Điện tử / Cơ khí",
    hoa: "Hóa chất / Vật liệu",
    khac: "Hàng khác",
};

export const CATEGORY_ICONS: Record<CategoryKey, string> = {
    all: "🗂️",
    nong: "🌾",
    che: "🏭",
    may: "👗",
    go: "🪵",
    dien: "⚡",
    hoa: "🧪",
    khac: "🎯",
};

export const GOODS: readonly GoodsItem[] = [
    {
        id: 1, cat: "nong", name: "Cà phê", hs: "HS 0901",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L hoặc AWB",
                "C/O Form B (VCCI)",
                "Phytosanitary Certificate (Cục BVTV)",
                "Tờ khai hải quan xuất khẩu",
                "FDA Prior Notice",
            ],
            cond: [
                "ICO Certificate (nếu xuất qua thành viên ICO)",
                "EUDR Compliance (nếu tái xuất sang EU từ Mỹ)",
            ],
            opt: [
                "Certificate of Analysis (COA)",
                "Organic Certificate",
            ],
        },
        note: "FDA yêu cầu <strong>Prior Notice</strong> trước khi tàu cập cảng Mỹ. Cần đăng ký cơ sở sản xuất với FDA (FFRN).",
    },
    {
        id: 2, cat: "nong", name: "Hạt điều", hs: "HS 0801",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L",
                "C/O Form B hoặc RCEP",
                "Phytosanitary Certificate",
                "Tờ khai hải quan",
                "Kiểm dịch thực vật (Cục BVTV)",
                "FDA Prior Notice",
            ],
            cond: [
                "COA (aflatoxin, moisture — FDA yêu cầu)",
            ],
            opt: [
                "HACCP Certificate",
            ],
        },
        note: "FDA kiểm soát <strong>aflatoxin</strong> chặt chẽ — cần COA từ lab được công nhận. Prior Notice bắt buộc trước khi hàng vào Mỹ.",
    },
    {
        id: 3, cat: "nong", name: "Gạo", hs: "HS 1006",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L",
                "C/O Form B",
                "Phytosanitary Certificate",
                "Giấy phép xuất khẩu gạo (Bộ Công Thương)",
                "Tờ khai hải quan",
                "FDA Prior Notice",
                "Chứng nhận chất lượng gạo (Bộ NN)",
            ],
            cond: [
                "Fumigation Certificate (nếu CBP yêu cầu)",
            ],
            opt: [],
        },
        note: "Gạo là mặt hàng <strong>quản lý xuất khẩu</strong>. FDA bắt buộc Prior Notice và đăng ký cơ sở sản xuất.",
    },
    {
        id: 4, cat: "nong", name: "Hồ tiêu", hs: "HS 0904",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L",
                "C/O Form B",
                "Phytosanitary Certificate",
                "Tờ khai hải quan",
                "FDA Prior Notice",
            ],
            cond: [
                "COA (Mycotoxin, Salmonella)",
                "HACCP / ISO 22000 Certificate",
            ],
            opt: [
                "Organic Certificate",
            ],
        },
        note: "FDA kiểm tra Salmonella và tạp chất. Cần COA từ lab được FDA công nhận khi xuất sang Mỹ.",
    },
    {
        id: 5, cat: "nong", name: "Mì ăn liền / Thực phẩm đóng gói", hs: "HS 1902",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L hoặc AWB",
                "C/O Form B",
                "Tờ khai hải quan",
                "Giấy chứng nhận ATTP (Bộ Y tế)",
                "Health Certificate",
                "FDA Prior Notice",
                "FDA Facility Registration (FFRN)",
                "Nhãn hàng chuẩn FDA (Nutrition Facts + Ingredient list tiếng Anh)",
            ],
            cond: [
                "Halal Certificate (nếu quảng bá Halal)",
            ],
            opt: [],
        },
        note: "Nhãn hàng <strong>bắt buộc</strong> có Nutrition Facts + Ingredient list tiếng Anh theo chuẩn 21 CFR 101. Đây là lý do phổ biến nhất bị FDA hold.",
    },
    {
        id: 6, cat: "nong", name: "Trái cây tươi / sấy khô", hs: "HS 0804–0813",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L / AWB",
                "Phytosanitary Certificate",
                "C/O",
                "Tờ khai hải quan",
                "Mã số vùng trồng (Cục BVTV cấp)",
                "Mã số cơ sở đóng gói",
                "FDA Prior Notice",
            ],
            cond: [
                "Irradiation Certificate (xoài sang Mỹ bắt buộc)",
                "Cold Treatment Record (theo yêu cầu USDA APHIS)",
            ],
            opt: [],
        },
        note: "<strong>Xoài tươi sang Mỹ bắt buộc chiếu xạ</strong> tại cơ sở được USDA cấp phép. Mã vùng trồng + cơ sở đóng gói là điều kiện tiên quyết.",
    },
    {
        id: 7, cat: "che", name: "Đồ uống / Nước giải khát", hs: "HS 2202",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L",
                "C/O Form B",
                "Giấy chứng nhận ATTP",
                "Health Certificate",
                "FDA Prior Notice",
                "FDA Facility Registration / FFRN",
                "Nhãn FDA-compliant (Supplement Facts hoặc Nutrition Facts)",
            ],
            cond: [
                "COA (vi sinh, hóa học)",
                "Halal Certificate (nếu quảng bá)",
            ],
            opt: [],
        },
        note: "Cơ sở sản xuất phải <strong>đăng ký với FDA (FFRN)</strong> — bước hay bị bỏ quên. Không có số đăng ký là hàng bị hold ngay tại cửa khẩu Mỹ.",
    },
    {
        id: 8, cat: "che", name: "Mỹ phẩm / Chăm sóc da", hs: "HS 3304",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L / AWB",
                "C/O",
                "Tờ khai hải quan",
                "Bảng thành phần (INCI list tiếng Anh)",
                "FDA Cosmetic Facility Registration (MoCRA 2024)",
                "GMP Certificate",
            ],
            cond: [
                "Free Sale Certificate (Cục Y tế cấp — FDA có thể yêu cầu)",
                "COA (nếu chứa thành phần đặc biệt)",
            ],
            opt: [
                "Cruelty-Free / Vegan Certificate",
            ],
        },
        note: "Từ 2024, Mỹ yêu cầu tuân thủ <strong>MoCRA</strong> — đăng ký cơ sở và sản phẩm với FDA. Nhãn phải ghi thành phần theo thứ tự INCI.",
    },
    {
        id: 9, cat: "che", name: "Thực phẩm chức năng / TPBVSK", hs: "HS 2106",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L / AWB",
                "C/O",
                "Giấy chứng nhận ATTP",
                "Health Certificate",
                "FDA Prior Notice",
                "FDA Facility Registration",
                "Supplement Facts Label đúng chuẩn 21 CFR 101.36",
                "COA (kiểm nghiệm thành phần)",
            ],
            cond: [
                "GMP NSF / USP Certificate",
                "Free Sale Certificate",
            ],
            opt: [],
        },
        note: "Mỹ phân loại là <strong>Dietary Supplement</strong> — phải tuân thủ 21 CFR Part 111 (GMP). Amazon US chặn listing nếu thiếu COA hoặc nhãn sai format.",
    },
    {
        id: 10, cat: "che", name: "Đồ chơi trẻ em", hs: "HS 9503",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L / AWB",
                "C/O",
                "Tờ khai hải quan",
                "Test Report ASTM F963 (bắt buộc — Mỹ)",
                "Children's Product Certificate — CPC (CPSC bắt buộc)",
                "CPSIA Lead & Phthalates Test Report",
            ],
            cond: [
                "California Prop 65 Warning (nếu bán tại CA)",
            ],
            opt: [],
        },
        note: "CPSC yêu cầu <strong>CPC + third-party test từ lab được CPSC công nhận</strong> — bắt buộc. Amazon US từ chối listing nếu thiếu.",
    },
    {
        id: 11, cat: "may", name: "Quần áo / May mặc", hs: "HS 6101–6217",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L",
                "C/O Form B (hoặc EVFTA nếu có)",
                "Tờ khai hải quan",
                "Visa dệt may (nếu diện hạn ngạch)",
                "Nhãn thành phần sợi + hướng dẫn giặt (tiếng Anh — FTC Rule)",
            ],
            cond: [
                "UFLPA Declaration (nguồn gốc bông — CBP có thể yêu cầu)",
                "Test Report OEKO-TEX (nếu khách mua yêu cầu)",
            ],
            opt: [
                "GOTS Certificate (nếu Organic cotton)",
            ],
        },
        note: "FTC (Mỹ) bắt buộc nhãn ghi <strong>fiber content + care instruction bằng tiếng Anh</strong>. CBP kiểm tra <strong>UFLPA</strong> — cần chứng minh bông không từ Tân Cương.",
    },
    {
        id: 12, cat: "may", name: "Giày dép", hs: "HS 6401–6405",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L",
                "C/O Form B",
                "Tờ khai hải quan",
                "Mô tả vật liệu upper/outsole (CBP yêu cầu)",
            ],
            cond: [
                "California Prop 65 Warning",
                "Anti-dumping declaration (một số loại giày da)",
            ],
            opt: [],
        },
        note: "CBP phân loại thuế suất dựa vào <strong>vật liệu upper (da thật vs da tổng hợp)</strong> — khai sai dẫn đến truy thu thuế. Một số loại giày da bị anti-dumping duty.",
    },
    {
        id: 13, cat: "may", name: "Túi xách / Ba lô", hs: "HS 4202",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L / AWB",
                "C/O",
                "Tờ khai hải quan",
            ],
            cond: [
                "California Prop 65 Warning (nếu chứa chất hóa học)",
                "CITES Certificate (nếu da thật từ động vật hoang dã)",
            ],
            opt: [
                "Brand Authorization Letter (nếu làm OEM cho thương hiệu Mỹ)",
            ],
        },
        note: "Nếu hàng có logo thương hiệu nước ngoài cần <strong>Authorization Letter</strong> tránh CBP tịch thu nghi hàng giả.",
    },
    {
        id: 14, cat: "may", name: "Khăn / Vải / Sợi", hs: "HS 5208–5407",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L",
                "C/O",
                "Tờ khai hải quan",
                "Mô tả thành phần sợi (fiber content — FTC Rule)",
            ],
            cond: [
                "UFLPA Declaration (nguồn gốc bông — CBP có thể yêu cầu)",
                "Visa dệt may (nếu diện hạn ngạch)",
            ],
            opt: [
                "GOTS / BCI Cotton (nếu khách yêu cầu)",
            ],
        },
        note: "CBP kiểm tra chặt <strong>UFLPA</strong> với vải bông — cần chứng minh nguồn gốc sợi không từ Tân Cương (Xinjiang). Khai sai fiber content bị phạt theo FTC.",
    },
    {
        id: 15, cat: "go", name: "Đồ gỗ nội thất", hs: "HS 9401–9403",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L",
                "C/O Form B",
                "Tờ khai hải quan",
                "Hồ sơ nguồn gốc gỗ hợp pháp (FLEGT/VPA hoặc tương đương)",
                "Bảng kê lâm sản (Kiểm lâm cấp)",
                "Fumigation Certificate (ISPM 15)",
                "Lacey Act Declaration (bắt buộc — kê khai loài gỗ)",
            ],
            cond: [
                "CARB Phase 2 Compliance Certificate (ván ép/MDF/gỗ ép — California + nhiều tiểu bang Mỹ)",
                "CITES Permit (loài gỗ quý trong danh sách CITES)",
            ],
            opt: [
                "FSC / PEFC Certificate",
            ],
        },
        note: "<strong>Lacey Act Declaration (PPQ 505)</strong> bắt buộc — kê khai chính xác tên khoa học loài gỗ, nước khai thác, khối lượng. Sai thông tin = tịch thu và phạt nặng. CARB Phase 2 bắt buộc nếu bán qua Amazon hoặc retailer lớn.",
    },
    {
        id: 16, cat: "go", name: "Thủ công mỹ nghệ (gốm, mây tre)", hs: "HS 4601, 6912",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L / AWB",
                "C/O",
                "Tờ khai hải quan",
                "Fumigation Certificate (sản phẩm mây tre — ISPM 15)",
            ],
            cond: [
                "Lead & Cadmium Test Report (gốm sứ — FDA kiểm tra)",
                "California Prop 65 Warning",
            ],
            opt: [
                "Certificate of Handmade Origin",
            ],
        },
        note: "Gốm sứ vào Mỹ bị FDA kiểm tra <strong>hàm lượng chì (lead) và cadmium</strong>. Cần test report từ lab được FDA/CPSC công nhận.",
    },
    {
        id: 17, cat: "go", name: "Giấy / Bao bì giấy", hs: "HS 4802–4823",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L",
                "C/O",
                "Tờ khai hải quan",
            ],
            cond: [
                "Phytosanitary Certificate (nếu là bột giấy/giấy thô)",
                "Lacey Act Declaration (nếu giấy có nguồn gốc từ gỗ)",
            ],
            opt: [
                "FSC Certificate",
                "Recycled Content Declaration",
            ],
        },
        note: "Giấy có nguồn gốc từ gỗ cần <strong>Lacey Act Declaration</strong> kê khai loài gỗ. FSC Certificate giúp vào được chuỗi retailer lớn tại Mỹ.",
    },
    {
        id: 18, cat: "go", name: "Nến thơm / Tinh dầu", hs: "HS 3406, 3301",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L / AWB",
                "C/O",
                "Tờ khai hải quan",
                "SDS — Safety Data Sheet (tiếng Anh, chuẩn OSHA HazCom 2012)",
                "IFRA Compliance Statement",
            ],
            cond: [
                "DG Declaration Class 3 (nếu flashpoint < 60°C — hàng không)",
                "Flash Point Test Certificate",
            ],
            opt: [
                "COA (GC/MS analysis — tinh dầu nguyên chất)",
            ],
        },
        note: "Tinh dầu có flashpoint < 60°C bị phân loại <strong>hàng nguy hiểm (DG Class 3)</strong> — cần DGD khi vận chuyển hàng không, không phải mọi hãng đều chấp nhận.",
    },
    {
        id: 19, cat: "dien", name: "Thiết bị điện tử tiêu dùng", hs: "HS 8471–8543",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L / AWB",
                "C/O",
                "Tờ khai hải quan",
                "FCC ID hoặc FCC Authorization (thiết bị phát sóng — bắt buộc)",
                "RoHS Declaration",
            ],
            cond: [
                "UL / ETL Listing (khuyến nghị mạnh để bán qua retail Mỹ)",
                "California Prop 65 Warning",
            ],
            opt: [
                "ENERGY STAR (nếu là thiết bị tiết kiệm năng lượng)",
            ],
        },
        note: "<strong>FCC Authorization bắt buộc</strong> với mọi thiết bị phát sóng (WiFi, Bluetooth, cellular). Amazon US từ chối listing thiết bị wireless nếu không có FCC ID.",
    },
    {
        id: 20, cat: "dien", name: "Pin / Sạc / Thiết bị dùng pin Lithium", hs: "HS 8507, 8504",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L / AWB",
                "C/O",
                "Tờ khai hải quan",
                "UN38.3 Test Report (bắt buộc tuyệt đối — mọi hãng vận chuyển)",
                "MSDS / SDS (tiếng Anh)",
                "DG Declaration Class 9",
            ],
            cond: [
                "FCC ID (nếu có chức năng wireless)",
                "Packing Instruction PI 965 / 966 / 967 (hàng không — theo loại pin)",
                "California Prop 65 Warning",
            ],
            opt: [],
        },
        note: "<strong>UN38.3 Test Report là điều kiện cứng</strong> — không có thì không hãng vận chuyển nào nhận, kể cả UPS/FedEx/DHL. Pin > 100Wh bị nhiều hãng hàng không từ chối hoàn toàn.",
    },
    {
        id: 21, cat: "dien", name: "Máy móc / Thiết bị công nghiệp", hs: "HS 8421–8479",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L",
                "C/O",
                "Tờ khai hải quan",
                "Manual / Technical Specification (tiếng Anh)",
            ],
            cond: [
                "OSHA Compliance Documentation",
                "ETL / UL Listing (nếu có thành phần điện — bắt buộc với retail)",
                "FCC (nếu phát sóng)",
            ],
            opt: [
                "ISO 9001 Certificate",
            ],
        },
        note: "Máy móc công nghiệp vào Mỹ không bắt buộc CE nhưng nếu bán cho doanh nghiệp cần <strong>UL/ETL Listing</strong> để vào được hệ thống. OSHA có thể kiểm tra thiết bị tại nơi làm việc.",
    },
    {
        id: 22, cat: "dien", name: "Đồ gia dụng điện (nồi, quạt, bếp)", hs: "HS 8516",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L / AWB",
                "C/O",
                "Tờ khai hải quan",
                "RoHS Declaration",
            ],
            cond: [
                "ETL / UL Listing (bắt buộc nếu bán qua Target, Walmart, Amazon retail)",
                "FCC (nếu có wireless)",
                "ENERGY STAR",
            ],
            opt: [],
        },
        note: "Điện áp Mỹ là <strong>110V / 60Hz</strong> — hàng phải tương thích hoặc kèm adapter. UL/ETL Listing gần như bắt buộc nếu muốn vào chuỗi bán lẻ lớn tại Mỹ.",
    },
    {
        id: 23, cat: "hoa", name: "Sơn / Keo / Chất phủ bề mặt", hs: "HS 3208–3214",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L",
                "C/O",
                "Tờ khai hải quan",
                "SDS / MSDS (chuẩn GHS, tiếng Anh)",
                "DG Declaration (nếu flashpoint thấp)",
            ],
            cond: [
                "EPA Registration (nếu sơn chứa biocide)",
                "California VOC Compliance (CARB/SCAQMD)",
                "California Prop 65 Warning",
            ],
            opt: [],
        },
        note: "Hóa chất bắt buộc có <strong>SDS chuẩn GHS tiếng Anh</strong> — OSHA Hazard Communication Standard. Nếu sơn chứa biocide (chống nấm, diệt khuẩn), phải đăng ký EPA số 3a(4).",
    },
    {
        id: 24, cat: "hoa", name: "Gạch / Đá ốp lát / Vật liệu xây dựng", hs: "HS 6907–6914",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L",
                "C/O",
                "Tờ khai hải quan",
            ],
            cond: [
                "ANSI / ASTM Test Report (một số tiểu bang Mỹ yêu cầu)",
                "California Prop 65 Warning (nếu chứa silica hoặc chì)",
                "Asbestos-free Declaration",
            ],
            opt: [
                "ISO 13006 (gạch ceramic)",
            ],
        },
        note: "Mỹ không yêu cầu CE nhưng nhiều dự án xây dựng yêu cầu chứng chỉ <strong>ANSI A137.1</strong> (gạch ceramic). Prop 65 quan trọng nếu bán tại California.",
    },
    {
        id: 25, cat: "hoa", name: "Phân bón / Thuốc BVTV", hs: "HS 3101–3105, 3808",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L",
                "C/O",
                "Tờ khai hải quan",
                "Giấy phép xuất khẩu (Bộ NN)",
                "SDS / MSDS (tiếng Anh)",
                "COA (thành phần hoạt chất)",
                "DG Declaration (tùy hoạt chất)",
                "EPA Registration Number (thuốc BVTV — bắt buộc vào Mỹ)",
            ],
            cond: [
                "Import Permit của USDA / EPA",
            ],
            opt: [],
        },
        note: "Thuốc BVTV sang Mỹ <strong>bắt buộc có EPA Registration Number</strong> theo FIFRA. Không có số đăng ký = bị từ chối nhập khẩu hoàn toàn. Quy trình xin đăng ký EPA mất 1–3 năm.",
    },
    {
        id: 26, cat: "khac", name: "Dụng cụ thể thao / Yoga", hs: "HS 9506",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L / AWB",
                "C/O",
                "Tờ khai hải quan",
            ],
            cond: [
                "CPSIA Test (nếu dùng cho trẻ em dưới 12 tuổi)",
                "California Prop 65 Warning (PVC/TPE — phthalate, lead)",
            ],
            opt: [
                "ASTM F963 (nếu có tính năng đồ chơi)",
            ],
        },
        note: "Thảm yoga, dây đàn hồi làm từ PVC/TPE hay bị <strong>California Prop 65</strong> — cần kiểm tra phthalate và lead nếu bán tại California.",
    },
    {
        id: 27, cat: "khac", name: "Trang sức / Phụ kiện thời trang", hs: "HS 7113–7117",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L / AWB",
                "C/O",
                "Tờ khai hải quan",
                "Mô tả vật liệu (kim loại, đá quý — CBP yêu cầu)",
            ],
            cond: [
                "Prop 65 Lead & Cadmium Test (bán tại California — bắt buộc thực tế)",
                "Kimberley Process Certificate (nếu có kim cương thô)",
            ],
            opt: [],
        },
        note: "Trang sức kim loại vào Mỹ không bị FDA/CE, nhưng <strong>Prop 65 Lead Test là yêu cầu thực tế</strong> nếu bán tại California. CBP yêu cầu khai đúng hàm lượng vàng/bạc.",
    },
    {
        id: 28, cat: "khac", name: "Thiết bị y tế / Dụng cụ chăm sóc sức khỏe", hs: "HS 9018–9021",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L / AWB",
                "C/O",
                "Tờ khai hải quan",
                "FDA Device Registration + Listing (bắt buộc)",
                "Declaration of Conformity",
            ],
            cond: [
                "FDA 510(k) Pre-market Notification (Class II)",
                "PMA — Premarket Approval (Class III)",
                "ISO 13485 Certificate",
            ],
            opt: [
                "Biocompatibility Test ISO 10993 (thiết bị tiếp xúc cơ thể)",
            ],
        },
        note: "<strong>Mọi thiết bị y tế vào Mỹ đều phải đăng ký với FDA</strong> — kể cả Class I exempt. Class II cần 510(k) — quy trình 3–12 tháng. Không đủ giấy tờ = bị FDA hold và recall.",
    },
    {
        id: 29, cat: "khac", name: "Sách / Tài liệu in / Văn phòng phẩm", hs: "HS 4901, 4820",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L / AWB",
                "C/O",
                "Tờ khai hải quan",
            ],
            cond: [
                "Copyright Authorization (nếu in sách có bản quyền nước ngoài)",
                "Lacey Act Declaration (nếu giấy in có nguồn gốc từ gỗ)",
            ],
            opt: [
                "FSC Certificate (nếu khách mua yêu cầu)",
            ],
        },
        note: "Không có rào cản kỹ thuật lớn vào Mỹ, nhưng cần tránh <strong>vi phạm bản quyền</strong>. U.S. Copyright Act áp dụng cho hàng nhập — CBP có thể tịch thu hàng vi phạm.",
    },
    {
        id: 30, cat: "khac", name: "Phụ tùng ô tô / Xe máy", hs: "HS 8708, 8714",
        docs: {
            req: [
                "Commercial Invoice",
                "Packing List",
                "B/L",
                "C/O",
                "Tờ khai hải quan",
                "Mô tả kỹ thuật / spec sheet",
            ],
            cond: [
                "FMVSS Compliance Documentation (phụ tùng liên quan an toàn — bắt buộc)",
                "NHTSA Registration (một số phụ tùng)",
                "OEM Authorization / Brand Letter (nếu mang logo OEM)",
            ],
            opt: [
                "California ARB Compliance (phụ tùng liên quan khí thải)",
            ],
        },
        note: "Phụ tùng an toàn (phanh, lốp, airbag, đèn) phải tuân thủ <strong>FMVSS (Federal Motor Vehicle Safety Standards)</strong>. NHTSA có thể recall lô hàng không đạt chuẩn.",
    },
];
