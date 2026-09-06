import { Radio, ListOrdered } from "lucide-react";
import { useOpenClawDashboard } from "@/hooks/use-openclaw";

function Chip({
  label,
  value,
  tone = "default",
  icon: Icon,
}: {
  label: string;
  value: string;
  tone?: "default" | "ok" | "warn";
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const toneCls =
    tone === "ok" ? "text-primary" : tone === "warn" ? "text-warning" : "text-foreground";
  return (
    <div className="flex items-center gap-2 border-r border-border px-3 py-1.5 last:border-r-0">
      {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className={`text-[11px] font-mono ${toneCls}`}>{value}</span>
    </div>
  );
}

export function TopBar() {
  const { data, isFetching, isLoading } = useOpenClawDashboard();
  const connected = data?.connected === true;
  const runningTasks =
    data?.tasks.filter((task) => task.status === "running" || task.status === "queued").length ?? 0;
  const primaryModel = data?.agents.find((agent) => agent.model?.primary)?.model?.primary ?? "—";

  return (
    <div className="flex h-11 shrink-0 items-center justify-between border-b border-border bg-card/40 pl-2 pr-3">
      <div className="flex items-center overflow-x-auto">
        <div className="flex items-center gap-2 border-r border-border px-3 py-1.5">
          <span
            className={`dot ${isLoading ? "bg-muted-foreground" : connected ? "bg-primary pulse-soft" : "bg-destructive"}`}
          />
          <span className="text-[11px] font-medium">OpenClaw Gateway</span>
          <span
            className={`text-[11px] ${isLoading ? "text-muted-foreground" : connected ? "text-primary" : "text-destructive"}`}
          >
            {isLoading ? "Checking…" : connected ? "Online" : "Offline"}
          </span>
        </div>
        <Chip label="Bridge" value="127.0.0.1:18790" tone={connected ? "ok" : "warn"} />
        <Chip label="Model" value={primaryModel} icon={Radio} />
        <Chip
          label="Agents"
          value={`${data?.agents.length ?? 0} configured`}
          tone={connected ? "ok" : "default"}
        />
        <Chip label="Queue" value={`${runningTasks} active`} icon={ListOrdered} />
      </div>
      <div className="hidden shrink-0 items-center gap-2 pl-3 text-[10px] text-muted-foreground md:flex">
        <span className="font-mono">
          {isFetching ? "syncing…" : data ? "live local bridge" : "bridge not started"}
        </span>
      </div>
    </div>
  );
}
