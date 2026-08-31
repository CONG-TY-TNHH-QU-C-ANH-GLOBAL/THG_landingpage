// chinhngach translation keys — /:lang/chinh-ngach-pricing (formal-customs VN→US
// rates). Rate figures themselves live in CMS pricing tables (migration 0042);
// only the page chrome and the meta-row labels are translated here.

import { tr } from "../helpers";
import type { TranslationDict } from "../types";

export const chinhNgachTranslations: TranslationDict = {
  "chinhngach.badge": tr("Formal customs · Transparent · All-in", "Chính ngạch · Minh bạch · Trọn gói", "正规报关 · 透明 · 一站式"),
  "chinhngach.title": tr("Formal Customs Shipping Rates — Vietnam → USA", "Bảng giá ship chính ngạch — Việt Nam → Hoa Kỳ", "正规报关运费 — 越南 → 美国"),
  "chinhngach.subtitle": tr("Sea & air rates from Hai Phong, Ho Chi Minh and Da Nang to US ports — full customs paperwork, no hidden fees.", "Cước Sea & Air từ Hải Phòng, Hồ Chí Minh, Đà Nẵng đến các cảng Mỹ — đầy đủ thủ tục, không phát sinh ẩn phí.", "从海防、胡志明市、岘港至美国港口的海运与空运报价 — 手续齐全，无隐藏费用。"),
  "chinhngach.back_intl": tr("Back to international pricing", "Quay lại bảng giá quốc tế", "返回国际运费"),
  "chinhngach.scope_notice": tr("Rates below exclude domestic trucking in Vietnam, customs clearance, and last-mile delivery in the US. Contact THG for an all-in quote based on your actual shipment.", "Giá cước dưới đây chưa bao gồm phí trucking nội địa VN, thủ tục hải quan và last-mile delivery tại Mỹ. Liên hệ THG để được báo giá trọn gói theo lô hàng thực tế.", "以下运费不含越南境内拖车、报关及美国末端派送费用。请联系THG获取按实际货量的一站式报价。"),
  "chinhngach.table_pending": tr("This rate card is being updated — contact THG for the current quote.", "Bảng giá này đang được cập nhật — liên hệ THG để nhận báo giá hiện hành.", "该价目表正在更新中 — 请联系THG获取最新报价。"),

  "chinhngach.matson_title": tr("MATSON — Expedited Line", "MATSON — Line hỏa tốc", "MATSON — 加急航线"),
  "chinhngach.matson_subtitle": tr("Expedited ocean service to Long Beach, CA · weekly sailing", "Dịch vụ biển hỏa tốc đi Long Beach, CA · tàu chạy hàng tuần", "至加州长滩的加急海运 · 每周班次"),
  "chinhngach.sea_title": tr("Standard Sea Freight", "Sea chính ngạch thường", "普通海运"),
  "chinhngach.sea_subtitle": tr("LCL by W/M and full-container rates ex-HCM", "Hàng lẻ theo W/M và nguyên container, xuất phát từ HCM", "散货按W/M与整柜报价，自胡志明市出发"),
  "chinhngach.air_title": tr("Air Freight", "Vận chuyển hàng không", "空运"),
  "chinhngach.air_subtitle": tr("Ex-SGN, cartons only, by carrier and weight break", "Xuất phát SGN, cartons only, theo hãng bay và mức cân", "自SGN出发，仅限纸箱，按航司与重量段"),
  "chinhngach.customs_title": tr("Vietnam Export Customs Clearance", "Khai báo hải quan xuất VN", "越南出口报关"),
  "chinhngach.customs_subtitle": tr("Declaration cost by inspection lane, excluding 8% VAT", "Chi phí khai báo theo luồng kiểm tra, chưa gồm VAT 8%", "按查验通道的申报费用，不含8%增值税"),

  "chinhngach.meta_matson_etd": tr("Departure", "Ngày khởi hành", "开船时间"),
  "chinhngach.meta_matson_cutoff": tr("Weekly cut-off", "Cut-off hàng tuần", "每周截关"),
  "chinhngach.meta_matson_transit_port": tr("Port to port", "Cảng đến cảng", "港到港"),
  "chinhngach.meta_matson_transit_inland": tr("US inland leg", "Chặng nội địa Mỹ", "美国内陆段"),
  "chinhngach.meta_matson_transit_total": tr("Total to door", "Tổng thời gian đến door", "至门总时长"),
  "chinhngach.meta_cfs_haiphong": tr("CFS — Hai Phong", "Kho CFS — Hải Phòng", "CFS仓 — 海防"),
  "chinhngach.meta_cfs_hochiminh": tr("CFS — Ho Chi Minh", "Kho CFS — Hồ Chí Minh", "CFS仓 — 胡志明市"),
  "chinhngach.meta_cfs_us": tr("CFS — destination (US)", "Kho đích tại Mỹ", "美国目的仓"),
  "chinhngach.meta_sea_thuong_cutoff": tr("Cut-off & frequency", "Cut-off & tần suất", "截关与班期"),
  "chinhngach.meta_excl_matson": tr("Not included", "Chưa bao gồm", "不含"),
  "chinhngach.meta_excl_sea_lcl": tr("LCL — not included", "LCL — chưa bao gồm", "散货 — 不含"),
  "chinhngach.meta_excl_sea_fcl": tr("FCL — not included", "FCL — chưa bao gồm", "整柜 — 不含"),
  "chinhngach.meta_excl_air": tr("Air — not included", "Air — chưa bao gồm", "空运 — 不含"),
  "chinhngach.meta_validity": tr("Validity", "Hiệu lực giá", "价格有效期"),

  "chinhngach.cta_title": tr("Need an all-in quote for your shipment?", "Cần báo giá trọn gói cho lô hàng của bạn?", "需要按您货量的一站式报价？"),
  "chinhngach.cta_desc": tr("Send us the route, volume and commodity — THG returns a door-to-door figure including trucking, customs and last-mile.", "Gửi tuyến, sản lượng và mặt hàng — THG báo lại con số door-to-door đã gồm trucking, hải quan và last-mile.", "告知航线、货量与品名 — THG将返回含拖车、报关及末端派送的门到门报价。"),
  "chinhngach.cta_btn": tr("Request a quote", "Liên hệ báo giá", "联系报价"),
};
