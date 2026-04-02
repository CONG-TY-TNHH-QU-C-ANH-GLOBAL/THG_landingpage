// Pricing helper functions adapted for the USD-based pricingData.ts
import { pricingData } from "./pricingData";

export interface TableColumn {
    key: string;
    label: string;
}

export interface TableRow {
    kg: number;
    [countryCode: string]: number;
}

export interface TableData {
    columns: TableColumn[];
    data: TableRow[];
}

export const countryNames: Record<string, string> = {
    // Short codes (CN sheets)
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
    // Long keys (VN sheets after cleaning)
    "us-united_states": "US-United States", "uk-united_kindgom": "UK-United Kingdom",
    "united_states": "United States (US)", "united_kindgom": "United Kingdom (GB)",
    "germany": "Germany (DE)", "france": "France (FR)",
    "italy": "Italy (IT)", "spain": "Spain (ES)",
    "netherlands": "Netherlands (NL)", "austria": "Austria (AT)",
    "poland": "Poland (PL)", "canada": "Canada (CA)",
    "australia": "Australia (AU)", "new_zealand": "New Zealand (NZ)",
    "japan": "Japan (JP)", "hong_kong": "Hong Kong (HK)",
    "singapore": "Singapore (SG)", "mexico": "Mexico (MX)",
    "brazil": "Brazil (BR)", "switzerland": "Switzerland (CH)",
    "belgium": "Belgium (BE)", "ireland": "Ireland (IE)",
    "sweden": "Sweden (SE)", "malaysia": "Malaysia (MY)",
    "greece": "Greece (GR)", "south_africa": "South Africa (ZA)",
    "saudi_arabia": "Saudi Arabia (SA)", "latvia": "Latvia (LV)",
    "thailand": "Thailand (TH)", "taiwan": "Taiwan (TW)",
};

/**
 * Generate table data for HighlightableTable from the active PricingData.
 */
export const generateTableData = (
    origin: string,
    category: "standard" | "cosmetics" | "battery"
): TableData => {
    let key = "";
    if (origin === "vn") {
        if (category === "standard") key = "vnThuong";
        if (category === "cosmetics") key = "vnMypham";
    } else if (origin === "cn") {
        if (category === "standard") key = "cnThuong";
        if (category === "cosmetics") key = "cnMypham";
        if (category === "battery") key = "cnPin";
    }

    const dataArray: any[] = (pricingData as any)[key] || [];

    if (dataArray.length === 0) return { columns: [], data: [] };

    // Extract columns from the available keys in the dataset
    // We scan all rows to find all keys except 'kg'
    const columnKeys = new Set<string>();
    dataArray.forEach(row => {
        Object.keys(row).forEach(k => {
            if (k !== 'kg') columnKeys.add(k);
        });
    });

    const columns: TableColumn[] = Array.from(columnKeys).map(k => ({
        key: k,
        label: countryNames[k.toLowerCase()] || k.toUpperCase()
    }));

    return { columns, data: dataArray };
};

/**
 * Generate TikTok-specific table data.
 */
export const generateTiktokTableData = (origin: string): TableData => {
    // For rebuild, map to tiktokCnUsNormal or tiktokCnUk/tiktokCnDe based on origin logic
    const isCn = origin === "cn";
    const data: TableRow[] = [];
    const columns: TableColumn[] = isCn
        ? [
            { key: "us", label: "Mỹ (US)" },
            { key: "uk", label: "Anh (UK)" },
            { key: "de", label: "Đức (DE)" },
        ]
        : [{ key: "uk", label: "Anh (UK) / US" }];

    if (isCn) {
        const usData = (pricingData as any).tiktokCnUsNormal || [];
        const ukData = (pricingData as any).tiktokCnUk || [];
        const deData = (pricingData as any).tiktokCnDe || [];

        // Merge them by kg
        const weightSet = new Set<number>();
        usData.forEach((r: any) => weightSet.add(r.kg || r.weight));

        const weights = Array.from(weightSet).sort((a, b) => a - b);
        weights.forEach(w => {
            const usRow = usData.find((r: any) => (r.kg || r.weight) === w);
            const ukRow = ukData.find((r: any) => (r.kg || r.weight) === w);
            const deRow = deData.find((r: any) => (r.kg || r.weight) === w);
            data.push({
                kg: w,
                us: usRow ? (usRow.rate || usRow.us) : 0,
                uk: ukRow ? (ukRow.rate || ukRow.uk) : 0,
                de: deRow ? (deRow.rate || deRow.de) : 0,
            });
        });
    } else {
        const vnTiktokData = (pricingData as any).tiktokVnSeller || [];
        vnTiktokData.forEach((row: any) => {
            data.push({
                kg: row.kg || row.weight || 0,
                uk: row.rate || row.us || 0, // Using US/UK generically for Vietnam TikTok line
            });
        });
    }

    return { columns, data };
};

/**
 * Generate Bulk shipping data.
 */
export const generateBulkData = (origin: string) => {
    // Return standard dummy shape if complex mapping is not supported yet by component
    // We map loThuong, loPin from new pricingData
    const isCn = origin === "cn";
    const baseData = isCn ? (pricingData as any).loPin : (pricingData as any).loThuong;

    if (baseData && baseData.length > 0) {
        return [
            {
                name: "Sea/Air Route (Auto)",
                prices: { 12: baseData[0]?.usd || 5.5, 21: baseData[1]?.usd || 4.2 },
                sla: "10-25 Ngày",
            }
        ];
    }

    if (isCn) {
        return [
            { name: "Sea (Mason)", prices: { 12: 5.5, 21: 4.2, 71: 3.8, 100: 3.5 }, sla: "20-25 Ngày" },
            { name: "Air (USP)", prices: { 12: 10.5, 21: 9.0, 71: 8.5, 100: 8.0 }, sla: "8-10 Ngày" }
        ];
    }
    return [
        { name: "Air Standard", prices: { 12: 9.5, 21: 8.2, 71: 7.5, 100: 7.0 }, sla: "5-8 Ngày" }
    ];
};
