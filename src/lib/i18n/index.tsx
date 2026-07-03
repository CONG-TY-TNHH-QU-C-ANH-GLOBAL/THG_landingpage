// i18n runtime: React provider + hook. Translation data lives in
// ./translations/<domain>.ts (one file per page/domain); shared types in
// ./types.ts and the `tr` helper in ./helpers.ts. Public API is unchanged
// from the original single-file module: Language, translations, I18nProvider,
// useI18n (plus tr, now exported for translation files and future callers).

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";

import { useCmsTranslations } from "@/hooks/useCmsContent";

import type { Language } from "./types";
import { translations } from "./translations";

export type { Language, TranslationDict } from "./types";
export { tr } from "./helpers";
export { translations };

interface I18nContextType {
  language: Language;
  effectiveLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tVi: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("vi");

  // Fetch translations from CMS API. Hardcoded `translations` object stays as
  // fallback for offline / initial load before CMS responds. When CMS data
  // arrives, it OVERRIDES the hardcoded values (single source of truth = CMS).
  const cmsQuery = useCmsTranslations(language);

  // Effective lookup map: hardcoded base + CMS overrides
  const effectiveMap = useMemo(() => {
    const base: Record<string, string> = {};
    for (const [key, byLocale] of Object.entries(translations)) {
      base[key] = byLocale[language] || byLocale.en || key;
    }
    if (cmsQuery.data?.translations) {
      Object.assign(base, cmsQuery.data.translations);
    }
    return base;
  }, [language, cmsQuery.data]);

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : language;
  }, [language]);

  // Stable context value: only changes when the language or the effective
  // lookup map changes (setLanguage from useState is referentially stable).
  const value = useMemo<I18nContextType>(() => {
    const t = (key: string): string => effectiveMap[key] ?? key;
    const tVi = (key: string): string => effectiveMap[key] ?? key;
    return { language, effectiveLanguage: language, setLanguage, t, tVi };
  }, [language, effectiveMap]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
};
