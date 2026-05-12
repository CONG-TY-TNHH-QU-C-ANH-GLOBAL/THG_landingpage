import { useI18n, Language } from "@/lib/i18n";
import { Globe } from "lucide-react";

const langs: { code: Language; label: string; aria: string }[] = [
  { code: "en", label: "EN", aria: "English" },
  { code: "vi", label: "VI", aria: "Tiếng Việt" },
  { code: "zh", label: "中", aria: "中文" },
];

const LanguageSwitcher = () => {
  const { language, setLanguage } = useI18n();

  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center gap-1 bg-secondary/80 rounded-full p-1"
    >
      <Globe className="w-3.5 h-3.5 text-muted-foreground ml-2" aria-hidden="true" />
      {langs.map((l) => {
        const active = language === l.code;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLanguage(l.code)}
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

export default LanguageSwitcher;
