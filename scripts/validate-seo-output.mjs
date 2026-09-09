import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const dist = resolve(root, "dist");
const reportPath = resolve(dist, "seo-build-report.json");
const registry = JSON.parse(
  readFileSync(resolve(root, "scripts", "seo-route-registry.json"), "utf8"),
);

if (!existsSync(reportPath)) {
  throw new Error("dist/seo-build-report.json is missing; prerender did not complete");
}

const report = JSON.parse(readFileSync(reportPath, "utf8"));
const errors = [];

function fileFor(route) {
  return resolve(dist, route.replace(/^\//, ""), "index.html");
}

function matches(html, pattern) {
  return [...html.matchAll(pattern)];
}

for (const route of report.rendered) {
  const file = fileFor(route);
  if (!existsSync(file)) {
    errors.push(`${route}: prerender file is missing`);
    continue;
  }
  const html = readFileSync(file, "utf8");
  const crawlableText = html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<[^>]+>/g, " ");
  const checks = [
    ["title", /<title(?:\s[^>]*)?>[\s\S]*?<\/title>/gi],
    ["description", /<meta\s+[^>]*name=["']description["'][^>]*>/gi],
    ["canonical", /<link\s+[^>]*rel=["']canonical["'][^>]*>/gi],
    ["robots", /<meta\s+[^>]*name=["']robots["'][^>]*>/gi],
  ];
  for (const [name, pattern] of checks) {
    const count = matches(html, pattern).length;
    if (count !== 1) errors.push(`${route}: expected one ${name}, found ${count}`);
  }

  const h1Count = matches(html, /<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/gi).length;
  if (h1Count !== 1) errors.push(`${route}: expected one H1, found ${h1Count}`);

  const canonicalMatch = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)
    ?? html.match(/<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i);
  const expectedCanonical = `${registry.siteBase}${route}`;
  if (canonicalMatch?.[1] !== expectedCanonical) {
    errors.push(`${route}: canonical is ${canonicalMatch?.[1] ?? "missing"}; expected ${expectedCanonical}`);
  }

  const currentLocale = route.split("/")[1];
  const currentHrefLang = currentLocale === "zh" ? "zh-CN" : currentLocale;
  if (!new RegExp(`hreflang=["']${currentHrefLang}["']`, "i").test(html)) {
    errors.push(`${route}: current-locale hreflang is missing`);
  }
  if (!/hreflang=["']x-default["']/i.test(html)) {
    errors.push(`${route}: x-default hreflang is missing`);
  }
  if (/name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) {
    errors.push(`${route}: published prerender unexpectedly contains noindex`);
  }
  if (html.length < 10_000 || !/<a\s+[^>]*href=/i.test(html)) {
    errors.push(`${route}: output still resembles an empty SPA shell`);
  }
  if (/<main[^>]*style=["'][^"']*opacity:\s*0/i.test(html)) {
    errors.push(`${route}: main content is hidden with opacity:0`);
  }
  if (/Trustpilot|\bG2\b|Compliance Placeholder|Placeholder Rating/i.test(crawlableText)) {
    errors.push(`${route}: unverified trust placeholder is present`);
  }
}

if (report.strict && report.failures.length > 0) {
  errors.push(...report.failures.map((failure) => `${failure.route}: ${failure.msg}`));
}

if (errors.length > 0) {
  console.error(`SEO artifact validation failed (${errors.length} issue(s)):\n${errors.map((e) => ` - ${e}`).join("\n")}`);
  process.exit(1);
}

console.log(`✓ SEO artifact validated for ${report.rendered.length} routes`);
