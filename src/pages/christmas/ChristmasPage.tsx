import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Factory, MessageCircle, Tag, Truck } from "lucide-react";

import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import { SeoHead } from "@/components/seo/SeoHead";
import { JsonLdBreadcrumb } from "@/components/seo/JsonLd";
import { useI18n } from "@/lib/i18n";
import { SITE_BASE } from "@/lib/seoRoutes";
import "@/lib/i18n/translations/christmas";
import { CHRISTMAS, HOT_PICKS, PRODUCTS, catalogHref, fromPrice } from "./christmasData";
import { Countdown } from "./Countdown";
import { useCountdown } from "./useCountdown";
import { ProductCatalog } from "./ProductCatalog";
import { ConsultButton, OriginTag, ProductImage } from "./parts";
import { XmasImage } from "./XmasImage";
import "./christmas.css";

const PATH = "/christmas";
const DISPLAY_FONT = "https://fonts.googleapis.com/css2?family=Lobster&display=swap";
const SUBNAV = [
    ["hot", "christmas.nav_hot"],
    ["san-pham", "christmas.nav_products"],
    ["advent", "christmas.nav_advent"],
    ["ornament", "christmas.nav_ornament"],
    ["quy-trinh", "christmas.nav_process"],
] as const;
const RIBBON_1 = ["Merry Christmas", "Happy Selling"];
const RIBBON_2 = ["Amazon", "Etsy", "Made in USA", "Christmas 2026"];
const BENEFITS = [
    [Factory, "b1"],
    [Clock, "b2"],
    [Truck, "b3"],
    [Tag, "b4"],
] as const;
const STEPS = ["s1", "s2", "s3", "s4"] as const;
const ADVENT = PRODUCTS.find((p) => p.id === "advent-pet") ?? {};

/** A market-at-night silhouette, shown while the hero photo is missing. */
const HeroScenery = () => (
    <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <path d="M0 230 Q300 200 600 225 T1200 215 V300 H0Z" fill="#fff" opacity=".92" />
        {[90, 250, 960, 1110].map((x, i) => (
            <g key={x} transform={`translate(${x} ${i % 2 ? 60 : 40}) scale(${i % 2 ? 0.85 : 1})`}>
                <path d="M0 0 L-55 90 H-25 L-70 160 H-30 L-85 230 H85 L30 160 H70 L25 90 H55Z" fill="#1F5A3A" />
                <circle cx="0" cy="-6" r="9" fill="#F5B841" />
            </g>
        ))}
        {[420, 600, 780].map((x) => (
            <g key={x} transform={`translate(${x} 130)`}>
                <path d="M-70 40 L0 0 L70 40Z" fill="#E2462D" />
                <rect x="-60" y="40" width="120" height="70" fill="#5E0B10" />
                <rect x="-40" y="58" width="80" height="34" rx="4" fill="#FFD98A" opacity=".85" />
            </g>
        ))}
    </svg>
);

interface Flake {
    left: number;
    size: number;
    duration: number;
    delay: number;
    opacity: number;
}

/** Client-only snow: random positions are made after mount (never in the
 *  prerendered HTML) and skipped entirely for reduced motion. */
function useSnow(count: number): Flake[] {
    const [flakes, setFlakes] = useState<Flake[]>([]);
    useEffect(() => {
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
        setFlakes(
            Array.from({ length: count }, () => ({
                left: Math.random() * 100,
                size: Math.random() * 5 + 3,
                duration: Math.random() * 8 + 9,
                delay: Math.random() * 15,
                opacity: Math.random() * 0.5 + 0.35,
            })),
        );
    }, [count]);
    return flakes;
}

function Ribbon({ words, className }: Readonly<{ words: string[]; className: string }>) {
    // The track scrolls by half its width, so it holds the words four times.
    const items = [0, 1, 2, 3].flatMap((round) => words.map((word) => `${round}-${word}`));
    return (
        <div className={`ribbon ${className}`}>
            <div className="track">
                {items.map((key) => (
                    <span key={key}>{key.slice(key.indexOf("-") + 1)}</span>
                ))}
            </div>
        </div>
    );
}

function SectionHead({ kicker, title, em, desc }: Readonly<{ kicker: string; title: string; em: string; desc?: string }>) {
    return (
        <div className="sec-head">
            <span className="sec-kicker">{kicker}</span>
            <h2 className="sec-title">
                {title} <em>{em}</em>
            </h2>
            {desc && <p className="sec-desc">{desc}</p>}
        </div>
    );
}

const ChristmasPage = () => {
    const { t, language } = useI18n();
    const countdown = useCountdown();
    const flakes = useSnow(28);
    const count = String(PRODUCTS.length);
    const withCount = (key: string) => t(key).replace("{count}", count);
    const consult = t("christmas.consult");

    return (
        <>
            <SeoHead
                title={t("christmas.seo_title")}
                description={withCount("christmas.seo_desc")}
                ogImageAlt={t("christmas.og_alt")}
                path={PATH}
            />
            <Helmet>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link rel="stylesheet" href={DISPLAY_FONT} />
            </Helmet>
            <JsonLdBreadcrumb
                items={[
                    { name: "Home", url: `${SITE_BASE}/${language}` },
                    { name: t("christmas.breadcrumb"), url: `${SITE_BASE}/${language}${PATH}` },
                ]}
            />
            <Navbar variant="darkHero" />

            {/* Navbar and footer stay outside .xmas: its reset would override their Tailwind. */}
            <main className="xmas">
                <div className="xm-navspace" aria-hidden="true" />
                <p className="topbar">
                    {t("christmas.topbar_lead")}
                    <b>{t("christmas.topbar_strong")}</b>
                    {t("christmas.topbar_tail")}
                </p>

                <nav className="subnav" aria-label={t("christmas.subnav_label")}>
                    <div className="xm-container subnav-in">
                        <div className="subnav-links">
                            {SUBNAV.map(([id, key]) => (
                                <a key={id} href={`#${id}`}>
                                    {t(key)}
                                </a>
                            ))}
                        </div>
                        <ConsultButton className="btn btn-hot">{consult}</ConsultButton>
                    </div>
                </nav>

                <section className="hero" id="top" aria-labelledby="xmas-title">
                    {flakes.map((f) => (
                        <span
                            key={`${f.left}-${f.delay}`}
                            className="flake"
                            aria-hidden="true"
                            style={{
                                left: `${f.left}%`,
                                width: f.size,
                                height: f.size,
                                opacity: f.opacity,
                                animationDuration: `${f.duration}s`,
                                animationDelay: `-${f.delay}s`,
                            }}
                        />
                    ))}
                    <div className="hero-badge" aria-hidden="true">
                        <span>{t("christmas.hero_badge")}</span>
                    </div>
                    <div className="hero-content">
                        <p className="hero-eyebrow">{t("christmas.hero_eyebrow")}</p>
                        <h1 id="xmas-title">
                            <span>Christmas</span>
                            <span>Collection</span>
                        </h1>
                        <p className="hero-sub">{withCount("christmas.hero_sub")}</p>
                        <div className="hero-cta">
                            <a className="btn btn-xred" href="#san-pham">
                                {t("christmas.hero_explore")} <ArrowRight aria-hidden="true" />
                            </a>
                            <Link className="btn btn-gold-line" to={`/${language}/catalog/${CHRISTMAS.defaultCollection}`}>
                                {t("christmas.hero_catalog")}
                            </Link>
                        </div>
                        <Countdown value={countdown} />
                    </div>
                    <div className="hero-scene">
                        <XmasImage
                            src={CHRISTMAS.heroImage}
                            alt={t("christmas.hero_img_alt")}
                            width={1901}
                            height={824}
                            priority
                            fallback={<HeroScenery />}
                        />
                    </div>
                </section>

                <div className="ribbons" aria-hidden="true">
                    <Ribbon words={RIBBON_1} className="r1" />
                    <Ribbon words={RIBBON_2} className="r2" />
                </div>

                <section className="section" id="hot">
                    <div className="xm-container">
                        <SectionHead
                            kicker={t("christmas.hot_kicker")}
                            title={t("christmas.hot_title")}
                            em={t("christmas.hot_title_em")}
                            desc={t("christmas.hot_desc").replace("{count}", String(HOT_PICKS.length))}
                        />
                        <div className="picks">
                            {HOT_PICKS.map((product) => {
                                const from = fromPrice(product);
                                return (
                                    <Link key={product.id} className="pick" to={catalogHref(language, product)}>
                                        <div className="pick-in">
                                            <div className="pick-media">
                                                <ProductImage product={product} />
                                                <OriginTag origin={product.origin} className="pick-tag" />
                                            </div>
                                            <div className="pick-body">
                                                <h3>{product.name}</h3>
                                                <span className="vn">{t(`christmas.p_${product.id}`)}</span>
                                                <div className="pick-price">
                                                    {from ? (
                                                        <>
                                                            {t("christmas.from")} <b>{from}</b>
                                                        </>
                                                    ) : (
                                                        <b className="ask">{t("christmas.ask_price")}</b>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="section deep" aria-labelledby="xmas-why">
                    <div className="xm-container">
                        <div className="sec-head">
                            <span className="sec-kicker">{t("christmas.why_kicker")}</span>
                            <h2 className="sec-title" id="xmas-why">
                                {t("christmas.why_title")} <em>{t("christmas.why_title_em")}</em>
                            </h2>
                        </div>
                        <div className="benefits">
                            {BENEFITS.map(([Icon, key]) => (
                                <div className="benefit" key={key}>
                                    <div className="b-icon" aria-hidden="true">
                                        <Icon />
                                    </div>
                                    <h3>{t(`christmas.${key}_title`)}</h3>
                                    <p>{t(`christmas.${key}_desc`)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="catalog" id="san-pham">
                    <div className="xm-container">
                        <SectionHead
                            kicker={t("christmas.catalog_kicker")}
                            title={t("christmas.catalog_title")}
                            em={t("christmas.catalog_title_em")}
                            desc={t("christmas.catalog_desc")}
                        />
                        <ProductCatalog />
                    </div>
                </section>

                <section className="spot" id="advent">
                    <div className="xm-container spot-grid">
                        <div className="spot-media">
                            {CHRISTMAS.spotlight.map((shot) => (
                                <figure key={shot.img}>
                                    <XmasImage src={shot.img} alt={t(`christmas.alt_${shot.alt}`)} pendingLabel={t("christmas.img_pending")} />
                                </figure>
                            ))}
                        </div>
                        <div>
                            <span className="sec-kicker">{t("christmas.advent_kicker")}</span>
                            <h2>
                                {t("christmas.advent_title")} <em>{t("christmas.advent_title_em")}</em>
                            </h2>
                            <p className="spot-lead">{t("christmas.advent_lead")}</p>
                            <ul className="spec">
                                <li>
                                    <span>
                                        <b>{t("christmas.advent_spec_contents_k")}</b> {t("christmas.advent_spec_contents")}
                                    </span>
                                </li>
                                <li>
                                    <span>
                                        <b>{t("christmas.advent_spec_box_k")}</b> 26 × 18 × 5 cm
                                    </span>
                                </li>
                                <li>
                                    <span>
                                        <b>{t("christmas.advent_spec_concept_k")}</b> Christmas, Pet, Family, Couple, Halloween
                                    </span>
                                </li>
                                <li>
                                    <span>
                                        <b>{t("christmas.advent_spec_made_k")}</b>
                                        {t("christmas.advent_spec_made")}
                                    </span>
                                </li>
                            </ul>
                            <div className="spot-cta">
                                <ConsultButton className="btn btn-hot" product="Advent Calendar">
                                    {consult}
                                </ConsultButton>
                                <Link className="btn btn-ghost" to={catalogHref(language, ADVENT)}>
                                    {t("christmas.view_details")}
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="orn" id="ornament">
                    <div className="xm-container">
                        <SectionHead
                            kicker={t("christmas.orn_kicker")}
                            title={t("christmas.orn_title")}
                            em={t("christmas.orn_title_em")}
                            desc={t("christmas.orn_desc")}
                        />
                        <div className="orn-row">
                            {CHRISTMAS.ornaments.map((orn) => (
                                <Link key={orn.key} className="orn-item" to={catalogHref(language, { ...orn, collection: "christmas" })}>
                                    <XmasImage className="bubble contain" src={orn.img} alt={`${orn.name} ornament`} pendingLabel={t("christmas.img_pending")} />
                                    <h3>{orn.name}</h3>
                                    <p>{t(`christmas.orn_${orn.material}`)}</p>
                                </Link>
                            ))}
                        </div>
                        <p className="orn-note">
                            <ConsultButton className="btn btn-hot" product="Projection Pendant Ornament">
                                {t("christmas.orn_cta")}
                            </ConsultButton>
                        </p>
                    </div>
                </section>

                <section className="process" id="quy-trinh">
                    <div className="xm-container">
                        <SectionHead kicker={t("christmas.process_kicker")} title={t("christmas.process_title")} em={t("christmas.process_title_em")} />
                        <ol className="steps">
                            {STEPS.map((key) => (
                                <li className="step" key={key}>
                                    <h3>{t(`christmas.${key}_title`)}</h3>
                                    <p>{t(`christmas.${key}_desc`)}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                <section className="final" id="tu-van" aria-labelledby="xmas-final">
                    <div className="xm-container">
                        <span className="sec-kicker">{t("christmas.final_kicker")}</span>
                        <h2 className="sec-title" id="xmas-final">
                            {t("christmas.final_title")} <em>{t("christmas.final_title_em")}</em>
                        </h2>
                        <Countdown value={countdown} big />
                        {!countdown?.done && <p className="cd-label">{t("christmas.cd_caption")}</p>}
                        <div className="hero-cta">
                            <ConsultButton className="btn btn-hot">
                                <MessageCircle aria-hidden="true" />
                                {t("christmas.final_cta")}
                            </ConsultButton>
                        </div>
                    </div>
                </section>
            </main>

            <ContactSection />
        </>
    );
};

export default ChristmasPage;
