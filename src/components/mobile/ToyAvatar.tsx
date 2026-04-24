import { memo } from "react";
import { agentColor } from "../../lib/constants";

/**
 * Toy Story-style SVG character avatars.
 * POMPOM = unique purple fluffy manager character.
 * Others = generative plastic-toy characters.
 */

const CSS = `
  @keyframes ta-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  @keyframes ta-aura   { 0%,100%{r:34;opacity:.28} 50%{r:43;opacity:.06} }
  @keyframes ta-blink  { 0%,88%,100%{transform:scaleY(1)} 91%,97%{transform:scaleY(0.08)} }
  @keyframes ta-wave   { 0%,100%{transform:rotate(-18deg)} 50%{transform:rotate(18deg)} }
  @keyframes ta-typeL  { 0%,100%{transform:rotate(-14deg)} 50%{transform:rotate(8deg)} }
  @keyframes ta-typeR  { 0%,100%{transform:rotate(14deg)} 50%{transform:rotate(-8deg)} }
  @keyframes ta-sleep  { 0%,100%{opacity:1} 50%{opacity:.45} }
  @keyframes ta-float  { 0%,100%{opacity:0;transform:translateY(0)} 30%,70%{opacity:.85} 100%{transform:translateY(-16px)} }
  .ta-bounce{ animation:ta-bounce 1.9s ease-in-out infinite; }
  .ta-sleep { animation:ta-sleep  2.2s ease-in-out infinite; }
  .ta-wave  { animation:ta-wave   1.3s ease-in-out infinite; transform-origin:0 2px; }
  .ta-typeL { animation:ta-typeL  0.34s ease-in-out infinite; transform-origin:0 2px; }
  .ta-typeR { animation:ta-typeR  0.34s ease-in-out 0.17s infinite; transform-origin:0 2px; }
  .ta-blink { animation:ta-blink  4.2s ease-in-out infinite; transform-origin:0 -21px; }
  .ta-float { animation:ta-float  1.5s ease-out infinite; }
`;

// ── POMPOM unique character ────────────────────────────────────────────────────
function PompomChar({ status }: { status: "busy" | "ready" | "idle" | "crashed" }) {
  const isBusy    = status === "busy";
  const isIdle    = status === "idle";
  const isCrashed = status === "crashed";
  const body      = "#9333ea";
  const fluff     = "#c084fc";

  const fluffRing = [-60,-30,0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
    const r = (deg * Math.PI) / 180;
    return <circle key={i} cx={Math.cos(r) * 16} cy={-5 + Math.sin(r) * 16} r={5.5} fill={fluff} opacity={0.75} />;
  });

  return (
    <g>
      {/* Busy aura */}
      {isBusy && <circle cx={0} cy={-5} r={34} fill="none" stroke="#c084fc" strokeWidth={2} opacity={0.25} className="ta-bounce" />}

      {/* Ground shadow */}
      <ellipse cx={0} cy={27} rx={18} ry={3.5} fill={body} opacity={0.18} />

      <g className={isBusy ? "ta-bounce" : isIdle ? "ta-sleep" : ""}>
        {/* Fluff ring */}
        {fluffRing}
        {/* Body core */}
        <circle cx={0} cy={-5} r={14} fill={body} />
        {/* Plastic sheen */}
        <ellipse cx={-4} cy={-12} rx={5} ry={3} fill="#fff" opacity={0.25} transform="rotate(-20,-4,-12)" />

        {/* Star badge */}
        <g transform="translate(0,-4) scale(0.55)">
          <polygon points="0,-12 2.8,-4 11,-4 5,1.5 7,9.5 0,5 -7,9.5 -5,1.5 -11,-4 -2.8,-4" fill="#fbbf24" stroke="#f59e0b" strokeWidth={1} />
        </g>

        {/* Head */}
        <circle cx={0} cy={-28} r={13} fill={body} />
        {/* Mini fluff on head */}
        {[-35,0,35].map((deg, i) => {
          const r = (deg * Math.PI) / 180;
          return <circle key={i} cx={Math.cos(r) * 12} cy={-28 + Math.sin(r) * 12} r={4} fill={fluff} opacity={0.7} />;
        })}
        <ellipse cx={-3} cy={-34} rx={4} ry={2.5} fill={fluff} opacity={0.7} />
        <ellipse cx={3} cy={-35} rx={3.5} ry={2} fill={fluff} opacity={0.7} />
        {/* Head sheen */}
        <ellipse cx={-4} cy={-33} rx={4.5} ry={2.8} fill="#fff" opacity={0.2} transform="rotate(-18,-4,-33)" />

        {/* Crown */}
        <polygon points="-7,-39 -5,-45 0,-41 5,-45 7,-39" fill="#fbbf24" stroke="#f59e0b" strokeWidth={0.8} />
        {[[-5,-45],[0,-42],[5,-45]].map(([cx,cy],i) => <circle key={i} cx={cx} cy={cy} r={1.5} fill="#fff" />)}

        {/* Eyes */}
        <g className="ta-blink">
          <circle cx={-5} cy={-29} r={4} fill="#fff" />
          <circle cx={5} cy={-29} r={4} fill="#fff" />
          <circle cx={-4} cy={-29} r={2.2} fill="#3b0764" />
          <circle cx={6} cy={-29} r={2.2} fill="#3b0764" />
          <circle cx={-3} cy={-30.5} r={0.8} fill="#fff" />
          <circle cx={7} cy={-30.5} r={0.8} fill="#fff" />
        </g>
        {/* Blush */}
        <ellipse cx={-9} cy={-25} rx={3} ry={1.5} fill="#f9a8d4" opacity={0.55} />
        <ellipse cx={9} cy={-25} rx={3} ry={1.5} fill="#f9a8d4" opacity={0.55} />
        {/* Mouth */}
        {isCrashed
          ? <path d="M -3 -23 Q 0 -25 3 -23" fill="none" stroke="#3b0764" strokeWidth={1.2} strokeLinecap="round" />
          : isBusy
          ? <ellipse cx={0} cy={-23} rx={2} ry={1.5} fill="#3b0764" />
          : <path d="M -3 -24 Q 0 -21 3 -24" fill="none" stroke="#3b0764" strokeWidth={1.2} strokeLinecap="round" />
        }

        {/* Arms */}
        {isBusy ? (
          <>
            <g className="ta-typeL"><line x1={-15} y1={-2} x2={-23} y2={7} stroke={body} strokeWidth={4} strokeLinecap="round" /></g>
            <g className="ta-typeR"><line x1={15} y1={-2} x2={23} y2={7} stroke={body} strokeWidth={4} strokeLinecap="round" /></g>
          </>
        ) : (
          <>
            <g className="ta-wave"><line x1={-15} y1={-2} x2={-21} y2={8} stroke={body} strokeWidth={4} strokeLinecap="round" /></g>
            <line x1={15} y1={-2} x2={21} y2={8} stroke={body} strokeWidth={4} strokeLinecap="round" />
          </>
        )}

        {/* Legs */}
        <line x1={-4} y1={10} x2={-5} y2={18} stroke={body} strokeWidth={3.5} strokeLinecap="round" />
        <line x1={4} y1={10} x2={5} y2={18} stroke={body} strokeWidth={3.5} strokeLinecap="round" />
        <ellipse cx={-6} cy={19} rx={4} ry={2} fill="#4c1d95" />
        <ellipse cx={6} cy={19} rx={4} ry={2} fill="#4c1d95" />
      </g>

      {/* Floating sparkle when busy */}
      {isBusy && <text x={18} y={-22} fontSize={10} fill="#c084fc" opacity={0.9} className="ta-float">✦</text>}
    </g>
  );
}

// ── Generic Toy Story oracle character ────────────────────────────────────────
type OracleShape = "ranger" | "cowboy" | "dino" | "piggy" | "spring" | "robot";

function getShape(name: string): OracleShape {
  const n = name.toLowerCase().replace(/-oracle$/, "");
  if (n.includes("pulse") || n.includes("buzz") || n.includes("monitor")) return "ranger";
  if (n.includes("woody") || n.includes("leader") || n.includes("main"))  return "cowboy";
  if (n.includes("rex") || n.includes("neo") || n.includes("guard"))      return "dino";
  if (n.includes("vault") || n.includes("hamm") || n.includes("store"))   return "piggy";
  if (n.includes("hermes") || n.includes("slinky") || n.includes("relay"))return "spring";
  let h = 0;
  for (let i = 0; i < n.length; i++) h = ((h << 5) - h + n.charCodeAt(i)) | 0;
  const shapes: OracleShape[] = ["ranger", "cowboy", "dino", "piggy", "spring", "robot"];
  return shapes[Math.abs(h) % shapes.length];
}

function GenericChar({ name, status }: { name: string; status: "busy" | "ready" | "idle" | "crashed" }) {
  const color     = agentColor(name);
  const shape     = getShape(name);
  const isBusy    = status === "busy";
  const isIdle    = status === "idle";
  const isCrashed = status === "crashed";
  let h = 0;
  for (let i = 0; i < name.length; i++) h = ((h << 5) - h + name.charCodeAt(i)) | 0;
  h = Math.abs(h);
  const eyeStyle = h % 3;

  return (
    <g>
      {isBusy && <circle cx={0} cy={-10} r={33} fill="none" stroke={color} strokeWidth={1.5} opacity={0.22} className="ta-bounce" />}
      <ellipse cx={0} cy={27} rx={16} ry={3.5} fill={color} opacity={0.18} />

      <g className={isBusy ? "ta-bounce" : isIdle ? "ta-sleep" : ""}>

        {/* ── Body ── */}
        <rect x={-12} y={0} width={24} height={22} rx={8} fill={color} />
        {/* Plastic sheen */}
        <ellipse cx={-4} cy={3} rx={7} ry={4} fill="#fff" opacity={0.2} transform="rotate(-20,-4,3)" />
        <ellipse cx={-4} cy={4} rx={4} ry={2} fill="#fff" opacity={0.1} transform="rotate(-15,-4,4)" />

        {/* Body detail by shape */}
        {shape === "ranger" && (
          <>
            <rect x={-7} y={4} width={14} height={10} rx={2} fill="#fff" opacity={0.12} />
            <circle cx={0} cy={9} r={3} fill="#22d3ee" opacity={0.5} />
            <rect x={-5} y={5} width={3.5} height={1.2} rx={0.6} fill="#fbbf24" opacity={0.9} />
            <rect x={2} y={5} width={3.5} height={1.2} rx={0.6} fill="#ef4444" opacity={0.9} />
            <rect x={-5} y={7} width={10} height={1} rx={0.5} fill="#22d3ee" opacity={0.3} />
          </>
        )}
        {shape === "cowboy" && (
          <g transform="translate(5,5) scale(0.4)">
            <polygon points="0,-12 2.8,-4 11,-4 5,1.5 7,9.5 0,5 -7,9.5 -5,1.5 -11,-4 -2.8,-4" fill="#fbbf24" />
          </g>
        )}
        {shape === "dino" && (
          <>
            {[0,1,2].map(i => (
              <ellipse key={i} cx={-4 + i * 4} cy={3} rx={2} ry={1.2} fill="#fff" opacity={0.15} />
            ))}
          </>
        )}
        {shape === "piggy" && (
          <rect x={-3} y={-1} width={6} height={1.8} rx={0.9} fill="#000" opacity={0.25} />
        )}
        {shape === "spring" && (
          <path d="M -8 8 Q -3 5 2 8 Q 7 11 8 8" fill="none" stroke="#fff" strokeWidth={1.2} opacity={0.35} />
        )}
        {shape === "robot" && (
          <>
            <rect x={-5} y={4} width={10} height={7} rx={1} fill="#000" opacity={0.2} />
            <circle cx={-2} cy={7.5} r={1.2} fill="#4ade80" opacity={0.8} />
            <circle cx={2} cy={7.5} r={1.2} fill="#ef4444" opacity={0.8} />
          </>
        )}

        {/* ── Head ── */}
        <circle cx={0} cy={-20} r={14} fill={color} />
        <ellipse cx={-4} cy={-27} rx={5} ry={3} fill="#fff" opacity={0.22} transform="rotate(-18,-4,-27)" />

        {/* Head accessory by shape */}
        {shape === "ranger" && (
          <>
            <ellipse cx={0} cy={-20} rx={13} ry={12} fill="none" stroke="#fff" strokeWidth={1.5} opacity={0.18} />
            <ellipse cx={0} cy={-20} rx={10} ry={9} fill="#22d3ee" opacity={0.07} />
          </>
        )}
        {shape === "cowboy" && (
          <g transform="translate(0,-33)">
            <ellipse cx={0} cy={4} rx={14} ry={3} fill="#92400e" />
            <rect x={-8} y={-8} width={16} height={12} rx={4} fill="#92400e" />
            <ellipse cx={0} cy={-9} rx={8} ry={3} fill="#78350f" />
            <rect x={-3} y={-6} width={6} height={1.5} rx={0.75} fill="#fbbf24" opacity={0.7} />
          </g>
        )}
        {shape === "dino" && (
          <>
            {[-6,-2,2,6].map((x, i) => (
              <polygon key={i} points={`${x},-33 ${x-2},-27 ${x+2},-27`} fill={color} stroke="#fff" strokeWidth={0.8} />
            ))}
          </>
        )}
        {shape === "piggy" && (
          <>
            <ellipse cx={-10} cy={-32} rx={4} ry={3} fill={color} stroke="#fff" strokeWidth={1} />
            <ellipse cx={10} cy={-32} rx={4} ry={3} fill={color} stroke="#fff" strokeWidth={1} />
            <ellipse cx={0} cy={-13} rx={5} ry={3.5} fill="#fda4af" opacity={0.65} />
            <circle cx={-1.5} cy={-13} r={1.2} fill="#e11d48" opacity={0.45} />
            <circle cx={1.5} cy={-13} r={1.2} fill="#e11d48" opacity={0.45} />
          </>
        )}
        {shape === "spring" && (
          <>
            <path d="M -9 -29 Q -9 -39 -7 -41" stroke={color} strokeWidth={2} fill="none" strokeDasharray="2 1.5" />
            <circle cx={-7} cy={-42} r={2} fill={color} />
            <path d="M 9 -29 Q 9 -39 7 -41" stroke={color} strokeWidth={2} fill="none" strokeDasharray="2 1.5" />
            <circle cx={7} cy={-42} r={2} fill={color} />
          </>
        )}
        {shape === "robot" && (
          <>
            <rect x={-13} y={-33} width={26} height={16} rx={4} fill={color} stroke="#fff" strokeWidth={1} />
            <circle cx={0} cy={-26} r={4} fill="#000" opacity={0.3} />
            <line x1={-7} y1={-34} x2={-7} y2={-38} stroke="#aaa" strokeWidth={1.5} />
            <circle cx={-7} cy={-39} r={1.5} fill="#4ade80" />
          </>
        )}

        {/* ── Eyes ── */}
        <g className="ta-blink">
          {eyeStyle === 0 && (
            <>
              <circle cx={-5} cy={-21} r={4.5} fill="#fff" />
              <circle cx={5} cy={-21} r={4.5} fill="#fff" />
              <circle cx={-4} cy={-21} r={2.5} fill="#111" />
              <circle cx={6} cy={-21} r={2.5} fill="#111" />
              <circle cx={-3} cy={-22.5} r={1} fill="#fff" />
              <circle cx={7} cy={-22.5} r={1} fill="#fff" />
            </>
          )}
          {eyeStyle === 1 && (
            <>
              <rect x={-11} y={-25} width={8.5} height={5} rx={2.5} fill="#111" opacity={0.75} />
              <rect x={2.5} y={-25} width={8.5} height={5} rx={2.5} fill="#111" opacity={0.75} />
              <rect x={-10} y={-24} width={6.5} height={2} rx={1} fill="#22d3ee" opacity={0.7} />
              <rect x={3.5} y={-24} width={6.5} height={2} rx={1} fill="#22d3ee" opacity={0.7} />
            </>
          )}
          {eyeStyle === 2 && (
            <>
              <circle cx={-5} cy={-21} r={4.5} fill="#fff" />
              <circle cx={5} cy={-21} r={4.5} fill="#fff" />
              <text x={-5} y={-18} textAnchor="middle" fill={color} fontSize={7.5} fontWeight="bold">★</text>
              <text x={5} y={-18} textAnchor="middle" fill={color} fontSize={7.5} fontWeight="bold">★</text>
            </>
          )}
        </g>

        {/* Blush */}
        <ellipse cx={-11} cy={-17} rx={2.8} ry={1.8} fill="#ff9999" opacity={0.3} />
        <ellipse cx={11} cy={-17} rx={2.8} ry={1.8} fill="#ff9999" opacity={0.3} />

        {/* Mouth */}
        {isCrashed
          ? <path d="M -3 -13 Q 0 -15 3 -13" fill="none" stroke="#111" strokeWidth={1.2} strokeLinecap="round" />
          : isBusy
          ? <ellipse cx={0} cy={-13} rx={2} ry={1.5} fill="#111" />
          : <path d="M -3 -14 Q 0 -11 3 -14" fill="none" stroke="#111" strokeWidth={1.2} strokeLinecap="round" />
        }

        {/* ── Arms ── */}
        {isBusy ? (
          <>
            <g className="ta-typeL"><line x1={-12} y1={5} x2={-21} y2={13} stroke={color} strokeWidth={4} strokeLinecap="round" /></g>
            <g className="ta-typeR"><line x1={12} y1={5} x2={21} y2={13} stroke={color} strokeWidth={4} strokeLinecap="round" /></g>
          </>
        ) : (
          <>
            <g className={isIdle ? "ta-sleep" : "ta-wave"}>
              <line x1={-12} y1={5} x2={-20} y2={13} stroke={color} strokeWidth={4} strokeLinecap="round" />
            </g>
            <line x1={12} y1={5} x2={20} y2={13} stroke={color} strokeWidth={4} strokeLinecap="round" />
          </>
        )}

        {/* ── Legs ── */}
        <line x1={-5} y1={22} x2={-6} y2={28} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
        <line x1={5} y1={22} x2={6} y2={28} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
        <ellipse cx={-7} cy={29} rx={4} ry={2} fill="#111" opacity={0.55} />
        <ellipse cx={7} cy={29} rx={4} ry={2} fill="#111" opacity={0.55} />
      </g>

      {isBusy && (
        <text x={20} y={-16} fontSize={9} fill={color} opacity={0.85} className="ta-float">✦</text>
      )}
    </g>
  );
}

// ── Public export ──────────────────────────────────────────────────────────────
export const ToyAvatar = memo(function ToyAvatar({
  name,
  size = 100,
  status = "idle",
}: {
  name: string;
  size?: number;
  status?: "busy" | "ready" | "idle" | "crashed";
}) {
  const isPompom = name.toLowerCase().replace(/-oracle$/, "") === "pompom";
  return (
    <svg
      width={size} height={size}
      viewBox="-44 -48 88 84"
      style={{ overflow: "visible" }}
      aria-label={`${name} oracle character`}
    >
      <defs><style>{CSS}</style></defs>
      {isPompom
        ? <PompomChar status={status} />
        : <GenericChar name={name} status={status} />
      }
    </svg>
  );
});
