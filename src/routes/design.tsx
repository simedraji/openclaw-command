import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Btn, Field, Textarea } from "@/components/ui-kit";
import { Sparkles, Download, Save, ImagePlus } from "lucide-react";

export const Route = createFileRoute("/design")({
  component: DesignPage,
});

function DesignPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Design Generator" subtitle="Local diffusion pipeline · SDXL + upscaler." />
      <Panel>
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <Field label="Prompt">
            <Textarea rows={3} defaultValue="Retro-futurist illustration of a bearded dad, varsity jacket, 80s sunset, GIRL DAD ERA type, transparent PNG, 4500x5400" />
          </Field>
          <Btn variant="primary"><Sparkles className="h-3.5 w-3.5" /> Generate design</Btn>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px]">
          <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="accent-primary" /> Background remover</label>
          <Btn size="sm">Upscale ×2</Btn>
          <Btn size="sm">Upscale ×4</Btn>
          <div className="ml-auto flex gap-2">
            <Btn size="sm"><Save className="h-3 w-3" /> Save to vault</Btn>
            <Btn size="sm"><Download className="h-3 w-3" /> PNG</Btn>
            <Btn size="sm"><Download className="h-3 w-3" /> Prompt JSON</Btn>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="panel overflow-hidden">
            <div className="relative aspect-square bg-gradient-to-br from-secondary via-background to-secondary/40">
              <div className="scan-line absolute inset-x-0 bottom-0 h-1 opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-30"><ImagePlus /></div>
              <div className="absolute left-2 top-2 rounded bg-background/70 px-1.5 py-0.5 font-mono text-[10px] backdrop-blur">seed_{88200 + i}</div>
            </div>
            <div className="flex items-center justify-between px-2 py-1.5 text-[10px] text-muted-foreground">
              <span>4500×5400 · 300dpi</span>
              <span className="text-primary">ready</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
