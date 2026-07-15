// Suspense fallback for the [lang] segment. Body-only (inside the [lang] layout's document).
export default function LocaleLoading() {
  return (
    <main aria-busy="true">
      <p>Loading…</p>
    </main>
  );
}
