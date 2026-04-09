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
                <Note>{en ? "Claims must be submitted within 60 days from THG shipment." : zh ? "索赔必须在THG发货后60天内提交。" : "Khiếu nại phải được gửi trong vòng 60 ngày kể từ khi THG xuất hàng."}</Note>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{en ? "US, UK, DE, FR: Max $20/package." : zh ? "美国、英国、德国、法国：最高$20/件。" : "Mỹ, Anh, Đức, Pháp: Tối đa $20/kiện."}</li>
                    <li>{en ? "Seller violation: $150/package + all incurred losses." : zh ? "卖家违规：$150/件 + 所有产生的损失。" : "Vi phạm từ người bán: $150/kiện + mọi tổn thất phát sinh."}</li>
                </ul>
            </Sec>
        </div>
    );
};

export default RouteCnBatteries;
