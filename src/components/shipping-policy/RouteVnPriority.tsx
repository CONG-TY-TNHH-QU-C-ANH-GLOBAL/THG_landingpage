import { Sec, Warn, Note, Danger, SubTitle, PT, RouteBadge } from "./PolicyUI";
import { useI18n } from "@/lib/i18n";

/** Route 4: VN → US & DE · Priority */
const RouteVnPriority = () => {
    const { effectiveLanguage: lang } = useI18n();
    const en = lang === 'en', zh = lang === 'zh';
    const t3 = (e: string, z: string, v: string) => en ? e : zh ? z : v;

    return (
        <div>
            <RouteBadge color="bg-[#e8f4e8] text-[#2d7a2d]">{t3("Vietnam → USA & Germany · Priority", "越南 → 美国 & 德国 · Priority", "Việt Nam → Mỹ & Đức · Priority")}</RouteBadge>

            <Sec icon="%" title="VAT / IOSS">
                <ul className="pl-4 list-disc space-y-1">
                    <li>{t3("No VAT if valid IOSS code provided (from 26/06/2021).", "如提供有效IOSS代码则不收取VAT（自2021/06/26起）。", "Không thu VAT nếu cung cấp mã IOSS hợp lệ (từ 09:00 ngày 26/06/2021).")}</li>
                    <li>{t3("Issues from invalid IOSS: customer's responsibility.", "因无效IOSS产生的问题：客户自行承担。", "Các vấn đề do IOSS không hợp lệ: khách hàng tự chịu.")}</li>
                    <li>{t3("No IOSS + THG VAT advance: fee = destination VAT rate + 2%.", "无IOSS + THG代缴VAT：费用 = 目的地VAT税率 + 2%。", "Không có IOSS + dịch vụ ứng VAT của THG: phí = thuế suất VAT nước đến + 2%.")}</li>
                </ul>
                <Danger>{t3("🇩🇪 Germany: Packages ≥ €150 or $155 NOT accepted.", "🇩🇪 德国：≥150欧元或155美元的包裹不被接受。", "🇩🇪 Đức: Kiện hàng ≥ 150 EUR hoặc 155 USD KHÔNG được chấp nhận.")}</Danger>
            </Sec>

            <Sec icon="⚖" title={t3("Chargeable Weight", "计费重量", "Trọng Lượng Tính Cước")}>
                <p>{t3("Charged by whichever is higher — actual or volumetric.", "按较高者计费 — 实际或体积重量。", "Tính theo trọng lượng nào cao hơn — thực tế hoặc thể tích.")}</p>
                <Note>{t3("Volumetric: L × W × H (cm) ÷ 5000 = KG", "体积：长×宽×高 (cm) ÷ 5000 = KG", "Thể tích: D × R × C (cm) ÷ 5000 = KG")}</Note>
            </Sec>

            <Sec icon="🌍" title={t3("Countries & Restrictions", "国家与限制", "Quốc Gia & Hạn Chế")}>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{t3("No POD — contact sales for POD service.", "无POD — 联系销售添加。", "Không có POD — liên hệ sales để thêm dịch vụ POD.")}</li>
                    <li><strong>🇺🇸 {t3("USA:", "美国：", "Mỹ:")}</strong> {t3("Continental only. No Alaska, Hawaii, PR, Guam, APO/FPO.", "仅大陆。不含阿拉斯加、夏威夷、PR、关岛、APO/FPO。", "Chỉ lục địa. Không Alaska, Hawaii, Puerto Rico, Guam, APO/FPO.")}</li>
                    <li><strong>🇩🇪 {t3("Germany:", "德国：", "Đức:")}</strong> {t3("Entire territory, excluding offshore islands.", "全境，不含离岸岛屿。", "Toàn bộ lãnh thổ, trừ các đảo phụ thuộc.")}</li>
                </ul>
                <SubTitle>{t3("Order rules & Pre-alert", "下单规则与Pre-alert", "Quy tắc đặt hàng & Pre-alert")}</SubTitle>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{t3("Must fill actual weight. USPS tracking issued upon order.", "必须填写实际重量。下单时发放USPS追踪号。", "Phải điền cân nặng thực tế. Mã USPS được cấp ngay khi đặt hàng.")}</li>
                    <li>{en ? <>US orders auto-cancelled if not shipped within <strong>25 days</strong>.</> : zh ? <>美国订单如在<strong>25天</strong>内未发货将自动取消。</> : <>Đơn hàng Mỹ tự động hủy nếu không gửi hàng trong <strong>25 ngày</strong>.</>}</li>
                </ul>
            </Sec>

            <Sec icon="📋" title={t3("Orders & Delivery", "订单与配送", "Đặt Hàng & Giao Hàng")}>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{t3("Last-mile label generated upon order (10×15cm).", "下单时生成最后一公里标签（10×15cm）。", "Nhãn chặng cuối được tạo ngay khi đặt hàng (10×15cm).")}</li>
                    <li><strong>🇺🇸 {t3("USA:", "美国：", "Mỹ:")}</strong> USPS — 5–9 {t3("bsd", "工作日", "ngày LV")}.</li>
                    <li><strong>🇩🇪 {t3("Germany:", "德国：", "Đức:")}</strong> DHL — 7–9 {t3("bsd", "工作日", "ngày LV")}.</li>
                </ul>
                <Note>{t3("Delivery time excludes delays from: fees, held goods, oversized, wrong address...", "配送时间不包括：欠费、留货、超大、地址错误等延误...", "Thời gian giao chưa bao gồm chậm trễ do: nợ phí, khách giữ hàng, quá khổ/quá nặng, sai địa chỉ...")}</Note>
            </Sec>

            <Sec icon="$" title={t3("Declared Value", "申报价值", "Giá Trị Khai Báo")}>
                <PT headers={t3("Country", "国家", "Quốc gia") === "Country" ? ["Country", "Limit"] : zh ? ["国家", "限额"] : ["Quốc gia", "Giới hạn"]} rows={[
                    [t3("🇺🇸 USA", "🇺🇸 美国", "🇺🇸 Mỹ"), t3("Max $250 USD/pkg", "最高 $250 USD/件", "Tối đa $250 USD/kiện")],
                    [t3("🇩🇪 Germany", "🇩🇪 德国", "🇩🇪 Đức"), t3("NOT accepted if ≥ €150 / $155", "≥€150/$155不被接受", "KHÔNG chấp nhận nếu ≥ €150 / $155 USD")],
                ]} />
            </Sec>

            <Sec icon="📏" title={t3("Weight & Size Limits", "重量与尺寸限制", "Giới Hạn Cân Nặng & Kích Thước")}>
                <PT headers={en ? ["Country", "Weight", "Size", "Notes"] : zh ? ["国家", "重量", "尺寸", "备注"] : ["Quốc gia", "Cân nặng", "Kích thước", "Ghi chú"]} rows={[
                    [t3("🇺🇸 USA", "🇺🇸 美国", "🇺🇸 Mỹ"), "0–10 kg", t3("Min 10×15cm; Max 50×60×40cm", "最小10×15cm；最大50×60×40cm", "Tối thiểu 10×15cm; Tối đa 50×60×40cm"), "—"],
                    [t3("🇩🇪 Germany", "🇩🇪 德国", "🇩🇪 Đức"), "0–30 kg", t3("Min 10×15cm; Max 50×60×40cm", "最小10×15cm；最大50×60×40cm", "Tối thiểu 10×15cm; Tối đa 50×60×40cm"), "Packstation: max 60×30×30cm"],
                ]} />
                <Note>{t3("Each order = 1 package — do not combine.", "每单=1件 — 不得合并。", "Mỗi đơn hàng 1 kiện — không được gộp nhiều đơn lại.")}</Note>
            </Sec>

            <Sec icon="📦" title={t3("Shipping Requirements", "货物要求", "Yêu Cầu Hàng Hóa")}>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{t3("Built-in & packed battery OK (≤100Wh). No pure batteries, liquids, powder, firearms.", "接受内置和随附电池（≤100Wh）。不接受纯电池、液体、粉末、枪支。", "Nhận pin tích hợp và pin kèm theo (≤100Wh). Không nhận pin nguyên chất, chất lỏng, bột, súng đạn.")}</li>
                    <li>{t3("Branded/IP-infringing goods strictly prohibited.", "严禁品牌/侵权商品。", "Nghiêm cấm hàng thương hiệu và vi phạm sở hữu trí tuệ.")}</li>
                </ul>
                <Danger>{t3("NOT accepted: food, knives, liquids, powder, cosmetics, raw wood, hazmat, laser, helmets.", "不接受：食品、刀具、液体、粉末、化妆品、原木、危险品、激光、头盔。", "KHÔNG nhận: thực phẩm, dao kiểm soát, chất lỏng, bột, mỹ phẩm, sản phẩm gỗ thô, hàng nguy hiểm, laser, mũ bảo hiểm.")}</Danger>
                <Warn>{t3("🇺🇸 USA: FDA products, all cosmetics, adult products NOT accepted.", "🇺🇸 美国：FDA产品、化妆品、成人用品不被接受。", "🇺🇸 Mỹ: Sản phẩm FDA, mỹ phẩm, sản phẩm người lớn KHÔNG được nhận.")}</Warn>
            </Sec>

            <Sec icon="📍" title={t3("Delivery Address", "配送地址", "Địa Chỉ Giao Hàng")}>
                <Danger>{t3("No Amazon warehouse addresses.", "不接受Amazon仓库地址。", "Không nhận địa chỉ kho Amazon.")}</Danger>
            </Sec>

            <Sec icon="↩" title={t3("Returns & Redelivery", "退货与重新投递", "Trả Hàng & Giao Lại")}>
                <Danger>{t3("No return service from abroad to Vietnam.", "不提供从国外退回越南的服务。", "Không có dịch vụ trả hàng từ nước ngoài về Việt Nam.")}</Danger>
                <ul className="pl-4 list-disc space-y-1">
                    <li><strong>🇺🇸 & 🇩🇪:</strong> {en ? <>Redelivery within <strong>14 days</strong>.</> : zh ? <><strong>14天</strong>内重新投递。</> : <>Giao lại trong vòng <strong>14 ngày</strong>.</>}</li>
                    <li>{en ? <>Fee: <strong>237,394₫/order</strong>.</> : zh ? <>费用：<strong>237,394₫/单</strong>。</> : <>Phí: <strong>237.394₫/đơn</strong>.</>}</li>
                    <li>{t3("No response in 14 days → auto destroyed.", "14天无回复 → 自动销毁。", "Không phản hồi trong 14 ngày → tự động bị tiêu hủy.")}</li>
                </ul>
            </Sec>

            <Sec icon="🛡" title={t3("Compensation Standards", "赔偿标准", "Tiêu Chuẩn Bồi Thường")}>
                <PT headers={en ? ["Stage", "Deadline"] : zh ? ["阶段", "期限"] : ["Giai đoạn", "Thời hạn"]} rows={[
                    [t3("Not at warehouse", "尚未到仓库", "Chưa đến kho"), t3("30 days from pickup", "自取件起30天", "30 ngày từ ngày lấy hàng")],
                    [t3("At/shipped from warehouse", "在仓库/已出库", "Tại kho / Đã xuất kho"), t3("60 days from entry", "自入库起60天", "60 ngày từ ngày nhập kho")],
                ]} />
                <ul className="pl-4 list-disc space-y-1 mt-2">
                    <li>{en ? <>Max: <strong>$20/pkg</strong>.</> : zh ? <>最高：<strong>$20/件</strong>。</> : <>Tối đa: <strong>20 USD/kiện</strong>.</>}</li>
                    <li>{t3("No compensation: seller fault, failed delivery, transit damage, delay, customs, force majeure, fragile.", "不赔偿：卖家责任、投递失败、运输损坏、延误、海关、不可抗力、易碎。", "Không bồi thường: lỗi người bán, giao thất bại, hư hỏng vận chuyển, chậm trễ, hải quan tịch thu, bất khả kháng, hàng dễ vỡ.")}</li>
                </ul>
            </Sec>
        </div>
    );
};

export default RouteVnPriority;
