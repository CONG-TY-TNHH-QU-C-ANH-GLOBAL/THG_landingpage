import { useState } from "react";

import { LeadFormDialog } from "@/components/lead/LeadFormDialog";
import { LANES, QUOTATIONS, type CostRow, type Quotation } from "@/data/chinhNgachQuotation";

/** The sheet prints three statuses in the amount column instead of a number,
 *  each with its own colour, because they mean different things: a charge that
 *  only sometimes applies, one billed at cost, and one nobody can price yet. */
const TAG: Record<string, string> = {
    ifapp: "bg-[#f0fdf4] text-[#166534] border-[#86efac]",
    atcost: "bg-[#fff3cd] text-[#7a5800] border-[#f0d080]",
    tbc: "bg-[#ede9fe] text-[#5b21b6] border-[#c4b5fd]",
};

function Row({ row, index }: Readonly<{ row: CostRow; index: number }>) {
    if (row.kind === "head") {
        return (
            <tr>
                {row.cells.map((c, i) => (
                    <th
                        key={i}
                        colSpan={c.span}
                        className={`bg-navy px-3 py-2.5 text-[10.5px] font-bold tracking-wide text-white ${c.cr ? "text-right" : "text-left"} ${i === 0 ? "rounded-l-[7px]" : ""} ${i === row.cells.length - 1 ? "rounded-r-[7px]" : ""}`}
                    >
                        {c.txt}
                    </th>
                ))}
            </tr>
        );
    }

    if (row.kind === "group") {
        return (
            <tr>
                <td colSpan={99} className="bg-navy px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-primary">
                    {row.cells[0]?.txt}
                </td>
            </tr>
        );
    }

    if (row.kind === "sub") {
        return (
            <tr>
                {row.cells.map((c, i) => (
                    <td
                        key={i}
                        colSpan={c.span}
                        className={`bg-[#eef3fb] px-3 py-2 text-[12px] font-bold text-[#1E5BC6] ${c.cr ? "text-right" : "text-left"}`}
                    >
                        {c.txt}
                    </td>
                ))}
            </tr>
        );
    }

    return (
        <tr className={index % 2 === 1 ? "bg-[#f7fafd]" : ""}>
            {row.cells.map((c, i) => (
                <td
                    key={i}
                    colSpan={c.span}
                    className={`border-b border-[#eef1f7] px-3 py-[8.5px] align-middle ${c.cr ? "text-right" : "text-left"} ${c.mono ? "font-mono font-semibold" : ""} ${c.dim ? "text-[11.5px] text-muted-foreground" : "text-foreground"}`}
                >
                    {c.tag ? (
                        <span className={`inline-flex whitespace-nowrap rounded border px-2 py-px font-mono text-[10.5px] font-bold ${TAG[c.tag]}`}>
                            {c.txt}
                        </span>
                    ) : (
                        c.txt
                    )}
                </td>
            ))}
        </tr>
    );
}

function QuotationPane({ q }: Readonly<{ q: Quotation }>) {
    let itemIndex = -1;
    return (
        <div>
            {/* Hero: the shipment this quotation is for. Gradient navy, as in the sheet —
                it separates "what was priced" from "what it cost". */}
            <div className="mb-5 overflow-hidden rounded-[14px] bg-gradient-to-br from-[#091729] via-[#132848] to-[#1a3860] px-5 py-5 sm:px-7">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5">
                    <span className="rounded-md bg-gradient-to-br from-primary to-[#9a7020] px-3.5 py-1 text-[12px] font-extrabold tracking-wide text-navy">
                        {q.badge}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#5a7fa8]">{q.kicker}</span>
                </div>
                <dl className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                    {q.facts.map((f) => (
                        <div key={f.k} className="rounded-[9px] border border-[rgba(180,200,230,.14)] bg-white/[.06] px-3 py-2.5">
                            <dt className="mb-0.5 text-[9.5px] font-bold uppercase tracking-wider text-[#5a7fa8]">{f.k}</dt>
                            <dd className="text-[13.5px] font-bold text-[#d8e8f8]">{f.v}</dd>
                        </div>
                    ))}
                </dl>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[13px]">
                    <thead>
                        {q.rows.filter((r) => r.kind === "head").map((row, i) => (
                            <Row key={`h${i}`} row={row} index={-1} />
                        ))}
                    </thead>
                    <tbody>
                        {q.rows.filter((r) => r.kind !== "head").map((row, i) => {
                            if (row.kind === "item") itemIndex += 1;
                            else if (row.kind === "group") itemIndex = -1;
                            return <Row key={i} row={row} index={itemIndex} />;
                        })}
                    </tbody>
                </table>
            </div>

            {q.total && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gradient-to-br from-[#091729] to-[#0f2540] px-5 py-5 sm:px-7">
                    <div>
                        <p className="mb-1 text-[12px] font-bold uppercase tracking-widest text-[#8aa8d0]">{q.total.label}</p>
                        <p className="text-[17px] font-extrabold text-white">{q.total.name}</p>
                        {q.total.lines.map((line) => (
                            <p key={line} className="mt-1 text-[12px] text-[#4a6a90]">{line}</p>
                        ))}
                    </div>
                    <div className="text-right">
                        {q.total.excl && <p className="mb-1 text-[11px] text-[#5a7fa8]">{q.total.excl}</p>}
                        <p className="font-mono text-[26px] font-extrabold leading-none text-white">
                            {q.total.amount}
                            <span className="ml-1.5 text-[14px] text-[#E8C97A]">{q.total.unit}</span>
                        </p>
                        {q.total.suffix && <p className="mt-1 text-[11px] text-[#5a7fa8]">{q.total.suffix}</p>}
                    </div>
                </div>
            )}

            {q.discl.length > 0 && (
                <div className="mt-4 rounded-[9px] border border-[#DDD8CE] bg-[#f7fafd] px-[18px] py-3.5">
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{q.disclTitle}</p>
                    <ul className="flex flex-col gap-1.5">
                        {q.discl.map((d) => (
                            <li key={d} className="relative pl-4 text-[12px] leading-relaxed text-muted-foreground">
                                <span className="absolute left-0.5 text-primary" aria-hidden="true">•</span>
                                {d}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* The sheet closes every quotation with this. Wired to the real lead form,
                prefilled with the scenario, so "confirm this quote" is not a dead link. */}
            <div className="mt-6 text-center">
                <LeadFormDialog
                    sourcePage={`/chinh-ngach-pricing#du-toan-${q.id}`}
                    defaultMessage={`Xác nhận báo giá: ${q.badge}`}
                    trigger={
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-primary to-[#9a7020] px-7 py-3 text-[14px] font-bold text-navy shadow-md transition-transform hover:-translate-y-0.5"
                        >
                            📞 Xác nhận báo giá chính thức với TH Group
                        </button>
                    }
                />
            </div>
        </div>
    );
}

export function ChinhNgachQuotations() {
    const [active, setActive] = useState(QUOTATIONS[0]?.id ?? "40");
    const current = QUOTATIONS.find((q) => q.id === active) ?? QUOTATIONS[0];

    return (
        <div>
            {/* Lane switcher. Vietnam lanes and the China lane keep the sheet's blue
                and red headers — origin is the first thing that changes the numbers. */}
            <div className="mb-5 grid gap-2 lg:grid-cols-[3fr_1fr]">
                {LANES.map((lane) => {
                    const tabs = QUOTATIONS.filter((q) => q.lane === lane.kind);
                    if (tabs.length === 0) return null;
                    return (
                        <div key={lane.kind} className="overflow-hidden rounded-[10px]">
                            <p
                                className={`px-3.5 py-1.5 text-[9.5px] font-extrabold uppercase tracking-widest ${
                                    lane.kind === "cn" ? "bg-[#8b2a2a] text-[#f8c8c8]" : "bg-[#2a4a8a] text-[#c8ddf8]"
                                }`}
                            >
                                {lane.head}
                            </p>
                            <div
                                role="tablist"
                                aria-label={lane.head}
                                className={`flex gap-1 p-1.5 ${lane.kind === "cn" ? "bg-[#3d2020]" : "bg-[#2a3f66]"}`}
                            >
                                {tabs.map((q) => {
                                    const on = q.id === active;
                                    return (
                                        <button
                                            key={q.id}
                                            type="button"
                                            role="tab"
                                            aria-selected={on}
                                            onClick={() => setActive(q.id)}
                                            className={`flex flex-1 items-center gap-1.5 rounded-md px-3 py-1.5 text-left transition-colors ${
                                                on ? "bg-white/[.12] shadow-[0_0_0_1.5px_var(--primary,#C9A84C)]" : "hover:bg-white/10"
                                            }`}
                                        >
                                            <span className="flex-shrink-0 text-base" aria-hidden="true">{q.icon}</span>
                                            <span className="min-w-0">
                                                <span className={`block whitespace-nowrap text-[14px] font-extrabold leading-tight ${on ? "text-white" : "text-[#a0b8d8]"}`}>
                                                    {q.size}
                                                </span>
                                                <span className={`block truncate text-[9.5px] ${on ? "text-primary" : "text-[#6a8aaa]"}`}>
                                                    {q.carrier}
                                                </span>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {current && <QuotationPane q={current} />}
        </div>
    );
}
