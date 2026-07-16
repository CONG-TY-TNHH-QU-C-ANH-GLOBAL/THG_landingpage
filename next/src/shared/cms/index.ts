// Public surface of the CMS adapter foundation (FND-004). This barrel re-exports the
// server-only `cmsFetch`, so importing it from a Client Component is a build error — clients
// that only need the error taxonomy must deep-import "@/shared/cms/errors" instead
// (CODE_STRUCTURE "Import boundaries").
export { cmsFetch } from "./cmsFetch";
export type { CmsFetchOptions } from "./cmsFetch";
export {
  CmsError,
  CmsHttpError,
  CmsShapeError,
  CmsParseError,
  CmsNetworkError,
  isCmsNotFound,
} from "./errors";
