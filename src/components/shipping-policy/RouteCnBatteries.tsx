import { Sec, Warn, Note, Danger, SubTitle, PT, RouteBadge } from "./PolicyUI";
import { useI18n } from "@/lib/i18n";

/** Route 3: CN → WW · Batteries */
const RouteCnBatteries = () => {
    const { effectiveLanguage: lang } = useI18n();
    const en = lang === 'en', zh = lang === 'zh';

    return (
        <div>
            <RouteBadge color="bg-[#fff3e0] text-[#b45309]">{en ? "China → Worldwide · Batteries" : zh ? "中国 → 全球 · 电池" : "Trung Quốc → Toàn Cầu · Pin Điện"}</RouteBadge>

            <Sec icon="%" title="VAT / IOSS">
                <ul className="pl-4 list-disc space-y-1">
                    <li>{en ? "No VAT collected if valid IOSS code provided (from 26/06/2021)." : zh ? "如提供有效IOSS代码则不收取VAT（自2021/06/26起）。" : "Không thu VAT nếu cung cấp mã IOSS hợp lệ (từ 26/06/2021)."}</li>
                    <li>{en ? "No IOSS + using THG advance service: fee = destination VAT rate + 2%." : zh ? "无IOSS + 使用THG代缴服务：费用 = 目的地VAT税率 + 2%。" : "Không có IOSS + dịch vụ ứng của THG: phí = thuế suất VAT nước đến + 2%."}</li>
                </ul>
                <Danger>{en ? "Packages ≥ €150 / $155 NOT accepted." : zh ? "申报价值≥150欧元/155美元的包裹不被接受。" : "Kiện hàng ≥ 150 EUR / 155 USD KHÔNG được chấp nhận."}</Danger>
            </Sec>

            <Sec icon="⚖" title={en ? "Chargeable Weight" : zh ? "计费重量" : "Trọng Lượng Tính Cước"}>
                <PT headers={en ? ["Country Group", "Formula", "Minimum"] : zh ? ["国家组", "公式", "最低"] : ["Nhóm quốc gia", "Công thức", "Tối thiểu"]} rows={[
                    ["UAE, NZ, CA", en ? "Compare actual vs volumetric (÷6000); if vol <2× actual → charge actual" : zh ? "比较实际与体积（÷6000）；如体积<2×实际 → 按实际计" : "So sánh thực tế vs thể tích (÷6000); nếu thể tích <2× thực tế → tính thực tế", "100g"],
                    ["SG, MY, TH, VN", en ? "Charge higher of actual vs volumetric (÷5000)" : zh ? "取实际与体积（÷5000）较高者" : "Tính cao hơn giữa thực tế vs thể tích (÷5000)", "—"],
                    [en ? "🇯🇵 Japan" : zh ? "🇯🇵 日本" : "🇯🇵 Nhật Bản", en ? "Charge higher of actual vs volumetric (÷6000)" : zh ? "取实际与体积（÷6000）较高者" : "Tính cao hơn giữa thực tế vs thể tích (÷6000)", "500g"],
                    ["KW, QA, BH, JO, LB, PK, NG, ZA", en ? "Charge higher of actual vs volumetric (÷6000)" : zh ? "取实际与体积（÷6000）较高者" : "Tính cao hơn giữa thực tế vs thể tích (÷6000)", "100g"],
                    ["Brazil, AR, SV, CR, EC", en ? "Charge higher of actual vs volumetric (÷6000)" : zh ? "取实际与体积（÷6000）较高者" : "Tính cao hơn giữa thực tế vs thể tích (÷6000)", "100g"],
                    ["PH, Indonesia", en ? "Actual weight only — no volumetric" : zh ? "仅按实际重量 — 不计体积重" : "Chỉ tính trọng lượng thực tế — không tính thể tích", "—"],
                    ["CO, CL", en ? "Charge higher of actual vs volumetric (÷5000)" : zh ? "取实际与体积（÷5000）较高者" : "Tính cao hơn giữa thực tế vs thể tích (÷5000)", "100g"],
                    [en ? "Other countries" : zh ? "其他国家" : "Quốc gia khác", en ? "Charge higher of actual vs volumetric (÷6000)" : zh ? "取实际与体积（÷6000）较高者" : "Tính cao hơn giữa thực tế vs thể tích (÷6000)", en ? "US min 100g" : zh ? "美国最低100g" : "US tối thiểu 100g"],
                ]} />
            </Sec>

            <Sec icon="🌍" title={en ? "Countries & Restrictions" : zh ? "国家与限制" : "Quốc Gia & Hạn Chế"}>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{en ? "Does not deliver to dependent islands." : zh ? "不配送至属地岛屿。" : "Không giao đến các đảo phụ thuộc."}</li>
                    <li><strong>🇺🇸 {en ? "USA:" : zh ? "美国：" : "Mỹ:"}</strong> {en ? "Continental only — excludes Alaska, Hawaii, Puerto Rico, Guam, APO/FPO." : zh ? "仅大陆 — 不包括阿拉斯加、夏威夷、波多黎各、关岛、APO/FPO。" : "Chỉ lục địa — không bao gồm Alaska, Hawaii, Puerto Rico, Guam, APO/FPO."}</li>
                    <li><strong>🇯🇵 {en ? "Japan:" : zh ? "日本：" : "Nhật Bản:"}</strong> {en ? "No APO/FPO, Amazon, or remote areas." : zh ? "不接受APO/FPO、Amazon或偏远地区。" : "Không nhận APO/FPO, Amazon, hoặc vùng xa."}</li>
                    <li><strong>🇮🇱 Israel:</strong> {en ? "Pickup only (max 5kg, 45×40×40cm). Gaza not served." : zh ? "仅自提（最大5kg，45×40×40cm）。加沙不提供服务。" : "Chỉ tự lấy hàng (tối đa 5kg, 45×40×40cm). Không phục vụ Gaza."}</li>
                    <li><strong>🇬🇧 {en ? "UK:" : zh ? "英国：" : "Anh:"}</strong> {en ? "Mainland + domestic islands." : zh ? "大陆+国内岛屿。" : "Lục địa + đảo nội địa."}</li>
                    <li><strong>🇸🇦 Saudi Arabia ({en ? "from" : zh ? "自" : "từ"} 01/01/2026):</strong> {en ? "National Address required." : zh ? "需要国家地址。" : "Yêu cầu Địa chỉ Quốc gia."}</li>
                    <li>IL, UAE, SA, JO, LB, KW, BH, QA: {en ? "No PO Box." : zh ? "不接受邮政信箱。" : "Không nhận PO Box."}</li>
                    <li>{en ? "All countries: No Amazon or military addresses." : zh ? "所有国家：不接受Amazon或军事地址。" : "Tất cả quốc gia: Không nhận địa chỉ Amazon và quân sự."}</li>
                </ul>
            </Sec>

            <Sec icon="🔋" title={en ? "Shipping Requirements" : zh ? "货物要求" : "Yêu Cầu Hàng Hóa"}>
                <Warn>{en ? "All goods shipped to EU within CE scope must have CE marking." : zh ? "所有发往欧盟的CE范围内商品必须有CE标志。" : "Tất cả hàng gửi EU trong phạm vi CE phải có dấu CE."}</Warn>
                <Danger>{en ? "All countries: Branded/IP-infringing goods strictly prohibited. Pure batteries, liquids, powder, firearms prohibited." : zh ? "所有国家：严禁品牌/侵权商品。禁止纯电池、液体、粉末、枪支弹药。" : "Tất cả quốc gia: Nghiêm cấm hàng thương hiệu/vi phạm bản quyền. Nghiêm cấm pin nguyên chất, chất lỏng, bột, súng đạn."}</Danger>
                <SubTitle>{en ? "Battery acceptance by country" : zh ? "各国电池接受规定" : "Quy định nhận pin theo quốc gia"}</SubTitle>
                <PT headers={en ? ["Country/Group", "Accepted", "NOT Accepted"] : zh ? ["国家/组", "接受", "不接受"] : ["Quốc gia/Nhóm", "Được nhận", "KHÔNG được nhận"]} rows={[
                    ["UK, IE, SE, LV, PT, RO, SI, SK", en ? "Regular + built-in battery" : zh ? "普通货物+内置电池" : "Hàng thường + pin tích hợp", en ? "Pure battery, loose/packed battery" : zh ? "纯电池、散装/随附电池" : "Pin nguyên chất, pin rời/kèm theo"],
                    [en ? "Other EU countries" : zh ? "其他欧盟国家" : "Các nước EU khác", en ? "Regular + built-in + packed battery (≤100Wh)" : zh ? "普通+内置+随附电池（≤100Wh）" : "Hàng thường + pin tích hợp + pin kèm theo (≤100Wh)", en ? "Pure battery" : zh ? "纯电池" : "Pin nguyên chất"],
                    [en ? "🇺🇸 USA" : zh ? "🇺🇸 美国" : "🇺🇸 Mỹ", en ? "Built-in + packed battery" : zh ? "内置+随附电池" : "Pin tích hợp + pin kèm theo", en ? "Pure battery, food, cosmetics, FDA, adult, laser, helmets" : zh ? "纯电池、食品、化妆品、FDA、成人用品、激光、头盔" : "Pin nguyên chất, thực phẩm, mỹ phẩm, FDA, người lớn, laser, mũ bảo hiểm"],
                    [en ? "South Africa" : zh ? "南非" : "Nam Phi", en ? "Built-in + packed battery" : zh ? "内置+随附电池" : "Pin tích hợp + pin kèm theo", en ? "Pure battery, cream, cosmetics, liquid/powder" : zh ? "纯电池、膏状物、化妆品、液体/粉末" : "Pin nguyên chất, kem, mỹ phẩm, chất lỏng/bột"],
                    ["🇨🇦 Canada", en ? "Built-in battery" : zh ? "内置电池" : "Pin tích hợp", en ? "Packed/pure battery, cosmetic cream" : zh ? "随附/纯电池、化妆品膏" : "Pin kèm theo/nguyên chất, kem mỹ phẩm"],
                    ["🇲🇽 Mexico", en ? "Regular + built-in + packed" : zh ? "普通+内置+随附" : "Hàng thường + pin tích hợp + kèm theo", en ? "Counterfeit, paste, pure battery, liquid, powder" : zh ? "仿冒品、膏状物、纯电池、液体、粉末" : "Hàng nhái, paste, pin nguyên chất, chất lỏng, bột"],
                    ["SG / MY / TH / VN / PH / CL / CO", en ? "Built-in + packed battery" : zh ? "内置+随附电池" : "Pin tích hợp + kèm theo", en ? "Pure battery, powder, liquid; MY/PH/VN/TH: no phones" : zh ? "纯电池、粉末、液体；MY/PH/VN/TH：禁止手机" : "Pin nguyên chất, bột, lỏng; MY/PH/VN/TH: cấm điện thoại"],
                    [en ? "🇯🇵 Japan" : zh ? "🇯🇵 日本" : "🇯🇵 Nhật Bản", en ? "Built-in + packed (≤100Wh)" : zh ? "内置+随附（≤100Wh）" : "Pin tích hợp + kèm theo (≤100Wh)", en ? "Pure battery, leather, wool, used goods, infant toys" : zh ? "纯电池、皮革、羊毛、二手货、婴儿玩具" : "Pin nguyên chất, da, len, hàng cũ, đồ chơi trẻ sơ sinh"],
                    ["KW / QA / BH / JO / LB / SA / UAE", en ? "Built-in battery only" : zh ? "仅内置电池" : "Chỉ pin tích hợp", en ? "Packed battery, high-power, magnetic, liquid, powder" : zh ? "随附电池、大功率、磁性、液体、粉末" : "Pin kèm theo, thiết bị công suất cao, từ tính, lỏng, bột"],
                    ["Peru", en ? "Built-in + packed (≤100Wh)" : zh ? "内置+随附（≤100Wh）" : "Pin tích hợp + kèm theo (≤100Wh)", en ? "Pure battery, supplements, cosmetics, phones" : zh ? "纯电池、保健品、化妆品、手机" : "Pin nguyên chất, thực phẩm chức năng, mỹ phẩm, điện thoại"],
                    ["Brazil", en ? "Regular + built-in (not exposed)" : zh ? "普通+内置（不外露）" : "Hàng thường + pin tích hợp (không lộ bên ngoài)", en ? "Counterfeit, paste, pure battery, liquid, powder" : zh ? "仿冒品、膏状物、纯电池、液体、粉末" : "Hàng nhái, paste, pin nguyên chất, chất lỏng, bột"],
                    ["Indonesia", en ? "Regular goods" : zh ? "普通货物" : "Hàng thường", en ? "Animals/plants, food, pharma, batteries, drones, laser, gaming devices" : zh ? "动植物、食品、药品、电池、无人机、激光、游戏设备" : "Động/thực vật, thực phẩm, dược phẩm, pin, flycam, laser, máy chơi game"],
                ]} />
            </Sec>

            <Sec icon="📏" title={en ? "Weight & Size Limits" : zh ? "重量与尺寸限制" : "Giới Hạn Cân Nặng & Kích Thước"}>
                <PT headers={en ? ["Weight limit", "Countries"] : zh ? ["重量限制", "国家"] : ["Giới hạn cân nặng", "Quốc gia"]} rows={[
                    ["0–2 kg", "IL, NO, CH, MA | TZ, RW, EG, AO, SN, MU, RE, MG, SC, ZM, AR, PK"],
                    ["0–5 kg", "IL, NO, CH, MA"],
                    ["0–10 kg", "PH, ZA, MX, UAE, SA, JP, LB, SV, CR, ID, CL"],
                    ["0–20 kg", "UK, NL, BE, LU, AU, IE, SE, CO, KR, PE, BR"],
                    ["0–25 kg", "TH, NZ"],
                    ["0–30 kg", en ? "🇺🇸 USA, most other countries" : zh ? "🇺🇸 美国，大部分其他国家" : "🇺🇸 Mỹ, hầu hết quốc gia khác"],
                ]} />
                <Warn>{en ? "Oversized packages: surcharge $25/package." : zh ? "超大包裹：附加费$25/件。" : "Kiện hàng quá khổ: phụ phí $25/kiện."}</Warn>
            </Sec>

            <Sec icon="↩" title={en ? "Returns & Redelivery" : zh ? "退货与重新投递" : "Trả Hàng & Giao Lại"}>
                <Danger>{en ? "No returns from abroad to China." : zh ? "不支持从国外退回中国。" : "Không trả hàng về Trung Quốc từ nước ngoài."}</Danger>
                <Warn>{en ? "SI, HR, BG, RO, KW, QA, BH, CY, MT: No overseas redelivery support." : zh ? "SI, HR, BG, RO, KW, QA, BH, CY, MT：不支持海外重新投递。" : "SI, HR, BG, RO, KW, QA, BH, CY, MT: Không hỗ trợ giao lại ở nước ngoài."}</Warn>
                <PT headers={en ? ["Country", "Deadline", "Fee"] : zh ? ["国家", "期限", "费用"] : ["Quốc gia", "Thời hạn", "Phí"]} rows={[
                    ["🇨🇦 Canada", en ? "20 days" : zh ? "20天" : "20 ngày", "$14 (1st kg) + $2.5/kg"],
                    [en ? "🇳🇴 Norway" : zh ? "🇳🇴 挪威" : "🇳🇴 Na Uy", en ? "14 days" : zh ? "14天" : "14 ngày", "$14.5/" + (en ? "pkg" : zh ? "件" : "kiện")],
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

export default RouteCnBatteries;
