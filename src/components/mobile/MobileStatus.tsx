import type { AgentState, PaneStatus } from "../../lib/types";
import type { Session } from "../../lib/types";
import { agentColor } from "../../lib/constants";

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

function StatCard({ label, value, color }: { label: string; value: number | string; color?: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "18px 20px", flex: 1 }}>
      <div style={{ fontSize: 28, fontWeight: 800, color: color || "#f0f0f0", marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
    </div>
  );
}

export function MobileStatus({ agents, sessions, connected }: { agents: AgentState[]; sessions: Session[]; connected: boolean }) {
  const busy    = agents.filter(a => a.status === "busy").length;
  const ready   = agents.filter(a => a.status === "ready").length;
  const idle    = agents.filter(a => a.status === "idle").length;
  const crashed = agents.filter(a => a.status === "crashed").length;

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "20px 16px 32px" }}>
      {/* Connection */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, padding: "14px 16px", borderRadius: 16, background: connected ? "rgba(74,222,128,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${connected ? "rgba(74,222,128,0.2)" : "rgba(239,68,68,0.2)"}` }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: connected ? "#4ade80" : "#ef4444", boxShadow: connected ? "0 0 8px #4ade80" : "none" }} />
        <div style={{ fontWeight: 700, fontSize: 14, color: connected ? "#4ade80" : "#ef4444" }}>
          {connected ? "เชื่อมต่อแล้ว" : "ขาดการเชื่อมต่อ"}
        </div>
        <div style={{ marginLeft: "auto", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>maw :3456</div>
      </div>

      {/* Summary stats */}
      <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>ภาพรวม</div>
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <StatCard label="Agents" value={agents.length} />
        <StatCard label="Sessions" value={sessions.length} />
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
        <StatCard label="Busy" value={busy} color="#fbbf24" />
        <StatCard label="Ready" value={ready} color="#4ade80" />
        <StatCard label="Idle" value={idle} color="#6b7280" />
        {crashed > 0 && <StatCard label="Crashed" value={crashed} color="#ef4444" />}
      </div>

      {/* Session list */}
      {sessions.length > 0 && (
        <>
          <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Sessions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sessions.map(s => {
              const sessionAgents = agents.filter(a => a.session === s.name);
              return (
                <div key={s.name} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 16px" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#f0f0f0", marginBottom: 8 }}>{s.name}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {sessionAgents.map(a => (
                      <span key={a.target} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 8, background: `${agentColor(a.name)}15`, border: `1px solid ${agentColor(a.name)}30`, fontSize: 12 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_COLOR[a.status] }} />
                        {a.name.replace(/-oracle$/i, "")}
                      </span>
                    ))}
                    {sessionAgents.length === 0 && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>ไม่มี agent</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {agents.length === 0 && !connected && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.25)" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📡</div>
          <div style={{ fontSize: 15 }}>ยังไม่ได้เชื่อมต่อกับ maw server</div>
        </div>
      )}
    </div>
  );
}
