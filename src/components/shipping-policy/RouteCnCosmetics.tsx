import { Sec, Warn, Note, Danger, SubTitle, PT, RouteBadge } from "./PolicyUI";
import { useI18n } from "@/lib/i18n";

/** Route 2: CN → WW · Cosmetics */
const RouteCnCosmetics = () => {
    const { effectiveLanguage: lang } = useI18n();
    const en = lang === 'en', zh = lang === 'zh';

    return (
        <div>
            <RouteBadge color="bg-[#e8eef8] text-[#1a4a8a]">{en ? "China → Worldwide · Cosmetics" : zh ? "中国 → 全球 · 化妆品" : "Trung Quốc → Toàn Cầu · Mỹ Phẩm"}</RouteBadge>

            <Sec icon="%" title="VAT / IOSS">
                <ul className="pl-4 list-disc space-y-1">
                    <li>{en ? "No VAT collected if valid IOSS code provided (from 26/06/2021)." : zh ? "如提供有效IOSS代码则不收取VAT（自2021/06/26起）。" : "Không thu VAT nếu cung cấp mã IOSS hợp lệ (từ 26/06/2021)."}</li>
                    <li>{en ? "No IOSS + using THG advance service: fee = destination VAT rate + 2%." : zh ? "无IOSS + 使用THG代缴服务：费用 = 目的地VAT税率 + 2%。" : "Không có IOSS + dịch vụ ứng của THG: phí = thuế suất VAT nước đến + 2%."}</li>
                </ul>
                <Danger>{en ? "Packages ≥ €150 / $155 NOT accepted." : zh ? "申报价值≥150欧元/155美元的包裹不被接受。" : "Kiện hàng ≥ 150 EUR / 155 USD KHÔNG được chấp nhận."}</Danger>
            </Sec>

            <Sec icon="⚖" title={en ? "Chargeable Weight" : zh ? "计费重量" : "Trọng Lượng Tính Cước"}>
                <PT headers={en ? ["Country", "Formula", "Min Weight"] : zh ? ["国家", "公式", "最低重量"] : ["Quốc gia", "Công thức", "Cân nặng tối thiểu"]} rows={[
                    ["UAE", en ? "Compare actual vs volumetric (÷6000) — charge higher; if vol < 2× actual → charge actual" : zh ? "比较实际与体积（÷6000）— 取高者；如体积 < 2×实际 → 按实际计" : "So sánh thực tế vs thể tích (÷6000) — tính cao hơn; nếu thể tích < 2× thực tế → tính thực tế", "100g"],
                    [en ? "🇳🇿 New Zealand" : zh ? "🇳🇿 新西兰" : "🇳🇿 New Zealand", en ? "Compare actual vs volumetric (÷6000)" : zh ? "比较实际与体积（÷6000）" : "So sánh thực tế vs thể tích (÷6000)", "—"],
                    ["🇸🇬 Singapore / TH", en ? "Compare actual vs volumetric (÷5000)" : zh ? "比较实际与体积（÷5000）" : "So sánh thực tế vs thể tích (÷5000)", "—"],
                    [en ? "🇯🇵 Japan" : zh ? "🇯🇵 日本" : "🇯🇵 Nhật Bản", en ? "Compare actual vs volumetric (÷6000)" : zh ? "比较实际与体积（÷6000）" : "So sánh thực tế vs thể tích (÷6000)", "100g"],
                    ["🇨🇦 Canada", en ? "Compare actual vs volumetric (÷6000); if vol < 2× actual → charge actual" : zh ? "比较实际与体积（÷6000）；如体积 < 2×实际 → 按实际计" : "So sánh thực tế vs thể tích (÷6000); nếu thể tích < 2× thực tế → tính thực tế", "100g"],
                    ["🇨🇱 Chile", en ? "Charge higher of actual vs volumetric (÷6000); >2kg round by 0.5kg" : zh ? "取实际与体积（÷6000）较高者；>2kg按0.5kg取整" : "Tính cao hơn giữa thực tế vs thể tích (÷6000); >2kg làm tròn theo 0.5kg", "100g"],
                    [en ? "Other countries" : zh ? "其他国家" : "Quốc gia khác", en ? "Compare actual vs volumetric (÷6000)" : zh ? "比较实际与体积（÷6000）" : "So sánh thực tế vs thể tích (÷6000)", en ? "US min 100g" : zh ? "美国最低100g" : "US tối thiểu 100g"],
                ]} />
            </Sec>

            <Sec icon="🌍" title={en ? "Countries & Restrictions" : zh ? "国家与限制" : "Quốc Gia & Hạn Chế"}>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{en ? "Does not deliver to dependent islands." : zh ? "不配送至属地岛屿。" : "Không giao đến các đảo phụ thuộc."}</li>
                    <li><strong>🇺🇸 {en ? "USA:" : zh ? "美国：" : "Mỹ:"}</strong> {en ? "Includes Alaska, Hawaii, Puerto Rico, Guam, APO/FPO. Remote surcharge: RMB 50/package." : zh ? "包括阿拉斯加、夏威夷、波多黎各、关岛、APO/FPO。偏远附加费：RMB 50/件。" : "Bao gồm Alaska, Hawaii, Puerto Rico, Guam, APO/FPO. Phụ phí vùng xa: RMB 50/kiện."}</li>
                    <li><strong>🇵🇱 {en ? "Poland:" : zh ? "波兰：" : "Ba Lan:"}</strong> {en ? "Packstation only in Warsaw, Wroclaw, Poznan, Krakow." : zh ? "Packstation仅限华沙、弗罗茨瓦夫、波兹南、克拉科夫。" : "Packstation chỉ tại Warsaw, Wroclaw, Poznan, Krakow."}</li>
                    <li><strong>{en ? "Greece / UAE / PT / IL:" : zh ? "希腊 / UAE / 葡萄牙 / 以色列：" : "Hy Lạp / UAE / PT / IL:"}</strong> {en ? "No PO Box addresses." : zh ? "不接受邮政信箱。" : "Không nhận địa chỉ PO Box."}</li>
                    <li><strong>🇵🇹 {en ? "Portugal:" : zh ? "葡萄牙：" : "Bồ Đào Nha:"}</strong> {en ? "No delivery to Azores or Madeira. No postal codes starting with \"9\"." : zh ? "不配送至亚速尔群岛或马德拉。不接受以\"9\"开头的邮编。" : "Không giao Azores hoặc Madeira. Không nhận mã bưu chính bắt đầu bằng \"9\"."}</li>
                    <li><strong>🇮🇱 Israel:</strong> {en ? "Gaza not served. Default delivery to pickup point." : zh ? "加沙不提供服务。默认送至自提点。" : "Gaza không phục vụ. Mặc định giao đến điểm lấy hàng."}</li>
                    <li><strong>🇦🇺 {en ? "Australia:" : zh ? "澳大利亚：" : "Úc:"}</strong> {en ? "Service by zone based on postal code." : zh ? "按邮编区域提供服务。" : "Phục vụ theo vùng (zone) theo mã bưu chính."}</li>
                    <li><strong>🇯🇵 {en ? "Japan:" : zh ? "日本：" : "Nhật Bản:"}</strong> {en ? "No APO/FPO, Amazon, or remote areas." : zh ? "不接受APO/FPO、Amazon或偏远地区。" : "Không nhận APO/FPO, Amazon, hoặc vùng xa."}</li>
                    <li><strong>🇸🇦 Saudi Arabia (from 01/01/2026):</strong> {en ? "National Address required." : zh ? "需要国家地址（National Address）。" : "Yêu cầu Địa chỉ Quốc gia (National Address)."}</li>
                    <li>{en ? "All countries: No Amazon or military addresses." : zh ? "所有国家：不接受Amazon或军事地址。" : "Tất cả quốc gia: Không nhận địa chỉ Amazon và địa chỉ quân sự."}</li>
                </ul>
            </Sec>

            <Sec icon="$" title={en ? "Declared Value" : zh ? "申报价值" : "Giá Trị Khai Báo"}>
                <PT headers={en ? ["Country", "Limit", "Notes"] : zh ? ["国家", "限额", "备注"] : ["Quốc gia", "Giới hạn", "Ghi chú"]} rows={[
                    [en ? "🇬🇧 UK" : zh ? "🇬🇧 英国" : "🇬🇧 Anh", en ? "Max GBP 135 / $155 / €150" : zh ? "最高 GBP 135 / $155 / €150" : "Tối đa GBP 135 / $155 / €150", en ? "Declare at actual selling price." : zh ? "按实际售价申报。" : "Khai báo theo giá bán thực tế."],
                    [en ? "🇺🇸 USA" : zh ? "🇺🇸 美国" : "🇺🇸 Mỹ", en ? "Max $60/pkg" : zh ? "最高 $60/件" : "Tối đa $60/kiện", "—"],
                    ["🇪🇺 EU", en ? "Max €150 / $155" : zh ? "最高 €150 / $155" : "Tối đa €150 / $155", "—"],
                    [en ? "South Africa" : zh ? "南非" : "Nam Phi", en ? "Max $30 USD" : zh ? "最高 $30 USD" : "Tối đa $30 USD", en ? "Recipient ID required from 06/09/2022." : zh ? "自2022/09/06起需要收件人身份证。" : "Yêu cầu CMND người nhận từ 06/09/2022."],
                    ["🇨🇦 Canada", en ? "Max $99 USD" : zh ? "最高 $99 USD" : "Tối đa $99 USD", en ? "DDP. Tax 18% on value above CAD 20." : zh ? "DDP。超过CAD 20部分税率18%。" : "DDP. Thuế 18% × giá trị khai báo trên CAD 20."],
                    [en ? "🇳🇴 Norway" : zh ? "🇳🇴 挪威" : "🇳🇴 Na Uy", en ? "Max 3000 NOK (~€250)" : zh ? "最高 3000 NOK (~€250)" : "Tối đa 3000 NOK (~€250)", en ? "VOEC number required." : zh ? "需要VOEC编号。" : "Yêu cầu số VOEC."],
                    [en ? "🇦🇺 Australia" : zh ? "🇦🇺 澳大利亚" : "🇦🇺 Úc", en ? "Max $600 USD" : zh ? "最高 $600 USD" : "Tối đa $600 USD", en ? "Same name+address max $600/day." : zh ? "同一姓名+地址每天最高$600。" : "Cùng tên+địa chỉ lũy kế tối đa $600/ngày."],
                    ["🇲🇽 Mexico", en ? "Max $300 USD" : zh ? "最高 $300 USD" : "Tối đa $300 USD", en ? "Recipient tax ID required. Tax 33.5% from 08/2025." : zh ? "需要收件人税号。自2025/08起税率33.5%。" : "Bắt buộc mã số thuế người nhận. Thuế 33.5% từ 08/2025."],
                    [en ? "🇯🇵 Japan" : zh ? "🇯🇵 日本" : "🇯🇵 Nhật Bản", en ? "Max $60 USD (¥10,000)" : zh ? "最高 $60 USD (¥10,000)" : "Tối đa $60 USD (¥10.000)", en ? "Max 10 items/pkg. Personal use only." : zh ? "每件最多10件。仅限个人使用。" : "Tối đa 10 món/kiện. Chỉ sử dụng cá nhân."],
                    ["🇸🇬 Singapore", en ? "Max SGD 400 (~$290)" : zh ? "最高 SGD 400 (~$290)" : "Tối đa SGD 400 (~$290)", en ? "GST 9% + permit fee if exceeded." : zh ? "超额需GST 9% + 许可费。" : "GST 9% + phí giấy phép nếu vượt."],
                    [en ? "🇨🇭 Switzerland" : zh ? "🇨🇭 瑞士" : "🇨🇭 Thụy Sĩ", en ? "Max 62 CHF/day" : zh ? "最高 62 CHF/天" : "Tối đa 62 CHF/ngày", en ? "VAT 8.1% if exceeded." : zh ? "超额VAT 8.1%。" : "VAT 8.1% nếu vượt."],
                    ["🇦🇪 UAE", en ? "Max $270 USD" : zh ? "最高 $270 USD" : "Tối đa $270 USD", "DDP."],
                    ["🇸🇦 Saudi Arabia", en ? "Max $260 USD" : zh ? "最高 $260 USD" : "Tối đa $260 USD", en ? "VAT 15%. Min $5." : zh ? "VAT 15%。最低$5。" : "VAT 15%. Tối thiểu $5."],
                ]} />
            </Sec>

            <Sec icon="💄" title={en ? "Shipping Requirements" : zh ? "货物要求" : "Yêu Cầu Hàng Hóa"}>
                <Warn>{en ? "All goods shipped to EU within CE scope must have CE marking." : zh ? "所有发往欧盟的CE范围内商品必须有CE标志。" : "Tất cả hàng gửi EU trong phạm vi CE phải có dấu CE."}</Warn>
                <p className="mb-2">{en ? "Same accepted cosmetics list as VN route (liquid, cream, powder — no alcohol). Total non-alcohol liquid: max 500ml (Chile: 100ml)." : zh ? "与越南路线相同的可接受化妆品列表（液体、膏状、粉末 — 无酒精）。非酒精液体总量：最多500ml（智利：100ml）。" : "Cùng danh sách mỹ phẩm được nhận như tuyến VN (lỏng, kem, bột — không chứa cồn). Tổng chất lỏng không cồn: tối đa 500ml (Chile: 100ml)."}</p>
                <SubTitle>{en ? "Product regulations by country" : zh ? "各国产品规定" : "Quy định sản phẩm theo quốc gia"}</SubTitle>
                <ul className="pl-4 list-disc space-y-1">
                    <li><strong>🇦🇪 UAE:</strong> {en ? "Dye powder, eye shadow, loose setting powder, metal hydraulic bottles NOT accepted." : zh ? "染料粉、眼影、散装定妆粉、金属液压瓶不被接受。" : "Bột nhuộm, phấn mắt, phấn phủ bột rời, chai thủy lực kim loại KHÔNG được nhận."}</li>
                    <li><strong>{en ? "Thailand:" : zh ? "泰国：" : "Thái Lan:"}</strong> {en ? "Cosmetics accepted (unbranded/unlabeled only)." : zh ? "接受化妆品（仅限无品牌/无标签）。" : "Mỹ phẩm được nhận (chỉ hàng không gắn nhãn/không thương hiệu)."}</li>
                    <li><strong>🇲🇽 Mexico:</strong> {en ? "Liquid max 100ml; paste max 150g. No powder, spray, alcohol-containing liquid." : zh ? "液体最多100ml；膏状最多150g。不接受粉末、喷雾、含酒精液体。" : "Chất lỏng tối đa 100ml; paste tối đa 150g. Không bột, xịt, chất lỏng chứa cồn."}</li>
                    <li><strong>{en ? "South Africa:" : zh ? "南非：" : "Nam Phi:"}</strong> {en ? "No loose powder. Only pressed/compact products accepted." : zh ? "不接受散粉。仅接受压制产品。" : "Không nhận bột rời. Chỉ nhận sản phẩm nén ép."}</li>
                    <li><strong>🇮🇪 {en ? "Ireland:" : zh ? "爱尔兰：" : "Ireland:"}</strong> {en ? "Cosmetics under HPRA regulation not accepted." : zh ? "受HPRA监管的化妆品不被接受。" : "Mỹ phẩm thuộc quy định HPRA không được nhận."}</li>
                </ul>
            </Sec>

            <Sec icon="📏" title={en ? "Weight & Size Limits" : zh ? "重量与尺寸限制" : "Giới Hạn Cân Nặng & Kích Thước"}>
                <PT headers={en ? ["Weight limit", "Countries"] : zh ? ["重量限制", "国家"] : ["Giới hạn cân nặng", "Quốc gia"]} rows={[
                    ["0–2 kg", "SE, LU, DK"],
                    ["0–5 kg", en ? "Most other countries" : zh ? "大部分其他国家" : "Hầu hết quốc gia khác"],
                    ["0–10 kg", "ZA, CL"],
                    ["0–20 kg", en ? "🇦🇺 Australia" : zh ? "🇦🇺 澳大利亚" : "🇦🇺 Úc"],
                    ["0–25 kg", en ? "Thailand" : zh ? "泰国" : "Thái Lan"],
                    ["0–30 kg", en ? "🇲🇽 Mexico, 🇺🇸 USA, 🇨🇦 Canada" : zh ? "🇲🇽 墨西哥, 🇺🇸 美国, 🇨🇦 加拿大" : "🇲🇽 Mexico, 🇺🇸 Mỹ, 🇨🇦 Canada"],
                ]} />
                <Warn>{en ? "Irregular-shaped packages: surcharge $25/package." : zh ? "异形包裹：附加费$25/件。" : "Kiện hàng hình dạng bất thường: phụ phí $25/kiện."}</Warn>
            </Sec>

            <Sec icon="↩" title={en ? "Returns & Redelivery" : zh ? "退货与重新投递" : "Trả Hàng & Giao Lại"}>
                <Danger>{en ? "No returns from abroad to China." : zh ? "不支持从国外退回中国。" : "Không trả hàng về Trung Quốc từ nước ngoài."}</Danger>
                <Warn>{en ? "SI, HR, BG, RO, KW, QA, BH, CY, MT: No overseas redelivery support." : zh ? "SI, HR, BG, RO, KW, QA, BH, CY, MT：不支持海外重新投递。" : "SI, HR, BG, RO, KW, QA, BH, CY, MT: Không hỗ trợ giao lại ở nước ngoài."}</Warn>
                <PT headers={en ? ["Country", "Deadline", "Fee"] : zh ? ["国家", "期限", "费用"] : ["Quốc gia", "Thời hạn", "Phí"]} rows={[
                    ["🇨🇦 Canada", en ? "20 days" : zh ? "20天" : "20 ngày", en ? "$14 (1st kg) + $2.5/kg" : zh ? "$14（首kg）+ $2.5/kg" : "$14 (kg đầu) + $2.5/kg"],
                    [en ? "🇳🇴 Norway" : zh ? "🇳🇴 挪威" : "🇳🇴 Na Uy", en ? "14 days" : zh ? "14天" : "14 ngày", "$14.5/" + (en ? "pkg" : zh ? "件" : "kiện")],
                    [en ? "🇦🇺 Australia" : zh ? "🇦🇺 澳大利亚" : "🇦🇺 Úc", en ? "14 days" : zh ? "14天" : "14 ngày", en ? "By weight (≤1kg: $5.49; ≤5kg: $8.40; ≤20kg: $13.20)" : zh ? "按重量（≤1kg: $5.49; ≤5kg: $8.40; ≤20kg: $13.20）" : "Theo cân nặng (≤1kg: $5.49; ≤5kg: $8.40; ≤20kg: $13.20)"],
                    ["🇸🇦 Saudi Arabia", en ? "15 days" : zh ? "15天" : "15 ngày", "0–5kg: $10.5; >5kg: +$1.5/kg"],
                    ["🇦🇪 UAE", en ? "15 days" : zh ? "15天" : "15 ngày", "0–5kg: $4.8; >5kg: +$1.5/kg"],
                    ["🇲🇽 Mexico", en ? "5 days" : zh ? "5天" : "5 ngày", "$5/" + (en ? "pkg" : zh ? "件" : "kiện")],
                    [en ? "🇯🇵 Japan" : zh ? "🇯🇵 日本" : "🇯🇵 Nhật Bản", en ? "14 days" : zh ? "14天" : "14 ngày", "$7/" + (en ? "pkg" : zh ? "件" : "kiện")],
                    [en ? "🇬🇧 UK" : zh ? "🇬🇧 英国" : "🇬🇧 Anh", en ? "14 days" : zh ? "14天" : "14 ngày", "$7/" + (en ? "pkg" : zh ? "件" : "kiện")],
                    [en ? "Other countries" : zh ? "其他国家" : "Quốc gia khác", en ? "14 days" : zh ? "14天" : "14 ngày", "$8/" + (en ? "pkg" : zh ? "件" : "kiện")],
                ]} />
            </Sec>

            <Sec icon="🛡" title={en ? "Compensation Standards" : zh ? "赔偿标准" : "Tiêu Chuẩn Bồi Thường"}>
                <Note>{en ? "Claims must be submitted within 60 days from THG shipment. Late claims are not accepted." : zh ? "索赔必须在THG发货后60天内提交。逾期索赔不被接受。" : "Khiếu nại phải được gửi trong vòng 60 ngày kể từ khi THG xuất hàng. Khiếu nại trễ không được chấp nhận."}</Note>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{en ? "US, UK, DE, FR: Max compensation $20/package." : zh ? "美国、英国、德国、法国：最高赔偿$20/件。" : "Mỹ, Anh, Đức, Pháp: Bồi thường tối đa $20/kiện."}</li>
                    <li>{en ? "No compensation: seller's fault, failed delivery, transit damage, delays, customs seizure, force majeure, fragile items." : zh ? "不予赔偿：卖家责任、投递失败、运输损坏、延误、海关扣押、不可抗力、易碎物品。" : "Không bồi thường: lỗi người bán, giao thất bại, hư hỏng vận chuyển, chậm trễ, hải quan tịch thu, bất khả kháng, hàng dễ vỡ."}</li>
                    <li>{en ? "Seller violation: $150/package + all incurred losses." : zh ? "卖家违规：$150/件 + 所有产生的损失。" : "Vi phạm từ người bán: $150/kiện + mọi tổn thất phát sinh."}</li>
                </ul>
            </Sec>
        </div>
    );
};

export default RouteCnCosmetics;
