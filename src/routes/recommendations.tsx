import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/top-bar";
import { Card, CardHeader, Badge, RiskBadge } from "@/components/ui-kit";
import { schools } from "@/lib/mock-data";
import { Sparkles, GraduationCap, ShieldAlert, Trees } from "lucide-react";

export const Route = createFileRoute("/recommendations")({
  head: () => ({ meta: [{ title: "Recommendation Engine — IRV Engine" }] }),
  component: RecommendationsPage,
});

function priority(score: number) {
  if (score > 88) return { v: "danger" as const, label: "Critical" };
  if (score > 75) return { v: "warning" as const, label: "High" };
  return { v: "info" as const, label: "Moderate" };
}

function RecommendationsPage() {
  const ranked = [...schools].sort((a, b) => b.aiScore - a.aiScore).slice(0, 18);
  return (
    <>
      <TopBar title="Recommendation Engine" subtitle="Schools prioritised by urgency, safety, equity and impact" />
      <div className="p-6 space-y-6">
        <Card className="p-5">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="text-muted-foreground">Weights:</span>
            {[
              { l: "Safety", w: 35, i: <ShieldAlert className="h-3 w-3" /> },
              { l: "Educational impact", w: 28, i: <GraduationCap className="h-3 w-3" /> },
              { l: "Tribal / rural priority", w: 22, i: <Trees className="h-3 w-3" /> },
              { l: "Infrastructure condition", w: 15, i: <Sparkles className="h-3 w-3" /> },
            ].map((w, i) => (
              <Badge key={i} variant="primary">{w.i} {w.l} · {w.w}%</Badge>
            ))}
            <span className="ml-auto text-[11px] text-muted-foreground">Model IRV-Rank v3.2 · audited 02 May</span>
          </div>
        </Card>

        <div className="grid gap-3">
          {ranked.map((s, i) => {
            const p = priority(s.aiScore);
            return (
              <Card key={s.id} className="p-4 hover:shadow-elevated transition-shadow">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="h-10 w-10 rounded-md bg-gradient-to-br from-primary to-teal grid place-items-center text-primary-foreground font-bold text-sm">
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{s.name}</div>
                    <div className="text-[11px] text-muted-foreground">{s.district} · {s.type} · {s.enrollment} students</div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {s.tribal && <Badge variant="teal">Tribal</Badge>}
                    <RiskBadge level={s.riskLevel} />
                    <Badge variant={p.v}>{p.label}</Badge>
                    <div className="text-right">
                      <div className="text-[10px] uppercase text-muted-foreground tracking-wider">Priority</div>
                      <div className="text-lg font-semibold tabular-nums">{s.aiScore}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-2 text-[11px]">
                  {[
                    { l: "Safety", v: 60 + (s.aiScore % 35) },
                    { l: "Edu. impact", v: 55 + ((s.aiScore + 7) % 40) },
                    { l: "Equity", v: s.tribal ? 90 : 55 + ((s.aiScore + 11) % 35) },
                    { l: "Condition", v: 100 - (s.aiScore % 50) },
                  ].map((m, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-muted-foreground"><span>{m.l}</span><span className="tabular-nums">{m.v}</span></div>
                      <div className="h-1 bg-muted rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-primary" style={{ width: `${m.v}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
