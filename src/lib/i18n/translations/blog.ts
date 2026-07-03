// blog translation keys (prefixes: blog, news).
// Values are moved verbatim from the original src/lib/i18n.tsx dictionary.

import { tr } from "../helpers";
import type { TranslationDict } from "../types";

export const blogTranslations: TranslationDict = {
  "blog.title": tr("News & Insights", "Tin tức & Kiến thức", "新闻与见解"),
  "blog.subtitle": tr("Stay updated with the latest from THG", "Cập nhật tin tức mới nhất từ THG", "关注THG的最新动态"),
  "news.read_more": tr("Read more", "Đọc thêm", "阅读更多"),
  "blog.eyebrow": tr("THG Blog", "THG Blog", "THG博客"),
  "blog.cat_all": tr("All", "Tất cả", "全部"),
  "blog.cat_report": tr("Reports", "Báo cáo", "报告"),
  "blog.back": tr("Back to Blog", "Quay lại Tin tức", "返回博客"),
  "blog.slides_count": tr("slides", "slides", "张幻灯片"),
  "blog.slide_label": tr("Slide", "Slide", "幻灯片"),
  "blog.zoom_hint": tr("Click to zoom", "Nhấn để phóng to", "点击放大"),
  "blog.not_found": tr("Article not found", "Không tìm thấy bài viết", "未找到文章"),
};
