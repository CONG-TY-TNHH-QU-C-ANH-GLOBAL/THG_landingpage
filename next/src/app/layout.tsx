import type { Metadata } from "next";
import "./globals.css";

// Root Server Component layout. No "use client" here or in any layout/page (FND-001 §11).
// Non-production foundation: noindex so the runtime proof never enters search.
export const metadata: Metadata = {
  title: "THG Public Web — foundation",
  description: "Next.js application foundation (FND-001, ADR-001 Option A). Non-production runtime proof.",
  robots: { index: false, follow: false },
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
