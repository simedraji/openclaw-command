const bridgeUrl = import.meta.env.VITE_OPENCLAW_BRIDGE_URL ?? "http://127.0.0.1:18790";

export type OpenClawAgent = {
  id: string;
  name?: string;
  identity?: { name?: string; emoji?: string };
  model?: { primary?: string };
  workspace?: string;
};

export type BridgeTask = {
  id: string;
  agentId: string;
  message: string;
  label: string;
  status: "queued" | "running" | "completed" | "failed";
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  result?: unknown;
  error?: string;
};

export type DashboardSnapshot = {
  connected: boolean;
  status: unknown;
  health: unknown;
  agents: OpenClawAgent[];
  tasks: BridgeTask[];
  errors: string[];
  updatedAt: string;
};

export async function fetchDashboard(signal?: AbortSignal): Promise<DashboardSnapshot> {
  return fetchJson<DashboardSnapshot>("/api/dashboard", { signal });
}

export async function createOpenClawTask(input: {
  message: string;
  agentId?: string;
  label?: string;
}): Promise<BridgeTask> {
  const response = await fetchJson<{ task: BridgeTask }>("/api/tasks", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ agentId: "main", label: "Dashboard task", ...input }),
  });
  return response.task;
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${bridgeUrl}${path}`, init);
  } catch {
    throw new Error("Local bridge is offline. Run `npm run bridge` in another terminal.");
  }
  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) throw new Error(data.error ?? "OpenClaw bridge request failed.");
  return data;
}
