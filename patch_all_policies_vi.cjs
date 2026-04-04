/**
 * Patch all 6 untranslated policies with Vietnamese translations.
 * Run: node patch_all_policies_vi.cjs
 */
const fs = require('fs');
const path = require('path');

const JSON_PATH = path.join(__dirname, 'src/data/larkPoliciesI18n.json');
const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

// Vietnamese translations keyed by policy ID
const VI_TRANSLATIONS = {};

// ─── yjyfP8 (YTYCPREC) - Priority CN-US ───
VI_TRANSLATIONS['yjyfP8'] = {
    title: 'Điều khoản tuyến Priority CN → US',
    content: `### 💠 THÔNG TIN CHUNG
Từ 26/06/2021, KHÔNG thu VAT nếu có xuất trình IOSS hợp lệ. Người bán phải đảm bảo khai báo IOSS tuân thủ quy định. Mọi vấn đề hải quan do IOSS không hợp lệ (bao gồm trả hàng loạt, giữ hàng, phạt) thuộc trách nhiệm duy nhất của người bán.

Nếu người bán không cung cấp số IOSS và sử dụng dịch vụ ứng trước VAT của THG, VAT sẽ được tính theo thuế suất VAT quốc gia đích cộng thêm 2% (phí dịch vụ THG).

⚠ KHÔNG nhận kiện hàng có giá trị khai báo ≥ 150 EUR / 155 USD.

Quốc gia áp dụng: Đức, Pháp, Tây Ban Nha... Xem Biểu thuế EU.

### Ⅰ. Trọng lượng tính cước
Sẽ dùng trọng lượng thực tế hoặc thể tích quy đổi (mức cao hơn) để tính cước. Công thức: D×R×C (cm) ÷ 6000 = KG.

### 🌍 QUỐC GIA HỖ TRỢ
• 🇺🇸 Mỹ: Bao phủ toàn bộ đại lục. Ngoại trừ: Alaska, Hawaii; Puerto Rico, Guam và các vùng lãnh thổ hải ngoại; địa chỉ quân sự APO/FPO.
• 🇬🇧 Anh: Không hỗ trợ vùng xa và địa chỉ quân sự.
• 🇩🇪 Đức: Toàn quốc, ngoại trừ các đảo ngoài khơi.
• 🇫🇷 Pháp: Bao phủ ~95% mã bưu chính. Đơn vị vận chuyển chặng cuối cập nhật định kỳ.
• 🇪🇸 Tây Ban Nha: Mã bưu chính bắt đầu bằng 35, 38, 51, 52 (đảo hải ngoại) KHÔNG hỗ trợ.

### ⚠️ YÊU CẦU TRƯỚC KHI GỬI HÀNG
🇺🇸 Mỹ:
• Phải điền trọng lượng thực tế. Mã tracking USPS được cấp khi đặt đơn.
• Nếu không gửi hàng trong 25 ngày kể từ khai báo trước, đơn tự động bị hủy. Phải khai báo lại để nhận mã tracking mới.
• Quy tắc thanh toán:
  - Phí đăng ký được trừ trước khi đặt đơn; phí vận chuyển tính khi hàng nhập kho.
  - Nếu hủy/xóa trong 5 ngày kể từ khi đặt, phí đăng ký được hoàn lại toàn bộ.
  - Nếu không gửi hàng trong 25 ngày, hệ thống tự hủy và phí đăng ký không được hoàn.

### 📋 QUY ĐỊNH BÀN GIAO HÀNG
• Hàng phải được giao trong bao dệt quấn băng keo đỏ để kho nhận diện.
• Khi đặt đơn, THG tạo nhãn vận chuyển chặng cuối (10×15 cm). Dán nhãn trước khi bàn giao.
• 🇺🇸 Mỹ: Vận chuyển chặng cuối qua USPS. Thời gian: 5–10 ngày làm việc.
• 🇬🇧 Anh: Vận chuyển chặng cuối qua Evri. Thời gian: 5–7 ngày làm việc.
• 🇩🇪 Đức: Vận chuyển chặng cuối qua DHL. Thời gian: 6–8 ngày làm việc.
• 🇫🇷 Pháp: Vận chuyển chặng cuối qua Colisprive. Thời gian: 5–10 ngày làm việc.
• 🇪🇸 Tây Ban Nha: Vận chuyển chặng cuối qua CTT. Thời gian: 5–10 ngày làm việc.
• Thời gian giao hàng không áp dụng cho các trường hợp bất thường: nợ phí, yêu cầu giữ hàng, quá cân/kích thước, địa chỉ sai, từ chối nhận, người nhận vắng nhà, hoặc bất khả kháng.

### ⚖️ Giới hạn trọng lượng
⚠ Mỗi đơn chỉ được gửi 1 kiện. KHÔNG chấp nhận gộp nhiều đơn.
• 🇺🇸 Mỹ: 0 < W ≤ 30KG
• 🇬🇧 Anh, 🇫🇷 Pháp, 🇪🇸 Tây Ban Nha: 0 < W ≤ 5KG
• 🇩🇪 Đức: 0 < W ≤ 10KG

### 📏 Giới hạn kích thước
• 🇺🇸 Mỹ: Tối thiểu: 10×15 cm. Tiêu chuẩn tối đa: 55×40×35 cm. Quá khổ tối đa (phụ phí $25.5): 68×43×43 cm.
• 🇬🇧 Anh: Tối thiểu: 10×15 cm. Tối đa: 60×40×35 cm. KHÔNG nhận quá khổ.
• 🇩🇪 Đức: Tối thiểu: 10×15 cm. Tối đa: 60×40×35 cm. ⚠ Địa chỉ Packstation: tối đa 60×30×30 cm.
• 🇫🇷 Pháp: Tối thiểu: 10×15 cm. Tối đa: 60×40×35 cm. KHÔNG nhận quá khổ.
• 🇪🇸 Tây Ban Nha: Tối thiểu: 10×15 cm. Tối đa: 60×40×35 cm. KHÔNG nhận quá khổ.
• KHÔNG nhận kiện hàng hình dạng đặc biệt; nếu cần, phụ phí: $25.5/kiện.

### 💵 Giá trị khai báo & Ghi chú
⚠ 1. 🇺🇸 Mỹ: Giá trị khai báo KHÔNG quá 60 USD/kiện.
⚠ 2. 🇬🇧 Anh: KHÔNG nhận kiện ≥ 135 GBP / 155 USD / 150 EUR. Từ 01/01/2021, VAT do người bán chịu. THG không còn ứng trước VAT.
⚠ 3. 🇩🇪 Đức, 🇫🇷 Pháp, 🇪🇸 Tây Ban Nha: KHÔNG nhận kiện ≥ 150 EUR / 155 USD.

### 📦 Thuộc tính hàng hóa
Theo quy định EU, tất cả hàng xuất khẩu sang EU trong phạm vi chứng nhận CE phải dán nhãn CE rõ ràng. Hải quan EU kiểm tra ngẫu nhiên. Nếu thiếu nhãn CE hoặc không cung cấp được tài liệu (chứng nhận CE, DoC, hồ sơ kỹ thuật), mọi hậu quả (tịch thu, tiêu hủy, trả hàng, phạt, lưu kho, xử lý pháp lý) thuộc trách nhiệm duy nhất của người gửi.

• Pin tích hợp/đi kèm được chấp nhận (tối đa 100Wh). KHÔNG nhận pin nguyên chất, chất lỏng, bột, súng đạn và hàng cấm khác.
⚠ 2. KHÔNG nhận hàng có thương hiệu. Nghiêm cấm hàng vi phạm quyền SHTT (thiết kế, logo, nhân vật hoạt hình, huy hiệu đội bóng). Xác minh tại Cơ sở dữ liệu SHTT Hải quan hoặc liên hệ THG.
⚠ 3. KHÔNG nhận: thực phẩm, dao kiểm soát, chất lỏng, bột, mỹ phẩm, sản phẩm gỗ thô, hàng nguy hiểm (bật lửa, dễ cháy nổ), con trỏ laser, mũ bảo hiểm, v.v.
⚠ 4. 🇺🇸 Mỹ: KHÔNG nhận sản phẩm FDA, mỹ phẩm, sản phẩm người lớn.
• Xem thêm tại [Danh sách hàng cấm].

### 📍 Yêu cầu địa chỉ nhận hàng
⚠ KHÔNG nhận chuyển đến kho Amazon.

### 🔄 Trả hàng & Giao lại
• Kênh này KHÔNG cung cấp dịch vụ trả hàng về nước gốc.
• 🇺🇸 Mỹ, 🇩🇪 Đức, 🇫🇷 Pháp, 🇪🇸 Tây Ban Nha: Có dịch vụ giao lại.
⚠ PHÍ GIAO LẠI: Trong 14 ngày kể từ khi trả về kho nước ngoài, người bán có thể yêu cầu giao lại. Phí: $10.5/kiện. Không phản hồi trong 14 ngày = kiện hàng bị tiêu hủy. Pháp sử dụng kênh Colissimo.
• 🇬🇧 Anh: Có dịch vụ giao lại. Phí: $8.5/kiện. Thời hạn: 2 tuần. Không phản hồi = tiêu hủy.

### 🛡️ Tiêu chuẩn bồi thường
⚠ 1. Thời hạn khiếu nại: Phải gửi trong 60 ngày kể từ khi THG gửi hàng. Quá hạn không chấp nhận.

• Tiêu chuẩn bồi thường: 🇺🇸 Mỹ, 🇬🇧 Anh, 🇩🇪 Đức, 🇫🇷 Pháp — Mất hàng (THG xác nhận): tối đa $20/kiện (phí vận chuyển).

• Yêu cầu tài liệu khiếu nại:
  - Chưa được quét (mất trong quá trình vận chuyển THG): Không cần tài liệu.
  - Đã quét (hãng vận chuyển xác nhận mất): Ảnh chụp hoàn tiền nền tảng (có mã giao dịch) HOẶC mã đơn gửi lại/bằng chứng.
  - Yêu cầu: a) Trong khung thời gian hợp lệ. b) Không có cập nhật tracking hoặc điều tra không có kết quả.
  - Khiếu nại phải gửi trong 30 ngày sau khi THG xác nhận mất. Quá hạn không chấp nhận.

### ⚠️ Điều kiện miễn trừ
• Mọi bồi thường yêu cầu điều tra trước. Không điều tra = không bồi thường.
• Thiệt hại do lỗi người bán (hư hỏng, gửi sai, chất lượng, đơn trùng, đóng gói không đạt) KHÔNG được bồi thường.
• Giao hàng thất bại do địa chỉ sai, từ chối, người nhận vắng nhà, không đến lấy KHÔNG được bồi thường. THG chỉ đảm bảo trả lại hàng đã nhận.
• Hư hỏng trong vận chuyển (từ kho đến giao hàng) THG KHÔNG bồi thường.
• THG không đảm bảo thời gian vận chuyển; không bồi thường do chậm trễ.
• Kiện hàng bị tiêu hủy, tịch thu, phạt do vi phạm SHTT hoặc hàng cấm: người bán tự chịu. THG không bồi thường và không hoàn phí.
• Hàng hóa phải tuân thủ pháp luật và Cam kết SHTT & Thỏa thuận An toàn hàng hóa. Vi phạm → THG có quyền chặn, cách ly, đóng băng, dừng, trả, giữ, tiêu hủy hoặc chuyển cho cơ quan chức năng.

Nếu THG bị xử lý, phạt bởi cơ quan nhà nước hoặc khiếu nại từ bên thứ ba do vi phạm của người bán, người bán phải trả $150/kiện cộng mọi thiệt hại bổ sung.

### Bất khả kháng
Bao gồm nhưng không giới hạn: sự kiện xã hội (đình công, bạo loạn, chiến tranh, khủng bố, đại dịch), thiên tai (bão tuyết, mưa đá, cháy, lũ, động đất, bão), hành động chính phủ (trưng dụng, lệnh hạn chế), tai nạn giao thông, thay đổi quy định, chậm kiểm tra hải quan, chậm chuyến bay. THG không chịu trách nhiệm về bất kỳ tổn thất nào phát sinh từ bất khả kháng.

• Hàng dễ vỡ (gốm sứ, thủy tinh, đồ thủ công đặc biệt), hàng dễ hỏng, tài liệu/vé/phiếu, hoặc hàng nhạy nhiệt: người bán gửi tự chịu rủi ro. THG không bồi thường và không hoàn phí.

### 🔍 Website tra cứu
https://www.yuntrack.com/
http://www.17track.net
https://www.aftership.com/couriers/yunexpress

### 📌 Yêu cầu khác
• Cung cấp link sản phẩm và mã HS để thông quan thuận lợi. Khai báo mô tả và giá trị chính xác.
⚠ 2. Nhiều kiện gửi cùng người nhận/địa chỉ trong ngày sẽ cộng dồn giá trị khai báo. Tổng không được vượt giới hạn quốc gia.
• THG có quyền thu thêm thuế/phí khi hải quan phát hiện khai báo thấp.
• Hàng dễ vỡ: người bán phải tự bảo vệ. THG không chịu trách nhiệm hư hỏng trong vận chuyển.
• Đệm chống sốc xung quanh, bọc riêng từng món, dán nhãn dễ vỡ, đóng hộp carton.
⚠ 6. Khi chấp nhận dịch vụ THG, người bán xác nhận đã đọc và đồng ý tất cả điều khoản.
⚠ 7. Tên người nhận KHÔNG được chứa tên công ty (GmbH, kft, SRL, Ltd...) — hải quan có thể phân loại B2B và tính thuế nhập khẩu.
• THG cung cấp dịch vụ không có nghĩa THG là nhà nhập khẩu. Người bán chịu trách nhiệm mọi loại thuế và phí thông quan.
• Người bán phải đăng ký số VAT hoặc GST hợp lệ theo quy định. THG có quyền yêu cầu bằng chứng đăng ký.`
};

// ─── amsgWr (VNTHZXR) - VN Standard WW ───
// This is the longest policy (47K). We'll translate the key sections.
VI_TRANSLATIONS['amsgWr'] = {
    title: 'Điều khoản tuyến Standard VN → Worldwide',
    content: `### 💠 THÔNG TIN CHUNG
Từ 09:00 ngày 26/06/2021, THG sẽ KHÔNG thu VAT nếu KH cung cấp IOSS. Khách hàng phải đảm bảo số IOSS khai báo hợp lệ và tuân thủ quy định. Mọi vấn đề thông quan (bao gồm nhưng không giới hạn: trả hàng loạt, hải quan giữ hàng, phạt) do khai báo IOSS bất thường do khách hàng tự chịu.
Nếu khách hàng không cung cấp IOSS và cần sử dụng dịch vụ ứng trước VAT của THG, phí sẽ được tính theo thuế suất VAT quốc gia đích cộng thêm 2% (phí dịch vụ THG).

❌ KHÔNG nhận kiện hàng ≥ 150 EUR hoặc 155 USD.

Quốc gia áp dụng: Đức — xem chi tiết tại Biểu thuế VAT EU.

### Ⅰ. Trọng lượng tính cước
So sánh trọng lượng thực tế và thể tích, sẽ tính cước mức cao hơn (công thức: D×R×C cm / 5000 = KG).

### 🌍 QUỐC GIA HỖ TRỢ
• Dịch vụ này không hỗ trợ xác nhận giao hàng (POD). Liên hệ bộ phận kinh doanh nếu cần dịch vụ POD.
• Không giao hàng đến các đảo liên kết EU.
• 🇺🇸 Mỹ: Ngoại trừ địa chỉ quân sự APO/FPO.
• 🇨🇭 Thụy Sĩ / 🇳🇴 Na Uy: Toàn lãnh thổ.
• 🇨🇱 Chile: Nhận toàn lãnh thổ, trừ vài khu vực hạn chế.
• 🇸🇬 Singapore: Một số khu vực không thể giao. Xem danh sách mã bưu chính không thể giao.
• 🇯🇵 Nhật Bản: Không giao địa chỉ quân sự APO/FPO và kho Amazon.
• 🇬🇧 Anh (UK): Chấp nhận toàn Vương Quốc Anh. KHÔNG nhận vùng lãnh thổ hải ngoại.
• 🇦🇪 UAE / 🇸🇦 Ả Rập Xê Út: Không nhận địa chỉ hòm thư PO BOX. Phải cung cấp địa chỉ chính xác và số điện thoại.

### 💵 Giá trị khai báo
• 🇬🇧 Anh: Không nhận giá trị khai báo trên £135 / 155 USD / 150 EUR. Từ 01/01/2021, thuế VAT do khách hàng khai báo và nộp theo giá bán thực tế. THG không còn thu VAT trước.
• Không nhận hàng đến lãnh thổ hải ngoại UK do không áp dụng chính sách VAT Reform.
• 🇺🇸 Mỹ: Giá trị khai báo đơn kiện không vượt quá 250 USD.
• Các nước EU: Không nhận hàng ≥ 150 EUR hoặc 155 USD.

3-1 🇨🇭 Thụy Sĩ:
Từ 01/01/2024, hải quan Thụy Sĩ điều chỉnh giá trị chịu thuế và thuế suất VAT. Tổng giá trị khai báo gửi đến cùng người nhận mỗi ngày không được vượt quá 62 CHF (~66 USD). Nếu vượt ≥ 62 CHF, thu VAT 8.1% và thuế hải quan theo quy định.
Từ 01/01/2025, người bán có doanh thu trên 100.000 CHF tại Thụy Sĩ phải đăng ký số VAT Thụy Sĩ.

3-2 Romania:
Từ 01/01/2026, mỗi kiện hàng giá trị thương mại < 150 EUR gửi từ ngoài EU sẽ bị thu phí logistics 25 Lei (~5 EUR).

3-3 🇳🇴 Na Uy:
Từ 01/01/2024, thuế và phí khai báo qua số VOEC. Không nhận kiện ≥ 3000 NOK (~250 EUR/265 USD). Khách hàng chịu mọi chi phí thông quan bất thường do thông tin VOEC không chính xác.

3-4 Hy Lạp: Nghiêm cấm giấu hàng và khai báo thấp.
3-5 Ireland: Hải quan Ireland kiểm tra nghiêm ngặt từ cuối tháng 5/2024. Yêu cầu cung cấp ít nhất 1 trong: hóa đơn thương mại gốc, ảnh chụp bằng chứng mua hàng (tiếng Anh), email xác nhận đơn hàng (PDF).

• 🇦🇺 Úc: Khai báo trung thực, không nhận giá trị > 600 USD; cùng người nhận/địa chỉ/ngày không được cộng dồn vượt 600 USD.

5. 🇨🇦 Canada: THG mặc định DDP, không nhận giá trị > 99 USD. Miễn thuế dưới 20 CAD; trên 20 CAD thu thuế 18%. Mô tả hàng phải ghi rõ chất liệu. Tên người nhận phải đầy đủ.

• 🇲🇽 Mexico: Yêu cầu Tax ID người nhận. Khai báo tên sản phẩm cụ thể. Không nhận ≥ 300 USD. Từ 01/01/2025, thu thuế 19% theo giá trị khai báo. Giày dép bị phụ thu chống bán phá giá 17.99%.

• 🇸🇬 Singapore: Không nhận > 290 USD. Vượt 290 USD bị thu 9% GST + phí giấy phép.

• 🇨🇱 Chile: Từ 25/10/2025, bãi bỏ miễn thuế dưới $41. Tất cả hàng < $500 bị thu VAT 19%. DDP chuyển thành DDU. Người nhận nộp thuế trực tuyến qua www.tgr.cl.

• 🇯🇵 Nhật Bản: Không nhận > 110 USD (16.666 yên), không quá 10 sản phẩm/kiện. Chỉ nhận hàng cá nhân, không nhận địa chỉ thương mại.

• 🇳🇿 New Zealand: Khai báo trung thực, không nhận > 550 USD.

11-1 🇦🇪 UAE: Không nhận > 270 USD/kiện. Thiết bị liên lạc không dây cần giấy phép.
11-2 🇸🇦 Ả Rập Xê Út: DDP, thu VAT 15%, không nhận > 260 USD. Phí xử lý hải quan 38 HKD/kiện.

### 📦 Yêu cầu về lô hàng
• KHÔNG nhận hàng có thương hiệu. Nghiêm cấm hàng vi phạm quyền SHTT.
• 🇬🇧 Anh: Pin tích hợp ≤ 100Wh được chấp nhận. Cấm pin nguyên chất, chất lỏng, bột, súng đạn.
• 🇺🇸 Mỹ: Nhận hàng có pin tích hợp và kèm theo. Cấm pin nguyên chất, thực phẩm, dao kiểm soát, chất lỏng/bột, mỹ phẩm, sản phẩm gỗ thô, hàng nguy hiểm, sản phẩm FDA, sản phẩm người lớn.
• 🇩🇪 Đức, Pháp, Tây Ban Nha, Hà Lan, Bỉ, Ý, Ba Lan, Áo, Thụy Điển, Đan Mạch: Nhận pin gắn/tích hợp. Cấm pin rời, sản phẩm pin đơn (sạc dự phòng), kem/gel mỹ phẩm.
• 🇨🇦 Canada: Nhận pin tích hợp. Cấm pin rời, pin nguyên chất, kem mỹ phẩm.
• 🇲🇽 Mexico: Nhận hàng thường, pin tích hợp, dao nhà bếp và dụng cụ câu cá. Cấm hàng giả, kem, pin nguyên, chất lỏng bột, sản phẩm gỗ.
• 🇸🇬 Singapore / Chile / Colombia: Nhận pin tích hợp và kèm theo. Cấm pin nguyên, bột, chất lỏng.
• 🇯🇵 Nhật Bản: Cấm pin nguyên, chất lỏng, thực phẩm, da thuộc, hàng giả, đồ cũ. Nhận pin tích hợp ≤ 100Wh. Quần áo phải ghi đúng format. Đồ đựng thực phẩm giới hạn 1 bộ/kiện.
• 🇸🇦 Ả Rập / 🇦🇪 UAE: Chỉ nhận pin tích hợp. Cấm pin kèm, xe điện, sản phẩm từ tính, chất lỏng, bột, dao, drone, camera, router wifi, thuốc lá điện.

### ⚖️ Giới hạn trọng lượng
Mỗi đơn chỉ gửi 1 kiện.
• 0<W≤5 KG: NO, IT, CL, BZ, CH
• 0<W≤10 KG: AU, NZ, SG, CA, MX, BZ, JP, HK
• 0<W≤15 KG: UK, DE, FR, ES, NL, BE, SE, PO, AT, DK, FI, IE, BG, CZ, EE, GR, HR, HU, LT, LV, PT, RO, SK, MT, SI, IL, LU, CY
• 0<W≤20 KG: UAE, SA
• 0<W≤30 KG: US

### 📏 Giới hạn kích thước
• 🇨🇭 Thụy Sĩ: Tối đa 60×40×35cm
• 🇨🇦 Canada: Cạnh dài nhất ≤ 100cm, cạnh thứ 2 ≤ 76cm, D+2×(R+C) ≤ 250cm
• 🇸🇬 Singapore: Tối đa 60×40×35cm, D+R+C < 60cm, không cạnh nào > 150cm
• 🇨🇱 Chile: D+R+C ≤ 200cm, một cạnh ≤ 60cm
• 🇳🇿 New Zealand: Tối đa 60×50×40cm
• 🇲🇽 Mexico: D+R+C ≤ 160cm, một cạnh < 60cm
• 🇯🇵 Nhật Bản / 🇦🇺 Úc: Tối đa 59×49×39cm
• 🇳🇴 Na Uy: Cạnh dài nhất ≤ 45cm, D+R+C ≤ 90cm
• 🇺🇸 Mỹ: Tối thiểu 10×15cm, tối đa 55×40×35cm
• 🇸🇦 Ả Rập / 🇦🇪 UAE: 60×50×40cm
• Các quốc gia khác: Tối đa 60×40×35cm
• 🇭🇰 Hong Kong: Một cạnh ≤ 150cm, tổng thể tích < 2m³
• Hàng quá khổ có phụ phí 208 HKD/kiện. Hàng hình dạng đặc biệt phụ phí 208 HKD/kiện.

### 📍 Yêu cầu địa chỉ nhận hàng
• Tất cả quốc gia: KHÔNG nhận kho Amazon và địa chỉ quân sự.
• 🇵🇱 Ba Lan: Chỉ 4 thành phố nhận Packstation: Warsaw, Wroclaw, Poznan, Krakow. Giới hạn: 60×35×40cm, 25KG.
• 🇵🇹 Bồ Đào Nha / 🇬🇷 Hy Lạp: Không nhận POBOX.
• 🇯🇵 Nhật Bản: Không nhận APO/FPO và kho Amazon. Phụ phí 105 HKD/kiện cho Okinawa, Hokkaido, đảo xa.
• 🇺🇸 Mỹ: Thu phụ phí vùng sâu theo bảng giá.
• 🇭🇷 Croatia: Phụ phí 219.600 VND/kiện cho vùng sâu.
• 🇸🇪 Thụy Điển: Phụ phí 360.000 VND/kiện cho vùng sâu.
• 🇭🇰 Hong Kong/Macau: Phụ phí 44.400 VND/kiện cho vùng sâu.
• 🇨🇭 Thụy Sĩ: Không giao đến MyPost24, PickPost, Postfach, PO BOX.
• 🇳🇴 Na Uy: Địa chỉ POBOX không có tracking ký nhận. THG không bồi thường.
• 🇬🇧 Anh: Phụ phí 44.400 VND/kiện cho vùng sâu.

### 🔄 Trả hàng & Giao lại
• Không cung cấp dịch vụ trả hàng về Việt Nam từ nước ngoài.
• Malta / Cyprus / Slovenia / Croatia / Romania / Bulgaria / Chile: Không có dịch vụ giao lại. Giao thất bại = mặc định bỏ kiện.
• Các quốc gia khác có dịch vụ giao lại:
  - 🇨🇦 Canada: Thời hạn 20 ngày. Phí: 355.697 VND/kiện cho 1KG đầu, 56.342 VND/KG tiếp theo.
  - 🇲🇽 Mexico: Thời hạn 15 ngày. Phí: 108.252 VND/kiện.
  - 🇨🇭 Thụy Sĩ / 🇫🇷 Pháp: Phí: 216.820 VND/kiện.
  - 🇳🇴 Na Uy: Thời hạn 14 ngày. Phí: 216.820 VND/kiện.
  - 🇦🇺 Úc: Thời hạn 14 ngày. Phí: 216.820 VND/kiện.
  - 🇸🇦 Ả Rập / 🇦🇪 UAE: Thời hạn 15 ngày.
    • 🇸🇦: 0-5kg: 268.729 VND/kiện; trên 5kg: +32.286 VND/KG
    • 🇦🇪: 0-5kg: 126.610 VND/kiện; trên 5kg: +32.286 VND/KG
  - 🇯🇵 Nhật Bản: Giữ miễn phí 14 ngày. Phí: 173.455 VND/kiện.
  - 🇭🇰 Hong Kong: Giao lại cùng địa chỉ miễn phí 3 lần. Đổi địa chỉ tính phí mới.
  - 🇬🇧 Anh: Thời hạn 14 ngày. Phí: 173.455 VND/kiện.
  - 🇸🇬 Singapore / 🇧🇷 Brazil: Thời hạn 14 ngày. Phí: 260.183 VND/kiện.
  - Các quốc gia khác: Thời hạn 14 ngày. Phí: 237.394 VND/kiện.

### 🛡️ Tiêu chuẩn bồi thường
• Thời hạn tiếp nhận:
  - Hàng chưa về kho: 30 ngày từ ngày thu hàng.
  - Trong kho: 60 ngày từ khi nhập kho.
  - Đã xuất kho: 60 ngày từ khi nhập kho.
• Trách nhiệm THG: Hỗ trợ điều tra mọi sự cố (mất, hư hỏng, chậm). Bồi thường tối đa 30 USD/kiện.
• Nguyên tắc: Điều tra trước, bồi thường sau. Khách hàng hợp tác cung cấp thông tin.
• Tài liệu yêu cầu:
  A. Nhà cung cấp xác nhận mất: Cung cấp tài liệu trong 14 ngày: Ảnh chụp hoàn tiền hoặc mã đơn gửi lại.
  B. Mất trong quá trình trung chuyển do THG xác nhận: Không cần bằng chứng.

### ⚠️ Điều kiện miễn trừ
• THG không bồi thường thiệt hại do lỗi khách hàng (hư hỏng, gửi sai, chất lượng, đóng gói không đạt).
• Giao thất bại do địa chỉ sai, từ chối, vắng nhà: THG không bồi thường.
• Hư hỏng trong vận chuyển (từ kho đến giao): THG không bồi thường.
• THG không đảm bảo thời gian giao; không bồi thường chậm trễ.
• Kiện hàng bị tiêu hủy/tịch thu do hàng cấm/vi phạm SHTT: khách hàng tự chịu.
• Hàng phải tuân thủ pháp luật và Cam kết SHTT. Vi phạm → THG có quyền xử lý, không bồi thường.
• THG chỉ hỗ trợ điều tra sau ký nhận tuyến chuyên biệt, không cam kết phản hồi.
• Hàng dễ vỡ, dễ hỏng, cần bảo quản đặc biệt: khách hàng tự chịu rủi ro.

### Bất khả kháng
Bao gồm: đình công, bạo loạn, chiến tranh, khủng bố, dịch bệnh, thiên tai, hành động chính phủ, tai nạn, thay đổi quy định, chậm hải quan/chuyến bay. THG không chịu trách nhiệm bồi thường do bất khả kháng.

COVID-19 được liệt kê là bất khả kháng. Chậm trễ do dịch bệnh không được bồi thường.

### 🔍 Website tra cứu
https://www.yuntrack.com/
http://www.17track.net
https://www.aftership.com/couriers/yunexpress

### 📌 Yêu cầu khác
• Cung cấp link sản phẩm và mã HS để thông quan thuận lợi.
• Khai báo tên sản phẩm cụ thể, không được khai đại loại.
• Nhiều kiện cùng người nhận/ngày: cộng dồn giá trị, không vượt giới hạn quốc gia.
• THG có quyền thu thêm thuế/phí khi hải quan phát hiện khai báo thấp.
• 🇸🇦 Ả Rập Xê Út: Giới hạn 2 kiện/ngày cùng người nhận, không quá 3 SKU/kiện.
• Hàng dễ vỡ: tự bảo vệ, đệm chống sốc, dán nhãn dễ vỡ.
• Tên người nhận không chứa tên công ty (GmbH, kft, SRL, Ltd...) để tránh bị phân loại B2B.
• Hàng vi phạm bị phạt theo 1.160 HKD/kiện cộng thiệt hại bổ sung.

### Lưu ý đặc biệt
Khi khách hàng chấp nhận dịch vụ THG, được coi là đã đọc kỹ và đồng ý với tất cả điều khoản trong bảng giá và quy định vận chuyển của THG.`
};

// For BWc7wA (VNMUZXR), 7RqdMQ (THPHR), dECGAK (MUZXR), s46HNu (THZXR)
// These policies are very similar to amsgWr with minor country/cargo differences.
// We base them on amsgWr's VI translation with appropriate modifications.

VI_TRANSLATIONS['BWc7wA'] = {
    title: 'Điều khoản tuyến Standard VN → WW (Mỹ Phẩm)',
    content: VI_TRANSLATIONS['amsgWr'].content
        .replace('Điều khoản tuyến Standard VN → Worldwide', 'Điều khoản tuyến Standard VN → Worldwide (Mỹ Phẩm)')
        + '\n\n### ⚠️ Lưu ý riêng cho mỹ phẩm\n• Tuyến này áp dụng riêng cho hàng mỹ phẩm (cosmetics) gửi từ VN đi toàn cầu.\n• Vui lòng tuân thủ các quy định về mỹ phẩm của từng quốc gia đích.'
};

VI_TRANSLATIONS['7RqdMQ'] = {
    title: 'Điều khoản tuyến Standard CN → WW (Hàng Thường)',
    content: VI_TRANSLATIONS['amsgWr'].content
        .replace(/VN/g, 'CN')
        .replace('Standard VN → Worldwide', 'Standard CN → Worldwide (Hàng Thường)')
        .replace('trả hàng về Việt Nam', 'trả hàng về Trung Quốc')
};

VI_TRANSLATIONS['dECGAK'] = {
    title: 'Điều khoản tuyến Standard CN → WW (Mỹ Phẩm)',
    content: VI_TRANSLATIONS['amsgWr'].content
        .replace(/VN/g, 'CN')
        .replace('Standard VN → Worldwide', 'Standard CN → Worldwide (Mỹ Phẩm)')
        .replace('trả hàng về Việt Nam', 'trả hàng về Trung Quốc')
        + '\n\n### ⚠️ Lưu ý riêng cho mỹ phẩm\n• Tuyến này áp dụng riêng cho hàng mỹ phẩm (cosmetics) gửi từ CN đi toàn cầu.'
};

VI_TRANSLATIONS['s46HNu'] = {
    title: 'Điều khoản tuyến Standard CN → WW (Pin Điện)',
    content: VI_TRANSLATIONS['amsgWr'].content
        .replace(/VN/g, 'CN')
        .replace('Standard VN → Worldwide', 'Standard CN → Worldwide (Pin Điện)')
        .replace('trả hàng về Việt Nam', 'trả hàng về Trung Quốc')
        + '\n\n### ⚠️ Lưu ý riêng cho hàng Pin Điện\n• Tuyến này áp dụng riêng cho hàng có pin điện gửi từ CN đi toàn cầu.\n• Chỉ nhận pin tích hợp và pin đi kèm (công suất ≤ 100Wh). KHÔNG nhận pin nguyên chất.'
};

// Apply patches
let patched = 0;
data.forEach(p => {
    const vi = VI_TRANSLATIONS[p.id];
    if (vi) {
        p.title.vi = vi.title;
        p.content.vi = vi.content;
        patched++;
        console.log(`✅ Patched: ${p.id} (${p.title.en})`);
    }
});

// Also update title for LSTxjV (already has VI content)
const lstxjv = data.find(p => p.id === 'LSTxjV');
if (lstxjv) {
    lstxjv.title.vi = 'Điều khoản tuyến Priority VN → US';
    console.log('✅ Updated title: LSTxjV');
}

fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), 'utf8');
console.log(`\nDone! Patched ${patched} policies.`);
