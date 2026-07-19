import { createFileRoute } from "@tanstack/react-router";
import { agents } from "@/lib/mock-data";
import { PageHeader, Panel, Btn, Field, Input, Textarea, Select } from "@/components/ui-kit";
import { StatusBadge } from "@/components/status-badge";
import { Plus, Download, Upload, Save } from "lucide-react";

export const Route = createFileRoute("/agents")({
  component: AgentsPage,
});

function AgentsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Agents"
        subtitle="Build, configure, and orchestrate local OpenClaw agents and sub-agents."
        actions={
          <>
            <Btn><Upload className="h-3.5 w-3.5" /> Import JSON</Btn>
            <Btn><Download className="h-3.5 w-3.5" /> Export JSON</Btn>
            <Btn variant="primary"><Plus className="h-3.5 w-3.5" /> Create Agent</Btn>
            <Btn variant="primary"><Plus className="h-3.5 w-3.5" /> Create Sub-Agent</Btn>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Panel title="Configured agents" className="lg:col-span-2">
          <div className="space-y-2">
            {agents.map((a) => (
              <div key={a.id} className="flex flex-wrap items-center gap-3 rounded-md border border-border/60 bg-background/40 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-lg">{a.icon}</div>
                <div className="min-w-[180px] flex-1">
                  <div className="text-[13px] font-medium">{a.name}</div>
                  <div className="text-[11px] text-muted-foreground">{a.role} · {a.subAgents.length} sub-agents</div>
                </div>
                <div className="font-mono text-[10px] text-muted-foreground">model: llama-3.1-70b</div>
                <StatusBadge status={a.status} />
                <div className="flex gap-1">
                  <Btn size="sm">Edit</Btn>
                  <Btn size="sm" variant="ghost">Logs</Btn>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="New agent config">
          <div className="space-y-3">
            <Field label="Agent name"><Input placeholder="Etsy Automation Agent" defaultValue="Etsy Automation Agent" /></Field>
            <Field label="Role"><Input placeholder="Automates Etsy listings and SEO" /></Field>
            <Field label="Instructions">
              <Textarea rows={4} defaultValue={"You are an Etsy automation specialist. Optimize listings, tags, and SEO. Always run trademark check before publish."} />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Model">
                <Select defaultValue="llama">
                  <option value="llama">llama-3.1-70b (local)</option>
                  <option value="deepseek">deepseek-coder-v2:16b</option>
                  <option value="openrouter">openrouter/gpt-4o</option>
                </Select>
              </Field>
              <Field label="Memory">
                <Select defaultValue="on">
                  <option>On · vector store</option>
                  <option>Off</option>
                </Select>
              </Field>
            </div>
            <Field label="Tools access">
              <Select multiple size={4} defaultValue={["etsy", "trademark", "seo"]}>
                <option value="etsy">Etsy API</option>
                <option value="shopify">Shopify API</option>
                <option value="trademark">Trademark USPTO</option>
                <option value="seo">SEO Toolkit</option>
                <option value="fb">Facebook Ads MCP</option>
                <option value="tg">Telegram Bot</option>
              </Select>
            </Field>
            <Field label="Schedule / trigger" hint="Cron, webhook, or event"><Input placeholder="cron: */15 * * * *" /></Field>
            <label className="flex items-center gap-2 text-[12px]">
              <input type="checkbox" defaultChecked className="accent-primary" />
              Run locally (OpenClaw gateway)
            </label>
            <div className="flex gap-2 pt-1">
              <Btn variant="primary" className="flex-1"><Save className="h-3.5 w-3.5" /> Save config</Btn>
              <Btn><Download className="h-3.5 w-3.5" /></Btn>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
