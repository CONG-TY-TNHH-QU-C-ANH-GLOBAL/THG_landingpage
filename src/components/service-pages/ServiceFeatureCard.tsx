// Icon-chip feature card shared by the service pages (Express feature and
// trust grids, Warehouse features): lucide icon in a tinted circle, bold
// title, muted description. Pages own the copy, the grid wrapper, and any
// ScrollReveal. Pass a string as children for plain copy, or an element
// (e.g. <SafeHtml/>) when the i18n value contains markup.

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function ServiceFeatureCard({
  icon: Icon,
  title,
  children,
  align = "center",
  className,
}: Readonly<{
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  align?: "center" | "left";
  className?: string;
}>) {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl p-6 md:p-8 h-full hover-lift flex flex-col",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-5">
        <Icon className="w-7 h-7 text-primary" strokeWidth={1.75} />
      </div>
      <h3 className="text-lg font-bold text-navy mb-3">{title}</h3>
      <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}
