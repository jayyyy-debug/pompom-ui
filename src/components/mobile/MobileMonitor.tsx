import { useState } from "react";
import type { AgentState, AgentEvent } from "../../lib/types";
import { agentColor } from "../../lib/constants";
import { ToyAvatar } from "./ToyAvatar";

const STATUS_COLOR = {
  busy:    "#fbbf24",
  ready:   "#4ade80",
  idle:    "#6b7280",
  crashed: "#ef4444",
} as const;

const STATUS_TH = {
  busy:    "กำลังทำงาน",
  ready:   "พร้อม",
  idle:    "ว่าง",
  crashed: "หยุดทำงาน",
} as const;

// ── Single oracle card in the toy room ────────────────────────────────────────
function OracleCard({
  agent,
  onTalk,
}: {
  agent: AgentState;
  onTalk: () => void;
}) {
  const color = agentColor(agent.name);
  const sColor = STATUS_COLOR[agent.status] ?? STATUS_COLOR.idle;
  const displayName = agent.name.replace(/-oracle$/i, "").replace(/-/g, " ");
  const preview = agent.preview?.replace(/\x1B\[[0-9;]*m/g, "").slice(0, 72) || "";

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.025)",
        border: `1.5px solid ${agent.status === "busy" ? color + "55" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 20,
        padding: "16px 14px 14px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
        position: "relative",
        boxShadow: agent.status === "busy" ? `0 0 20px ${color}18` : "none",
        transition: "all 0.3s",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Status dot */}
      <div style={{
        position: "absolute", top: 12, right: 12,
        width: 9, height: 9, borderRadius: "50%",
        background: sColor,
        boxShadow: agent.status === "busy" ? `0 0 8px ${sColor}` : "none",
      }} />

      {/* Avatar */}
      <div style={{ marginBottom: -4 }}>
        <ToyAvatar name={agent.name} size={88} status={agent.status === "crashed" ? "crashed" : agent.status} />
      </div>

      {/* Name */}
      <div style={{
        fontWeight: 800, fontSize: 13, color: "#f0f0f0",
        textTransform: "capitalize", textAlign: "center",
        letterSpacing: "0.01em", marginTop: 4,
      }}>
        {displayName}
      </div>

      {/* Status label */}
      <div style={{ fontSize: 10, fontWeight: 700, color: sColor, letterSpacing: "0.06em", marginTop: 2 }}>
        {STATUS_TH[agent.status] ?? "ว่าง"}
      </div>

      {/* Preview bubble */}
      {preview && (
        <div style={{
          marginTop: 8, padding: "6px 10px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 10,
          fontSize: 10, color: "rgba(255,255,255,0.45)",
          lineHeight: 1.45, textAlign: "left", width: "100%",
          minHeight: 28,
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        } as any}>
          {preview}
        </div>
      )}

      {/* Talk button */}
      <button
        onClick={onTalk}
        style={{
          marginTop: 10, width: "100%", padding: "7px 0",
          borderRadius: 10, border: `1px solid ${color}50`,
          background: `${color}12`, color,
          fontWeight: 700, fontSize: 11, letterSpacing: "0.05em",
          cursor: "pointer", WebkitTapHighlightColor: "transparent",
          textTransform: "uppercase",
        }}
      >
        💬 คุย
      </button>
    </div>
  );
}

// ── Main monitor view ─────────────────────────────────────────────────────────
export function MobileMonitor({
  agents,
  eventLog,
  onTalk,
}: {
  agents: AgentState[];
  eventLog: AgentEvent[];
  onTalk: (name: string) => void;
}) {
  const [filter, setFilter] = useState<"all" | "busy" | "ready" | "idle">("all");

  const busyCount  = agents.filter(a => a.status === "busy").length;
  const readyCount = agents.filter(a => a.status === "ready").length;

  const filtered = filter === "all"
    ? agents
    : agents.filter(a => a.status === filter);

  // Sort: busy first, then ready, then others
  const sorted = [...filtered].sort((a, b) => {
    const order = { busy: 0, ready: 1, idle: 2, crashed: 3 };
    return (order[a.status] ?? 2) - (order[b.status] ?? 2);
  });

  // Recent 5 events for activity feed
  const recent = eventLog.slice(-5).reverse();

  return (
    <div style={{ height: "100%", overflowY: "auto", background: "#020208", overscrollBehavior: "contain" }}>

      {/* ── Header ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(2,2,8,0.95)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "16px 16px 12px",
      }}>
        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
              Oracle Room
              <span style={{ fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.35)", marginLeft: 8 }}>
                {agents.length} agents
              </span>
            </div>
          </div>
          {busyCount > 0 && (
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 10px", borderRadius: 10,
              background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.25)",
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fbbf24", boxShadow: "0 0 6px #fbbf24" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#fbbf24" }}>{busyCount} busy</span>
            </div>
          )}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 6 }}>
          {(["all", "busy", "ready", "idle"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "5px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                background: filter === f ? (f === "busy" ? "#fbbf24" : f === "ready" ? "#4ade80" : f === "idle" ? "rgba(255,255,255,0.12)" : "#22d3ee") : "rgba(255,255,255,0.05)",
                color: filter === f ? (f === "all" ? "#000" : f === "idle" ? "#fff" : "#000") : "rgba(255,255,255,0.4)",
                fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
                WebkitTapHighlightColor: "transparent",
                transition: "all 0.15s",
              }}
            >
              {f === "all" ? `ทั้งหมด (${agents.length})` : f === "busy" ? `Busy (${busyCount})` : f === "ready" ? `Ready (${readyCount})` : "Idle"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Toy Room grid ── */}
      <div style={{ padding: "14px 12px" }}>
        {sorted.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(255,255,255,0.25)" }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>🧸</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
              {filter === "all" ? "ยังไม่มี oracle ออนไลน์" : `ไม่มี oracle ที่ ${filter}`}
            </div>
            <div style={{ fontSize: 13 }}>รัน oracle-start แล้ว maw wake &lt;name&gt;</div>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 10,
          }}>
            {sorted.map(agent => (
              <OracleCard
                key={agent.target}
                agent={agent}
                onTalk={() => onTalk(agent.name)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Activity feed ── */}
      {recent.length > 0 && (
        <div style={{ padding: "0 12px 24px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
            กิจกรรมล่าสุด
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {recent.map((ev, i) => {
              const color = agentColor(ev.target);
              const ts = new Date(ev.time).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
              return (
                <div key={i} style={{
                  display: "flex", gap: 8, alignItems: "flex-start",
                  padding: "6px 10px", background: "rgba(255,255,255,0.025)",
                  borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)",
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0, marginTop: 4 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color, textTransform: "capitalize" }}>
                      {ev.target.replace(/-oracle$/i, "").replace(/-/g, " ")}
                    </span>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginLeft: 6 }}>{ts}</span>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {ev.detail}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
