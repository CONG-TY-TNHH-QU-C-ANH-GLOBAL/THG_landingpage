import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";

import { useCmsTranslations } from "@/hooks/useCmsContent";

export type Language = "en" | "vi" | "zh";

type Translations = Record<string, Record<Language, string>>;

// Exported so a one-shot CMS import script can read this dictionary and
// generate a migration that seeds D1 `translations` with the same values.
// Operator can then override per-key via /admin/content/translations and
// landing's `useCmsTranslations` hook merges the override over this static
// fallback.
export const translations: Translations = {
  // Navbar
  "nav.services": { en: "Services", vi: "Dịch vụ", zh: "服务" },
  "nav.pricing": { en: "Pricing list", vi: "Bảng giá", zh: "价格" },
  "nav.intl_pricing": { en: "International Pricing", vi: "Bảng giá Quốc tế", zh: "国际运费" },
  "nav.intl_pricing_desc": { en: "Transparent rates for VN/CN → US/UK/EU shipping", vi: "Cước phí minh bạch cho tuyến VN/CN → US/UK/EU", zh: "越南/中国到美国/英国/欧盟的透明运费" },
  "nav.domestic_pricing": { en: "US Domestic Pricing", vi: "Giá nội địa Mỹ", zh: "国内运费" },
  "nav.domestic_pricing_desc": { en: "US domestic shipping rates by delivery zone", vi: "Biểu giá theo vùng giao hàng nội địa Mỹ", zh: "美国国内按区域运费" },
  "nav.policy": { en: "Policy", vi: "Chính sách", zh: "政策" },
  "nav.news": { en: "Blog", vi: "Blog", zh: "Blog" },
  "nav.tracking": { en: "Tracking", vi: "Theo dõi đơn", zh: "订单追踪" },
  "nav.faq": { en: "Q&A", vi: "Q&A", zh: "问答" },
  "nav.consult": { en: "Get Started", vi: "Tư vấn ngay", zh: "立即咨询" },
  "nav.thg_fulfill": { en: "THG Fulfill", vi: "THG Fulfill", zh: "THG Fulfill" },
  "nav.thg_express": { en: "THG Express", vi: "THG Express", zh: "THG Express" },
  "nav.thg_warehouse": { en: "THG Warehouse", vi: "THG Warehouse", zh: "THG Warehouse" },
  "nav.thg_order": { en: "THG Dropship", vi: "THG Dropship", zh: "THG代发" },
  "nav.careers": { en: "Careers", vi: "Tuyển dụng", zh: "招骋" },
  "nav.fulfill_desc": { en: "POD & Dropship with competitive base pricing", vi: "POD & Dropship với chi phí gốc cạnh tranh", zh: "具有竞争力的POD和代发" },
  "nav.express_desc": { en: "International shipping VN/CN → US/UK/EU", vi: "Vận chuyển quốc tế VN/CN → US/UK/EU", zh: "国际运输 VN/CN → US/UK/EU" },
  "nav.warehouse_desc": { en: "US warehouse & domestic fulfillment from $1.2", vi: "Kho & fulfill nội địa Mỹ từ 1.2$", zh: "美国仓储及履约低至1.2美元" },
  "nav.order_desc": { en: "Buy from Taobao/1688, ship direct to USA", vi: "Mua hàng từ Taobao/1688, giao thẳng đến Mỹ", zh: "淘宝/1688代购直邮美国" },

  // Hero
  "nav.catalog": { en: "Product Catalog", vi: "Catalog Mẫu Sản Phẩm", zh: "产品目录" },
  "nav.catalog_desc": { en: "Browse POD items, apparel & accessories", vi: "Xem chi tiết áo thun, hoodie, phụ kiện POD", zh: "浏览POD商品、服装及配件" },

  "catalog_page.title": { en: "Product Catalog", vi: "Catalog Mẫu Sản Phẩm", zh: "产品目录" },
  "catalog_page.subtitle": { en: "Explore our comprehensive range of high-quality products ready for customization and global shipping.", vi: "Khám phá danh mục các sản phẩm chất lượng cao sẵn sàng cho in ấn (POD) và vận chuyển toàn cầu.", zh: "探索我们为定制和全球运输准备的全系列高质量产品。" },
  "catalog_page.filter_all": { en: "All Products", vi: "Tất cả", zh: "所有产品" },

  "consent.aria_label": { en: "Cookie consent", vi: "Đồng ý cookie", zh: "Cookie 同意" },
  "consent.message": {
    en: "We use cookies to improve your experience and analyze traffic. You can accept or reject analytics tracking.",
    vi: "Chúng tôi sử dụng cookie để cải thiện trải nghiệm và phân tích traffic. Bạn có thể chấp nhận hoặc từ chối tracking analytics.",
    zh: "我们使用 Cookie 来改善您的体验并分析流量。您可以接受或拒绝分析跟踪。",
  },
  "consent.accept": { en: "Accept", vi: "Đồng ý", zh: "同意" },
  "consent.reject": { en: "Reject", vi: "Từ chối", zh: "拒绝" },

  "hero.badge": { en: "Vietnam + China ops, 4 warehouses in 3 countries", vi: "Vận hành Việt Nam + Trung Quốc, 4 kho tại 3 quốc gia", zh: "越南+中国联运，3国4仓" },
  "hero.title1": { en: "Vietnam-to-Global", vi: "Fulfillment", zh: "越南到全球" },
  "hero.title_highlight": { en: "Fulfillment", vi: "vận chuyển quốc tế", zh: "Fulfillment" },
  "hero.title2": { en: "Engineered for", vi: "xuyên biên giới cho", zh: "履约伙伴，服务" },
  "hero.title3": { en: "Cross-Border Sellers", vi: "seller TMĐT", zh: "跨境电商卖家" },
  "hero.subtitle": { en: "Scale with a Vietnam-first network: sourcing in VN/CN, linehaul to US/EU/UK, and domestic fulfill from $1.2 with transparent SLAs.", vi: "Tăng trưởng với mạng lưới lấy Việt Nam làm trung tâm: sourcing VN/CN, linehaul đi US/EU/UK và fulfill nội địa Mỹ từ $1.2 với SLA minh bạch.", zh: "以越南为核心网络实现增长：VN/CN采购、干线到US/EU/UK，并提供$1.2起美国本土履约与透明SLA。" },
  "hero.cta": { en: "Catalog site", vi: "Tham khảo catalog", zh: "浏览产品目录" },
  "hero.learn_more": { en: "Learn More", vi: "Tìm hiểu thêm", zh: "了解更多" },
  "hero.feature1": { en: "Product sourcing", vi: "Tìm nguồn cung ứng sản phẩm", zh: "产品采购" },
  "hero.feature2": { en: "POD products", vi: "Sản phẩm POD", zh: "POD产品" },
  "hero.feature3": { en: "Warehouse management", vi: "Quản lý kho hàng", zh: "仓库管理" },
  "hero.feature4": { en: "International shipping US, UK, EU", vi: "Vận chuyển quốc tế Mỹ, Anh, EU", zh: "全球运输 US, UK, EU" },
  "hero.delivery_days": { en: "delivery days", vi: "ngày giao hàng", zh: "交货天数" },
  "hero.warehouses": { en: "warehouses in 3 countries", vi: "kho ở cả 3 quốc gia", zh: "3个国家的仓库" },
  "hero.us_fulfill": { en: "US domestic fulfill", vi: "Fulfill nội địa Mỹ", zh: "美国国内履约" },

  // Tracking Page
  "tracking.title": { en: "Track Your Shipment", vi: "Theo Dõi Đơn Hàng", zh: "追踪您的包裹" },
  "tracking.subtitle": {
    en: "Enter your order ID to check the latest shipping status.",
    vi: "Nhập mã đơn để kiểm tra trạng thái vận chuyển mới nhất.",
    zh: "输入订单编号以查看最新物流状态。"
  },
  "tracking.input_label": { en: "Order ID", vi: "Mã đơn hàng", zh: "订单编号" },
  "tracking.input_placeholder": { en: "Example: THG-2026-000123", vi: "Ví dụ: THG-2026-000123", zh: "例如：THG-2026-000123" },
  "tracking.submit": { en: "Track now", vi: "Tra cứu ngay", zh: "立即查询" },
  "tracking.submitting": { en: "Checking...", vi: "Đang kiểm tra...", zh: "查询中..." },
  "tracking.result_title": { en: "Tracking Result", vi: "Kết quả tra cứu", zh: "查询结果" },
  "tracking.lookup_unavailable": {
    en: "Live lookup API is not configured yet. Please contact support and provide your order ID.",
    vi: "API tra cứu realtime chưa được cấu hình. Vui lòng liên hệ hỗ trợ và cung cấp mã đơn.",
    zh: "实时查询接口尚未配置。请联系客服并提供订单编号。"
  },
  "tracking.invalid_order_id": {
    en: "Please enter your order ID before searching.",
    vi: "Vui lòng nhập mã đơn trước khi tra cứu.",
    zh: "请先输入订单编号。"
  },
  "tracking.contact_support": { en: "Contact support", vi: "Liên hệ hỗ trợ", zh: "联系支持" },
  "tracking.no_data": { en: "No tracking data found for this order ID.", vi: "Không tìm thấy dữ liệu cho mã đơn này.", zh: "未找到该订单编号的物流数据。" },
  "tracking.request_failed": { en: "Lookup failed. Please try again later.", vi: "Tra cứu thất bại. Vui lòng thử lại sau.", zh: "查询失败，请稍后重试。" },

  // Services (updated for 3 cards)
  "services.subtitle": { en: "Our Services", vi: "Dịch vụ của chúng tôi", zh: "我们的服务" },
  "services.title": { en: "Complete the", vi: "Hoàn thiện hệ sinh thái", zh: "一站式" },
  "services.title_highlight": { en: "A-Z", vi: "A-Z", zh: "Fulfill A-Z" },
  "services.title2": { en: "Ecosystem", vi: "", zh: "生态系统" },
  "services.tagline": { en: "Seamlessly connecting from Vietnam – China – to US warehouses", vi: "Kết nối liền mạch từ Việt Nam – Trung Quốc – đến tận kho Mỹ", zh: "从越南-中国无缝连接到美国仓库" },
  "services.learn_more": { en: "Learn more", vi: "Tìm hiểu thêm", zh: "了解更多" },

  // Seller Types
  "sellers.subtitle": { en: "Who We Serve", vi: "Chúng tôi phục vụ ai?", zh: "我们服务的对象" },
  "sellers.title": { en: "For Every", vi: "Dành cho mọi", zh: "适合每一位" },
  "sellers.title_highlight": { en: "Seller", vi: "người bán hàng", zh: "卖家" },
  "sellers.t1_title": { en: "New Sellers", vi: "Người mới bắt đầu", zh: "新手卖家" },
  "sellers.t1_desc": { en: "A-Z support for newcomers entering cross-border eCommerce.", vi: "Hỗ trợ A-Z cho người mới bước vào eCommerce xuyên biên giới.", zh: "为跨境电商新手提供全方位支持。" },
  "sellers.t2_title": { en: "Scaling Sellers", vi: "Seller đang mở rộng", zh: "成长型卖家" },
  "sellers.t2_desc": { en: "Optimize costs and processes for rapid growth.", vi: "Tối ưu chi phí và quy trình để tăng trưởng nhanh chóng.", zh: "优化成本和流程，实现快速增长。" },
  "sellers.t3_title": { en: "Team Sellers", vi: "Seller theo nhóm/team", zh: "团队卖家" },
  "sellers.t3_desc": { en: "Warehouse and fulfillment solutions for professional teams.", vi: "Giải pháp kho và fulfill cho các nhóm chuyên nghiệp.", zh: "为专业团队提供仓储和履约解决方案。" },
  "sellers.t4_title": { en: "Brand & DTC", vi: "Thương hiệu & DTC", zh: "品牌 & DTC" },
  "sellers.t4_desc": { en: "Build your own brand with premium fulfillment.", vi: "Xây dựng thương hiệu riêng với dịch vụ fulfill cao cấp.", zh: "通过优质履约服务打造您的品牌。" },

  // Process
  "process.subtitle": { en: "How It Works", vi: "Quy trình", zh: "如何运作" },
  "process.title": { en: "Get Started in", vi: "Bắt đầu chỉ với", zh: "仅需" },
  "process.title_highlight": { en: "4 Steps", vi: "4 bước", zh: "4步" },
  "process.s1_title": { en: "Register & Consult", vi: "Đăng ký & Tư vấn", zh: "注册 & 咨询" },
  "process.s1_desc": { en: "Contact THG team for tailored fulfillment solutions.", vi: "Liên hệ đội ngũ THG để được tư vấn giải pháp fulfill phù hợp.", zh: "联系THG团队获取定制解决方案。" },
  "process.s2_title": { en: "Ship to Warehouse", vi: "Gửi hàng đến kho", zh: "发货至仓库" },
  "process.s2_desc": { en: "Ship products to THG warehouses in Vietnam or China.", vi: "Vận chuyển sản phẩm đến kho THG tại Việt Nam hoặc Trung Quốc.", zh: "将产品发送至越南或中国的THG仓库。" },
  "process.s3_title": { en: "Order Processing", vi: "Xử lý đơn hàng", zh: "订单处理" },
  "process.s3_desc": { en: "Automated order processing, packaging and preparation.", vi: "Tự động xử lý đơn, đóng gói và chuẩn bị hàng.", zh: "自动化订单处理、包装和准备。" },
  "process.s4_title": { en: "Global Delivery", vi: "Giao hàng toàn cầu", zh: "全球配送" },
  "process.s4_desc": { en: "Products delivered to customers worldwide.", vi: "Sản phẩm được giao đến tay khách hàng trên toàn thế giới.", zh: "产品运送至全球客户手中。" },

  // Advantages
  "adv.subtitle": { en: "Why THG", vi: "Tại sao chọn THG", zh: "为什么选择THG" },
  "adv.title": { en: "Unmatched", vi: "Lợi thế", zh: "无与伦比的" },
  "adv.title_highlight": { en: "Advantages", vi: "vượt trội", zh: "优势" },
  "adv.a1_title": { en: "Cost Optimized", vi: "Tối ưu chi phí", zh: "成本优化" },
  "adv.a1_desc": { en: "Most competitive pricing on the market, US domestic fulfillment from $1.2.", vi: "Mức giá cạnh tranh nhất thị trường, fulfill nội địa Mỹ từ 1.2$.", zh: "最具竞争力的价格，美国国内履约低至1.2美元。" },
  "adv.a2_title": { en: "Fast Delivery", vi: "Giao hàng nhanh", zh: "快速配送" },
  "adv.a2_desc": { en: "5–8 days to EU, 3–5 days US domestic.", vi: "5–8 ngày đến EU, 3–5 ngày nội địa Mỹ.", zh: "5-8天到欧盟，3-5天美国国内。" },
  "adv.a3_title": { en: "Global Coverage", vi: "Phủ sóng toàn cầu", zh: "全球覆盖" },
  "adv.a3_desc": { en: "Warehouses in 3 countries: Vietnam, China, USA.", vi: "Kho hàng tại 3 quốc gia: Việt Nam, Trung Quốc, Mỹ.", zh: "3个国家的仓库：越南、中国、美国。" },
  "adv.a4_title": { en: "Safe & Reliable", vi: "An toàn & Đáng tin cậy", zh: "安全可靠" },
  "adv.a4_desc": { en: "Cargo insurance, 100% compensation for lost items.", vi: "Bảo hiểm hàng hóa, đền bù 100% hàng thất lạc.", zh: "货物保险，丢失100%赔偿。" },
  "adv.a5_title": { en: "Modern Technology", vi: "Công nghệ hiện đại", zh: "现代技术" },
  "adv.a5_desc": { en: "Automated order management, realtime tracking.", vi: "Hệ thống quản lý đơn hàng tự động, realtime tracking.", zh: "自动化订单管理，实时追踪。" },
  "adv.a6_title": { en: "24/7 Support", vi: "Hỗ trợ 24/7", zh: "24/7支持" },
  "adv.a6_desc": { en: "Vietnamese-speaking support team available anytime.", vi: "Đội ngũ hỗ trợ nói tiếng Việt, sẵn sàng mọi lúc.", zh: "越南语支持团队随时为您服务。" },

  // FAQ
  "faq.subtitle": { en: "Frequently Asked Questions", vi: "Câu hỏi thường gặp", zh: "常见问题" },
  "faq.q1": { en: "Who is THG Fulfill for?", vi: "THG Fulfill phù hợp với ai?", zh: "THG Fulfill适合谁？" },
  "faq.a1": { en: "THG Fulfill is suitable for all eCommerce sellers, from beginners to large brands looking to expand internationally.", vi: "THG Fulfill phù hợp với tất cả các seller eCommerce, từ người mới bắt đầu đến các brand lớn muốn mở rộng thị trường quốc tế.", zh: "THG Fulfill适合所有电商卖家，从新手到希望拓展国际市场的大品牌。" },
  "faq.q2": { en: "What are the fulfillment costs?", vi: "Chi phí fulfillment như thế nào?", zh: "履约费用是多少？" },
  "faq.a2": { en: "US domestic fulfillment starts from just $1.2/order. Specific pricing depends on product size, weight and order volume. Contact THG for a detailed quote.", vi: "Chi phí fulfill nội địa US chỉ từ 1.2$/đơn hàng. Giá cụ thể phụ thuộc vào kích thước, trọng lượng và khối lượng đơn. Liên hệ THG để nhận báo giá chi tiết.", zh: "美国国内履约低至1.2美元/单。具体价格取决于产品尺寸、重量和订单量。联系THG获取详细报价。" },
  "faq.q3": { en: "What are the delivery times?", vi: "Thời gian giao hàng bao lâu?", zh: "配送时间是多久？" },
  "faq.a3": { en: "US domestic: 3-5 business days. EU: 5-8 days. UK: 5-7 days.", vi: "Nội địa US: 3-5 ngày. EU: 5-8 ngày. UK: 5-7 ngày.", zh: "美国国内：3-5个工作日。欧盟：5-8天。英国：5-7天。" },
  "faq.q4": { en: "Does THG support Print on Demand?", vi: "THG có hỗ trợ Print on Demand không?", zh: "THG是否支持按需印刷？" },
  "faq.a4": { en: "Yes, THG provides POD services with diverse products and premium print quality.", vi: "Có, THG cung cấp dịch vụ POD với đa dạng sản phẩm và chất lượng in ấn cao cấp.", zh: "是的，THG提供多样化产品和优质印刷质量的POD服务。" },
  "faq.q5": { en: "How do I get started?", vi: "Làm thế nào để bắt đầu?", zh: "如何开始？" },
  "faq.a5": { en: "Register an account, ship products to THG warehouse and start selling. THG team supports from A to Z.", vi: "Đăng ký tài khoản, gửi hàng về kho THG và bắt đầu bán. Đội ngũ THG hỗ trợ từ A-Z.", zh: "注册账户，将产品发送到THG仓库即可开始销售。THG团队全程支持。" },

  // Contact
  "contact.subtitle": { en: "Contact Us", vi: "Kết nối với THG", zh: "联系我们" },
  "contact.title": { en: "Start Your", vi: "Bắt đầu", zh: "开始您的" },
  "contact.title_highlight": { en: "Journey", vi: "hành trình", zh: "旅程" },
  "contact.title2": { en: "with THG", vi: "cùng THG", zh: "与THG" },
  "contact.submit": { en: "Submit Inquiry", vi: "Đăng ký tư vấn miễn phí", zh: "提交咨询" },
  "contact.offices_title": { en: "Offices & Warehouses", vi: "Văn phòng & Kho hàng", zh: "办公室和仓库" },
  "contact.cta_title": { en: "Ready to scale?", vi: "Sẵn sàng scale?", zh: "准备扩展？" },
  "contact.cta_desc": { en: "15% OFF for first 50 orders. Support team will contact you within 24h.", vi: "Ưu đãi 15% cho 50 đơn hàng đầu tiên. Đội ngũ support sẽ liên hệ bạn trong 24h.", zh: "前50单享85折。支持团队将在24小时内联系您。" },

  // ── Careers Page ──
  "careers.hero_subtitle": { en: "At THG Fulfill, we don't just look for employees, we look for partners who share the same vision to conquer global eCommerce.", vi: "Tại THG Fulfill, chúng tôi không chỉ tìm người làm việc, mà tìm những đối tác đồng hành chia sẻ tầm nhìn chinh phục eCommerce toàn cầu.", zh: "在 THG Fulfill，我们不只是寻找员工，更寻找志同道合、共同征服全球电子商务的合作伙伴。" },

  "careers.why1_title": { en: "International Environment", vi: "Môi trường quốc tế", zh: "国际化环境" },
  "careers.why1_desc": { en: "Work closely with customers, suppliers and partners across VN, China, US, and EU every day.", vi: "Làm việc với khách hàng, supplier và đối tác tại VN, TQ, Mỹ và Châu Âu mỗi ngày.", zh: "每天与越南、中国、美国和欧洲的客户、供应商及合作伙伴密切合作。" },
  "careers.why2_title": { en: "Grow with the Company", vi: "Tăng trưởng cùng công ty", zh: "与公司共成长" },
  "careers.why2_desc": { en: "Join THG during its scale-up phase — clear career progression and promotion opportunities.", vi: "Gia nhập THG ở giai đoạn scale-up — cơ hội thăng tiến rõ ràng, lộ trình phát triển minh bạch.", zh: "在拓展期加入THG——获得清晰的职业发展路线和定期的晋升机会。" },
  "careers.why3_title": { en: "Professional Training", vi: "Đào tạo bài bản", zh: "系统化培训" },
  "careers.why3_desc": { en: "Deep-dive training in E-commerce, international logistics, and POD/Dropship from industry experts.", vi: "Được đào tạo chuyên sâu về E-commerce, logistics quốc tế, POD/Dropship từ đội ngũ chuyên gia.", zh: "由行业专家提供跨境电商、国际物流、POD/代发等领域的深入培训。" },
  "careers.why4_title": { en: "The \"Happiness\" Culture", vi: "Văn hóa \"Happiness\"", zh: "“Happiness” 文化" },
  "careers.why4_desc": { en: "Annual company trips, 13th-month bonus, and a vibrant, respectful, and open culture.", vi: "Company Trip hàng năm, thưởng tháng 13, môi trường trẻ trung, cởi mở, tôn trọng cá nhân.", zh: "年度旅游、十三薪，以及充满活力、尊重个人和开放包容的工作环境。" },

  "careers.pos_eyebrow": { en: "Open Positions", vi: "Open Positions", zh: "开放职位" },
  "careers.pos_title": { en: "Current", vi: "Vị trí", zh: "当前" },
  "careers.pos_title_highlight": { en: "Openings", vi: "đang tuyển", zh: "招聘职位" },
  "careers.pos_desc": { en: "7 positions across 5 departments. Find the right role for you and join us today.", vi: "7 vị trí trải dài 5 bộ phận. Tìm vai trò phù hợp với bạn và gia nhập THG ngay hôm nay.", zh: "覆盖 5 个部门的 7 个职位。寻找适合您的角色，立即加入我们。" },
  "careers.filter_all": { en: "All", vi: "Tất cả", zh: "全部" },
  "careers.filter_ai": { en: "AI / R&D", vi: "AI / R&D", zh: "AI / 研发" },
  "careers.filter_acc": { en: "Accounting", vi: "Kế toán", zh: "财务" },
  "careers.filter_sale": { en: "Sale / CS", vi: "Sale / CSKH", zh: "销售 / 客服" },
  "careers.filter_ops": { en: "Operations", vi: "Vận hành", zh: "运营" },
  "careers.filter_src": { en: "Sourcing & Quotes", vi: "Sourcing & Báo giá", zh: "采购与报价" },
  "careers.hot": { en: "HOT · NEW", vi: "HOT · MỚI", zh: "最热 · 新增" },

  "careers.path_eyebrow": { en: "Career Path", vi: "Career Path", zh: "职业发展路径" },
  "careers.path_title_1": { en: "Development Map for", vi: "Lộ trình phát triển cho", zh: "晋升路径：" },
  "careers.path_title_2": { en: "Sales & Customer Support", vi: "Sale & Chăm sóc khách hàng", zh: "销售与客服" },
  "careers.path_desc": { en: "At THG, Sales and Customer Support (CSKH) go hand-in-hand. You can start from CSKH to learn our products and systems. Once you have a strong foundation, you can transition into Sales to increase your income potential.", vi: "Tại THG, Sale và CSKH có nghiệp vụ gắn kết chặt chẽ — ai làm ở THG cũng phải biết Sale. Bạn có thể bắt đầu từ CSKH để học sản phẩm, quy trình và khách hàng; khi nghiệp vụ đã cứng, bạn sẽ được chuyển lên vị trí Sale với thu nhập tăng theo.", zh: "在 THG，销售与客服业务紧密相连。您可以从客服做起，了解产品和客户，随着业务能力在工作中成熟，可以转为销售，以获得更高的收入。" },

  "careers.p1_title": { en: "Customer Support", vi: "Chăm sóc khách hàng", zh: "客户支持 (CS)" },
  "careers.p1_time": { en: "MONTHS 1 – 6", vi: "THÁNG 1 – 6", zh: "第 1 – 6 个月" },
  "careers.p1_desc": { en: "Learn products, processes, and system operations. Receive and handle daily customer requests.", vi: "Học sản phẩm, quy trình, thao tác hệ thống. Tiếp nhận & xử lý yêu cầu khách hàng hàng ngày.", zh: "学习产品、流程和系统操作。接收并处理客户的日常请求。" },
  "careers.p2_title": { en: "Sales Account Manager", vi: "Sale", zh: "销售经理 (Sale)" },
  "careers.p2_time": { en: "MONTHS 3 – 6", vi: "SAU 3 – 6 THÁNG", zh: "3 – 6 个月后" },
  "careers.p2_desc": { en: "With solid expertise, become a Sales rep — proactively develop new client bases and enjoy higher commissions.", vi: "Khi nghiệp vụ cứng, chuyển lên Sale — chủ động phát triển khách hàng mới, hưởng hoa hồng cao hơn.", zh: "业务能力成熟后转为销售——主动开发新客户，享受更高的佣金待遇。" },
  "careers.p3_title": { en: "Senior Sales / Team Lead", vi: "Senior Sale / Team Lead", zh: "高级销售 / 团队主管" },
  "careers.p3_time": { en: "1 – 2 YEARS+", vi: "1 – 2 NĂM+", zh: "1 – 2 年以上" },
  "careers.p3_desc": { en: "Manage VIP client portfolios, lead new teams, and earn industry top-tier income.", vi: "Quản lý tệp khách hàng VIP, dẫn dắt đội ngũ mới, thu nhập thuộc top công ty.", zh: "管理 VIP 客户群体，带领团队，并获得业内顶尖的收入水平。" },

  "careers.rew_eyebrow": { en: "Rewards & Development", vi: "Chế độ & Hoa hồng", zh: "福利与提成" },
  "careers.rew_title": { en: "Attractive & Transparent", vi: "Chính sách thưởng", zh: "超大透明的" },
  "careers.rew_title_highlight": { en: "Bonus Policies", vi: "hấp dẫn", zh: "奖励政策" },
  "careers.rew_desc": { en: "The harder you work, the more you earn. THG applies a multi-tier bonus system that is limitless, calculated completely clearly every month right down to your sales commission.", vi: "Làm càng giỏi, kiếm càng nhiều. THG áp dụng hệ thống thưởng đa tầng không giới hạn, tính toán hoàn toàn minh bạch hàng tháng đến hoa hồng doanh số.", zh: "多劳多得。THG实行无上限的多层奖金系统，每月的销售佣金结算透明清晰。" },

  "careers.r1_tag": { en: "MONTHLY KPI", vi: "KPI HÀNG THÁNG", zh: "月度 KPI" },
  "careers.r1_title": { en: "Grade Performance Bonus", vi: "Thưởng xếp hạng Grade", zh: "等级绩效奖" },
  "careers.r1_desc": { en: "Monthly performance evaluation graded B / A / A+. Rewards given automatically and transparently.", vi: "Đánh giá hiệu suất cuối mỗi tháng theo 3 mức Grade B / A / A+. Thưởng tự động, minh bạch.", zh: "每月按 B / A / A+ 进行绩效评估，奖金自动且透明发放。" },
  "careers.r2_tag": { en: "SALES · CS", vi: "SALES · CSKH", zh: "销售 · 客服" },
  "careers.r2_title": { en: "High-value Deal Bonus", vi: "Thưởng chốt đơn lớn", zh: "高价值成单奖" },
  "careers.r2_desc": { en: "Bonuses on successfully closed high-value orders — from Express, Dropship, POD to US Warehousing.", vi: "Thưởng trên từng đơn có giá trị cao được chốt thành công — từ Express, Dropship, POD đến Warehouse US.", zh: "成功达成高价值订单（包括专线快递、代发、POD 到美国仓储）的专属奖金。" },
  "careers.r3_tag": { en: "SHIPPING", vi: "VẬN CHUYỂN", zh: "运输物流" },
  "careers.r3_title": { en: "Express Bulk Bonus", vi: "Thưởng Express Bulk", zh: "大宗货运奖" },
  "careers.r3_desc": { en: "Tiered bonuses based on shipping volumes: over 50kg, over 100kg, and over 500kg.", vi: "Thưởng phân tầng theo khối lượng đơn hàng vận chuyển: trên 50kg, trên 100kg, trên 500kg.", zh: "按货运量（如50kg及以上、100kg、500kg）划分不同阶梯奖金。" },
  "careers.r4_tag": { en: "ACQUISITION", vi: "KHAI THÁC", zh: "新客开发" },
  "careers.r4_title": { en: "New Client Bonus", vi: "Thưởng khách hàng mới", zh: "新客户开发奖" },
  "careers.r4_desc": { en: "Immediate recognition when bringing a new client into their first transaction with THG.", vi: "Ghi nhận ngay khi đưa được một khách hàng mới vào giao dịch lần đầu với THG.", zh: "针对首次与 THG 完成交易的新客户，立即给予开发奖。" },
  "careers.r5_tag": { en: "UPGRADE", vi: "UPGRADE", zh: "客户升级" },
  "careers.r5_title": { en: "VIP Upgrade Bonus", vi: "Thưởng khách hàng lên VIP", zh: "客户晋升 VIP 奖" },
  "careers.r5_desc": { en: "When a managed client reaches the VIP threshold during the month, both Sales and CS are rewarded.", vi: "Khi chăm sóc khách hàng đạt ngưỡng VIP trong tháng, Sales và CSKH cùng nhận thưởng.", zh: "当月维护的客户达到 VIP 等级标准时，销售和客服共同获得此项奖励。" },
  "careers.r6_tag": { en: "REVENUE", vi: "DOANH THU", zh: "收入创收" },
  "careers.r6_title": { en: "High Conversion Bonus", vi: "Thưởng tỷ lệ chốt cao", zh: "高转化率奖" },
  "careers.r6_desc": { en: "Individual Sales/CS hitting a close request rate of ≥ 80% receive a performance bonus.", vi: "Sales/CS cá nhân đạt tỷ lệ chốt request ≥ 80% sẽ nhận thưởng hiệu suất.", zh: "当个人销售或客服的成单转化率达到 ≥ 80% 时，获得绩效奖金。" },
  "careers.r7_tag": { en: "UPSELL", vi: "UPSELL", zh: "交叉销售升级" },
  "careers.r7_title": { en: "Upsell Success Bonus", vi: "Thưởng Upsell thành công", zh: "交叉销售奖" },
  "careers.r7_desc": { en: "Rewarding successful introduction of additional THG services to our existing client base.", vi: "Thưởng khi giới thiệu thành công thêm dịch vụ THG cho khách hàng đang có.", zh: "成功向现有客户推介并增加其他 THG 服务时给予红利。" },
  "careers.r8_tag": { en: "PERFORMANCE", vi: "HIỆU SUẤT", zh: "绩效达成" },
  "careers.r8_title": { en: "100% On-time Bonus", vi: "Thưởng 100% task đúng hạn", zh: "100% 准时完成奖" },
  "careers.r8_desc": { en: "Perfect execution: successfully completing 100% of assigned tasks in a month without delays.", vi: "Hoàn thành 100% task được giao trong tháng mà không có task nào trễ hạn.", zh: "在当月分配的任务中达到100%按时完成（无延误）即享此奖励。" },
  "careers.r9_tag": { en: "CEO AWARD", vi: "CEO AWARD", zh: "CEO 奖" },
  "careers.r9_title": { en: "Employee of the Month", vi: "Nhân viên xuất sắc tháng", zh: "月度优秀员工" },
  "careers.r9_desc": { en: "Awarded by the CEO every month — including cash bonus and recognition certificate.", vi: "Giải thưởng do chính CEO chọn mỗi tháng — kèm tiền thưởng và Certificate ghi nhận.", zh: "由CEO每月亲自选定——附赠现金奖励与认可证书。" },


  // Modal 
  "careers.modal_salary": { en: "Salary", vi: "Mức lương", zh: "薪资" },
  "careers.modal_exp": { en: "Experience", vi: "Kinh nghiệm", zh: "经验" },
  "careers.modal_type": { en: "Job Type", vi: "Hình thức", zh: "工作性质" },
  "careers.modal_loc": { en: "Location", vi: "Địa điểm", zh: "工作地点" },
  "careers.modal_req": { en: "Requirements", vi: "Yêu cầu ứng viên", zh: "任职要求" },
  "careers.modal_apply": { en: "Apply Now", vi: "Ứng tuyển ngay", zh: "立即申请" },
  "careers.modal_apply_title": { en: "Ready to join THG?", vi: "Sẵn sàng gia nhập THG?", zh: "准备加入 THG？" },
  "careers.modal_apply_desc": { en: "Send your CV and application to <strong class=\"text-[hsl(var(--gold))]\">careers@thgfulfill.com</strong><br />Interview Location: 121/5 Kenh 19/05, Tay Thanh Ward, HCMC", vi: "Gửi CV và đơn ứng tuyển về <strong class=\"text-[hsl(var(--gold))]\">careers@thgfulfill.com</strong><br />Địa điểm phỏng vấn: 121/5 Kênh 19/05, Phường Tây Thạnh, TP.HCM", zh: "将简历及求职信发送至 <strong class=\"text-[hsl(var(--gold))]\">careers@thgfulfill.com</strong><br />面试地点：胡志明市新富郡西盛坊19/05渠街121/5号" },
  "careers.modal_btn_apply": { en: "Apply Now", vi: "Ứng tuyển ngay", zh: "立即申请" },
  "careers.modal_btn_email": { en: "Send CV via Email", vi: "Gửi CV qua email", zh: "通过邮件发送简历" },
  "careers.expired": { en: "This position is no longer accepting applications", vi: "Vị trí này đã hết hạn nộp hồ sơ", zh: "此职位已停止招聘" },
  "careers.expired_badge": { en: "Closed", vi: "Đã hết hạn", zh: "已截止" },
  "careers.modal_ben_title": { en: "Attractive Benefits", vi: "Quyền lợi hấp dẫn", zh: "丰厚福利" },
  "careers.modal_bonus_title": { en: "Bonus & Commission System", vi: "Hệ thống thưởng & hoa hồng", zh: "奖金与佣金制度" },
  "careers.modal_bonus_desc": { en: "In addition to base salary and standard commissions, THG applies a <strong class=\"text-navy\">multi-tiered bonus system</strong> to recognize effort:", vi: "Ngoài lương cứng và hoa hồng cơ bản, THG áp dụng <strong class=\"text-navy\">hệ thống thưởng đa tầng</strong> để ghi nhận nỗ lực:", zh: "除了基本工资和标准佣金，THG 实行 <strong class=\"text-navy\">多层奖金制度</strong> 以认可您的努力：" },
  "careers.modal_bonus_note": { en: "* Bonus details and specific conditions will be discussed during the interview.", vi: "* Chi tiết mức thưởng và điều kiện cụ thể sẽ được trao đổi trong buổi phỏng vấn.", zh: "* 具体奖金细节及条件将在面试时详细讨论。" },
  "careers.modal_resp_title": { en: "Job Description", vi: "Mô tả công việc", zh: "职位描述" },

  "careers.cta_title1": { en: "Don't see a fit?", vi: "Không thấy vị trí phù hợp?", zh: "没找到合适的职位？" },
  "careers.cta_title2": { en: "We still want to know you.", vi: "Chúng tôi vẫn muốn biết bạn.", zh: "我们依然期待认识你。" },
  "careers.cta_desc": { en: "Send your CV and your aspirations to <strong class=\"text-[hsl(var(--gold))]\">careers@thgfulfill.com</strong> — THG is always open for exceptional talents.", vi: "Gửi CV cùng mong muốn của bạn về <strong class=\"text-[hsl(var(--gold))]\">careers@thgfulfill.com</strong> — THG luôn mở cửa với những tài năng xuất sắc.", zh: "将简历及期望发送至 <strong class=\"text-[hsl(var(--gold))]\">careers@thgfulfill.com</strong> — THG 始终欢迎优秀人才加盟。" },
  "careers.cta_btn": { en: "Send CV now →", vi: "Gửi CV ngay →", zh: "即刻发简历 →" },

  "careers.hero_badge2": { en: "Careers · April 2026", vi: "Tuyển dụng · Tháng 04/2026", zh: "招骋 · 2026年4月" },
  "careers.hero_title_1": { en: "Join the team of", vi: "Gia nhập đội ngũ", zh: "加入" },
  "careers.hero_title_2": { en: "Transport Happiness", vi: "Transport Happiness", zh: "Transport Happiness" },
  "careers.hero_title_3": { en: "Together with THG reach the", vi: "Cùng THG vươn ra", zh: "与 THG 一起走向" },
  "careers.hero_title_4": { en: "world", vi: "thế giới", zh: "世界" },
  "careers.hero_desc": { en: "THG Fulfill — cross-border E-commerce fulfillment ecosystem Vietnam · China · US. We are looking for passionate, proactive talents who share our mission of bringing local products to the global stage.", vi: "THG Fulfill — hệ sinh thái fulfillment E-commerce xuyên biên giới Việt Nam · Trung Quốc · Hoa Kỳ. Chúng tôi đang tìm kiếm những con người nhiệt huyết, chủ động và khát khao phát triển cùng sứ mệnh đưa sản phẩm Việt ra toàn cầu.", zh: "THG Fulfill — 跨境电子商务履约生态系统：越南·中国·美国。我们正在寻找充满热情、主动且渴望与我们共同成长的人才，帮助本土产品走向全球。" },
  "careers.stat1_label": { en: "Open Positions", vi: "Vị trí đang tuyển", zh: "热招职位" },
  "careers.stat2_label": { en: "Operating Countries", vi: "Quốc gia vận hành", zh: "运营国家" },
  "careers.stat3_label": { en: "Service Sectors", vi: "Mảng dịch vụ", zh: "服务领域" },
  "careers.stat4_label": { en: "Deadline", vi: "Hạn nộp", zh: "截止日期" },

  // Jobs







  // Footer

  // Policy page
  "policy.subtitle": { en: "Select a section below to view policy details", vi: "Chọn mục bên dưới để xem chi tiết chính sách", zh: "选择以下部分查看政策详情" },
  "policy.title": { en: "Policies & Terms", vi: "Chính sách & Điều khoản", zh: "政策与条款" },

  // Shipping Policy page
  "spolicy.title": { en: "Shipping Policy", vi: "Chính Sách Vận Chuyển", zh: "运输政策" },
  "spolicy.subtitle": { en: "Organized by shipping route — select a route below to view its terms", vi: "Phân loại theo tuyến vận chuyển — chọn tuyến bên dưới để xem điều khoản", zh: "按运输路线分类 — 选择下方路线查看条款" },
  "spolicy.loading": { en: "Loading shipping routes…", vi: "Đang tải tuyến vận chuyển…", zh: "正在加载运输路线…" },
  "spolicy.empty": { en: "No shipping routes available yet.", vi: "Chưa có tuyến vận chuyển nào.", zh: "暂无运输路线。" },

  // Blog page
  "blog.title": { en: "News & Insights", vi: "Tin tức & Kiến thức", zh: "新闻与见解" },
  "blog.subtitle": { en: "Stay updated with the latest from THG", vi: "Cập nhật tin tức mới nhất từ THG", zh: "关注THG的最新动态" },
  "news.read_more": { en: "Read more", vi: "Đọc thêm", zh: "阅读更多" },

  // THGWarehousePage
  "warehouse_page.cta": { en: "Get Quote / Consign", vi: "Nhận báo giá / Ký gửi", zh: "获取报价 / 寄售" },

  // THG Fulfill Page
  "fulfill_page.hero_subtitle": { en: "POD & Dropship solutions for global sellers. Competitive basecost, fast delivery, 24/7 support.", vi: "Giải pháp POD & Dropship cho seller toàn cầu. Basecost tối ưu, giao nhanh, support 24/7.", zh: "为全球卖家提供POD和代发解决方案。有竞争力的basecost，快速交付，24/7支持。" },
  "fulfill_page.hero_tagline": { en: "Optimized Basecost • Multi-route Shipping", vi: "Basecost tối ưu • Vận chuyển đa tuyến", zh: "优化Basecost • 多路线运输" },
  "fulfill_page.pain_subtitle": { en: "Seller Challenges", vi: "Nỗi đau của Seller", zh: "卖家的挑战" },
  "fulfill_page.pain_title": { en: "What challenges are Vietnamese sellers facing?", vi: "Seller Việt bán TMĐT Mỹ đang gặp vấn đề gì?", zh: "越南卖家面临什么挑战？" },
  "fulfill_page.pain1_title": { en: "Shipping", vi: "Vận chuyển", zh: "运输" },
  "fulfill_page.pain1_desc": { en: "Shipping VN/CN → US takes 10-20 days, customers cancel orders.", vi: "Vận chuyển VN/CN → US mất 10-20 ngày, khách hủy đơn.", zh: "越南/中国到美国需要10-20天，客户取消订单。" },
  "fulfill_page.pain2_title": { en: "Cost", vi: "Chi phí", zh: "成本" },
  "fulfill_page.pain2_desc": { en: "Slow production, high basecost → hard to compete.", vi: "Sản xuất chậm, basecost cao → khó cạnh tranh.", zh: "生产慢，basecost高→难以竞争。" },
  "fulfill_page.pain3_title": { en: "System", vi: "Hệ thống", zh: "系统" },
  "fulfill_page.pain3_desc": { en: "Messy order & SKU management, easy errors.", vi: "Quản lý đơn & SKU rối rắm, dễ sai sót.", zh: "订单和SKU管理混乱，容易出错。" },
  "fulfill_page.pain4_title": { en: "Control", vi: "Kiểm soát", zh: "控制" },
  "fulfill_page.pain4_desc": { en: "Slow support, hidden fees → hard to scale.", vi: "Support chậm, nhiều phí ẩn → khó scale.", zh: "支持慢，隐藏费用→难以扩展。" },
  "fulfill_page.solution_subtitle": { en: "Our Solution", vi: "Giải pháp", zh: "我们的解决方案" },
  "fulfill_page.solution_highlight": { en: "Complete Fulfillment Solution", vi: "Giải pháp Fulfillment toàn diện", zh: "全面的履约解决方案" },
  "fulfill_page.solution_desc": { en: "THG Fulfill provides end-to-end POD & Dropship solutions for global sellers.", vi: "THG Fulfill mang đến giải pháp POD & Dropship trọn gói cho seller.", zh: "THG Fulfill为全球卖家提供端到端的POD和代发解决方案。" },
  "fulfill_page.adv1_title": { en: "Complete POD & Dropship Ecosystem", vi: "Hệ sinh thái POD & Dropship trọn gói", zh: "完整的POD和代发生态系统" },
  "fulfill_page.adv1_desc": { en: "POD production in Vietnam, China and USA to optimize delivery time and costs.", vi: "Sản xuất POD tại Việt Nam, Trung Quốc và Mỹ giúp tối ưu thời gian và chi phí.", zh: "在越南、中国和美国进行POD生产，优化交货时间和成本。" },
  "fulfill_page.adv3_title": { en: "Transparent, No Hidden Fees", vi: "Minh bạch, không phí ẩn", zh: "透明，无隐藏费用" },
  "fulfill_page.adv3_desc": { en: "Continuous support, timely issue resolution for smooth operations.", vi: "Hỗ trợ liên tục, xử lý vấn đề kịp thời để seller vận hành trơn tru.", zh: "持续支持，及时解决问题，确保运营顺畅。" },
  "fulfill_page.process_title": { en: "How It Works – US Standard Fulfillment", vi: "Quy trình hoàn tất đơn chuẩn Mỹ", zh: "运作流程 – 美国标准履约" },
  "fulfill_page.step1_title": { en: "Receive File & Check Design", vi: "Nhận file & kiểm tra thiết kế", zh: "接收文件并检查设计" },
  "fulfill_page.step1_desc": { en: "Seller submits POD print file. THG checks format, colors and quality.", vi: "Seller gửi file in POD. THG kiểm tra định dạng, màu sắc và chất lượng.", zh: "卖家提交POD打印文件。THG检查格式、颜色和质量。" },
  "fulfill_page.step2_title": { en: "POD Print & QC", vi: "In POD & QC sản phẩm", zh: "POD印刷和质检" },
  "fulfill_page.step2_desc": { en: "Products printed at VN/CN/US. QC team inspects each order.", vi: "Sản phẩm được in tại VN/CN/US. Đội QC kiểm tra từng đơn.", zh: "在VN/CN/US进行印刷。QC团队逐单检查。" },
  "fulfill_page.step3_title": { en: "Pack & Label", vi: "Đóng gói & gắn tracking", zh: "包装和贴标" },
  "fulfill_page.step3_desc": { en: "Packed to US eCommerce standards with shipping labels.", vi: "Đóng gói theo chuẩn TMĐT Mỹ, dán nhãn vận chuyển.", zh: "按美国电商标准包装，贴运输标签。" },
  "fulfill_page.step4_title": { en: "Ship & Deliver", vi: "Vận chuyển & giao hàng", zh: "运输和交付" },
  "fulfill_page.step4_desc": { en: "International shipping or US domestic fulfillment with real-time tracking.", vi: "Ship quốc tế hoặc fulfill nội địa US với tracking real-time.", zh: "国际运输或美国国内履约，实时追踪。" },
  "fulfill_page.pod_process": { en: "POD Process", vi: "Quy trình POD", zh: "POD流程" },
  "fulfill_page.blank_tshirt": { en: "Blank T-Shirt", vi: "Áo phôi", zh: "空白T恤" },
  "fulfill_page.dtg_print": { en: "DTG / DTF Print", vi: "In DTG / DTF", zh: "DTG / DTF 打印" },
  "fulfill_page.your_brand": { en: "YOUR BRAND", vi: "BRAND CỦA BẠN", zh: "您的品牌" },
  "fulfill_page.branded_product": { en: "Branded Product", vi: "Thành phẩm", zh: "品牌产品" },
  "fulfill_page.pod_dropship_badge": { en: "POD & Dropship", vi: "POD & Dropship", zh: "POD & 代发" },

  // THG Express Page
  "express_page.hero_subtitle": { en: "International shipping solutions for every seller. Fast, transparent, reliable.", vi: "Giải pháp vận chuyển quốc tế cho mọi nhà bán hàng. Nhanh, minh bạch, đáng tin cậy.", zh: "为每位卖家提供国际运输解决方案。快速、透明、可靠。" },
  "express_page.hero_tagline": { en: "Fast Shipping • Transparent Pricing", vi: "Vận chuyển nhanh • Giá minh bạch", zh: "快速运输 • 透明定价" },
  "express_page.feat1_title": { en: "Diverse Shipping Routes", vi: "Đa dạng tuyến vận chuyển", zh: "多样化运输线路" },
  "express_page.feat1_desc": { en: "Sea 20-25 days, Air 3-5 days, Express 6-10 days.", vi: "Sea 20-25 ngày, Air 3-5 ngày, Express 6-10 ngày.", zh: "海运20-25天，空运3-5天，快递6-10天。" },
  "express_page.feat2_title": { en: "Transparent Cost", vi: "Chi phí minh bạch", zh: "透明成本" },
  "express_page.feat2_desc": { en: "No hidden fees, clear pricing for all services.", vi: "Không phí ẩn, bảng giá rõ ràng cho tất cả dịch vụ.", zh: "无隐藏费用，所有服务定价清晰。" },
  "express_page.feat3_title": { en: "Lightning Speed", vi: "Tốc độ cực nhanh", zh: "极速" },
  "express_page.feat3_desc": { en: "Delivery from just 3-5 business days.", vi: "Giao hàng chỉ từ 3-5 ngày làm việc.", zh: "最快3-5个工作日送达。" },
  "express_page.feat4_title": { en: "Trusted Partners", vi: "Đối tác uy tín", zh: "值得信赖的合作伙伴" },
  "express_page.feat4_desc": { en: "Partners with UPS, FedEx, DHL and more.", vi: "Hợp tác với UPS, FedEx, DHL và nhiều đơn vị khác.", zh: "与UPS、FedEx、DHL等合作。" },
  "express_page.process_title": { en: "Shipping Process", vi: "Quy trình vận hành đơn hàng", zh: "运输流程" },
  "express_page.step1_title": { en: "Receive Order & Process", vi: "Nhận đơn & xử lý dữ liệu", zh: "接单和处理数据" },
  "express_page.step1_desc": { en: "Seller submits info via form or Excel. OMS generates tracking and assigns shipping line.", vi: "Seller gửi thông tin qua form/Excel. OMS tạo mã vận đơn và phân loại line ship.", zh: "卖家通过表单或Excel提交信息。OMS生成追踪码并分配运输线路。" },
  "express_page.step2_title": { en: "Consolidate & Export", vi: "Gom hàng & xuất kho", zh: "集货和出库" },
  "express_page.step2_desc": { en: "Goods consolidated at VN/CN warehouse, packed to international standards.", vi: "Hàng được gom tại kho VN/CN, đóng gói theo tiêu chuẩn quốc tế.", zh: "货物在越南/中国仓库集中，按国际标准包装。" },
  "express_page.step3_title": { en: "International Transit & Tracking", vi: "Vận chuyển quốc tế & tracking", zh: "国际运输和追踪" },
  "express_page.step3_desc": { en: "Shipped via direct flights or sea containers with real-time tracking.", vi: "Vận chuyển theo line bay thẳng hoặc container biển, tracking real-time.", zh: "通过直飞航班或海运集装箱运输，实时追踪。" },
  "express_page.step4_title": { en: "Warehouse & Last Mile", vi: "Nhập kho & giao last-mile", zh: "入库和最后一公里" },
  "express_page.step4_desc": { en: "Customs clearance, transferred to local carriers (USPS, FedEx).", vi: "Thông quan, chuyển sang đối tác giao nội địa (USPS, FedEx).", zh: "清关后转交当地承运商（USPS, FedEx）。" },

  // THG Warehouse Page
  "warehouse_page.pkg_title": { en: "PACKAGING FEES", vi: "BẢNG PHÍ BAO BÌ/HỘP", zh: "包装/纸箱费用" },
  "warehouse_page.badge": { en: "US Fulfillment", vi: "Fulfillment tại Mỹ", zh: "美国履约" },
  "warehouse_page.hero_tagline": { en: "PREMIUM WAREHOUSE – FAST DELIVERY", vi: "KHO XỊN - GIAO NHANH", zh: "优质仓库 – 快速配送" },
  "warehouse_page.hero_tagline2": { en: "OPTIMIZED OPERATIONS", vi: "TỐI ƯU VẬN HÀNH", zh: "优化运营" },
  "warehouse_page.solution_title": { en: "THG Warehouse – US Warehousing for Vietnamese Sellers", vi: "THG Warehouse – Kho bãi tại Mỹ cho seller Việt", zh: "THG Warehouse – 面向越南卖家的美国仓储" },
  "warehouse_page.strengths_title": { en: "THG Warehouse US – The Optimal Logistics Solution for Your Business", vi: "THG Warehouse US – Giải pháp kho vận tối ưu cho doanh nghiệp của bạn", zh: "THG Warehouse美国 – 为您的企业提供最优物流解决方案" },
  "warehouse_page.str1_title": { en: "Optimized Fulfillment Cost – From $1.2/order", vi: "Chi phí fulfillment tối ưu – Chỉ từ 1.2$/đơn", zh: "优化履约成本 – 低至$1.2/单" },
  "warehouse_page.str1_desc": { en: "Competitive, transparent pricing with no hidden fees – Easy margin control even in peak seasons.", vi: "Giá cạnh tranh, minh bạch, không phí ẩn – Kiểm soát lợi nhuận dễ dàng ngay cả trong mùa cao điểm.", zh: "有竞争力的透明定价，无隐藏费用 – 即使旺季也能轻松控制利润。" },
  "warehouse_page.str2_title": { en: "Dual Warehouses in Pennsylvania & North Carolina – Optimizing Delivery Speed", vi: "Kho hàng song song tại Pennsylvania & North Carolina – Tối ưu tốc độ giao hàng", zh: "宾州和北卡双仓库 – 优化配送速度" },
  "warehouse_page.str2_desc": { en: "THG Warehouse strategically positions warehouses in Pennsylvania & North Carolina – two key hubs spanning the US, optimizing delivery time to 2–5 days, reducing last-mile costs and giving Vietnamese sellers a superior competitive edge.", vi: "THG Warehouse chiến lược bố trí kho tại Pennsylvania & North Carolina – hai điểm then chốt trải dài nước Mỹ, giúp tối ưu thời gian giao hàng 2–5 ngày, giảm chi phí last-mile và mang lại lợi thế cạnh tranh vượt trội cho seller Việt.", zh: "THG Warehouse战略性地将仓库布局在宾州和北卡——横跨全美的两个关键枢纽，将配送时间优化至2-5天，降低最后一公里成本。" },
  "warehouse_page.str5_title": { en: "Packing Video Feature", vi: "Tính năng quay video đóng gói", zh: "包装视频功能" },
  "warehouse_page.str5_desc": { en: "100% fulfillment process recorded. Reduces errors and protects against disputes.", vi: "Quay video 100% quá trình fulfill. Giảm sai sót, bảo vệ khi có khiếu nại.", zh: "100%履约过程录制。减少错误，保护纠纷处理。" },
  "warehouse_page.process_title": { en: "Standard US Warehouse Operations", vi: "Quy trình vận hành kho chuẩn US", zh: "美国标准仓库运营流程" },
  "warehouse_page.step1_title": { en: "Barcode Processing", vi: "Xử lý barcode", zh: "条码处理" },
  "warehouse_page.step1_desc": { en: "Create or assign barcode for each product. THG provides PDF barcode if needed.", vi: "Tạo hoặc gán barcode cho từng sản phẩm. THG cung cấp file PDF barcode nếu cần.", zh: "为每个产品创建或分配条码。如需要THG提供PDF条码。" },
  "warehouse_page.step2_title": { en: "Inbound Request (IR)", vi: "Yêu cầu nhập kho (IR)", zh: "入库请求（IR）" },
  "warehouse_page.step2_desc": { en: "Create an IR on OMS: select SKU and quantity. OMS confirms and returns the IR code to print and attach to the shipment.", vi: "Thao tác tạo IR nhập kho trên OMS: Chọn SKU và số lượng. OMS xác nhận và trả lại mã IR, sau đó in ra và dán lên kiện hàng.", zh: "在OMS上创建IR：选择SKU和数量。OMS确认并返回IR编码，打印后贴在货物上。" },
  "warehouse_page.step3_title": { en: "Receiving, Inspection & Storage", vi: "Tiếp nhận, Kiểm tra & Nhập kho", zh: "收货、检验和入库" },
  "warehouse_page.step3_desc": { en: "Each shipment is thoroughly inspected before storage. Inventory is automatically updated in real-time on the OMS system.", vi: "Mỗi lô hàng được kiểm tra kỹ lưỡng trước khi nhập kho. Tồn kho cập nhật tự động & chính xác theo thời gian thực trên OMS.", zh: "每批货物在入库前经过严格检查。库存通过OMS系统实时自动精确更新。" },
  "warehouse_page.step4_title": { en: "Fulfillment & Shipping", vi: "Fulfillment & Vận chuyển", zh: "履约与配送" },
  "warehouse_page.step4_desc": { en: "Orders processed and packed with transparent video recording, shipped quickly via USPS/FedEx/UPS.", vi: "Đơn hàng được xử lý, đóng gói có video ghi hình minh bạch & vận chuyển nhanh chóng qua USPS/FedEx/UPS.", zh: "订单经过处理，透明视频录制包装，通过USPS/FedEx/UPS快速发货。" },
  "warehouse_page.step5_title": { en: "Returns Processing", vi: "Xử lý hàng return", zh: "退货处理" },
  "warehouse_page.step5_desc": { en: "Returns handled at no cost – THG manages the full receipt & processing of returned goods. 100% free for all THG-fulfilled orders.", vi: "Hàng hoàn về không lo chi phí – THG đảm nhận toàn bộ quy trình tiếp nhận & xử lý hàng hoàn trả. Miễn phí 100% cho mọi đơn hàng do THG thực hiện.", zh: "退货处理零成本 – THG全程负责退货接收与处理。THG履约的所有订单100%免费。" },

  // THG Order Page

  // Testimonials
  "testimonials.subtitle": { en: "Customer Reviews", vi: "Đánh giá khách hàng", zh: "客户评价" },
  "testimonials.title": { en: "Trusted by", vi: "Được tin tưởng bởi", zh: "受到信赖" },
  "testimonials.title_highlight": { en: "Sellers Worldwide", vi: "Seller toàn cầu", zh: "全球卖家" },
  "testimonials.t1_name": { en: "Nguyen Minh Tuan", vi: "Nguyễn Minh Tuấn", zh: "阮明俊" },
  "testimonials.t1_role": { en: "POD Seller • Etsy & TikTok", vi: "POD Seller • Etsy & TikTok", zh: "POD卖家 • Etsy & TikTok" },
  "testimonials.t1_quote": { en: "THG Fulfill helped me grow from 50 to 500+ orders/month. Their base cost is unbeatable and support is always responsive.", vi: "THG Fulfill giúp tôi tăng từ 50 lên 500+ đơn/tháng. Chi phí gốc không đâu cạnh tranh bằng và đội hỗ trợ luôn phản hồi nhanh.", zh: "THG Fulfill帮我从月50单增长到500+单。基础成本无与伦比，支持团队总是及时响应。" },
  "testimonials.t2_name": { en: "David Chen", vi: "David Chen", zh: "David Chen" },
  "testimonials.t2_role": { en: "Dropship Seller · Amazon", vi: "Người bán hàng dropshipping • Amazon", zh: "代发卖家 · Amazon" },
  "testimonials.t2_quote": { en: "US domestic fulfillment from $1.2/order is a real game-changer. My customers receive orders in 2–5 days instead of 2–3 weeks.", vi: "Fulfill nội địa Mỹ từ 1.2$/đơn thực sự là một bước ngoặt. Khách hàng của tôi nhận hàng trong 2–5 ngày thay vì 2–3 tuần như trước.", zh: "美国国内履约低至1.2美元/单是真正的游戏改变者。客户2-5天收到包裹，而不是2-3周。" },
  "testimonials.t3_name": { en: "Tran Thi Mai", vi: "Trần Thị Mai", zh: "陈氏梅" },
  "testimonials.t3_role": { en: "Brand Owner • Shopify", vi: "Chủ Brand • Shopify", zh: "品牌主 • Shopify" },
  "testimonials.t3_quote": { en: "Transparent pricing, no hidden fees. The packing video feature gives me peace of mind for every order shipped.", vi: "Giá minh bạch, không phí ẩn. Tính năng quay video đóng gói giúp tôi yên tâm với từng đơn hàng.", zh: "透明定价，无隐藏费用。包装视频功能让我对每个发出的订单都很放心。" },
  "testimonials.t4_name": { en: "Kevin Nguyen", vi: "Kevin Nguyễn", zh: "Kevin Nguyen" },
  "testimonials.t4_role": { en: "eCommerce Team Lead", vi: "Trưởng nhóm Thương mại điện tử", zh: "电商团队负责人" },
  "testimonials.t4_quote": { en: "We used 3 different fulfillment partners before switching to THG. One single ecosystem handling everything from POD to US warehouse. Amazing.", vi: "Chúng tôi đã dùng qua 3 đối tác fulfill khác nhau trước khi chuyển sang THG. Một hệ sinh thái duy nhất xử lý tất cả từ POD đến kho Mỹ. Tuyệt vời.", zh: "我们在切换到THG之前使用了3个不同的履约合作伙伴。一个生态系统处理从POD到美国仓库的一切。难以置信。" },

  // Integrations
  "integrations.subtitle": { en: "Sync & Connect", vi: "Đồng bộ & Kết nối", zh: "同步与连接" },
  "integrations.title": { en: "Seamless", vi: "Kết nối liền mạch", zh: "无缝" },
  "integrations.title_highlight": { en: "Marketplace Integration", vi: "với Marketplace", zh: "平台集成" },
  "integrations.desc": { en: "THG OMS syncs directly with major US marketplaces. Auto-import orders, update tracking, manage inventory — all in one place.", vi: "THG OMS đồng bộ trực tiếp với các marketplace lớn tại Mỹ. Tự động nhập đơn, cập nhật tracking, quản lý tồn kho — tất cả tại một nơi.", zh: "THG OMS直接与美国主要平台同步。自动导入订单、更新追踪、管理库存——一站式解决。" },
  "integrations.sync_ready": { en: "Sync Ready", vi: "Sẵn sàng đồng bộ", zh: "同步就绪" },
  "integrations.hub_desc": { en: "Central order management hub", vi: "Trung tâm quản lý đơn hàng", zh: "订单管理中心" },

  // About / Video
  "about.subtitle": { en: "About THG", vi: "Về THG", zh: "关于THG" },
  "about.title": { en: "Why choose", vi: "Tại sao chọn", zh: "为什么选择" },
  "about.title_highlight": { en: "THG Fulfill?", vi: "THG Fulfill?", zh: "THG Fulfill?" },
  "about.video_title": { en: "End-to-end fulfillment service from Asia to the US", vi: "Dịch vụ vận chuyển trọn gói từ châu Á đến Mỹ.", zh: "从亚洲到美国的端到端履约" },
  "about.video_desc": { en: "THG Fulfill is a comprehensive ecosystem connecting production in Vietnam & China directly to US warehouses. We handle everything from sourcing, printing, warehousing to last-mile delivery — so you can focus on growing your brand.", vi: "THG Fulfill là hệ sinh thái toàn diện, kết nối trực tiếp sản xuất tại Việt Nam & Trung Quốc với kho hàng tại Mỹ. Chúng tôi xử lý toàn bộ từ tìm nguồn hàng, in ấn, lưu kho đến giao hàng chặng cuối — để bạn tập trung phát triển thương hiệu.", zh: "THG Fulfill是一个综合生态系统，将越南和中国的生产直接连接到美国仓库。我们负责采购、印刷、仓储和最后一公里配送，让您专注于品牌发展。" },
  "about.highlight1": { en: "Competitive base pricing", vi: "Chi phí gốc cạnh tranh", zh: "有竞争力的基本成本" },
  "about.highlight2": { en: "Fast US delivery", vi: "Giao hàng nhanh tại Mỹ", zh: "美国快速交付" },
  "about.highlight3": { en: "Global network", vi: "Mạng lưới toàn cầu", zh: "全球网络" },
  "about.highlight4": { en: "Quality guaranteed", vi: "Đảm bảo chất lượng", zh: "质量保证" },
  "about.gallery_title": { en: "Our Services at a Glance", vi: "Dịch vụ của chúng tôi", zh: "我们的服务一览" },
  "about.img1_title": { en: "Product Sourcing", vi: "Tìm nguồn hàng", zh: "产品采购" },
  "about.img1_desc": { en: "Source trending products from China & Vietnam", vi: "Tìm sản phẩm trend từ Trung Quốc & Việt Nam", zh: "从中国和越南采购热门产品" },
  "about.img2_title": { en: "POD Printing", vi: "In ấn POD", zh: "POD印刷" },
  "about.img2_desc": { en: "High-quality print-on-demand production", vi: "Sản xuất in theo yêu cầu chất lượng cao", zh: "高质量按需印刷生产" },
  "about.img3_title": { en: "US Warehouse", vi: "Kho hàng Hoa Kỳ", zh: "美国仓库" },
  "about.img3_desc": { en: "Storage & order processing from $1.2/order", vi: "Lưu kho và xử lý đơn chỉ từ 1.2$/đơn hàng", zh: "仓储和履约低至1.2美元/单" },
  "about.img4_title": { en: "Express Shipping", vi: "Vận chuyển nhanh", zh: "快速运输" },
  "about.img4_desc": { en: "5-8 days VN/CN to US doorstep", vi: "5-8 ngày từ VN/CN đến tận nhà Mỹ", zh: "越南/中国到美国5-8天送达" },
  // ── THG Fulfill Page: Extra content ──
  "fulfill_page.platforms_label": { en: "Seamlessly integrates with", vi: "Tích hợp mượt mà với", zh: "无缝集成" },
  "fulfill_page.products_subtitle": { en: "Featured Products", vi: "Sản phẩm nổi bật", zh: "精选产品" },
  "fulfill_page.products_title": { en: "Top POD Products", vi: "Các Sản Phẩm POD Nổi Bật", zh: "热门POD产品" },
  "fulfill_page.basecost_label": { en: "Basecost from", vi: "Basecost từ", zh: "基本成本起" },
  "fulfill_page.time_label": { en: "Time in-house", vi: "Time in-house", zh: "内部处理时间" },
  "fulfill_page.faq_subtitle": { en: "Support Center", vi: "Trung tâm hỗ trợ", zh: "支持中心" },
  "fulfill_page.faq_title": { en: "Frequently Asked Questions", vi: "Những Câu Hỏi Thường Gặp", zh: "常见问题" },
  "fulfill_page.faq1_q": { en: "What services does THG Fulfill provide?", vi: "THG Fulfill cung cấp những dịch vụ nào?", zh: "THG Fulfill提供哪些服务？" },
  "fulfill_page.faq1_a": { en: "THG Fulfill currently provides POD and Dropship services from VN/CN to US/UK/WW.", vi: "Hiện tại THG Fulfill cung cấp dịch vụ POD và Dropship từ VN/CN đến US/UK/WW.", zh: "THG Fulfill目前提供从越南/中国到美国/英国/全球的POD和代发服务。" },
  "fulfill_page.faq2_q": { en: "Where do I place orders?", vi: "Lên đơn ở đâu?", zh: "在哪里下单？" },
  "fulfill_page.faq2_a": { en: "Customers place orders in the shared work file sent by THG.", vi: "Khách hàng sẽ lên đơn trong file làm việc chung THG gửi.", zh: "客户在THG发送的共享工作文件中下单。" },
  "fulfill_page.faq3_q": { en: "How does THG know when there are new orders?", vi: "Khi phát sinh đơn sẽ làm thế nào để THG biết?", zh: "THG如何知道有新订单？" },
  "fulfill_page.faq3_a": { en: "After placing the order, message the work group so THG staff can verify.", vi: "Khách hàng lên đơn xong thì sẽ nhắn vào nhóm làm việc.", zh: "下单完成后，在工作群中通知THG工作人员核实。" },
  "fulfill_page.faq4_q": { en: "What payment methods are available?", vi: "Cách thức thanh toán như thế nào?", zh: "有哪些付款方式？" },
  "fulfill_page.faq4_a": { en: "THG supports payments via Pingpong, Payoneer, and WorldFirst.", vi: "THG hỗ trợ thanh toán qua Pingpong, Payoneer, WorldFirst.", zh: "THG支持通过Pingpong、Payoneer和WorldFirst付款。" },
  "fulfill_page.faq5_q": { en: "Where can I find product templates?", vi: "Template các sản phẩm cụ thể?", zh: "在哪里可以找到产品模板？" },
  "fulfill_page.faq5_a": { en: "All templates are available in the Download Template section of each product Catalog.", vi: "Mọi template đều có sẵn trong mục Tải Template ở Catalog chi tiết.", zh: "所有模板都可以在产品目录的下载模板部分找到。" },
  "fulfill_page.faq6_q": { en: "Does THG support refunds for lost or damaged orders?", vi: "THG có hỗ trợ refund khi đơn thất lạc?", zh: "THG是否支持退款？" },
  "fulfill_page.faq6_a": { en: "Dropship: Compensation $20-$50. POD: THG refunds 100% basecost or resends per policy.", vi: "Dropship: Đền bù $20-$50. POD: THG Refund 100% basecost hoặc resend.", zh: "代发：补偿20-50美元。POD：按政策退还basecost或重新发货。" },
  "fulfill_page.faq7_q": { en: "Can THG purchase from AliExpress, SHEIN?", vi: "THG có thể mua trên AliExpress, SHEIN?", zh: "THG能从AliExpress购买吗？" },
  "fulfill_page.faq7_a": { en: "THG does not support AliExpress/SHEIN. We find similar products on Taobao/1688.", vi: "THG chưa hỗ trợ AliExpress, SHEIN. Chúng tôi tìm sản phẩm tương tự trên Taobao/1688.", zh: "THG不支持AliExpress或SHEIN。我们在淘宝/1688上寻找类似产品。" },

  // ── THG Express Page: Extra content ──
  "express_page.marquee_label": { en: "Real-world processing capacity at our hub", vi: "Năng lực xử lý thực tế tại trung tâm", zh: "枢纽实际处理能力" },
  "express_page.faq_eyebrow": { en: "Support Center", vi: "Trung tâm hỗ trợ", zh: "支持中心" },
  "express_page.faq_title": { en: "FAQ - Your Questions Answered", vi: "Giải đáp thắc mắc (FAQ)", zh: "常见问题解答" },
  "express_page.faq1_q": { en: "Does THG support active tracking for TikTok?", vi: "Có hỗ trợ active tracking cho TikTok không?", zh: "THG是否支持TikTok的active tracking？" },
  "express_page.faq1_a": { en: "Yes, THG supports active tracking activated within 48 hours per TikTok policy.", vi: "THG có hỗ trợ active tracking trong vòng 48h.", zh: "是的，THG支持active tracking，48小时内激活。" },
  "express_page.faq2_q": { en: "Where do customers receive tracking?", vi: "Khách hàng nhận tracking ở đâu?", zh: "客户在哪里获取tracking？" },
  "express_page.faq2_a": { en: "Sellers receive tracking in the shared work file.", vi: "Seller nhận tracking trong file làm việc chung.", zh: "卖家在共享工作文件中获取tracking。" },
  "express_page.faq3_q": { en: "How many days for CN to US drop shipping?", vi: "Thời gian drop từ CN-US bao nhiêu ngày?", zh: "CN到US代发需要多少天？" },
  "express_page.faq3_a": { en: "Taobao to THG warehouse: ~2 days. CN to US: 5-8 days. Total: 8-10 days.", vi: "Taobao về kho THG: khoảng 2 ngày. CN-US: 5-8 ngày. Tổng: 8-10 ngày.", zh: "淘宝到THG仓库约2天。中国到美国5-8天。总计8-10天。" },
  "express_page.faq4_q": { en: "How to use THG shared work file?", vi: "Cách sử dụng File làm việc chung?", zh: "如何使用共享工作文件？" },
  "express_page.faq4_a": { en: "The shared work file syncs order info, tracking, and financials 24/7.", vi: "File chung đồng bộ thông tin đơn hàng, tracking và đối soát 24/7.", zh: "共享文件全天候同步订单信息、tracking和财务对账。" },
  "express_page.faq5_q": { en: "What shipping routes does THG Express support?", vi: "THG Express hỗ trợ những tuyến nào?", zh: "THG Express支持哪些路线？" },
  "express_page.faq5_a": { en: "Vietnam to USA, China to USA, and VN/CN to Worldwide with TikTok Shop lines.", vi: "Việt Nam - Mỹ, Trung Quốc - Mỹ, và VN/CN - Worldwide với line TikTok Shop.", zh: "越南至美国、中国至美国、越南/中国至全球，含TikTok Shop专线。" },
  "express_page.faq6_q": { en: "Can THG Express handle bulky items?", vi: "THG Express có nhận hàng cồng kềnh không?", zh: "能处理大件物品吗？" },
  "express_page.faq6_a": { en: "Yes, THG Express handles diverse cargo with quality inspection.", vi: "THG Express xử lý đa dạng hàng hóa với kiểm tra chất lượng.", zh: "THG Express可处理多样化货物，配有质检。" },
  "express_page.faq7_q": { en: "Are THG Express shipping costs competitive?", vi: "Chi phí vận chuyển có cạnh tranh không?", zh: "运费有竞争力吗？" },
  "express_page.faq7_a": { en: "THG Express offers clear cost reporting with no hidden fees.", vi: "THG Express cam kết báo chi phí rõ ràng, không phí phát sinh.", zh: "THG Express承诺清晰费用报告，无隐藏费用。" },
  "express_page.faq8_q": { en: "Does THG support active tracking for TikTok Shop orders?", vi: "THG có hỗ trợ tracking chủ động cho đơn hàng TikTok Shop không?", zh: "THG是否支持TikTok Shop订单的主动追踪？" },
  "express_page.faq8_a": { en: "Yes. THG supports active tracking, activated within 48 hours per TikTok's policy.", vi: "Có. THG hỗ trợ tracking chủ động, được kích hoạt trong vòng 48 giờ theo chính sách của TikTok.", zh: "是的。THG支持主动追踪，按TikTok政策在48小时内激活。" },
  "express_page.faq9_q": { en: "Where do sellers receive their tracking codes?", vi: "Khách hàng nhận mã tracking ở đâu?", zh: "卖家在哪里收到追踪码？" },
  "express_page.faq9_a": { en: "Sellers receive tracking codes in the shared work file (shared work file) that THG provides.", vi: "Seller nhận mã tracking trong file làm việc chung (shared work file) mà THG cung cấp.", zh: "卖家在THG提供的共享工作文件中收到追踪码。" },
  "express_page.faq10_q": { en: "How does the THG shared work file work?", vi: "Cách sử dụng file làm việc chung của THG như thế nào?", zh: "如何使用THG共享工作文件？" },
  "express_page.faq10_a": { en: "The shared work file automatically syncs order information, tracking codes and financial data 24/7.", vi: "File làm việc chung tự động đồng bộ thông tin đơn hàng, mã tracking và dữ liệu tài chính 24/7.", zh: "共享工作文件自动同步订单信息、追踪码和财务数据，全天候24/7运行。" },

  // ── THG Warehouse Page: Extra content ──
  "warehouse_page.hero_title": { en: "THG Warehouse US", vi: "THG Warehouse US", zh: "THG Warehouse US" },
  "warehouse_page.hero_subtitle": { en: "Optimized logistics solution for your business", vi: "Giải pháp kho vận tối ưu cho doanh nghiệp của bạn", zh: "为您的企业提供优化的物流解决方案" },
  "warehouse_page.stat1": { en: "10,000+ sqm total area", vi: "Tổng diện tích 10,000+ m²", zh: "总面积 10,000+ 平方米" },
  "warehouse_page.stat2": { en: "US fulfillment fee from $1.2", vi: "Phí fulfill US chỉ từ $1.2", zh: "美国履约费低至 $1.2/单" },
  "warehouse_page.stat3": { en: "Free storage up to 90 days", vi: "Miễn phí lưu kho lên đến 90 ngày", zh: "免费存储长达90天" },
  "warehouse_page.stat4": { en: "Express delivery 2-5 days", vi: "Giao hàng hỏa tốc 2-5 ngày làm việc", zh: "快递2-5个工作日交货" },
  "warehouse_page.feat1_title": { en: "Maximum Savings", vi: "Tiết kiệm tối đa", zh: "最大节省" },
  "warehouse_page.feat1_desc": { en: "US fulfillment fee from just $1.2/order.", vi: "Phí fulfill US chỉ từ 1.2$/đơn.", zh: "美国履约费低至$1.2/单。" },
  "warehouse_page.feat2_title": { en: "No Storage Worries", vi: "Không lo chi phí", zh: "无仓储顾虑" },
  "warehouse_page.feat2_desc": { en: "Free storage for up to the first 90 days.", vi: "Miễn phí lưu kho đến 90 ngày đầu tiên.", zh: "前90天免费存储。" },
  "warehouse_page.feat3_title": { en: "Fast Delivery", vi: "Giao hàng nhanh chóng", zh: "快速配送" },
  "warehouse_page.feat3_desc": { en: "Delivery across the US in just 2-5 business days.", vi: "Giao hàng trên toàn US chỉ từ 2-5 ngày làm việc.", zh: "全美配送仅2-5个工作日。" },
  "warehouse_page.ops_badge": { en: "OPERATIONS SYSTEM", vi: "HỆ THỐNG VẬN HÀNH", zh: "运营系统" },
  "warehouse_page.gallery_title": { en: "Proven by Real-World Imagery", vi: "Minh chứng bằng hình ảnh thực tế", zh: "以实际影像为证" },
  "warehouse_page.gallery_desc": { en: "Experience the scale of THG Warehouse US logistics infrastructure firsthand.", vi: "Trải nghiệm trực quan hệ thống kho vận quy mô của THG Warehouse US.", zh: "直观感受THG Warehouse美国物流基础设施的规模。" },
  "warehouse_page.op1_title": { en: "Professional Packaging", vi: "Đóng gói chuyên nghiệp", zh: "专业包装" },
  "warehouse_page.op1_desc": { en: "Each package carefully handled per standard process, ensuring it arrives intact.", vi: "Mỗi kiện hàng được xử lý cẩn thận theo quy trình chuẩn, đảm bảo nguyên vẹn đến tay khách.", zh: "每件货物按标准流程仔细处理，确保完好无损送达。" },
  "warehouse_page.op2_title": { en: "High-Capacity Sorting System", vi: "Hệ thống phân loại công suất cao", zh: "高产能分拣系统" },
  "warehouse_page.op2_desc": { en: "Processes thousands of parcels per hour – continuous, uninterrupted operations.", vi: "Xử lý hàng nghìn bưu kiện mỗi giờ, vận hành liên tục & không gián đoạn.", zh: "每小时处理数千件包裹 – 持续不间断运营。" },
  "warehouse_page.op3_title": { en: "Independent US Warehouse System", vi: "Hệ thống kho hàng độc lập tại US", zh: "美国独立仓储系统" },
  "warehouse_page.op3_desc": { en: "Ensures fast & on-time delivery within 2–5 days across the US.", vi: "Đảm bảo giao hàng nhanh chóng & đúng hẹn trong 2–5 ngày.", zh: "确保全美2-5天快速准时配送。" },
  "warehouse_page.op4_title": { en: "Intelligent OMS System", vi: "Hệ thống OMS thông minh", zh: "智能OMS系统" },
  "warehouse_page.op4_desc": { en: "Multi-dimensional warehouse management with real-time data synchronization.", vi: "Quản lý kho đa chiều, đồng bộ dữ liệu real-time.", zh: "多维仓库管理，实时数据同步。" },
  "warehouse_page.oms_badge": { en: "ADVANCED TECHNOLOGY SYSTEM", vi: "HỆ THỐNG CÔNG NGHỆ TIÊN TIẾN", zh: "先进技术系统" },
  "warehouse_page.oms_title": { en: "OMS Integrated – Optimize the Entire Order Process A–Z", vi: "OMS tích hợp – Tối ưu toàn bộ quy trình đặt hàng A–Z", zh: "OMS集成 – 全流程优化订单管理" },
  "warehouse_page.oms_desc1": { en: "Exclusive camera recording throughout the packing process – Transparent operations, maximum protection for seller rights.", vi: "Camera ghi hình độc quyền xuyên suốt quá trình đóng gói – Minh bạch vận hành, bảo vệ tối đa quyền lợi người bán.", zh: "全程独家摄像记录包装过程 – 透明运营，最大限度保护卖家权益。" },
  "warehouse_page.oms_desc2": { en: "THG Warehouse integrates video recording throughout packing to reduce error risk and protect seller rights.", vi: "THG Warehouse tích hợp quay video trong toàn bộ quá trình đóng gói, giảm rủi ro sai sót và bảo vệ quyền lợi Seller.", zh: "THG Warehouse在包装全程集成视频录制，降低出错风险，保护卖家权益。" },
  "warehouse_page.oms_cta": { en: "Experience OMS System", vi: "Trải nghiệm Hệ thống OMS", zh: "体验OMS系统" },

  // ── Pricing Page: Search Widget & UI ──
  "pricing.search_from": { en: "Ship From", vi: "Gửi Từ", zh: "从...发货" },
  "pricing.search_to": { en: "Ship To", vi: "Giao Đến", zh: "发送至" },
  "pricing.search_svc": { en: "Service", vi: "Dịch Vụ", zh: "服务" },
  "pricing.search_cargo": { en: "Cargo Type", vi: "Loại Hàng", zh: "货物类型" },
  "pricing.search_weight": { en: "Weight (KG)", vi: "Cân Nặng (KG)", zh: "重量 (KG)" },
  "pricing.search_btn": { en: "SEARCH", vi: "TRA CỨU", zh: "搜索" },
  "pricing.opt_vn": { en: "vn Vietnam", vi: "vn Việt Nam", zh: "vn 越南" },
  "pricing.opt_cn": { en: "cn China", vi: "cn Trung Quốc", zh: "cn 中国" },
  "pricing.opt_all": { en: "🌍 All Countries", vi: "🌍 Tất cả quốc gia", zh: "🌍 所有国家" },
  "pricing.svc_epa": { en: "Epacket", vi: "Epacket", zh: "E邮宝" },
  "pricing.svc_exp": { en: "Bulk / Express", vi: "Hàng Lô / Express", zh: "大货/快递" },
  "pricing.svc_terms": { en: "Terminology", vi: "Thuật Ngữ", zh: "物流术语" },
  "pricing.tab_epa_desc": { en: "Epacket & Small Parcels", vi: "Bảng giá Epacket & Bưu kiện", zh: "Epacket和邮政小包" },
  "pricing.tab_exp_desc": { en: "Bulk Cargo & Express Lines", vi: "Hàng Sỉ, Lô & Express", zh: "大货和快递专线" },
  "pricing.tab_terms_desc": { en: "Shipping Glossary & Explanations", vi: "Giải nghĩa các dịch vụ", zh: "详细服务解释与词汇" },
  "pricing.res_title": { en: "✅ Estimated Price", vi: "✅ Kết quả giá ước tính", zh: "✅ 预估价格" },
  "pricing.res_days": { en: "7–14 business days", vi: "7–14 ngày làm việc", zh: "7–14 个工作日" },
  "pricing.res_base": { en: "Estimated Base Cost", vi: "Cước Cơ Bản Ước Tính", zh: "预估基本费用" },
  "pricing.res_note": { en: "*Excludes remote area surcharges & VAT", vi: "*Chưa tính phụ phí vùng sâu & VAT", zh: "*不包含偏远附加费和增值税" },
  "pricing.btn_expand": { en: "See {count} more options", vi: "Xem thêm {count} tuỳ chọn", zh: "查看更多{count}个选项" },
  "pricing.btn_collapse": { en: "Collapse table", vi: "Thu gọn bảng giá", zh: "收起表格" },

  // Domestic Pricing Page
  "domestic.back_home": { en: "Home", vi: "Trang chủ", zh: "首页" },
  "domestic.tab_domestic": { en: "Domestic", vi: "Nội Địa", zh: "国内" },
  "domestic.tab_intl": { en: "International", vi: "Quốc Tế", zh: "国际" },
  "domestic.hero_title": { en: "US Domestic", vi: "Bảng Giá Cước", zh: "美国国内" },
  "domestic.hero_highlight": { en: "Shipping Rates", vi: "Nội Địa Mỹ", zh: "运费表" },
  "domestic.hero_desc": { en: "Competitive USPS rates from THG Warehouse fulfillment centers", vi: "Cước phí USPS cạnh tranh từ các trung tâm fulfillment của", zh: "来自THG Warehouse履约中心的有竞争力的USPS费率" },
  "domestic.table_title": { en: "Shipping Rates by Zone", vi: "Bảng Giá Cước Theo Zone", zh: "按区域运费" },
  "domestic.table_desc": { en: "USPS reference rates • Zone 1–9", vi: "Giá tham khảo USPS • Zone 1–9", zh: "USPS参考费率 • Zone 1–9" },
  "domestic.fuel_surcharge": { en: "Shipping cost includes USPS 8% fuel surcharge", vi: "Phí vận chuyển đã bao gồm 8% phụ phí nhiên liệu USPS", zh: "运费包含8%的USPS燃油附加费" },
  "domestic.swipe_hint": { en: "👉 Swipe to see more zones", vi: "👉 Vuốt ngang để xem thêm zone", zh: "👉 滑动查看更多区域" },
  "domestic.collapse": { en: "Collapse", vi: "Thu gọn", zh: "收起" },
  "domestic.see_more": { en: "See more ({count} rows)", vi: "Xem thêm ({count} dòng)", zh: "查看更多 ({count} 行)" },
  "domestic.video_title": { en: "Fulfillment Pricing Guide Video", vi: "Video Hướng Dẫn Bảng Giá Fulfill", zh: "Fulfillment定价指南视频" },
  "domestic.video_desc": { en: "Detailed breakdown of fulfillment service fees at the US warehouse", vi: "Chi tiết cách tính phí dịch vụ fulfillment tại kho Mỹ", zh: "美国仓库Fulfillment服务费详细说明" },
  "domestic.fulfill_title": { en: "Fulfillment Costs", vi: "Chi Phí Fulfillment", zh: "Fulfillment费用" },
  "domestic.fulfill_desc": { en: "Service fees at the US warehouse", vi: "Bảng phí dịch vụ tại kho Mỹ", zh: "美国仓库服务费" },
  "domestic.th_stt": { en: "No.", vi: "STT", zh: "序号" },
  "domestic.th_service": { en: "Service", vi: "Dịch vụ", zh: "服务" },
  "domestic.th_fee": { en: "Fee", vi: "Chi phí", zh: "费用" },
  "domestic.th_note": { en: "Note", vi: "Ghi chú", zh: "备注" },
  "domestic.cta_title": { en: "Need a Custom Quote?", vi: "Bạn Cần Báo Giá Tùy Chỉnh?", zh: "需要定制报价？" },
  "domestic.cta_desc": { en: "Contact the THG team for a personalized quote based on your volume and needs.", vi: "Liên hệ với đội ngũ THG để nhận bảng giá cá nhân hóa dựa trên sản lượng và nhu cầu của bạn.", zh: "联系THG团队，根据您的销量和需求获取个性化报价。" },
  "domestic.cta_btn": { en: "Get Free Quote", vi: "Nhận Báo Giá Miễn Phí", zh: "获取免费报价" },

  // Fulfillment service labels
  "fulfill.s1": { en: "Inbound Receiving", vi: "Nhập kho", zh: "入库" },
  "fulfill.s1_price": { en: "Free", vi: "Miễn phí", zh: "免费" },
  "fulfill.s2": { en: "Inspection Fee", vi: "Phí kiểm đếm", zh: "验货费" },
  "fulfill.s2_r1": { en: "- Small parcels, fewer than 20 items/carton", vi: "- Hàng hóa đóng gói nhỏ lẻ, số lượng ít hơn 20 món/carton", zh: "- 零散包装，少于20件/箱" },
  "fulfill.s2_r1_price": { en: "Free", vi: "Miễn phí", zh: "免费" },
  "fulfill.s2_r2": { en: "- Carton with single product type, quick check", vi: "- Hàng hóa đóng kiện, chỉ có 1 loại sản phẩm, kiểm tra nhanh", zh: "- 整箱单一产品，快速检查" },
  "fulfill.s2_r3": { en: "- Mixed carton with multiple product types", vi: "- Hàng hóa đóng kiện với nhiều món hàng lẫn lộn", zh: "- 混合多种产品的整箱" },
  "fulfill.s2_r4": { en: "- Large items packed by CBM", vi: "- Hàng hóa lớn, đóng gói theo CBM", zh: "- 按CBM包装的大件货物" },
  "fulfill.s2_r5": { en: "- Periodic inventory check (on request)", vi: "- Phí kiểm kê hàng hóa định kỳ (theo yêu cầu)", zh: "- 定期盘点（按需）" },
  "fulfill.s2_r5_note": { en: "May vary depending on product type", vi: "Sẽ có xê dịch tùy thuộc vào mặt hàng", zh: "视产品类型可能有所浮动" },
  "fulfill.s2_r6": { en: "- Other cases", vi: "- Các trường hợp khác", zh: "- 其他情况" },
  "fulfill.s2_r6_note": { en: "Quoted per specific case", vi: "Tính theo case cụ thể", zh: "按具体情况报价" },
  "fulfill.s3": { en: "Storage Fee", vi: "Phí lưu kho", zh: "仓储费" },
  "fulfill.s3_price": { en: "$0.1/pc/month or\n$20/CBM/month", vi: "0.1$ /pc/tháng hoặc\n20 $/ 1 CBM/ 1 tháng", zh: "$0.1/件/月 或\n$20/CBM/月" },
  "fulfill.s4": { en: "Packing, labeling & carrier drop-off", vi: "Phí đóng gói, dán label và mang hàng ra hãng vận chuyển", zh: "包装、贴标及送交承运商" },
  "fulfill.s4_r6_note": { en: "Quoted per specific case", vi: "Tính theo case cụ thể", zh: "按具体情况报价" },
  "fulfill.s4_note": { en: "For orders with more than 1 pc, add $0.5/pc for each additional piece", vi: "Nếu đơn hàng có nhiều hơn 1 pc thì sẽ cộng thêm $0.5/pc cho mỗi pc tiếp theo", zh: "超过1件的订单，每增加一件加收$0.5/件" },
  "fulfill.s5": { en: "Box/Packaging fee (varies by size & requirements)", vi: "Phí hộp/bao bì (tùy kích thước & yêu cầu đóng gói)", zh: "包装箱/包材费（按尺寸及要求）" },
  "fulfill.s5_note": { en: "For orders requiring box packaging", vi: "Áp dụng với đơn cần đóng gói hộp", zh: "适用于需要纸箱包装的订单" },
  "fulfill.s6": { en: "Return handling", vi: "Xử lý hàng trả (Return)", zh: "退货处理" },
  "fulfill.s6_price": { en: "Free", vi: "Miễn phí", zh: "免费" },
  "fulfill.s6_note": { en: "Merchandise", vi: "Hàng hóa", zh: "货物" },
  "fulfill.s7": { en: "Shipping", vi: "Giao hàng", zh: "物流配送" },
  "fulfill.s7_price": { en: "Based on USPS or other competitive carrier rates", vi: "Dựa vào phí của đơn vị USPS hoặc dịch vụ khác cạnh tranh", zh: "基于USPS或其他竞争性承运商费率" },
  "fulfill.s8": { en: "Return export fee", vi: "Phí xuất hàng trả", zh: "退货出库费" },
  "fulfill.s8_note": { en: "Quoted before processing based on actual case", vi: "Theo case thực tế, báo giá trước khi thực hiện", zh: "按实际情况，处理前报价" },

  // ── THG Fulfill Page: Ecount Guide ──
  "fulfill_ecount.section_title": { en: "System Usage Guide", vi: "Hướng dẫn sử dụng hệ thống", zh: "系统使用指南" },
  "fulfill_ecount.video_title": { en: "I. Order placement guide on HUB System Seller Portal", vi: "I. Hướng dẫn lên đơn trên HUB System Seller Portal", zh: "I. HUB System Seller Portal 下单指南" },
  "fulfill_ecount.video_desc": { en: "Watch the detailed video guide on placing orders on the THG Ecount ERP system. Note: select the correct SBSL (Ship By Seller) / SBTT (Ship By TikTok) when choosing SKU.", vi: "Xem video hướng dẫn chi tiết cách lên đơn hàng trên hệ thống Ecount ERP của THG. Lưu ý chọn đúng loại SBSL (Ship By Seller) / SBTT (Ship By TikTok) khi chọn SKU.", zh: "观看THG Ecount ERP系统下单的详细视频教程。注意：选择SKU时请正确选择SBSL（卖家发货）/ SBTT（TikTok发货）。" },
  "fulfill_ecount.sku_link": { en: "📋 Link SKU for THG FULFILL", vi: "📋 Link SKU cho THG FULFILL", zh: "📋 THG FULFILL SKU链接" },
  "fulfill_ecount.single_title": { en: "II. Place a single order on THG's ERP system", vi: "II. Lên đơn lẻ trên hệ thống ERP của THG", zh: "II. 在THG ERP系统上创建单个订单" },
  "fulfill_ecount.single_desc": { en: "Detailed step-by-step guide to place orders on the Ecount ERP system.", vi: "Hướng dẫn chi tiết từng bước để lên đơn hàng trên hệ thống Ecount ERP.", zh: "在Ecount ERP系统上下单的详细分步指南。" },
  "fulfill_ecount.step1_title": { en: "Log in to the system", vi: "Đăng nhập vào hệ thống", zh: "登录系统" },
  "fulfill_ecount.step1_desc": { en: "Access the account provided by THG at", vi: "Truy cập tài khoản do THG cung cấp tại", zh: "使用THG提供的账户访问" },
  "fulfill_ecount.step1_desc2": { en: ". Enter the login credentials (company code, ID, password) that THG sent you.", vi: ". Nhập thông tin đăng nhập (mã công ty, ID, mật khẩu) mà THG đã gửi cho bạn.", zh: "。输入THG发送给您的登录信息（公司代码、ID、密码）。" },
  "fulfill_ecount.step2_title": { en: "Enter recovery email", vi: "Điền Email khôi phục", zh: "填写恢复邮箱" },
  "fulfill_ecount.step2_desc": { en: "After first login, the system will require an email for password recovery. Enter your email and click \"Send recovery email\" to avoid losing your account.", vi: "Sau khi đăng nhập lần đầu, hệ thống sẽ yêu cầu nhập email để khôi phục mật khẩu. Điền email của bạn và nhấn \"Gửi Email khôi phục\" để tránh mất tài khoản.", zh: "首次登录后，系统将要求输入用于密码恢复的邮箱。输入您的邮箱并点击\"发送恢复邮件\"以避免丢失账户。" },
  "fulfill_ecount.step3_title": { en: "Go to Personal Page → New Sale", vi: "Vào trang cá nhân → Bán hàng mới", zh: "进入个人页面 → 新建销售" },
  "fulfill_ecount.step3_desc": { en: "Click on \"Personal Page\", then select \"New Sale\" to start creating an order. Fill in all required fields.", vi: "Click vào \"Trang cá nhân\", sau đó chọn \"Bán hàng mới\" để bắt đầu tạo đơn hàng. Điền đầy đủ các trường thông tin bắt buộc.", zh: "点击\"个人页面\"，然后选择\"新建销售\"开始创建订单。填写所有必填字段。" },
  "fulfill_ecount.fields_title": { en: "📋 Field descriptions:", vi: "📋 Mô tả các trường thông tin:", zh: "📋 字段说明：" },
  "fulfill_ecount.field_location": { en: "THG workshop code (e.g., 001 for phonecase)", vi: "Mã hoá xưởng THG (VD: 001 cho phonecase)", zh: "THG车间代码（例如：001代表手机壳）" },
  "fulfill_ecount.field_orderid": { en: "Your order ID", vi: "Mã đơn hàng của bạn", zh: "您的订单号" },
  "fulfill_ecount.field_tracking": { en: "Carrier tracking number", vi: "Mã tracking đơn vận chuyển", zh: "物流追踪号" },
  "fulfill_ecount.field_seller": { en: "Customer code provided by THG (e.g., CUS001)", vi: "Mã khách hàng THG cung cấp (VD: CUS001)", zh: "THG提供的客户代码（例如：CUS001）" },
  "fulfill_ecount.field_service": { en: "SBTT (Ship by TikTok) / SBSL (Ship by Seller)", vi: "SBTT (Ship by TikTok) / SBSL (Ship by Seller)", zh: "SBTT（TikTok发货）/ SBSL（卖家发货）" },
  "fulfill_ecount.field_label": { en: "Paste label link (Google Drive, etc.)", vi: "Dán link label (Google Drive, v.v.)", zh: "粘贴标签链接（Google Drive等）" },
  "fulfill_ecount.step4_title": { en: "Select SKU & Save order", vi: "Chọn SKU & Lưu đơn hàng", zh: "选择SKU并保存订单" },
  "fulfill_ecount.step4_desc": { en: "Double-click on the SKU blank to select SKU for the order or use the SKU link provided by THG. Note: select the correct SBSL/SBTT to choose the right SKU.", vi: "Bấm đúp chuột vào khoảng trống của SKU để chọn SKU cho đơn hàng hoặc dùng link SKU do THG cung cấp. Chú ý chọn đúng SBSL/SBTT để chọn đúng SKU.", zh: "双击SKU空白处为订单选择SKU，或使用THG提供的SKU链接。注意：正确选择SBSL/SBTT以选择正确的SKU。" },
  "fulfill_ecount.step4_example": { en: "💡 Example: iPhone 12 Pro SKU is", vi: "💡 Ví dụ: iPhone 12 Pro SKU sẽ là", zh: "💡 示例：iPhone 12 Pro的SKU为" },
  "fulfill_ecount.step4_example2": { en: "for Ship by TikTok, 2-layer toughcase.", vi: "cho ship by TikTok, dòng toughcase 2 lớp.", zh: "用于TikTok发货，双层防摔壳。" },

  // ── THG Express Page: Stats & Labels ──
  "express_page.partnership_title_sub": { en: "TRUSTED LOGISTICS PARTNER CHINA - US", vi: "ĐỐI TÁC LOGISTIC TIN CẬY TRUNG QUỐC - MỸ", zh: "中美可信赖的物流合作伙伴" },
  "express_page.partnership_desc": { en: "Fast, transparent CHINA - US shipping solutions for your E-Commerce breakthrough", vi: "Giải pháp vận chuyển TRUNG - MỸ thần tốc, minh bạch để bạn bứt phá trên thị trường E-Commerce", zh: "快速透明的中美运输解决方案，助您在电子商务市场取得突破" },

  "express_page.warehouse_title": { en: "WAREHOUSE SYSTEM IN CHINA", vi: "HỆ THỐNG KHO TẠI CHINA", zh: "中国仓储系统" },
  "express_page.warehouse_desc": { en: "THG warehouse provides comprehensive logistics solutions for both bulk and retail goods on the China - US route.", vi: "Kho THG cung cấp giải pháp logistics toàn diện cho cả hàng lô và hàng lẻ trên tuyến Trung Quốc - Mỹ.", zh: "THG仓库为中美国际路线的批量和零售货物提供全面的物流解决方案。" },
  "express_page.warehouse_feature1_title": { en: "CENTRAL WAREHOUSES", vi: "KHO BÃI TRUNG TÂM", zh: "中央仓库" },
  "express_page.warehouse_feature1_desc": { en: "2 warehouses in Dongguan & Shenzhen. Optimizing sea & air routes.", vi: "2 kho tại Đông Hoản & Thâm Quyến. Tối ưu hóa tuyến đường biển & hàng không.", zh: "东莞和深圳有2个仓库。优化海运和空运路线。" },
  "express_page.warehouse_feature2_title": { en: "ABSOLUTE SUPPORT", vi: "HỖ TRỢ TUYỆT ĐỐI", zh: "绝对支持" },
  "express_page.warehouse_feature2_desc": { en: "Counting, Sorting, Barcoding. Product QC, Packaging, Photography.", vi: "Hỗ trợ Kiểm đếm, Phân loại, Dán Barcode. QC sản phẩm, Gia cố đơn hàng, Quay chụp.", zh: "支持清点、分类、贴条码、产品QC、包装加固、摄影。" },
  "express_page.warehouse_feature3_title": { en: "SMART SYSTEM", vi: "HỆ THỐNG THÔNG MINH", zh: "智能系统" },
  "express_page.warehouse_feature3_desc": { en: "Barcode management system (WMS) ensures high accuracy.", vi: "Hệ thống quản lý (WMS) bằng barcode đảm bảo độ chính xác cao.", zh: "基于条码管理的WMS系统，确保高精确度。" },

  "express_page.policy_section_title": { en: "EXPRESS ORDERS", vi: "ĐƠN EXPRESS", zh: "快递订单" },
  "express_page.policy_section_subtitle": { en: "POLICIES & TERMS", vi: "CHÍNH SÁCH & ĐIỀU KHOẢN", zh: "政策与条款" },

  "express_page.line_routes_title": { en: "SUMMARY OF SHIPPING ROUTES", vi: "TỔNG HỢP CÁC LINE VẬN CHUYỂN", zh: "运输线路总览" },
  "express_page.line_routes_desc": { en: "THG Express offers a variety of shipping routes, optimized for each seller's needs and business model. Whether you operate via POD, dropship, or have your own warehouse, we have the right solution to deliver goods quickly, cost-effectively, and meet delivery standards in the US, EU, and UK markets.", vi: "THG Express cung cấp đa dạng line vận chuyển, tối ưu cho từng nhu cầu và mô hình kinh doanh của seller. Dù bạn đang vận hành theo hình thức POD, dropship hay có kho riêng, chúng tôi đều có giải pháp phù hợp giúp hàng đến tay khách nhanh chóng, chi phí hợp lý và đảm bảo tiêu chuẩn giao hàng tại thị trường Mỹ, EU, UK.", zh: "THG Express提供多种运输线路，针对每个卖家的需求和商业模式进行优化。无论您是通过POD、代发货运营还是有自己的仓库，我们都有合适的解决方案，可以快速、低成本地将货物送达客户，并满足美国、欧盟和英国市场的交货标准。" },
  "express_page.get_quote_cta": { en: "GET A QUOTE NOW", vi: "NHẬN BÁO GIÁ NGAY", zh: "立即获取报价" },

  "express_page.route1_title": { en: "Vietnam → US", vi: "Việt Nam → Mỹ", zh: "越南 → 美国" },
  "express_page.route1_bulk": { en: "Bulk Shipping", vi: "Hàng Lô", zh: "大宗货物" },
  "express_page.route1_epacket": { en: "Epacket Shipping", vi: "Hàng Epacket", zh: "Epacket货物" },

  "express_page.route2_title": { en: "China → US", vi: "Trung Quốc → Mỹ", zh: "中国 → 美国" },
  "express_page.route2_tiktok": { en: "Tiktok US/UK/DE Shipping", vi: "Hàng Tiktok US/UK/DE", zh: "Tiktok美英德发货" },

  "express_page.route3_title": { en: "Vietnam/China → Worldwide", vi: "Việt Nam/Trung Quốc → Worldwide", zh: "越南/中国 → 全球" },

  "express_page.route4_title": { en: "TikTok Shop Line", vi: "Line TikTok Shop", zh: "TikTok Shop 线路" },
  "express_page.route4_us": { en: "Tiktok US", vi: "Tiktok US", zh: "Tiktok 美国" },
  "express_page.route4_uk": { en: "Tiktok UK", vi: "Tiktok UK", zh: "Tiktok 英国" },
  "express_page.route4_de": { en: "Tiktok DE", vi: "Tiktok DE", zh: "Tiktok 德国" },

  "express_page.shipping_comprehensive_title": { en: "THG EXPRESS COMPREHENSIVE INTERNATIONAL SHIPPING SOLUTION", vi: "THG EXPRESS GIẢI PHÁP VẬN CHUYỂN QUỐC TẾ TOÀN DIỆN", zh: "THG EXPRESS 全面国际航运解决方案" },
  "express_page.shipping_comprehensive_feat1": { en: "Outstanding speed from only 3-5 working days", vi: "Tốc độ ưu việt chỉ từ 3-5 ngày làm việc", zh: "出色的速度，只需3-5个工作日" },
  "express_page.shipping_comprehensive_feat2": { en: "Diverse shipping lines from Air, Sea to Express", vi: "Đa dạng Line vận chuyển từ Air, Sea đến Express", zh: "多样化的运输线路（空运、海运、快递）" },
  "express_page.shipping_comprehensive_feat3": { en: "Accurate and transparent real-time tracking", vi: "Tracking thời gian thực minh bạch chính xác", zh: "准确透明的实时包裹追踪" },
  "express_page.shipping_comprehensive_feat4": { en: "Clear compensation policy, fast 24/7 support", vi: "Chính sách đền bù rõ ràng, hỗ trợ nhanh chóng 24/7", zh: "明确的理赔政策，24/7快速支持" },
  "express_page.shipping_comprehensive_cta": { en: "Get a Quote Now", vi: "Nhận Báo Giá Ngay", zh: "立即获取报价" },

  "express_page.trust_title": { en: "Why customers trust THG Express?", vi: "Tại sao THG Express được khách hàng tin tưởng?", zh: "为什么客户信任THG Express？" },


  "express_page.policy_cta": { en: "View Details", vi: "Xem chi tiết", zh: "查看详情" },

  // ── THG Warehouse Page: FAQ Section ──
  "wh_faq.title": { en: "Frequently Asked Questions", vi: "Câu hỏi thường gặp", zh: "常见问题" },
  "wh_faq.subtitle": { en: "Quick answers about THG Warehouse US services", vi: "Giải đáp nhanh các thắc mắc về dịch vụ THG Warehouse US", zh: "THG Warehouse美国服务常见问题快速解答" },
  "wh_faq.step_prefix": { en: "Step", vi: "Bước", zh: "步骤" },
  "wh_faq.q1": { en: "How many warehouses does THG currently have?", vi: "THG có bao nhiêu kho ở thời điểm hiện tại?", zh: "THG目前有多少个仓库？" },
  "wh_faq.a1": { en: "THG currently has 2 warehouses in the US: Pennsylvania (PA) and Winston-Salem, North Carolina (NC). The dual warehouse system covers the entire US, optimizing delivery time to 2-5 days.", vi: "THG hiện có 2 kho tại Mỹ: Pennsylvania (PA) và Winston-Salem, North Carolina (NC). Hệ thống kho kép giúp phủ sóng toàn nước Mỹ, tối ưu thời gian giao hàng 2–5 ngày.", zh: "THG目前在美国有2个仓库：宾夕法尼亚州（PA）和北卡罗来纳州温斯顿-塞勒姆（NC）。双仓库系统覆盖全美，优化配送时间至2-5天。" },
  "wh_faq.q2": { en: "Is there anything to note when shipping goods through THG Warehouse?", vi: "Hàng hóa gửi qua THG Warehouse có cần lưu ý gì không?", zh: "通过THG Warehouse寄送货物需要注意什么？" },
  "wh_faq.a2": { en: "Items need clear barcodes on each product. Before shipping, you need to create an Inbound Request (IR) on the OMS system. THG provides barcode PDF files if the product doesn't have one.", vi: "Hàng cần có barcode rõ ràng trên từng sản phẩm. Trước khi gửi hàng, bạn cần tạo yêu cầu nhập kho (IR) trên hệ thống OMS. THG hỗ trợ cung cấp file PDF barcode nếu sản phẩm chưa có.", zh: "每件产品需要有清晰的条码。发货前，您需要在OMS系统上创建入库请求（IR）。如果产品没有条码，THG提供PDF条码文件。" },
  "wh_faq.q3": { en: "Does THG support storage for sellers?", vi: "THG có hỗ trợ Seller về lưu kho không?", zh: "THG是否为卖家提供仓储支持？" },
  "wh_faq.a3": { en: "Yes. THG offers free storage for the first 90 days. From day 91 onwards, storage fees will apply as notified by the THG team.", vi: "Có. THG miễn phí lưu kho cho 90 ngày đầu tiên. Từ ngày thứ 91 trở đi sẽ có phí lưu kho theo thông báo từ team THG.", zh: "是的。THG提供前90天免费仓储。从第91天起，将按THG团队通知收取仓储费。" },
  "wh_faq.q4": { en: "Does THG support product photography/videography when needed?", vi: "THG có hỗ trợ quay, chụp sản phẩm khi cần thiết không?", zh: "THG是否在需要时提供产品拍摄/录像支持？" },
  "wh_faq.a4": { en: "Yes. THG records video of the entire packing process (100% of orders). Additionally, THG can support product photography on request. Please contact the team for details.", vi: "Có. THG hỗ trợ quay video toàn bộ quá trình đóng gói (100% đơn hàng). Ngoài ra, THG có thể hỗ trợ chụp ảnh sản phẩm theo yêu cầu. Vui lòng liên hệ team để biết thêm chi tiết.", zh: "是的。THG录制完整包装过程视频（100%订单）。此外，THG可应要求提供产品拍摄支持。请联系团队了解详情。" },
  "wh_faq.q5": { en: "Can THG receive returns and goods from Amazon warehouses?", vi: "THG có thể nhận hàng Return và hàng gửi từ kho Amazon vào kho THG không?", zh: "THG能否接收退货和从亚马逊仓库转来的货物？" },
  "wh_faq.a5": { en: "Yes. THG receives and processes returns for free for all THG-fulfilled orders. THG also supports receiving goods transferred from Amazon FBA to THG Warehouse.", vi: "Có. THG nhận và xử lý hàng return miễn phí cho tất cả đơn hàng do THG thực hiện. THG cũng hỗ trợ nhận hàng chuyển từ kho Amazon FBA về kho THG Warehouse.", zh: "是的。THG免费接收和处理所有THG履约订单的退货。THG还支持接收从Amazon FBA转到THG仓库的货物。" },
  "wh_faq.q6": { en: "How many types of packaging does THG offer?", vi: "THG có bao nhiêu loại bao bì đóng gói?", zh: "THG提供多少种包装类型？" },
  "wh_faq.a6": { en: "THG offers various packaging: poly bags, carton boxes in various sizes, bubble wrap and international-standard shock-resistant materials. Sellers can request custom branded packaging.", vi: "THG cung cấp nhiều loại bao bì: túi poly, hộp carton các kích cỡ, bubble wrap và vật liệu chống sốc tiêu chuẩn quốc tế. Seller có thể yêu cầu sử dụng bao bì riêng của thương hiệu.", zh: "THG提供多种包装：塑料袋、各种尺寸的纸箱、气泡膜和符合国际标准的防震材料。卖家可以要求使用自己品牌的定制包装。" },
  "wh_faq.q7": { en: "How long is the pick & pack and USPS drop-off time?", vi: "Thời gian pick & pack và mang hàng ra bưu cục USPS?", zh: "拣货打包和USPS投递需要多长时间？" },
  "wh_faq.a7": { en: "Typically orders are processed and picked & packed within 24-48 business hours. Goods are dropped off at USPS/FedEx/UPS the same day or next day depending on order volume.", vi: "Thông thường đơn hàng được xử lý và pick & pack trong vòng 24–48 giờ làm việc. Hàng được mang ra bưu cục USPS/FedEx/UPS trong ngày hoặc ngày hôm sau tùy khối lượng đơn.", zh: "通常订单在24-48个工作小时内处理和拣货打包。货物在当天或第二天送到USPS/FedEx/UPS，具体取决于订单量。" },
  "wh_faq.q8": { en: "How to determine the delivery zone (USPS Shipping Zone)?", vi: "Cách xác định vùng giao hàng (USPS Shipping Zone)?", zh: "如何确定配送区域（USPS Shipping Zone）？" },
  "wh_faq.a8": { en: "USPS Shipping Zone is calculated based on the distance from THG warehouse (PA & NC) to the recipient's address. Lower zone = cheaper shipping and faster delivery. THG team will advise on the appropriate zone when you start using the service.", vi: "USPS Shipping Zone được tính dựa trên khoảng cách từ kho THG (PA & NC) đến địa chỉ người nhận. Zone càng thấp, phí ship càng rẻ và giao hàng càng nhanh. Team THG sẽ tư vấn zone phù hợp khi bắt đầu sử dụng dịch vụ.", zh: "USPS配送区域根据THG仓库（PA和NC）到收件人地址的距离计算。区域编号越低，运费越便宜，配送越快。THG团队将在您开始使用服务时建议合适的区域。" },
  "wh_faq.q9": { en: "What is the barcode processing procedure?", vi: "Quy trình xử lý Barcode?", zh: "条码处理流程是什么？" },
  "wh_faq.a9": { en: "1. Create or assign barcode for each product.\n2. THG provides barcode PDF files if needed.\n3. Print and attach barcodes to products before sending to warehouse, or THG can assist with labeling at the warehouse.", vi: "1. Tạo hoặc gán barcode cho từng sản phẩm.\n2. THG cung cấp file PDF barcode nếu cần.\n3. In và dán barcode lên sản phẩm trước khi gửi vào kho, hoặc THG có thể hỗ trợ dán tại kho.", zh: "1. 为每个产品创建或分配条码。\n2. 如需要，THG提供条码PDF文件。\n3. 在发送到仓库之前打印并贴上条码，或THG可以在仓库协助贴标。" },
  "wh_faq.q10": { en: "What is the US Warehouse shipping procedure?", vi: "Quy trình gửi hàng Warehouse US?", zh: "美国仓库发货流程是什么？" },
  "wh_faq.a10": { en: "1. Create IR (Inbound Request) on OMS.\n2. Pack and ship goods to THG warehouse address (PA or NC).\n3. THG receives, inspects and stores goods.\n4. Inventory is updated in real-time on OMS.", vi: "1. Tạo IR (Inbound Request) trên OMS.\n2. Đóng gói và gửi hàng đến địa chỉ kho THG (PA hoặc NC).\n3. THG nhận hàng, kiểm tra và nhập kho.\n4. Tồn kho được cập nhật real-time trên OMS.", zh: "1. 在OMS上创建IR（入库请求）。\n2. 包装并将货物发送到THG仓库地址（PA或NC）。\n3. THG接收、检查并入库商品。\n4. 库存在OMS上实时更新。" },
  "wh_faq.q11": { en: "What is the order placement procedure?", vi: "Quy trình lên đơn hàng?", zh: "下单流程是什么？" },
  "wh_faq.a11": { en: "Orders can be auto-synced from Shopify/Etsy/Amazon via OMS, or placed manually on the OMS system. THG processes orders, picks & packs, records packaging video and delivers to carrier.", vi: "Đơn có thể được sync tự động từ Shopify/Etsy/Amazon qua OMS, hoặc lên đơn thủ công trực tiếp trên hệ thống OMS. THG xử lý đơn, pick & pack, quay video đóng gói và giao cho carrier.", zh: "订单可以通过OMS从Shopify/Etsy/Amazon自动同步，或在OMS系统上手动下单。THG处理订单、拣货打包、录制包装视频并交给承运商。" },
  "wh_faq.q12": { en: "What is the returns processing procedure?", vi: "Quy trình xử lý hàng Return?", zh: "退货处理流程是什么？" },
  "wh_faq.a12": { en: "1. THG receives and inspects returned items.\n2. Updates status on OMS.\n3. Seller decides to re-export or dispose.\nFree 100% for all THG-fulfilled orders.", vi: "1. THG tiếp nhận và kiểm tra tình trạng hàng return.\n2. Cập nhật trạng thái trên OMS.\n3. Seller quyết định tái xuất hoặc hủy hàng.\nMiễn phí 100% phí xử lý return cho mọi đơn THG thực hiện.", zh: "1. THG接收并检查退货商品状况。\n2. 在OMS上更新状态。\n3. 卖家决定重新出口或销毁。\nTHG履约的所有订单100%免费处理退货。" },
  "wh_faq.q13": { en: "What is the payment settlement procedure?", vi: "Quy trình xử lý công nợ?", zh: "结算流程是什么？" },
  "wh_faq.a13": { en: "THG notifies balances periodically via OMS and email. Sellers pay by bank transfer or agreed methods. Please contact customer support for details on payment policies.", vi: "THG thông báo công nợ định kỳ qua hệ thống OMS và email. Seller thanh toán theo hình thức chuyển khoản hoặc các phương thức được thỏa thuận. Vui lòng liên hệ team CSKH để biết chi tiết về chính sách thanh toán.", zh: "THG通过OMS系统和邮件定期通知账户余额。卖家通过银行转账或约定方式付款。请联系客服团队了解付款政策详情。" },

  // ── THG Order Page: Hero Badge ──
  "order_page.badge_taobao": { en: "🇨🇳 Taobao · 1688", vi: "🇨🇳 Taobao · 1688", zh: "🇨🇳 淘宝 · 1688" },
  "order_page.badge_direct": { en: "✈️ Direct to USA", vi: "✈️ Giao thẳng về Mỹ", zh: "✈️ 直邮美国" },

  // ── THG Order Page (op.*) ──
  "op.hero_t1": { en: "Buy from China –", vi: "Mua hàng Trung Quốc –", zh: "从中国采购 –" },
  "op.hero_hl": { en: "delivered to your door in USA", vi: "giao tận tay nước Mỹ", zh: "送达美国家门口" },
  "op.hero_desc": { en: "THG Fulfill helps Vietnamese Americans buy safely from Taobao & 1688 – no language barriers, no scam risk, no routing through Vietnam.", vi: "THG Fulfill giúp người Việt sống tại Mỹ mua hàng từ Taobao, 1688 an toàn – không rào cản ngôn ngữ, không lo bị lừa, không cần qua Việt Nam.", zh: "THG Fulfill帮助在美越南人安全购买淘宝和1688商品 – 无语言障碍、无诈骗风险、无需经越南中转。" },
  "op.hero_cta": { en: "Get Free Consultation", vi: "Nhận tư vấn miễn phí", zh: "获取免费咨询" },
  "op.hero_cta2": { en: "See How It Works", vi: "Xem quy trình", zh: "了解流程" },
  "op.stat1": { en: "Successful orders", vi: "Đơn hàng thành công", zh: "成功订单" },
  "op.stat2": { en: "On-time delivery rate", vi: "Đơn hàng về đúng hẹn", zh: "准时交付率" },
  "op.stat3": { en: "Lost packages & money", vi: "Mất hàng & mất tiền", zh: "丢件和损失" },
  "op.stat4": { en: "Average customer rating", vi: "Đánh giá từ khách hàng", zh: "平均客户评分" },
  "op.stat5": { en: "Warehouses: VN · CN · USA", vi: "Kho hàng: VN · China · USA", zh: "仓库：越南·中国·美国" },

  // Pain Points
  "op.pain_eye": { en: "Sound familiar?", vi: "Bạn đang gặp phải?", zh: "听起来很熟悉？" },
  "op.pain_title": { en: "The struggles of buying from China while living in the USA", vi: "Nỗi lo của người Việt tại Mỹ khi muốn mua hàng Trung Quốc", zh: "在美国生活时从中国购物的困扰" },
  "op.pain_sub": { en: "Products are 2–5× cheaper than Amazon – but getting them is a nightmare. We understand every pain point.", vi: "Hàng rẻ hơn Amazon 2–5 lần – nhưng mua được là cả một hành trình đau đầu. THG hiểu từng khó khăn bạn gặp.", zh: "商品比亚马逊便宜2-5倍，但购买过程令人头疼。我们理解每一个痛点。" },
  "op.pain1_t": { en: "Can't find a trustworthy agent", vi: "Không tìm được đơn vị uy tín", zh: "找不到可信的代理" },
  "op.pain1_d": { en: "Hundreds of services with no way to verify. One wrong choice and your money is gone.", vi: "Hàng trăm dịch vụ không biết ai thật ai giả. Chọn nhầm một lần là mất tiền oan.", zh: "数百种服务无法验证，选错一次钱就没了。" },
  "op.pain2_t": { en: "Language barrier with Chinese suppliers", vi: "Rào cản ngôn ngữ với nhà cung cấp", zh: "与中国供应商的语言障碍" },
  "op.pain2_d": { en: "Can't negotiate price, request quality specs, or handle complaints in Mandarin.", vi: "Không biết tiếng Trung, không thể thương lượng giá hay yêu cầu chất lượng với nhà cung cấp.", zh: "无法用中文议价、要求质量规格或处理投诉。" },
  "op.pain3_t": { en: "Fear of scams & fake goods", vi: "Sợ bị lừa – hàng giả, hàng kém chất lượng", zh: "担心诈骗和假货" },
  "op.pain3_d": { en: "Photos show one thing, reality another. Hundreds of dollars lost with no recourse.", vi: "Ảnh 1 sao hàng thực tế 0 sao. Hàng trăm đô la bay đi không dấu vết.", zh: "照片与实物不符，数百美元损失无处追。" },
  "op.pain4_t": { en: "Wrong item, no return possible", vi: "Hàng sai – không thể hoàn trả", zh: "收到错误商品，无法退货" },
  "op.pain4_d": { en: "Wrong or defective goods arrive and returning is impossible due to distance and language barriers.", vi: "Hàng sai hoặc lỗi muốn đổi trả không được vì khoảng cách quá xa và bất đồng ngôn ngữ.", zh: "收到错误或有缺陷的商品，由于距离和语言障碍无法退货。" },
  "op.pain5_t": { en: "Must route through Vietnam first", vi: "Phải chuyển vòng qua Việt Nam", zh: "必须先经越南中转" },
  "op.pain5_d": { en: "Inspecting in Vietnam before shipping to USA wastes 3–4 extra weeks and $150–300 in unnecessary shipping fees.", vi: "Hàng về Việt Nam kiểm tra xong mới dám gửi đi Mỹ – tốn thêm 3–4 tuần và hàng trăm USD phí vô ích.", zh: "在越南检查后再寄美国，多浪费3-4周和150-300美元。" },
  "op.pain6_t": { en: "Zero updates, weeks of silence", vi: "Chờ đợi mòn mỏi, không ai cập nhật", zh: "零更新，数周无音讯" },
  "op.pain6_d": { en: "Order placed, then nothing. No tracking, no communication – weeks of anxious waiting.", vi: "Đặt hàng xong rơi vào im lặng. Không biết hàng đang ở đâu – lo lắng suốt cả tháng trời.", zh: "下单后杳无音讯。没有跟踪，没有沟通——焦虑等待数周。" },

  // How It Works
  "op.how_eye": { en: "Our Process", vi: "Quy trình", zh: "我们的流程" },
  "op.how_title": { en: "Simple. Just 5 steps.", vi: "Đơn giản chỉ 5 bước", zh: "简单，只需5步" },
  "op.how_sub": { en: "THG handles everything from ordering in China to delivering to your door in the USA.", vi: "THG xử lý toàn bộ từ đặt hàng bên Trung Quốc đến giao tận cửa nhà bạn ở Mỹ.", zh: "THG处理从中国订购到送货到您美国家门口的一切。" },
  "op.step1_t": { en: "Send product link", vi: "Gửi link sản phẩm", zh: "发送商品链接" },
  "op.step1_d": { en: "Copy link from Taobao or 1688, send via Facebook / Messenger", vi: "Copy link từ Taobao hoặc 1688 gửi cho THG qua Facebook / Messenger", zh: "复制淘宝或1688链接，通过Facebook/Messenger发送" },
  "op.step2_t": { en: "Consult & Quote", vi: "Tư vấn & Báo giá", zh: "咨询报价" },
  "op.step2_d": { en: "THG verifies supplier, quotes all-in price: goods + shipping + service fee", vi: "THG kiểm tra nhà cung cấp, báo giá trọn gói: hàng + ship + phí dịch vụ", zh: "THG验证供应商，报全包价：商品+运费+服务费" },
  "op.step3_t": { en: "Order & Payment", vi: "Đặt hàng & Thanh toán", zh: "下单付款" },
  "op.step3_d": { en: "You confirm, THG orders in Mandarin – nothing more needed from you", vi: "Bạn xác nhận, THG đặt hàng bằng tiếng Trung – không cần bạn làm gì thêm", zh: "您确认后，THG用中文下单——无需您做更多" },
  "op.step4_t": { en: "Inspect & Video", vi: "Kiểm tra & Quay video", zh: "检验录像" },
  "op.step4_d": { en: "Goods arrive at THG warehouse, fully inspected, video sent to you before shipping", vi: "Hàng về kho THG, kiểm tra kỹ, quay video gửi bạn xem rồi mới ship", zh: "货物到THG仓库，全面检查，发货前发视频给您" },
  "op.step5_t": { en: "Delivered in USA", vi: "Giao tận nhà ở Mỹ", zh: "送达美国" },
  "op.step5_d": { en: "Shipped directly to your US address, real-time tracking all the way", vi: "Ship thẳng đến địa chỉ tại Hoa Kỳ, tracking real-time liên tục cập nhật", zh: "直接发到您的美国地址，全程实时跟踪" },

  // Solutions
  "op.sol_eye": { en: "THG Solutions", vi: "Giải pháp THG", zh: "THG解决方案" },
  "op.sol_title": { en: "We solve every problem", vi: "THG giải quyết mọi nỗi lo", zh: "我们解决每一个问题" },
  "op.sol_sub": { en: "One partner. Total solution. Peace of mind from first click to front door.", vi: "Một đơn vị – toàn bộ giải pháp. An tâm từ khi đặt hàng đến khi cầm hàng trong tay.", zh: "一个合作伙伴，全方位解决方案，从下单到收货全程安心。" },
  "op.sol1_tag": { en: "Trust & Safety", vi: "Uy tín & An toàn", zh: "信任与安全" },
  "op.sol1_t": { en: "Real address. Real business. Proven track record.", vi: "Đơn vị có địa chỉ thực, hoạt động minh bạch", zh: "真实地址，真实企业，过往业绩" },
  "op.sol1_d": { en: "THG Fulfill is a registered business with offices in HCMC, warehouses in Guangdong (China), Milford PA & Winston-Salem NC. Thousands of successful orders.", vi: "THG Fulfill có văn phòng tại TP.HCM, kho tại Trung Quốc và Mỹ. Hàng nghìn đơn hàng thành công.", zh: "THG Fulfill是注册企业，办公室在胡志明市，仓库在广东（中国）、宾州和北卡。数千成功订单。" },
  "op.sol2_tag": { en: "Mandarin Fluent", vi: "Đàm phán trung gian", zh: "精通中文" },
  "op.sol2_t": { en: "We negotiate directly with Chinese suppliers for you", vi: "Đội ngũ đàm phán trực tiếp với nhà cung cấp China", zh: "我们直接用中文与供应商谈判" },
  "op.sol2_d": { en: "Our team handles all communication in Mandarin – price negotiation, quality requests, and dispute resolution. You don't need to know a single Chinese character.", vi: "Chúng tôi thương lượng giá, xác minh nhà cung cấp và xử lý toàn bộ bằng tiếng Trung. Bạn không cần biết nửa chữ tiếng Trung.", zh: "我们的团队用中文处理所有沟通——议价、质量要求和纠纷解决。您不需要认识任何中文。" },
  "op.sol3_tag": { en: "Video Inspection", vi: "Video kiểm hàng thực tế", zh: "视频验货" },
  "op.sol3_t": { en: "See your goods before they ship – no surprises", vi: "Xem video trước khi ship – không bao giờ bị bất ngờ", zh: "发货前看到您的商品——没有意外" },
  "op.sol3_d": { en: "100% of orders are inspected and video-recorded before packing. You review the video, approve, then we ship. Fully transparent.", vi: "100% đơn hàng được kiểm tra và quay video chi tiết trước khi đóng gói. Bạn xem, xác nhận rồi THG mới gửi đi.", zh: "100%订单在包装前进行检查和录像。您审核视频、确认后我们才发货。完全透明。" },
  "op.sol4_tag": { en: "Buyer Protection", vi: "Bảo vệ quyền lợi", zh: "买家保障" },
  "op.sol4_t": { en: "Defective goods? THG refunds or reships – free", vi: "Hàng lỗi – THG hoàn tiền hoặc gửi lại miễn phí", zh: "商品有缺陷？THG免费退款或重新发货" },
  "op.sol4_d": { en: "If goods don't match description or are defective, THG takes full responsibility – we work with the Chinese supplier to refund or send new goods at no cost.", vi: "Nếu hàng không đúng mô tả hoặc bị lỗi, THG chịu trách nhiệm hoàn toàn – làm việc với nhà cung cấp để hoàn tiền hoặc gửi lại hàng mới.", zh: "如果商品与描述不符或有缺陷，THG承担全部责任——与供应商协商退款或免费重发。" },
  "op.sol5_tag": { en: "China → USA Direct", vi: "Ship thẳng China → USA", zh: "中国直邮美国" },
  "op.sol5_t": { en: "Skip the Vietnam detour. Save 3–4 weeks & $150–300", vi: "Không cần vòng qua Việt Nam – tiết kiệm 3–4 tuần", zh: "跳过越南中转，节省3-4周和150-300美元" },
  "op.sol5_d": { en: "THG has warehouses in Guangdong (China), Milford PA & Winston-Salem NC. Goods inspected at China warehouse, then shipped directly to your US address.", vi: "THG có kho tại Đông Hoản (Trung Quốc), Milford PA & Winston-Salem NC. Hàng kiểm tra tại China rồi ship thẳng đến địa chỉ Mỹ.", zh: "THG在广东（中国）、宾州和北卡设有仓库。货物在中国仓库检查后直接发往您的美国地址。" },
  "op.sol6_tag": { en: "Real-time Tracking", vi: "Tracking Real-time", zh: "实时追踪" },
  "op.sol6_t": { en: "Always know where your package is", vi: "Biết hàng đang ở đâu – cập nhật chủ động mọi lúc", zh: "随时知道包裹在哪里" },
  "op.sol6_d": { en: "Updates via Facebook, Messenger, or email. You don't have to ask – we proactively notify you at every step until your package arrives.", vi: "Cập nhật qua Facebook, Messenger hoặc email. Không cần bạn hỏi – THG chủ động thông báo từng bước đến khi hàng gõ cửa nhà bạn.", zh: "通过Facebook、Messenger或邮件更新。无需您询问——我们在每个步骤主动通知您。" },

  // Videos
  "op.vid_eye": { en: "See Us In Action", vi: "Thực tế tại THG", zh: "观看我们的实际操作" },
  "op.vid_title": { en: "Watch how we work", vi: "Xem chúng tôi làm việc", zh: "观看我们的工作方式" },
  "op.vid_sub": { en: "Real footage from THG warehouses – unscripted, unedited.", vi: "Video thực tế từ kho hàng THG – không dàn dựng, không chỉnh sửa.", zh: "来自THG仓库的真实影像——未经编辑。" },
  "op.vid_tap": { en: "Tap to watch", vi: "Nhấn để xem", zh: "点击观看" },
  "op.vid_more": { en: "More videos on @thgfulfillment →", vi: "Xem thêm video trên @thgfulfillment →", zh: "更多视频请访问 @thgfulfillment →" },

  // Testimonials
  "op.testi_eye": { en: "Customer Reviews", vi: "Khách hàng nói gì?", zh: "客户评价" },
  "op.testi_title": { en: "Vietnamese Americans trust THG", vi: "Người Việt tại Mỹ tin tưởng THG", zh: "在美越南人信赖THG" },
  "op.testi_sub": { en: "Real feedback from real customers – unedited, unsponsored.", vi: "Phản hồi thật từ khách hàng đã sử dụng dịch vụ – không chỉnh sửa.", zh: "真实客户的真实反馈——未经编辑。" },
  "op.testi1_tag": { en: "Furniture & Décor", vi: "Mua đồ nội thất & trang trí", zh: "家具与装饰" },
  "op.testi1_text": { en: "I tried many Taobao agents before and always had problems – wrong color, wrong size, no accountability. With THG I get a video of my goods before they ship. Such peace of mind!", vi: "Mình đã thử nhiều dịch vụ order từ Taobao nhưng toàn gặp rắc rối. Từ khi dùng THG, lần nào cũng được xem video kiểm hàng trước khi ship. Yên tâm hẳn!", zh: "我之前试过很多淘宝代购都有问题。用了THG后，每次发货前都能看到验货视频，非常安心！" },
  "op.testi2_tag": { en: "Electronics", vi: "Thiết bị điện tử", zh: "电子产品" },
  "op.testi2_text": { en: "Amazing! I ordered electronics from 1688 to Texas. THG kept me updated throughout, sent an unboxing video from the warehouse, and the goods arrived perfectly. 3× cheaper than Amazon!", vi: "Tuyệt vời! Mình order hàng điện tử từ 1688 về Texas. THG liên hệ suốt, quay video và hàng đến tay hoàn hảo. Giá rẻ hơn Amazon 3 lần!", zh: "太棒了！从1688订购电子产品到德州。THG全程更新，发来开箱视频，商品完好到达。比亚马逊便宜3倍！" },
  "op.testi3_tag": { en: "Clothes & Accessories", vi: "Quần áo & phụ kiện", zh: "服装配饰" },
  "op.testi3_text": { en: "I was skeptical at first, but THG's professionalism won me over – regular updates, thorough inspection. I've already referred the whole Vietnamese community here!", vi: "Lần đầu dùng THG mình còn nghi ngờ. Nhưng cách họ làm việc rất chuyên nghiệp. Giờ mình giới thiệu cho cả hội người Việt ở đây rồi!", zh: "起初我持怀疑态度，但THG的专业精神征服了我。我已经推荐给整个越南社区了！" },
  "op.testi4_tag": { en: "Home Goods", vi: "Đồ gia dụng", zh: "家居用品" },
  "op.testi4_text": { en: "I used to ask relatives in Vietnam to buy and re-ship – it took a whole month. Now THG ships directly from China to my New York address in 2–3 weeks. Totally trustworthy!", vi: "Trước đây nhờ người quen bên Việt Nam mua rồi gửi sang, tốn cả tháng. Giờ THG lo hết, hàng từ Taobao về đến New York chỉ 2-3 tuần!", zh: "以前请越南亲戚买再转寄要一个月。现在THG从中国直接寄到纽约只需2-3周！" },
  "op.testi5_tag": { en: "Bulk Import", vi: "Nhập hàng bán lẻ", zh: "批量进口" },
  "op.testi5_text": { en: "I import goods in bulk for my small online store. THG found me reliable suppliers, negotiated MOQ, and delivered on schedule. Will definitely continue long-term!", vi: "Mình nhập hàng về bán online tại Mỹ, cần số lượng lớn từ 1688. THG tư vấn tận tình và giao hàng đúng tiến độ!", zh: "我为我的网店批量进口商品。THG帮我找到可靠供应商，谈好起订量，按时交付！" },

  // Shipping Options
  "op.ship_eye": { en: "Shipping Options", vi: "Các kênh vận chuyển", zh: "运输选项" },
  "op.ship_title": { en: "Choose the right shipping lane", vi: "Chọn kênh vận chuyển phù hợp", zh: "选择合适的运输渠道" },
  "op.ship_sub": { en: "THG offers 3 main shipping lanes from China to USA. The right choice depends on your goods type, weight, and urgency.", vi: "THG có 3 kênh vận chuyển chính từ China đến Mỹ. Lựa chọn phù hợp tùy theo loại hàng, trọng lượng và mức độ khẩn cấp.", zh: "THG提供3种从中国到美国的运输渠道，根据商品类型、重量和紧迫程度选择。" },
  "op.ship1_tag": { en: "Standard Air", vi: "Hàng không thường", zh: "标准空运" },
  "op.ship1_time": { en: "6–12 BSD", vi: "6–12 Ngày LV", zh: "6-12个工作日" },
  "op.ship1_t": { en: "Epacket – Best for small packages", vi: "Epacket – Phù hợp gói hàng nhỏ lẻ", zh: "Epacket – 最适合小包裹" },
  "op.ship1_f1": { en: "Weight: 0.1 kg – 30 kg per package", vi: "Trọng lượng: 0.1kg – 30kg/kiện", zh: "重量：每件0.1-30公斤" },
  "op.ship1_f2": { en: "USPS tracking to your door", vi: "Tracking USPS tận nhà", zh: "USPS追踪送货上门" },
  "op.ship1_f3": { en: "Tax already included (Yun Express lane)", vi: "Giá đã bao gồm thuế nhập khẩu (line Yun Express)", zh: "已含税（云途渠道）" },
  "op.ship1_f4": { en: "Best for: clothes, accessories, small electronics, home goods", vi: "Phù hợp: quần áo, phụ kiện, điện tử nhỏ, đồ gia dụng", zh: "适合：服装、配饰、小电子产品、家居用品" },
  "op.ship1_f5": { en: "Price calculated per kg", vi: "Tính giá theo kg", zh: "按公斤计价" },
  "op.ship1_note": { en: "BSD = Business Days (Mon–Fri, excl. holidays)", vi: "BSD = Ngày làm việc (Thứ 2–6, không tính lễ)", zh: "BSD = 工作日（周一至周五，不含节假日）" },
  "op.ship2_tag": { en: "Express Air", vi: "Hàng không nhanh", zh: "快速空运" },
  "op.ship2_time": { en: "3–5 BSD", vi: "3–5 Ngày LV", zh: "3-5个工作日" },
  "op.ship2_t": { en: "DHL / Express – Fastest option", vi: "DHL / Express – Nhanh nhất", zh: "DHL/快递 – 最快选项" },
  "op.ship2_f1": { en: "Fastest delivery to USA", vi: "Nhanh nhất đến Mỹ", zh: "最快送达美国" },
  "op.ship2_f2": { en: "Ideal for urgent orders or high-value goods", vi: "Lý tưởng cho đơn hàng khẩn hoặc hàng giá trị cao", zh: "适合紧急订单或高价值商品" },
  "op.ship2_f3": { en: "DHL / FedEx tracking – world-class reliability", vi: "Tracking DHL / FedEx – độ tin cậy cao", zh: "DHL/FedEx追踪——世界级可靠" },
  "op.ship2_f4": { en: "Higher cost per kg vs. standard air", vi: "Giá cao hơn line thường", zh: "每公斤成本高于标准空运" },
  "op.ship2_f5": { en: "Best for: time-sensitive, lightweight, high-value items", vi: "Phù hợp: hàng khẩn, nhẹ, giá trị cao", zh: "适合：时效性强、轻量、高价值物品" },
  "op.ship2_note": { en: "Contact THG for exact express quote", vi: "Liên hệ THG để được báo giá express chính xác", zh: "联系THG获取准确快递报价" },
  "op.ship3_tag": { en: "Sea Freight", vi: "Đường biển", zh: "海运" },
  "op.ship3_time": { en: "20–25 BSD", vi: "20–25 Ngày LV", zh: "20-25个工作日" },
  "op.ship3_t": { en: "Bulk Sea – Best price for heavy cargo", vi: "Hàng Lô Biển – Giá tốt nhất cho hàng nặng", zh: "散货海运 – 重货最优价" },
  "op.ship3_f1": { en: "Minimum: 12 kg per package", vi: "Trọng lượng tối thiểu: 12 kg/kiện", zh: "最低：每件12公斤" },
  "op.ship3_f2": { en: "Cheapest per-kg cost – ideal for bulk orders", vi: "Giá tốt nhất mỗi kg – lý tưởng cho hàng số lượng lớn", zh: "每公斤最便宜——适合大批量订单" },
  "op.ship3_f3": { en: "Price tiers: 12 kg+, 21 kg+, 71 kg+, 100 kg+", vi: "Giảm giá theo khối lượng: 12kg+, 21kg+, 71kg+, 100kg+", zh: "价格阶梯：12kg+、21kg+、71kg+、100kg+" },
  "op.ship3_f4": { en: "Best for: furniture, machinery, large household items", vi: "Phù hợp: nội thất, máy móc, hàng gia dụng lớn", zh: "适合：家具、机械、大型家居用品" },
  "op.ship3_f5": { en: "Longer transit – plan ahead", vi: "Thời gian dài hơn – cần lên kế hoạch trước", zh: "运输时间较长——需提前计划" },
  "op.ship3_note": { en: "Volume weight: Length × Width × Height ÷ 6000", vi: "Trọng lượng thể tích: Dài × Rộng × Cao ÷ 6000", zh: "体积重量：长×宽×高÷6000" },

  // Volume Weight
  "op.vol_title": { en: "📐 How shipping cost is calculated", vi: "📐 Cách tính cước vận chuyển", zh: "📐 运费计算方式" },
  "op.vol_sub": { en: "THG charges based on ACTUAL weight or VOLUME weight – whichever is GREATER", vi: "THG tính theo trọng lượng THỰC hoặc trọng lượng THỂ TÍCH – lấy số NÀO LỚN HƠN", zh: "THG按实际重量或体积重量计费——取较大值" },
  "op.vol_div": { en: "divided by", vi: "chia cho", zh: "除以" },
  "op.vol_result": { en: "= Volume weight (kg)", vi: "= Trọng lượng thể tích (kg)", zh: "= 体积重量（公斤）" },
  "op.vol_ex": { en: "Example: Package is 0.9 kg actual but 1.1 kg volume → charged at", vi: "Ví dụ: Kiện hàng 0.9kg thực tế nhưng thể tích 1.1kg → tính theo", zh: "示例：包裹实际0.9kg但体积1.1kg → 按以下计费" },


  // Price Tables
  "op.price_eye": { en: "Shipping Rates", vi: "Bảng giá vận chuyển", zh: "运费价格" },
  "op.price_title": { en: "China → USA: Transparent Pricing", vi: "China → USA: Giá minh bạch", zh: "中国→美国：透明定价" },
  "op.price_sub": { en: "No hidden fees. Contact THG for an exact quote on your specific order.", vi: "Không phí ẩn. Liên hệ THG để được báo giá chính xác cho đơn hàng cụ thể.", zh: "无隐藏费用。联系THG获取您订单的准确报价。" },
  "op.tab_ep": { en: "Standard Air (Epacket)", vi: "Hàng Thường (Epacket)", zh: "标准空运(Epacket)" },
  "op.tab_bulk": { en: "Sea Freight (Bulk)", vi: "Hàng Lô (Đường Biển)", zh: "海运(散货)" },
  "op.ep_lane": { en: "LINE CHINA → USA (STANDARD AIR – EPACKET)", vi: "LINE CHINA → USA (HÀNG THƯỜNG – EPACKET)", zh: "线路 中国→美国（标准空运）" },
  "op.ep_title": { en: "Yun Express · 6–12 Business Days", vi: "Yun Express · 6–12 Ngày làm việc", zh: "云途 · 6-12个工作日" },
  "op.ep_note": { en: "✅ Price includes US import tax · USPS tracking to your door · Processing fee +$0.70/pkg", vi: "✅ Giá đã bao gồm thuế nhập khẩu vào Mỹ · Tracking USPS tận nhà · Phí xử lý +$0.70/kiện", zh: "✅ 含美国进口税 · USPS追踪送货上门 · 处理费+$0.70/件" },
  "op.th_weight": { en: "Weight (kg)", vi: "Trọng lượng (kg)", zh: "重量(kg)" },
  "op.ep_foot": { en: "* Reference prices – subject to change. Min size: 10×15cm. Max: 55×40×35cm (no surcharge). Contact THG for exact quote.", vi: "* Giá tham khảo – có thể thay đổi. Kích thước tối thiểu: 10×15cm. Tối đa: 55×40×35cm. Liên hệ THG để báo giá chính xác.", zh: "* 参考价格，可能变动。最小尺寸：10×15cm。最大：55×40×35cm。联系THG获取准确报价。" },
  "op.bulk_lane": { en: "LINE CHINA → USA (SEA FREIGHT – BULK)", vi: "LINE CHINA → USA (HÀNG LÔ – ĐƯỜNG BIỂN)", zh: "线路 中国→美国（海运散货）" },
  "op.bulk_title": { en: "Bulk Shipping · 20–25 Business Days · Minimum 12 kg/package", vi: "Hàng Lô Đường Biển · 20–25 Ngày làm việc · Tối thiểu 12kg/kiện", zh: "散货海运 · 20-25个工作日 · 最低12kg/件" },
  "op.bulk_note": { en: "Price by Zone (ZIP code) · Discounts by volume tier · Volume weight: L×W×H ÷ 6000", vi: "Giá theo Zone (ZIP code) · Chiết khấu theo khối lượng · Trọng lượng thể tích: D×R×C ÷ 6000", zh: "按区域(邮编)定价 · 按量阶梯优惠 · 体积重量：长×宽×高÷6000" },
  "op.th_zone": { en: "Region (Zone)", vi: "Khu vực (Zone)", zh: "区域(Zone)" },
  "op.bulk_z1": { en: "ZIP starts 8–9 (CA, TX, WA, AZ…)", vi: "ZIP bắt đầu 8–9 (CA, TX, WA, AZ…)", zh: "邮编8-9开头(CA,TX,WA,AZ…)" },
  "op.bulk_z2": { en: "ZIP starts 4–7 (IL, OH, GA, NC…)", vi: "ZIP bắt đầu 4–7 (IL, OH, GA, NC…)", zh: "邮编4-7开头(IL,OH,GA,NC…)" },
  "op.bulk_z3": { en: "ZIP starts 0–3 (NY, FL, MA, PA…)", vi: "ZIP bắt đầu 0–3 (NY, FL, MA, PA…)", zh: "邮编0-3开头(NY,FL,MA,PA…)" },
  "op.bulk_foot1": { en: "⚠️ Not included: Commercial address surcharge (+$0.20/kg) · Remote area (+$0.70/kg, min $26) · Residential surcharge (+$4.50/pkg) · THG packing fee (+$0.70/pkg)", vi: "⚠️ Chưa bao gồm: Phí địa chỉ thương mại (+$0.20/kg) · Phí vùng sâu xa (+$0.70/kg, tối thiểu $26) · Phí khu dân cư (+$4.50/kiện) · Phí đóng gói THG (+$0.70/kiện)", zh: "⚠️ 不含：商业地址附加费(+$0.20/kg) · 偏远地区(+$0.70/kg,最低$26) · 住宅附加费(+$4.50/件) · THG包装费(+$0.70/件)" },
  "op.bulk_foot2": { en: "* Minimum 12 kg/package. Under 12 kg billed as 12 kg. Prices updated weekly – contact THG to confirm.", vi: "* Tối thiểu 12 kg/kiện. Dưới 12 kg tính theo 12 kg. Giá cập nhật hàng tuần – liên hệ THG để xác nhận.", zh: "* 最低12kg/件。不足12kg按12kg计费。价格每周更新——联系THG确认。" },
  "op.price_cta": { en: "Chat for exact quote →", vi: "Nhắn tin để được báo giá chính xác →", zh: "通过聊天获取准确报价 →" },

  // Policy
  "op.pol_eye": { en: "Shipping Policy", vi: "Chính sách vận chuyển", zh: "运输政策" },
  "op.pol_title": { en: "Your rights. Our commitments.", vi: "Quyền lợi & Cam kết của THG", zh: "您的权益，我们的承诺" },
  "op.pol_sub": { en: "100% transparent. Know exactly what you're protected against before you order.", vi: "100% minh bạch. Biết rõ quyền lợi của bạn trước khi đặt hàng.", zh: "100%透明。下单前清楚了解您的保障。" },
  "op.pol1_tag": { en: "Compensation Policy", vi: "Chính sách đền bù", zh: "赔偿政策" },
  "op.pol1_t": { en: "THG compensates if things go wrong", vi: "THG cam kết bồi thường nếu có sự cố", zh: "THG出问题时赔偿" },
  "op.pol1_i1": { en: "✅ Delayed 20+ BSD due to THG error → 100% shipping refund", vi: "✅ Chậm hơn 20 ngày làm việc do lỗi THG → Hoàn 100% phí vận chuyển", zh: "✅ 因THG失误延迟20+工作日 → 100%退运费" },
  "op.pol1_i2": { en: "✅ Lost / damaged small package → Up to $20–$50/order compensation", vi: "✅ Hàng lẻ thất lạc, hư hỏng → Đền bù tối đa $20–$50/đơn", zh: "✅ 小包丢失/损坏 → 最高$20-$50/单赔偿" },
  "op.pol1_i3": { en: "✅ Bulk goods lost in transit → $5/kg compensation", vi: "✅ Hàng lô mất trong vận chuyển → Bồi thường $5/kg", zh: "✅ 散货运输中丢失 → $5/kg赔偿" },
  "op.pol1_i4": { en: "✅ Refund to account within 15 business days", vi: "✅ Hoàn tiền về tài khoản trong vòng 15 ngày làm việc", zh: "✅ 15个工作日内退款到账" },
  "op.pol2_tag": { en: "Prohibited Goods", vi: "Hàng cấm vận chuyển", zh: "禁运物品" },
  "op.pol2_t": { en: "Items we cannot ship", vi: "Danh mục hàng cấm – vui lòng kiểm tra trước", zh: "我们无法运输的物品" },
  "op.pol2_i1": { en: "⛔ Explosives, weapons, radioactive materials", vi: "⛔ Chất nổ, vũ khí, vật liệu phóng xạ", zh: "⛔ 爆炸物、武器、放射性物质" },
  "op.pol2_i2": { en: "⛔ Flammable materials, gas lighters", vi: "⛔ Chất dễ cháy, bật lửa có gas/xăng", zh: "⛔ 易燃物、气体打火机" },
  "op.pol2_i3": { en: "⛔ Narcotics, controlled substances", vi: "⛔ Chất gây nghiện, kích thích", zh: "⛔ 毒品、管制物质" },
  "op.pol2_i4": { en: "⛔ Pharmaceuticals, liquids, powders (some lanes)", vi: "⛔ Dược phẩm, chất lỏng, bột (một số line)", zh: "⛔ 药品、液体、粉末（部分渠道）" },
  "op.pol2_i5": { en: "⛔ Currency, financial documents", vi: "⛔ Tiền tệ, tài liệu tài chính", zh: "⛔ 货币、金融文件" },
  "op.pol2_i6": { en: "⛔ Animal products, natural wood", vi: "⛔ Sản phẩm từ động vật, gỗ tự nhiên", zh: "⛔ 动物制品、天然木材" },
  "op.pol3_tag": { en: "Key Terms", vi: "Điều khoản quan trọng", zh: "重要条款" },
  "op.pol3_t": { en: "Important things to know before ordering", vi: "Một số điểm bạn cần lưu ý", zh: "下单前需要了解的重要事项" },
  "op.pol3_i1": { en: "📌 Delivery times are estimates – excludes weekends, holidays & force majeure", vi: "📌 Thời gian giao hàng là ước tính – không tính cuối tuần, lễ, bất khả kháng", zh: "📌 交货时间为估计值——不含周末、节假日和不可抗力" },
  "op.pol3_i2": { en: "📌 Customer is responsible for accurate goods declaration", vi: "📌 Khách hàng chịu trách nhiệm khai báo đúng thông tin hàng hóa", zh: "📌 客户负责准确申报货物信息" },
  "op.pol3_i3": { en: "📌 Tracking inactive 21+ days → investigated as lost", vi: "📌 Tracking quá 21 ngày không hoạt động → xem xét thất lạc", zh: "📌 追踪21+天无更新 → 视为丢失调查" },
  "op.pol3_i4": { en: "📌 THG does not offer return-to-Vietnam / China service", vi: "📌 THG không cung cấp dịch vụ trả hàng về Việt Nam / Trung Quốc", zh: "📌 THG不提供退回越南/中国服务" },
  "op.pol3_i5": { en: "📌 Fragile goods: customer must ensure adequate protective packaging", vi: "📌 Hàng dễ vỡ: khách hàng tự đảm bảo đóng gói chống sốc", zh: "📌 易碎品：客户须确保充分防护包装" },
  "op.pol4_tag": { en: "Claims Process", vi: "Khiếu nại & Giải quyết", zh: "索赔流程" },
  "op.pol4_t": { en: "Fast, transparent claims resolution", vi: "Quy trình khiếu nại nhanh chóng", zh: "快速透明的索赔处理" },
  "op.pol4_i1": { en: "⏱️ Lost goods: claim within 2 months of ship date", vi: "⏱️ Mất hàng: Khiếu nại trong vòng 2 tháng kể từ ngày ship", zh: "⏱️ 丢失货物：发货日起2个月内索赔" },
  "op.pol4_i2": { en: "⏱️ Damaged / price disputes: claim within 3 days of delivery", vi: "⏱️ Hư hỏng / giá cước: Trong vòng 3 ngày nhận hàng", zh: "⏱️ 损坏/价格争议：收货3天内索赔" },
  "op.pol4_i3": { en: "⚡ THG resolves claims within 7–20 business days", vi: "⚡ THG xử lý khiếu nại trong vòng 7–20 ngày làm việc", zh: "⚡ THG在7-20个工作日内解决索赔" },
  "op.pol4_i4": { en: "💬 Contact directly via Facebook or Hotline for fastest support", vi: "💬 Liên hệ trực tiếp qua Facebook hoặc Hotline để được hỗ trợ nhanh nhất", zh: "💬 通过Facebook或热线直接联系获取最快支持" },

  // FAQ
  "op.faq_eye": { en: "FAQ", vi: "Câu hỏi thường gặp", zh: "常见问题" },
  "op.faq_title": { en: "Your questions, answered", vi: "Bạn thắc mắc – THG trả lời", zh: "您的问题，我们来答" },
  "op.faq_sub": { en: "The most common questions from Vietnamese Americans using THG for the first time.", vi: "Những câu hỏi phổ biến nhất từ người Việt sống tại Mỹ khi lần đầu sử dụng dịch vụ.", zh: "在美越南人首次使用THG时最常见的问题。" },
  "op.faq1_q": { en: "How do I start ordering through THG?", vi: "Tôi cần làm gì để bắt đầu đặt hàng qua THG?", zh: "如何开始通过THG订购？" },
  "op.faq1_a": { en: "Simple! Just copy the product link from Taobao, 1688, or Pinduoduo and send it to us via Facebook. THG will verify the supplier, quote an all-in price, and guide you through each step.", vi: "Rất đơn giản! Copy link sản phẩm từ Taobao, 1688 hoặc Pinduoduo gửi cho chúng tôi qua Facebook. THG sẽ kiểm tra nhà cung cấp, báo giá trọn gói và hướng dẫn từng bước.", zh: "很简单！复制淘宝、1688或拼多多的商品链接，通过Facebook发给我们。THG将验证供应商、报全包价并逐步指导您。" },
  "op.faq2_q": { en: "How long does shipping from China to USA take?", vi: "Thời gian từ lúc đặt hàng đến khi nhận hàng tại Mỹ mất bao lâu?", zh: "从中国到美国的运输需要多长时间？" },
  "op.faq2_a": { en: "• Standard Air (Epacket): 6–12 Business Days\n• Express Air (DHL/FedEx): 3–5 Business Days\n• Sea Freight (Bulk): 20–25 Business Days\n\nVs. routing through Vietnam, you save 3–4 extra weeks and $150–300.", vi: "• Hàng không thường (Epacket): 6–12 Ngày LV\n• Hàng không nhanh (DHL/FedEx): 3–5 Ngày LV\n• Hàng lô đường biển: 20–25 Ngày LV\n\nSo với đi vòng qua Việt Nam, bạn tiết kiệm 3–4 tuần và $150–300.", zh: "• 标准空运(Epacket): 6-12个工作日\n• 快速空运(DHL/FedEx): 3-5个工作日\n• 海运(散货): 20-25个工作日\n\n比经越南中转节省3-4周和$150-300。" },
  "op.faq3_q": { en: "How do I pay THG from the USA?", vi: "Tôi ở Mỹ thanh toán cho THG bằng cách nào?", zh: "在美国如何付款给THG？" },
  "op.faq3_a": { en: "• PayPal (most common for US-based customers)\n• Pingpong / Payoneer / WorldFirst\n• VND bank transfer\n• Zelle / Venmo (USD)\n\nPayment: 50% deposit when confirming, 50% balance when ready to ship.", vi: "• PayPal (phổ biến nhất với khách tại Mỹ)\n• Pingpong / Payoneer / WorldFirst\n• Chuyển khoản VND\n• Zelle / Venmo (USD)\n\nQuy trình: Đặt cọc 50% khi xác nhận, thanh toán 50% còn lại khi hàng sẵn sàng ship.", zh: "• PayPal（美国客户最常用）\n• Pingpong/Payoneer/WorldFirst\n• 越南盾银行转账\n• Zelle/Venmo (USD)\n\n付款：确认时预付50%，发货前付清余款。" },
  "op.faq4_q": { en: "What if my goods arrive defective or don't match the description?", vi: "Nếu hàng về bị lỗi hoặc không đúng mô tả, THG xử lý như thế nào?", zh: "如果收到的商品有缺陷或与描述不符怎么办？" },
  "op.faq4_a": { en: "• All goods inspected and video-recorded before shipping\n• Defect found BEFORE shipping → THG exchanges or refunds with supplier\n• Defective after arrival → THG supports insurance claims\n\nYou NEVER have to contact the Chinese supplier directly.", vi: "• Tất cả hàng được kiểm tra và quay video trước khi ship\n• Phát hiện lỗi TRƯỚC khi ship → THG đổi hàng hoặc hoàn tiền\n• Hàng lỗi SAU khi đến Mỹ → THG hỗ trợ bảo hiểm và bồi thường\n\nBạn KHÔNG BAO GIỜ phải tự liên hệ nhà cung cấp.", zh: "• 发货前所有商品进行检查和录像\n• 发货前发现缺陷 → THG与供应商换货或退款\n• 到达后有缺陷 → THG支持保险索赔\n\n您永远不需要直接联系中国供应商。" },
  "op.faq5_q": { en: "Will I have to pay US customs / import tax?", vi: "Hàng có bị thuế hải quan khi nhập vào Mỹ không?", zh: "需要缴纳美国海关/进口税吗？" },
  "op.faq5_a": { en: "• Epacket Yun Express: Tax INCLUDED in shipping price\n• Standard Epacket: THG handles tax declaration\n• Bulk Sea: US customs collects duty from recipient\n\nTHG advises best lane for your goods to minimize customs costs.", vi: "• Epacket Yun Express: Thuế đã BAO GỒM trong giá ship\n• Epacket thường: THG xử lý khai báo thuế\n• Hàng lô đường biển: Hải quan Mỹ thu trực tiếp từ người nhận\n\nTHG sẽ tư vấn kênh tốt nhất để tối thiểu hóa chi phí hải quan.", zh: "• Epacket云途：运费已含税\n• 标准Epacket：THG处理报关\n• 散货海运：美国海关向收件人征收关税\n\nTHG建议最佳渠道以最小化海关费用。" },
  "op.faq6_q": { en: "Can THG find and compare products for me from multiple suppliers?", vi: "THG có thể tìm và so sánh sản phẩm tốt nhất từ nhiều nhà cung cấp không?", zh: "THG能帮我从多个供应商找到并比较产品吗？" },
  "op.faq6_a": { en: "Absolutely! THG searches Taobao, 1688, and Pinduoduo, compares 3–5 suppliers, verifies ratings & quality in Mandarin, and presents a quoted comparison. This sourcing service is 100% FREE.", vi: "Hoàn toàn có! THG tìm trên Taobao, 1688, Pinduoduo và so sánh 3–5 nhà cung cấp, kiểm tra đánh giá bằng tiếng Trung. Dịch vụ tìm hàng này 100% MIỄN PHÍ.", zh: "当然！THG搜索淘宝、1688和拼多多，比较3-5个供应商，用中文验证评分和质量，提供报价比较。此采购服务100%免费。" },
  "op.faq7_q": { en: "Where are THG's warehouses? Can I pick up in Pennsylvania?", vi: "THG có kho ở đâu? Tôi ở Pennsylvania có thể lấy hàng không?", zh: "THG的仓库在哪里？可以在宾州自提吗？" },
  "op.faq7_a": { en: "THG operates 3 locations:\n• 🇻🇳 Vietnam: 121/5 Kenh 19/5 St., Son Ky, Tan Phu, HCMC\n• 🇨🇳 China: Dongguan, Guangdong\n• 🇺🇸 USA: 108 Almond CT, Milford, PA 18337\n\nCustomers near PA can arrange direct pickup.", vi: "THG có 3 địa điểm:\n• 🇻🇳 Việt Nam: 121/5 Đ. Kênh 19/5, Sơn Kỳ, Tân Phú, TP.HCM\n• 🇨🇳 Trung Quốc: Đông Hoản, Quảng Đông\n• 🇺🇸 Mỹ: 108 Almond CT, Milford, PA 18337\n\nKhách gần PA có thể đến lấy hàng trực tiếp.", zh: "THG运营3个地点：\n• 🇻🇳 越南：胡志明市新富区\n• 🇨🇳 中国：广东东莞\n• 🇺🇸 美国：108 Almond CT, Milford, PA 18337\n\n宾州附近的客户可以安排自提。" },

  // Trust CTA
  "op.trust_title": { en: "Ready to shop from China with confidence?", vi: "Sẵn sàng mua hàng Trung Quốc an tâm?", zh: "准备好自信地从中国购物了吗？" },
  "op.trust_sub": { en: "Join thousands of Vietnamese Americans who trust THG to deliver quality goods from China to USA.", vi: "Hàng nghìn người Việt tại Mỹ đã tin tưởng THG để mua hàng Trung Quốc chất lượng.", zh: "加入数千名信赖THG的在美越南人，从中国购买优质商品。" },
  "op.trust_cta": { en: "Start Your First Order", vi: "Đặt đơn đầu tiên ngay", zh: "开始您的第一单" },
  "op.chip1": { en: "✅ Video Inspection", vi: "✅ Video kiểm hàng", zh: "✅ 视频验货" },
  "op.chip2": { en: "✈️ China → USA Direct", vi: "✈️ Ship thẳng", zh: "✈️ 中美直邮" },
  "op.chip3": { en: "📡 Real-time Tracking", vi: "📡 Tracking real-time", zh: "📡 实时追踪" },
  "op.chip4": { en: "💰 Buyer Protection", vi: "💰 Bảo vệ người mua", zh: "💰 买家保障" },
  "op.chip5": { en: "🇨🇳 Mandarin Negotiation", vi: "🇨🇳 Đàm phán tiếng Trung", zh: "🇨🇳 中文谈判" },
  "op.chip6": { en: "🏠 3 Warehouses", vi: "🏠 3 Kho hàng", zh: "🏠 3个仓库" },
  // ── International Pricing Page: Error messages & labels ──
  "intl_pricing.video_heading": { en: "🎬 Overview of Shipping Price List", vi: "🎬 Giới thiệu tổng quan Bảng giá vận chuyển", zh: "🎬 运费价格表总览" },
  "intl_pricing.vn_us_ups": { en: "🇻🇳 VN → US (UPS)", vi: "🇻🇳 VN → US (UPS)", zh: "🇻🇳 越南 → 美国 (UPS)" },
  "intl_pricing.cn_us_air_sea": { en: "🇨🇳 CN → US (Air & Sea)", vi: "🇨🇳 CN → US (Air & Sea)", zh: "🇨🇳 中国 → 美国 (空运&海运)" },
  "intl_pricing.vn_us_time": { en: "⏱ 3–7 BSD", vi: "⏱ 3–7 ngày", zh: "⏱ 3-7个工作日" },
  "intl_pricing.cn_us_time": { en: "⏱ 6–25 BSD", vi: "⏱ 6–25 ngày", zh: "⏱ 6-25个工作日" },
  "intl_pricing.no_us_tax": { en: "⚠️ Excluding US import tax", vi: "⚠️ Chưa gồm tax NK US", zh: "⚠️ 不含美国进口税" },
  "intl_pricing.air_sea": { en: "✈️ Air · 🚢 Sea", vi: "✈️ Air · 🚢 Sea", zh: "✈️ 空运 · 🚢 海运" },
  "intl_pricing.err_updating": { en: "Data is being updated", vi: "Dữ liệu đang cập nhật", zh: "数据更新中" },
  "intl_pricing.err_max_weight": { en: "Exceeds maximum weight", vi: "Vượt quá cân nặng tối đa", zh: "超过最大重量" },
  "intl_pricing.err_no_quote": { en: "No quote available", vi: "Chưa có báo giá", zh: "暂无报价" },
  "intl_pricing.err_no_country": { en: "No quote for this country", vi: "Chưa có báo giá cho quốc gia này", zh: "暂无此国家的报价" },
  "intl_pricing.err_contact": { en: "Please contact THG for a bulk quote", vi: "Liên hệ THG báo giá theo lô", zh: "请联系THG获取批量报价" },
  "intl_pricing.err_vn_us_only": { en: "VN Express currently only supports US routes", vi: "VN Express hiện chỉ hỗ trợ tuyến US", zh: "VN Express目前仅支持美国路线" },
  "intl_pricing.err_no_battery": { en: "VN Express does not support battery products", vi: "VN Express không hỗ trợ hàng Pin", zh: "VN Express不支持电池产品" },
  "intl_pricing.err_min_12kg": { en: "Bulk Express requires minimum 12 KG", vi: "Hàng Lô Express yêu cầu mức tối thiểu 12 KG", zh: "批量快递最低要求12公斤" },
  "intl_pricing.err_contact_quote": { en: "Please contact THG for a quote on this route", vi: "Tuyến này vui lòng Liên hệ THG báo giá", zh: "此路线请联系THG获取报价" },
  "intl_pricing.err_battery_note": { en: "Battery products can be shipped via the \"Standard VN-WW\" channel; however, please refer to the attached Shipping Policy for specific requirements.", vi: "Hàng Pin Điện có thể vận chuyển qua kênh \"Standard VN-WW\"; tuy nhiên, vui lòng tham khảo Chính sách Vận chuyển đính kèm để biết yêu cầu cụ thể.", zh: "电池产品可通过\"Standard VN-WW\"渠道发货，但请参阅附带的运输政策了解具体要求。" },
  "intl_pricing.rate_label": { en: "Rate CN → US ($)", vi: "Cước CN → US ($)", zh: "费率 CN → US ($)" },
  "intl_pricing.rate_label_generic": { en: "Rate ($)", vi: "Cước ($)", zh: "费率 ($)" },

  // ── Catalog Page: Labels ──
  "catalog.pod_badge": { en: "POD Products", vi: "Sản phẩm POD", zh: "POD产品" },
  "catalog.search_placeholder": { en: "Search by name or SKU...", vi: "Tìm theo tên hoặc SKU...", zh: "按名称或SKU搜索..." },
  "catalog.products_count": { en: "products", vi: "sản phẩm", zh: "个产品" },
  "catalog.product_count": { en: "product", vi: "sản phẩm", zh: "个产品" },
  "catalog.origin_label": { en: "Origin", vi: "Xuất xứ", zh: "产地" },
  "catalog.origin_vn": { en: "Vietnam", vi: "Việt Nam", zh: "越南" },
  "catalog.origin_us": { en: "USA", vi: "Mỹ", zh: "美国" },
  "catalog.origin_cn": { en: "China", vi: "Trung Quốc", zh: "中国" },
  "catalog.contact_price": { en: "Contact for pricing", vi: "Liên hệ báo giá", zh: "联系报价" },
  "catalog.size_label": { en: "Size:", vi: "Kích cỡ:", zh: "尺寸:" },
  "catalog.all": { en: "All", vi: "Tất cả", zh: "全部" },

  // ── Blog Page: Categories ──
  "blog.eyebrow": { en: "THG Blog", vi: "THG Blog", zh: "THG博客" },
  "blog.cat_all": { en: "All", vi: "Tất cả", zh: "全部" },
  "blog.cat_report": { en: "Reports", vi: "Báo cáo", zh: "报告" },
  "blog.back": { en: "Back to Blog", vi: "Quay lại Tin tức", zh: "返回博客" },
  "blog.slides_count": { en: "slides", vi: "slides", zh: "张幻灯片" },
  "blog.slide_label": { en: "Slide", vi: "Slide", zh: "幻灯片" },
  "blog.zoom_hint": { en: "Click to zoom", vi: "Nhấn để phóng to", zh: "点击放大" },
  "blog.not_found": { en: "Article not found", vi: "Không tìm thấy bài viết", zh: "未找到文章" },

  // ── NotFound Page ──
  "notfound.message": { en: "Oops! Page not found", vi: "Rất tiếc! Không tìm thấy trang", zh: "抱歉！页面未找到" },
  "notfound.home": { en: "Return to Home", vi: "Về trang chủ", zh: "返回首页" },

  // ── Pricing: HeroSection ──
  "pricing_hero.badge": { en: "INTERNATIONAL PRICING", vi: "BẢNG GIÁ QUỐC TẾ", zh: "国际价格表" },
  "pricing_hero.heading": { en: "International ", vi: "Tra cứu cước ", zh: "查询国际" },
  "pricing_hero.heading_gold": { en: "shipping rates", vi: "vận chuyển quốc tế", zh: "运费" },
  "pricing_hero.desc": { en: "Transparent pricing, real-time updates for all shipping routes from Vietnam & China.", vi: "Bảng giá minh bạch, cập nhật real-time cho tất cả tuyến vận chuyển từ Việt Nam & Trung Quốc.", zh: "透明价格，越南和中国所有运输路线实时更新。" },

  // ── Pricing: SearchWidget ──
  "pricing_sw.placeholder": { en: "e.g. 1", vi: "Vd: 1", zh: "例：1" },

  // ── Pricing: EpacketPanel ──
  "ep.import_tax_badge": { en: "✅ Import tax included · Active USPS", vi: "✅ Bao thuế NK · Active USPS", zh: "✅ 含进口税 · Active USPS" },
  "ep.cargo_label": { en: "Cargo type:", vi: "Loại hàng:", zh: "货物类型:" },
  "ep.battery_label": { en: "Battery products:", vi: "Hàng pin điện:", zh: "电池产品提示：" },
  "ep.battery_note": { en: "Battery products can be shipped via the \"Standard VN-WW\" channel; however, please refer to the attached Shipping Policy for specific requirements.", vi: "Hàng Pin Điện có thể vận chuyển qua kênh \"Standard VN-WW\"; tuy nhiên, vui lòng tham khảo Chính sách Vận chuyển đính kèm để biết yêu cầu cụ thể.", zh: "电池产品可通过\"Standard VN-WW\"渠道发货，但请参阅附带的运输政策了解具体要求。" },
  "ep.showing": { en: "Showing:", vi: "Đang hiển thị:", zh: "当前显示：" },
  "ep.pri_desc": { en: "Import tax included, Active USPS tracking. Excludes remote surcharges.", vi: "Bao thuế NK, Active USPS tracking. Giá chưa bao gồm phụ phí vùng sâu.", zh: "含进口税, Active USPS 追踪。不含偏远附加费。" },
  "ep.epacket_desc": { en: "Delivered to destination. Excludes remote surcharges & VAT.", vi: "Giao tận tay khách hàng tại quốc gia đích. Giá chưa bao gồm phụ phí vùng sâu & VAT.", zh: "送达目的国。不含偏远附加费和增值税。" },
  "ep.order_fee": { en: "Order Handling Fee", vi: "Phí xử lý đơn hàng", zh: "订单处理费" },
  "ep.tracking_fee": { en: "Active tracking fee", vi: "Phí active tracking", zh: "Active tracking费" },
  "ep.tracking_note": { en: "(If using Active USPS tracking)", vi: "(Nếu sử dụng dịch vụ active tracking trước với USPS)", zh: "(如使用USPS的active tracking服务)" },
  "ep.detail_table": { en: "Detailed Pricing Table", vi: "Bảng Giá Chi Tiết", zh: "价格表" },
  "ep.detail_table_vn_us": { en: "Detailed Pricing VN → US (Priority)", vi: "Bảng Giá Chi Tiết VN → US (Priority)", zh: "价格表 VN → US (Priority)" },
  "ep.detail_table_cn_us": { en: "Detailed Pricing CN → US (Priority)", vi: "Bảng Giá Chi Tiết CN → US (Priority)", zh: "价格表 CN → US (Priority)" },
  "ep.price_table": { en: "Price Table", vi: "Bảng Giá Chi Tiết", zh: "价格表" },
  "ep.price_table_pri": { en: "Price Table (Priority)", vi: "Bảng Giá Chi Tiết (Priority)", zh: "价格表 (Priority)" },
  "ep.loading_lark": { en: "Loading price data from Lark...", vi: "Đang tải dữ liệu bảng giá từ Lark...", zh: "正在从 Lark 加载价格数据..." },
  "ep.data_unavailable": { en: "Price data is temporarily unavailable. Please try again later or contact THG support.", vi: "Dữ liệu bảng giá tạm thời không khả dụng. Vui lòng thử lại sau hoặc liên hệ THG hỗ trợ.", zh: "价格数据暂时无法加载。请稍后重试或联系 THG 客服。" },
  "ep.surcharges": { en: "Surcharges & Other Services", vi: "Phụ Phí & Dịch Vụ Khác", zh: "附加费和其他服务" },
  "ep.remote_title": { en: "📍 Remote Area Surcharge (Remote Area Zipcode)", vi: "📍 Phụ Phí Vùng Sâu (Remote Area Zipcode)", zh: "📍 偏远地区附加费" },
  "ep.remote_desc": { en: "Download the remote area zipcode list to check. Data is automatically synced from the source when updated.", vi: "Tải file danh sách zipcode remote area để kiểm tra. Dữ liệu được tự động đồng bộ từ nguồn gốc khi có cập nhật.", zh: "下载偏远地区邮编列表进行查看。数据更新时会自动从源头同步。" },
  "ep.download_file": { en: "📥 Download", vi: "📥 Tải file", zh: "📥 下载" },
  "ep.vat_title": { en: "🌍 VAT & Handling Fees", vi: "🌍 Thuế VAT & Phí Xử Lý", zh: "🌍 增值税和处理费" },
  "ep.vat_country": { en: "Country", vi: "Quốc Gia", zh: "国家" },
  "ep.data_updating": { en: "Data is being updated", vi: "Dữ liệu đang cập nhật", zh: "数据更新中" },
  "ep.reship_title": { en: "Reshipment Fee", vi: "Phí Reship (Gửi Lại)", zh: "重新发货费" },
  "ep.reship_note": { en: "* Reshipment fee applies when a package is returned due to wrong address, no recipient, or refusal. If no response within the specified period, the package will be destroyed by default.", vi: "* Phí reship áp dụng khi kiện hàng bị trả về do địa chỉ sai, không có người nhận, hoặc bị từ chối nhận. Nếu không có phản hồi trong thời gian quy định, kiện hàng sẽ bị tiêu hủy theo mặc định.", zh: "* 重新发货费适用于因地址错误、无人收件或拒收而退回的包裹。如在规定时间内无回复，包裹将默认被销毁。" },
  "ep.reship_data_updating": { en: "📝 Reshipment fee data is being updated.", vi: "📝 Dữ liệu phí reship đang được cập nhật.", zh: "📝 重新发货费数据更新中。" },
  "ep.view_policy": { en: "View full shipping policy", vi: "Xem đầy đủ chính sách vận chuyển", zh: "查看完整运输政策" },

  // ── Pricing: Ship by Label panel ──
  "sbl.desc": { en: "Service for orders that already have a shipping label from TikTok Shop and Marketplace.", vi: "Dịch vụ dành cho đơn hàng đã có sẵn shipping label từ TikTok Shop và Marketplace.", zh: "适用于已有TikTok Shop和Marketplace运输标签的订单服务。" },
  "sbl.note_title": { en: "Note:", vi: "Lưu ý:", zh: "注意：" },
  "sbl.note_desc": { en: "Goods shipped from China to USPS post office in the US — USPS performs last-mile delivery. Does not deliver directly to recipient.", vi: "Hàng vận chuyển từ Trung Quốc đến bưu cục USPS tại Mỹ — USPS thực hiện last-mile delivery. Không giao tận tay người nhận.", zh: "货物从中国运送到美国USPS邮局 — USPS负责最后一英里配送。不直接送达收件人。" },
  "sbl.condition": { en: "Condition", vi: "Điều kiện", zh: "条件" },
  "sbl.condition_val": { en: "Must have valid label", vi: "Phải có label hợp lệ", zh: "必须有有效标签" },
  "sbl.lastmile": { en: "Last-mile", vi: "Chặng cuối", zh: "最后一公里" },
  "sbl.lastmile_val": { en: "USPS Last-mile", vi: "USPS Last-mile", zh: "USPS最后一公里" },
  "sbl.suitable": { en: "Suitable for", vi: "Phù hợp", zh: "适用于" },
  "sbl.suitable_val": { en: "TikTok Shop, Marketplace", vi: "TikTok Shop, Marketplace", zh: "TikTok Shop, Marketplace" },
  "sbl.panel_title": { en: "📦 CN — US SHIP BY LABEL PRICING", vi: "📦 BẢNG GIÁ CN — US SHIP BY LABEL", zh: "📦 CN — US SHIP BY LABEL 价格表" },
  "sbl.transit_time": { en: "Transit time:", vi: "Thời gian vận chuyển:", zh: "运输时间：" },
  "sbl.transit_desc": { en: "7–10 BSD (per USPS schedule). Includes US Import Tax.", vi: "7–10 BSD (theo lịch USPS). Bao gồm Import Tax US.", zh: "7-10个工作日（按USPS时间表）。包含美国进口税。" },
  "sbl.order_fee_label": { en: "Order Handling Fee:", vi: "Order Handling Fee:", zh: "订单处理费：" },
  "sbl.order_fee_note": { en: "(If using THG warehouse system)", vi: "(Nếu sử dụng hệ thống kho THG)", zh: "（如使用THG仓库系统）" },
  "sbl.tracking_fee_label": { en: "Active tracking fee:", vi: "Active tracking fee:", zh: "主动追踪费：" },
  "sbl.tracking_fee_note": { en: "(If using USPS active tracking service)", vi: "(Nếu sử dụng dịch vụ active tracking USPS)", zh: "（如使用USPS主动追踪服务）" },
  "sbl.tab_regular": { en: "🇺🇸 CN → US (Regular)", vi: "🇺🇸 CN → US (Regular)", zh: "🇺🇸 CN → US (普通)" },
  "sbl.tab_special": { en: "🇺🇸 CN → US (Special)", vi: "🇺🇸 CN → US (Special)", zh: "🇺🇸 CN → US (特殊)" },
  "sbl.title_regular": { en: "Regular Product", vi: "Hàng Thường", zh: "普通产品" },
  "sbl.title_special": { en: "Special Product", vi: "Hàng Đặc Biệt", zh: "特殊产品" },

  // ── Pricing: PriceTable ──
  "pt.weight_header": { en: "Weight (KG)", vi: "Cân Nặng (KG)", zh: "重量 (KG)" },
  "pt.export_excel": { en: "Export to Excel", vi: "Xuất Excel", zh: "导出Excel" },
  "pt.swipe_hint": { en: "👉 Swipe to see more", vi: "👉 Vuốt ngang để xem thêm", zh: "👉 滑动查看更多" },

  // ── Pricing: ExpressVnUsPanel ──
  "evn.hcm_warehouse": { en: "HO CHI MINH WAREHOUSE", vi: "KHO HỒ CHÍ MINH", zh: "胡志明仓库" },
  "evn.hn_warehouse": { en: "HANOI WAREHOUSE", vi: "KHO HÀ NỘI", zh: "河内仓库" },
  "evn.saver_title": { en: "✈️ UPS Saver — Rate per KG", vi: "✈️ UPS Saver — Phân Mức KG", zh: "✈️ UPS Saver — 按公斤计费" },
  "evn.expedited_title": { en: "🚢 UPS Expedited — Bulk", vi: "🚢 UPS Expedited — Hàng Bulk", zh: "🚢 UPS Expedited — 散装" },
  "evn.weight_label": { en: "Weight", vi: "Cân nặng", zh: "重量" },
  "evn.weight_col": { en: "Weight (kg)", vi: "Cân nặng (kg)", zh: "重量 (kg)" },
  "evn.bracket_label": { en: "Tier", vi: "Hạng mức", zh: "等级" },
  "evn.bracket_col": { en: "Tier (kg)", vi: "Hạng mức (kg)", zh: "等级 (kg)" },
  "evn.shipping_fee_col": { en: "Shipping fee (VNĐ)", vi: "Shipping fee (VNĐ)", zh: "运费 (VNĐ)" },
  "evn.express_policy": { en: "📋 Please contact THG for detailed shipping policy on express cargo.", vi: "📋 Liên hệ THG để biết thêm chi tiết chính sách vận chuyển hàng Express.", zh: "📋 如需了解 Express 详细运输政策，请联系 THG" },
  "evn.express_note": { en: "Express routes do not apply Epacket remote surcharge or re-delivery policies.", vi: "Tuyến Express không áp dụng phụ phí vùng sâu và chính sách reship của Epacket.", zh: "Express 路线不适用 Epacket 的偏远附加费和退件重寄政策。" },

  // ── Pricing: ExpressCnUsPanel ──
  "ecn.weight_header": { en: "Weight", vi: "Cân Nặng", zh: "重量" },
  "ecn.price_header": { en: "Price ($/kg)", vi: "Giá ($/kg)", zh: "价格 ($/kg)" },
  "ecn.note_header": { en: "Note", vi: "Ghi chú", zh: "备注" },
  "ecn.bulk_quote": { en: "Quote per bulk", vi: "Báo giá theo lô", zh: "按批报价" },
  "ecn.contact_btn": { en: "📞 Contact for CN–US quote", vi: "📞 Liên hệ báo giá CN–US", zh: "📞 联系获取CN-US报价" },

  // ── Shipping Terms FAQ Panel ──
  "ship_faq.header_title": { en: "General Terms & Conditions", vi: "Mục Điều khoản quy định chung", zh: "一般条款和条件" },
  "ship_faq.header_desc": { en: "To protect your interests, please read the frequently asked questions below carefully. For other questions, please contact THG Support directly.", vi: "Để đảm bảo quyền lợi, vui lòng đọc kỹ Các câu hỏi thường gặp bên dưới. Những thắc mắc khác vui lòng liên hệ trực tiếp cho Support của THG.", zh: "为保障您的权益，请仔细阅读以下常见问题。其他问题请直接联系THG客服。" },
  "ship_faq.q1": { en: "How many days does it take for CN-US drop shipping?", vi: "Thời gian drop từ CN-US là bao nhiêu ngày?", zh: "CN-US代发需要多少天？" },
  "ship_faq.a1": { en: "Order time from Taobao to THG warehouse (Dongguan): about 2 days.\nFrom Chinese warehouse to the US: 5-8 days for delivery to the recipient in the US.\n=> Total shipping time can be 8-10 days.", vi: "Thời gian đơn hàng từ Taobao về kho THG (Đông Hoản): khoảng 2 ngày.\nTừ kho ở Trung Quốc đến Mỹ: 5-8 ngày sẽ được giao đến tay người nhận ở Mỹ.\n=> Tổng thời gian vận chuyển có thể từ 8 - 10 ngày.", zh: "从淘宝到THG仓库（东莞）的时间：约2天。\n从中国仓库到美国：5-8天送达美国收件人。\n=> 总运输时间约8-10天。" },
  "ship_faq.q2": { en: "Does THG support active tracking compatible with TikTok policy?", vi: "Có hỗ trợ active tracking phù hợp với policy của TikTok không?", zh: "THG是否支持符合TikTok政策的active tracking？" },
  "ship_faq.a2": { en: "THG supports active tracking. When you place orders in the morning, THG will return tracking in the afternoon or evening. Then the tracking will be activated according to TikTok policy within 48 hours.", vi: "THG có hỗ trợ active tracking. Khi bạn lên đơn hàng buổi sáng THG sẽ trả tracking trong buổi chiều hoặc tối. Sau đó tracking sẽ được active theo đúng policy của TikTok trong vòng 48h.", zh: "THG支持active tracking。当您上午下单时，THG将在下午或晚上返回tracking号。然后tracking将在48小时内按照TikTok政策激活。" },
  "ship_faq.q3": { en: "What shipping routes does THG support and what are the delivery times?", vi: "THG hỗ trợ những tuyến đường vận chuyển nào và thời gian giao hàng như thế nào?", zh: "THG支持哪些运输路线，交货时间是多少？" },
  "ship_faq.a3": { en: "THG offers diverse shipping routes including Vietnam -> US, China -> US, and Vietnam/China -> Worldwide. We have specialized lines for TikTok Shop (US/UK/DE), both bulk and epacket to optimize costs and delivery time according to each seller's needs.", vi: "THG cung cấp đa dạng tuyến vận chuyển bao gồm Việt Nam -> Mỹ, Trung Quốc -> Mỹ, và Việt Nam/Trung Quốc -> Worldwide. Chúng tôi có các line chuyên biệt cho TikTok Shop (US/UK/DE), cả hàng lô và epacket để tối ưu chi phí và thời gian giao hàng theo nhu cầu của từng seller.", zh: "THG提供多种运输路线，包括越南->美国、中国->美国和越南/中国->全球。我们有TikTok Shop（US/UK/DE）专线，包括批量和epacket，以优化成本和配送时间。" },
  "ship_faq.q4": { en: "Can THG ship bulky/oversized items or only small packages?", vi: "THG có nhận gửi hàng cồng kềnh hay chỉ gửi được hàng nhỏ thôi?", zh: "THG可以寄送大件货物还是只能寄小件？" },
  "ship_faq.a4": { en: "THG can handle a wide variety of goods from small to bulky. With standard quality inspection and packaging processes, we ensure optimal protection for goods during shipping regardless of size or weight.", vi: "THG có thể xử lý đa dạng loại hàng hóa từ nhỏ đến cồng kềnh. Với quy trình kiểm tra chất lượng và đóng gói chuẩn, chúng tôi đảm bảo hàng hóa được bảo vệ tối ưu trong quá trình vận chuyển dù kích thước hay trọng lượng ra sao.", zh: "THG可以处理各种类型的货物，从小件到大件。通过标准质量检查和包装流程，我们确保货物在运输过程中得到最佳保护。" },
  "ship_faq.q5": { en: "Is THG's shipping cost competitive? Are there any hidden fees?", vi: "Chi phí vận chuyển của THG có cạnh tranh không? Có phát sinh chi phí ẩn nào không?", zh: "THG的运费有竞争力吗？有没有隐藏费用？" },
  "ship_faq.a5": { en: "THG commits to detailed and transparent cost reporting with no hidden fees. We optimize costs by providing both bulk and epacket options, helping sellers choose the best solution for their budget and delivery requirements.", vi: "THG cam kết báo cáo chi phí chi tiết và rõ ràng, không có chi phí phát sinh. Chúng tôi tối ưu chi phí thông qua việc cung cấp cả hàng lô và epacket, giúp seller lựa chọn phương án phù hợp với ngân sách và yêu cầu giao hàng của mình.", zh: "THG承诺提供详细透明的费用报告，没有隐藏费用。我们通过提供批量和epacket选项来优化成本，帮助卖家选择最适合自己预算和配送需求的方案。" },
  "ship_faq.q6": { en: "How can sellers track their order status?", vi: "Seller có thể theo dõi trạng thái đơn hàng như thế nào?", zh: "卖家如何跟踪订单状态？" },
  "ship_faq.a6": { en: "THG provides a real-time tracking system, allowing you to proactively check order status at any time. Each order is processed through a closed-loop system from data synchronization, packaging to detailed status tracking.", vi: "THG cung cấp hệ thống tracking real-time, cho phép bạn chủ động tra cứu trạng thái đơn hàng bất cứ lúc nào. Mỗi đơn hàng được vận hành qua hệ thống khép kín từ đồng bộ dữ liệu, đóng gói đến theo dõi trạng thái chi tiết.", zh: "THG提供实时追踪系统，让您随时主动查看订单状态。每个订单通过从数据同步、包装到详细状态跟踪的闭环系统运作。" },
  "ship_faq.q7": { en: "How does THG calculate shipping costs? Is it based on actual weight?", vi: "THG tính cước vận chuyển dựa trên tiêu chí gì? Có phải theo trọng lượng thật không?", zh: "THG如何计算运费？是按实际重量吗？" },
  "ship_faq.a7": { en: "THG calculates shipping based on whichever is higher between actual weight (Gross Weight) and volumetric weight (Volume Weight = L×W×H / 6000).\n\n• Example: A package with actual weight 0.9kg but volumetric weight 1.1kg will be charged at 1.1kg.\n• Applies to all US/Canada/Mexico/EU routes.\n• Maximum weight: 30kg/package.", vi: "THG tính cước theo nguyên tắc lấy cao nhất giữa trọng lượng thực tế (Gross Weight) và trọng lượng thể tích (Volume Weight = L×W×H / 6000).\n\n• Ví dụ: kiện hàng có trọng lượng thực 0.9kg nhưng trọng lượng thể tích 1.1kg thì cước vận chuyển sẽ tính theo 1.1kg.\n• Áp dụng cho tất cả tuyến US/Canada/Mexico/EU.\n• Trọng lượng tối đa: 30kg/kiện.", zh: "THG按实际重量（毛重）和体积重量（体积重量 = 长×宽×高 / 6000）中较高者计算运费。\n\n• 例如：一个包裹实际重量0.9kg但体积重量1.1kg，则按1.1kg计费。\n• 适用于所有US/Canada/Mexico/EU路线。\n• 最大重量：30kg/件。" },
  "ship_faq.q8": { en: "What is THG's compensation policy?", vi: "Chính sách bồi thường của THG?", zh: "THG的赔偿政策是什么？" },
  "ship_faq.a8": { en: "THG compensates 100% of the value of goods lost/damaged due to errors during processing at THG.\n\n• Maximum compensation: $500/package.\n• Claim period: within 14 days from expected delivery date.\n• Does not apply to: prohibited goods, incorrectly declared goods, or goods seized by customs.", vi: "THG bồi thường 100% giá trị hàng hóa bị thất lạc/hư hỏng do lỗi trong quá trình xử lý tại THG.\n\n• Mức bồi thường tối đa: $500/kiện hàng.\n• Thời hạn khiếu nại: trong vòng 14 ngày kể từ ngày giao hàng dự kiến.\n• Không áp dụng cho: hàng cấm, hàng không khai báo đúng, hoặc hàng bị hải quan tịch thu.", zh: "THG对因THG处理过程中的失误导致的货物丢失/损坏赔偿100%的货物价值。\n\n• 最高赔偿：$500/包裹。\n• 索赔期限：预计交付日起14天内。\n• 不适用于：违禁品、申报不正确的货物或被海关扣押的货物。" },
  "ship_faq.q9": { en: "What are the size and weight limits for ePacket service from China to the US?", vi: "Dịch vụ ePacket từ Trung Quốc sang Mỹ có giới hạn kích thước và trọng lượng ra sao?", zh: "从中国到美国的ePacket服务有什么尺寸和重量限制？" },
  "ship_faq.a9": { en: "For the ePacket CHINA - US line, packages can weigh up to 30kg.\n\n• Standard size: 55×40×35cm (no extra charge).\n• Maximum size: 68×43×43cm (additional fees apply).\n• Minimum size: 10×15cm to ensure shipping safety.", vi: "Với dịch vụ Line ePacket CHINA - US, kiện hàng có thể nặng tối đa 30kg.\n\n• Kích thước tiêu chuẩn: 55×40×35cm (không tính thêm phí).\n• Kích thước tối đa: 68×43×43cm (có phí bổ sung).\n• Kích thước tối thiểu: 10×15cm để đảm bảo an toàn vận chuyển.", zh: "ePacket CHINA - US线路，包裹最重可达30kg。\n\n• 标准尺寸：55×40×35cm（无额外费用）。\n• 最大尺寸：68×43×43cm（需额外收费）。\n• 最小尺寸：10×15cm以确保运输安全。" },
  "ship_faq.q10": { en: "What is the maximum declared value per package?", vi: "Giá trị khai báo tối đa trên mỗi kiện hàng là bao nhiêu?", zh: "每件包裹的最高申报价值是多少？" },
  "ship_faq.a10": { en: "According to carrier and destination customs regulations, the maximum declared value varies by country:\n\n• USA: Max USD $60 (strict).\n• EU: Max EUR €150 / ~USD $155.\n• UK: Max GBP £135 / ~USD $155.\n• Japan: Max USD $110.\n\n⚠️ Note: Declarations exceeding the limit may result in the package being held or additional taxes. Please contact THG for advice.", vi: "Theo quy định từ hãng vận chuyển và hải quan nước đến, giá trị khai báo tối đa khác nhau tùy quốc gia:\n\n• USA: Max USD $60 (nghiêm ngặt).\n• EU: Max EUR €150 / ~USD $155.\n• UK: Max GBP £135 / ~USD $155.\n• Japan: Max USD $110.\n\n⚠️ Lưu ý: Khai báo vượt giới hạn có thể dẫn đến kiện hàng bị giữ lại hoặc thuế phát sinh. Vui lòng liên hệ THG nếu cần tư vấn.", zh: "根据承运商和目的地海关规定，各国最高申报价值不同：\n\n• 美国：最高USD $60（严格执行）。\n• 欧盟：最高EUR €150 / ~USD $155。\n• 英国：最高GBP £135 / ~USD $155。\n• 日本：最高USD $110。\n\n⚠️ 注意：超过限额的申报可能导致包裹被扣留或产生额外税费。如需建议请联系THG。" },
  "ship_faq.q11": { en: "What is the return and re-delivery policy?", vi: "Chính sách hoàn hàng (Return) và gửi lại (Re-delivery) như thế nào?", zh: "退货和重新发货政策是什么？" },
  "ship_faq.a11": { en: "When a package is returned to the overseas warehouse (due to wrong address, no recipient, or refused delivery):\n\n• Customers have 14-20 days (depending on country) to request re-delivery.\n• If no response within the deadline, the package will be destroyed.\n• THG does NOT support returning goods from abroad back to China/Vietnam.\n\nRe-delivery fees:\n• USA: $10.50/order\n• UK: $7.00/order\n• Germany: $10.50/order\n• Japan: $7.60/order\n• Other countries: $8.00/order", vi: "Khi kiện hàng bị trả về kho hải ngoại (do sai địa chỉ, không có người nhận, hoặc bị từ chối nhận):\n\n• Khách hàng có 14-20 ngày (tùy quốc gia) để yêu cầu Re-delivery.\n• Nếu không có phản hồi trong thời hạn, kiện hàng sẽ bị hủy.\n• THG KHÔNG hỗ trợ hoàn hàng từ nước ngoài về lại Trung Quốc/Việt Nam.\n\nPhí Re-delivery:\n• USA: $10.50/đơn\n• UK: $7.00/đơn\n• Germany: $10.50/đơn\n• Japan: $7.60/đơn\n• Các nước khác: $8.00/đơn", zh: "当包裹被退回海外仓库时（因地址错误、无人收件或拒收）：\n\n• 客户有14-20天（因国家而异）申请重新发货。\n• 如在截止日期内无回复，包裹将被销毁。\n• THG不支持将货物从国外退回中国/越南。\n\n重新发货费用：\n• 美国：$10.50/单\n• 英国：$7.00/单\n• 德国：$10.50/单\n• 日本：$7.60/单\n• 其他国家：$8.00/单" },
  "ship_faq.q12": { en: "How much are warehouse pickup and Return to Sender fees?", vi: "Pickup tại kho và Return to Sender phí bao nhiêu?", zh: "仓库自提和退件费用是多少？" },
  "ship_faq.a12": { en: "THG provides return processing services:\n\n• Pickup at US warehouse (PA/NC): $1.15/order\n• Return to Sender: $1.50/order\n\nWarehouse pickup orders need to be scheduled at least 24 hours in advance through the THG system.", vi: "THG cung cấp dịch vụ xử lý hàng trả về:\n\n• Pickup tại kho US (PA/NC): $1.15/đơn\n• Return to Sender: $1.50/đơn\n\nCác đơn hàng pickup tại kho cần đặt lịch trước ít nhất 24h qua hệ thống THG.", zh: "THG提供退货处理服务：\n\n• 美国仓库（PA/NC）自提：$1.15/单\n• 退回发件人：$1.50/单\n\n仓库自提订单需要通过THG系统提前至少24小时预约。" },
  "ship_faq.q13": { en: "How is Remote Area determined?", vi: "Remote Area (Vùng sâu) được xác định như thế nào?", zh: "偏远地区如何确定？" },
  "ship_faq.a13": { en: "Remote Area is determined by the ZIP code systems of international carriers (USPS, FedEx, DHL).\n\nIncludes:\n• Alaska, Hawaii, Puerto Rico, Guam\n• APO/FPO (military addresses)\n• Rural or hard-to-access areas\n\nRemote area surcharges are calculated by package weight, from $1.95 (0.05kg) to $87.82 (30kg). See details in the Remote Area Surcharge table.", vi: "Vùng sâu (Remote Area) được xác định theo hệ thống ZIP code của các hãng vận chuyển quốc tế (USPS, FedEx, DHL).\n\nBao gồm:\n• Alaska, Hawaii, Puerto Rico, Guam\n• APO/FPO (địa chỉ quân sự)\n• Các vùng nông thôn hoặc khó tiếp cận\n\nPhụ phí vùng sâu được tính theo trọng lượng kiện hàng, từ $1.95 (0.05kg) đến $87.82 (30kg). Xem chi tiết trong bảng Phụ Phí Vùng Sâu.", zh: "偏远地区由国际承运商（USPS、FedEx、DHL）的邮政编码系统确定。\n\n包括：\n• 阿拉斯加、夏威夷、波多黎各、关岛\n• APO/FPO（军事地址）\n• 农村或难以到达的地区\n\n偏远地区附加费按包裹重量计算，从$1.95（0.05kg）到$87.82（30kg）。详见偏远地区附加费表。" },
  "ship_faq.q14": { en: "Does THG support POD (Print on Demand) services?", vi: "THG hỗ trợ dịch vụ POD (Print on Demand) không?", zh: "THG是否支持POD（按需打印）服务？" },
  "ship_faq.a14": { en: "Yes, THG provides high-quality POD (Print on Demand) services:\n\n• Production time: 2-4 business days.\n• Return policy: 7 days for quality issues.\n• TikTok Shipping integration: automatic shipping label creation and real-time sync.\n• Supports shipping from both VN and CN to USA/Worldwide.", vi: "Có, THG cung cấp dịch vụ POD (Print on Demand) với chất lượng cao:\n\n• Thời gian sản xuất: 2-4 ngày làm việc.\n• Chính sách đổi trả: 7 ngày cho vấn đề chất lượng.\n• Tích hợp TikTok Shipping: tự động tạo nhãn vận chuyển và đồng bộ real-time.\n• Hỗ trợ gửi từ cả VN và CN đi USA/Worldwide.", zh: "是的，THG提供高质量的POD（按需打印）服务：\n\n• 生产时间：2-4个工作日。\n• 退换政策：质量问题7天内可退换。\n• TikTok Shipping集成：自动创建运输标签和实时同步。\n• 支持从越南和中国发往美国/全球。" },

  // Fulfill Page Extension
  "fulfill_page.hub_title": {
    en: "HUB Fulfill System",
    vi: "Hệ thống HUB Fulfill",
    zh: "HUB Fulfill 系统",
  },
  "fulfill_page.hub_desc": {
    en: "Experience the most comprehensive, transparent, and powerful fulfillment management system for global sellers.",
    vi: "Trải nghiệm hệ thống quản lý Fulfill toàn diện mạnh mẽ, minh bạch và ưu việt nhất dành cho các Seller Global.",
    zh: "体验针对全球卖家的最全面，透明和强大的履行管理系统。",
  },
  "fulfill_page.hub_cta": {
    en: "Experience System",
    vi: "Trải nghiệm Hệ thống",
    zh: "体验系统",
  },
  "fulfill_page.policy_title": {
    en: "Fulfillment Terms & Policies",
    vi: "Chính sách & Điều khoản Fulfillment",
    zh: "履行条款及政策",
  },
  "fulfill_page.policy_desc": {
    en: "All support information, cargo insurance, SLA, and 100% transparent compensation policies.",
    vi: "Mọi thông tin hỗ trợ, bảo hiểm hàng hóa, SLA và chính sách đền bù minh bạch 100%.",
    zh: "提供所有的支持信息、货物保险、SLA，以及100%透明的赔偿政策。",
  },
  "fulfill_page.policy_cta": {
    en: "View Details",
    vi: "Xem Chi Tiết",
    zh: "查看详情",
  },
  "fulfill_page.gallery_title": {
    en: "Warehouse & Operations Gallery",
    vi: "Hệ thống Kho Bãi & Vận Hành",
    zh: "仓储与运营画廊",
  },

  // Lead form dialog (homepage / nav consult CTA)
  "lead_form.title": { en: "Talk to us", vi: "Liên hệ tư vấn", zh: "联系咨询" },
  "lead_form.desc": {
    en: "Leave your details and the THG team will get back within 24h. For urgent questions you can also chat with us on Facebook.",
    vi: "Để lại thông tin, đội THG sẽ phản hồi trong 24h. Bạn cũng có thể chat trực tiếp qua Facebook nếu cần gấp.",
    zh: "请留下您的信息，THG团队将在24小时内回复。紧急情况可通过Facebook直接联系。",
  },
  "lead_form.name_label": { en: "Full name", vi: "Họ tên", zh: "姓名" },
  "lead_form.name_placeholder": { en: "John Doe", vi: "Nguyễn Văn A", zh: "张三" },
  "lead_form.email_label": { en: "Email", vi: "Email", zh: "电子邮箱" },
  "lead_form.email_placeholder": { en: "you@example.com", vi: "ban@example.com", zh: "you@example.com" },
  "lead_form.phone_label": { en: "Phone (optional)", vi: "Điện thoại (tuỳ chọn)", zh: "电话（可选）" },
  "lead_form.phone_placeholder": { en: "+1 555 123 4567", vi: "0901 234 567", zh: "138 0000 0000" },
  "lead_form.message_label": { en: "Your needs (optional)", vi: "Nhu cầu (tuỳ chọn)", zh: "需求（可选）" },
  "lead_form.message_placeholder": {
    en: "E.g.: We sell POD on TikTok Shop and need to fulfill 200 orders/day from VN to US…",
    vi: "Vd: Em đang bán POD trên TikTok Shop, cần fulfill 200 đơn/ngày từ VN sang US…",
    zh: "例如：我们在TikTok Shop销售POD，需要从越南到美国每天履行200个订单…",
  },
  "lead_form.submit": { en: "Send consultation request", vi: "Gửi yêu cầu tư vấn", zh: "发送咨询请求" },
  "lead_form.submitting": { en: "Sending…", vi: "Đang gửi…", zh: "正在发送…" },
  "lead_form.close": { en: "Close", vi: "Đóng", zh: "关闭" },
  "lead_form.consent": {
    en: "By submitting, you agree that THG may process your data to contact you.",
    vi: "Bằng cách submit, bạn đồng ý cho THG xử lý dữ liệu để liên hệ tư vấn.",
    zh: "提交即表示您同意THG处理您的数据以联系您。",
  },
  "lead_form.err_required": {
    en: "Please fill in your name and email.",
    vi: "Vui lòng điền tên và email.",
    zh: "请填写您的姓名和电子邮箱。",
  },
  "lead_form.err_generic": {
    en: "Submission failed. Please try again later.",
    vi: "Gửi thất bại. Thử lại sau.",
    zh: "提交失败，请稍后再试。",
  },
  "lead_form.err_captcha": {
    en: "Please complete the captcha challenge before submitting.",
    vi: "Vui lòng hoàn thành xác thực captcha trước khi gửi.",
    zh: "请先完成验证码再提交。",
  },
  "lead_form.success_toast": {
    en: "Thanks! THG will reach out within 24h.",
    vi: "Cảm ơn bạn! THG sẽ liên hệ trong 24h.",
    zh: "感谢您！THG将在24小时内联系您。",
  },
  "lead_form.success_title": {
    en: "Request received successfully!",
    vi: "Đã gửi yêu cầu thành công!",
    zh: "请求已成功提交！",
  },
  "lead_form.success_desc_before": { en: "The THG team will contact ", vi: "Đội ngũ THG sẽ liên hệ với ", zh: "THG团队将通过 " },
  "lead_form.success_desc_after": { en: " within 24 hours.", vi: " trong vòng 24 giờ.", zh: " 联系您（24小时内）。" },

  // Applicant form (careers apply CTA) — captcha shared with lead form
  "careers.form_err_captcha": {
    en: "Please complete the captcha challenge before submitting.",
    vi: "Vui lòng hoàn thành xác thực captcha trước khi gửi.",
    zh: "请先完成验证码再提交。",
  },

  // Floating contact widget (sticky mobile CTA bar + desktop chat icons)
  "floating.call": { en: "Call", vi: "Gọi", zh: "电话" },
  "floating.zalo": { en: "Zalo", vi: "Zalo", zh: "Zalo" },
  "floating.chat": { en: "Chat", vi: "Chat", zh: "聊天" },
  "floating.back_to_top": { en: "Back to top", vi: "Lên đầu trang", zh: "返回顶部" },

  // Trust microcopy under primary CTAs — small reassurance to lower commit
  // friction. Single string with bullets so it renders inline.
  "trust.cta_micro": {
    en: "Free consultation · 24h response · No commitment",
    vi: "Tư vấn miễn phí · Phản hồi trong 24h · Không cam kết",
    zh: "免费咨询 · 24小时响应 · 无义务",
  },

  // Homepage trust badges (static benchmark placeholders, not CMS-driven)
  "trust_badges.eyebrow": { en: "Trust Signals", vi: "Tín Hiệu Tin Cậy", zh: "信任标识" },
  "trust_badges.title": { en: "Built for Reliability at Scale", vi: "Năng Lực Vận Hành Đáng Tin Cậy", zh: "为规模化可靠履约而建" },
  "trust_badges.subtitle": { en: "Public profiles and third-party reviews can be attached here as your team publishes them.", vi: "Có thể gắn profile công khai và đánh giá bên thứ ba tại đây khi đội ngũ xuất bản chính thức.", zh: "当团队发布后，可在此挂载公开资料与第三方评价。" },
  "trust_badges.placeholder": { en: "Placeholder", vi: "Đang chuẩn bị", zh: "占位" },
  "trust_badges.badge1_name": { en: "Trustpilot", vi: "Trustpilot", zh: "Trustpilot" },
  "trust_badges.badge1_value": { en: "Profile pending publication", vi: "Hồ sơ đang chờ công khai", zh: "资料待发布" },
  "trust_badges.badge2_name": { en: "G2", vi: "G2", zh: "G2" },
  "trust_badges.badge2_value": { en: "Review page pending publication", vi: "Trang đánh giá đang chờ công khai", zh: "评价页待发布" },
  "trust_badges.badge3_name": { en: "Compliance & Security", vi: "Tuân thủ & Bảo mật", zh: "合规与安全" },
  "trust_badges.badge3_value": { en: "Operational policy and SLA proof", vi: "Bộ chính sách vận hành và bằng chứng SLA", zh: "运营政策与SLA证明" },

  // Brand promise — concretizes the "Happiness" brand into a measurable promise (audit Gap 5)
  "brand.promise": {
    en: "Happiness means: on time · on budget · in your customers' hands.",
    vi: "Happiness nghĩa là: giao đúng hẹn · đúng giá · đúng tay khách hàng.",
    zh: "Happiness 即：准时 · 价格透明 · 安全送达买家手中。",
  },

  // Pricing export (audit Gap 8)
  "pt.export_pdf": { en: "Export to PDF", vi: "Xuất PDF", zh: "导出PDF" },

  // Quote request CTA on pricing pages (audit Gap 8)
  "quote.cta_title": { en: "Save this quote or get a tailored one", vi: "Lưu báo giá hoặc nhận báo giá riêng", zh: "保存此报价或获取专属报价" },
  "quote.cta_desc": {
    en: "Export the rate tables to PDF to share with your team, or request a personalized quote by email based on your route, weight and volume.",
    vi: "Xuất bảng giá ra PDF để gửi cho đội ngũ, hoặc nhận báo giá cá nhân hóa qua email theo tuyến, trọng lượng và sản lượng của bạn.",
    zh: "将运费表导出为PDF与团队分享，或根据您的线路、重量与销量通过邮件获取个性化报价。",
  },
  "quote.cta_btn": { en: "Request quote by email", vi: "Nhận báo giá qua email", zh: "通过邮件获取报价" },
  "quote.email_prefix": { en: "Quote request for:", vi: "Yêu cầu báo giá cho:", zh: "报价请求：" },

  // Ecosystem journey — land & expand roadmap across services (audit Gap 3)
  "ecosystem.eyebrow": { en: "Grow With Us", vi: "Đồng Hành Tăng Trưởng", zh: "与我们共同成长" },
  "ecosystem.title": { en: "One ecosystem, every stage of growth", vi: "Một hệ sinh thái, đồng hành mọi giai đoạn", zh: "一个生态系统，陪伴每个增长阶段" },
  "ecosystem.subtitle": {
    en: "Start with a single service and expand as you scale — no switching providers, one team end to end.",
    vi: "Bắt đầu với một dịch vụ và mở rộng khi bạn lớn lên — không cần đổi nhà cung cấp, một đội ngũ xuyên suốt.",
    zh: "从单一服务起步，随规模扩展——无需更换供应商，一个团队全程服务。",
  },
  "ecosystem.step1_tag": { en: "Start", vi: "Bắt đầu", zh: "起步" },
  "ecosystem.step1_title": { en: "THG Express", vi: "THG Express", zh: "THG Express" },
  "ecosystem.step1_desc": {
    en: "Ship cross-border from VN/CN to the US/EU/UK with transparent rates — no warehouse needed yet.",
    vi: "Vận chuyển xuyên biên giới từ VN/CN đi US/EU/UK với cước minh bạch — chưa cần kho.",
    zh: "以透明运费从越南/中国发往美国/欧盟/英国——暂时无需仓库。",
  },
  "ecosystem.step1_when": {
    en: "When you pass ~200 orders/month, you'll want stock closer to customers.",
    vi: "Khi vượt ~200 đơn/tháng, bạn sẽ cần hàng nằm gần khách hơn.",
    zh: "当每月订单超过约200单时，您会希望库存更靠近客户。",
  },
  "ecosystem.step1_cta": { en: "Explore Express", vi: "Xem THG Express", zh: "了解 Express" },
  "ecosystem.step2_tag": { en: "Expand", vi: "Mở rộng", zh: "扩展" },
  "ecosystem.step2_title": { en: "THG Warehouse", vi: "THG Warehouse", zh: "THG Warehouse" },
  "ecosystem.step2_desc": {
    en: "Store inventory in the US and fulfill domestically from $1.2 — faster delivery, lower per-order cost.",
    vi: "Lưu kho tại Mỹ và fulfill nội địa từ $1.2 — giao nhanh hơn, chi phí mỗi đơn thấp hơn.",
    zh: "在美国存储库存并以$1.2起的价格本土履约——更快交付，更低单均成本。",
  },
  "ecosystem.step2_when": {
    en: "Ready to own your product and brand? Move into print-on-demand.",
    vi: "Sẵn sàng tự chủ sản phẩm và thương hiệu? Chuyển sang in theo yêu cầu (POD).",
    zh: "准备好拥有自己的产品和品牌了吗？进入按需印刷（POD）。",
  },
  "ecosystem.step2_cta": { en: "Explore Warehouse", vi: "Xem THG Warehouse", zh: "了解 Warehouse" },
  "ecosystem.step3_tag": { en: "Scale", vi: "Tăng tốc", zh: "加速" },
  "ecosystem.step3_title": { en: "THG Fulfill — POD & Sourcing", vi: "THG Fulfill — POD & Sourcing", zh: "THG Fulfill — POD与采购" },
  "ecosystem.step3_desc": {
    en: "Print on demand, source from VN/CN and run full fulfillment under one roof — built for sellers scaling globally.",
    vi: "In theo yêu cầu, sourcing từ VN/CN và vận hành fulfillment trọn gói — dành cho seller mở rộng toàn cầu.",
    zh: "按需印刷、从越南/中国采购并提供一站式履约——为全球扩张的卖家打造。",
  },
  "ecosystem.step3_when": {
    en: "One team across the whole journey — from first order to global scale.",
    vi: "Một đội ngũ xuyên suốt hành trình — từ đơn đầu tiên đến quy mô toàn cầu.",
    zh: "一个团队贯穿整个旅程——从第一单到全球规模。",
  },
  "ecosystem.step3_cta": { en: "Explore Fulfill", vi: "Xem THG Fulfill", zh: "了解 Fulfill" },

  // ── Per-page SEO titles & meta descriptions (audit Track A). Keyword-rich,
  //    per-locale so vi/zh users see localized titles in SERP & social shares. ──
  "seo.fulfill_title": { en: "POD & Dropship Fulfillment from Vietnam | THG Fulfill", vi: "Fulfillment POD & Dropship từ Việt Nam | THG Fulfill", zh: "越南POD与代发履约 | THG Fulfill" },
  "seo.fulfill_desc": { en: "Print-on-demand & dropship fulfillment from Vietnam & China to the US, EU & UK. Competitive base cost, fast linehaul, US domestic fulfill from $1.2.", vi: "Fulfillment POD & dropship từ Việt Nam và Trung Quốc đi Mỹ, EU, UK. Chi phí gốc cạnh tranh, vận chuyển nhanh, fulfill nội địa Mỹ từ $1.2.", zh: "从越南和中国到美国、欧盟、英国的POD与代发履约。基础成本有竞争力，干线运输快，美国本土履约低至$1.2。" },
  "seo.express_title": { en: "Cross-Border Express Shipping Vietnam & China to US | THG Express", vi: "Vận chuyển quốc tế Việt Nam & Trung Quốc đi Mỹ | THG Express", zh: "越南和中国到美国的跨境快递 | THG Express" },
  "seo.express_desc": { en: "Fast cross-border express shipping from Vietnam & China to the US, UK & EU. Transparent per-kg rates, customs handling, tracking on every parcel.", vi: "Vận chuyển quốc tế nhanh từ Việt Nam và Trung Quốc đi Mỹ, UK, EU. Cước theo kg minh bạch, xử lý hải quan, theo dõi từng đơn.", zh: "从越南和中国到美国、英国、欧盟的快速跨境快递。每公斤费率透明，清关处理，每件包裹可追踪。" },
  "seo.warehouse_title": { en: "US Warehouse & 3PL Fulfillment (PA & NC) | THG Warehouse", vi: "Kho Mỹ & Fulfillment 3PL (PA & NC) | THG Warehouse", zh: "美国仓储与3PL履约（宾州和北卡） | THG Warehouse" },
  "seo.warehouse_desc": { en: "US-based 3PL warehousing in Pennsylvania & North Carolina. 2–5 day domestic delivery, transparent storage & pick-pack fees, real-time inventory.", vi: "Kho 3PL tại Mỹ ở Pennsylvania và North Carolina. Giao nội địa 2–5 ngày, phí lưu kho & pick-pack minh bạch, tồn kho theo thời gian thực.", zh: "位于宾州和北卡的美国3PL仓储。本土2–5天交付，仓储与拣货打包费用透明，实时库存。" },
  "seo.order_title": { en: "Taobao & 1688 Dropshipping to the USA | THG Dropship", vi: "Đặt hàng Taobao & 1688 giao thẳng Mỹ | THG Dropship", zh: "淘宝与1688代发直邮美国 | THG Dropship" },
  "seo.order_desc": { en: "Source and dropship products from Taobao & 1688 straight to your US customers. One partner for purchasing, QC, consolidation and shipping.", vi: "Mua và dropship sản phẩm từ Taobao & 1688 giao thẳng tới khách Mỹ. Một đối tác lo mua hàng, kiểm hàng, gom và vận chuyển.", zh: "从淘宝和1688采购并代发产品直达美国客户。采购、质检、集运与运输一站式合作伙伴。" },
  "seo.catalog_title": { en: "POD Product Catalog — Apparel & Accessories | THG Fulfill", vi: "Catalog Sản Phẩm POD — Áo & Phụ Kiện | THG Fulfill", zh: "POD产品目录——服装与配件 | THG Fulfill" },
  "seo.catalog_desc": { en: "Browse THG's print-on-demand catalog: t-shirts, hoodies, apparel and accessories ready for custom printing and global fulfillment.", vi: "Khám phá catalog POD của THG: áo thun, hoodie, trang phục và phụ kiện sẵn sàng in theo yêu cầu và fulfill toàn cầu.", zh: "浏览THG的按需印刷目录：T恤、卫衣、服装与配件，可定制印刷并全球履约。" },
  "seo.careers_title": { en: "Careers at THG Fulfill — Join Our Team", vi: "Tuyển dụng tại THG Fulfill — Gia nhập đội ngũ", zh: "THG Fulfill 招聘——加入我们" },
  "seo.careers_desc": { en: "Explore open roles at THG Fulfill across operations, sales, finance and AI/R&D. Help build the cross-border fulfillment network powering global sellers.", vi: "Khám phá vị trí đang tuyển tại THG Fulfill: vận hành, sales, kế toán và AI/R&D. Cùng xây mạng lưới fulfillment xuyên biên giới cho seller toàn cầu.", zh: "探索THG Fulfill在运营、销售、财务和AI/研发的职位空缺。共建赋能全球卖家的跨境履约网络。" },
  "seo.intl_pricing_title": { en: "International Shipping Rates VN/CN → US/EU/UK | THG Fulfill", vi: "Bảng giá vận chuyển quốc tế VN/CN → US/EU/UK | THG Fulfill", zh: "国际运费 VN/CN → US/EU/UK | THG Fulfill" },
  "seo.intl_pricing_desc": { en: "Transparent international shipping rates from Vietnam & China to the US, EU and UK. Compare ePacket, express and bulk by weight and destination.", vi: "Bảng giá vận chuyển quốc tế minh bạch từ VN & TQ đi Mỹ, EU, UK. So sánh ePacket, express và hàng lô theo cân nặng và điểm đến.", zh: "从越南和中国到美国、欧盟、英国的透明国际运费。按重量和目的地比较ePacket、快递与大宗。" },
  "seo.domestic_pricing_title": { en: "US Domestic Shipping Rates by Zone | THG Fulfill", vi: "Bảng giá vận chuyển nội địa Mỹ theo vùng | THG Fulfill", zh: "美国国内分区运费 | THG Fulfill" },
  "seo.domestic_pricing_desc": { en: "US domestic shipping rates by zone (1–9) for THG Warehouse customers. UPS Ground, USPS and FedEx options, updated weekly.", vi: "Bảng giá vận chuyển nội địa Mỹ theo vùng (1–9) cho khách THG Warehouse. UPS Ground, USPS, FedEx, cập nhật hằng tuần.", zh: "面向THG Warehouse客户的美国国内分区运费（1–9区）。UPS Ground、USPS与FedEx，每周更新。" },
  "seo.policy_title": { en: "Policies — Shipping, Returns & Compensation | THG Fulfill", vi: "Chính sách — Vận chuyển, Đổi trả & Bồi thường | THG Fulfill", zh: "政策——运输、退换与赔偿 | THG Fulfill" },
  "seo.policy_desc": { en: "THG Fulfill operational policies: shipping terms, returns, cargo insurance and compensation for lost or damaged items.", vi: "Chính sách vận hành THG Fulfill: điều khoản vận chuyển, đổi trả, bảo hiểm hàng hóa và bồi thường khi mất/hư hỏng.", zh: "THG Fulfill运营政策：运输条款、退换、货物保险及丢失或损坏赔偿。" },
  "seo.shipping_policy_title": { en: "Shipping Policy & Delivery Times by Route | THG Fulfill", vi: "Chính sách vận chuyển & thời gian giao theo tuyến | THG Fulfill", zh: "各线路运输政策与时效 | THG Fulfill" },
  "seo.shipping_policy_desc": { en: "Detailed shipping policy by route: delivery times, restrictions, customs and surcharges for VN/CN to US, EU and UK lanes.", vi: "Chính sách vận chuyển chi tiết theo tuyến: thời gian giao, hạn chế, hải quan và phụ phí cho tuyến VN/CN đi Mỹ, EU, UK.", zh: "按线路的详细运输政策：VN/CN到美国、欧盟、英国线路的时效、限制、清关与附加费。" },
  "seo.tracking_title": { en: "Track Your Order | THG Fulfill", vi: "Theo dõi đơn hàng | THG Fulfill", zh: "订单追踪 | THG Fulfill" },
  "seo.tracking_desc": { en: "Track your THG Fulfill shipment in real time. Enter your order ID to see the latest status and delivery updates.", vi: "Theo dõi đơn hàng THG Fulfill theo thời gian thực. Nhập mã đơn để xem trạng thái và cập nhật giao hàng mới nhất.", zh: "实时追踪您的THG Fulfill货件。输入订单号查看最新状态与配送更新。" },
  "seo.notfound_title": { en: "Page Not Found (404) | THG Fulfill", vi: "Không tìm thấy trang (404) | THG Fulfill", zh: "页面未找到 (404) | THG Fulfill" },
  "seo.notfound_desc": { en: "The page you're looking for doesn't exist. Return to the THG Fulfill homepage.", vi: "Trang bạn tìm không tồn tại. Quay lại trang chủ THG Fulfill.", zh: "您要找的页面不存在。返回THG Fulfill首页。" },

  // ── THG Fulfill Page: HUB System Guide (Section II) — localized so EN/ZH
  //    visitors no longer see the previously-hardcoded Vietnamese content. ──
  "hub.eyebrow": { en: "System Usage Guide", vi: "Hướng dẫn sử dụng hệ thống", zh: "系统使用指南" },
  "hub.heading": { en: "Hub System User Guide", vi: "Hướng dẫn sử dụng Hub System", zh: "Hub System 使用指南" },
  "hub.subtitle_before": { en: "A detailed guide to every feature on the management system ", vi: "Hướng dẫn chi tiết từng tính năng trên hệ thống quản lý ", zh: "管理系统每项功能的详细指南 " },
  "hub.toc": { en: "Contents", vi: "Mục lục", zh: "目录" },

  "hub.s1_title": { en: "1. Login & Dashboard", vi: "1. Đăng nhập & Bảng điều khiển", zh: "1. 登录与仪表盘" },
  "hub.s1_p1a": { en: "The management system is accessed at ", vi: "Hệ thống quản lý được truy cập thông qua địa chỉ ", zh: "管理系统通过以下地址访问：" },
  "hub.s1_p1b": { en: ". After logging in with your assigned account, you'll reach the central Dashboard, where the core operational metrics are shown at a glance:", vi: ". Sau khi đăng nhập bằng tài khoản được cấp, người dùng sẽ tiếp cận Bảng điều khiển trung tâm (Dashboard). Tại đây, các chỉ số vận hành cốt lõi được hiển thị trực quan:", zh: "。使用所分配的账户登录后，您将进入中央仪表盘（Dashboard），核心运营指标一目了然：" },
  "hub.s1_wallet_desc": { en: "Your currently available wallet balance.", vi: "Số dư hiện khả dụng trong ví.", zh: "钱包当前可用余额。" },
  "hub.s1_orders_desc": { en: "Total number of orders created.", vi: "Tổng lượng đơn hàng đã khởi tạo.", zh: "已创建的订单总数。" },
  "hub.s1_inprocess_desc": { en: "Number of orders currently being processed.", vi: "Số lượng đơn hàng đang trong giai đoạn xử lý.", zh: "正在处理中的订单数量。" },
  "hub.s1_revenue_desc": { en: "Total revenue achieved.", vi: "Tổng doanh thu đạt được.", zh: "已实现的总收入。" },
  "hub.s1_p2": { en: "The lower part of the page gives a quick overview of recent orders and top-up history.", vi: "Phần dưới của trang cung cấp cái nhìn nhanh về danh sách đơn hàng và lịch sử nạp tiền gần nhất.", zh: "页面下方提供最近订单列表与充值记录的快速概览。" },

  "hub.s2_title": { en: "2. Order Management", vi: "2. Quản lý Đơn hàng", zh: "2. 订单管理" },
  "hub.s2_p1": { en: "The Order section is the central hub for all operations. Users can:", vi: "Mục Order là trung tâm điều phối mọi hoạt động vận hành. Người dùng có thể:", zh: "Order（订单）模块是所有运营活动的协调中心。用户可以：" },
  "hub.s2_li1": { en: "Track the detailed status of each order and its tracking number.", vi: "Theo dõi trạng thái chi tiết của từng đơn hàng và mã vận đơn (tracking number).", zh: "追踪每个订单的详细状态及运单号（tracking number）。" },
  "hub.s2_li2": { en: "Create orders in bulk: use the Upload Orders feature with a CSV file to save data-entry time instead of creating each order manually.", vi: "Khởi tạo đơn hàng hàng loạt: Sử dụng tính năng Upload Orders thông qua file CSV để tối ưu hóa thời gian nhập liệu thay vì tạo thủ công từng đơn.", zh: "批量创建订单：使用 Upload Orders 功能通过 CSV 文件批量导入，免去逐单手动创建，节省录入时间。" },

  "hub.s3_title": { en: "3. Product Catalog", vi: "3. Danh mục Sản phẩm", zh: "3. 产品目录" },
  "hub.s3_p1": { en: "The Catalog section provides the product inventory supported by THG Fulfillment. Users can look up technical specs, costs and product availability. It's the database sellers use to pick items to sell and sync them into their own sales systems.", vi: "Mục Catalog cung cấp hệ thống kho hàng hóa được THG Fulfillment hỗ trợ. Người dùng có thể truy xuất các thông tin kỹ thuật, giá thành và tính sẵn có của sản phẩm. Đây là cơ sở dữ liệu để người bán lựa chọn mặt hàng kinh doanh và đồng bộ hóa vào hệ thống bán hàng của mình.", zh: "Catalog（目录）模块提供 THG Fulfillment 支持的商品库。用户可查询产品的技术参数、成本与可用性。这是卖家选品并同步至自有销售系统的数据库。" },

  "hub.s4_title": { en: "4. Billing & Finance", vi: "4. Quản lý Tài chính", zh: "4. 财务管理" },
  "hub.s4_p1": { en: "The system runs on a prepaid model. The Finance function is split into three main parts:", vi: "Hệ thống vận hành theo mô hình trả trước (Prepaid). Chức năng Tài chính được chia làm ba phần chính:", zh: "系统采用预付费（Prepaid）模式运营。财务功能分为三个主要部分：" },
  "hub.s4_wallet_desc": { en: "Track real-time balance changes.", vi: "Theo dõi biến động số dư thực tế.", zh: "跟踪实际余额变动。" },
  "hub.s4_topup_desc": { en: "A top-up gateway with a variety of payment methods.", vi: "Cổng nạp tiền với nhiều phương thức thanh toán đa dạng.", zh: "支持多种支付方式的充值入口。" },
  "hub.s4_transaction_desc": { en: "Stores detailed transaction history for periodic reconciliation.", vi: "Lưu trữ chi tiết lịch sử giao dịch, phục vụ công tác đối soát định kỳ.", zh: "保存详细的交易记录，便于定期对账。" },

  "hub.s5_title": { en: "5. Support & Complaints", vi: "5. Hỗ trợ & Xử lý Khiếu nại", zh: "5. 支持与投诉处理" },
  "hub.s5_p1": { en: "To keep operations running smoothly, the system provides two direct interaction channels:", vi: "Để đảm bảo luồng vận hành xuyên suốt, hệ thống cung cấp hai kênh tương tác trực tiếp:", zh: "为保障运营顺畅，系统提供两个直接互动渠道：" },
  "hub.s5_request_desc": { en: "Submit specific requests about products or order adjustments.", vi: "Gửi các yêu cầu đặc thù về sản phẩm hoặc điều chỉnh đơn hàng.", zh: "提交关于产品或订单调整的特定请求。" },
  "hub.s5_trouble_desc": { en: "Report incidents (wrong items, shipping errors) for the technical team to handle urgently.", vi: "Báo cáo các sự cố phát sinh (sai hàng, lỗi vận chuyển) để đội ngũ kỹ thuật xử lý khẩn cấp.", zh: "上报突发问题（发错货、运输错误），由技术团队紧急处理。" },

  "hub.s6_title": { en: "6. Account & Permissions", vi: "6. Thiết lập Tài khoản & Phân quyền", zh: "6. 账户设置与权限" },
  "hub.s6_p1": { en: "The system lets you personalize your experience and manage your team:", vi: "Hệ thống cho phép cá nhân hóa trải nghiệm và quản lý đội nhóm:", zh: "系统允许个性化体验并管理团队：" },
  "hub.s6_account_desc": { en: "Update security details and personal profile.", vi: "Cập nhật thông tin bảo mật và hồ sơ cá nhân.", zh: "更新安全信息与个人资料。" },
  "hub.s6_team_desc": { en: "Permission controls let you add multiple members to co-manage the account — ideal for professional team-based businesses.", vi: "Tính năng phân quyền cho phép thêm nhiều thành viên cùng quản lý tài khoản, phù hợp với mô hình kinh doanh theo đội nhóm chuyên nghiệp.", zh: "权限功能允许添加多名成员共同管理账户，适合专业的团队化经营模式。" },
};


interface I18nContextType {
  language: Language;
  effectiveLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tVi: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("vi");

  // Fetch translations from CMS API. Hardcoded `translations` object stays as
  // fallback for offline / initial load before CMS responds. When CMS data
  // arrives, it OVERRIDES the hardcoded values (single source of truth = CMS).
  const cmsQuery = useCmsTranslations(language);

  // Effective lookup map: hardcoded base + CMS overrides
  const effectiveMap = useMemo(() => {
    const base: Record<string, string> = {};
    for (const [key, byLocale] of Object.entries(translations)) {
      base[key] = byLocale[language] || byLocale.en || key;
    }
    if (cmsQuery.data?.translations) {
      Object.assign(base, cmsQuery.data.translations);
    }
    return base;
  }, [language, cmsQuery.data]);

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => effectiveMap[key] ?? key;
  const tVi = (key: string): string => effectiveMap[key] ?? key;

  const effectiveLanguage: Language = language;

  return (
    <I18nContext.Provider value={{ language, effectiveLanguage, setLanguage, t, tVi }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
};
