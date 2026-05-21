# THG Fulfill — Landing Page

> **AI Context Note:** This is the **company landing page for THGFulfill** (thgfulfill.com), a Vietnamese fulfillment & print-on-demand service. All editable content (blog posts, hero text, services, translations, etc.) is driven by a **headless CMS** at `https://cms.thgfulfill.com/api/v1`. The frontend is a React + TypeScript SPA — you are working on the frontend repo only, not the CMS backend.

---

## Project Purpose

Landing page for **THG Fulfill** — a logistics/fulfillment company offering:
- Print-on-demand & dropshipping (THG Fulfill service)
- International express shipping (THG Express)
- Domestic warehousing (THG Warehouse)

Target audience: Vietnamese e-commerce sellers on Shopee, TikTok Shop, Etsy, Amazon, etc.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript 5 |
| Build tool | Vite 5 + SWC |
| Styling | Tailwind CSS + shadcn/ui |
| Animation | Framer Motion |
| Icons | Lucide React |
| Routing | React Router 6 (lazy-loaded pages) |
| Data fetching | TanStack React Query 5 |
| Schema validation | Zod 4 |
| i18n | Custom (en / vi / zh) via `src/lib/i18n.tsx` |
| Testing | Vitest + Playwright |

---

## CMS Integration

All dynamic content is fetched from the **THGFulfill CMS REST API**:

| Env | Base URL |
|---|---|
| Development | `http://localhost:8080/api/v1` |
| Production | `https://cms.thgfulfill.com/api/v1` |

Set via `VITE_CMS_API_URL` in `.env`.

**Key CMS data consumed:**
- Blog posts & slides (`/blog-posts`, `/blog-posts/:slug`)
- Services section content
- Hero section copy
- Site settings (video URL, contact info)
- Pricing data (international & domestic)
- Translations / i18n overrides

**Key files:**
- `src/lib/cmsClient.ts` — fetch wrapper for all CMS endpoints
- `src/lib/cmsSchemas.ts` — Zod schemas validating every CMS response
- `src/hooks/useCmsContent.ts` — all React Query hooks (5-min stale / 30-min GC)
- `src/config/cmsAssets.ts` — CMS asset URL helpers

---

## Project Structure

```
src/
  components/       # Shared UI sections (Navbar, Hero, Contact, etc.)
  pages/            # Route-level pages (lazy loaded)
  hooks/            # useCmsContent.ts — all CMS data hooks
  lib/              # API client, schemas, i18n, utilities
  config/           # CMS asset config
  stores/           # Zustand stores (pricing)
  assets/           # Static images/videos
public/             # robots.txt, sitemap, manifest, sw.js
scripts/            # Build/export utilities (sitemap gen, i18n SQL export, etc.)
tests/              # Playwright e2e tests
```

---

## Key Pages & Routes

| Route | File | Notes |
|---|---|---|
| `/` | `src/pages/Index.tsx` | Homepage |
| `/thg-fulfill` | `src/pages/THGFulfillPage.tsx` | POD & fulfillment service; has custom `HubSystemGuide` component (hardcoded, no CMS) |
| `/thg-express` | `src/pages/THGExpressPage.tsx` | Express shipping service |
| `/thg-warehouse` | `src/pages/THGWarehousePage.tsx` | Warehousing service |
| `/blog` | `src/pages/BlogPage.tsx` | Blog listing |
| `/blog/:slug` | `src/pages/BlogDetailPage.tsx` | Blog detail — slides from CMS |
| `/pricing/international` | `src/pages/InternationalPricingPage.tsx` | |
| `/pricing/domestic` | `src/pages/DomesticPricingPage.tsx` | |
| `/careers` | `src/pages/CareersPage.tsx` | |
| `/policy` | `src/pages/PolicyPage.tsx` | |

---

## Recent Intentional Changes (from original source)

These are deliberate modifications — do **not** revert them:

1. **`src/components/AboutVideoSection.tsx`** — `FALLBACK_VIDEO_ID` changed to `"AzlW2irPANQ"`
2. **`src/components/Navbar.tsx`** — CTA button changed from "Tư vấn ngay" (LeadFormDialog) to **"Hub System"** link → `https://hub.thgfulfill.com`
3. **`src/components/ContactSection.tsx`** — "Submit Inquiry" button replaced with **Facebook / YouTube / TikTok** social links
4. **`src/pages/THGFulfillPage.tsx`** — Section I video changed to `"AzlW2irPANQ"`; old Ecount ERP section & HUB Fulfill dashboard section removed; replaced with a new **`HubSystemGuide`** component (sticky sidebar nav, 6 sections: Dashboard / Orders / Catalog / Billing / Support / Account)
5. **`src/lib/cmsSchemas.ts`** — `blogPostSlideSchema.alt_text` made `.nullable()` to handle CMS returning `null`

---

## Development

```bash
npm install
npm run dev          # Vite dev server → http://localhost:5173
npm run build        # Production build
npm run test         # Vitest unit tests
npm run test:e2e     # Playwright e2e tests
```

---

## Environment Variables

```env
VITE_CMS_API_URL=https://cms.thgfulfill.com/api/v1
VITE_TURNSTILE_SITE_KEY=...
```

---

## Known Issues / TODO

- [ ] `BlogDetailPage.tsx`: When CMS returns `slides: []` (empty array), the page shows a broken image and "Slide 1 / 0". Fix: fall back to `thumbnail_url` and hide slide navigation controls when slides are empty.

