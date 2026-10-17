// Turns the CMS's chính ngạch rate cards and meta strings into the pieces the
// source sheet (XKCN Hub v6.0) lays out: transit cards, cut-off pills, CFS
// cards, per-route FCL breakdowns, air surcharge chips.
//
// The numbers stay in the CMS so operations can edit them without a deploy;
// only the arrangement follows the sheet. Every parser therefore has to
// survive an operator rewording a meta value — anything it cannot read falls
// back to the raw text instead of disappearing.

export type Cell = string | number | null | undefined;
export type Row = Record<string, Cell>;

/** "~$1,234" or "~$6.05": cents only where the amount has them, as the sheet
 *  prints it. Empty becomes an em dash. */
export function money(v: Cell): string {
    if (v === null || v === undefined || v === "") return "—";
    const n = typeof v === "number" ? v : Number(String(v).replace(/[$,~\s]/g, ""));
    if (!Number.isFinite(n)) return String(v);
    const dp = Number.isInteger(n) ? 0 : 2;
    return `~$${n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;
}

const cap = (s: string) => (s ? s.charAt(0).toLocaleUpperCase("vi") + s.slice(1) : s);

export interface Transit {
    label: string;
    value: string;
    unit: string;
    sub: string;
}

/** "HCM → Door US: 25–26 ngày (sea + nội địa Mỹ)" → label / 25–26 / ngày / sub. */
export function parseTransit(raw: string | undefined): Transit | null {
    if (!raw?.trim()) return null;
    const m = raw.match(/^(.*?):\s*([\d][\d–\-\s]*?)\s*(ngày|days?)?\s*(?:\((.*)\))?\s*$/i);
    if (!m) return { label: "", value: raw.trim(), unit: "", sub: "" };
    return { label: m[1].trim(), value: m[2].trim(), unit: m[3] ?? "", sub: (m[4] ?? "").trim() };
}

const WEEKDAY: Record<string, string> = { T2: "Thứ 2", T3: "Thứ 3", T4: "Thứ 4", T5: "Thứ 5", T6: "Thứ 6", T7: "Thứ 7", CN: "Chủ nhật" };

/** "T2 12:00 đặt booking · T5 ETD" → [{when: "Thứ 2 12:00", what: "Đặt booking"}, …].
 *  The sheet spells the weekday out and bolds the time; the CMS abbreviates. */
export function parseCutoffs(raw: string | undefined): { when: string; what: string }[] {
    if (!raw?.trim()) return [];
    return raw.split(/\s+·\s+/).map((part) => {
        const m = part.trim().match(/^(T[2-7]|CN)(?:\s+(\d{1,2}:\d{2}))?\s*(.*)$/);
        if (!m) return { when: "", what: part.trim() };
        return { when: [WEEKDAY[m[1]], m[2]].filter(Boolean).join(" "), what: cap(m[3].trim()) };
    });
}

/** "CFS CTY Gemadept (03TGC16) — Lô CN3, …" → name / code / address. */
export function parseCfs(raw: string | undefined): { name: string; code: string; address: string } | null {
    if (!raw?.trim()) return null;
    const m = raw.match(/^(.*?)\s*\(([^)]+)\)\s*[—-]\s*(.*)$/);
    return m ? { name: m[1].trim(), code: m[2].trim(), address: m[3].trim() } : { name: raw.trim(), code: "", address: "" };
}

/** "FCL: ETD−2 ngày · tàu chạy 2–3 chuyến/tuần" → label/value pairs for the
 *  navy cut-off bar. A part without a colon is split before its first digit. */
export function parseCutoffBar(raw: string | undefined): { label: string; value: string }[] {
    if (!raw?.trim()) return [];
    return raw.split(/\s+·\s+/).map((part) => {
        const p = part.trim();
        const colon = p.indexOf(":");
        if (colon > 0) return { label: `${p.slice(0, colon + 1)}`, value: p.slice(colon + 1).trim() };
        const m = p.match(/^(\D+?)\s+(\d.*)$/);
        return m ? { label: `${cap(m[1])}:`, value: m[2] } : { label: "", value: p };
    });
}

/** "LAX (Los Angeles) — Bờ Tây" → "Bờ Tây — Los Angeles (LAX)", the sheet's order. */
export function airGroupLabel(raw: string): string {
    const m = raw.match(/^([A-Z]{3})\s*\(([^)]+)\)\s*[—-]\s*(.+)$/);
    return m ? `${m[3].trim()} — ${m[2].trim()} (${m[1]})` : raw;
}

/** Main text plus a muted tail: "Đà Nẵng (DAD) — via HCM hoặc HPH",
 *  "HCM → Los Angeles, CA (Bờ Tây)", "ISF Filing Fee (if applicable)". */
export function splitTail(raw: string): { main: string; tail: string } {
    const via = raw.match(/^(.*?)\s+[—-]\s+(via .*)$/i);
    if (via) return { main: via[1], tail: via[2] };
    const paren = raw.match(/^(.*?)\s+(\(([^)]*)\))$/);
    // A port code — "(HCM)", "(DAD)" — is part of the name, not a muted aside.
    if (!paren || /^[A-Z]{2,4}$/.test(paren[3])) return { main: raw, tail: "" };
    return { main: paren[1], tail: paren[2] };
}

/** The sheet writes "Chưa bao gồm:"; the CMS shortened it to "Chưa gồm:". */
export function exclusion(raw: string | undefined): string {
    if (!raw?.trim()) return "";
    return raw.trim().replace(/^Chưa gồm:/i, "Chưa bao gồm:");
}

export interface Chip {
    label: string;
    value: string;
}

/** Split a comma list, ignoring commas inside parentheses. */
function topLevelCommas(s: string): string[] {
    const out: string[] = [];
    let depth = 0;
    let cur = "";
    for (const ch of s) {
        if (ch === "(") depth++;
        if (ch === ")") depth = Math.max(0, depth - 1);
        if (ch === "," && depth === 0) {
            out.push(cur.trim());
            cur = "";
        } else cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
}

/** excl_air carries both the priced surcharges and the plain exclusions in one
 *  sentence. The sheet shows the priced ones as chips and the rest as a note:
 *  "Handling (~$0.022/CW, min ~$22/lô), AWB fee (~$5.5/set), …, door delivery". */
export function parseAirSurcharges(raw: string | undefined): { chips: Chip[]; rest: string[] } {
    const chips: Chip[] = [];
    const rest: string[] = [];
    const body = (raw ?? "").replace(/^Chưa (bao )?gồm:\s*/i, "");
    for (const item of topLevelCommas(body)) {
        const m = item.match(/^(.*?)\s*\((.*)\)\s*$/);
        if (!m || !/\$/.test(m[2])) {
            if (item) rest.push(item);
            continue;
        }
        const name = m[1].trim();
        for (const part of m[2].split(/,\s*|\s+cộng\s+/)) {
            const p = part.trim();
            if (!p) continue;
            if (/^min\s+/i.test(p)) chips.push({ label: `${name} min`, value: p.replace(/^min\s+/i, "") });
            else if (/\/MAWB$/i.test(p)) chips.push({ label: `${name} Master`, value: p });
            else if (/\/HAWB$/i.test(p)) chips.push({ label: `${name} House`, value: p });
            else chips.push({ label: name, value: p });
        }
    }
    return { chips, rest };
}

const TOTAL = /^(total|tổng cước)$/i;

export interface FclRoute {
    origin: string;
    transit: string;
    rows: { charge: string; total: boolean; values: Cell[] }[];
}

/** The CMS keeps FCL as one long table (service × route × charge). The sheet
 *  shows one service at a time, one small table per route, total last. */
export function groupFcl(rows: readonly Row[], cols: readonly string[]): Map<string, FclRoute[]> {
    const services = new Map<string, FclRoute[]>();
    for (const r of rows) {
        const svc = String(r.service ?? "");
        const origin = String(r.origin ?? "");
        const routes = services.get(svc) ?? [];
        let route = routes.find((x) => x.origin === origin);
        if (!route) {
            route = { origin, transit: String(r.transit ?? ""), rows: [] };
            routes.push(route);
        }
        const charge = String(r.charge ?? "");
        route.rows.push({ charge: TOTAL.test(charge) ? "Tổng cước" : charge, total: TOTAL.test(charge), values: cols.map((c) => r[c]) });
        services.set(svc, routes);
    }
    for (const routes of services.values()) for (const route of routes) route.rows.sort((a, b) => Number(a.total) - Number(b.total));
    return services;
}

/** Air rows grouped by destination, in first-seen order. */
export function groupBy<T extends Row>(rows: readonly T[], key: string): [string, T[]][] {
    const m = new Map<string, T[]>();
    for (const r of rows) {
        const k = String(r[key] ?? "");
        m.set(k, [...(m.get(k) ?? []), r]);
    }
    return [...m.entries()];
}
