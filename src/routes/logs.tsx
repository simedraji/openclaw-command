import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Btn, Select } from "@/components/ui-kit";
import { recentLogs } from "@/lib/mock-data";
import { Trash2, Download } from "lucide-react";

export const Route = createFileRoute("/logs")({
  component: LogsPage,
});

// pad the log list a bit
const extra = [
  { t: "11:57:44", lvl: "info", src: "gateway", msg: "OpenClaw gateway boot · 12ms" },
  { t: "11:57:44", lvl: "info", src: "gateway", msg: "listening on :18789" },
  { t: "11:57:45", lvl: "info", src: "model.loader", msg: "loaded llama-3.1-70b (Q4_K_M)" },
  { t: "11:57:46", lvl: "info", src: "model.loader", msg: "loaded deepseek-coder-v2:16b (Ollama)" },
  { t: "11:57:59", lvl: "warn", src: "keys", msg: "shopify.admin_key expires in 4 days" },
  { t: "11:58:00", lvl: "info", src: "telegram.bot", msg: "bot online" },
];

function LogsPage() {
  const all = [...extra, ...recentLogs];
  return (
    <div className="space-y-5">
      <PageHeader
        title="Logs"
        subtitle="Real-time developer log stream from OpenClaw gateway and agents."
        actions={
          <>
            <Select className="w-40">
              <option>All agents</option>
              <option>etsy</option>
              <option>shopify</option>
              <option>niche</option>
              <option>trademark</option>
              <option>design</option>
              <option>fb_ads</option>
              <option>telegram</option>
            </Select>
            <Btn><Download className="h-3.5 w-3.5" /> Export</Btn>
            <Btn variant="danger"><Trash2 className="h-3.5 w-3.5" /> Clear</Btn>
          </>
        }
      />
      <Panel dense>
        <div className="flex items-center justify-between border-b border-border px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>Real-time · tail -f</span>
          <span className="flex items-center gap-1.5"><span className="dot bg-primary pulse-soft" /> streaming</span>
        </div>
        <div className="max-h-[560px] overflow-y-auto p-3 font-mono text-[11px] leading-relaxed">
          {all.map((l, i) => (
            <div key={i} className="grid grid-cols-[80px_50px_140px_1fr] gap-2 border-b border-border/40 py-1 last:border-b-0">
              <span className="text-muted-foreground">{l.t}</span>
              <span className={
                l.lvl === "err" ? "text-destructive" :
                l.lvl === "warn" ? "text-warning" : "text-primary"
              }>{l.lvl}</span>
              <span className="text-info">{l.src}</span>
              <span className="truncate">{l.msg}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
