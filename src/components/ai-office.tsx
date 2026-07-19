import { agents } from "@/lib/mock-data";
import { StatusBadge } from "./status-badge";
import { Play, Pause, Square } from "lucide-react";

export function AiOffice() {
  return (
    <aside className="hidden h-full w-[340px] shrink-0 flex-col border-l border-border bg-card/30 xl:flex">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <div className="text-[13px] font-semibold">Local AI Office</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Live agents · sub-agents</div>
        </div>
        <span className="dot bg-primary pulse-soft" />
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {agents.map((a) => (
          <div key={a.id} className="panel p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-sm">{a.icon}</div>
                <div className="leading-tight">
                  <div className="text-[12px] font-medium">{a.name}</div>
                  <div className="text-[10px] text-muted-foreground">{a.role}</div>
                </div>
              </div>
              <StatusBadge status={a.status} />
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground truncate">{a.currentTask}</div>
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${a.progress}%` }}
              />
            </div>
            <div className="mt-2 rounded-md border border-border bg-background/60 p-1.5 font-mono text-[10px] leading-relaxed text-muted-foreground max-h-16 overflow-hidden">
              {a.logs.slice(-2).map((l, i) => (
                <div key={i} className="truncate">{l}</div>
              ))}
            </div>
            <details className="group mt-2">
              <summary className="cursor-pointer text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
                {a.subAgents.length} sub-agents
              </summary>
              <div className="mt-1.5 space-y-1">
                {a.subAgents.map((s) => (
                  <div key={s.name} className="flex items-center justify-between rounded-md border border-border/50 px-2 py-1">
                    <div className="min-w-0">
                      <div className="truncate text-[11px]">{s.name}</div>
                      <div className="truncate text-[10px] text-muted-foreground">{s.task}</div>
                    </div>
                    <StatusBadge status={s.status} />
                  </div>
                ))}
              </div>
            </details>
            <div className="mt-2 flex gap-1">
              <button className="flex flex-1 items-center justify-center gap-1 rounded-md border border-border bg-secondary/60 py-1 text-[10px] hover:bg-secondary">
                <Play className="h-3 w-3" /> Start
              </button>
              <button className="flex flex-1 items-center justify-center gap-1 rounded-md border border-border bg-secondary/60 py-1 text-[10px] hover:bg-secondary">
                <Pause className="h-3 w-3" /> Pause
              </button>
              <button className="flex flex-1 items-center justify-center gap-1 rounded-md border border-border bg-secondary/60 py-1 text-[10px] hover:bg-secondary">
                <Square className="h-3 w-3" /> Stop
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
