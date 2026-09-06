import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel, Field, Input, Select } from "@/components/ui-kit";
import { keywords } from "@/lib/mock-data";
import { Search, TrendingUp } from "lucide-react";
import { OpenClawTaskButton } from "@/components/openclaw-task-button";

export const Route = createFileRoute("/niche")({
  component: NichePage,
});

function NichePage() {
  const [keyword, setKeyword] = useState("dad life");
  const [platform, setPlatform] = useState("Etsy");
  return (
    <div className="space-y-5">
      <PageHeader
        title="Niche Research"
        subtitle="Discover trending, low-competition POD niches locally."
      />
      <Panel>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[240px] flex-1">
            <Field label="Keyword">
              <Input value={keyword} onChange={(event) => setKeyword(event.target.value)} />
            </Field>
          </div>
          <div className="w-48">
            <Field label="Platform">
              <Select value={platform} onChange={(event) => setPlatform(event.target.value)}>
                <option>Etsy</option>
                <option>Shopify</option>
                <option>Amazon</option>
                <option>Pinterest</option>
                <option>Google Trends</option>
              </Select>
            </Field>
          </div>
          <OpenClawTaskButton
            label={`Research niche: ${keyword}`}
            message={`Research the POD niche "${keyword}" using ${platform}. Return demand signals, competition, safe product ideas, and a concise execution plan. Do not scrape, publish, buy, or use paid services unless I approve.`}
          >
            <Search className="h-3.5 w-3.5" /> Run research
          </OpenClawTaskButton>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <ScoreCard label="Opportunity" score={74} tone="ok" />
        <ScoreCard label="Demand" score={68} tone="ok" />
        <ScoreCard label="Competition" score={48} tone="warn" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Panel title="12-month trend" className="lg:col-span-2">
          <Trend />
        </Panel>
        <Panel title="Product ideas">
          <ul className="space-y-1.5 text-[12px]">
            {[
              "Girl Dad · retro varsity tee",
              "Dog Dad · vintage sunset tee",
              "Cat Dad · minimal line-art tee",
              "Dad Mode: Loading · gamer mug",
              "World's Okayest Dad · dad hat",
              "Papa Bear · woodland hoodie",
            ].map((i) => (
              <li
                key={i}
                className="flex items-center gap-2 rounded-md border border-border/50 bg-background/40 px-2.5 py-1.5"
              >
                <TrendingUp className="h-3 w-3 text-primary" /> {i}
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Keyword table" dense>
        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-widest text-muted-foreground">
              <th className="px-4 py-2 font-medium">Keyword</th>
              <th className="px-4 py-2 font-medium">Volume</th>
              <th className="px-4 py-2 font-medium">Competition</th>
              <th className="px-4 py-2 font-medium">Opportunity</th>
            </tr>
          </thead>
          <tbody>
            {keywords.map((k) => (
              <tr key={k.kw} className="border-t border-border/50">
                <td className="px-4 py-2 font-medium">{k.kw}</td>
                <td className="px-4 py-2 font-mono">{k.vol.toLocaleString()}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-24 overflow-hidden rounded bg-muted">
                      <div className="h-full bg-warning" style={{ width: `${k.comp * 100}%` }} />
                    </div>
                    <span className="font-mono text-[11px]">{(k.comp * 100).toFixed(0)}%</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-24 overflow-hidden rounded bg-muted">
                      <div className="h-full bg-primary" style={{ width: `${k.opp}%` }} />
                    </div>
                    <span className="font-mono text-[11px] text-primary">{k.opp}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

function ScoreCard({ label, score, tone }: { label: string; score: number; tone: "ok" | "warn" }) {
  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {label} score
        </div>
        <div
          className={`font-mono text-2xl font-semibold ${tone === "ok" ? "text-primary" : "text-warning"}`}
        >
          {score}
        </div>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full ${tone === "ok" ? "bg-primary" : "bg-warning"}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function Trend() {
  const pts = [22, 28, 26, 34, 40, 48, 52, 58, 62, 70, 68, 74];
  const max = 80;
  const w = 100;
  const h = 40;
  const path = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${(i / (pts.length - 1)) * w},${h - (p / max) * h}`)
    .join(" ");
  const area = `${path} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-40 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.16 155)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="oklch(0.78 0.16 155)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#g)" />
      <path d={path} fill="none" stroke="oklch(0.78 0.16 155)" strokeWidth="0.6" />
    </svg>
  );
}
