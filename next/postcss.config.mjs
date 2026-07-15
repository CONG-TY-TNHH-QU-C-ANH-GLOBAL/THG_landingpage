// No PostCSS plugins — the foundation `globals.css` is plain CSS (no Tailwind in FND-001).
// This shadows the repo-root PostCSS/Tailwind config so the isolated build never climbs to it.
const config = { plugins: [] };
export default config;
