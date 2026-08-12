import { tr, localize, type Locale, type LocalizedText } from "@/shared/i18n";

// Feature-scoped, localized PRESENTATION copy for the THG Fulfill route (WEB-002). This is the
// section chrome — eyebrows, section titles, journey/capability labels, empty-state and CTA
// copy — NOT business data: hero supporting text, operational bullets, catalog products and the
// FAQ come from the CMS (see server/loaders.ts) and only fall back to the localized defaults
// here when a CMS read is empty/unavailable. Values are the approved prototype's VI voice
// (thg-fulfill-definitive.html) with EN/ZH taken from the verified production dictionary
// (Vite src/lib/i18n/translations/fulfill.ts). Kept inside the feature boundary rather than the
// shared marketing dictionary because it is Fulfill-specific scaffolding; promote to the shared
// dictionary only if a second route needs it.
//
// Modelled by DOMAIN, not by locale: the Fulfill copy tree is defined ONCE, with each field a
// LocalizedText (tr(vi, en, zh)); getFulfillContent(locale) resolves it to the flat FulfillCopy the
// components consume. Stable structural values that are the same in every locale — the operations
// badge, the "STEP nn / 04" index rail, catalog image paths — are plain invariant strings, keeping
// domain structure (ordering, IDs, assets) separate from localized presentation. The consumer API
// (FulfillCopy + getFulfillContent) is unchanged.

export interface FulfillStepCopy {
  /** e.g. "STEP 01 / 04" — the mono index rail. */
  index: string;
  title: string;
  description: string;
}

export interface FulfillCapabilityCopy {
  title: string;
  description: string;
}

/** One seller challenge: a numbered pain the service answers. */
export interface FulfillPainCopy {
  /** Stable rail number, e.g. "01" — structural, identical in every locale. */
  num: string;
  title: string;
  description: string;
}

export interface FulfillCopy {
  /** Art-directed H1 (the prototype's visual contract); CMS hero_sub supplies the paragraph. */
  heroHeadline: string;
  heroSubtitleFallback: string;
  heroBadge: string;
  /** Default operational rail chips when the CMS returned no bullets. */
  pointsFallback: readonly string[];

  /** Seller-challenge chapter restored from the Vite page (R3 content parity). */
  painEyebrow: string;
  painTitle: string;
  pains: readonly [FulfillPainCopy, FulfillPainCopy, FulfillPainCopy, FulfillPainCopy];

  journeyEyebrow: string;
  journeyTitle: string;
  journeyIntro: string;
  journeyReference: string;
  steps: readonly [FulfillStepCopy, FulfillStepCopy, FulfillStepCopy, FulfillStepCopy];

  capabilitiesEyebrow: string;
  capabilitiesTitle: string;
  capabilitiesIntro: string;
  capabilities: {
    network: FulfillCapabilityCopy;
    qc: FulfillCapabilityCopy;
    pack: FulfillCapabilityCopy;
    hub: FulfillCapabilityCopy;
    intake: FulfillCapabilityCopy;
    print: FulfillCapabilityCopy;
    advisory: FulfillCapabilityCopy;
  };
  /** Static, explanatory Hub visibility panel (replaces the prototype's fake live ledger). */
  hubStages: readonly [string, string, string, string];
  hubCaption: string;

  catalogEyebrow: string;
  catalogTitle: string;
  catalogIntro: string;
  catalogEmpty: string;
  catalogExploreAll: string;
  catalogFallback: readonly { name: string; image: string; alt: string }[];

  /** Hero infrastructure badge (the "✦ [...]" eyebrow above the H1). */
  heroInfraBadge: string;
  /** The art-directed page H1. */
  heroHeadlineLong: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  // The hero flow-diagram labels (POD process / blank / print / finished / your brand) are NOT
  // here: parity-content.ts already owns them as podProcess/blankTshirt/dtgPrint/brandedProduct/
  // yourBrand. The hero reads them from there rather than growing a second spelling.

  /** Process movement chrome — was three inline locale objects inside the component. */
  processEyebrow: string;
  processTitle: string;
  processLead: string;
  processHonesty: string;

  /** Manufacturing showcase chrome. */
  showcaseEyebrow: string;
  showcaseTitle: string;


  consultEyebrow: string;
  consultTitle: string;
  consultIntro: string;
  consultCta: string;

  faqEyebrow: string;
  faqTitle: string;
  faqIntro: string;
  faqEmpty: string;
  faqAskCommunity: string;
}

// ─── Localized source (defined once) ──────────────────────────────────────────────────────────
// Each field carries all three locales via tr(vi, en, zh); `index` and `image` are locale-invariant
// structural values (plain strings). Types mirror FulfillCopy with LocalizedText leaves, giving the
// same compile-time locale + field guarantees without three physical copies of the tree.

interface FulfillStepSource {
  index: string;
  title: LocalizedText;
  description: LocalizedText;
}
interface FulfillCapabilitySource {
  title: LocalizedText;
  description: LocalizedText;
}
interface FulfillCatalogSource {
  /** Catalogue identity, not copy — a product name is the same string in every locale. */
  name: string;
  image: string;
  alt: LocalizedText;
}

interface FulfillPainSource {
  num: string;
  title: LocalizedText;
  description: LocalizedText;
}

interface FulfillCopySource {
  heroHeadline: LocalizedText;
  heroSubtitleFallback: LocalizedText;
  heroBadge: string;
  pointsFallback: readonly [LocalizedText, LocalizedText, LocalizedText];
  painEyebrow: LocalizedText;
  painTitle: LocalizedText;
  pains: readonly [FulfillPainSource, FulfillPainSource, FulfillPainSource, FulfillPainSource];
  journeyEyebrow: LocalizedText;
  journeyTitle: LocalizedText;
  journeyIntro: LocalizedText;
  journeyReference: LocalizedText;
  steps: readonly [FulfillStepSource, FulfillStepSource, FulfillStepSource, FulfillStepSource];
  capabilitiesEyebrow: LocalizedText;
  capabilitiesTitle: LocalizedText;
  capabilitiesIntro: LocalizedText;
  capabilities: Readonly<Record<keyof FulfillCopy["capabilities"], FulfillCapabilitySource>>;
  hubStages: readonly [LocalizedText, LocalizedText, LocalizedText, LocalizedText];
  hubCaption: LocalizedText;
  catalogEyebrow: LocalizedText;
  catalogTitle: LocalizedText;
  catalogIntro: LocalizedText;
  catalogEmpty: LocalizedText;
  catalogExploreAll: LocalizedText;
  catalogFallback: readonly [FulfillCatalogSource, FulfillCatalogSource, FulfillCatalogSource];
  heroInfraBadge: LocalizedText;
  heroHeadlineLong: LocalizedText;
  heroPrimaryCta: LocalizedText;
  heroSecondaryCta: LocalizedText;
  processEyebrow: LocalizedText;
  processTitle: LocalizedText;
  processLead: LocalizedText;
  processHonesty: LocalizedText;
  showcaseEyebrow: LocalizedText;
  showcaseTitle: LocalizedText;
  consultEyebrow: LocalizedText;
  consultTitle: LocalizedText;
  consultIntro: LocalizedText;
  consultCta: LocalizedText;
  faqEyebrow: LocalizedText;
  faqTitle: LocalizedText;
  faqIntro: LocalizedText;
  faqEmpty: LocalizedText;
  faqAskCommunity: LocalizedText;
}

const SOURCE: FulfillCopySource = {
  heroHeadline: tr(
    "Vận hành ẩn, hiển thị rõ ràng.",
    "Make invisible operations visible.",
    "让隐形的运营变得可见。",
  ),
  heroSubtitleFallback: tr(
    "Hệ thống điều phối chính xác. THG tiếp nhận, xử lý, kiểm tra và đóng gói sản phẩm của bạn — mọi trạng thái vận hành đều nhìn thấy được.",
    "A precise coordination system. THG receives, processes, inspects and packs your products — every operational state stays visible.",
    "精确的协调系统。THG 接收、处理、检验并包装您的产品——每个运营状态都清晰可见。",
  ),
  heroBadge: "THG Fulfillment Operations",
  pointsFallback: [
    tr("VN/CN/US POD", "VN/CN/US POD", "VN/CN/US POD"),
    tr("Item-level QC", "Item-level QC", "逐单质检"),
    tr("Chuẩn TMĐT Mỹ", "US e-com standard", "美国电商标准"),
  ],

  // Seller-challenge chapter — copy ported VERBATIM from the Vite production dictionary
  // (src/lib/i18n/translations/fulfill.ts, keys fulfill_page.pain*). Note the argument order
  // differs between the repos: Vite's tr() is (en, vi, zh), this one is (vi, en, zh).
  painEyebrow: tr("Nỗi đau của Seller", "Seller Challenges", "卖家的挑战"),
  painTitle: tr(
    "Seller Việt bán TMĐT Mỹ đang gặp vấn đề gì?",
    "What challenges are Vietnamese sellers facing?",
    "越南卖家面临什么挑战？",
  ),
  pains: [
    {
      num: "01",
      title: tr("Vận chuyển", "Shipping", "运输"),
      description: tr(
        "Vận chuyển VN/CN → US mất 10-20 ngày, khách hủy đơn.",
        "Shipping VN/CN → US takes 10-20 days, customers cancel orders.",
        "越南/中国到美国需要10-20天，客户取消订单。",
      ),
    },
    {
      num: "02",
      title: tr("Chi phí", "Cost", "成本"),
      description: tr(
        "Sản xuất chậm, basecost cao → khó cạnh tranh.",
        "Slow production, high basecost → hard to compete.",
        "生产慢，basecost高→难以竞争。",
      ),
    },
    {
      num: "03",
      title: tr("Hệ thống", "System", "系统"),
      description: tr(
        "Quản lý đơn & SKU rối rắm, dễ sai sót.",
        "Messy order & SKU management, easy errors.",
        "订单和SKU管理混乱，容易出错。",
      ),
    },
    {
      num: "04",
      title: tr("Kiểm soát", "Control", "控制"),
      description: tr(
        "Support chậm, nhiều phí ẩn → khó scale.",
        "Slow support, hidden fees → hard to scale.",
        "支持慢，隐藏费用→难以扩展。",
      ),
    },
  ],

  journeyEyebrow: tr("Hành trình", "The journey", "旅程"),
  journeyTitle: tr("Từ bản nhập đến đơn vị hoàn chỉnh.", "From input to a finished unit.", "从输入到成品单元。"),
  journeyIntro: tr(
    "Hành trình xử lý không phải hộp đen. Mọi trạng thái vận hành được ghi nhận trực tiếp lên hồ sơ của vật thể.",
    "The handling journey is not a black box — every operational state is recorded onto the unit's own file.",
    "处理过程不是黑箱——每个运营状态都记录在该单元自身的档案中。",
  ),
  journeyReference: tr(
    "Design input & finished unit là hai product reference riêng biệt — minh họa các bước, không phải một tấm ảnh biến hình.",
    "Design input and finished unit are two separate product references — they illustrate the steps, not a single morphing image.",
    "设计输入与成品单元是两个独立的产品参照——用于说明各步骤，而非同一张变形图片。",
  ),
  steps: [
    {
      index: "STEP 01 / 04",
      title: tr("Design Input", "Design Input", "Design Input"),
      description: tr(
        "Tiếp nhận sản phẩm & file thiết kế, gắn định danh (ID) vận hành cho từng đơn vị.",
        "Receive products and design files, assigning an operational ID to every unit.",
        "接收产品与设计文件，为每个单元分配运营ID。",
      ),
    },
    {
      index: "STEP 02 / 04",
      title: tr("Processing · POD", "Processing · POD", "Processing · POD"),
      description: tr(
        "In POD (DTG/DTF) độ phân giải cao tại VN · CN · US.",
        "High-resolution POD printing (DTG/DTF) in Vietnam, China and the US.",
        "在越南·中国·美国进行高分辨率POD打印（DTG/DTF）。",
      ),
    },
    {
      index: "STEP 03 / 04",
      title: tr("Quality Assurance", "Quality Assurance", "Quality Assurance"),
      description: tr(
        "QC từng đơn: định dạng, màu sắc, chất lượng in — chuẩn TMĐT Mỹ.",
        "Item-level QC: file format, color and print quality — to US eCommerce standard.",
        "逐单质检：文件格式、颜色与印刷质量——达到美国电商标准。",
      ),
    },
    {
      index: "STEP 04 / 04",
      title: tr("Dispatch Ready", "Dispatch Ready", "Dispatch Ready"),
      description: tr(
        "Đóng gói chuẩn quy cách, dán nhãn vận chuyển + tracking.",
        "Standards-compliant packing with a shipping label and tracking.",
        "按规范包装，贴运输标签并提供追踪。",
      ),
    },
  ],

  capabilitiesEyebrow: tr("Năng lực", "Capabilities", "能力"),
  capabilitiesTitle: tr(
    "Fulfill là một hệ thống, không chỉ là in ấn.",
    "Fulfill is a system, not just printing.",
    "Fulfill 是一套系统，而不仅是印刷。",
  ),
  capabilitiesIntro: tr(
    "Các nhóm năng lực một đơn vị đi qua trước khi sẵn sàng bàn giao.",
    "The capability groups every unit passes through before it is ready to dispatch.",
    "每个单元在准备发运之前所经过的能力环节。",
  ),
  capabilities: {
    network: {
      title: tr("Cross-border network", "Cross-border network", "Cross-border network"),
      description: tr(
        "Xưởng POD tại VN · CN và fulfill nội địa US — định tuyến theo sản phẩm & điểm đến.",
        "POD workshops in VN · CN and US domestic fulfillment — routed by product and destination.",
        "越南·中国的POD车间与美国本土履约——按产品与目的地路由。",
      ),
    },
    qc: {
      title: tr("Item-level QC", "Item-level QC", "Item-level QC"),
      description: tr(
        "Kiểm tra chất lượng từng đơn trước khi đóng gói.",
        "Quality-checking every order before it is packed.",
        "在包装前检查每一个订单的质量。",
      ),
    },
    pack: {
      title: tr("Đóng gói chuẩn Mỹ", "US standard packing", "US standard packing"),
      description: tr(
        "Đóng gói chuẩn TMĐT Mỹ, dán nhãn + tracking.",
        "US eCommerce-standard packing with label and tracking.",
        "美国电商标准包装，附标签与追踪。",
      ),
    },
    hub: {
      title: tr("Hub System", "Hub System", "Hub System"),
      description: tr(
        "Trạng thái đơn hàng & sản phẩm hiển thị theo từng bước — không cần dò file thủ công.",
        "Order and product status visible step by step — no manual file digging.",
        "订单与产品状态按步骤可见——无需手动翻查文件。",
      ),
    },
    intake: {
      title: tr("Tiếp nhận & định danh", "Intake & ID", "Intake & ID"),
      description: tr(
        "Tiếp nhận sản phẩm & file, gắn định danh vận hành.",
        "Receiving products and files, assigning an operational ID.",
        "接收产品与文件，分配运营标识。",
      ),
    },
    print: {
      title: tr("POD & cá nhân hóa", "POD & personalization", "POD & personalization"),
      description: tr(
        "In DTG/DTF độ phân giải cao theo yêu cầu.",
        "High-resolution DTG/DTF printing on demand.",
        "按需高分辨率DTG/DTF打印。",
      ),
    },
    advisory: {
      title: tr("Tư vấn", "Consultation", "Consultation"),
      description: tr(
        "Tư vấn theo loại sản phẩm và nhu cầu cụ thể.",
        "Advice tailored to your product type and specific needs.",
        "根据您的产品类型与具体需求提供咨询。",
      ),
    },
  },
  hubStages: [
    tr("Nhận", "Received", "已接收"),
    tr("Xử lý", "Processing", "处理中"),
    tr("QC", "QC", "质检"),
    tr("Đóng gói", "Packed", "已打包"),
  ],
  hubCaption: tr(
    "Hub System hiển thị trạng thái theo từng bước xử lý cho đội vận hành của bạn.",
    "Hub System surfaces status at each processing stage for your operations team.",
    "Hub System 在每个处理阶段向您的运营团队显示状态。",
  ),

  catalogEyebrow: tr("Danh mục", "Catalog", "目录"),
  catalogTitle: tr("Hệ sinh thái sản phẩm", "Product ecosystem", "产品生态"),
  catalogIntro: tr(
    "Ảnh sản phẩm thật từ danh mục POD của THG.",
    "Real product photography from THG's POD catalog.",
    "来自THG POD目录的真实产品照片。",
  ),
  catalogEmpty: tr(
    "Danh mục sản phẩm đang được cập nhật. Liên hệ tư vấn để nhận catalog đầy đủ.",
    "The product catalog is being updated. Request a consultation for the full catalog.",
    "产品目录正在更新。请咨询以获取完整目录。",
  ),
  catalogExploreAll: tr("Khám phá toàn bộ Catalog", "Explore the full catalog", "浏览完整目录"),

  heroInfraBadge: tr(
    "HẠ TẦNG FULFILLMENT TOÀN CẦU",
    "GLOBAL FULFILLMENT INFRASTRUCTURE",
    "全球履约基础设施",
  ),
  heroHeadlineLong: tr(
    "Hạ Tầng Fulfill Xuyên Quốc Gia Cho Doanh Nghiệp TMĐT Thế Hệ Mới.",
    "Cross-border fulfillment infrastructure for the next generation of eCommerce.",
    "为新一代电商打造的跨境履约基础设施。",
  ),

  heroPrimaryCta: tr("Tư vấn ngay", "Talk to us", "立即咨询"),
  heroSecondaryCta: tr("Xem năng lực hệ thống", "See system capability", "查看系统能力"),

  processEyebrow: tr("Quy trình vận hành", "Operational loop", "运营循环"),
  processTitle: tr(
    "Mỗi đơn chạy qua 5 giai đoạn — không có hộp đen.",
    "Every order runs 5 stages — no black box.",
    "每个订单经历5个阶段——无黑箱。",
  ),
  processLead: tr(
    "Từ upload file đến tracking handoff: đây là hệ thống thực tế của THG, không phải sơ đồ trình chiếu.",
    "From file upload to tracking handoff: this is THG's real system, not a slide deck diagram.",
    "从文件上传到追踪交接：这是THG的真实系统，而非演示文稿示意图。",
  ),
  processHonesty: tr(
    "Mỗi stage trên là quy trình thực tế — không phải sơ đồ lý tưởng. Kỹ thuật (DTG/DTF, CSV intake, Hub System) đều đang vận hành.",
    "Every stage above reflects actual operational process — not an ideal-state diagram. Technologies (DTG/DTF, CSV intake, Hub System) are currently in operation.",
    "以上每个阶段均为实际操作流程——并非理想化示意图。技术（DTG/DTF、CSV接单、Hub System）均在运行中。",
  ),

  showcaseEyebrow: tr(
    "XƯỞNG SẢN XUẤT & FULFILLMENT THG",
    "THG MANUFACTURING & FULFILLMENT STUDIO",
    "THG 制造与履约工作室",
  ),
  showcaseTitle: tr(
    "Năng Lực In Ấn POD & Đóng Gói Chuẩn TMĐT Mỹ — Vận Hành Từng Đơn Không Tồn Kho",
    "POD printing and US eCommerce-standard packing — run per order, with no inventory.",
    "POD印刷与美国电商标准包装——按单运营，零库存。",
  ),

  // DEGRADED-PATH ONLY. When the Hub answers, this section renders real catalog products
  // (see featured-products.ts) and these cards are never shown. They exist so a Hub outage
  // leaves the page with product photography instead of a hole — which is why they carry no
  // product id: an illustrative card must not emit a deep link it cannot honour.
  //
  // Product names are invariant across locales (they are catalogue identity, not copy), so
  // they are plain strings; only the image alt text is localized.
  catalogFallback: [
    {
      name: "180 g Milk Thread Women's Heat Transfer T-Shirt — Double-sided",
      image: "/assets/fulfill/apparel.png",
      alt: tr("Áo thun in chuyển nhiệt hai mặt", "Double-sided heat transfer T-shirt", "双面热转印T恤"),
    },
    {
      name: "15oz Mug",
      image: "/assets/fulfill/drinkware.png",
      alt: tr("Cốc sứ in theo yêu cầu", "Custom printed ceramic mug", "定制印花陶瓷杯"),
    },
    {
      name: "All-Over Print Fleece Pajama Pants",
      image: "/assets/fulfill/fleece.png",
      alt: tr("Quần pyjama nỉ in toàn thân", "All-over print fleece pajama pants", "全幅印花抓绒睡裤"),
    },
  ],

  consultEyebrow: tr("Yêu cầu tư vấn", "Request consultation", "请求咨询"),
  consultTitle: tr("Mở hồ sơ vận hành.", "Open an operations file.", "开启运营档案。"),
  consultIntro: tr(
    "Không cấp báo giá tự động. Mô tả sản phẩm và nhu cầu — đội ngũ THG sẽ thiết kế luồng vận hành phù hợp và liên hệ trực tiếp.",
    "No automated quotes. Describe your product and needs — the THG team designs the right operational flow and contacts you directly.",
    "不提供自动报价。描述您的产品与需求——THG团队将设计合适的运营流程并直接联系您。",
  ),
  consultCta: tr("Yêu cầu tư vấn", "Request consultation", "请求咨询"),

  faqEyebrow: tr("Hỏi & Đáp", "Q&A", "问答"),
  faqTitle: tr("Câu hỏi thường gặp", "Frequently asked questions", "常见问题"),
  faqIntro: tr(
    "Kiến thức công khai được THG xác thực.",
    "Public knowledge, verified by THG.",
    "由THG审核的公开知识。",
  ),
  faqEmpty: tr(
    "Chưa có câu hỏi công khai cho THG Fulfill.",
    "No public questions for THG Fulfill yet.",
    "THG Fulfill 暂无公开问题。",
  ),
  faqAskCommunity: tr("Đặt câu hỏi trong Community", "Ask in the Community", "在社区提问"),
};

/** Resolve the localized Fulfill source to a single locale's flat FulfillCopy (consumer shape). */
export function getFulfillContent(locale: Locale): FulfillCopy {
  const L = (text: LocalizedText) => localize(locale, text);
  const step = (s: FulfillStepSource): FulfillStepCopy => ({
    index: s.index,
    title: L(s.title),
    description: L(s.description),
  });
  const pain = (p: FulfillPainSource): FulfillPainCopy => ({
    num: p.num,
    title: L(p.title),
    description: L(p.description),
  });
  const cap = (c: FulfillCapabilitySource): FulfillCapabilityCopy => ({
    title: L(c.title),
    description: L(c.description),
  });
  const { steps, capabilities, hubStages, catalogFallback } = SOURCE;

  return {
    heroHeadline: L(SOURCE.heroHeadline),
    heroSubtitleFallback: L(SOURCE.heroSubtitleFallback),
    heroBadge: SOURCE.heroBadge,
    pointsFallback: SOURCE.pointsFallback.map(L),

    painEyebrow: L(SOURCE.painEyebrow),
    painTitle: L(SOURCE.painTitle),
    pains: [pain(SOURCE.pains[0]), pain(SOURCE.pains[1]), pain(SOURCE.pains[2]), pain(SOURCE.pains[3])],

    journeyEyebrow: L(SOURCE.journeyEyebrow),
    journeyTitle: L(SOURCE.journeyTitle),
    journeyIntro: L(SOURCE.journeyIntro),
    journeyReference: L(SOURCE.journeyReference),
    steps: [step(steps[0]), step(steps[1]), step(steps[2]), step(steps[3])],

    capabilitiesEyebrow: L(SOURCE.capabilitiesEyebrow),
    capabilitiesTitle: L(SOURCE.capabilitiesTitle),
    capabilitiesIntro: L(SOURCE.capabilitiesIntro),
    capabilities: {
      network: cap(capabilities.network),
      qc: cap(capabilities.qc),
      pack: cap(capabilities.pack),
      hub: cap(capabilities.hub),
      intake: cap(capabilities.intake),
      print: cap(capabilities.print),
      advisory: cap(capabilities.advisory),
    },
    hubStages: [L(hubStages[0]), L(hubStages[1]), L(hubStages[2]), L(hubStages[3])],
    hubCaption: L(SOURCE.hubCaption),

    catalogEyebrow: L(SOURCE.catalogEyebrow),
    catalogTitle: L(SOURCE.catalogTitle),
    catalogIntro: L(SOURCE.catalogIntro),
    catalogEmpty: L(SOURCE.catalogEmpty),
    catalogExploreAll: L(SOURCE.catalogExploreAll),
    catalogFallback: catalogFallback.map((c) => ({ name: c.name, image: c.image, alt: L(c.alt) })),

    heroInfraBadge: L(SOURCE.heroInfraBadge),
    heroHeadlineLong: L(SOURCE.heroHeadlineLong),
    heroPrimaryCta: L(SOURCE.heroPrimaryCta),
    heroSecondaryCta: L(SOURCE.heroSecondaryCta),

    processEyebrow: L(SOURCE.processEyebrow),
    processTitle: L(SOURCE.processTitle),
    processLead: L(SOURCE.processLead),
    processHonesty: L(SOURCE.processHonesty),

    showcaseEyebrow: L(SOURCE.showcaseEyebrow),
    showcaseTitle: L(SOURCE.showcaseTitle),

    consultEyebrow: L(SOURCE.consultEyebrow),
    consultTitle: L(SOURCE.consultTitle),
    consultIntro: L(SOURCE.consultIntro),
    consultCta: L(SOURCE.consultCta),

    faqEyebrow: L(SOURCE.faqEyebrow),
    faqTitle: L(SOURCE.faqTitle),
    faqIntro: L(SOURCE.faqIntro),
    faqEmpty: L(SOURCE.faqEmpty),
    faqAskCommunity: L(SOURCE.faqAskCommunity),
  };
}
