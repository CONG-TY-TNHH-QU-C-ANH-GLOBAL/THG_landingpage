// Minimal non-production foundation page. Server Component; composes nothing yet.
// Locale routes, CMS/catalog data and homepage parity are out of scope for FND-001.
export const dynamic = "force-static";

export default function FoundationPage() {
  return (
    <main>
      <h1>THG Public Web — foundation</h1>
      <p>
        Next.js runtime proof (FND-001, ADR-001 Option A). This application is
        non-production; production traffic remains on the existing Vite application until the
        M10 cutover.
      </p>
    </main>
  );
}
