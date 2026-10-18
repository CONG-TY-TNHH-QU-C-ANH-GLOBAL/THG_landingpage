// i18n runtime: React provider + hook. Translation data lives in
// ./translations/<domain>.ts (one file per page/domain); shared types in
// ./types.ts and the `tr` helper in ./helpers.ts.
//
// Only the shell's domains are bundled here. A page's domain registers itself
// when the page imports it (see ./registry.ts), so it ships in that page's
// chunk. The full dictionary (./translations/index.ts) is for the CMS seeding
// script only — importing it here would put every page's copy back in the
// entry bundle.

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";

import { useCmsTranslations } from "@/hooks/useCmsContent";

import type { Language } from "./types";
import { lookupStatic, registerTranslations } from "./registry";
import { navTranslations } from "./translations/nav";
import { contactTranslations } from "./translations/contact";
import { commonTranslations } from "./translations/common";
import { seoTranslations } from "./translations/seo";

export type { Language, TranslationDict } from "./types";
export { tr } from "./helpers";
export { registerTranslations };

// Used by the navbar, footer, contact and consent widgets and every page's
// <SeoHead>, so they are needed before any page chunk loads.
registerTranslations({ ...navTranslations, ...contactTranslations, ...commonTranslations, ...seoTranslations });

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

  // CMS overrides win; the static dictionary is looked up per call, because
  // page domains register after this provider has rendered.
  const overrides = cmsQuery.data?.translations;

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : language;
  }, [language]);

  // Stable context value: only changes when the language or the CMS
  // overrides change (setLanguage from useState is referentially stable).
  const value = useMemo<I18nContextType>(() => {
    const t = (key: string): string => overrides?.[key] ?? lookupStatic(key, language) ?? key;
    return { language, effectiveLanguage: language, setLanguage, t, tVi: t };
  }, [language, overrides]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
};
