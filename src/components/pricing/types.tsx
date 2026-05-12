import React from "react";

/* ═══════════════════════════════════════════════
   TYPES & CONFIG
   ═══════════════════════════════════════════════ */

/** Row shape served by the CMS pricing tables. `kg`/`weight` is the row key;
 *  other keys map to the destination columns and may be a numeric string,
 *  number, or absent. */
export type PricingRow = {
    kg?: string | number;
    weight?: string | number;
} & Record<string, string | number | null | undefined>;

/** Estimated price card payload returned from the search widget pipeline.
 *  Result variants are non-exclusive (the search builder produces a few
 *  shapes), so the consumer is responsible for branching on `error`/`type`. */
export interface EstimatedPrice {
    error?: string;
    type?: "flat" | "contact" | string;
    text?: string;
}

export type ServiceTab = "epacket" | "express" | "terms";
export type EpacketRoute = "std-vn-ww" | "std-cn-ww" | "pri-vn-us" | "pri-cn-us" | "cn-us-label";
export type ExpressRoute = "vn-us" | "cn-us";
export type CargoType = "standard" | "cosmetics" | "battery";
export type OriginCountry = "vn" | "cn";

export const ROUTES: Record<EpacketRoute, { nameVi: React.ReactNode; nameEn: React.ReactNode; nameZh: React.ReactNode; time: { vi: string; en: string; zh: string }; cargo: CargoType[]; type: string; origin: OriginCountry[] }> = {
    "std-vn-ww": {
        nameVi: <span className="notranslate" translate="no">🇻🇳 Standard VN → Worldwide</span>,
        nameEn: <span className="notranslate" translate="no">🇻🇳 Standard VN → Worldwide</span>,
        nameZh: <span className="notranslate" translate="no">🇻🇳 标准 VN → 全球</span>,
        time: { vi: "⏱ 5–12 BSD", en: "⏱ 5–12 BSD", zh: "⏱ 5–12 工作日" },
        cargo: ["standard", "cosmetics"], type: "merchant", origin: ["vn"]
    },
    "std-cn-ww": {
        nameVi: <span className="notranslate" translate="no">🇨🇳 Standard CN → Worldwide</span>,
        nameEn: <span className="notranslate" translate="no">🇨🇳 Standard CN → Worldwide</span>,
        nameZh: <span className="notranslate" translate="no">🇨🇳 标准 CN → 全球</span>,
        time: { vi: "⏱ 6–12 BSD", en: "⏱ 6–12 BSD", zh: "⏱ 6–12 工作日" },
        cargo: ["standard", "cosmetics", "battery"], type: "merchant", origin: ["cn"]
    },
    "pri-vn-us": {
        nameVi: <span className="notranslate" translate="no">🇻🇳 Priority VN → US</span>,
        nameEn: <span className="notranslate" translate="no">🇻🇳 Priority VN → US</span>,
        nameZh: <span className="notranslate" translate="no">🇻🇳 优先 VN → US</span>,
        time: { vi: "⏱ 7–9 BSD", en: "⏱ 7–9 BSD", zh: "⏱ 7–9 工作日" },
        cargo: [], type: "merchant", origin: ["vn"]
    },
    "pri-cn-us": {
        nameVi: <span className="notranslate" translate="no">🇨🇳 Priority CN → US</span>,
        nameEn: <span className="notranslate" translate="no">🇨🇳 Priority CN → US</span>,
        nameZh: <span className="notranslate" translate="no">🇨🇳 优先 CN → US</span>,
        time: { vi: "⏱ 5–10 BSD", en: "⏱ 5–10 BSD", zh: "⏱ 5–10 工作日" },
        cargo: [], type: "merchant", origin: ["cn"]
    },
    "cn-us-label": {
        nameVi: <span className="notranslate" translate="no">🇨🇳 CN → US Ship by Label</span>,
        nameEn: <span className="notranslate" translate="no">🇨🇳 CN → US Ship by Label</span>,
        nameZh: <span className="notranslate" translate="no">🇨🇳 CN → US 贴标发货</span>,
        time: { vi: "⏱ Theo lịch USPS", en: "⏱ Per USPS schedule", zh: "⏱ 按USPS时间表" },
        cargo: [], type: "label", origin: ["cn"]
    },
};

export const CARGO_LABELS: Record<CargoType, Record<string, string>> = {
    standard: { vi: "Hàng Thường", en: "Regular Items", zh: "普货" },
    cosmetics: { vi: "Mỹ Phẩm", en: "Cosmetics", zh: "化妆品" },
    battery: { vi: "Pin Điện", en: "Batteries", zh: "电池" },
};
export const CARGO_ICONS: Record<CargoType, string> = { standard: "📦", cosmetics: "💄", battery: "🔋" };

export const DATA_KEY_MAP: Record<string, string> = {
    "std-vn-ww_standard": "vnThuong",
    "std-vn-ww_cosmetics": "vnMypham",
    "std-cn-ww_standard": "cnThuong",
    "std-cn-ww_cosmetics": "cnMypham",
    "std-cn-ww_battery": "cnPin",
    "pri-vn-us_standard": "uspsCn",
    "pri-cn-us_standard": "uspsCnUs",
};

export const countryNames: Record<string, string> = {
    us: "United States (US)", gb: "United Kingdom (GB)", uk: "United Kingdom (GB)",
    de: "Germany (DE)", fr: "France (FR)", it: "Italy (IT)", es: "Spain (ES)",
    nl: "Netherlands (NL)", at: "Austria (AT)", pl: "Poland (PL)",
    ca: "Canada (CA)", au: "Australia (AU)", nz: "New Zealand (NZ)",
    jp: "Japan (JP)", hk: "Hong Kong (HK)", sg: "Singapore (SG)",
    mx: "Mexico (MX)", br: "Brazil (BR)", ch: "Switzerland (CH)", cl: "Chile (CL)",
    ae: "UAE (AE)", uae: "UAE (AE)", sa: "Saudi Arabia (SA)",
    be: "Belgium (BE)", ie: "Ireland (IE)", se: "Sweden (SE)",
    my: "Malaysia (MY)", gr: "Greece (GR)", za: "South Africa (ZA)", lv: "Latvia (LV)",
    th: "Thailand (TH)", tw: "Taiwan (TW)",
    no: "Norway (NO)", dk: "Denmark (DK)", fi: "Finland (FI)",
    il: "Israel (IL)",
    sk: "Slovakia (SK)", cy: "Cyprus (CY)", mt: "Malta (MT)",
    si: "Slovenia (SI)", lu: "Luxembourg (LU)",
    bg: "Bulgaria (BG)", hr: "Croatia (HR)", hu: "Hungary (HU)",
    cz: "Czechia (CZ)", ee: "Estonia (EE)", lt: "Lithuania (LT)",
    pt: "Portugal (PT)", ro: "Romania (RO)",
    // AU Zone labels for CN routes
    au_z1: "AU Zone 1", au_z2: "AU Zone 2", au_z3: "AU Zone 3", au_z4: "AU Zone 4",
    "us-united_states": "United States (US)", "uk-united_kindgom": "United Kingdom (GB)",
    "de-germany": "Germany (DE)", "fr-france": "France (FR)",
    "it-italy": "Italy (IT)", "es-spain": "Spain (ES)",
    "nl-netherlands": "Netherlands (NL)", "be-belgium": "Belgium (BE)",
    "se-sweden": "Sweden (SE)", "pl-poland": "Poland (PL)",
    "at-austria": "Austria (AT)", "dk-denmark": "Denmark (DK)",
    "fi-finland": "Finland (FI)", "ie-ireland": "Ireland (IE)",
    "bg-bulgaria": "Bulgaria (BG)", "cz-czechia": "Czechia (CZ)",
    "ee-estonia": "Estonia (EE)", "gr-greece": "Greece (GR)",
    "hr-croatia": "Croatia (HR)", "hu-hungary": "Hungary (HU)",
    "lt-lithuania": "Lithuania (LT)", "lv-latvia": "Latvia (LV)",
    "pt-portugal": "Portugal (PT)", "ro-romania": "Romania (RO)",
    "united_states": "United States (US)",
    "no-norway": "Norway (NO)", "sk-slovakia": "Slovakia (SK)",
    "cy-cyprus": "Cyprus (CY)", "mt-malta": "Malta (MT)",
    "si-slovenia": "Slovenia (SI)", "lu-luxembourg": "Luxembourg (LU)",
    "ch-switzerland": "Switzerland (CH)", "cl-chile": "Chile (CL)",
};

