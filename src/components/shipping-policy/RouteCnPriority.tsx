import { Sec, Warn, Note, Danger, SubTitle, PT, RouteBadge } from "./PolicyUI";
import { useI18n } from "@/lib/i18n";

/** Route 5: CN → US/UK/DE/FR/ES · Priority */
const RouteCnPriority = () => {
    const { effectiveLanguage: lang } = useI18n();
    const en = lang === 'en', zh = lang === 'zh';
    const t3 = (e: string, z: string, v: string) => en ? e : zh ? z : v;

    return (
        <div>
            <RouteBadge color="bg-[#e8eef8] text-[#1a4a8a]">{t3("China → US / UK / DE / FR / ES · Priority", "中国 → 美/英/德/法/西 · Priority", "Trung Quốc → Mỹ / Anh / Đức / Pháp / Tây Ban Nha · Priority")}</RouteBadge>

            <Sec icon="%" title="VAT / IOSS">
                <ul className="pl-4 list-disc space-y-1">
                    <li>{t3("No VAT if valid IOSS code provided (from 26/06/2021).", "如提供有效IOSS代码则不收取VAT（自2021/06/26起）。", "Không thu VAT nếu cung cấp mã IOSS hợp lệ (từ 26/06/2021).")}</li>
                    <li>{t3("No IOSS + THG advance: fee = destination VAT rate + 2%.", "无IOSS + THG代缴：费用 = 目的地VAT税率 + 2%。", "Không có IOSS + dịch vụ ứng của THG: phí = thuế suất VAT nước đến + 2%.")}</li>
                </ul>
                <Danger>{t3("Packages ≥ €150 / $155 NOT accepted. Applies: DE, FR, ES, and other EU countries.", "≥150欧元/155美元的包裹不被接受。适用：德国、法国、西班牙及其他欧盟国家。", "Kiện hàng ≥ 150 EUR / 155 USD KHÔNG được chấp nhận. Áp dụng: Đức, Pháp, Tây Ban Nha, và các nước EU khác.")}</Danger>
            </Sec>

            <Sec icon="⚖" title={t3("Chargeable Weight", "计费重量", "Trọng Lượng Tính Cước")}>
                <p>{t3("Charged by whichever is higher — actual or volumetric.", "按较高者计费 — 实际或体积重量。", "Tính theo trọng lượng nào cao hơn — thực tế hoặc thể tích.")}</p>
                <Note>{t3("Volumetric: L × W × H (cm) ÷ 6000 = KG", "体积：长×宽×高 (cm) ÷ 6000 = KG", "Thể tích: D × R × C (cm) ÷ 6000 = KG")}</Note>
            </Sec>

            <Sec icon="🌍" title={t3("Countries & Restrictions", "国家与限制", "Quốc Gia & Hạn Chế")}>
                <PT headers={en ? ["Country", "Coverage", "Last-mile", "Time"] : zh ? ["国家", "覆盖范围", "最后一公里", "时间"] : ["Quốc gia", "Phạm vi phục vụ", "Chặng cuối", "Thời gian"]} rows={[
                    [t3("🇺🇸 USA", "🇺🇸 美国", "🇺🇸 Mỹ"), t3("Continental only. No AK, HI, PR, Guam, APO/FPO.", "仅大陆。不含AK、HI、PR、关岛、APO/FPO。", "Toàn bộ lục địa. Không Alaska, Hawaii, Puerto Rico, Guam, APO/FPO."), "USPS", t3("5–10 bsd", "5–10工作日", "5–10 ngày LV")],
                    [t3("🇬🇧 UK", "🇬🇧 英国", "🇬🇧 Anh"), t3("No remote or military addresses.", "不接受偏远或军事地址。", "Không nhận vùng xa hoặc địa chỉ quân sự."), "Evri", t3("5–7 bsd", "5–7工作日", "5–7 ngày LV")],
                    [t3("🇩🇪 Germany", "🇩🇪 德国", "🇩🇪 Đức"), t3("Nationwide, excluding offshore islands.", "全国，不含离岸岛屿。", "Toàn quốc, trừ các đảo xa bờ."), "DHL", t3("6–8 bsd", "6–8工作日", "6–8 ngày LV")],
                    [t3("🇫🇷 France", "🇫🇷 法国", "🇫🇷 Pháp"), t3("~95% postal codes.", "约95%邮编。", "~95% mã bưu chính."), "Colisprive", t3("5–10 bsd", "5–10工作日", "5–10 ngày LV")],
                    [t3("🇪🇸 Spain", "🇪🇸 西班牙", "🇪🇸 Tây Ban Nha"), t3("Postal codes 35, 38, 51, 52 (overseas islands) NOT served.", "邮编35、38、51、52（海外岛屿）不提供服务。", "Mã bưu chính 35, 38, 51, 52 (đảo hải ngoại) KHÔNG phục vụ."), "CTT", t3("5–10 bsd", "5–10工作日", "5–10 ngày LV")],
                ]} />
                <Note>{t3("Delivery time excludes delays from: fees, held goods, oversized, wrong address, refusal, force majeure.", "配送时间不包括：欠费、留货、超大、地址错误、拒收、不可抗力等延误。", "Thời gian giao chưa bao gồm chậm trễ do: nợ phí, giữ hàng, quá khổ, sai địa chỉ, từ chối, bất khả kháng.")}</Note>
                <SubTitle>{t3("US Pre-alert Rules", "美国Pre-alert规则", "Quy tắc Pre-alert Mỹ")}</SubTitle>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{t3("Must fill actual weight. USPS tracking issued upon order.", "必须填写实际重量。下单时发放USPS追踪号。", "Phải điền cân nặng thực tế. Mã USPS được cấp khi đặt hàng.")}</li>
                    <li>{t3("Registration fee deducted upfront; shipping charged at warehouse entry.", "注册费预扣；运费在入库时计算。", "Phí đăng ký trừ trước khi đặt; phí vận chuyển tính khi nhập kho.")}</li>
                    <li>{t3("Cancel within 5 days → 100% registration fee refund.", "5天内取消 → 100%退还注册费。", "Hủy trong 5 ngày → hoàn phí đăng ký 100%.")}</li>
                    <li>{t3("Not shipped in 25 days → auto-cancelled, registration fee forfeited.", "25天未发货 → 自动取消，注册费不退。", "Không gửi hàng trong 25 ngày → tự động hủy, mất phí đăng ký.")}</li>
                </ul>
                <Warn>{t3("Packages must be in woven bags wrapped with red tape for warehouse identification.", "包裹必须装在编织袋中用红色胶带缠绕以便仓库识别。", "Kiện hàng phải đựng trong bao dệt quấn băng đỏ để nhận diện tại kho.")}</Warn>
            </Sec>

            <Sec icon="$" title={t3("Declared Value", "申报价值", "Giá Trị Khai Báo")}>
                <PT headers={en ? ["Country", "Limit"] : zh ? ["国家", "限额"] : ["Quốc gia", "Giới hạn"]} rows={[
                    [t3("🇺🇸 USA", "🇺🇸 美国", "🇺🇸 Mỹ"), t3("Max $60 USD/pkg", "最高 $60 USD/件", "Tối đa $60 USD/kiện")],
                    [t3("🇬🇧 UK", "🇬🇧 英国", "🇬🇧 Anh"), t3("NOT accepted if ≥ GBP 135 / $155 / €150", "≥GBP 135/$155/€150不被接受", "KHÔNG chấp nhận nếu ≥ GBP 135 / $155 / €150")],
                    [t3("🇩🇪 DE / 🇫🇷 FR / 🇪🇸 ES", "🇩🇪 德 / 🇫🇷 法 / 🇪🇸 西", "🇩🇪 Đức / 🇫🇷 Pháp / 🇪🇸 Tây Ban Nha"), t3("NOT accepted if ≥ €150 / $155", "≥€150/$155不被接受", "KHÔNG chấp nhận nếu ≥ €150 / $155")],
                ]} />
            </Sec>

            <Sec icon="📏" title={t3("Weight & Size Limits", "重量与尺寸限制", "Giới Hạn Cân Nặng & Kích Thước")}>
                <PT headers={en ? ["Country", "Weight", "Max Size", "Notes"] : zh ? ["国家", "重量", "最大尺寸", "备注"] : ["Quốc gia", "Cân nặng", "Kích thước tối đa", "Ghi chú"]} rows={[
                    [t3("🇺🇸 USA", "🇺🇸 美国", "🇺🇸 Mỹ"), "0–30 kg", "55×40×35cm", t3("Oversize max 68×43×43cm (+$25.5)", "超大最大68×43×43cm（+$25.5）", "Quá khổ tối đa 68×43×43cm (+$25.5)")],
                    [t3("🇬🇧 UK", "🇬🇧 英国", "🇬🇧 Anh"), "0–5 kg", "60×40×35cm", t3("Oversize NOT accepted", "不接受超大件", "Kiện quá khổ KHÔNG nhận")],
                    [t3("🇩🇪 Germany", "🇩🇪 德国", "🇩🇪 Đức"), "0–10 kg", "60×40×35cm", "Packstation: max 60×30×30cm"],
                    [t3("🇫🇷 France", "🇫🇷 法国", "🇫🇷 Pháp"), "0–5 kg", "60×40×35cm", t3("Oversize NOT accepted", "不接受超大件", "Kiện quá khổ KHÔNG nhận")],
                    [t3("🇪🇸 Spain", "🇪🇸 西班牙", "🇪🇸 Tây Ban Nha"), "0–5 kg", "60×40×35cm", t3("Oversize NOT accepted", "不接受超大件", "Kiện quá khổ KHÔNG nhận")],
                ]} />
                <Warn>{t3("1 tracking number per package. No multi-package same tracking.", "每件1个追踪号。不接受多件同追踪号。", "Mỗi kiện 1 mã vận đơn. KHÔNG nhận nhiều kiện cùng mã.")}</Warn>
                <Note>{t3("All countries: min 10×15cm. Irregular shape: +$25.5/pkg.", "所有国家：最小10×15cm。异形：+$25.5/件。", "Tất cả quốc gia: tối thiểu 10×15cm. Hình dạng bất thường: +$25.5/kiện.")}</Note>
            </Sec>

            <Sec icon="📦" title={t3("Shipping Requirements", "货物要求", "Yêu Cầu Hàng Hóa")}>
                <Warn>{t3("All EU-bound goods within CE scope must have CE marking.", "所有发往欧盟的CE范围内商品必须有CE标志。", "Tất cả hàng gửi EU trong phạm vi CE phải có dấu CE.")}</Warn>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{t3("Built-in & packed battery OK (≤100Wh). No pure batteries, liquids, powder, firearms.", "接受内置和随附电池（≤100Wh）。不接受纯电池、液体、粉末、枪支。", "Nhận pin tích hợp và pin kèm theo (≤100Wh). Không nhận pin nguyên chất, chất lỏng, bột, súng đạn.")}</li>
                    <li>{t3("Branded/IP-infringing goods strictly prohibited.", "严禁品牌/侵权商品。", "Nghiêm cấm hàng thương hiệu / vi phạm sở hữu trí tuệ.")}</li>
                </ul>
                <Danger>{t3("NOT accepted: food, knives, liquids, powder, cosmetics, raw wood, hazmat, laser, helmets.", "不接受：食品、刀具、液体、粉末、化妆品、原木、危险品、激光、头盔。", "KHÔNG nhận: thực phẩm, dao, chất lỏng, bột, mỹ phẩm, sản phẩm gỗ thô, hàng nguy hiểm, laser, mũ bảo hiểm.")}</Danger>
                <Warn>{t3("🇺🇸 USA: FDA products, all cosmetics, adult products NOT accepted.", "🇺🇸 美国：FDA产品、化妆品、成人用品不被接受。", "🇺🇸 Mỹ: Sản phẩm FDA, tất cả mỹ phẩm, sản phẩm người lớn KHÔNG được nhận.")}</Warn>
            </Sec>

            <Sec icon="📍" title={t3("Delivery Address", "配送地址", "Địa Chỉ Giao Hàng")}>
                <Danger>{t3("No Amazon warehouse addresses in any country.", "所有国家不接受Amazon仓库地址。", "Không nhận địa chỉ kho Amazon tại tất cả quốc gia.")}</Danger>
            </Sec>

            <Sec icon="↩" title={t3("Returns & Redelivery", "退货与重新投递", "Trả Hàng & Giao Lại")}>
                <Danger>{t3("No return service from abroad to China.", "不提供从国外退回中国的服务。", "Không có dịch vụ trả hàng từ nước ngoài về Trung Quốc.")}</Danger>
                <PT headers={en ? ["Country", "Deadline", "Fee"] : zh ? ["国家", "期限", "费用"] : ["Quốc gia", "Thời hạn", "Phí"]} rows={[
                    [t3("🇺🇸/🇩🇪/🇫🇷/🇪🇸", "🇺🇸/🇩🇪/🇫🇷/🇪🇸", "🇺🇸 Mỹ / 🇩🇪 Đức / 🇫🇷 Pháp / 🇪🇸 Tây Ban Nha"), t3("14 days", "14天", "14 ngày"), t3("$10.5/pkg (FR via Colissimo)", "$10.5/件（法国通过Colissimo）", "$10.5/kiện (Pháp qua Colissimo)")],
                    [t3("🇬🇧 UK", "🇬🇧 英国", "🇬🇧 Anh"), t3("14 days", "14天", "14 ngày"), "$8.5/" + t3("pkg", "件", "kiện")],
                ]} />
                <Note>{t3("No response within deadline → auto destroyed.", "期限内无回复 → 自动销毁。", "Không phản hồi trong thời hạn → kiện hàng bị tiêu hủy mặc định.")}</Note>
            </Sec>

            <Sec icon="🛡" title={t3("Compensation Standards", "赔偿标准", "Tiêu Chuẩn Bồi Thường")}>
                <Note>{t3("Claims within 60 days from THG shipment.", "索赔须在THG发货后60天内提交。", "Khiếu nại phải được gửi trong vòng 60 ngày kể từ khi THG xuất hàng.")}</Note>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{en ? <>US, UK, DE, FR: Max <strong>$20/pkg</strong>.</> : zh ? <>美英德法：最高<strong>$20/件</strong>。</> : <>Mỹ, Anh, Đức, Pháp: Tối đa <strong>$20/kiện</strong>.</>}</li>
                    <li>{t3("Lost during THG transit (not scanned): no documentation needed.", "THG运输中丢失（未扫描）：无需文件。", "Mất trong quá trình vận chuyển THG (chưa được quét): không cần hồ sơ.")}</li>
                    <li>{t3("Carrier confirmed lost: refund screenshot or re-shipment proof needed.", "承运商确认丢失：需退款截图或重新发货证明。", "Đơn vị vận chuyển xác nhận mất: cần ảnh hoàn tiền trên sàn hoặc bằng chứng đơn gửi lại.")}</li>
                </ul>
                <SubTitle>{t3("No compensation", "不予赔偿", "Không bồi thường")}</SubTitle>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{t3("Seller fault, failed delivery, transit damage, delay, customs, IP violation, force majeure, fragile.", "卖家责任、投递失败、运输损坏、延误、海关、侵权、不可抗力、易碎。", "Lỗi người bán, giao thất bại, hư hỏng vận chuyển, chậm trễ, hải quan tịch thu, vi phạm bản quyền, bất khả kháng, hàng dễ vỡ.")}</li>
                    <li>{t3("Seller violation: $150/pkg + all losses.", "卖家违规：$150/件 + 所有损失。", "Vi phạm từ người bán: $150/kiện + mọi tổn thất phát sinh.")}</li>
                </ul>
                <SubTitle>{t3("Other Requirements", "其他要求", "Yêu cầu khác")}</SubTitle>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{t3("Provide product link and HS code for customs.", "提供产品链接和HS编码以便通关。", "Cung cấp link sản phẩm và mã HS để thông quan thuận lợi.")}</li>
                    <li>{t3("Multiple packages same recipient/day: cumulative value must not exceed country limit.", "同一天同一收件人多件：累计价值不得超过国家限额。", "Nhiều kiện cùng người nhận cùng ngày: giá trị lũy kế không vượt giới hạn quốc gia.")}</li>
                    <li>{t3("Recipient name must NOT contain GmbH, kft, SRL, Ltd.", "收件人姓名不得包含GmbH、kft、SRL、Ltd。", "Tên người nhận KHÔNG được chứa GmbH, kft, SRL, Ltd.")}</li>
                    <li>{t3("Seller must register valid VAT/GST code per legal requirements.", "卖家必须按法律要求注册有效的VAT/GST编号。", "Người bán phải đăng ký mã VAT/GST hợp lệ theo yêu cầu pháp luật.")}</li>
                </ul>
                <SubTitle>{t3("Tracking lookup", "物流查询", "Tra cứu vận đơn")}</SubTitle>
                <ul className="pl-4 list-disc"><li>yuntrack.com · 17track.net · aftership.com/couriers/yunexpress</li></ul>
            </Sec>
        </div>
    );
};

export default RouteCnPriority;
