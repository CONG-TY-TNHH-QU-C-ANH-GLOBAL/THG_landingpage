// PLAN LABELS — resolving the Operational Plan's content ids to localized text.
//
// The domain references everything by id and holds no strings, so this is where a plan becomes readable.
// It lives in the feature rather than in `shared/planning` for a boundary reason: resolution needs the
// feature's own copy trees, and `shared` may not import `features`. A future service builds its own
// resolver from its own content and passes it to the same renderer.
//
// ─────────────────────────────────────────────────────────────────────────────────────────────────────
// DERIVED FIRST, AUTHORED ONLY WHERE NECESSARY.
//
// Most ids resolve to copy THG has already published — the journey steps, the capability descriptions,
// the Hub handbook chapters, the FAQ answers. Deriving rather than re-authoring means: no new business
// claim, three locales for free, and the label follows the source if the CMS overlays it.
//
// `AUTHORED` below is the complete list of strings that could NOT be derived — 12 ids. Every one is
// flagged for review in the accompanying notes. The five trade-offs are the commercially sensitive
// ones: each states only a STRUCTURAL choice (make-to-order vs batch, prepaid vs invoiced, storage vs
// per-order) and deliberately asserts no price relationship, because THG publishes no pricing.
import type { Locale } from "@/shared/i18n";
import type { FulfillCopy } from "../localized-content";
import type { FulfillParityCopy } from "../parity-content";

/** Rendered where an id has no label at all — the same honesty rule the `absent` evidence kind follows:
 *  a gap is visible, never silent. Reaching this in production is a content bug, not a display state. */
const MISSING = "—";

/**
 * Strings with no existing source in THG's content.
 *
 * REVIEW REQUIRED. Seller obligations describe work the seller must do; the trade-offs describe what
 * they accept. Both are assertions about how THG operates and neither is confirmed.
 */
const AUTHORED: Readonly<Record<Locale, Readonly<Record<string, string>>>> = {
  vi: {
    // Constraints for sellers who have no operation yet — no existing copy describes this state.
    "constraint.no_operation_yet": "Chưa có luồng vận hành nào để bắt đầu bán ở Mỹ.",
    "constraint.no_supply_chain": "Chưa có nguồn hàng và chưa có luồng xuất đơn.",
    // The one THG obligation with no published source: production geography is published, but
    // US-domestic dispatch as an undertaking is not stated anywhere in THG's own content.
    "obligation.thg.us_domestic_fulfillment": "Sản xuất và xuất hàng nội địa Mỹ cho đơn đến Mỹ, thay vì gửi xuyên biên giới.",
    "obligation.seller.print_ready_artwork": "Cung cấp file thiết kế đúng template sản phẩm.",
    "obligation.seller.sku_mapping": "Ghép SKU của bạn với SKU trong catalog THG.",
    "obligation.seller.product_specs": "Cung cấp thông tin và thông số sản phẩm cần tìm nguồn.",
    "obligation.seller.stock_forecast": "Dự báo lượng tồn cần lưu kho theo kỳ.",
    // Trade-offs — structural choices only, no price claim.
    "tradeoff.per_unit_vs_bulk": "Sản xuất theo từng đơn thay vì đặt lô: không cần vốn tồn kho, chi phí tính theo từng sản phẩm.",
    "tradeoff.us_production_cost_vs_transit": "Sản xuất tại Mỹ để rút ngắn chặng giao, thay vì sản xuất tại VN/CN rồi vận chuyển xuyên biên.",
    "tradeoff.prepaid_model": "Hub System vận hành theo mô hình trả trước — cần nạp ví trước khi lên đơn.",
    "tradeoff.sourcing_scope_limits": "Nguồn hàng giới hạn trong phạm vi THG hỗ trợ, không phải mọi sàn.",
    "tradeoff.storage_vs_per_order": "Giữ tồn tại kho THG thay vì tìm nguồn theo từng đơn.",
  },
  en: {
    "constraint.no_operation_yet": "There is no fulfillment operation in place to start selling into the US.",
    "constraint.no_supply_chain": "There is no supply source and no order-dispatch flow in place.",
    "obligation.thg.us_domestic_fulfillment": "Produce and dispatch inside the US for US destinations, instead of shipping cross-border.",
    // Seller-side obligations.
    "obligation.seller.print_ready_artwork": "Supply artwork that matches the product template.",
    "obligation.seller.sku_mapping": "Map your SKUs to the THG catalog SKUs.",
    "obligation.seller.product_specs": "Supply the product details and specifications to source against.",
    "obligation.seller.stock_forecast": "Forecast the stock volume to be held per period.",
    "tradeoff.per_unit_vs_bulk": "Production per order rather than per batch: no inventory capital, cost accounted per unit.",
    "tradeoff.us_production_cost_vs_transit": "Producing inside the US to shorten the delivery leg, rather than producing in VN/CN and shipping cross-border.",
    "tradeoff.prepaid_model": "The Hub System runs prepaid — the wallet is topped up before orders are placed.",
    "tradeoff.sourcing_scope_limits": "Sourcing is limited to the marketplaces THG supports, not every platform.",
    "tradeoff.storage_vs_per_order": "Holding stock in a THG warehouse rather than sourcing per order.",
  },
  zh: {
    "constraint.no_operation_yet": "尚无可用于开始在美国销售的履约流程。",
    "constraint.no_supply_chain": "尚无供货来源，也无出单流程。",
    "obligation.thg.us_domestic_fulfillment": "面向美国目的地在美国本土生产并发货，而非跨境运输。",
    "obligation.seller.print_ready_artwork": "按产品模板提供设计文件。",
    "obligation.seller.sku_mapping": "将您的 SKU 与 THG 目录 SKU 对应。",
    "obligation.seller.product_specs": "提供需寻源的产品信息与规格。",
    "obligation.seller.stock_forecast": "按周期预测需入库的库存量。",
    "tradeoff.per_unit_vs_bulk": "按单生产而非批量下单：无需库存资金，成本按件计。",
    "tradeoff.us_production_cost_vs_transit": "在美国本土生产以缩短配送段，而非在越南/中国生产后跨境运输。",
    "tradeoff.prepaid_model": "Hub System 采用预付费模式——下单前需为钱包充值。",
    "tradeoff.sourcing_scope_limits": "寻源范围限于 THG 支持的平台，并非全部平台。",
    "tradeoff.storage_vs_per_order": "在 THG 仓库备货，而非逐单寻源。",
  },
};

/** UI chrome for the planner and the handoff. Interface labels, not business assertions. */
const CHROME: Readonly<Record<Locale, Readonly<Record<string, string>>>> = {
  vi: {
    "situation.starting": "Mới bắt đầu",
    "situation.expanding": "Đang mở rộng sang Mỹ",
    "situation.operating": "Đã bán ở Mỹ",
    "supply.custom": "In thiết kế của tôi",
    "supply.sourced": "Bán hàng tìm nguồn",
    "capability.fulfill": "THG Fulfill",
    "capability.express": "THG Express",
    "capability.warehouse": "THG Warehouse",
    "capability.dropship": "THG Dropship",
    "confidence.low": "Cần trao đổi thêm",
    "confidence.medium": "Dựa trên cam kết vận hành",
    "confidence.high": "Dựa trên dữ liệu đã công bố",
    "handoff.situation": "Bối cảnh",
    "handoff.constraint": "Vướng mắc",
    "handoff.course": "Đề xuất",
    "handoff.destination": "Điểm đến",
    "ui.constraint": "Vướng mắc vận hành",
    "ui.course": "Kế hoạch vận hành",
    "ui.thg_does": "THG thực hiện",
    "ui.you_do": "Bạn cần chuẩn bị",
    "ui.tradeoff": "Đánh đổi",
    "ui.grounds": "Căn cứ",
    "ui.no_data_yet": "THG chưa công bố số liệu này",
    "ui.q_situation": "Tình trạng hiện tại của bạn?",
    "ui.q_supply": "Bạn bán loại hàng nào?",
    "ui.all_plans": "Ba tình huống · hai mô hình hàng hoá",
    "ui.confidence": "Mức tin cậy",
    "ui.identity": "Mã kế hoạch",
    "ui.inferred": "suy ra",
    "ui.deferred": "Xác định khi tư vấn",
    "field.capital": "Vốn",
    "field.monthlyVolume": "Sản lượng/tháng",
    // The evidence kinds. Shown, not implied: a measured fact and a stated commitment must not
    // look identical, because a reader who cannot tell them apart discounts both.
    "kind.measured": "Đo được",
    "kind.published": "Đã công bố",
    "kind.committed": "Cam kết",
    "kind.absent": "Chưa công bố",
  },
  en: {
    "situation.starting": "Just starting",
    "situation.expanding": "Expanding into the US",
    "situation.operating": "Already selling in the US",
    "supply.custom": "I print my own design",
    "supply.sourced": "I resell sourced goods",
    "capability.fulfill": "THG Fulfill",
    "capability.express": "THG Express",
    "capability.warehouse": "THG Warehouse",
    "capability.dropship": "THG Dropship",
    "confidence.low": "Needs a conversation",
    "confidence.medium": "Based on operational commitments",
    "confidence.high": "Based on published data",
    "handoff.situation": "Context",
    "handoff.constraint": "Constraint",
    "handoff.course": "Recommendation",
    "handoff.destination": "Destination",
    "ui.constraint": "Operational constraint",
    "ui.course": "Operational plan",
    "ui.thg_does": "THG does",
    "ui.you_do": "You provide",
    "ui.tradeoff": "Trade-off",
    "ui.grounds": "On what basis",
    "ui.no_data_yet": "THG has not published this figure yet",
    "ui.q_situation": "Where are you today?",
    "ui.q_supply": "What do you sell?",
    "ui.all_plans": "Three situations · two supply models",
    "ui.confidence": "Confidence",
    "ui.identity": "Plan reference",
    "ui.inferred": "inferred",
    "ui.deferred": "Resolved in consultation",
    "field.capital": "Capital",
    "field.monthlyVolume": "Monthly volume",
    "kind.measured": "Measured",
    "kind.published": "Published",
    "kind.committed": "Committed",
    "kind.absent": "Not yet published",
  },
  zh: {
    "situation.starting": "刚开始",
    "situation.expanding": "正在拓展美国市场",
    "situation.operating": "已在美国销售",
    "supply.custom": "印制我自己的设计",
    "supply.sourced": "转售寻源商品",
    "capability.fulfill": "THG Fulfill",
    "capability.express": "THG Express",
    "capability.warehouse": "THG Warehouse",
    "capability.dropship": "THG Dropship",
    "confidence.low": "需进一步沟通",
    "confidence.medium": "基于运营承诺",
    "confidence.high": "基于已公布数据",
    "handoff.situation": "背景",
    "handoff.constraint": "瓶颈",
    "handoff.course": "建议",
    "handoff.destination": "目的地",
    "ui.constraint": "运营瓶颈",
    "ui.course": "运营方案",
    "ui.thg_does": "THG 负责",
    "ui.you_do": "您需提供",
    "ui.tradeoff": "取舍",
    "ui.grounds": "依据",
    "ui.no_data_yet": "THG 尚未公布该数据",
    "ui.q_situation": "您目前处于哪个阶段？",
    "ui.q_supply": "您销售哪类商品？",
    "ui.all_plans": "三种情境 · 两种货品模式",
    "ui.confidence": "可信度",
    "ui.identity": "方案编号",
    "ui.inferred": "推断",
    "ui.deferred": "在咨询中确定",
    "field.capital": "资金",
    "field.monthlyVolume": "月出货量",
    "kind.measured": "已测量",
    "kind.published": "已公布",
    "kind.committed": "承诺",
    "kind.absent": "尚未公布",
  },
};

/**
 * Build the label resolver for this route.
 *
 * The `DERIVED` map is the interesting half: each entry points at copy that already exists, so the plan
 * inherits THG's own wording — including any CMS service-block overlay applied upstream — instead of
 * carrying a second, drifting copy of it.
 */
export function buildPlanLabels(
  lang: Locale,
  copy: FulfillCopy,
  parity: FulfillParityCopy,
): (id: string) => string {
  const [pain0, , pain2, pain3] = copy.pains;
  const [, , hubCatalog, hubFinance, hubSupport] = parity.hubSections;
  const hubOrders = parity.hubSections[1];
  const faq = parity.faqFallback;

  const DERIVED: Readonly<Record<string, string>> = {
    // ── Constraints, taken verbatim from the seller-challenge copy ──
    "constraint.transit_cancellations": pain0.description,
    "constraint.order_management_errors": pain2.description,
    "constraint.inventory_control": pain3.description,

    // ── THG obligations, from the journey steps and capability descriptions ──
    "obligation.thg.print_on_demand": copy.steps[1].description,
    "obligation.thg.item_level_qc": copy.steps[2].description,
    "obligation.thg.us_standard_pack": copy.steps[3].description,
    "obligation.thg.route_by_destination": copy.capabilities.network.description,
    "obligation.thg.hub_visibility": copy.capabilities.hub.description,
    "obligation.thg.store_and_id": copy.capabilities.intake.description,
    "obligation.thg.bulk_intake": hubOrders.bullets[1] ?? MISSING,
    "obligation.thg.support_channels": hubSupport.intro,
    "obligation.thg.source_per_order": faq[6]?.answer ?? MISSING,
    "obligation.thg.ship_per_order": faq[0]?.answer ?? MISSING,
    // ── Seller obligations that DO have a source ──
    "obligation.seller.sku_sync": hubCatalog.intro,
    "obligation.seller.prepaid_wallet": hubFinance.intro,

    // ── Evidence ──
    "evidence.production_geography": copy.capabilities.network.description,
    "evidence.item_level_qc": copy.capabilities.qc.description,
    "evidence.us_standard_pack": copy.capabilities.pack.description,
    "evidence.tracking": copy.steps[3].description,
    "evidence.intake_operational_id": copy.steps[0].description,
    "evidence.hub_modules": copy.capabilities.hub.description,
    "evidence.bulk_csv_intake": hubOrders.bullets[1] ?? MISSING,
    "evidence.prepaid_transparency": hubFinance.intro,
    "evidence.destination_coverage": faq[0]?.answer ?? MISSING,
    "evidence.payment_rails": faq[3]?.answer ?? MISSING,
    "evidence.compensation_policy": faq[5]?.answer ?? MISSING,
    "evidence.sourcing_scope": faq[6]?.answer ?? MISSING,
    // Absent by design — the CMS fields exist and are empty. The renderer shows a labelled gap.
    "evidence.basecost": parity.basecostLabel,
    "evidence.lead_time": parity.leadTimeLabel,
    "evidence.storage_cost": parity.basecostLabel,
  };

  const authored = AUTHORED[lang];
  const chrome = CHROME[lang];

  return (id: string) => DERIVED[id] ?? authored[id] ?? chrome[id] ?? MISSING;
}
