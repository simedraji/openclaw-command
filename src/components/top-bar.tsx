import { Cpu, HardDrive, Radio, KeyRound, Send, ListOrdered } from "lucide-react";

function Chip({ label, value, tone = "default", icon: Icon }: { label: string; value: string; tone?: "default" | "ok" | "warn"; icon?: React.ComponentType<{ className?: string }> }) {
  const toneCls = tone === "ok" ? "text-primary" : tone === "warn" ? "text-warning" : "text-foreground";
  return (
    <div className="flex items-center gap-2 border-r border-border px-3 py-1.5 last:border-r-0">
      {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className={`text-[11px] font-mono ${toneCls}`}>{value}</span>
    </div>
  );
}

export function TopBar() {
  return (
    <div className="flex h-11 shrink-0 items-center justify-between border-b border-border bg-card/40 pl-2 pr-3">
      <div className="flex items-center overflow-x-auto">
        <div className="flex items-center gap-2 border-r border-border px-3 py-1.5">
          <span className="dot bg-primary pulse-soft" />
          <span className="text-[11px] font-medium">OpenClaw Gateway</span>
          <span className="text-[11px] text-primary">Online</span>
        </div>
        <Chip label="URL" value="http://localhost:18789" />
        <Chip label="Model" value="llama-3.1-70b · local" icon={Radio} />
        <Chip label="GPU" value="RTX 4090 · 41%" tone="ok" icon={Cpu} />
        <Chip label="CPU" value="18% · 32GB" icon={HardDrive} />
        <Chip label="Agents" value="7 running" tone="ok" />
        <Chip label="Queue" value="12 tasks" icon={ListOrdered} />
        <Chip label="Keys" value="8/9 ok" tone="warn" icon={KeyRound} />
        <Chip label="Telegram" value="Bot online" tone="ok" icon={Send} />
      </div>
      <div className="hidden shrink-0 items-center gap-2 pl-3 text-[10px] text-muted-foreground md:flex">
        <span className="font-mono">uptime 04:12:39</span>
      </div>
    </div>
  );
}
