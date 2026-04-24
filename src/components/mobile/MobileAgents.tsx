import { useState } from "react";
import type { AgentState, PaneStatus } from "../../lib/types";
import { agentColor } from "../../lib/constants";
import { ChibiPortrait } from "../ChibiPortrait";

const STATUS_LABEL: Record<PaneStatus, string> = {
  busy:    "กำลังทำงาน",
  ready:   "พร้อม",
  idle:    "ว่าง",
  crashed: "หยุด",
};

const STATUS_COLOR: Record<PaneStatus, string> = {
  busy:    "#fbbf24",
  ready:   "#4ade80",
  idle:    "#6b7280",
  crashed: "#ef4444",
};

function AgentCard({ agent, onSelect }: { agent: AgentState; onSelect: () => void }) {
  const color = agentColor(agent.name);
  const displayName = agent.name.replace(/-oracle$/i, "").replace(/-/g, " ");
  const statusColor = STATUS_COLOR[agent.status] || STATUS_COLOR.idle;

  return (
    <button
      onClick={onSelect}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 14,
        padding: "14px 16px", background: "rgba(255,255,255,0.03)",
        border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 16,
        cursor: "pointer", textAlign: "left", transition: "all 0.15s",
        WebkitTapHighlightColor: "transparent",
      }}
      onTouchStart={e => { (e.currentTarget as HTMLElement).style.background = `${color}10`; }}
      onTouchEnd={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
    >
      <div style={{ position: "relative", flexShrink: 0 }}>
        <ChibiPortrait name={agent.name} size={52} status={agent.status === "crashed" ? "idle" : agent.status} />
        <div style={{
          position: "absolute", bottom: 1, right: 1, width: 14, height: 14,
          borderRadius: "50%", background: statusColor, border: "2px solid #020208",
          boxShadow: agent.status === "busy" ? `0 0 8px ${statusColor}` : "none",
        }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#f0f0f0", textTransform: "capitalize", marginBottom: 3 }}>{displayName}</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>
          <span style={{ color: statusColor, fontWeight: 600 }}>{STATUS_LABEL[agent.status]}</span>
          {agent.project && <span style={{ marginLeft: 6 }}>· {agent.project}</span>}
        </div>
        {agent.preview && (
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>
            {agent.preview.slice(0, 60)}
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0, color: "rgba(255,255,255,0.2)", fontSize: 18 }}>›</div>
    </button>
  );
}

export function MobileAgents({ agents, onSelect }: { agents: AgentState[]; onSelect: (name: string) => void }) {
  const [search, setSearch] = useState("");

  const busy   = agents.filter(a => a.status === "busy");
  const ready  = agents.filter(a => a.status === "ready");
  const others = agents.filter(a => a.status !== "busy" && a.status !== "ready");

  const filtered = search
    ? agents.filter(a => a.name.toLowerCase().includes(search.toLowerCase()))
    : null;

  return (
    <div style={{ height: "100%", overflowY: "auto", overscrollBehavior: "contain" }}>
      {/* Header */}
      <div style={{ padding: "20px 16px 12px", position: "sticky", top: 0, background: "rgba(2,2,8,0.95)", backdropFilter: "blur(20px)", zIndex: 10 }}>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 12, color: "#fff" }}>
          Agents <span style={{ fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.35)" }}>({agents.length})</span>
        </div>
        <input
          type="search"
          placeholder="ค้นหา agent..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%", boxSizing: "border-box", padding: "10px 14px",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12, color: "#e0e0e0", fontSize: 15, outline: "none",
          }}
        />
      </div>

      <div style={{ padding: "0 16px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered ? (
          filtered.length === 0
            ? <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: "40px 0" }}>ไม่พบ agent</div>
            : filtered.map(a => <AgentCard key={a.target} agent={a} onSelect={() => onSelect(a.name)} />)
        ) : (
          <>
            {busy.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#fbbf24", letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 2px" }}>
                  กำลังทำงาน ({busy.length})
                </div>
                {busy.map(a => <AgentCard key={a.target} agent={a} onSelect={() => onSelect(a.name)} />)}
              </>
            )}
            {ready.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#4ade80", letterSpacing: "0.08em", textTransform: "uppercase", padding: "8px 2px 4px" }}>
                  พร้อม ({ready.length})
                </div>
                {ready.map(a => <AgentCard key={a.target} agent={a} onSelect={() => onSelect(a.name)} />)}
              </>
            )}
            {others.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em", textTransform: "uppercase", padding: "8px 2px 4px" }}>
                  อื่นๆ ({others.length})
                </div>
                {others.map(a => <AgentCard key={a.target} agent={a} onSelect={() => onSelect(a.name)} />)}
              </>
            )}
            {agents.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(255,255,255,0.3)" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🤖</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>ยังไม่มี agent</div>
                <div style={{ fontSize: 13, marginTop: 6 }}>รัน maw serve แล้ว wake agent ก่อน</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
