// Cloudflare Worker
// Secrets required: GEMINI_API_KEY
// @ts-nocheck

function cors(res) {
    const h = new Headers(res.headers);
    h.set("Access-Control-Allow-Origin", "*");
    h.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return new Response(res.body, { status: res.status, headers: h });
}

function json(data, status = 200) {
    return cors(new Response(JSON.stringify(data), {
        status, headers: { "Content-Type": "application/json" }
    }));
}

async function handleGemini(req, env) {
    if (req.method === "OPTIONS") return cors(new Response(null, { status: 204 }));
    if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

    const { prompt, systemPrompt } = await req.json();
    const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] }
            })
        }
    );
    const data = await geminiRes.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    if (!content) return json({ error: "Gemini không trả về kết quả" }, 502);
    return json({ content });
}

async function handleImagen(req, env) {
    if (req.method === "OPTIONS") return cors(new Response(null, { status: 204 }));
    if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

    const { prompt } = await req.json();
    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${env.GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                instances: [{ prompt }],
                parameters: { sampleCount: 1 }
            })
        }
    );
    const data = await res.json();
    // Documented Imagen API response format
    const base64 = data.predictions?.[0]?.bytesBase64Encoded;
    if (!base64) return json({ error: "Imagen không trả về kết quả" }, 502);
    return json({ base64 });
}

export default {
    async fetch(req, env) {
        const url = new URL(req.url);
        if (url.pathname === "/api/gemini") return handleGemini(req, env);
        if (url.pathname === "/api/imagen") return handleImagen(req, env);
        return env.ASSETS.fetch(req);
    }
};
