import { Sec, Warn, Note, Danger, SubTitle, PT, RouteBadge } from "./PolicyUI";
import { useI18n } from "@/lib/i18n";

/** Route 0: VN → WW · Regular */
const RouteVnRegular = () => {
    const { effectiveLanguage: lang } = useI18n();
    const en = lang === 'en', zh = lang === 'zh';

    const routeLabel = en ? 'Vietnam → Worldwide · Regular Items'
        : zh ? '越南 → 全球 · 普通货物' : 'Việt Nam → Toàn Cầu · Hàng Thường';

    return (
        <div>
            <RouteBadge color="bg-[#e8f4e8] text-[#2d7a2d]">{routeLabel}</RouteBadge>

            <Sec icon="%" title={en ? "VAT / IOSS" : zh ? "增值税 / IOSS" : "VAT / IOSS"}>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{en ? <>From 09:00 on 26/06/2021 — THG will <strong>NOT collect VAT</strong> if the customer provides a valid IOSS code.</>
                        : zh ? <>从2021年6月26日09:00起 — 如果客户提供有效的IOSS代码，THG将<strong>不收取VAT</strong>。</>
                            : <>Từ 09:00 ngày 26/06/2021 — THG sẽ <strong>KHÔNG thu VAT</strong> nếu khách hàng cung cấp mã IOSS hợp lệ.</>}</li>
                    <li>{en ? "All customs issues arising from invalid IOSS codes (mass returns, seizure, fines...) are the customer's responsibility."
                        : zh ? "因无效IOSS代码引起的所有海关问题（大量退货、扣押、罚款...）由客户自行承担。"
                            : "Mọi vấn đề hải quan phát sinh do mã IOSS không hợp lệ (trả hàng hàng loạt, bị giữ, phạt...) do khách hàng tự chịu."}</li>
                    <li>{en ? <>If no IOSS and using THG's VAT advance service: fee = <strong>destination VAT rate + 2%</strong> (THG service fee).</>
                        : zh ? <>如果没有IOSS并使用THG的代缴VAT服务：费用 = <strong>目的地VAT税率 + 2%</strong>（THG服务费）。</>
                            : <>Nếu không có IOSS và sử dụng dịch vụ ứng VAT của THG: phí = <strong>thuế suất VAT nước đến + 2%</strong> (phí dịch vụ THG).</>}</li>
                </ul>
                <Danger>{en ? "Packages with declared value ≥ €150 or $155 will NOT be accepted. Applies to EU countries — refer to EU VAT rate table."
                    : zh ? "申报价值≥150欧元或155美元的包裹将不被接受。适用于欧盟国家 — 请参考欧盟VAT税率表。"
                        : "Kiện hàng có giá trị khai báo ≥ 150 EUR hoặc 155 USD sẽ KHÔNG được chấp nhận. Áp dụng cho các nước EU — tham khảo bảng thuế suất VAT EU."}</Danger>
            </Sec>

            <Sec icon="⚖" title={en ? "Chargeable Weight" : zh ? "计费重量" : "Trọng Lượng Tính Cước"}>
                <p>{en ? "Charged by whichever is higher — actual weight or volumetric weight."
                    : zh ? "按较高者计费 — 实际重量或体积重量。"
                        : "Tính cước theo trọng lượng nào cao hơn — trọng lượng thực tế hoặc trọng lượng thể tích."}</p>
                <Note>{en ? "Volumetric weight formula: L × W × H (cm) ÷ 5000 = KG"
                    : zh ? "体积重量公式：长 × 宽 × 高 (cm) ÷ 5000 = KG"
                        : "Công thức trọng lượng thể tích: D × R × C (cm) ÷ 5000 = KG"}</Note>
            </Sec>

            <Sec icon="🌍" title={en ? "Countries & Restrictions" : zh ? "国家与限制" : "Quốc Gia & Hạn Chế"}>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{en ? "No Proof of Delivery (POD) — contact sales to add POD service."
                        : zh ? "无签收证明（POD）— 联系销售添加POD服务。"
                            : "Không có bằng chứng giao hàng (POD) — liên hệ sales để thêm dịch vụ POD."}</li>
                    <li>{en ? "Does not deliver to European dependent islands."
                        : zh ? "不配送至欧洲属地岛屿。"
                            : "Không giao đến các đảo phụ thuộc châu Âu."}</li>
                    <li><strong>🇺🇸 {en ? "USA:" : zh ? "美国：" : "Mỹ:"}</strong> {en ? "Does not include APO/FPO military addresses."
                        : zh ? "不包括APO/FPO军事地址。"
                            : "Không bao gồm địa chỉ quân sự APO/FPO."}</li>
                    <li><strong>🇨🇭 {en ? "Switzerland" : zh ? "瑞士" : "Thụy Sĩ"} / 🇳🇴 {en ? "Norway:" : zh ? "挪威：" : "Na Uy:"}</strong> {en ? "Full coverage." : zh ? "全境覆盖。" : "Phủ sóng toàn bộ lãnh thổ."}</li>
                    <li><strong>🇨🇱 Chile:</strong> {en ? "Entire territory except some restricted areas."
                        : zh ? "全境，部分限制区域除外。"
                            : "Toàn bộ lãnh thổ trừ một số khu vực hạn chế."}</li>
                    <li><strong>🇸🇬 Singapore:</strong> {en ? "Some areas cannot be delivered — refer to postal code list."
                        : zh ? "部分地区无法配送 — 请参考邮编列表。"
                            : "Một số khu vực không thể giao — tham khảo danh sách mã bưu chính."}</li>
                    <li><strong>🇯🇵 {en ? "Japan:" : zh ? "日本：" : "Nhật Bản:"}</strong> {en ? "No APO/FPO or Amazon addresses."
                        : zh ? "不接受APO/FPO或Amazon地址。"
                            : "Không nhận APO/FPO hoặc địa chỉ Amazon."}</li>
                    <li><strong>🇬🇧 {en ? "UK:" : zh ? "英国：" : "Anh:"}</strong> {en ? "Mainland + islands. NO overseas territories."
                        : zh ? "大陆+岛屿。不包括海外领地。"
                            : "Lục địa + các đảo. KHÔNG nhận lãnh thổ hải ngoại."}</li>
                    <li><strong>🇦🇪 UAE / 🇸🇦 Saudi Arabia:</strong> {en ? "No PO BOX — requires accurate address and phone number."
                        : zh ? "不接受邮政信箱 — 需要准确地址和电话号码。"
                            : "Không nhận PO BOX — yêu cầu địa chỉ chính xác và SĐT."}</li>
                </ul>
            </Sec>

            <Sec icon="$" title={en ? "Declared Value" : zh ? "申报价值" : "Giá Trị Khai Báo"}>
                <PT headers={en ? ["Country / Region", "Limit", "Notes"] : zh ? ["国家/地区", "限额", "备注"] : ["Quốc gia / Khu vực", "Giới hạn", "Ghi chú"]} rows={[
                    [en ? "🇬🇧 UK" : zh ? "🇬🇧 英国" : "🇬🇧 Anh", en ? "Max £135 / $155 / €150" : zh ? "最高 £135 / $155 / €150" : "Tối đa £135 / $155 / €150", en ? "Platform/seller must declare at actual selling price." : zh ? "平台/卖家必须按实际售价申报。" : "Nền tảng/người bán phải khai báo theo giá bán thực tế."],
                    [en ? "🇺🇸 USA" : zh ? "🇺🇸 美国" : "🇺🇸 Mỹ", en ? "Max $250/package" : zh ? "最高 $250/件" : "Tối đa $250/kiện", "—"],
                    ["🇪🇺 EU", en ? "Max €150 / $155" : zh ? "最高 €150 / $155" : "Tối đa €150 / $155", "—"],
                    [en ? "🇨🇭 Switzerland" : zh ? "🇨🇭 瑞士" : "🇨🇭 Thụy Sĩ", en ? "Max 62 CHF/day (~$66)" : zh ? "最高 62 CHF/天 (~$66)" : "Tối đa 62 CHF/ngày (~$66)", en ? "VAT 8.1% if cumulative ≥ 62 CHF." : zh ? "累计≥62 CHF时VAT 8.1%。" : "VAT 8.1% nếu lũy kế ≥ 62 CHF."],
                    [en ? "🇳🇴 Norway" : zh ? "🇳🇴 挪威" : "🇳🇴 Na Uy", en ? "Max 3000 NOK (~€250)" : zh ? "最高 3000 NOK (~€250)" : "Tối đa 3000 NOK (~€250)", en ? "VOEC number required from 01/01/2024." : zh ? "自2024/01/01起需要VOEC编号。" : "Yêu cầu số VOEC từ 01/01/2024."],
                    ["🇨🇦 Canada", en ? "Max $99 USD" : zh ? "最高 $99 USD" : "Tối đa $99 USD", en ? "DDP. Tax-free under CAD 20. Tax rate: 18%." : zh ? "DDP。低于CAD 20免税。税率：18%。" : "DDP. Miễn thuế dưới CAD 20. Thuế suất: 18%."],
                    ["🇲🇽 Mexico", en ? "Max $300 USD" : zh ? "最高 $300 USD" : "Tối đa $300 USD", en ? "Recipient tax ID required. 19% tax from 01/01/2025." : zh ? "需要收件人税号。自2025/01/01起税率19%。" : "Yêu cầu mã số thuế người nhận. Thuế 19% từ 01/01/2025."],
                    ["🇸🇬 Singapore", en ? "Max $290 USD" : zh ? "最高 $290 USD" : "Tối đa $290 USD", en ? "GST 9% + permit fee if exceeded." : zh ? "超额需GST 9% + 许可费。" : "GST 9% + phí giấy phép nếu vượt."],
                    [en ? "🇦🇺 Australia" : zh ? "🇦🇺 澳大利亚" : "🇦🇺 Úc", en ? "Max $600 USD" : zh ? "最高 $600 USD" : "Tối đa $600 USD", en ? "Same name+address: max $600/day cumulative." : zh ? "同一姓名+地址：每天累计最高$600。" : "Cùng tên+địa chỉ: lũy kế tối đa $600/ngày."],
                    [en ? "🇯🇵 Japan" : zh ? "🇯🇵 日本" : "🇯🇵 Nhật Bản", en ? "Max $110 USD (¥16,666)" : zh ? "最高 $110 USD (¥16,666)" : "Tối đa $110 USD (¥16,666)", en ? "Max 10 items/package. Personal use only." : zh ? "每件最多10件商品。仅限个人使用。" : "Tối đa 10 món/kiện. Chỉ sử dụng cá nhân."],
                    ["🇳🇿 New Zealand", en ? "Max $550 USD" : zh ? "最高 $550 USD" : "Tối đa $550 USD", en ? "Accurate product name required." : zh ? "需要准确的产品名称。" : "Yêu cầu tên sản phẩm chính xác."],
                    ["🇦🇪 UAE", en ? "Max $270 USD" : zh ? "最高 $270 USD" : "Tối đa $270 USD", "—"],
                    ["🇸🇦 Saudi Arabia", en ? "Max $260 USD" : zh ? "最高 $260 USD" : "Tối đa $260 USD", en ? "Min $5. VAT 15%. Processing fee HKD 38/ticket." : zh ? "最低$5。VAT 15%。处理费HKD 38/票。" : "Tối thiểu $5. VAT 15%. Phí xử lý HKD 38/vé."],
                    ["🇷🇴 Romania", "—", en ? "From 01/01/2026: 25 Lei (~€5) fee per commercial package from outside EU." : zh ? "自2026/01/01起：每件来自欧盟外的商业包裹收费25列伊（~€5）。" : "Từ 01/01/2026: phí 25 Lei (~€5) mỗi kiện thương mại từ ngoài EU."],
                    ["🇨🇱 Chile", en ? "Max $500 USD" : zh ? "最高 $500 USD" : "Tối đa $500 USD", en ? "From 25/10/2025: VAT 19%. Recipient tax ID required." : zh ? "自2025/10/25起：VAT 19%。需要收件人税号。" : "Từ 25/10/2025: VAT 19%. Yêu cầu mã số thuế người nhận."],
                ]} />
            </Sec>

            <Sec icon="📦" title={en ? "Shipping Requirements" : zh ? "货物要求" : "Yêu Cầu Hàng Hóa"}>
                <Danger>{en ? "Branded goods are NOT accepted — including trademarks, international anime/cartoon logos, sports club symbols."
                    : zh ? "品牌商品不被接受 — 包括商标、国际动漫标志、运动俱乐部标志。"
                        : "Hàng có thương hiệu KHÔNG được chấp nhận — bao gồm nhãn hiệu, logo hoạt hình/anime quốc tế, biểu tượng CLB thể thao."}</Danger>
                <SubTitle>{en ? "Battery regulations by country" : zh ? "各国电池规定" : "Quy định pin theo quốc gia"}</SubTitle>
                <PT headers={en ? ["Country", "Accepted", "Not Accepted"] : zh ? ["国家", "接受", "不接受"] : ["Quốc gia", "Được nhận", "Không được nhận"]} rows={[
                    [en ? "🇬🇧 UK" : zh ? "🇬🇧 英国" : "🇬🇧 Anh", en ? "Built-in battery (≤100Wh)" : zh ? "内置电池（≤100Wh）" : "Pin tích hợp (≤100Wh)", en ? "Loose/pure battery, liquids, powder, firearms" : zh ? "散装/纯电池、液体、粉末、枪支弹药" : "Pin rời/pin nguyên chất, chất lỏng, bột, súng đạn"],
                    [en ? "🇺🇸 USA" : zh ? "🇺🇸 美国" : "🇺🇸 Mỹ", en ? "Built-in + packed with battery" : zh ? "内置+随附电池" : "Pin tích hợp + pin kèm theo", en ? "Pure battery, food, cosmetics, FDA products, laser, helmets" : zh ? "纯电池、食品、化妆品、FDA产品、激光、头盔" : "Pin nguyên chất, thực phẩm, mỹ phẩm, sản phẩm FDA, laser, mũ bảo hiểm"],
                    ["EU (DE, FR, ES, NL, BE, IT, PL, AT, SE, DK)", en ? "Built-in battery" : zh ? "内置电池" : "Pin tích hợp", en ? "Loose/spare battery, standalone battery products, gel/paste" : zh ? "散装/备用电池、独立电池产品、凝胶/膏状物" : "Pin rời/dự phòng, sản phẩm pin độc lập, dạng gel/paste"],
                    ["🇨🇦 Canada", en ? "Built-in battery" : zh ? "内置电池" : "Pin tích hợp", en ? "Loose/pure battery, cosmetic cream, paint cream" : zh ? "散装/纯电池、化妆品膏、涂料膏" : "Pin rời/nguyên chất, kem mỹ phẩm, kem sơn"],
                    ["🇲🇽 Mexico", en ? "Regular goods, built-in battery" : zh ? "普通货物、内置电池" : "Hàng thường, pin tích hợp", en ? "Counterfeit, paste, pure battery, liquid, powder, wood products" : zh ? "仿冒品、膏状物、纯电池、液体、粉末、木制品" : "Hàng nhái, paste, pin nguyên chất, chất lỏng, bột, sản phẩm gỗ"],
                    ["SG / CL / CO", en ? "Built-in + packed with battery" : zh ? "内置+随附电池" : "Pin tích hợp + pin kèm theo", en ? "Pure battery, powder, liquid" : zh ? "纯电池、粉末、液体" : "Pin nguyên chất, bột, chất lỏng"],
                    [en ? "🇯🇵 Japan" : zh ? "🇯🇵 日本" : "🇯🇵 Nhật Bản", en ? "Built-in battery (≤100Wh)" : zh ? "内置电池（≤100Wh）" : "Pin tích hợp (≤100Wh)", en ? "Pure battery, leather, wool, used goods, infant toys, asbestos products" : zh ? "纯电池、皮革、羊毛、二手货、婴儿玩具、含石棉产品" : "Pin nguyên chất, da, len, hàng cũ, đồ chơi trẻ sơ sinh, sản phẩm chứa amiăng"],
                    ["🇸🇦 Saudi / 🇦🇪 UAE", en ? "Built-in battery only" : zh ? "仅内置电池" : "Chỉ pin tích hợp", en ? "Packed battery, high-power devices, magnetic, liquid, powder" : zh ? "随附电池、大功率设备、磁性、液体、粉末" : "Pin kèm theo, thiết bị công suất cao, từ tính, chất lỏng, bột"],
                ]} />
            </Sec>

            <Sec icon="📏" title={en ? "Weight & Size Limits" : zh ? "重量与尺寸限制" : "Giới Hạn Cân Nặng & Kích Thước"}>
                <SubTitle>{en ? "Weight limits by country" : zh ? "各国重量限制" : "Giới hạn cân nặng theo quốc gia"}</SubTitle>
                <PT headers={en ? ["Limit", "Countries"] : zh ? ["限额", "国家"] : ["Giới hạn", "Quốc gia"]} rows={[
                    ["0–5 kg", "NO, IT, CL, BZ, CH"],
                    ["0–10 kg", "AU, NZ, SG, CA, MX, BZ, JP, HK"],
                    ["0–15 kg", "UK, DE, FR, ES, NL, BE, SE, PO, AT, DK, FI, IE, BG, CZ, EE, GR, HR, HU, LT, LV, PT, RO, SK, MT, SI, IL, LU, CY"],
                    ["0–20 kg", "UAE, SA"],
                    ["0–30 kg", "US"],
                ]} />
                <SubTitle>{en ? "Size limits" : zh ? "尺寸限制" : "Giới hạn kích thước"}</SubTitle>
                <PT headers={en ? ["Country", "Max Size"] : zh ? ["国家", "最大尺寸"] : ["Quốc gia", "Kích thước tối đa"]} rows={[
                    [en ? "🇺🇸 USA" : zh ? "🇺🇸 美国" : "🇺🇸 Mỹ", en ? "Min 10×15cm; Max 55×40×35cm" : zh ? "最小 10×15cm；最大 55×40×35cm" : "Tối thiểu 10×15cm; Tối đa 55×40×35cm"],
                    [en ? "🇨🇭 Switzerland" : zh ? "🇨🇭 瑞士" : "🇨🇭 Thụy Sĩ", "60×40×35cm"],
                    ["🇸🇬 Singapore", en ? "Max 60×40×35cm; L+W+H < 60cm; no side > 150cm" : zh ? "最大 60×40×35cm；长+宽+高 < 60cm；单边不超过150cm" : "Tối đa 60×40×35cm; D+R+C < 60cm; không cạnh nào > 150cm"],
                    ["🇨🇱 Chile", en ? "L+W+H ≤ 200cm; longest side 60cm" : zh ? "长+宽+高 ≤ 200cm；最长边60cm" : "D+R+C ≤ 200cm; cạnh dài nhất 60cm"],
                    ["🇳🇿 New Zealand", "60×50×40cm"],
                    ["🇲🇽 Mexico", en ? "L+W+H ≤ 160cm; one side < 60cm" : zh ? "长+宽+高 ≤ 160cm；单边 < 60cm" : "D+R+C ≤ 160cm; một cạnh < 60cm"],
                    [en ? "🇯🇵 Japan / 🇦🇺 Australia" : zh ? "🇯🇵 日本 / 🇦🇺 澳大利亚" : "🇯🇵 Nhật / 🇦🇺 Úc", "59×49×39cm"],
                    [en ? "🇳🇴 Norway" : zh ? "🇳🇴 挪威" : "🇳🇴 Na Uy", en ? "Longest side ≤ 45cm; L+W+H ≤ 90cm" : zh ? "最长边 ≤ 45cm；长+宽+高 ≤ 90cm" : "Cạnh dài nhất ≤ 45cm; D+R+C ≤ 90cm"],
                    ["🇸🇦 Saudi / 🇦🇪 UAE", en ? "60×50×40cm; one side ≤ 60cm" : zh ? "60×50×40cm；单边 ≤ 60cm" : "60×50×40cm; một cạnh ≤ 60cm"],
                    ["🇨🇦 Canada", en ? "Longest side ≤ 100cm; 2nd side ≤ 76cm; L+2(W+H) ≤ 250cm" : zh ? "最长边 ≤ 100cm；第二边 ≤ 76cm；长+2(宽+高) ≤ 250cm" : "Cạnh dài nhất ≤ 100cm; cạnh thứ 2 ≤ 76cm; D+2(R+C) ≤ 250cm"],
                    [en ? "Others" : zh ? "其他" : "Khác", "60×40×35cm"],
                ]} />
                <Warn>{en ? "Oversized/irregular packages: surcharge HKD 208/ticket."
                    : zh ? "超大/异形包裹：附加费HKD 208/票。"
                        : "Kiện hàng quá khổ/hình dạng đặc biệt: phụ phí HKD 208/vé."}</Warn>
            </Sec>

            <Sec icon="📍" title={en ? "Delivery Address" : zh ? "配送地址" : "Địa Chỉ Giao Hàng"}>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{en ? "All countries: No Amazon warehouse or military addresses."
                        : zh ? "所有国家：不接受Amazon仓库和军事地址。"
                            : "Tất cả quốc gia: Không nhận địa chỉ kho Amazon và địa chỉ quân sự."}</li>
                    <li><strong>{en ? "Poland — Packstation:" : zh ? "波兰 — Packstation：" : "Ba Lan — Packstation:"}</strong> {en ? "Warsaw, Wroclaw, Poznan, Krakow only. Max 60×35×40cm, 25kg."
                        : zh ? "仅限华沙、弗罗茨瓦夫、波兹南、克拉科夫。最大60×35×40cm，25kg。"
                            : "Chỉ Warsaw, Wroclaw, Poznan, Krakow. Tối đa 60×35×40cm, 25kg."}</li>
                    <li><strong>{en ? "Portugal / Greece:" : zh ? "葡萄牙/希腊：" : "Bồ Đào Nha / Hy Lạp:"}</strong> {en ? "No PO Box addresses." : zh ? "不接受邮政信箱地址。" : "Không nhận địa chỉ PO Box."}</li>
                    <li><strong>🇯🇵 {en ? "Japan:" : zh ? "日本：" : "Nhật Bản:"}</strong> {en ? "No APO/FPO or Amazon. Remote surcharge: +HKD 105/package (Okinawa, Hokkaido, remote islands)."
                        : zh ? "不接受APO/FPO或Amazon。偏远地区附加费：+HKD 105/件（冲绳、北海道、偏远岛屿）。"
                            : "Không APO/FPO hoặc Amazon. Phụ phí vùng xa: +HKD 105/kiện (Okinawa, Hokkaido, đảo xa)."}</li>
                    <li><strong>🇺🇸 {en ? "USA:" : zh ? "美国：" : "Mỹ:"}</strong> {en ? "Remote surcharge per price table." : zh ? "偏远地区附加费按价格表。" : "Phụ phí vùng xa theo bảng giá."}</li>
                    <li><strong>🇨🇭 {en ? "Switzerland:" : zh ? "瑞士：" : "Thụy Sĩ:"}</strong> {en ? "Cannot deliver: MyPost24, MyPOST, Pickpost, Poststrasse, Postfach, PO BOX."
                        : zh ? "无法配送：MyPost24、MyPOST、Pickpost、Poststrasse、Postfach、PO BOX。"
                            : "Không giao được: MyPost24, MyPOST, Pickpost, Poststrasse, Postfach, PO BOX."}</li>
                    <li><strong>🇳🇴 {en ? "Norway:" : zh ? "挪威：" : "Na Uy:"}</strong> {en ? "PO Box addresses: no delivery confirmation signature."
                        : zh ? "邮政信箱地址：无签收确认。"
                            : "Địa chỉ PO Box: không có ký xác nhận giao hàng."}</li>
                    <li><strong>SE, DK, FI, LT, LV, EE:</strong> {en ? "Some last-mile routes only support self-pickup."
                        : zh ? "部分最后一公里路线仅支持自提。"
                            : "Một số chặng cuối chỉ hỗ trợ tự lấy hàng."}</li>
                    <li>{en ? "Remote surcharges: UK +44,400₫ | HR +219,600₫ | SE +360,000₫ | GB +44,400₫."
                        : zh ? "偏远地区附加费：UK +44,400₫ | HR +219,600₫ | SE +360,000₫ | GB +44,400₫。"
                            : "Phụ phí vùng xa: UK +44.400₫ | HR +219.600₫ | SE +360.000₫ | GB +44.400₫."}</li>
                </ul>
            </Sec>

            <Sec icon="↩" title={en ? "Returns & Redelivery" : zh ? "退货与重新投递" : "Trả Hàng & Giao Lại"}>
                <Danger>{en ? "This route does NOT return packages from abroad to Vietnam."
                    : zh ? "此路线不支持从国外退回越南。"
                        : "Tuyến này KHÔNG trả kiện hàng về Việt Nam từ nước ngoài."}</Danger>
                <Warn>{en ? "Malta, Cyprus, Slovenia, Croatia, Romania, Bulgaria, Chile: No redelivery. Failed delivery = abandoned."
                    : zh ? "马耳他、塞浦路斯、斯洛文尼亚、克罗地亚、罗马尼亚、保加利亚、智利：不支持重新投递。投递失败 = 弃件。"
                        : "Malta, Cyprus, Slovenia, Croatia, Romania, Bulgaria, Chile: Không hỗ trợ giao lại. Giao thất bại = bỏ hàng."}</Warn>
                <SubTitle>{en ? "Redelivery fees & deadlines" : zh ? "重新投递费用与期限" : "Phí giao lại & thời hạn"}</SubTitle>
                <PT headers={en ? ["Country", "Deadline", "Fee"] : zh ? ["国家", "期限", "费用"] : ["Quốc gia", "Thời hạn", "Phí"]} rows={[
                    ["🇨🇦 Canada", en ? "20 days" : zh ? "20天" : "20 ngày", en ? "355,697₫ (1st kg) + 56,342₫/kg after" : zh ? "355,697₫（首kg）+ 56,342₫/kg之后" : "355.697₫ (kg đầu) + 56.342₫/kg sau"],
                    ["🇲🇽 Mexico", en ? "15 days" : zh ? "15天" : "15 ngày", "108,252₫/" + (en ? "package" : zh ? "件" : "kiện")],
                    [en ? "🇨🇭 Switzerland" : zh ? "🇨🇭 瑞士" : "🇨🇭 Thụy Sĩ", "—", "216,820₫/" + (en ? "package (one time only)" : zh ? "件（仅一次）" : "kiện (1 lần duy nhất)")],
                    [en ? "🇫🇷 France" : zh ? "🇫🇷 法国" : "🇫🇷 Pháp", "—", "216,820₫/" + (en ? "package" : zh ? "件" : "kiện")],
                    [en ? "🇳🇴 Norway" : zh ? "🇳🇴 挪威" : "🇳🇴 Na Uy", en ? "14 days" : zh ? "14天" : "14 ngày", "216,820₫/" + (en ? "package" : zh ? "件" : "kiện")],
                    [en ? "🇦🇺 Australia" : zh ? "🇦🇺 澳大利亚" : "🇦🇺 Úc", en ? "14 days" : zh ? "14天" : "14 ngày", "216,820₫/" + (en ? "package" : zh ? "件" : "kiện")],
                    ["🇸🇦 Saudi Arabia", en ? "15 days" : zh ? "15天" : "15 ngày", en ? "0–5kg: 268,729₫; >5kg: +32,286₫/kg" : zh ? "0-5kg: 268,729₫; >5kg: +32,286₫/kg" : "0–5kg: 268.729₫; >5kg: +32.286₫/kg"],
                    ["🇦🇪 UAE", en ? "15 days" : zh ? "15天" : "15 ngày", en ? "0–5kg: 126,610₫; >5kg: +32,286₫/kg" : zh ? "0-5kg: 126,610₫; >5kg: +32,286₫/kg" : "0–5kg: 126.610₫; >5kg: +32.286₫/kg"],
                    [en ? "🇯🇵 Japan" : zh ? "🇯🇵 日本" : "🇯🇵 Nhật Bản", en ? "14 days" : zh ? "14天" : "14 ngày", "173,455₫/" + (en ? "package" : zh ? "件" : "kiện")],
                    [en ? "🇬🇧 UK" : zh ? "🇬🇧 英国" : "🇬🇧 Anh", en ? "14 days" : zh ? "14天" : "14 ngày", "173,455₫/" + (en ? "package" : zh ? "件" : "kiện")],
                    ["SG / Brazil", en ? "14 days" : zh ? "14天" : "14 ngày", "260,183₫/" + (en ? "package" : zh ? "件" : "kiện")],
                    ["🇭🇰 Hong Kong", en ? "14 days" : zh ? "14天" : "14 ngày", en ? "3 free redeliveries (same address)" : zh ? "3次免费重新投递（同一地址）" : "3 lần giao lại miễn phí (cùng địa chỉ)"],
                    [en ? "Other countries" : zh ? "其他国家" : "Quốc gia khác", en ? "14 days" : zh ? "14天" : "14 ngày", "237,394₫/" + (en ? "package" : zh ? "件" : "kiện")],
                ]} />
                <Note>{en ? "If deadline passes without response → package will be destroyed by default."
                    : zh ? "如超过期限无回复 → 包裹将默认被销毁。"
                        : "Hết thời hạn mà không phản hồi → kiện hàng sẽ bị tiêu hủy mặc định."}</Note>
            </Sec>

            <Sec icon="🛡" title={en ? "Compensation Standards" : zh ? "赔偿标准" : "Tiêu Chuẩn Bồi Thường"}>
                <SubTitle>{en ? "Claim deadlines" : zh ? "索赔期限" : "Thời hạn khiếu nại"}</SubTitle>
                <PT headers={en ? ["Stage", "Deadline"] : zh ? ["阶段", "期限"] : ["Giai đoạn", "Thời hạn"]} rows={[
                    [en ? "Not yet at warehouse" : zh ? "尚未到达仓库" : "Chưa đến kho", en ? "30 days from pickup" : zh ? "自取件起30天" : "30 ngày từ ngày lấy hàng"],
                    [en ? "At warehouse" : zh ? "在仓库" : "Tại kho", en ? "60 days from warehouse entry" : zh ? "自入库起60天" : "60 ngày từ ngày nhập kho"],
                    [en ? "Shipped out" : zh ? "已出库" : "Đã xuất kho", en ? "60 days from warehouse entry" : zh ? "自入库起60天" : "60 ngày từ ngày nhập kho"],
                ]} />
                <SubTitle>{en ? "Key rules" : zh ? "主要规定" : "Quy định chính"}</SubTitle>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{en ? <>Max compensation: <strong>$30 USD/package</strong>.</>
                        : zh ? <>最高赔偿：<strong>$30 USD/件</strong>。</>
                            : <>Bồi thường tối đa: <strong>30 USD/kiện</strong>.</>}</li>
                    <li>{en ? "Investigation must be completed before compensation."
                        : zh ? "赔偿前必须完成调查。"
                            : "Phải hoàn tất điều tra trước khi bồi thường."}</li>
                    <li>{en ? "Required documents: (A) refund screenshot from platform, or (B) proof of re-shipment + transaction photo."
                        : zh ? "所需文件：(A) 平台退款截图，或 (B) 重新发货证明 + 交易截图。"
                            : "Hồ sơ cần thiết: (A) ảnh chụp hoàn tiền trên sàn, hoặc (B) bằng chứng đơn gửi lại + ảnh giao dịch."}</li>
                </ul>
                <SubTitle>{en ? "No compensation" : zh ? "不予赔偿" : "Không bồi thường"}</SubTitle>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{en ? "Seller's fault: damage, wrong shipment, poor quality, duplicate, inadequate packing."
                        : zh ? "卖家责任：损坏、发错货、质量差、重复、包装不当。"
                            : "Lỗi của người bán: hư hỏng, giao sai, chất lượng kém, đơn trùng, đóng gói không đạt."}</li>
                    <li>{en ? "Failed delivery due to wrong address, refusal, absent, uncollected."
                        : zh ? "因地址错误、拒收、无人在家、未取件导致的投递失败。"
                            : "Giao thất bại do sai địa chỉ, từ chối nhận, vắng nhà, không đến lấy."}</li>
                    <li>{en ? "Damage during transit (from warehouse to delivery)."
                        : zh ? "运输途中损坏（从仓库到配送点）。"
                            : "Hư hỏng trong quá trình vận chuyển (từ kho đến nơi giao)."}</li>
                    <li>{en ? "Delays — THG does not guarantee delivery times."
                        : zh ? "延误 — THG不保证配送时间。"
                            : "Chậm trễ — THG không cam kết thời gian giao hàng."}</li>
                    <li>{en ? "Customs seizure due to IP violation, prohibited goods, or incomplete declaration."
                        : zh ? "因知识产权侵权、违禁品或申报不完整被海关扣押。"
                            : "Hải quan tịch thu do vi phạm bản quyền, hàng cấm, hoặc khai báo thiếu."}</li>
                    <li>{en ? "Force majeure (war, natural disaster, pandemic, government action...)."
                        : zh ? "不可抗力（战争、自然灾害、疫情、政府行为...）。"
                            : "Bất khả kháng (chiến tranh, thiên tai, đại dịch, hành động chính phủ...)."}</li>
                    <li>{en ? "Fragile items (ceramic, glass, special plastic) — ship at own risk."
                        : zh ? "易碎物品（陶瓷、玻璃、特殊塑料）— 自行承担风险。"
                            : "Hàng dễ vỡ (gốm, thủy tinh, nhựa đặc biệt) — gửi tự chịu rủi ro."}</li>
                </ul>
                <Warn>{en ? "If THG is fined due to seller violation: customer bears HKD 1,160/package plus all incurred losses."
                    : zh ? "如因卖家违规导致THG被罚款：客户承担HKD 1,160/件及所有产生的损失。"
                        : "Nếu THG bị phạt do vi phạm của người bán: khách hàng chịu HKD 1.160/kiện cộng mọi tổn thất phát sinh."}</Warn>
            </Sec>

            <Sec icon="📋" title={en ? "Other Requirements" : zh ? "其他要求" : "Yêu Cầu Khác"}>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{en ? "Provide selling link and HS customs code for customs clearance."
                        : zh ? "提供销售链接和HS海关编码以协助清关。"
                            : "Cung cấp link bán hàng và mã HS hải quan để hỗ trợ thông quan."}</li>
                    <li>{en ? "Product name must be specific — do not use generic category names."
                        : zh ? "产品名称必须具体 — 不要使用通用类别名称。"
                            : "Tên sản phẩm phải cụ thể — không dùng tên danh mục chung."}</li>
                    <li>{en ? "Multiple packages to same recipient on same day: cumulative declared value must not exceed country limit."
                        : zh ? "同一天寄往同一收件人的多个包裹：累计申报价值不得超过国家限额。"
                            : "Nhiều kiện gửi cùng người nhận cùng ngày: giá trị khai báo lũy kế không được vượt giới hạn quốc gia."}</li>
                    <li>{en ? "Recipient name must not contain company words (GmbH, kft, SRL, Ltd)."
                        : zh ? "收件人姓名不得包含公司字样（GmbH、kft、SRL、Ltd）。"
                            : "Tên người nhận không được chứa các từ công ty (GmbH, kft, SRL, Ltd)."}</li>
                    <li><strong>Saudi Arabia:</strong> {en ? "Max 2 packages/day per recipient; max 3 SKU/package."
                        : zh ? "每位收件人每天最多2个包裹；每个包裹最多3个SKU。"
                            : "Tối đa 2 kiện/ngày mỗi người nhận; tối đa 3 SKU/kiện."}</li>
                    <li>{en ? "Fragile items: must add shock-absorbing material, bubble wrap, and fragile labels before shipping."
                        : zh ? "易碎物品：发货前必须添加减震材料、气泡膜和易碎标签。"
                            : "Hàng dễ vỡ: phải thêm vật liệu chống sốc, bọt khí, và nhãn dễ vỡ trước khi gửi."}</li>
                </ul>
                <SubTitle>{en ? "Tracking lookup" : zh ? "物流查询" : "Tra cứu vận đơn"}</SubTitle>
                <ul className="pl-4 list-disc"><li>yuntrack.com · 17track.net · aftership.com/couriers/yunexpress</li></ul>
            </Sec>
        </div>
    );
};

export default RouteVnRegular;
