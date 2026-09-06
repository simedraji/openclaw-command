import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, StatCard } from "@/components/ui-kit";
import { campaigns } from "@/lib/mock-data";
import { AlertTriangle } from "lucide-react";
import { OpenClawTaskButton } from "@/components/openclaw-task-button";

export const Route = createFileRoute("/ads")({
  component: AdsPage,
});

function AdsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Facebook Ads MCP"
        subtitle="Local MCP-connected analyzer for campaigns and pixel health."
        actions={
          <OpenClawTaskButton
            label="Ads analysis"
            message="Analyze the configured Facebook Ads data and Pixel health. Return a safe optimization plan with budget recommendations, but do not change campaigns, audiences, budgets, or billing without explicit approval."
          >
            Run ads analysis
          </OpenClawTaskButton>
        }
      />

      <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-2.5 text-[12px] text-destructive flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        Only <span className="font-mono">PageView</span> is firing on Pixel A. Add{" "}
        <span className="font-mono">ViewContent</span>, <span className="font-mono">AddToCart</span>
        , and <span className="font-mono">Purchase</span> events to restore attribution.
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          label="Pixel status"
          value="1 / 2"
          sub="A: partial · B: unreachable"
          tone="warn"
        />
        <StatCard label="MCP connection" value="Online" sub="fb-ads-mcp@:7420" tone="ok" />
        <StatCard label="Blended ROAS" value="2.9x" sub="7d rolling" tone="ok" />
        <StatCard label="Ad spend today" value="$412" sub="$1,840 this week" />
      </div>

      <Panel title="Campaigns">
        <div className="space-y-2">
          {campaigns.map((c) => (
            <div
              key={c.name}
              className="grid grid-cols-2 items-center gap-3 rounded-md border border-border/60 bg-background/40 p-3 md:grid-cols-[2fr_repeat(5,1fr)_auto]"
            >
              <div className="col-span-2 md:col-span-1">
                <div className="text-[12px] font-medium">{c.name}</div>
                <div
                  className={`text-[10px] uppercase tracking-widest ${c.status === "Active" ? "text-primary" : "text-muted-foreground"}`}
                >
                  {c.status}
                </div>
              </div>
              <Kv l="ROAS" v={`${c.roas}x`} tone={c.roas >= 2 ? "ok" : "warn"} />
              <Kv l="CPC" v={`$${c.cpc.toFixed(2)}`} />
              <Kv l="CPM" v={`$${c.cpm.toFixed(2)}`} />
              <Kv l="CTR" v={`${c.ctr}%`} />
              <Kv l="Creative" v={String(c.score)} tone={c.score >= 70 ? "ok" : "warn"} />
              <div className="hidden md:block w-24">
                <div className="h-1 overflow-hidden rounded bg-muted">
                  <div
                    className={`h-full ${c.score >= 70 ? "bg-primary" : "bg-warning"}`}
                    style={{ width: `${c.score}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="AI recommendations">
        <ul className="space-y-1.5 text-[12px]">
          <li>
            · Kill <b>Golf Grandpa – Cold</b>: ROAS 1.2x, CTR 0.9%, creative score 42.
          </li>
          <li>
            · Scale <b>Retro Surf – Retarget</b> 25%: ROAS 4.8x, creative score 91.
          </li>
          <li>· Fix Pixel A events before Sunday to preserve LAL audience quality.</li>
          <li>
            · Test UGC dad-reaction hook against <b>Dad Life – Broad</b>.
          </li>
        </ul>
      </Panel>
    </div>
  );
}

function Kv({
  l,
  v,
  tone = "default",
}: {
  l: string;
  v: string;
  tone?: "default" | "ok" | "warn";
}) {
  const c = tone === "ok" ? "text-primary" : tone === "warn" ? "text-warning" : "text-foreground";
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{l}</div>
      <div className={`font-mono text-[13px] ${c}`}>{v}</div>
    </div>
  );
}
