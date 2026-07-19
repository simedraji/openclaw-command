import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Btn, Field, Input } from "@/components/ui-kit";
import { Shield, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/trademark")({
  component: TrademarkPage,
});

function TrademarkPage() {
  const risk = 62; // medium
  const label = risk < 40 ? "Safe" : risk < 70 ? "Medium risk" : "High risk";
  const tone = risk < 40 ? "text-primary" : risk < 70 ? "text-warning" : "text-destructive";
  return (
    <div className="space-y-5">
      <PageHeader title="Trademark Check" subtitle="Local AI phrase & logo risk screening." />
      <Panel>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[320px] flex-1"><Field label="Phrase or design idea"><Input defaultValue="Girl Dad Club" /></Field></div>
          <Btn variant="primary"><Shield className="h-3.5 w-3.5" /> Check risk</Btn>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Panel title="Risk meter" className="lg:col-span-1">
          <div className="text-center">
            <div className={`text-5xl font-semibold ${tone}`}>{risk}</div>
            <div className={`mt-1 inline-flex items-center gap-1 text-[12px] font-medium ${tone}`}>
              <ShieldAlert className="h-3.5 w-3.5" /> {label}
            </div>
            <div className="relative mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-primary via-warning to-destructive opacity-70" />
              <div className="absolute top-[-2px] h-3 w-0.5 bg-foreground" style={{ left: `${risk}%` }} />
            </div>
            <div className="mt-1 flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>Safe</span><span>Medium</span><span>High</span>
            </div>
          </div>
        </Panel>

        <Panel title="Similar registered phrases" className="lg:col-span-2">
          <table className="w-full text-[12px]">
            <thead className="text-left text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr><th className="pb-1">Phrase</th><th>Owner</th><th>Class</th><th>Status</th></tr>
            </thead>
            <tbody>
              {[
                ["GIRL DAD", "Kobe Inc. Family LLC", "025", "Live"],
                ["#GIRLDAD", "Girl Dad Club Co.", "025", "Live"],
                ["DAD CLUB", "Papa Bear Trademarks", "025, 041", "Pending"],
                ["GIRL DAD LIFE", "Independent seller", "025", "Abandoned"],
              ].map(([p, o, c, s]) => (
                <tr key={p} className="border-t border-border/40">
                  <td className="py-1.5 font-medium">{p}</td>
                  <td className="text-muted-foreground">{o}</td>
                  <td className="font-mono">{c}</td>
                  <td>{s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      <Panel title="Safer alternatives">
        <div className="flex flex-wrap gap-2">
          {["Proud Girl Dad", "Dad of Daughters", "Raising Queens", "Girl Dad Era", "Team Girl Dad"].map((a) => (
            <span key={a} className="rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-[12px] text-primary">{a}</span>
          ))}
        </div>
      </Panel>

      <div className="rounded-md border border-warning/30 bg-warning/5 px-4 py-2 text-[11px] text-warning">
        Local AI check only. Not legal advice. Consult a trademark attorney before commercial use.
      </div>
    </div>
  );
}
