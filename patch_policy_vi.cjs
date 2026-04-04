/**
 * patch_policy_vi.cjs
 * Patches the VI content of policy index 0 (LSTxjV = Policy VN-YTYCPREC)
 * with the full Vietnamese translation provided by the user in task4.md
 */
const fs = require('fs');

const policies = JSON.parse(fs.readFileSync('./src/data/larkPoliciesI18n.json', 'utf8'));

// Full Vietnamese translation for Policy VN-YTYCPREC (index 0)
const viContent = `### 💠 THÔNG TIN CHUNG
Từ 09:00 ngày 26/06/2021, THG sẽ KHÔNG thu VAT nếu KH cung cấp IOSS. Khách hàng phải đảm bảo rằng số IOSS đã khai báo là hợp lệ và tuân thủ quy định. Bất kỳ vấn đề thông quan nào (bao gồm nhưng không giới hạn: hoàn trả hàng loạt về Trung Quốc, bị hải quan giữ, bị phạt, v.v.) do khai báo số IOSS không chính xác sẽ do khách hàng tự chịu trách nhiệm.
Nếu khách hàng không cung cấp số IOSS và cần sử dụng dịch vụ ứng trước VAT của THG, phí sẽ được tính theo thuế suất VAT của quốc gia đích tương ứng với giá trị khai báo cộng thêm 2% (phí dịch vụ THG).
❌ KHÔNG nhận kiện hàng ≥ 150 EUR hoặc 155 USD.
Các quốc gia áp dụng: Đức — xem chi tiết tại Biểu thuế VAT EU.

### Ⅰ. Trọng lượng tính cước
Với tất cả quốc gia: So sánh trọng lượng thực tế và thể tích, sẽ tính cước mức cao hơn (phương pháp tính trọng lượng thể tích: dài × rộng × cao cm / 5000 = KG).

### 🌍 QUỐC GIA HỖ TRỢ
• Dịch vụ này không hỗ trợ xác nhận giao hàng (POD). Vui lòng liên hệ bộ phận kinh doanh nếu cần dịch vụ POD tăng thêm.
• 🇺🇸 Mỹ: Bao gồm toàn bộ các tiểu bang đại lục, ngoại trừ các vùng xa xôi như Alaska và Hawaii, địa chỉ hải ngoại như Puerto Rico và Guam, và địa chỉ quân sự APO/FPO.
• 🇩🇪 Đức: Bao phủ toàn bộ lãnh thổ, ngoại trừ các đảo liên kết.

### ⚠️ TIÊU CHÍ ĐẶT HÀNG TRƯỚC - YÊU CẦU CẢNH BÁO
1. Trọng lượng thực tế của kiện hàng phải được điền chính xác; mã tracking USPS sẽ được trả về sau khi đặt hàng.
2. Đơn hàng đi Mỹ sẽ tự động bị hủy nếu không giao hàng trong vòng 25 ngày kể từ ngày khai báo trước. Khách hàng cần giao hàng phải khai báo lại để nhận mã tracking mới.

### ⅣＩ. 📋 Yêu cầu đặt hàng & Giao nhận
• Nhãn vận chuyển chặng cuối sẽ được tạo ngay khi đặt đơn THG (Kích thước nhãn: 10×15cm). Vui lòng dán nhãn đúng quy cách trước khi giao hàng.
• 🇺🇸 Mỹ: Vận chuyển chặng cuối qua USPS; mã tracking USPS trả về khi đặt hàng. Tổng thời gian giao hàng: 5–9 ngày làm việc.
• 🇩🇪 Đức: Vận chuyển chặng cuối qua DHL; mã tracking DHL trả về khi đặt hàng. Tổng thời gian giao hàng: 7–9 ngày làm việc.
• Thời gian giao hàng của các kiện hàng bất thường do nợ phí, khách hàng yêu cầu giữ hàng, quá cân/quá kích thước, địa chỉ sai/người nhận từ chối/không có nhà, bất khả kháng, v.v. không được tính vào thời gian tham khảo.

### ⚖️ Giới hạn trọng lượng
• Mỗi đơn chỉ được gửi 1 kiện, không được gộp nhiều đơn thành một kiện.
• 🇺🇸 Mỹ: 0 < Trọng lượng ≤ 10KG　|　🇩🇪 Đức: 0 < Trọng lượng ≤ 30KG

### Ⅵ. Giới hạn kích thước
• 🇺🇸 Mỹ: Kích thước tối thiểu: 10×15cm; Kích thước tối đa không phụ phí: 50×60×40cm.
• 🇩🇪 Đức: Kích thước tối thiểu: 10×15cm; Kích thước tối đa: 50×60×40cm. ⚠️ Lưu ý: Kiện hàng gửi đến địa chỉ Packstation phải trong khoảng kích thước 60×30×30cm.

### 💱 Giá trị khai báo
• 🇺🇸 Mỹ: Giá trị khai báo của một kiện hàng không được vượt quá 250 USD (bao gồm).
• 🇩🇪 Đức: Không nhận kiện hàng có giá trị khai báo từ 150 EUR hoặc 155 USD trở lên.

### 📦 Thuộc tính hàng hóa
• Pin tích hợp và pin đi kèm được chấp nhận (công suất pin không được vượt quá 100Wh); pin nguyên chất, chất lỏng, bột, súng đạn và các hàng cấm khác không được chấp nhận.
• Không nhận hàng có thương hiệu và kiện hàng liên quan đến quyền nhãn hiệu độc quyền. Nghiêm cấm hàng vi phạm quyền sở hữu trí tuệ với mọi thiết kế, thương hiệu, logo, nhân vật anime/phim hoạt hình quốc tế (VD: hàng có hoa văn, logo và chữ của đội bóng, câu lạc bộ, hiệp hội thể thao). Xem tại Website Khai báo SHTT Hải quan. THG sẽ tư vấn về thông tin đăng ký và ủy quyền. Quyết định cuối cùng thuộc về hải quan địa phương.
• Các mặt hàng sau không được chấp nhận: Thực phẩm, dao kiểm soát, chất lỏng, bột, mỹ phẩm các loại, sản phẩm gỗ thô hoặc có chứa gỗ, hàng nguy hiểm (VD: bật lửa, vật liệu dễ cháy nổ), con trỏ laser, mũ bảo hiểm, v.v.
• 🇺🇸 Mỹ: Không nhận sản phẩm được FDA chứng nhận, mỹ phẩm các loại và sản phẩm dành cho người lớn.
• Với các mặt hàng cấm khác, xem tại [Danh sách hàng cấm].

### ⅠⅩ. Yêu cầu địa chỉ giao hàng
❌ KHÔNG nhận chuyển đến kho Amazon.

### 🔄 Trả hàng & Giao lại
Kênh dịch vụ này không hỗ trợ trả hàng từ nước ngoài về Việt Nam.
Dịch vụ giao lại có sẵn cho Mỹ và Đức theo tiêu chuẩn sau: Sau khi kiện hàng được trả về kho nước ngoài, khách hàng có thể chọn giao lại trong vòng 14 ngày với phí giao lại 237.394 VNĐ/đơn. Nếu không yêu cầu giao lại, kiện hàng sẽ tự động bị tiêu hủy sau 14 ngày.

### 🛡️ Tiêu chuẩn bồi thường
• Thời hạn tiếp nhận yêu cầu bồi thường:
• Hàng chưa về kho: Khách hàng phải yêu cầu điều tra và giải quyết bồi thường trong vòng 30 ngày kể từ ngày thu hàng. Quá 30 ngày sẽ không được chấp nhận.
• Trong kho: Khách hàng phải yêu cầu kiểm tra và giải quyết bồi thường trong vòng 60 ngày kể từ thời điểm nhập kho. Quá 60 ngày sẽ không được chấp nhận.
• Đã xuất kho: Kể từ thời điểm hàng nhập kho, khách hàng phải yêu cầu kiểm tra và giải quyết bồi thường trong vòng 60 ngày. Quá 60 ngày sẽ không được chấp nhận.
• Trách nhiệm của THG: THG hỗ trợ khách hàng điều tra mọi sự cố xảy ra trong quá trình giao hàng (bao gồm mất hàng, hư hỏng, chậm giao hàng, v.v.); trách nhiệm bồi thường giới hạn trong thiệt hại trực tiếp do THG gây ra; mức bồi thường tối đa không vượt quá 20 USD/kiện hàng.
• Khách hàng cần chấp nhận rằng tất cả hồ sơ có vấn đề sẽ được THG xử lý theo nguyên tắc điều tra trước, bồi thường sau. Khách hàng cũng cần hợp tác cung cấp thông tin liên quan theo yêu cầu của từng kênh.
• Yêu cầu thông tin bồi thường:
A. Nếu nhà cung cấp dịch vụ xác nhận hàng mất, cần cung cấp tài liệu yêu cầu bồi thường trong vòng 14 ngày sau khi nộp đơn: Ảnh chụp màn hình hồ sơ hoàn tiền trực tuyến; Nếu không có hoàn tiền mà gửi hàng lại, cần cung cấp ảnh chụp màn hình giao dịch trực tuyến + nội dung tranh chấp + mã đơn gửi lại.
B. Nếu kiện hàng mất trong quá trình vận chuyển trong đám mây, nếu THG xác nhận mất hàng, khách hàng không cần cung cấp bằng chứng.

### ⚠️ Điều kiện miễn trừ
• THG sẽ không bồi thường cho các thiệt hại do hư hỏng, giao sai địa chỉ, bỏ sót giao hàng, vấn đề chất lượng, đặt hàng trùng lặp, đặt hàng nặng, đóng gói không nhất quán, v.v. do nguyên nhân từ phía khách hàng.
• THG sẽ không bồi thường cho việc giao hàng không thành công do địa chỉ người gửi/người nhận không đúng, người nhận từ chối, người nhận không có nhà, người nhận không đến lấy hàng đúng hạn. Đồng thời, do nhiều lần kiểm tra hải quan và nhiều khâu trung chuyển, THG không thể kiểm soát quy trình hoàn trả, do đó THG chỉ chịu trách nhiệm trả lại hàng đã nhận và không chịu bất kỳ trách nhiệm nào đối với hàng tồn đọng hoặc hàng hoàn trả bị hư hỏng/thiếu phụ kiện.
• Nếu hàng bị hư hỏng trong quá trình vận chuyển (từ khi rời kho đến khi giao hàng), THG sẽ không bồi thường.
• THG không đảm bảo và không cam kết về thời gian giao hàng thực tế, do đó không chịu trách nhiệm bồi thường do chậm trễ. Nếu hàng giao vi phạm pháp luật hoặc xâm phạm quyền SHTT của bên thứ ba, hoặc bị hải quan giữ do không khai báo trung thực, mô tả sản phẩm quá sơ sài, v.v., dẫn đến chậm tiến độ, THG sẽ hỗ trợ người gửi cung cấp tài liệu thông quan.
• Nếu kiện hàng bị tiêu hủy, bị tịch thu hoặc bị phạt do vi phạm quyền SHTT hoặc các hàng cấm khác, khách hàng phải tự chịu trách nhiệm. THG sẽ không chịu bất kỳ trách nhiệm bồi thường nào và sẽ không hoàn trả phí vận chuyển.
• Hàng hóa của khách hàng phải tuân thủ các quy định pháp luật và đáp ứng các yêu cầu cụ thể trong "Cam kết tuân thủ Quyền SHTT" và "Thỏa thuận An toàn hàng hóa". Nếu vi phạm, khi phát hiện, THG có quyền áp dụng các biện pháp pháp lý với khách hàng như: chặn giữ, cô lập, đóng băng, dừng vận chuyển, trả lại cho khách hàng, giữ hàng, tiêu hủy hoặc bàn giao cho cơ quan chức năng xử lý đúng quy định pháp luật đối với hàng cấm và hàng hạn chế. THG sẽ không chịu trách nhiệm về tổn thất hàng hóa phát sinh, và phí dịch vụ đã phát sinh sẽ không được hoàn trả.
• THG sẽ chỉ hỗ trợ điều tra tất cả các bất thường sau khi ký nhận ở tuyến chuyên biệt và không cam kết phản hồi. Nếu hàng mất chưa được xác nhận ở nước ngoài, sẽ không có bồi thường. Nếu có chứng từ ký nhận, THG sẽ cố gắng xin chứng từ ký nhận từ nước ngoài (sản phẩm không ký nhận sẽ không được cung cấp).
• Đối với hàng dễ vỡ như gốm sứ, đồ thủy tinh, đồ nhựa thủ công đặc biệt hoặc thực vật và mẫu thực vật, tài liệu, biên lai, vé, phiếu giảm giá và các mặt hàng không có giá trị đặt trước, cũng như thực phẩm sống/chín, thực phẩm dễ hỏng và các hàng hóa khác cần bảo quản đặc biệt; nếu khách hàng thực sự muốn gửi, phải chịu rủi ro hư hỏng và mất mát. THG không chịu trách nhiệm bồi thường và không hoàn trả phí vận chuyển đã thu. Đối với hàng THG phát hiện bị hư hỏng trong quá trình thực hiện dịch vụ, THG sẽ thông báo và thỏa thuận với khách hàng về cách xử lý; trường hợp khẩn cấp (VD: không tiêu hủy sẽ ảnh hưởng đến an toàn kho hoặc hàng hóa khác), THG có thể tiêu hủy hoặc xử lý ngay sau khi thông báo khẩn cho khách hàng mà không chịu bất kỳ trách nhiệm bồi thường nào, và khách hàng không được từ chối một cách vô lý.`;

// Patch policy index 0
policies[0].content.vi = viContent;

fs.writeFileSync('./src/data/larkPoliciesI18n.json', JSON.stringify(policies, null, 2));
console.log('✅ Patched VI content for policy VN-YTYCPREC (index 0)');
console.log('VI content length:', viContent.length, 'chars');
