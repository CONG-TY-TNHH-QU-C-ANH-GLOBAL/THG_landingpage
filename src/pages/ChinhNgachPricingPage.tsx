import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import { SeoHead } from "@/components/seo/SeoHead";
import { JsonLdBreadcrumb } from "@/components/seo/JsonLd";
import { ChinhNgachDocsLookup } from "@/components/pricing/ChinhNgachDocsLookup";
import { ChinhNgachTemplates } from "@/components/pricing/ChinhNgachTemplates";
import { ChinhNgachQuotations } from "@/components/pricing/ChinhNgachQuotations";
import { ChinhNgachRateGuide } from "@/components/pricing/ChinhNgachRateGuide";
import { ChinhNgachRateSheet } from "@/components/pricing/ChinhNgachRateSheet";
import { useI18n } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";
import "@/components/pricing/chinhNgachSheet.css";

/** The page is the XKCN Hub v6.0 sheet (thg_xkcn_v14.html): a cream hero, a
 *  three-card picker, and one pane per card. Markup and class names follow the
 *  sheet so its own stylesheet (chinhNgachSheet.css) renders it unchanged.
 *
 *  The rates card comes first, ahead of the sheet's order: rates are what this
 *  URL is for, and the pane it opens on with no hash.
 *
 *  The picked card lives in the URL hash so a pane can be linked to and
 *  survives a reload. */
const CARDS = [
    { id: "bang-gia", icon: "💰", titleKey: "chinhngach.card_rates_title", subKey: "chinhngach.card_rates_sub" },
    { id: "tra-cuu", icon: "📋", titleKey: "chinhngach.card_lookup_title", subKey: "chinhngach.card_lookup_sub" },
    { id: "mau-giay-to", icon: "📄", titleKey: "chinhngach.card_templates_title", subKey: "chinhngach.card_templates_sub" },
] as const;

type PaneId = (typeof CARDS)[number]["id"];
type RateView = "banggia" | "huongdan" | "quotation";

const RATE_VIEWS: readonly { id: RateView; labelKey: string }[] = [
    { id: "banggia", labelKey: "chinhngach.rate_view_rates_tab" },
    { id: "huongdan", labelKey: "chinhngach.rate_view_guide_tab" },
    { id: "quotation", labelKey: "chinhngach.rate_view_estimate_tab" },
];

function isPaneId(value: string): value is PaneId {
    return CARDS.some((card) => card.id === value);
}

const paneFromHash = (): PaneId => {
    const hash = typeof window === "undefined" ? "" : window.location.hash.replace(/^#/, "");
    return isPaneId(hash) ? hash : "bang-gia";
};

const ChinhNgachPricingPage = () => {
    const { t, language } = useI18n();
    const [pane, setPane] = useState<PaneId>(paneFromHash);
    const [rateView, setRateView] = useState<RateView>("banggia");
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        trackEvent("view_pricing", { pricing_type: "formal_customs", locale: language });
    }, [language]);

    // Back/forward move between panes, since picking a card writes history.
    useEffect(() => {
        const onHash = () => setPane(paneFromHash());
        window.addEventListener("hashchange", onHash);
        return () => window.removeEventListener("hashchange", onHash);
    }, []);

    function selectCard(next: PaneId) {
        setPane(next);
        // The sheet resets the rates pane to its first view whenever you leave it.
        if (next !== "bang-gia") setRateView("banggia");
        window.history.pushState(null, "", next === "bang-gia" ? window.location.pathname : `#${next}`);
        trackEvent("view_pricing", { pricing_type: "formal_customs", tab: next, locale: language });
        const grid = gridRef.current;
        if (grid) window.scrollTo({ top: grid.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    }

    return (
        <>
            <SeoHead
                title={t("seo.chinhngach_pricing_title")}
                description={t("seo.chinhngach_pricing_desc")}
                path="/chinh-ngach-pricing"
            />
            <JsonLdBreadcrumb
                items={[
                    { name: "Home", url: `https://thgfulfill.com/${language}` },
                    { name: "Chinh Ngach Pricing", url: `https://thgfulfill.com/${language}/chinh-ngach-pricing` },
                ]}
            />
            <Navbar variant="darkHero" />

            {/* Navbar and footer stay outside .xkcn: the sheet's stylesheet resets
                every descendant, which would override their Tailwind utilities. */}
            <div className="xkcn">
                {/* The site navbar is fixed and transparent at the top; this navy band
                    sits under it where the sheet has its own navy bar. */}
                <div className="xkcn-navspace" aria-hidden="true" />

                <nav className="bc" aria-label="Breadcrumb">
                    <Link to={`/${language}`}>thgfulfill.com</Link><span className="sep">›</span>
                    <span>{t("chinhngach.bc_services")}</span><span className="sep">›</span>
                    <span className="bc-current">{t("chinhngach.bc_current")}</span>
                </nav>

                <div className="page-outer">
                    <div className="hero">
                        <div className="hero-eyebrow">{t("chinhngach.hub_eyebrow")}</div>
                        <h1>
                            {t("chinhngach.hub_title_lead")} <span className="gold">{t("chinhngach.hub_title_gold")}</span>
                        </h1>
                        <p>{t("chinhngach.hub_subtitle")}</p>
                    </div>

                    <div className="page-inner">
                        <div className="step-label">{t("chinhngach.step_label")}</div>

                        <div className="card-grid" ref={gridRef} role="tablist" aria-label={t("chinhngach.tabs_label")}>
                            {CARDS.map((card) => (
                                <button
                                    key={card.id}
                                    type="button"
                                    role="tab"
                                    id={`tab-${card.id}`}
                                    aria-selected={pane === card.id}
                                    aria-controls={`panel-${card.id}`}
                                    className={`sel-card${pane === card.id ? " active" : ""}`}
                                    onClick={() => selectCard(card.id)}
                                >
                                    <div className="sel-icon" aria-hidden="true">{card.icon}</div>
                                    <div className="sel-title">{t(card.titleKey)}</div>
                                    <div className="sel-sub">{t(card.subKey)}</div>
                                    <span className="sel-arrow" aria-hidden="true">→</span>
                                </button>
                            ))}
                        </div>

                        <div className="content-area">
                            {pane === "tra-cuu" && (
                                <div className="sub-pane active" role="tabpanel" id="panel-tra-cuu" aria-labelledby="tab-tra-cuu">
                                    <ChinhNgachDocsLookup />
                                </div>
                            )}

                            {pane === "bang-gia" && (
                                <div className="sub-pane active" role="tabpanel" id="panel-bang-gia" aria-labelledby="tab-bang-gia">
                                    <div className="phead">
                                        <div className="phead-tag">🚢 Ship chính ngạch VN → US</div>
                                        <h2>Bảng Giá Vận Chuyển Chính Ngạch</h2>
                                        <p>Cước Sea &amp; Air · Đầy đủ thủ tục · Minh bạch từng khoản phí</p>
                                    </div>

                                    <div className="tab-row" role="tablist" aria-label={t("chinhngach.rate_views_label")} style={{ marginBottom: 20 }}>
                                        {RATE_VIEWS.map(({ id, labelKey }) => (
                                            <button
                                                key={id}
                                                type="button"
                                                role="tab"
                                                id={`formal-tab-${id}`}
                                                aria-selected={rateView === id}
                                                aria-controls={`formal-panel-${id}`}
                                                className={`ttab${rateView === id ? " on" : ""}`}
                                                onClick={() => setRateView(id)}
                                            >
                                                {t(labelKey)}
                                            </button>
                                        ))}
                                    </div>

                                    {rateView === "banggia" && (
                                        <div className="fp on" role="tabpanel" id="formal-panel-banggia" aria-labelledby="formal-tab-banggia">
                                            <ChinhNgachRateSheet />
                                        </div>
                                    )}
                                    {rateView === "huongdan" && (
                                        <div className="fp on" role="tabpanel" id="formal-panel-huongdan" aria-labelledby="formal-tab-huongdan">
                                            <ChinhNgachRateGuide
                                                onShowRates={() => setRateView("banggia")}
                                                onJumpToQuotation={() => setRateView("quotation")}
                                            />
                                        </div>
                                    )}
                                    {rateView === "quotation" && (
                                        <div className="fp on" role="tabpanel" id="formal-panel-quotation" aria-labelledby="formal-tab-quotation">
                                            <ChinhNgachQuotations />
                                        </div>
                                    )}
                                </div>
                            )}

                            {pane === "mau-giay-to" && (
                                <div className="sub-pane active" role="tabpanel" id="panel-mau-giay-to" aria-labelledby="tab-mau-giay-to">
                                    <ChinhNgachTemplates />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ContactSection />
        </>
    );
};

export default ChinhNgachPricingPage;
