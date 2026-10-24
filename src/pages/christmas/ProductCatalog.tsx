import { useRef, useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import "@/lib/i18n/translations/christmas";
import { CHRISTMAS, PRODUCTS, catalogHref, countByCategory, type Category, type Product } from "./christmasData";
import { ConsultButton, MetaList, OriginTag, ProductImage } from "./parts";

type Filter = Category | "all";
const FILTERS: Filter[] = ["all", ...CHRISTMAS.categories];

function Price({ product }: Readonly<{ product: Product }>) {
    const { t } = useI18n();
    if (product.label) {
        return (
            <div className="price">
                <span className="lbl">{t("christmas.price_label")}</span>
                <span className="val">{product.label}</span>
                {product.merchant && (
                    <span className="alt">
                        {t("christmas.price_by_merchant")} {product.merchant}
                    </span>
                )}
            </div>
        );
    }
    if (product.merchant) {
        return (
            <div className="price">
                <span className="lbl">{t("christmas.price_merchant")}</span>
                <span className="val">{product.merchant}</span>
            </div>
        );
    }
    return (
        <div className="price">
            <span className="lbl">{t("christmas.price_base")}</span>
            <span className="val ask">{t("christmas.ask_price")}</span>
        </div>
    );
}

function ProductCard({ product }: Readonly<{ product: Product }>) {
    const { t, language } = useI18n();
    const href = catalogHref(language, product);
    return (
        <article className="card" data-product={product.id}>
            <Link className="card-media" to={href} tabIndex={-1} aria-hidden="true">
                <ProductImage product={product} />
                <OriginTag origin={product.origin} />
                {product.hot && <span className="hot">{t("christmas.hot_badge")}</span>}
            </Link>
            <div className="card-body">
                <h3>
                    <Link to={href}>{product.name}</Link>
                </h3>
                <span className="vn">{t(`christmas.p_${product.id}`)}</span>
                <Price product={product} />
                <MetaList meta={product.meta} />
                <div className="card-cta">
                    <Link className="btn btn-red" to={href}>
                        {t("christmas.view_details")}
                    </Link>
                    <ConsultButton
                        className="btn ico"
                        product={product.name}
                        ariaLabel={t("christmas.consult_product").replace("{name}", product.name)}
                    >
                        <MessageCircle aria-hidden="true" />
                    </ConsultButton>
                </div>
            </div>
        </article>
    );
}

/** Category tabs over the product grid (WAI-ARIA tabs: arrow keys, Home, End). */
export function ProductCatalog() {
    const { t } = useI18n();
    const [active, setActive] = useState<Filter>("all");
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const visible = active === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === active);

    function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
        const index = FILTERS.indexOf(active);
        const moves: Record<string, number> = {
            ArrowRight: (index + 1) % FILTERS.length,
            ArrowLeft: (index - 1 + FILTERS.length) % FILTERS.length,
            Home: 0,
            End: FILTERS.length - 1,
        };
        const next = moves[e.key];
        if (next === undefined) return;
        e.preventDefault();
        setActive(FILTERS[next]);
        tabRefs.current[next]?.focus();
    }

    return (
        <>
            <div className="tabs" role="tablist" aria-label={t("christmas.tabs_label")} onKeyDown={onKeyDown}>
                {FILTERS.map((filter, i) => (
                    <button
                        key={filter}
                        ref={(el) => {
                            tabRefs.current[i] = el;
                        }}
                        type="button"
                        role="tab"
                        id={`xmas-tab-${filter}`}
                        aria-selected={active === filter}
                        aria-controls="xmas-products"
                        tabIndex={active === filter ? 0 : -1}
                        className="tab"
                        onClick={() => setActive(filter)}
                    >
                        {t(`christmas.tab_${filter}`)}
                        <span className="count">({countByCategory(filter)})</span>
                    </button>
                ))}
            </div>
            <div className="xm-grid" role="tabpanel" id="xmas-products" aria-labelledby={`xmas-tab-${active}`}>
                {visible.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </>
    );
}
