import { useState, type ReactNode } from "react";

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

// "Bảng giá" laid out as the source sheet (XKCN Hub v6.0) lays it out: three
// coloured section strips — MATSON, Sea thường, Air — each with its cards in
// the sheet's order and colours. Figures come from the CMS rate cards, so
// operations still edit them in the Rate Card Builder; the titles and card
// subtitles are the sheet's own copy.

function useTable(slug: string) {
    const { data, isLoading } = useCmsPricingTable(slug);
    const t = data?.table;
    const live = !!t && t.status === "live";
    const raw = live ? t.data : null;
    return {
        loading: isLoading,
        rows: Array.isArray(raw) ? (raw as Row[]) : [],
        meta: raw && !Array.isArray(raw) && typeof raw === "object" ? (raw as Record<string, string>) : {},
    };
}

const STRIP = {
    matson: "bg-gradient-to-br from-navy to-[#1a3264]",
    sea: "bg-gradient-to-br from-[#1a3a6e] to-[#2251a0]",
    air: "bg-gradient-to-br from-[#4c1d95] to-[#7c3aed]",
} as const;

function Strip({ tone, label, note }: Readonly<{ tone: keyof typeof STRIP; label: string; note?: string }>) {
    return (
        <div className="mb-3.5 mt-7 flex items-center gap-3 first:mt-0">
            <span className={`inline-flex items-center gap-2 whitespace-nowrap rounded-[9px] px-[18px] py-2 text-[13.5px] font-extrabold tracking-[.2px] text-white shadow-[0_2px_8px_rgba(0,0,0,.2)] ${STRIP[tone]}`}>
                {label}
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-[#DDD8CE] to-transparent" aria-hidden="true" />
            {note && <span className="hidden whitespace-nowrap text-[11.5px] text-muted-foreground sm:inline">{note}</span>}
        </div>
    );
}

const CHIP = {
    SEA: "bg-[#eef3fb] text-[#1b5fa8]",
    LCL: "bg-[#e8f4ea] text-[#1A8754]",
    FCL: "bg-[#e8eefa] text-[#1b5fa8]",
    AIR: "bg-[#f3eefb] text-[#6a3fa0]",
    MATSON: "bg-[rgba(201,168,76,.13)] text-[#8a6020]",
} as const;

function Card({ title, chips = [], sub, children }: Readonly<{
    title: string; chips?: (keyof typeof CHIP)[]; sub?: string; children: ReactNode;
}>) {
    return (
        <section className="mb-3 rounded-[10px] border border-[#DDD8CE] bg-white px-5 py-4 shadow-[0_1px_4px_rgba(12,30,62,.04)]">
            <h3 className="mb-[3px] flex flex-wrap items-center gap-[7px] text-[14px] font-bold text-navy">
                {title}
                {chips.map((c) => (
                    <span key={c} className={`rounded-[5px] px-2 py-0.5 text-[10px] font-bold ${CHIP[c]}`}>{c}</span>
                ))}
            </h3>
            {sub && <p className="mb-3 text-[11.5px] leading-normal text-muted-foreground">{sub}</p>}
            {children}
        </section>
    );
}

function Label({ children, className = "mb-2" }: Readonly<{ children: ReactNode; className?: string }>) {
    return <p className={`text-[12px] font-bold text-navy ${className}`}>{children}</p>;
}

type Align = "l" | "r" | "c";
const ALIGN: Record<Align, string> = { l: "text-left", r: "text-right", c: "text-center" };

function Table({ head, rows }: Readonly<{
    head: readonly [string, Align][];
    /** One entry per row: `hl` gives it the sheet's highlighted band. */
    rows: readonly { hl?: boolean; cells: readonly ReactNode[] }[];
}>) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13px]">
                <thead>
                    <tr>
                        {head.map(([label, align], i) => (
                            <th
                                key={label}
                                className={`whitespace-nowrap bg-navy px-3 py-[9px] text-[11px] font-bold tracking-[.2px] text-white ${ALIGN[align]} ${i === 0 ? "rounded-l-md" : ""} ${i === head.length - 1 ? "rounded-r-md" : ""}`}
                            >
                                {label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, i) => (
                        <tr key={i} className={r.hl ? "bg-[#fdf8ec] font-bold" : i % 2 === 1 ? "bg-[#f9f8f5]" : ""}>
                            {r.cells.map((c, j) => (
                                <td
                                    key={j}
                                    className={`border-b border-[#e8e4dc] px-3 py-[9px] align-middle text-[13.5px] text-foreground ${ALIGN[head[j]?.[1] ?? "l"]} ${i === rows.length - 1 ? "border-b-0" : ""}`}
                                >
                                    {c}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const Price = ({ v }: Readonly<{ v: Cell }>) => (
    <span className="font-mono text-[15px] font-extrabold text-[#0d6e3f]">{money(v)}</span>
);
const PriceS = ({ v }: Readonly<{ v: Cell }>) => (
    <span className="font-mono text-[13.5px] font-bold text-[#0d6e3f]">{money(v)}</span>
);

function Named({ text, strong = true }: Readonly<{ text: string; strong?: boolean }>) {
    const { main, tail } = splitTail(text);
    return (
        <>
            <span className={strong ? "font-semibold text-navy" : ""}>{main}</span>
            {tail && <span className="ml-1 text-[11.5px] font-normal text-muted-foreground">{tail}</span>}
        </>
    );
}

function SNote({ children }: Readonly<{ children: ReactNode }>) {
    return <p className="mt-2.5 border-t border-[#eef1f7] pt-2.5 text-[11.5px] leading-relaxed text-muted-foreground">{children}</p>;
}

const CALLOUT = {
    amber: "bg-[#fffbeb] border-[#fde68a] text-[#92400e]",
    blue: "bg-[#eff6ff] border-[#bfdbfe] text-[#1E5BC6]",
} as const;

function Callout({ tone, children }: Readonly<{ tone: keyof typeof CALLOUT; children: ReactNode }>) {
    return <p className={`mt-[11px] rounded-lg border px-[13px] py-[9px] text-[12.5px] leading-relaxed ${CALLOUT[tone]}`}>{children}</p>;
}

function Pending() {
    const { t } = useI18n();
    return <p className="py-4 text-center text-sm italic text-muted-foreground">{t("chinhngach.table_pending")}</p>;
}

/** The sheet's MATSON service toggle names CLX as the faster sailing. */
const serviceLabel = (svc: string) => (svc === "CLX" ? "CLX Service (nhanh hơn)" : `${svc} Service`);

const LANE = {
    xanh: { box: "bg-[#E3F4EA] border-[#A9D8BC]", fg: "text-[#1A8754]", icon: "🟢" },
    vang: { box: "bg-[#fffbeb] border-[#fde68a]", fg: "text-[#92400e]", icon: "🟡" },
    do: { box: "bg-[#fff1f2] border-[#fda4af]", fg: "text-[#be123c]", icon: "🔴" },
} as const;
const laneTone = (name: string): keyof typeof LANE => (/đỏ/i.test(name) ? "do" : /vàng/i.test(name) ? "vang" : "xanh");

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
    const inland = parseTransit(meta.matson_transit_inland);
    const total = parseTransit(meta.matson_transit_total);
    const etd = meta.matson_etd ?? "";
    const etdShort = etd.split(/\s+·\s+/)[0] ?? "";
    const transitCards = [
        port && { ...port, sub: etd || port.sub },
        inland,
        total,
    ].filter(Boolean) as NonNullable<typeof port>[];
    const cutoffs = parseCutoffs(meta.matson_cutoff);
    const hp = parseCfs(meta.cfs_haiphong);
    const hcm = parseCfs(meta.cfs_hochiminh);
    const seaBar = parseCutoffBar(meta.sea_thuong_cutoff);
    const airFees = parseAirSurcharges(meta.excl_air);

    return (
        <div>
            {/* ══════════ MATSON ══════════ */}
            <Strip tone="matson" label="🚢 MATSON — Line Hỏa Tốc" note={[port && `${port.value} ${port.unit}`.trim(), etdShort].filter(Boolean).join(" · ")} />

            <div className="relative mb-3 overflow-hidden rounded-[14px] bg-gradient-to-br from-[#091729] via-[#132848] to-[#1b3860] px-6 py-5">
                <span className="pointer-events-none absolute -right-[60px] -top-[60px] h-[220px] w-[220px] rounded-full bg-[rgba(201,168,76,.07)]" aria-hidden="true" />
                <div className="relative z-[1] mb-3.5 flex flex-wrap items-center gap-2.5">
                    <span className="rounded-md bg-gradient-to-br from-primary to-[#9a7020] px-3 py-[3px] text-[11.5px] font-extrabold text-navy">
                        MATSON {services.length ? services.join(" / ") : "CLX / MAX"}
                    </span>
                    <span className="text-[12px] text-[#7a9fc8]">Expedited Ocean Service · VN → Long Beach, CA · Chính ngạch</span>
                </div>
                {transitCards.length > 0 && (
                    <>
                        <p className="relative z-[1] mb-[9px] text-[9.5px] font-bold uppercase tracking-[1.2px] text-white/50">⏱ Thời gian vận chuyển dự kiến</p>
                        <div className="relative z-[1] mb-3.5 grid grid-cols-2 gap-2.5 md:grid-cols-3">
                            {transitCards.map((c) => (
                                <div key={c.label} className="rounded-[10px] border border-[rgba(180,200,230,.15)] bg-white/[.06] px-3.5 py-3">
                                    <p className="mb-1 text-[10.5px] font-bold text-[#E8C97A]">{c.label}</p>
                                    <p className="text-[24px] font-extrabold leading-none text-[#FFD666]">
                                        {c.value}
                                        {c.unit && <small className="ml-0.5 text-[11px] font-semibold text-[#E8C97A]">{c.unit}</small>}
                                    </p>
                                    {c.sub && <p className="mt-1 text-[10.5px] leading-snug text-primary">{c.sub}</p>}
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {cutoffs.length > 0 && (
                    <>
                        <p className="relative z-[1] mb-2 text-[9.5px] font-bold uppercase tracking-[1.2px] text-white/50">📅 Cut-off hàng tuần (Matson)</p>
                        <div className="relative z-[1] flex flex-wrap gap-[7px]">
                            {cutoffs.map((c) => (
                                <span key={c.when + c.what} className="rounded-[7px] border border-white/[.12] bg-white/[.07] px-[11px] py-[5px] text-[11px] text-[#8aaac8]">
                                    {c.when && <strong className="font-bold text-white">{c.when}</strong>}
                                    {c.when ? " — " : ""}
                                    {c.what}
                                </span>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {(hp || hcm || meta.cfs_us) && (
                <Card title="📍 Địa chỉ kho CFS" chips={["MATSON"]} sub="Địa điểm giao nhận hàng tại Việt Nam và điểm đến tại Mỹ">
                    <div className="mb-3 grid gap-2.5 sm:grid-cols-2">
                        {[["Hải Phòng (North VN)", hp], ["Hồ Chí Minh (South VN)", hcm]].map(([place, c]) =>
                            c && typeof c === "object" ? (
                                <div key={place as string} className="rounded-[9px] border border-[#cdd8f0] bg-[#f4f7ff] px-3.5 py-3">
                                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[.8px] text-[#1E5BC6]">{place as string}</p>
                                    <p className="mb-0.5 text-[13px] font-semibold text-navy">{c.name}</p>
                                    {c.code && <span className="mb-1 inline-block rounded bg-[#1B2A4A] px-[7px] py-px font-mono text-[10px] font-bold text-primary">{c.code}</span>}
                                    {c.address && <p className="text-[11.5px] leading-normal text-muted-foreground">{c.address}</p>}
                                </div>
                            ) : null,
                        )}
                    </div>
                    {meta.cfs_us && (
                        <Callout tone="blue">📦 <strong>Kho đích tại Mỹ:</strong> {meta.cfs_us}</Callout>
                    )}
                </Card>
            )}

            <Card
                title="Cước Sea LCL — Hàng lẻ"
                chips={["SEA", "LCL", "MATSON"]}
                sub="Tính theo CBM (hàng nhẹ) hoặc MT (hàng nặng >1 tấn/CBM) · Min 1 CBM · Đã bao gồm BAF"
            >
                {mLcl.rows.length ? (
                    <Table
                        head={[["Tuyến xuất phát", "l"], ["Light Cargo (/CBM)", "r"], ["Dense Cargo (/MT)", "r"], ["Cảng đến", "c"], ["Transit", "r"]]}
                        rows={mLcl.rows.map((r, i) => ({
                            hl: i === 0,
                            cells: [<Named key="o" text={String(r.origin ?? "")} />, <Price key="l" v={r.light_cbm} />, <PriceS key="d" v={r.dense_mt} />, r.destination, r.transit],
                        }))}
                    />
                ) : <Pending />}
                {mSur.rows.length > 0 && (
                    <>
                        <Label className="mb-2 mt-3.5">Phụ phí tại cảng (Accessorial Charges)</Label>
                        <Table
                            head={[["Loại phí", "l"], ["Đơn giá", "r"], ["Đơn vị", "l"]]}
                            rows={mSur.rows.map((r) => ({
                                cells: [
                                    <Named key="f" text={String(r.fee ?? "")} strong={false} />,
                                    <PriceS key="a" v={r.amount} />,
                                    [r.unit, r.min ? `Min ${r.min}` : ""].filter(Boolean).join(" · "),
                                ],
                            }))}
                        />
                    </>
                )}
                {meta.excl_matson_lcl && <SNote>⚠️ {exclusion(meta.excl_matson_lcl)}</SNote>}
            </Card>

            <Card
                title="Cước Sea FCL — Nguyên container"
                chips={["SEA", "FCL", "MATSON"]}
                sub="Ocean Freight · FAK/Garment · Áp dụng sau khi hoàn thành FMC commodity filing"
            >
                {services.length > 1 && (
                    <div role="tablist" aria-label="MATSON service" className="mb-3 flex gap-1.5">
                        {services.map((s) => (
                            <button
                                key={s}
                                type="button"
                                role="tab"
                                aria-selected={s === activeSvc}
                                onClick={() => setSvc(s)}
                                className={`rounded-[7px] border px-[13px] py-[5px] text-[12px] font-semibold transition-colors ${
                                    s === activeSvc ? "border-[#1B2A4A] bg-[#1B2A4A] text-white" : "border-[#DDD8CE] bg-white text-muted-foreground"
                                }`}
                            >
                                {serviceLabel(s)}
                            </button>
                        ))}
                    </div>
                )}
                {activeSvc ? (
                    fcl.get(activeSvc)?.map((route, i) => (
                        <div key={route.origin}>
                            <Label className={i === 0 ? "mb-2" : "mb-2 mt-3.5"}>
                                📍 {route.origin}{route.transit ? ` · Transit ~${route.transit}` : ""}
                            </Label>
                            <Table
                                head={[["Breakdown", "l"], ["20GP", "r"], ["40GP", "r"], ["40HC", "r"], ["45HC", "r"]]}
                                rows={route.rows.map((r) => ({
                                    hl: r.total,
                                    cells: [
                                        r.total ? r.charge : <span key="c" className="text-[11.5px] text-muted-foreground">{r.charge}</span>,
                                        ...r.values.map((v, j) => (r.total ? <Price key={j} v={v} /> : money(v))),
                                    ],
                                }))}
                            />
                        </div>
                    ))
                ) : <Pending />}
                {meta.excl_matson_fcl && <Callout tone="amber">⚠️ {exclusion(meta.excl_matson_fcl)}</Callout>}
                {meta.validity && <SNote>{meta.validity}</SNote>}
            </Card>

            <hr className="my-6 border-0 border-t border-[#DDD8CE]" />

            {/* ══════════ SEA THƯỜNG ══════════ */}
            <Strip tone="sea" label="🌊 Line Sea Chính Ngạch Thường" note="18–40 ngày · 2–3 chuyến/tuần từ HCM" />

            {seaBar.length > 0 && (
                <div className="mb-3 flex flex-wrap items-center gap-2.5 rounded-[9px] bg-[#1B2A4A] px-4 py-[11px]">
                    <span className="mr-1 text-[9.5px] font-bold uppercase tracking-[1px] text-primary">Cut-off tàu</span>
                    {seaBar.map((c) => (
                        <span key={c.label + c.value} className="flex items-center gap-[5px] text-[11.5px] text-[#7a9ac0]">
                            <span className="h-[5px] w-[5px] flex-shrink-0 rounded-full bg-primary" aria-hidden="true" />
                            <span>
                                {c.label} <strong className="text-[#cddaee]">{c.value}</strong>
                            </span>
                        </span>
                    ))}
                </div>
            )}

            <Card title="Cước Sea LCL — Hàng lẻ" chips={["SEA", "LCL"]} sub="W/M: 1 WM = 1 CBM hoặc 1.000 kg, lấy giá trị lớn hơn · Min 1 WM · Từ HCM">
                {sLcl.rows.length ? (
                    <Table
                        head={[["Tuyến", "l"], ["Cước biển /WM", "r"], ["Transit", "r"]]}
                        rows={sLcl.rows.map((r, i) => ({
                            hl: i === 0,
                            cells: [<Named key="r" text={String(r.route ?? "")} />, <Price key="p" v={r.price_wm} />, r.transit],
                        }))}
                    />
                ) : <Pending />}
                {meta.excl_sea_lcl && <SNote>⚠️ {exclusion(meta.excl_sea_lcl)}</SNote>}
            </Card>

            <Card title="Cước Sea FCL — Nguyên container" chips={["SEA", "FCL"]} sub="Giá cước biển trọn container · Cut-off ETD − 2 ngày · Từ HCM">
                {sFcl.rows.length ? (
                    <Table
                        head={[["Tuyến", "l"], ["20GP", "r"], ["40HC", "r"], ["Transit", "r"]]}
                        rows={sFcl.rows.map((r, i) => ({
                            hl: i === 0,
                            cells: [<Named key="r" text={String(r.route ?? "")} />, <Price key="a" v={r.gp20} />, <Price key="b" v={r.hc40} />, r.transit],
                        }))}
                    />
                ) : <Pending />}
                {meta.excl_sea_fcl && <SNote>⚠️ {exclusion(meta.excl_sea_fcl)}</SNote>}
            </Card>

            <hr className="my-6 border-0 border-t border-[#DDD8CE]" />

            {/* ══════════ AIR ══════════ */}
            <Strip tone="air" label="✈️ Air Chính Ngạch" note="7–8 ngày port-to-port · Từ SGN · Cartons only" />

            <Card title="Cước Air chính ngạch" chips={["AIR"]} sub="Từ SGN (Tân Sơn Nhất) · Transit 7–8 ngày (port to port) + 3–4 ngày hải quan US">
                {air.rows.length ? (
                    groupBy(air.rows, "destination").map(([dest, rows], gi) => (
                        <div key={dest}>
                            <Label className={gi === 0 ? "mb-[9px] mt-1" : "mb-[9px] mt-4"}>✈ {airGroupLabel(dest)}</Label>
                            <Table
                                head={[["Hãng bay", "l"], ["500 kg", "r"], ["1.000 kg", "r"], ["Cut-off", "l"], ["Lộ trình", "l"]]}
                                rows={rows.map((r, i) => ({
                                    // The sheet stars and highlights the cheapest carrier per destination.
                                    hl: i === 0,
                                    cells: [
                                        i === 0 ? <span key="c" className="font-semibold text-navy">{r.carrier} ⭐</span> : r.carrier,
                                        i === 0 ? <Price key="a" v={r.price_500kg} /> : money(r.price_500kg),
                                        i === 0 ? <Price key="b" v={r.price_1000kg} /> : money(r.price_1000kg),
                                        r.cutoff,
                                        r.routing,
                                    ],
                                }))}
                            />
                        </div>
                    ))
                ) : <Pending />}

                {customs.rows.length > 0 && (
                    <>
                        <Label className="mb-1.5 mt-4">🛃 Phí khai báo hải quan xuất VN</Label>
                        <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
                            {customs.rows.map((r) => {
                                const tone = LANE[laneTone(String(r.lane ?? ""))];
                                return (
                                    <div key={String(r.lane)} className={`rounded-[9px] border px-3.5 py-[11px] ${tone.box}`}>
                                        <p className={`mb-[3px] text-[10px] font-bold uppercase tracking-[.8px] ${tone.fg}`}>{tone.icon} {r.lane}</p>
                                        <p className={`font-mono text-[20px] font-extrabold ${tone.fg}`}>{money(r.fee)}</p>
                                        {r.note && <p className="mt-0.5 text-[10.5px] text-muted-foreground">{r.note}</p>}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {airFees.chips.length > 0 && (
                    <>
                        <Label className="mb-2 mt-3.5">Phụ phí air (tính thêm ngoài giá/kg)</Label>
                        <div className="mt-[11px] flex flex-wrap gap-[7px]">
                            {airFees.chips.map((c) => (
                                <div key={c.label + c.value} className="rounded-[7px] border border-[#DDD8CE] bg-[#f9f8f5] px-3 py-1.5">
                                    <p className="mb-px text-[10px] text-muted-foreground">{c.label}</p>
                                    <p className="font-mono text-[13px] font-bold text-navy">{c.value}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {airFees.rest.length > 0 && <SNote>⚠️ Chưa bao gồm: {airFees.rest.join(", ")}.</SNote>}
            </Card>

            <div className="mt-7 text-center">
                <LeadFormDialog
                    sourcePage="/chinh-ngach-pricing#bang-gia"
                    trigger={
                        <button
                            type="button"
                            className="inline-block rounded-full bg-gradient-to-br from-primary to-[#9a7020] px-[34px] py-[13px] text-[14px] font-bold text-navy shadow-[0_4px_18px_rgba(201,168,76,.28)] transition-transform hover:-translate-y-0.5"
                        >
                            📋 Các mốc giá trên chỉ là giá tạm tính — Hãy gửi thông tin lô hàng để TH Group báo giá chính xác cho bạn
                        </button>
                    }
                />
            </div>
        </div>
    );
}
