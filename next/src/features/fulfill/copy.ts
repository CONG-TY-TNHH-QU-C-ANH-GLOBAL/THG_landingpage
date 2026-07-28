import type { Locale } from "@/shared/i18n";

// Feature-scoped, localized PRESENTATION copy for the THG Fulfill route (WEB-002). This is the
// section chrome — eyebrows, section titles, journey/capability labels, empty-state and CTA
// copy — NOT business data: hero supporting text, operational bullets, catalog products and the
// FAQ come from the CMS (see server/loaders.ts) and only fall back to the localized defaults
// here when a CMS read is empty/unavailable. Values are the approved prototype's VI voice
// (thg-fulfill-definitive.html) with EN/ZH taken from the verified production dictionary
// (Vite src/lib/i18n/translations/fulfill.ts). Kept inside the feature boundary rather than the
// shared marketing dictionary because it is Fulfill-specific scaffolding; promote to the shared
// dictionary only if a second route needs it.

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

export interface FulfillCopy {
  /** Art-directed H1 (the prototype's visual contract); CMS hero_sub supplies the paragraph. */
  heroHeadline: string;
  heroSubtitleFallback: string;
  heroBadge: string;
  /** Default operational rail chips when the CMS returned no bullets. */
  pointsFallback: readonly string[];

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
  catalogFallback: readonly { name: string; image: string; alt: string }[];

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

const vi: FulfillCopy = {
  heroHeadline: "Vận hành ẩn, hiển thị rõ ràng.",
  heroSubtitleFallback:
    "Hệ thống điều phối chính xác. THG tiếp nhận, xử lý, kiểm tra và đóng gói sản phẩm của bạn — mọi trạng thái vận hành đều nhìn thấy được.",
  heroBadge: "THG Fulfillment Operations",
  pointsFallback: ["VN/CN/US POD", "Item-level QC", "Chuẩn TMĐT Mỹ"],

  journeyEyebrow: "Hành trình",
  journeyTitle: "Từ bản nhập đến đơn vị hoàn chỉnh.",
  journeyIntro:
    "Hành trình xử lý không phải hộp đen. Mọi trạng thái vận hành được ghi nhận trực tiếp lên hồ sơ của vật thể.",
  journeyReference:
    "Design input & finished unit là hai product reference riêng biệt — minh họa các bước, không phải một tấm ảnh biến hình.",
  steps: [
    {
      index: "STEP 01 / 04",
      title: "Design Input",
      description:
        "Tiếp nhận sản phẩm & file thiết kế, gắn định danh (ID) vận hành cho từng đơn vị.",
    },
    {
      index: "STEP 02 / 04",
      title: "Processing · POD",
      description: "In POD (DTG/DTF) độ phân giải cao tại VN · CN · US.",
    },
    {
      index: "STEP 03 / 04",
      title: "Quality Assurance",
      description: "QC từng đơn: định dạng, màu sắc, chất lượng in — chuẩn TMĐT Mỹ.",
    },
    {
      index: "STEP 04 / 04",
      title: "Dispatch Ready",
      description: "Đóng gói chuẩn quy cách, dán nhãn vận chuyển + tracking.",
    },
  ],

  capabilitiesEyebrow: "Năng lực",
  capabilitiesTitle: "Fulfill là một hệ thống, không chỉ là in ấn.",
  capabilitiesIntro: "Các nhóm năng lực một đơn vị đi qua trước khi sẵn sàng bàn giao.",
  capabilities: {
    network: {
      title: "Cross-border network",
      description:
        "Xưởng POD tại VN · CN và fulfill nội địa US — định tuyến theo sản phẩm & điểm đến.",
    },
    qc: {
      title: "Item-level QC",
      description: "Kiểm tra chất lượng từng đơn trước khi đóng gói.",
    },
    pack: {
      title: "Đóng gói chuẩn Mỹ",
      description: "Đóng gói chuẩn TMĐT Mỹ, dán nhãn + tracking.",
    },
    hub: {
      title: "Hub System",
      description:
        "Trạng thái đơn hàng & sản phẩm hiển thị theo từng bước — không cần dò file thủ công.",
    },
    intake: {
      title: "Tiếp nhận & định danh",
      description: "Tiếp nhận sản phẩm & file, gắn định danh vận hành.",
    },
    print: {
      title: "POD & cá nhân hóa",
      description: "In DTG/DTF độ phân giải cao theo yêu cầu.",
    },
    advisory: {
      title: "Tư vấn",
      description: "Tư vấn theo loại sản phẩm và nhu cầu cụ thể.",
    },
  },
  hubStages: ["Nhận", "Xử lý", "QC", "Đóng gói"],
  hubCaption:
    "Hub System hiển thị trạng thái theo từng bước xử lý cho đội vận hành của bạn.",

  catalogEyebrow: "Danh mục",
  catalogTitle: "Hệ sinh thái sản phẩm",
  catalogIntro: "Ảnh sản phẩm thật từ danh mục POD của THG.",
  catalogEmpty: "Danh mục sản phẩm đang được cập nhật. Liên hệ tư vấn để nhận catalog đầy đủ.",
  catalogFallback: [
    { name: "Áo & apparel", image: "/assets/fulfill/apparel.png", alt: "Sản phẩm apparel THG" },
    { name: "Drinkware", image: "/assets/fulfill/drinkware.png", alt: "Sản phẩm drinkware THG" },
    { name: "Fleece & đồ nhà", image: "/assets/fulfill/fleece.png", alt: "Sản phẩm fleece THG" },
  ],

  consultEyebrow: "Yêu cầu tư vấn",
  consultTitle: "Mở hồ sơ vận hành.",
  consultIntro:
    "Không cấp báo giá tự động. Mô tả sản phẩm và nhu cầu — đội ngũ THG sẽ thiết kế luồng vận hành phù hợp và liên hệ trực tiếp.",
  consultCta: "Yêu cầu tư vấn",

  faqEyebrow: "Hỏi & Đáp",
  faqTitle: "Câu hỏi thường gặp",
  faqIntro: "Kiến thức công khai được THG xác thực.",
  faqEmpty: "Chưa có câu hỏi công khai cho THG Fulfill.",
  faqAskCommunity: "Đặt câu hỏi trong Community",
};

const en: FulfillCopy = {
  heroHeadline: "Make invisible operations visible.",
  heroSubtitleFallback:
    "A precise coordination system. THG receives, processes, inspects and packs your products — every operational state stays visible.",
  heroBadge: "THG Fulfillment Operations",
  pointsFallback: ["VN/CN/US POD", "Item-level QC", "US e-com standard"],

  journeyEyebrow: "The journey",
  journeyTitle: "From input to a finished unit.",
  journeyIntro:
    "The handling journey is not a black box — every operational state is recorded onto the unit's own file.",
  journeyReference:
    "Design input and finished unit are two separate product references — they illustrate the steps, not a single morphing image.",
  steps: [
    {
      index: "STEP 01 / 04",
      title: "Design Input",
      description: "Receive products and design files, assigning an operational ID to every unit.",
    },
    {
      index: "STEP 02 / 04",
      title: "Processing · POD",
      description: "High-resolution POD printing (DTG/DTF) in Vietnam, China and the US.",
    },
    {
      index: "STEP 03 / 04",
      title: "Quality Assurance",
      description: "Item-level QC: file format, color and print quality — to US eCommerce standard.",
    },
    {
      index: "STEP 04 / 04",
      title: "Dispatch Ready",
      description: "Standards-compliant packing with a shipping label and tracking.",
    },
  ],

  capabilitiesEyebrow: "Capabilities",
  capabilitiesTitle: "Fulfill is a system, not just printing.",
  capabilitiesIntro: "The capability groups every unit passes through before it is ready to dispatch.",
  capabilities: {
    network: {
      title: "Cross-border network",
      description:
        "POD workshops in VN · CN and US domestic fulfillment — routed by product and destination.",
    },
    qc: {
      title: "Item-level QC",
      description: "Quality-checking every order before it is packed.",
    },
    pack: {
      title: "US standard packing",
      description: "US eCommerce-standard packing with label and tracking.",
    },
    hub: {
      title: "Hub System",
      description: "Order and product status visible step by step — no manual file digging.",
    },
    intake: {
      title: "Intake & ID",
      description: "Receiving products and files, assigning an operational ID.",
    },
    print: {
      title: "POD & personalization",
      description: "High-resolution DTG/DTF printing on demand.",
    },
    advisory: {
      title: "Consultation",
      description: "Advice tailored to your product type and specific needs.",
    },
  },
  hubStages: ["Received", "Processing", "QC", "Packed"],
  hubCaption: "Hub System surfaces status at each processing stage for your operations team.",

  catalogEyebrow: "Catalog",
  catalogTitle: "Product ecosystem",
  catalogIntro: "Real product photography from THG's POD catalog.",
  catalogEmpty: "The product catalog is being updated. Request a consultation for the full catalog.",
  catalogFallback: [
    { name: "Apparel", image: "/assets/fulfill/apparel.png", alt: "THG apparel product" },
    { name: "Drinkware", image: "/assets/fulfill/drinkware.png", alt: "THG drinkware product" },
    { name: "Fleece & home", image: "/assets/fulfill/fleece.png", alt: "THG fleece product" },
  ],

  consultEyebrow: "Request consultation",
  consultTitle: "Open an operations file.",
  consultIntro:
    "No automated quotes. Describe your product and needs — the THG team designs the right operational flow and contacts you directly.",
  consultCta: "Request consultation",

  faqEyebrow: "Q&A",
  faqTitle: "Frequently asked questions",
  faqIntro: "Public knowledge, verified by THG.",
  faqEmpty: "No public questions for THG Fulfill yet.",
  faqAskCommunity: "Ask in the Community",
};

const zh: FulfillCopy = {
  heroHeadline: "让隐形的运营变得可见。",
  heroSubtitleFallback:
    "精确的协调系统。THG 接收、处理、检验并包装您的产品——每个运营状态都清晰可见。",
  heroBadge: "THG Fulfillment Operations",
  pointsFallback: ["VN/CN/US POD", "逐单质检", "美国电商标准"],

  journeyEyebrow: "旅程",
  journeyTitle: "从输入到成品单元。",
  journeyIntro: "处理过程不是黑箱——每个运营状态都记录在该单元自身的档案中。",
  journeyReference:
    "设计输入与成品单元是两个独立的产品参照——用于说明各步骤，而非同一张变形图片。",
  steps: [
    {
      index: "STEP 01 / 04",
      title: "Design Input",
      description: "接收产品与设计文件，为每个单元分配运营ID。",
    },
    {
      index: "STEP 02 / 04",
      title: "Processing · POD",
      description: "在越南·中国·美国进行高分辨率POD打印（DTG/DTF）。",
    },
    {
      index: "STEP 03 / 04",
      title: "Quality Assurance",
      description: "逐单质检：文件格式、颜色与印刷质量——达到美国电商标准。",
    },
    {
      index: "STEP 04 / 04",
      title: "Dispatch Ready",
      description: "按规范包装，贴运输标签并提供追踪。",
    },
  ],

  capabilitiesEyebrow: "能力",
  capabilitiesTitle: "Fulfill 是一套系统，而不仅是印刷。",
  capabilitiesIntro: "每个单元在准备发运之前所经过的能力环节。",
  capabilities: {
    network: {
      title: "Cross-border network",
      description: "越南·中国的POD车间与美国本土履约——按产品与目的地路由。",
    },
    qc: {
      title: "Item-level QC",
      description: "在包装前检查每一个订单的质量。",
    },
    pack: {
      title: "US standard packing",
      description: "美国电商标准包装，附标签与追踪。",
    },
    hub: {
      title: "Hub System",
      description: "订单与产品状态按步骤可见——无需手动翻查文件。",
    },
    intake: {
      title: "Intake & ID",
      description: "接收产品与文件，分配运营标识。",
    },
    print: {
      title: "POD & personalization",
      description: "按需高分辨率DTG/DTF打印。",
    },
    advisory: {
      title: "Consultation",
      description: "根据您的产品类型与具体需求提供咨询。",
    },
  },
  hubStages: ["已接收", "处理中", "质检", "已打包"],
  hubCaption: "Hub System 在每个处理阶段向您的运营团队显示状态。",

  catalogEyebrow: "目录",
  catalogTitle: "产品生态",
  catalogIntro: "来自THG POD目录的真实产品照片。",
  catalogEmpty: "产品目录正在更新。请咨询以获取完整目录。",
  catalogFallback: [
    { name: "服装", image: "/assets/fulfill/apparel.png", alt: "THG 服装产品" },
    { name: "杯具饮具", image: "/assets/fulfill/drinkware.png", alt: "THG 饮具产品" },
    { name: "抓绒与家居", image: "/assets/fulfill/fleece.png", alt: "THG 抓绒产品" },
  ],

  consultEyebrow: "请求咨询",
  consultTitle: "开启运营档案。",
  consultIntro:
    "不提供自动报价。描述您的产品与需求——THG团队将设计合适的运营流程并直接联系您。",
  consultCta: "请求咨询",

  faqEyebrow: "问答",
  faqTitle: "常见问题",
  faqIntro: "由THG审核的公开知识。",
  faqEmpty: "THG Fulfill 暂无公开问题。",
  faqAskCommunity: "在社区提问",
};

const COPY: Readonly<Record<Locale, FulfillCopy>> = { vi, en, zh };

export function getFulfillCopy(lang: Locale): FulfillCopy {
  return COPY[lang];
}
