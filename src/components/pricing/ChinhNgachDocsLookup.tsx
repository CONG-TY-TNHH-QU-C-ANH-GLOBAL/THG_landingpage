import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

import {
    CATEGORY_ICONS,
    CATEGORY_LABELS,
    GOODS,
    type CategoryKey,
    type GoodsItem,
} from "@/data/chinhNgachDocs";
import { RichText } from "@/components/pricing/RichText";

/** Tier styling, ordered as the source sheet presents them: what customs will
 *  always ask for, what it asks for only under a condition, and what merely
 *  helps the sale. Keeping them visually distinct is the point of the tab —
 *  a flat list of 11 certificates does not say which ones block a shipment. */
const TIERS = [
    { key: "req", label: "Bắt buộc", dot: "bg-emerald-600", chip: "bg-emerald-50 text-emerald-800 border-emerald-200" },
    { key: "cond", label: "Có điều kiện", dot: "bg-amber-500", chip: "bg-amber-50 text-amber-800 border-amber-200" },
    { key: "opt", label: "Tùy chọn", dot: "bg-slate-400", chip: "bg-slate-50 text-slate-600 border-slate-200" },
] as const;

function GoodsCard({ item, open, onToggle }: Readonly<{
    item: GoodsItem; open: boolean; onToggle: () => void;
}>) {
    const total = item.docs.req.length + item.docs.cond.length + item.docs.opt.length;
    return (
        <div className="bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#FFFBF0] transition-colors"
            >
                <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-[12px] font-bold grid place-items-center flex-shrink-0">
                    {item.id}
                </span>
                <span className="flex-1 min-w-0">
                    <span className="block text-[14px] font-bold text-navy truncate">{item.name}</span>
                    <span className="block text-[12px] text-muted-foreground font-mono">{item.hs}</span>
                </span>
                <span className="text-[12px] text-muted-foreground whitespace-nowrap">{total} loại</span>
                <ChevronDown
                    className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                    aria-hidden="true"
                />
            </button>

            {open && (
                <div className="px-4 pb-4 pt-1 border-t border-[var(--pricing-border)] space-y-3">
                    {TIERS.map(({ key, label, dot, chip }) => {
                        const docs = item.docs[key];
                        if (docs.length === 0) return null;
                        return (
                            <div key={key}>
                                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-1.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${dot}`} aria-hidden="true" />
                                    {label} <span className="font-normal">({docs.length})</span>
                                </p>
                                <ul className="flex flex-wrap gap-1.5">
                                    {docs.map((doc) => (
                                        <li key={doc} className={`text-[12px] px-2 py-1 rounded-md border ${chip}`}>
                                            {doc}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                    {item.note && (
                        <p className="text-[12.5px] text-navy leading-relaxed bg-[#FFF8E7] border border-primary/30 rounded-lg px-3 py-2">
                            <RichText html={item.note} />
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

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        return GOODS.filter((g) => {
            if (cat !== "all" && g.cat !== cat) return false;
            if (!q) return true;
            // Searching the certificate names too, so "phytosanitary" finds the
            // commodities that need one — the reverse lookup operations actually do.
            return (
                g.name.toLowerCase().includes(q) ||
                g.hs.toLowerCase().includes(q) ||
                g.docs.req.some((d) => d.toLowerCase().includes(q)) ||
                g.docs.cond.some((d) => d.toLowerCase().includes(q)) ||
                g.docs.opt.some((d) => d.toLowerCase().includes(q))
            );
        });
    }, [cat, query]);

    const toggle = (id: number) =>
        setOpenIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

    return (
        <div className="space-y-5">
            <div className="bg-[#FFF8E7] border border-primary/30 rounded-xl p-4 sm:p-5">
                <p className="text-[13px] text-navy leading-relaxed">
                    <strong className="font-bold">Bộ chứng từ bắt buộc mọi lô hàng:</strong> Commercial Invoice ·
                    Packing List · B/L hoặc AWB · Tờ khai hải quan xuất khẩu · C/O (Form B / EVFTA / RCEP tùy thị
                    trường). Các giấy tờ bên dưới là phát sinh thêm tùy từng mặt hàng.
                </p>
            </div>

            <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-2">Chọn ngành hàng</p>
                <div className="flex flex-wrap gap-2">
                    {(Object.keys(CATEGORY_LABELS) as CategoryKey[]).map((key) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setCat(key)}
                            aria-pressed={cat === key}
                            className={`flex items-center gap-1.5 text-[12.5px] px-3 py-1.5 rounded-lg border transition-colors ${
                                cat === key
                                    ? "bg-navy text-white border-navy font-semibold"
                                    : "bg-white text-foreground/80 border-[var(--pricing-border)] hover:bg-[#FFFBF0]"
                            }`}
                        >
                            <span aria-hidden="true">{CATEGORY_ICONS[key]}</span>
                            {key === "all" ? "Tất cả" : CATEGORY_LABELS[key]}
                            <span className={cat === key ? "text-white/60" : "text-muted-foreground"}>
                                {counts[key] ?? 0}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Tìm mặt hàng hoặc loại chứng từ… (vd: cà phê, pin, phytosanitary)"
                    aria-label="Tìm mặt hàng hoặc loại chứng từ"
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-[var(--pricing-border)] bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
            </div>

            <div className="flex items-center justify-between">
                <p className="text-[13px] font-bold text-navy">{CATEGORY_LABELS[cat]}</p>
                <p className="text-[12px] text-muted-foreground">{results.length} kết quả</p>
            </div>

            {results.length === 0 ? (
                <p className="bg-white border border-[var(--pricing-border)] rounded-xl p-8 text-center text-muted-foreground text-sm italic">
                    Không tìm thấy mặt hàng phù hợp — liên hệ THG để được tư vấn bộ chứng từ cho lô hàng của bạn.
                </p>
            ) : (
                <div className="space-y-2">
                    {results.map((item) => (
                        <GoodsCard key={item.id} item={item} open={openIds.has(item.id)} onToggle={() => toggle(item.id)} />
                    ))}
                </div>
            )}
        </div>
    );
}
