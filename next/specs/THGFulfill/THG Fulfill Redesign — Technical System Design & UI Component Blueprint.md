# THG Fulfill Redesign — Technical System Design & UI Component Blueprint

Tài liệu này cung cấp **Design Tokens, Layout Grids, Component Architecture và State Machine Specifications** chi tiết để Antigravity (hoặc lập trình viên Frontend) trực tiếp hiện thực hóa bằng TailwindCSS, React và Next.js App Router.

---

## 1. Design Tokens & Visual Styling (Industrial B2B Aesthetic)

Trang web tuân theo phong cách **Industrial, Premium, Physical, Restrained** (Tối giản công nghiệp, sắc sảo, đáng tin cậy). Tránh hoàn toàn phong cách SaaS dashboard thông thường hay survey progress bar sặc sỡ.

### 1.1. Color Palette (Tailwind CSS Extended Tokens)
```ts
// tailwind.config.ts extension references
colors: {
  thg: {
    bg: '#0A0B0E',         // Deep industrial dark background
    surface: '#12141A',    // Card / Bento surface background
    border: '#23262F',     // Muted structural border
    borderHover: '#3A3F4E',// Active / hover border
    gold: '#D4AF37',       // Primary accent & highlight gold
    goldMuted: 'rgba(212, 175, 55, 0.15)', // Accent background tint
    textPrimary: '#F4F5F7',// Main headings & high-emphasis text
    textMuted: '#9BA1A6',  // Subtitles & descriptions
    accentCyan: '#38BDF8', // Tech / process highlight tag
  }
}
```

### 1.2. Typography Scale
- **Display / Hero Headline:** `font-serif tracking-tight text-4xl lg:text-6xl font-bold text-thg-textPrimary`
- **Section Heading:** `font-serif text-2xl lg:text-3xl text-thg-textPrimary`
- **Card Title / Wizard Question:** `font-sans text-lg lg:text-xl font-semibold text-thg-textPrimary`
- **Body / Description:** `font-sans text-sm lg:text-base text-thg-textMuted leading-relaxed`
- **Tech / Meta Tags:** `font-mono text-xs uppercase tracking-wider text-thg-gold`

---

## 2. Layout Grid & Component Architecture

### 2.1. Public Page Layout (`src/app/[lang]/(marketing)/thg-fulfill/page.tsx`)
Loại bỏ hoàn toàn `PlanSection`. Cấu trúc DOM tuần tự:
```tsx
export default function ThgFulfillPage() {
  return (
    <main className="min-h-screen bg-thg-bg text-thg-textPrimary selection:bg-thg-gold selection:text-black">
      <HeroSection />          {/* 01. Hero with stat bar */}
      <PainBentoSection />     {/* 02. Bento Grid + Route Diagram in Cell 01 */}
      <CapabilitySection />    {/* 03. DTG/DTF & QC Standards */}
      <ProcessSchematic />     {/* 04. 5-Stage Operational Pipeline Schematic */}
      <ConsultCTASection />    {/* 05. High-impact CTA banner opening ConsultOverlay */}
      <ScopeSection />         {/* 06. Product Catalog & Origin Badges */}
      <EcosystemSection />     {/* 07. Partner & Ecosystem proof */}
      
      {/* Global Overlay Controller */}
      <ConsultOverlay />
    </main>
  );
}
```

### 2.2. ConsultCTASection (`src/features/fulfill/ui/consult-cta-section.tsx`)
Section kêu gọi hành động đặt ngay trước ScopeSection:
- **Layout:** Full-width container với border-top/bottom tinh tế, background gradient nhẹ (`bg-gradient-to-r from-thg-surface via-[#181B22] to-thg-surface`).
- **Content:** 
  - Eyebrow: `// BESPOKE FULFILLMENT CONSULTATION`
  - Headline: *"Nhận kế hoạch fulfillment cho business của bạn — trong 60 giây"*
  - Action Button: Nút lớn cao cấp với viền gold glow nhẹ, click trigger `window.history.pushState({}, '', '?consult=open')` hoặc State setter mở `ConsultOverlay`.

---

## 3. ConsultOverlay & DiscoveryWizard Technical Specification

### 3.1. Overlay Shell (`src/features/fulfill/ui/consult-overlay.client.tsx`)
- **HTML Element:** Native `<dialog>` hoặc `div` fixed backdrop với `role="dialog" aria-modal="true"`.
- **Behavior:** 
  - Lắng nghe search param `?consult=open` (hoặc React state local đồng bộ URL).
  - Esc key close & Click backdrop close.
  - Animation: Fade-in backdrop + Scale-in modal container (`duration-300 ease-out`).
- **Layout Structure:**
  - Header: Logo / Tiêu đề *"THG Fulfill — Tư vấn giải pháp"* + Bước hiện tại (ví dụ: *Bước 2 / 5*) + Nút Close (X) chuẩn icon.
  - Body (Dynamic Switch): Render `DiscoveryWizard` hoặc `SalesBriefSummary` tùy theo step state.

### 3.2. DiscoveryWizard Engine (`src/features/fulfill/ui/discovery-wizard.tsx`)
Quản lý state gồm các câu hỏi cấu trúc B2B:

```ts
export interface WizardStep {
  id: string;
  question: string;
  subtitle?: string;
  type: 'single' | 'multi';
  options: { label: string; value: string; icon?: string; description?: string }[];
}
```

#### Dữ liệu câu hỏi chuẩn (`wizard-steps.data.ts`):
1. **Model:** *"Mô hình kinh doanh chính của bạn là gì?"* (Options: POD - Print on Demand, Dropship sỉ/lẻ, Fulfill kho US/UK, Mix đa mô hình).
2. **Platform:** *"Bạn đang bán hàng trên nền tảng nào?"* [Multi-Select] (Options: Etsy, TikTok Shop, Shopify, Amazon, eBay, Khác).
3. **Market:** *"Thị trường tiêu thụ chính của bạn?"* (Options: US (Mỹ), UK (Anh), EU (Châu Âu), Worldwide).
4. **Volume:** *"Sản lượng đơn hàng dự kiến hàng tháng?"* (Options: Mới bắt đầu (<100 đơn), Growth (100–500 đơn), Scale (500–2,000 đơn), Enterprise (>2,000 đơn)).
5. **Pain Points:** *"Đâu là điểm nghẽn lớn nhất bạn gặp phải hiện tại?"* [Multi-Select] (Options: Thời gian ship chậm / hủy đơn, Sai sót SKU / quản lý thủ công, Basecost cao / thiếu cạnh tranh, Thiếu kiểm soát QC / đóng gói).

#### UI/UX Specs cho Wizard Card:
- **Card Option:** Grid 2 cột trên desktop, 1 cột trên mobile. Mỗi option là một card nền `#12141A`, border `#23262F`, khi chọn sẽ đổi border thành `#D4AF37` và background tint `rgba(212,175,55,0.08)`, xuất hiện tick icon góc trên phải.
- **Navigation Footer:** 
  - Nút **[Quay lại]** (ẩn ở bước 1).
  - Progress indicator dạng dot hoặc thanh line mảnh màu gold.
  - Nút **[Tiếp tục →]** (Disable nếu chưa chọn option ở câu single-select).

---

## 4. Sales Brief Summary (Sales Dossier) & Embedded Lead Form

### 4.1. SalesBriefSummary Component (`src/features/fulfill/ui/sales-brief-summary.tsx`)
Ở bước cuối cùng (sau khi hoàn tất 5 bước câu hỏi), thay vì hiện form trống, hệ thống render một **"Confidential Sales Dossier Card"**:
- **Design Layout:** Giao diện giống một báo cáo phân tích nội bộ thu nhỏ, đóng khung viền gold mảnh, header ghi rõ `[CONFIDENTIAL SALES DOSSIER — GENERATED FOR SELLER]`.
- **Data Mapping:** Tự động tổng hợp dữ liệu seller vừa chọn thành dạng key-value pairs tinh gọn:
  - *Business Model:* POD / Etsy & TikTok Shop
  - *Target Market & Scale:* US Market · 500–2,000 orders/mo
  - *Primary Friction:* Transit time & SKU management
  - *Recommended THG Protocol:* Direct US Hub Routing + Item-level QC + CSV Portal Intake.
- **Tác dụng UX:** Seller thấy ngay THG đã thấu hiểu tường tận bài toán của họ trước khi họ cung cấp danh tính.

### 4.2. Embedded Lead Form (`src/features/fulfill/ui/embedded-lead-form.tsx`)
Được nhúng **trực tiếp ngay bên dưới** Sales Dossier (không dùng popup chồng popup):
- **Fields:**
  - Tên liên hệ / Tên Shop (`input text`, placeholder: *"Tên của bạn hoặc Tên Shop"*)
  - Email (`input email`, placeholder: *"email@domain.com"*)
  - Số điện thoại / Zalo / Telegram (`input text`, placeholder: *"SĐT hoặc Telegram Username"*)
- **Submit Action:** 
  - Button chính: **[Gửi hồ sơ & Nhận tư vấn chuyên sâu]** (màu Gold `#D4AF37`, text đen, hover glow).
  - Trạng thái Success: Chuyển đổi container sang trạng thái "Hồ sơ đã được tiếp nhận — Chuyên viên THG sẽ liên hệ trong vòng 15 phút qua [Kênh liên lạc]".

---

## 5. Hướng Dẫn Tích Hợp Cho Antigravity (Implementation Checklist)

1. **Clean up Route:** Mở `src/app/[lang]/(marketing)/thg-fulfill/page.tsx`, xóa bỏ hoàn toàn `PlanSection` và import liên quan.
2. **Inject CTA:** Thêm `ConsultCTASection` vào trước `ScopeSection`.
3. **Build Overlay & Wizard:** Tạo thư mục `src/features/fulfill/ui/` với các file:
   - `consult-overlay.client.tsx` (Quản lý dialog state & URL sync).
   - `discovery-wizard.tsx` (Render logic 5 bước, multi-select state).
   - `sales-brief-summary.tsx` (Render dossier card tổng hợp).
   - `embedded-lead-form.tsx` (Form nhập tên/sđt cuối luồng).
4. **Tailwind Verification:** Đảm bảo các token màu `thg-bg`, `thg-surface`, `thg-border`, `thg-gold` đã được định nghĩa đúng trong `tailwind.config.ts`.
