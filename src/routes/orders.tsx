import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Btn } from "@/components/ui-kit";
import { RefreshCw, Download } from "lucide-react";
import { orders } from "@/lib/mock-data";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Order Management"
        subtitle="Locally synced orders across Etsy + Shopify with AI suggested actions."
        actions={
          <>
            <Btn><RefreshCw className="h-3.5 w-3.5" /> Sync orders</Btn>
            <Btn><Download className="h-3.5 w-3.5" /> Export CSV</Btn>
          </>
        }
      />
      <Panel dense>
        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-widest text-muted-foreground">
              <th className="px-4 py-2">Order</th>
              <th className="px-4 py-2">Platform</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Fulfillment</th>
              <th className="px-4 py-2">Tracking</th>
              <th className="px-4 py-2">AI action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-border/50 hover:bg-secondary/30">
                <td className="px-4 py-2 font-mono">{o.id}</td>
                <td className="px-4 py-2">
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] ${o.platform === "Etsy" ? "border-warning/40 bg-warning/10 text-warning" : "border-info/40 bg-info/10 text-info"}`}>{o.platform}</span>
                </td>
                <td className="px-4 py-2">{o.customer}</td>
                <td className="px-4 py-2 text-muted-foreground">{o.product}</td>
                <td className="px-4 py-2">{o.status}</td>
                <td className="px-4 py-2 font-mono">{o.tracking}</td>
                <td className="px-4 py-2">
                  <Btn size="sm" variant={o.action === "None" ? "ghost" : "primary"}>{o.action}</Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
