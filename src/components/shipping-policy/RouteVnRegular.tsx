import { Sec, Warn, Note, Danger, SubTitle, PT, RouteBadge } from "./PolicyUI";

/** Route 0: VN → WW · Hàng Thường */
const RouteVnRegular = () => (
    <div>
        <RouteBadge color="bg-[#e8f4e8] text-[#2d7a2d]">Việt Nam → Toàn Cầu · Hàng Thường</RouteBadge>

        <Sec icon="%" title="VAT / IOSS">
            <ul className="pl-4 list-disc space-y-1">
                <li>Từ 09:00 ngày 26/06/2021 — THG sẽ <strong>KHÔNG thu VAT</strong> nếu khách hàng cung cấp mã IOSS hợp lệ.</li>
                <li>Mọi vấn đề hải quan phát sinh do mã IOSS không hợp lệ (trả hàng hàng loạt, bị giữ, phạt...) do khách hàng tự chịu.</li>
                <li>Nếu không có IOSS và sử dụng dịch vụ ứng VAT của THG: phí = <strong>thuế suất VAT nước đến + 2%</strong> (phí dịch vụ THG).</li>
            </ul>
            <Danger>Kiện hàng có giá trị khai báo ≥ 150 EUR hoặc 155 USD sẽ KHÔNG được chấp nhận. Áp dụng cho các nước EU — tham khảo bảng thuế suất VAT EU.</Danger>
        </Sec>

        <Sec icon="⚖" title="Trọng Lượng Tính Cước">
            <p>Tính cước theo trọng lượng nào cao hơn — trọng lượng thực tế hoặc trọng lượng thể tích.</p>
            <Note>Công thức trọng lượng thể tích: D × R × C (cm) ÷ 5000 = KG</Note>
        </Sec>

        <Sec icon="🌍" title="Quốc Gia & Hạn Chế">
            <ul className="pl-4 list-disc space-y-1">
                <li>Không có bằng chứng giao hàng (POD) — liên hệ sales để thêm dịch vụ POD.</li>
                <li>Không giao đến các đảo phụ thuộc châu Âu.</li>
                <li><strong>🇺🇸 Mỹ:</strong> Không bao gồm địa chỉ quân sự APO/FPO.</li>
                <li><strong>🇨🇭 Thụy Sĩ / 🇳🇴 Na Uy:</strong> Phủ sóng toàn bộ lãnh thổ.</li>
                <li><strong>🇨🇱 Chile:</strong> Toàn bộ lãnh thổ trừ một số khu vực hạn chế.</li>
                <li><strong>🇸🇬 Singapore:</strong> Một số khu vực không thể giao — tham khảo danh sách mã bưu chính.</li>
                <li><strong>🇯🇵 Nhật Bản:</strong> Không nhận APO/FPO hoặc địa chỉ Amazon.</li>
                <li><strong>🇬🇧 Anh:</strong> Lục địa + các đảo. KHÔNG nhận lãnh thổ hải ngoại.</li>
                <li><strong>🇦🇪 UAE / 🇸🇦 Saudi Arabia:</strong> Không nhận PO BOX — yêu cầu địa chỉ chính xác và SĐT.</li>
            </ul>
        </Sec>

        <Sec icon="$" title="Giá Trị Khai Báo">
            <PT headers={["Quốc gia / Khu vực", "Giới hạn", "Ghi chú"]} rows={[
                ["🇬🇧 Anh", "Tối đa £135 / $155 / €150", "Nền tảng/người bán phải khai báo theo giá bán thực tế."],
                ["🇺🇸 Mỹ", "Tối đa $250/kiện", "—"],
                ["🇪🇺 EU", "Tối đa €150 / $155", "—"],
                ["🇨🇭 Thụy Sĩ", "Tối đa 62 CHF/ngày (~$66)", "VAT 8.1% nếu lũy kế ≥ 62 CHF."],
                ["🇳🇴 Na Uy", "Tối đa 3000 NOK (~€250)", "Yêu cầu số VOEC từ 01/01/2024."],
                ["🇨🇦 Canada", "Tối đa $99 USD", "DDP. Miễn thuế dưới CAD 20. Thuế suất: 18%."],
                ["🇲🇽 Mexico", "Tối đa $300 USD", "Yêu cầu mã số thuế người nhận. Thuế 19% từ 01/01/2025."],
                ["🇸🇬 Singapore", "Tối đa $290 USD", "GST 9% + phí giấy phép nếu vượt."],
                ["🇦🇺 Úc", "Tối đa $600 USD", "Cùng tên+địa chỉ: lũy kế tối đa $600/ngày."],
                ["🇯🇵 Nhật Bản", "Tối đa $110 USD (¥16,666)", "Tối đa 10 món/kiện. Chỉ sử dụng cá nhân."],
                ["🇳🇿 New Zealand", "Tối đa $550 USD", "Yêu cầu tên sản phẩm chính xác."],
                ["🇦🇪 UAE", "Tối đa $270 USD", "—"],
                ["🇸🇦 Saudi Arabia", "Tối đa $260 USD", "Tối thiểu $5. VAT 15%. Phí xử lý HKD 38/vé."],
                ["🇷🇴 Romania", "—", "Từ 01/01/2026: phí 25 Lei (~€5) mỗi kiện thương mại từ ngoài EU."],
                ["🇨🇱 Chile", "Tối đa $500 USD", "Từ 25/10/2025: VAT 19%. Yêu cầu mã số thuế người nhận."],
            ]} />
        </Sec>

        <Sec icon="📦" title="Yêu Cầu Hàng Hóa">
            <Danger>Hàng có thương hiệu KHÔNG được chấp nhận — bao gồm nhãn hiệu, logo hoạt hình/anime quốc tế, biểu tượng CLB thể thao.</Danger>
            <SubTitle>Quy định pin theo quốc gia</SubTitle>
            <PT headers={["Quốc gia", "Được nhận", "Không được nhận"]} rows={[
                ["🇬🇧 Anh", "Pin tích hợp (≤100Wh)", "Pin rời/pin nguyên chất, chất lỏng, bột, súng đạn"],
                ["🇺🇸 Mỹ", "Pin tích hợp + pin kèm theo", "Pin nguyên chất, thực phẩm, mỹ phẩm, sản phẩm FDA, laser, mũ bảo hiểm"],
                ["EU (DE, FR, ES, NL, BE, IT, PL, AT, SE, DK)", "Pin tích hợp", "Pin rời/dự phòng, sản phẩm pin độc lập, dạng gel/paste"],
                ["🇨🇦 Canada", "Pin tích hợp", "Pin rời/nguyên chất, kem mỹ phẩm, kem sơn"],
                ["🇲🇽 Mexico", "Hàng thường, pin tích hợp", "Hàng nhái, paste, pin nguyên chất, chất lỏng, bột, sản phẩm gỗ"],
                ["SG / CL / CO", "Pin tích hợp + pin kèm theo", "Pin nguyên chất, bột, chất lỏng"],
                ["🇯🇵 Nhật Bản", "Pin tích hợp (≤100Wh)", "Pin nguyên chất, da, len, hàng cũ, đồ chơi trẻ sơ sinh, sản phẩm chứa amiăng"],
                ["🇸🇦 Saudi / 🇦🇪 UAE", "Chỉ pin tích hợp", "Pin kèm theo, thiết bị công suất cao, từ tính, chất lỏng, bột"],
            ]} />
        </Sec>

        <Sec icon="📏" title="Giới Hạn Cân Nặng & Kích Thước">
            <SubTitle>Giới hạn cân nặng theo quốc gia</SubTitle>
            <PT headers={["Giới hạn", "Quốc gia"]} rows={[
                ["0–5 kg", "NO, IT, CL, BZ, CH"],
                ["0–10 kg", "AU, NZ, SG, CA, MX, BZ, JP, HK"],
                ["0–15 kg", "UK, DE, FR, ES, NL, BE, SE, PO, AT, DK, FI, IE, BG, CZ, EE, GR, HR, HU, LT, LV, PT, RO, SK, MT, SI, IL, LU, CY"],
                ["0–20 kg", "UAE, SA"],
                ["0–30 kg", "US"],
            ]} />
            <SubTitle>Giới hạn kích thước</SubTitle>
            <PT headers={["Quốc gia", "Kích thước tối đa"]} rows={[
                ["🇺🇸 Mỹ", "Tối thiểu 10×15cm; Tối đa 55×40×35cm"],
                ["🇨🇭 Thụy Sĩ", "60×40×35cm"],
                ["🇸🇬 Singapore", "Tối đa 60×40×35cm; D+R+C < 60cm; không cạnh nào > 150cm"],
                ["🇨🇱 Chile", "D+R+C ≤ 200cm; cạnh dài nhất 60cm"],
                ["🇳🇿 New Zealand", "60×50×40cm"],
                ["🇲🇽 Mexico", "D+R+C ≤ 160cm; một cạnh < 60cm"],
                ["🇯🇵 Nhật / 🇦🇺 Úc", "59×49×39cm"],
                ["🇳🇴 Na Uy", "Cạnh dài nhất ≤ 45cm; D+R+C ≤ 90cm"],
                ["🇸🇦 Saudi / 🇦🇪 UAE", "60×50×40cm; một cạnh ≤ 60cm"],
                ["🇨🇦 Canada", "Cạnh dài nhất ≤ 100cm; cạnh thứ 2 ≤ 76cm; D+2(R+C) ≤ 250cm"],
                ["Khác", "60×40×35cm"],
            ]} />
            <Warn>Kiện hàng quá khổ/hình dạng đặc biệt: phụ phí HKD 208/vé.</Warn>
        </Sec>

        <Sec icon="📍" title="Địa Chỉ Giao Hàng">
            <ul className="pl-4 list-disc space-y-1">
                <li>Tất cả quốc gia: Không nhận địa chỉ kho Amazon và địa chỉ quân sự.</li>
                <li><strong>Ba Lan — Packstation:</strong> Chỉ Warsaw, Wroclaw, Poznan, Krakow. Tối đa 60×35×40cm, 25kg.</li>
                <li><strong>Bồ Đào Nha / Hy Lạp:</strong> Không nhận địa chỉ PO Box.</li>
                <li><strong>🇯🇵 Nhật Bản:</strong> Không APO/FPO hoặc Amazon. Phụ phí vùng xa: +HKD 105/kiện (Okinawa, Hokkaido, đảo xa).</li>
                <li><strong>🇺🇸 Mỹ:</strong> Phụ phí vùng xa theo bảng giá.</li>
                <li><strong>🇨🇭 Thụy Sĩ:</strong> Không giao được: MyPost24, MyPOST, Pickpost, Poststrasse, Postfach, PO BOX.</li>
                <li><strong>🇳🇴 Na Uy:</strong> Địa chỉ PO Box: không có ký xác nhận giao hàng.</li>
                <li><strong>SE, DK, FI, LT, LV, EE:</strong> Một số chặng cuối chỉ hỗ trợ tự lấy hàng.</li>
                <li>Phụ phí vùng xa: UK +44.400₫ | HR +219.600₫ | SE +360.000₫ | GB +44.400₫.</li>
            </ul>
        </Sec>

        <Sec icon="↩" title="Trả Hàng & Giao Lại">
            <Danger>Tuyến này KHÔNG trả kiện hàng về Việt Nam từ nước ngoài.</Danger>
            <Warn>Malta, Cyprus, Slovenia, Croatia, Romania, Bulgaria, Chile: Không hỗ trợ giao lại. Giao thất bại = bỏ hàng.</Warn>
            <SubTitle>Phí giao lại & thời hạn</SubTitle>
            <PT headers={["Quốc gia", "Thời hạn", "Phí"]} rows={[
                ["🇨🇦 Canada", "20 ngày", "355.697₫ (kg đầu) + 56.342₫/kg sau"],
                ["🇲🇽 Mexico", "15 ngày", "108.252₫/kiện"],
                ["🇨🇭 Thụy Sĩ", "—", "216.820₫/kiện (1 lần duy nhất)"],
                ["🇫🇷 Pháp", "—", "216.820₫/kiện"],
                ["🇳🇴 Na Uy", "14 ngày", "216.820₫/kiện"],
                ["🇦🇺 Úc", "14 ngày", "216.820₫/kiện"],
                ["🇸🇦 Saudi Arabia", "15 ngày", "0–5kg: 268.729₫; >5kg: +32.286₫/kg"],
                ["🇦🇪 UAE", "15 ngày", "0–5kg: 126.610₫; >5kg: +32.286₫/kg"],
                ["🇯🇵 Nhật Bản", "14 ngày", "173.455₫/kiện"],
                ["🇬🇧 Anh", "14 ngày", "173.455₫/kiện"],
                ["SG / Brazil", "14 ngày", "260.183₫/kiện"],
                ["🇭🇰 Hong Kong", "14 ngày", "3 lần giao lại miễn phí (cùng địa chỉ)"],
                ["Quốc gia khác", "14 ngày", "237.394₫/kiện"],
            ]} />
            <Note>Hết thời hạn mà không phản hồi → kiện hàng sẽ bị tiêu hủy mặc định.</Note>
        </Sec>

        <Sec icon="🛡" title="Tiêu Chuẩn Bồi Thường">
            <SubTitle>Thời hạn khiếu nại</SubTitle>
            <PT headers={["Giai đoạn", "Thời hạn"]} rows={[
                ["Chưa đến kho", "30 ngày từ ngày lấy hàng"],
                ["Tại kho", "60 ngày từ ngày nhập kho"],
                ["Đã xuất kho", "60 ngày từ ngày nhập kho"],
            ]} />
            <SubTitle>Quy định chính</SubTitle>
            <ul className="pl-4 list-disc space-y-1">
                <li>Bồi thường tối đa: <strong>30 USD/kiện</strong>.</li>
                <li>Phải hoàn tất điều tra trước khi bồi thường.</li>
                <li>Hồ sơ cần thiết: (A) ảnh chụp hoàn tiền trên sàn, hoặc (B) bằng chứng đơn gửi lại + ảnh giao dịch.</li>
            </ul>
            <SubTitle>Không bồi thường</SubTitle>
            <ul className="pl-4 list-disc space-y-1">
                <li>Lỗi của người bán: hư hỏng, giao sai, chất lượng kém, đơn trùng, đóng gói không đạt.</li>
                <li>Giao thất bại do sai địa chỉ, từ chối nhận, vắng nhà, không đến lấy.</li>
                <li>Hư hỏng trong quá trình vận chuyển (từ kho đến nơi giao).</li>
                <li>Chậm trễ — THG không cam kết thời gian giao hàng.</li>
                <li>Hải quan tịch thu do vi phạm bản quyền, hàng cấm, hoặc khai báo thiếu.</li>
                <li>Bất khả kháng (chiến tranh, thiên tai, đại dịch, hành động chính phủ...).</li>
                <li>Hàng dễ vỡ (gốm, thủy tinh, nhựa đặc biệt) — gửi tự chịu rủi ro.</li>
            </ul>
            <Warn>Nếu THG bị phạt do vi phạm của người bán: khách hàng chịu HKD 1.160/kiện cộng mọi tổn thất phát sinh.</Warn>
        </Sec>

        <Sec icon="📋" title="Yêu Cầu Khác">
            <ul className="pl-4 list-disc space-y-1">
                <li>Cung cấp link bán hàng và mã HS hải quan để hỗ trợ thông quan.</li>
                <li>Tên sản phẩm phải cụ thể — không dùng tên danh mục chung.</li>
                <li>Nhiều kiện gửi cùng người nhận cùng ngày: giá trị khai báo lũy kế không được vượt giới hạn quốc gia.</li>
                <li>Tên người nhận không được chứa các từ công ty (GmbH, kft, SRL, Ltd).</li>
                <li><strong>Saudi Arabia:</strong> Tối đa 2 kiện/ngày mỗi người nhận; tối đa 3 SKU/kiện.</li>
                <li>Hàng dễ vỡ: phải thêm vật liệu chống sốc, bọt khí, và nhãn dễ vỡ trước khi gửi.</li>
            </ul>
            <SubTitle>Tra cứu vận đơn</SubTitle>
            <ul className="pl-4 list-disc"><li>yuntrack.com · 17track.net · aftership.com/couriers/yunexpress</li></ul>
        </Sec>
    </div>
);

export default RouteVnRegular;
