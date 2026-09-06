import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { delimiter, dirname, isAbsolute, resolve } from "node:path";

const projectRoot = process.cwd();
const fileEnv = readDotEnv(resolve(projectRoot, ".env"));
const config = {
  host: process.env.OPENCLAW_DASHBOARD_HOST ?? fileEnv.OPENCLAW_DASHBOARD_HOST ?? "127.0.0.1",
  port: asPort(process.env.OPENCLAW_DASHBOARD_PORT ?? fileEnv.OPENCLAW_DASHBOARD_PORT ?? "18790"),
  command:
    process.env.OPENCLAW_COMMAND ??
    fileEnv.OPENCLAW_COMMAND ??
    (process.platform === "win32" ? "openclaw.cmd" : "openclaw"),
};

/** @type {Map<string, Task>} */
const tasks = new Map();
const MAX_TASKS = 100;
const MAX_BODY_BYTES = 16 * 1024;
const MAX_COMMAND_OUTPUT = 2 * 1024 * 1024;

const server = createServer(async (request, response) => {
  setSecurityHeaders(response);

  if (!isAllowedOrigin(request.headers.origin)) {
    json(response, 403, { error: "This local bridge only accepts localhost browser requests." });
    return;
  }
  setCorsHeaders(request, response);

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  try {
    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "127.0.0.1"}`);

    if (request.method === "GET" && url.pathname === "/health") {
      json(response, 200, { ok: true, service: "merchiq-openclaw-bridge" });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/dashboard") {
      const dashboard = await getDashboard();
      json(response, 200, dashboard);
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/tasks") {
      json(response, 200, { tasks: listTasks() });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/tasks") {
      const input = await readJson(request);
      const task = createTask(validateTaskInput(input));
      runTask(task);
      json(response, 202, { task });
      return;
    }

    json(response, 404, { error: "Unknown bridge endpoint." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected bridge error.";
    json(response, 500, { error: message });
  }
});

server.listen(config.port, config.host, () => {
  console.log(`MerchIQ OpenClaw bridge running at http://${config.host}:${config.port}`);
  console.log(`Using OpenClaw command: ${config.command}`);
});

/** @typedef {{ id: string, agentId: string, message: string, label: string, status: "queued" | "running" | "completed" | "failed", createdAt: string, startedAt?: string, completedAt?: string, result?: unknown, error?: string }} Task */

async function getDashboard() {
  const [statusResult, healthResult, agentsResult] = await Promise.allSettled([
    runOpenClaw(["status", "--json"], 15_000),
    runOpenClaw(["health", "--json"], 15_000),
    runOpenClaw(["agents", "list", "--json"], 15_000),
  ]);

  const errors = [statusResult, healthResult, agentsResult]
    .filter((result) => result.status === "rejected")
    .map((result) => safeError(result.reason));

  return {
    // Gateway health determines connectivity; optional status diagnostics can
    // fail independently (for example with explicit multi-agent ownership).
    connected: healthResult.status === "fulfilled" && healthResult.value?.ok === true,
    status: valueOrNull(statusResult),
    health: valueOrNull(healthResult),
    agents: extractAgents(valueOrNull(agentsResult)),
    tasks: listTasks(),
    errors,
    updatedAt: new Date().toISOString(),
  };
}

function createTask(input) {
  const task = {
    id: randomUUID(),
    agentId: input.agentId,
    message: input.message,
    label: input.label,
    status: "queued",
    createdAt: new Date().toISOString(),
  };
  tasks.set(task.id, task);
  pruneTasks();
  return task;
}

async function runTask(task) {
  task.status = "running";
  task.startedAt = new Date().toISOString();

  const args = [
    "agent",
    "--agent",
    task.agentId,
    "--session-key",
    `merchiq-dashboard-${task.agentId}`,
    "--message",
    task.message,
    "--timeout",
    "600",
    "--json",
  ];

  try {
    task.result = await runOpenClaw(args, 610_000);
    task.status = "completed";
  } catch (error) {
    task.error = safeError(error);
    task.status = "failed";
  } finally {
    task.completedAt = new Date().toISOString();
  }
}

function openClawInvocation(args) {
  // npm's Windows .cmd launcher cannot be spawned without a shell. Run its
  // JavaScript entry directly so task messages remain literal arguments.
  if (
    process.platform === "win32" &&
    /(?:\.(?:cmd|bat)|(?:^|[\\/])openclaw)$/i.test(config.command)
  ) {
    const command = /\.(cmd|bat)$/i.test(config.command) ? config.command : `${config.command}.cmd`;
    const candidates = isAbsolute(command)
      ? [command]
      : [projectRoot, ...(process.env.PATH ?? "").split(delimiter)]
          .filter(Boolean)
          .map((directory) => resolve(directory.replace(/^"|"$/g, ""), command));
    const launcher = candidates.find((candidate) => existsSync(candidate));
    if (launcher) {
      const entry = resolve(dirname(launcher), "node_modules", "openclaw", "openclaw.mjs");
      if (existsSync(entry)) return { command: process.execPath, args: [entry, ...args] };
      throw new Error(
        "Cannot find OpenClaw's JavaScript entry beside its Windows launcher. Set OPENCLAW_COMMAND to the full path of openclaw.mjs.",
      );
    }
  }
  if (/\.m?js$/i.test(config.command)) {
    return { command: process.execPath, args: [config.command, ...args] };
  }
  return { command: config.command, args };
}

function runOpenClaw(args, timeoutMs) {
  return new Promise((resolvePromise, rejectPromise) => {
    const invocation = openClawInvocation(args);
    const child = spawn(invocation.command, invocation.args, {
      cwd: projectRoot,
      env: { ...process.env },
      shell: false,
      windowsHide: true,
    });
    let stdout = "";
    let stderr = "";
    let finished = false;

    const finish = (fn, value) => {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      fn(value);
    };

    const timeout = setTimeout(() => {
      child.kill();
      finish(rejectPromise, new Error("OpenClaw command timed out."));
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout = appendBounded(stdout, chunk.toString());
    });
    child.stderr.on("data", (chunk) => {
      stderr = appendBounded(stderr, chunk.toString());
    });
    child.on("error", (error) => {
      const hint =
        error.code === "ENOENT"
          ? "OpenClaw command was not found. Install OpenClaw or set OPENCLAW_COMMAND in .env."
          : error.message;
      finish(rejectPromise, new Error(hint));
    });
    child.on("close", (code) => {
      if (code !== 0) {
        finish(
          rejectPromise,
          new Error(cleanCliError(stderr || stdout || `OpenClaw exited with code ${code}.`)),
        );
        return;
      }
      try {
        finish(resolvePromise, parseCliJson(stdout));
      } catch (error) {
        finish(rejectPromise, error);
      }
    });
  });
}

function parseCliJson(value) {
  const text = value.trim();
  if (!text) throw new Error("OpenClaw returned no JSON output.");
  try {
    return JSON.parse(text);
  } catch {
    const firstObject = text.indexOf("{");
    const firstArray = text.indexOf("[");
    const start = [firstObject, firstArray].filter((index) => index >= 0).sort((a, b) => a - b)[0];
    if (start === undefined) throw new Error("OpenClaw returned invalid JSON output.");
    return JSON.parse(text.slice(start));
  }
}

function extractAgents(result) {
  if (Array.isArray(result)) return result;
  if (!result || typeof result !== "object") return [];
  const record = /** @type {Record<string, unknown>} */ (result);
  if (Array.isArray(record.agents)) return record.agents;
  if (record.result && typeof record.result === "object" && Array.isArray(record.result.agents))
    return record.result.agents;
  return [];
}

function validateTaskInput(input) {
  if (!input || typeof input !== "object") throw new Error("Task body must be a JSON object.");
  const record = /** @type {Record<string, unknown>} */ (input);
  const message = typeof record.message === "string" ? record.message.trim() : "";
  const agentId = typeof record.agentId === "string" ? record.agentId.trim() : "main";
  const label = typeof record.label === "string" ? record.label.trim() : "Dashboard task";

  if (!message || message.length > 12_000)
    throw new Error("Task message must contain 1 to 12,000 characters.");
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(agentId))
    throw new Error("Agent ID contains unsupported characters.");
  if (label.length > 160) throw new Error("Task label is too long.");
  return { message, agentId, label };
}

function listTasks() {
  return [...tasks.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function pruneTasks() {
  const oldIds = listTasks()
    .slice(MAX_TASKS)
    .map((task) => task.id);
  for (const id of oldIds) tasks.delete(id);
}

function readJson(request) {
  return new Promise((resolvePromise, rejectPromise) => {
    let body = "";
    let bodyBytes = 0;
    let rejected = false;
    request.on("data", (chunk) => {
      bodyBytes += chunk.length;
      if (bodyBytes > MAX_BODY_BYTES) {
        rejected = true;
        request.destroy();
        rejectPromise(new Error("Request body is too large."));
        return;
      }
      body += chunk.toString();
    });
    request.on("end", () => {
      if (rejected) return;
      try {
        resolvePromise(JSON.parse(body || "{}"));
      } catch {
        rejectPromise(new Error("Request body must be valid JSON."));
      }
    });
    request.on("error", (error) => {
      if (!rejected) rejectPromise(error);
    });
  });
}

function appendBounded(current, extra, limit = MAX_COMMAND_OUTPUT) {
  const next = current + extra;
  return next.length > limit ? next.slice(next.length - limit) : next;
}

function cleanCliError(message) {
  const cleaned = message.replace(/#< CLIXML\s*<Objs\b[^>]*>[\s\S]*?<\/Objs>/g, (xml) =>
    [...xml.matchAll(/<S\b[^>]*\bS="Error"[^>]*>([\s\S]*?)<\/S>/g)]
      .map((match) => match[1].replace(/_x000D_|_x000A_/g, " "))
      .join("\n"),
  );
  if (cleaned.includes("Multiple agents are configured") && cleaned.includes("no explicit owner")) {
    return "OpenClaw's general status report is unavailable: multiple agents are configured, but the report has no explicit owner. Gateway connectivity and the agent list are checked separately.";
  }
  return cleaned
    .replace(/(token|password|api[_ -]?key)\s*[:=]\s*\S+/gi, "$1: [redacted]")
    .trim()
    .slice(0, 1500);
}

function safeError(error) {
  return cleanCliError(error instanceof Error ? error.message : "OpenClaw request failed.");
}

function valueOrNull(result) {
  return result.status === "fulfilled" ? result.value : null;
}

function asPort(value) {
  const port = Number.parseInt(value, 10);
  return Number.isInteger(port) && port >= 1024 && port <= 65535 ? port : 18790;
}

function readDotEnv(path) {
  if (!existsSync(path)) return {};
  const values = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || line.trimStart().startsWith("#")) continue;
    const [, key, rawValue] = match;
    values[key] = rawValue.replace(/^(["'])(.*)\1$/, "$2");
  }
  return values;
}

function isAllowedOrigin(origin) {
  if (!origin) return true;
  try {
    const url = new URL(origin);
    return (
      url.protocol === "http:" && (url.hostname === "localhost" || url.hostname === "127.0.0.1")
    );
  } catch {
    return false;
  }
}

function setCorsHeaders(request, response) {
  const origin = request.headers.origin;
  if (origin && isAllowedOrigin(origin)) response.setHeader("access-control-allow-origin", origin);
  response.setHeader("access-control-allow-methods", "GET, POST, OPTIONS");
  response.setHeader("access-control-allow-headers", "content-type");
  response.setHeader("vary", "Origin");
}

function setSecurityHeaders(response) {
  response.setHeader("x-content-type-options", "nosniff");
  response.setHeader("cache-control", "no-store");
}

function json(response, statusCode, payload) {
  response.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}
