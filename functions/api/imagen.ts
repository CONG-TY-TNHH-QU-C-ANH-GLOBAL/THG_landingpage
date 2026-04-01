// @ts-nocheck
export async function onRequestPost(context) {
    const { request, env } = context;

    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    };

    try {
        const { prompt } = await request.json();

        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    instances: [{ prompt }],
                    parameters: { sampleCount: 1 },
                }),
            }
        );

        const data = await res.json();
        const base64 = data.predictions?.[0]?.bytesBase64Encoded;

        if (!base64) {
            return new Response(
                JSON.stringify({ error: "Imagen không trả về kết quả", detail: JSON.stringify(data) }),
                { status: 502, headers: corsHeaders }
            );
        }

        return new Response(JSON.stringify({ base64 }), { headers: corsHeaders });
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
