import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Navbar from "@/components/Navbar";
import { SeoHead } from "@/components/seo/SeoHead";
import { JsonLdBreadcrumb, JsonLdArticle } from "@/components/seo/JsonLd";

import { useCmsBlogPost } from "@/hooks/useCmsContent";
import { useI18n } from "@/lib/i18n";
import { ArrowLeft, ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";

interface DisplayArticle {
    slug: string;
    category: string;
    date: string;
    title: string;
    excerpt: string;
    body_md: string | null;
    slides: { src: string; alt_text: string }[];
}

const BlogDetailPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const { t, language: lang } = useI18n();
    const [current, setCurrent] = useState(0);
    const [lightbox, setLightbox] = useState(false);
    const cms = useCmsBlogPost(slug ?? "", lang);

    const article: DisplayArticle | undefined = useMemo(() => {
        if (!cms.data?.post) return undefined;
        const p = cms.data.post;
        return {
            slug: p.slug,
            category: p.category ?? "Báo cáo",
            date: p.published_date ?? new Date(p.updated_at * 1000).toISOString().slice(0, 10),
            title: p.title,
            excerpt: p.excerpt ?? "",
            body_md: p.body_md ?? null,
            slides: p.slides,
        };
    }, [cms.data, slug]);

    useEffect(() => { window.scrollTo(0, 0); }, [slug]);

    const prev = useCallback(() => {
        if (!article) return;
        setCurrent((c) => (c <= 0 ? article.slides.length - 1 : c - 1));
    }, [article]);

    const next = useCallback(() => {
        if (!article) return;
        setCurrent((c) => (c >= article.slides.length - 1 ? 0 : c + 1));
    }, [article]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
            if (e.key === "Escape") setLightbox(false);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [prev, next]);

    if (!article) {
        if (cms.isLoading) {
            return (
                <div className="min-h-screen bg-background">
                    <Navbar />
                    <div className="pt-28 pb-20 text-center text-muted-foreground">Đang tải...</div>
                </div>
            );
        }
        return (
            <div className="min-h-screen bg-background">
                <SeoHead title="Not found — THG Fulfill" description="" path={`/blog/${slug ?? ""}`} noindex />
                <Navbar />
                <div className="pt-28 pb-20 text-center">
                    <p className="text-xl text-muted-foreground">{t("blog.not_found")}</p>
                    <Link to={`/${lang}/blog`} className="text-primary font-semibold mt-4 inline-block hover:underline">
                        ← {t("blog.back")}
                    </Link>
                </div>

            </div>
        );
    }

    const title = article.title;
    const description = article.excerpt || `${title} — THG Fulfill`;

    return (
        <div className="min-h-screen bg-background">
            <SeoHead
                title={`${title} — THG Fulfill`}
                description={description}
                path={`/blog/${article.slug}`}
                ogType="article"
                ogImage={article.slides?.[0]?.src}
                publishedTime={article.date}
            />
            <JsonLdBreadcrumb
                items={[
                    { name: "Home", url: "https://thgfulfill.com/" },
                    { name: t("blog.title"), url: "https://thgfulfill.com/blog" },
                    { name: title, url: `https://thgfulfill.com/blog/${article.slug}` },
                ]}
            />
            <JsonLdArticle
                headline={title}
                description={description}
                image={article.slides?.[0]?.src}
                datePublished={article.date}
                url={`https://thgfulfill.com/${lang}/blog/${article.slug}`}
            />
            <Navbar />
            <div className="pt-24 pb-20">
                <div className="max-w-[900px] mx-auto px-4 sm:px-6 mb-6">
                    <Link to={`/${lang}/blog`} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        {t("blog.back")}
                    </Link>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">📊 {article.category}</span>
                        <span className="text-xs text-muted-foreground">{article.date}</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-navy tracking-tight">{title}</h1>
                </div>

                <div className="max-w-[900px] mx-auto px-4 sm:px-6">
                    {article.slides.length === 0 ? (
                        // No slides — show thumbnail or placeholder
                        <div className="bg-white rounded-2xl border border-[var(--pricing-border)] shadow-sm overflow-hidden">
                            {cms.data?.post.thumbnail_url ? (
                                <img src={cms.data.post.thumbnail_url} alt={title} className="w-full h-auto" loading="lazy" />
                            ) : (
                                <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">Chưa có ảnh nội dung</div>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="relative bg-white rounded-2xl border border-[var(--pricing-border)] shadow-sm overflow-hidden">
                                <div className="cursor-zoom-in relative" onClick={() => setLightbox(true)}>
                                    <img src={article.slides[current]?.src} alt={article.slides[current]?.alt_text || `${title} - Slide ${current + 1}`} className="w-full h-auto" loading="lazy" />
                                    <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1.5">
                                        <ZoomIn className="w-3.5 h-3.5" />
                                        {t("blog.zoom_hint")}
                                    </div>
                                </div>
                                {article.slides.length > 1 && (
                                    <>
                                        <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center text-navy hover:bg-white transition-all border border-[var(--pricing-border)]">
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center text-navy hover:bg-white transition-all border border-[var(--pricing-border)]">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {article.slides.length > 1 && (
                                <>
                                    <div className="flex items-center justify-between mt-4 mb-4">
                                        <p className="text-sm font-semibold text-navy">{t("blog.slide_label")} {current + 1} / {article.slides.length}</p>
                                        <div className="flex-1 mx-4 h-1.5 bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${((current + 1) / article.slides.length) * 100}%` }} />
                                        </div>
                                    </div>

                                    <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-thin">
                                        {article.slides.map((slide, i) => (
                                            <button key={i} onClick={() => setCurrent(i)} className={`flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border-2 transition-all ${i === current ? "border-primary shadow-md scale-105" : "border-transparent opacity-60 hover:opacity-100 hover:border-[var(--pricing-border)]"}`}>
                                                <img src={slide.src} alt={slide.alt_text || `Slide ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Article body content */}
            {(article.excerpt || article.body_md) && (
                <div className="max-w-[900px] mx-auto px-4 sm:px-6 mt-8">
                    {article.excerpt && (
                        <p className="text-base text-muted-foreground italic leading-relaxed border-l-4 border-primary/30 pl-4 mb-6">
                            {article.excerpt}
                        </p>
                    )}
                    {article.body_md && (
                        <div className="prose prose-neutral max-w-none prose-headings:text-navy prose-headings:font-bold prose-h2:text-xl prose-h3:text-lg prose-p:text-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-navy prose-ul:text-foreground prose-ol:text-foreground prose-li:my-0.5 prose-img:rounded-xl prose-img:shadow-md prose-table:text-sm">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {article.body_md}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            )}

            {lightbox && article.slides.length > 0 && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setLightbox(false)}>
                    <button onClick={() => setLightbox(false)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"><X className="w-5 h-5" /></button>
                    <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"><ChevronLeft className="w-6 h-6" /></button>
                    <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"><ChevronRight className="w-6 h-6" /></button>
                    <img src={article.slides[current]?.src} alt={article.slides[current]?.alt_text || `${title} - Slide ${current + 1}`} className="max-h-[90vh] max-w-[95vw] object-contain" onClick={(e) => e.stopPropagation()} />
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">{current + 1} / {article.slides.length}</div>
                </div>
            )}

        </div>
    );
};

export default BlogDetailPage;
