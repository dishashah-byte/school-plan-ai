import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/top-bar";
import { Card, CardHeader, Badge } from "@/components/ui-kit";
import { useState } from "react";
import { Bot, Send, Mic, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/assistant")({
  head: () => ({ meta: [{ title: "AI Verification Assistant — IRV Engine" }] }),
  component: AssistantPage,
});

type Msg = { role: "ai" | "user"; text: string; chips?: string[] };

const seed: Msg[] = [
  { role: "ai", text: "Namaste 🙏 This is the IRV verification assistant calling on behalf of the AP Department of School Education. I'm reaching out about ZP High School, Amaravati." },
  { role: "ai", text: "Our records show your RO drinking-water plant is currently non-functional. Is this still the case today?", chips: ["Yes, still down", "It was repaired", "Never had one"] },
  { role: "user", text: "Yes, still down. The motor failed two weeks ago." },
  { role: "ai", text: "Thank you. Can you confirm whether students currently have alternative safe drinking water on campus?", chips: ["Yes — bore water", "No alternative", "Bottled water only"] },
];

function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");

  const send = (t?: string) => {
    const text = (t ?? input).trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: "Understood. I've logged this and escalated to the district sanitation officer. A field visit will be scheduled within 7 working days. Is there anything else you'd like to report?",
          chips: ["Report another issue", "No, that's all"],
        },
      ]);
    }, 700);
  };

  return (
    <>
      <TopBar title="AI Verification Assistant" subtitle="Conversational verification across 45,000+ schools" />
      <div className="p-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="flex flex-col h-[72vh]">
          <div className="px-5 py-3 border-b border-border flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-teal grid place-items-center text-primary-foreground">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">IRV Assistant</div>
              <div className="text-[11px] text-success flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> Connected · Telugu / English
              </div>
            </div>
            <Badge variant="primary" className="ml-auto">Verification call · ZP HS Amaravati</Badge>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[80%]">
                  <div
                    className={`text-sm leading-relaxed px-3.5 py-2.5 rounded-2xl ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.chips && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {m.chips.map((c) => (
                        <button key={c} onClick={() => send(c)} className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-card hover:bg-accent transition-colors">
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-border flex items-center gap-2">
            <button className="h-10 w-10 grid place-items-center rounded-md border border-input bg-card hover:bg-muted">
              <Mic className="h-4 w-4 text-muted-foreground" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type a response or use voice…"
              className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
            />
            <button onClick={() => send()} className="h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 flex items-center gap-1.5">
              <Send className="h-4 w-4" /> Send
            </button>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Verification Status" />
            <div className="px-5 pb-5 space-y-2.5">
              {[
                { l: "RO plant status", s: "Confirmed non-functional", v: "danger" as const },
                { l: "Alt. water source", s: "Awaiting answer", v: "warning" as const },
                { l: "Toilet block", s: "Verified operational", v: "success" as const },
                { l: "Electrification", s: "Verified", v: "success" as const },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{r.l}</span>
                  <Badge variant={r.v}>{r.s}</Badge>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHeader title="Escalation Workflow" />
            <div className="px-5 pb-5 space-y-3 text-xs">
              {[
                { t: "Auto-routed to MEO", ok: true },
                { t: "District sanitation officer alert", ok: true },
                { t: "Field visit scheduled", ok: false },
                { t: "Repair sanction issued", ok: false },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className={`h-3.5 w-3.5 ${s.ok ? "text-success" : "text-muted-foreground"}`} />
                  <span className={s.ok ? "" : "text-muted-foreground"}>{s.t}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
