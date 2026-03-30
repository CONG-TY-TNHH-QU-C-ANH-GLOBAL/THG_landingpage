import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";
import { Shield, FileText, Truck, Package, Music } from "lucide-react";
import { useState } from "react";

const policies = [
  {
    icon: Package,
    titleKey: "policy.warehouse",
    content: {
      en: [
        "Goods must be properly packaged and labeled before being sent to the THG warehouse.",
        "THG is not responsible for goods already damaged before arrival at the warehouse.",
        "Storage fees are calculated by volume (CBM) per month and billed on the 1st of each month.",
        "Free storage for the first 30 days for new customers.",
        "Customers must notify THG at least 7 days in advance for goods retrieval.",
        "THG commits to providing 24/7 security and fire prevention systems.",
      ],
      vi: [
        "Hàng hóa phải được đóng gói đúng quy cách và dán nhãn trước khi gửi đến kho THG.",
        "THG không chịu trách nhiệm với hàng hóa đã hư hỏng trước khi đến kho.",
        "Phí lưu kho được tính theo thể tích (CBM) mỗi tháng, thanh toán vào ngày 1 hàng tháng.",
        "Miễn phí lưu kho 30 ngày đầu tiên cho khách hàng mới.",
        "Khách hàng cần thông báo trước ít nhất 7 ngày khi muốn lấy hàng.",
        "THG cam kết hệ thống an ninh và phòng cháy chữa cháy 24/7.",
      ],
      zh: [
        "货物在送往THG仓库之前必须正确包装和贴标。",
        "THG对到达仓库前已损坏的货物不承担责任。",
        "仓储费按体积（CBM）每月计算，每月1日结算。",
        "新客户前30天免费仓储。",
        "客户需提前至少7天通知THG取货。",
        "THG承诺提供24/7安保和消防系统。",
      ],
    },
  },
  {
    icon: FileText,
    titleKey: "policy.pod",
    content: {
      en: [
        "POD products will be produced within 2-4 business days after order confirmation.",
        "Quality inspection is conducted before packaging and shipping.",
        "Dropship orders are processed within 24 hours of receipt.",
        "Customers can request sample orders for quality verification at production cost.",
        "Returns are accepted within 7 days for quality issues with photo evidence.",
        "Custom design files must be submitted in high-resolution format (300 DPI minimum).",
      ],
      vi: [
        "Sản phẩm POD sẽ được sản xuất trong 2-4 ngày làm việc sau khi xác nhận đơn.",
        "Kiểm tra chất lượng được thực hiện trước khi đóng gói và vận chuyển.",
        "Đơn Dropship được xử lý trong vòng 24 giờ kể từ khi nhận đơn.",
        "Khách hàng có thể yêu cầu đơn hàng mẫu để kiểm tra chất lượng với giá sản xuất.",
        "Chấp nhận đổi trả trong 7 ngày cho các vấn đề chất lượng kèm ảnh chứng minh.",
        "File thiết kế tùy chỉnh phải được gửi ở định dạng độ phân giải cao (tối thiểu 300 DPI).",
      ],
      zh: [
        "POD产品将在订单确认后2-4个工作日内生产。",
        "包装和发货前进行质量检查。",
        "代发订单在收到后24小时内处理。",
        "客户可以按生产成本申请样品订单进行质量验证。",
        "质量问题7天内接受退货，需提供照片证据。",
        "自定义设计文件必须以高分辨率格式提交（最低300 DPI）。",
      ],
    },
  },
  {
    icon: Truck,
    titleKey: "policy.shipping",
    content: {
      en: [
        "Shipping times: US domestic 3-5 days, EU 5-8 days, UK 5-7 days.",
        "All shipments include tracking information updated in real-time.",
        "Insurance included for all orders over $50 in declared value.",
        "Dangerous goods and prohibited items are not accepted for shipping.",
        "Customs duties and import taxes are the responsibility of the buyer/consignee.",
        "Package dimensions and weight are measured using calibrated equipment.",
      ],
      vi: [
        "Thời gian vận chuyển: Nội địa US 3-5 ngày, EU 5-8 ngày, UK 5-7 ngày.",
        "Tất cả lô hàng đều có thông tin theo dõi cập nhật theo thời gian thực.",
        "Bảo hiểm được bao gồm cho tất cả đơn hàng trên $50 giá trị khai báo.",
        "Hàng nguy hiểm và hàng cấm không được chấp nhận vận chuyển.",
        "Thuế hải quan và thuế nhập khẩu do người mua/người nhận chịu trách nhiệm.",
        "Kích thước và trọng lượng kiện hàng được đo bằng thiết bị đã hiệu chuẩn.",
      ],
      zh: [
        "运输时间：美国国内3-5天，欧盟5-8天，英国5-7天。",
        "所有货物都包含实时更新的追踪信息。",
        "申报价值超过50美元的所有订单均包含保险。",
        "危险品和违禁品不接受运输。",
        "关税和进口税由买方/收货人承担。",
        "包裹尺寸和重量使用校准设备测量。",
      ],
    },
  },
  {
    icon: Shield,
    titleKey: "policy.compensation",
    content: {
      en: [
        "100% compensation for lost or damaged goods during THG handling.",
        "Claims must be filed within 14 days of delivery or expected delivery date.",
        "Compensation is based on declared value, up to a maximum of $500 per package.",
        "Photo evidence is required for all damage claims.",
        "Processing time for claims: 5-10 business days after complete documentation.",
        "THG reserves the right to investigate claims and may request additional evidence.",
      ],
      vi: [
        "Đền bù 100% cho hàng hóa bị mất hoặc hư hỏng trong quá trình THG xử lý.",
        "Khiếu nại phải được nộp trong vòng 14 ngày kể từ ngày giao hoặc ngày giao dự kiến.",
        "Đền bù dựa trên giá trị khai báo, tối đa $500/kiện hàng.",
        "Yêu cầu ảnh chứng minh cho tất cả các khiếu nại hư hỏng.",
        "Thời gian xử lý khiếu nại: 5-10 ngày làm việc sau khi có đầy đủ hồ sơ.",
        "THG có quyền điều tra khiếu nại và có thể yêu cầu bằng chứng bổ sung.",
      ],
      zh: [
        "THG处理过程中丢失或损坏的货物100%赔偿。",
        "索赔必须在交付或预计交付日期后14天内提出。",
        "赔偿基于申报价值，每包最高500美元。",
        "所有损坏索赔都需要照片证据。",
        "索赔处理时间：完整文件提交后5-10个工作日。",
        "THG保留调查索赔的权利，可能要求提供额外证据。",
      ],
    },
  },
  {
    icon: Music,
    titleKey: "policy.tiktok",
    content: {
      en: [
        "TikTok Shop orders are processed within 24 hours via THG's integrated system.",
        "Shipping labels are generated automatically from TikTok Shop's system.",
        "POD products for TikTok follow standard 2-4 day production timeline.",
        "Returns are handled according to TikTok Shop's return policy guidelines.",
        "Tracking information is automatically synced to TikTok Shop order management.",
        "Special packaging and branding options available for TikTok sellers.",
      ],
      vi: [
        "Đơn TikTok Shop được xử lý trong 24 giờ thông qua hệ thống tích hợp THG.",
        "Nhãn vận chuyển được tạo tự động từ hệ thống TikTok Shop.",
        "Sản phẩm POD cho TikTok theo tiến độ sản xuất tiêu chuẩn 2-4 ngày.",
        "Đổi trả được xử lý theo hướng dẫn chính sách đổi trả của TikTok Shop.",
        "Thông tin theo dõi được tự động đồng bộ với quản lý đơn hàng TikTok Shop.",
        "Tùy chọn đóng gói và thương hiệu đặc biệt cho seller TikTok.",
      ],
      zh: [
        "TikTok Shop订单通过THG集成系统在24小时内处理。",
        "运输标签从TikTok Shop系统自动生成。",
        "TikTok的POD产品遵循标准2-4天生产周期。",
        "退货按照TikTok Shop退货政策指南处理。",
        "追踪信息自动同步到TikTok Shop订单管理。",
        "为TikTok卖家提供特殊包装和品牌选项。",
      ],
    },
  },
];

const PolicyPage = () => {
  const { t, effectiveLanguage } = useI18n();
  const [activePolicy, setActivePolicy] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4" >THG Fulfill</p>
              <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-navy tracking-tight">{t("policy.title")}</h2>
            </div>
          </ScrollReveal>

          <div className="max-w-4xl mx-auto">
            {/* Tab navigation */}
            <ScrollReveal delay={100}>
              <div className="flex flex-wrap gap-2 mb-10 justify-center">
                {policies.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePolicy(i)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 ${activePolicy === i
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-secondary text-foreground/70 hover:bg-secondary/80"
                      }`}
                  >
                    <p.icon className="w-4 h-4" />
                    {t(p.titleKey)}
                  </button>
                ))}
              </div>
            </ScrollReveal>

            {/* Active policy content */}
            <ScrollReveal delay={200} key={activePolicy}>
              <div className="glass-card rounded-3xl p-8 md:p-12">
                <div className="flex items-center gap-4 mb-8">
                  {(() => {
                    const Icon = policies[activePolicy].icon;
                    return <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>;
                  })()}
                  <h3 className="text-2xl font-bold text-navy tracking-tight">{t(policies[activePolicy].titleKey)}</h3>
                </div>
                <ul className="space-y-4">
                  {policies[activePolicy].content[effectiveLanguage as keyof typeof policies[0]["content"]].map((item, i) => (
                    <li key={i} className="flex gap-3 text-foreground/80 leading-relaxed">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PolicyPage;
