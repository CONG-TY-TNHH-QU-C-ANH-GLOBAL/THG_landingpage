import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";
import { ArrowRight, Calendar } from "lucide-react";

const newsData = [
  {
    title: {
      en: "Guide: How to Place Orders on Ecount ERP - POD/Dropship",
      vi: "Hướng dẫn cách lên đơn trên Ecount ERP - POD/Dropship",
      zh: "指南：如何在Ecount ERP上下单 - POD/代发",
    },
    desc: {
      en: "To help sellers place orders quickly and minimize errors during fulfillment, THG Fulfill provides a detailed guide on how to place orders on the ECOUNT system.",
      vi: "Nhằm hỗ trợ Seller thao tác lên đơn nhanh chóng và hạn chế lỗi trong quá trình fulfill, THG Fulfill gửi đến các seller hướng dẫn chi tiết cách lên đơn trên hệ thống ECOUNT.",
      zh: "为帮助卖家快速下单并减少履约过程中的错误，THG Fulfill提供了在ECOUNT系统上下单的详细指南。",
    },
    date: "30/12/2025",
    category: "Guide",
  },
  {
    title: {
      en: "Monthly Sourcing Report - December 2025",
      vi: "Báo cáo nguồn hàng tháng 12/2025",
      zh: "2025年12月采购月报",
    },
    desc: {
      en: "THG Fulfill has compiled the December Sourcing Summary Report featuring King of Sales rankings, real market data, and January opportunities.",
      vi: "THG Fulfill đã đúc kết Báo cáo Tổng kết Nguồn Hàng tháng 12, mang đến BXH King of Sales, dữ liệu thị trường thực chiến, và cơ hội cho tháng 1.",
      zh: "THG Fulfill编制了12月采购总结报告，包括销售之王排名、实际市场数据和1月机会。",
    },
    date: "07/01/2026",
    category: "Report",
  },
  {
    title: {
      en: "Monthly Sourcing Report - January 2026",
      vi: "Báo cáo nguồn hàng tháng 01/2026",
      zh: "2026年1月采购月报",
    },
    desc: {
      en: "Comprehensive sourcing analysis and trending product insights for eCommerce sellers entering the new year.",
      vi: "Phân tích nguồn hàng toàn diện và thông tin xu hướng sản phẩm cho các seller eCommerce bước vào năm mới.",
      zh: "面向新年电商卖家的综合采购分析和产品趋势洞察。",
    },
    date: "05/02/2026",
    category: "Report",
  },
  {
    title: {
      en: "THG Express: New EU Shipping Routes Available",
      vi: "THG Express: Mở thêm tuyến vận chuyển EU mới",
      zh: "THG Express：新增欧盟运输路线",
    },
    desc: {
      en: "THG Express expands its European network with direct shipping routes to 15 new countries, reducing delivery times by up to 30%.",
      vi: "THG Express mở rộng mạng lưới châu Âu với tuyến vận chuyển trực tiếp đến 15 quốc gia mới, giảm thời gian giao hàng tới 30%.",
      zh: "THG Express扩展欧洲网络，新增15个国家的直达运输路线，交货时间缩短30%。",
    },
    date: "15/02/2026",
    category: "News",
  },
  {
    title: {
      en: "New TikTok Shop Integration Partnership",
      vi: "Hợp tác tích hợp TikTok Shop mới",
      zh: "新的TikTok Shop整合合作",
    },
    desc: {
      en: "THG Fulfill announces seamless integration with TikTok Shop, enabling automatic order syncing and fulfillment for Vietnamese sellers.",
      vi: "THG Fulfill công bố tích hợp liền mạch với TikTok Shop, cho phép tự động đồng bộ đơn hàng và fulfillment cho seller Việt Nam.",
      zh: "THG Fulfill宣布与TikTok Shop无缝集成，为越南卖家实现自动订单同步和履约。",
    },
    date: "20/03/2026",
    category: "Partnership",
  },
  {
    title: {
      en: "Warehouse Expansion: New US Facility in North Carolina",
      vi: "Mở rộng kho: Cơ sở mới tại North Carolina, Mỹ",
      zh: "仓库扩展：北卡罗来纳州新设施",
    },
    desc: {
      en: "THG opens a second US warehouse in Winston-Salem, North Carolina to better serve East Coast eCommerce sellers.",
      vi: "THG khai trương kho thứ hai tại Mỹ ở Winston-Salem, North Carolina để phục vụ tốt hơn cho seller eCommerce bờ Đông.",
      zh: "THG在北卡罗来纳州温斯顿-塞勒姆开设第二个美国仓库，更好地服务东海岸电商卖家。",
    },
    date: "10/03/2026",
    category: "News",
  },
];

const categoryColors: Record<string, string> = {
  Guide: "bg-blue-100 text-blue-700",
  Report: "bg-emerald-100 text-emerald-700",
  News: "bg-amber-100 text-amber-700",
  Partnership: "bg-purple-100 text-purple-700",
};

const NewsPage = () => {
  const { t, language } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">THG Fulfill</p>
              <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-navy tracking-tight">{t("news.title")}</h2>
              <p className="text-muted-foreground mt-4 text-lg">{t("news.subtitle")}</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {newsData.map((news, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <article className="group bg-card rounded-2xl border border-border/60 overflow-hidden hover-lift cursor-pointer h-full flex flex-col">
                  {/* Header gradient */}
                  <div className="h-2 bg-gradient-to-r from-primary via-accent to-gold-light" />
                  
                  <div className="p-7 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[news.category] || "bg-secondary text-foreground"}`}>
                        {news.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {news.date}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-navy tracking-tight mb-3 leading-snug group-hover:text-primary transition-colors duration-300">
                      {news.title[language as keyof typeof news.title]}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                      {news.desc[language as keyof typeof news.desc]}
                    </p>

                    <div className="mt-5 pt-4 border-t border-border/50">
                      <span className="text-sm font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                        {t("news.read_more")} <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewsPage;
