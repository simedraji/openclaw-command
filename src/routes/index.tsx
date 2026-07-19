import { createFileRoute } from "@tanstack/react-router";
import { Play, Pause, OctagonX, Cpu, HardDrive, Zap, Clock } from "lucide-react";
import { agents, recentLogs } from "@/lib/mock-data";
import { PageHeader, Panel, Btn, StatCard } from "@/components/ui-kit";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/")({
  component: MissionControl,
});

function MissionControl() {
  const stats = [
    { label: "Active agents", value: 7, sub: "of 7 configured", tone: "ok" as const },
    { label: "Running sub-agents", value: 14, sub: "across 7 agents", tone: "ok" as const },
    { label: "Tasks in queue", value: 12, sub: "3 priority" },
    { label: "Etsy jobs completed", value: 148, sub: "today" },
    { label: "Shopify jobs completed", value: 92, sub: "today" },
    { label: "Listings generated", value: 36, sub: "24h" },
    { label: "Orders processed", value: 214, sub: "24h" },
    { label: "Trademark warnings", value: 2, sub: "action needed", tone: "warn" as const },
    { label: "Facebook Ads alerts", value: 1, sub: "Pixel A misfire", tone: "danger" as const },
    { label: "Telegram messages", value: 48, sub: "today" },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Mission Control"
        subtitle="Local AI agents for POD research, listings, ads, and store automation."
        actions={
          <>
            <Btn variant="primary"><Play className="h-3.5 w-3.5" /> Start all agents</Btn>
            <Btn><Pause className="h-3.5 w-3.5" /> Pause all</Btn>
            <Btn variant="danger"><OctagonX className="h-3.5 w-3.5" /> Emergency stop</Btn>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Panel title="Live task queue" className="lg:col-span-2">
          <div className="space-y-1.5">
            {[
              { p: "P0", t: "Publish 12 Etsy listings", agent: "Etsy Automation", eta: "2m 14s" },
              { p: "P1", t: "Build Shopify collection · Summer 2026", agent: "Shopify Automation", eta: "4m 02s" },
              { p: "P1", t: "Niche scan · 'dad life'", agent: "Niche Research", eta: "1m 33s" },
              { p: "P2", t: "Render 8 designs · retro surf", agent: "Design", eta: "6m 20s" },
              { p: "P2", t: "USPTO recheck · 4 phrases", agent: "Trademark Safety", eta: "42s" },
              { p: "P3", t: "ROAS refresh · 4 campaigns", agent: "FB Ads MCP", eta: "58s" },
            ].map((q, i) => (
              <div key={i} className="flex items-center gap-3 rounded-md border border-border/60 bg-background/40 px-3 py-2 text-[12px]">
                <span className="w-8 rounded bg-secondary px-1.5 py-0.5 text-center font-mono text-[10px] text-muted-foreground">{q.p}</span>
                <span className="flex-1 truncate">{q.t}</span>
                <span className="hidden text-muted-foreground md:inline">{q.agent}</span>
                <span className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground"><Clock className="h-3 w-3" /> {q.eta}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Local system health">
          <div className="space-y-3">
            <HealthRow icon={<Cpu className="h-3.5 w-3.5" />} label="GPU · RTX 4090" value="41%" pct={41} />
            <HealthRow icon={<Cpu className="h-3.5 w-3.5" />} label="CPU" value="18%" pct={18} />
            <HealthRow icon={<HardDrive className="h-3.5 w-3.5" />} label="RAM" value="12.4 / 32 GB" pct={39} />
            <HealthRow icon={<HardDrive className="h-3.5 w-3.5" />} label="Vault storage" value="184 / 512 GB" pct={36} />
            <HealthRow icon={<Zap className="h-3.5 w-3.5" />} label="OpenClaw gateway" value="Online · 12ms" pct={100} tone="ok" />
            <div className="rounded-md border border-border bg-background/50 p-2 font-mono text-[10px] text-muted-foreground">
              gateway://localhost:18789<br />
              model = llama-3.1-70b · ctx=32k<br />
              ollama = deepseek-coder-v2:16b
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel title="Agent execution timeline">
          <div className="space-y-2">
            {agents.slice(0, 6).map((a) => (
              <div key={a.id} className="flex items-center gap-3">
                <div className="w-40 shrink-0 truncate text-[12px]">{a.icon} {a.name}</div>
                <div className="relative h-4 flex-1 rounded-sm bg-secondary/60">
                  <div
                    className="absolute inset-y-0 left-0 rounded-sm bg-primary/70"
                    style={{ width: `${a.progress}%` }}
                  />
                  <div className="scan-line absolute inset-0 rounded-sm opacity-40" />
                </div>
                <div className="w-20 shrink-0 text-right"><StatusBadge status={a.status} /></div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Recent logs" right={<span className="font-mono text-[10px] text-muted-foreground">tail -f /var/log/merchiq</span>}>
          <div className="max-h-[280px] overflow-y-auto font-mono text-[11px] leading-relaxed">
            {recentLogs.map((l, i) => (
              <div key={i} className="flex gap-2 border-b border-border/40 py-1 last:border-b-0">
                <span className="text-muted-foreground">{l.t}</span>
                <span className={
                  l.lvl === "err" ? "text-destructive" :
                  l.lvl === "warn" ? "text-warning" : "text-primary"
                }>{l.lvl.padEnd(4)}</span>
                <span className="text-muted-foreground">{l.src}</span>
                <span className="flex-1 truncate">{l.msg}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function HealthRow({ icon, label, value, pct, tone = "default" }: { icon: React.ReactNode; label: string; value: string; pct: number; tone?: "default" | "ok" }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="flex items-center gap-1.5 text-muted-foreground">{icon} {label}</span>
        <span className={`font-mono ${tone === "ok" ? "text-primary" : ""}`}>{value}</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
        <div className={`h-full ${tone === "ok" ? "bg-primary" : "bg-info/70"}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
