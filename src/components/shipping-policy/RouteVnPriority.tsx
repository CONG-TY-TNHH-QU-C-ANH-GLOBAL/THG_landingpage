import { Sec, Warn, Note, Danger, SubTitle, PT, RouteBadge } from "./PolicyUI";

/** Route 4: VN → US & Đức · Priority */
const RouteVnPriority = () => (
    <div>
        <RouteBadge color="bg-[#e8f4e8] text-[#2d7a2d]">Việt Nam → Mỹ & Đức · Priority</RouteBadge>

        <Sec icon="%" title="VAT / IOSS">
            <ul className="pl-4 list-disc space-y-1">
                <li>Không thu VAT nếu cung cấp mã IOSS hợp lệ (từ 09:00 ngày 26/06/2021).</li>
                <li>Các vấn đề do IOSS không hợp lệ: khách hàng tự chịu.</li>
                <li>Không có IOSS + dịch vụ ứng VAT của THG: phí = thuế suất VAT nước đến + 2%.</li>
            </ul>
            <Danger>🇩🇪 Đức: Kiện hàng ≥ 150 EUR hoặc 155 USD KHÔNG được chấp nhận.</Danger>
        </Sec>

        <Sec icon="⚖" title="Trọng Lượng Tính Cước">
            <p>Tính theo trọng lượng nào cao hơn — thực tế hoặc thể tích.</p>
            <Note>Công thức thể tích: D × R × C (cm) ÷ 5000 = KG</Note>
        </Sec>

        <Sec icon="🌍" title="Quốc Gia & Hạn Chế">
            <ul className="pl-4 list-disc space-y-1">
                <li>Không có bằng chứng giao hàng (POD) — liên hệ sales để thêm dịch vụ POD.</li>
                <li><strong>🇺🇸 Mỹ:</strong> Chỉ các tiểu bang lục địa. Không bao gồm Alaska, Hawaii, Puerto Rico, Guam, APO/FPO.</li>
                <li><strong>🇩🇪 Đức:</strong> Toàn bộ lãnh thổ, trừ các đảo phụ thuộc.</li>
            </ul>
            <SubTitle>Quy tắc đặt hàng & Pre-alert</SubTitle>
            <ul className="pl-4 list-disc space-y-1">
                <li>Phải điền cân nặng thực tế của kiện hàng. Mã theo dõi USPS được cấp ngay khi đặt hàng.</li>
                <li>Đơn hàng Mỹ tự động hủy nếu không gửi hàng trong <strong>25 ngày</strong> kể từ khi khai báo.</li>
            </ul>
        </Sec>

        <Sec icon="📋" title="Đặt Hàng & Giao Hàng">
            <ul className="pl-4 list-disc space-y-1">
                <li>Nhãn vận chuyển chặng cuối được tạo ngay khi đặt hàng THG (kích thước nhãn: 10×15cm).</li>
                <li><strong>🇺🇸 Mỹ chặng cuối:</strong> USPS — 5–9 ngày làm việc.</li>
                <li><strong>🇩🇪 Đức chặng cuối:</strong> DHL — 7–9 ngày làm việc.</li>
            </ul>
            <Note>Thời gian giao chưa bao gồm chậm trễ do: nợ phí, khách giữ hàng, quá khổ/quá nặng, sai địa chỉ...</Note>
        </Sec>

        <Sec icon="$" title="Giá Trị Khai Báo">
            <PT headers={["Quốc gia", "Giới hạn"]} rows={[
                ["🇺🇸 Mỹ", "Tối đa $250 USD/kiện"],
                ["🇩🇪 Đức", "KHÔNG chấp nhận nếu ≥ €150 / $155 USD"],
            ]} />
        </Sec>

        <Sec icon="📏" title="Giới Hạn Cân Nặng & Kích Thước">
            <PT headers={["Quốc gia", "Cân nặng", "Kích thước (chuẩn)", "Ghi chú"]} rows={[
                ["🇺🇸 Mỹ", "0–10 kg", "Tối thiểu 10×15cm; Tối đa 50×60×40cm", "—"],
                ["🇩🇪 Đức", "0–30 kg", "Tối thiểu 10×15cm; Tối đa 50×60×40cm", "Packstation: tối đa 60×30×30cm"],
            ]} />
            <Note>Mỗi đơn hàng 1 kiện — không được gộp nhiều đơn lại.</Note>
        </Sec>

        <Sec icon="📦" title="Yêu Cầu Hàng Hóa">
            <ul className="pl-4 list-disc space-y-1">
                <li>Nhận pin tích hợp và pin kèm theo (tối đa 100Wh). Không nhận pin nguyên chất, chất lỏng, bột, súng đạn.</li>
                <li>Nghiêm cấm hàng thương hiệu và vi phạm sở hữu trí tuệ.</li>
            </ul>
            <Danger>KHÔNG nhận: thực phẩm, dao kiểm soát, chất lỏng, bột, mỹ phẩm, sản phẩm gỗ thô, hàng nguy hiểm, laser, mũ bảo hiểm.</Danger>
            <Warn>🇺🇸 Mỹ: Sản phẩm FDA, tất cả mỹ phẩm, sản phẩm người lớn KHÔNG được nhận.</Warn>
        </Sec>

        <Sec icon="📍" title="Địa Chỉ Giao Hàng">
            <Danger>Không nhận địa chỉ kho Amazon.</Danger>
        </Sec>

        <Sec icon="↩" title="Trả Hàng & Giao Lại">
            <Danger>Không có dịch vụ trả hàng từ nước ngoài về Việt Nam.</Danger>
            <ul className="pl-4 list-disc space-y-1">
                <li><strong>🇺🇸 Mỹ & 🇩🇪 Đức:</strong> Giao lại trong vòng <strong>14 ngày</strong>.</li>
                <li>Phí giao lại: <strong>237.394₫/đơn</strong>.</li>
                <li>Không phản hồi trong 14 ngày → kiện hàng tự động bị tiêu hủy.</li>
            </ul>
        </Sec>

        <Sec icon="🛡" title="Tiêu Chuẩn Bồi Thường">
            <PT headers={["Giai đoạn", "Thời hạn khiếu nại"]} rows={[
                ["Chưa đến kho", "30 ngày từ ngày lấy hàng"],
                ["Tại kho / Đã xuất kho", "60 ngày từ ngày nhập kho"],
            ]} />
            <ul className="pl-4 list-disc space-y-1 mt-2">
                <li>Bồi thường tối đa: <strong>20 USD/kiện</strong>.</li>
                <li>Không bồi thường: lỗi người bán, giao thất bại, hư hỏng vận chuyển, chậm trễ, hải quan tịch thu, bất khả kháng, hàng dễ vỡ.</li>
            </ul>
        </Sec>
    </div>
);

export default RouteVnPriority;
