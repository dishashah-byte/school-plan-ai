import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-card shadow-card ${className}`}>{children}</div>
  );
}

export function CardHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
      <div className="min-w-0">
        <h3 className="text-sm font-semibold">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

const variants = {
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/15 text-warning-foreground border-warning/30",
  danger: "bg-destructive/10 text-destructive border-destructive/20",
  info: "bg-info/10 text-info border-info/20",
  neutral: "bg-muted text-muted-foreground border-border",
  primary: "bg-primary/10 text-primary border-primary/20",
  teal: "bg-teal/15 text-teal-foreground border-teal/30",
} as const;

export function Badge({
  children,
  variant = "neutral",
  className = "",
}: {
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Stat({
  label,
  value,
  delta,
  icon,
  tone = "primary",
}: {
  label: string;
  value: string | number;
  delta?: string;
  icon?: ReactNode;
  tone?: "primary" | "teal" | "success" | "warning" | "danger";
}) {
  const tones = {
    primary: "from-primary/10 to-primary/0 text-primary",
    teal: "from-teal/15 to-teal/0 text-teal-foreground",
    success: "from-success/15 to-success/0 text-success",
    warning: "from-warning/20 to-warning/0 text-warning-foreground",
    danger: "from-destructive/15 to-destructive/0 text-destructive",
  };
  return (
    <Card className="p-4 hover:shadow-elevated transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
            {label}
          </div>
          <div className="text-2xl font-semibold mt-1.5 tracking-tight">{value}</div>
          {delta && <div className="text-[11px] text-muted-foreground mt-1">{delta}</div>}
        </div>
        {icon && (
          <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${tones[tone]} grid place-items-center`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

export function RiskBadge({ level }: { level: "critical" | "high" | "moderate" | "low" }) {
  const map = {
    critical: { v: "danger" as const, label: "Critical" },
    high: { v: "warning" as const, label: "High" },
    moderate: { v: "info" as const, label: "Moderate" },
    low: { v: "success" as const, label: "Low" },
  };
  return <Badge variant={map[level].v}>{map[level].label}</Badge>;
}
