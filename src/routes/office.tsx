import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

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

const officeImageUrl = "/virtual-office.png";
const agentCount = 5;

type Desk = {
  id: string;
  label: string;
  x: number;
  y: number;
  hue: string;
  bubble: string;
};

const desks: Desk[] = [
  {
    id: "niche",
    label: "Niche",
    x: 22,
    y: 45,
    hue: "var(--color-info)",
    bubble: "Top niches ready",
  },
  {
    id: "design",
    label: "Design",
    x: 51,
    y: 45,
    hue: "var(--color-primary)",
    bubble: "8 designs queued",
  },
  {
    id: "tm",
    label: "TM",
    x: 80,
    y: 45,
    hue: "var(--color-warning)",
    bubble: "Checking marks",
  },
  {
    id: "seo",
    label: "SEO",
    x: 36,
    y: 67,
    hue: "var(--color-info)",
    bubble: "Titles rewritten",
  },
  {
    id: "store",
    label: "Store",
    x: 69,
    y: 67,
    hue: "var(--color-primary)",
    bubble: "Listings synced",
  },
];

const deskById = Object.fromEntries(desks.map((desk) => [desk.id, desk]));

const messageRoutes = [
  { from: "niche", to: "design", label: "keywords", delay: 0 },
  { from: "design", to: "tm", label: "artwork", delay: 900 },
  { from: "tm", to: "seo", label: "clearance", delay: 1800 },
  { from: "seo", to: "store", label: "listing", delay: 2700 },
  { from: "store", to: "niche", label: "sales data", delay: 3600 },
];

const courierLoop = ["niche", "design", "tm", "store", "seo"];

function OfficePage() {
  const [line, setLine] = useState(0);
  const [clock, setClock] = useState("");
  const [speaker, message] = useMemo(() => {
    const current = chatter[line];
    const splitAt = current.indexOf(":");
    if (splitAt === -1) return ["OpenClaw", current];
    return [current.slice(0, splitAt), current.slice(splitAt + 1).trim()];
  }, [line]);

  const officeMotionCss = useMemo(() => {
    const routeCss = messageRoutes
      .map((route, index) => {
        const from = deskById[route.from];
        const to = deskById[route.to];
        return `
          @keyframes message-${index} {
            0% {
              left: ${from.x}%;
              top: ${from.y}%;
              opacity: 0;
              transform: translate(-50%, -50%) scale(.65);
            }
            10% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
            72% {
              opacity: 1;
            }
            100% {
              left: ${to.x}%;
              top: ${to.y}%;
              opacity: 0;
              transform: translate(-50%, -50%) scale(.65);
            }
          }
          .message-${index} {
            animation: message-${index} 3.8s cubic-bezier(.45, 0, .25, 1) infinite;
            animation-delay: ${route.delay}ms;
          }
        `;
      })
      .join("\n");

    const segmentPct = 100 / courierLoop.length;
    const courierStops = courierLoop
      .map((deskId, index) => {
        const desk = deskById[deskId];
        const arrive = index * segmentPct;
        const wait = arrive + segmentPct * 0.35;
        return `
          ${arrive.toFixed(2)}%, ${wait.toFixed(2)}% {
            left: ${desk.x}%;
            top: ${desk.y + 7}%;
          }
        `;
      })
      .join("\n");
    const first = deskById[courierLoop[0]];

    return `
      ${routeCss}

      @keyframes courier-walk {
        ${courierStops}
        100% {
          left: ${first.x}%;
          top: ${first.y + 7}%;
        }
      }

      @keyframes courier-bob {
        0%, 100% { transform: translate(-50%, -50%) translateY(0); }
        50% { transform: translate(-50%, -50%) translateY(-4px); }
      }

      @keyframes bubble-pop {
        0%, 58%, 100% {
          opacity: 0;
          transform: translate(-50%, 4px) scale(.96);
        }
        10%, 44% {
          opacity: 1;
          transform: translate(-50%, 0) scale(1);
        }
      }

      @keyframes desk-glow {
        0%, 100% { opacity: .45; transform: translate(-50%, -50%) scale(.86); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
      }

      @keyframes dialogue-react {
        0% {
          opacity: 0;
          transform: translateY(8px) scale(.99);
        }
        14%, 84% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        100% {
          opacity: 0;
          transform: translateY(-4px) scale(.995);
        }
      }

      @keyframes robot-eye {
        0%, 86%, 100% { transform: scaleY(1); opacity: 1; }
        90%, 94% { transform: scaleY(.18); opacity: .85; }
      }

      @keyframes type-cursor {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }

      .courier-walk {
        animation: courier-walk 15s linear infinite;
      }

      .courier-bob {
        animation: courier-bob .7s ease-in-out infinite;
      }

      .dialogue-react {
        animation: dialogue-react 3.2s ease-in-out both;
      }

      .robot-eye {
        animation: robot-eye 2.2s ease-in-out infinite;
        transform-origin: center;
      }

      .type-cursor {
        animation: type-cursor .9s steps(1) infinite;
      }
    `;
  }, []);

  useEffect(() => {
    const updateClock = () => setClock(new Date().toLocaleTimeString());
    updateClock();
    const a = setInterval(updateClock, 1000);
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
            <span className="dot bg-primary pulse-soft" /> {agentCount} agents on floor
          </span>
          <span>{clock}</span>
        </div>
      </div>

      <div className="panel overflow-hidden">
        <div className="relative mx-auto w-full" style={{ imageRendering: "pixelated" }}>
          <style>{officeMotionCss}</style>
          <img
            src={officeImageUrl}
            alt="Virtual OpenClaw pixel office with agents at desks"
            className="block h-auto w-full select-none bg-background"
            style={{ imageRendering: "pixelated" }}
            draggable={false}
          />

          {desks.map((desk, index) => (
            <div key={desk.id} className="pointer-events-none">
              <span
                className="absolute"
                style={{
                  left: `${desk.x}%`,
                  top: `${desk.y}%`,
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: desk.hue,
                  boxShadow: `0 0 12px ${desk.hue}`,
                  animation: "desk-glow 1.6s ease-in-out infinite",
                  animationDelay: `${index * 260}ms`,
                }}
              />
              <span
                className="absolute rounded border px-1.5 py-0.5 font-mono text-[9px] leading-none"
                style={{
                  left: `${desk.x}%`,
                  top: `${desk.y - 12}%`,
                  color: desk.hue,
                  background: "rgba(9, 12, 17, .82)",
                  borderColor: desk.hue,
                  boxShadow: `0 0 10px color-mix(in oklab, ${desk.hue} 35%, transparent)`,
                  animation: "bubble-pop 5.8s ease-in-out infinite",
                  animationDelay: `${index * 820}ms`,
                  whiteSpace: "nowrap",
                }}
              >
                {desk.bubble}
              </span>
            </div>
          ))}

          {messageRoutes.map((route, index) => {
            const from = deskById[route.from];
            return (
              <div
                key={`${route.from}-${route.to}`}
                className={`pointer-events-none absolute message-${index} flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[9px] leading-none`}
                style={{
                  color: from.hue,
                  background: "rgba(9, 12, 17, .84)",
                  borderColor: from.hue,
                  boxShadow: `0 0 12px color-mix(in oklab, ${from.hue} 45%, transparent)`,
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  className="dot"
                  style={{ background: from.hue, boxShadow: `0 0 8px ${from.hue}` }}
                />
                {route.label}
              </div>
            );
          })}

          <div
            className="pointer-events-none absolute courier-walk"
            style={{ left: `${desks[0].x}%`, top: `${desks[0].y + 7}%` }}
          >
            <div className="courier-bob grid place-items-center">
              <div className="rounded border border-primary bg-background/85 px-1.5 py-0.5 font-mono text-[9px] text-primary shadow-[0_0_14px_rgba(52,211,153,.35)]">
                runner
              </div>
              <div className="mt-0.5 text-lg leading-none drop-shadow-[0_0_8px_var(--color-primary)]">
                🤖
              </div>
            </div>
          </div>

          <div
            className="pointer-events-none absolute left-[10%] right-[10%] bottom-[4%] flex min-h-[17%] items-center gap-[3%] border-[3px] border-[#b8bdd0] bg-[#151b2c]/95 px-[2.2%] py-[1.3%] shadow-[0_0_0_2px_rgba(0,0,0,.65),inset_0_0_0_2px_rgba(255,255,255,.12)]"
            style={{ imageRendering: "pixelated" }}
          >
            <div className="grid aspect-square w-[9%] min-w-14 place-items-center border-r-2 border-[#8d94ab] pr-[2%]">
              <div className="relative grid aspect-square w-full max-w-20 place-items-center rounded-md border-2 border-[#8d94ab] bg-[#202840] shadow-[inset_0_0_0_2px_rgba(255,255,255,.1)]">
                <div className="absolute -top-[16%] h-[16%] w-[8%] bg-[#c8cfdf]" />
                <div className="absolute -top-[23%] h-[8%] w-[8%] rounded-full bg-[#c8cfdf]" />
                <div className="flex gap-[18%]">
                  <span className="robot-eye block h-2 w-2 rounded-sm bg-primary shadow-[0_0_8px_var(--color-primary)]" />
                  <span className="robot-eye block h-2 w-2 rounded-sm bg-primary shadow-[0_0_8px_var(--color-primary)]" />
                </div>
                <div className="absolute bottom-[18%] h-[7%] w-[34%] rounded-full bg-primary/70" />
              </div>
            </div>

            <div key={line} className="dialogue-react min-w-0 flex-1 font-mono">
              <div className="mb-1 text-[clamp(9px,1.1vw,13px)] uppercase tracking-widest text-primary">
                {speaker}
              </div>
              <div className="truncate text-[clamp(16px,2.35vw,34px)] font-semibold leading-tight text-foreground [text-shadow:2px_2px_0_rgba(0,0,0,.75)]">
                {message}
                <span className="type-cursor ml-1 inline-block text-primary">▾</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chatter ticker */}
        <div className="flex items-center gap-3 border-t border-border bg-background/60 px-4 py-3">
          <div className="grid h-8 w-8 place-items-center rounded-md border border-border bg-card font-mono text-sm">
            🤖
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <div
              key={line}
              className="animate-fade-in truncate font-mono text-[12px] text-foreground"
            >
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
