import { useMemo, useState } from "react";

import {
    CATEGORY_ICONS,
    CATEGORY_LABELS,
    GOODS,
    type CategoryKey,
    type GoodsItem,
} from "@/data/chinhNgachDocs";
import { RichText } from "@/components/pricing/RichText";

/** The sheet's own tier palette. Not decorative: green/amber/blue is the same
 *  three-way coding the sidebar legend explains, and freight staff read it that
 *  way. Generic Tailwind tones would break the legend's promise. */
const TIERS = [
    { key: "req", label: "🟢 Bắt buộc", legend: "Bắt buộc", dot: "#1b4332", chip: "bg-[#d8edd4] text-[#1b4332]" },
    { key: "cond", label: "🟡 Có điều kiện", legend: "Có điều kiện", dot: "#7a4f00", chip: "bg-[#fff1cc] text-[#7a4f00]" },
    { key: "opt", label: "🔵 Tùy chọn", legend: "Tùy chọn", dot: "#1a3a5c", chip: "bg-[#dce9f5] text-[#1a3a5c]" },
] as const;

/** The sidebar abbreviates where the results heading does not — the sheet keeps
 *  every entry in the 220px column to one line. */
const SIDEBAR_LABELS: Partial<Record<CategoryKey, string>> = {
    all: "Tất cả",
    go: "Gỗ / Thủ công",
};

function Highlight({ text, term }: Readonly<{ text: string; term: string }>) {
    if (!term) return <>{text}</>;
    const i = text.toLowerCase().indexOf(term.toLowerCase());
    if (i < 0) return <>{text}</>;
    return (
        <>
            {text.slice(0, i)}
            <mark className="rounded-sm bg-[#fff3b0] px-0.5 text-inherit">{text.slice(i, i + term.length)}</mark>
            {text.slice(i + term.length)}
        </>
    );
}

function GoodsCard({ item, open, onToggle, term }: Readonly<{
    item: GoodsItem; open: boolean; onToggle: () => void; term: string;
}>) {
    const total = item.docs.req.length + item.docs.cond.length + item.docs.opt.length;
    return (
        <div className="overflow-hidden rounded-[9px] border border-[#DDD8CE] bg-white shadow-[0_1px_3px_rgba(0,0,0,.04)] transition-shadow hover:shadow-[0_3px_12px_rgba(0,0,0,.09)]">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="flex w-full items-center gap-[11px] px-[15px] py-3 text-left transition-colors hover:bg-[#fafaf8]"
            >
                <span className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-md bg-navy font-mono text-[11px] font-semibold text-primary">
                    {item.id}
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px] font-bold text-navy">
                        <Highlight text={item.name} term={term} />
                    </span>
                    <span className="mt-0.5 inline-block rounded border border-[#DDD8CE] bg-cream px-1.5 font-mono text-[10px] text-muted-foreground">
                        {item.hs}
                    </span>
                </span>
                <span className="flex-shrink-0 font-mono text-[11px] text-muted-foreground">{total} loại</span>
                <span
                    className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full transition-all ${open ? "rotate-180 bg-cream" : ""}`}
                    aria-hidden="true"
                >
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M2.5 4.5l4 4 4-4" stroke="#718096" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </button>

            {open && (
                <div className="border-t border-[#DDD8CE] px-4 py-3.5">
                    {TIERS.map(({ key, label, chip }) => {
                        const docs = item.docs[key];
                        if (docs.length === 0) return null;
                        return (
                            <div key={key} className="mb-3 last:mb-0">
                                <p className="mb-1.5 border-b border-[#DDD8CE] pb-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                                    {label} ({docs.length})
                                </p>
                                <ul className="flex flex-wrap gap-[5px]">
                                    {docs.map((doc) => (
                                        <li
                                            key={doc}
                                            className={`inline-flex items-center gap-[5px] rounded-[5px] px-[9px] py-1 text-[12px] font-medium leading-tight ${chip}`}
                                        >
                                            <span className="h-1 w-1 flex-shrink-0 rounded-full bg-current" aria-hidden="true" />
                                            <Highlight text={doc} term={term} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                    {item.note && (
                        <p className="mt-[11px] rounded-r-md border-l-[3px] border-primary bg-[#fff8ec] px-[13px] py-2.5 text-[12px] leading-relaxed text-[#5c4a00]">
                            ⚠️ <RichText html={item.note} />
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export function ChinhNgachDocsLookup() {
    const [cat, setCat] = useState<CategoryKey>("all");
    const [query, setQuery] = useState("");
    const [openIds, setOpenIds] = useState<ReadonlySet<number>>(new Set());

    const counts = useMemo(() => {
        const c: Partial<Record<CategoryKey, number>> = { all: GOODS.length };
        for (const g of GOODS) c[g.cat] = (c[g.cat] ?? 0) + 1;
        return c;
    }, []);

    const term = query.trim();
    const results = useMemo(() => {
        const q = term.toLowerCase();
        return GOODS.filter((g) => {
            if (cat !== "all" && g.cat !== cat) return false;
            if (!q) return true;
            // Certificate names are searched too, so "phytosanitary" finds the
            // commodities that need one — the reverse lookup operations do daily.
            return (
                g.name.toLowerCase().includes(q) ||
                g.hs.toLowerCase().includes(q) ||
                [...g.docs.req, ...g.docs.cond, ...g.docs.opt].join(" ").toLowerCase().includes(q)
            );
        });
    }, [cat, term]);

    /** The sheet labels groups only while searching: browsing one category needs
     *  no heading, but a free-text hit list spans categories and does. */
    const grouped = useMemo(() => {
        if (!term) return null;
        const g = new Map<CategoryKey, GoodsItem[]>();
        for (const item of results) {
            const arr = g.get(item.cat) ?? [];
            arr.push(item);
            g.set(item.cat, arr);
        }
        return [...g.entries()];
    }, [results, term]);

    const toggle = (id: number) =>
        setOpenIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

    function pickCategory(key: CategoryKey) {
        setCat(key);
        setQuery("");
    }

    const cards = (items: readonly GoodsItem[]) =>
        items.map((item) => (
            <GoodsCard key={item.id} item={item} open={openIds.has(item.id)} onToggle={() => toggle(item.id)} term={term} />
        ));

    return (
        <div>
            <div className="mb-4 flex items-start gap-2.5 rounded-[9px] bg-navy px-4 py-3.5 text-[12.5px] leading-relaxed text-white/85">
                <span aria-hidden="true">📌</span>
                <p>
                    <strong className="text-[#ffd87a]">Bộ chứng từ bắt buộc mọi lô hàng:</strong> Commercial Invoice ·
                    Packing List · B/L hoặc AWB · Tờ khai hải quan xuất khẩu · C/O (Form B / EVFTA / RCEP tùy thị
                    trường). Các giấy tờ bên dưới là <strong className="text-[#ffd87a]">phát sinh thêm</strong> tùy từng
                    mặt hàng.
                </p>
            </div>

            <div className="grid items-start gap-5 lg:grid-cols-[220px_1fr]">
                <aside className="overflow-hidden rounded-[10px] border border-[#DDD8CE] bg-white shadow-[0_1px_4px_rgba(0,0,0,.05)] lg:sticky lg:top-[76px]">
                    <p className="bg-navy px-[15px] py-3 text-[10px] font-bold uppercase tracking-wider text-white/60">
                        Chọn ngành hàng
                    </p>
                    <ul className="p-[7px]">
                        {(Object.keys(CATEGORY_LABELS) as CategoryKey[]).map((key) => {
                            const on = cat === key;
                            return (
                                <li key={key}>
                                    <button
                                        type="button"
                                        onClick={() => pickCategory(key)}
                                        aria-pressed={on}
                                        className={`mb-px flex w-full items-center gap-2.5 rounded-[7px] px-2.5 py-2 text-left text-[12.5px] font-medium transition-colors ${
                                            on ? "bg-navy text-white" : "text-muted-foreground hover:bg-cream hover:text-foreground"
                                        }`}
                                    >
                                        <span className="w-5 flex-shrink-0 text-center text-[14px]" aria-hidden="true">
                                            {CATEGORY_ICONS[key]}
                                        </span>
                                        <span className="flex-1">{SIDEBAR_LABELS[key] ?? CATEGORY_LABELS[key]}</span>
                                        <span
                                            className={`flex-shrink-0 rounded-[7px] px-1.5 py-px font-mono text-[10px] ${on ? "bg-white/[.22]" : "bg-black/[.08]"}`}
                                        >
                                            {counts[key] ?? 0}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="border-t border-[#DDD8CE] px-[15px] py-[11px]">
                        <p className="mb-[7px] text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                            Phân loại
                        </p>
                        {TIERS.map(({ key, legend, dot }) => (
                            <p key={key} className="mb-1 flex items-center gap-[7px] text-[11.5px] text-muted-foreground">
                                <span className="h-[7px] w-[7px] flex-shrink-0 rounded-full" style={{ background: dot }} aria-hidden="true" />
                                {legend}
                            </p>
                        ))}
                    </div>
                </aside>

                <div>
                    <div className="relative mb-[13px]">
                        <svg
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                            width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"
                        >
                            <circle cx="6.5" cy="6.5" r="5" stroke="#b0aaa0" strokeWidth="1.5" />
                            <path d="M10.5 10.5L14 14" stroke="#b0aaa0" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Tìm mặt hàng… (vd: cà phê, gỗ, pin)"
                            aria-label="Tìm mặt hàng hoặc loại chứng từ"
                            className="w-full rounded-[9px] border-[1.5px] border-[#DDD8CE] bg-white py-2.5 pl-[38px] pr-4 text-[13.5px] text-foreground outline-none transition-colors placeholder:text-[#b0aaa0] focus:border-navy"
                        />
                    </div>

                    <div className="mb-[11px] flex items-center justify-between">
                        <p className="text-[13.5px] font-semibold text-navy">{CATEGORY_LABELS[cat]}</p>
                        <p className="rounded-full border border-[#DDD8CE] bg-white px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                            {results.length} kết quả
                        </p>
                    </div>

                    {results.length === 0 ? (
                        <p className="px-5 py-10 text-center text-sm italic text-muted-foreground">
                            Không tìm thấy mặt hàng phù hợp — liên hệ TH Group để được tư vấn bộ chứng từ cho lô hàng của bạn.
                        </p>
                    ) : grouped ? (
                        <div className="flex flex-col gap-2.5">
                            {grouped.map(([key, items]) => (
                                <div key={key} className="flex flex-col gap-2.5">
                                    <p className="flex items-center gap-[7px] px-1 pb-[5px] pt-2.5 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                        <span className="h-[11px] w-[3px] flex-none rounded-sm bg-primary" aria-hidden="true" />
                                        {CATEGORY_LABELS[key]} <span className="font-normal">({items.length})</span>
                                    </p>
                                    {cards(items)}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2.5">{cards(results)}</div>
                    )}
                </div>
            </div>
        </div>
    );
}
