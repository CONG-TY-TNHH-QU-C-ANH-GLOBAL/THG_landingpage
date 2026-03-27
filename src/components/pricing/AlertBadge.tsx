import { ReactNode } from "react";

type BadgeType = "success" | "info" | "warning" | "error" | "gold";

interface AlertBadgeProps {
  type?: BadgeType;
  icon?: string;
  children: ReactNode;
}

const themeMap: Record<BadgeType, string> = {
  success: "bg-primary/10 text-primary border-primary/30",
  info: "bg-accent/10 text-accent border-accent/30",
  warning: "bg-gold/10 text-gold border-gold/30",
  error: "bg-destructive/10 text-destructive border-destructive/30",
  gold: "bg-gold/10 text-gold-dark border-gold/30",
};

const AlertBadge = ({ type = "success", icon, children }: AlertBadgeProps) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${themeMap[type]}`}>
    {icon && <span>{icon}</span>}
    {children}
  </span>
);

export default AlertBadge;
