import { useState, type CSSProperties, type ReactNode } from "react";

import { LeadFormDialog } from "@/components/lead/LeadFormDialog";
import {
    airGroupLabel,
    exclusion,
    groupBy,
    groupFcl,
    money,
    parseAirSurcharges,
    parseCfs,
    parseCutoffBar,
    parseCutoffs,
    parseTransit,
    splitTail,
    type Cell,
    type Row,
} from "@/components/pricing/chinhNgachRateSheet.parse";
import { useCmsPricingTable } from "@/hooks/useCmsContent";
import { useI18n } from "@/lib/i18n";

// "Bảng giá" (bgp-banggia) in the sheet's markup: the MATSON / Sea thường / Air
// strips with their cards, in the sheet's order. Figures come from the CMS rate
// cards, so operations still edit them in the Rate Card Builder; titles and
// card subtitles are the sheet's own copy. Inline styles below are the sheet's
// own inline styles, kept as they are so the layout matches it exactly.

function useTable(slug: string) {
    const { data } = useCmsPricingTable(slug);
    const t = data?.table;
    const raw = t && t.status === "live" ? t.data : null;
    return {
        rows: Array.isArray(raw) ? (raw as Row[]) : [],
        meta: raw && !Array.isArray(raw) && typeof raw === "object" ? (raw as Record<string, string>) : {},
    };
}

const HERO_KICKER: CSSProperties = {
    fontSize: "9.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px",
    color: "rgba(255,255,255,.5)", position: "relative", zIndex: 1,
};
const LABEL: CSSProperties = { fontSize: 12, fontWeight: 700, color: "var(--navy)" };
const label = (margin: string): CSSProperties => ({ ...LABEL, margin });

type Align = "" | "r" | "c";

function Table({ head, children }: Readonly<{ head: readonly [string, Align][]; children: ReactNode }>) {
    return (
        <div className="xkcn-scroll">
            <table>
                <thead>
                    <tr>{head.map(([h, a]) => <th key={h} className={a || undefined}>{h}</th>)}</tr>
                </thead>
                <tbody>{children}</tbody>
            </table>
        </div>
    );
}

const Price = ({ v }: Readonly<{ v: Cell }>) => <span className="price">{money(v)}</span>;
const PriceS = ({ v }: Readonly<{ v: Cell }>) => <span className="price-s">{money(v)}</span>;

/** "Đà Nẵng (DAD) — via HCM hoặc HPH" puts the via line under the name; a
 *  parenthesised tail — "(Bờ Tây)" — stays on the line, as in the sheet. */
function Named({ text, strong = true }: Readonly<{ text: string; strong?: boolean }>) {
    const { main, tail } = splitTail(text);
    const name = strong ? <span className="hl-txt">{main}</span> : main;
    if (!tail) return name;
    return /^via /i.test(tail) ? <>{name}<br /><span className="dim">{tail}</span></> : <>{name} <span className="dim">{tail}</span></>;
}

function Pending() {
    const { t } = useI18n();
    return <p className="xkcn-pending">{t("chinhngach.table_pending")}</p>;
}

/** The sheet's MATSON service toggle names CLX as the faster sailing. */
const serviceLabel = (svc: string) => (svc === "CLX" ? "CLX Service (nhanh hơn)" : `${svc} Service`);

const LANE = { xanh: "🟢", vang: "🟡", do: "🔴" } as const;
const laneTone = (name: string): keyof typeof LANE => (/đỏ/i.test(name) ? "do" : /vàng/i.test(name) ? "vang" : "xanh");

/** "Thứ 2 12:00" bolded, then " — what". */
function Cutoff({ when, what }: Readonly<{ when: string; what: string }>) {
    return <div className="cop">{when && <strong>{when}</strong>}{when ? " — " : ""}{what}</div>;
}

/** "a, b, c" → "a, b và c": the sheet's air note reads as a sentence. */
const sentence = (items: readonly string[]) =>
    items.length > 1 ? `${items.slice(0, -1).join(", ")} và ${items[items.length - 1]}` : items.join("");

export function ChinhNgachRateSheet() {
    const meta = useTable("chinhNgachMeta").meta;
    const mLcl = useTable("chinhNgachMatsonLcl");
    const mSur = useTable("chinhNgachMatsonSurcharge");
    const mFcl = useTable("chinhNgachMatsonFcl");
    const sLcl = useTable("chinhNgachSeaLcl");
    const sFcl = useTable("chinhNgachSeaFcl");
    const air = useTable("chinhNgachAir");
    const customs = useTable("chinhNgachCustoms");

    const fcl = groupFcl(mFcl.rows, ["d20", "d40", "d40h", "d45h"]);
    const services = [...fcl.keys()];
    const [svc, setSvc] = useState<string | null>(null);
    const activeSvc = svc && fcl.has(svc) ? svc : services[0];

    const port = parseTransit(meta.matson_transit_port);
    const transitCards = [
        port && { ...port, sub: meta.matson_etd || port.sub },
        parseTransit(meta.matson_transit_inland),
        parseTransit(meta.matson_transit_total),
    ].filter(Boolean) as NonNullable<typeof port>[];
    const cutoffs = parseCutoffs(meta.matson_cutoff);
    const cfs = [
        ["Hải Phòng (North VN)", parseCfs(meta.cfs_haiphong)],
        ["Hồ Chí Minh (South VN)", parseCfs(meta.cfs_hochiminh)],
    ] as const;
    const seaBar = parseCutoffBar(meta.sea_thuong_cutoff);
    const airFees = parseAirSurcharges(meta.excl_air);

    return (
        <>
            {/* ══ MATSON ══ */}
            <div className="pstrip">
                <div className="pstrip-badge matson">🚢 MATSON — Line Hỏa Tốc</div>
                <div className="pstrip-line" />
                <div className="pstrip-note">17–18 ngày · ETD Thứ 5 hàng tuần</div>
            </div>

            <div className="m-hero">
                <div className="m-hero-top">
                    <span className="m-badge">MATSON {services.length ? services.join(" / ") : "CLX / MAX"}</span>
                    <span className="m-desc">Expedited Ocean Service · VN → Long Beach, CA · Chính ngạch</span>
                </div>
                {transitCards.length > 0 && (
                    <>
                        <div style={{ ...HERO_KICKER, marginBottom: 9 }}>⏱ Thời gian vận chuyển dự kiến</div>
                        <div className="time-row">
                            {transitCards.map((c) => (
                                <div className="tc" key={c.label + c.value}>
                                    <div className="tl">{c.label}</div>
                                    <div className="tn">{c.value}{c.unit && <> <small>{c.unit}</small></>}</div>
                                    {c.sub && <div className="td">{c.sub}</div>}
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {cutoffs.length > 0 && (
                    <>
                        <div style={{ ...HERO_KICKER, marginBottom: 8 }}>📅 Cut-off hàng tuần (Matson)</div>
                        <div className="co-pills">{cutoffs.map((c) => <Cutoff key={c.when + c.what} {...c} />)}</div>
                    </>
                )}
            </div>

            {(cfs.some(([, c]) => c) || meta.cfs_us) && (
                <div className="card">
                    <div className="card-title">📍 Địa chỉ kho CFS <span className="chip ms">MATSON</span></div>
                    <div className="card-sub">Địa điểm giao nhận hàng tại Việt Nam và điểm đến tại Mỹ</div>
                    <div className="cfs-row">
                        {cfs.map(([place, c]) =>
                            c ? (
                                <div className="cfs" key={place}>
                                    <div className="cp">{place}</div>
                                    <div className="cw">{c.name}</div>
                                    {c.code && <span className="cc">{c.code}</span>}
                                    {c.address && <div className="ca">{c.address}</div>}
                                </div>
                            ) : null,
                        )}
                    </div>
                    {meta.cfs_us && <div className="co blue">📦 <strong>Kho đích tại Mỹ:</strong> {meta.cfs_us}</div>}
                </div>
            )}

            <div className="card">
                <div className="card-title">Cước Sea LCL — Hàng lẻ <span className="chip sea">SEA</span><span className="chip lcl">LCL</span><span className="chip ms">MATSON</span></div>
                <div className="card-sub">Tính theo CBM (hàng nhẹ) hoặc MT (hàng nặng &gt;1 tấn/CBM) · Min 1 CBM · Đã bao gồm BAF</div>
                {mLcl.rows.length ? (
                    <Table head={[["Tuyến xuất phát", ""], ["Light Cargo (/CBM)", "r"], ["Dense Cargo (/MT)", "r"], ["Cảng đến", "c"], ["Transit", "r"]]}>
                        {mLcl.rows.map((r, i) => (
                            <tr key={i} className={i === 0 ? "hl" : undefined}>
                                <td><Named text={String(r.origin ?? "")} /></td>
                                <td className="r"><Price v={r.light_cbm} /></td>
                                <td className="r"><PriceS v={r.dense_mt} /></td>
                                <td className="c">{r.destination}</td>
                                <td className="r">{r.transit}</td>
                            </tr>
                        ))}
                    </Table>
                ) : <Pending />}
                {mSur.rows.length > 0 && (
                    <>
                        <div style={{ marginTop: 14, ...LABEL, marginBottom: 8 }}>Phụ phí tại cảng (Accessorial Charges)</div>
                        <Table head={[["Loại phí", ""], ["Đơn giá", "r"], ["Đơn vị", ""]]}>
                            {mSur.rows.map((r, i) => (
                                <tr key={i}>
                                    <td><Named text={String(r.fee ?? "")} strong={false} /></td>
                                    <td className="r"><PriceS v={r.amount} /></td>
                                    <td>{[r.unit, r.min ? `Min ${r.min}` : ""].filter(Boolean).join(" · ")}</td>
                                </tr>
                            ))}
                        </Table>
                    </>
                )}
                {meta.excl_matson_lcl && <div className="snote">⚠️ {exclusion(meta.excl_matson_lcl)}</div>}
            </div>

            <div className="card">
                <div className="card-title">Cước Sea FCL — Nguyên container <span className="chip sea">SEA</span><span className="chip fcl">FCL</span><span className="chip ms">MATSON</span></div>
                <div className="card-sub">Ocean Freight · FAK/Garment · Áp dụng sau khi hoàn thành FMC commodity filing</div>
                {services.length > 1 && (
                    <div className="tab-row" role="tablist" aria-label="MATSON service">
                        {services.map((s) => (
                            <button
                                key={s}
                                type="button"
                                role="tab"
                                aria-selected={s === activeSvc}
                                className={`ttab${s === activeSvc ? " on" : ""}`}
                                onClick={() => setSvc(s)}
                            >
                                {serviceLabel(s)}
                            </button>
                        ))}
                    </div>
                )}
                {activeSvc ? (
                    <div className="fp on">
                        {fcl.get(activeSvc)?.map((route, i) => (
                            <div key={route.origin}>
                                <div style={i === 0 ? { ...LABEL, marginBottom: 8 } : { marginTop: 14, ...LABEL, marginBottom: 8 }}>
                                    📍 {route.origin}{route.transit ? ` · Transit ~${route.transit}` : ""}
                                </div>
                                <Table head={[["Breakdown", ""], ["20GP", "r"], ["40GP", "r"], ["40HC", "r"], ["45HC", "r"]]}>
                                    {route.rows.map((r) =>
                                        r.total ? (
                                            <tr key={r.charge} className="hl" style={{ borderTop: "2px solid var(--bd)" }}>
                                                <td><strong>{r.charge}</strong></td>
                                                {r.values.map((v, j) => <td key={j} className="r"><Price v={v} /></td>)}
                                            </tr>
                                        ) : (
                                            <tr key={r.charge}>
                                                <td className="dim">{r.charge}</td>
                                                {r.values.map((v, j) => <td key={j} className="r">{money(v)}</td>)}
                                            </tr>
                                        ),
                                    )}
                                </Table>
                            </div>
                        ))}
                    </div>
                ) : <Pending />}
                {meta.excl_matson_fcl && <div className="co amber" style={{ marginTop: 12 }}>⚠️ {exclusion(meta.excl_matson_fcl)}</div>}
                {meta.validity && <div className="snote">{meta.validity}</div>}
            </div>

            <div className="divider" />

            {/* ══ SEA THƯỜNG ══ */}
            <div className="pstrip">
                <div className="pstrip-badge sea">🌊 Line Sea Chính Ngạch Thường</div>
                <div className="pstrip-line" />
                <div className="pstrip-note">18–40 ngày · 2–3 chuyến/tuần từ HCM</div>
            </div>
            {seaBar.length > 0 && (
                <div className="co-bar">
                    <span className="co-lbl">Cut-off tàu</span>
                    {seaBar.map((c) => (
                        <div className="co-item" key={c.label + c.value}>
                            <div className="co-dot" />
                            <span>{c.label} <strong>{c.value}</strong></span>
                        </div>
                    ))}
                </div>
            )}
            <div className="card">
                <div className="card-title">Cước Sea LCL — Hàng lẻ <span className="chip sea">SEA</span><span className="chip lcl">LCL</span></div>
                <div className="card-sub">W/M: 1 WM = 1 CBM hoặc 1.000 kg, lấy giá trị lớn hơn · Min 1 WM · Từ HCM</div>
                {sLcl.rows.length ? (
                    <Table head={[["Tuyến", ""], ["Cước biển /WM", "r"], ["Transit", "r"]]}>
                        {sLcl.rows.map((r, i) => (
                            <tr key={i} className={i === 0 ? "hl" : undefined}>
                                <td><Named text={String(r.route ?? "")} /></td>
                                <td className="r"><Price v={r.price_wm} /></td>
                                <td className="r">{r.transit}</td>
                            </tr>
                        ))}
                    </Table>
                ) : <Pending />}
                {meta.excl_sea_lcl && <div className="snote">⚠️ {exclusion(meta.excl_sea_lcl)}</div>}
            </div>
            <div className="card">
                <div className="card-title">Cước Sea FCL — Nguyên container <span className="chip sea">SEA</span><span className="chip fcl">FCL</span></div>
                <div className="card-sub">Giá cước biển trọn container · Cut-off ETD − 2 ngày · Từ HCM</div>
                {sFcl.rows.length ? (
                    <Table head={[["Tuyến", ""], ["20GP", "r"], ["40HC", "r"], ["Transit", "r"]]}>
                        {sFcl.rows.map((r, i) => (
                            <tr key={i} className={i === 0 ? "hl" : undefined}>
                                <td><Named text={String(r.route ?? "")} /></td>
                                <td className="r"><Price v={r.gp20} /></td>
                                <td className="r"><Price v={r.hc40} /></td>
                                <td className="r">{r.transit}</td>
                            </tr>
                        ))}
                    </Table>
                ) : <Pending />}
                {meta.excl_sea_fcl && <div className="snote">⚠️ {exclusion(meta.excl_sea_fcl)}</div>}
            </div>

            <div className="divider" />

            {/* ══ AIR ══ */}
            <div className="pstrip">
                <div className="pstrip-badge air">✈️ Air Chính Ngạch</div>
                <div className="pstrip-line" />
                <div className="pstrip-note">7–8 ngày port-to-port · Từ SGN · Cartons only</div>
            </div>
            <div className="card">
                <div className="card-title">Cước Air chính ngạch <span className="chip air">AIR</span></div>
                <div className="card-sub">Từ SGN (Tân Sơn Nhất) · Transit 7–8 ngày (port to port) + 3–4 ngày hải quan US</div>
                {air.rows.length ? (
                    groupBy(air.rows, "destination").map(([dest, rows], gi) => (
                        <div key={dest}>
                            <div style={label(gi === 0 ? "4px 0 9px" : "16px 0 9px")}>✈ {airGroupLabel(dest)}</div>
                            <Table head={[["Hãng bay", ""], ["500 kg", "r"], ["1.000 kg", "r"], ["Cut-off", ""], ["Lộ trình", ""]]}>
                                {rows.map((r, i) =>
                                    // The sheet stars and highlights the cheapest carrier per destination.
                                    i === 0 ? (
                                        <tr key={i} className="hl">
                                            <td><span className="hl-txt">{r.carrier} ⭐</span></td>
                                            <td className="r"><Price v={r.price_500kg} /></td>
                                            <td className="r"><Price v={r.price_1000kg} /></td>
                                            <td>{r.cutoff}</td>
                                            <td>{String(r.routing ?? "").replace(/\s*→\s*/g, "→")}</td>
                                        </tr>
                                    ) : (
                                        <tr key={i}>
                                            <td>{r.carrier}</td>
                                            <td className="r">{money(r.price_500kg)}</td>
                                            <td className="r">{money(r.price_1000kg)}</td>
                                            <td>{r.cutoff}</td>
                                            <td>{String(r.routing ?? "").replace(/\s*→\s*/g, "→")}</td>
                                        </tr>
                                    ),
                                )}
                            </Table>
                        </div>
                    ))
                ) : <Pending />}

                {customs.rows.length > 0 && (
                    <>
                        <div style={label("16px 0 6px")}>🛃 Phí khai báo hải quan xuất VN</div>
                        <div className="luong-row">
                            {customs.rows.map((r) => {
                                const tone = laneTone(String(r.lane ?? ""));
                                return (
                                    <div className={`lcard ${tone}`} key={String(r.lane)}>
                                        <div className="ln">{LANE[tone]} {r.lane}</div>
                                        <div className="lp">{money(r.fee)}</div>
                                        {r.note && <div className="lsub">{r.note}</div>}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {airFees.chips.length > 0 && (
                    <>
                        <div style={label("14px 0 8px")}>Phụ phí air (tính thêm ngoài giá/kg)</div>
                        <div className="srow">
                            {airFees.chips.map((c) => (
                                <div className="schip" key={c.label + c.value}>
                                    <div className="sl">{c.label}</div>
                                    <div className="sv">{c.value}</div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {airFees.rest.length > 0 && <div className="snote">⚠️ Chưa bao gồm: {sentence(airFees.rest)}.</div>}
            </div>

            <div className="cta">
                <LeadFormDialog
                    sourcePage="/chinh-ngach-pricing#bang-gia"
                    trigger={
                        <button type="button" className="cta-link">
                            📋 Các mốc giá trên chỉ là giá tạm tính — Hãy gửi thông tin lô hàng để TH Group báo giá chính xác cho bạn
                        </button>
                    }
                />
            </div>
        </>
    );
}
