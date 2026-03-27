import { useI18n, Language } from "@/lib/i18n";
import { Globe } from "lucide-react";

const langs: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "vi", label: "VI" },
  { code: "zh", label: "中" },
];

const LanguageSwitcher = () => {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex items-center gap-1 bg-secondary/80 rounded-full p-1">
      <Globe className="w-3.5 h-3.5 text-muted-foreground ml-2" />
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => setLanguage(l.code)}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
            language === l.code
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
