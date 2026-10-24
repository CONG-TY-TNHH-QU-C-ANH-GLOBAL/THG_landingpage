// Campaign list/detail page keys (prefix: campaign). Navbar and home-banner
// keys live in ./nav because they ship with the shell.

import { tr } from "../helpers";
import { registerTranslations } from "../registry";
import type { TranslationDict } from "../types";

export const campaignTranslations: TranslationDict = {
  "campaign.title": tr("Programs", "Chương trình", "活动专题"),
  "campaign.seo_title": tr("Programs & offers — TH Group", "Chương trình & ưu đãi — TH Group", "活动与优惠 — TH Group"),
  "campaign.subtitle": tr(
    "Seasonal product collections and discount programs from TH Group.",
    "Bộ sưu tập sản phẩm theo mùa và chương trình ưu đãi từ TH Group.",
    "TH Group 的季节产品系列与优惠活动。",
  ),
  "campaign.loading": tr("Loading programs…", "Đang tải chương trình…", "正在加载活动…"),
  "campaign.load_error": tr(
    "Programs could not be loaded right now.",
    "Chưa tải được chương trình, vui lòng thử lại.",
    "暂时无法加载活动。",
  ),
  "campaign.empty": tr("No programs are running right now.", "Hiện chưa có chương trình nào.", "目前没有进行中的活动。"),
  "campaign.not_found": tr("This program has ended or does not exist.", "Chương trình đã kết thúc hoặc không tồn tại.", "该活动已结束或不存在。"),
  "campaign.back": tr("All programs", "Tất cả chương trình", "全部活动"),
  "campaign.retry": tr("Try again", "Thử lại", "重试"),
  "campaign.contents": tr("Contents", "Nội dung chính", "目录"),
  "campaign.home": tr("Home", "Trang chủ", "首页"),
};

// Imported for this side effect by every module that uses these keys.
registerTranslations(campaignTranslations);
