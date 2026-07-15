import { NextResponse } from "next/server";

// Stable health contract (FND-001 §12). Fixed shape, no timestamps, no infra details,
// no secrets. Uncached.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    { status: "ok", service: "thg-public-web", runtime: "next" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
