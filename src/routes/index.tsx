import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/top-bar";
import { Card, CardHeader, Stat, Badge } from "@/components/ui-kit";
import { kpis, districtData, enrollmentTrend, schools } from "@/lib/mock-data";
import {
  School as SchoolIcon,
  ClipboardCheck,
  AlertTriangle,
  Wallet,
  ShieldAlert,
  Brain,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Executive Dashboard — IRV Engine" },
      { name: "description", content: "Statewide overview of school infrastructure, AI validation and risk insights." },
    ],
  }),
  component: Dashboard,
});

const insights = [
  { icon: TrendingUp, tone: "primary" as const, title: "Classroom demand rising in Visakhapatnam", body: "Predicted +18% Class IX intake by 2027. 412 new classrooms required across 84 schools." },
  { icon: ShieldAlert, tone: "danger" as const, title: "Ghost demand cluster detected in Kurnool", body: "27 duplicate toilet-block requests across 9 mandals flagged with 92% fraud confidence." },
  { icon: Sparkles, tone: "teal" as const, title: "Tribal Welfare schools deprioritised by older model", body: "New ranking re-elevates 38 Ashram schools after equity weighting adjustment." },
];

function Dashboard() {
  const recent = schools.slice(0, 6);
  return (
    <>
      <TopBar title="Executive Dashboard" subtitle="Statewide infrastructure intelligence · FY 2026-27" />
      <div className="p-6 space-y-6">
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Stat label="Total Schools" value={kpis.totalSchools.toLocaleString()} delta="13 districts" icon={<SchoolIcon className="h-4 w-4" />} tone="primary" />
          <Stat label="Pending Approvals" value={kpis.pendingApprovals.toLocaleString()} delta="↓ 12% WoW" icon={<ClipboardCheck className="h-4 w-4" />} tone="teal" />
          <Stat label="Ghost Demands" value={kpis.ghostDemands} delta="₹4.2 Cr at risk" icon={<AlertTriangle className="h-4 w-4" />} tone="danger" />
          <Stat label="Budget Utilization" value={`${kpis.budgetUtilization}%`} delta="₹1,820 Cr deployed" icon={<Wallet className="h-4 w-4" />} tone="success" />
          <Stat label="High-Risk Schools" value={kpis.highRiskSchools} delta="Needs intervention" icon={<ShieldAlert className="h-4 w-4" />} tone="warning" />
          <Stat label="AI Prediction Accuracy" value={`${kpis.aiAccuracy}%`} delta="Model v3.2 · audited" icon={<Brain className="h-4 w-4" />} tone="primary" />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader title="Enrollment vs Classroom Capacity" subtitle="Statewide · in millions / lakhs" right={<Badge variant="primary">Predictive</Badge>} />
            <div className="px-2 pb-4 h-72">
              <ResponsiveContainer>
                <AreaChart data={enrollmentTrend} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-teal)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--color-teal)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="year" stroke="var(--color-muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="enrollment" stroke="var(--color-primary)" fill="url(#g1)" strokeWidth={2} />
                  <Area type="monotone" dataKey="classrooms" stroke="var(--color-teal)" fill="url(#g2)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <CardHeader title="AI Insight Stream" subtitle="Generated 3 min ago" right={<Badge variant="teal">LLM v3.2</Badge>} />
            <div className="px-5 pb-5 space-y-3">
              {insights.map((i, idx) => {
                const Icon = i.icon;
                const bg = { primary: "bg-primary/10 text-primary", danger: "bg-destructive/10 text-destructive", teal: "bg-teal/15 text-teal-foreground" }[i.tone];
                return (
                  <div key={idx} className="flex gap-3 p-3 rounded-lg border border-border hover:bg-muted/40 transition-colors">
                    <div className={`h-8 w-8 rounded-md grid place-items-center shrink-0 ${bg}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold leading-tight">{i.title}</div>
                      <div className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{i.body}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader title="District Heatmap — Infrastructure Gaps" subtitle="Higher = more unmet demand" />
            <div className="px-2 pb-4 h-64">
              <ResponsiveContainer>
                <BarChart data={districtData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="district" stroke="var(--color-muted-foreground)" fontSize={10} angle={-25} textAnchor="end" height={60} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="gaps" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="risk" fill="var(--color-teal)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <CardHeader title="Active Alerts" right={<Badge variant="danger">3 critical</Badge>} />
            <div className="px-5 pb-5 space-y-2.5">
              {[
                { t: "Roof collapse risk — MPUP School, Tirupati Rural", v: "danger" as const, sub: "Structural audit overdue 14 mo." },
                { t: "Sanitation gap — 12 girls' schools, Kurnool", v: "warning" as const, sub: "Flag raised by AI on enrollment skew." },
                { t: "Drinking water non-functional — 47 schools", v: "warning" as const, sub: "RO plants offline > 30 days." },
                { t: "Verified: New classrooms operational", v: "success" as const, sub: "Vizag · 8 schools commissioned." },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-md border border-border">
                  <Badge variant={a.v}>●</Badge>
                  <div className="min-w-0">
                    <div className="text-xs font-medium leading-tight">{a.t}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{a.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader title="Recently Updated Schools" subtitle="Sourced from UDISE+ sync · 09:42 IST" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-muted-foreground border-y border-border bg-muted/40">
                  <th className="text-left font-medium px-5 py-2.5">School</th>
                  <th className="text-left font-medium py-2.5">District</th>
                  <th className="text-right font-medium py-2.5">Enrollment</th>
                  <th className="text-right font-medium py-2.5">AI Score</th>
                  <th className="text-left font-medium py-2.5 pl-4">Risk</th>
                  <th className="text-left font-medium py-2.5 pl-4 pr-5">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 font-medium">{s.name}</td>
                    <td className="text-muted-foreground">{s.district}</td>
                    <td className="text-right tabular-nums">{s.enrollment}</td>
                    <td className="text-right tabular-nums font-medium">{s.aiScore}</td>
                    <td className="pl-4">
                      <Badge variant={s.riskLevel === "critical" ? "danger" : s.riskLevel === "high" ? "warning" : s.riskLevel === "moderate" ? "info" : "success"}>
                        {s.riskLevel}
                      </Badge>
                    </td>
                    <td className="pl-4 pr-5">
                      <Badge variant={s.electrification ? "success" : "warning"}>
                        {s.electrification ? "Operational" : "Action Needed"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
