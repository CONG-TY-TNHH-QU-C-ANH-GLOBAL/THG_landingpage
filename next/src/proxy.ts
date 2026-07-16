import { NextResponse, type NextRequest } from "next/server";
import { decodeLocaleRoute, LOCALE_REDIRECT_STATUS } from "./shared/i18n/config/locale-routing";

// Next.js proxy (FND-002) — URL mechanics ONLY. It may redirect `/` to the default locale,
// normalize an unsupported 2-letter locale prefix and preserve the query string. It must
// never fetch CMS data, load dictionaries, make network requests, do auth/identity/PII/lead/
// analytics work, set locale cookies, or detect browser language / geolocation. Imports only
// the pure, request-safe locale-routing primitive.
export function proxy(request: NextRequest): NextResponse {
  const decision = decodeLocaleRoute(request.nextUrl.pathname);

  if (decision.kind === "redirect" && decision.location) {
    const url = request.nextUrl.clone();
    url.pathname = decision.location;
    // Query string preserved verbatim (clone keeps it; set explicitly for clarity).
    url.search = request.nextUrl.search;
    return NextResponse.redirect(url, LOCALE_REDIRECT_STATUS);
  }

  return NextResponse.next();
}

// Bypass: API routes, Next internals/static/image, favicon, the health/probe endpoints and
// any path whose FINAL segment looks like a real file (a dot in the last segment, e.g.
// `/README.md`, `/x.js`). A dot in a non-final segment (e.g. `/fr/legal.v2/terms`) is a route
// and is still locale-normalized. Everything else runs the locale proxy. Direct static literal.
export const config = {
  matcher: ["/((?!api|_next|favicon.ico|foundation-probe.txt|.*[.][^/]*$).*)"],
};
