import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Btn, Field, Input, Select } from "@/components/ui-kit";
import { Save, Zap } from "lucide-react";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Settings"
        subtitle="Local configuration only. Nothing leaves this machine unless a token is set."
        actions={
          <>
            <Btn><Zap className="h-3.5 w-3.5" /> Test connections</Btn>
            <Btn variant="primary"><Save className="h-3.5 w-3.5" /> Save config locally</Btn>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel title="OpenClaw gateway">
          <div className="space-y-3">
            <Field label="Gateway URL"><Input defaultValue="http://localhost:18789" /></Field>
            <Field label="Auth token"><Input type="password" defaultValue="oc_local_9f83…" /></Field>
          </div>
        </Panel>

        <Panel title="Local models">
          <div className="space-y-3">
            <Field label="Local model (OpenClaw)">
              <Select defaultValue="llama">
                <option value="llama">llama-3.1-70b (Q4_K_M)</option>
                <option value="mistral">mistral-large-instruct</option>
                <option value="qwen">qwen2.5-72b-instruct</option>
              </Select>
            </Field>
            <Field label="Ollama model">
              <Select defaultValue="deepseek">
                <option value="deepseek">deepseek-coder-v2:16b</option>
                <option value="llama3">llama3.1:8b</option>
                <option value="qwen">qwen2.5:14b</option>
              </Select>
            </Field>
          </div>
        </Panel>

        <Panel title="API keys">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field label="OpenRouter"><Input type="password" defaultValue="or_sk_…" /></Field>
            <Field label="Etsy API key"><Input type="password" defaultValue="etsy_…" /></Field>
            <Field label="Etsy secret"><Input type="password" defaultValue="etsy_secret_…" /></Field>
            <Field label="Shopify admin"><Input type="password" defaultValue="shpat_…" /></Field>
            <Field label="Shopify store"><Input defaultValue="merchiq-lab.myshopify.com" /></Field>
            <Field label="Facebook Ads token"><Input type="password" defaultValue="EAAB…" /></Field>
          </div>
        </Panel>

        <Panel title="Telegram">
          <div className="space-y-3">
            <Field label="Bot token"><Input type="password" defaultValue="7893:AAF…" /></Field>
            <Field label="Admin chat ID"><Input defaultValue="1029384756" /></Field>
            <div className="rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-[11px] text-primary">
              Bot online · last ping 12ms · @merchiq_local_bot
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
