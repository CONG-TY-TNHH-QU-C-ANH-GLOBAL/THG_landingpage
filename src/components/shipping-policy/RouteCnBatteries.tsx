import { Sec, Warn, Note, Danger, SubTitle, PT, RouteBadge } from "./PolicyUI";

/** Route 3: CN → WW · Pin Điện */
const RouteCnBatteries = () => (
    <div>
        <RouteBadge color="bg-[#fff3e0] text-[#b45309]">Trung Quốc → Toàn Cầu · Pin Điện</RouteBadge>

        <Sec icon="%" title="VAT / IOSS">
            <ul className="pl-4 list-disc space-y-1">
                <li>Không thu VAT nếu cung cấp mã IOSS hợp lệ (từ 26/06/2021).</li>
                <li>Không có IOSS + dịch vụ ứng của THG: phí = thuế suất VAT nước đến + 2%.</li>
            </ul>
            <Danger>Kiện hàng ≥ 150 EUR / 155 USD KHÔNG được chấp nhận.</Danger>
        </Sec>

        <Sec icon="⚖" title="Trọng Lượng Tính Cước">
            <PT headers={["Nhóm quốc gia", "Công thức", "Tối thiểu"]} rows={[
                ["UAE, NZ, CA", "So sánh thực tế vs thể tích (÷6000); nếu thể tích <2× thực tế → tính thực tế", "100g"],
                ["SG, MY, TH, VN", "Tính cao hơn giữa thực tế vs thể tích (÷5000)", "—"],
                ["🇯🇵 Nhật Bản", "Tính cao hơn giữa thực tế vs thể tích (÷6000)", "500g"],
                ["KW, QA, BH, JO, LB, PK, NG, ZA", "Tính cao hơn giữa thực tế vs thể tích (÷6000)", "100g"],
                ["Brazil, AR, SV, CR, EC", "Tính cao hơn giữa thực tế vs thể tích (÷6000)", "100g"],
                ["PH, Indonesia", "Chỉ tính trọng lượng thực tế — không tính thể tích", "—"],
                ["CO, CL", "Tính cao hơn giữa thực tế vs thể tích (÷5000)", "100g"],
                ["Quốc gia khác", "Tính cao hơn giữa thực tế vs thể tích (÷6000)", "US tối thiểu 100g"],
            ]} />
        </Sec>

        <Sec icon="🌍" title="Quốc Gia & Hạn Chế">
            <ul className="pl-4 list-disc space-y-1">
                <li>Không giao đến các đảo phụ thuộc.</li>
                <li><strong>🇺🇸 Mỹ:</strong> Chỉ lục địa — không bao gồm Alaska, Hawaii, Puerto Rico, Guam, APO/FPO.</li>
                <li><strong>🇯🇵 Nhật Bản:</strong> Không nhận APO/FPO, Amazon, hoặc vùng xa.</li>
                <li><strong>🇮🇱 Israel:</strong> Chỉ tự lấy hàng (tối đa 5kg, 45×40×40cm). Không phục vụ Gaza.</li>
                <li><strong>🇬🇧 Anh:</strong> Lục địa + đảo nội địa.</li>
                <li><strong>🇸🇦 Saudi Arabia (từ 01/01/2026):</strong> Yêu cầu Địa chỉ Quốc gia.</li>
                <li>IL, UAE, SA, JO, LB, KW, BH, QA: Không nhận PO Box.</li>
                <li>Tất cả quốc gia: Không nhận địa chỉ Amazon và quân sự.</li>
            </ul>
        </Sec>

        <Sec icon="🔋" title="Yêu Cầu Hàng Hóa">
            <Warn>Tất cả hàng gửi EU trong phạm vi CE phải có dấu CE.</Warn>
            <Danger>Tất cả quốc gia: Nghiêm cấm hàng thương hiệu/vi phạm bản quyền. Nghiêm cấm pin nguyên chất, chất lỏng, bột, súng đạn.</Danger>
            <SubTitle>Quy định nhận pin theo quốc gia</SubTitle>
            <PT headers={["Quốc gia/Nhóm", "Được nhận", "KHÔNG được nhận"]} rows={[
                ["UK, IE, SE, LV, PT, RO, SI, SK", "Hàng thường + pin tích hợp", "Pin nguyên chất, pin rời/kèm theo"],
                ["Các nước EU khác", "Hàng thường + pin tích hợp + pin kèm theo (≤100Wh)", "Pin nguyên chất"],
                ["🇺🇸 Mỹ", "Pin tích hợp + pin kèm theo", "Pin nguyên chất, thực phẩm, mỹ phẩm, FDA, người lớn, laser, mũ bảo hiểm"],
                ["Nam Phi", "Pin tích hợp + pin kèm theo", "Pin nguyên chất, kem, mỹ phẩm, chất lỏng/bột"],
                ["🇨🇦 Canada", "Pin tích hợp", "Pin kèm theo/nguyên chất, kem mỹ phẩm"],
                ["🇲🇽 Mexico", "Hàng thường + pin tích hợp + kèm theo", "Hàng nhái, paste, pin nguyên chất, chất lỏng, bột"],
                ["SG / MY / TH / VN / PH / CL / CO", "Pin tích hợp + kèm theo", "Pin nguyên chất, bột, lỏng; MY/PH/VN/TH: cấm điện thoại"],
                ["🇯🇵 Nhật Bản", "Pin tích hợp + kèm theo (≤100Wh)", "Pin nguyên chất, da, len, hàng cũ, đồ chơi trẻ sơ sinh"],
                ["KW / QA / BH / JO / LB / SA / UAE", "Chỉ pin tích hợp", "Pin kèm theo, thiết bị công suất cao, từ tính, lỏng, bột"],
                ["Peru", "Pin tích hợp + kèm theo (≤100Wh)", "Pin nguyên chất, thực phẩm chức năng, mỹ phẩm, điện thoại"],
                ["Brazil", "Hàng thường + pin tích hợp (không lộ bên ngoài)", "Hàng nhái, paste, pin nguyên chất, chất lỏng, bột"],
                ["Indonesia", "Hàng thường", "Động/thực vật, thực phẩm, dược phẩm, pin, flycam, laser, máy chơi game"],
            ]} />
        </Sec>

        <Sec icon="📏" title="Giới Hạn Cân Nặng & Kích Thước">
            <PT headers={["Giới hạn cân nặng", "Quốc gia"]} rows={[
                ["0–2 kg", "IL, NO, CH, MA | TZ, RW, EG, AO, SN, MU, RE, MG, SC, ZM, AR, PK"],
                ["0–5 kg", "IL, NO, CH, MA"],
                ["0–10 kg", "PH, ZA, MX, UAE, SA, JP, LB, SV, CR, ID, CL"],
                ["0–20 kg", "UK, NL, BE, LU, AU, IE, SE, CO, KR, PE, BR"],
                ["0–25 kg", "TH, NZ"],
                ["0–30 kg", "🇺🇸 Mỹ, hầu hết quốc gia khác"],
            ]} />
            <Warn>Kiện hàng quá khổ: phụ phí $25/kiện.</Warn>
        </Sec>

        <Sec icon="↩" title="Trả Hàng & Giao Lại">
            <Danger>Không trả hàng về Trung Quốc từ nước ngoài.</Danger>
            <Warn>SI, HR, BG, RO, KW, QA, BH, CY, MT: Không hỗ trợ giao lại ở nước ngoài.</Warn>
            <PT headers={["Quốc gia", "Thời hạn", "Phí"]} rows={[
                ["🇨🇦 Canada", "20 ngày", "$14 (kg đầu) + $2.5/kg"],
                ["🇳🇴 Na Uy", "14 ngày", "$14.5/kiện"],
                ["🇸🇦 Saudi Arabia", "15 ngày", "0–5kg: $10.5; >5kg: +$1.5/kg"],
                ["🇦🇪 UAE", "15 ngày", "0–5kg: $4.8; >5kg: +$1.5/kg"],
                ["🇲🇽 Mexico", "5 ngày", "$5/kiện"],
                ["🇯🇵 Nhật Bản", "14 ngày", "$7/kiện"],
                ["🇬🇧 Anh", "14 ngày", "$7/kiện"],
                ["Quốc gia khác", "14 ngày", "$8/kiện"],
            ]} />
        </Sec>

        <Sec icon="🛡" title="Tiêu Chuẩn Bồi Thường">
            <Note>Khiếu nại phải được gửi trong vòng 60 ngày kể từ khi THG xuất hàng.</Note>
            <ul className="pl-4 list-disc space-y-1">
                <li>Mỹ, Anh, Đức, Pháp: Tối đa $20/kiện.</li>
                <li>Vi phạm từ người bán: $150/kiện + mọi tổn thất phát sinh.</li>
            </ul>
        </Sec>
    </div>
);

export default RouteCnBatteries;
