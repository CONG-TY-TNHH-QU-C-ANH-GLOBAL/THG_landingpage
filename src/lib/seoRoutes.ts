import type { Language } from "@/lib/i18n/types";

export const SITE_BASE = "https://thgfulfill.com";

export function normalizeSeoPath(path: string): string {
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  if (withLeadingSlash === "/") return "";
  return withLeadingSlash.replace(/\/+$/, "");
}

export function localizedUrl(locale: Language, path: string): string {
  return `${SITE_BASE}/${locale}${normalizeSeoPath(path)}`;
}

export function hrefLang(locale: Language): string {
  return locale === "zh" ? "zh-CN" : locale;
}
