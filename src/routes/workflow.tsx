import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/top-bar";
import { Card, CardHeader, Badge } from "@/components/ui-kit";
import { workflowStages, requests } from "@/lib/mock-data";
import { CheckCircle2, Loader2, Circle } from "lucide-react";

export const Route = createFileRoute("/workflow")({
  head: () => ({ meta: [{ title: "Workflow Tracking — IRV Engine" }] }),
  component: WorkflowPage,
});

function WorkflowPage() {
  const tracked = requests.slice(0, 4);
  return (
    <>
      <TopBar title="Workflow Tracking" subtitle="Lifecycle of every infrastructure request" />
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader title={`REQ-5000 · New Classrooms`} subtitle="ZP High School, Amaravati · ₹18.4L sanctioned" right={<Badge variant="primary">In progress</Badge>} />
          <div className="px-5 pb-6 pt-2">
            <div className="relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
              <div className="absolute top-5 left-0 h-0.5 bg-primary" style={{ width: "60%" }} />
              <div className="relative grid grid-cols-7 gap-2">
                {workflowStages.map((st, i) => {
                  const Icon = st.status === "complete" ? CheckCircle2 : st.status === "current" ? Loader2 : Circle;
                  const cls =
                    st.status === "complete"
                      ? "bg-primary text-primary-foreground border-primary"
                      : st.status === "current"
                      ? "bg-card text-primary border-primary animate-pulse"
                      : "bg-card text-muted-foreground border-border";
                  return (
                    <div key={i} className="flex flex-col items-center text-center">
                      <div className={`h-10 w-10 rounded-full grid place-items-center border-2 z-10 ${cls}`}>
                        <Icon className={`h-4 w-4 ${st.status === "current" ? "animate-spin" : ""}`} />
                      </div>
                      <div className="text-[11px] font-medium mt-2 leading-tight">{st.stage}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{st.date}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {tracked.map((r) => (
            <Card key={r.id} className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.id}</div>
                  <div className="text-sm font-semibold">{r.type}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{r.schoolName}</div>
                </div>
                <Badge variant="primary">₹{(r.cost / 100000).toFixed(1)}L</Badge>
              </div>
              <div className="mt-4 space-y-2">
                {workflowStages.slice(0, 5).map((s, i) => {
                  const done = i < 3;
                  const current = i === 3;
                  return (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className={`h-2 w-2 rounded-full ${done ? "bg-success" : current ? "bg-primary animate-pulse" : "bg-muted"}`} />
                      <span className={done ? "" : current ? "font-medium" : "text-muted-foreground"}>{s.stage}</span>
                      <span className="ml-auto text-[10px] text-muted-foreground">{done ? s.date : current ? "in progress" : "—"}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
