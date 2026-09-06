import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, StatCard } from "@/components/ui-kit";
import { agents } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";
import { OpenClawTaskButton } from "@/components/openclaw-task-button";

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
        actions={
          <>
            <OpenClawTaskButton
              variant="default"
              label="Refresh Shopify store"
              message="Review the configured Shopify integration and return the current store sync status. Do not modify products, collections, orders, inventory, or customer data."
            >
              Sync store
            </OpenClawTaskButton>
            <OpenClawTaskButton
              label="Shopify optimization review"
              message="Run a safe Shopify store optimization review. Return a prioritized product, collection, SEO, and fulfillment plan. Do not change the store or contact customers without my approval."
            >
              Run Shopify workflow
            </OpenClawTaskButton>
          </>
        }
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
              <div className="mt-2 h-1 overflow-hidden rounded bg-muted">
                <div className="h-full bg-primary" style={{ width: `${s.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
