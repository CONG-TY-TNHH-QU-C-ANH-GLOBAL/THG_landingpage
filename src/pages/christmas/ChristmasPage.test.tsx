import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter, Outlet, Route, Routes, useParams } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, onTestFinished, vi } from "vitest";

import { I18nProvider, useI18n, type Language } from "@/lib/i18n";
import { christmasTranslations } from "@/lib/i18n/translations/christmas";
import ChristmasPage from "./ChristmasPage";
import { Countdown } from "./Countdown";
import { ConsultButton } from "./parts";
import { useCountdown } from "./useCountdown";

vi.mock("@/components/Navbar", () => ({ default: () => <nav>TH Group</nav> }));
vi.mock("@/components/ContactSection", () => ({ default: () => null }));

const LANGS: Language[] = ["vi", "en", "zh"];
// Christmas Day 2026 in Vietnam (UTC+7), written independently of christmas.json.
const XMAS = Date.UTC(2026, 11, 24, 17, 0, 0);

/** Mirrors App's LangLayout: the :lang segment drives the i18n language. */
function LangSync() {
    const { lang } = useParams();
    const { setLanguage } = useI18n();
    useEffect(() => setLanguage(lang as Language), [lang, setLanguage]);
    return <Outlet />;
}

const clients: QueryClient[] = [];
function Providers({ children, path }: Readonly<{ children: React.ReactNode; path: string }>) {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    clients.push(client);
    for (const lang of LANGS) client.setQueryData(["cms", "translations", lang], { translations: {} });
    client.setQueryData(["cms", "seo-pages"], { pages: [] });
    return (
        <QueryClientProvider client={client}>
            <HelmetProvider>
                <I18nProvider>
                    <MemoryRouter initialEntries={[path]}>
                        <Routes>
                            <Route path="/:lang" element={<LangSync />}>
                                <Route path="christmas" element={children} />
                            </Route>
                        </Routes>
                    </MemoryRouter>
                </I18nProvider>
            </HelmetProvider>
        </QueryClientProvider>
    );
}

function mountPage(lang: Language = "vi") {
    return render(
        <Providers path={`/${lang}/christmas`}>
            <ChristmasPage />
        </Providers>,
    );
}

function setReducedMotion(reduce: boolean) {
    vi.spyOn(window, "matchMedia").mockImplementation(
        (query: string) =>
            ({
                matches: reduce && query.includes("prefers-reduced-motion: reduce"),
                media: query,
                addEventListener: () => {},
                removeEventListener: () => {},
                addListener: () => {},
                removeListener: () => {},
                onchange: null,
                dispatchEvent: () => false,
            }) as MediaQueryList,
    );
}

const productGrid = () => document.getElementById("xmas-products")!;
const cardIds = () => [...productGrid().querySelectorAll("article[data-product]")].map((a) => a.getAttribute("data-product"));

beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
        "fetch",
        vi.fn(async () => new Response(JSON.stringify({ error: "offline" }), { status: 503 })),
    );
});
afterEach(() => {
    cleanup();
    for (const client of clients.splice(0)) client.clear();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    document.head.innerHTML = "";
});

describe("christmas catalog tabs", () => {
    // Category membership as printed by marketing (source HTML), not read from the data module.
    const KITCHEN = ["plate", "placemat", "tablecloth", "kitchen-towel"];
    const WEAR = ["polo", "tee", "microfiber-towel", "golf-towel"];

    it("starts on All with every product and exactly one tab in the tab order", () => {
        mountPage("en");
        const tabs = within(screen.getByRole("tablist")).getAllByRole("tab");
        expect(tabs.map((t) => t.textContent)).toEqual([
            "All(20)",
            "Gifts & Ornaments(7)",
            "Home decor(5)",
            "Kitchen & Table(4)",
            "Apparel & Towels(4)",
        ]);
        expect(tabs.filter((t) => t.getAttribute("aria-selected") === "true")).toEqual([tabs[0]]);
        expect(tabs.map((t) => t.tabIndex)).toEqual([0, -1, -1, -1, -1]);
        expect(cardIds()).toHaveLength(20);
    });

    it("clicking a tab filters the grid to that category and labels the panel", () => {
        mountPage("en");
        fireEvent.click(screen.getByRole("tab", { name: /Kitchen & Table/ }));
        expect(cardIds()).toEqual(KITCHEN);
        expect(screen.getByRole("tabpanel")).toHaveAttribute("aria-labelledby", "xmas-tab-kitchen");
        expect(screen.getByRole("tab", { name: /Kitchen & Table/ })).toHaveAttribute("aria-selected", "true");
    });

    it("arrow keys wrap, Home/End jump, and focus follows the selected tab", () => {
        mountPage("en");
        const tab = (name: RegExp) => screen.getByRole("tab", { name });
        tab(/^All/).focus();

        fireEvent.keyDown(tab(/^All/), { key: "ArrowLeft" });
        expect(tab(/Apparel/)).toHaveAttribute("aria-selected", "true");
        expect(document.activeElement).toBe(tab(/Apparel/));
        expect(cardIds()).toEqual(WEAR);

        fireEvent.keyDown(tab(/Apparel/), { key: "ArrowRight" });
        expect(document.activeElement).toBe(tab(/^All/));
        expect(cardIds()).toHaveLength(20);

        fireEvent.keyDown(tab(/^All/), { key: "End" });
        expect(document.activeElement).toBe(tab(/Apparel/));
        fireEvent.keyDown(tab(/Apparel/), { key: "Home" });
        expect(document.activeElement).toBe(tab(/^All/));
        fireEvent.keyDown(tab(/^All/), { key: "ArrowRight" });
        expect(document.activeElement).toBe(tab(/Gifts/));
        expect(tab(/Gifts/).tabIndex).toBe(0);
        expect(tab(/^All/).tabIndex).toBe(-1);

        // Other keys are left alone (Tab must still leave the tablist).
        fireEvent.keyDown(tab(/Gifts/), { key: "a" });
        expect(tab(/Gifts/)).toHaveAttribute("aria-selected", "true");
    });
});

describe("christmas consult buttons", () => {
    async function openAndReachMessage(button: HTMLElement, messageLabel: RegExp) {
        fireEvent.click(button);
        const dialog = await screen.findByRole("dialog");
        fireEvent.change(dialog.querySelector("#lead-name")!, { target: { value: "Seller" } });
        fireEvent.change(dialog.querySelector("#lead-email")!, { target: { value: "seller@example.com" } });
        fireEvent.change(dialog.querySelector("#lead-company-url")!, { target: { value: "https://shop.example.com" } });
        fireEvent.change(dialog.querySelector("#lead-order-band")!, { target: { value: "100_499" } });
        // Pre-selected service: the page sells POD, so the form opens on fulfil.
        expect(dialog.querySelector<HTMLSelectElement>("#lead-service")!.value).toBe("fulfill");
        fireEvent.submit(dialog.querySelector("form")!);
        return (await within(dialog).findByLabelText(messageLabel)) as HTMLTextAreaElement;
    }

    it("a product card's consult button opens the lead form prefilled with that product", async () => {
        mountPage("vi");
        const card = productGrid().querySelector('[data-product="placemat"]') as HTMLElement;
        const message = await openAndReachMessage(within(card).getByRole("button", { name: "Tư vấn sản phẩm Placemat" }), /Nhu cầu/);
        expect(message.value).toBe("Bộ sưu tập Christmas 2026: Placemat");
    });

    it("the general consult button opens the lead form with the collection prefix only, no mailto", async () => {
        mountPage("vi");
        expect(document.querySelector('a[href^="mailto:"]')).toBeNull();
        const subnav = screen.getByRole("navigation", { name: "Trên trang này" });
        const message = await openAndReachMessage(within(subnav).getByRole("button", { name: "Tư vấn ngay" }), /Nhu cầu/);
        expect(message.value.trim()).toBe("Bộ sưu tập Christmas 2026:");
    });

    it("prefills in the current language after switching language on the page", async () => {
        function SwitchToEnglish() {
            const { setLanguage } = useI18n();
            return (
                <button type="button" onClick={() => setLanguage("en")}>
                    switch-en
                </button>
            );
        }
        render(
            <Providers path="/vi/christmas">
                <>
                    <SwitchToEnglish />
                    <ConsultButton className="c" product="Placemat" ariaLabel="consult-placemat">
                        go
                    </ConsultButton>
                </>
            </Providers>,
        );
        fireEvent.click(screen.getByRole("button", { name: "switch-en" }));
        const message = await openAndReachMessage(screen.getByRole("button", { name: "consult-placemat" }), /Your needs/);
        expect(message.value).toBe("Christmas 2026 collection: Placemat");
    });
});

describe("christmas countdown", () => {
    function Harness() {
        return <Countdown value={useCountdown()} />;
    }
    const cells = () => [...screen.getByRole("timer").querySelectorAll("b")].map((b) => b.textContent);

    it("server-renders a stable placeholder, never a build-time number", () => {
        vi.useFakeTimers({ now: XMAS - 5_000 });
        const html = renderToString(
            <Providers path="/vi/christmas">
                <Harness />
            </Providers>,
        );
        expect(html.match(/<b>([^<]*)<\/b>/g)).toEqual(["<b>--</b>", "<b>--</b>", "<b>--</b>", "<b>--</b>"]);
    });

    it("ticks every second after mount", () => {
        vi.useFakeTimers({ now: XMAS - (86_400 + 2) * 1000 });
        render(
            <Providers path="/vi/christmas">
                <Harness />
            </Providers>,
        );
        expect(cells()).toEqual(["01", "00", "00", "02"]);
        act(() => vi.advanceTimersByTime(1000));
        expect(cells()).toEqual(["01", "00", "00", "01"]);
        act(() => vi.advanceTimersByTime(2000));
        expect(cells()).toEqual(["00", "23", "59", "59"]);
    });

    it("keeps the placeholder in a headless prerender browser", () => {
        vi.useFakeTimers({ now: XMAS - 60_000 });
        Object.defineProperty(navigator, "webdriver", { value: true, configurable: true });
        onTestFinished(() => {
            delete (navigator as { webdriver?: boolean }).webdriver;
        });
        render(
            <Providers path="/vi/christmas">
                <Harness />
            </Providers>,
        );
        act(() => vi.advanceTimersByTime(3000));
        expect(cells()).toEqual(["--", "--", "--", "--"]);
    });

    it("switches the page to the Christmas message at midnight +07:00 and does not restart", () => {
        vi.useFakeTimers({ now: XMAS - 1000, toFake: ["Date", "setInterval", "clearInterval"] });
        mountPage("en");
        expect(screen.getAllByRole("timer")).toHaveLength(2);
        expect(screen.getByText("left until Christmas Day, 25 December")).toBeInTheDocument();

        act(() => vi.advanceTimersByTime(1000));
        expect(screen.queryByRole("timer")).toBeNull();
        expect(screen.getAllByText("Merry Christmas! Talk to us about your next season.")).toHaveLength(2);
        expect(screen.queryByText("left until Christmas Day, 25 December")).toBeNull();

        act(() => vi.advanceTimersByTime(86_400_000));
        expect(screen.queryByRole("timer")).toBeNull();
    });
});

describe("christmas images", () => {
    it("a missing photo leaves the branded fallback and no broken <img>", () => {
        mountPage("en");
        const bell = screen.getByRole("img", { name: "Christmas Bell ornament" });
        const box = bell.parentElement!;
        fireEvent.error(bell);
        expect(box.querySelector("img")).toBeNull();
        expect(box.querySelector(".xm-fallback")).toHaveTextContent("Photo coming soon");
        expect(screen.queryByRole("img", { name: "Christmas Bell ornament" })).toBeNull();
    });

    it("a missing hero photo shows the drawn scene instead", () => {
        mountPage("en");
        const hero = document.querySelector<HTMLImageElement>('.hero-scene img[src="/christmas/hero-christmas-market-navy.jpg"]')!;
        const box = hero.parentElement!;
        fireEvent.error(hero);
        expect(box.querySelector("img")).toBeNull();
        expect(box.querySelector(".xm-fallback svg")).not.toBeNull();
    });

    it("a loaded photo replaces its fallback", () => {
        mountPage("en");
        // Card photos sit in an aria-hidden link, so find them by alt text.
        const plate = productGrid().querySelector<HTMLImageElement>('[data-product="plate"] img')!;
        expect(plate.alt).toBe("Personalized Ceramic Plate – Personalised ceramic plate");
        const box = plate.parentElement!;
        expect(box.querySelector(".xm-fallback")).not.toBeNull();
        fireEvent.load(plate);
        expect(box.querySelector(".xm-fallback")).toBeNull();
        expect(plate).toHaveClass("is-loaded");
    });
});

describe("christmas links, copy and motion", () => {
    for (const lang of LANGS) {
        it(`${lang}: every link is internal and keeps the /${lang} prefix`, () => {
            mountPage(lang);
            const hrefs = [...document.querySelectorAll("main a[href]")].map((a) => a.getAttribute("href")!);
            expect(hrefs.length).toBeGreaterThan(20);
            const bad = hrefs.filter((h) => !h.startsWith("#") && !h.startsWith(`/${lang}/`));
            expect(bad).toEqual([]);
            const placemat = productGrid().querySelector('[data-product="placemat"] h3 a');
            expect(placemat).toHaveAttribute("href", `/${lang}/catalog/new-arrivals?productId=cmte3t4zn0ey801pnwxrtb6rt`);
        });

        it(`${lang}: renders no raw translation keys and no old brand`, () => {
            mountPage(lang);
            const text = document.body.textContent ?? "";
            expect(text.match(/christmas\.[a-z0-9_]+/g)).toBeNull();
            const attrs = [...document.querySelectorAll("[alt],[aria-label],[title]")].flatMap((el) =>
                ["alt", "aria-label", "title"].map((a) => el.getAttribute(a) ?? ""),
            );
            expect(attrs.filter((v) => /christmas\.[a-z0-9_]+/.test(v))).toEqual([]);
            expect(text).not.toMatch(/THG Fulfill/i);
        });
    }

    it("every christmas key has VI, EN and ZH copy with the same placeholders", () => {
        const placeholders = (s: string) => (s.match(/\{[a-z]+\}/g) ?? []).sort((a, b) => a.localeCompare(b));
        const problems: string[] = [];
        for (const [key, entry] of Object.entries(christmasTranslations)) {
            for (const lang of LANGS) if (!entry[lang]?.trim()) problems.push(`${key}: empty ${lang}`);
            const en = placeholders(entry.en);
            for (const lang of ["vi", "zh"] as const) {
                if (JSON.stringify(placeholders(entry[lang])) !== JSON.stringify(en)) problems.push(`${key}: ${lang} placeholders differ`);
            }
            if (/THG Fulfill/i.test(Object.values(entry).join(" "))) problems.push(`${key}: old brand`);
        }
        expect(problems).toEqual([]);
    });

    it("draws falling snow normally but none for reduced motion", () => {
        setReducedMotion(false);
        mountPage("vi");
        expect(document.querySelectorAll(".hero .flake").length).toBeGreaterThan(0);
        cleanup();
        setReducedMotion(true);
        mountPage("vi");
        expect(document.querySelectorAll(".hero .flake")).toHaveLength(0);
    });
});
