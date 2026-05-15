import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/top-bar";
import { Card, CardHeader, Badge, RiskBadge } from "@/components/ui-kit";
import { schools } from "@/lib/mock-data";
import { useState } from "react";
import { MapPin, Droplets, Zap } from "lucide-react";

export const Route = createFileRoute("/map")({
  head: () => ({ meta: [{ title: "GIS School Map — IRV Engine" }] }),
  component: MapPage,
});

const colorFor = (risk: string) =>
  risk === "critical" ? "var(--color-destructive)" : risk === "high" ? "var(--color-warning)" : risk === "moderate" ? "var(--color-info)" : "var(--color-success)";

function MapPage() {
  const [selectedId, setSelectedId] = useState(schools[0].id);
  const s = schools.find((x) => x.id === selectedId)!;
  const minLat = 12.5, maxLat = 19.5, minLng = 77.5, maxLng = 84.5;
  const project = (lat: number, lng: number) => ({
    x: ((lng - minLng) / (maxLng - minLng)) * 100,
    y: 100 - ((lat - minLat) / (maxLat - minLat)) * 100,
  });

  return (
    <>
      <TopBar title="GIS School Map" subtitle="Andhra Pradesh · Infrastructure & risk overlay" />
      <div className="p-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center gap-2 flex-wrap">
            <div className="text-sm font-semibold">Statewide overlay</div>
            <div className="ml-auto flex items-center gap-3 text-[11px]">
              {[{l:"Critical",c:"var(--color-destructive)"},{l:"High",c:"var(--color-warning)"},{l:"Moderate",c:"var(--color-info)"},{l:"Low",c:"var(--color-success)"}].map(x => (
                <div key={x.l} className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{background:x.c}}/>{x.l}</div>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/3] bg-gradient-to-br from-accent/40 via-card to-teal/10">
            {/* Stylised AP outline */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
                  <path d="M 5 0 L 0 0 0 5" fill="none" stroke="var(--color-border)" strokeWidth="0.15" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
              <path
                d="M 18 12 L 30 8 L 45 10 L 58 18 L 70 28 L 78 42 L 82 58 L 75 72 L 62 84 L 48 90 L 32 86 L 22 76 L 14 60 L 12 42 L 14 26 Z"
                fill="color-mix(in oklab, var(--color-primary) 6%, transparent)"
                stroke="var(--color-primary)"
                strokeWidth="0.5"
                strokeDasharray="0.5 0.5"
              />
            </svg>
            {schools.map((sc) => {
              const p = project(sc.lat, sc.lng);
              const active = sc.id === selectedId;
              return (
                <button
                  key={sc.id}
                  onClick={() => setSelectedId(sc.id)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-150"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  title={sc.name}
                >
                  <span
                    className={`block rounded-full ring-2 ring-card ${active ? "h-3.5 w-3.5 ring-primary animate-pulse" : "h-2.5 w-2.5"}`}
                    style={{ background: colorFor(sc.riskLevel) }}
                  />
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="self-start">
          <CardHeader title="School Details" subtitle={s.id} right={<RiskBadge level={s.riskLevel} />} />
          <div className="px-5 pb-5 space-y-4">
            <div>
              <div className="text-sm font-semibold leading-tight">{s.name}</div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" /> {s.district} · {s.lat.toFixed(2)}°N, {s.lng.toFixed(2)}°E
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-md border border-border p-2">
                <div className="text-lg font-semibold tabular-nums">{s.enrollment}</div>
                <div className="text-[10px] text-muted-foreground uppercase">Students</div>
              </div>
              <div className="rounded-md border border-border p-2">
                <div className="text-lg font-semibold tabular-nums">{s.classrooms.available}</div>
                <div className="text-[10px] text-muted-foreground uppercase">Rooms</div>
              </div>
              <div className="rounded-md border border-border p-2">
                <div className="text-lg font-semibold tabular-nums">{s.aiScore}</div>
                <div className="text-[10px] text-muted-foreground uppercase">AI Score</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5"><Droplets className="h-3.5 w-3.5 text-info" /> Drinking water</span>
                <Badge variant={s.drinkingWater === "functional" ? "success" : "warning"}>{s.drinkingWater}</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-warning-foreground" /> Electrification</span>
                <Badge variant={s.electrification ? "success" : "danger"}>{s.electrification ? "On" : "Off"}</Badge>
              </div>
            </div>
            <button className="w-full h-9 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90">Open full profile →</button>
          </div>
        </Card>
      </div>
    </>
  );
}
