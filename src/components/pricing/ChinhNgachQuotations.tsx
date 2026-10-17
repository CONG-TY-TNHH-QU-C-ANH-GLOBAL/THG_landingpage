import { useState } from "react";

import { LeadFormDialog } from "@/components/lead/LeadFormDialog";
import { SheetText } from "@/components/pricing/SheetText";
import { LANES, QUOTATION_HEAD, QUOTATIONS, type CostCell, type CostRow, type Quotation } from "@/data/chinhNgachQuotation";

// "Dự toán chi phí" (bgp-quotation) in the sheet's markup: the origin-lane
// container switcher, then one pane per worked quotation — hero facts, the cost
// table, the total block, the notes and a confirm-this-quote CTA. Inline styles
// are the sheet's own.

const KICKER = {
    fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px",
    color: "rgba(255,255,255,.35)", marginBottom: 5,
} as const;
const SUB_LABEL = { textAlign: "right", fontSize: "11.5px", paddingRight: 16 } as const;
const NOTE = { fontSize: "10.5px", color: "var(--muted)" } as const;
const TOTAL_LINE = { fontSize: 12, color: "#4a6a90" } as const;

function Content({ c }: Readonly<{ c: CostCell }>) {
    switch (c.kind) {
        case "price": return <span className="price">{c.txt}</span>;
        case "priceS": return <span className="price-s">{c.txt}</span>;
        case "atcost": case "tbc": case "ifapp": return <span className={`tag-${c.kind}`}>{c.txt}</span>;
        case "note": return <span style={NOTE}>{c.txt}</span>;
        default: return <>{c.txt}</>;
    }
}

const cellClass = (c: CostCell) => [c.cr && "cr", c.mono && "mono", c.dim && "dim"].filter(Boolean).join(" ") || undefined;

function Row({ row }: Readonly<{ row: CostRow }>) {
    const cls = { group: "group-hd", item: "item", sub: "sub-row" }[row.kind];
    return (
        <tr className={cls}>
            {row.cells.map((c, i) => (
                <td key={i} className={cellClass(c)} colSpan={c.span} style={row.kind === "sub" && i === 0 ? SUB_LABEL : undefined}>
                    <Content c={c} />
                </td>
            ))}
        </tr>
    );
}

function QuotationPane({ q }: Readonly<{ q: Quotation }>) {
    return (
        <div className="cpane on" role="tabpanel" id={`cpane-${q.id}`} aria-labelledby={`ctab-${q.id}`}>
            <div className="quot-hero">
                <div className="quot-hero-top">
                    <div style={{ position: "relative", zIndex: 1 }}>
                        <div style={KICKER}>{q.kicker}</div>
                        <div className="quot-badge">{q.badge}</div>
                    </div>
                </div>
                <div className="quot-grid">
                    {q.facts.map((f) => (
                        <div className="qg-item" key={f.k}>
                            <div className="ql">{f.k}</div>
                            <div className={`qv${f.gold ? " gold" : ""}`}>{f.v}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "14px 18px 0", fontSize: "12.5px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".8px" }}>
                    DỰ TOÁN CHI PHÍ
                </div>
                <div className="xkcn-scroll">
                    <table className="cost-table" style={{ marginTop: 10 }}>
                        <thead>
                            <tr>
                                <th style={{ width: "34%" }}>NHÓM CHI PHÍ / HẠNG MỤC</th>
                                <th className="cr" style={{ width: "18%" }}>ĐƠN GIÁ</th>
                                <th style={{ width: "13%" }}>ĐƠN VỊ</th>
                                <th className="cr" style={{ width: "18%" }}>DỰ TOÁN (USD)</th>
                                <th style={{ width: "17%" }}>GHI CHÚ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {q.rows.map((row, i) => <Row key={i} row={row} />)}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="total-block">
                <div>
                    <div className="total-label">{q.total.label}</div>
                    <div className="total-name">{q.total.name}</div>
                    {q.total.lines.map((line, i) => (
                        <div key={line} style={i === 0 ? { ...TOTAL_LINE, marginTop: 5 } : TOTAL_LINE}>{line}</div>
                    ))}
                </div>
                <div className="total-amount">
                    <div className="excl">{q.total.excl}</div>
                    <div className="num">{q.total.amount}<span className="unit">{q.total.unit}</span></div>
                    <div style={{ fontSize: 11, color: "#5a7fa8", marginTop: 4 }}>{q.total.suffix}</div>
                </div>
            </div>
            <div className="discl">
                <div className="discl-title">{q.disclTitle}</div>
                <ul>{q.discl.map((d) => <li key={d}><SheetText html={d} /></li>)}</ul>
            </div>
            {/* Wired to the real lead form, prefilled with the scenario, so
                "confirm this quote" is not a dead mailto. */}
            <div className="cta" style={{ marginTop: 20 }}>
                <LeadFormDialog
                    sourcePage={`/chinh-ngach-pricing#du-toan-${q.id}`}
                    defaultMessage={`Xác nhận báo giá: ${q.badge}`}
                    trigger={<button type="button" className="cta-link">📞 Xác nhận báo giá chính thức với TH Group</button>}
                />
            </div>
        </div>
    );
}

export function ChinhNgachQuotations() {
    const [active, setActive] = useState(QUOTATIONS[0]?.id ?? "40");
    const current = QUOTATIONS.find((q) => q.id === active) ?? QUOTATIONS[0];

    return (
        <div className="wrap">
            <div className="phead">
                <div className="phead-tag">{QUOTATION_HEAD.tag}</div>
                <h2>{QUOTATION_HEAD.title}</h2>
                <p>{QUOTATION_HEAD.sub}</p>
            </div>

            <div className="cont-switch">
                {LANES.map((lane) => (
                    <div className={`lane ${lane.kind}`} key={lane.kind}>
                        <div className="lane-hd">{lane.head}</div>
                        <div className="lane-tabs" role="tablist" aria-label={lane.head}>
                            {QUOTATIONS.filter((q) => q.lane === lane.kind).map((q) => (
                                <button
                                    key={q.id}
                                    type="button"
                                    role="tab"
                                    id={`ctab-${q.id}`}
                                    aria-selected={q.id === active}
                                    aria-controls={`cpane-${q.id}`}
                                    className={`ctab${q.id === active ? " on" : ""}`}
                                    onClick={() => setActive(q.id)}
                                >
                                    <div className="ct-icon" aria-hidden="true">{q.icon}</div>
                                    <div className="ct-body">
                                        <div className="ct-size">{q.size}</div>
                                        <div className="ct-carrier">{q.carrier}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {current && <QuotationPane q={current} />}
        </div>
    );
}
