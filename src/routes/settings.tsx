import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Btn } from "@/components/ui-kit";
import { useOpenClawDashboard } from "@/hooks/use-openclaw";
import { RefreshCw, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { data, isFetching, refetch } = useOpenClawDashboard();
  return (
    <div className="space-y-5">
      <PageHeader
        title="Settings"
        subtitle="This dashboard never stores or displays your OpenClaw credentials."
        actions={
          <Btn type="button" disabled={isFetching} onClick={() => void refetch()}>
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} /> Test
            connection
          </Btn>
        }
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel title="OpenClaw gateway">
          <div className="space-y-3">
            <div
              className={`rounded-md border p-3 text-[12px] ${data?.connected ? "border-primary/30 bg-primary/10 text-primary" : "border-destructive/30 bg-destructive/10 text-destructive"}`}
            >
              {data?.connected
                ? "OpenClaw Gateway is reachable."
                : "Gateway not connected. Start OpenClaw, then start the bridge."}
            </div>
            <div className="rounded-md border border-border bg-background/50 p-3 font-mono text-[11px] text-muted-foreground">
              Dashboard bridge: http://127.0.0.1:18790
              <br />
              Gateway: managed by your local OpenClaw CLI
            </div>
          </div>
        </Panel>

        <Panel title="Security model">
          <div className="space-y-3">
            <div className="flex gap-2 text-[12px] text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
              The browser talks only to a local bridge. The bridge invokes your
              already-authenticated OpenClaw CLI, so tokens and API keys stay outside the browser.
            </div>
            <div className="rounded-md border border-warning/30 bg-warning/5 p-3 text-[11px] text-warning">
              Keep the bridge bound to 127.0.0.1. Do not expose port 18790 on your VPS, LAN,
              Cloudflare Tunnel, or public domain.
            </div>
          </div>
        </Panel>

        <Panel title="Configure OpenClaw">
          <div className="space-y-3">
            <div className="text-[12px] text-muted-foreground">
              Configure models, Telegram, Etsy, Shopify, and any MCP tools in OpenClaw itself. This
              dashboard reads the configured agents and sends tasks to them; it does not duplicate
              or reveal your integrations.
            </div>
            <pre className="overflow-auto rounded-md border border-border bg-background/60 p-3 font-mono text-[11px] text-muted-foreground">{`openclaw status --all\nopenclaw agents list --json\nopenclaw gateway`}</pre>
          </div>
        </Panel>
      </div>
    </div>
  );
}
