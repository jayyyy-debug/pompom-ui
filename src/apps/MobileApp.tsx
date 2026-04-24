import { useState, useCallback } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { useSessions } from "../hooks/useSessions";
import { MobileAgents } from "../components/mobile/MobileAgents";
import { MobileTalk } from "../components/mobile/MobileTalk";
import { MobileStatus } from "../components/mobile/MobileStatus";
import { MobileSettings } from "../components/mobile/MobileSettings";
import { MobileConnect } from "../components/mobile/MobileConnect";
import { getStoredHost } from "../lib/api";

type Tab = "agents" | "talk" | "status" | "settings";

const NAV: { id: Tab; icon: string; label: string }[] = [
  { id: "agents",   icon: "🤖", label: "Agents" },
  { id: "talk",     icon: "💬", label: "Talk" },
  { id: "status",   icon: "📊", label: "Status" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

export function MobileApp() {
  const [tab, setTab] = useState<Tab>("agents");
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const { sessions, agents, eventLog, handleMessage, addEvent } = useSessions();
  const { connected, reconnecting, send } = useWebSocket(handleMessage);

  const hasHost = !!getStoredHost();

  if (!hasHost && !connected) {
    return <MobileConnect />;
  }

  const handleAgentSelect = (name: string) => {
    setSelectedAgent(name);
    setTab("talk");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: "#020208", color: "#e0e0e0", fontFamily: "-apple-system, BlinkMacSystemFont, 'Noto Sans Thai', sans-serif", overflow: "hidden" }}>
      {/* Connection banner */}
      {!connected && (
        <div style={{ background: reconnecting ? "#2a1a00" : "#1a0000", color: reconnecting ? "#fbbf24" : "#ef4444", textAlign: "center", padding: "6px 12px", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", flexShrink: 0 }}>
          {reconnecting ? "⟳ กำลังเชื่อมต่อใหม่..." : "✗ ขาดการเชื่อมต่อ"}
        </div>
      )}

      {/* Content area */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {tab === "agents"   && <MobileAgents agents={agents} onSelect={handleAgentSelect} />}
        {tab === "talk"     && <MobileTalk agents={agents} selected={selectedAgent} onSelectAgent={setSelectedAgent} send={send} eventLog={eventLog} />}
        {tab === "status"   && <MobileStatus agents={agents} sessions={sessions} connected={connected} />}
        {tab === "settings" && <MobileSettings />}
      </div>

      {/* Bottom tab bar */}
      <nav style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.08)", background: "rgba(10,10,20,0.95)", backdropFilter: "blur(20px)", flexShrink: 0, paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        {NAV.map(n => (
          <button
            key={n.id}
            onClick={() => setTab(n.id)}
            style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              padding: "10px 0", gap: 3, border: "none", background: "none", cursor: "pointer",
              color: tab === n.id ? "#22d3ee" : "rgba(255,255,255,0.35)",
              transition: "color 0.15s", WebkitTapHighlightColor: "transparent",
            }}
          >
            <span style={{ fontSize: 22 }}>{n.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>{n.label}</span>
            {n.id === "agents" && agents.filter(a => a.status === "busy").length > 0 && (
              <span style={{ position: "absolute", top: 8, width: 8, height: 8, background: "#fbbf24", borderRadius: "50%", boxShadow: "0 0 6px #fbbf24" }} />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
