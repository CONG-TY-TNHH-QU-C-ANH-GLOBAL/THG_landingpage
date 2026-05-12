// One-shot image optimizer for LCP-critical and bandwidth-heavy assets.
// For each source, writes AVIF + WebP siblings next to the original.
// Re-run after replacing source files; output filenames stay stable so the
// Vite asset pipeline rehashes them automatically.
//
//   bun run scripts/optimize-hero-images.mjs

import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

import sharp from "sharp";

const ROOT = process.cwd();

// (source, max width) — preserves aspect ratio. `width` above the original
// is a no-op (sharp respects withoutEnlargement).
//
// Only LCP-critical / branding assets that we *want* shipped with the bundle
// belong here. Marketing illustrations and testimonial avatars are CMS-served
// (operator-editable) and resolved through the media pipeline, so they don't
// need a build-time optimization pass.
const TARGETS = [
  { src: "src/assets/globe-3d.png", width: 1024 },
];

async function convert({ src, width }) {
  const inputPath = resolve(ROOT, src);
  if (!existsSync(inputPath)) {
    console.warn(`⚠ skip ${src} — file not found`);
    return;
  }
  const base = inputPath.replace(/\.[^.]+$/, "");

  await sharp(inputPath).resize({ width, withoutEnlargement: true }).avif({ quality: 60 }).toFile(`${base}.avif`);
  await sharp(inputPath).resize({ width, withoutEnlargement: true }).webp({ quality: 78 }).toFile(`${base}.webp`);

  const original = statSync(inputPath).size;
  const avif = statSync(`${base}.avif`).size;
  const webp = statSync(`${base}.webp`).size;
  const fmt = (n) => `${(n / 1024).toFixed(1)} KB`;
  console.log(`✓ ${src}`);
  console.log(`    src  ${fmt(original)}  (baseline)`);
  console.log(`    WebP ${fmt(webp)}  (-${(100 - (webp / original) * 100).toFixed(0)}%)`);
  console.log(`    AVIF ${fmt(avif)}  (-${(100 - (avif / original) * 100).toFixed(0)}%)`);
}

for (const t of TARGETS) {
  // eslint-disable-next-line no-await-in-loop
  await convert(t);
}
