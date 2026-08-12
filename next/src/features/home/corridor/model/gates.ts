// The eleven gates of "Khoảng giữa" — the corridor between the buyer's click and the parcel
// touching the door. Content authority: src/reference/thg-world-camera-ro.html (`STEPS`); the VI
// strings are that reference verbatim, en/zh are faithful translations.
//
// This is pure data with no React and no DOM: the corridor scene, the sliding copy panel, the depth
// ruler and the in-corridor questions all read the SAME array, so a gate cannot exist in one
// surface and be missing from another. Localized leaves use the shared LocalizedText primitive
// (WEB-002 precedent) rather than three parallel locale objects.
import { tr, type LocalizedText } from "@/shared/i18n";

export interface CorridorGate {
  /** 1-based gate number as shown in the UI ("Cổng 03 / 11"). */
  readonly number: number;
  /** What happens at this gate. */
  readonly title: LocalizedText;
  /** What THG operates here. */
  readonly owned: LocalizedText;
  /** The named failure mode — the reason the gate is worth a stop. */
  readonly breakTitle: LocalizedText;
  /** Why that failure costs the seller money. */
  readonly breakBody: LocalizedText;
}

export const CORRIDOR_GATES: readonly CorridorGate[] = [
  {
    number: 1,
    title: tr("Nhận đơn từ sàn", "Orders arrive from the marketplace", "从平台接单"),
    owned: tr(
      "Kết nối trực tiếp với shop, đơn vào hàng đợi ngay khi phát sinh — không nhập tay, không phụ thuộc giờ hành chính.",
      "Connected straight to your shop: an order enters the queue the moment it is placed — no manual entry, no office hours.",
      "直连店铺，订单一产生就进入队列——无需手工录入，不受上班时间限制。",
    ),
    breakTitle: tr("Sót đơn giờ cao điểm", "Orders dropped at peak", "高峰期漏单"),
    breakBody: tr(
      "Đơn dồn lúc live hoặc chạy ads, xử lý thủ công là bắt đầu rơi đơn.",
      "Orders pile up during a live stream or an ad push, and manual handling starts losing them.",
      "直播或投放广告时订单集中涌入，人工处理就开始掉单。",
    ),
  },
  {
    number: 2,
    title: tr("Kiểm tra & xác nhận", "Check & confirm", "核对与确认"),
    owned: tr(
      "Soát địa chỉ, biến thể, số lượng trước khi đụng tới hàng. Đơn nghi ngờ tách ra xử lý riêng.",
      "Address, variant and quantity are verified before anyone touches stock. Suspect orders are split out and handled separately.",
      "在动货之前先核对地址、规格与数量。可疑订单单独拆出处理。",
    ),
    breakTitle: tr("Sai biến thể, sai địa chỉ", "Wrong variant, wrong address", "规格错、地址错"),
    breakBody: tr(
      "Sai màu hoặc size chỉ lộ khi khách nhận — mất cả tiền hàng lẫn tiền ship.",
      "A wrong colour or size only surfaces when the customer opens the box — you lose the goods and the shipping.",
      "颜色或尺码错误往往等客户收货才暴露——货款和运费都赔进去。",
    ),
  },
  {
    number: 3,
    title: tr("Tạo nguồn hàng", "Source the goods", "生成货源"),
    owned: tr(
      "POD: đưa vào xưởng in tại Việt Nam. Dropship: tìm nguồn và mua hộ tại 1688, Taobao, Tmall.",
      "POD: routed to our print floor in Vietnam. Dropship: sourced and purchased for you on 1688, Taobao and Tmall.",
      "POD：送入越南印厂。代发：在1688、淘宝、天猫寻源并代购。",
    ),
    breakTitle: tr("Nhà cung cấp hết hàng", "Supplier out of stock", "供应商断货"),
    breakBody: tr(
      "Nguồn báo còn nhưng thực tế đã hết — phát hiện muộn thì trễ cả chuỗi.",
      "The listing says in stock but the shelf is empty — found late, it delays the whole chain.",
      "页面显示有货实际已断——发现晚了整条链路都会延误。",
    ),
  },
  {
    number: 4,
    title: tr("Kiểm hàng đầu vào", "Inbound QC", "入库质检"),
    owned: tr(
      "QC trước khi đóng gói. Hàng lỗi bị chặn tại đây thay vì đi tiếp sang Mỹ.",
      "QC before packing. Defects are stopped here instead of flying to the US.",
      "包装前质检。次品拦截在这里，而不是飞到美国。",
    ),
    breakTitle: tr("Bỏ QC để kịp deadline", "QC skipped to hit a deadline", "为赶时间跳过质检"),
    breakBody: tr(
      "Bước bị cắt đầu tiên khi gấp — và là nguyên nhân số một của tỉ lệ hoàn cao.",
      "The first step cut when things get tight — and the number-one cause of a high return rate.",
      "赶工时第一个被砍掉的环节——也是高退货率的首要原因。",
    ),
  },
  {
    number: 5,
    title: tr("Đóng gói theo brand", "Branded packing", "品牌化包装"),
    owned: tr(
      "Bao bì, thiệp, vật tư theo nhận diện của seller. Khách cuối chỉ thấy thương hiệu của bạn.",
      "Boxes, inserts and materials follow your identity. The end customer only ever sees your brand.",
      "包装、卡片、耗材统一使用卖家识别。终端客户只看到你的品牌。",
    ),
    breakTitle: tr("Bao bì không chịu nổi đường dài", "Packaging that cannot take the distance", "包装扛不住长途"),
    breakBody: tr(
      "Gói đẹp nhưng bẹp sau chặng bay — hàng nguyên vẹn vẫn bị đánh giá xấu.",
      "A beautiful box that arrives crushed — the product is fine and the review is still bad.",
      "包装再好看，空运后压瘪——货没问题照样收到差评。",
    ),
  },
  {
    number: 6,
    title: tr("Dán label & khai báo", "Labels & declarations", "贴标与申报"),
    owned: tr(
      "Dán label sàn, khai thông tin hàng hoá đúng chuẩn tuyến đang đi.",
      "Marketplace labels applied and goods declared to the standard of the lane being used.",
      "粘贴平台面单，按所走路线的标准申报货物信息。",
    ),
    breakTitle: tr("Sai HS code, khai sai giá trị", "Wrong HS code, wrong declared value", "HS编码错、申报价值错"),
    breakBody: tr(
      "Hàng kẹt hải quan, và thường không ai biết cho tới khi quá hạn giao.",
      "The shipment sticks in customs, and usually nobody notices until the delivery promise is already broken.",
      "货卡在海关，而且通常等到超过时效才被发现。",
    ),
  },
  {
    number: 7,
    title: tr("Bàn giao carrier", "Carrier handover", "交接承运商"),
    owned: tr(
      "Chọn hãng theo trọng lượng, tuyến và cam kết thời gian từng đơn — DHL, FedEx, UPS, USPS.",
      "Carrier chosen per order by weight, lane and time commitment — DHL, FedEx, UPS, USPS.",
      "按每单的重量、路线与时效承诺选择承运商——DHL、FedEx、UPS、USPS。",
    ),
    breakTitle: tr("Trượt cut-off giờ bay", "Missing the flight cut-off", "错过航班截单"),
    breakBody: tr(
      "Muộn vài chục phút là hàng nằm lại thêm một ngày, kéo cả lô phía sau.",
      "Half an hour late means another day on the ground, dragging the whole batch behind it.",
      "晚几十分钟就要多压一天，后面整批货一起被拖住。",
    ),
  },
  {
    number: 8,
    title: tr("Vận chuyển quốc tế", "International transport", "国际运输"),
    owned: tr(
      "Hàng đi từ Việt Nam hoặc Trung Quốc sang Mỹ và worldwide, tracking xuyên suốt.",
      "Freight moves from Vietnam or China to the US and worldwide, tracked end to end.",
      "货物自越南或中国发往美国及全球，全程可追踪。",
    ),
    breakTitle: tr("Gộp chuyến, delay dây chuyền", "Consolidated flights, chain delay", "并板并航，连锁延误"),
    breakBody: tr(
      "Một chuyến bị dời làm lệch toàn bộ lịch giao phía sau, không chỉ một đơn.",
      "One rescheduled flight shifts every delivery date behind it, not just one order.",
      "一个航班改期，后面所有交付时间都跟着错位，不只影响一单。",
    ),
  },
  {
    number: 9,
    title: tr("Thông quan", "Customs clearance", "清关"),
    owned: tr(
      "Chuẩn bị chứng từ theo tuyến, theo dõi trạng thái và xử lý khi bị hỏi thêm.",
      "Documents prepared for the lane, status watched, and queries answered when they come.",
      "按路线准备单证，跟踪状态，被追问时负责处理。",
    ),
    breakTitle: tr("Thiếu chứng từ, hàng bị giữ", "Missing documents, goods held", "单证缺失，货物被扣"),
    breakBody: tr(
      "Hàng nằm kho hải quan không sinh tracking mới — sàn đọc là shop giao chậm.",
      "Sitting in a customs warehouse produces no new tracking events — the marketplace reads that as a late shop.",
      "货压在海关仓不产生新的物流轨迹——平台会判定店铺发货慢。",
    ),
  },
  {
    number: 10,
    title: tr("Giao chặng cuối", "Last-mile delivery", "尾程派送"),
    owned: tr(
      "Express giao thẳng từ quốc tế. Kho Mỹ giao nội địa từ kho THG tại Mỹ.",
      "Express delivers straight off the international leg. US Warehouse delivers domestically from THG's US facility.",
      "Express 由国际段直接派送。美国仓则从 THG 美国仓做本土派送。",
    ),
    breakTitle: tr("Giao hụt, khách vắng nhà", "Failed delivery, nobody home", "派送失败，客户不在家"),
    breakBody: tr(
      "Đơn quay đầu mất cả phí giao lẫn phí hoàn, thường kèm một đánh giá xấu.",
      "A returned parcel costs the delivery fee and the return fee, usually with a bad review attached.",
      "退回的包裹既赔派送费又赔退件费，通常还附带一个差评。",
    ),
  },
  {
    number: 11,
    title: tr("Trả & active tracking", "Return & activate tracking", "回传并激活物流号"),
    owned: tr(
      "Trả tracking và active đúng policy từng sàn, xuyên suốt cả chuỗi chứ không chỉ lúc xuất kho.",
      "Tracking returned and activated to each marketplace's policy, across the whole chain — not only at dispatch.",
      "按各平台政策回传并激活物流号，覆盖全链路，而不只是出库那一刻。",
    ),
    breakTitle: tr("Tracking không active đúng hạn", "Tracking not activated in time", "物流号未按时激活"),
    breakBody: tr(
      "Sàn phạt shop vì chỉ số giao hàng, kể cả khi hàng đã tới nơi đúng hẹn.",
      "The marketplace penalises the shop on delivery metrics even when the parcel arrived on time.",
      "即使包裹准时送达，平台仍会因物流指标处罚店铺。",
    ),
  },
];

export const GATE_COUNT = CORRIDOR_GATES.length;
