import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Btn, StatCard } from "@/components/ui-kit";
import { agents } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/shopify")({
  component: ShopifyPage,
});

function ShopifyPage() {
  const a = agents.find((x) => x.id === "shopify")!;
  return (
    <div className="space-y-5">
      <PageHeader
        title="Shopify Tools"
        subtitle="Local automation surface for your Shopify store."
        actions={<><Btn>Sync store</Btn><Btn variant="primary">Run all Shopify sub-agents</Btn></>}
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Store" value="merchiq-lab" sub=".myshopify.com" />
        <StatCard label="Products" value={342} sub="+8 today" tone="ok" />
        <StatCard label="Orders (24h)" value={54} tone="ok" />
        <StatCard label="Collections" value={18} />
      </div>
      <Panel title={`${a.name} · sub-agents`}>
        <div className="grid gap-3 md:grid-cols-2">
          {a.subAgents.map((s) => (
            <div key={s.name} className="rounded-md border border-border/60 bg-background/40 p-3">
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-medium">{s.name}</div>
                <StatusBadge status={s.status} />
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">{s.task}</div>
              <div className="mt-2 h-1 overflow-hidden rounded bg-muted"><div className="h-full bg-primary" style={{ width: `${s.progress}%` }} /></div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
