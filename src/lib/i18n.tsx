import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "vi" | "zh";

type Translations = Record<string, Record<Language, string>>;

const translations: Translations = {
  // Navbar
  "nav.services": { en: "Services", vi: "Dịch vụ", zh: "服务" },
  "nav.pricing": { en: "Pricing list", vi: "Bảng giá", zh: "价格" },
  "nav.intl_pricing": { en: "International Pricing", vi: "Bảng giá Quốc tế", zh: "国际运费" },
  "nav.intl_pricing_desc": { en: "Transparent rates for VN/CN → US/UK/EU shipping", vi: "Cước phí minh bạch cho tuyến VN/CN → US/UK/EU", zh: "越南/中国到美国/英国/欧盟的透明运费" },
  "nav.domestic_pricing": { en: "US Domestic Pricing", vi: "Giá nội địa Mỹ", zh: "国内运费" },
  "nav.domestic_pricing_desc": { en: "US domestic shipping rates by delivery zone", vi: "Biểu giá theo vùng giao hàng nội địa Mỹ", zh: "美国国内按区域运费" },
  "nav.policy": { en: "Policy", vi: "Chính sách", zh: "政策" },
  "nav.news": { en: "Blog", vi: "Blog", zh: "Blog" },
  "nav.faq": { en: "Q&A", vi: "Q&A", zh: "问答" },
  "nav.consult": { en: "Get Started", vi: "Tư vấn ngay", zh: "立即咨询" },
  "nav.thg_fulfill": { en: "THG Fulfill", vi: "THG Fulfill", zh: "THG Fulfill" },
  "nav.thg_express": { en: "THG Express", vi: "THG Express", zh: "THG Express" },
  "nav.thg_warehouse": { en: "THG Warehouse", vi: "THG Warehouse", zh: "THG Warehouse" },
  "nav.thg_order": { en: "THG Dropship", vi: "THG Dropship", zh: "THG代发" },
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
  "catalog_page.filter_mens": { en: "Men's Apparel", vi: "Thời trang Nam", zh: "男装" },
  "catalog_page.filter_womens": { en: "Women's Apparel", vi: "Thời trang Nữ", zh: "女装" },
  "catalog_page.filter_acc": { en: "Accessories", vi: "Phụ kiện", zh: "配件" },
  "catalog_page.lbl_sku": { en: "SKU:", vi: "Mã SKU:", zh: "SKU:" },
  "catalog_page.lbl_size": { en: "Sizes:", vi: "Kích cỡ:", zh: "尺寸:" },
  "catalog_page.lbl_cost": { en: "Base Cost from", vi: "Giá gốc từ", zh: "基础成本起" },

  "hero.badge": { en: "15% OFF for first 50 orders", vi: "Ưu đãi 15% cho 50 đơn hàng đầu tiên", zh: "前50单享85折优惠" },
  "hero.title1": { en: "Your Global", vi: "Giải pháp", zh: "您的全球" },
  "hero.title_highlight": { en: "Fulfillment", vi: "vận chuyển quốc tế", zh: "Fulfillment" },
  "hero.title2": { en: "Partner for", vi: "cho mọi", zh: "合作伙伴，为" },
  "hero.title3": { en: "eCommerce Sellers", vi: "nhà bán hàng", zh: "电商卖家" },
  "hero.subtitle": { en: "A comprehensive fulfillment ecosystem, seamlessly connecting from Vietnam – China – to warehouses in the US.", vi: "Nhanh, minh bạch, đáng tin cậy. Giao nhận liền mạch từ Việt Nam – Trung Quốc đi toàn cầu.", zh: "全面的履约生态系统，无缝连接越南-中国-美国仓库。" },
  "hero.cta": { en: "Get Started", vi: "Đăng ký ngay", zh: "立即注册" },
  "hero.learn_more": { en: "Learn More", vi: "Tìm hiểu thêm", zh: "了解更多" },
  "hero.feature1": { en: "Product sourcing", vi: "Tìm nguồn cung ứng sản phẩm", zh: "产品采购" },
  "hero.feature2": { en: "POD products", vi: "Sản phẩm POD", zh: "POD产品" },
  "hero.feature3": { en: "Warehouse management", vi: "Quản lý kho hàng", zh: "仓库管理" },
  "hero.feature4": { en: "International shipping US, UK, EU", vi: "Vận chuyển quốc tế Mỹ, Anh, EU", zh: "全球运输 US, UK, EU" },
  "hero.delivery_days": { en: "delivery days", vi: "ngày giao hàng", zh: "交货天数" },
  "hero.warehouses": { en: "warehouses in 3 countries", vi: "kho ở cả 3 quốc gia", zh: "3个国家的仓库" },
  "hero.us_fulfill": { en: "US domestic fulfill", vi: "Fulfill nội địa Mỹ", zh: "美国国内履约" },

  // Services (updated for 3 cards)
  "services.subtitle": { en: "Our Services", vi: "Dịch vụ của chúng tôi", zh: "我们的服务" },
  "services.title": { en: "Complete the", vi: "Hoàn thiện hệ sinh thái", zh: "一站式" },
  "services.title_highlight": { en: "A-Z", vi: "A-Z", zh: "Fulfill A-Z" },
  "services.title2": { en: "Ecosystem", vi: "", zh: "生态系统" },
  "services.tagline": { en: "Seamlessly connecting from Vietnam – China – to US warehouses", vi: "Kết nối liền mạch từ Việt Nam – Trung Quốc – đến tận kho Mỹ", zh: "从越南-中国无缝连接到美国仓库" },
  "services.learn_more": { en: "Learn more", vi: "Tìm hiểu thêm", zh: "了解更多" },
  "services.s1_title": { en: "THG Fulfill", vi: "THG Fulfill", zh: "THG Fulfill" },
  "services.s1_subtitle": { en: "Fulfill Ecosystem A-Z", vi: "Hệ sinh thái Fulfill A-Z", zh: "Fulfill生态系统A-Z" },
  "services.s1_desc": { en: "POD printing in Vietnam, China and USA with competitive base pricing. Trending product dropship support.", vi: "In ấn POD tại Việt Nam, Trung Quốc và Mỹ với chi phí gốc cạnh tranh. Hỗ trợ dropship các sản phẩm trending.", zh: "在越南、中国和美国进行POD印刷，基础价格具有竞争力。支持趋势产品代发。" },
  "services.s1_badge": { en: "T-shirt → Print → Ship", vi: "Áo phôi → In ấn → Thành phẩm", zh: "T恤 → 印刷 → 成品" },
  "services.s1_b1": { en: "Trending product dropship support", vi: "Hỗ trợ dropship các sản phẩm trending.", zh: "支持趋势产品代发" },
  "services.s1_b2": { en: "Dropship trending products from China", vi: "Dropship hàng trending từ Trung Quốc", zh: "从中国代发热门产品" },
  "services.s1_b3": { en: "Competitive base pricing", vi: "Chi phí gốc cạnh tranh", zh: "有竞争力的基础价格" },
  "services.s2_title": { en: "THG Express", vi: "THG Express", zh: "THG Express" },
  "services.s2_subtitle": { en: "International Shipping", vi: "Vận chuyển quốc tế", zh: "国际运输" },
  "services.s2_desc": { en: "Dedicated air freight from Vietnam & China to US/UK. Transparent pricing, real-time order tracking.", vi: "Vận chuyển hàng không chuyên tuyến từ Việt Nam & Trung Quốc đến Mỹ/Anh. Giá minh bạch, theo dõi đơn hàng theo thời gian thực.", zh: "越南和中国到美国/英国的专线空运。透明报价，实时追踪。" },
  "services.s2_badge": { en: "5-8 days • Dedicated lines", vi: "5-8 ngày • Tuyến bay riêng", zh: "5-8天 • 专线" },
  "services.s2_b1": { en: "Dedicated routes VN/CN → US/UK", vi: "Tuyến chuyên biệt VN/CN → Mỹ/Anh", zh: "专线 VN/CN → US/UK" },
  "services.s2_b2": { en: "Real-time order tracking", vi: "Theo dõi đơn hàng thời gian thực", zh: "实时追踪" },
  "services.s2_b3": { en: "Delivery in 5-8 days", vi: "Giao hàng trong 5-8 ngày", zh: "5-8天交货" },
  "services.s3_title": { en: "THG Warehouse", vi: "THG Warehouse", zh: "THG Warehouse" },
  "services.s3_subtitle": { en: "US Warehousing", vi: "Lưu kho tại Mỹ", zh: "美国仓储" },
  "services.s3_desc": { en: "US domestic fulfillment from $1.2. Free inbound & 90-day storage. OMS/WMS inventory management.", vi: "Fulfill nội địa Mỹ từ 1.2$. Nhận hàng miễn phí & lưu kho 90 ngày. Quản lý tồn kho OMS/WMS.", zh: "美国国内履约低至1.2美元。免费入库，90天免费仓储。OMS/WMS库存管理。" },
  "services.s3_badge": { en: "US Warehouse • From $1.2", vi: "Kho US • Fulfill từ $1.2", zh: "美国仓库 • 低至$1.2" },
  "services.s3_b1": { en: "Fulfill from $1.2", vi: "Fulfill từ 1.2$", zh: "低至$1.2/单" },
  "services.s3_b2": { en: "Free 90-day storage", vi: "Lưu kho miễn phí 90 ngày", zh: "90天免费仓储" },
  "services.s3_b3": { en: "US domestic delivery 2–5 days", vi: "Giao nội địa 2–5 ngày", zh: "国内2-5天" },

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
  "contact.desc": { en: "Leave your information, the THG team will contact you within 24 hours.", vi: "Để lại thông tin, đội ngũ THG sẽ liên hệ tư vấn trong vòng 24 giờ.", zh: "留下信息，THG团队将在24小时内联系您。" },
  "contact.name": { en: "Full name", vi: "Họ và tên", zh: "姓名" },
  "contact.phone": { en: "Phone number", vi: "Số điện thoại", zh: "电话号码" },
  "contact.email": { en: "Email", vi: "Email", zh: "电子邮件" },
  "contact.shop": { en: "Shop / Brand name", vi: "Tên shop / Brand", zh: "店铺/品牌名" },
  "contact.message": { en: "How can we help you?", vi: "Nội dung cần tư vấn...", zh: "请描述您的需求..." },
  "contact.submit": { en: "Submit Inquiry", vi: "Đăng ký tư vấn miễn phí", zh: "提交咨询" },
  "contact.offices_title": { en: "Offices & Warehouses", vi: "Văn phòng & Kho hàng", zh: "办公室和仓库" },
  "contact.vn_office": { en: "VN OFFICE", vi: "VP VIỆT NAM", zh: "越南办公室" },
  "contact.us_warehouse": { en: "US WAREHOUSE (PENNSYLVANIA)", vi: "KHO US (PENNSYLVANIA)", zh: "美国仓库 (宾夕法尼亚)" },
  "contact.cn_warehouse": { en: "CN WAREHOUSE", vi: "KHO CHINA", zh: "中国仓库" },
  "contact.cta_title": { en: "Ready to scale?", vi: "Sẵn sàng scale?", zh: "准备扩展？" },
  "contact.cta_desc": { en: "15% OFF for first 50 orders. Support team will contact you within 24h.", vi: "Ưu đãi 15% cho 50 đơn hàng đầu tiên. Đội ngũ support sẽ liên hệ bạn trong 24h.", zh: "前50单享85折。支持团队将在24小时内联系您。" },

  // Footer
  "footer.tagline": { en: "Global Fulfillment Partner for eCommerce Sellers.", vi: "Đối tác Fulfillment toàn cầu cho eCommerce Seller.", zh: "电商卖家的全球履约合作伙伴。" },
  "footer.services": { en: "Services", vi: "Dịch vụ", zh: "服务" },
  "footer.support": { en: "Support & Policy", vi: "Hỗ trợ & Chính sách", zh: "支持与政策" },
  "footer.contact": { en: "Contact", vi: "Liên hệ", zh: "联系方式" },
  "footer.faq_link": { en: "FAQ", vi: "Câu hỏi thường gặp", zh: "常见问题" },
  "footer.privacy": { en: "Privacy Policy", vi: "Chính sách bảo mật", zh: "隐私政策" },
  "footer.terms": { en: "Terms of Service", vi: "Điều khoản sử dụng", zh: "服务条款" },
  "footer.blog": { en: "Blog", vi: "Tin tức", zh: "博客" },
  "footer.social": { en: "Follow Us", vi: "Theo dõi", zh: "关注我们" },

  // Policy page
  "policy.title": { en: "Policies & Terms", vi: "Chính sách & Điều khoản", zh: "政策与条款" },
  "policy.warehouse": { en: "Warehouse Policy", vi: "Chính sách Warehouse", zh: "仓储政策" },
  "policy.pod": { en: "POD/Dropship Policy", vi: "Chính sách POD/Dropship", zh: "POD/代发政策" },
  "policy.shipping": { en: "Shipping Policy", vi: "Chính sách Vận chuyển", zh: "运输政策" },
  "policy.compensation": { en: "Compensation Policy", vi: "Chính sách đền bù hàng lô", zh: "批量货物赔偿政策" },
  "policy.tiktok": { en: "POD - TikTok Shipping", vi: "POD - TikTok Shipping", zh: "POD - TikTok运输" },

  // Shipping Policy page
  "spolicy.title": { en: "Shipping Policy", vi: "Chính Sách Vận Chuyển", zh: "运输政策" },
  "spolicy.subtitle": { en: "Organized by shipping route — select a route below to view its terms", vi: "Phân loại theo tuyến vận chuyển — chọn tuyến bên dưới để xem điều khoản", zh: "按运输路线分类 — 选择下方路线查看条款" },
  "spolicy.r0": { en: "VN → WW · Regular", vi: "VN → WW · Hàng Thường", zh: "越南→全球·普通" },
  "spolicy.r1": { en: "VN → WW · Cosmetics", vi: "VN → WW · Mỹ Phẩm", zh: "越南→全球·化妆品" },
  "spolicy.r2": { en: "CN → WW · Cosmetics", vi: "CN → WW · Mỹ Phẩm", zh: "中国→全球·化妆品" },
  "spolicy.r3": { en: "CN → WW · Batteries", vi: "CN → WW · Pin Điện", zh: "中国→全球·电池" },
  "spolicy.r4": { en: "VN → US · Priority", vi: "VN → US · Priority", zh: "越南→美国·Priority" },
  "spolicy.r5": { en: "CN → US/EU · Priority", vi: "CN → US/EU · Priority", zh: "中国→美欧·Priority" },
  "spolicy.sec_vat": { en: "VAT / IOSS", vi: "VAT / IOSS", zh: "增值税 / IOSS" },
  "spolicy.sec_weight": { en: "Chargeable Weight", vi: "Trọng Lượng Tính Cước", zh: "计费重量" },
  "spolicy.sec_countries": { en: "Countries & Restrictions", vi: "Quốc Gia & Hạn Chế", zh: "国家与限制" },
  "spolicy.sec_value": { en: "Declared Value", vi: "Giá Trị Khai Báo", zh: "申报价值" },
  "spolicy.sec_cargo": { en: "Shipping Requirements", vi: "Yêu Cầu Hàng Hóa", zh: "货物要求" },
  "spolicy.sec_size": { en: "Weight & Size Limits", vi: "Giới Hạn Cân Nặng & Kích Thước", zh: "重量与尺寸限制" },
  "spolicy.sec_address": { en: "Delivery Address", vi: "Địa Chỉ Giao Hàng", zh: "配送地址" },
  "spolicy.sec_returns": { en: "Returns & Redelivery", vi: "Trả Hàng & Giao Lại", zh: "退货与重新投递" },
  "spolicy.sec_comp": { en: "Compensation Standards", vi: "Tiêu Chuẩn Bồi Thường", zh: "赔偿标准" },
  "spolicy.sec_other": { en: "Other Requirements", vi: "Yêu Cầu Khác", zh: "其他要求" },
  "spolicy.view_full": { en: "View full shipping policy", vi: "Xem đầy đủ chính sách vận chuyển", zh: "查看完整运输政策" },

  // Blog page
  "blog.title": { en: "News & Insights", vi: "Tin tức & Kiến thức", zh: "新闻与见解" },
  "blog.subtitle": { en: "Stay updated with the latest from THG", vi: "Cập nhật tin tức mới nhất từ THG", zh: "关注THG的最新动态" },
  "news.read_more": { en: "Read more", vi: "Đọc thêm", zh: "阅读更多" },

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
  "fulfill_page.sol_b1": { en: "Low POD/Dropship basecost → Optimized margins", vi: "Basecost POD/Dropship thấp → Tối ưu lợi nhuận", zh: "低POD/代发basecost → 优化利润" },
  "fulfill_page.sol_b2": { en: "Multi-route international shipping VN/CN → US", vi: "Vận chuyển quốc tế đa tuyến VN/CN → US", zh: "多路线国际运输 VN/CN → US" },
  "fulfill_page.sol_b3": { en: "Clear tracking, transparent costs, no hidden fees", vi: "Tracking rõ ràng, chi phí minh bạch, không phí ẩn", zh: "清晰追踪，透明成本，无隐藏费用" },
  "fulfill_page.sol_b4": { en: "Multi-country production & fulfill ecosystem", vi: "Hệ sinh thái sản xuất & fulfill đa quốc gia", zh: "多国生产和履约生态系统" },
  "fulfill_page.sol_b5": { en: "24/7 dedicated support team", vi: "Đội ngũ hỗ trợ chuyên trách 24/7", zh: "24/7专属支持团队" },
  "fulfill_page.adv1_title": { en: "Complete POD & Dropship Ecosystem", vi: "Hệ sinh thái POD & Dropship trọn gói", zh: "完整的POD和代发生态系统" },
  "fulfill_page.adv1_desc": { en: "POD production in Vietnam, China and USA to optimize delivery time and costs.", vi: "Sản xuất POD tại Việt Nam, Trung Quốc và Mỹ giúp tối ưu thời gian và chi phí.", zh: "在越南、中国和美国进行POD生产，优化交货时间和成本。" },
  "fulfill_page.adv2_title": { en: "Fast Fulfill & Multi-route Shipping", vi: "Fulfill nhanh & Vận chuyển đa tuyến", zh: "快速履约和多路线运输" },
  "fulfill_page.adv2_desc": { en: "VN/CN → US shipping with tracking, US domestic 2-5 days.", vi: "Ship VN/CN → US với tracking, nội địa US 2-5 ngày.", zh: "VN/CN → US运输带追踪，美国国内2-5天。" },
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
  "fulfill_page.cta_title": { en: "Ready to Optimize Your Fulfillment?", vi: "Sẵn sàng tối ưu Fulfillment?", zh: "准备好优化您的履约了吗？" },
  "fulfill_page.cta_desc": { en: "Contact THG team today for a free consultation on the best solution for your business.", vi: "Liên hệ đội ngũ THG ngay hôm nay để được tư vấn miễn phí giải pháp tối ưu.", zh: "今天就联系THG团队，获取免费咨询最适合您业务的解决方案。" },
  "fulfill_page.pod_process": { en: "POD Process", vi: "Quy trình POD", zh: "POD流程" },
  "fulfill_page.blank_tshirt": { en: "Blank T-Shirt", vi: "Áo phôi", zh: "空白T恤" },
  "fulfill_page.dtg_print": { en: "DTG / DTF Print", vi: "In DTG / DTF", zh: "DTG / DTF 打印" },
  "fulfill_page.your_brand": { en: "YOUR BRAND", vi: "BRAND CỦA BẠN", zh: "您的品牌" },
  "fulfill_page.branded_product": { en: "Branded Product", vi: "Thành phẩm", zh: "品牌产品" },
  "fulfill_page.pod_dropship_badge": { en: "POD & Dropship", vi: "POD & Dropship", zh: "POD & 代发" },

  // THG Express Page
  "express_page.badge": { en: "International Shipping", vi: "Vận chuyển quốc tế", zh: "国际运输" },
  "express_page.hero_subtitle": { en: "International shipping solutions for every seller. Fast, transparent, reliable.", vi: "Giải pháp vận chuyển quốc tế cho mọi nhà bán hàng. Nhanh, minh bạch, đáng tin cậy.", zh: "为每位卖家提供国际运输解决方案。快速、透明、可靠。" },
  "express_page.hero_tagline": { en: "Fast Shipping • Transparent Pricing", vi: "Vận chuyển nhanh • Giá minh bạch", zh: "快速运输 • 透明定价" },
  "express_page.track_title": { en: "Track Your Order", vi: "Theo dõi đơn hàng", zh: "追踪您的订单" },
  "express_page.track_desc": { en: "Enter tracking code to check your shipment status.", vi: "Nhập mã tracking để kiểm tra tình trạng đơn hàng.", zh: "输入追踪码查看货物状态。" },
  "express_page.track_placeholder": { en: "Enter tracking code", vi: "Nhập mã tracking", zh: "输入追踪码" },
  "express_page.track_btn": { en: "Track", vi: "Kiểm tra", zh: "追踪" },
  "express_page.features_title": { en: "Why Choose THG Express?", vi: "Tại sao chọn THG Express?", zh: "为什么选择THG Express？" },
  "express_page.feat1_title": { en: "Diverse Shipping Routes", vi: "Đa dạng tuyến vận chuyển", zh: "多样化运输线路" },
  "express_page.feat1_desc": { en: "Sea 20-25 days, Air 3-5 days, Express 6-10 days.", vi: "Sea 20-25 ngày, Air 3-5 ngày, Express 6-10 ngày.", zh: "海运20-25天，空运3-5天，快递6-10天。" },
  "express_page.feat2_title": { en: "Transparent Cost", vi: "Chi phí minh bạch", zh: "透明成本" },
  "express_page.feat2_desc": { en: "No hidden fees, clear pricing for all services.", vi: "Không phí ẩn, bảng giá rõ ràng cho tất cả dịch vụ.", zh: "无隐藏费用，所有服务定价清晰。" },
  "express_page.feat3_title": { en: "Lightning Speed", vi: "Tốc độ cực nhanh", zh: "极速" },
  "express_page.feat3_desc": { en: "Delivery from just 3-5 business days.", vi: "Giao hàng chỉ từ 3-5 ngày làm việc.", zh: "最快3-5个工作日送达。" },
  "express_page.feat4_title": { en: "Trusted Partners", vi: "Đối tác uy tín", zh: "值得信赖的合作伙伴" },
  "express_page.feat4_desc": { en: "Partners with UPS, FedEx, DHL and more.", vi: "Hợp tác với UPS, FedEx, DHL và nhiều đơn vị khác.", zh: "与UPS、FedEx、DHL等合作。" },
  "express_page.lines_title": { en: "Shipping Lines Overview", vi: "Tổng hợp các line vận chuyển", zh: "运输线路概览" },
  "express_page.lines_desc": { en: "Diverse shipping lines optimized for each business model.", vi: "Đa dạng line vận chuyển tối ưu cho từng mô hình kinh doanh.", zh: "多样化运输线路，针对每种商业模式优化。" },
  "express_page.route1": { en: "Vietnam → USA", vi: "Việt Nam → Mỹ", zh: "越南 → 美国" },
  "express_page.route1_types": { en: "Bulk cargo • Epacket", vi: "Hàng lô • Epacket", zh: "批量货物 • Epacket" },
  "express_page.route2": { en: "China → USA", vi: "Trung Quốc → Mỹ", zh: "中国 → 美国" },
  "express_page.route2_types": { en: "Bulk • Epacket • TikTok US/UK/DE", vi: "Hàng lô • Epacket • TikTok US/UK/DE", zh: "批量 • Epacket • TikTok US/UK/DE" },
  "express_page.route3": { en: "VN/CN → Worldwide", vi: "VN/CN → Worldwide", zh: "VN/CN → 全球" },
  "express_page.route3_types": { en: "Bulk cargo • Epacket", vi: "Hàng lô • Epacket", zh: "批量货物 • Epacket" },
  "express_page.route4": { en: "TikTok Shop Lines", vi: "Line TikTok Shop", zh: "TikTok Shop专线" },
  "express_page.route4_types": { en: "TikTok US • TikTok UK • TikTok DE", vi: "TikTok US • TikTok UK • TikTok DE", zh: "TikTok美国 • TikTok英国 • TikTok德国" },
  "express_page.process_title": { en: "Shipping Process", vi: "Quy trình vận hành đơn hàng", zh: "运输流程" },
  "express_page.step1_title": { en: "Receive Order & Process", vi: "Nhận đơn & xử lý dữ liệu", zh: "接单和处理数据" },
  "express_page.step1_desc": { en: "Seller submits info via form or Excel. OMS generates tracking and assigns shipping line.", vi: "Seller gửi thông tin qua form/Excel. OMS tạo mã vận đơn và phân loại line ship.", zh: "卖家通过表单或Excel提交信息。OMS生成追踪码并分配运输线路。" },
  "express_page.step2_title": { en: "Consolidate & Export", vi: "Gom hàng & xuất kho", zh: "集货和出库" },
  "express_page.step2_desc": { en: "Goods consolidated at VN/CN warehouse, packed to international standards.", vi: "Hàng được gom tại kho VN/CN, đóng gói theo tiêu chuẩn quốc tế.", zh: "货物在越南/中国仓库集中，按国际标准包装。" },
  "express_page.step3_title": { en: "International Transit & Tracking", vi: "Vận chuyển quốc tế & tracking", zh: "国际运输和追踪" },
  "express_page.step3_desc": { en: "Shipped via direct flights or sea containers with real-time tracking.", vi: "Vận chuyển theo line bay thẳng hoặc container biển, tracking real-time.", zh: "通过直飞航班或海运集装箱运输，实时追踪。" },
  "express_page.step4_title": { en: "Warehouse & Last Mile", vi: "Nhập kho & giao last-mile", zh: "入库和最后一公里" },
  "express_page.step4_desc": { en: "Customs clearance, transferred to local carriers (USPS, FedEx).", vi: "Thông quan, chuyển sang đối tác giao nội địa (USPS, FedEx).", zh: "清关后转交当地承运商（USPS, FedEx）。" },
  "express_page.cta_title": { en: "Ready to Ship Globally?", vi: "Sẵn sàng vận chuyển toàn cầu?", zh: "准备好全球发货了吗？" },
  "express_page.cta_desc": { en: "Get competitive shipping rates and reliable delivery with THG Express.", vi: "Nhận giá ship cạnh tranh và giao hàng uy tín với THG Express.", zh: "通过THG Express获取有竞争力的运费和可靠交付。" },

  // THG Warehouse Page
  "warehouse_page.badge": { en: "US Fulfillment", vi: "Fulfillment tại Mỹ", zh: "美国履约" },
  "warehouse_page.hero_tagline": { en: "PREMIUM WAREHOUSE – FAST DELIVERY", vi: "KHO XỊN - GIAO NHANH", zh: "优质仓库 – 快速配送" },
  "warehouse_page.hero_tagline2": { en: "OPTIMIZED OPERATIONS", vi: "TỐI ƯU VẬN HÀNH", zh: "优化运营" },
  "warehouse_page.solution_title": { en: "THG Warehouse – US Warehousing for Vietnamese Sellers", vi: "THG Warehouse – Kho bãi tại Mỹ cho seller Việt", zh: "THG Warehouse – 面向越南卖家的美国仓储" },
  "warehouse_page.solution_desc": { en: "THG Warehouse provides warehousing and fulfillment in the US with optimized costs, fast processing, 24/7 support.", vi: "THG Warehouse cung cấp dịch vụ lưu kho và fulfillment tại Mỹ với chi phí tối ưu, xử lý đơn nhanh, hỗ trợ 24/7.", zh: "THG Warehouse在美国提供仓储和履约服务，成本优化，快速处理，24/7支持。" },
  "warehouse_page.sol_b1": { en: "US domestic fulfillment from $1.2/order", vi: "Fulfill nội địa US chỉ từ 1.2$/đơn", zh: "美国国内履约低至1.2美元/单" },
  "warehouse_page.sol_b2": { en: "Free inbound & 90-day storage", vi: "Miễn phí nhập kho & lưu kho 90 ngày", zh: "免费入库和90天仓储" },
  "warehouse_page.sol_b3": { en: "2-5 days delivery across US", vi: "Giao hàng 2-5 ngày toàn US", zh: "全美2-5天配送" },
  "warehouse_page.sol_b4": { en: "OMS/WMS real-time inventory management", vi: "Hệ thống OMS/WMS quản lý tồn kho real-time", zh: "OMS/WMS实时库存管理" },
  "warehouse_page.sol_b5": { en: "Packing video for every order", vi: "Quay video đóng gói từng đơn", zh: "每单包装视频" },
  "warehouse_page.sol_b6": { en: "Amazon FBA/FBM preparation support", vi: "Hỗ trợ chuẩn bị & fulfill đơn Amazon FBA/FBM", zh: "支持Amazon FBA/FBM准备和履约" },
  "warehouse_page.strengths_title": { en: "THG Warehouse US – The Optimal Logistics Solution for Your Business", vi: "THG Warehouse US – Giải pháp kho vận tối ưu cho doanh nghiệp của bạn", zh: "THG Warehouse美国 – 为您的企业提供最优物流解决方案" },
  "warehouse_page.str1_title": { en: "Optimized Fulfillment Cost – From $1.2/order", vi: "Chi phí fulfillment tối ưu – Chỉ từ 1.2$/đơn", zh: "优化履约成本 – 低至$1.2/单" },
  "warehouse_page.str1_desc": { en: "Competitive, transparent pricing with no hidden fees – Easy margin control even in peak seasons.", vi: "Giá cạnh tranh, minh bạch, không phí ẩn – Kiểm soát lợi nhuận dễ dàng ngay cả trong mùa cao điểm.", zh: "有竞争力的透明定价，无隐藏费用 – 即使旺季也能轻松控制利润。" },
  "warehouse_page.str2_title": { en: "Dual Warehouses in Pennsylvania & North Carolina – Optimizing Delivery Speed", vi: "Kho hàng song song tại Pennsylvania & North Carolina – Tối ưu tốc độ giao hàng", zh: "宾州和北卡双仓库 – 优化配送速度" },
  "warehouse_page.str2_desc": { en: "THG Warehouse strategically positions warehouses in Pennsylvania & North Carolina – two key hubs spanning the US, optimizing delivery time to 2–5 days, reducing last-mile costs and giving Vietnamese sellers a superior competitive edge.", vi: "THG Warehouse chiến lược bố trí kho tại Pennsylvania & North Carolina – hai điểm then chốt trải dài nước Mỹ, giúp tối ưu thời gian giao hàng 2–5 ngày, giảm chi phí last-mile và mang lại lợi thế cạnh tranh vượt trội cho seller Việt.", zh: "THG Warehouse战略性地将仓库布局在宾州和北卡——横跨全美的两个关键枢纽，将配送时间优化至2-5天，降低最后一公里成本。" },
  "warehouse_page.str3_title": { en: "90-Day Free Storage", vi: "Miễn phí lưu kho 90 ngày", zh: "90天免费仓储" },
  "warehouse_page.str3_desc": { en: "Free inbound and 90-day storage to help sellers test the US market risk-free.", vi: "Miễn phí nhập kho và lưu kho 90 ngày giúp seller test thị trường không rủi ro.", zh: "免费入库和90天仓储，帮助卖家零风险试水美国市场。" },
  "warehouse_page.str4_title": { en: "OMS System – A-Z Management", vi: "Hệ thống OMS – Quản lý A-Z", zh: "OMS系统 – 全流程管理" },
  "warehouse_page.str4_desc": { en: "Auto order sync, tracking assignment, real-time status updates – all automated.", vi: "Sync đơn tự động, gán tracking, cập nhật trạng thái real-time – tự động hóa.", zh: "自动同步订单，分配追踪码，实时状态更新——全自动化。" },
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
  "warehouse_page.locations_title": { en: "THG Warehouse Locations in the US", vi: "Thông tin kho THG ở US", zh: "THG美国仓库信息" },

  // THG Order Page
  "order_page.hero_title1": { en: "Buy from China –", vi: "Mua hàng Trung Quốc –", zh: "从中国购买 –" },
  "order_page.hero_highlight": { en: "delivered to your door in USA", vi: "giao tận cửa tại Mỹ", zh: "送到美国家门口" },
  "order_page.hero_desc": { en: "THG Fulfill helps Vietnamese living in the US buy from Taobao & 1688 safely and professionally.", vi: "THG Fulfill giúp người Việt sống tại Mỹ mua hàng từ Taobao, 1688 an toàn - chuyên nghiệp.", zh: "THG Fulfill帮助居住在美国的越南人安全专业地从淘宝和1688购物。" },
  "order_page.hero_cta": { en: "Get Free Consultation", vi: "Tư vấn miễn phí", zh: "免费咨询" },
  "order_page.hero_cta2": { en: "See How It Works", vi: "Xem cách hoạt động", zh: "查看运作方式" },
  "order_page.stat1": { en: "Successful orders", vi: "Đơn thành công", zh: "成功订单" },
  "order_page.stat2": { en: "On-time delivery", vi: "Giao đúng hẹn", zh: "准时交付" },
  "order_page.stat3": { en: "Lost packages", vi: "Mất kiện hàng", zh: "丢失包裹" },
  "order_page.stat4": { en: "Customer rating", vi: "Đánh giá", zh: "客户评分" },
  "order_page.stat5": { en: "Warehouses: VN · CN · USA", vi: "Kho: VN · CN · USA", zh: "仓库：越南·中国·美国" },
  "order_page.pain_title": { en: "Struggles of buying from China while in the USA", vi: "Khó khăn khi mua hàng Trung Quốc tại Mỹ", zh: "在美国购买中国商品的困难" },
  "order_page.pain_subtitle": { en: "Products are 2-5× cheaper than Amazon – but getting them is a nightmare.", vi: "Hàng rẻ hơn Amazon 2-5 lần – nhưng mua được là cả vấn đề.", zh: "产品比亚马逊便宜2-5倍——但买到手却是噩梦。" },
  "order_page.pain1_title": { en: "Can't find a trustworthy agent", vi: "Không tìm được agent uy tín", zh: "找不到可靠的代购" },
  "order_page.pain1_desc": { en: "Hundreds of services with no way to verify. One wrong choice and your money is gone.", vi: "Hàng trăm dịch vụ không cách nào xác minh. Chọn sai mất tiền.", zh: "数百种服务无法验证。选错一个钱就没了。" },
  "order_page.pain2_title": { en: "Language barrier", vi: "Rào cản ngôn ngữ", zh: "语言障碍" },
  "order_page.pain2_desc": { en: "Can't negotiate, request specs, or handle complaints in Mandarin.", vi: "Không thể đàm phán giá, yêu cầu spec hoặc khiếu nại bằng tiếng Trung.", zh: "无法用中文协商价格、要求规格或处理投诉。" },
  "order_page.pain3_title": { en: "Fear of scams & fakes", vi: "Lo lừa đảo & hàng giả", zh: "担心欺诈和假货" },
  "order_page.pain3_desc": { en: "Photos show one thing, reality another. Hundreds of dollars lost.", vi: "Ảnh một kiểu, thực tế một kiểu. Mất hàng trăm đô.", zh: "图片一个样，实物另一个样。损失数百美元。" },
  "order_page.pain4_title": { en: "Wrong item, no return", vi: "Hàng sai, không đổi trả được", zh: "商品不对，无法退货" },
  "order_page.pain4_desc": { en: "Wrong or defective goods arrive. Returning is impossible due to distance.", vi: "Hàng sai hoặc lỗi. Không thể đổi trả vì khoảng cách.", zh: "收到错误或有缺陷的商品。由于距离无法退货。" },
  "order_page.pain5_title": { en: "Must route through Vietnam", vi: "Phải chuyển qua Việt Nam", zh: "必须经过越南中转" },
  "order_page.pain5_desc": { en: "Extra 3-4 weeks and $150-300 in unnecessary shipping costs.", vi: "Thêm 3-4 tuần và $150-300 phí ship không cần thiết.", zh: "额外3-4周和150-300美元的不必要运费。" },
  "order_page.pain6_title": { en: "Zero updates, weeks of silence", vi: "Không cập nhật, mất liên lạc", zh: "零更新，数周杳无音讯" },
  "order_page.pain6_desc": { en: "Order placed, money sent, then weeks of radio silence.", vi: "Đặt hàng, chuyển tiền, rồi mất liên lạc hàng tuần.", zh: "下单、付款，然后数周没有消息。" },
  "order_page.process_title": { en: "How THG Dropship Works", vi: "Cách THG Dropship hoạt động", zh: "THG代发运作方式" },
  "order_page.step1_title": { en: "Send Product Links", vi: "Gửi link sản phẩm", zh: "发送产品链接" },
  "order_page.step1_desc": { en: "THG team negotiates directly with China suppliers. We handle the pricing discussion and provide a final quote for your confirmation before ordering.", vi: "Đội ngũ THG đàm phán trực tiếp với nhà cung cấp China: Bạn không cần làm gì, chúng tôi sẽ thương lượng giá và báo giá final cho bạn để bạn xác nhận và đi đơn.", zh: "THG团队直接与中国供应商谈判。我们负责价格讨论，并在下单前提供最终报价供您确认。" },
  "order_page.step2_title": { en: "Payment & Order", vi: "Thanh toán & đặt hàng", zh: "付款和下单" },
  "order_page.step2_desc": { en: "Confirm quote, pay and we order directly from the supplier.", vi: "Xác nhận báo giá, thanh toán và chúng tôi đặt hàng trực tiếp.", zh: "确认报价，付款，我们直接从供应商处下单。" },
  "order_page.step3_title": { en: "QC & Ship to US", vi: "QC & ship về Mỹ", zh: "质检和发往美国" },
  "order_page.step3_desc": { en: "Products inspected at our China warehouse, then shipped direct to US.", vi: "Kiểm tra tại kho Trung Quốc, sau đó ship thẳng về Mỹ.", zh: "在我们的中国仓库检查产品，然后直接发往美国。" },
  "order_page.step4_title": { en: "Delivered to Your Door", vi: "Giao tận cửa", zh: "送货上门" },
  "order_page.step4_desc": { en: "Know where your goods are with real-time tracking updated continuously within THG's fulfillment system.", vi: "Biết hàng đang ở đâu - Tracking cập nhật real-time liên tục trong hệ thống fulfill đơn hàng của THG.", zh: "实时追踪您的货物位置。追踪信息在THG履约系统中持续更新。" },
  "order_page.cta_title": { en: "Ready to Order from China?", vi: "Sẵn sàng đặt hàng từ Trung Quốc?", zh: "准备好从中国订购了吗？" },
  "order_page.cta_desc": { en: "Get a free quote and consultation from our team today.", vi: "Nhận báo giá miễn phí và tư vấn từ đội ngũ THG.", zh: "今天就获取免费报价和我们团队的咨询。" },
  "order_page.btn_catalog": { en: "View Product Catalog", vi: "Xem Catalog Sản Phẩm", zh: "查看产品目录" },
  "order_page.feedback_title": { en: "Authentic feedback from customers using THG services", vi: "Feedback thật đến từ khách hàng đã và đang sử dụng dịch vụ của THG", zh: "来自使用THG服务的客户的真实反馈" },

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
  "about.video_placeholder": { en: "Replace with your YouTube video ID", vi: "Thay bằng YouTube video ID của bạn", zh: "替换为您的YouTube视频ID" },
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
  "express_page.hero_title1": { en: "International shipping", vi: "Vận chuyển quốc tế", zh: "国际运输" },
  "express_page.hero_title_highlight": { en: "Speed & Transparency", vi: "Tốc độ & Minh bạch", zh: "速度与透明" },
  "express_page.features_eyebrow": { en: "Why Choose THG Express?", vi: "Tại sao chọn THG Express?", zh: "为什么选择THG Express？" },
  "express_page.process_eyebrow": { en: "THG Operations", vi: "THG Vận Hành", zh: "THG运营" },
  "express_page.routes_eyebrow": { en: "Shipping Services", vi: "Dịch Vụ Vận Chuyển", zh: "运输服务" },
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
  "express_page.faq11_q": { en: "How do I get started with THG Express?", vi: "Làm thế nào để bắt đầu sử dụng THG Express?", zh: "如何开始使用THG Express？" },
  "express_page.faq11_a": { en: "Contact our team via the form on this page. We will advise on the most suitable shipping solution and provide a competitive quote within 24 hours.", vi: "Liên hệ đội ngũ THG qua form trên trang này. Chúng tôi sẽ tư vấn giải pháp vận chuyển phù hợp nhất và báo giá cạnh tranh trong vòng 24 giờ.", zh: "通过本页表格联系我们的团队。我们将在24小时内提供最适合的运输方案建议和竞争性报价。" },

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
  "warehouse_page.ops_title": { en: "Centralized Inspection, Export & Import – Fully Standardized", vi: "Kiểm tra, xuất & nhập tập trung, chuẩn hóa toàn diện", zh: "集中检验、出入库 – 全面标准化" },
  "warehouse_page.vid1_title": { en: "Donghuang Scanning", vi: "Quét Mã Donghuang", zh: "东皇扫码" },
  "warehouse_page.vid1_desc": { en: "Auto scanning – Precise processing, real-time import/export data updates.", vi: "Quét mã tự động – Xử lý chính xác, cập nhật dữ liệu nhập/xuất theo thời gian thực.", zh: "自动扫码 – 精准处理，实时更新进出库数据。" },
  "warehouse_page.vid2_title": { en: "Huang Huan Inspection", vi: "Kiểm Xuất Huang Huan", zh: "黄焕检出" },
  "warehouse_page.vid2_desc": { en: "Standardized inspection process – Fast sorting & routing, optimizing throughput.", vi: "Quy trình kiểm tra chuẩn hóa – Phân loại & định tuyến nhanh chóng, tối ưu năng suất.", zh: "标准化检验流程 – 快速分拣和路由，优化产能。" },
  "warehouse_page.vid3_title": { en: "Fulfillment Wrapping", vi: "Bọc Lót Fulfillment", zh: "履约包装" },
  "warehouse_page.vid3_desc": { en: "Maximum cargo protection – Professional packaging with international-standard impact-resistant materials.", vi: "Hàng hóa được bảo vệ tối đa – Bao bì chuyên nghiệp với lớp chống va đập tiêu chuẩn quốc tế.", zh: "货物最大保护 – 符合国际标准的专业抗冲击包装材料。" },
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
  "pricing.opt_us": { en: "🇺🇸 United States (US)", vi: "🇺🇸 Mỹ (US)", zh: "🇺🇸 美国 (US)" },
  "pricing.opt_uk": { en: "🇬🇧 United Kingdom (UK)", vi: "🇬🇧 Anh (UK)", zh: "🇬🇧 英国 (UK)" },
  "pricing.opt_de": { en: "🇩🇪 Germany (DE)", vi: "🇩🇪 Đức (DE)", zh: "🇩🇪 德国 (DE)" },
  "pricing.opt_fr": { en: "🇫🇷 France (FR)", vi: "🇫🇷 Pháp (FR)", zh: "🇫🇷 法国 (FR)" },
  "pricing.opt_au": { en: "🇦🇺 Australia (AU)", vi: "🇦🇺 Úc (AU)", zh: "🇦🇺 澳大利亚 (AU)" },
  "pricing.cargo_std": { en: "Standard", vi: "Hàng Thường", zh: "普货" },
  "pricing.cargo_cos": { en: "Cosmetics", vi: "Mỹ Phẩm", zh: "化妆品" },
  "pricing.cargo_bat": { en: "Battery", vi: "Pin Điện", zh: "电池" },
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
  "pricing.tab_header": { en: "View Full Pricing Table", vi: "Xem Toàn Bộ Bảng Giá", zh: "查看完整报价表" },
  "pricing.btn_expand": { en: "See {count} more options", vi: "Xem thêm {count} tuỳ chọn", zh: "查看更多{count}个选项" },
  "pricing.btn_collapse": { en: "Collapse table", vi: "Thu gọn bảng giá", zh: "收起表格" },
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
  const [language, setLanguage] = useState<Language>("en");
  // Track GTranslate language from html[lang] attribute
  const [gtLang, setGtLang] = useState<string>(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.lang || "vi";
    }
    return "vi";
  });

  // Observe GTranslate language changes on <html lang="...">
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const lang = document.documentElement.lang || "vi";
      setGtLang(lang);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });
    return () => observer.disconnect();
  }, []);

  // Standard t() — always returns base language (Vietnamese) so GTranslate can translate it
  const t = (key: string): string => {
    return translations[key]?.vi || translations[key]?.en || key;
  };

  // Smart translation — returns curated text matching the current GTranslate language.
  // Use with translate="no" on its container to prevent GTranslate from overwriting.
  // English mode → exact English | Vietnamese mode → exact Vietnamese | Chinese → exact Chinese
  const tVi = (key: string): string => {
    if (gtLang.startsWith("zh")) {
      return translations[key]?.zh || translations[key]?.en || key;
    }
    if (gtLang.startsWith("en")) {
      return translations[key]?.en || key;
    }
    // Default to Vietnamese since it's the master language
    return translations[key]?.vi || translations[key]?.en || key;
  };

  // Derive effective Language type from GTranslate's detected language
  const effectiveLanguage: Language = gtLang.startsWith("zh") ? "zh" : gtLang.startsWith("en") ? "en" : "vi";

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
