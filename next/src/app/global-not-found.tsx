import "./globals.css";
import { DEFAULT_LOCALE, HTML_LANG } from "@/shared/i18n";

// Global (non-localized) 404 for unmatched paths. Because the root layout lives under the
// [lang] segment, this renders a COMPLETE standalone document (experimental globalNotFound)
// and returns a real framework 404. Server Component; no CMS/network/cookie/browser use.
export default function GlobalNotFound() {
  return (
    <html lang={HTML_LANG[DEFAULT_LOCALE]}>
      <body>
        <main>
          <h1>404 — Not found</h1>
          <p>This page does not exist.</p>
        </main>
      </body>
    </html>
  );
}
