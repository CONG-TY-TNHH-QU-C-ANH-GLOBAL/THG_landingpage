import { Sec, Warn, Note, Danger, SubTitle, PT, RouteBadge } from "./PolicyUI";
import { useI18n } from "@/lib/i18n";

/** Route 1: VN → WW · Cosmetics */
const RouteVnCosmetics = () => {
    const { effectiveLanguage: lang } = useI18n();
    const en = lang === 'en', zh = lang === 'zh';

    return (
        <div>
            <RouteBadge color="bg-[#fce8f3] text-[#8a1a5a]">{en ? "Vietnam → Worldwide · Cosmetics" : zh ? "越南 → 全球 · 化妆品" : "Việt Nam → Toàn Cầu · Mỹ Phẩm"}</RouteBadge>

            <Sec icon="%" title="VAT / IOSS">
                <ul className="pl-4 list-disc space-y-1">
                    <li>{en ? "No VAT collected if valid IOSS code provided (from 26/06/2021)." : zh ? "如提供有效IOSS代码则不收取VAT（自2021/06/26起）。" : "Không thu VAT nếu cung cấp mã IOSS hợp lệ (từ 26/06/2021)."}</li>
                    <li>{en ? "Issues from invalid IOSS (returns, seizure, fines): customer's responsibility." : zh ? "因无效IOSS产生的问题（退货、扣押、罚款）：客户自行承担。" : "Các vấn đề do IOSS không hợp lệ (trả hàng, bị giữ, phạt): khách hàng tự chịu."}</li>
                    <li>{en ? "No IOSS + using THG VAT advance service: fee = destination VAT rate + 2%." : zh ? "无IOSS + 使用THG代缴VAT服务：费用 = 目的地VAT税率 + 2%。" : "Không có IOSS + sử dụng dịch vụ ứng VAT của THG: phí = thuế suất VAT nước đến + 2%."}</li>
                </ul>
                <Danger>{en ? "Packages ≥ €150 or $155 NOT accepted." : zh ? "申报价值≥150欧元或155美元的包裹不被接受。" : "Kiện hàng ≥ 150 EUR hoặc 155 USD KHÔNG được chấp nhận."}</Danger>
            </Sec>

            <Sec icon="⚖" title={en ? "Chargeable Weight" : zh ? "计费重量" : "Trọng Lượng Tính Cước"}>
                <p>{en ? "Charged by whichever is higher — actual or volumetric weight. Volumetric: L × W × H (cm) ÷ 5000 = KG." : zh ? "按较高者计费 — 实际重量或体积重量。体积：长 × 宽 × 高 (cm) ÷ 5000 = KG。" : "Tính theo trọng lượng nào cao hơn — thực tế hoặc thể tích. Thể tích: D × R × C (cm) ÷ 5000 = KG."}</p>
                <Note>{en ? "USA: minimum chargeable weight 100g." : zh ? "美国：最低计费重量100g。" : "Mỹ: trọng lượng tính cước tối thiểu 100g."}</Note>
            </Sec>

            <Sec icon="💄" title={en ? "Shipping Requirements" : zh ? "货物要求" : "Yêu Cầu Hàng Hóa"}>
                <Warn>{en ? "Only liquid, powder and cream cosmetics accepted — plus dye powder, paint powder, mouthwash, ink. Alcohol-containing liquids STRICTLY PROHIBITED." : zh ? "仅接受液体、粉末和膏状化妆品 — 加上染料粉、涂料粉、漱口水、墨水。含酒精液体严格禁止。" : "Chỉ nhận mỹ phẩm dạng lỏng, bột và kem — cộng bột nhuộm, bột sơn, nước súc miệng, mực. Chất lỏng chứa cồn NGHIÊM CẤM."}</Warn>
                <SubTitle>{en ? "Accepted liquid cosmetics" : zh ? "可接受的液态化妆品" : "Mỹ phẩm dạng lỏng được nhận"}</SubTitle>
                <div className="flex flex-wrap gap-1.5 mb-2">{(en ? ["Gel nail polish", "Essential oil", "Toner (no alcohol)", "Lotion", "Face mask", "Eye mask", "Liquid eyeliner", "Makeup primer serum", "Makeup remover (no alcohol)"] : zh ? ["凝胶指甲油", "精油", "爽肤水（无酒精）", "乳液", "面膜", "眼膜", "液体眼线笔", "化妆底霜", "卸妆水（无酒精）"] : ["Sơn gel móng tay", "Tinh dầu", "Nước hoa hồng (không cồn)", "Lotion", "Mặt nạ", "Mặt nạ mắt", "Kẻ mắt dạng lỏng", "Serum lót trang điểm", "Tẩy trang (không cồn)"]).map(i => <span key={i} className="text-[12px] bg-[#f5f0e8] border border-[#d4c9b0] rounded px-2 py-0.5 text-[#4a3a1a]">{i}</span>)}</div>
                <SubTitle>{en ? "Accepted cream cosmetics" : zh ? "可接受的膏状化妆品" : "Mỹ phẩm dạng kem được nhận"}</SubTitle>
                <div className="flex flex-wrap gap-1.5 mb-2">{(en ? ["Face wash", "Sunscreen (lotion)", "Mascara", "Face/eye cream", "Concealer", "Aloe vera gel", "BB cream / Foundation", "Shampoo / Body wash", "Conditioner / Body lotion", "Hair mask", "Lip gloss / Liquid lipstick"] : zh ? ["洗面奶", "防晒霜（乳液）", "睫毛膏", "面/眼霜", "遮瑕膏", "芦荟凝胶", "BB霜/粉底液", "洗发水/沐浴露", "护发素/身体乳", "发膜", "唇彩/液体唇膏"] : ["Sữa rửa mặt", "Kem chống nắng (dạng lotion)", "Mascara", "Kem mặt/mắt", "Kem che khuyết điểm", "Gel lô hội", "BB cream / Kem nền", "Dầu gội / Sữa tắm", "Dầu xả / Lotion dưỡng thể", "Mặt nạ tóc", "Son bóng / Son kem"]).map(i => <span key={i} className="text-[12px] bg-[#f5f0e8] border border-[#d4c9b0] rounded px-2 py-0.5 text-[#4a3a1a]">{i}</span>)}</div>
                <SubTitle>{en ? "Accepted dry/powder cosmetics" : zh ? "可接受的干粉化妆品" : "Mỹ phẩm dạng khô/bột được nhận"}</SubTitle>
                <div className="flex flex-wrap gap-1.5 mb-2">{(en ? ["Lipstick / Lip balm", "Eyeliner pencil", "Eyebrow pencil/powder", "Eye shadow", "Setting powder/compact", "Highlighter", "Blush", "Soap"] : zh ? ["口红/润唇膏", "眼线笔", "眉笔/眉粉", "眼影", "定妆粉/粉饼", "高光", "腮红", "肥皂"] : ["Son môi / Son dưỡng", "Chì kẻ mắt", "Chì/bột kẻ lông mày", "Phấn mắt", "Phấn phủ bột/nén", "Phấn highlight", "Phấn má hồng", "Xà phòng"]).map(i => <span key={i} className="text-[12px] bg-[#f5f0e8] border border-[#d4c9b0] rounded px-2 py-0.5 text-[#4a3a1a]">{i}</span>)}</div>
                <ul className="pl-4 list-disc space-y-1 mt-2">
                    <li>{en ? <>Total non-alcohol liquid per package: <strong>max 500ml</strong>. Chile: max 100ml.</> : zh ? <>每件包裹非酒精液体总量：<strong>最多500ml</strong>。智利：最多100ml。</> : <>Tổng chất lỏng không cồn mỗi kiện: <strong>tối đa 500ml</strong>. Chile: tối đa 100ml.</>}</li>
                    <li>{en ? "All liquid, cream, fragile products must be packed in carton with lining/padding." : zh ? "所有液体、膏状、易碎产品必须用有衬里/填充的纸箱包装。" : "Tất cả sản phẩm lỏng, kem, dễ vỡ phải đóng trong thùng carton có lót/đệm."}</li>
                    <li>{en ? "Prohibited: battery products, pure batteries, weapons, IP-infringing goods." : zh ? "禁止：电池产品、纯电池、武器、侵权商品。" : "Nghiêm cấm: sản phẩm chứa pin, pin nguyên chất, vũ khí, hàng vi phạm bản quyền."}</li>
                    <li><strong>🇮🇪 {en ? "Ireland:" : zh ? "爱尔兰：" : "Ireland:"}</strong> {en ? "Cosmetics under HPRA regulation not accepted." : zh ? "受HPRA监管的化妆品不被接受。" : "Mỹ phẩm thuộc quy định HPRA không được nhận."}</li>
                </ul>
            </Sec>

            <Sec icon="📏" title={en ? "Weight & Size Limits" : zh ? "重量与尺寸限制" : "Giới Hạn Cân Nặng & Kích Thước"}>
                <PT headers={en ? ["Weight limit", "Countries"] : zh ? ["重量限制", "国家"] : ["Giới hạn cân nặng", "Quốc gia"]} rows={[
                    ["0–15 kg", "UK, FR, DE, IT, ES, NL, BE, IE, SE, AT"],
                    ["0–10 kg", en ? "🇨🇭 Switzerland" : zh ? "🇨🇭 瑞士" : "🇨🇭 Thụy Sĩ"],
                    ["0–30 kg", en ? "🇺🇸 USA (min chargeable weight 100g)" : zh ? "🇺🇸 美国（最低计费重量100g）" : "🇺🇸 Mỹ (cân nặng tính cước tối thiểu 100g)"],
                ]} />
                <SubTitle>{en ? "Size limits" : zh ? "尺寸限制" : "Giới hạn kích thước"}</SubTitle>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{en ? "Default all countries: max 60×50×40cm" : zh ? "所有国家默认：最大60×50×40cm" : "Mặc định tất cả quốc gia: tối đa 60×50×40cm"}</li>
                    <li>{en ? "US, BE, IE, NL: max 60×40×35cm" : zh ? "US, BE, IE, NL：最大60×40×35cm" : "US, BE, IE, NL: tối đa 60×40×35cm"}</li>
                </ul>
                <Warn>{en ? "Irregular-shaped packages: surcharge 636,000₫/package." : zh ? "异形包裹：附加费636,000₫/件。" : "Kiện hàng hình dạng đặc biệt: phụ phí 636.000₫/kiện."}</Warn>
            </Sec>

            <Sec icon="📍" title={en ? "Delivery Address" : zh ? "配送地址" : "Địa Chỉ Giao Hàng"}>
                <ul className="pl-4 list-disc space-y-1">
                    <li>{en ? "All countries: No Amazon or military addresses." : zh ? "所有国家：不接受Amazon或军事地址。" : "Tất cả quốc gia: Không nhận địa chỉ Amazon và địa chỉ quân sự."}</li>
                    <li><strong>🇺🇸 {en ? "USA:" : zh ? "美国：" : "Mỹ:"}</strong> {en ? "Remote surcharge per price table." : zh ? "偏远地区附加费按价格表。" : "Phụ phí vùng xa theo bảng giá."}</li>
                    <li><strong>🇸🇪 {en ? "Sweden:" : zh ? "瑞典：" : "Thụy Điển:"}</strong> {en ? "Remote surcharge +360,000₫/package." : zh ? "偏远地区附加费+360,000₫/件。" : "Phụ phí vùng xa +360.000₫/kiện."}</li>
                    <li><strong>🇬🇧 {en ? "UK:" : zh ? "英国：" : "Anh:"}</strong> {en ? "Remote surcharge +44,400₫/package. No military, overseas territories." : zh ? "偏远地区附加费+44,400₫/件。不接受军事地址、海外领地。" : "Phụ phí vùng xa +44.400₫/kiện. Không nhận quân sự, lãnh thổ hải ngoại."}</li>
                    <li><strong>🇨🇭 {en ? "Switzerland:" : zh ? "瑞士：" : "Thụy Sĩ:"}</strong> {en ? "Cannot deliver: MyPost24, MyPOST, Pickpost, Poststrasse, Postfach, PO BOX." : zh ? "无法配送：MyPost24、MyPOST、Pickpost、Poststrasse、Postfach、PO BOX。" : "Không giao: MyPost24, MyPOST, Pickpost, Poststrasse, Postfach, PO BOX."}</li>
                </ul>
            </Sec>

            <Sec icon="↩" title={en ? "Returns & Redelivery" : zh ? "退货与重新投递" : "Trả Hàng & Giao Lại"}>
                <Danger>{en ? "No returns from abroad to Vietnam." : zh ? "不支持从国外退回越南。" : "Không trả hàng về Việt Nam từ nước ngoài."}</Danger>
                <PT headers={en ? ["Country", "Deadline", "Fee"] : zh ? ["国家", "期限", "费用"] : ["Quốc gia", "Thời hạn", "Phí"]} rows={[
                    [en ? "🇨🇭 Switzerland" : zh ? "🇨🇭 瑞士" : "🇨🇭 Thụy Sĩ", "—", "216,820₫/" + (en ? "pkg (once only)" : zh ? "件（仅一次）" : "kiện (1 lần duy nhất)")],
                    [en ? "🇫🇷 France" : zh ? "🇫🇷 法国" : "🇫🇷 Pháp", "—", "216,820₫/" + (en ? "pkg" : zh ? "件" : "kiện")],
                    [en ? "🇬🇧 UK" : zh ? "🇬🇧 英国" : "🇬🇧 Anh", en ? "14 days" : zh ? "14天" : "14 ngày", "173,455₫/" + (en ? "pkg" : zh ? "件" : "kiện")],
                ]} />
                <Note>{en ? "Packages without response within deadline will be destroyed by default." : zh ? "在期限内无回复的包裹将默认被销毁。" : "Kiện hàng không có phản hồi trong thời hạn sẽ bị tiêu hủy mặc định."}</Note>
            </Sec>

            <Sec icon="🛡" title={en ? "Compensation Standards" : zh ? "赔偿标准" : "Tiêu Chuẩn Bồi Thường"}>
                <PT headers={en ? ["Stage", "Deadline"] : zh ? ["阶段", "期限"] : ["Giai đoạn", "Thời hạn"]} rows={[
                    [en ? "Not yet at warehouse" : zh ? "尚未到达仓库" : "Chưa đến kho", en ? "30 days from pickup" : zh ? "自取件起30天" : "30 ngày từ ngày lấy hàng"],
                    [en ? "At/shipped from warehouse" : zh ? "在仓库/已出库" : "Tại/đã xuất kho", en ? "60 days from entry" : zh ? "自入库起60天" : "60 ngày từ ngày nhập kho"],
                ]} />
                <ul className="pl-4 list-disc space-y-1 mt-2">
                    <li>{en ? <>Max compensation: <strong>$30 USD/package</strong>. Investigation required.</> : zh ? <>最高赔偿：<strong>$30 USD/件</strong>。需要调查。</> : <>Bồi thường tối đa: <strong>30 USD/kiện</strong>. Yêu cầu điều tra.</>}</li>
                    <li>{en ? "No compensation: seller's fault, wrong address, refusal, transit damage, customs seizure, force majeure, fragile items." : zh ? "不予赔偿：卖家责任、地址错误、拒收、运输损坏、海关扣押、不可抗力、易碎物品。" : "Không bồi thường: lỗi người bán, sai địa chỉ, từ chối nhận, hư hỏng vận chuyển, hải quan tịch thu, bất khả kháng, hàng dễ vỡ."}</li>
                </ul>
                <Warn>{en ? "Seller violation: customer bears HKD 1,160/package + all incurred losses." : zh ? "卖家违规：客户承担HKD 1,160/件 + 所有产生的损失。" : "Vi phạm từ người bán: khách hàng chịu HKD 1.160/kiện + mọi tổn thất phát sinh."}</Warn>
            </Sec>
        </div>
    );
};

export default RouteVnCosmetics;
