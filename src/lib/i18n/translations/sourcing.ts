// sourcing translation keys (prefix: sourcing_page).
// Copy for the monthly "Top sản phẩm & nguồn hàng" page (/top-nguon-hang/:slug). The PDF content
// itself is Vietnamese, so only the surrounding UI is translated.

import { tr } from "../helpers";
import { registerTranslations } from "../registry";
import type { TranslationDict } from "../types";

export const sourcingTranslations: TranslationDict = {
  "sourcing_page.eyebrow": tr("Top products & sourcing", "Top sản phẩm & nguồn hàng", "热销产品与货源"),
  "sourcing_page.lead": tr(
    "Product and sourcing report updated by TH Group for this month (content in Vietnamese).",
    "Xem tài liệu sản phẩm và nguồn hàng được TH Group cập nhật cho tháng này.",
    "TH Group 本月更新的产品与货源报告（内容为越南语）。",
  ),
  "sourcing_page.open_pdf": tr("Open / download PDF", "Mở / tải PDF", "打开 / 下载 PDF"),
  "sourcing_page.consult": tr("Get a consultation", "Nhận tư vấn", "获取咨询"),
  "sourcing_page.page_alt": tr("Page {n} of {total}", "Trang {n} / {total}", "第 {n} 页 / 共 {total} 页"),
  "sourcing_page.scroll_hint": tr("Scroll down to read all pages", "Kéo xuống để xem tất cả các trang", "向下滚动查看全部页面"),
  "sourcing_page.no_pages": tr(
    "The page preview is being prepared. Please open the PDF to read this report.",
    "Bản xem nhanh đang được chuẩn bị. Vui lòng mở PDF để đọc báo cáo này.",
    "页面预览正在准备中，请打开 PDF 阅读本报告。",
  ),
  "sourcing_page.loading": tr("Loading...", "Đang tải...", "加载中..."),
  "sourcing_page.not_found": tr(
    "This report is not available.",
    "Báo cáo này hiện chưa có.",
    "该报告暂不可用。",
  ),
  "sourcing_page.load_error": tr("Could not load the report.", "Không tải được báo cáo.", "无法加载报告。"),
  "sourcing_page.retry": tr("Try again", "Thử lại", "重试"),
  "sourcing_page.back": tr("Back to home", "Về trang chủ", "返回首页"),
  "sourcing_page.cta_title": tr(
    "Need help sourcing these products?",
    "Cần nguồn hàng cho những sản phẩm này?",
    "需要这些产品的货源吗？",
  ),
  "sourcing_page.cta_sub": tr(
    "TH Group's team replies within 24 hours.",
    "Đội ngũ TH Group phản hồi trong 24 giờ.",
    "TH Group 团队将在 24 小时内回复。",
  ),
};

// Imported for this side effect by every module that uses these keys.
registerTranslations(sourcingTranslations);
