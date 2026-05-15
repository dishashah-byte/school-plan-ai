import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/top-bar";
import { Card, CardHeader, Badge } from "@/components/ui-kit";
import { forecastData, enrollmentTrend } from "@/lib/mock-data";
import { Brain, AlertTriangle, Sparkles } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

export const Route = createFileRoute("/forecasting")({
  head: () => ({ meta: [{ title: "AI Forecasting — IRV Engine" }] }),
  component: ForecastingPage,
});

const projection = enrollmentTrend.map((d, i) => ({
  ...d,
  predicted: i >= 5 ? d.enrollment * (1 + (i - 4) * 0.04) : null,
  upper: i >= 5 ? d.enrollment * (1 + (i - 4) * 0.06) : null,
  lower: i >= 5 ? d.enrollment * (1 + (i - 4) * 0.02) : null,
}));

function ForecastingPage() {
  return (
    <>
      <TopBar title="AI Forecasting" subtitle="Demand prediction for classrooms, sanitation, repair & enrollment" />
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {forecastData.map((f, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-center justify-between">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{f.metric}</div>
                <Badge variant={f.risk === "high" ? "danger" : "warning"}>
                  <AlertTriangle className="h-3 w-3" />{f.risk}
                </Badge>
              </div>
              <div className="mt-3 flex items-end gap-3">
                <div>
                  <div className="text-[10px] text-muted-foreground">Current</div>
                  <div className="text-xl font-semibold tabular-nums">{f.current.toLocaleString()}</div>
                </div>
                <div className="text-muted-foreground">→</div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Projected 2027</div>
                  <div className="text-xl font-semibold tabular-nums text-primary">{f.projected.toLocaleString()}</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Confidence</span>
                <span className="font-semibold">{f.confidence}%</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-teal" style={{ width: `${f.confidence}%` }} />
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader
            title="Statewide Enrollment Forecast"
            subtitle="Historical trend + model projection with 95% interval"
            right={<Badge variant="primary"><Brain className="h-3 w-3" /> Prophet+Ensemble</Badge>}
          />
          <div className="h-80 px-2 pb-4">
            <ResponsiveContainer>
              <LineChart data={projection}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="year" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="enrollment" name="Actual" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="predicted" name="Predicted" stroke="var(--color-teal)" strokeWidth={2.5} strokeDasharray="6 4" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="upper" name="Upper bound" stroke="var(--color-teal)" strokeWidth={1} strokeDasharray="2 2" dot={false} opacity={0.5} />
                <Line type="monotone" dataKey="lower" name="Lower bound" stroke="var(--color-teal)" strokeWidth={1} strokeDasharray="2 2" dot={false} opacity={0.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Explainable AI — Why these predictions?"
            right={<Badge variant="teal"><Sparkles className="h-3 w-3" /> SHAP analysis</Badge>}
          />
          <div className="p-5 grid md:grid-cols-2 gap-4">
            {[
              { f: "Birth-rate cohort (2020-23)", w: 0.34, dir: "+" },
              { f: "Migration in-flow (urban districts)", w: 0.21, dir: "+" },
              { f: "Drop-out rate trend", w: 0.18, dir: "−" },
              { f: "Private-school competition", w: 0.14, dir: "−" },
              { f: "Mid-Day Meal coverage", w: 0.08, dir: "+" },
              { f: "RTE compliance score", w: 0.05, dir: "+" },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <div className={`text-xs font-bold w-6 grid place-items-center h-6 rounded ${r.dir === "+" ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive"}`}>{r.dir}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium">{r.f}</div>
                  <div className="mt-1 h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${r.w * 100 * 2.5}%` }} />
                  </div>
                </div>
                <div className="text-xs tabular-nums font-semibold">{(r.w * 100).toFixed(0)}%</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
