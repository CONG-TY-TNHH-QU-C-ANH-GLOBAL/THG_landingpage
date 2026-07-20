"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Users } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";

import { reactSameIssue } from "./community-api";
import { hasReacted, rememberReacted } from "./owner-store";
import { useStoredFlag } from "./use-stored-flag";
import { communityErrorMessage } from "./api-error-copy";

// "Same issue" reaction. Server-side dedupe is by hashed IP and is the real authority;
// the local record only stops the button re-offering itself on a revisit.

export function SameIssueButton({
  slug,
  initialCount,
  copy,
}: Readonly<{ slug: string; initialCount: number; copy: MarketingCopy }>) {
  const t = tFrom(copy);
  const [count, setCount] = useState(initialCount);
  const [pending, setPending] = useState(false);
  // Reacting does not raise a `storage` event in the tab that wrote it, so this tab's own
  // click is tracked separately from the stored record.
  const [justReacted, setJustReacted] = useState(false);
  // Keyed on slug so a client-side navigation between questions re-evaluates.
  const storedReacted = useStoredFlag(useCallback(() => hasReacted(slug), [slug]));
  const reacted = storedReacted || justReacted;

  async function onClick() {
    setPending(true);
    try {
      // Not optimistic: the server returns the authoritative count, and a duplicate is a
      // successful no-op (deduped: true) rather than an error, so there is nothing to
      // roll back and nothing to gain from guessing.
      const { count: next } = await reactSameIssue(slug);
      setCount(next);
      setJustReacted(true);
      rememberReacted(slug);
      toast.success(t("community.same_issue_done"));
    } catch (err) {
      toast.error(communityErrorMessage(err, t));
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant={reacted ? "secondary" : "default"}
      disabled={reacted || pending}
      onClick={onClick}
      className="gap-2"
    >
      <Users className="h-4 w-4" aria-hidden="true" />
      {reacted ? t("community.same_issue_done") : t("community.same_issue")}
      {count > 0 && <span className="font-bold">({count})</span>}
    </Button>
  );
}
