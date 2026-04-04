/**
 * Patch amsgWr (VNTHZXR) with user-provided official Vietnamese translation.
 * Run: node patch_vnthzxr_vi.cjs
 */
const fs = require('fs');
const path = require('path');

const JSON_PATH = path.join(__dirname, 'src/data/larkPoliciesI18n.json');
const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

const VI_CONTENT = `Từ 09:00 ngày 26/06/2021, THG **sẽ KHÔNG** thu VAT nếu Khách hàng cung cấp IOSS. Khách hàng phải đảm bảo số IOSS được khai báo là hợp lệ và đúng định dạng. Mọi vấn đề thông quan hải quan (bao gồm nhưng không giới hạn: trả hàng loạt về Trung Quốc, giữ hàng tại hải quan, phạt tiền, v.v.) phát sinh do khai báo số IOSS bất thường sẽ do khách hàng tự chịu trách nhiệm.

Nếu khách hàng không cung cấp số IOSS và cần sử dụng dịch vụ ứng trước VAT của THG, phí sẽ được tính bằng mức thuế suất VAT của quốc gia đích tương ứng với giá trị khai báo cộng thêm 2% (phí dịch vụ của THG).

❌ **Không chấp nhận** các gói hàng có giá trị ≥ 150 EUR hoặc 155 USD.

**Quốc gia áp dụng:** Đức. Xem chi tiết tại: Mức thuế VAT EU.

---

## I – Trọng Lượng Tính Cước

So sánh trọng lượng thực tế và thể tích, chi phí vận chuyển sẽ được tính theo mức cao hơn (công thức tính trọng lượng thể tích: dài × rộng × cao (cm) / 5000 = KG).

---

## 🌍 Các Quốc Gia Hỗ Trợ

- Dịch vụ này **không cung cấp** bằng chứng giao hàng (POD). Vui lòng liên hệ bộ phận kinh doanh nếu cần dịch vụ POD gia tăng.
- Không giao hàng đến các đảo thuộc châu Âu.
- **Hoa Kỳ:** Không áp dụng cho địa chỉ quân sự APO/FPO.
- 🇨🇭 **Thụy Sĩ** / 🇳🇴 **Na Uy:** Toàn lãnh thổ.
- 🇨🇱 **Chile:** Nhận toàn lãnh thổ, ngoại trừ một số khu vực hạn chế.
- 🇸🇬 **Singapore:** Một số khu vực không tiếp cận được. Vui lòng tham khảo danh sách mã bưu chính các khu vực không giao được.
- 🇯🇵 **Nhật Bản:** Không giao địa chỉ quân sự APO/FPO và địa chỉ Amazon.
- 🇬🇧 **Anh (UK):** Nhận toàn bộ Vương quốc Anh (đại lục và các đảo). **Không nhận** lãnh thổ hải ngoại của Anh (Lãnh thổ Ấn Độ Dương, Quần đảo Virgin, Guernsey, Jersey, v.v.).
- 🇦🇪 **UAE** / 🇸🇦 **Ả Rập Xê Út:** Không hỗ trợ địa chỉ PO BOX; vui lòng cung cấp địa chỉ đầy đủ và số điện thoại, nếu không công ty sẽ không chịu trách nhiệm trong trường hợp không giao được hàng.

---

## 💵 Giá Trị Khai Báo

### 🇬🇧 Anh (UK)
Không nhận hàng có giá trị khai báo trên £135 / 155 USD / 150 Euro. Kể từ ngày 01/01/2021, do cải cách thuế yêu cầu nền tảng trả thuế thay cho khách hàng hoặc khách hàng tự khai báo và nộp thuế, thuế sẽ được nộp theo giá trị bán hàng thực tế. THG không còn thực hiện nghĩa vụ nộp thuế thay và không thu VAT từ khách hàng trước. Khách hàng được yêu cầu khai báo trung thực theo giá giao dịch thực tế.

Dịch vụ đến các đảo hải ngoại và vùng xa của Anh (Lãnh thổ Ấn Độ Dương, Quần đảo Virgin Anh, Guernsey, Jersey, v.v.) đã tạm dừng do không thể áp dụng chính sách cải cách VAT của Anh. Nếu khách hàng tiếp tục gửi hàng đến khu vực này, thuế hải quan và thuế tiêu thụ sẽ phát sinh và được hoàn trả thực tế bởi người gửi; không thể cung cấp bằng chứng.

### 🇺🇸 Hoa Kỳ
Giá trị khai báo của một kiện hàng không được vượt quá 250 USD (bao gồm).

### Các Quốc Gia Thành Viên EU
Không nhận hàng hóa có giá trị bằng hoặc trên 150 Euro hoặc 155 USD.

---

### 3-1 🇨🇭 Thụy Sĩ

Kể từ ngày 01/01/2024, Hải quan Thụy Sĩ điều chỉnh giá trị chịu thuế và thuế suất VAT. Tổng giá trị khai báo của các kiện hàng gửi đến cùng một người nhận không được vượt quá 62 franc Thụy Sĩ/ngày (hiện khoảng 66 USD). Nếu tổng giá trị khai báo lũy kế bằng hoặc vượt 62 franc Thụy Sĩ, khách hàng sẽ được yêu cầu nộp VAT ở mức 8,1% và thuế hải quan sẽ do hải quan nơi đến thực tế xác định.

**Cải cách VAT Thụy Sĩ:** Kể từ ngày 01/01/2025, người bán có doanh số bán hàng hàng năm tại Thụy Sĩ trên 100.000 franc Thụy Sĩ cần đăng ký mã số VAT Thụy Sĩ và khai thuế định kỳ với cơ quan thuế Thụy Sĩ.

- Vui lòng đăng ký theo tình hình bán hàng thực tế và lấy: số thuế Thụy Sĩ (định dạng: CHE-123.123.123 MWST/TVA/IVA), số UID (định dạng: CHE-123.123.123), số tài khoản CSP.
- Nếu không cần nộp thuế, không cần điền mã số thuế. Nếu cần nộp thuế, vui lòng điền số UID vào trường số VAT trên giao diện đơn hàng.
- THG sẽ mở kênh khai báo trực tuyến từ ngày 27/02/2025. Vui lòng hoàn tất khai báo tại Trung tâm người dùng THG – Cài đặt người dùng – Quản lý mã số thuế Thụy Sĩ.

Các trường hợp sau dẫn đến chậm trễ, tịch thu, tiêu hủy, tính thuế bất thường – khách hàng phải chịu trách nhiệm:
- Cung cấp thông tin mã số thuế không hợp lệ hoặc sai định dạng, hoặc khai báo không trung thực.
- Không truyền mã số thuế kịp thời (khách hàng cần truyền trước ít nhất 10 ngày lịch).

### 3-2 Romania
Kể từ ngày 01/01/2026, phí logistics 25 Lei (~5 EUR) cho mỗi kiện hàng giá trị < 150 EUR gửi từ ngoài EU.

### 3-3 🇳🇴 Na Uy
Từ 01/01/2024, thuế khai báo qua số VOEC. Không nhận kiện ≥ 3.000 NOK (~250 Euro/265 USD). Khách hàng chịu mọi chi phí thông quan bất thường do thông tin VOEC không chính xác.

### 3-4 Hy Lạp
Nghiêm cấm che giấu và khai báo thấp. Tổn thất do vi phạm do khách hàng chịu.

### 3-5 Ireland
Từ cuối tháng 5/2024, hải quan Ireland kiểm tra chặt chẽ. Yêu cầu cung cấp ít nhất 1 trong:
- Hóa đơn thương mại gốc chính thức (PDF)
- Chứng từ mua hàng tiếng Anh (ảnh chụp đầy đủ)
- Email xác nhận đơn hàng của người nhận (PDF)

Khai báo sai → chậm trễ, phạt hải quan do khách hàng chịu (thu trong vòng nửa năm).

### 🇦🇺 Úc
Khai báo trung thực; không nhận > 600 USD; cùng người nhận/địa chỉ/ngày không được cộng dồn vượt 600 USD. Không nhận tài liệu khiêu dâm.

### 5. Canada
DDP mặc định, không nhận > 99 USD. Miễn thuế dưới 20 CAD; trên 20 CAD thu 18%. Mô tả hàng ghi rõ chất liệu, tên người nhận đầy đủ. Nhiều kiện cùng mô tả → thương mại B2B (phí 1.000-5.000 CAD). Khuyến nghị gửi cách ≥ 3 ngày.

### 🇲🇽 Mexico
Yêu cầu Tax ID người nhận (RFC). Khai báo tên sản phẩm cụ thể. Không nhận ≥ 300 USD. Từ 01/01/2025, thu thuế 19%. Giày dép phụ thu chống bán phá giá 17,99%.

### 🇸🇬 Singapore
Không nhận > 290 USD. Vượt 290 USD → 9% GST + phí giấy phép. Nhiều kiện cùng người nhận/ngày vượt 290 USD cũng bị thu. Doanh thu > 1 triệu SGD/năm hoặc doanh số SG > 100.000 SGD → phải nộp thuế.

### 🇨🇱 Chile
Từ 25/10/2025, bãi bỏ miễn thuế dưới $41. Tất cả hàng < $500 thu VAT 19% (VAT = CIF × 19%). DDP → DDU. Người nhận nộp thuế qua www.tgr.cl. Yêu cầu Tax ID (7-8 chữ số + 1 chữ số/K) và SĐT.

### 🇯🇵 Nhật Bản
Không nhận > 110 USD (16.666 yên), không quá 10 sản phẩm/kiện. Từ 01/05/2024, thu thuế hải quan ngay. Chỉ nhận hàng cá nhân. Tên người nhận đầy đủ. Thông quan thất bại → 14 ngày nộp bổ sung hoặc tiêu hủy.

### 🇳🇿 New Zealand
Khai báo trung thực, không nhận > 550 USD.

### 11-1 🇦🇪 UAE
Không nhận > 270 USD/kiện. Thiết bị không dây cần giấy phép. Cấm hàng từ Israel. Thời gian giữ tối đa 21 ngày.

### 11-2 🇸🇦 Ả Rập Xê Út
DDP, VAT 15%, không nhận > 260 USD. Phí xử lý 38 HKD/kiện. Điện thoại có camera (cá nhân 1-2 chiếc) cần hóa đơn gốc. Cấm hàng từ Israel, đồ khiêu dâm, máy đánh bạc, bút laser. Giữ tối đa 21 ngày.

---

## 📦 Yêu Cầu Gửi Hàng

- Tất cả các nước: **Không nhận** sản phẩm mang thương hiệu. Nghiêm cấm hàng vi phạm SHTT.

### 🇬🇧 Anh (UK)
Pin tích hợp ≤ 100Wh được chấp nhận. Cấm pin lắp ráp, pin thuần túy, chất lỏng, bột, súng đạn.

### 🇺🇸 Hoa Kỳ
Nhận pin tích hợp và lắp ráp; cấm pin thuần túy. Cấm thực phẩm, dao kiểm soát, chất lỏng/bột, mỹ phẩm, sản phẩm gỗ, hàng nguy hiểm, sản phẩm FDA, sản phẩm người lớn.

### Đức, Pháp, Tây Ban Nha, Hà Lan, Bỉ, Ý, Ba Lan, Áo, Thụy Điển, Đan Mạch
Nhận pin tích hợp/gắn trong. Không nhận pin rời, sản phẩm chỉ có pin, paste/gel (kem dưỡng, bột màu).

### 🇨🇦 Canada
Nhận pin tích hợp. Cấm pin lắp ráp, pin thuần túy, kem mỹ phẩm.

### 🇲🇽 Mexico
Nhận hàng thường, pin tích hợp, dao bếp, dụng cụ câu cá. Cấm hàng giả, paste, pin thuần, chất lỏng/bột, sản phẩm gỗ.

### Singapore / Chile / Colombia
Nhận pin tích hợp và kèm theo. Cấm pin thuần, bột, chất lỏng.

### 🇯🇵 Nhật Bản
**Cấm:** pin thuần, chất lỏng, thực phẩm, da thuộc, vải len, hàng giả, đồ cũ, đồ chơi trẻ sơ sinh, sản phẩm amiăng, áo chống đạn.
**Nhận:** pin tích hợp ≤ 100Wh. Quần áo ghi đúng format (giới tính + chất liệu + kiểu dệt + kiểu dáng). Giày ghi chất liệu. Đồ đựng thực phẩm giới hạn 1 bộ/kiện. Tối đa 10 sản phẩm/kiện.

### Ả Rập Xê Út / UAE
Chỉ nhận pin tích hợp. Cấm pin kèm, xe điện, sản phẩm từ tính, chất lỏng, bột, paste, hạt, dễ cháy nổ. Cấm bộ đàm, dao, drone, camera, router wifi, thuốc lá điện tử, kinh Quran, hàng giả, sản phẩm laser, sản phẩm người lớn, sản phẩm chống Hồi giáo, thiết bị y tế, điện thoại, phụ tùng ô tô, sách tôn giáo, hóa chất, động thực vật, mỹ phẩm, sản phẩm liên quan đến lợn, ảnh/tên người nổi tiếng.

---

## ⚖️ Giới Hạn Trọng Lượng

Mỗi đơn chỉ gửi 1 kiện, không nhận nhiều sản phẩm.

| Giới hạn | Quốc gia |
|---|---|
| 0 < W ≤ 5 KG | NO, IT, CL, BZ, CH |
| 0 < W ≤ 10 KG | AU, NZ, SG, CA, MX, BZ, JP, HK |
| 0 < W ≤ 15 KG | UK, DE, FR, ES, NL, BE, SE, PO, AT, DK, FI, IE, BG, CZ, EE, GR, HR, HU, LT, LV, PT, RO, SK, MT, SI, IL, LU, CY |
| 0 < W ≤ 20 KG | UAE, SA |
| 0 < W ≤ 30 KG | US |

---

## 📏 Giới Hạn Kích Thước

- 🇨🇭 **Thụy Sĩ:** Tối đa 60×40×35 cm.
- **Canada:** Cạnh dài nhất ≤ 100 cm, cạnh thứ hai ≤ 76 cm, dài + 2×(rộng + cao) ≤ 250 cm.
- 🇸🇬 **Singapore:** Tối đa 60×40×35 cm; tổng D+R+C < 60 cm, không cạnh nào > 150 cm.
- **Chile:** D+R+C ≤ 200 cm, một cạnh ≤ 60 cm (một số khu vực yêu cầu D+R+C ≤ 160 cm).
- **New Zealand:** Tối đa 60×50×40 cm.
- **Mexico:** D+R+C ≤ 160 cm, một cạnh < 60 cm.
- **Nhật Bản, 🇦🇺 Úc:** Tối đa 59×49×39 cm.
- 🇳🇴 **Na Uy:** Cạnh dài nhất ≤ 45 cm; D+R+C ≤ 90 cm.
- **Hoa Kỳ:** Tối thiểu 10×15 cm, tối đa 55×40×35 cm.
- **Ả Rập Xê Út, 🇦🇪 UAE:** 60×50×40 cm, cạnh dài nhất ≤ 60 cm.
- **Các nước khác:** Tối đa 60×40×35 cm.
- **Hồng Kông:** Một cạnh ≤ 150 cm, tổng thể tích < 2 m³.

Hàng quá khổ: phụ phí 208 HKD/kiện. Hàng hình dạng đặc biệt: phụ phí 208 HKD/kiện.

---

## 📍 Địa Chỉ Giao Hàng

- **Tất cả các nước:** Không nhận kho Amazon và địa chỉ quân sự.
- **Ba Lan:** Chỉ 4 thành phố nhận Packstation: Warsaw, Wroclaw, Poznan, Krakow. Giới hạn: 60×35×40 cm, 25 KG.
- **Bồ Đào Nha / Hy Lạp:** Không nhận POBOX.
- 🇯🇵 **Nhật Bản:** Không nhận APO/FPO và Amazon. Phụ phí 105 HKD/kiện cho Okinawa, Hokkaido, đảo ngoại ô.
- **Hoa Kỳ:** Phụ phí vùng sâu theo bảng giá.
- **Croatia:** Phụ phí 219.600 VND/kiện cho vùng sâu.
- **Thụy Điển:** Phụ phí 360.000 VND/kiện cho vùng sâu.
- **Hồng Kông/Ma Cao:** Phụ phí 44.400 VND/kiện cho vùng sâu.
- **Thụy Điển, Đan Mạch, Phần Lan, Lithuania, Latvia, Estonia:** Một số chặng cuối chỉ hỗ trợ tự nhận hàng.
- 🇨🇭 **Thụy Sĩ:** Không giao MyPost24, PickPost, Postfach, PO BOX, Poste restante.
- 🇳🇴 **Na Uy:** POBOX không có tracking ký nhận. THG không bồi thường.
- **Anh (UK):** Phụ phí 44.400 VND/kiện cho vùng sâu.

---

## 🔄 Hoàn Trả & Giao Lại

- Kênh này **không cung cấp** dịch vụ hoàn trả về Việt Nam từ nước ngoài.
- **Malta / Cyprus / Slovenia / Croatia / Romania / Bulgaria / Chile:** Không có dịch vụ giao lại. Giao thất bại = mặc định từ bỏ, không bồi thường.
- Các quốc gia khác có dịch vụ giao lại:
  - **Canada:** Thời hạn 20 ngày. Phí: 355.697 VND/kiện cho 1 KG đầu + 56.342 VND/KG tiếp theo.
  - **Mexico:** Thời hạn 15 ngày. Phí: 108.252 VND/kiện.
  - **Thụy Sĩ, 🇫🇷 Pháp:** Phí: 216.820 VND/kiện. Thụy Sĩ chỉ giao lại 1 lần.
  - **Na Uy:** Thời hạn 14 ngày. Phí: 216.820 VND/kiện.
  - **Úc:** Thời hạn 14 ngày. Phí: 216.820 VND/kiện.
  - **Ả Rập Xê Út / UAE:** Thời hạn 15 ngày. SA: 0-5kg: 268.729 VND; >5kg: +32.286 VND/KG. UAE: 0-5kg: 126.610 VND; >5kg: +32.286 VND/KG.
  - **Nhật Bản:** Giữ miễn phí 14 ngày. Phí: 173.455 VND/kiện.
  - **Hồng Kông:** Giao lại miễn phí 3 lần cùng địa chỉ. Đổi địa chỉ tính phí mới.
  - **Anh (UK):** Thời hạn 14 ngày. Phí: 173.455 VND/kiện.
  - **Singapore, Brazil:** Thời hạn 14 ngày. Phí: 260.183 VND/kiện.
  - **Các nước khác:** Thời hạn 14 ngày. Phí: 237.394 VND/kiện.

Công ty sẽ thu phí hoàn trả và các chi phí liên quan từ người gửi; không cung cấp chứng từ.

---

## 🛡️ Tiêu Chuẩn Bồi Thường

**Thời hạn chấp nhận:**
- Hàng chưa về kho: 30 ngày từ ngày thu gom.
- Trong kho: 60 ngày từ khi nhập kho.
- Đã xuất kho: 60 ngày từ khi nhập kho.

**Trách nhiệm THG:** Hỗ trợ điều tra mọi sự cố (mất, hư hỏng, chậm). Bồi thường tối đa **30 USD/kiện**.

**Tài liệu khiếu nại:**
A. Nhà cung cấp xác nhận mất: cung cấp trong 14 ngày (ảnh hoàn tiền hoặc mã đơn gửi lại).
B. Mất trong trung chuyển do THG xác nhận: không cần bằng chứng.

**Miễn trừ:**
- Lỗi khách hàng (hư hỏng, gửi sai, chất lượng, đóng gói không đạt): không bồi thường.
- Giao thất bại do địa chỉ sai, từ chối, vắng nhà: không bồi thường.
- Hư hỏng trong vận chuyển: không bồi thường.
- Không đảm bảo thời gian giao; không bồi thường chậm trễ.
- Vi phạm SHTT/hàng cấm → tịch thu: khách hàng chịu. Không hoàn cước.
- Hàng dễ vỡ, dễ hỏng, cần bảo quản đặc biệt: khách hàng tự chịu rủi ro.

**Bất khả kháng:** đình công, bạo loạn, chiến tranh, khủng bố, dịch bệnh, thiên tai, hành động chính phủ, tai nạn, thay đổi quy định, chậm hải quan/chuyến bay. THG không chịu trách nhiệm.

COVID-19 được liệt kê là bất khả kháng. Chậm trễ do dịch bệnh không được bồi thường.

Vi phạm nghĩa vụ gửi hàng → phạt **1.160 HKD/kiện** + thiệt hại bổ sung.

---

## 🔍 Website Tra Cứu

- https://www.yuntrack.com/
- http://www.17track.net
- https://www.aftership.com/couriers/yunexpress

---

## XI. Yêu Cầu Khác

- Cung cấp link bán hàng và mã hải quan để thông quan thuận lợi.
- Tên sản phẩm khai báo phải cụ thể, không khai đại loại.
- Nhiều kiện cùng người nhận/ngày: cộng dồn giá trị, không vượt giới hạn quốc gia.
- THG có quyền thu thêm thuế/phí khi hải quan phát hiện khai báo thấp.
- **Chile:** Phải khai báo số VAT người nhận. Không có mã thuế → tắc thông quan.
- Hàng dễ vỡ: tự bảo vệ, đệm chống sốc, bọc riêng từng món, dán nhãn dễ vỡ.
- 🇸🇦 **Ả Rập Xê Út:** Giới hạn 2 lô/ngày cùng người nhận, tối đa 3 SKU/lô.
- Tên người nhận không chứa tên công ty (GmbH, kft, SRL, Ltd...) → tránh B2B.
- Vi phạm → phí bất thường thu từ người gửi theo phán quyết hải quan.

---

## Lưu Ý Đặc Biệt

> Khi khách hàng đồng ý sử dụng dịch vụ của công ty, được coi là đã đọc kỹ các ghi chú trong bảng giá và điều khoản giao hàng, và chấp nhận sự ràng buộc của các điều khoản này.`;

// Find and patch amsgWr
const policy = data.find(p => p.id === 'amsgWr');
if (policy) {
    policy.content.vi = VI_CONTENT;
    policy.title.vi = 'Điều khoản tuyến Standard VN → WW';
    console.log('✅ Patched amsgWr (VNTHZXR) with official Vietnamese translation');
    console.log('   VI content length:', VI_CONTENT.length, 'chars');
} else {
    console.error('❌ Policy amsgWr not found!');
}

fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), 'utf8');
console.log('Done!');
