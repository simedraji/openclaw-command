import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel, Field, Textarea, Select } from "@/components/ui-kit";
import { StatusBadge } from "@/components/status-badge";
import { OpenClawTaskButton } from "@/components/openclaw-task-button";
import { useOpenClawDashboard } from "@/hooks/use-openclaw";
import { Bot } from "lucide-react";

export const Route = createFileRoute("/agents")({
  component: AgentsPage,
});

function AgentsPage() {
  const { data, isLoading, error } = useOpenClawDashboard();
  const agents = data?.agents ?? [];
  const [agentId, setAgentId] = useState("main");
  const [message, setMessage] = useState(
    "Review the current POD workflow and tell me the next action to take.",
  );
  const selectedAgent = agents.find((agent) => agent.id === agentId);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Agents"
        subtitle="Configured agents are loaded directly from your local OpenClaw installation."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Panel title="Configured agents" className="lg:col-span-2">
          <div className="space-y-2">
            {agents.length ? (
              agents.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-wrap items-center gap-3 rounded-md border border-border/60 bg-background/40 p-3"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-lg">
                    {a.identity?.emoji ?? "🤖"}
                  </div>
                  <div className="min-w-[180px] flex-1">
                    <div className="text-[13px] font-medium">
                      {a.name ?? a.identity?.name ?? a.id}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      id: {a.id}
                      {a.workspace ? ` · ${a.workspace}` : ""}
                    </div>
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground">
                    model: {a.model?.primary ?? "default"}
                  </div>
                  <StatusBadge status="Idle" />
                </div>
              ))
            ) : (
              <div className="rounded-md border border-dashed border-border p-4 text-[12px] text-muted-foreground">
                {isLoading
                  ? "Loading OpenClaw agents…"
                  : error instanceof Error
                    ? error.message
                    : "No agents configured yet. Create one with `openclaw agents add` first."}
              </div>
            )}
          </div>
        </Panel>

        <Panel title="Send a real task">
          <div className="space-y-3">
            <Field label="Agent">
              <Select value={agentId} onChange={(event) => setAgentId(event.target.value)}>
                <option value="main">main (default)</option>
                {agents
                  .filter((agent) => agent.id !== "main")
                  .map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name ?? agent.identity?.name ?? agent.id}
                    </option>
                  ))}
              </Select>
            </Field>
            <div className="rounded-md border border-border bg-background/50 p-2 text-[11px] text-muted-foreground">
              <Bot className="mr-1 inline h-3.5 w-3.5" />
              {selectedAgent?.model?.primary ?? "Uses the agent's configured default model."}
            </div>
            <Field label="Task">
              <Textarea
                rows={6}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </Field>
            <OpenClawTaskButton
              className="w-full"
              label="Manual agent task"
              agentId={agentId}
              message={message}
            >
              Send task to OpenClaw
            </OpenClawTaskButton>
          </div>
        </Panel>
      </div>
    </div>
  );
}
