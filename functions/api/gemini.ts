// @ts-nocheck
export async function onRequestPost(context) {
    const { request, env } = context;

    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    };

    try {
        const { prompt, systemPrompt } = await request.json();

        const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    systemInstruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
                }),
            }
        );

        const data = await geminiRes.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

        if (!content) {
            return new Response(
                JSON.stringify({ error: "Gemini không trả về kết quả", detail: JSON.stringify(data) }),
                { status: 502, headers: corsHeaders }
            );
        }

        return new Response(JSON.stringify({ content }), { headers: corsHeaders });
    } catch (e) {
        return new Response(
            JSON.stringify({ error: e.message || "Internal Server Error" }),
            { status: 500, headers: corsHeaders }
        );
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
        },
    });
}
