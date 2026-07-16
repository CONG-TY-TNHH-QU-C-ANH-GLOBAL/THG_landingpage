// Parity source: src/components/LanguageSwitcher.tsx
"use client";

import { Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import type { Locale } from "@/shared/i18n";

const langs: { code: Locale; label: string; aria: string }[] = [
  { code: "en", label: "EN", aria: "English" },
  { code: "vi", label: "VI", aria: "Tiếng Việt" },
  { code: "zh", label: "中", aria: "中文" },
];

const LocaleSwitcher = ({ lang }: { lang: Locale }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitch = (code: Locale) => {
    // Strip existing lang prefix (e.g. "/vi/thg-fulfill" → "/thg-fulfill", "/vi" → "")
    const pathWithoutLang = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");
    // usePathname() carries no query/hash — read them from window inside the
    // click handler (client-only) to match Vite's location.search/location.hash.
    router.push(`/${code}${pathWithoutLang}${window.location.search}${window.location.hash}`);
  };

  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center gap-1 bg-secondary/80 rounded-full p-1"
    >
      <Globe className="w-3.5 h-3.5 text-muted-foreground ml-2" aria-hidden="true" />
      {langs.map((l) => {
        const active = lang === l.code;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => handleSwitch(l.code)}
            aria-pressed={active}
            aria-current={active ? "true" : undefined}
            aria-label={`Switch to ${l.aria}`}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
};

export default LocaleSwitcher;
