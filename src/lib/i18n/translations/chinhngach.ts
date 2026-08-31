// chinhngach translation keys — /:lang/chinh-ngach-pricing (formal-customs VN→US
// rates). Rate figures themselves live in CMS pricing tables (migration 0042);
// only the page chrome and the meta-row labels are translated here.

import { tr } from "../helpers";
import type { TranslationDict } from "../types";

export const chinhNgachTranslations: TranslationDict = {
  "chinhngach.badge": tr("Formal customs · Transparent · All-in", "Chính ngạch · Minh bạch · Trọn gói", "正规报关 · 透明 · 一站式"),
  "chinhngach.title": tr("CN → US Shipping Rates — Updated 08/2026", "Bảng giá ship Trung Quốc → Hoa Kỳ — Cập nhật 08/2026", "中国 → 美国运费 — 更新于 08/2026"),
  "chinhngach.subtitle": tr("Sea, air and express shipping from China to the US — compare transit time, cargo compatibility and duty/customs coverage.", "Cước Sea, Air và Express từ Trung Quốc đến Hoa Kỳ — so sánh thời gian, loại hàng và phạm vi bao gồm thuế/hải quan.", "从中国到美国的海运、空运与快递 — 对比时效、货物类型及关税/报关范围。"),
  "chinhngach.back_intl": tr("Back to international pricing", "Quay lại bảng giá quốc tế", "返回国际运费"),
  "chinhngach.scope_notice": tr("Rates are for China → US cargo. Coverage differs by line: review each card carefully, especially DHL Express where duty and customs are not included. Contact THG for a shipment-specific quote.", "Bảng giá áp dụng cho hàng Trung Quốc → Hoa Kỳ. Phạm vi bao gồm khác nhau theo từng line: vui lòng xem kỹ từng card, đặc biệt DHL Express không gồm thuế và hải quan. Liên hệ THG để chốt giá theo lô hàng.", "以下报价适用于中国 → 美国货物。各线路包含范围不同，请仔细查看每张卡片，尤其 DHL 快递不含关税与报关。请联系 THG 获取按货物报价。"),
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
