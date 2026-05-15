import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  School as SchoolIcon,
  Brain,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Map,
  Bot,
  GitBranch,
  Activity,
} from "lucide-react";

const items = [
  { to: "/", label: "Executive Dashboard", icon: LayoutDashboard },
  { to: "/schools", label: "School Profiles", icon: SchoolIcon },
  { to: "/forecasting", label: "AI Forecasting", icon: Brain },
  { to: "/validation", label: "Demand Validation", icon: ShieldCheck },
  { to: "/anomalies", label: "Ghost Demand Detection", icon: AlertTriangle },
  { to: "/recommendations", label: "Recommendation Engine", icon: Sparkles },
  { to: "/map", label: "GIS School Map", icon: Map },
  { to: "/assistant", label: "AI Verification Assistant", icon: Bot },
  { to: "/workflow", label: "Workflow Tracking", icon: GitBranch },
] as const;

export function AppSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="px-5 py-5 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-teal grid place-items-center shadow-soft">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-sidebar-foreground">IRV Engine</div>
            <div className="text-[11px] text-muted-foreground">Andhra Pradesh · School Edu.</div>
          </div>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        <div className="px-2 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </div>
        {items.map((it) => {
          const active = path === it.to;
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
              <span className="truncate">{it.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-sidebar-border">
        <div className="rounded-lg border border-sidebar-border bg-card p-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-accent grid place-items-center text-xs font-semibold text-accent-foreground">
              AS
            </div>
            <div className="leading-tight">
              <div className="text-xs font-medium">Anil Sharma</div>
              <div className="text-[10px] text-muted-foreground">Dy. Director · Planning</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
