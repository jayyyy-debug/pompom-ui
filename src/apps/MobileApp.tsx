import { useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { useSessions } from "../hooks/useSessions";
import { MobileMonitor } from "../components/mobile/MobileMonitor";
import { MobileTalk } from "../components/mobile/MobileTalk";
import { MobileStatus } from "../components/mobile/MobileStatus";
import { MobileSettings } from "../components/mobile/MobileSettings";
import { getStoredHost, setStoredHost } from "../lib/api";

// Auto-detect maw host from the page's hostname (LAN access → same machine)
// e.g. opened from http://10.20.1.138:5173 → maw is at http://10.20.1.138:3456
function ensureHost() {
  if (getStoredHost()) return;
  const { hostname } = window.location;
  const host = hostname === "localhost" || hostname === "127.0.0.1"
    ? "localhost:3456"
    : `http://${hostname}:3456`;
  setStoredHost(host);
}
ensureHost();

type Tab = "monitor" | "talk" | "status" | "settings";

const NAV: { id: Tab; icon: string; label: string }[] = [
  { id: "monitor",  icon: "🧸", label: "Monitor" },
  { id: "talk",     icon: "💬", label: "Talk" },
  { id: "status",   icon: "📊", label: "Status" },
  { id: "settings", icon: "⚙️",  label: "Settings" },
];

export function MobileApp() {
  const [tab, setTab] = useState<Tab>("monitor");
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const { sessions, agents, eventLog, handleMessage } = useSessions();
  const { connected, reconnecting, send } = useWebSocket(handleMessage);

  const goTalk = (name: string) => {
    setSelectedAgent(name);
    setTab("talk");
  };

  const busyCount = agents.filter(a => a.status === "busy").length;

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100dvh",
      background: "#020208", color: "#e0e0e0",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Noto Sans Thai', sans-serif",
      overflow: "hidden",
    }}>
      {/* Connection banner */}
      {!connected && (
        <div style={{
          background: reconnecting ? "#2a1a00" : "#1a0000",
          color: reconnecting ? "#fbbf24" : "#ef4444",
          textAlign: "center", padding: "6px 12px", fontSize: 12,
          fontWeight: 700, letterSpacing: "0.05em", flexShrink: 0,
        }}>
          {reconnecting ? "⟳ กำลังเชื่อมต่อใหม่..." : "✗ ขาดการเชื่อมต่อ — รัน oracle-start บนเครื่อง"}
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {tab === "monitor"  && <MobileMonitor agents={agents} eventLog={eventLog} onTalk={goTalk} />}
        {tab === "talk"     && <MobileTalk agents={agents} selected={selectedAgent} onSelectAgent={setSelectedAgent} send={send} eventLog={eventLog} />}
        {tab === "status"   && <MobileStatus agents={agents} sessions={sessions} connected={connected} />}
        {tab === "settings" && <MobileSettings />}
      </div>

      {/* Bottom tab bar */}
      <nav style={{
        display: "flex",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(8,8,18,0.97)",
        backdropFilter: "blur(20px)",
        flexShrink: 0,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
        {NAV.map(n => {
          const isActive = tab === n.id;
          const hasBadge = n.id === "monitor" && busyCount > 0;
          return (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "10px 0", gap: 3, border: "none",
                background: "none", cursor: "pointer",
                color: isActive ? "#c084fc" : "rgba(255,255,255,0.32)",
                transition: "color 0.15s",
                WebkitTapHighlightColor: "transparent",
                position: "relative",
              }}
            >
              <span style={{ fontSize: 22 }}>{n.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                {n.label}
              </span>
              {/* Active underline */}
              {isActive && (
                <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 2, background: "#c084fc", borderRadius: "0 0 2px 2px" }} />
              )}
              {/* Busy badge */}
              {hasBadge && (
                <div style={{
                  position: "absolute", top: 6, right: "22%",
                  minWidth: 16, height: 16, borderRadius: 8,
                  background: "#fbbf24", color: "#000",
                  fontSize: 9, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: "0 4px", boxShadow: "0 0 6px #fbbf24",
                }}>
                  {busyCount}
                </div>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
