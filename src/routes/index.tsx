import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw, Clock, ServerCrash } from "lucide-react";
import { PageHeader, Panel, Btn, StatCard } from "@/components/ui-kit";
import { StatusBadge } from "@/components/status-badge";
import { OpenClawTaskButton } from "@/components/openclaw-task-button";
import { useOpenClawDashboard } from "@/hooks/use-openclaw";

export const Route = createFileRoute("/")({
  component: MissionControl,
});

function MissionControl() {
  const { data, error, isLoading, isFetching, refetch } = useOpenClawDashboard();
  const tasks = data?.tasks ?? [];
  const agents = data?.agents ?? [];
  const activeTasks = tasks.filter((task) => task.status === "queued" || task.status === "running");
  const completedTasks = tasks.filter((task) => task.status === "completed");
  const failedTasks = tasks.filter((task) => task.status === "failed");
  const stats = [
    {
      label: "Gateway",
      value: isLoading ? "Checking…" : data?.connected ? "Online" : "Offline",
      sub: isLoading
        ? "Waiting for OpenClaw"
        : data?.connected
          ? "OpenClaw CLI connected"
          : "Check the connection details",
      tone: isLoading
        ? ("default" as const)
        : data?.connected
          ? ("ok" as const)
          : ("danger" as const),
    },
    { label: "Configured agents", value: agents.length, sub: "from OpenClaw", tone: "ok" as const },
    { label: "Active tasks", value: activeTasks.length, sub: "dashboard queue" },
    {
      label: "Completed tasks",
      value: completedTasks.length,
      sub: "this bridge session",
      tone: "ok" as const,
    },
    {
      label: "Failed tasks",
      value: failedTasks.length,
      sub: "needs attention",
      tone: failedTasks.length ? ("warn" as const) : ("default" as const),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Mission Control"
        subtitle="Live local control surface for your OpenClaw agents."
        actions={
          <>
            <OpenClawTaskButton
              label="Run POD operations review"
              message="Act as my POD operations manager. Review the current work context, identify the next highest-impact task for MerchIQ, and return a short actionable plan. Do not publish, spend money, or change external accounts without my approval."
            >
              Run POD workflow
            </OpenClawTaskButton>
            <Btn type="button" disabled={isFetching} onClick={() => void refetch()}>
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} /> Refresh
            </Btn>
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
            {tasks.length ? (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 rounded-md border border-border/60 bg-background/40 px-3 py-2 text-[12px]"
                >
                  <span className="w-20 rounded bg-secondary px-1.5 py-0.5 text-center font-mono text-[10px] text-muted-foreground">
                    {task.status}
                  </span>
                  <span className="flex-1 truncate">{task.label}</span>
                  <span className="hidden text-muted-foreground md:inline">
                    agent: {task.agentId}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" /> {formatTime(task.createdAt)}
                  </span>
                </div>
              ))
            ) : (
              <EmptyState text="No tasks yet. Run a workflow or use one of the tool pages." />
            )}
          </div>
        </Panel>

        <Panel title="OpenClaw connection">
          <div className="space-y-3">
            <div
              className={`rounded-md border p-3 text-[12px] ${isLoading ? "border-border bg-secondary text-muted-foreground" : data?.connected ? "border-primary/30 bg-primary/10 text-primary" : "border-destructive/30 bg-destructive/10 text-destructive"}`}
            >
              {isLoading
                ? "Checking the OpenClaw connection…"
                : data?.connected
                  ? "Connected to OpenClaw through the local CLI bridge."
                  : "OpenClaw is not connected yet."}
            </div>
            <div className="rounded-md border border-border bg-background/50 p-2 font-mono text-[10px] text-muted-foreground">
              bridge://127.0.0.1:18790
              <br />
              gateway: configured by OpenClaw CLI
              <br />
              last sync: {data ? formatTime(data.updatedAt) : "—"}
            </div>
            {(error instanceof Error || data?.errors.length) && (
              <div className="rounded-md border border-warning/30 bg-warning/5 p-2 text-[11px] text-warning">
                {error instanceof Error ? error.message : data?.errors[0]}
              </div>
            )}
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel title="Agent execution timeline">
          <div className="space-y-2">
            {agents.length ? (
              agents.map((a) => {
                const hasActiveTask = activeTasks.some((task) => task.agentId === a.id);
                const status = hasActiveTask ? "Running" : "Idle";
                return (
                  <div key={a.id} className="flex items-center gap-3">
                    <div className="w-40 shrink-0 truncate text-[12px]">
                      {a.identity?.emoji ?? "🤖"} {a.name ?? a.identity?.name ?? a.id}
                    </div>
                    <div className="relative h-4 flex-1 rounded-sm bg-secondary/60">
                      <div
                        className="absolute inset-y-0 left-0 rounded-sm bg-primary/70"
                        style={{ width: hasActiveTask ? "66%" : "0%" }}
                      />
                      <div className="scan-line absolute inset-0 rounded-sm opacity-40" />
                    </div>
                    <div className="w-20 shrink-0 text-right">
                      <StatusBadge status={status} />
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState text="No configured agents returned by OpenClaw." />
            )}
          </div>
        </Panel>

        <Panel
          title="Recent run results"
          right={
            <span className="font-mono text-[10px] text-muted-foreground">
              local bridge session
            </span>
          }
        >
          <div className="max-h-[280px] overflow-y-auto font-mono text-[11px] leading-relaxed">
            {tasks.length ? (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex gap-2 border-b border-border/40 py-1 last:border-b-0"
                >
                  <span className="text-muted-foreground">
                    {formatTime(task.completedAt ?? task.createdAt)}
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
                    {task.status.padEnd(9)}
                  </span>
                  <span className="text-muted-foreground">{task.agentId}</span>
                  <span className="flex-1 truncate">
                    {task.error ?? summarizeResult(task.result) ?? task.label}
                  </span>
                </div>
              ))
            ) : (
              <EmptyState text="Task results will appear here." />
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function summarizeResult(result: unknown) {
  if (!result) return "";
  if (typeof result === "string") return result;
  if (typeof result === "object") {
    const object = result as {
      payloads?: Array<{ text?: string }>;
      text?: string;
      message?: string;
    };
    return (
      object.payloads?.[0]?.text ?? object.text ?? object.message ?? "OpenClaw task completed."
    );
  }
  return String(result);
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-dashed border-border px-3 py-4 text-[12px] text-muted-foreground">
      <ServerCrash className="h-3.5 w-3.5" />
      {text}
    </div>
  );
}
