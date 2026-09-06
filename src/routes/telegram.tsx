import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel, Input, Select } from "@/components/ui-kit";
import { Send } from "lucide-react";
import { OpenClawTaskButton } from "@/components/openclaw-task-button";

export const Route = createFileRoute("/telegram")({
  component: TelegramPage,
});

const commands = [
  "/research niche",
  "/check trademark",
  "/generate prompt",
  "/create listing",
  "/analyze ads",
  "/orders today",
];

const messages = [
  {
    from: "bot",
    t: "09:00",
    msg: "Daily report: 148 Etsy jobs, 92 Shopify, 214 orders processed. 2 trademark warnings queued.",
  },
  { from: "me", t: "09:12", msg: "/research niche dad life" },
  {
    from: "bot",
    t: "09:12",
    msg: "Niche Research Agent started. Scanning Etsy + Pinterest for 'dad life'...",
  },
  {
    from: "bot",
    t: "09:14",
    msg: "Opportunity 74 · Demand 68 · Competition 48. Top idea: 'Girl Dad Era retro varsity'.",
  },
  { from: "me", t: "09:15", msg: "/generate prompt Girl Dad Era retro varsity" },
  {
    from: "bot",
    t: "09:15",
    msg: "Prompt built + queued to Design Agent. 8 designs rendering (ETA 6m).",
  },
];

function TelegramPage() {
  const [command, setCommand] = useState("");
  return (
    <div className="space-y-5">
      <PageHeader
        title="Telegram Chat"
        subtitle="Dispatch safe command tasks to OpenClaw; configure Telegram delivery inside OpenClaw."
        actions={
          <>
            <OpenClawTaskButton
              label="Telegram bridge check"
              message="Check the configured Telegram channel in OpenClaw and return its connection status. Do not send any message."
            >
              <Send className="h-3.5 w-3.5" /> Send test message
            </OpenClawTaskButton>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_260px]">
        <Panel dense>
          <div className="flex flex-col h-[520px]">
            <div className="flex items-center gap-3 border-b border-border px-4 py-2.5">
              <div className="h-7 w-7 rounded-full bg-info/20 grid place-items-center text-info">
                ✈
              </div>
              <div className="leading-tight">
                <div className="text-[12px] font-medium">@merchiq_local_bot</div>
                <div className="text-[10px] text-muted-foreground">
                  connected · 12ms · 2 subscribers
                </div>
              </div>
              <div className="ml-auto">
                <Select className="w-40">
                  <option>All agents</option>
                  <option>Niche Research</option>
                  <option>Design</option>
                  <option>FB Ads</option>
                </Select>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg border px-3 py-1.5 text-[12px] ${m.from === "me" ? "border-primary/30 bg-primary/10 text-foreground" : "border-border bg-secondary/60"}`}
                  >
                    <div className="whitespace-pre-wrap">{m.msg}</div>
                    <div className="mt-0.5 text-right font-mono text-[9px] text-muted-foreground">
                      {m.t}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 border-t border-border p-2">
              <Input
                value={command}
                onChange={(event) => setCommand(event.target.value)}
                placeholder="Type a command or message… try /orders today"
              />
              <OpenClawTaskButton
                size="sm"
                label="OpenClaw command"
                message={command || "Summarize today's MerchIQ operations status."}
                onQueued={() => setCommand("")}
              >
                <Send className="h-3.5 w-3.5" /> Send
              </OpenClawTaskButton>
            </div>
          </div>
        </Panel>

        <Panel title="Command suggestions">
          <div className="space-y-1">
            {commands.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCommand(c)}
                className="w-full rounded-md border border-border bg-secondary/40 px-2.5 py-1.5 text-left font-mono text-[11px] hover:bg-secondary"
              >
                {c}
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
