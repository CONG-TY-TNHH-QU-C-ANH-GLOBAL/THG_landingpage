// Composed static translation dictionary (EN/VI/ZH), split by page/domain.
// Exported so a one-shot CMS import script can read this dictionary and
// generate a migration that seeds D1 `translations` with the same values.
// Operator can then override per-key via /admin/content/translations and
// landing's `useCmsTranslations` hook merges the override over this static
// fallback.

import type { TranslationDict } from "../types";
import { navTranslations } from "./nav";
import { homepageTranslations } from "./homepage";
import { contactTranslations } from "./contact";
import { expressTranslations } from "./express";
import { fulfillTranslations } from "./fulfill";
import { warehouseTranslations } from "./warehouse";
import { orderTranslations } from "./order";
import { careersTranslations } from "./careers";
import { communityTranslations } from "./community";
import { pricingTranslations } from "./pricing";
import { shippingTranslations } from "./shipping";
import { blogTranslations } from "./blog";
import { catalogTranslations } from "./catalog";
import { seoTranslations } from "./seo";
import { commonTranslations } from "./common";

export const translations: TranslationDict = {
  ...navTranslations,
  ...homepageTranslations,
  ...contactTranslations,
  ...expressTranslations,
  ...fulfillTranslations,
  ...warehouseTranslations,
  ...orderTranslations,
  ...careersTranslations,
  ...communityTranslations,
  ...pricingTranslations,
  ...shippingTranslations,
  ...blogTranslations,
  ...catalogTranslations,
  ...seoTranslations,
  ...commonTranslations,
};
