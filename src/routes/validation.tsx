import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/top-bar";
import { Card, CardHeader, Badge } from "@/components/ui-kit";
import { requests } from "@/lib/mock-data";
import { useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Clock, Search, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/validation")({
  head: () => ({ meta: [{ title: "Demand Validation Workflow — IRV Engine" }] }),
  component: ValidationPage,
});

const statusMap = {
  approved: { v: "success" as const, icon: CheckCircle2, label: "Approved" },
  flagged: { v: "warning" as const, icon: AlertTriangle, label: "Flagged" },
  rejected: { v: "danger" as const, icon: XCircle, label: "Rejected" },
  verification: { v: "info" as const, icon: Search, label: "Field Verification" },
  pending: { v: "neutral" as const, icon: Clock, label: "Pending" },
};

function ValidationPage() {
  const [filter, setFilter] = useState<"all" | keyof typeof statusMap>("all");
  const [selected, setSelected] = useState(requests[0].id);
  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);
  const r = requests.find((x) => x.id === selected) || requests[0];
  const Icon = statusMap[r.status].icon;

  return (
    <>
      <TopBar title="Demand Validation Workflow" subtitle="AI-assisted review of infrastructure requests" />
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          {(["all", ...Object.keys(statusMap)] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k as typeof filter)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                filter === k ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-muted"
              }`}
            >
              {k === "all" ? "All requests" : statusMap[k as keyof typeof statusMap].label}
              <span className="ml-1.5 opacity-70">
                {k === "all" ? requests.length : requests.filter((r) => r.status === k).length}
              </span>
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/40">
                    <th className="text-left font-medium px-5 py-2.5">Request</th>
                    <th className="text-left font-medium py-2.5">School</th>
                    <th className="text-right font-medium py-2.5">Cost (₹)</th>
                    <th className="text-right font-medium py-2.5">AI Conf.</th>
                    <th className="text-left font-medium py-2.5 pl-4 pr-5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((req) => {
                    const sm = statusMap[req.status];
                    return (
                      <tr
                        key={req.id}
                        onClick={() => setSelected(req.id)}
                        className={`border-b border-border last:border-0 cursor-pointer transition-colors ${
                          selected === req.id ? "bg-accent/40" : "hover:bg-muted/30"
                        }`}
                      >
                        <td className="px-5 py-3">
                          <div className="font-medium text-xs">{req.id}</div>
                          <div className="text-[11px] text-muted-foreground">{req.type}</div>
                        </td>
                        <td className="text-xs text-muted-foreground max-w-[220px] truncate">{req.schoolName}</td>
                        <td className="text-right tabular-nums text-xs">{(req.cost / 100000).toFixed(1)}L</td>
                        <td className="text-right tabular-nums text-xs font-medium">{req.confidence}%</td>
                        <td className="pl-4 pr-5">
                          <Badge variant={sm.v}>{sm.label}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="self-start">
            <CardHeader title="AI Reasoning Panel" subtitle={r.id} right={<Badge variant={statusMap[r.status].v}><Icon className="h-3 w-3" />{statusMap[r.status].label}</Badge>} />
            <div className="px-5 pb-5 space-y-4">
              <div>
                <div className="text-[11px] uppercase text-muted-foreground tracking-wider">School</div>
                <div className="text-sm font-medium mt-0.5">{r.schoolName}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md border border-border p-2.5">
                  <div className="text-[10px] uppercase text-muted-foreground">Type</div>
                  <div className="text-xs font-medium mt-0.5">{r.type}</div>
                </div>
                <div className="rounded-md border border-border p-2.5">
                  <div className="text-[10px] uppercase text-muted-foreground">Cost</div>
                  <div className="text-xs font-medium mt-0.5 tabular-nums">₹{(r.cost / 100000).toFixed(2)}L</div>
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">Model confidence</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-teal" style={{ width: `${r.confidence}%` }} />
                  </div>
                  <span className="text-xs font-semibold tabular-nums">{r.confidence}%</span>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <ShieldCheck className="h-3 w-3" /> Reasoning
                </div>
                <p className="text-xs mt-1.5 leading-relaxed">{r.reason}</p>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">Policy compliance</div>
                <div className="flex flex-wrap gap-1.5">
                  {r.policyTags.length ? r.policyTags.map((p) => <Badge key={p} variant="primary">{p}</Badge>) : <span className="text-[11px] text-muted-foreground">None matched</span>}
                </div>
              </div>
              <div className="flex gap-2 pt-2 border-t border-border">
                <button className="flex-1 h-9 rounded-md bg-success text-success-foreground text-xs font-medium hover:opacity-90 transition-opacity">Approve</button>
                <button className="flex-1 h-9 rounded-md bg-destructive text-destructive-foreground text-xs font-medium hover:opacity-90 transition-opacity">Reject</button>
                <button className="flex-1 h-9 rounded-md border border-input bg-card text-xs font-medium hover:bg-muted transition-colors">Field verify</button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
