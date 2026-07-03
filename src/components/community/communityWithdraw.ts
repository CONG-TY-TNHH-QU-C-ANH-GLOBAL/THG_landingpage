// Shared owner-withdraw mechanics for community content (Q&A + Reviews):
// token lookup → confirm → CMS withdraw call → forget token → invalidate the
// cached public list → toast → redirect. What stays page-owned (domain, not
// mechanics): which endpoint, which localStorage key, the copy, the redirect
// target, and where the button sits in the layout. The button itself lives in
// communityPageBits.tsx (presentational).

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { forgetOwnerToken, getOwnerToken } from "@/lib/communityOwner";

interface WithdrawOptions {
  /** localStorage key: the slug for questions, reviewOwnerKey(slug) for reviews. */
  ownerKey: string;
  /** CMS withdraw call for this domain, e.g. cmsClient.postCommunityWithdraw. */
  withdraw: (token: string) => Promise<unknown>;
  confirmText: string;
  doneText: string;
  errorText: string;
  /** Public list query key to invalidate so the withdrawn item disappears. */
  listQueryKey: readonly unknown[];
  /** Where to send the (now former) owner after a successful withdrawal. */
  redirectTo: string;
}

export function useCommunityWithdraw(opts: WithdrawOptions) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // Only the browser that submitted the item holds its owner token.
  const [owned, setOwned] = useState(() => Boolean(getOwnerToken(opts.ownerKey)));
  const [pending, setPending] = useState(false);

  async function onWithdraw() {
    const token = getOwnerToken(opts.ownerKey);
    if (!token) return;
    if (!globalThis.confirm(opts.confirmText)) return;
    setPending(true);
    try {
      await opts.withdraw(token);
      forgetOwnerToken(opts.ownerKey);
      setOwned(false);
      // Drop the now-withdrawn item from every cached list variant.
      await queryClient.invalidateQueries({ queryKey: opts.listQueryKey });
      toast.success(opts.doneText);
      navigate(opts.redirectTo);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : opts.errorText);
    } finally {
      setPending(false);
    }
  }

  return { owned, pending, onWithdraw };
}
