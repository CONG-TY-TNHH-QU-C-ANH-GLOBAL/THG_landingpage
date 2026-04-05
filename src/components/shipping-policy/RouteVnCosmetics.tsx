import { Sec, Warn, Note, Danger, SubTitle, PT, RouteBadge } from "./PolicyUI";

/** Route 1: VN → WW · Mỹ Phẩm */
const RouteVnCosmetics = () => (
    <div>
        <RouteBadge color="bg-[#fce8f3] text-[#8a1a5a]">Việt Nam → Toàn Cầu · Mỹ Phẩm</RouteBadge>

        <Sec icon="%" title="VAT / IOSS">
            <ul className="pl-4 list-disc space-y-1">
                <li>Không thu VAT nếu cung cấp mã IOSS hợp lệ (từ 26/06/2021).</li>
                <li>Các vấn đề do IOSS không hợp lệ (trả hàng, bị giữ, phạt): khách hàng tự chịu.</li>
                <li>Không có IOSS + sử dụng dịch vụ ứng VAT của THG: phí = thuế suất VAT nước đến + 2%.</li>
            </ul>
            <Danger>Kiện hàng ≥ 150 EUR hoặc 155 USD KHÔNG được chấp nhận.</Danger>
        </Sec>

        <Sec icon="⚖" title="Trọng Lượng Tính Cước">
            <p>Tính theo trọng lượng nào cao hơn — thực tế hoặc thể tích. Thể tích: D × R × C (cm) ÷ 5000 = KG.</p>
            <Note>Mỹ: trọng lượng tính cước tối thiểu 100g.</Note>
        </Sec>

        <Sec icon="💄" title="Yêu Cầu Hàng Hóa">
            <Warn>Chỉ nhận mỹ phẩm dạng lỏng, bột và kem — cộng bột nhuộm, bột sơn, nước súc miệng, mực. Chất lỏng chứa cồn NGHIÊM CẤM.</Warn>
            <SubTitle>Mỹ phẩm dạng lỏng được nhận</SubTitle>
            <div className="flex flex-wrap gap-1.5 mb-2">{["Sơn gel móng tay", "Tinh dầu", "Nước hoa hồng (không cồn)", "Lotion", "Mặt nạ", "Mặt nạ mắt", "Kẻ mắt dạng lỏng", "Serum lót trang điểm", "Tẩy trang (không cồn)"].map(i => <span key={i} className="text-[12px] bg-[#f5f0e8] border border-[#d4c9b0] rounded px-2 py-0.5 text-[#4a3a1a]">{i}</span>)}</div>
            <SubTitle>Mỹ phẩm dạng kem được nhận</SubTitle>
            <div className="flex flex-wrap gap-1.5 mb-2">{["Sữa rửa mặt", "Kem chống nắng (dạng lotion)", "Mascara", "Kem mặt/mắt", "Kem che khuyết điểm", "Gel lô hội", "BB cream / Kem nền", "Dầu gội / Sữa tắm", "Dầu xả / Lotion dưỡng thể", "Mặt nạ tóc", "Son bóng / Son kem"].map(i => <span key={i} className="text-[12px] bg-[#f5f0e8] border border-[#d4c9b0] rounded px-2 py-0.5 text-[#4a3a1a]">{i}</span>)}</div>
            <SubTitle>Mỹ phẩm dạng khô/bột được nhận</SubTitle>
            <div className="flex flex-wrap gap-1.5 mb-2">{["Son môi / Son dưỡng", "Chì kẻ mắt", "Chì/bột kẻ lông mày", "Phấn mắt", "Phấn phủ bột/nén", "Phấn highlight", "Phấn má hồng", "Xà phòng"].map(i => <span key={i} className="text-[12px] bg-[#f5f0e8] border border-[#d4c9b0] rounded px-2 py-0.5 text-[#4a3a1a]">{i}</span>)}</div>
            <ul className="pl-4 list-disc space-y-1 mt-2">
                <li>Tổng chất lỏng không cồn mỗi kiện: <strong>tối đa 500ml</strong>. Chile: tối đa 100ml.</li>
                <li>Tất cả sản phẩm lỏng, kem, dễ vỡ phải đóng trong thùng carton có lót/đệm.</li>
                <li>Nghiêm cấm: sản phẩm chứa pin, pin nguyên chất, vũ khí, hàng vi phạm bản quyền.</li>
                <li><strong>🇮🇪 Ireland:</strong> Mỹ phẩm thuộc quy định HPRA không được nhận.</li>
            </ul>
        </Sec>

        <Sec icon="📏" title="Giới Hạn Cân Nặng & Kích Thước">
            <PT headers={["Giới hạn cân nặng", "Quốc gia"]} rows={[
                ["0–15 kg", "UK, FR, DE, IT, ES, NL, BE, IE, SE, AT"],
                ["0–10 kg", "🇨🇭 Thụy Sĩ"],
                ["0–30 kg", "🇺🇸 Mỹ (cân nặng tính cước tối thiểu 100g)"],
            ]} />
            <SubTitle>Giới hạn kích thước</SubTitle>
            <ul className="pl-4 list-disc space-y-1">
                <li>Mặc định tất cả quốc gia: tối đa 60×50×40cm</li>
                <li>US, BE, IE, NL: tối đa 60×40×35cm</li>
            </ul>
            <Warn>Kiện hàng hình dạng đặc biệt: phụ phí 636.000₫/kiện.</Warn>
        </Sec>

        <Sec icon="📍" title="Địa Chỉ Giao Hàng">
            <ul className="pl-4 list-disc space-y-1">
                <li>Tất cả quốc gia: Không nhận địa chỉ Amazon và địa chỉ quân sự.</li>
                <li><strong>🇺🇸 Mỹ:</strong> Phụ phí vùng xa theo bảng giá.</li>
                <li><strong>🇸🇪 Thụy Điển:</strong> Phụ phí vùng xa +360.000₫/kiện.</li>
                <li><strong>🇬🇧 Anh:</strong> Phụ phí vùng xa +44.400₫/kiện. Không nhận quân sự, lãnh thổ hải ngoại.</li>
                <li><strong>🇨🇭 Thụy Sĩ:</strong> Không giao: MyPost24, MyPOST, Pickpost, Poststrasse, Postfach, PO BOX.</li>
            </ul>
        </Sec>

        <Sec icon="↩" title="Trả Hàng & Giao Lại">
            <Danger>Không trả hàng về Việt Nam từ nước ngoài.</Danger>
            <PT headers={["Quốc gia", "Thời hạn", "Phí"]} rows={[
                ["🇨🇭 Thụy Sĩ", "—", "216.820₫/kiện (1 lần duy nhất)"],
                ["🇫🇷 Pháp", "—", "216.820₫/kiện"],
                ["🇬🇧 Anh", "14 ngày", "173.455₫/kiện"],
            ]} />
            <Note>Kiện hàng không có phản hồi trong thời hạn sẽ bị tiêu hủy mặc định.</Note>
        </Sec>

        <Sec icon="🛡" title="Tiêu Chuẩn Bồi Thường">
            <PT headers={["Giai đoạn", "Thời hạn"]} rows={[
                ["Chưa đến kho", "30 ngày từ ngày lấy hàng"],
                ["Tại/đã xuất kho", "60 ngày từ ngày nhập kho"],
            ]} />
            <ul className="pl-4 list-disc space-y-1 mt-2">
                <li>Bồi thường tối đa: <strong>30 USD/kiện</strong>. Yêu cầu điều tra.</li>
                <li>Không bồi thường: lỗi người bán, sai địa chỉ, từ chối nhận, hư hỏng vận chuyển, hải quan tịch thu, bất khả kháng, hàng dễ vỡ.</li>
            </ul>
            <Warn>Vi phạm từ người bán: khách hàng chịu HKD 1.160/kiện + mọi tổn thất phát sinh.</Warn>
        </Sec>
    </div>
);

export default RouteVnCosmetics;
