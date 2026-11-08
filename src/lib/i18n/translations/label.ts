// label translation keys (prefix: label_page, label_faq).
// Copy for the TH Group Label service page (/thg-label), the 5th TH Group service.

import { tr } from "../helpers";
import { registerTranslations } from "../registry";
import type { TranslationDict } from "../types";

export const labelTranslations: TranslationDict = {
  // ── Hero ──
  "label_page.badge": tr("TH Group service no. 5", "Dịch vụ thứ 5 của TH Group", "TH Group 第 5 项服务"),
  "label_page.hero_hl": tr("USPS, UPS, FedEx and DHL labels", "Label USPS, UPS, FedEx, DHL", "USPS、UPS、FedEx、DHL 面单"),
  "label_page.hero_rest": tr(
    "below retail, charged at exactly the quoted price.",
    "giá thấp hơn bán lẻ, trừ ví đúng giá đã báo.",
    "价格低于零售价，按报价精确扣款。",
  ),
  "label_page.hero_lead": tr(
    "Genuine labels connected directly to the carriers. Create labels in the Seller Portal, by file import or through the API.",
    "Mua label chính thống, đấu nối trực tiếp tới hãng vận chuyển. Tạo label trên Seller Portal, import file hoặc API.",
    "正规面单，直连承运商。可通过卖家后台、文件导入或 API 创建面单。",
  ),
  "label_page.check1": tr("1–5% below retail price", "Giảm 1–5% so với giá bán lẻ", "比零售价低 1–5%"),
  "label_page.check2": tr("4 carriers: USPS, UPS, FedEx, DHL", "4 hãng: USPS, UPS, FedEx, DHL", "4 家承运商：USPS、UPS、FedEx、DHL"),
  "label_page.check3": tr("Seller Portal, Import, API & Webhooks", "Seller Portal, Import, API & Webhooks", "卖家后台、导入、API 与 Webhook"),
  "label_page.check4": tr("Vietnamese support, insured", "Hỗ trợ tiếng Việt, có bảo hiểm", "越南语支持，含保险"),
  "label_page.cta_quote": tr("Get a free quote", "Nhận báo giá miễn phí", "获取免费报价"),
  "label_page.cta_portal": tr("See the Seller Portal", "Xem Seller Portal", "查看卖家后台"),
  "label_page.hero_micro": tr(
    "Free consultation · Reply within 24h · No commitment",
    "Tư vấn miễn phí · Phản hồi trong 24h · Không cam kết",
    "免费咨询 · 24 小时内回复 · 无需承诺",
  ),
  "label_page.chip_print": tr("4x6 thermal, A4", "In 4x6 nhiệt, A4", "4x6 热敏纸、A4"),
  "label_page.chip_track": tr("Follow the journey", "Theo dõi hành trình", "跟踪物流轨迹"),
  "label_page.chip_import": tr("Hundreds per batch", "Hàng trăm label / lần", "每批数百张"),
  "label_page.chip_save": tr("below retail", "thấp hơn giá bán lẻ", "低于零售价"),

  // ── Stats strip ──
  "label_page.strip": tr("Labels bought directly from", "Mua label trực tiếp từ", "直接向以下承运商购买面单"),
  "label_page.stat1": tr("carriers: USPS, UPS, FedEx, DHL", "hãng: USPS, UPS, FedEx, DHL", "家承运商：USPS、UPS、FedEx、DHL"),
  "label_page.stat2": tr("below retail price", "giảm so với giá bán lẻ", "低于零售价"),
  "label_page.stat3": tr("genuine labels, direct connection", "label chính thống, đấu nối trực tiếp", "正规面单，直连承运商"),
  "label_page.stat4": tr("quote response time", "phản hồi báo giá", "报价回复时效"),

  // ── Problem ──
  "label_page.problem_eyebrow": tr("The seller problem", "Vấn đề của seller", "卖家的痛点"),
  "label_page.problem_title": tr(
    "Shipping fees eat into margin on every order.",
    "Phí vận chuyển đang ăn vào lợi nhuận mỗi đơn.",
    "运费正在侵蚀每一单的利润。",
  ),
  "label_page.problem_sub": tr(
    "Small sellers usually pay retail, and opening an account with each carrier means paperwork and a different system per carrier.",
    "Seller nhỏ thường trả giá bán lẻ, còn tự mở tài khoản với từng hãng thì vướng thủ tục, mỗi hãng một hệ thống.",
    "小卖家通常只能按零售价付费，而自己向每家承运商开户既要办手续，又要分别使用不同系统。",
  ),
  "label_page.problem1_t": tr("High retail rates", "Giá bán lẻ cao", "零售价偏高"),
  "label_page.problem1_d": tr(
    "Buying single labels at public prices means overpaying on every order.",
    "Mua label lẻ ở giá công khai, mỗi đơn đều trả nhiều hơn mức giá đối tác.",
    "按公开价格零买面单，每一单都多付了钱。",
  ),
  "label_page.problem2_t": tr("One tool per carrier", "Mỗi hãng một nơi", "每家承运商一套系统"),
  "label_page.problem2_d": tr(
    "A separate account, wallet and print flow for each carrier makes reconciliation painful.",
    "USPS, UPS, FedEx, DHL mỗi nơi một tài khoản, một ví, một cách in. Quản lý rời rạc, đối soát mệt.",
    "每家承运商各有账户、钱包和打印流程，对账十分麻烦。",
  ),
  "label_page.problem3_t": tr("No help when things break", "Thiếu hỗ trợ khi có sự cố", "出问题时无人协助"),
  "label_page.problem3_d": tr(
    "Bad label, a cancel or a refund: who do you ask, and how long until a reply?",
    "Label lỗi, cần hủy, cần hoàn tiền: hỏi ai, bao lâu mới có phản hồi?",
    "面单出错、需要取消或退款时，该找谁，多久才有回复？",
  ),

  // ── Video ──
  "label_page.video_eyebrow": tr("The solution · Watch the video", "Giải pháp · Xem video", "解决方案 · 观看视频"),
  "label_page.video_title": tr("See how TH Group Label works.", "Xem TH Group Label hoạt động như thế nào.", "了解 TH Group Label 如何运作。"),
  "label_page.video_sub": tr(
    "A short video for sellers: buy USPS, UPS, FedEx and DHL labels 1–5% below retail, from the Seller Portal to the API.",
    "Một video ngắn cho seller: mua label USPS, UPS, FedEx, DHL thấp hơn giá bán lẻ 1–5%, từ Seller Portal đến API.",
    "面向卖家的简短视频：从卖家后台到 API，以低于零售价 1–5% 的价格购买 USPS、UPS、FedEx、DHL 面单。",
  ),
  "label_page.video_title_attr": tr("TH Group Label introduction video", "Video giới thiệu TH Group Label", "TH Group Label 介绍视频"),
  "label_page.vlist1": tr(
    "Genuine labels, connected directly to the carriers.",
    "Label mua chính thống, đấu nối trực tiếp tới hãng vận chuyển.",
    "正规面单，直连承运商。",
  ),
  "label_page.vlist2": tr(
    "Buy in the Seller Portal, see the price first, and pay exactly the quoted price.",
    "Mua trong Seller Portal, thấy giá trước khi trả, giá báo là giá trừ ví.",
    "在卖家后台购买，先看价格，按报价精确扣款。",
  ),
  "label_page.vlist3": tr(
    "Bulk import, API & Webhooks, and Shopify already integrated.",
    "Import hàng loạt, API & Webhooks, Shopify đã tích hợp sẵn.",
    "批量导入、API 与 Webhook，并已集成 Shopify。",
  ),
  "label_page.vlist4": tr(
    "1–5% off by volume, with Vietnamese-speaking support if anything goes wrong.",
    "Giảm 1–5% theo sản lượng, có hỗ trợ tiếng Việt khi có sai sót.",
    "按量最高优惠 1–5%，出现问题有越南语支持。",
  ),

  // ── Savings calculator ──
  "label_page.calc_eyebrow": tr("Savings estimate", "Ước tính tiết kiệm", "节省估算"),
  "label_page.calc_title": tr("How much could you keep each month?", "Mỗi tháng anh/chị có thể giữ lại bao nhiêu?", "每月可以省下多少？"),
  "label_page.calc_sub": tr(
    "Move the sliders to match your shop. Discount ranges from 1% to 5% below retail, depending on your monthly label volume.",
    "Kéo thanh trượt theo sản lượng thật của shop. Mức giảm từ 1% đến 5% so với giá bán lẻ, tùy lượng label khách mua mỗi tháng.",
    "拖动滑块以匹配您的店铺。优惠幅度为零售价的 1% 至 5%，取决于每月面单量。",
  ),
  "label_page.calc_n": tr("Labels per month", "Số label mỗi tháng", "每月面单数"),
  "label_page.calc_c": tr("Average retail price per label (USD)", "Giá bán lẻ trung bình mỗi label (USD)", "每张面单平均零售价（美元）"),
  "label_page.calc_d": tr("Discount vs. retail", "Mức giảm so với giá bán lẻ", "相对零售价的折扣"),
  "label_page.calc_note": tr(
    "Exact discounts follow the volume tiers in Pricing. Results are estimates; official quotes depend on carrier and service.",
    "Mức giảm cụ thể theo bậc sản lượng ở mục Bảng giá. Kết quả là ước tính, báo giá chính thức theo từng hãng và dịch vụ.",
    "具体折扣以价格部分的量级为准。结果仅为估算，正式报价取决于承运商和服务。",
  ),
  "label_page.calc_month": tr("Monthly savings", "Tiết kiệm mỗi tháng", "每月节省"),
  "label_page.calc_retail": tr("Label cost at retail", "Chi phí label theo giá bán lẻ", "按零售价的面单费用"),
  "label_page.calc_th": tr("Label cost with TH Group Label", "Chi phí label với TH Group Label", "使用 TH Group Label 的面单费用"),
  "label_page.calc_year": tr("Yearly savings", "Tiết kiệm mỗi năm", "每年节省"),
  "label_page.calc_cta": tr("Get a quote for your real volume", "Nhận báo giá theo sản lượng thật", "按您的实际量获取报价"),

  // ── How it works ──
  "label_page.how_eyebrow": tr("How it works", "Cách hoạt động", "运作方式"),
  "label_page.how_title": tr("One label wallet, three ways to buy.", "Một ví label, ba cách mua.", "一个面单钱包，三种购买方式。"),
  "label_page.how_sub": tr(
    "Pick what fits your volume and team. You can mix methods on one account.",
    "Chọn cách hợp với quy mô đơn và đội vận hành. Có thể kết hợp nhiều cách trên cùng một tài khoản.",
    "选择适合您订单量和团队的方式，同一账户可混合使用。",
  ),
  "label_page.step1_t": tr("Sign up & verify", "Đăng ký & xác minh", "注册与验证"),
  "label_page.step1_d": tr(
    "Share your shop details; TH Group opens your Seller Portal account with a tailored quote.",
    "Gửi thông tin shop, TH Group tạo tài khoản Seller Portal và báo giá riêng.",
    "提交店铺信息，TH Group 为您开通卖家后台账户并提供专属报价。",
  ),
  "label_page.step2_t": tr("Fund your Label wallet", "Nạp Label wallet", "充值面单钱包"),
  "label_page.step2_d": tr(
    "The Label wallet is separate from the POD wallet; each label deducts exactly the quoted price.",
    "Ví label tách riêng khỏi ví POD, mỗi label trừ đúng giá đã báo.",
    "面单钱包与 POD 钱包分开，每张面单按报价精确扣款。",
  ),
  "label_page.step3_t": tr("Buy labels", "Mua label", "购买面单"),
  "label_page.step3_d": tr(
    "Buy Label in the portal, Import a file or call the API, depending on how you manage orders.",
    "Buy Label trên portal, Import file hoặc gọi API, tùy cách anh/chị quản lý đơn.",
    "在后台点击 Buy Label、导入文件或调用 API，取决于您管理订单的方式。",
  ),
  "label_page.step4_t": tr("Download, track", "Tải label, theo dõi", "下载并跟踪"),
  "label_page.step4_d": tr(
    "Download the label from the order row and follow tracking and delivery status.",
    "Tải label ngay trên dòng đơn, theo dõi tracking và trạng thái giao hàng.",
    "在订单行直接下载面单，并跟踪物流与派送状态。",
  ),
  "label_page.tab_portal": tr("Seller Portal", "Seller Portal", "卖家后台"),
  "label_page.tab_import": tr("Import", "Import", "导入"),
  "label_page.tab_api": tr("API & Webhooks", "API & Webhooks", "API 与 Webhook"),
  "label_page.p1_title": tr(
    "Buy and manage labels in the Seller Portal",
    "Mua và quản lý label trên Seller Portal",
    "在卖家后台购买和管理面单",
  ),
  "label_page.p1_b1": tr(
    "Click Buy Label, enter recipient and parcel, see the price before you pay.",
    "Bấm Buy Label, nhập người nhận và kiện hàng, xem giá trước khi trả.",
    "点击 Buy Label，填写收件人和包裹，付款前先看价格。",
  ),
  "label_page.p1_b2": tr(
    "Filter by status and search by label, order #, tracking or recipient.",
    "Lọc theo trạng thái, tìm theo label, order #, tracking, người nhận.",
    "按状态筛选，按面单、订单号、运单号或收件人搜索。",
  ),
  "label_page.p1_b3": tr(
    "Download the label or Cancel right on each row.",
    "Tải label hoặc Cancel ngay trên từng dòng.",
    "直接在每一行下载面单或取消。",
  ),
  "label_page.p1_cta": tr("See the Seller Portal", "Xem Seller Portal", "查看卖家后台"),
  "label_page.p1_win": tr("Label wallet · example", "Label wallet · minh hoạ", "面单钱包 · 示例"),
  "label_page.th_label": tr("Label", "Label", "面单"),
  "label_page.th_recipient": tr("Recipient", "Người nhận", "收件人"),
  "label_page.th_price": tr("Price", "Giá", "价格"),
  "label_page.th_status": tr("Status", "Trạng thái", "状态"),
  "label_page.st_created": tr("Created", "Created", "已创建"),
  "label_page.st_failed": tr("Failed", "Failed", "失败"),
  "label_page.p2_title": tr(
    "Import a file, create labels in bulk",
    "Import file, tạo label hàng loạt",
    "导入文件，批量创建面单",
  ),
  "label_page.p2_b1": tr(
    "Export orders from your store to a file and click Import in the portal.",
    "Xuất đơn từ shop ra file, bấm Import trên portal.",
    "从店铺导出订单文件，在后台点击 Import。",
  ),
  "label_page.p2_b2": tr(
    "Each row becomes a label with a Purchasing, Created or Failed status.",
    "Mỗi dòng thành một label, hiện trạng thái Purchasing, Created hoặc Failed.",
    "每一行生成一张面单，显示 Purchasing、Created 或 Failed 状态。",
  ),
  "label_page.p2_b3": tr(
    "Export your label history to reconcile costs.",
    "Export lịch sử label để đối soát chi phí.",
    "导出面单历史以对账。",
  ),
  "label_page.p2_drop": tr("Drop your file here", "Kéo thả file vào đây", "将文件拖到此处"),
  "label_page.p3_title": tr(
    "API & Webhooks for your own systems",
    "API & Webhooks cho hệ thống riêng",
    "面向自有系统的 API 与 Webhook",
  ),
  "label_page.p3_b1": tr(
    "Plug into a partner's ERP, OMS or internal tools.",
    "Gắn thẳng vào ERP, OMS hoặc tool nội bộ của đối tác.",
    "直接接入合作伙伴的 ERP、OMS 或内部工具。",
  ),
  "label_page.p3_b2": tr(
    "Receive webhooks when a label changes status.",
    "Nhận webhook khi label đổi trạng thái.",
    "面单状态变化时接收 Webhook。",
  ),
  "label_page.p3_b3": tr(
    "Create API keys in the portal's API & Webhooks section.",
    "Tạo API key ngay trong mục API & Webhooks của portal.",
    "在后台的 API 与 Webhook 页面创建 API 密钥。",
  ),
  "label_page.p3_win": tr("Illustrative example", "Ví dụ minh hoạ", "示例"),

  // ── Features ──
  "label_page.feat_eyebrow": tr("Features", "Tính năng", "功能"),
  "label_page.feat_title": tr(
    "Everything for hundreds of labels a day.",
    "Đủ công cụ để vận hành hàng trăm label mỗi ngày.",
    "每天处理数百张面单所需的一切。",
  ),
  "label_page.feat1_t": tr("Quoted price is the price charged", "Giá báo trước, trừ đúng giá", "报价即扣款价"),
  "label_page.feat1_d": tr(
    "See the price before you pay. The quoted price is what leaves your wallet.",
    "Thấy giá trước khi trả. Giá đã báo là giá trừ trong ví, không phát sinh.",
    "付款前先看价格，钱包扣款即为报价，无额外费用。",
  ),
  "label_page.feat2_t": tr("Dedicated Label wallet", "Label wallet riêng", "独立面单钱包"),
  "label_page.feat2_d": tr(
    "Separate from the POD wallet, so balance and shipping spend stay clear.",
    "Ví label tách khỏi ví POD, dễ theo dõi số dư và chi phí vận chuyển.",
    "与 POD 钱包分开，余额和运费支出一目了然。",
  ),
  "label_page.feat3_t": tr("Import & Export", "Import & Export", "导入与导出"),
  "label_page.feat3_d": tr(
    "Import files to create labels in bulk, Export to reconcile.",
    "Import file để tạo label hàng loạt, Export để đối soát.",
    "导入文件批量创建面单，导出用于对账。",
  ),
  "label_page.feat4_t": tr("Clear statuses", "Trạng thái rõ ràng", "状态清晰"),
  "label_page.feat4_d": tr(
    "Created, Purchasing, Cancelling, Cancelled, Refunded, Failed. You always know where a label stands.",
    "Created, Purchasing, Cancelling, Cancelled, Refunded, Failed. Nhìn là biết label đang ở đâu.",
    "Created、Purchasing、Cancelling、Cancelled、Refunded、Failed，面单处于什么状态一看便知。",
  ),
  "label_page.feat5_t": tr("Download or cancel in place", "Tải label, Cancel tại chỗ", "就地下载或取消"),
  "label_page.feat5_d": tr(
    "Every order row has Label and Cancel buttons, no extra page needed.",
    "Mỗi dòng đơn có nút Label và Cancel, không cần mở thêm trang.",
    "每个订单行都有 Label 和 Cancel 按钮，无需打开其他页面。",
  ),
  "label_page.feat6_t": tr("Fast search", "Tìm kiếm nhanh", "快速搜索"),
  "label_page.feat6_d": tr(
    "Search by label, order #, tracking or recipient, and filter by date.",
    "Tìm theo label, order #, tracking hoặc người nhận, lọc theo thời gian.",
    "按面单、订单号、运单号或收件人搜索，并可按时间筛选。",
  ),
  "label_page.feat7_t": tr("Shopify", "Shopify", "Shopify"),
  "label_page.feat7_d": tr(
    "Shopify is built into the Seller Portal, so store orders and labels live in one place.",
    "Shopify đã được tích hợp sẵn trong Seller Portal, đơn của shop và label nằm cùng một nơi.",
    "Shopify 已内置于卖家后台，店铺订单与面单集中在一处。",
  ),
  "label_page.feat8_t": tr("API & Webhooks", "API & Webhooks", "API 与 Webhook"),
  "label_page.feat8_d": tr(
    "Create API keys and receive webhooks when label status changes.",
    "Tạo API key, nhận webhook khi trạng thái label thay đổi.",
    "创建 API 密钥，面单状态变化时接收 Webhook。",
  ),
  "label_page.feat9_t": tr("Support inside the portal", "Hỗ trợ ngay trong portal", "后台内置支持"),
  "label_page.feat9_d": tr(
    "Open a Request, report Trouble and read the Guide without switching channels.",
    "Gửi Request, báo Trouble, đọc Guide, không cần chuyển sang kênh khác.",
    "提交 Request、报告 Trouble、阅读 Guide，无需切换渠道。",
  ),

  // ── Carriers ──
  "label_page.car_eyebrow": tr("Carrier partners", "Đối tác vận chuyển", "承运商合作伙伴"),
  "label_page.car_title": tr(
    "One place to buy labels for the biggest US carriers.",
    "Một nơi mua label cho các hãng lớn nhất nước Mỹ.",
    "在一处购买美国主要承运商的面单。",
  ),
  "label_page.car_sub": tr(
    "TH Group buys labels directly from the carriers; you need one account and one wallet.",
    "TH Group mua label trực tiếp từ các hãng, anh/chị chỉ cần một tài khoản và một ví.",
    "TH Group 直接向承运商购买面单，您只需一个账户和一个钱包。",
  ),
  "label_page.car_usps": tr(
    "Ground Advantage, Priority Mail, Priority Mail Express, Media Mail.",
    "Ground Advantage, Priority Mail, Priority Mail Express, Media Mail.",
    "Ground Advantage、Priority Mail、Priority Mail Express、Media Mail。",
  ),
  "label_page.car_ups": tr(
    "US domestic ground and air services.",
    "Dịch vụ mặt đất và đường hàng không nội địa Mỹ.",
    "美国境内陆运与空运服务。",
  ),
  "label_page.car_fedex": tr(
    "Ground, Home Delivery and expedited services.",
    "Ground, Home Delivery và dịch vụ giao nhanh.",
    "Ground、Home Delivery 及加急服务。",
  ),
  "label_page.car_dhl": tr("DHL eCommerce and DHL Express.", "DHL eCommerce và DHL Express.", "DHL eCommerce 与 DHL Express。"),
  "label_page.car_more": tr("And other carriers on request.", "Và các hãng khác theo nhu cầu của đối tác.", "也可按需接入其他承运商。"),

  // ── Audience ──
  "label_page.who_eyebrow": tr("Who it's for", "Dành cho ai", "适合谁"),
  "label_page.who_title": tr(
    "Sellers and partners selling into the US.",
    "Seller và đối tác bán hàng vào thị trường Mỹ.",
    "面向美国市场的卖家与合作伙伴。",
  ),
  "label_page.who1_d": tr(
    "Small orders, many SKUs, cheap labels per parcel.",
    "Đơn nhỏ, nhiều SKU, cần label rẻ cho từng kiện.",
    "订单小、SKU 多，每个包裹都需要低价面单。",
  ),
  "label_page.who2_d": tr(
    "Buy from a supplier and ship straight to the end customer.",
    "Mua hàng từ nhà cung cấp rồi gửi thẳng cho khách cuối.",
    "从供应商采购后直接发给终端客户。",
  ),
  "label_page.who3_d": tr(
    "Self-ship from a US warehouse and meet each marketplace's handling deadline.",
    "Tự gửi hàng từ kho Mỹ, cần label đúng hạn xử lý của sàn.",
    "从美国仓库自发货，并满足各平台的处理时限。",
  ),
  "label_page.who4_t": tr("Partners & resellers", "Đối tác & reseller", "合作伙伴与分销商"),
  "label_page.who4_d": tr(
    "Resell labels to your own seller network through the API.",
    "Bán lại label cho mạng lưới seller của mình qua API.",
    "通过 API 向自己的卖家网络转售面单。",
  ),

  // ── Seller Portal ──
  "label_page.portal_title": tr(
    "See the THG Seller Portal.",
    "Xem Seller Portal của THG.",
    "查看 THG 卖家后台。",
  ),
  "label_page.portal_sub": tr(
    "This is the real THG Seller Portal. POD, Express, Warehouse, Dropship and Label orders are all managed in one interface with one set of wallets.",
    "Đây là Seller Portal thật của THG. Mọi đơn POD, Express, Warehouse, Dropship và Label đều được quản lý trong một giao diện, một bộ ví.",
    "这是 THG 真实的卖家后台。POD、Express、Warehouse、Dropship 和 Label 订单都在同一界面、同一套钱包中管理。",
  ),
  "label_page.shot_eyebrow": tr("Labels section, real interface", "Mục Labels, giao diện thật", "Labels 栏目，真实界面"),
  "label_page.shot_alt": tr("THG Seller Portal, Labels section", "Seller Portal của THG, mục Labels", "THG 卖家后台 Labels 栏目"),
  "label_page.leg1_t": tr("Wallets per service", "Ví theo dịch vụ", "按服务分设钱包"),
  "label_page.leg1_d": tr(
    "POD wallet and Label wallet are separate, with the balance visible on every page.",
    "POD wallet và Label wallet tách riêng, thấy số dư ở mọi trang.",
    "POD 钱包与面单钱包分开，每个页面都能看到余额。",
  ),
  "label_page.leg2_t": tr("Orders menu", "Menu Orders", "Orders 菜单"),
  "label_page.leg2_d": tr(
    "POD, Express, Warehouse, Labels and Dropship all sit under Orders.",
    "POD, Express, Warehouse, Labels, Dropship cùng nằm dưới Orders.",
    "POD、Express、Warehouse、Labels 和 Dropship 都在 Orders 下。",
  ),
  "label_page.leg3_d": tr(
    "Buy one label, import files in bulk, export history. The price shows before you pay and is the price charged.",
    "Mua từng label, import file hàng loạt, export lịch sử. Giá hiện trước khi trả, giá báo là giá trừ ví.",
    "单张购买、批量导入、导出历史。付款前显示价格，报价即扣款价。",
  ),
  "label_page.leg4_t": tr("Summary cards", "Thẻ tổng quan", "概览卡片"),
  "label_page.leg4_d": tr(
    "Total, Created, Cancelling, Cancelled and Refunded / Failed in one row.",
    "Tổng label, Created, Cancelling, Cancelled, Refunded / Failed trong một hàng.",
    "总数、Created、Cancelling、Cancelled 和 Refunded / Failed 同排显示。",
  ),
  "label_page.leg5_t": tr("Filter and search", "Lọc và tìm kiếm", "筛选与搜索"),
  "label_page.leg5_d": tr(
    "Filter by status, search by label, order #, tracking or recipient, and filter by date.",
    "Lọc theo trạng thái, tìm theo label, order #, tracking, người nhận, lọc theo thời gian.",
    "按状态筛选，按面单、订单号、运单号或收件人搜索，并按时间筛选。",
  ),
  "label_page.leg6_t": tr("Label table", "Bảng label", "面单列表"),
  "label_page.leg6_d": tr(
    "Price, tracking, purchase date, status and shipping state on one row.",
    "Giá, tracking, ngày mua, trạng thái và tình trạng giao hàng trên cùng một dòng.",
    "价格、运单号、购买日期、状态和派送情况显示在同一行。",
  ),
  "label_page.leg7_d": tr(
    "Download the label or cancel right on each row, with no extra page.",
    "Tải label hoặc hủy ngay trên từng dòng, không cần mở trang khác.",
    "直接在每一行下载或取消面单，无需打开其他页面。",
  ),
  "label_page.leg8_d": tr(
    "Connect your own systems through the API; Shopify is already integrated.",
    "Tích hợp hệ thống riêng qua API, Shopify đã kết nối sẵn.",
    "通过 API 接入自有系统，Shopify 已连接。",
  ),
  "label_page.portal_cta": tr("Get a Seller Portal account", "Nhận tài khoản Seller Portal", "获取卖家后台账户"),

  // ── Guarantee ──
  "label_page.gar_eyebrow": tr("Assurance & insurance", "Cam kết & bảo hiểm", "保障与保险"),
  "label_page.gar_title": tr(
    "Clean labels, genuine source, covered if anything goes wrong.",
    "Label sạch, nguồn chính thống, có bảo đảm khi sai sót.",
    "面单干净、来源正规，出错有保障。",
  ),
  "label_page.gar1_t": tr("Genuinely purchased", "Mua chính thống", "正规购买"),
  "label_page.gar1_d": tr(
    "100% of labels are purchased genuinely from the carrier, never resold or reused labels.",
    "100% label được mua chính thống từ hãng vận chuyển, không phải label trôi nổi hay tái sử dụng.",
    "100% 面单均向承运商正规购买，绝非转售或重复使用的面单。",
  ),
  "label_page.gar2_t": tr("Direct connection", "Đấu nối trực tiếp", "直连承运商"),
  "label_page.gar2_d": tr(
    "Connected directly to USPS and the official postal system. Tracking is the carrier's own tracking.",
    "Kết nối trực tiếp tới USPS và hệ thống bưu điện chính thống. Tracking là tracking thật của hãng.",
    "直接连接 USPS 及官方邮政系统，物流追踪即承运商自身的追踪。",
  ),
  "label_page.gar3_t": tr("Refund for failed labels", "Hoàn tiền label lỗi", "失败面单退款"),
  "label_page.gar3_d": tr(
    "Failed or validly cancelled labels are refunded to your Label wallet.",
    "Label Failed hoặc huỷ hợp lệ được xử lý hoàn vào Label wallet.",
    "失败或合规取消的面单将退回您的面单钱包。",
  ),
  "label_page.gar4_t": tr("Compensation for errors", "Bồi thường khi sai sót", "出错赔付"),
  "label_page.gar4_d": tr(
    "Errors caused by the label or by TH Group are handled and compensated under the terms.",
    "Sai sót do label hoặc phía TH Group được TH Group chịu trách nhiệm xử lý và bồi thường theo điều khoản.",
    "因面单或 TH Group 造成的错误，由 TH Group 按条款负责处理和赔付。",
  ),
  "label_page.seal_t": tr("Parcel insurance", "Bảo hiểm hàng hóa", "包裹保险"),
  "label_page.seal_d": tr(
    "Some carrier services include basic coverage under the carrier's rules, and higher coverage can be added.",
    "Một số dịch vụ của hãng đã gồm bảo hiểm cơ bản theo quy định của hãng, có thể mua thêm mức bảo hiểm cao hơn.",
    "部分承运商服务按其规定含基础保障，也可加购更高保额。",
  ),

  // ── Ecosystem ──
  "label_page.eco_eyebrow": tr("TH Group ecosystem", "Hệ sinh thái TH Group", "TH Group 生态"),
  "label_page.eco_title": tr(
    "Label is the fifth link in the fulfillment chain.",
    "Label là mắt xích thứ 5 trong chuỗi fulfill.",
    "Label 是履约链条中的第 5 环。",
  ),
  "label_page.eco_sub": tr(
    "From VN/CN sourcing and US warehousing to the last-mile label: one team, one system, one place to ask.",
    "Từ nguồn hàng VN/CN, kho Mỹ đến label giao cuối: một đội, một hệ thống, một nơi để hỏi.",
    "从越南/中国货源、美国仓储到末端面单：一支团队、一套系统、一个咨询入口。",
  ),
  "label_page.eco_fulfill": tr(
    "POD printing in VN, CN and the US; trending-product dropship.",
    "In POD tại VN, CN và Mỹ, dropship sản phẩm trending.",
    "越南、中国和美国 POD 印刷，热销产品代发。",
  ),
  "label_page.eco_express": tr(
    "International VN/CN to US/UK with real-time tracking.",
    "Vận chuyển quốc tế VN/CN đến Mỹ/Anh, theo dõi thời gian thực.",
    "越南/中国至美国/英国国际运输，实时追踪。",
  ),
  "label_page.eco_warehouse": tr(
    "US domestic fulfillment from $1.2, storage and inventory via OMS/WMS.",
    "Fulfill nội địa Mỹ từ $1.2, lưu kho và quản lý tồn qua OMS/WMS.",
    "美国境内履约低至 $1.2，通过 OMS/WMS 管理仓储与库存。",
  ),
  "label_page.eco_dropship": tr(
    "Taobao/1688 sourcing, delivered straight to the US.",
    "Sourcing Taobao/1688, giao thẳng đến Mỹ.",
    "淘宝/1688 采购，直送美国。",
  ),
  "label_page.eco_label": tr(
    "USPS, UPS, FedEx and DHL labels below retail.",
    "Label USPS, UPS, FedEx, DHL giá thấp hơn bán lẻ.",
    "低于零售价的 USPS、UPS、FedEx、DHL 面单。",
  ),
  "label_page.eco_more": tr("Learn more", "Tìm hiểu thêm", "了解更多"),
  "label_page.eco_here": tr("You are here", "Bạn đang ở đây", "您在这里"),

  // ── Pricing ──
  "label_page.price_eyebrow": tr("Pricing", "Bảng giá", "价格"),
  "label_page.price_title": tr(
    "The more you buy, the deeper the discount: 1% to 5%.",
    "Mua càng nhiều, giảm càng sâu: từ 1% đến 5%.",
    "买得越多折扣越大：1% 至 5%。",
  ),
  "label_page.price_sub": tr(
    "Discounts apply to each carrier's and service's retail price, based on your monthly label volume.",
    "Mức giảm tính trên giá bán lẻ của từng hãng và dịch vụ, tùy lượng label khách mua mỗi tháng.",
    "折扣基于各承运商和服务的零售价，取决于您每月的面单量。",
  ),
  "label_page.tier": tr("Tier", "Bậc", "档位"),
  "label_page.tier_best": tr("Best rate", "Tốt nhất", "最优"),
  "label_page.tier1_d": tr("Off retail. Fits sellers just starting out.", "Giảm so với giá bán lẻ. Phù hợp seller mới bắt đầu.", "低于零售价，适合刚起步的卖家。"),
  "label_page.tier2_d": tr("Off retail for growing shops.", "Giảm so với giá bán lẻ cho shop đang tăng trưởng.", "低于零售价，适合成长中的店铺。"),
  "label_page.tier3_d": tr("Off retail for established shops.", "Giảm so với giá bán lẻ cho shop ổn định.", "低于零售价，适合稳定经营的店铺。"),
  "label_page.tier4_d": tr("Off retail for high-volume shops.", "Giảm so với giá bán lẻ cho shop sản lượng lớn.", "低于零售价，适合大批量店铺。"),
  "label_page.tier5_d": tr(
    "Deepest discount, for partners and resellers.",
    "Mức giảm cao nhất, dành cho đối tác và reseller.",
    "折扣最高，面向合作伙伴和分销商。",
  ),
  "label_page.tier_cta": tr("Get a quote", "Nhận báo giá", "获取报价"),
  "label_page.tier_cta_partner": tr("Contact partnerships", "Liên hệ đội đối tác", "联系合作团队"),
  "label_page.price_note": tr(
    "Volume bands for each tier are confirmed by TH Group when you request a quote.",
    "Dải sản lượng của từng bậc sẽ do TH Group xác nhận khi báo giá.",
    "各档位的量级区间由 TH Group 在报价时确认。",
  ),

  // ── Final CTA + legal ──
  "label_page.final_eyebrow": tr("Get started", "Bắt đầu", "立即开始"),
  "label_page.final_title": tr(
    "Get a Label quote for your volume.",
    "Nhận báo giá Label theo sản lượng của shop.",
    "按您的面单量获取报价。",
  ),
  "label_page.final_sub": tr(
    "Send your expected volume and the TH Group team replies within 24 hours.",
    "Gửi sản lượng dự kiến, đội TH Group phản hồi trong 24 giờ.",
    "告知预计面单量，TH Group 团队将在 24 小时内回复。",
  ),
  "label_page.final1": tr("Free consultation", "Tư vấn miễn phí", "免费咨询"),
  "label_page.final2": tr("No commitment", "Không cam kết", "无需承诺"),
  "label_page.final3": tr("Vietnamese-speaking support", "Hỗ trợ tiếng Việt", "越南语支持"),
  "label_page.legal": tr(
    "USPS®, Priority Mail®, Ground Advantage™, UPS®, FedEx® and DHL® are trademarks of their respective owners. TH Group is an authorized label reseller and is not owned by or affiliated with any carrier.",
    "USPS®, Priority Mail®, Ground Advantage™, UPS®, FedEx® và DHL® là nhãn hiệu của chủ sở hữu tương ứng. TH Group là đơn vị bán lại label được ủy quyền, không thuộc sở hữu hay liên kết với bất kỳ hãng vận chuyển nào.",
    "USPS®、Priority Mail®、Ground Advantage™、UPS®、FedEx® 和 DHL® 为各自所有者的商标。TH Group 是授权面单分销商，与任何承运商均无所有权或隶属关系。",
  ),

  // ── FAQ ──
  "label_faq.title": tr("Frequently asked questions", "Câu hỏi thường gặp", "常见问题"),
  "label_faq.q1": tr("Are TH Group labels genuine?", "Label của TH Group có phải label chính thống không?", "TH Group 的面单是正规面单吗？"),
  "label_faq.a1": tr(
    "Yes. TH Group buys labels genuinely, connected directly to USPS and the official postal system, and 100% of labels are clean labels. Tracking numbers are the carrier's own. TH Group is not a part of USPS or any other carrier.",
    "Có. TH Group mua label chính thống, đấu nối trực tiếp tới USPS và hệ thống bưu điện chính thống, và 100% label là label sạch. Mã tracking là mã thật của hãng vận chuyển. TH Group không phải là một bộ phận của USPS hay các hãng khác.",
    "是的。TH Group 正规购买面单，直连 USPS 及官方邮政系统，100% 为干净面单。运单号为承运商真实运单号。TH Group 不是 USPS 或其他承运商的一部分。",
  ),
  "label_faq.q2": tr("What happens if a label has an error?", "Nếu label có sai sót thì sao?", "面单出错怎么办？"),
  "label_faq.a2": tr(
    "Open a Request or report Trouble in the Seller Portal. For errors caused by the label or by TH Group, TH Group handles it and compensates under the agreed terms.",
    "Gửi Request hoặc báo Trouble ngay trong Seller Portal. Với sai sót do label hoặc do phía TH Group, TH Group chịu trách nhiệm xử lý và bồi thường theo điều khoản đã thống nhất.",
    "在卖家后台提交 Request 或报告 Trouble。因面单或 TH Group 造成的错误，TH Group 将按约定条款负责处理并赔付。",
  ),
  "label_faq.q3": tr("Is my parcel insured?", "Hàng hóa có được bảo hiểm không?", "包裹有保险吗？"),
  "label_faq.a3": tr(
    "Some carrier services include basic coverage under the carrier's rules, and the amount varies by service. Extra coverage can be added for high-value parcels.",
    "Một số dịch vụ của hãng đã gồm bảo hiểm cơ bản theo quy định của hãng, mức cụ thể khác nhau theo từng dịch vụ. Có thể mua thêm bảo hiểm cho hàng giá trị cao.",
    "部分承运商服务按其规定含基础保障，额度因服务而异。高价值包裹可加购保险。",
  ),
  "label_faq.q4": tr("Can the price change when I buy?", "Giá hiển thị có bị thay đổi khi mua không?", "购买时价格会变吗？"),
  "label_faq.a4": tr(
    "No. The price is shown before you buy, and the quoted price is the price charged to your Label wallet.",
    "Không. Giá hiển thị trước khi mua và giá đã báo là giá trừ trong Label wallet.",
    "不会。购买前会显示价格，报价即从面单钱包扣除的价格。",
  ),
  "label_faq.q5": tr("How is the 1–5% discount applied?", "Mức giảm 1–5% được tính như thế nào?", "1–5% 的折扣如何计算？"),
  "label_faq.a5": tr(
    "The discount applies to each carrier's and service's retail price and rises with your monthly label volume. Volume bands for each tier are confirmed in your quote.",
    "Mức giảm tính trên giá bán lẻ của từng hãng và dịch vụ, tăng dần theo lượng label khách mua mỗi tháng. Dải sản lượng từng bậc được xác nhận khi báo giá.",
    "折扣基于各承运商和服务的零售价，并随每月面单量提高。各档位的量级区间在报价时确认。",
  ),
  "label_faq.q6": tr(
    "Can I get a refund for a failed or unused label?",
    "Label lỗi hoặc không dùng, có được hoàn tiền không?",
    "失败或未使用的面单可以退款吗？",
  ),
  "label_faq.a6": tr(
    "Failed or validly cancelled labels are refunded to your Label wallet. Status shows clearly: Cancelling, Cancelled, Refunded.",
    "Label Failed hoặc huỷ hợp lệ được hoàn vào Label wallet. Trạng thái huỷ hiển thị rõ: Cancelling, Cancelled, Refunded.",
    "失败或合规取消的面单将退回面单钱包。取消状态清晰显示：Cancelling、Cancelled、Refunded。",
  ),
  "label_faq.q7": tr("Do I need my own carrier account?", "Tôi chưa có tài khoản với hãng vận chuyển thì có dùng được không?", "我需要自己的承运商账户吗？"),
  "label_faq.a7": tr(
    "No. You only need a TH Group Seller Portal account.",
    "Không cần. Anh/chị chỉ cần tài khoản Seller Portal của TH Group.",
    "不需要，只需一个 TH Group 卖家后台账户。",
  ),
  "label_faq.q8": tr("How can I buy labels?", "Mua label bằng những cách nào?", "如何购买面单？"),
  "label_faq.a8": tr(
    "Three ways: Buy Label in the Seller Portal, bulk file Import, or API & Webhooks for your own system. Shopify is already integrated in the portal.",
    "Ba cách: Buy Label trên Seller Portal, Import file hàng loạt, hoặc API & Webhooks cho hệ thống riêng. Shopify đã được tích hợp sẵn trong portal.",
    "三种方式：在卖家后台 Buy Label、批量文件 Import，或为自有系统使用 API 与 Webhook。后台已集成 Shopify。",
  ),
  "label_faq.q9": tr(
    "Can I combine it with TH Group Fulfill and Warehouse?",
    "Có dùng chung với Fulfill, Warehouse của TH Group được không?",
    "可以与 TH Group Fulfill、Warehouse 搭配使用吗？",
  ),
  "label_faq.a9": tr(
    "Yes. In the same Seller Portal, Labels sits under Orders next to POD, Express, Warehouse and Dropship.",
    "Được. Cùng một Seller Portal, Label là một mục trong Orders cạnh POD, Express, Warehouse và Dropship.",
    "可以。在同一卖家后台中，Labels 与 POD、Express、Warehouse、Dropship 一同位于 Orders 下。",
  ),
};

// Imported for this side effect by every module that uses these keys.
registerTranslations(labelTranslations);
