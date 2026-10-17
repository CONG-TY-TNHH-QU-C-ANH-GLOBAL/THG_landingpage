// "Dự toán chi phí" — four worked quotations from the XKCN Hub v6.0 sheet
// (thg_xkcn_v14), tab "Dự toán chi phí".
//
// The data lives in chinhNgachQuotation.json, GENERATED from the sheet's
// markup, one entry per container pane, so every cell keeps the sheet's
// formatting: which amounts are green prices, which are at-cost /
// if-applicable / TBC tags, which are dimmed. THG is folded to TH Group, the
// site's brand. It is JSON rather than TS because it is data: two hundred
// rows of one shape read as code duplication to static analysis.
//
// These are REFERENCE QUOTATIONS, not a calculator: each is one real shipment
// priced line by line, so a seller can see which charges exist at all and
// roughly what each costs. The sheet groups them by origin — three lanes out
// of Hai Phong and one out of Yantian — and that grouping is the tab's
// navigation.
//
// The sheet also attached three source PDFs (a MATSON debit note and two China
// agent quotes). They are deliberately NOT published: they carry TH Group's
// buy-side rates, a counterparty's invoice references and a specific B/L and
// voyage, which would let any reader derive the margin on these lanes.

/** How a cell's content is drawn: plain text, a green price (price / the
 *  smaller priceS), one of the three status tags, or the muted aside the
 *  sheet prints after a subtotal. */
export type CellKind = "text" | "price" | "priceS" | "atcost" | "tbc" | "ifapp" | "note";

export interface CostCell {
    txt: string;
    kind: CellKind;
    /** Right-aligned. */
    cr?: boolean;
    mono?: boolean;
    dim?: boolean;
    span?: number;
}

export interface CostRow {
    /** group = navy/gold band, item = a charge, sub = subtotal. */
    kind: "group" | "item" | "sub";
    cells: readonly CostCell[];
}

export interface Quotation {
    id: string;
    lane: "vn" | "cn";
    icon: string;
    size: string;
    carrier: string;
    kicker: string;
    badge: string;
    facts: readonly { k: string; v: string; gold?: boolean }[];
    rows: readonly CostRow[];
    /** lines = the included/excluded pair printed under the name; suffix =
     *  the "plus what nobody can price yet" line under the figure. Both
     *  change what the number means. */
    total: { label: string; name: string; lines: readonly string[]; excl: string; amount: string; unit: string; suffix: string };
    disclTitle: string;
    /** May carry inline <strong>. */
    discl: readonly string[];
}

import data from "./chinhNgachQuotation.json";

export const QUOTATION_HEAD: { tag: string; title: string; sub: string } = data.head;

export const LANES = data.lanes as readonly { kind: "vn" | "cn"; head: string }[];

export const QUOTATIONS = data.quotations as readonly Quotation[];
