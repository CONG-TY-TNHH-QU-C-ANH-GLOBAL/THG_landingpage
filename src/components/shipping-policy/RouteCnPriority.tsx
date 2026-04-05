import { Sec, Warn, Note, Danger, SubTitle, PT, RouteBadge } from "./PolicyUI";

/** Route 5: CN → US/UK/DE/FR/ES · Priority */
const RouteCnPriority = () => (
    <div>
        <RouteBadge color="bg-[#e8eef8] text-[#1a4a8a]">Trung Quốc → Mỹ / Anh / Đức / Pháp / Tây Ban Nha · Priority</RouteBadge>

        <Sec icon="%" title="VAT / IOSS">
            <ul className="pl-4 list-disc space-y-1">
                <li>Không thu VAT nếu cung cấp mã IOSS hợp lệ (từ 26/06/2021).</li>
                <li>Không có IOSS + dịch vụ ứng của THG: phí = thuế suất VAT nước đến + 2%.</li>
            </ul>
            <Danger>Kiện hàng ≥ 150 EUR / 155 USD KHÔNG được chấp nhận. Áp dụng: Đức, Pháp, Tây Ban Nha, và các nước EU khác.</Danger>
        </Sec>

        <Sec icon="⚖" title="Trọng Lượng Tính Cước">
            <p>Tính theo trọng lượng nào cao hơn — thực tế hoặc thể tích.</p>
            <Note>Công thức thể tích: D × R × C (cm) ÷ 6000 = KG</Note>
        </Sec>

        <Sec icon="🌍" title="Quốc Gia & Hạn Chế">
            <PT headers={["Quốc gia", "Phạm vi phục vụ", "Chặng cuối", "Thời gian"]} rows={[
                ["🇺🇸 Mỹ", "Toàn bộ lục địa. Không Alaska, Hawaii, Puerto Rico, Guam, APO/FPO.", "USPS", "5–10 ngày LV"],
                ["🇬🇧 Anh", "Không nhận vùng xa hoặc địa chỉ quân sự.", "Evri", "5–7 ngày LV"],
                ["🇩🇪 Đức", "Toàn quốc, trừ các đảo xa bờ.", "DHL", "6–8 ngày LV"],
                ["🇫🇷 Pháp", "~95% mã bưu chính.", "Colisprive", "5–10 ngày LV"],
                ["🇪🇸 Tây Ban Nha", "Mã bưu chính 35, 38, 51, 52 (đảo hải ngoại) KHÔNG phục vụ.", "CTT", "5–10 ngày LV"],
            ]} />
            <Note>Thời gian giao chưa bao gồm chậm trễ do: nợ phí, giữ hàng, quá khổ, sai địa chỉ, từ chối, bất khả kháng.</Note>
            <SubTitle>Quy tắc Pre-alert Mỹ</SubTitle>
            <ul className="pl-4 list-disc space-y-1">
                <li>Phải điền cân nặng thực tế. Mã theo dõi USPS được cấp khi đặt hàng.</li>
                <li>Phí đăng ký trừ trước khi đặt; phí vận chuyển tính khi nhập kho.</li>
                <li>Hủy trong 5 ngày → hoàn phí đăng ký 100%.</li>
                <li>Không gửi hàng trong 25 ngày → tự động hủy, mất phí đăng ký.</li>
            </ul>
            <Warn>Kiện hàng phải đựng trong bao dệt quấn băng đỏ để nhận diện tại kho.</Warn>
        </Sec>

        <Sec icon="$" title="Giá Trị Khai Báo">
            <PT headers={["Quốc gia", "Giới hạn"]} rows={[
                ["🇺🇸 Mỹ", "Tối đa $60 USD/kiện"],
                ["🇬🇧 Anh", "KHÔNG chấp nhận nếu ≥ GBP 135 / $155 / €150"],
                ["🇩🇪 Đức / 🇫🇷 Pháp / 🇪🇸 Tây Ban Nha", "KHÔNG chấp nhận nếu ≥ €150 / $155"],
            ]} />
        </Sec>

        <Sec icon="📏" title="Giới Hạn Cân Nặng & Kích Thước">
            <PT headers={["Quốc gia", "Cân nặng", "Kích thước tối đa", "Ghi chú"]} rows={[
                ["🇺🇸 Mỹ", "0–30 kg", "55×40×35cm", "Quá khổ tối đa 68×43×43cm (+$25.5)"],
                ["🇬🇧 Anh", "0–5 kg", "60×40×35cm", "Kiện quá khổ KHÔNG nhận"],
                ["🇩🇪 Đức", "0–10 kg", "60×40×35cm", "Packstation: tối đa 60×30×30cm"],
                ["🇫🇷 Pháp", "0–5 kg", "60×40×35cm", "Kiện quá khổ KHÔNG nhận"],
                ["🇪🇸 Tây Ban Nha", "0–5 kg", "60×40×35cm", "Kiện quá khổ KHÔNG nhận"],
            ]} />
            <Warn>Mỗi kiện 1 mã vận đơn. KHÔNG nhận nhiều kiện cùng mã.</Warn>
            <Note>Tất cả quốc gia: tối thiểu 10×15cm. Kiện hình dạng bất thường: phụ phí $25.5/kiện.</Note>
        </Sec>

        <Sec icon="📦" title="Yêu Cầu Hàng Hóa">
            <Warn>Tất cả hàng gửi EU trong phạm vi CE phải có dấu CE.</Warn>
            <ul className="pl-4 list-disc space-y-1">
                <li>Nhận pin tích hợp và pin kèm theo (tối đa 100Wh). Không nhận pin nguyên chất, chất lỏng, bột, súng đạn.</li>
                <li>Nghiêm cấm hàng thương hiệu / vi phạm sở hữu trí tuệ.</li>
            </ul>
            <Danger>KHÔNG nhận: thực phẩm, dao, chất lỏng, bột, mỹ phẩm, sản phẩm gỗ thô, hàng nguy hiểm, laser, mũ bảo hiểm.</Danger>
            <Warn>🇺🇸 Mỹ: Sản phẩm FDA, tất cả mỹ phẩm, sản phẩm người lớn KHÔNG được nhận.</Warn>
        </Sec>

        <Sec icon="📍" title="Địa Chỉ Giao Hàng">
            <Danger>Không nhận địa chỉ kho Amazon tại tất cả quốc gia.</Danger>
        </Sec>

        <Sec icon="↩" title="Trả Hàng & Giao Lại">
            <Danger>Không có dịch vụ trả hàng từ nước ngoài về Trung Quốc.</Danger>
            <PT headers={["Quốc gia", "Thời hạn", "Phí"]} rows={[
                ["🇺🇸 Mỹ / 🇩🇪 Đức / 🇫🇷 Pháp / 🇪🇸 Tây Ban Nha", "14 ngày", "$10.5/kiện (Pháp qua Colissimo)"],
                ["🇬🇧 Anh", "14 ngày", "$8.5/kiện"],
            ]} />
            <Note>Không phản hồi trong thời hạn → kiện hàng bị tiêu hủy mặc định.</Note>
        </Sec>

        <Sec icon="🛡" title="Tiêu Chuẩn Bồi Thường">
            <Note>Khiếu nại phải được gửi trong vòng 60 ngày kể từ khi THG xuất hàng.</Note>
            <ul className="pl-4 list-disc space-y-1">
                <li>Mỹ, Anh, Đức, Pháp: Tối đa <strong>$20/kiện</strong>.</li>
                <li>Mất trong quá trình vận chuyển THG (chưa được quét): không cần hồ sơ.</li>
                <li>Đơn vị vận chuyển xác nhận mất: cần ảnh chụp hoàn tiền trên sàn hoặc bằng chứng đơn gửi lại.</li>
            </ul>
            <SubTitle>Không bồi thường</SubTitle>
            <ul className="pl-4 list-disc space-y-1">
                <li>Lỗi người bán, giao thất bại, hư hỏng vận chuyển, chậm trễ, hải quan tịch thu, vi phạm bản quyền, bất khả kháng, hàng dễ vỡ.</li>
                <li>Vi phạm từ người bán: $150/kiện + mọi tổn thất phát sinh.</li>
            </ul>
            <SubTitle>Yêu cầu khác</SubTitle>
            <ul className="pl-4 list-disc space-y-1">
                <li>Cung cấp link sản phẩm và mã HS để thông quan thuận lợi.</li>
                <li>Nhiều kiện gửi cùng người nhận/địa chỉ cùng ngày: giá trị khai báo lũy kế không vượt giới hạn quốc gia.</li>
                <li>Tên người nhận KHÔNG được chứa GmbH, kft, SRL, Ltd.</li>
                <li>Người bán phải đăng ký mã VAT/GST hợp lệ theo yêu cầu pháp luật.</li>
            </ul>
            <SubTitle>Tra cứu vận đơn</SubTitle>
            <ul className="pl-4 list-disc"><li>yuntrack.com · 17track.net · aftership.com/couriers/yunexpress</li></ul>
        </Sec>
    </div>
);

export default RouteCnPriority;
