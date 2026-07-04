// nav translation keys (prefixes: nav, brand).
// Values are moved verbatim from the original src/lib/i18n.tsx dictionary.

import { tr } from "../helpers";
import type { TranslationDict } from "../types";

export const navTranslations: TranslationDict = {
  "nav.services": tr("Services", "Dịch vụ", "服务"),
  "nav.pricing": tr("Pricing list", "Bảng giá", "价格"),
  "nav.intl_pricing": tr("International Pricing", "Bảng giá Quốc tế", "国际运费"),
  "nav.intl_pricing_desc": tr("Transparent rates for VN/CN → US/UK/EU shipping", "Cước phí minh bạch cho tuyến VN/CN → US/UK/EU", "越南/中国到美国/英国/欧盟的透明运费"),
  "nav.domestic_pricing": tr("US Domestic Pricing", "Giá nội địa Mỹ", "国内运费"),
  "nav.domestic_pricing_desc": tr("US domestic shipping rates by delivery zone", "Biểu giá theo vùng giao hàng nội địa Mỹ", "美国国内按区域运费"),
  "nav.policy": tr("Policy", "Chính sách", "政策"),
  "nav.news": tr("Blog", "Blog", "Blog"),
  "nav.tracking": tr("Tracking", "Theo dõi đơn", "订单追踪"),
  "nav.faq": tr("FAQ", "Câu hỏi thường gặp", "常见问题"),
  "nav.faq_desc": tr("Frequently asked questions about THG services", "Các câu hỏi thường gặp về dịch vụ THG", "关于THG服务的常见问题"),
  "nav.community": tr("Community", "Cộng đồng", "社区"),
  "nav.community_qa": tr("Community Q&A", "Câu hỏi cộng đồng", "社区问答"),
  "nav.community_qa_desc": tr("Ask questions, get answers from THG experts", "Đặt câu hỏi, nhận giải đáp từ chuyên gia THG", "提问并获得THG专家解答"),
  "nav.verified_reviews": tr("Verified Reviews", "Đánh giá thật", "真实评价"),
  "nav.verified_reviews_desc": tr("Real seller reviews, verified by THG", "Đánh giá thật từ seller, được THG xác thực", "经THG认证的真实卖家评价"),
  "nav.consult": tr("Get Started", "Tư vấn ngay", "立即咨询"),
  "nav.thg_fulfill": tr("THG Fulfill", "THG Fulfill", "THG Fulfill"),
  "nav.thg_express": tr("THG Express", "THG Express", "THG Express"),
  "nav.thg_warehouse": tr("THG Warehouse", "THG Warehouse", "THG Warehouse"),
  "nav.thg_order": tr("THG Dropship", "THG Dropship", "THG代发"),
  "nav.careers": tr("Careers", "Tuyển dụng", "招骋"),
  "nav.fulfill_desc": tr("POD & Dropship with competitive base pricing", "POD & Dropship với chi phí gốc cạnh tranh", "具有竞争力的POD和代发"),
  "nav.express_desc": tr("International shipping VN/CN → US/UK/EU", "Vận chuyển quốc tế VN/CN → US/UK/EU", "国际运输 VN/CN → US/UK/EU"),
  "nav.warehouse_desc": tr("US warehouse & domestic fulfillment from $1.2", "Kho & fulfill nội địa Mỹ từ 1.2$", "美国仓储及履约低至1.2美元"),
  "nav.order_desc": tr("Buy from Taobao/1688, ship direct to USA", "Mua hàng từ Taobao/1688, giao thẳng đến Mỹ", "淘宝/1688代购直邮美国"),
  "nav.catalog": tr("Product Catalog", "Catalog Mẫu Sản Phẩm", "产品目录"),
  "nav.catalog_desc": tr("Browse POD items, apparel & accessories", "Xem chi tiết áo thun, hoodie, phụ kiện POD", "浏览POD商品、服装及配件"),
  "brand.promise": tr("Happiness means: on time · on budget · in your customers' hands.", "Happiness nghĩa là: giao đúng hẹn · đúng giá · đúng tay khách hàng.", "Happiness 即：准时 · 价格透明 · 安全送达买家手中。"),
};
