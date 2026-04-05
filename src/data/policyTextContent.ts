/**
 * Nội dung text của chính sách THG — trích xuất từ 70 ảnh chính sách.
 * Dùng cho dual-mode rendering: VI=image gallery, EN/ZH=text (GTranslate dịch tự động).
 * Mục "Vận chuyển" link sang /chinh-sach-van-chuyen (đã có đầy đủ text).
 */

export interface PolicyTextBlock {
    heading: string;
    content: string[];           // mỗi phần tử là 1 paragraph hoặc bullet point
    type?: "info" | "warn" | "table";
}

export interface PolicyTextSection {
    id: string;
    blocks: PolicyTextBlock[];
}

export const policyTextContent: Record<string, PolicyTextSection> = {
    /* ═══════════════════════════════════════════
     *   1. CHÍNH SÁCH WAREHOUSE
     * ═══════════════════════════════════════════ */
    warehouse: {
        id: "warehouse",
        blocks: [
            {
                heading: "Thông tin kho THG Warehouse US",
                content: [
                    "Địa chỉ: 108 Almond CT, Milford, Pennsylvania",
                    "Zip code: 18337",
                    "Phone: +1 (570) 618-1169",
                ],
            },
            {
                heading: "Quy định vận chuyển nội địa USA — USPS Ground Advantage",
                content: [
                    "Trọng lượng tối đa không quá 20 pound (khoảng 9kg).",
                    "Tổng kích thước (dài + (rộng + cao) × 2) phải nhỏ hơn 108 inch (khoảng 274cm).",
                    "Thể tích (V) giới hạn ở 1728 inch khối (khoảng 0.076 m³). Nếu vượt quá, trọng lượng sẽ được tính theo thể tích.",
                    "Công thức tính trọng lượng theo thể tích: chiều dài × chiều rộng × chiều cao / 166 (kích thước tính bằng inch, trọng lượng kết quả tính bằng ounce (lb)).",
                ],
            },
            {
                heading: "Chính sách xử lý — Hàng gửi qua kho US không đúng quy cách",
                content: [
                    "Điều kiện: Hàng hóa nhập kho không có mã barcode, không đóng gói phân loại SKU theo tiêu chuẩn nhập kho của THG.",
                    "THG có quyền từ chối nhập kho hoặc áp dụng phí dịch vụ bổ sung để tạo và dán mã barcode theo yêu cầu.",
                    "Phí tạo và dán mã barcode áp dụng mức $0.2/sản phẩm và mức phí có thể được điều chỉnh tùy loại hàng hóa cụ thể.",
                    "THG sẽ thông báo trước cho khách hàng và chỉ tiến hành xử lý khi có sự đồng ý bằng văn bản hoặc xác nhận qua hệ thống.",
                ],
            },
            {
                heading: "Chính sách xử lý — Hàng hóa nguy hiểm hoặc bị cấm",
                content: [
                    "Điều kiện: Hàng hóa vi phạm quy định vận chuyển hoặc thuộc danh mục bị cấm/hạn chế theo luật Hoa Kỳ và chính sách của USPS.",
                    "THG có quyền từ chối nhập kho hoặc tiến hành tiêu hủy theo quy định pháp luật; khách hàng chịu trách nhiệm về các chi phí xử phạt liên quan.",
                    "Trong trường hợp hàng hóa bị USPS từ chối vận chuyển, THG không có nghĩa vụ đền bù. Khách hàng chịu toàn bộ chi phí trả hàng hoặc tiêu hủy.",
                ],
            },
            {
                heading: "Chính sách đền bù — Hàng hóa trong kho bị thất lạc",
                content: [
                    "Điều kiện: Hàng hóa có biên bản nhập kho (Inbound Request) hợp lệ nhưng bị thất lạc trong quá trình lưu kho.",
                    "Thất lạc toàn bộ lô hàng: Đền bù 100% giá vốn (có chứng từ), tối đa 100$/lô hàng.",
                    "Thất lạc trên 20 sản phẩm/SKU: Hỗ trợ đền bù 50% giá vốn, tối đa 30$/SKU.",
                    "Thất lạc từ 4 đến 20 sản phẩm/SKU: Hỗ trợ đền bù 50% giá vốn, tối đa 20$/SKU.",
                    "Mất lẻ từ 1 đến 3 sản phẩm/SKU: Xem là \"shrink allowance\" (hao hụt cho phép). THG không đền bù tiền mặt mà thực hiện kiểm tồn và điều chỉnh hệ thống.",
                    "Nhiều SKU bị mất lẻ: Nếu tổng số sản phẩm mất trong cùng một Inbound Request > 20 sản phẩm, THG đền bù 50% giá vốn toàn bộ số mất, tối đa 30$/lô hàng.",
                ],
            },
            {
                heading: "Chính sách đền bù — Thất lạc hàng hóa nhiều lần (tính theo tháng)",
                content: [
                    "Lần 1: Đền tiền + Giảm phí Fulfill 1$/đơn cho 20 đơn tiếp theo.",
                    "Lần 2: Đền tiền + Giảm phí Fulfill 1$/đơn cho 100 đơn tiếp theo.",
                    "Lần 3: Đền tiền + Giảm phí Fulfill 1$/đơn cho 150 đơn tiếp theo (Nếu > 3 lần, hai bên sẽ gặp mặt đàm phán giải pháp).",
                ],
            },
            {
                heading: "Chính sách đền bù — Kho đóng gói sai SKU",
                content: [
                    "Điều kiện: Lỗi phát sinh trong quá trình đóng gói tại kho THG (xác nhận qua Packing list và hệ thống).",
                    "THG chịu chi phí gửi lại đơn hàng và hoàn tiền 100% giá vốn hàng hóa, tối đa 20$/sản phẩm.",
                    "Trường hợp lỗi do khách hàng dán sai barcode, THG không đền bù.",
                ],
            },
            {
                heading: "Chính sách đền bù — Dán sai label / Sai địa chỉ giao hàng",
                content: [
                    "THG chịu chi phí gửi lại đơn nếu lỗi do phía THG.",
                    "Đền bù 100% giá vốn hàng hóa (tối đa 3$/sản phẩm) nếu giao nhầm địa chỉ.",
                ],
            },
            {
                heading: "Chính sách đền bù — Hàng hóa bị hư hỏng",
                content: [
                    "Nếu hàng hư hỏng do lỗi đóng gói tại kho THG, THG hoàn lại phí fulfill/shipping và đền bù 100% giá vốn hàng hóa (tối đa 20$/đơn hàng).",
                ],
            },
            {
                heading: "Chính sách đền bù — Trạng thái \"Delivered\" nhưng không nhận được hàng",
                content: [
                    "THG hỗ trợ kiểm tra chéo với hãng vận chuyển (USPS/FedEx/UPS).",
                    "Đền bù theo chính sách của hãng vận chuyển nếu hãng xác nhận mất hàng.",
                ],
            },
            {
                heading: "Chính sách đền bù — Xử lý đơn hàng quá SLA",
                content: [
                    "Nếu kho xử lý đơn quá 3 ngày làm việc, THG hoàn 100% phí fulfill.",
                ],
            },
            {
                heading: "Khiếu nại & Thời hạn",
                content: [
                    "Khiếu nại đơn hàng thất lạc: trong vòng 2 tháng kể từ ngày gửi.",
                    "Khiếu nại hàng hư hỏng hoặc sai giá: trong vòng 3 ngày sau khi nhận hàng.",
                    "Thời gian xử lý: tối đa 10 ngày làm việc.",
                ],
            },
            {
                heading: "Hình thức đền bù",
                content: [
                    "Trừ vào phí vận chuyển các đơn hàng sau (trong vòng 90 ngày).",
                    "Hoàn tiền về tài khoản (trong vòng 15 ngày làm việc).",
                    "Bù trừ vào công nợ trong kỳ thanh toán kế tiếp.",
                ],
            },
            {
                heading: "Liên hệ",
                content: [
                    "Hotline: 033 512 4089",
                    "Email: info@thgfulfill.com",
                    "Văn phòng: 58 Đường DC11, P. Sơn Kỳ, Q. Tân Phú, TP.HCM",
                ],
            },
        ],
    },

    /* ═══════════════════════════════════════════
     *   2. CHÍNH SÁCH POD / DROPSHIP
     * ═══════════════════════════════════════════ */
    "pod-dropship": {
        id: "pod-dropship",
        blocks: [
            {
                heading: "Hàng hóa bị cấm vận chuyển",
                type: "warn",
                content: [
                    "Chất nổ, vũ khí, đạn dược, pháo hoa.",
                    "Chất lỏng, khí, chất dễ cháy.",
                    "Sản phẩm sinh học, chất ăn mòn, chất phóng xạ.",
                    "Sản phẩm động – thực vật.",
                    "Tiền tệ, kim loại quý, đá quý.",
                    "Ma túy, chất kích thích, thuốc tân dược.",
                ],
            },
            {
                heading: "Cách tính phí cước — Line VN → US",
                content: [
                    "So sánh Trọng lượng thực (Gross Weight) và Trọng lượng thể tích (Volume Weight).",
                    "Công thức thể tích: Dài × Rộng × Cao / 5000 (cm) hoặc / 6000 (cm) tùy line.",
                    "Tính phí theo số nào LỚN HƠN.",
                ],
            },
            {
                heading: "Cách tính phí cước — Line CN → US",
                content: [
                    "So sánh Trọng lượng thực (Gross Weight) và Trọng lượng thể tích (Volume Weight).",
                    "Công thức thể tích: Dài × Rộng × Cao / 6000 (cm).",
                    "Tính phí theo số nào LỚN HƠN.",
                ],
            },
            {
                heading: "Quy cách — Trọng lượng & Kích thước tối đa",
                content: [
                    "Trọng lượng tối đa: 2kg/kiện (line thường), 30kg/kiện (line hàng lô).",
                    "Kích thước tối đa: tùy theo line vận chuyển cụ thể.",
                ],
            },
            {
                heading: "Vùng không giao hàng (Remote/Restricted Zones)",
                type: "warn",
                content: [
                    "Alaska (AK), Hawaii (HI), Puerto Rico (PR).",
                    "Guam (GU), U.S. Virgin Islands (VI).",
                    "Địa chỉ quân đội: APO, FPO, DPO.",
                    "American Samoa (AS), Marshall Islands (MH), Palau (PW).",
                ],
            },
            {
                heading: "Điều khoản dịch vụ",
                content: [
                    "Thời gian giao hàng là ước tính, không phải cam kết. THG không chịu trách nhiệm với sự chậm trễ ngoài tầm kiểm soát.",
                    "Mọi khoản thuế, phí hải quan, phí nhập khẩu do khách hàng chịu trách nhiệm.",
                    "Khách hàng phải cung cấp thông tin hàng hóa chính xác — THG không chịu trách nhiệm nếu khai sai.",
                    "Đơn hàng không có cập nhật tracking sau 21 ngày được xem là thất lạc.",
                    "Hàng dễ vỡ: chỉ đền bù nếu có đóng gói gia cố (bubble wrap, foam, hộp cứng).",
                ],
            },
            {
                heading: "Chính sách đền bù — POD (Print on Demand)",
                content: [
                    "Lỗi do nhà máy sản xuất THG: THG gửi lại hàng mới miễn phí nếu có bằng chứng hợp lệ.",
                    "Nếu khách từ chối nhận hàng thay thế: THG đền bù 100% giá vốn.",
                    "Trạng thái USPS \"Delivered\" nhưng mất hàng: không thuộc trách nhiệm THG, THG hỗ trợ mở claim với USPS.",
                ],
            },
            {
                heading: "Chính sách đền bù — Dropship (Chung)",
                content: [
                    "Dịch vụ ship only: Hoàn 100% phí ship nếu giao hàng quá 20 ngày làm việc (dẫn đến hủy đơn).",
                    "Dịch vụ sourcing + shipping: Gửi hàng mới hoặc hoàn tiền cho vấn đề chất lượng/lỗi THG (tối đa ban đầu $20, tăng đến $50/đơn theo volume).",
                ],
            },
            {
                heading: "Chính sách đền bù — Hàng lẻ (Retail)",
                content: [
                    "Mất hoặc hư hỏng do hãng vận chuyển hoặc THG.",
                    "Đền bù theo giá trị khai báo cho thị trường US.",
                    "Tối đa ban đầu $20, tăng đến $50 theo doanh thu.",
                ],
            },
            {
                heading: "Chính sách đền bù — \"Delivered\" nhưng không nhận được hàng",
                content: [
                    "Yêu cầu email xác nhận mất hàng từ hãng vận chuyển hoặc hình ảnh CCTV.",
                    "CCTV phải chứng minh không có lần giao hàng nào.",
                    "Tối đa ban đầu $20, tăng đến $50.",
                ],
            },
            {
                heading: "Chính sách đền bù — Tracking không hoạt động",
                content: [
                    "Nếu tracking không được quét sau 15 ngày làm việc (không tính force majeure như hải quan, đình công), THG hoàn 100% phí ship (tối đa $20/đơn).",
                ],
            },
            {
                heading: "Miễn trừ trách nhiệm",
                type: "warn",
                content: [
                    "Khiếu nại quá hạn.",
                    "Force majeure: chiến tranh, đình công, thiên tai, dịch bệnh, hành động chính phủ.",
                    "Sự kiện ngoài tầm kiểm soát: tai nạn giao thông, thay đổi pháp luật, chậm hải quan, chậm chuyến bay.",
                ],
            },
            {
                heading: "Thời hạn khiếu nại",
                content: [
                    "Đơn hàng thất lạc: trong vòng 2 tháng.",
                    "Hàng hư hỏng hoặc sai giá: trong vòng 3 ngày sau khi nhận.",
                    "Xử lý: sau 20 ngày vận chuyển; trường hợp \"Not Received\" không tracking xử lý riêng.",
                ],
            },
            {
                heading: "Hình thức đền bù",
                content: [
                    "Trừ vào phí đơn hàng sau (trong vòng 90 ngày).",
                    "Hoàn tiền về tài khoản ngân hàng (trong vòng 15 ngày làm việc).",
                    "Bù trừ vào công nợ kỳ thanh toán kế tiếp.",
                ],
            },
            {
                heading: "Liên hệ",
                content: [
                    "Hotline: 033 512 4089",
                    "Email: info@thgfulfill.com",
                    "Văn phòng: 58 Đường DC11, P. Sơn Kỳ, Q. Tân Phú, TP.HCM",
                ],
            },
        ],
    },

    /* ═══════════════════════════════════════════
     *   3. CHÍNH SÁCH VẬN CHUYỂN
     *   → Link sang /chinh-sach-van-chuyen
     * ═══════════════════════════════════════════ */
    shipping: {
        id: "shipping",
        blocks: [
            {
                heading: "Chính sách vận chuyển quốc tế",
                content: [
                    "Nội dung chính sách vận chuyển đã được trình bày chi tiết tại trang riêng.",
                ],
            },
        ],
    },

    /* ═══════════════════════════════════════════
     *   4. CHÍNH SÁCH ĐỀN BÙ HÀNG LÔ
     * ═══════════════════════════════════════════ */
    "bulk-compensation": {
        id: "bulk-compensation",
        blocks: [
            {
                heading: "Đền bù hàng lô — Tuyến CN → US",
                content: [
                    "Đền bù 5 USD/kg và miễn toàn bộ phí vận chuyển nếu hàng bị thất lạc trong quá trình vận chuyển.",
                ],
            },
            {
                heading: "Đền bù hàng lô — Tuyến VN → US",
                content: [
                    "Đền bù theo chính sách đối tác vận chuyển, tối đa 100 USD/lô hàng.",
                    "Giá trị tính theo hóa đơn hoặc giá trị thực (lấy số thấp hơn).",
                ],
            },
            {
                heading: "Miễn trừ trách nhiệm — Hàng bị tịch thu",
                type: "warn",
                content: [
                    "Hàng cấm/hàng nhái bị hải quan tịch thu.",
                    "Hư hỏng do điều kiện tự nhiên (rung lắc, nhiệt độ, độ ẩm).",
                    "Force majeure: chiến tranh, thiên tai.",
                ],
            },
            {
                heading: "Miễn trừ trách nhiệm — Lỗi người gửi",
                type: "warn",
                content: [
                    "Bị cơ quan chức năng tịch thu.",
                    "Lỗi người gửi: đóng gói kém, khai báo sai.",
                    "Mất dữ liệu điện tử.",
                ],
            },
            {
                heading: "Miễn trừ trách nhiệm — Chậm trễ ngoài kiểm soát",
                type: "warn",
                content: [
                    "Dịch bệnh, thời tiết xấu, tắc nghẽn giao thông.",
                    "Chậm chuyến bay, kiểm tra hải quan kéo dài.",
                ],
            },
            {
                heading: "Liên hệ",
                content: [
                    "Hotline: 033 512 4089",
                    "Email: info@thgfulfill.com",
                    "Văn phòng: 58 Đường DC11, P. Sơn Kỳ, Q. Tân Phú, TP.HCM",
                ],
            },
        ],
    },

    /* ═══════════════════════════════════════════
     *   5. CHÍNH SÁCH POD – TIKTOK SHIPPING
     * ═══════════════════════════════════════════ */
    "pod-tiktok": {
        id: "pod-tiktok",
        blocks: [
            {
                heading: "Phân chia vai trò",
                content: [
                    "THG: Sản xuất & bàn giao cho USPS.",
                    "Seller: Cung cấp thông tin & phối hợp với TikTok/USPS.",
                    "USPS: Vận chuyển & cập nhật tracking.",
                    "THG không chịu trách nhiệm sau khi USPS đã quét nhận hàng.",
                ],
            },
            {
                heading: "Trách nhiệm các bên",
                content: [
                    "THG đảm bảo sản xuất và SLA trước khi bàn giao.",
                    "Khi trạng thái \"In Transit\", Seller xử lý các vấn đề với USPS.",
                    "Khuyến nghị sử dụng Active Tracking để giảm thiểu trì hoãn quét tracking (24-72 giờ).",
                ],
            },
            {
                heading: "Dịch vụ Active Tracking",
                type: "info",
                content: [
                    "Phí: $0.5/đơn hàng (tùy chọn).",
                    "Đảm bảo trạng thái \"In Transit\" nhanh chóng.",
                    "Tránh bị TikTok phạt do tracking chậm cập nhật.",
                ],
            },
            {
                heading: "Cam kết Win-Win",
                content: [
                    "THG cam kết sản xuất ổn định và đảm bảo SLA.",
                    "Seller được quản lý rủi ro/chi phí rõ ràng.",
                ],
            },
            {
                heading: "Quy trình xử lý",
                content: [
                    "Seller đặt đơn → THG sản xuất/bàn giao → USPS vận chuyển → Buyer nhận hàng.",
                ],
            },
            {
                heading: "Liên hệ",
                content: [
                    "Hotline: 033 512 4089",
                    "Email: info@thgfulfill.com",
                    "Văn phòng: 121/5 Đ. Kênh 19/5, Sơn Kỳ, Tân Phú, TP.HCM",
                ],
            },
        ],
    },
};
