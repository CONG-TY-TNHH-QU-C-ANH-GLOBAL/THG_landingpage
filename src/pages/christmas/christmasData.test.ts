import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { christmasTranslations } from "@/lib/i18n/translations/christmas";
import { CHRISTMAS, HOT_PICKS, ORIGINS, PRODUCTS, catalogHref, countByCategory, fromPrice, getCountdown } from "./christmasData";

const PUBLIC = join(process.cwd(), "public");

/** Photos marketing still has to supply. The page shows a branded fallback
 *  for these; drop the file into public/ and delete it from this list. */
const PENDING_ASSETS = new Set(["/christmas/hero-christmas-market-navy.jpg", "/christmas/products/ornament-bell.jpg"]);

const allImages = [
    CHRISTMAS.heroImage,
    ...PRODUCTS.map((p) => p.img),
    ...CHRISTMAS.spotlight.map((s) => s.img),
    ...CHRISTMAS.ornaments.map((o) => o.img),
];

describe("christmas product data", () => {
    it("has unique product ids", () => {
        expect(new Set(PRODUCTS.map((p) => p.id)).size).toBe(PRODUCTS.length);
    });

    it("every image exists in public/ or is a listed pending asset", () => {
        const missing = allImages.filter((src) => !PENDING_ASSETS.has(src) && !existsSync(join(PUBLIC, src)));
        expect(missing).toEqual([]);
    });

    it("pending assets really are still missing (keep the list honest)", () => {
        const supplied = [...PENDING_ASSETS].filter((src) => existsSync(join(PUBLIC, src)));
        expect(supplied).toEqual([]);
    });

    it("the tee shows the printed shirt, not a plain blank", () => {
        expect(PRODUCTS.find((p) => p.id === "tee")?.img).toBe("/christmas/products/tee-printed.webp");
    });

    it("origins and categories are valid", () => {
        for (const p of PRODUCTS) {
            expect(ORIGINS).toContain(p.origin);
            expect(CHRISTMAS.categories).toContain(p.cat);
        }
    });

    it("tab counts add up", () => {
        const sum = CHRISTMAS.categories.reduce((n, c) => n + countByCategory(c), 0);
        expect(sum).toBe(countByCategory("all"));
    });

    it("hot picks are products flagged hot", () => {
        expect(HOT_PICKS.length).toBeGreaterThan(0);
        for (const p of HOT_PICKS) expect(p.hot).toBe(true);
    });

    it("every product and meta kind has VI/EN/ZH copy", () => {
        const keys = [
            ...PRODUCTS.map((p) => `christmas.p_${p.id}`),
            ...PRODUCTS.flatMap((p) => p.meta.filter(([kind]) => kind !== "spec").map(([kind]) => `christmas.meta_${kind}`)),
            ...ORIGINS.map((o) => `christmas.origin_${o}`),
        ];
        for (const key of keys) {
            const entry = christmasTranslations[key];
            expect(entry, key).toBeDefined();
            expect(entry.vi && entry.en && entry.zh, key).toBeTruthy();
        }
    });

    it("no two products share the exact same price pair (copy-paste guard)", () => {
        const pairs = PRODUCTS.filter((p) => p.label && p.merchant).map((p) => `${p.label}|${p.merchant}`);
        expect(new Set(pairs).size).toBe(pairs.length);
    });

    it("links stay internal and lang-aware", () => {
        expect(catalogHref("en", { catalogId: "abc", collection: "new-arrivals" })).toBe("/en/catalog/new-arrivals?productId=abc");
        expect(catalogHref("vi", {})).toBe("/vi/catalog/christmas");
        expect(fromPrice(PRODUCTS.find((p) => p.id === "placemat")!)).toBe("$4.50");
    });
});

describe("christmas countdown", () => {
    const target = new Date(CHRISTMAS.countdownTarget);

    it("counts down before Christmas", () => {
        const now = new Date(target.getTime() - (2 * 86_400 + 3 * 3_600 + 4 * 60 + 5) * 1000);
        expect(getCountdown(now, target)).toEqual({ done: false, days: 2, hours: 3, minutes: 4, seconds: 5 });
    });

    it("is done at and after Christmas, without rolling over to next year", () => {
        expect(getCountdown(target, target).done).toBe(true);
        const boxingDay = new Date(target.getTime() + 86_400_000);
        expect(getCountdown(boxingDay, target)).toEqual({ done: true, days: 0, hours: 0, minutes: 0, seconds: 0 });
    });

    it("targets Christmas Day 2026", () => {
        expect(target.toISOString()).toBe("2026-12-24T17:00:00.000Z");
    });
});
