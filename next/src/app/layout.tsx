import type { Metadata } from "next";
import "./globals.css";

// Root layout is a PASS-THROUGH: `<html>`/`<body>` are owned by `[lang]/layout.tsx` so the
// document language reflects the route locale (FND-002). Non-localized renders (the root
// not-found) provide their own `<html>`/`<body>`. No "use client" here or in any layout/page.
// Non-production foundation: noindex so the runtime proof never enters search.
export const metadata: Metadata = {
  title: "THG Public Web — foundation",
  description: "Next.js locale routing foundation (FND-002, ADR-001 Option A). Non-production.",
  robots: { index: false, follow: false },
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return children;
}
