"use client";

import { toast } from "sonner";
import { Share2 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";

// Share Loop campaign constants — they identify community shares in analytics and are not
// environment-specific, so they live here rather than in env.
const SHARE_UTM = "utm_source=community&utm_medium=share&utm_campaign=community_share";

/** Copies the canonical share URL to the clipboard. `location.origin` is deliberate: a
 *  share from a preview host must copy that host, not the production canonical. */
export function ShareButton({ path, copy }: Readonly<{ path: string; copy: MarketingCopy }>) {
  const t = tFrom(copy);

  async function onClick() {
    try {
      await navigator.clipboard.writeText(`${globalThis.location.origin}${path}?${SHARE_UTM}`);
      toast.success(t("community.share_copied"));
    } catch {
      // Insecure context or a denied permission — nothing recoverable to report.
      toast.error(t("community.form_err_generic"));
    }
  }

  return (
    <Button type="button" variant="outline" onClick={onClick} className="gap-2">
      <Share2 className="h-4 w-4" aria-hidden="true" />
      {t("community.share")}
    </Button>
  );
}
