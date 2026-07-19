import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Btn, Field, Input } from "@/components/ui-kit";
import { Swords, Download } from "lucide-react";

export const Route = createFileRoute("/competition")({
  component: CompetitionPage,
});

function CompetitionPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Competition Analysis"
        subtitle="Deconstruct competitor Etsy/Shopify listings locally."
        actions={<Btn><Download className="h-3.5 w-3.5" /> Export report</Btn>}
      />
      <Panel>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[320px] flex-1"><Field label="Competitor URL"><Input defaultValue="https://etsy.com/shop/RetroDadCo" /></Field></div>
          <Btn variant="primary"><Swords className="h-3.5 w-3.5" /> Analyze</Btn>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {[
          { t: "Retro Dad Varsity Tee", p: "$24.99", sales: "1,204", score: 88 },
          { t: "Girl Dad Sunset Tee", p: "$22.99", sales: "894", score: 82 },
          { t: "Dog Dad Vintage Hoodie", p: "$38.99", sales: "612", score: 76 },
          { t: "Cat Dad Line Art Tee", p: "$21.99", sales: "480", score: 71 },
        ].map((c) => (
          <div key={c.t} className="panel p-3">
            <div className="aspect-square rounded-md border border-border bg-gradient-to-br from-secondary to-background" />
            <div className="mt-2 text-[12px] font-medium">{c.t}</div>
            <div className="mt-0.5 flex justify-between text-[11px] text-muted-foreground">
              <span>{c.p}</span><span>{c.sales} sales</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[10px]">
              <div className="h-1 flex-1 overflow-hidden rounded bg-muted"><div className="h-full bg-primary" style={{ width: `${c.score}%` }} /></div>
              <span className="font-mono text-primary">{c.score}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Panel title="Pricing comparison">
          {[["You", "$22.00"], ["RetroDadCo", "$24.99"], ["DadZoneShop", "$19.99"], ["PapaBearGoods", "$26.50"]].map(([n, p]) => (
            <div key={n} className="flex justify-between border-b border-border/40 py-1.5 text-[12px] last:border-0">
              <span>{n}</span><span className="font-mono">{p}</span>
            </div>
          ))}
        </Panel>
        <Panel title="SEO keyword gaps">
          <div className="flex flex-wrap gap-1.5">
            {["girl dad", "dog dad", "papa bear", "dad joke", "father's day", "retro dad", "gift for dad", "1st time dad"].map((k) => (
              <span key={k} className="rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-[11px]">{k}</span>
            ))}
          </div>
        </Panel>
        <Panel title="Ad angle suggestions">
          <ul className="space-y-1 text-[12px] text-muted-foreground">
            <li>· Father's Day gifting angle (60-day runway)</li>
            <li>· "Girl Dad" community-driven creative</li>
            <li>· Retro / nostalgia 80s pattern angle</li>
            <li>· UGC dad-reaction video hook</li>
          </ul>
        </Panel>
      </div>

      <Panel title="Listing quality score">
        <div className="flex items-center gap-6">
          <div className="text-4xl font-semibold text-primary">B+</div>
          <div className="grid flex-1 grid-cols-2 gap-3 text-[12px] md:grid-cols-4">
            <Metric label="Title" value={82} />
            <Metric label="Tags" value={74} />
            <Metric label="Images" value={68} />
            <Metric label="Description" value={88} />
          </div>
        </div>
      </Panel>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
        <span>{label}</span><span className="font-mono">{value}</span>
      </div>
      <div className="h-1 overflow-hidden rounded bg-muted"><div className="h-full bg-primary" style={{ width: `${value}%` }} /></div>
    </div>
  );
}
