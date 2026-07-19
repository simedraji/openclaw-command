export type AgentStatus = "Idle" | "Thinking" | "Running" | "Waiting" | "Failed" | "Completed";

export interface SubAgent {
  name: string;
  status: AgentStatus;
  task: string;
  progress: number;
}

export interface Agent {
  id: string;
  name: string;
  icon: string;
  role: string;
  status: AgentStatus;
  currentTask: string;
  progress: number;
  logs: string[];
  subAgents: SubAgent[];
}

export const agents: Agent[] = [
  {
    id: "etsy",
    name: "Etsy Automation Agent",
    icon: "🛍",
    role: "Etsy listing & SEO automation",
    status: "Running",
    currentTask: "Publishing 12 new listings to Etsy shop",
    progress: 62,
    logs: [
      "[12:04:11] Fetching draft listings from local vault",
      "[12:04:13] SEO tag optimizer: 24 tags scored",
      "[12:04:15] Publishing listing 7/12: 'Retro Cat Dad Tee'",
    ],
    subAgents: [
      { name: "Etsy SEO Writer", status: "Running", task: "Rewriting titles (7/12)", progress: 58 },
      { name: "Etsy Listing Publisher", status: "Running", task: "Uploading listing 7", progress: 62 },
      { name: "Etsy Trend Scanner", status: "Idle", task: "Waiting on schedule", progress: 0 },
      { name: "Etsy Tag Optimizer", status: "Completed", task: "24 tags optimized", progress: 100 },
    ],
  },
  {
    id: "shopify",
    name: "Shopify Automation Agent",
    icon: "🏬",
    role: "Shopify store automation",
    status: "Thinking",
    currentTask: "Building collection: Summer 2026 Tees",
    progress: 34,
    logs: [
      "[12:03:52] Loaded 48 products from local vault",
      "[12:03:58] Grouping by niche cluster (8 clusters)",
      "[12:04:04] Generating collection description",
    ],
    subAgents: [
      { name: "Product Importer", status: "Completed", task: "48 products imported", progress: 100 },
      { name: "Collection Builder", status: "Thinking", task: "Clustering products", progress: 34 },
      { name: "Order Manager", status: "Idle", task: "Waiting for sync", progress: 0 },
      { name: "Store SEO Assistant", status: "Waiting", task: "Queued after builder", progress: 0 },
    ],
  },
  {
    id: "niche",
    name: "Niche Research Agent",
    icon: "🔎",
    role: "Trend & niche discovery",
    status: "Running",
    currentTask: "Scanning Etsy + Pinterest for 'dad life'",
    progress: 78,
    logs: [
      "[12:02:11] Pulled 340 Etsy listings for 'dad life'",
      "[12:02:44] Pinterest board scan: 12 boards",
      "[12:03:22] Opportunity score computed: 74/100",
    ],
    subAgents: [
      { name: "Trend Finder", status: "Running", task: "Google Trends 12mo", progress: 80 },
      { name: "Keyword Miner", status: "Running", task: "Mining Etsy autocomplete", progress: 72 },
      { name: "Competition Scanner", status: "Waiting", task: "Queued", progress: 0 },
      { name: "Product Idea Generator", status: "Idle", task: "Waiting on data", progress: 0 },
    ],
  },
  {
    id: "trademark",
    name: "Trademark Safety Agent",
    icon: "🛡",
    role: "Risk & USPTO checks",
    status: "Completed",
    currentTask: "18 phrases checked · 2 flagged",
    progress: 100,
    logs: [
      "[12:01:04] Loaded 18 phrases from queue",
      "[12:01:29] USPTO scan complete",
      "[12:01:41] 2 high-risk phrases flagged",
    ],
    subAgents: [
      { name: "Phrase Risk Checker", status: "Completed", task: "18/18 checked", progress: 100 },
      { name: "USPTO Search Agent", status: "Completed", task: "18/18 searched", progress: 100 },
      { name: "Logo Similarity Checker", status: "Idle", task: "No logos queued", progress: 0 },
      { name: "Safe Alternative Generator", status: "Completed", task: "4 alternatives", progress: 100 },
    ],
  },
  {
    id: "design",
    name: "Design Agent",
    icon: "🎨",
    role: "Prompt + image generation",
    status: "Running",
    currentTask: "Generating 8 designs · 'retro sunset surf'",
    progress: 45,
    logs: [
      "[12:04:02] Prompt built: 4500x5400, transparent",
      "[12:04:10] Sent to local SDXL",
      "[12:04:22] 3/8 designs rendered",
    ],
    subAgents: [
      { name: "POD Prompt Generator", status: "Completed", task: "8 prompts built", progress: 100 },
      { name: "Image Generator", status: "Running", task: "3/8 rendered", progress: 45 },
      { name: "Background Remover", status: "Waiting", task: "Queued", progress: 0 },
      { name: "Upscale Agent", status: "Idle", task: "Waiting", progress: 0 },
    ],
  },
  {
    id: "fbads",
    name: "Facebook Ads MCP Agent",
    icon: "📊",
    role: "Ads MCP analysis",
    status: "Waiting",
    currentTask: "Waiting on ROAS refresh (60s)",
    progress: 12,
    logs: [
      "[12:00:04] MCP connected: fb-ads-mcp@localhost:7420",
      "[12:00:11] Warning: Only PageView event firing on Pixel A",
      "[12:03:00] Awaiting next poll",
    ],
    subAgents: [
      { name: "Pixel Checker", status: "Failed", task: "Only PageView firing", progress: 100 },
      { name: "Campaign Analyzer", status: "Waiting", task: "Next poll 42s", progress: 0 },
      { name: "Creative Scorer", status: "Idle", task: "No creatives queued", progress: 0 },
      { name: "ROAS Watcher", status: "Running", task: "Watching 4 campaigns", progress: 60 },
    ],
  },
  {
    id: "telegram",
    name: "Telegram Command Agent",
    icon: "✈",
    role: "Chat + command routing",
    status: "Idle",
    currentTask: "Listening for /commands",
    progress: 0,
    logs: [
      "[11:58:00] Bot online: @merchiq_local_bot",
      "[12:00:22] Daily report sent to admin",
    ],
    subAgents: [
      { name: "Notification Bot", status: "Idle", task: "Listening", progress: 0 },
      { name: "Chat Command Handler", status: "Idle", task: "Listening", progress: 0 },
      { name: "Daily Report Sender", status: "Completed", task: "Sent 09:00", progress: 100 },
    ],
  },
];

export const recentLogs = [
  { t: "12:04:22", lvl: "info", src: "design.image_gen", msg: "Rendered design 3/8 · seed=88213" },
  { t: "12:04:15", lvl: "info", src: "etsy.publisher", msg: "Listing published · id=1938472" },
  { t: "12:04:11", lvl: "info", src: "etsy.vault", msg: "Loaded 12 drafts from local vault" },
  { t: "12:04:04", lvl: "info", src: "shopify.collection", msg: "Cluster 3/8 assembled" },
  { t: "12:03:58", lvl: "warn", src: "fb_ads.pixel", msg: "Pixel A: only PageView event detected" },
  { t: "12:03:22", lvl: "info", src: "niche.opportunity", msg: "Score computed · 74/100 (dad life)" },
  { t: "12:02:44", lvl: "info", src: "niche.pinterest", msg: "Pinterest scan: 12 boards" },
  { t: "12:01:41", lvl: "warn", src: "trademark.uspto", msg: "2 phrases flagged high risk" },
  { t: "12:01:04", lvl: "info", src: "trademark.queue", msg: "Loaded 18 phrases" },
  { t: "12:00:22", lvl: "info", src: "telegram.report", msg: "Daily report sent to admin" },
  { t: "12:00:11", lvl: "err", src: "fb_ads.pixel", msg: "Pixel B unreachable · retrying" },
  { t: "11:58:00", lvl: "info", src: "telegram.bot", msg: "Bot online: @merchiq_local_bot" },
];

export const orders = [
  { id: "#EO-19384", platform: "Etsy", customer: "Ava Chen", product: "Retro Cat Dad Tee (L)", status: "Awaiting fulfillment", tracking: "—", action: "Send to Printify" },
  { id: "#SH-88210", platform: "Shopify", customer: "Marco Ruiz", product: "Summer Surf Hoodie (M)", status: "Shipped", tracking: "9400 1112 2334", action: "None" },
  { id: "#EO-19385", platform: "Etsy", customer: "Priya S.", product: "Dad Mode Loading Mug", status: "Processing", tracking: "—", action: "Confirm design" },
  { id: "#SH-88211", platform: "Shopify", customer: "Leo Park", product: "Nurse Life Hoodie (XL)", status: "Awaiting fulfillment", tracking: "—", action: "Send to Printify" },
  { id: "#EO-19386", platform: "Etsy", customer: "Jamie W.", product: "Coffee First Mom Tee (S)", status: "Delivered", tracking: "9400 1112 2001", action: "Request review" },
  { id: "#SH-88212", platform: "Shopify", customer: "Nora K.", product: "Golf Grandpa Tee (L)", status: "Shipped", tracking: "9400 1112 2402", action: "None" },
];

export const campaigns = [
  { name: "Dad Life – Broad", status: "Active", roas: 3.4, cpc: 0.42, cpm: 8.10, ctr: 2.1, score: 82 },
  { name: "Nurse Life – LAL 1%", status: "Active", roas: 2.1, cpc: 0.61, cpm: 11.2, ctr: 1.4, score: 64 },
  { name: "Retro Surf – Retarget", status: "Paused", roas: 4.8, cpc: 0.33, cpm: 6.90, ctr: 3.2, score: 91 },
  { name: "Golf Grandpa – Cold", status: "Active", roas: 1.2, cpc: 0.88, cpm: 13.4, ctr: 0.9, score: 42 },
];

export const keywords = [
  { kw: "dad life shirt", vol: 12400, comp: 0.62, opp: 74 },
  { kw: "funny dad tee", vol: 9800, comp: 0.71, opp: 61 },
  { kw: "girl dad shirt", vol: 8200, comp: 0.48, opp: 82 },
  { kw: "dog dad tee", vol: 15800, comp: 0.78, opp: 55 },
  { kw: "cat dad shirt", vol: 6400, comp: 0.41, opp: 79 },
  { kw: "retro dad tee", vol: 3100, comp: 0.29, opp: 88 },
];
