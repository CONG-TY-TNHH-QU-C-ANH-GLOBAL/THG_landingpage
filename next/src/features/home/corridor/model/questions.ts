// The questions the corridor asks. Two kinds, deliberately different in posture:
//
//  · CORRIDOR_ASKS  — three one-tap questions that surface AT a specific gate while the camera is
//                     dwelling there, so answering never feels like filling a form.
//  · DIAGNOSTICS    — the two remaining questions, asked once, after the corridor is walked.
//
// Content authority: src/reference/thg-world-camera-ro.html (`ASKS` / `QS`). Option VALUES are
// code-owned stable identifiers, never localized — they key the recommendation rules, the matrix
// highlight and the lead mapping, so they must survive a translation change.
import { tr, type LocalizedText } from "@/shared/i18n";

/** Which answer slot a corridor ask writes into. */
export type AskField = "source" | "lane" | "volume";

export const SOURCE_POD = "pod";
export const SOURCE_DROP = "drop";
export const LANE_EXPRESS = "exp";
export const LANE_WAREHOUSE = "wh";
export const VOLUME_UNDER = "under-500";
export const VOLUME_OVER = "over-500";

export interface AskOption {
  readonly value: string;
  readonly label: LocalizedText;
  readonly hint: LocalizedText;
}

export interface CorridorAsk {
  /** 0-based index into CORRIDOR_GATES — the gate the camera must be dwelling at. */
  readonly atGateIndex: number;
  readonly field: AskField;
  readonly eyebrow: LocalizedText;
  readonly question: LocalizedText;
  readonly options: readonly AskOption[];
}

export const CORRIDOR_ASKS: readonly CorridorAsk[] = [
  {
    atGateIndex: 2,
    field: "source",
    eyebrow: tr("Cổng 03 · Tạo nguồn hàng", "Gate 03 · Sourcing", "第03关 · 生成货源"),
    question: tr("Hàng của bạn từ đâu ra?", "Where do your goods come from?", "你的货从哪里来？"),
    options: [
      {
        value: SOURCE_POD,
        label: tr("POD", "POD", "POD"),
        hint: tr(
          "In theo đơn tại Việt Nam. Không ôm tồn kho.",
          "Printed per order in Vietnam. No inventory to carry.",
          "在越南按单印制。无需囤货。",
        ),
      },
      {
        value: SOURCE_DROP,
        label: tr("Dropship", "Dropship", "代发"),
        hint: tr(
          "THG mua hộ từ 1688, Taobao, Tmall.",
          "THG buys for you on 1688, Taobao and Tmall.",
          "THG 从1688、淘宝、天猫代购。",
        ),
      },
    ],
  },
  {
    atGateIndex: 7,
    field: "lane",
    eyebrow: tr("Cổng 08 · Vận chuyển quốc tế", "Gate 08 · International transport", "第08关 · 国际运输"),
    question: tr("Bạn muốn hàng tới Mỹ thế nào?", "How should the goods reach the US?", "你希望货物如何抵达美国？"),
    options: [
      {
        value: LANE_EXPRESS,
        label: tr("Express", "Express", "Express"),
        hint: tr(
          "Bay thẳng 3–8 ngày. Không cần trữ trước.",
          "Direct air, 3–8 days. Nothing stocked in advance.",
          "直飞3–8天。无需提前备货。",
        ),
      },
      {
        value: LANE_WAREHOUSE,
        label: tr("Kho Mỹ", "US Warehouse", "美国仓"),
        hint: tr(
          "Trữ sẵn tại Mỹ, đơn về giao nội địa.",
          "Stocked in the US, delivered domestically on order.",
          "提前备货在美国，来单后本土派送。",
        ),
      },
    ],
  },
  {
    atGateIndex: 10,
    field: "volume",
    eyebrow: tr("Cổng 11 · Trả tracking", "Gate 11 · Tracking return", "第11关 · 回传物流号"),
    question: tr(
      "Mỗi tháng bạn chạy bao nhiêu đơn?",
      "How many orders do you run each month?",
      "你每月的订单量是多少？",
    ),
    options: [
      {
        value: VOLUME_UNDER,
        label: tr("Dưới 500", "Under 500", "500单以下"),
        hint: tr("Đang thử hoặc mới scale.", "Testing, or scaling up.", "正在测试或刚开始放量。"),
      },
      {
        value: VOLUME_OVER,
        label: tr("Trên 500", "Over 500", "500单以上"),
        hint: tr("Sản lượng đã ổn định.", "Volume is already steady.", "出单量已经稳定。"),
      },
    ],
  },
];

/** Which answer slot a post-corridor diagnostic writes into. */
export type DiagnosticField = "channels" | "pain";

export const PAIN_COST = "cost-per-order";
export const PAIN_LATE = "late-penalised";
export const PAIN_TRACKING = "tracking-inactive";
export const PAIN_RETURNS = "return-rate";
export const PAIN_SCALE = "cannot-scale";

export interface DiagnosticQuestion {
  readonly field: DiagnosticField;
  readonly multi: boolean;
  readonly question: LocalizedText;
  readonly options: readonly { readonly value: string; readonly label: LocalizedText }[];
}

export const DIAGNOSTICS: readonly DiagnosticQuestion[] = [
  {
    field: "channels",
    multi: true,
    question: tr("Bạn bán trên sàn nào?", "Which channels do you sell on?", "你在哪些平台销售？"),
    options: [
      { value: "tiktok-shop", label: tr("TikTok Shop", "TikTok Shop", "TikTok Shop") },
      { value: "etsy", label: tr("Etsy", "Etsy", "Etsy") },
      { value: "amazon", label: tr("Amazon", "Amazon", "亚马逊") },
      { value: "shopify", label: tr("Shopify", "Shopify", "Shopify") },
      { value: "own-site", label: tr("Website riêng", "Own website", "自建独立站") },
      { value: "not-yet", label: tr("Chưa bán", "Not selling yet", "还没开始卖") },
    ],
  },
  {
    field: "pain",
    multi: false,
    question: tr(
      "Điều gì đang làm bạn đau nhất?",
      "What hurts the most right now?",
      "目前最让你头疼的是什么？",
    ),
    options: [
      { value: PAIN_COST, label: tr("Giá mỗi đơn quá cao", "Cost per order is too high", "单均成本过高") },
      { value: PAIN_LATE, label: tr("Giao chậm, bị sàn phạt", "Late delivery, penalised", "发货慢被平台处罚") },
      { value: PAIN_TRACKING, label: tr("Tracking không active", "Tracking never activates", "物流号无法激活") },
      { value: PAIN_RETURNS, label: tr("Tỉ lệ hoàn cao", "High return rate", "退货率高") },
      { value: PAIN_SCALE, label: tr("Không scale nổi", "Cannot scale", "规模上不去") },
    ],
  },
];
