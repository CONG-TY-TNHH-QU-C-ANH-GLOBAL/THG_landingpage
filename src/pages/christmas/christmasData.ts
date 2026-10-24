// Typed view of src/data/christmas.json plus the page's pure helpers
// (countdown math, price summary, catalog links). Kept React-free so the
// tests can exercise it directly.

import raw from "@/data/christmas.json";

export type Origin = "us" | "vn" | "cn";
export type Category = "gift" | "home" | "kitchen" | "wear";
/** [kind, value?] — kind picks the translated label, value is language-neutral. */
export type MetaItem = [string, string?];

export interface Product {
    id: string;
    cat: Category;
    hot?: boolean;
    img: string;
    name: string;
    origin: Origin;
    /** Ship-by-label base price, as printed. */
    label: string | null;
    /** Ship-by-merchant price, as printed. */
    merchant: string | null;
    meta: MetaItem[];
    catalogId?: string;
    collection?: string;
}

export interface Ornament {
    key: string;
    name: string;
    material: "copper" | "steel";
    img: string;
    catalogId?: string;
}

interface ChristmasData {
    countdownTarget: string;
    heroImage: string;
    defaultCollection: string;
    categories: Category[];
    hotPicks: string[];
    spotlight: { img: string; alt: string }[];
    ornaments: Ornament[];
    products: Product[];
}

export const CHRISTMAS = raw as unknown as ChristmasData;
export const PRODUCTS = CHRISTMAS.products;
export const ORIGINS: readonly Origin[] = ["us", "vn", "cn"];

export const HOT_PICKS: Product[] = CHRISTMAS.hotPicks.map((id) => {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) throw new Error(`christmas.json: hot pick "${id}" is not a product`);
    return product;
});

export function countByCategory(cat: Category | "all"): number {
    return cat === "all" ? PRODUCTS.length : PRODUCTS.filter((p) => p.cat === cat).length;
}

/** Lang-aware internal catalog link: the exact product when the hub has it,
 *  else its collection, else the Christmas collection. */
export function catalogHref(lang: string, item: { catalogId?: string; collection?: string }): string {
    const collection = item.collection ?? CHRISTMAS.defaultCollection;
    const base = `/${lang}/catalog/${collection}`;
    return item.catalogId ? `${base}?productId=${item.catalogId}` : base;
}

/** "$4.50 – $20.00" → "$4.50": the lowest printed price for "from" labels. */
export function fromPrice(product: Product): string | null {
    const price = product.label ?? product.merchant;
    return price ? price.split("–")[0].trim() : null;
}

export interface Countdown {
    /** True once the target has passed. */
    done: boolean;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Time left until `target`. After the target it stays at zero with done=true
 *  rather than rolling over to next year: the page sells Christmas 2026. */
export function getCountdown(now: Date, target: Date): Countdown {
    const left = target.getTime() - now.getTime();
    if (left <= 0) return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
        done: false,
        days: Math.floor(left / DAY),
        hours: Math.floor((left % DAY) / HOUR),
        minutes: Math.floor((left % HOUR) / MINUTE),
        seconds: Math.floor((left % MINUTE) / SECOND),
    };
}

export const pad2 = (n: number): string => String(n).padStart(2, "0");
