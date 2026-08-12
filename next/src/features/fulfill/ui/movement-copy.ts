import { tr, localize, type Locale, type LocalizedText } from "@/shared/i18n";

// MOVEMENT CHROME — the eleven section labels and the interface strings the redesigned route needs.
//
// Strictly scaffolding: movement names, panel headings, field terms, and the two navigational
// sentences that let a seller leave. NO business claim is authored here. Every operational fact on
// the page — what THG produces, where, for whom, what it costs, what happens when it goes wrong —
// resolves from the CMS, from `localized-content.ts`, or from `parity-content.ts`, which are the
// content authorities. If a string here started asserting something about the operation, it would
// be in the wrong file.
//
// Defined ONCE with LocalizedText leaves and resolved per locale, for the same reason the other two
// copy trees are: three parallel locale objects duplicate structure rather than content, which is
// both a maintenance hazard and what a static-analysis duplication gate actually measures.

export interface MovementCopy {
  /** Movement names for the four movements the content trees have no eyebrow for. The other seven
   *  take their eyebrow from published copy rather than gaining a second, parallel label. */
  qualify: string;
  plan: string;
  proof: string;
  commitment: string;

  // S1 — qualification
  scopeTitle: string;
  scopeServices: string;
  scopeOrigins: string;
  scopeDestinations: string;
  exitTitle: string;
  exitText: string;

  // S1 — the operational signal strip and the intake specification.
  //
  // Field TERMS only. The operational STATES themselves (ACCEPTING · CONNECTED · REACHABLE) stay in
  // operational language in every locale, exactly like `copy.steps[].title` — they are identifiers a
  // fulfilment team reads the same way in Hanoi, Shenzhen and Austin, not prose to be translated.
  signalRegion: string;
  signalLive: string;
  signalStale: string;
  signalOffline: string;
  signalUnknown: string;
  signalHub: string;
  signalChannels: string;
  signalLastSeen: string;
  intakeTitle: string;
  intakeChannels: string;
  intakeNotAccepted: string;
  nodesTitle: string;
  nodeCapabilities: string;

  // Operating capacity — aggregate figures from the Hub.
  //
  // These are the only quantities on the page. They are AGGREGATE and NON-IDENTIFYING: how many
  // sellers operate on THG, how many orders have been processed, and how those orders split across
  // the four services. Revenue, wallet balances, seller names, customer ids, assignees and internal
  // pipeline stages exist in the same Hub view and are NEVER published here — they are customer and
  // financial data.
  capacityTitle: string;
  capacitySellers: string;
  capacityOrders: string;
  capacityByService: string;
  capacityNote: string;

  // The lens — three axes the visitor sets, which every later movement reads.
  lensTitle: string;
  lensIntro: string;
  lensChannel: string;
  lensModel: string;
  lensVertical: string;
  verticalFashion: string;
  verticalBeauty: string;
  verticalSupplements: string;
  verticalHome: string;

  // S3 — the planner
  planTitle: string;
  planIntro: string;

  // S4 — operational states
  stateTruth: string;
  stateFailure: string;
  stateOwner: string;
  stateVisibility: string;
  notPublished: string;

  // S5 — production scope
  templatesTitle: string;
  boundaryTitle: string;
  originLabel: string;
  /** Accessible name for the specimen table. The visible heading is the movement title; a table
   *  still needs its own caption so it can be reached and announced on its own. */
  indexCaption: string;
  indexProduct: string;

  // S6 — the responsibility boundary
  handoffEyebrow: string;
  handoffTitle: string;
  handoffThg: string;
  handoffPartner: string;
  handoffMarker: string;

  // S6 — evidence
  figureLabel: string;
  figureAlt: string;
  floorLocation: string;
  floorCaptured: string;
  libraryTitle: string;
  libraryGroup: string;
  libraryPlay: string;

  // S7 — commitment
  commitmentTitle: string;
  commitmentIntro: string;
  termCompensation: string;
  termPayment: string;
  termSupport: string;
  termPolicy: string;

  // S8 — operating handbook
  operateTitle: string;
  operateIntro: string;
  orderGuideTitle: string;
  metricsTitle: string;

  // S9 — ecosystem
  ecosystemTitle: string;
  ecosystemIntro: string;

  // S11 — consultation
  deferredTitle: string;
}

const SOURCE: Readonly<Record<keyof MovementCopy, LocalizedText>> = {
  qualify: tr("Phạm vi dịch vụ", "Qualification", "服务范围"),
  plan: tr("Kế hoạch vận hành", "Operational plan", "运营方案"),
  proof: tr("Bằng chứng", "Evidence", "证据"),
  commitment: tr("Cam kết", "Commitment", "承诺"),

  scopeTitle: tr("Dịch vụ này phục vụ ai", "What this service covers", "本服务的覆盖范围"),
  scopeServices: tr("Dịch vụ", "Services", "服务"),
  scopeOrigins: tr("Nơi sản xuất", "Production origins", "生产地"),
  scopeDestinations: tr("Điểm đến", "Destinations", "目的地"),
  exitTitle: tr("Nếu đây không phải mô hình của bạn", "If this is not your operation", "如果这不是您的模式"),
  exitText: tr(
    "THG vận hành bốn dịch vụ. Phần Hệ sinh thái ở cuối trang liệt kê ba dịch vụ còn lại và mô tả ngắn của từng dịch vụ, để bạn tìm đúng nơi mà không phải đọc hết trang này.",
    "THG runs four services. The Ecosystem section near the end of this page lists the other three with a one-line description of each, so you can find the right one without reading the rest of this page.",
    "THG 运营四项服务。本页末尾的“生态”部分列出了另外三项及其一句话说明，您无需读完本页即可找到合适的服务。",
  ),

  signalRegion: tr(
    "Trạng thái vận hành của THG",
    "THG operational status",
    "THG 运营状态",
  ),
  signalLive: tr("Trực tiếp", "Live", "实时"),
  signalStale: tr("Chưa cập nhật", "Stale", "数据滞后"),
  signalOffline: tr("Mất kết nối", "Unavailable", "连接中断"),
  signalUnknown: tr("Chưa có tín hiệu", "No signal", "暂无信号"),
  signalHub: tr("Hub", "Hub", "Hub"),
  signalChannels: tr("Kênh bán", "Channels", "销售渠道"),
  signalLastSeen: tr("Mất tín hiệu", "Signal lost", "信号丢失"),
  intakeTitle: tr("Phạm vi tiếp nhận", "Intake specification", "接收范围"),
  intakeChannels: tr("Kênh bán", "Channels", "销售渠道"),
  intakeNotAccepted: tr("Không tiếp nhận", "Not accepted", "不接收"),
  nodesTitle: tr("Điểm sản xuất", "Production nodes", "生产节点"),
  nodeCapabilities: tr("Năng lực", "Capabilities", "能力"),

  capacityTitle: tr("Năng lực đang vận hành", "Operating capacity", "运营能力"),
  capacitySellers: tr("Seller đang vận hành", "Sellers operating", "运营中的卖家"),
  capacityOrders: tr("Đơn đã xử lý", "Orders processed", "已处理订单"),
  capacityByService: tr("Phân bổ theo dịch vụ", "By service", "按服务分布"),
  capacityNote: tr(
    "Số liệu tổng hợp từ Hub System. Không bao gồm doanh thu, số dư ví hay bất kỳ thông tin định danh seller nào.",
    "Aggregate figures from the Hub System. Revenue, wallet balances and seller-identifying data are not published.",
    "来自 Hub System 的汇总数据。不公布营收、钱包余额或任何可识别卖家的信息。",
  ),

  lensTitle: tr(
    "Bạn đang bán ở đâu, bằng mô hình nào?",
    "Where do you sell, and how?",
    "您在哪里销售，用什么模式？",
  ),
  lensIntro: tr(
    "Ba câu trả lời. Toàn bộ phần còn lại của trang sẽ được sắp xếp lại theo đó — thứ tự, ví dụ, và luồng tư vấn.",
    "Three answers. Everything below reorganises around them — the order, the examples, and the consultation path.",
    "三个回答。下面的全部内容都会据此重新组织——顺序、示例与咨询路径。",
  ),
  lensChannel: tr("Kênh bán", "Sales channel", "销售渠道"),
  lensModel: tr("Mô hình vận hành", "Operating model", "运营模式"),
  lensVertical: tr("Ngành hàng", "Category", "品类"),
  verticalFashion: tr("Thời trang", "Fashion", "时尚"),
  verticalBeauty: tr("Mỹ phẩm", "Beauty", "美妆"),
  verticalSupplements: tr("Thực phẩm bổ sung", "Supplements", "保健品"),
  verticalHome: tr("Đồ gia dụng", "Home", "家居"),

  planTitle: tr(
    "Hai câu trả lời, một kế hoạch vận hành.",
    "Two answers, one operational plan.",
    "两个回答，一份运营方案。",
  ),
  planIntro: tr(
    "Mỗi tình huống kinh doanh cần một luồng vận hành khác nhau — kể cả khi cùng dùng một dịch vụ của THG. Cả sáu kế hoạch đều hiển thị sẵn; hai câu hỏi chỉ thu hẹp lại kế hoạch dành cho bạn.",
    "Different business situations need different operations — even when they run on the same THG service. All six plans are shown; the two questions only narrow them to yours.",
    "不同的业务情境需要不同的运营流程——即使使用同一项 THG 服务。六份方案均已列出；两个问题只是把它们缩小到适合您的那一份。",
  ),

  stateTruth: tr("Điều diễn ra", "What happens", "发生的事"),
  stateFailure: tr("Khi sai sót", "Failure mode", "失效方式"),
  stateOwner: tr("Bên chịu trách nhiệm", "Owner", "责任方"),
  stateVisibility: tr("Bạn theo dõi được", "What you can watch", "您可跟踪的状态"),
  notPublished: tr("THG chưa công bố", "Not yet published by THG", "THG 尚未公布"),

  templatesTitle: tr("Template sản phẩm", "Product templates", "产品模板"),
  boundaryTitle: tr("Ngoài phạm vi", "Outside production scope", "超出生产范围"),
  originLabel: tr("Nơi sản xuất", "Origin", "生产地"),
  indexCaption: tr(
    "Danh mục sản xuất: sản phẩm, nơi sản xuất và thời gian THG tự xử lý.",
    "Production index: product, origin and the time THG handles in-house.",
    "生产索引：产品、生产地及THG内部处理时间。",
  ),
  indexProduct: tr("Sản phẩm", "Product", "产品"),

  // The boundary is a statement of limits, not a process. Each side lists what it owns; neither
  // side is a sequence, which is why these are sets and never numbered steps.
  handoffEyebrow: tr("Ranh giới", "Boundary", "责任边界"),
  handoffTitle: tr(
    "Từ đây, trách nhiệm đổi bên.",
    "Past this line, responsibility changes hands.",
    "越过此线，责任易手。",
  ),
  handoffThg: tr("THG chịu trách nhiệm", "THG is responsible", "THG 负责"),
  handoffPartner: tr("Đối tác vận chuyển", "Delivery partner", "配送伙伴"),
  handoffMarker: tr("Bàn giao", "Handoff", "交接"),

  figureLabel: tr("Xưởng vận hành", "Operations floor", "运营车间"),
  figureAlt: tr(
    "Xưởng vận hành của THG Fulfill.",
    "The THG Fulfill operations floor.",
    "THG Fulfill 的运营车间。",
  ),
  floorLocation: tr("Địa điểm", "Location", "地点"),
  floorCaptured: tr("Ngày chụp", "Captured", "拍摄日期"),
  libraryTitle: tr("Xem toàn bộ quy trình vận hành.", "Watch the operation, end to end.", "完整了解运营流程。"),
  libraryGroup: tr("Tài nguyên hướng dẫn", "Learning resources", "学习资源"),
  libraryPlay: tr("Phát", "Play", "播放"),

  commitmentTitle: tr(
    "Khi có sự cố, đây là phần THG gánh.",
    "When something goes wrong, this is what THG carries.",
    "出现问题时，这是 THG 承担的部分。",
  ),
  // No count: the list is built from published content, and a CMS set missing a slot would leave
  // the copy promising more commitments than the page shows.
  commitmentIntro: tr(
    "Những cam kết dưới đây được công bố công khai và áp dụng cho mọi đơn hàng. Điều khoản đầy đủ nằm ở trang chính sách.",
    "The commitments below are published and apply to every order. The full terms live on the policy page.",
    "以下承诺均已公开，适用于所有订单。完整条款见政策页面。",
  ),
  termCompensation: tr("Đền bù", "Compensation", "赔偿"),
  termPayment: tr("Thanh toán", "Payment rails", "支付渠道"),
  termSupport: tr("Kênh hỗ trợ", "Support channels", "支持渠道"),
  termPolicy: tr("Chính sách đầy đủ", "Full policy", "完整政策"),

  operateTitle: tr(
    "Đội của bạn vận hành việc này hằng ngày.",
    "Your team runs this every day.",
    "您的团队每天都要运行它。",
  ),
  operateIntro: tr(
    "Hai chương: cách lên đơn, và những gì hệ thống Hub hiển thị. Mỗi mục đều có liên kết riêng để bạn quay lại đúng chỗ.",
    "Two chapters: how an order is placed, and what the Hub system shows. Every item has its own link so you can come back to exactly the right place.",
    "两个章节：如何下单，以及 Hub 系统显示什么。每一项都有独立链接，便于您准确返回。",
  ),
  orderGuideTitle: tr("Lên đơn", "Placing an order", "下单"),
  metricsTitle: tr("Chỉ số hiển thị", "Metrics shown", "显示的指标"),

  ecosystemTitle: tr(
    "Fulfill là một trong bốn dịch vụ của THG.",
    "Fulfill is one of THG's four services.",
    "Fulfill 是 THG 四项服务之一。",
  ),
  ecosystemIntro: tr(
    "Nếu kế hoạch vận hành ở trên có nhắc đến một dịch vụ khác, đây là nơi tìm hiểu dịch vụ đó.",
    "If the operational plan above referred to another service, this is where to read about it.",
    "如果上面的运营方案提到了其他服务，可在此处了解。",
  ),

  deferredTitle: tr(
    "Những gì buổi tư vấn sẽ làm rõ",
    "What the consultation resolves",
    "咨询将确定的内容",
  ),
};

/** Resolve the movement chrome for one locale. */
export function getMovementCopy(locale: Locale): MovementCopy {
  const out = {} as Record<keyof MovementCopy, string>;
  for (const key of Object.keys(SOURCE) as (keyof MovementCopy)[]) {
    out[key] = localize(locale, SOURCE[key]);
  }
  return out as MovementCopy;
}

/**
 * The two sides of the responsibility boundary.
 *
 * Kept out of `SOURCE` because that object is resolved by iterating its keys and localizing each
 * leaf, so it may only hold LocalizedText — a nested array would be handed to `localize` and break.
 *
 * These are SETS, not sequences: neither side is numbered and neither is ordered, because the
 * movement states who owns what, not what happens when. The membership restates the production
 * process already published in `localized-content.ts` (production, QC, packing) against the
 * delivery leg the route has always attributed to a carrier. No new obligation is asserted here;
 * per-stage owners remain unpublished and are deliberately absent.
 */
const HANDOFF_SCOPE = {
  thg: [
    tr("Sản xuất", "Production", "生产"),
    tr("Kiểm hàng", "Quality control", "质检"),
    tr("Đóng gói", "Packing", "包装"),
  ],
  partner: [
    tr("Chặng giao", "Line haul", "干线运输"),
    tr("Chặng cuối", "Last mile", "末端配送"),
    tr("Tracking", "Tracking", "物流追踪"),
  ],
} as const;

export function getHandoffScope(locale: Locale): Readonly<{
  thg: readonly string[];
  partner: readonly string[];
}> {
  return {
    thg: HANDOFF_SCOPE.thg.map((t) => localize(locale, t)),
    partner: HANDOFF_SCOPE.partner.map((t) => localize(locale, t)),
  };
}

/** Movement indices. Structural, identical in every locale — they number a document, not a list.
 *
 *  Renumbered when the boundary movement was inserted: the undertaking and the boundary now sit
 *  between the production index and the floor, so that the page states what THG makes, then what it
 *  owes, then where its responsibility stops, and only then shows where that happens. */
export const MOVEMENT_INDEX = {
  qualify: "01",
  recognise: "02",
  plan: "03",
  process: "04",
  scope: "05",
  commitment: "06",
  handoff: "07",
  proof: "08",
  operate: "09",
  ecosystem: "10",
  index: "11",
  act: "12",
} as const;
