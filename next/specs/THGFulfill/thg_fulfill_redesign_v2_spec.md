# THG Fulfill — Redesign Master Specification V2 (Light Theme & Interactive Flows)

Tài liệu này định hình lại toàn bộ hệ thống thiết kế (Design System), bố cục giao diện (Layout Architecture) và các hiệu ứng tương tác (Animations & Parallax) theo yêu cầu mới: **Chuyển sang Light Theme cao cấp, tích hợp Animated Route/Hub Flow, Scroll Parallax, và Tối ưu Typography cho tiếng Việt**.

---

## 1. Light Theme Design System & Tokens (Stripe / Shopify Logistics Vibe)

Dành cho tệp khách hàng e-commerce seller, giao diện cần sự sáng sủa, sạch sẽ, minh bạch và chuyên nghiệp thay vì nền tối u tối.

### 1.1. Color Palette Tokens (Light Mode)
```ts
// Tailwind & CSS Custom Properties for Light Theme
colors: {
  thg: {
    bg: '#F8F9FA',          // Clean Off-White / Light Gray Canvas (#F8F9FA)
    surface: '#FFFFFF',     // Pure White Cards with crisp shadows
    surfaceSubtle: '#F1F3F5',// Neutral light container background
    border: '#E2E8F0',      // Clean structural border
    borderHover: '#CBD5E1', // Active / hover border
    primary: '#0F172A',     // Deep Slate for high-contrast primary text
    textMuted: '#64748B',   // Slate gray for secondary descriptions
    gold: '#C29B38',        // Refined Professional Gold (Warm & Trustworthy)
    goldBg: '#FDF8EC',      // Soft gold container tint
    accentBlue: '#0284C7',  // Tech / routing line highlight
  }
}
```

### 1.2. Card & Shadow Elevation Standards
- **Standard Card:** `bg-white border border-[#E2E8F0] shadow-sm rounded-2xl p-6 transition-all duration-300 hover:shadow-md hover:border-[#CBD5E1]`
- **Featured Bento Cell:** `bg-gradient-to-br from-white via-[#FAFAFB] to-[#F1F3F5] border border-[#E2E8F0] shadow-sm rounded-3xl p-8`

---

## 2. Senior UI/UX Solutions cho các Section Cốt Lõi

### 2.1. Hero Section (Light Theme & Clean Typography)
- **Background:** Sáng sạch, tinh tế với hiệu ứng lưới mờ (Subtle Dot/Grid pattern) và một mảng gradient gold rất nhẹ (`bg-gradient-to-b from-[#FEFCE8]/40 via-transparent to-transparent`).
- **Typography Fix:** Sử dụng Sans-serif / Serif gọn gàng, kiểm soát strict `leading-tight` và `tracking-tight` để tránh hiện tượng ngắt từ/break chữ tiếng Việt vô lý.
- **Eyebrow Badge:** Pill badge nền `#FDF8EC`, viền `#FDE047`, chữ gold đậm: `✦ [GLOBAL FULFILLMENT INFRASTRUCTURE]`.
- **Stat Bar:** Nằm trong một container trắng nổi (`bg-white shadow-sm border border-slate-200 rounded-2xl py-4 px-8`), hiển thị 3 cột thông số rõ ràng, sắc nét.

### 2.2. Pain Bento Grid & Interactive Route Flow (Hình 3 Refinement)
Thay vì các cell đen tĩnh, chuyển sang **Light Surface Cards** với hiệu ứng tương tác trực quan:
- **Cell 01 (Vận chuyển quốc tế):** Tích hợp **Animated Route Flow UI**. 
  - Hiển thị trực quan: Từ cụm kho `[VN HAN / SGN]` và `[CN GZH / SHZ]` có các tia sáng / dải line động chạy qua `[HUB US / UK]` và inject thẳng vào `[US Last-Mile Carrier]`.
  - Giúp seller nhìn thấy ngay cơ chế cắt giảm 10–20 ngày transit time một cách sinh động, không phải đọc chữ khô khan.
- **Cell 02, 03, 04:** Các card nền trắng sáng, bo góc mềm mại, icon tinh tế, hover nổi bóng nhẹ.

### 2.3. Operational System Schematic & Assembly Chain (Hình 4 Refinement)
- **Interactive Assembly Pipeline:** Xây dựng một sơ đồ dạng chuỗi dây chuyền công nghệ (Tech Workflow Chain) với các node sáng dần khi cuộn chuột (Scroll Parallax / Step Activation):
  - `01 ORDER (Portal / CSV Auto-sync)` → `02 PRODUCE (DTG/DTF - VN·CN·US nodes)` → `03 FULFILL (Item-level QC Gate ✓)` → `04 SHIP (Carrier Linehaul)` → `05 DELIVER (Hub Tracking)`.
- Mỗi bước có trạng thái interactive, khi người dùng hover hoặc cuộn tới đâu, luồng dữ liệu (data flow particle animation) chạy qua đó, tạo cảm giác hệ thống tự động hóa cực kỳ chuyên nghiệp.

### 2.4. Scroll Parallax & Motion Design
- Sử dụng các hiệu ứng trượt nhẹ (`translate-y`, `opacity` fade-in khi scroll vào viewport) cho các section bento và pipeline, tạo chiều sâu thị giác (Parallax depth) mà không gây giật lag.

---

## 3. Master Prompt để Antigravity Thực Thi Bản Redesign V2

Copy đoạn prompt dưới đây gửi cho Antigravity để tiến hành nâng cấp toàn bộ hệ thống sang Light Theme và Interactive Flows:

```markdown
/impeccable polish Toàn bộ trang THGFulfill sang Light Theme cao cấp và tích hợp Interactive Workflow theo yêu cầu sau:

### 1. Chuyển đổi sang Light Theme (Stripe / Shopify Logistics Vibe)
- **Color Palette:** Loại bỏ hoàn toàn nền tối. Sử dụng nền chính Off-White (`#F8F9FA`), card nền trắng tinh (`#FFFFFF`) với viền xám sáng (`#E2E8F0`) và shadow nhẹ nhàng (`shadow-sm`).
- **Text & Contrast:** Sử dụng chữ tối màu (`#0F172A`) cho tiêu đề và (`#64748B`) cho mô tả. Điểm nhấn Gold chuyên nghiệp (`#C29B38`) tạo độ sang trọng.

### 2. Interactive Route Flow & Animated Assembly Chain
- **Hình 3 (Route Flow - Cell 01 Bento):** Thiết kế lại Bento cell vận chuyển trên nền sáng, tích hợp **Animated Route Flow UI** trực quan (VN/CN factories ➔ Linehaul ➔ US/UK Hubs ➔ Last-mile carrier injection) thể hiện rõ ràng việc cắt giảm 10-20 ngày transit time.
- **Hình 4 (Operational Chain):** Thay thế pipeline cũ bằng **Interactive Assembly Tech Chain** với hiệu ứng luồng dữ liệu chuyển động qua 5 giai đoạn (Order ➔ Produce ➔ QC Gate ➔ Ship ➔ Deliver).

### 3. Scroll Parallax & Typography Polish
- **Scroll Parallax:** Thêm hiệu ứng trượt mượt mà (scroll-driven fade-in & parallax motion) khi người dùng cuộn qua các bento grid và pipeline.
- **Typography Fix:** Chuẩn hóa toàn bộ tiêu đề tiếng Việt (tránh ngắt dòng/break chữ xấu), sử dụng font chữ sắc nét, dễ đọc cho tệp e-commerce seller.
- **Giữ nguyên Lead Generation Flow:** Giữ lại luồng `ConsultOverlay` và `DiscoveryWizard` / `Sales Dossier` đã xây dựng nhưng đồng bộ giao diện sang Light Mode sang trọng, đồng nhất với toàn trang.

Hãy tiến hành thực thi code hoàn thiện toàn bộ các hạng mục trên!
```
