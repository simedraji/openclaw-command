import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Btn } from "@/components/ui-kit";
import { useOpenClawDashboard } from "@/hooks/use-openclaw";
import { RefreshCw } from "lucide-react";

export const Route = createFileRoute("/logs")({
  component: LogsPage,
});

function LogsPage() {
  const { data, isFetching, refetch } = useOpenClawDashboard();
  const tasks = data?.tasks ?? [];
  return (
    <div className="space-y-5">
      <PageHeader
        title="Logs"
        subtitle="Actual task history from this local bridge session."
        actions={
          <Btn type="button" disabled={isFetching} onClick={() => void refetch()}>
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} /> Refresh
          </Btn>
        }
      />
      <Panel dense>
        <div className="flex items-center justify-between border-b border-border px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>OpenClaw task activity</span>
          <span className="flex items-center gap-1.5">
            <span
              className={`dot ${data?.connected ? "bg-primary pulse-soft" : "bg-destructive"}`}
            />{" "}
            {data?.connected ? "connected" : "offline"}
          </span>
        </div>
        <div className="max-h-[560px] overflow-y-auto p-3 font-mono text-[11px] leading-relaxed">
          {tasks.length ? (
            tasks.map((task) => (
              <div
                key={task.id}
                className="grid grid-cols-[80px_90px_110px_1fr] gap-2 border-b border-border/40 py-1 last:border-b-0"
              >
                <span className="text-muted-foreground">
                  {new Date(task.completedAt ?? task.createdAt).toLocaleTimeString()}
                </span>
                <span
                  className={
                    task.status === "failed"
                      ? "text-destructive"
                      : task.status === "completed"
                        ? "text-primary"
                        : "text-warning"
                  }
                >
                  {task.status}
                </span>
                <span className="text-info">{task.agentId}</span>
                <span className="truncate">{task.error ?? task.label}</span>
              </div>
            ))
          ) : (
            <div className="p-3 text-muted-foreground">No dashboard tasks have run yet.</div>
          )}
        </div>
      </Panel>
    </div>
  );
}
