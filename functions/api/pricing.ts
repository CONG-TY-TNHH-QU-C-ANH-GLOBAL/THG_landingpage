// @ts-nocheck
/**
 * Cloudflare Pages Function — Lark Sheet Pricing Proxy
 *
 * GET  /api/pricing?sheet=<sheetId>&range=<range>
 *      Reads a specific range from the Lark spreadsheet.
 *
 * GET  /api/pricing?sheets=all
 *      Reads ALL configured sheets (international + domestic) in one call.
 *
 * Environment Variables required:
 *   LARK_APP_ID, LARK_APP_SECRET, LARK_SPREADSHEET_TOKEN
 */

const LARK_BASE = "https://open.larksuite.com/open-apis";

// ── helpers ──────────────────────────────────────────────

async function getTenantToken(appId: string, appSecret: string): Promise<string> {
    const res = await fetch(`${LARK_BASE}/auth/v3/tenant_access_token/internal/`, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
    });
    const data = await res.json();
    if (data.code !== 0) throw new Error(`Lark auth failed: ${data.msg}`);
    return data.tenant_access_token;
}

async function readSheetRange(
    token: string,
    spreadsheetToken: string,
    range: string
): Promise<any[][]> {
    const url = `${LARK_BASE}/sheets/v2/spreadsheets/${spreadsheetToken}/values/${encodeURIComponent(range)}?valueRenderOption=ToString`;
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.code !== 0) throw new Error(`Lark read failed: ${data.msg}`);
    return data.data?.valueRange?.values ?? [];
}

// ── CORS ─────────────────────────────────────────────────

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
};

// ── GET handler ──────────────────────────────────────────

export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);

    const appId = env.LARK_APP_ID;
    const appSecret = env.LARK_APP_SECRET;
    const spreadsheetToken = env.LARK_SPREADSHEET_TOKEN;

    if (!appId || !appSecret || !spreadsheetToken) {
        return new Response(
            JSON.stringify({ error: "Missing Lark credentials in env" }),
            { status: 500, headers: corsHeaders }
        );
    }

    try {
        const token = await getTenantToken(appId, appSecret);

        // Mode 1: fetch all configured sheets
        const sheetsParam = url.searchParams.get("sheets");
        if (sheetsParam === "all") {
            // Read the meta info to discover all sheets first
            const metaUrl = `${LARK_BASE}/sheets/v2/spreadsheets/${spreadsheetToken}/metainfo`;
            const metaRes = await fetch(metaUrl, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const metaData = await metaRes.json();
            const sheets = metaData.data?.properties?.sheets ?? metaData.data?.sheets ?? [];

            const result: Record<string, { title: string; data: any[][] }> = {};

            for (const sheet of sheets) {
                const sheetId = sheet.sheetId;
                const title = sheet.title;
                const rowCount = sheet.rowCount || 1000;
                const colCount = sheet.columnCount || 30;

                // Build range like sheetId!A1:Z1000
                const endCol = String.fromCharCode(64 + Math.min(colCount, 26)); // max 'Z'
                const range = `${sheetId}!A1:${endCol}${Math.min(rowCount, 2000)}`;

                try {
                    const values = await readSheetRange(token, spreadsheetToken, range);
                    result[sheetId] = { title, data: values };
                } catch (e) {
                    result[sheetId] = { title, data: [], error: e.message };
                }
            }

            return new Response(
                JSON.stringify({ ok: true, sheets: result, fetchedAt: new Date().toISOString() }),
                { headers: corsHeaders }
            );
        }

        // Mode 2: fetch a single sheet/range
        const sheetId = url.searchParams.get("sheet");
        const range = url.searchParams.get("range");

        if (!sheetId || !range) {
            return new Response(
                JSON.stringify({ error: "Missing ?sheet=<id>&range=<range> or ?sheets=all" }),
                { status: 400, headers: corsHeaders }
            );
        }

        const fullRange = `${sheetId}!${range}`;
        const values = await readSheetRange(token, spreadsheetToken, fullRange);

        return new Response(
            JSON.stringify({ ok: true, data: values, fetchedAt: new Date().toISOString() }),
            { headers: corsHeaders }
        );
    } catch (e) {
        return new Response(
            JSON.stringify({ error: e.message || "Internal Server Error" }),
            { status: 500, headers: corsHeaders }
        );
    }
}

// ── OPTIONS (CORS preflight) ─────────────────────────────

export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
        },
    });
}
