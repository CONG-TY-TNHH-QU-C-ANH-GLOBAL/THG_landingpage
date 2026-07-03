import { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "@/components/Navbar";
import { SeoHead } from "@/components/seo/SeoHead";
import { JsonLdBreadcrumb } from "@/components/seo/JsonLd";

import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";
import { fetchCatalog, fetchProduct, type CatalogProduct, type CatalogResponse, type CatalogCollection } from "@/lib/catalogApi";
import { countryFlag, countryName } from "@/lib/country-flags";
import { parseYouTubeId, youtubeThumb, youtubeEmbedUrl, isYouTubeShort } from "@/lib/youtube";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  Search, Tag, Filter, ChevronLeft, ChevronRight, X,
  MessageCircle, Share2, Check, Package,
} from "lucide-react";

import { CATEGORIES, NO_SERIES_KEY, categoryIcons, categoryMeta } from "@/pages/catalog/data";
import { DELAYS, LIMITS } from "@/lib/constants";

const PAGE_LIMIT = LIMITS.CATALOG_PAGE_LIMIT;

const CatalogPage = () => {
  const { t, language } = useI18n();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [originCounts, setOriginCounts] = useState<Record<string, number>>({});
  const [collections, setCollections] = useState<CatalogCollection[]>([]);
  // THG-CAT: danh mục render động từ hub (product_categories). CATEGORIES giữ làm fallback.
  const [categories, setCategories] = useState<string[]>(CATEGORIES);

  const [activeCategory, setActiveCategory] = useState<string>("");
  const [activeOrigin, setActiveOrigin] = useState<string>("");
  const [activeCollections, setActiveCollections] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false); // THG-CAT-006
  const [shareCopied, setShareCopied] = useState(false);
  // THG-TASK-019: track image URLs that failed to load so subsequent
  // re-renders fall back to the Package placeholder instead of the
  // browser default broken-image icon. Keyed by URL, deduped across
  // list cards + modal so the same broken CDN URL doesn't render the
  // broken icon multiple times.
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
  const markBroken = useCallback((src: string) => {
    if (!src) return;
    setBrokenImages((prev) => {
      if (prev.has(src)) return prev;
      const next = new Set(prev);
      next.add(src);
      return next;
    });
  }, []);
  // v4 modal state — shipping channel toggle + selected variant + active series
  const [shipping, setShipping] = useState<"lbl" | "mer">("lbl");
  // Track selection by variant id (stable across series filter changes) rather
  // than by array index, which would shift when filtering by series.
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);

  const searchTimer = useRef<NodeJS.Timeout>();
  // Track latest fetched product id so out-of-order fetches don't override a newer click
  const latestProductIdRef = useRef<string | null>(null);

  // Default the selected variant + series to the first variant once the full
  // product (with variants) loads. Called from every code path that populates
  // `selectedProduct` with a variants-bearing response, so the modal always
  // opens with a sensible default regardless of whether we came from a list
  // click, a deep link, or a re-fetch.
  const initializeSelection = useCallback((product: CatalogProduct) => {
    const vs = product.variants ?? [];
    if (vs.length === 0) {
      setSelectedSeries(null);
      setSelectedVariantId(null);
      return;
    }
    const first = vs[0];
    const key = (first.series && first.series.trim()) ? first.series : NO_SERIES_KEY;
    setSelectedSeries(key);
    setSelectedVariantId(first.id ?? null);
  }, []);

  // Open product modal + push product id to URL for shareable link
  const openProduct = useCallback((product: CatalogProduct) => {
    latestProductIdRef.current = product.id;
    setSelectedProduct(product);
    setActiveImage(0);
    setVideoPlaying(false); // THG-CAT-006
    setShareCopied(false);
    setShipping("lbl");
    // Reset selection — it'll be populated by initializeSelection once the
    // full product (with variants) resolves from fetchProduct.
    setSelectedVariantId(null);
    setSelectedSeries(null);
    // Fetch full detail (with variants) for modal display.
    // Only apply if user is still viewing this product when fetch resolves.
    fetchProduct(product.id)
      .then((full) => {
        if (latestProductIdRef.current === product.id) {
          setSelectedProduct(full);
          initializeSelection(full);
        }
      })
      .catch(() => { /* keep list-level data */ });
    const url = new URL(window.location.href);
    url.searchParams.set("productId", product.id);
    window.history.replaceState(null, "", url.toString());
  }, [initializeSelection]);

  const closeProduct = useCallback(() => {
    latestProductIdRef.current = null;
    setSelectedProduct(null);
    setShipping("lbl");
    setSelectedVariantId(null);
    setSelectedSeries(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("productId");
    window.history.replaceState(null, "", url.pathname + (url.search || "") + url.hash);
  }, []);

  const handleShare = useCallback(async () => {
    if (!selectedProduct) return;
    const url = new URL(window.location.href);
    url.searchParams.set("productId", selectedProduct.id);
    const shareUrl = url.toString();
    try {
      // Prefer Web Share API on mobile
      if (navigator.share) {
        await navigator.share({ title: selectedProduct.name, url: shareUrl });
        return;
      }
    } catch { /* user cancelled — fall through to clipboard */ }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), DELAYS.CLIPBOARD_COPIED_FEEDBACK_MS);
    } catch { /* ignore */ }
  }, [selectedProduct]);

  // Deep-link: read ?productId= on mount and open modal
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pid = params.get("productId");
    if (!pid) return;
    latestProductIdRef.current = pid;
    fetchProduct(pid)
      .then((p) => {
        if (latestProductIdRef.current === pid) {
          setSelectedProduct(p);
          setActiveImage(0);
          setVideoPlaying(false); // THG-CAT-006
          setShipping("lbl");
          initializeSelection(p);
        }
      })
      .catch(() => {
        // Invalid productId — clean URL
        latestProductIdRef.current = null;
        const url = new URL(window.location.href);
        url.searchParams.delete("productId");
        window.history.replaceState(null, "", url.pathname + (url.search || "") + url.hash);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res: CatalogResponse = await fetchCatalog({
        page,
        limit: PAGE_LIMIT,
        category: activeCategory || undefined,
        origin: activeOrigin || undefined,
        search: search || undefined,
        collection: activeCollections.length ? activeCollections : undefined,
      });
      setProducts(res.data);
      setPagination(res.pagination);
      setCategoryCounts(res.categoryCounts);
      setOriginCounts(res.originCounts);
      if (res.collections) setCollections(res.collections);
      if (res.categories?.length) setCategories(res.categories.map((c) => c.name));
    } catch {
      // API not available yet — keep empty state
    } finally {
      setLoading(false);
    }
  }, [page, activeCategory, activeOrigin, search, activeCollections]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const handleSearch = (val: string) => {
    setSearchInput(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearch(val);
      setPage(1);
    }, 400);
  };

  const handleCategory = (cat: string) => {
    setActiveCategory(activeCategory === cat ? "" : cat);
    setPage(1);
  };

  const handleOrigin = (origin: string) => {
    setActiveOrigin(activeOrigin === origin ? "" : origin);
    setPage(1);
  };

  const handleCollection = (slug: string) => {
    setActiveCollections((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
    setPage(1);
  };

  const totalAll = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-cream">
      <SeoHead
        title={t("seo.catalog_title")}
        description={t("seo.catalog_desc")}
        path="/catalog"
      />
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://thgfulfill.com/" },
          { name: t("catalog_page.title"), url: "https://thgfulfill.com/catalog" },
        ]}
      />
      <Navbar variant="darkHero" />

      {/* Hero */}
      <section className="pt-28 pb-10 md:pt-36 md:pb-14 bg-gradient-to-b from-navy via-navy/95 to-navy/85 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <Tag className="w-4 h-4 text-primary" />
              <span className="text-sm text-white/80">{t("catalog.pod_badge")}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {t("catalog_page.title")}
            </h1>
            <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              {t("catalog_page.subtitle")}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Main content: sidebar + grid */}
      <div className="container mx-auto px-4 py-6 flex gap-6">

        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-24 space-y-2">
            {/* All */}
            <button
              onClick={() => { setActiveCategory(""); setPage(1); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${!activeCategory ? "bg-navy text-white shadow-lg" : "text-foreground/70 hover:bg-secondary"
                }`}
            >
              <Filter className="w-4 h-4" />
              <span>{t("catalog_page.filter_all")}</span>
              <span className="ml-auto text-xs opacity-70">{totalAll}</span>
            </button>

            {categories.map((cat) => {
              const Icon = categoryIcons[cat] || Package;
              const count = categoryCounts[cat] || 0;
              if (count === 0) return null;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeCategory === cat ? "bg-navy text-white shadow-lg" : "text-foreground/70 hover:bg-secondary"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="truncate">{cat}</span>
                  <span className="ml-auto text-xs opacity-70">{count}</span>
                </button>
              );
            })}

            {/* Origin filter — THG-CAT-005: render ĐỘNG từ originCounts, auto mọi
                nước (UK/TH/JP/AU…) với cờ + tên theo ISO, KHÔNG hardcode. */}
            <div className="pt-4 border-t border-border/30">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 pb-2">{t("catalog.origin_label")}</p>
              {Object.keys(originCounts)
                .filter((o) => o && o !== "Unknown" && (originCounts[o] || 0) > 0)
                .sort((a, b) => (originCounts[b] || 0) - (originCounts[a] || 0))
                .map((o) => (
                  <button
                    key={o}
                    onClick={() => handleOrigin(o)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition-all ${activeOrigin === o ? "bg-primary/10 text-primary font-semibold" : "text-foreground/70 hover:bg-secondary"
                      }`}
                  >
                    <span className="text-base">{countryFlag(o)}</span>
                    <span className="truncate">{countryName(o, language)}</span>
                    <span className="ml-auto text-xs opacity-70">{originCounts[o]}</span>
                  </button>
                ))}
            </div>

            {/* Tags / Campaign filter — THG-CAT-005: đồng bộ collections từ Hub, multi-select. */}
            {collections.length > 0 && (
              <div className="pt-4 border-t border-border/30">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 pb-2">{t("catalog.tags_label")}</p>
                <div className="flex flex-wrap gap-1.5 px-3">
                  {collections.map((c) => {
                    const on = activeCollections.includes(c.slug);
                    return (
                      <button
                        key={c.id}
                        onClick={() => handleCollection(c.slug)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${on ? "text-white border-transparent" : "text-foreground/70 border-border hover:bg-secondary"}`}
                        style={on ? { backgroundColor: c.color || "#1e293b" } : undefined}
                      >
                        {c.icon && <span>{c.icon}</span>}
                        <span>{c.name}</span>
                        {typeof c.count === "number" && <span className="opacity-70">{c.count}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">

          {/* Top bar: mobile filters + search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
            {/* Mobile category pills */}
            <div className="flex items-center gap-1.5 flex-wrap lg:hidden">
              <button
                onClick={() => { setActiveCategory(""); setPage(1); }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${!activeCategory ? "bg-navy text-white" : "bg-white text-foreground/70 border border-border/40"
                  }`}
              >
                {t("catalog.all")}
              </button>
              {categories.map((cat) => {
                if (!(categoryCounts[cat] > 0)) return null;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeCategory === cat ? "bg-navy text-white" : "bg-white text-foreground/70 border border-border/40"
                      }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Active filters display */}
            <div className="hidden lg:flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                {pagination.total} {pagination.total === 1 ? t("catalog.product_count") : t("catalog.products_count")}
              </p>
              {activeCategory && (
                <span className="inline-flex items-center gap-1 bg-navy/10 text-navy px-2.5 py-1 rounded-full text-xs font-medium">
                  {activeCategory}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => { setActiveCategory(""); setPage(1); }} />
                </span>
              )}
              {activeOrigin && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-medium">
                  {countryFlag(activeOrigin)} {countryName(activeOrigin, language)}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => { setActiveOrigin(""); setPage(1); }} />
                </span>
              )}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("catalog.search_placeholder")}
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-border/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          {/* Mobile product count */}
          <p className="text-sm text-muted-foreground mb-3 lg:hidden">
            {pagination.total} {t("catalog.products_count")}
          </p>

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: PAGE_LIMIT }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-border/30 overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-100" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Product Grid */}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((item, idx) => (
                <ScrollReveal key={item.id} delay={Math.min(idx * 30, 300)}>
                  <div
                    className="group bg-white rounded-2xl border border-border/30 overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-500 cursor-pointer"
                    onClick={() => openProduct(item)}
                  >
                    {/* Image */}
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      {/* THG-TASK-019: !brokenImages.has guards 404/expired CDN URLs
                          so broken images fall through to Package placeholder instead
                          of the browser's default broken-img icon. */}
                      {item.images?.[0] && !brokenImages.has(item.images[0]) ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          loading="lazy"
                          onError={() => markBroken(item.images[0])}
                          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                          <Package className="w-12 h-12" />
                        </div>
                      )}
                      {item.origin && (
                        <span className="absolute top-2 right-2 text-lg" title={item.origin}>
                          {countryFlag(item.origin)}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3 md:p-4 space-y-1.5">
                      <h3 className="text-xs md:text-sm font-semibold text-foreground leading-tight line-clamp-2 min-h-[2.25rem]">
                        {item.name}
                      </h3>
                      <p className="text-sm font-bold text-green-600">
                        {item.priceFrom != null && item.priceTo != null
                          ? item.priceFrom === item.priceTo
                            ? `$${item.priceFrom.toFixed(2)}`
                            : `$${item.priceFrom.toFixed(2)} – $${item.priceTo.toFixed(2)}`
                          : t("catalog.contact_price")}
                      </p>
                      {/* THG-TASK-019: prefer thgSku (canonical THG-VN001-...) over
                          product.sku (short internal code) for parity with the modal
                          detail view. title= surfaces full value on hover when
                          truncated on narrow viewports. */}
                      <p
                        className="text-[10px] md:text-xs text-muted-foreground truncate"
                        title={item.thgSku || item.sku}
                      >
                        SKU: <span className="font-mono text-red-500">{item.thgSku || item.sku}</span>
                      </p>
                      {item.sizes.length > 0 && (
                        <p className="text-[10px] md:text-xs text-muted-foreground">
                          {t("catalog.size_label")} {item.sizes.length} Sizes
                        </p>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && products.length === 0 && (
            <div className="text-center py-20">
              <Tag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No products found</p>
              <p className="text-muted-foreground/60 text-sm mt-1">Try adjusting your search or filter</p>
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-2 rounded-lg border border-border/40 hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === pagination.pages || Math.abs(p - page) <= 2)
                .map((p, idx, arr) => (
                  <span key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="px-1 text-muted-foreground">...</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${page === p
                        ? "bg-navy text-white shadow-lg"
                        : "border border-border/40 hover:bg-secondary"
                        }`}
                    >
                      {p}
                    </button>
                  </span>
                ))}
              <button
                disabled={page >= pagination.pages}
                onClick={() => setPage(page + 1)}
                className="p-2 rounded-lg border border-border/40 hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal — v4 layout */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && closeProduct()}>
        <DialogContent className="max-w-[900px] w-[96vw] max-h-[92vh] p-0 gap-0 overflow-hidden flex flex-col">
          {selectedProduct && (() => {
            const fallback = categoryMeta[selectedProduct.category] || categoryMeta["Accessories"];
            const desc = selectedProduct.description;
            // Per-field fallback: use admin value if present (array length > 0 or non-empty string),
            // fallback to category default only when admin field is empty/missing
            const meta = {
              material: desc?.material?.length ? desc.material : fallback.material,
              features: desc?.features?.length ? desc.features : fallback.features,
              care: desc?.care?.length ? desc.care : fallback.care,
              prodTime: desc?.prodTime?.trim() ? desc.prodTime : fallback.prodTime,
              shipTime: desc?.shipTime?.trim() ? desc.shipTime : fallback.shipTime,
              moq: typeof desc?.moq === "number" && desc.moq > 0 ? desc.moq : 1,
            };
            const templateUrl = selectedProduct.templateUrl;
            const subcategory = desc?.subcategory;

            // ── v4 helpers — pricing model ──
            const variants = selectedProduct.variants ?? [];

            // Group variants by series (preserve insertion order via Map).
            // Variants with no series get bucketed into NO_SERIES_KEY which is
            // surfaced as "Other" in the UI.
            const seriesGroups = new Map<string, typeof variants>();
            for (const v of variants) {
              const key = (v.series && v.series.trim()) ? v.series : NO_SERIES_KEY;
              if (!seriesGroups.has(key)) seriesGroups.set(key, []);
              seriesGroups.get(key)!.push(v);
            }
            const seriesKeys = Array.from(seriesGroups.keys());
            const hasRealSeries = seriesKeys.some((k) => k !== NO_SERIES_KEY);
            // Show the Series row only when: there's at least one real series
            // AND there's more than one group to choose between. Single-group
            // products fall back to the flat list to avoid a lone "tab".
            const showSeriesTabs = hasRealSeries && seriesGroups.size > 1;

            // Resolve active series with defensive fallbacks: (1) the user's
            // last pick if still valid, (2) the series of variants[0], (3) the
            // sentinel for no-series.
            const activeSeriesKey =
              selectedSeries && seriesGroups.has(selectedSeries)
                ? selectedSeries
                : ((variants[0]?.series && variants[0].series!.trim())
                    ? variants[0].series!
                    : NO_SERIES_KEY);
            const currentGroup = seriesGroups.get(activeSeriesKey) ?? [];

            // Resolve selected variant with fallbacks. If the user's
            // selectedVariantId no longer matches anything in the current
            // group (e.g. after switching series), fall back to the first of
            // the group, then the first overall, then null.
            const selectedVariant =
              (selectedVariantId
                ? currentGroup.find((v) => v.id === selectedVariantId)
                : undefined)
              ?? currentGroup[0]
              ?? variants[0]
              ?? null;

            // Label: when ANY variant has a series set, the per-chip values
            // are phone models (or similar), not garment sizes. Re-label even
            // when there's a single series and we're not showing the tab row.
            const variantSectionLabel = hasRealSeries ? "Model" : "Sizes";

            // priceSbsl = Ship by Merchant (seller ships, higher price)
            // priceSbtt = Ship by Label (TikTok provides label, lower price)
            // Pre-compute BOTH channels explicitly so the per-tab range
            // doesn't share a closure that could be mis-captured by minifier.
            const lblPrices = variants
              .map((v) => v.priceSbtt)
              .filter((p): p is number => typeof p === "number" && p > 0);
            const merPrices = variants
              .map((v) => v.priceSbsl)
              .filter((p): p is number => typeof p === "number" && p > 0);

            const minLbl = lblPrices.length ? Math.min(...lblPrices) : null;
            const maxLbl = lblPrices.length ? Math.max(...lblPrices) : null;
            const minMer = merPrices.length ? Math.min(...merPrices) : null;
            const maxMer = merPrices.length ? Math.max(...merPrices) : null;

            const minP = shipping === "lbl" ? minLbl : minMer;
            const maxP = shipping === "lbl" ? maxLbl : maxMer;

            const hasLblPrices = lblPrices.length > 0;
            const hasMerPrices = merPrices.length > 0;
            const hasAnyPrices = hasLblPrices || hasMerPrices;

            const currentPrice = selectedVariant
              ? shipping === "lbl"
                ? selectedVariant.priceSbtt
                : selectedVariant.priceSbsl
              : null;
            const fmt = (n: number | null) => (n != null ? `$${n.toFixed(2)}` : "—");

            const copySku = (sku: string) => {
              if (!navigator.clipboard?.writeText) return;
              navigator.clipboard.writeText(sku).catch(() => { /* ignore */ });
              setShareCopied(true);
              setTimeout(() => setShareCopied(false), DELAYS.CLIPBOARD_COPIED_INLINE_MS);
            };

            return (
              <>
                <DialogHeader className="sr-only">
                  <DialogTitle>{selectedProduct.name}</DialogTitle>
                  <DialogDescription>{selectedProduct.name} details</DialogDescription>
                </DialogHeader>

                {/* Body — 2 col grid on md+, stacked on mobile */}
                <div className="flex-1 min-h-0 grid md:grid-cols-[380px_1fr] overflow-hidden">

                  {/* ════ LEFT: image (fixed on desktop, top on mobile) ════ */}
                  <div className="bg-gray-50/70 border-r border-border/30 flex flex-col overflow-hidden">
                    {/* THG-CAT-006: media slider = video YouTube (slot đầu, click-to-play) + ảnh tĩnh. */}
                    {(() => {
                      const validVideos = (selectedProduct.videos ?? []).filter((v) => parseYouTubeId(v));
                      const imageList = selectedProduct.images.filter((img) => !brokenImages.has(img));
                      const media: Array<{ kind: "video" | "image"; url: string }> = [
                        ...validVideos.map((url) => ({ kind: "video" as const, url })),
                        ...imageList.map((url) => ({ kind: "image" as const, url })),
                      ];
                      const cur = media[activeImage] ?? media[0];
                      return (
                        <>
                          <div className="relative flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-blue-50/50 to-gray-50/50 min-h-[240px]">
                            {cur?.kind === "video" ? (() => {
                              const short = isYouTubeShort(cur.url);
                              // Shorts (dọc): khung 9:16 cao cố định ~520px (cap 68vh màn thấp),
                              // w-auto → căn giữa cột, chừa hở trên/dưới (không dính thumbnail).
                              const frameCls = short
                                ? "aspect-[9/16] h-[520px] max-h-[68vh] w-auto mx-auto"
                                : "aspect-video w-full max-w-full";
                              return videoPlaying ? (
                                <div className={`${frameCls} rounded-lg overflow-hidden`}>
                                  <iframe
                                    src={youtubeEmbedUrl(cur.url, true) ?? ""}
                                    title={`${selectedProduct.name} — video`}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                </div>
                              ) : (
                                <button
                                  onClick={() => setVideoPlaying(true)}
                                  className={`relative ${frameCls} rounded-lg overflow-hidden`}
                                  aria-label="Play video"
                                >
                                  <img src={youtubeThumb(cur.url) ?? ""} alt={`${selectedProduct.name} — video`} className="w-full h-full object-cover" />
                                  <span className="absolute inset-0 flex items-center justify-center">
                                    <span className="w-16 h-16 rounded-full bg-black/55 flex items-center justify-center text-white text-2xl pl-1 hover:bg-black/70 transition-colors">▶</span>
                                  </span>
                                </button>
                              );
                            })() : cur && !brokenImages.has(cur.url) ? (
                              <img
                                src={cur.url}
                                alt={selectedProduct.name}
                                onError={() => markBroken(cur.url)}
                                className="max-w-full max-h-[240px] object-contain"
                              />
                            ) : (
                              <Package className="w-20 h-20 text-muted-foreground/30" />
                            )}
                          </div>
                          {media.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto p-3 border-t border-border/30 bg-white">
                              {media.map((m, i) => (
                                <button
                                  key={i}
                                  onClick={() => { setActiveImage(i); setVideoPlaying(false); }}
                                  className={`relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImage === i ? "border-blue-600" : "border-border/30 opacity-60 hover:opacity-100"}`}
                                >
                                  <img
                                    loading="lazy"
                                    src={(m.kind === "video" ? youtubeThumb(m.url) : m.url) ?? ""}
                                    alt={`${selectedProduct.name} — ${m.kind} ${i + 1}`}
                                    onError={() => { if (m.kind === "image") markBroken(m.url); }}
                                    className="w-full h-full object-contain p-0.5"
                                  />
                                  {m.kind === "video" && (
                                    <span className="absolute inset-0 flex items-center justify-center">
                                      <span className="w-6 h-6 rounded-full bg-black/55 flex items-center justify-center text-white text-[10px] pl-0.5">▶</span>
                                    </span>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  {/* ════ RIGHT: detail (scroll) ════ */}
                  <div className="overflow-y-auto">
                    <div className="px-6 py-5 flex flex-col gap-5">

                      {/* 1. Category + Name */}
                      <div className="flex flex-col gap-2">
                        <span className="inline-block w-fit text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {subcategory || selectedProduct.category}
                        </span>
                        <h2 className="text-xl font-bold leading-tight pr-8">{selectedProduct.name}</h2>
                      </div>

                      {/* 2. Shipping tabs (only when at least one channel has any prices) */}
                      {hasAnyPrices && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShipping("lbl")}
                            disabled={!hasLblPrices}
                            className={`px-4 py-1.5 rounded-md text-sm font-semibold border-[1.5px] transition-all ${shipping === "lbl"
                              ? "bg-blue-50 text-blue-600 border-blue-300"
                              : "bg-white text-muted-foreground border-border/40 hover:border-border/60"
                              } ${!hasLblPrices ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            Ship by Label
                          </button>
                          <button
                            onClick={() => setShipping("mer")}
                            disabled={!hasMerPrices}
                            className={`px-4 py-1.5 rounded-md text-sm font-semibold border-[1.5px] transition-all ${shipping === "mer"
                              ? "bg-orange-50 text-orange-600 border-orange-300"
                              : "bg-white text-muted-foreground border-border/40 hover:border-border/60"
                              } ${!hasMerPrices ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            Ship by Merchant
                          </button>
                        </div>
                      )}

                      {/* 3. Price block — key includes shipping + variant id to force remount on EITHER change */}
                      <div key={`price-${shipping}-${selectedVariant?.id ?? "none"}`} className="flex flex-col gap-1">
                        {hasAnyPrices && currentPrice != null ? (
                          <>
                            <div className="flex items-baseline gap-3 flex-wrap">
                              <span className={`text-[38px] leading-none font-extrabold transition-colors ${shipping === "mer" ? "text-orange-600" : "text-blue-600"}`}>
                                {fmt(currentPrice)}
                              </span>
                              {minP != null && maxP != null && minP !== maxP && (
                                <span className="text-sm text-muted-foreground">{fmt(minP)} – {fmt(maxP)}</span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Selling price (incl. shipping) · Size: <strong className="text-foreground">{selectedVariant?.variant || "—"}</strong>
                            </p>
                          </>
                        ) : hasAnyPrices ? (
                          <>
                            <div className="flex items-baseline gap-3 flex-wrap">
                              <span className="text-[38px] leading-none font-extrabold text-muted-foreground">—</span>
                              {minP != null && maxP != null && (
                                <span className="text-sm text-muted-foreground">{fmt(minP)} – {fmt(maxP)}</span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              No price for this size on selected channel
                            </p>
                          </>
                        ) : (
                          <>
                            <span className="text-[26px] leading-none font-bold text-foreground">{t("catalog.contact_price")}</span>
                            <p className="text-xs text-muted-foreground">{t("catalog.contact_quote_hint")}</p>
                          </>
                        )}
                      </div>

                      {/* 4. Variant Details card — key forces remount on size change to avoid any stale-render edge case */}
                      {selectedVariant && (
                        <div key={`variant-${selectedVariant.id ?? "none"}`} className="border border-border/40 rounded-lg overflow-hidden">
                          <div className="flex items-center px-4 py-2.5 border-b border-border/40 text-sm gap-2">
                            <span className="text-muted-foreground font-medium w-[120px] flex-shrink-0">THG SKU</span>
                            <button
                              onClick={() => copySku(selectedVariant.thgSku || selectedVariant.supplierSku || "")}
                              className="font-mono text-[11.5px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded hover:bg-blue-100 transition-colors cursor-pointer truncate text-left"
                              title="Click to copy"
                            >
                              {selectedVariant.thgSku || selectedVariant.supplierSku}
                            </button>
                            {shareCopied && <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />}
                          </div>
                          <div className="flex items-center px-4 py-2.5 border-b border-border/40 text-sm">
                            <span className="text-muted-foreground font-medium w-[120px] flex-shrink-0">Package</span>
                            <span className="text-foreground font-semibold">
                              {selectedVariant.weight ? `${selectedVariant.weight}g` : "—"}
                              {selectedVariant.length && selectedVariant.width && selectedVariant.height
                                ? ` (${selectedVariant.length} × ${selectedVariant.width} × ${selectedVariant.height} cm)`
                                : ""}
                            </span>
                          </div>
                          <div className="flex items-center px-4 py-2.5 text-sm">
                            <span className="text-muted-foreground font-medium w-[120px] flex-shrink-0">Color</span>
                            <span className="text-foreground font-semibold">{selectedVariant.color || "—"}</span>
                          </div>
                        </div>
                      )}

                      {/* 5a. Series tabs — only when ≥2 groups AND at least one real series */}
                      {showSeriesTabs && (
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Series</p>
                          <div className="flex flex-wrap gap-1.5">
                            {seriesKeys.map((key) => {
                              const isActive = key === activeSeriesKey;
                              const label = key === NO_SERIES_KEY ? "Other" : key;
                              return (
                                <button
                                  key={key}
                                  onClick={() => {
                                    setSelectedSeries(key);
                                    const g = seriesGroups.get(key);
                                    // Snap selection to first variant of the
                                    // newly active series so the detail card +
                                    // price update immediately (matches mockup).
                                    if (g && g[0]?.id) setSelectedVariantId(g[0].id);
                                    else setSelectedVariantId(null);
                                  }}
                                  className={`px-3 py-1 rounded-md text-xs font-medium border-[1.5px] transition-all ${isActive
                                    ? "bg-blue-50 text-blue-700 border-blue-300"
                                    : "bg-white text-muted-foreground border-border/40 hover:border-blue-300 hover:text-blue-600"
                                    }`}
                                >
                                  {label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 5b. Model / Size grid — filtered to active series when series tabs shown */}
                      {currentGroup.length > 0 && (
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                            {variantSectionLabel} — <span className="font-normal normal-case tracking-normal text-muted-foreground">Selected: <strong className="text-foreground">{selectedVariant?.variant || "—"}</strong></span>
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {currentGroup.map((v) => {
                              const isActive = selectedVariant?.id === v.id && !!v.id;
                              return (
                                <button
                                  key={v.id ?? v.supplierSku ?? v.variant}
                                  onClick={() => {
                                    if (v.id) setSelectedVariantId(v.id);
                                  }}
                                  className={`min-w-[50px] px-3 py-2 rounded-lg text-sm font-semibold border-[1.5px] transition-all ${isActive
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-foreground border-border/40 hover:border-blue-600 hover:text-blue-600"
                                    }`}
                                >
                                  {v.variant || "—"}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 6. Fulfillment Info */}
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Fulfillment Info</p>
                        <div className="border border-border/40 rounded-lg overflow-hidden">
                          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 text-sm">
                            <span className="text-muted-foreground font-medium flex items-center gap-1.5">⏱ Production time</span>
                            <span className="text-green-600 font-semibold">{meta.prodTime} business days</span>
                          </div>
                          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 text-sm">
                            <span className="text-muted-foreground font-medium flex items-center gap-1.5">🚚 Shipping time</span>
                            <span className="text-green-600 font-semibold">{meta.shipTime} business days</span>
                          </div>
                          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 text-sm">
                            <span className="text-muted-foreground font-medium flex items-center gap-1.5">🌍 Fulfillment location</span>
                            <span className="text-foreground font-semibold">
                              {selectedProduct.origin ? `${countryFlag(selectedProduct.origin)} ${countryName(selectedProduct.origin, language)}` : "—"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                            <span className="text-muted-foreground font-medium flex items-center gap-1.5">📦 MOQ</span>
                            <span className="text-foreground font-semibold">{meta.moq} unit{meta.moq > 1 ? "s" : ""}</span>
                          </div>
                        </div>
                      </div>

                      {/* 7. Resources */}
                      {(templateUrl || selectedProduct.images.length > 0) && (
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Resources</p>
                          <div className="flex gap-2 flex-wrap">
                            {templateUrl && (
                              <a
                                href={templateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border/40 bg-gray-50 text-muted-foreground text-xs font-semibold hover:bg-gray-100 hover:text-foreground transition-all no-underline"
                              >
                                📐 Download Template
                              </a>
                            )}
                            <button
                              onClick={handleShare}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border/40 bg-gray-50 text-muted-foreground text-xs font-semibold hover:bg-gray-100 hover:text-foreground transition-all"
                            >
                              {shareCopied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
                              {shareCopied ? "Link copied" : "Share Product"}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* 8. Product Features */}
                      {meta.features.length > 0 && (
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Product Features</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {meta.features.map((f, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-snug">
                                <span className="text-green-600 flex-shrink-0 mt-0.5">✓</span>
                                <span>{f}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 9. Material */}
                      {meta.material.length > 0 && (
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Material</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {meta.material.map((m, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-snug">
                                <span className="text-blue-600 flex-shrink-0 mt-0.5">•</span>
                                <span>{m}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 10. Care Instructions */}
                      {meta.care.length > 0 && (
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Care Instructions</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {meta.care.map((c, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-snug">
                                <span className="text-amber-600 flex-shrink-0 mt-0.5">◆</span>
                                <span>{c}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex gap-2 px-6 py-3 border-t border-border/30 bg-white flex-shrink-0">
                  <a
                    href="https://www.facebook.com/THGFulfill"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg border border-border/40 bg-gray-50 text-muted-foreground text-sm font-semibold hover:bg-gray-100 transition-all no-underline"
                  >
                    <MessageCircle className="w-4 h-4" /> Order Support
                  </a>
                  <a
                    href="https://www.facebook.com/THGFulfill"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all no-underline"
                  >
                    🛒 New Order
                  </a>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>


    </div >
  );
};

export default CatalogPage;
