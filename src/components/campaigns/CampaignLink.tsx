import { forwardRef, type ReactNode } from "react";
import { Link } from "react-router-dom";

import type { CampaignHref } from "@/lib/campaigns";

interface Props {
  target: CampaignHref;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  "aria-haspopup"?: "true";
}

/** Internal campaign paths go through the router; absolute https URLs stay
 *  plain anchors (same tab — they are THG properties such as the Hub). */
export const CampaignLink = forwardRef<HTMLAnchorElement, Props>(function CampaignLink(
  { target, children, ...rest },
  ref,
) {
  if (target.kind === "external") {
    return (
      <a ref={ref} href={target.href} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link ref={ref} to={target.to} {...rest}>
      {children}
    </Link>
  );
});
