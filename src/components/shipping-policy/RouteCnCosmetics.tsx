import { Sec, Warn, Note, Danger, SubTitle, PT, RouteBadge } from "./PolicyUI";

/** Route 2: CN → WW · Mỹ Phẩm */
const RouteCnCosmetics = () => (
    <div>
        <RouteBadge color="bg-[#e8eef8] text-[#1a4a8a]">Trung Quốc → Toàn Cầu · Mỹ Phẩm</RouteBadge>

        <Sec icon="%" title="VAT / IOSS">
            <ul className="pl-4 list-disc space-y-1">
                <li>Không thu VAT nếu cung cấp mã IOSS hợp lệ (từ 26/06/2021).</li>
                <li>Không có IOSS + dịch vụ ứng của THG: phí = thuế suất VAT nước đến + 2%.</li>
            </ul>
            <Danger>Kiện hàng ≥ 150 EUR / 155 USD KHÔNG được chấp nhận.</Danger>
        </Sec>

        <Sec icon="⚖" title="Trọng Lượng Tính Cước">
            <PT headers={["Quốc gia", "Công thức", "Cân nặng tối thiểu"]} rows={[
                ["UAE", "So sánh thực tế vs thể tích (÷6000) — tính cao hơn; nếu thể tích < 2× thực tế → tính thực tế", "100g"],
                ["🇳🇿 New Zealand", "So sánh thực tế vs thể tích (÷6000)", "—"],
                ["🇸🇬 Singapore / TH", "So sánh thực tế vs thể tích (÷5000)", "—"],
                ["🇯🇵 Nhật Bản", "So sánh thực tế vs thể tích (÷6000)", "100g"],
                ["🇨🇦 Canada", "So sánh thực tế vs thể tích (÷6000); nếu thể tích < 2× thực tế → tính thực tế", "100g"],
                ["🇨🇱 Chile", "Tính cao hơn giữa thực tế vs thể tích (÷6000); >2kg làm tròn theo 0.5kg", "100g"],
                ["Quốc gia khác", "So sánh thực tế vs thể tích (÷6000)", "US tối thiểu 100g"],
            ]} />
        </Sec>

        <Sec icon="🌍" title="Quốc Gia & Hạn Chế">
            <ul className="pl-4 list-disc space-y-1">
                <li>Không giao đến các đảo phụ thuộc.</li>
                <li><strong>🇺🇸 Mỹ:</strong> Bao gồm Alaska, Hawaii, Puerto Rico, Guam, APO/FPO. Phụ phí vùng xa: RMB 50/kiện.</li>
                <li><strong>🇵🇱 Ba Lan:</strong> Packstation chỉ tại Warsaw, Wroclaw, Poznan, Krakow.</li>
                <li><strong>Hy Lạp / UAE / PT / IL:</strong> Không nhận địa chỉ PO Box.</li>
                <li><strong>🇵🇹 Bồ Đào Nha:</strong> Không giao Azores hoặc Madeira. Không nhận mã bưu chính bắt đầu bằng "9".</li>
                <li><strong>🇮🇱 Israel:</strong> Gaza không phục vụ. Mặc định giao đến điểm lấy hàng.</li>
                <li><strong>🇦🇺 Úc:</strong> Phục vụ theo vùng (zone) theo mã bưu chính.</li>
                <li><strong>🇯🇵 Nhật Bản:</strong> Không nhận APO/FPO, Amazon, hoặc vùng xa.</li>
                <li><strong>🇸🇦 Saudi Arabia (từ 01/01/2026):</strong> Yêu cầu Địa chỉ Quốc gia (National Address).</li>
                <li>Tất cả quốc gia: Không nhận địa chỉ Amazon và địa chỉ quân sự.</li>
            </ul>
        </Sec>

        <Sec icon="$" title="Giá Trị Khai Báo">
            <PT headers={["Quốc gia", "Giới hạn", "Ghi chú"]} rows={[
                ["🇬🇧 Anh", "Tối đa GBP 135 / $155 / €150", "Khai báo theo giá bán thực tế."],
                ["🇺🇸 Mỹ", "Tối đa $60/kiện", "—"],
                ["🇪🇺 EU", "Tối đa €150 / $155", "—"],
                ["Nam Phi", "Tối đa $30 USD", "Yêu cầu CMND người nhận từ 06/09/2022."],
                ["🇨🇦 Canada", "Tối đa $99 USD", "DDP. Thuế 18% × giá trị khai báo trên CAD 20."],
                ["🇳🇴 Na Uy", "Tối đa 3000 NOK (~€250)", "Yêu cầu số VOEC."],
                ["🇦🇺 Úc", "Tối đa $600 USD", "Cùng tên+địa chỉ lũy kế tối đa $600/ngày."],
                ["🇲🇽 Mexico", "Tối đa $300 USD", "Bắt buộc mã số thuế người nhận. Thuế 33.5% từ 08/2025."],
                ["🇯🇵 Nhật Bản", "Tối đa $60 USD (¥10.000)", "Tối đa 10 món/kiện. Chỉ sử dụng cá nhân."],
                ["🇸🇬 Singapore", "Tối đa SGD 400 (~$290)", "GST 9% + phí giấy phép nếu vượt."],
                ["🇨🇭 Thụy Sĩ", "Tối đa 62 CHF/ngày", "VAT 8.1% nếu vượt."],
                ["🇦🇪 UAE", "Tối đa $270 USD", "DDP."],
                ["🇸🇦 Saudi Arabia", "Tối đa $260 USD", "VAT 15%. Tối thiểu $5."],
            ]} />
        </Sec>

        <Sec icon="💄" title="Yêu Cầu Hàng Hóa">
            <Warn>Tất cả hàng gửi EU trong phạm vi CE phải có dấu CE.</Warn>
            <p className="mb-2">Cùng danh sách mỹ phẩm được nhận như tuyến VN (lỏng, kem, bột — không chứa cồn). Tổng chất lỏng không cồn: tối đa 500ml (Chile: 100ml).</p>
            <SubTitle>Quy định sản phẩm theo quốc gia</SubTitle>
            <ul className="pl-4 list-disc space-y-1">
                <li><strong>🇦🇪 UAE:</strong> Bột nhuộm, phấn mắt, phấn phủ bột rời, chai thủy lực kim loại KHÔNG được nhận.</li>
                <li><strong>Thái Lan:</strong> Mỹ phẩm được nhận (chỉ hàng không gắn nhãn/không thương hiệu).</li>
                <li><strong>🇲🇽 Mexico:</strong> Chất lỏng tối đa 100ml; paste tối đa 150g. Không bột, xịt, chất lỏng chứa cồn.</li>
                <li><strong>Nam Phi:</strong> Không nhận bột rời. Chỉ nhận sản phẩm nén ép.</li>
                <li><strong>🇮🇪 Ireland:</strong> Mỹ phẩm thuộc quy định HPRA không được nhận.</li>
            </ul>
        </Sec>

        <Sec icon="📏" title="Giới Hạn Cân Nặng & Kích Thước">
            <PT headers={["Giới hạn cân nặng", "Quốc gia"]} rows={[
                ["0–2 kg", "SE, LU, DK"],
                ["0–5 kg", "Hầu hết quốc gia khác"],
                ["0–10 kg", "ZA, CL"],
                ["0–20 kg", "🇦🇺 Úc"],
                ["0–25 kg", "Thái Lan"],
                ["0–30 kg", "🇲🇽 Mexico, 🇺🇸 Mỹ, 🇨🇦 Canada"],
            ]} />
            <Warn>Kiện hàng hình dạng bất thường: phụ phí $25/kiện.</Warn>
        </Sec>

        <Sec icon="↩" title="Trả Hàng & Giao Lại">
            <Danger>Không trả hàng về Trung Quốc từ nước ngoài.</Danger>
            <Warn>SI, HR, BG, RO, KW, QA, BH, CY, MT: Không hỗ trợ giao lại ở nước ngoài.</Warn>
            <PT headers={["Quốc gia", "Thời hạn", "Phí"]} rows={[
                ["🇨🇦 Canada", "20 ngày", "$14 (kg đầu) + $2.5/kg"],
                ["🇳🇴 Na Uy", "14 ngày", "$14.5/kiện"],
                ["🇦🇺 Úc", "14 ngày", "Theo cân nặng (≤1kg: $5.49; ≤5kg: $8.40; ≤20kg: $13.20)"],
                ["🇸🇦 Saudi Arabia", "15 ngày", "0–5kg: $10.5; >5kg: +$1.5/kg"],
                ["🇦🇪 UAE", "15 ngày", "0–5kg: $4.8; >5kg: +$1.5/kg"],
                ["🇲🇽 Mexico", "5 ngày", "$5/kiện"],
                ["🇯🇵 Nhật Bản", "14 ngày", "$7/kiện"],
                ["🇬🇧 Anh", "14 ngày", "$7/kiện"],
                ["Quốc gia khác", "14 ngày", "$8/kiện"],
            ]} />
        </Sec>

        <Sec icon="🛡" title="Tiêu Chuẩn Bồi Thường">
            <Note>Khiếu nại phải được gửi trong vòng 60 ngày kể từ khi THG xuất hàng. Khiếu nại trễ không được chấp nhận.</Note>
            <ul className="pl-4 list-disc space-y-1">
                <li>Mỹ, Anh, Đức, Pháp: Bồi thường tối đa $20/kiện.</li>
                <li>Không bồi thường: lỗi người bán, giao thất bại, hư hỏng vận chuyển, chậm trễ, hải quan tịch thu, bất khả kháng, hàng dễ vỡ.</li>
                <li>Vi phạm từ người bán: $150/kiện + mọi tổn thất phát sinh.</li>
            </ul>
        </Sec>
    </div>
);

export default RouteCnCosmetics;
