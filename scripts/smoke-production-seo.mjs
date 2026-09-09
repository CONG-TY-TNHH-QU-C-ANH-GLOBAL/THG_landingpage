const site = (process.env.SITE_BASE ?? "https://thgfulfill.com").replace(/\/$/, "");
const routes = ["/vi", "/en/thg-express", "/vi/domestic-pricing"];
const failures = [];

for (const route of routes) {
  const response = await fetch(`${site}${route}`, { redirect: "follow", headers: { "cache-control": "no-cache" } });
  const html = await response.text();
  if (!response.ok) failures.push(`${route}: HTTP ${response.status}`);
  for (const [label, pattern] of [
    ["title", /<title(?:\s[^>]*)?>[\s\S]*?<\/title>/gi],
    ["description", /<meta\s+[^>]*name=["']description["'][^>]*>/gi],
    ["canonical", /<link\s+[^>]*rel=["']canonical["'][^>]*>/gi],
    ["robots", /<meta\s+[^>]*name=["']robots["'][^>]*>/gi],
    ["H1", /<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/gi],
  ]) {
    const count = [...html.matchAll(pattern)].length;
    if (count !== 1) failures.push(`${route}: ${label} count is ${count}`);
  }
  if (html.length < 10_000) failures.push(`${route}: response resembles SPA shell (${html.length} bytes)`);
}

for (const [url, expected] of [
  ["http://thgfulfill.com/", `${site}/vi`],
  ["https://www.thgfulfill.com/en/", `${site}/en`],
]) {
  const response = await fetch(url, { redirect: "follow" });
  if (response.url.replace(/\/$/, "") !== expected) failures.push(`${url}: resolved to ${response.url}, expected ${expected}`);
}

const missing = await fetch(`${site}/vi/seo-smoke-route-that-must-not-exist`, { redirect: "manual" });
if (missing.status !== 404) failures.push(`unknown route: expected 404, got ${missing.status}`);

if (failures.length) {
  console.error(`Production SEO smoke failed:\n${failures.map((item) => ` - ${item}`).join("\n")}`);
  process.exit(1);
}
console.log("✓ Production SEO smoke passed");
