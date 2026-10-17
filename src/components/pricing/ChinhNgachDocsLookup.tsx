import { useMemo, useState } from "react";

import { CATEGORY_ICONS, CATEGORY_LABELS, GOODS, type CategoryKey, type GoodsItem } from "@/data/chinhNgachDocs";
import { SheetText } from "@/components/pricing/SheetText";

// "Tra cứu giấy tờ xuất khẩu" in the sheet's markup (pane-tc): sidebar of
// categories, search, and one accordion card per commodity. Behaviour follows
// the sheet's script too — picking a category clears the search, only the
// commodity name is highlighted, and group labels appear only while searching.

/** The sidebar abbreviates where the results heading does not. */
const SIDEBAR_LABELS: Partial<Record<CategoryKey, string>> = {
    all: "Tất cả",
    go: "Gỗ / Thủ công",
};

const TIERS = [
    { key: "req", cls: "req", title: "🟢 Bắt buộc" },
    { key: "cond", cls: "cond", title: "🟡 Có điều kiện" },
    { key: "opt", cls: "opt", title: "🔵 Tùy chọn" },
] as const;

/** Every case-insensitive occurrence, as the sheet's hlText regex does. */
function Highlight({ text, term }: Readonly<{ text: string; term: string }>) {
    if (!term) return <>{text}</>;
    const lower = text.toLowerCase();
    const needle = term.toLowerCase();
    const parts: React.ReactNode[] = [];
    let from = 0;
    for (let i = lower.indexOf(needle); i >= 0; i = lower.indexOf(needle, from)) {
        parts.push(text.slice(from, i), <mark key={i} className="sh">{text.slice(i, i + needle.length)}</mark>);
        from = i + needle.length;
    }
    parts.push(text.slice(from));
    return <>{parts}</>;
}

function GoodsCard({ g, open, onToggle, term }: Readonly<{
    g: GoodsItem; open: boolean; onToggle: () => void; term: string;
}>) {
    const total = g.docs.req.length + g.docs.cond.length + g.docs.opt.length;
    return (
        <div className={`tc-card${open ? " open" : ""}`} id={`tc-${g.id}`}>
            <button type="button" className="tc-card-header" onClick={onToggle} aria-expanded={open}>
                <div className="tc-card-num">{g.id}</div>
                <div className="tc-card-info">
                    <div className="tc-card-name"><Highlight text={g.name} term={term} /></div>
                    <div className="tc-card-meta"><span className="tc-hs">{g.hs}</span></div>
                </div>
                <span className="tc-card-total">{total} loại</span>
                <div className="tc-toggle" aria-hidden="true">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M2.5 4.5l4 4 4-4" stroke="#718096" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </button>
            <div className="tc-card-body">
                {TIERS.map(({ key, cls, title }) => {
                    const docs = g.docs[key];
                    if (docs.length === 0) return null;
                    return (
                        <div className="tc-docs-group" key={key}>
                            <div className="tc-docs-group-title">{title} ({docs.length})</div>
                            <div className="tc-docs-tags">
                                {docs.map((d) => (
                                    <span className={`tc-tag ${cls}`} key={d}><span className="tc-tag-dot" />{d}</span>
                                ))}
                            </div>
                        </div>
                    );
                })}
                {g.note && <div className="tc-note">⚠️ <SheetText html={g.note} /></div>}
            </div>
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

    const term = query.toLowerCase().trim();
    const results = useMemo(
        () =>
            GOODS.filter((g) => {
                const catOk = cat === "all" || g.cat === cat;
                // Certificate names are searched too, so "phytosanitary" finds
                // the commodities that need one.
                const all = [...g.docs.req, ...g.docs.cond, ...g.docs.opt].join(" ").toLowerCase();
                const hit = !term || g.name.toLowerCase().includes(term) || g.hs.toLowerCase().includes(term) || all.includes(term);
                return catOk && hit;
            }),
        [cat, term],
    );

    const groups = useMemo(() => {
        const m = new Map<CategoryKey, GoodsItem[]>();
        for (const g of results) m.set(g.cat, [...(m.get(g.cat) ?? []), g]);
        return [...m.entries()];
    }, [results]);

    const toggle = (id: number) =>
        setOpenIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

    const card = (g: GoodsItem) => (
        <GoodsCard key={g.id} g={g} open={openIds.has(g.id)} onToggle={() => toggle(g.id)} term={term} />
    );

    return (
        <>
            <div className="tc-notice">
                <span>📌</span>
                <div>
                    <strong>Bộ chứng từ bắt buộc mọi lô hàng:</strong> Commercial Invoice · Packing List · B/L hoặc AWB · Tờ khai hải quan xuất khẩu · C/O (Form B / EVFTA / RCEP tùy thị trường). Các giấy tờ bên dưới là <strong>phát sinh thêm</strong> tùy từng mặt hàng.
                </div>
            </div>
            <div className="tc-layout">
                <div className="tc-sidebar">
                    <div className="tc-sidebar-header">Chọn ngành hàng</div>
                    <ul className="tc-cat-list">
                        {(Object.keys(CATEGORY_LABELS) as CategoryKey[]).map((key) => (
                            <li key={key}>
                                <button
                                    type="button"
                                    className={`tc-cat-btn${cat === key ? " active" : ""}`}
                                    aria-pressed={cat === key}
                                    onClick={() => {
                                        setCat(key);
                                        setQuery("");
                                    }}
                                >
                                    <span className="emoji">{CATEGORY_ICONS[key]}</span>
                                    <span className="label">{SIDEBAR_LABELS[key] ?? CATEGORY_LABELS[key]}</span>
                                    <span className="cnt">{counts[key] ?? 0}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="tc-legend">
                        <div className="tc-legend-title">Phân loại</div>
                        <div className="tc-legend-item"><div className="tc-leg-dot" style={{ background: "#1b4332" }} />Bắt buộc</div>
                        <div className="tc-legend-item"><div className="tc-leg-dot" style={{ background: "#7a4f00" }} />Có điều kiện</div>
                        <div className="tc-legend-item"><div className="tc-leg-dot" style={{ background: "#1a3a5c" }} />Tùy chọn</div>
                    </div>
                </div>
                <div>
                    <div className="tc-search-wrap">
                        <svg className="tc-search-icon" width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Tìm mặt hàng… (vd: cà phê, gỗ, pin)"
                            aria-label="Tìm mặt hàng hoặc loại chứng từ"
                            autoComplete="off"
                        />
                    </div>
                    <div className="tc-results-bar">
                        <div className="tc-results-title">{CATEGORY_LABELS[cat]}</div>
                        <div className="tc-results-count">{results.length} kết quả</div>
                    </div>
                    {results.length > 0 && (
                        <div className="tc-goods-list">
                            {term
                                ? groups.map(([key, items]) => [
                                      <div className="tc-group-label" key={`g-${key}`}>
                                          {CATEGORY_LABELS[key]} <span className="tc-group-count">({items.length})</span>
                                      </div>,
                                      ...items.map(card),
                                  ])
                                : results.map(card)}
                        </div>
                    )}
                    {results.length === 0 && (
                        <div className="tc-empty tc-empty-shown"><p>🔍 Không tìm thấy mặt hàng. Thử từ khóa khác.</p></div>
                    )}
                </div>
            </div>
        </>
    );
}
