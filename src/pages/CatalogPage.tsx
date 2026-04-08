import { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";
import { fetchCatalog, fetchProduct, formatPrice, type CatalogProduct, type CatalogResponse } from "@/lib/catalogApi";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  Search, Tag, Filter, ChevronLeft, ChevronRight, X,
  Shirt, Phone, Coffee, Home, Gem, Car, Frame, Package, Crown,
  Loader2, MessageCircle, Share2, Check,
} from "lucide-react";

// Category-based product details (since DB has no description fields)
const categoryMeta: Record<string, { material: string[]; features: string[]; care: string[]; prodTime: string; shipTime: string }> = {
  Apparel: {
    material: ["Bird-Eye Pique (Polyester Blend)", "Lightweight, breathable", "Moisture-wicking", "Soft, flexible, easy to move"],
    features: ["Full button front: classic baseball design", "Customizable: add name, number or logo", "Great for sports events, team uniforms, group outings or streetwear", "Easy to mix with jeans, leggings or shorts", "Bulk discount available for large orders"],
    care: ["Machine wash inside out, cold water, same colors", "Gentle cycle", "Non-chlorine bleach only when needed", "Tumble dry low", "Cool iron if needed"],
    prodTime: "3 - 5",
    shipTime: "8 - 12",
  },
  "Phone Cases": {
    material: ["Premium TPU / Polycarbonate", "Shockproof protection", "Slim profile, lightweight", "Precise cutouts for ports & buttons"],
    features: ["All-over print with vivid colors", "Scratch-resistant surface", "Wireless charging compatible", "Supports most phone models"],
    care: ["Wipe clean with damp cloth", "Avoid prolonged sun exposure"],
    prodTime: "1 - 2",
    shipTime: "5 - 8",
  },
  Drinkware: {
    material: ["Stainless steel / Ceramic", "BPA-free, food-safe", "Double-wall insulation (tumblers)", "Durable sublimation print"],
    features: ["Keeps drinks hot/cold for hours", "Dishwasher safe (top rack)", "Full wrap-around printing", "Perfect for gifts & merchandise"],
    care: ["Hand wash recommended for printed items", "Do not microwave (metal items)", "Avoid abrasive cleaners"],
    prodTime: "1 - 3",
    shipTime: "5 - 8",
  },
  "Home & Living": {
    material: ["Polyester / Cotton blend", "Soft-touch fabric", "Vibrant dye-sublimation print", "Durable construction"],
    features: ["Full-color edge-to-edge printing", "Machine washable", "Multiple size options", "Perfect for home decor & gifts"],
    care: ["Machine wash cold, gentle cycle", "Tumble dry low", "Do not bleach", "Iron on low heat if needed"],
    prodTime: "2 - 4",
    shipTime: "5 - 10",
  },
  "Wall Art": {
    material: ["Premium canvas / Metal / Acrylic", "High-resolution giclée printing", "UV-resistant inks", "Ready to hang"],
    features: ["Gallery-quality finish", "Vibrant, long-lasting colors", "Multiple size options", "Frameless or framed options available"],
    care: ["Dust with soft, dry cloth", "Avoid direct sunlight for extended periods", "Do not use harsh chemicals"],
    prodTime: "2 - 4",
    shipTime: "5 - 10",
  },
  Jewelry: {
    material: ["Stainless steel / Zinc alloy", "Tarnish-resistant finish", "Hypoallergenic", "Lightweight & comfortable"],
    features: ["Custom engraving available", "High-detail photo printing", "Gift-ready packaging", "Multiple finish options"],
    care: ["Store in dry place", "Avoid contact with water & chemicals", "Polish with soft cloth"],
    prodTime: "2 - 4",
    shipTime: "5 - 10",
  },
  "Cap & Hat": {
    material: ["Cotton twill / Polyester", "Structured front panel", "Adjustable strap closure", "Breathable eyelets"],
    features: ["Embroidery or print customization", "One size fits most", "Available in multiple colors", "Pre-curved visor"],
    care: ["Spot clean recommended", "Hand wash with mild detergent", "Air dry — do not machine dry", "Do not iron on decoration"],
    prodTime: "2 - 3",
    shipTime: "5 - 8",
  },
  "Car Accessories": {
    material: ["Durable aluminum / Polyester", "Weather-resistant", "UV-protected print", "Rust-proof"],
    features: ["Easy installation", "Custom full-color printing", "Fits standard sizes", "Great for personalization & gifts"],
    care: ["Wipe clean with damp cloth", "Avoid abrasive cleaners"],
    prodTime: "2 - 3",
    shipTime: "5 - 8",
  },
  Accessories: {
    material: ["Mixed materials (product-specific)", "Durable construction", "High-quality print finish"],
    features: ["Full-color custom printing", "Multiple size/style options", "Great for gifts & merchandise"],
    care: ["Follow product-specific care instructions", "Store in cool, dry place"],
    prodTime: "2 - 4",
    shipTime: "5 - 10",
  },
};

const originFlags: Record<string, string> = {
  VN: "\u{1F1FB}\u{1F1F3}",
  US: "\u{1F1FA}\u{1F1F8}",
  CN: "\u{1F1E8}\u{1F1F3}",
};

const categoryIcons: Record<string, typeof Shirt> = {
  Apparel: Shirt,
  "Phone Cases": Phone,
  Drinkware: Coffee,
  "Home & Living": Home,
  Jewelry: Gem,
  "Car Accessories": Car,
  "Wall Art": Frame,
  Accessories: Package,
  "Cap & Hat": Crown,
};

const CATEGORIES = [
  "Apparel", "Phone Cases", "Cap & Hat", "Drinkware",
  "Home & Living", "Jewelry", "Car Accessories", "Wall Art", "Accessories",
];

const PAGE_LIMIT = 20;

const CatalogPage = () => {
  const { t } = useI18n();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [originCounts, setOriginCounts] = useState<Record<string, number>>({});

  const [activeCategory, setActiveCategory] = useState<string>("");
  const [activeOrigin, setActiveOrigin] = useState<string>("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [shareCopied, setShareCopied] = useState(false);
  // v4 modal state — shipping channel toggle + selected variant index
  const [shipping, setShipping] = useState<"lbl" | "mer">("lbl");
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

  const searchTimer = useRef<NodeJS.Timeout>();
  // Track latest fetched product id so out-of-order fetches don't override a newer click
  const latestProductIdRef = useRef<string | null>(null);

  // Open product modal + push product id to URL for shareable link
  const openProduct = useCallback((product: CatalogProduct) => {
    latestProductIdRef.current = product.id;
    setSelectedProduct(product);
    setActiveImage(0);
    setShareCopied(false);
    setShipping("lbl");
    setSelectedVariantIdx(0);
    // Fetch full detail (with variants) for modal display.
    // Only apply if user is still viewing this product when fetch resolves.
    fetchProduct(product.id)
      .then((full) => {
        if (latestProductIdRef.current === product.id) {
          setSelectedProduct(full);
        }
      })
      .catch(() => { /* keep list-level data */ });
    const url = new URL(window.location.href);
    url.searchParams.set("productId", product.id);
    window.history.replaceState(null, "", url.toString());
  }, []);

  const closeProduct = useCallback(() => {
    latestProductIdRef.current = null;
    setSelectedProduct(null);
    setShipping("lbl");
    setSelectedVariantIdx(0);
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
      setTimeout(() => setShareCopied(false), 2000);
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
          setShipping("lbl");
          setSelectedVariantIdx(0);
        }
      })
      .catch(() => {
        // Invalid productId — clean URL
        latestProductIdRef.current = null;
        const url = new URL(window.location.href);
        url.searchParams.delete("productId");
        window.history.replaceState(null, "", url.pathname + (url.search || "") + url.hash);
      });
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
      });
      setProducts(res.data);
      setPagination(res.pagination);
      setCategoryCounts(res.categoryCounts);
      setOriginCounts(res.originCounts);
    } catch {
      // API not available yet — keep empty state
    } finally {
      setLoading(false);
    }
  }, [page, activeCategory, activeOrigin, search]);

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

  const totalAll = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

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
              <span className="text-sm text-white/80">POD Products</span>
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
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                !activeCategory ? "bg-navy text-white shadow-lg" : "text-foreground/70 hover:bg-secondary"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>{t("catalog_page.filter_all")}</span>
              <span className="ml-auto text-xs opacity-70">{totalAll}</span>
            </button>

            {CATEGORIES.map((cat) => {
              const Icon = categoryIcons[cat] || Package;
              const count = categoryCounts[cat] || 0;
              if (count === 0) return null;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeCategory === cat ? "bg-navy text-white shadow-lg" : "text-foreground/70 hover:bg-secondary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="truncate">{cat}</span>
                  <span className="ml-auto text-xs opacity-70">{count}</span>
                </button>
              );
            })}

            {/* Origin filter */}
            <div className="pt-4 border-t border-border/30">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 pb-2">Origin</p>
              {(["VN", "US", "CN"] as const).map((o) => {
                const count = originCounts[o] || 0;
                if (count === 0) return null;
                return (
                  <button
                    key={o}
                    onClick={() => handleOrigin(o)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition-all ${
                      activeOrigin === o ? "bg-primary/10 text-primary font-semibold" : "text-foreground/70 hover:bg-secondary"
                    }`}
                  >
                    <span className="text-base">{originFlags[o]}</span>
                    <span>{o === "VN" ? "Vietnam" : o === "US" ? "USA" : "China"}</span>
                    <span className="ml-auto text-xs opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>
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
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  !activeCategory ? "bg-navy text-white" : "bg-white text-foreground/70 border border-border/40"
                }`}
              >
                All
              </button>
              {CATEGORIES.map((cat) => {
                if (!(categoryCounts[cat] > 0)) return null;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeCategory === cat ? "bg-navy text-white" : "bg-white text-foreground/70 border border-border/40"
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
                {pagination.total} {pagination.total === 1 ? "product" : "products"}
              </p>
              {activeCategory && (
                <span className="inline-flex items-center gap-1 bg-navy/10 text-navy px-2.5 py-1 rounded-full text-xs font-medium">
                  {activeCategory}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => { setActiveCategory(""); setPage(1); }} />
                </span>
              )}
              {activeOrigin && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-medium">
                  {originFlags[activeOrigin]} {activeOrigin}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => { setActiveOrigin(""); setPage(1); }} />
                </span>
              )}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-border/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          {/* Mobile product count */}
          <p className="text-sm text-muted-foreground mb-3 lg:hidden">
            {pagination.total} products
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
                      {item.images?.[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          loading="lazy"
                          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                          <Package className="w-12 h-12" />
                        </div>
                      )}
                      {item.origin && (
                        <span className="absolute top-2 right-2 text-lg" title={item.origin}>
                          {originFlags[item.origin] || ""}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3 md:p-4 space-y-1.5">
                      <h3 className="text-xs md:text-sm font-semibold text-foreground leading-tight line-clamp-2 min-h-[2.25rem]">
                        {item.name}
                      </h3>
                      <p className="text-sm font-bold text-green-600">
                        {formatPrice(item)}
                      </p>
                      <p className="text-[10px] md:text-xs text-muted-foreground truncate">
                        SKU: <span className="font-mono text-red-500">{item.thgSku || item.sku}</span>
                      </p>
                      {item.sizes.length > 0 && (
                        <p className="text-[10px] md:text-xs text-muted-foreground">
                          Size: {item.sizes.length} Sizes
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
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                        page === p
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
            const hasDesc = desc && (desc.material?.length || desc.features?.length || desc.care?.length);
            const meta = {
              material: (hasDesc && desc.material?.length) ? desc.material : fallback.material,
              features: (hasDesc && desc.features?.length) ? desc.features : fallback.features,
              care: (hasDesc && desc.care?.length) ? desc.care : fallback.care,
              prodTime: desc?.prodTime || fallback.prodTime,
              shipTime: desc?.shipTime || fallback.shipTime,
            };
            const templateUrl = selectedProduct.templateUrl;
            const subcategory = desc?.subcategory;

            // ── v4 helpers — pricing model ──
            const variants = selectedProduct.variants ?? [];
            const safeIdx = Math.min(selectedVariantIdx, Math.max(0, variants.length - 1));
            const selectedVariant = variants[safeIdx];

            const getPrice = (v: typeof variants[number] | undefined) =>
              v ? (shipping === "lbl" ? v.priceSbsl : v.priceSbtt) : null;

            const channelPrices = variants
              .map(getPrice)
              .filter((p): p is number => typeof p === "number" && p > 0);
            const minP = channelPrices.length ? Math.min(...channelPrices) : null;
            const maxP = channelPrices.length ? Math.max(...channelPrices) : null;

            const hasLblPrices = variants.some((v) => typeof v.priceSbsl === "number" && v.priceSbsl > 0);
            const hasMerPrices = variants.some((v) => typeof v.priceSbtt === "number" && v.priceSbtt > 0);
            const hasAnyPrices = hasLblPrices || hasMerPrices;

            const currentPrice = getPrice(selectedVariant);
            const fmt = (n: number | null) => (n != null ? `$${n.toFixed(2)}` : "—");

            const copySku = (sku: string) => {
              if (!navigator.clipboard?.writeText) return;
              navigator.clipboard.writeText(sku).catch(() => { /* ignore */ });
              setShareCopied(true);
              setTimeout(() => setShareCopied(false), 1400);
            };

            return (
              <>
                <DialogHeader className="sr-only">
                  <DialogTitle>{selectedProduct.name}</DialogTitle>
                  <DialogDescription>{selectedProduct.name} details</DialogDescription>
                </DialogHeader>

                {/* Body — 2 col grid on md+, stacked on mobile */}
                <div className="flex-1 min-h-0 grid md:grid-cols-[320px_1fr] overflow-hidden">

                  {/* ════ LEFT: image (fixed on desktop, top on mobile) ════ */}
                  <div className="bg-gray-50/70 border-r border-border/30 flex flex-col overflow-hidden">
                    <div className="relative flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-blue-50/50 to-gray-50/50 min-h-[240px]">
                      {selectedProduct.images?.[activeImage] ? (
                        <img
                          src={selectedProduct.images[activeImage]}
                          alt={selectedProduct.name}
                          className="max-w-full max-h-[240px] object-contain"
                        />
                      ) : (
                        <Package className="w-20 h-20 text-muted-foreground/30" />
                      )}
                    </div>
                    {selectedProduct.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto p-3 border-t border-border/30 bg-white">
                        {selectedProduct.images.map((img, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveImage(i)}
                            className={`w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                              activeImage === i ? "border-blue-600" : "border-border/30 opacity-60 hover:opacity-100"
                            }`}
                          >
                            <img src={img} alt="" className="w-full h-full object-contain p-0.5" />
                          </button>
                        ))}
                      </div>
                    )}
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
                            className={`px-4 py-1.5 rounded-md text-sm font-semibold border-[1.5px] transition-all ${
                              shipping === "lbl"
                                ? "bg-blue-50 text-blue-600 border-blue-300"
                                : "bg-white text-muted-foreground border-border/40 hover:border-border/60"
                            } ${!hasLblPrices ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            Ship by Label
                          </button>
                          <button
                            onClick={() => setShipping("mer")}
                            disabled={!hasMerPrices}
                            className={`px-4 py-1.5 rounded-md text-sm font-semibold border-[1.5px] transition-all ${
                              shipping === "mer"
                                ? "bg-orange-50 text-orange-600 border-orange-300"
                                : "bg-white text-muted-foreground border-border/40 hover:border-border/60"
                            } ${!hasMerPrices ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            Ship by Merchant
                          </button>
                        </div>
                      )}

                      {/* 3. Price block */}
                      <div className="flex flex-col gap-1">
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
                            <span className="text-[26px] leading-none font-bold text-foreground">Liên hệ báo giá</span>
                            <p className="text-xs text-muted-foreground">Contact us for pricing</p>
                          </>
                        )}
                      </div>

                      {/* 4. Variant Details card */}
                      {selectedVariant && (
                        <div className="border border-border/40 rounded-lg overflow-hidden">
                          <div className="flex items-center px-4 py-2.5 border-b border-border/40 text-sm gap-2">
                            <span className="text-muted-foreground font-medium w-[120px] flex-shrink-0">THG SKU</span>
                            <button
                              onClick={() => copySku(selectedVariant.thgSku || selectedVariant.supplierSku)}
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

                      {/* 5. Sizes grid */}
                      {variants.length > 0 && (
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                            Sizes — <span className="font-normal normal-case tracking-normal text-muted-foreground">Selected: <strong className="text-foreground">{selectedVariant?.variant || "—"}</strong></span>
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {variants.map((v, i) => (
                              <button
                                key={v.id}
                                onClick={() => setSelectedVariantIdx(i)}
                                className={`min-w-[50px] px-3 py-2 rounded-lg text-sm font-semibold border-[1.5px] transition-all ${
                                  i === safeIdx
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-foreground border-border/40 hover:border-blue-600 hover:text-blue-600"
                                }`}
                              >
                                {v.variant || "—"}
                              </button>
                            ))}
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
                              {selectedProduct.origin ? `${originFlags[selectedProduct.origin] || "🏳️"} ${selectedProduct.origin}` : "—"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                            <span className="text-muted-foreground font-medium flex items-center gap-1.5">📦 MOQ</span>
                            <span className="text-foreground font-semibold">1 unit</span>
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

                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex gap-2 px-6 py-3 border-t border-border/30 bg-white flex-shrink-0">
                  <a
                    href="https://zalo.me/0886800126"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg border border-border/40 bg-gray-50 text-muted-foreground text-sm font-semibold hover:bg-gray-100 transition-all no-underline"
                  >
                    <MessageCircle className="w-4 h-4" /> Order Support
                  </a>
                  <a
                    href="https://zalo.me/0886800126"
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

      <Footer />
    </div>
  );
};

export default CatalogPage;
