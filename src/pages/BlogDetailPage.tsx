import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { ArticleMarkdown } from "@/components/article/ArticleMarkdown";
import { SeoHead } from "@/components/seo/SeoHead";
import { JsonLdBreadcrumb, JsonLdArticle } from "@/components/seo/JsonLd";

import { useCmsBlogPost, useCmsBlogPreview } from "@/hooks/useCmsContent";
import { CmsHttpError } from "@/lib/cmsClient";
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
    thumbnail_url: string | null;
    seo_title: string | null;
    seo_description: string | null;
}

const BlogDetailPage = () => {
    const { slug, token } = useParams<{ slug?: string; token?: string }>();
    const { t, language: lang } = useI18n();
    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
    const isPreview = token !== undefined;
    const cms = useCmsBlogPost(slug ?? "", lang, !isPreview);
    const preview = useCmsBlogPreview(token ?? "");
    const query = isPreview ? preview : cms;
    const [previewExpired, setPreviewExpired] = useState(false);
    const expiresAt = preview.data?.preview.expiresAt;

    useEffect(() => {
        setPreviewExpired(false);
        if (!isPreview || !expiresAt) return;
        const remaining = Date.parse(expiresAt) - Date.now();
        if (remaining <= 0) { setPreviewExpired(true); return; }
        const timer = setTimeout(() => setPreviewExpired(true), remaining);
        return () => clearTimeout(timer);
    }, [isPreview, expiresAt, token]);

    const article: DisplayArticle | undefined = useMemo(() => {
        const p = isPreview ? preview.data?.preview : cms.data?.post;
        if (!p || (isPreview && (previewExpired || (expiresAt && Date.parse(expiresAt) <= Date.now())))) return undefined;
        return {
            slug: p.slug,
            category: p.category ?? "Báo cáo",
            date: p.published_date ?? (isPreview ? new Date().toISOString().slice(0, 10) : new Date(cms.data!.post.updated_at * 1000).toISOString().slice(0, 10)),
            title: p.title,
            excerpt: p.excerpt ?? "",
            body_md: p.body_md ?? null,
            slides: p.slides,
            thumbnail_url: p.thumbnail_url ?? null,
            seo_title: p.seo_title,
            seo_description: p.seo_description,
        };
    }, [cms.data, preview.data, isPreview, previewExpired, expiresAt]);

    useEffect(() => { window.scrollTo(0, 0); setLightboxIdx(null); }, [slug, token]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (lightboxIdx === null) return;
            if (!article) return;
            if (e.key === "ArrowLeft") setLightboxIdx(i => i !== null && i > 0 ? i - 1 : article.slides.length - 1);
            if (e.key === "ArrowRight") setLightboxIdx(i => i !== null && i < article.slides.length - 1 ? i + 1 : 0);
            if (e.key === "Escape") setLightboxIdx(null);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [lightboxIdx, article]);

    if (!article) {
        if (query.isLoading) {
            return (
                <div className="min-h-screen bg-background">
                    <Navbar />
                    {isPreview && <SeoHead title={t("blog.preview")} description="" path={`/blog-preview/${token}`} noindex noReferrer />}
                    <div className="pt-28 pb-20 text-center text-muted-foreground">{t("common.loading")}</div>
                </div>
            );
        }
        const missing = (query.error instanceof CmsHttpError && query.error.status === 404) || (isPreview && (!/^[a-f0-9]{64}$/.test(token ?? "") || previewExpired || (expiresAt && Date.parse(expiresAt) <= Date.now())));
        if (!missing) {
            return (
                <div className="min-h-screen bg-background">
                    <SeoHead title={`${t("blog.title")} — THG Fulfill`} description="" path={isPreview ? `/blog-preview/${token}` : `/blog/${slug ?? ""}`} noindex={isPreview} noReferrer={isPreview} />
                    <Navbar />
                    <div className="pt-28 pb-20 text-center" role="alert">
                        <p className="text-muted-foreground">{t("blog.load_error")}</p>
                        <button type="button" onClick={() => void query.refetch()} disabled={query.isFetching} className="text-primary font-semibold mt-4">
                            {t("blog.retry")}
                        </button>
                    </div>
                </div>
            );
        }
        return (
            <div className="min-h-screen bg-background">
                <SeoHead title="Not found — THG Fulfill" description="" path={isPreview ? `/blog-preview/${token}` : `/blog/${slug ?? ""}`} noindex noReferrer={isPreview} />
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
    const featuredSrc = article.slides[0]?.src ?? article.thumbnail_url;
    const featuredAlt = article.slides[0]?.alt_text || title;
    const gallerySlides = article.slides.slice(1);

    return (
        <div className="min-h-screen bg-background">
            <SeoHead
                title={article.seo_title || `${title} — THG Fulfill`}
                description={article.seo_description || description}
                path={isPreview ? `/blog-preview/${token}` : `/blog/${article.slug}`}
                ogType="article"
                ogImage={featuredSrc ?? undefined}
                publishedTime={article.date}
                availableLocales={cms.data?.available_locales.length ? cms.data.available_locales : [lang]}
                noindex={isPreview}
                noReferrer={isPreview}
            />
            {!isPreview && <JsonLdBreadcrumb
                items={[
                    { name: "Home", url: `https://thgfulfill.com/${lang}` },
                    { name: t("blog.title"), url: `https://thgfulfill.com/${lang}/blog` },
                    { name: title, url: `https://thgfulfill.com/${lang}/blog/${article.slug}` },
                ]}
            />}
            {!isPreview && <JsonLdArticle
                headline={title}
                description={description}
                image={featuredSrc ?? undefined}
                datePublished={article.date}
                url={`https://thgfulfill.com/${lang}/blog/${article.slug}`}
            />}
            <Navbar />

            <div className="pt-24 pb-20">
                <div className="max-w-[860px] mx-auto px-4 sm:px-6">
                    {isPreview && <div role="status" className="mb-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">{t("blog.preview")}</div>}

                    {/* Header */}
                    <Link to={`/${lang}/blog`} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-5">
                        <ArrowLeft className="w-4 h-4" />
                        {t("blog.back")}
                    </Link>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">📊 {article.category}</span>
                        <span className="text-xs text-muted-foreground">{article.date}</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-navy tracking-tight mb-6">{title}</h1>

                    {/* Featured image */}
                    {featuredSrc && (
                        <div
                            className="relative rounded-2xl overflow-hidden border border-[var(--pricing-border)] shadow-sm mb-6 cursor-zoom-in"
                            onClick={() => setLightboxIdx(0)}
                        >
                            <img
                                src={featuredSrc}
                                alt={featuredAlt}
                                className="w-full h-auto"
                                loading="eager"
                                decoding="async"
                            />
                            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1.5">
                                <ZoomIn className="w-3.5 h-3.5" />
                                {t("blog.zoom_hint")}
                            </div>
                        </div>
                    )}

                    {/* Excerpt — lead paragraph */}
                    {article.excerpt && (
                        <p className="text-lg italic text-muted-foreground leading-relaxed border-l-4 border-primary pl-5 mb-8">
                            {article.excerpt}
                        </p>
                    )}

                    {/* Article body */}
                    {article.body_md ? <ArticleMarkdown markdown={article.body_md} contentsLabel={t("blog.contents")} className="mb-10" /> : null}

                    {/* Gallery — remaining slides */}
                    {gallerySlides.length > 0 && (
                        <div className="mt-4 mb-6">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                                Ảnh liên quan ({gallerySlides.length})
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {gallerySlides.map((slide, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setLightboxIdx(i + 1)}
                                        className="rounded-lg overflow-hidden border border-[var(--pricing-border)] hover:opacity-90 transition-opacity aspect-video"
                                    >
                                        <img
                                            src={slide.src}
                                            alt={slide.alt_text || `${title} - ảnh ${i + 2}`}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox */}
            {lightboxIdx !== null && article.slides.length > 0 && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
                    onClick={() => setLightboxIdx(null)}
                >
                    <button
                        onClick={() => setLightboxIdx(null)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    {article.slides.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); setLightboxIdx(i => i !== null && i > 0 ? i - 1 : article.slides.length - 1); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setLightboxIdx(i => i !== null && i < article.slides.length - 1 ? i + 1 : 0); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}
                    <img
                        src={article.slides[lightboxIdx]?.src}
                        alt={article.slides[lightboxIdx]?.alt_text || `${title} - ảnh ${lightboxIdx + 1}`}
                        className="max-h-[90vh] max-w-[95vw] object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                    {article.slides.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
                            {lightboxIdx + 1} / {article.slides.length}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BlogDetailPage;
