import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "vi" | "zh";

type Translations = Record<string, Record<Language, string>>;

const translations: Translations = {
  // Navbar
  "nav.services": { en: "Services", vi: "Dịch vụ", zh: "服务" },
  "nav.pricing": { en: "Pricing", vi: "Bảng giá", zh: "价格" },
  "nav.policy": { en: "Policy", vi: "Chính sách", zh: "政策" },
  "nav.news": { en: "News", vi: "Tin tức", zh: "新闻" },
  "nav.faq": { en: "Q&A", vi: "Q&A", zh: "问答" },
  "nav.consult": { en: "Get Started", vi: "Tư vấn ngay", zh: "立即咨询" },
  
  // Services sub-items
  "nav.thg_fulfill": { en: "THG Fulfill", vi: "THG Fulfill", zh: "THG Fulfill" },
  "nav.thg_express": { en: "THG Express", vi: "THG Express", zh: "THG Express" },
  "nav.thg_warehouse": { en: "THG Warehouse", vi: "THG Warehouse", zh: "THG Warehouse" },
  "nav.thg_order": { en: "THG Order", vi: "THG Order", zh: "THG Order" },
  "nav.fulfill_desc": { en: "End-to-end fulfillment from receiving to last-mile delivery", vi: "Fulfillment toàn diện từ nhận hàng đến giao tận nơi", zh: "从收货到最后一公里的全流程履约" },
  "nav.express_desc": { en: "Fast international shipping with optimized transit times", vi: "Vận chuyển nhanh quốc tế, thời gian tối ưu", zh: "快速国际运输，时间最优" },
  "nav.warehouse_desc": { en: "Modern warehouses in Vietnam, China & USA", vi: "Hệ thống kho hiện đại tại VN, TQ & Mỹ", zh: "越南、中国和美国的现代仓库" },
  "nav.order_desc": { en: "Smart order management with automated processing", vi: "Quản lý đơn hàng thông minh, tự động hóa", zh: "智能订单管理，自动化处理" },

  // Hero
  "hero.badge": { en: "15% OFF for first 50 orders", vi: "Ưu đãi 15% cho 50 đơn đầu tiên", zh: "前50单享85折优惠" },
  "hero.title1": { en: "Your Global", vi: "Đối tác", zh: "您的全球" },
  "hero.title_highlight": { en: "Fulfillment", vi: "Fulfillment", zh: "Fulfillment" },
  "hero.title2": { en: "Partner for", vi: "toàn cầu cho", zh: "合作伙伴，为" },
  "hero.title3": { en: "eCommerce Sellers", vi: "eCommerce Seller", zh: "电商卖家" },
  "hero.subtitle": { en: "A comprehensive Fulfillment ecosystem, seamlessly connecting from Vietnam – China – to US warehouses.", vi: "Hệ sinh thái Fulfillment toàn diện, kết nối liền mạch từ Việt Nam – Trung Quốc – đến tận kho Mỹ.", zh: "全面的履约生态系统，无缝连接越南-中国-美国仓库。" },
  "hero.cta": { en: "Get Started", vi: "Đăng ký ngay", zh: "立即注册" },
  "hero.learn_more": { en: "Learn More", vi: "Tìm hiểu thêm", zh: "了解更多" },
  "hero.feature1": { en: "Product sourcing", vi: "Tìm kiếm nguồn hàng", zh: "产品采购" },
  "hero.feature2": { en: "POD products", vi: "Cung cấp sản phẩm POD", zh: "POD产品" },
  "hero.feature3": { en: "Warehouse management", vi: "Quản lý kho bãi", zh: "仓库管理" },
  "hero.feature4": { en: "Global shipping US, UK, EU", vi: "Vận chuyển toàn cầu US, UK, EU", zh: "全球运输 US, UK, EU" },
  "hero.delivery_days": { en: "delivery days", vi: "ngày giao hàng", zh: "交货天数" },
  "hero.countries": { en: "production countries", vi: "quốc gia sản xuất", zh: "生产国" },
  "hero.us_fulfill": { en: "US domestic fulfill", vi: "fulfill nội địa US", zh: "美国国内履约" },

  // Services
  "services.subtitle": { en: "Our Services", vi: "Dịch vụ của chúng tôi", zh: "我们的服务" },
  "services.title": { en: "Complete", vi: "Giải pháp", zh: "一站式" },
  "services.title_highlight": { en: "Fulfillment", vi: "Fulfillment", zh: "Fulfillment" },
  "services.title2": { en: "Solutions", vi: "trọn gói", zh: "解决方案" },
  "services.s1_title": { en: "THG Fulfill", vi: "THG Fulfill", zh: "THG Fulfill" },
  "services.s1_desc": { en: "End-to-end fulfillment from receiving, packaging to last-mile delivery.", vi: "Dịch vụ fulfillment toàn diện từ nhận hàng, đóng gói đến giao hàng tận nơi.", zh: "从收货、包装到最后一公里的端到端履约服务。" },
  "services.s2_title": { en: "THG Express", vi: "THG Express", zh: "THG Express" },
  "services.s2_desc": { en: "Fast international shipping with optimized delivery times.", vi: "Vận chuyển nhanh quốc tế với thời gian giao hàng tối ưu nhất.", zh: "快速国际运输，交货时间最优。" },
  "services.s3_title": { en: "THG Warehouse", vi: "THG Warehouse", zh: "THG Warehouse" },
  "services.s3_desc": { en: "Modern warehouse systems in Vietnam, China and USA.", vi: "Hệ thống kho bãi hiện đại tại Việt Nam, Trung Quốc và Mỹ.", zh: "越南、中国和美国的现代仓储系统。" },
  "services.s4_title": { en: "THG Order", vi: "THG Order", zh: "THG Order" },
  "services.s4_desc": { en: "Smart order management with automated processing.", vi: "Quản lý đơn hàng thông minh, tự động hóa quy trình xử lý.", zh: "智能订单管理，自动化处理流程。" },
  "services.s5_title": { en: "Global Shipping", vi: "Vận chuyển quốc tế", zh: "国际运输" },
  "services.s5_desc": { en: "Global shipping connections to US, UK, EU and more markets.", vi: "Kết nối vận chuyển toàn cầu đến US, UK, EU và nhiều thị trường khác.", zh: "全球运输连接美国、英国、欧盟等更多市场。" },
  "services.s6_title": { en: "Sourcing & POD", vi: "Sourcing & POD", zh: "采购 & POD" },
  "services.s6_desc": { en: "Product sourcing and premium Print on Demand services.", vi: "Tìm kiếm nguồn hàng và cung cấp dịch vụ Print on Demand chất lượng.", zh: "产品采购和优质按需印刷服务。" },

  // Seller Types
  "sellers.subtitle": { en: "Who We Serve", vi: "Đối tượng khách hàng", zh: "我们服务的对象" },
  "sellers.title": { en: "For Every", vi: "Phù hợp với", zh: "适合每一位" },
  "sellers.title_highlight": { en: "Seller", vi: "mọi Seller", zh: "卖家" },
  "sellers.t1_title": { en: "New Sellers", vi: "Seller mới bắt đầu", zh: "新手卖家" },
  "sellers.t1_desc": { en: "A-Z support for newcomers to cross-border eCommerce.", vi: "Hỗ trợ từ A-Z cho người mới bước vào thương mại điện tử xuyên biên giới.", zh: "为跨境电商新手提供全方位支持。" },
  "sellers.t2_title": { en: "Scaling Sellers", vi: "Seller đang scale", zh: "成长型卖家" },
  "sellers.t2_desc": { en: "Optimize costs and processes for rapid growth.", vi: "Tối ưu chi phí và quy trình để mở rộng quy mô kinh doanh nhanh chóng.", zh: "优化成本和流程，实现快速增长。" },
  "sellers.t3_title": { en: "Team Sellers", vi: "Seller đội nhóm", zh: "团队卖家" },
  "sellers.t3_desc": { en: "Warehouse and fulfillment solutions for professional teams.", vi: "Giải pháp quản lý kho và fulfillment cho các team bán hàng chuyên nghiệp.", zh: "为专业团队提供仓储和履约解决方案。" },
  "sellers.t4_title": { en: "Brand & DTC", vi: "Brand & DTC", zh: "品牌 & DTC" },
  "sellers.t4_desc": { en: "Build your own brand with premium, specialized fulfillment.", vi: "Xây dựng thương hiệu riêng với dịch vụ fulfillment cao cấp và chuyên biệt.", zh: "通过优质、专业的履约服务打造您的品牌。" },

  // Process
  "process.subtitle": { en: "How It Works", vi: "Quy trình", zh: "如何运作" },
  "process.title": { en: "Get Started in", vi: "Bắt đầu chỉ với", zh: "仅需" },
  "process.title_highlight": { en: "4 Steps", vi: "4 bước", zh: "4步" },
  "process.s1_title": { en: "Register & Consult", vi: "Đăng ký & Tư vấn", zh: "注册 & 咨询" },
  "process.s1_desc": { en: "Contact THG team for tailored fulfillment solutions.", vi: "Liên hệ đội ngũ THG để được tư vấn giải pháp phù hợp nhất.", zh: "联系THG团队获取定制解决方案。" },
  "process.s2_title": { en: "Ship to Warehouse", vi: "Gửi hàng về kho", zh: "发货至仓库" },
  "process.s2_desc": { en: "Send products to THG warehouses in Vietnam or China.", vi: "Gửi sản phẩm đến kho THG tại Việt Nam hoặc Trung Quốc.", zh: "将产品发送至越南或中国的THG仓库。" },
  "process.s3_title": { en: "Order Processing", vi: "Xử lý đơn hàng", zh: "订单处理" },
  "process.s3_desc": { en: "Automated order processing, packaging and preparation.", vi: "Hệ thống tự động xử lý đơn, đóng gói và chuẩn bị giao hàng.", zh: "自动化订单处理、包装和准备。" },
  "process.s4_title": { en: "Global Delivery", vi: "Giao hàng toàn cầu", zh: "全球配送" },
  "process.s4_desc": { en: "Products shipped to customers worldwide.", vi: "Sản phẩm được vận chuyển đến tay khách hàng trên toàn thế giới.", zh: "产品运送至全球客户手中。" },

  // Advantages
  "adv.subtitle": { en: "Why THG", vi: "Tại sao chọn THG", zh: "为什么选择THG" },
  "adv.title": { en: "Unmatched", vi: "Lợi thế", zh: "无与伦比的" },
  "adv.title_highlight": { en: "Advantages", vi: "vượt trội", zh: "优势" },
  "adv.a1_title": { en: "Cost Optimized", vi: "Chi phí tối ưu", zh: "成本优化" },
  "adv.a1_desc": { en: "Most competitive pricing with US domestic fulfillment from $1.", vi: "Giá cả cạnh tranh nhất thị trường với fulfill nội địa US từ 1$.", zh: "最具竞争力的价格，美国国内履约低至1美元。" },
  "adv.a2_title": { en: "Fast Delivery", vi: "Giao hàng nhanh", zh: "快速配送" },
  "adv.a2_desc": { en: "5-8 days to EU, 3-5 days US domestic.", vi: "Thời gian giao hàng 5-8 ngày đến EU, 3-5 ngày nội địa US.", zh: "5-8天到欧盟，3-5天美国国内。" },
  "adv.a3_title": { en: "Global Coverage", vi: "Phủ sóng toàn cầu", zh: "全球覆盖" },
  "adv.a3_desc": { en: "Warehouses in 3 countries: Vietnam, China, USA.", vi: "Kho bãi tại 3 quốc gia: Việt Nam, Trung Quốc, Mỹ.", zh: "3个国家的仓库：越南、中国、美国。" },
  "adv.a4_title": { en: "Safe & Reliable", vi: "An toàn & Tin cậy", zh: "安全可靠" },
  "adv.a4_desc": { en: "Cargo insurance, 100% compensation for lost items.", vi: "Bảo hiểm hàng hóa, đền bù 100% nếu thất lạc.", zh: "货物保险，丢失100%赔偿。" },
  "adv.a5_title": { en: "Modern Technology", vi: "Công nghệ hiện đại", zh: "现代技术" },
  "adv.a5_desc": { en: "Automated order management, realtime tracking.", vi: "Hệ thống quản lý đơn hàng tự động, realtime tracking.", zh: "自动化订单管理，实时追踪。" },
  "adv.a6_title": { en: "24/7 Support", vi: "Hỗ trợ 24/7", zh: "24/7支持" },
  "adv.a6_desc": { en: "Vietnamese-speaking support team available anytime.", vi: "Đội ngũ tư vấn viên hỗ trợ bằng tiếng Việt mọi lúc.", zh: "越南语支持团队随时为您服务。" },

  // FAQ
  "faq.subtitle": { en: "Frequently Asked Questions", vi: "Câu hỏi thường gặp", zh: "常见问题" },
  "faq.q1": { en: "Who is THG Fulfill for?", vi: "THG Fulfill phù hợp với ai?", zh: "THG Fulfill适合谁？" },
  "faq.a1": { en: "THG Fulfill is suitable for all eCommerce sellers, from beginners to large brands looking to expand internationally.", vi: "THG Fulfill phù hợp với tất cả các seller eCommerce, từ người mới bắt đầu đến các brand lớn muốn mở rộng thị trường quốc tế.", zh: "THG Fulfill适合所有电商卖家，从新手到希望拓展国际市场的大品牌。" },
  "faq.q2": { en: "What are the fulfillment costs?", vi: "Chi phí fulfillment như thế nào?", zh: "履约费用是多少？" },
  "faq.a2": { en: "US domestic fulfillment starts from $1/order. Specific pricing depends on product size, weight and order volume.", vi: "Chi phí fulfill nội địa US bắt đầu từ 1$/đơn. Giá cụ thể phụ thuộc vào kích thước, trọng lượng sản phẩm và khối lượng đơn hàng.", zh: "美国国内履约从1美元/单起。具体价格取决于产品尺寸、重量和订单量。" },
  "faq.q3": { en: "What are the delivery times?", vi: "Thời gian giao hàng bao lâu?", zh: "配送时间是多久？" },
  "faq.a3": { en: "US domestic: 3-5 business days. EU delivery: 5-8 business days. UK: 5-7 business days.", vi: "Nội địa US: 3-5 ngày làm việc. Giao hàng đến EU: 5-8 ngày làm việc. UK: 5-7 ngày làm việc.", zh: "美国国内：3-5个工作日。欧盟配送：5-8个工作日。英国：5-7个工作日。" },
  "faq.q4": { en: "Does THG support Print on Demand?", vi: "THG có hỗ trợ Print on Demand không?", zh: "THG是否支持按需印刷？" },
  "faq.a4": { en: "Yes, THG provides POD services with diverse products and premium print quality.", vi: "Có, THG cung cấp dịch vụ POD với đa dạng sản phẩm và chất lượng in ấn cao cấp.", zh: "是的，THG提供多样化产品和优质印刷质量的POD服务。" },
  "faq.q5": { en: "How do I get started?", vi: "Làm thế nào để bắt đầu?", zh: "如何开始？" },
  "faq.a5": { en: "Simply register an account, ship your products to THG warehouse and start selling. The THG team will support you from A to Z.", vi: "Bạn chỉ cần đăng ký tài khoản, gửi hàng về kho THG và bắt đầu bán hàng. Đội ngũ THG sẽ hỗ trợ bạn từ A-Z.", zh: "只需注册账户，将产品发送到THG仓库即可开始销售。THG团队将全程为您提供支持。" },

  // Contact
  "contact.subtitle": { en: "Contact Us", vi: "Liên hệ", zh: "联系我们" },
  "contact.title": { en: "Start Your", vi: "Bắt đầu", zh: "开始您的" },
  "contact.title_highlight": { en: "Journey", vi: "hành trình", zh: "旅程" },
  "contact.title2": { en: "with THG", vi: "cùng THG", zh: "与THG" },
  "contact.desc": { en: "Leave your information, the THG team will contact you with the best fulfillment solution within 24 hours.", vi: "Để lại thông tin, đội ngũ THG sẽ liên hệ tư vấn giải pháp fulfillment phù hợp nhất cho bạn trong vòng 24 giờ.", zh: "留下您的信息，THG团队将在24小时内为您提供最佳履约解决方案。" },
  "contact.name": { en: "Full name", vi: "Họ và tên", zh: "姓名" },
  "contact.phone": { en: "Phone number", vi: "Số điện thoại", zh: "电话号码" },
  "contact.email": { en: "Email", vi: "Email", zh: "电子邮件" },
  "contact.shop": { en: "Shop / Brand name", vi: "Tên shop / Brand", zh: "店铺/品牌名" },
  "contact.message": { en: "How can we help you?", vi: "Nội dung cần tư vấn...", zh: "请描述您的需求..." },
  "contact.submit": { en: "Submit Inquiry", vi: "Gửi yêu cầu tư vấn", zh: "提交咨询" },

  // Footer
  "footer.tagline": { en: "Global Fulfillment Partner for eCommerce Sellers.", vi: "Đối tác Fulfillment toàn cầu cho eCommerce Seller.", zh: "电商卖家的全球履约合作伙伴。" },
  "footer.services": { en: "Services", vi: "Dịch vụ", zh: "服务" },
  "footer.support": { en: "Support", vi: "Hỗ trợ", zh: "支持" },
  "footer.contact": { en: "Contact", vi: "Liên hệ", zh: "联系方式" },
  "footer.faq_link": { en: "FAQ", vi: "Câu hỏi thường gặp", zh: "常见问题" },
  "footer.privacy": { en: "Privacy Policy", vi: "Chính sách bảo mật", zh: "隐私政策" },
  "footer.terms": { en: "Terms of Service", vi: "Điều khoản sử dụng", zh: "服务条款" },

  // Policy page
  "policy.title": { en: "Policies", vi: "Chính sách", zh: "政策" },
  "policy.warehouse": { en: "Warehouse Policy", vi: "Chính sách Warehouse", zh: "仓储政策" },
  "policy.pod": { en: "POD/Dropship Policy", vi: "Chính sách POD/Dropship", zh: "POD/代发政策" },
  "policy.shipping": { en: "Shipping Policy", vi: "Chính sách Vận chuyển", zh: "运输政策" },
  "policy.compensation": { en: "Bulk Cargo Compensation Policy", vi: "Chính sách đền bù hàng lô", zh: "批量货物赔偿政策" },
  "policy.tiktok": { en: "POD - TikTok Shipping Policy", vi: "Chính sách POD - TikTok Shipping", zh: "POD - TikTok运输政策" },

  // News page
  "news.title": { en: "News & Updates", vi: "Tin tức", zh: "新闻动态" },
  "news.subtitle": { en: "Stay updated with the latest from THG", vi: "Cập nhật tin tức mới nhất từ THG", zh: "关注THG的最新动态" },
  "news.read_more": { en: "Read more", vi: "Đọc thêm", zh: "阅读更多" },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
};
