import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Btn, Field, Input, Select, Textarea } from "@/components/ui-kit";
import { Sparkles, Copy } from "lucide-react";

export const Route = createFileRoute("/prompt")({
  component: PromptPage,
});

function PromptPage() {
  const output = `Print-on-demand design: retro-futurist illustration of a bearded dad in a varsity jacket holding a coffee mug, surrounded by 80s sunset gradients and palm silhouettes, bold serif type reading "GIRL DAD ERA", warm cream + coral palette, high-detail vector look, thick outlines, halftone shading.

Target: millennial dad, gift buyer.
Style: retro 80s varsity.
Placement: front chest, centered.
Shirt color: heather cream.
Output ratio: 4:5 portrait.

Technical: 4500x5400 px, 300 DPI, transparent background, centered composition, DTG/DTF ready, no mockup.`;
  return (
    <div className="space-y-5">
      <PageHeader title="Prompt Generator" subtitle="Craft POD-ready image prompts for local diffusion models." />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel title="Inputs">
          <div className="space-y-3">
            <Field label="Niche"><Input defaultValue="Girl Dad" /></Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Style"><Input defaultValue="Retro 80s varsity" /></Field>
              <Field label="Target customer"><Input defaultValue="Millennial dad gift buyer" /></Field>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Shirt color"><Input defaultValue="Heather cream" /></Field>
              <Field label="Output ratio">
                <Select defaultValue="4:5">
                  <option>4:5</option><option>1:1</option><option>3:4</option><option>2:3</option>
                </Select>
              </Field>
            </div>
            <Field label="Text phrase"><Input defaultValue="GIRL DAD ERA" /></Field>
            <Field label="Design elements">
              <Textarea rows={3} defaultValue="Sunset gradient, palm silhouettes, halftone, bold serif type, thick outlines" />
            </Field>
            <Btn variant="primary"><Sparkles className="h-3.5 w-3.5" /> Generate prompt</Btn>
          </div>
        </Panel>

        <Panel title="Generated prompt" right={<Btn size="sm"><Copy className="h-3 w-3" /> Copy</Btn>}>
          <pre className="max-h-[440px] overflow-auto whitespace-pre-wrap rounded-md border border-border bg-background/60 p-3 font-mono text-[11px] leading-relaxed">
{output}
          </pre>
          <div className="mt-2 text-[10px] text-muted-foreground">Includes 4500x5400 px · 300 DPI · transparent · DTG/DTF-ready spec.</div>
        </Panel>
      </div>
    </div>
  );
}
