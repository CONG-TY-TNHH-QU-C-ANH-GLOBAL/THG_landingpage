"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";
import type { Locale } from "@/shared/i18n";

import { withdrawQuestion, withdrawReview } from "./community-api";
import { forgetOwnerToken, getOwnerToken, reviewOwnerKey } from "./owner-store";
import { useStoredFlag } from "./use-stored-flag";
import { communityErrorMessage } from "./api-error-copy";

// Owner-only withdraw. The button renders only in the browser that submitted the item and
// only while its token is still in local storage — there is no login, and no new auth
// scheme is introduced.
//
// The token is read at click time and handed straight to the API, which puts it in a POST
// body. It never reaches a URL, query param, cookie, header, analytics event or log line.

export function WithdrawButton({
  slug,
  kind,
  lang,
  copy,
}: Readonly<{ slug: string; kind: "question" | "review"; lang: Locale; copy: MarketingCopy }>) {
  const t = tFrom(copy);
  const router = useRouter();
  const [pending, setPending] = useState(false);
  // A successful withdraw clears the token in this tab, which raises no `storage` event
  // here, so the button is hidden explicitly rather than waiting for a re-read.
  const [withdrawn, setWithdrawn] = useState(false);

  const ownerKey = kind === "review" ? reviewOwnerKey(slug) : slug;
  const isReview = kind === "review";

  // The server renders no button at all — local storage does not exist during SSR — and
  // the owner's browser reveals it on hydration.
  const owned = useStoredFlag(useCallback(() => getOwnerToken(ownerKey) !== null, [ownerKey]));

  async function onClick() {
    const token = getOwnerToken(ownerKey);
    if (!token) return;
    if (!globalThis.confirm(t(isReview ? "reviews.withdraw_confirm" : "community.withdraw_confirm"))) return;

    setPending(true);
    try {
      await (isReview ? withdrawReview(slug, token) : withdrawQuestion(slug, token));
      forgetOwnerToken(ownerKey);
      setWithdrawn(true);
      toast.success(t(isReview ? "reviews.withdraw_done" : "community.withdraw_done"));
      // The item now 404s, so stay off the detail route. refresh() drops it from the
      // server-rendered list too, which a plain push would otherwise serve from cache.
      router.push(`/${lang}/community${isReview ? "/reviews" : ""}`);
      router.refresh();
    } catch (err) {
      // A refusal is deliberately indistinguishable from "no such item" server-side, so
      // there is exactly one message — ownership failures reveal nothing about existence.
      toast.error(communityErrorMessage(err, t));
    } finally {
      setPending(false);
    }
  }

  if (!owned || withdrawn) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      disabled={pending}
      onClick={onClick}
      className="gap-2 text-destructive hover:text-destructive"
    >
      <Trash2 className="h-4 w-4" aria-hidden="true" />
      {t(isReview ? "reviews.withdraw" : "community.withdraw")}
    </Button>
  );
}
