import { DEFAULT_LOCALE, HTML_LANG } from "@/shared/i18n";

// Root (non-localized) not-found — real HTTP 404. Because the root layout is a pass-through,
// this render owns its own `<html>`/`<body>`. Default-locale document language.
export default function RootNotFound() {
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
