import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/top-bar";
import { Card, CardHeader, Badge, Stat } from "@/components/ui-kit";
import { anomalies, districtData } from "@/lib/mock-data";
import { AlertTriangle, ShieldAlert, Banknote, Users } from "lucide-react";

export const Route = createFileRoute("/anomalies")({
  head: () => ({ meta: [{ title: "Ghost Demand Detection — IRV Engine" }] }),
  component: AnomaliesPage,
});

function AnomaliesPage() {
  const max = Math.max(...districtData.map((d) => d.risk));
  return (
    <>
      <TopBar title="Ghost Demand Detection" subtitle="Anomaly intelligence · fraud-pattern recognition" />
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Stat label="Anomalies (30d)" value={anomalies.length} delta="↑ 12 this week" icon={<AlertTriangle className="h-4 w-4" />} tone="danger" />
          <Stat label="Avg Fraud Score" value="78" delta="threshold ≥ 60" icon={<ShieldAlert className="h-4 w-4" />} tone="warning" />
          <Stat label="₹ at Risk" value="₹4.2 Cr" delta="across 18 schools" icon={<Banknote className="h-4 w-4" />} tone="primary" />
          <Stat label="Investigations Open" value="9" delta="3 escalated" icon={<Users className="h-4 w-4" />} tone="teal" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader title="District Risk Heatmap" subtitle="Fraud pattern density" />
            <div className="p-5 grid grid-cols-3 sm:grid-cols-4 gap-2">
              {districtData.map((d) => {
                const intensity = d.risk / max;
                return (
                  <div
                    key={d.district}
                    className="rounded-md p-3 border border-border transition-transform hover:scale-[1.03] cursor-pointer"
                    style={{ background: `color-mix(in oklab, var(--color-destructive) ${intensity * 55}%, var(--color-card))` }}
                  >
                    <div className="text-xs font-medium truncate" style={{ color: intensity > 0.6 ? "white" : undefined }}>{d.district}</div>
                    <div className="text-lg font-semibold tabular-nums mt-1" style={{ color: intensity > 0.6 ? "white" : undefined }}>{d.risk}</div>
                    <div className="text-[10px]" style={{ color: intensity > 0.6 ? "rgba(255,255,255,0.8)" : "var(--color-muted-foreground)" }}>risk score</div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <CardHeader title="Investigation Timeline" />
            <div className="p-5 relative">
              <div className="absolute left-7 top-7 bottom-7 w-px bg-border" />
              <div className="space-y-5">
                {[
                  { t: "Pattern detected", d: "May 12 · 09:14", v: "danger" as const, b: "27 duplicate toilet requests, Kurnool cluster" },
                  { t: "Auto-flagged for review", d: "May 12 · 09:15", v: "warning" as const, b: "Routed to district verification officer" },
                  { t: "Field officer assigned", d: "May 13 · 11:02", v: "info" as const, b: "Officer R. Naidu · 9 schools" },
                  { t: "Site visits in progress", d: "May 14 · ongoing", v: "primary" as const, b: "4 of 9 visited" },
                ].map((s, i) => (
                  <div key={i} className="flex gap-3 relative">
                    <div className="h-3 w-3 rounded-full bg-card border-2 border-primary mt-1 z-10 shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">{s.t}</span>
                        <Badge variant={s.v}>●</Badge>
                      </div>
                      <div className="text-[10px] text-muted-foreground">{s.d}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{s.b}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {anomalies.map((a) => (
            <Card key={a.id} className="p-4 hover:shadow-elevated transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{a.id} · {a.detectedAt}</div>
                  <div className="text-sm font-semibold mt-0.5 truncate">{a.schoolName}</div>
                  <div className="text-[11px] text-muted-foreground">{a.district}</div>
                </div>
                <Badge variant="danger">Score {a.fraudScore}</Badge>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Badge variant="warning">{a.type}</Badge>
                <span className="text-xs font-semibold tabular-nums">₹{(a.amount / 100000).toFixed(1)}L</span>
              </div>
              <div className="mt-3 pt-3 border-t border-border flex gap-2">
                <button className="flex-1 h-8 text-[11px] font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90">Investigate</button>
                <button className="flex-1 h-8 text-[11px] font-medium rounded-md border border-input bg-card hover:bg-muted">Dismiss</button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
