import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";
import { Calendar, ArrowRight, Tag } from "lucide-react";
import { useState } from "react";
import { blogArticles } from "@/data/blogData";

const BlogPage = () => {
  const { t, language } = useI18n();
  const [activeCategory, setActiveCategory] = useState("All");

  const categoryKeys = ["All", "Báo cáo"];

  const sorted = [...blogArticles].sort((a, b) => b.date.localeCompare(a.date));
  const filtered = activeCategory === "All" ? sorted : sorted.filter((p) => p.category === activeCategory);
  const featured = filtered.find((p) => p.featured) || filtered[0];
  const rest = filtered.filter((p) => p.id !== featured?.id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">{t("blog.eyebrow")}</p>
              <h2 className="text-4xl md:text-5xl font-bold text-navy tracking-tight">{t("blog.title")}</h2>
              <p className="text-muted-foreground mt-3">{t("blog.subtitle")}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="flex flex-wrap gap-2 mb-12 justify-center">
              {categoryKeys.map((c) => (
                <button key={c} onClick={() => setActiveCategory(c)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === c ? "bg-primary text-primary-foreground shadow-lg" : "bg-secondary text-foreground/70 hover:bg-secondary/80"}`}>
                  {c === "All" ? t("blog.cat_all") : c === "Báo cáo" ? t("blog.cat_report") : c}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {featured && (
            <ScrollReveal delay={150}>
              <Link to={`/blog/${featured.slug}`} className="glass-card rounded-3xl overflow-hidden mb-10 group cursor-pointer hover-lift block">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="bg-secondary/10 min-h-[280px] flex items-center justify-center overflow-hidden">
                    <img src={featured.thumbnail} alt={featured.title[language]} className="w-full h-full object-cover max-h-[400px] group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium"><Tag className="w-3 h-3" /> {featured.category}</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="w-3 h-3" /> {featured.date}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-navy tracking-tight mb-3 group-hover:text-primary transition-colors">{featured.title[language]}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{featured.excerpt[language]}</p>
                    <p className="text-xs text-muted-foreground mb-5">📊 {featured.slides.length} {t("blog.slides_count")}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">{t("news.read_more")} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post, i) => (
              <ScrollReveal key={post.id} delay={i * 80}>
                <Link to={`/blog/${post.slug}`} className="glass-card rounded-2xl overflow-hidden group cursor-pointer hover-lift h-full flex flex-col">
                  <div className="bg-secondary/10 h-56 flex items-center justify-center overflow-hidden">
                    <img src={post.thumbnail} alt={post.title[language]} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">{post.category}</span>
                      <span className="text-xs text-muted-foreground">{post.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-navy tracking-tight mb-2 group-hover:text-primary transition-colors flex-1">{post.title[language]}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">{post.excerpt[language]}</p>
                    <p className="text-xs text-muted-foreground mb-4">📊 {post.slides.length} {t("blog.slides_count")}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-auto">{t("news.read_more")} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                  </div>
                </Link>
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
