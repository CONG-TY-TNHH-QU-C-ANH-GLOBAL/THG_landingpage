import type { CmsSiteSettingsResponse } from "@/shared/cms/schemas";
import type { SiteSettings } from "../models/siteSettings";

// Contact-link derivations ported from the Vite FloatingContact
// [FACT: src/components/FloatingContact.tsx:20-35,57-60] — behavior-identical (one redundant
// startsWith("84") branch folded away) — pure, so they live in the mapper per WEB-001 SPEC §7
// ("SiteContactModel … derived per FloatingContact.tsx").

/** Strip non-digits and rewrite VN local prefix `0…` → `84…`. */
function normalizePhone(raw: string | null): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("0")) return `84${digits.slice(1)}`;
  return digits;
}

/** facebook.com/Page → m.me/Page so the button drops the user straight into Messenger. */
function messengerFromFacebook(fbUrl: string | null): string | null {
  if (!fbUrl) return null;
  const m = /facebook\.com\/([^/?#]+)/i.exec(fbUrl);
  return m ? `https://m.me/${m[1]}` : null;
}

export const EMPTY_SITE_SETTINGS: SiteSettings = Object.freeze({
  telUrl: null,
  zaloUrl: null,
  messengerUrl: null,
  aboutVideoUrl: null,
});

export function siteSettingsFromDto(dto: CmsSiteSettingsResponse): SiteSettings {
  const settings = dto.settings;
  if (!settings) return EMPTY_SITE_SETTINGS;
  const phone = normalizePhone(settings.contact_phone);
  return {
    telUrl: phone ? `tel:+${phone}` : null,
    zaloUrl: phone ? `https://zalo.me/${phone}` : null,
    messengerUrl: messengerFromFacebook(settings.facebook_url),
    aboutVideoUrl: settings.about_video_url,
  };
}
