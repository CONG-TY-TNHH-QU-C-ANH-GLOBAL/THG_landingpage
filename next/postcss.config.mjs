// Tailwind pipeline for the ported marketing UI (WEB-001). Shadows the repo-root config so
// the isolated next/ build never climbs to it.
const config = { plugins: { tailwindcss: {}, autoprefixer: {} } };
export default config;
