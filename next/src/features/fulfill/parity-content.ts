import { tr, localize, type Locale, type LocalizedText } from "@/shared/i18n";

// R3 content parity: the Fulfill chapters that existed on the production Vite page but had not
// been migrated. Copy is ported VERBATIM from the Vite production dictionary
// (src/lib/i18n/translations/fulfill.ts, prefixes fulfill_page / fulfill_ecount / hub) — nothing
// here is new marketing.
//
// ARGUMENT ORDER DIFFERS BETWEEN THE REPOS. Vite's helper is tr(en, vi, zh); this one is
// tr(vi, en, zh). Every value below is swapped accordingly — get it wrong and the page ships
// mixed-language copy that no test would catch.
//
// Kept in its own module rather than grown into localized-content.ts so the restored chapters
// stay reviewable as one unit; it follows the identical pattern (domain-shaped LocalizedText tree
// resolved once per locale) and is consumed the same way.

export interface FulfillLabelledFact {
  label: string;
  description: string;
}

export interface FulfillGuideSection {
  id: string;
  title: string;
  intro: string;
  bullets: readonly string[];
  facts: readonly FulfillLabelledFact[];
}

export interface FulfillAdvantage {
  id: string;
  title: string;
  description: string;
}

/** Shaped as the rendered FAQ model (numeric id) so the page can hand the SAME list to the
 *  accordion and to the FAQPage JSON-LD — visible answers and structured data can never diverge. */
export interface FulfillFaqFallbackItem {
  id: number;
  question: string;
  answer: string;
}

export interface FulfillParityCopy {
  platformsLabel: string;
  platforms: readonly string[];
  podProcess: string;
  blankTshirt: string;
  dtgPrint: string;
  yourBrand: string;
  brandedProduct: string;

  solutionEyebrow: string;
  solutionTitle: string;
  solutionIntro: string;
  /** Exactly two advantages, in Vite order (ecosystem, then transparency). A tuple because the
   *  renderer pairs each one with its own proof (a photo, then a film) and destructures both. */
  advantages: readonly [FulfillAdvantage, FulfillAdvantage];

  basecostLabel: string;
  leadTimeLabel: string;

  ecountEyebrow: string;
  ecountTitle: string;
  ecountIntro: string;
  ecountSkuLink: string;

  hubEyebrow: string;
  hubHeading: string;
  hubIntro: string;
  hubToc: string;
  hubSections: readonly FulfillGuideSection[];

  hubCtaTitle: string;
  hubCtaDesc: string;
  hubCtaLabel: string;

  policyTitle: string;
  policyDesc: string;
  policyCta: string;

  /** RESERVED: the logistics-gallery section is the one Vite chapter still unmigrated (it needs
   *  CMS `gallery[]` plumbed into the fulfill model plus a marquee). The copy is already ported
   *  so that slice is content-complete on arrival; delete this field if the gallery is dropped. */
  galleryTitle: string;

  faqFallback: readonly FulfillFaqFallbackItem[];
}

interface FactSource {
  label: string;
  description: LocalizedText;
}
interface GuideSectionSource {
  id: string;
  title: LocalizedText;
  intro: LocalizedText;
  bullets: readonly LocalizedText[];
  facts: readonly FactSource[];
}

/** Storefront platforms the service integrates with — brand names, identical in every locale. */
const PLATFORMS = ["Shopify", "Etsy", "WooCommerce", "Amazon", "TikTok Shop"] as const;

const SOURCE = {
  platformsLabel: tr("Tích hợp mượt mà với", "Seamlessly integrates with", "无缝集成"),
  podProcess: tr("Quy trình POD", "POD Process", "POD流程"),
  blankTshirt: tr("Áo phôi", "Blank T-Shirt", "空白T恤"),
  dtgPrint: tr("In DTG / DTF", "DTG / DTF Print", "DTG / DTF 打印"),
  yourBrand: tr("BRAND CỦA BẠN", "YOUR BRAND", "您的品牌"),
  brandedProduct: tr("Thành phẩm", "Branded Product", "品牌产品"),

  solutionEyebrow: tr("Giải pháp", "Our Solution", "我们的解决方案"),
  solutionTitle: tr(
    "Giải pháp Fulfillment toàn diện",
    "Complete Fulfillment Solution",
    "全面的履约解决方案",
  ),
  solutionIntro: tr(
    "THG Fulfill mang đến giải pháp POD & Dropship trọn gói cho seller.",
    "THG Fulfill provides end-to-end POD & Dropship solutions for global sellers.",
    "THG Fulfill为全球卖家提供端到端的POD和代发解决方案。",
  ),
  advantages: [
    {
      id: "ecosystem",
      title: tr(
        "Hệ sinh thái POD & Dropship trọn gói",
        "Complete POD & Dropship Ecosystem",
        "完整的POD和代发生态系统",
      ),
      description: tr(
        "Sản xuất POD tại Việt Nam, Trung Quốc và Mỹ giúp tối ưu thời gian và chi phí.",
        "POD production in Vietnam, China and USA to optimize delivery time and costs.",
        "在越南、中国和美国进行POD生产，优化交货时间和成本。",
      ),
    },
    {
      id: "transparent",
      title: tr("Minh bạch, không phí ẩn", "Transparent, No Hidden Fees", "透明，无隐藏费用"),
      description: tr(
        "Hỗ trợ liên tục, xử lý vấn đề kịp thời để seller vận hành trơn tru.",
        "Continuous support, timely issue resolution for smooth operations.",
        "持续支持，及时解决问题，确保运营顺畅。",
      ),
    },
  ],

  basecostLabel: tr("Basecost từ", "Basecost from", "基本成本起"),
  leadTimeLabel: tr("Time in-house", "Time in-house", "内部处理时间"),

  ecountEyebrow: tr(
    "Hướng dẫn sử dụng hệ thống",
    "System Usage Guide",
    "系统使用指南",
  ),
  ecountTitle: tr(
    "I. Hướng dẫn lên đơn trên HUB System Seller Portal",
    "I. Order placement guide on HUB System Seller Portal",
    "I. HUB System Seller Portal 下单指南",
  ),
  ecountIntro: tr(
    "Xem video hướng dẫn chi tiết cách lên đơn hàng trên hệ thống Ecount ERP của THG. Lưu ý chọn đúng loại SBSL (Ship By Seller) / SBTT (Ship By TikTok) khi chọn SKU.",
    "Watch the detailed video guide on placing orders on the THG Ecount ERP system. Note: select the correct SBSL (Ship By Seller) / SBTT (Ship By TikTok) when choosing SKU.",
    "观看THG Ecount ERP系统下单的详细视频教程。注意：选择SKU时请正确选择SBSL（卖家发货）/ SBTT（TikTok发货）。",
  ),
  // Phase 0.4: the leading 📋 was emoji-as-an-icon in a call to action, shipping in all three
  // locales. The wording is otherwise untouched; the glyph is replaced by a monoline SVG at the
  // render site.
  ecountSkuLink: tr(
    "Link SKU cho THG FULFILL",
    "Link SKU for THG FULFILL",
    "THG FULFILL SKU链接",
  ),

  hubEyebrow: tr("Hướng dẫn sử dụng hệ thống", "System Usage Guide", "系统使用指南"),
  hubHeading: tr("Hướng dẫn sử dụng Hub System", "Hub System User Guide", "Hub System 使用指南"),
  hubIntro: tr(
    "Hướng dẫn chi tiết từng tính năng trên hệ thống quản lý",
    "A detailed guide to every feature on the management system",
    "管理系统每项功能的详细指南",
  ),
  hubToc: tr("Mục lục", "Contents", "目录"),
  hubSections: [
    {
      id: "dashboard",
      title: tr("1. Đăng nhập & Bảng điều khiển", "1. Login & Dashboard", "1. 登录与仪表盘"),
      intro: tr(
        "Hệ thống quản lý được truy cập thông qua địa chỉ hub.thgfulfill.com. Sau khi đăng nhập bằng tài khoản được cấp, người dùng sẽ tiếp cận Bảng điều khiển trung tâm (Dashboard). Tại đây, các chỉ số vận hành cốt lõi được hiển thị trực quan:",
        "The management system is accessed at hub.thgfulfill.com. After logging in with your assigned account, you'll reach the central Dashboard, where the core operational metrics are shown at a glance:",
        "管理系统通过 hub.thgfulfill.com 访问。使用所分配的账户登录后，您将进入中央仪表盘（Dashboard），核心运营指标一目了然：",
      ),
      bullets: [
        tr(
          "Phần dưới của trang cung cấp cái nhìn nhanh về danh sách đơn hàng và lịch sử nạp tiền gần nhất.",
          "The lower part of the page gives a quick overview of recent orders and top-up history.",
          "页面下方提供最近订单列表与充值记录的快速概览。",
        ),
      ],
      facts: [
        {
          label: "Wallet Balance",
          description: tr(
            "Số dư hiện khả dụng trong ví.",
            "Your currently available wallet balance.",
            "钱包当前可用余额。",
          ),
        },
        {
          label: "Total Orders",
          description: tr(
            "Tổng lượng đơn hàng đã khởi tạo.",
            "Total number of orders created.",
            "已创建的订单总数。",
          ),
        },
        {
          label: "In Process",
          description: tr(
            "Số lượng đơn hàng đang trong giai đoạn xử lý.",
            "Number of orders currently being processed.",
            "正在处理中的订单数量。",
          ),
        },
        {
          label: "Revenue",
          description: tr("Tổng doanh thu đạt được.", "Total revenue achieved.", "已实现的总收入。"),
        },
      ],
    },
    {
      id: "orders",
      title: tr("2. Quản lý Đơn hàng", "2. Order Management", "2. 订单管理"),
      intro: tr(
        "Mục Order là trung tâm điều phối mọi hoạt động vận hành. Người dùng có thể:",
        "The Order section is the central hub for all operations. Users can:",
        "Order（订单）模块是所有运营活动的协调中心。用户可以：",
      ),
      bullets: [
        tr(
          "Theo dõi trạng thái chi tiết của từng đơn hàng và mã vận đơn (tracking number).",
          "Track the detailed status of each order and its tracking number.",
          "追踪每个订单的详细状态及运单号（tracking number）。",
        ),
        tr(
          "Khởi tạo đơn hàng hàng loạt: Sử dụng tính năng Upload Orders thông qua file CSV để tối ưu hóa thời gian nhập liệu thay vì tạo thủ công từng đơn.",
          "Create orders in bulk: use the Upload Orders feature with a CSV file to save data-entry time instead of creating each order manually.",
          "批量创建订单：使用 Upload Orders 功能通过 CSV 文件批量导入，免去逐单手动创建，节省录入时间。",
        ),
      ],
      facts: [],
    },
    {
      id: "catalog",
      title: tr("3. Danh mục Sản phẩm", "3. Product Catalog", "3. 产品目录"),
      intro: tr(
        "Mục Catalog cung cấp hệ thống kho hàng hóa được THG Fulfillment hỗ trợ. Người dùng có thể truy xuất các thông tin kỹ thuật, giá thành và tính sẵn có của sản phẩm. Đây là cơ sở dữ liệu để người bán lựa chọn mặt hàng kinh doanh và đồng bộ hóa vào hệ thống bán hàng của mình.",
        "The Catalog section provides the product inventory supported by THG Fulfillment. Users can look up technical specs, costs and product availability. It's the database sellers use to pick items to sell and sync them into their own sales systems.",
        "Catalog（目录）模块提供 THG Fulfillment 支持的商品库。用户可查询产品的技术参数、成本与可用性。这是卖家选品并同步至自有销售系统的数据库。",
      ),
      bullets: [],
      facts: [],
    },
    {
      id: "finance",
      title: tr("4. Quản lý Tài chính", "4. Billing & Finance", "4. 财务管理"),
      intro: tr(
        "Hệ thống vận hành theo mô hình trả trước (Prepaid). Chức năng Tài chính được chia làm ba phần chính:",
        "The system runs on a prepaid model. The Finance function is split into three main parts:",
        "系统采用预付费（Prepaid）模式运营。财务功能分为三个主要部分：",
      ),
      bullets: [],
      facts: [
        {
          label: "Wallet",
          description: tr(
            "Theo dõi biến động số dư thực tế.",
            "Track real-time balance changes.",
            "跟踪实际余额变动。",
          ),
        },
        {
          label: "Top-up",
          description: tr(
            "Cổng nạp tiền với nhiều phương thức thanh toán đa dạng.",
            "A top-up gateway with a variety of payment methods.",
            "支持多种支付方式的充值入口。",
          ),
        },
        {
          label: "Transaction",
          description: tr(
            "Lưu trữ chi tiết lịch sử giao dịch, phục vụ công tác đối soát định kỳ.",
            "Stores detailed transaction history for periodic reconciliation.",
            "保存详细的交易记录，便于定期对账。",
          ),
        },
      ],
    },
    {
      id: "support",
      title: tr("5. Hỗ trợ & Xử lý Khiếu nại", "5. Support & Complaints", "5. 支持与投诉处理"),
      intro: tr(
        "Để đảm bảo luồng vận hành xuyên suốt, hệ thống cung cấp hai kênh tương tác trực tiếp:",
        "To keep operations running smoothly, the system provides two direct interaction channels:",
        "为保障运营顺畅，系统提供两个直接互动渠道：",
      ),
      bullets: [],
      facts: [
        {
          label: "Request",
          description: tr(
            "Gửi các yêu cầu đặc thù về sản phẩm hoặc điều chỉnh đơn hàng.",
            "Submit specific requests about products or order adjustments.",
            "提交关于产品或订单调整的特定请求。",
          ),
        },
        {
          label: "Trouble",
          description: tr(
            "Báo cáo các sự cố phát sinh (sai hàng, lỗi vận chuyển) để đội ngũ kỹ thuật xử lý khẩn cấp.",
            "Report incidents (wrong items, shipping errors) for the technical team to handle urgently.",
            "上报突发问题（发错货、运输错误），由技术团队紧急处理。",
          ),
        },
      ],
    },
    {
      id: "account",
      title: tr(
        "6. Thiết lập Tài khoản & Phân quyền",
        "6. Account & Permissions",
        "6. 账户设置与权限",
      ),
      intro: tr(
        "Hệ thống cho phép cá nhân hóa trải nghiệm và quản lý đội nhóm:",
        "The system lets you personalize your experience and manage your team:",
        "系统允许个性化体验并管理团队：",
      ),
      bullets: [],
      facts: [
        {
          label: "Account Setting",
          description: tr(
            "Cập nhật thông tin bảo mật và hồ sơ cá nhân.",
            "Update security details and personal profile.",
            "更新安全信息与个人资料。",
          ),
        },
        {
          label: "Team Member",
          description: tr(
            "Tính năng phân quyền cho phép thêm nhiều thành viên cùng quản lý tài khoản, phù hợp với mô hình kinh doanh theo đội nhóm chuyên nghiệp.",
            "Permission controls let you add multiple members to co-manage the account — ideal for professional team-based businesses.",
            "权限功能允许添加多名成员共同管理账户，适合专业的团队化经营模式。",
          ),
        },
      ],
    },
  ] as readonly GuideSectionSource[],

  hubCtaTitle: tr("Hệ thống HUB Fulfill", "HUB Fulfill System", "HUB Fulfill 系统"),
  hubCtaDesc: tr(
    "Trải nghiệm hệ thống quản lý Fulfill toàn diện mạnh mẽ, minh bạch và ưu việt nhất dành cho các Seller Global.",
    "Experience the most comprehensive, transparent, and powerful fulfillment management system for global sellers.",
    "体验针对全球卖家的最全面，透明和强大的履行管理系统。",
  ),
  hubCtaLabel: tr("Trải nghiệm Hệ thống", "Experience System", "体验系统"),

  policyTitle: tr(
    "Chính sách & Điều khoản Fulfillment",
    "Fulfillment Terms & Policies",
    "履行条款及政策",
  ),
  policyDesc: tr(
    "Mọi thông tin hỗ trợ, bảo hiểm hàng hóa, SLA và chính sách đền bù minh bạch 100%.",
    "All support information, cargo insurance, SLA, and 100% transparent compensation policies.",
    "提供所有的支持信息、货物保险、SLA，以及100%透明的赔偿政策。",
  ),
  policyCta: tr("Xem Chi Tiết", "View Details", "查看详情"),

  galleryTitle: tr(
    "Hệ thống Kho Bãi & Vận Hành",
    "Warehouse & Operations Gallery",
    "仓储与运营画廊",
  ),

  faqFallback: [
    {
      id: 1,
      question: tr(
        "THG Fulfill cung cấp những dịch vụ nào?",
        "What services does THG Fulfill provide?",
        "THG Fulfill提供哪些服务？",
      ),
      answer: tr(
        "Hiện tại THG Fulfill cung cấp dịch vụ POD và Dropship từ VN/CN đến US/UK/WW.",
        "THG Fulfill currently provides POD and Dropship services from VN/CN to US/UK/WW.",
        "THG Fulfill目前提供从越南/中国到美国/英国/全球的POD和代发服务。",
      ),
    },
    {
      id: 2,
      question: tr("Lên đơn ở đâu?", "Where do I place orders?", "在哪里下单？"),
      answer: tr(
        "Khách hàng sẽ lên đơn trong file làm việc chung THG gửi.",
        "Customers place orders in the shared work file sent by THG.",
        "客户在THG发送的共享工作文件中下单。",
      ),
    },
    {
      id: 3,
      question: tr(
        "Khi phát sinh đơn sẽ làm thế nào để THG biết?",
        "How does THG know when there are new orders?",
        "THG如何知道有新订单？",
      ),
      answer: tr(
        "Khách hàng lên đơn xong thì sẽ nhắn vào nhóm làm việc.",
        "After placing the order, message the work group so THG staff can verify.",
        "下单完成后，在工作群中通知THG工作人员核实。",
      ),
    },
    {
      id: 4,
      question: tr(
        "Cách thức thanh toán như thế nào?",
        "What payment methods are available?",
        "有哪些付款方式？",
      ),
      answer: tr(
        "THG hỗ trợ thanh toán qua Pingpong, Payoneer, WorldFirst.",
        "THG supports payments via Pingpong, Payoneer, and WorldFirst.",
        "THG支持通过Pingpong、Payoneer和WorldFirst付款。",
      ),
    },
    {
      id: 5,
      question: tr(
        "Template các sản phẩm cụ thể?",
        "Where can I find product templates?",
        "在哪里可以找到产品模板？",
      ),
      answer: tr(
        "Mọi template đều có sẵn trong mục Tải Template ở Catalog chi tiết.",
        "All templates are available in the Download Template section of each product Catalog.",
        "所有模板都可以在产品目录的下载模板部分找到。",
      ),
    },
    {
      id: 6,
      question: tr(
        "THG có hỗ trợ refund khi đơn thất lạc?",
        "Does THG support refunds for lost or damaged orders?",
        "THG是否支持退款？",
      ),
      answer: tr(
        "Dropship: Đền bù $20-$50. POD: THG Refund 100% basecost hoặc resend.",
        "Dropship: Compensation $20-$50. POD: THG refunds 100% basecost or resends per policy.",
        "代发：补偿20-50美元。POD：按政策退还basecost或重新发货。",
      ),
    },
    {
      id: 7,
      question: tr(
        "THG có thể mua trên AliExpress, SHEIN?",
        "Can THG purchase from AliExpress, SHEIN?",
        "THG能从AliExpress购买吗？",
      ),
      answer: tr(
        "THG chưa hỗ trợ AliExpress, SHEIN. Chúng tôi tìm sản phẩm tương tự trên Taobao/1688.",
        "THG does not support AliExpress/SHEIN. We find similar products on Taobao/1688.",
        "THG不支持AliExpress或SHEIN。我们在淘宝/1688上寻找类似产品。",
      ),
    },
  ],
};

/** Resolve the restored Fulfill chapters for one locale. */
export function getFulfillParityContent(locale: Locale): FulfillParityCopy {
  const L = (t: LocalizedText) => localize(locale, t);
  return {
    platformsLabel: L(SOURCE.platformsLabel),
    platforms: PLATFORMS,
    podProcess: L(SOURCE.podProcess),
    blankTshirt: L(SOURCE.blankTshirt),
    dtgPrint: L(SOURCE.dtgPrint),
    yourBrand: L(SOURCE.yourBrand),
    brandedProduct: L(SOURCE.brandedProduct),

    solutionEyebrow: L(SOURCE.solutionEyebrow),
    solutionTitle: L(SOURCE.solutionTitle),
    solutionIntro: L(SOURCE.solutionIntro),
    advantages: [
      { id: SOURCE.advantages[0].id, title: L(SOURCE.advantages[0].title), description: L(SOURCE.advantages[0].description) },
      { id: SOURCE.advantages[1].id, title: L(SOURCE.advantages[1].title), description: L(SOURCE.advantages[1].description) },
    ],

    basecostLabel: L(SOURCE.basecostLabel),
    leadTimeLabel: L(SOURCE.leadTimeLabel),

    ecountEyebrow: L(SOURCE.ecountEyebrow),
    ecountTitle: L(SOURCE.ecountTitle),
    ecountIntro: L(SOURCE.ecountIntro),
    ecountSkuLink: L(SOURCE.ecountSkuLink),

    hubEyebrow: L(SOURCE.hubEyebrow),
    hubHeading: L(SOURCE.hubHeading),
    hubIntro: L(SOURCE.hubIntro),
    hubToc: L(SOURCE.hubToc),
    hubSections: SOURCE.hubSections.map((s) => ({
      id: s.id,
      title: L(s.title),
      intro: L(s.intro),
      bullets: s.bullets.map(L),
      facts: s.facts.map((f) => ({ label: f.label, description: L(f.description) })),
    })),

    hubCtaTitle: L(SOURCE.hubCtaTitle),
    hubCtaDesc: L(SOURCE.hubCtaDesc),
    hubCtaLabel: L(SOURCE.hubCtaLabel),

    policyTitle: L(SOURCE.policyTitle),
    policyDesc: L(SOURCE.policyDesc),
    policyCta: L(SOURCE.policyCta),

    galleryTitle: L(SOURCE.galleryTitle),

    faqFallback: SOURCE.faqFallback.map((f) => ({
      id: f.id,
      question: L(f.question),
      answer: L(f.answer),
    })),
  };
}
