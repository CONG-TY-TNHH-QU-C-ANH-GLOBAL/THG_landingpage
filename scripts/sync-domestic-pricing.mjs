/**
 * Pre-build script: Fetch latest US domestic pricing from Google Sheets
 * and write to src/data/domesticPricing.json so the build always has fresh data.
 *
 * Runs automatically before every `npm run build` via the "prebuild" npm script.
 * Can also be run manually: node scripts/sync-domestic-pricing.mjs
 */

const SPREADSHEET_ID = "1woNrfCqybDs0zYKbGnilchhXE6JaWLAsOJxN-pQO0e4";
const GID = "1339656958"; // US domestic pricing tab
const OUTPUT = new URL("../src/data/domesticPricing.json", import.meta.url);

async function main() {
    console.log("[sync] Fetching US domestic pricing from Google Sheets...");

    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&gid=${GID}&_t=${Date.now()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const csv = await res.text();

    const parsed = parseCSV(csv);
    if (parsed.length < 2) throw new Error("Sheet returned too few rows");

    const headers = parsed[0];

    // Map headers to standard names
    const headerMap = headers.map(h => {
        const hl = h.toLowerCase().trim();
        if (hl === "no" || hl === "stt") return "STT";
        if (hl.includes("weight not over")) return "Weight Not Over (in ounces)";
        if (hl === "gram") return "Gram";
        return h.trim();
    });

    const data = [];
    for (let r = 1; r < parsed.length; r++) {
        const row = parsed[r];
        const stt = row[0]?.trim();
        if (!stt || stt === "") continue;

        const obj = {};
        headerMap.forEach((key, i) => {
            let val = row[i] || "";

            // For Weight column: append "oz" if it's just a number
            if (key === "Weight Not Over (in ounces)") {
                val = val.trim();
                if (/^[\d,.]+$/.test(val)) val = val + " oz";
            }

            obj[key] = val;
        });
        data.push(obj);
    }

    // Write to file
    const { writeFileSync } = await import("node:fs");
    const { fileURLToPath } = await import("node:url");
    const outPath = fileURLToPath(OUTPUT);
    writeFileSync(outPath, JSON.stringify(data, null, 4), "utf8");

    console.log(`[sync] ✅ Written ${data.length} rows to ${outPath}`);
}

// ── CSV parser ──
function parseCSV(csv) {
    const rows = [];
    let i = 0;
    const len = csv.length;
    while (i < len) {
        const row = [];
        while (i < len) {
            let value = "";
            if (csv[i] === '"') {
                i++;
                while (i < len) {
                    if (csv[i] === '"') {
                        if (i + 1 < len && csv[i + 1] === '"') { value += '"'; i += 2; }
                        else { i++; break; }
                    } else { value += csv[i]; i++; }
                }
            } else {
                while (i < len && csv[i] !== ',' && csv[i] !== '\n' && csv[i] !== '\r') {
                    value += csv[i]; i++;
                }
            }
            row.push(value.trim());
            if (i < len && csv[i] === ',') { i++; }
            else { if (i < len && csv[i] === '\r') i++; if (i < len && csv[i] === '\n') i++; break; }
        }
        if (row.length > 0 && !(row.length === 1 && row[0] === "")) rows.push(row);
    }
    return rows;
}

main().catch(err => {
    console.error("[sync] ❌ Failed to sync domestic pricing:", err.message);
    console.error("[sync] Build will proceed with existing fallback data.");
    // Don't exit(1) — allow build to continue with stale JSON if network fails
});
