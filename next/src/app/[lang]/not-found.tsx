// Foundation not-found for the [lang] segment — a real HTTP 404 rendered inside the [lang]
// layout's document. Next not-found components receive NO props. Neutral, non-localized copy
// only; localized 404 UX is deferred to the owning page/error migration (FND-003 / WEB-*).
export default function LocaleNotFound() {
  return (
    <main>
      <h1>404</h1>
    </main>
  );
}
