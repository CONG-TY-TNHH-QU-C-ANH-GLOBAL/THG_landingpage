---
description: https://thgfulfill.sg.larksuite.com/wiki/CQ7EwweI5ihfXakt7DMlVOLTgxg
---

Tôi cần bạn truy cập vào link trên và làm kỹ từng feedback từ mục GÓP Ý LẦN 2 ở cuối trang giúp tôi trong đó bị những vấn đề bạn fix chuẩn y chang như vậy giúp tôi


Tôi cung cấp thêm về data file lark bảng giá để bạn vừa xem feedback và đối chiếu với file larksheet này để fix cho đúng https://thgfulfill.sg.larksuite.com/sheets/GeOhsIMqrhJ3JztNKVDlfWi9gAe?sheet=QyxeFY

Nhận xét plan của bạn


Model đã làm — nhưng cần kiểm tra lại
#1 — Lỗi tiền tệ Excel

Model fix đúng hướng (VN route dùng ₫, CN route dùng $), nhưng yêu cầu gốc là "kiểm tra chỉnh sửa ở những line còn lại luôn" — tức là không chỉ 1–2 chỗ, phải rà soát toàn bộ các bảng giá có export Excel.

#5 — Order Handling Fee

Model đổi label thành "Order Handling Fee" — đúng. Nhưng gốc vấn đề là dòng phụ "(If using THG warehouse system)" gây hiểu nhầm khách phải trả thêm nếu dùng OMS. Cần xóa hoặc sửa dòng phụ đó, không chỉ đổi tên.

#12 — Import tax badge

Model chỉ đổi 1 chỗ "Drop-off USPS" → "Import tax included". Nhưng yêu cầu gốc là đổi tất cả chỗ nào có "tax included" → "Import tax included", kể cả trong các đoạn "Showing:..." và các route card khác (VN/CN Priority line).

#13 — Shipping fee terminology

Model không đề cập fix này. Yêu cầu là: toàn bộ hệ thống đang dùng lẫn lộn "Fee", "Fare", "Cost"... → chuẩn hóa hết về "Shipping fee".


❌ Model bỏ sót hoàn toàn
#2 — VAT EU bị trùng quốc gia
Bảng VAT & Processing Fees đang có nhiều quốc gia xuất hiện nhiều lần — ví dụ Belgium bị lặp 4 lần. Cần deduplicate toàn bộ danh sách.
#3 — Bảng Reship Fee
Có 2 vấn đề:

Cụm "Re-delivery service for overseas returns is not provided" quá chung chung → cần liệt kê rõ 7 quốc gia cụ thể không hỗ trợ reship để khách và CS tự tra, đỡ phải hỏi OPS.
Thiếu dòng: "Other countries except above mentioned: 237,394 VND/parcel" → bổ sung vào cuối bảng.

#6 — Bảng giá chi tiết (nhiều lỗi nhỏ)

Tên quốc gia phải ghi đầy đủ rồi mới ghi tắt: ví dụ "United States (US)", "Germany (DE)" — hiện tại không đồng nhất.
Có 1 cột bị lỗi tên hiển thị là "SELF" thay vì tên quốc gia thật.
Các cột không căn thẳng hàng → cần fix alignment.

#8 — Hàng pin điện từ VN
Hiện tại UI đang có 1 route/tab riêng cho "Battery" từ VN — điều này sai về nghiệp vụ. Line Standard VN→WW vẫn ship được hàng pin nhưng không có line riêng. Cần:

Bỏ tab/option Battery line riêng khi chọn VN.
Thay bằng message: "Battery products can be shipped via the 'Standard VN-WW' channel; however, please refer to the attached Shipping Policy for specific requirements."

#9 — Lỗi dịch "Leak"
Trong dropdown "Cargo type" khi chọn VN → US / Epacket, đang có option "Leak" — đây là lỗi dịch thuật sai hoàn toàn. Các option đúng phải là: Standard, Cosmetics (không có "Leak").
#14a — Lỗi bảng giá UPS (HN & HCM warehouse)

Cả 2 warehouse đang bị lỗi hiển thị ở line UPS 5–7 BSD.
Từ mốc 21kg+, giá phải chuyển sang đơn giá theo kg (270,000 VND/kg), không phải giá cố định — hiện tại bảng đang nhảy sai.
Layout không cân đối giữa 2 bảng → cần căn thẳng.
Bỏ phần Remote Area Surcharge và Re-delivery ra khỏi trang hàng express (cả line CN) — 2 phần này chỉ áp dụng cho epacket.

#14b — Bảng giá Express CN→US

Chuẩn hóa badge thuế: dùng thống nhất "Import tax US excluded" (không dùng lẫn lộn các cụm khác).
Bỏ phần "Ngày giao hàng dự kiến" ở đầu — phần này đã có sẵn bên dưới từng line rồi, gộp lên trên gây hiểu nhầm vì mỗi line express có thời gian khác nhau.
Shipping Policy section cho hàng express: không áp dụng chính sách epacket → thay toàn bộ nội dung policy bằng: "Liên hệ THG để biết thêm chi tiết" (hoặc tiếng Anh: "Please contact THG for detailed shipping policy on express cargo.")

Những điều cần làm
1. Lỗi tiền tệ ExcelLàm rồi nhưng chưa rà hết toàn bộ line
2. VAT EU trùng quốc gia❌ Chưa làm
3. Reship fee — liệt kê quốc gia + thêm "Other countries"❌ Chưa làm
4.Order Handling Fee + xóa dòng phụ gây hiểu nhầm mới làm 1 nửa
5.Tên quốc gia, lỗi "SELF", căn cột❌ Chưa làm
6. Bỏ Battery line VN, thêm message hướng dẫn❌ Chưa làm
7. Lỗi dịch "Leak" trong dropdown❌ Chưa làm tức là vietnamese là pin điện thì English phải là battery chứ
8. "Import tax included" — đổi đồng loạt tất cả chỗLàm 1 phần
9. Chuẩn hóa "Shipping fee" thay "Fare/Cost/Fee" lộn xộn❌ Chưa làm
10. UPS bug HN/HCM warehouse + 21kg+ per-kg + bỏ remote/re-delivery với express❌ Chưa làm
11. Express CN-US: badge thuế, bỏ estimated date, policy → "liên hệ THG"Làm 1 phần
