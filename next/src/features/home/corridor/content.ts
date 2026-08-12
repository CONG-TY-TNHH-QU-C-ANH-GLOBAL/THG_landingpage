// Section chrome for the "Khoảng giữa" homepage — headings, eyebrows, labels and operational
// microcopy. Feature-local (the WEB-002 precedent) rather than the shared marketing dictionary:
// none of it is CMS-editable business content, it is the art direction's own voice, and keeping it
// here means the homepage narrative can be re-cut without a three-file dictionary migration.
//
// Content authority: src/reference/thg-world-camera-ro.html. `**text**` marks an emphasised span
// (same convention the existing hero section already uses).
import { tr } from "@/shared/i18n";

export const THRESHOLD = {
  eyebrow: tr(
    "Transport Happiness Group · VN · CN · US",
    "Transport Happiness Group · VN · CN · US",
    "Transport Happiness Group · 越南 · 中国 · 美国",
  ),
  /** The headline is two lines; the second is set in the light italicised gold face. */
  headlineTop: tr("Khoảng", "The space", "中间"),
  headlineAccent: tr("giữa", "in between", "的那一段"),
  lede: tr(
    "Giữa lúc khách bấm **mua** và lúc kiện hàng chạm **cửa nhà họ** có mười một cổng. Mỗi cổng là một chỗ có thể hỏng. THG vận hành cả mười một.",
    "Between the moment a customer taps **buy** and the moment the parcel reaches **their door** there are eleven gates. Every gate is somewhere it can break. THG runs all eleven.",
    "从客户点下**购买**，到包裹抵达**他家门口**，中间有十一道关口。每一关都可能出问题。这十一关，THG 全都自己运营。",
  ),
  hint: tr(
    "↓ cuộn để đi xuyên qua — camera dừng ở từng cổng",
    "↓ scroll to walk through — the camera stops at every gate",
    "↓ 向下滚动穿过——镜头会在每一关停下",
  ),
  enterCta: tr("Bước vào khoảng giữa", "Step into the space", "走进这段中间"),
  skipCta: tr("Bỏ qua, nói chuyện luôn", "Skip it, let's talk", "跳过，直接聊"),
} as const;

export const CORRIDOR = {
  /** `{n}` is the gate number. */
  counter: tr("Cổng {n} / 11", "Gate {n} / 11", "第 {n} 关 / 共 11 关"),
  breakLabel: tr("Chỗ thường hỏng", "Where it usually breaks", "常见故障点"),
  skipQuestion: tr("Bỏ qua câu này →", "Skip this question →", "跳过这题 →"),
  /** Accessible name for the corridor's scroll region and its decorative scene. */
  regionLabel: tr("Hành lang mười một cổng", "The eleven-gate corridor", "十一关走廊"),
  depthRulerLabel: tr("Vị trí trong hành lang", "Position in the corridor", "在走廊中的位置"),
} as const;

export const MATRIX = {
  eyebrow: tr("02 — Bạn vừa đi qua", "02 — What you just walked", "02 — 你刚刚走过的"),
  heading: tr(
    "Bạn vừa tự dựng hành lang của mình",
    "You just built your own corridor",
    "你刚刚给自己搭好了一条走廊",
  ),
  lede: tr(
    "Mỗi lựa chọn trong hành lang đã đổi hình dạng thế giới, và đồng thời điền vào vận đơn. Đây là ô bạn đang đứng trong mô hình của THG.",
    "Every choice in the corridor reshaped the world around you and filled in the waybill at the same time. This is the cell you are standing in, in THG's model.",
    "走廊里的每一个选择都改变了周围的世界，同时也在填写你的运单。这就是你在 THG 模型中所处的格子。",
  ),
  youAreHere: tr("bạn ở đây", "you are here", "你在这里"),
  /** Sub-captions under the derived axis labels — the labels themselves come from the corridor
   *  questions, so a wording change there cannot leave the matrix out of step. */
  laneCaptions: {
    exp: tr("Giao đường bay · 3–8 ngày làm việc", "Air delivery · 3–8 business days", "空运派送 · 3–8个工作日"),
    wh: tr("Trữ sẵn tại Mỹ · giao nội địa", "Stocked in the US · domestic delivery", "美国备货 · 本土派送"),
  },
  sourceCaptions: {
    pod: tr("In theo đơn tại Việt Nam", "Printed per order in Vietnam", "在越南按单印制"),
    drop: tr("Mua hộ từ Trung Quốc", "Bought for you in China", "从中国代购"),
  },
  /** Keyed by `source-lane` (see comboId). */
  cells: {
    "pod-exp": tr(
      "Sản phẩm cá nhân hoá, sản lượng chưa đều. Không ôm tồn kho, không cần trữ trước tại Mỹ.",
      "Personalised products, uneven volume. No inventory to carry and nothing to pre-stock in the US.",
      "个性化产品，出单还不稳定。无需囤货，也不必提前备货到美国。",
    ),
    "pod-wh": tr(
      "Mẫu đã bán đều. In trước theo lô rồi đẩy sang kho Mỹ — đổi vốn tồn kho lấy tốc độ nội địa.",
      "Designs that already sell steadily. Printed in batches and pushed to the US warehouse — inventory capital traded for domestic speed.",
      "已经卖得稳的款。成批预印后推入美国仓——用库存资金换本土时效。",
    ),
    "drop-exp": tr(
      "Test sản phẩm mới, chưa muốn ứng vốn hàng. Mỗi đơn mua và bay riêng — linh hoạt nhất.",
      "Testing new products without fronting capital. Each order is bought and flown on its own — the most flexible setup.",
      "测试新品，还不想垫资。每单单独采购、单独发运——最灵活的做法。",
    ),
    "drop-wh": tr(
      "SKU đã chứng minh bán được. Nhập lô lớn về kho Mỹ để kéo giá mỗi đơn xuống.",
      "SKUs that have proven they sell. Brought in by the batch to the US warehouse to pull the per-order price down.",
      "已经验证能卖的SKU。大批入美国仓，把单均成本压下来。",
    ),
  },
} as const;

export const DIAGNOSTIC = {
  eyebrow: tr("03 — Hai câu cuối", "03 — Two last questions", "03 — 最后两个问题"),
  heading: tr("Để Sales không hỏi lại", "So Sales never has to ask twice", "让销售不用再问一遍"),
  lede: tr(
    "Hành lang đã lấy được nguồn hàng, làn giao và sản lượng. Còn đúng hai thứ nữa.",
    "The corridor already captured your sourcing, your lane and your volume. Two things left.",
    "走廊已经问到了货源、通道和单量。还差两件事。",
  ),
  multiHint: tr("chọn nhiều được", "multiple allowed", "可多选"),
} as const;

export const RECOMMENDATION = {
  eyebrow: tr("04 — Hệ thống đọc được gì", "04 — What the system read", "04 — 系统读到了什么"),
  emptyHeading: tr("Chưa đủ dữ liệu", "Not enough to go on yet", "数据还不够"),
  emptyLede: tr(
    "Đi hết hành lang phía trên, đề xuất sẽ hiện tại đây và tự cập nhật.",
    "Walk the corridor above and the recommendation appears here, updating itself as you go.",
    "走完上面的走廊，建议就会显示在这里，并随你的选择自动更新。",
  ),
  partialHeading: tr("Gần đủ rồi", "Almost there", "快够了"),
  partialLede: tr(
    "Còn thiếu một lựa chọn để chốt tổ hợp.",
    "One more choice and the combination is settled.",
    "再选一项就能确定组合。",
  ),
  readyHeading: tr("Bạn hợp với", "You fit", "适合你的是"),
  readyLede: tr(
    "Đề xuất tự đổi mỗi khi bạn sửa lựa chọn.",
    "The recommendation changes every time you change an answer.",
    "你每改一次选择，建议就会跟着变。",
  ),
  comboLabel: tr("Tổ hợp đề xuất", "Recommended combination", "推荐组合"),
  whyPrefix: tr("Vì ", "Because ", "因为"),
  whyJoin: tr("; và ", "; and ", "；并且"),
  whyPartialPrefix: tr("Đã đọc được: ", "Read so far: ", "目前读到："),
  whyEmpty: tr(
    "Đề xuất xuất hiện sau khi bạn đi qua hành lang.",
    "The recommendation appears once you have walked the corridor.",
    "走过走廊之后，这里会给出建议。",
  ),
  prepLabel: tr(
    "Cần chuẩn bị trước khi nói chuyện",
    "Worth having ready before we talk",
    "沟通前建议先准备好",
  ),
  prepBase: [
    tr(
      "Danh sách SKU đang bán và sản lượng từng mã",
      "The SKUs you sell and the volume of each",
      "在售SKU清单及每个的出货量",
    ),
    tr("Link shop trên sàn bạn đang chạy", "A link to the shop you are running", "你正在运营的店铺链接"),
  ],
  prepExpress: [
    tr(
      "Trọng lượng và kích thước trung bình mỗi kiện",
      "Average weight and dimensions per parcel",
      "每件包裹的平均重量与尺寸",
    ),
    tr(
      "Thời gian giao sàn đang yêu cầu bạn",
      "The delivery window your marketplace demands",
      "平台对你的时效要求",
    ),
  ],
  prepWarehouse: [
    tr(
      "Lượng hàng muốn trữ tại kho Mỹ mỗi lô",
      "How much you want to hold in the US per batch",
      "每批想在美国仓存多少货",
    ),
    tr("Vòng quay tồn kho bạn chấp nhận được", "The inventory turnover you can live with", "你能接受的库存周转"),
  ],
  prepUnknownLane: [
    tr(
      "Chi phí xử lý mỗi đơn hiện tại (nếu có)",
      "Your current cost per order, if you know it",
      "目前的单均处理成本（如果知道）",
    ),
  ],
  caveat: tr(
    "Đây là đề xuất dựa trên câu trả lời của bạn — không phải báo giá. Giá và thời gian cuối cùng cần danh sách SKU thật.",
    "This is a recommendation built from your answers — not a quote. Final pricing and timings need a real SKU list.",
    "这是根据你的回答给出的建议——不是报价。最终价格与时效需要真实的SKU清单。",
  ),
} as const;

export const WAYBILL = {
  eyebrow: tr("05 — Gửi vận đơn", "05 — Send the waybill", "05 — 发送运单"),
  heading: tr("Chỉ còn hai dòng", "Only two lines left", "只剩两行"),
  lede: tr(
    "Phần còn lại đã được điền từ hành lang bạn vừa đi. Bên cạnh là đúng gói dữ liệu Sales nhận — không thêm gì khác.",
    "Everything else was filled in by the corridor you just walked. Beside it is exactly the data package Sales receives — nothing else.",
    "其余内容都由你刚走过的走廊填好了。旁边就是销售会收到的完整数据包——没有别的。",
  ),
  payloadHeading: tr(
    "Gói dữ liệu Sales nhận được",
    "The data package Sales receives",
    "销售收到的数据包",
  ),
  codeLabel: tr("Mã vận đơn", "Waybill code", "运单号"),
  /** The lead's provenance — the `source_page` field of the /leads contract. Named for the page,
   *  not "Nguồn", because the payload panel already has a "Nguồn hàng" row for the seller's
   *  sourcing answer and the two are different things. */
  sourcePageLabel: tr("Trang nguồn", "Source page", "来源页面"),
  /** Prefixes the corridor summary inside the message Sales reads. */
  contextHeading: tr(
    "— Trả lời trong hành lang THG —",
    "— Answered in the THG corridor —",
    "— 在 THG 走廊中的回答 —",
  ),
  dossierTitle: tr("Vận đơn", "Waybill", "运单"),
  dossierIncomplete: tr("Còn thiếu dữ liệu", "Not enough data yet", "数据还不完整"),
  dossierContinue: tr("Tiếp tục vận đơn", "Continue the waybill", "继续填运单"),
  dossierSend: tr("Gửi vận đơn", "Send the waybill", "发送运单"),
} as const;
