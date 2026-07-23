import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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

// Chat lines that rotate through the bottom bar
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

// Approximate desk hotspots in % of the image (x, y) for blinking LEDs
const leds = [
  { x: 22.5, y: 40.5, hue: "var(--color-info)" },      // Niche Research
  { x: 51,   y: 40,   hue: "var(--color-primary)" },   // Design
  { x: 79,   y: 40.5, hue: "var(--color-warning)" },   // TM Check
  { x: 36,   y: 68,   hue: "var(--color-info)" },      // SEO
  { x: 68,   y: 68,   hue: "var(--color-primary)" },   // Store Sync
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

  return (
    <div className="space-y-4">
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
            <span className="dot bg-primary pulse-soft" /> 5 agents on floor
          </span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="panel overflow-hidden">
        <div
          className="relative mx-auto w-full"
          style={{ imageRendering: "pixelated" }}
        >
          <img
            src={officeAsset.url}
            alt="Virtual OpenClaw pixel office with agents at desks"
            className="block h-auto w-full select-none"
            style={{ imageRendering: "pixelated" }}
            draggable={false}
          />

          {/* Blinking monitor LEDs over each desk */}
          {leds.map((l, i) => {
            const on = (tick + i) % 3 !== 0;
            return (
              <span
                key={i}
                className="pointer-events-none absolute"
                style={{
                  left: `${l.x}%`,
                  top: `${l.y}%`,
                  width: 8,
                  height: 8,
                  borderRadius: 9999,
                  background: l.hue,
                  boxShadow: `0 0 10px ${l.hue}`,
                  opacity: on ? 0.95 : 0.25,
                  transform: "translate(-50%, -50%)",
                  transition: "opacity 200ms linear",
                }}
              />
            );
          })}

          {/* Typing shimmer bars above each desk */}
          {leds.map((l, i) => (
            <span
              key={`bar-${i}`}
              className="pointer-events-none absolute bar-shimmer"
              style={{
                left: `${l.x}%`,
                top: `${l.y - 6}%`,
                width: 46,
                height: 3,
                borderRadius: 2,
                transform: "translate(-50%, -50%)",
                opacity: 0.75,
              }}
            />
          ))}

          {/* Live status overlay chip */}
          <div className="absolute left-3 top-3 flex items-center gap-2 rounded-md border border-border bg-background/70 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur">
            <span className="dot bg-primary pulse-soft" />
            Live · localhost
          </div>
        </div>

        {/* Chatter ticker — mirrors the bottom bar in the reference */}
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
