// common translation keys (prefixes: policy, notfound).
// Values are moved verbatim from the original src/lib/i18n.tsx dictionary.

import { tr } from "../helpers";
import type { TranslationDict } from "../types";

export const commonTranslations: TranslationDict = {
  "policy.subtitle": tr("Select a section below to view policy details", "Chọn mục bên dưới để xem chi tiết chính sách", "选择以下部分查看政策详情"),
  "policy.title": tr("Policies & Terms", "Chính sách & Điều khoản", "政策与条款"),
  "notfound.message": tr("Oops! Page not found", "Rất tiếc! Không tìm thấy trang", "抱歉！页面未找到"),
  "notfound.home": tr("Return to Home", "Về trang chủ", "返回首页"),
  "common.loading": tr("Loading...", "Đang tải...", "加载中…"),
  "policy.loading": tr("Loading policies...", "Đang tải chính sách...", "正在加载政策…"),
  "policy.empty": tr("No policies available yet.", "Chưa có chính sách nào.", "暂无政策。"),
};
