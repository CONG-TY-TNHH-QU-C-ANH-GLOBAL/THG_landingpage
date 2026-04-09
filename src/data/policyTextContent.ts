/**
 * policyTextContent.ts
 * Nội dung text của các mục chính sách — EN / VI / ZH
 * Dùng bởi PolicyTextRenderer khi người dùng xem ngôn ngữ EN hoặc ZH
 */

export interface PolicyTextLine {
    en: string;
    vi: string;
    zh: string;
}

export interface PolicyTextBlock {
    type: "normal" | "warn" | "info";
    heading: PolicyTextLine;
    content: PolicyTextLine[];
}

export interface PolicyTextSection {
    blocks: PolicyTextBlock[];
}

export const policyTextContent: Record<string, PolicyTextSection> = {
    warehouse: {
        blocks: [
            {
                type: "info",
                heading: {
                    en: "I. Warehouse Address (US)",
                    vi: "I. Địa chỉ kho hàng (Mỹ)",
                    zh: "一、仓库地址（美国）",
                },
                content: [
                    {
                        en: "THG US Warehouse: 108 Almond CT, Milford, Pennsylvania 18337.",
                        vi: "Kho THG tại Mỹ: 108 Almond CT, Milford, Pennsylvania 18337.",
                        zh: "THG美国仓库：108 Almond CT, Milford, Pennsylvania 18337。",
                    },
                    {
                        en: "Phone: +1 (570) 618-1169 | Email: info@thgfulfill.com",
                        vi: "Điện thoại: +1 (570) 618-1169 | Email: info@thgfulfill.com",
                        zh: "电话：+1 (570) 618-1169 | 邮箱：info@thgfulfill.com",
                    },
                ],
            },
            {
                type: "info",
                heading: {
                    en: "II. USPS Shipping Size & Weight Limits",
                    vi: "II. Giới hạn kích thước & Trọng lượng USPS",
                    zh: "二、USPS运输尺寸与重量限制",
                },
                content: [
                    {
                        en: "Maximum weight: 20 lbs (~9 kg) per package.",
                        vi: "Trọng lượng tối đa: 20 lbs (~9 kg) mỗi kiện.",
                        zh: "最大重量：每件20磅（约9千克）。",
                    },
                    {
                        en: "Maximum girth: (Length + Width + Height) × 2 must not exceed 108 inches (~274 cm).",
                        vi: "Girth tối đa: (Dài + Rộng + Cao) × 2 không được vượt quá 108 inches (~274 cm).",
                        zh: "最大围长：（长+宽+高）×2不得超过108英寸（约274厘米）。",
                    },
                    {
                        en: "Volume limit: 1,728 cubic inches (~0.028 m³). Dimensional weight applies if exceeded.",
                        vi: "Giới hạn thể tích: 1.728 inch khối (~0,028 m³). Tính cước theo thể tích nếu vượt quá.",
                        zh: "体积上限：1,728立方英寸（约0.028立方米）。超出则按体积重计费。",
                    },
                    {
                        en: "Dimensional weight formula: (L × W × H in inches) ÷ 166 = Dimensional weight (lbs).",
                        vi: "Công thức trọng lượng thể tích: (Dài × Rộng × Cao tính bằng inch) ÷ 166 = Trọng lượng thể tích (lbs).",
                        zh: "体积重量公式：（长×宽×高，单位英寸）÷ 166 = 体积重量（磅）。",
                    },
                ],
            },
            {
                type: "info",
                heading: {
                    en: "III. Non-Compliant Package Handling",
                    vi: "III. Xử lý hàng không đạt tiêu chuẩn",
                    zh: "三、不合规包裹的处理",
                },
                content: [
                    {
                        en: "Goods entering the warehouse without barcodes or SKU labels that meet THG standards will be subject to additional handling.",
                        vi: "Hàng hóa vào kho không có barcode hoặc nhãn SKU đạt tiêu chuẩn THG sẽ bị xử lý thêm.",
                        zh: "未按THG标准贴附条形码或SKU标签的入库货物，将须接受额外处理。",
                    },
                    {
                        en: "THG may reject the shipment OR charge a barcoding fee of $0.20 per item (subject to adjustment by product type).",
                        vi: "THG có thể từ chối lô hàng HOẶC tính phí dán barcode $0,20/sản phẩm (có thể điều chỉnh theo loại hàng).",
                        zh: "THG可拒绝收货，或收取每件0.20美元的贴码服务费（根据产品类型可能调整）。",
                    },
                    {
                        en: "THG will notify the customer and will only proceed with written or system-confirmed authorization.",
                        vi: "THG sẽ thông báo cho khách hàng và chỉ tiến hành sau khi có xác nhận bằng văn bản hoặc hệ thống.",
                        zh: "THG将通知客户，并仅在获得书面或系统确认授权后方可操作。",
                    },
                ],
            },
            {
                type: "warn",
                heading: {
                    en: "IV. Compensation Policy — Lost & Damaged Inventory",
                    vi: "IV. Chính sách Đền bù — Hàng thất lạc & Hư hỏng",
                    zh: "四、赔偿政策——货物丢失与损坏",
                },
                content: [
                    {
                        en: "Total batch loss (valid Inbound Request): 100% of proven cost, maximum $100 per Inbound Request.",
                        vi: "Mất toàn lô (có Inbound Request hợp lệ): 100% giá vốn chứng minh được, tối đa $100/Inbound Request.",
                        zh: "整批丢失（有效入库申请）：赔偿已证明成本的100%，每张入库申请最高$100。",
                    },
                    {
                        en: "SKU loss of 4–20 items: 50% of proven cost, maximum $30 per SKU.",
                        vi: "Mất theo SKU từ 4–20 sản phẩm: 50% giá vốn chứng minh được, tối đa $30/SKU.",
                        zh: "单SKU丢失4–20件：赔偿已证明成本的50%，每SKU最高$30。",
                    },
                    {
                        en: "Loss of 1–3 items per SKU is treated as shrink allowance (normal shrinkage). No cash compensation; inventory will be adjusted on the system only.",
                        vi: "Mất lẻ 1–3 sản phẩm/SKU được coi là shrink allowance (hao hụt bình thường). Không đền tiền mặt; chỉ điều chỉnh tồn kho trên hệ thống.",
                        zh: "每SKU丢失1–3件视为正常损耗（shrink allowance），不予现金赔偿，仅作系统库存调整。",
                    },
                    {
                        en: "Wrong SKU packing (THG error): THG covers return shipping + 100% cost refund (max $20/item).",
                        vi: "Đóng gói sai SKU (lỗi THG): THG chịu phí gửi lại + hoàn 100% giá vốn (tối đa $20/sản phẩm).",
                        zh: "SKU拣货错误（THG责任）：THG承担退回运费+赔偿成本100%（每件最高$20）。",
                    },
                    {
                        en: "Wrong SKU packing (customer error — wrong barcode printed/applied): no compensation from THG.",
                        vi: "Đóng gói sai SKU (lỗi khách hàng — in/dán barcode sai): THG không đền bù.",
                        zh: "SKU拣货错误（客户原因——条码打印/粘贴有误）：THG不予赔偿。",
                    },
                    {
                        en: "Damaged goods (THG packaging error): reimburse 100% fulfill fee + shipping + cost (max $20/order).",
                        vi: "Hàng hư hỏng (lỗi đóng gói của THG): hoàn 100% phí fulfill + phí vận chuyển + giá vốn (tối đa $20/đơn).",
                        zh: "货物损坏（THG包装失误）：退还100%履约费+运费+成本（每单最高$20）。",
                    },
                    {
                        en: "Damaged goods (correct packaging but damaged in transit): THG assists in filing a dispute with USPS/FedEx/UPS on the customer's behalf.",
                        vi: "Hàng hư hỏng (đóng gói đúng nhưng hư khi vận chuyển): THG hỗ trợ đối soát với USPS/FedEx/UPS thay mặt khách hàng.",
                        zh: "货物损坏（包装合规但运输途中受损）：THG代表客户向USPS/FedEx/UPS提出争议索赔。",
                    },
                ],
            },
            {
                type: "warn",
                heading: {
                    en: "V. SLA, Claims Deadline & Reimbursement",
                    vi: "V. SLA, Thời hạn Khiếu nại & Bồi hoàn",
                    zh: "五、SLA、索赔期限与退款时效",
                },
                content: [
                    {
                        en: "SLA: Orders not dispatched within 3 business days (excluding Sat, Sun, and US holidays) → 100% fulfill fee refunded.",
                        vi: "SLA: Đơn không được xuất kho trong 3 ngày làm việc (trừ T7, CN và ngày lễ Mỹ) → hoàn 100% phí fulfill.",
                        zh: "SLA：订单未在3个工作日内发出（周六、周日及美国节假日除外）→ 退还100%履约费。",
                    },
                    {
                        en: "USPS shows 'Delivered' but item not received: THG disputes with carrier. If carrier confirms lost → carrier policy applies. If 'Delivered' status maintained → no THG compensation.",
                        vi: "USPS báo 'Delivered' nhưng không nhận được: THG đối soát với hãng. Nếu hãng xác nhận mất → áp dụng chính sách hãng. Nếu giữ trạng thái 'Delivered' → THG không đền bù.",
                        zh: "USPS显示'已投递'但未收到：THG向承运方提出争议。若承运方确认丢失→按承运方政策处理；若维持'已投递'状态→THG不予赔偿。",
                    },
                    {
                        en: "Claims deadline: 2 months for lost packages; 3 days for damage/rate issues from dispatch date.",
                        vi: "Thời hạn KN: 2 tháng đối với mất đơn; 3 ngày đối với hư hỏng/sai cước kể từ ngày phát hàng.",
                        zh: "索赔期限：丢包2个月内；损坏/费率问题自发货日起3天内提出。",
                    },
                    {
                        en: "Claims processing time: 10 business days from submission.",
                        vi: "Thời gian xử lý KN: 10 ngày làm việc kể từ khi gửi yêu cầu.",
                        zh: "索赔处理时间：自提交之日起10个工作日内。",
                    },
                    {
                        en: "Reimbursement: account credit within 90 days; cash refund within 15 business days after confirmation; debt offset on the next billing cycle.",
                        vi: "Bồi hoàn: cấn trừ tài khoản trong 90 ngày; hoàn tiền mặt trong 15 ngày làm việc sau xác nhận; cấn trừ công nợ vào kỳ thanh toán tiếp theo.",
                        zh: "退款方式：账户抵扣90天内；现金退款自确认后15个工作日内；债务抵扣于下一账期结算。",
                    },
                    {
                        en: "Repeat losses (per month): 1st occurrence — compensation + $1 off per fulfill fee for next 20 orders; 2nd — $1 off/100 orders; 3rd — $1 off/150 orders; beyond 3 — both parties meet to find a solution.",
                        vi: "Thất lạc nhiều lần (tính theo tháng): Lần 1 — đền tiền + giảm $1/đơn cho 20 đơn tiếp; Lần 2 — cho 100 đơn; Lần 3 — cho 150 đơn; Quá 3 lần — hai bên gặp mặt tìm giải pháp.",
                        zh: "重复丢失（按月计）：第1次——赔款+后续20单各减$1履约费；第2次——后续100单；第3次——后续150单；超过3次——双方面谈协商解决方案。",
                    },
                ],
            },
        ],
    },

    "pod-dropship": {
        blocks: [
            {
                type: "info",
                heading: {
                    en: "I. Service Overview",
                    vi: "I. Tổng quan dịch vụ",
                    zh: "一、服务概述",
                },
                content: [
                    {
                        en: "THG provides Print-on-Demand (POD) and Dropship fulfillment for e-commerce sellers. The full process: Order → Receive & Pack → Transit Warehouse → Customs → Delivery.",
                        vi: "THG cung cấp dịch vụ POD và Dropship cho người bán TMĐT. Quy trình đầy đủ: Lên đơn → Tiếp nhận & Đóng gói → Kho trung chuyển → Hải quan → Giao hàng.",
                        zh: "THG为电商卖家提供POD及代发货（Dropship）服务。完整流程：下单 → 收货打包 → 中转仓 → 海关 → 交付。",
                    },
                    {
                        en: "Brands served: THG Express, THG Fulfill, THG Warehouse — all under Transport Happiness Group.",
                        vi: "Các thương hiệu: THG Express, THG Fulfill, THG Warehouse — thuộc tập đoàn Transport Happiness Group.",
                        zh: "旗下品牌：THG Express、THG Fulfill、THG Warehouse，均隶属于Transport Happiness Group集团。",
                    },
                ],
            },
            {
                type: "info",
                heading: {
                    en: "II. China–US Size, Weight & Freight Calculation",
                    vi: "II. Kích thước, Trọng lượng & Tính cước tuyến Trung–Mỹ",
                    zh: "二、中美线路尺寸、重量与运费计算",
                },
                content: [
                    {
                        en: "Maximum weight: 30 kg. Minimum size: 10 × 15 cm.",
                        vi: "Trọng lượng tối đa: 30 kg. Kích thước tối thiểu: 10 × 15 cm.",
                        zh: "最大重量：30千克。最小尺寸：10×15厘米。",
                    },
                    {
                        en: "Standard maximum size: 55 × 40 × 35 cm (no additional fee). Absolute maximum: 68 × 43 × 43 cm (additional surcharge applies).",
                        vi: "Kích thước tối đa thông thường: 55 × 40 × 35 cm (không phụ phí). Tối đa cho phép: 68 × 43 × 43 cm (có phụ phí).",
                        zh: "标准最大尺寸：55×40×35厘米（无附加费）。允许最大尺寸：68×43×43厘米（须额外附加费）。",
                    },
                    {
                        en: "Volumetric weight formula: (L × W × H cm) ÷ 6,000 = Volumetric weight (kg). Shipping fee is based on whichever is higher: actual weight or volumetric weight.",
                        vi: "Công thức trọng lượng thể tích: (Dài × Rộng × Cao cm) ÷ 6.000 = Trọng lượng thể tích (kg). Cước tính theo mức cao hơn giữa trọng lượng thực và thể tích.",
                        zh: "体积重量公式：（长×宽×高，单位厘米）÷ 6,000 = 体积重量（千克）。运费取实际重量与体积重量中较大者计算。",
                    },
                ],
            },
            {
                type: "info",
                heading: {
                    en: "III. Compensation Policy",
                    vi: "III. Chính sách Bồi thường",
                    zh: "三、赔偿政策",
                },
                content: [
                    {
                        en: "Full compensation: 100% of declared value (max 2,500,000 VND) for loss or damage caused by shipping errors.",
                        vi: "Đền bù đầy đủ: 100% giá trị khai báo (tối đa 2.500.000 VNĐ) cho trường hợp thất lạc hoặc hư hỏng do lỗi vận chuyển.",
                        zh: "全额赔偿：因运输失误造成的丢失或损坏，赔偿100%申报价值（最高250万越南盾）。",
                    },
                    {
                        en: "POD orders: compensation is 100% of declared value, maximum $50 per ePacket order, with full evidence provided (video + photos). Responses within 24 hours.",
                        vi: "Đơn POD: bồi thường 100% giá trị khai báo, tối đa $50/đơn ePacket, với đầy đủ bằng chứng (video + ảnh). Phản hồi trong 24 giờ.",
                        zh: "POD订单：赔偿100%申报价值，ePacket订单最高$50，需提供完整证据（视频+照片），24小时内响应。",
                    },
                    {
                        en: "Dropship (retail) compensation: based on declared US value if fault lies with carrier or THG. Initial maximum: $20/shipment, increasing to $50 based on revenue tier.",
                        vi: "Bồi thường Dropship (lẻ): dựa trên giá trị khai báo tại Mỹ nếu lỗi từ hãng hoặc THG. Tối đa ban đầu: $20/lô, tăng lên $50 theo doanh thu.",
                        zh: "Dropship（散货）赔偿：如承运方或THG存在过失，按美国申报价值赔偿。初始上限$20/票，随业务量提升至$50。",
                    },
                ],
            },
            {
                type: "warn",
                heading: {
                    en: "IV. Failed Delivery & No-Compensation Cases",
                    vi: "IV. Giao hàng thất bại & Các trường hợp không đền bù",
                    zh: "四、派送失败与免赔情形",
                },
                content: [
                    {
                        en: "Failed delivery: goods are stored locally for 15 days. After 15 days they will be destroyed — no return to Vietnam or China.",
                        vi: "Giao hàng thất bại: hàng được lưu kho địa phương 15 ngày. Sau 15 ngày sẽ tiêu hủy — không hoàn hàng về Việt Nam hay Trung Quốc.",
                        zh: "派送失败：货物于当地存储15天。逾期将予销毁，不退回越南或中国。",
                    },
                    {
                        en: "No compensation for: wrong customer address provided by seller; buyer refuses delivery without reason; goods destroyed due to no contact or IP/label violations.",
                        vi: "Không đền bù: địa chỉ sai do người bán cung cấp; người mua từ chối nhận hàng không lý do; hàng bị tiêu hủy do không liên lạc được hoặc vi phạm nhãn mác/SHTT.",
                        zh: "以下情形不予赔偿：卖家提供地址有误；买家无故拒收；因无法联系或违反标签/知识产权规定导致货物被销毁。",
                    },
                    {
                        en: "No compensation for damage caused by wrong packaging or goods seized by authorities (prohibited items).",
                        vi: "Không đền bù cho hư hỏng do đóng gói sai hoặc hàng bị cơ quan chức năng thu giữ (hàng cấm).",
                        zh: "因包装不当造成的损坏，以及被执法机构查扣的违禁品，均不予赔偿。",
                    },
                ],
            },
            {
                type: "warn",
                heading: {
                    en: "V. Claims Process & Prohibited Items",
                    vi: "V. Quy trình Khiếu nại & Hàng bị cấm",
                    zh: "五、索赔流程与违禁物品",
                },
                content: [
                    {
                        en: "Claims deadline: within 48 hours of 'Delivered' status update. Required evidence: shipping label photo, product condition photo, unboxing video.",
                        vi: "Thời hạn KN: trong vòng 48 giờ kể từ khi cập nhật trạng thái 'Delivered'. Bằng chứng yêu cầu: ảnh nhãn vận đơn, ảnh tình trạng hàng, video mở hàng.",
                        zh: "索赔期限：在显示'已投递'状态48小时内提出。所需证据：运单标签照片、货物状态照片、开箱视频。",
                    },
                    {
                        en: "Claims process: Submit via ticket/group → tracking verification → compensation approved within 48 hours → credited to THG account balance.",
                        vi: "Quy trình KN: Gửi qua ticket/nhóm → kiểm tra tracking → duyệt bồi thường trong 48 giờ → cộng vào số dư tài khoản THG.",
                        zh: "索赔流程：通过工单/群组提交 → 核查运踪 → 48小时内审批赔偿 → 打入THG账户余额。",
                    },
                    {
                        en: "Processing time: 3–5 business days.",
                        vi: "Thời gian xử lý: 3–5 ngày làm việc.",
                        zh: "处理周期：3–5个工作日。",
                    },
                    {
                        en: "Prohibited items: explosives (detonators, gunpowder, grenades), firearms/ammunition, radioactive materials (uranium, plutonium), flammable gas/lighters, biological products, corrosive acids/alkalis.",
                        vi: "Hàng bị cấm: chất nổ (kíp, thuốc nổ, lựu đạn), súng/đạn, vật liệu phóng xạ (uranium, plutonium), khí dễ cháy/bật lửa, sản phẩm sinh học, axit/kiềm ăn mòn.",
                        zh: "违禁物品：爆炸物（雷管、火药、手榴弹）、枪支/弹药、放射性物质（铀、钚）、易燃气体/打火机、生物制品、腐蚀性酸碱。",
                    },
                ],
            },
        ],
    },

    shipping: {
        blocks: [
            {
                type: "info",
                heading: {
                    en: "I. Service Coverage & Weight Calculation",
                    vi: "I. Phạm vi dịch vụ & Tính cước",
                    zh: "一、服务范围与运费计算",
                },
                content: [
                    {
                        en: "THG provides international shipping to over 200 countries. Multiple routes available: Priority, Standard, and Economy.",
                        vi: "THG cung cấp dịch vụ vận chuyển quốc tế đến hơn 200 quốc gia. Nhiều tuyến: Ưu tiên, Tiêu chuẩn và Tiết kiệm.",
                        zh: "THG提供覆盖200多个国家的国际物流。提供多种线路：优先、标准及经济。",
                    },
                    {
                        en: "Vietnam–US/Worldwide: Volumetric weight = (L × W × H cm) ÷ 5,000. Freight = whichever is higher between actual weight and volumetric weight.",
                        vi: "Việt–Mỹ/Thế giới: Trọng lượng thể tích = (D × R × C cm) ÷ 5.000. Cước = mức cao hơn giữa trọng lượng thực và thể tích.",
                        zh: "越南–美国/全球：体积重量 =（长×宽×高，厘米）÷ 5,000。运费取实际重量与体积重量中较大者。",
                    },
                    {
                        en: "China–US/Worldwide: Volumetric weight = (L × W × H cm) ÷ 6,000.",
                        vi: "Trung–Mỹ/Thế giới: Trọng lượng thể tích = (D × R × C cm) ÷ 6.000.",
                        zh: "中国–美国/全球：体积重量 =（长×宽×高，厘米）÷ 6,000。",
                    },
                    {
                        en: "A shipment is considered lost if tracking shows no update for more than 21 days.",
                        vi: "Lô hàng được coi là thất lạc nếu tracking không có cập nhật trong hơn 21 ngày.",
                        zh: "若追踪信息超过21天无更新，则视为货物丢失。",
                    },
                ],
            },
            {
                type: "info",
                heading: {
                    en: "II. ePacket Size & Weight Limits",
                    vi: "II. Giới hạn kích thước & Trọng lượng ePacket",
                    zh: "二、ePacket尺寸与重量限制",
                },
                content: [
                    {
                        en: "ePacket Vietnam–US: max gross weight 2 kg, max volumetric weight 4 kg. Max length 55 cm. Total dimensions (L+W+H) ≤ 90 cm.",
                        vi: "ePacket Việt–Mỹ: trọng lượng thực tối đa 2 kg, thể tích tối đa 4 kg. Chiều dài tối đa 55 cm. Tổng (D+R+C) ≤ 90 cm.",
                        zh: "ePacket越南–美国：实际重量最大2千克，体积重量最大4千克。最大长度55厘米。总尺寸（长+宽+高）≤ 90厘米。",
                    },
                    {
                        en: "ePacket China–US: max weight 30 kg. Standard max size 55 × 40 × 35 cm (no surcharge). Absolute max 68 × 43 × 43 cm (surcharge applies).",
                        vi: "ePacket Trung–Mỹ: trọng lượng tối đa 30 kg. Kích thước tiêu chuẩn tối đa 55 × 40 × 35 cm (không phụ phí). Tuyệt đối tối đa 68 × 43 × 43 cm (có phụ phí).",
                        zh: "ePacket中国–美国：最大重量30千克。标准最大尺寸55×40×35厘米（无附加费）。允许最大尺寸68×43×43厘米（加收附加费）。",
                    },
                ],
            },
            {
                type: "warn",
                heading: {
                    en: "III. Excluded Delivery Areas",
                    vi: "III. Khu vực không giao hàng",
                    zh: "三、不可配送区域",
                },
                content: [
                    {
                        en: "THG does not ship to remote or excluded US areas: Alaska, Hawaii, Puerto Rico, Guam, APO/FPO, AE, AP, PR, VI, MP, AS.",
                        vi: "THG không vận chuyển đến các khu vực xa xôi/ngoại lệ của Mỹ: Alaska, Hawaii, Puerto Rico, Guam, APO/FPO, AE, AP, PR, VI, MP, AS.",
                        zh: "THG不向以下美国偏远/特殊地区配送：阿拉斯加、夏威夷、波多黎各、关岛、APO/FPO、AE、AP、PR、VI、MP、AS。",
                    },
                    {
                        en: "Amazon fulfillment center addresses are not accepted on any shipping channel.",
                        vi: "Địa chỉ kho Amazon không được chấp nhận trên bất kỳ kênh vận chuyển nào.",
                        zh: "所有运输渠道均不接受亚马逊仓库地址。",
                    },
                    {
                        en: "No return service to Vietnam or China. Undeliverable packages stored locally for 15 days before disposal.",
                        vi: "Không có dịch vụ hoàn hàng về Việt Nam hay Trung Quốc. Hàng không giao được lưu kho địa phương 15 ngày trước khi xử lý.",
                        zh: "不提供退回越南或中国的服务。无法投递的包裹在当地存放15天后予以处置。",
                    },
                ],
            },
            {
                type: "warn",
                heading: {
                    en: "IV. Prohibited Items",
                    vi: "IV. Hàng hóa bị cấm",
                    zh: "四、违禁物品",
                },
                content: [
                    {
                        en: "Explosives & Weapons: detonators, slow-burning fuses, mines, grenades, gunpowder, firearms, ammunition.",
                        vi: "Chất nổ & Vũ khí: kíp nổ, dây cháy chậm, mìn, lựu đạn, thuốc nổ, súng, đạn.",
                        zh: "爆炸物与武器：雷管、导火绳、地雷、手榴弹、炸药、枪支、弹药。",
                    },
                    {
                        en: "Radioactive materials (uranium, plutonium), flammable liquids/gas lighters, biological products, corrosive acids/alkalis.",
                        vi: "Vật liệu phóng xạ (uranium, plutonium), chất lỏng dễ cháy/bật lửa gas, sản phẩm sinh học, axit/kiềm ăn mòn.",
                        zh: "放射性物质（铀、钚）、易燃液体/打火机，生物制品，腐蚀性酸碱。",
                    },
                    {
                        en: "Also prohibited: animal products (leather, bone), powders, liquids, gels, pharmaceuticals, currencies, narcotics, and IP-infringing or counterfeit goods.",
                        vi: "Cũng bị cấm: sản phẩm động vật (da, xương), bột, chất lỏng, gel, dược phẩm, tiền tệ, ma túy và hàng vi phạm SHTT hoặc hàng giả.",
                        zh: "同样禁止：动物制品（皮革、骨骼）、粉末、液体、凝胶、药品、货币、毒品，以及侵权或仿冒商品。",
                    },
                    {
                        en: "Battery products: built-in batteries (≤100Wh) generally accepted. Standalone battery products prohibited on most routes.",
                        vi: "Sản phẩm có pin: pin tích hợp (≤100Wh) thường được chấp nhận. Sản phẩm chỉ là pin bị cấm trên hầu hết các tuyến.",
                        zh: "含电池产品：内置电池（≤100Wh）通常可接受。纯电池产品在大多数线路上属违禁品。",
                    },
                ],
            },
            {
                type: "warn",
                heading: {
                    en: "V. Customs, Liability & Important Terms",
                    vi: "V. Hải quan, Trách nhiệm & Điều khoản quan trọng",
                    zh: "五、海关、责任与重要条款",
                },
                content: [
                    {
                        en: "All destination customs duties and taxes are the responsibility of the recipient or sender (per agreement). Senders must declare goods truthfully.",
                        vi: "Thuế hải quan và các loại thuế tại điểm đến thuộc trách nhiệm của người nhận hoặc người gửi (theo thỏa thuận). Người gửi phải khai báo trung thực.",
                        zh: "目的地关税及其他税费由收件人或发件人依协议承担。发件人须如实申报货物。",
                    },
                    {
                        en: "Delivery time estimates exclude weekends and public holidays. THG does not guarantee transit times.",
                        vi: "Thời gian giao hàng ước tính không tính cuối tuần và ngày lễ. THG không đảm bảo thời gian vận chuyển.",
                        zh: "预计交货时间不含周末及公共假期。THG不承诺运输时效。",
                    },
                    {
                        en: "Fragile goods: customers must provide their own shock protection. THG is not liable for breakage or deformation during transit.",
                        vi: "Hàng dễ vỡ: khách hàng phải tự cung cấp vật liệu chống rung. THG không chịu trách nhiệm về gãy vỡ hoặc biến dạng trong quá trình vận chuyển.",
                        zh: "易碎品：客户须自行提供防震保护。THG对运输途中的破损或变形不承担责任。",
                    },
                    {
                        en: "For detailed rates by route, please refer to our dedicated Shipping Policy page.",
                        vi: "Để biết chi tiết giá cước theo tuyến, vui lòng tham khảo trang Chính sách Vận chuyển chuyên biệt.",
                        zh: "各线路详细资费，请访问我们专属的物流政策页面。",
                    },
                ],
            },
        ],
    },

    "bulk-compensation": {
        blocks: [
            {
                type: "info",
                heading: {
                    en: "I. Compensation Rates by Route",
                    vi: "I. Mức đền bù theo tuyến",
                    zh: "一、各线路赔偿标准",
                },
                content: [
                    {
                        en: "China–US route: compensation of $5/kg PLUS full waiver of all shipping fees for the affected shipment in case of loss.",
                        vi: "Tuyến Trung–Mỹ: đền bù $5/kg CỘNG miễn toàn bộ phí vận chuyển của lô hàng bị ảnh hưởng trong trường hợp thất lạc.",
                        zh: "中美线路：丢失情况下赔偿$5/千克，同时免除受影响货物的全部运费。",
                    },
                    {
                        en: "Vietnam–US route: maximum compensation of $100 per shipment, based on the declared invoice value or actual product value, whichever is lower.",
                        vi: "Tuyến Việt–Mỹ: đền bù tối đa $100/lô hàng, căn cứ vào giá trị hóa đơn khai báo hoặc giá trị thực tế của sản phẩm, lấy mức thấp hơn.",
                        zh: "越美线路：最高赔偿$100/票，以申报发票价值与产品实际价值中较低者为准。",
                    },
                ],
            },
            {
                type: "info",
                heading: {
                    en: "II. Required Documentation",
                    vi: "II. Hồ sơ yêu cầu",
                    zh: "二、所需申报材料",
                },
                content: [
                    {
                        en: "All claims must include: commercial invoice, packing list, and clear photographic evidence of any damage.",
                        vi: "Tất cả yêu cầu bồi thường phải kèm: hóa đơn thương mại, danh sách đóng gói và bằng chứng hình ảnh rõ ràng về hư hỏng.",
                        zh: "所有索赔申请须附：商业发票、装箱单及清晰的损坏照片凭证。",
                    },
                    {
                        en: "For lost shipments confirmed by the carrier: provide a refund screenshot or replacement order number within 14 days of claim submission.",
                        vi: "Với hàng thất lạc được hãng xác nhận: cung cấp ảnh chụp màn hình hoàn tiền hoặc mã đơn gửi lại trong 14 ngày kể từ khi nộp yêu cầu.",
                        zh: "承运方确认丢失的货物：须在提交索赔后14天内提供退款截图或补发订单编号。",
                    },
                    {
                        en: "THG investigates all claims thoroughly before issuing a compensation decision. Reimbursement: account credit or bank transfer within agreed timelines.",
                        vi: "THG điều tra đầy đủ tất cả KN trước khi đưa ra quyết định bồi thường. Bồi hoàn: tín dụng tài khoản hoặc chuyển khoản trong thời gian đã thỏa thuận.",
                        zh: "THG将对所有索赔进行彻底调查后方作出赔偿决定。退款方式：账户抵扣或在约定时限内银行转账。",
                    },
                ],
            },
            {
                type: "warn",
                heading: {
                    en: "III. Exemptions — No Compensation",
                    vi: "III. Miễn trách — Không đền bù",
                    zh: "三、免赔情形",
                },
                content: [
                    {
                        en: "Prohibited items: branded/trademarked goods, counterfeits, items confiscated by customs, or goods restricted by law.",
                        vi: "Hàng bị cấm: hàng mang thương hiệu, hàng giả, hàng bị hải quan tịch thu, hoặc hàng bị hạn chế bởi pháp luật.",
                        zh: "违禁物品：品牌/商标商品、仿冒品、被海关没收的货物，或法律限制的物品。",
                    },
                    {
                        en: "Damage caused by natural conditions, vibration, or inadequate packaging by the sender.",
                        vi: "Hư hỏng do điều kiện tự nhiên, rung động hoặc đóng gói không đầy đủ từ phía người gửi.",
                        zh: "因自然条件、振动或发件人包装不足导致的损坏。",
                    },
                    {
                        en: "Force majeure events: infrastructure failures, natural disasters, strikes, or war.",
                        vi: "Sự kiện bất khả kháng: hạ tầng, thiên tai, đình công hoặc chiến tranh.",
                        zh: "不可抗力事件：基础设施故障、自然灾害、罢工或战争。",
                    },
                    {
                        en: "Goods held, confiscated, or destroyed by customs or government agencies.",
                        vi: "Hàng bị giữ lại, tịch thu hoặc tiêu hủy bởi hải quan hay cơ quan nhà nước.",
                        zh: "被海关或政府机关扣押、没收或销毁的货物。",
                    },
                    {
                        en: "Sender errors: incorrect packaging, false value declarations, or dishonest product descriptions.",
                        vi: "Lỗi của người gửi: đóng gói sai, khai báo giá trị gian lận hoặc mô tả hàng hóa không trung thực.",
                        zh: "发件人失误：包装不规范、价值申报不实或产品描述不诚实。",
                    },
                    {
                        en: "External factors beyond THG's control: traffic congestion, flight/train delays, or extended customs inspections.",
                        vi: "Yếu tố bên ngoài ngoài tầm kiểm soát của THG: tắc nghẽn giao thông, chậm trễ chuyến bay/tàu hoặc kiểm tra hải quan kéo dài.",
                        zh: "THG无法控制的外部因素：交通拥堵、航班/列车延误或海关延长检查。",
                    },
                    {
                        en: "THG does not guarantee transit times and does not accept claims for delivery delays.",
                        vi: "THG không đảm bảo thời gian vận chuyển và không chấp nhận yêu cầu bồi thường do chậm giao hàng.",
                        zh: "THG不承诺运输时效，因此不受理因送货延误提出的索赔。",
                    },
                ],
            },
            {
                type: "warn",
                heading: {
                    en: "IV. Contact for Claims",
                    vi: "IV. Liên hệ khiếu nại",
                    zh: "四、索赔联系方式",
                },
                content: [
                    {
                        en: "Phone: 033 512 4089 | Email: info@thgfulfill.com",
                        vi: "Điện thoại: 033 512 4089 | Email: info@thgfulfill.com",
                        zh: "电话：033 512 4089 | 邮箱：info@thgfulfill.com",
                    },
                    {
                        en: "Address: 58 DC11 Street, Son Ky Ward, Tan Phu District, Ho Chi Minh City.",
                        vi: "Địa chỉ: 58 Đường DC11, P. Sơn Kỳ, Q. Tân Phú, TP.HCM.",
                        zh: "地址：胡志明市新富郡山奇坊DC11路58号。",
                    },
                ],
            },
        ],
    },

    "pod-tiktok": {
        blocks: [
            {
                type: "info",
                heading: {
                    en: "I. Service Overview & Markets",
                    vi: "I. Tổng quan dịch vụ & Thị trường",
                    zh: "一、服务概述与覆盖市场",
                },
                content: [
                    {
                        en: "THG offers specialized POD fulfillment with dedicated shipping channels for TikTok Shop merchants.",
                        vi: "THG cung cấp dịch vụ POD chuyên biệt với kênh vận chuyển riêng cho người bán TikTok Shop.",
                        zh: "THG专为TikTok Shop商家提供专属POD履约服务及独立物流渠道。",
                    },
                    {
                        en: "Service covers multiple active TikTok Shop markets: US, UK, EU, Southeast Asia, and other active regions.",
                        vi: "Dịch vụ bao phủ các thị trường TikTok Shop đang hoạt động: Mỹ, Anh, EU, Đông Nam Á và các khu vực khác.",
                        zh: "服务覆盖TikTok Shop活跃市场：美国、英国、欧盟、东南亚及其他地区。",
                    },
                ],
            },
            {
                type: "info",
                heading: {
                    en: "II. Processing Time & Tracking",
                    vi: "II. Thời gian xử lý & Theo dõi đơn",
                    zh: "二、处理时效与物流追踪",
                },
                content: [
                    {
                        en: "Total transit time: average 5–10 business days from order to delivery.",
                        vi: "Thời gian toàn trình: trung bình 5–10 ngày làm việc từ khi đặt hàng đến khi giao.",
                        zh: "全程时效：从下单到交付，平均5–10个工作日。",
                    },
                    {
                        en: "Processing time at THG warehouse: within 24 hours of order receipt.",
                        vi: "Thời gian xử lý tại kho THG: trong vòng 24 giờ kể từ khi nhận đơn.",
                        zh: "THG仓库处理时间：收到订单后24小时内完成。",
                    },
                    {
                        en: "Tracking numbers are uploaded to TikTok Shop within the required timeframe after dispatch to meet platform fulfillment KPIs.",
                        vi: "Mã tracking được tải lên TikTok Shop trong khung thời gian yêu cầu sau khi giao hàng để đáp ứng KPI thực hiện đơn của nền tảng.",
                        zh: "运单号将在发货后规定时限内上传至TikTok Shop，以满足平台履约KPI考核。",
                    },
                ],
            },
            {
                type: "info",
                heading: {
                    en: "III. Label, Packaging & Platform Compliance",
                    vi: "III. Nhãn vận đơn, Đóng gói & Tuân thủ nền tảng",
                    zh: "三、运单标签、包装与平台合规",
                },
                content: [
                    {
                        en: "Sellers are responsible for providing accurate shipping labels from TikTok Shop. THG is not liable for delivery failure caused by incorrect labels.",
                        vi: "Người bán chịu trách nhiệm cung cấp nhãn vận đơn chính xác từ TikTok Shop. THG không chịu trách nhiệm nếu nhãn sai dẫn đến giao thất bại.",
                        zh: "卖家须提供来自TikTok Shop的准确运单标签。因标签有误导致派送失败，THG不承担责任。",
                    },
                    {
                        en: "Packaging must meet international standards and TikTok Shop regulations. THG offers repackaging service (at cost) if original packaging is unsafe.",
                        vi: "Đóng gói phải đáp ứng tiêu chuẩn quốc tế và quy định TikTok Shop. THG cung cấp dịch vụ đóng gói lại (có phí) nếu bao bì gốc không an toàn.",
                        zh: "包装须符合国际标准及TikTok Shop规定。若原包装不安全，THG提供付费重新包装服务。",
                    },
                    {
                        en: "Products must not infringe trademarks, copyrights, or TikTok content policies. Prohibited: counterfeit goods, adult products, hazardous materials.",
                        vi: "Sản phẩm không được vi phạm nhãn hiệu, bản quyền hoặc chính sách nội dung TikTok. Cấm: hàng giả, sản phẩm người lớn, vật liệu nguy hiểm.",
                        zh: "产品不得侵犯商标、版权或TikTok内容政策。禁止：仿冒品、成人产品、危险物品。",
                    },
                    {
                        en: "Merchants are responsible for ensuring product descriptions accurately match the items shipped.",
                        vi: "Người bán chịu trách nhiệm đảm bảo mô tả sản phẩm khớp chính xác với hàng hóa thực tế được vận chuyển.",
                        zh: "商家须确保产品描述与实际发货商品完全相符。",
                    },
                ],
            },
            {
                type: "warn",
                heading: {
                    en: "IV. Penalties, Compensation & Returns",
                    vi: "IV. Phạt, Bồi thường & Hoàn trả",
                    zh: "四、罚款、赔偿与退货",
                },
                content: [
                    {
                        en: "Late Dispatch (THG error): 100% shipping fee refunded + support with TikTok Shop dispute + free re-shipment of the replacement order.",
                        vi: "Late Dispatch (lỗi THG): hoàn 100% phí vận chuyển + hỗ trợ xử lý khiếu nại trên TikTok Shop + miễn phí gửi lại đơn thay thế.",
                        zh: "延迟发货（THG责任）：退还100%运费+协助处理TikTok Shop争议+免费补发替换订单。",
                    },
                    {
                        en: "Any TikTok Shop late fulfillment penalties due to seller errors or violations are the sole liability of the seller.",
                        vi: "Mọi khoản phạt do thực hiện đơn muộn từ TikTok Shop do lỗi hoặc vi phạm của người bán thuộc trách nhiệm duy nhất của người bán.",
                        zh: "因卖家失误或违规导致的任何TikTok Shop延迟履约罚款，均由卖家全权承担。",
                    },
                    {
                        en: "Claims for defective or incorrectly fulfilled items: file within 14 days of delivery with photographic evidence. THG will offer replacement or refund for confirmed production errors.",
                        vi: "KN về sản phẩm lỗi hoặc thực hiện sai: nộp trong 14 ngày kể từ ngày giao hàng kèm bằng chứng ảnh. THG sẽ cung cấp thay thế hoặc hoàn tiền cho lỗi sản xuất được xác nhận.",
                        zh: "产品缺陷或履约错误索赔：交付后14天内提出并附照片凭证。对经确认的生产错误，THG将提供换货或退款。",
                    },
                    {
                        en: "Return requests via TikTok Shop must follow the platform's official return and refund procedures.",
                        vi: "Yêu cầu hoàn trả qua TikTok Shop phải tuân theo quy trình hoàn trả và hoàn tiền chính thức của nền tảng.",
                        zh: "通过TikTok Shop发起的退货申请，须遵循平台官方退货退款流程。",
                    },
                    {
                        en: "THG is not responsible for TikTok Shop account penalties resulting from violations of platform rules by the seller.",
                        vi: "THG không chịu trách nhiệm về các hình phạt tài khoản TikTok Shop do vi phạm quy tắc nền tảng của người bán.",
                        zh: "因卖家违反平台规则导致的TikTok Shop账号处罚，THG概不承担责任。",
                    },
                    {
                        en: "THG reserves the right to suspend fulfillment services for accounts with a high violation rate on TikTok Shop.",
                        vi: "THG có quyền tạm ngưng dịch vụ đối với các tài khoản có tỷ lệ vi phạm cao trên TikTok Shop.",
                        zh: "对于在TikTok Shop上违规率较高的账户，THG保留暂停其履约服务的权利。",
                    },
                ],
            },
        ],
    },
};
