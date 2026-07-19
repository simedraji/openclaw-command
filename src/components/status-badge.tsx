import type { AgentStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const map: Record<AgentStatus, { color: string; dot: string; label: string }> = {
  Idle: { color: "text-muted-foreground bg-muted/40 border-border", dot: "bg-muted-foreground", label: "Idle" },
  Thinking: { color: "text-info bg-info/10 border-info/30", dot: "bg-info pulse-soft", label: "Thinking" },
  Running: { color: "text-primary bg-primary/10 border-primary/30", dot: "bg-primary pulse-soft", label: "Running" },
  Waiting: { color: "text-warning bg-warning/10 border-warning/30", dot: "bg-warning", label: "Waiting" },
  Failed: { color: "text-destructive bg-destructive/10 border-destructive/30", dot: "bg-destructive", label: "Failed" },
  Completed: { color: "text-foreground bg-secondary border-border", dot: "bg-primary", label: "Completed" },
};

export function StatusBadge({ status, className }: { status: AgentStatus; className?: string }) {
  const s = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider", s.color, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}
