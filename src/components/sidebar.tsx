import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity, Bot, ShoppingBag, Store, Search, Swords, Shield, Sparkles,
  Image as ImageIcon, ListChecks, Package, BarChart3, MessageSquare,
  Terminal, Settings, Command,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OfficeMini } from "./office-mini";

const items = [
  { to: "/", label: "Mission Control", icon: Activity, group: "Core" },
  { to: "/agents", label: "Agents", icon: Bot, group: "Core" },
  { to: "/etsy", label: "Etsy Tools", icon: ShoppingBag, group: "Marketplaces" },
  { to: "/shopify", label: "Shopify Tools", icon: Store, group: "Marketplaces" },
  { to: "/niche", label: "Niche Research", icon: Search, group: "Research" },
  { to: "/competition", label: "Competition Analysis", icon: Swords, group: "Research" },
  { to: "/trademark", label: "Trademark Check", icon: Shield, group: "Research" },
  { to: "/prompt", label: "Prompt Generator", icon: Sparkles, group: "Design" },
  { to: "/design", label: "Design Generator", icon: ImageIcon, group: "Design" },
  { to: "/listings", label: "Listing Automation", icon: ListChecks, group: "Operations" },
  { to: "/orders", label: "Orders", icon: Package, group: "Operations" },
  { to: "/ads", label: "Facebook Ads MCP", icon: BarChart3, group: "Operations" },
  { to: "/telegram", label: "Telegram Chat", icon: MessageSquare, group: "Operations" },
  { to: "/logs", label: "Logs", icon: Terminal, group: "System" },
  { to: "/settings", label: "Settings", icon: Settings, group: "System" },
] as const;

export function Sidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const groups = Array.from(new Set(items.map((i) => i.group)));

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-card/40">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-primary">
          <Command className="h-4 w-4" />
        </div>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold tracking-tight">MerchIQ</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">OpenClaw · Local</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {groups.map((g) => (
          <div key={g} className="mb-4">
            <div className="px-2 pb-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{g}</div>
            {items.filter((i) => i.group === g).map((i) => {
              const active = pathname === i.to;
              const Icon = i.icon;
              return (
                <Link
                  key={i.to}
                  to={i.to}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition-colors",
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                  )}
                >
                  <Icon className={cn("h-3.5 w-3.5", active ? "text-primary" : "")} />
                  <span className="truncate">{i.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <OfficeMini />


      <div className="border-t border-border px-3 py-2 text-[10px] text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>v0.9.2-local</span>
          <span className="font-mono">localhost:18789</span>
        </div>
      </div>
    </aside>
  );
}
