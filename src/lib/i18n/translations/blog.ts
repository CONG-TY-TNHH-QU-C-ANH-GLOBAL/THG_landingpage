// blog translation keys (prefixes: blog, news).
// Values are moved verbatim from the original src/lib/i18n.tsx dictionary.

import { tr } from "../helpers";
import type { TranslationDict } from "../types";

export const blogTranslations: TranslationDict = {
  "blog.contents": tr("Contents", "Nội dung chính", "目录"),
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
  "blog.list_loading": tr("Loading articles...", "Đang tải bài viết...", "正在加载文章…"),
  "blog.list_empty": tr("No articles yet. Please check back later.", "Chưa có bài viết nào. Vui lòng quay lại sau.", "暂无文章，请稍后再来。"),
  "blog.load_error": tr("Unable to load articles. Please try again.", "Chưa thể tải bài viết. Vui lòng thử lại.", "暂时无法加载文章，请重试。"),
  "blog.retry": tr("Try again", "Thử lại", "重试"),
  "blog.preview": tr("Review preview · Not published", "Bản xem trước để duyệt · Chưa xuất bản", "审核预览 · 尚未发布"),
  "event.loading": tr("Loading events…", "Đang tải sự kiện…", "正在加载活动…"),
  "event.load_error": tr("Unable to load events. Please try again.", "Chưa thể tải sự kiện. Vui lòng thử lại.", "暂时无法加载活动，请重试。"),
  "event.not_found": tr("Event not found", "Không tìm thấy sự kiện", "未找到活动"),
  "event.back": tr("Back to events", "Quay lại sự kiện", "返回活动列表"),
  "event.empty": tr("No events published in this language yet.", "Chưa có sự kiện được xuất bản cho ngôn ngữ này.", "此语言暂无已发布活动。"),
};
