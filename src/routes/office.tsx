import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import officeAsset from "@/assets/virtual-office.png.asset.json";

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

const chatter = [
  "OpenClaw Office: Agents ready for POD workflow",
  "Niche Research: 42 new keywords surfaced from Etsy trends",
  "Design: Generating 8 variations at 4500×5400 · 300 DPI",
  "TM Check: 1 phrase flagged — routing to legal queue",
  "SEO: Rewriting 12 titles for CTR uplift",
  "Store Sync: Pushed 6 listings to Etsy · 4 to Shopify",
  "Design → TM Check: awaiting clearance on 'Cosmic Cat v3'",
  "Niche Research → SEO: handing off top 10 clusters",
];

// Desks in % of the image (x, y)
type Desk = { id: string; name: string; x: number; y: number; hue: string };
const desks: Desk[] = [
  { id: "niche",  name: "Niche Research", x: 22.5, y: 40.5, hue: "var(--color-info)" },
  { id: "design", name: "Design",         x: 51,   y: 40,   hue: "var(--color-primary)" },
  { id: "tm",     name: "TM Check",       x: 79,   y: 40.5, hue: "var(--color-warning)" },
  { id: "seo",    name: "SEO",            x: 36,   y: 68,   hue: "var(--color-info)" },
  { id: "store",  name: "Store Sync",     x: 68,   y: 68,   hue: "var(--color-primary)" },
];

const deskById = Object.fromEntries(desks.map((d) => [d.id, d]));

// Walking loops — each agent visits a sequence of desks (by id), pausing to "work"
type Agent = {
  id: string;
  label: string;
  emoji: string;
  hue: string;
  loop: string[]; // desk ids
  workMs: number; // pause at each desk
  travelMs: number; // travel time between desks
};

// Each agent stays at their own desk and sways gently in place.
const agents: Agent[] = [
  { id: "a1", label: "niche-bot",  emoji: "🧑‍💻", hue: "var(--color-info)",    loop: ["niche"],  workMs: 4200, travelMs: 3600 },
  { id: "a2", label: "designer",   emoji: "🧑‍🎨", hue: "var(--color-primary)", loop: ["design"], workMs: 4600, travelMs: 3800 },
  { id: "a3", label: "tm-guard",   emoji: "🛡",   hue: "var(--color-warning)", loop: ["tm"],     workMs: 4000, travelMs: 3400 },
  { id: "a4", label: "seo-writer", emoji: "✍️",  hue: "var(--color-info)",    loop: ["seo"],    workMs: 4400, travelMs: 3700 },
  { id: "a5", label: "publisher",  emoji: "📦",  hue: "var(--color-primary)", loop: ["store"],  workMs: 4300, travelMs: 3900 },
];

// Data packets travelling between collaborating desks
const packets: Array<{ from: string; to: string; hue: string; delay: number }> = [
  { from: "niche",  to: "design", hue: "var(--color-info)",    delay: 0 },
  { from: "design", to: "tm",     hue: "var(--color-primary)", delay: 900 },
  { from: "tm",     to: "store",  hue: "var(--color-warning)", delay: 1600 },
  { from: "seo",    to: "store",  hue: "var(--color-info)",    delay: 2300 },
  { from: "design", to: "seo",    hue: "var(--color-primary)", delay: 3000 },
];

function OfficePage() {
  const [tick, setTick] = useState(0);
  const [line, setLine] = useState(0);

  useEffect(() => {
    const a = setInterval(() => setTick((v) => v + 1), 700);
    const b = setInterval(() => setLine((v) => (v + 1) % chatter.length), 3200);
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, []);

  // Pre-compute per-agent keyframes as CSS strings
  const styleSheet = useMemo(() => {
    return agents
      .map((ag) => {
        const stops = ag.loop;
        const cycle = stops.length; // segments = cycle (last returns to first via loop closure)
        const totalMs = cycle * (ag.workMs + ag.travelMs);
        // Build keyframes: at each stop → arrive, wait workMs, then travel to next
        const kfLines: string[] = [];
        let cursorMs = 0;
        for (let i = 0; i < cycle; i++) {
          const d = deskById[stops[i]];
          const arrivePct = (cursorMs / totalMs) * 100;
          kfLines.push(
            `${arrivePct.toFixed(2)}% { left: ${d.x}%; top: ${d.y + 4}%; }`,
          );
          cursorMs += ag.workMs;
          const departPct = (cursorMs / totalMs) * 100;
          kfLines.push(
            `${departPct.toFixed(2)}% { left: ${d.x}%; top: ${d.y + 4}%; }`,
          );
          cursorMs += ag.travelMs;
        }
        // final 100% snap back to first
        const first = deskById[stops[0]];
        kfLines.push(`100% { left: ${first.x}%; top: ${first.y + 4}%; }`);

        // bobbing (simulate walking) applied via transform on inner span
        return `
          @keyframes walk-${ag.id} { ${kfLines.join("\n")} }
          .walk-${ag.id} {
            animation: walk-${ag.id} ${(totalMs / 1000).toFixed(2)}s linear infinite;
          }
        `;
      })
      .join("\n");
  }, []);

  // Packet keyframes
  const packetStyles = useMemo(() => {
    return packets
      .map((p, i) => {
        const from = deskById[p.from];
        const to = deskById[p.to];
        return `
          @keyframes pkt-${i} {
            0%   { left: ${from.x}%; top: ${from.y}%; opacity: 0; transform: translate(-50%,-50%) scale(0.6); }
            10%  { opacity: 1; transform: translate(-50%,-50%) scale(1); }
            90%  { opacity: 1; }
            100% { left: ${to.x}%; top: ${to.y}%; opacity: 0; transform: translate(-50%,-50%) scale(0.6); }
          }
          .pkt-${i} { animation: pkt-${i} 2.4s cubic-bezier(.6,.05,.4,1) infinite; animation-delay: ${p.delay}ms; }
        `;
      })
      .join("\n");
  }, []);

  return (
    <div className="space-y-4">
      <style>{styleSheet + packetStyles + `
        @keyframes bob { 0%,100% { transform: translate(-50%,-50%) translateY(0); } 50% { transform: translate(-50%,-50%) translateY(-3px); } }
        .bob { animation: bob 420ms ease-in-out infinite; }
      `}</style>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            OpenClaw · Live floor
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Virtual Office</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your local AI agents, working the POD floor in real time.
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
        <div className="relative mx-auto w-full" style={{ imageRendering: "pixelated" }}>
          <img
            src={officeAsset.url}
            alt="Virtual OpenClaw pixel office with agents at desks"
            className="block h-auto w-full select-none"
            style={{ imageRendering: "pixelated" }}
            draggable={false}
          />

          {/* Blinking monitor LEDs + typing shimmer bars over each desk */}
          {desks.map((d, i) => {
            const on = (tick + i) % 3 !== 0;
            return (
              <div key={d.id} className="pointer-events-none">
                <span
                  className="absolute"
                  style={{
                    left: `${d.x}%`,
                    top: `${d.y}%`,
                    width: 8,
                    height: 8,
                    borderRadius: 9999,
                    background: d.hue,
                    boxShadow: `0 0 10px ${d.hue}`,
                    opacity: on ? 0.95 : 0.25,
                    transform: "translate(-50%, -50%)",
                    transition: "opacity 200ms linear",
                  }}
                />
                <span
                  className="absolute bar-shimmer"
                  style={{
                    left: `${d.x}%`,
                    top: `${d.y - 6}%`,
                    width: 46,
                    height: 3,
                    borderRadius: 2,
                    transform: "translate(-50%, -50%)",
                    opacity: 0.75,
                  }}
                />
              </div>
            );
          })}

          {/* Data packets flying between collaborating desks */}
          {packets.map((p, i) => (
            <span
              key={`pkt-${i}`}
              className={`pointer-events-none absolute pkt-${i}`}
              style={{
                width: 8,
                height: 8,
                borderRadius: 9999,
                background: p.hue,
                boxShadow: `0 0 10px ${p.hue}, 0 0 2px ${p.hue}`,
              }}
            />
          ))}

          {/* Walking agents */}
          {agents.map((ag) => (
            <div
              key={ag.id}
              className={`pointer-events-none absolute walk-${ag.id}`}
              style={{ left: 0, top: 0, willChange: "left,top" }}
            >
              <div
                className="bob absolute flex flex-col items-center"
                style={{ transform: "translate(-50%,-50%)" }}
              >
                <span
                  className="font-mono"
                  style={{
                    fontSize: 9,
                    color: ag.hue,
                    background: "var(--color-background)",
                    border: `1px solid ${ag.hue}`,
                    padding: "0 4px",
                    borderRadius: 2,
                    whiteSpace: "nowrap",
                    marginBottom: 2,
                    boxShadow: `0 0 8px color-mix(in oklab, ${ag.hue} 40%, transparent)`,
                  }}
                >
                  {ag.label}
                </span>
                <span
                  style={{
                    fontSize: 18,
                    filter: `drop-shadow(0 0 6px ${ag.hue})`,
                    lineHeight: 1,
                  }}
                >
                  {ag.emoji}
                </span>
                <span
                  style={{
                    width: 14,
                    height: 3,
                    marginTop: 1,
                    borderRadius: 2,
                    background: "rgba(0,0,0,0.5)",
                    filter: "blur(1px)",
                  }}
                />
              </div>
            </div>
          ))}

          {/* Live status overlay chip */}
          <div className="absolute left-3 top-3 flex items-center gap-2 rounded-md border border-border bg-background/70 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur">
            <span className="dot bg-primary pulse-soft" />
            Live · localhost
          </div>
        </div>

        {/* Chatter ticker */}
        <div className="flex items-center gap-3 border-t border-border bg-background/60 px-4 py-3">
          <div className="grid h-8 w-8 place-items-center rounded-md border border-border bg-card font-mono text-sm">
            🤖
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <div key={line} className="animate-fade-in truncate font-mono text-[12px] text-foreground">
              {chatter[line]}
            </div>
            <div className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
              OpenClaw Office · agent chatter
            </div>
          </div>
          <span className="dot bg-primary pulse-soft" />
        </div>
      </div>
    </div>
  );
}
