import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n, Language } from "@/lib/i18n";
import { Calendar, ArrowRight, Tag } from "lucide-react";
import { useState } from "react";

interface BlogPost {
  id: string;
  category: string;
  date: string;
  title: Record<Language, string>;
  excerpt: Record<Language, string>;
  featured?: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    category: "POD",
    date: "2026-03-25",
    title: {
      en: "Top 10 POD Products That Sell Best on TikTok Shop in 2026",
      vi: "Top 10 sản phẩm POD bán chạy nhất trên TikTok Shop 2026",
      zh: "2026年TikTok Shop最畅销的10款POD产品",
    },
    excerpt: {
      en: "Discover the trending Print on Demand products dominating TikTok Shop sales with high margins and fast shipping.",
      vi: "Khám phá các sản phẩm POD đang trending trên TikTok Shop với biên lợi nhuận cao và giao hàng nhanh.",
      zh: "发现在TikTok Shop上占据销售主导地位的热门按需印刷产品。",
    },
    featured: true,
  },
  {
    id: "2",
    category: "Logistics",
    date: "2026-03-20",
    title: {
      en: "How THG Express Cuts Shipping Time from China to US by 40%",
      vi: "Cách THG Express giảm 40% thời gian vận chuyển Trung Quốc - Mỹ",
      zh: "THG Express如何将中美运输时间缩短40%",
    },
    excerpt: {
      en: "Learn about our optimized shipping routes and dedicated air freight lines that make 3-5 day delivery possible.",
      vi: "Tìm hiểu về tuyến vận chuyển tối ưu và đường bay riêng giúp giao hàng 3-5 ngày trở nên khả thi.",
      zh: "了解我们优化的运输路线和专线空运如何实现3-5天交货。",
    },
  },
  {
    id: "3",
    category: "Warehouse",
    date: "2026-03-15",
    title: {
      en: "THG Warehouse US: Free 90-Day Storage for New Sellers",
      vi: "THG Warehouse US: Miễn phí lưu kho 90 ngày cho seller mới",
      zh: "THG Warehouse美国：新卖家90天免费仓储",
    },
    excerpt: {
      en: "Take advantage of our promotional storage program designed to help new sellers test the US market risk-free.",
      vi: "Tận dụng chương trình ưu đãi lưu kho giúp seller mới thử nghiệm thị trường Mỹ không rủi ro.",
      zh: "利用我们的促销仓储计划，帮助新卖家零风险试水美国市场。",
    },
  },
  {
    id: "4",
    category: "eCommerce",
    date: "2026-03-10",
    title: {
      en: "Complete Guide: Selling on Amazon FBA/FBM with THG Warehouse",
      vi: "Hướng dẫn đầy đủ: Bán hàng Amazon FBA/FBM với THG Warehouse",
      zh: "完整指南：通过THG Warehouse在Amazon FBA/FBM上销售",
    },
    excerpt: {
      en: "Step-by-step guide on how to leverage THG Warehouse for your Amazon business with inventory management and fulfillment.",
      vi: "Hướng dẫn chi tiết cách tận dụng THG Warehouse cho kinh doanh Amazon với quản lý tồn kho và fulfill.",
      zh: "逐步指南，教您如何利用THG Warehouse进行Amazon业务的库存管理和履约。",
    },
  },
  {
    id: "5",
    category: "THG News",
    date: "2026-03-05",
    title: {
      en: "THG Fulfill Opens New Warehouse in Winston-Salem, NC",
      vi: "THG Fulfill khai trương kho mới tại Winston-Salem, NC",
      zh: "THG Fulfill在北卡罗来纳州温斯顿-塞勒姆开设新仓库",
    },
    excerpt: {
      en: "Expanding our US warehouse network to provide faster delivery coverage across the East Coast and Southern states.",
      vi: "Mở rộng mạng lưới kho tại Mỹ để phủ sóng giao hàng nhanh hơn khu vực Bờ Đông và các bang miền Nam.",
      zh: "扩大我们的美国仓库网络，为东海岸和南部各州提供更快的配送覆盖。",
    },
  },
  {
    id: "6",
    category: "Tips",
    date: "2026-02-28",
    title: {
      en: "5 Costly Mistakes Sellers Make When Choosing a Fulfillment Partner",
      vi: "5 sai lầm tốn kém khi chọn đối tác Fulfillment",
      zh: "卖家选择履约合作伙伴时常犯的5个代价高昂的错误",
    },
    excerpt: {
      en: "Avoid these common pitfalls that can eat into your margins and damage customer satisfaction.",
      vi: "Tránh những cạm bẫy phổ biến có thể ăn mòn lợi nhuận và ảnh hưởng đến sự hài lòng của khách hàng.",
      zh: "避免这些可能侵蚀利润并损害客户满意度的常见陷阱。",
    },
  },
];

const categories = ["All", "POD", "Logistics", "Warehouse", "eCommerce", "THG News", "Tips"];

const BlogPage = () => {
  const { t, language } = useI18n();
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All" ? blogPosts : blogPosts.filter((p) => p.category === activeCategory);
  const featured = filtered.find((p) => p.featured) || filtered[0];
  const rest = filtered.filter((p) => p.id !== featured?.id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">THG Blog</p>
              <h2 className="text-4xl md:text-5xl font-bold text-navy tracking-tight">{t("blog.title")}</h2>
              <p className="text-muted-foreground mt-3">{t("blog.subtitle")}</p>
            </div>
          </ScrollReveal>

          {/* Category filter */}
          <ScrollReveal delay={100}>
            <div className="flex flex-wrap gap-2 mb-12 justify-center">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === c ? "bg-primary text-primary-foreground shadow-lg" : "bg-secondary text-foreground/70 hover:bg-secondary/80"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Featured post */}
          {featured && (
            <ScrollReveal delay={150}>
              <div className="glass-card rounded-3xl overflow-hidden mb-10 group cursor-pointer hover-lift">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="bg-secondary/40 min-h-[280px] flex items-center justify-center">
                    <div className="text-6xl opacity-30">📝</div>
                  </div>
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                        <Tag className="w-3 h-3" /> {featured.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" /> {featured.date}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-navy tracking-tight mb-3 group-hover:text-primary transition-colors">{featured.title[language]}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">{featured.excerpt[language]}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      {t("news.read_more")} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post, i) => (
              <ScrollReveal key={post.id} delay={i * 80}>
                <div className="glass-card rounded-2xl overflow-hidden group cursor-pointer hover-lift h-full flex flex-col">
                  <div className="bg-secondary/30 h-48 flex items-center justify-center">
                    <div className="text-4xl opacity-20">📄</div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{post.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-navy tracking-tight mb-2 group-hover:text-primary transition-colors flex-1">{post.title[language]}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{post.excerpt[language]}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-auto">
                      {t("news.read_more")} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPage;
