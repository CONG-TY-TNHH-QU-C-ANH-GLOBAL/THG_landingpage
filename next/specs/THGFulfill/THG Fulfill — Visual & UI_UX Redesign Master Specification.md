# THG Fulfill — Visual & UI/UX Redesign Master Specification

Tài liệu này định nghĩa chi tiết **Visual Art Direction, Layout Hierarchies, Section-by-Section UI Redesign và Micro-interactions** để Antigravity xây dựng một landing page THG Fulfill có gout thẩm mỹ đỉnh cao, sắc sảo, mang hơi hướng Industrial Tech (đẳng cấp như Linear, Vercel, Stripe), hoàn toàn loại bỏ cảm giác template thô sơ.

---

## 1. Visual Art Direction & Design Tokens

### 1.1. Tinh thần thiết kế (Aesthetic Philosophy)
- **Industrial & Physical Trust:** Sử dụng các tông màu tối sâu thẳm kết hợp với đường viền kim loại mờ (matte border) và điểm nhấn vàng ánh kim (Subtle Gold) để tạo cảm giác về hạ tầng kho bãi, logistics xuyên quốc gia vững chắc.
- **Typography Hierarchy:** Kết hợp giữa Serif sắc nét cho các tiêu đề lớn (tạo cảm giác cao cấp, đáng tin cậy) và Sans-serif gọn gàng cho body text, kết hợp Mono font cho các thông số kỹ thuật/meta tags.
- **Glassmorphism & Surface Depth:** Các khối card không phẳng màu đơn điệu mà có độ sâu (Layering) với background `rgba(18, 20, 26, 0.7)` kết hợp backdrop blur và viền sáng tinh tế khi hover (`hover:border-thg-gold/40`).

### 1.2. Color & Effect Tokens
```ts
// Tailwind & CSS Custom Properties
colors: {
  thg: {
    bg: '#07080A',         // Obsidian Deep Background
    surface: '#111318',    // Elevated Card Surface
    surfaceHighlight: '#1A1D24', // Hover Surface
    border: '#222630',     // Structural Divider Border
    borderActive: '#D4AF3740', // Gold-tinted active border
    gold: '#D4AF37',       // Primary Metallic Gold Accent
    goldGlow: '0 0 30px rgba(212, 175, 55, 0.15)', // Soft gold glow
    textMain: '#F8F9FA',   // High-contrast primary text
    textMuted: '#98A2B3',  // Secondary description text
    cyanTech: '#38BDF8',   // Operational tech tag accent
  }
}
```

---

## 2. Section-by-Section Visual & UI Redesign

### 2.1. Hero Section (Màn hình đầu tiên — Ấn tượng trong 3 giây)
- **Layout & Visuals:**
  - Background: Radial gradient tối màu (`from-[#12151C] via-[#07080A] to-[#07080A]`) kết hợp với lưới kỹ thuật mờ (Subtle Grid Pattern) tượng trưng cho mạng lưới logistics toàn cầu.
  - Eyebrow Badge: Pill badge nhỏ phía trên tiêu đề có hiệu ứng viền sáng: `[GLOBAL FULFILLMENT INFRASTRUCTURE]` kèm chấm tròn xanh/vàng nhấp nháy (`animate-pulse`).
  - **Headline:** Serif font, cực kỳ sắc bén: *"Hạ Tầng Fulfill Xuyên Quốc Gia Cho Doanh Nghiệp TMĐT Thế Hệ Mới."*
  - **Stat Bar (Bottom of Hero):** Chia làm 3 cột ngăn cách bằng đường line dọc mờ:
    1. `VN · CN · US` (Production Nodes)
    2. `POD & Dropship` (Core Services)
    3. `Item-Level QC` (Standardized Check)
- **Hero CTA:** Nút chính màu Gold (`bg-thg-gold text-black font-semibold hover:shadow-lg hover:shadow-thg-gold/20 transition-all`), cạnh bên là nút Secondary dạng Outline kính mờ *"Xem năng lực hệ thống"*.

---

### 2.2. Pain Points Section (Bento Grid — Thay thế hoàn toàn giao diện cũ)
- **Layout:** Bento Grid bất đối xứng (Asymmetrical Bento Grid) gồm 4 cells với các kích thước khác nhau, tạo nhịp thị giác mạnh mẽ.
- **Cell 01 (Featured - Chiếm 2 cột trên desktop):** Vấn đề **Vận chuyển quốc tế xuyên biên giới (10-20 ngày)**.
  - *Visual Highlight:* Bên trong cell đen nhám tích hợp một **Interactive Route Diagram** dạng mạch điện tử:
    ```
    [VN HAN·SGN] ──Linehaul──→ [HUB US·UK] ──Last Mile──→ [US Gold Delivery]
    [CN GZH·SHZ]
    ```
  - Thêm một dải highlight màu gold: *"Cắt giảm triệt để 10–20 ngày transit time bằng cách inject thẳng vào carrier nội địa Mỹ."*
- **Cell 02, 03, 04 (Grid phụ):** 
  - Cell 02: **Chi phí sản xuất & Basecost** (Minh họa bằng icon tinh tế và con số tối ưu margin).
  - Cell 03: **Quản lý SKU & Đơn hàng thủ công** (Giao diện giả lập dòng lệnh / CSV sync thu nhỏ).
  - Cell 04: **Hỗ trợ & Minh bạch tài chính** (Cam kết không phí ẩn, Hub prepaid wallet).
  - *Hiệu ứng:* Mỗi khi hover vào từng cell, viền border chuyển sang màu Gold nhạt (`border-thg-gold/40`) kèm hiệu ứng ánh sáng tỏa nhẹ.

---

### 2.3. Operational System Schematic (Quy trình 5 Giai Đoạn)
- **Mục đích:** Khẳng định THG vận hành bằng **hệ thống tự động hóa**, không phải làm thủ công thủ công.
- **Visual Design:** 
  - Thay vì các hoạt ảnh 3D rối mắt, sử dụng **Horizontal Pipeline Schematic** (trên desktop) với các node kết nối bằng đường line sáng mảnh.
  - 5 Giai đoạn: `01 ORDER (Portal/CSV)` → `02 PRODUCE (DTG/DTF - VN·CN·US)` → `03 FULFILL (QC Gate ✓)` → `04 SHIP (Carrier Inject)` → `05 DELIVER (Hub System & Tracking)`.
  - Giai đoạn `03 FULFILL` có badge nổi bật: **[✓ QC Gate: Loại bỏ lỗi in ấn trước khi xuất xưởng]**.

---

### 2.4. Product Scope & Capabilities Grid (Danh mục sản phẩm & Xuất xứ)
- **Visual Design:** 
  - Các card sản phẩm (Apparel, Footwear, Accessories, Home Decor) thiết kế theo phong cách editorial cao cấp: Ảnh sản phẩm sắc nét, nền tối mờ, có **Origin Badge** (ví dụ: `US Hub Stock`, `VN Factory`) và **Technique Tags** (`DTG`, `DTF`, `Sublimation`).
  - Hiệu ứng zoom ảnh nhẹ khi hover (`group-hover:scale-105 transition-transform duration-500`).

---

### 2.5. High-Impact CTA & Consult Section (Điểm chuyển đổi cốt lõi)
- **Visual Design:** 
  - Khối banner full-width nằm giữa trang với viền sáng gold tinh tế, tách biệt hẳn với phần nội dung thông tin.
  - Nội dung thuyết phục: *"Bạn đã sẵn sàng scale hệ thống fulfillment tại Mỹ mà không lo tồn kho?"*
  - Nút **[Tư vấn ngay]** kích hoạt `ConsultOverlay` (DiscoveryWizard) mượt mà.

---

## 3. Micro-interactions & CSS Polish Checklist cho Antigravity

1. **Smooth Hover States:** Mọi card và bento cell đều phải có `transition-all duration-300 ease-in-out` với sự thay đổi nhẹ của border color (`border-thg-border` sang `border-thg-gold/50`).
2. **Backdrop Blurs:** Các overlay, header navigation và modal sử dụng `backdrop-blur-md bg-thg-bg/80`.
3. **Custom Scrollbars:** Thanh cuộn tinh gọn màu tối với thumb màu `#23262F`.
4. **Interactive Focus Ring:** Đảm bảo khả năng truy cập (Accessibility) với `focus:ring-2 focus:ring-thg-gold focus:outline-none` cho mọi button và input.
