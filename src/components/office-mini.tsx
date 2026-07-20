import { useEffect, useState } from "react";
import { agents } from "@/lib/mock-data";

/**
 * Compact animated "office" floor plan for the sidebar.
 * Agents sit at desks; animated packets travel between collaborators
 * along SVG paths (motion-path) with a dashed data-link underneath.
 */

type Node = { id: string; icon: string; x: number; y: number; label: string };

const W = 216;
const H = 190;

const nodes: Node[] = [
  { id: "niche",     icon: "🔎", x: 36,  y: 30,  label: "Research" },
  { id: "design",    icon: "🎨", x: 108, y: 22,  label: "Design"   },
  { id: "trademark", icon: "🛡", x: 180, y: 30,  label: "Legal"    },
  { id: "etsy",      icon: "🛍", x: 36,  y: 100, label: "Etsy"     },
  { id: "telegram",  icon: "✈", x: 108, y: 96,  label: "Comms"    },
  { id: "shopify",   icon: "🏬", x: 180, y: 100, label: "Shopify"  },
  { id: "fbads",     icon: "📊", x: 108, y: 165, label: "Ads"      },
];

// Directed collaboration links (from -> to). Each becomes an animated packet.
const links: Array<{ from: string; to: string; color: string; delay: number }> = [
  { from: "niche",     to: "design",    color: "var(--color-primary)", delay: 0    },
  { from: "design",    to: "etsy",      color: "var(--color-primary)", delay: 0.6  },
  { from: "design",    to: "shopify",   color: "var(--color-info)",    delay: 1.2  },
  { from: "trademark", to: "etsy",      color: "var(--color-warning)", delay: 0.3  },
  { from: "etsy",      to: "telegram",  color: "var(--color-primary)", delay: 1.8  },
  { from: "shopify",   to: "fbads",     color: "var(--color-info)",    delay: 0.9  },
  { from: "fbads",     to: "telegram",  color: "var(--color-warning)", delay: 1.5  },
  { from: "telegram",  to: "niche",     color: "var(--color-primary)", delay: 2.1  },
];

function nodeById(id: string) {
  return nodes.find((n) => n.id === id)!;
}

export function OfficeMini() {
  // Rotating "who's talking" highlight for tiny live feel.
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 1400);
    return () => clearInterval(t);
  }, []);
  const activeLink = links[tick % links.length];

  return (
    <div className="mx-2 mb-3 rounded-md border border-border bg-background/40 p-2">
      <div className="mb-1.5 flex items-center justify-between px-1">
        <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Office
        </div>
        <div className="flex items-center gap-1">
          <span className="dot bg-primary pulse-soft" />
          <span className="font-mono text-[9px] text-muted-foreground">7 live</span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: H }}
        aria-hidden="true"
      >
        {/* faint floor grid */}
        <defs>
          <pattern id="office-grid" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M12 0H0V12" fill="none" stroke="var(--color-border)" strokeWidth="0.4" opacity="0.5" />
          </pattern>
        </defs>
        <rect x="0" y="0" width={W} height={H} fill="url(#office-grid)" />

        {/* static data links */}
        {links.map((l, i) => {
          const a = nodeById(l.from);
          const b = nodeById(l.to);
          const isActive = l === activeLink;
          return (
            <line
              key={`ln-${i}`}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={isActive ? l.color : "var(--color-border)"}
              strokeWidth={isActive ? 1.1 : 0.7}
              strokeDasharray="3 4"
              style={{
                animation: isActive ? "dash 1.2s linear infinite" : undefined,
                opacity: isActive ? 0.9 : 0.5,
                transition: "stroke 300ms, opacity 300ms",
              }}
            />
          );
        })}

        {/* traveling packets along each link (motion-path via CSS `offset-path`) */}
        {links.map((l, i) => {
          const a = nodeById(l.from);
          const b = nodeById(l.to);
          const path = `path('M ${a.x} ${a.y} L ${b.x} ${b.y}')`;
          return (
            <circle
              key={`pk-${i}`}
              r="2"
              fill={l.color}
              style={{
                // motion-path
                offsetPath: path as unknown as string,
                // vendor fallback
                // @ts-expect-error -- webkit prefix isn't typed
                WebkitOffsetPath: path,
                animation: `packet 2.6s ${l.delay}s linear infinite`,
                filter: `drop-shadow(0 0 3px ${l.color})`,
              }}
            />
          );
        })}

        {/* desks (nodes) */}
        {nodes.map((n) => {
          const agent = agents.find((a) => a.id === n.id);
          const status = agent?.status ?? "Idle";
          const busy = status === "Running" || status === "Thinking";
          const color =
            status === "Failed" ? "var(--color-destructive)" :
            status === "Waiting" ? "var(--color-warning)" :
            status === "Completed" ? "var(--color-primary)" :
            busy ? "var(--color-primary)" : "var(--color-muted-foreground)";

          return (
            <g
              key={n.id}
              transform={`translate(${n.x} ${n.y})`}
              style={{ animation: busy ? "float-node 3s ease-in-out infinite" : undefined }}
            >
              {/* activity ring */}
              {busy && (
                <circle
                  r="14"
                  fill="none"
                  stroke={color}
                  strokeWidth="1"
                  style={{
                    transformOrigin: "center",
                    animation: "ring-ping 1.8s ease-out infinite",
                    opacity: 0.6,
                  }}
                />
              )}
              {/* desk */}
              <circle r="11" fill="var(--color-card)" stroke={color} strokeWidth="1.2" />
              {/* status dot */}
              <circle cx="8.5" cy="-8" r="2" fill={color}>
                {busy && <animate attributeName="opacity" values="1;0.3;1" dur="1.4s" repeatCount="indefinite" />}
              </circle>
              {/* emoji avatar */}
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="11"
                style={{ userSelect: "none" }}
              >
                {n.icon}
              </text>
              {/* label */}
              <text
                y="22"
                textAnchor="middle"
                fontSize="7.5"
                fill="var(--color-muted-foreground)"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}
              >
                {n.label.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>

      {/* live chatter ticker */}
      <div className="mt-1 truncate rounded-sm bg-secondary/50 px-1.5 py-1 font-mono text-[9px] text-muted-foreground">
        <span className="text-primary">{nodeById(activeLink.from).label}</span>
        <span className="mx-1">→</span>
        <span className="text-foreground">{nodeById(activeLink.to).label}</span>
        <span className="mx-1 opacity-50">·</span>
        <span>{chatterFor(activeLink.from, activeLink.to)}</span>
      </div>
    </div>
  );
}

function chatterFor(from: string, to: string) {
  const key = `${from}->${to}`;
  const map: Record<string, string> = {
    "niche->design": "handing off 8 briefs",
    "design->etsy": "pushing 4 mockups",
    "design->shopify": "syncing collection art",
    "trademark->etsy": "flagged 2 phrases",
    "etsy->telegram": "listing published",
    "shopify->fbads": "audience updated",
    "fbads->telegram": "ROAS alert",
    "telegram->niche": "user prompt received",
  };
  return map[key] ?? "sending payload";
}
