import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Field, Input, Select, Textarea } from "@/components/ui-kit";
import { Save, Send } from "lucide-react";
import { OpenClawTaskButton } from "@/components/openclaw-task-button";

export const Route = createFileRoute("/listings")({
  component: ListingsPage,
});

function ListingsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Listing Automation"
        subtitle="Draft, score and publish listings to Etsy or Shopify."
      />
      <Panel>
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
          <Field label="Platform">
            <Select>
              <option>Etsy</option>
              <option>Shopify</option>
            </Select>
          </Field>
          <Field label="Base niche">
            <Input defaultValue="Girl Dad" />
          </Field>
          <Field label="Design file">
            <Select>
              <option>seed_88213_girl-dad-era.png</option>
              <option>seed_88200_retro-surf.png</option>
            </Select>
          </Field>
          <div className="flex items-end">
            <OpenClawTaskButton
              label="Generate POD listing draft"
              message="Generate a compliant POD listing draft for the Girl Dad niche with title, description, tags, pricing suggestions, and a trademark caution. Save nothing externally and do not publish."
            >
              Generate all
            </OpenClawTaskButton>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Panel title="Generated title & tags" className="lg:col-span-2">
          <div className="space-y-3">
            <Field label="Product title">
              <Input defaultValue="Girl Dad Era Shirt · Retro 80s Varsity Dad Tee · Gift for Girl Dad" />
            </Field>
            <Field label="Description">
              <Textarea
                rows={6}
                defaultValue={
                  "Rep the Girl Dad Era with this retro 80s varsity-style tee. Soft heather cream fabric, DTG-printed for durable color, unisex fit.\n\n• 100% ringspun cotton\n• Unisex sizing S–3XL\n• DTG print, wash inside-out\n• Made in USA · Ships in 2–3 days"
                }
              />
            </Field>
            <Field label="Tags (13)">
              <div className="flex flex-wrap gap-1.5">
                {[
                  "girl dad",
                  "girl dad tee",
                  "gift for dad",
                  "retro dad shirt",
                  "dad era",
                  "girl dad era",
                  "father's day",
                  "papa shirt",
                  "dad life",
                  "1st time dad",
                  "new dad gift",
                  "funny dad tee",
                  "80s dad",
                ].map((t) => (
                  <span
                    key={t}
                    className="rounded border border-border bg-secondary/60 px-2 py-0.5 text-[11px]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Price">
                <Input defaultValue="$22.99" />
              </Field>
              <Field label="SEO score">
                <div className="flex items-center gap-2 rounded-md border border-border bg-input px-3 py-1.5">
                  <span className="text-primary font-mono text-[13px]">86</span>
                  <div className="h-1 flex-1 overflow-hidden rounded bg-muted">
                    <div className="h-full bg-primary" style={{ width: "86%" }} />
                  </div>
                </div>
              </Field>
              <Field label="Compliance">
                <div className="rounded-md border border-primary/30 bg-primary/10 px-3 py-1.5 text-[12px] text-primary">
                  Trademark cleared
                </div>
              </Field>
            </div>
            <div className="flex gap-2 pt-1">
              <OpenClawTaskButton
                variant="default"
                label="Save listing draft"
                message="Prepare and save a local listing draft in the configured OpenClaw workspace. Do not publish it to any marketplace."
              >
                <Save className="h-3.5 w-3.5" /> Save draft locally
              </OpenClawTaskButton>
              <OpenClawTaskButton
                label="Review Etsy listing"
                message="Review the current listing draft for Etsy and return an approval checklist. Do not publish or edit Etsy until I explicitly approve."
              >
                <Send className="h-3.5 w-3.5" /> Publish to Etsy
              </OpenClawTaskButton>
              <OpenClawTaskButton
                label="Review Shopify listing"
                message="Review the current listing draft for Shopify and return an approval checklist. Do not publish or edit Shopify until I explicitly approve."
              >
                <Send className="h-3.5 w-3.5" /> Publish to Shopify
              </OpenClawTaskButton>
            </div>
          </div>
        </Panel>

        <Panel title="Listing preview">
          <div className="aspect-square rounded-md border border-border bg-gradient-to-br from-secondary via-background to-secondary/40" />
          <div className="mt-2 text-[13px] font-medium leading-tight">
            Girl Dad Era Shirt · Retro 80s Varsity Dad Tee
          </div>
          <div className="mt-1 flex items-center justify-between text-[12px]">
            <span className="font-mono">$22.99</span>
            <span className="text-muted-foreground">Etsy · Draft</span>
          </div>
          <div className="mt-3 text-[10px] text-muted-foreground">
            Mockup rendered locally at 1200×1200 preview.
          </div>
        </Panel>
      </div>
    </div>
  );
}
