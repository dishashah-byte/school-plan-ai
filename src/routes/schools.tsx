import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/top-bar";
import { Card, CardHeader, Badge, RiskBadge } from "@/components/ui-kit";
import { schools } from "@/lib/mock-data";
import { useState } from "react";
import { Search, Droplets, Zap, Users, Wrench, Sparkles } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export const Route = createFileRoute("/schools")({
  head: () => ({ meta: [{ title: "School Infrastructure Profiles — IRV Engine" }] }),
  component: SchoolsPage,
});

function SchoolsPage() {
  const [selectedId, setSelectedId] = useState(schools[0].id);
  const [q, setQ] = useState("");
  const filtered = schools.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()) || s.district.toLowerCase().includes(q.toLowerCase()));
  const s = schools.find((x) => x.id === selectedId)!;
  const trend = s.enrollmentTrend.map((v, i) => ({ year: 2020 + i, enrollment: v }));

  return (
    <>
      <TopBar title="School Infrastructure Profiles" subtitle={`${schools.length.toLocaleString()} schools tracked`} />
      <div className="p-6 grid gap-6 lg:grid-cols-[300px_1fr]">
        <Card className="self-start max-h-[78vh] flex flex-col">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search schools…"
                className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-xs outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
          </div>
          <div className="overflow-y-auto p-2 space-y-1">
            {filtered.map((sc) => (
              <button
                key={sc.id}
                onClick={() => setSelectedId(sc.id)}
                className={`w-full text-left rounded-md px-2.5 py-2 transition-colors ${selectedId === sc.id ? "bg-accent text-accent-foreground" : "hover:bg-muted/60"}`}
              >
                <div className="text-xs font-medium leading-tight truncate">{sc.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-muted-foreground">{sc.district}</span>
                  <RiskBadge level={sc.riskLevel} />
                </div>
              </button>
            ))}
          </div>
        </Card>

        <div className="space-y-6 min-w-0">
          <Card>
            <div className="p-5 flex flex-wrap gap-4 items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span>{s.id}</span>·<span>{s.type}</span>·<span>{s.district}</span>
                  {s.tribal && <Badge variant="teal">Tribal Welfare</Badge>}
                </div>
                <h2 className="text-xl font-semibold mt-1.5 tracking-tight">{s.name}</h2>
              </div>
              <div className="flex items-center gap-2">
                <RiskBadge level={s.riskLevel} />
                <Badge variant="primary">AI Score {s.aiScore}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border-t border-border">
              {[
                { l: "Enrollment", v: s.enrollment, i: <Users className="h-4 w-4" /> },
                { l: "Classrooms", v: `${s.classrooms.available} / ${s.classrooms.required}`, i: <Wrench className="h-4 w-4" /> },
                { l: "Toilets (B/G/Func.)", v: `${s.toilets.boys}/${s.toilets.girls}/${s.toilets.functional}`, i: <Droplets className="h-4 w-4" /> },
                { l: "Electrification", v: s.electrification ? "Operational" : "Down", i: <Zap className="h-4 w-4" /> },
              ].map((m, i) => (
                <div key={i} className="bg-card p-4">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                    {m.i}{m.l}
                  </div>
                  <div className="text-lg font-semibold mt-1.5 tabular-nums">{m.v}</div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader title="Enrollment Trend" subtitle="6-year history" />
              <div className="h-56 px-2 pb-4">
                <ResponsiveContainer>
                  <LineChart data={trend}>
                    <XAxis dataKey="year" stroke="var(--color-muted-foreground)" fontSize={11} />
                    <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                    <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                    <Line type="monotone" dataKey="enrollment" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <CardHeader title="Infrastructure Status" />
              <div className="p-5 space-y-3">
                {[
                  { l: "Drinking Water", v: s.drinkingWater, ok: s.drinkingWater === "functional" },
                  { l: "Boundary Wall", v: "Partial · 60%", ok: false },
                  { l: "Smart Classroom", v: "Not Installed", ok: false },
                  { l: "Mid-Day Meal Kitchen", v: "Functional", ok: true },
                  { l: "Last Major Repair", v: s.lastRepair, ok: true },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{r.l}</span>
                    <Badge variant={r.ok ? "success" : "warning"}>{r.v}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card>
            <CardHeader
              title="AI-Generated Recommendations"
              subtitle="Ranked by impact · explainable reasoning"
              right={<Badge variant="teal"><Sparkles className="h-3 w-3" /> IRV v3.2</Badge>}
            />
            <div className="p-5 space-y-3">
              {[
                { p: "Critical", v: "danger" as const, t: "Construct 4 additional classrooms by Q3 FY27", r: "Enrollment trend up 14%; current student-classroom ratio 52:1 vs RTE norm 30:1." },
                { p: "High", v: "warning" as const, t: "Install RO water plant + 2 girls' toilet units", r: "Sanitation gap correlates with 8% drop-out among girls in district cluster." },
                { p: "Moderate", v: "info" as const, t: "Roof waterproofing before monsoon", r: "Last repair 2021; satellite imagery shows visible degradation." },
              ].map((rec, i) => (
                <div key={i} className="flex gap-3 p-4 rounded-lg border border-border bg-muted/20">
                  <Badge variant={rec.v}>{rec.p}</Badge>
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{rec.t}</div>
                    <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      <span className="font-medium text-foreground/70">Why: </span>{rec.r}
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-[11px] text-muted-foreground pt-2 border-t border-border">
                <Link to="/validation" className="text-primary hover:underline">Submit for validation →</Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
