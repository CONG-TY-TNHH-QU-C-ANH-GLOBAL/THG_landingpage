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
                <Warn>{en ? "1. Claim deadline: Claims must be submitted within 60 days of THG dispatch. Late claims not accepted." : zh ? "1. 索赔期限：索赔必须在THG发货后60天内提交。逾期不予受理。" : "1. Thời hạn khiếu nại: Phải gửi trong vòng 60 ngày kể từ khi THG xuất hàng. Quá hạn không được chấp nhận."}</Warn>

                <SubTitle>{en ? "2. Compensation standards" : zh ? "2. 赔偿标准" : "2. Tiêu chuẩn bồi thường"}</SubTitle>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{en ? "USA, UK, Germany, France — Lost before/after reaching last-mile carrier (confirmed by THG): max $20/package (shipping fee)." : zh ? "美国、英国、德国、法国 — 到达最后一公里承运商前/后丢失（THG确认）：最高$20/件（运费）。" : "Mỹ, Anh, Đức, Pháp — Mất trước/sau khi đến nhà vận chuyển chặng cuối (THG xác nhận): tối đa $20/kiện (phí vận chuyển)."}</li>
                </ul>

                <SubTitle>{en ? "3. Claim documents and requirements" : zh ? "3. 索赔文件和要求" : "3. Tài liệu và yêu cầu khiếu nại"}</SubTitle>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{en ? "① Not yet scanned (lost during THG transit): No documents required." : zh ? "① 未扫描（THG运输途中丢失）：无需文件。" : "① Chưa quét (mất trong quá trình vận chuyển THG): Không cần tài liệu."}</li>
                    <li>{en ? "② Scanned (confirmed lost by carrier): Platform refund screenshot (with transaction ID) OR replacement order number/proof." : zh ? "② 已扫描（承运商确认丢失）：平台退款截图（含交易ID）或换货订单号/证明。" : "② Đã quét (nhà vận chuyển xác nhận mất): Ảnh chụp hoàn tiền (có mã giao dịch) HOẶC mã đơn thay thế/bằng chứng."}</li>
                    <li>{en ? "③ Requirements: a) Within eligible timeframe. b) No tracking updates or investigation returned no result (exceptions: failed delivery, pickup point, return, customs hold, etc.)" : zh ? "③ 要求：a) 在合格时间范围内。b) 无追踪更新或调查无结果（例外：投递失败、取件点、退件、海关扣留等）" : "③ Yêu cầu: a) Trong khung thời gian hợp lệ. b) Không có cập nhật tracking hoặc điều tra không có kết quả (ngoại trừ: giao thất bại, điểm lấy hàng, trả hàng, hải quan giữ, v.v.)"}</li>
                    <li>{en ? "④ Claims must be submitted within 30 days of THG confirming loss. Late claims not accepted." : zh ? "④ 索赔必须在THG确认丢失后30天内提交。逾期不予受理。" : "④ Khiếu nại phải gửi trong 30 ngày kể từ khi THG xác nhận mất. Quá hạn không được chấp nhận."}</li>
                </ul>

                <SubTitle>{en ? "4. Non-compensable cases" : zh ? "4. 不予赔偿的情况" : "4. Các trường hợp không bồi thường"}</SubTitle>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{en ? "① All compensation requires prior investigation. No compensation without investigation." : zh ? "① 所有赔偿需先调查。未经调查不予赔偿。" : "① Mọi bồi thường đều yêu cầu điều tra trước. Không bồi thường nếu không điều tra."}</li>
                    <li>{en ? "② Losses from seller error (damage, mis-shipment, quality issues, duplicate orders, non-compliant packaging) NOT compensated." : zh ? "② 卖家失误造成的损失（损坏、发错货、质量问题、重复订单、不合规包装）不予赔偿。" : "② Thiệt hại do lỗi người bán (hư hỏng, gửi sai, chất lượng, đơn trùng, đóng gói không đạt) KHÔNG bồi thường."}</li>
                    <li>{en ? "③ Failed delivery due to incorrect address, refusal, recipient not home, or failure to collect NOT compensated. For returns: THG only guarantees returning received packages." : zh ? "③ 因地址错误、拒收、收件人不在家或未取件导致投递失败不予赔偿。退货：THG仅保证退回已接收的包裹。" : "③ Giao thất bại do địa chỉ sai, từ chối, không có người nhận hoặc không lấy hàng KHÔNG bồi thường. Trả hàng: THG chỉ đảm bảo trả hàng đã nhận."}</li>
                    <li>{en ? "④ Damage occurring during transit (warehouse to delivery) NOT compensated by THG." : zh ? "④ 运输过程中（仓库到交付）发生的损坏THG不予赔偿。" : "④ Hư hỏng trong quá trình vận chuyển (từ kho đến giao hàng) THG KHÔNG bồi thường."}</li>
                    <li>{en ? "⑤ THG does not guarantee transit time; no compensation for delays." : zh ? "⑤ THG不保证运输时间；不赔偿延误。" : "⑤ THG không đảm bảo thời gian vận chuyển; không bồi thường chậm trễ."}</li>
                    <li>{en ? "⑥ Destruction, confiscation, or fines due to IP infringement or prohibited goods are the seller's sole responsibility." : zh ? "⑥ 因知识产权侵权或违禁品导致的销毁、没收或罚款由卖家全权承担。" : "⑥ Tiêu hủy, tịch thu hoặc phạt do vi phạm SHTT hoặc hàng cấm là trách nhiệm của người bán."}</li>
                    <li>{en ? "⑦ Goods must comply with all laws and the IP Compliance Letter & Cargo Safety Agreement. If violated, THG may intercept, quarantine, freeze, stop, return, hold, destroy, or transfer goods to authorities. No compensation; no fee refunds." : zh ? "⑦ 货物必须符合所有法律和知识产权合规函及货物安全协议。如违反，THG可拦截、隔离、冻结、停止、退回、扣留、销毁或移交当局。不予赔偿；不退费。" : "⑦ Hàng phải tuân thủ pháp luật và Cam kết SHTT & An toàn hàng hóa. Vi phạm → THG có quyền chặn, cách ly, đóng băng, dừng, trả, giữ, tiêu hủy, hoặc chuyển cho cơ quan. Không bồi thường; không hoàn phí."}</li>
                </ul>
                <Danger>{en ? "If THG incurs government enforcement, penalties, or third-party claims due to seller violations, the seller must pay $150/package plus any additional losses (including damages and regulatory fines)." : zh ? "如因卖家违规导致THG遭受政府执法、罚款或第三方索赔，卖家需支付$150/件加上所有额外损失（包括赔偿金和监管罚款）。" : "Nếu THG bị xử phạt, phạt tiền hoặc bị bên thứ ba khiếu nại do người bán vi phạm, người bán phải trả $150/kiện cộng mọi tổn thất bổ sung."}</Danger>

                <SubTitle>{en ? "⑧ Force Majeure" : zh ? "⑧ 不可抗力" : "⑧ Bất khả kháng"}</SubTitle>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{en ? "Includes but not limited to: social events (strikes, unrest, war, terrorism, pandemics), natural disasters, government actions, traffic accidents, and regulatory changes." : zh ? "包括但不限于：社会事件（罢工、动乱、战争、恐怖主义、疫情）、自然灾害、政府行为、交通事故和法规变更。" : "Bao gồm nhưng không giới hạn: sự kiện xã hội (đình công, bạo loạn, chiến tranh, khủng bố, dịch bệnh), thiên tai, hành động chính phủ, tai nạn giao thông, thay đổi quy định."}</li>
                    <li>{en ? "THG shall not be liable for any loss, damage, or non-performance resulting from force majeure events." : zh ? "THG对因不可抗力事件造成的任何损失、损坏或未履行不承担责任。" : "THG không chịu trách nhiệm với bất kỳ tổn thất, hư hỏng hoặc không thực hiện do bất khả kháng."}</li>
                </ul>

                <SubTitle>{en ? "⑨ Post-delivery exceptions" : zh ? "⑨ 交付后异常" : "⑨ Ngoại lệ sau giao hàng"}</SubTitle>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{en ? "THG assists with investigations only, with no guaranteed response. Unconfirmed overseas losses will not be compensated." : zh ? "THG仅协助调查，不保证回复。未确认的海外损失不予赔偿。" : "THG chỉ hỗ trợ điều tra, không cam kết phản hồi. Tổn thất ở nước ngoài chưa xác nhận sẽ không được bồi thường."}</li>
                </ul>

                <SubTitle>{en ? "⑩ Fragile & perishable goods" : zh ? "⑩ 易碎和易腐货物" : "⑩ Hàng dễ vỡ & dễ hỏng"}</SubTitle>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{en ? "For fragile goods (ceramics, glassware, specialty crafts), perishable items, documents/tickets/coupons, or temperature-sensitive goods: sellers ship at their own risk. THG will not compensate for damage or refund shipping fees." : zh ? "易碎品（陶瓷、玻璃器皿、特殊工艺品）、易腐品、文件/票券或温度敏感品：卖家自行承担风险。THG不赔偿损坏或退还运费。" : "Hàng dễ vỡ (gốm sứ, thủy tinh, thủ công mỹ nghệ), hàng dễ hỏng, tài liệu/vé/phiếu, hoặc hàng nhạy nhiệt: người bán tự chịu rủi ro. THG không bồi thường hư hỏng hoặc hoàn phí."}</li>
                </ul>

                <SubTitle>{en ? "5. Handover methods & compensation rules" : zh ? "5. 交接方式和赔偿规则" : "5. Phương thức bàn giao & quy tắc bồi thường"}</SubTitle>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{en ? "① Sellers may self-ship or use a third-party collection agent. All costs are borne by the seller. Sellers must prepare consolidated bags/boxes matching the order quantity." : zh ? "① 卖家可自行发货或使用第三方揽收。所有费用由卖家承担。卖家需准备与订单数量匹配的集包。" : "① Người bán có thể tự gửi hoặc dùng bên thu gom. Mọi chi phí do người bán chịu. Phải chuẩn bị túi/hộp gom hàng khớp số lượng."}</li>
                    <li>{en ? "② Losses before THG confirms receipt are borne by the seller. For self-shipped packages, seller pursues claims directly. For third-party collection, THG may assist — seller must provide supporting documents." : zh ? "② THG确认收货前的损失由卖家承担。自行发货的包裹由卖家直接追索。第三方揽收的，THG可协助——卖家需提供证明文件。" : "② Tổn thất trước khi THG xác nhận nhận hàng do người bán chịu. Hàng tự gửi: người bán tự khiếu nại. Thu gom bên thứ ba: THG có thể hỗ trợ — người bán cung cấp tài liệu."}</li>
                </ul>
                <Note>{en ? "THG reserves the right to modify the above handover methods and compensation rules at any time." : zh ? "THG保留随时修改上述交接方式和赔偿规则的权利。" : "THG có quyền thay đổi phương thức bàn giao và quy tắc bồi thường bất kỳ lúc nào."}</Note>
            </Sec>

            <Sec icon="🔍" title={en ? "Tracking Websites" : zh ? "查询网站" : "Website Tra Cứu"}>
                <ul className="pl-4 list-disc space-y-1">
                    <li><a href="https://www.yuntrack.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">https://www.yuntrack.com/</a></li>
                    <li><a href="http://www.17track.net" target="_blank" rel="noopener noreferrer" className="text-primary underline">http://www.17track.net</a></li>
                    <li><a href="https://www.aftership.com/couriers/yunexpress" target="_blank" rel="noopener noreferrer" className="text-primary underline">https://www.aftership.com/couriers/yunexpress</a></li>
                </ul>
            </Sec>

            <Sec icon="📌" title={en ? "Other Requirements" : zh ? "其他要求" : "Yêu Cầu Khác"}>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{en ? "Better to provide sales link and customs code to facilitate customs clearance." : zh ? "最好提供销售链接和海关编码以便通关。" : "Nên cung cấp link sản phẩm và mã hải quan để thông quan thuận lợi."}</li>
                    <li>{en ? "Product name declaration cannot be a major category — must be specific (e.g., not just \"electronic accessories\")." : zh ? "产品名不能是大类——必须具体（例如不能只写\"电子配件\"）。" : "Khai báo tên sản phẩm không được là đại loại — phải cụ thể (VD: không chỉ khai \"phụ kiện điện tử\")."}</li>
                    <li>{en ? "Multiple packages to the same recipient on the same day: declared values will be accumulated and cannot exceed the country's maximum limit." : zh ? "同一天寄给同一收件人的多个包裹：申报价值将累计，不得超过目的国最高限额。" : "Nhiều kiện cùng người nhận trong ngày: giá trị khai báo sẽ cộng dồn, không vượt giới hạn quốc gia."}</li>
                    <li>{en ? "For taxes or fines from low declarations determined by customs, THG has the right to charge relevant fees to the client." : zh ? "因海关认定低报产生的税费或罚款，THG有权向客户收取相关费用。" : "Thuế hoặc phạt do hải quan xác định khai báo thấp, THG có quyền thu phí liên quan từ khách hàng."}</li>
                    <li>{en ? "For fragile items (ceramics, glassware, etc.), take protective measures. THG does not compensate for transit damage. Use shockproof material, foam/bubble wrap, and fragile labels." : zh ? "易碎品（陶瓷、玻璃器皿等）需自行采取保护措施。THG不赔偿运输损坏。使用防震材料、泡沫/气泡膜和易碎标签。" : "Hàng dễ vỡ (gốm sứ, thủy tinh, v.v.) phải tự bảo vệ. THG không bồi thường hư hỏng vận chuyển. Dùng vật liệu chống sốc, bọt xốp/bong bóng và nhãn dễ vỡ."}</li>
                    <li>{en ? "Brazil: Packages with yellow tape covering the exterior will be refused by Brazilian customs." : zh ? "巴西：外部覆盖黄色胶带的包裹将被巴西海关拒绝。" : "Brazil: Kiện hàng phủ băng keo vàng bên ngoài sẽ bị hải quan Brazil từ chối."}</li>
                    <li>{en ? "Any abnormal costs from non-compliance (underreporting, prohibited items, declaration discrepancies, infringement) will be collected from the sender." : zh ? "因不合规（低报、违禁品、申报不符、侵权）产生的异常费用将向发件人收取。" : "Mọi chi phí bất thường do không tuân thủ (khai thấp, hàng cấm, khai báo sai, vi phạm) sẽ thu từ người gửi."}</li>
                </ul>
                <Warn>{en ? "Special Note: By accepting our services, you acknowledge that you have read the notes in this price list and our shipping terms and accept all terms and conditions." : zh ? "特别说明：接受我们的服务即表示您已阅读本价格表中的注意事项和运输条款，并接受所有条款和条件。" : "Lưu ý đặc biệt: Khi chấp nhận dịch vụ THG, bạn đã đọc kỹ và đồng ý với tất cả điều khoản trong bảng giá và quy định vận chuyển."}</Warn>
                <Note>{en ? "Important: Recipient names must not contain company names (GmbH, KFT, SRL, Ltd). Customs may classify as B2B, requiring customs duties." : zh ? "重要：收件人姓名不得包含公司名称（GmbH、KFT、SRL、Ltd）。海关可能将其归类为B2B，需缴纳关税。" : "Quan trọng: Tên người nhận không chứa tên công ty (GmbH, KFT, SRL, Ltd). Hải quan có thể phân loại B2B, yêu cầu nộp thuế."}</Note>
                <ul className="pl-4 list-disc space-y-1 mt-2">
                    <li>{en ? "THG's provision of services does not constitute THG acting as the importer. The client shall pay all relevant taxes and customs clearance fees in accordance with applicable laws." : zh ? "THG提供服务并不意味着THG作为进口商。客户应按适用法律支付所有相关税费和清关费用。" : "Việc THG cung cấp dịch vụ không có nghĩa THG là nhà nhập khẩu. Khách hàng phải nộp mọi thuế và phí thông quan theo luật áp dụng."}</li>
                    <li>{en ? "The client must register for a VAT/GST number with local tax authorities. THG has the right to request the client's legally registered tax number." : zh ? "客户必须在当地税务机关注册VAT/GST号。THG有权要求客户提供合法注册的税号。" : "Khách hàng phải đăng ký số VAT/GST với cơ quan thuế địa phương. THG có quyền yêu cầu cung cấp mã số thuế hợp lệ."}</li>
                </ul>
            </Sec>
        </div>
    );
};

export default RouteCnCosmetics;
