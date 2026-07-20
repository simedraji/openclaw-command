import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/office")({
  head: () => ({
    meta: [
      { title: "Virtual Office · MerchIQ OpenClaw" },
      { name: "description", content: "Pixel-art view of local AI agents at work." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: OfficePage,
});

// ------- Pixel office layout -------
// Grid is 24 cols x 14 rows of 24px tiles.
const COLS = 24;
const ROWS = 14;
const TILE = 24;

type Desk = { id: string; name: string; icon: string; col: number; row: number; color: string };

const desks: Desk[] = [
  { id: "niche",     name: "Research",  icon: "🔎", col: 3,  row: 3,  color: "var(--color-info)" },
  { id: "design",    name: "Design",    icon: "🎨", col: 11, row: 3,  color: "var(--color-primary)" },
  { id: "trademark", name: "Legal",     icon: "🛡", col: 19, row: 3,  color: "var(--color-warning)" },
  { id: "etsy",      name: "Etsy",      icon: "🛍", col: 3,  row: 10, color: "var(--color-primary)" },
  { id: "telegram",  name: "Comms",     icon: "✈", col: 11, row: 10, color: "var(--color-info)" },
  { id: "shopify",   name: "Shopify",   icon: "🏬", col: 19, row: 10, color: "var(--color-primary)" },
  { id: "fbads",     name: "Ads MCP",   icon: "📊", col: 15, row: 7,  color: "var(--color-warning)" },
  { id: "coffee",    name: "Coffee",    icon: "☕", col: 7,  row: 7,  color: "var(--color-muted-foreground)" },
];

// Each agent walks a loop between desks. Timing in seconds per waypoint.
type Waypoint = { col: number; row: number; wait?: number };
type Agent = { id: string; emoji: string; label: string; hue: string; path: Waypoint[] };

const agents: Agent[] = [
  {
    id: "a1", emoji: "🧑‍💻", label: "etsy-bot", hue: "var(--color-primary)",
    path: [
      { col: 5,  row: 4,  wait: 2 },   // at Research desk
      { col: 5,  row: 7  },
      { col: 5,  row: 10, wait: 3 },   // at Etsy desk
      { col: 11, row: 10, wait: 1 },
      { col: 11, row: 4,  wait: 2 },   // Design desk
      { col: 5,  row: 4 },
    ],
  },
  {
    id: "a2", emoji: "🧑‍🎨", label: "designer", hue: "var(--color-info)",
    path: [
      { col: 13, row: 4,  wait: 3 },   // Design desk
      { col: 15, row: 7,  wait: 2 },   // Ads
      { col: 19, row: 10, wait: 2 },   // Shopify
      { col: 13, row: 10, wait: 1 },
      { col: 13, row: 4 },
    ],
  },
  {
    id: "a3", emoji: "🕵️", label: "trademark", hue: "var(--color-warning)",
    path: [
      { col: 21, row: 4,  wait: 3 },
      { col: 21, row: 10, wait: 1 },
      { col: 15, row: 10, wait: 1 },
      { col: 11, row: 10, wait: 2 },
      { col: 11, row: 4 },
      { col: 21, row: 4 },
    ],
  },
  {
    id: "a4", emoji: "📮", label: "telegram", hue: "var(--color-primary)",
    path: [
      { col: 11, row: 11, wait: 2 },
      { col: 7,  row: 8,  wait: 1 },   // coffee break
      { col: 5,  row: 4,  wait: 1 },
      { col: 15, row: 7,  wait: 1 },
      { col: 11, row: 11 },
    ],
  },
  {
    id: "a5", emoji: "🤖", label: "roas-watch", hue: "var(--color-info)",
    path: [
      { col: 17, row: 7,  wait: 2 },
      { col: 19, row: 4,  wait: 1 },
      { col: 19, row: 11, wait: 2 },
      { col: 17, row: 7 },
    ],
  },
];

// Compute total loop duration & keyframe offsets for each agent path.
function buildKeyframes(path: Waypoint[], stepDuration = 0.9) {
  // Each segment = travel time (stepDuration) + optional wait at destination.
  const times: number[] = [0];
  let t = 0;
  for (let i = 1; i < path.length; i++) {
    t += stepDuration + (path[i].wait ?? 0);
    times.push(t);
  }
  const total = t;
  // Build keyframes with two stops per waypoint: arrival, and departure (after wait).
  const frames: string[] = [];
  let cumul = 0;
  for (let i = 0; i < path.length; i++) {
    const p = path[i];
    const arrivalPct = (cumul / total) * 100;
    frames.push(`${arrivalPct.toFixed(2)}% { transform: translate(${p.col * TILE}px, ${p.row * TILE}px); }`);
    if (p.wait) {
      cumul += p.wait;
      const departPct = (cumul / total) * 100;
      frames.push(`${departPct.toFixed(2)}% { transform: translate(${p.col * TILE}px, ${p.row * TILE}px); }`);
    }
    if (i < path.length - 1) cumul += stepDuration;
  }
  return { css: frames.join("\n"), duration: total };
}

function OfficePage() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 800);
    return () => clearInterval(t);
  }, []);

  const styleSheet = agents
    .map((a) => {
      const { css, duration } = buildKeyframes(a.path);
      return `
        @keyframes walk-${a.id} { ${css} }
        .walk-${a.id} {
          animation: walk-${a.id} ${duration.toFixed(2)}s linear infinite;
        }
      `;
    })
    .join("\n");

  const W = COLS * TILE;
  const H = ROWS * TILE;

  return (
    <div className="space-y-4">
      <style>{styleSheet}</style>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            OpenClaw · Live floor
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Virtual Office</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pixel view of your local AI agents walking between desks.
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="dot bg-primary pulse-soft" /> {agents.length} agents on floor
          </span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="panel overflow-hidden">
        <div
          className="relative mx-auto"
          style={{
            width: W,
            height: H,
            imageRendering: "pixelated",
            background:
              // checkerboard floor
              `repeating-conic-gradient(
                oklch(0.22 0.006 260) 0 25%,
                oklch(0.19 0.006 260) 0 50%
              )`,
            backgroundSize: `${TILE * 2}px ${TILE * 2}px`,
            boxShadow: "inset 0 0 0 2px var(--color-border)",
          }}
        >
          {/* Walls / borders */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              boxShadow:
                "inset 0 4px 0 0 var(--color-border), inset 0 -4px 0 0 var(--color-border), inset 4px 0 0 0 var(--color-border), inset -4px 0 0 0 var(--color-border)",
            }}
          />

          {/* Rugs under desk clusters */}
          <Rug col={2} row={2} w={5} h={3} />
          <Rug col={10} row={2} w={5} h={3} />
          <Rug col={18} row={2} w={5} h={3} />
          <Rug col={2} row={9} w={5} h={3} />
          <Rug col={10} row={9} w={5} h={3} />
          <Rug col={18} row={9} w={5} h={3} />

          {/* Desks */}
          {desks.map((d) => (
            <DeskTile key={d.id} desk={d} tick={tick} />
          ))}

          {/* Agents */}
          {agents.map((a) => (
            <div
              key={a.id}
              className={`walk-${a.id}`}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: TILE,
                height: TILE,
                willChange: "transform",
              }}
            >
              <AgentSprite emoji={a.emoji} label={a.label} hue={a.hue} />
            </div>
          ))}

          {/* Scan line overlay for CRT vibe */}
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent 0, transparent 2px, rgba(0,0,0,0.35) 2px, rgba(0,0,0,0.35) 3px)",
            }}
          />
        </div>

        <div className="border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
          Tip: agents follow their assigned loop between desks. Each pause = a task tick.
        </div>
      </div>
    </div>
  );
}

function Rug({ col, row, w, h }: { col: number; row: number; w: number; h: number }) {
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: col * TILE,
        top: row * TILE,
        width: w * TILE,
        height: h * TILE,
        background:
          "repeating-linear-gradient(45deg, color-mix(in oklab, var(--color-primary) 8%, transparent) 0 6px, transparent 6px 12px)",
        border: "2px solid color-mix(in oklab, var(--color-primary) 20%, transparent)",
        borderRadius: 4,
      }}
    />
  );
}

function DeskTile({ desk, tick }: { desk: Desk; tick: number }) {
  const blink = tick % 4 === 0;
  return (
    <div
      className="pointer-events-none absolute flex flex-col items-center justify-center"
      style={{
        left: desk.col * TILE,
        top: desk.row * TILE,
        width: TILE * 2,
        height: TILE * 2,
      }}
    >
      <div
        style={{
          width: TILE * 2 - 4,
          height: TILE * 2 - 4,
          background: "var(--color-card)",
          border: `2px solid ${desk.color}`,
          borderRadius: 2,
          boxShadow: `inset 0 -6px 0 0 color-mix(in oklab, ${desk.color} 18%, transparent)`,
          fontSize: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {desk.icon}
        {/* monitor "led" */}
        <span
          style={{
            position: "absolute",
            top: 3,
            right: 3,
            width: 4,
            height: 4,
            borderRadius: 2,
            background: desk.color,
            opacity: blink ? 1 : 0.35,
          }}
        />
      </div>
      <div
        className="mt-0.5 font-mono"
        style={{
          fontSize: 8,
          letterSpacing: "0.1em",
          color: "var(--color-muted-foreground)",
          textTransform: "uppercase",
        }}
      >
        {desk.name}
      </div>
    </div>
  );
}

function AgentSprite({ emoji, label, hue }: { emoji: string; label: string; hue: string }) {
  return (
    <div
      style={{
        width: TILE,
        height: TILE,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* shadow */}
      <span
        style={{
          position: "absolute",
          bottom: 1,
          width: 14,
          height: 3,
          borderRadius: 2,
          background: "rgba(0,0,0,0.45)",
          filter: "blur(1px)",
        }}
      />
      <span
        style={{
          fontSize: 16,
          filter: `drop-shadow(0 0 4px ${hue})`,
        }}
      >
        {emoji}
      </span>
      <span
        style={{
          position: "absolute",
          top: -8,
          fontSize: 7,
          fontFamily: "var(--font-mono)",
          color: hue,
          background: "var(--color-background)",
          padding: "0 3px",
          borderRadius: 2,
          border: `1px solid ${hue}`,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
}
