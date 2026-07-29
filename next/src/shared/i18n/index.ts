// Public surface of shared/i18n. Client-safe: the server-only dictionary loader is NOT
// re-exported here — server code imports it directly from `./server/get-dictionary` so this
// index never pulls `server-only` into a client bundle.
export {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  HTML_LANG,
  isSupportedLocale,
  assertSupportedLocale,
  type Locale,
} from "./config/locales";

export { decodeLocaleRoute, LOCALE_REDIRECT_STATUS, type LocaleRouteDecision } from "./config/locale-routing";

export type { LocaleRouteParams } from "./model/locale";
export type { Dictionary, ReadonlyDictionary } from "./model/dictionary";

export { tr, localize, type LocalizedText } from "./localized-text";
