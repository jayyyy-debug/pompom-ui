import { useState } from "react";
import { setStoredHost } from "../../lib/api";

export function MobileConnect() {
  const [host, setHost] = useState("localhost:3456");

  const handleConnect = () => {
    if (!host.trim()) return;
    setStoredHost(host.trim());
    window.location.reload();
  };

  return (
    <div style={{
      height: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      background: "#020208", color: "#e0e0e0", padding: "0 32px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Noto Sans Thai', sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: 360 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🐾</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>pompom</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>maw oracle manager</div>
        </div>

        {/* Connect form */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "24px 20px" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 6 }}>เชื่อมต่อ maw server</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>
            ใส่ host:port ของ maw ที่รันอยู่
          </div>
          <input
            type="text"
            value={host}
            onChange={e => setHost(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleConnect()}
            placeholder="localhost:3456"
            autoFocus
            style={{
              width: "100%", boxSizing: "border-box", padding: "14px 16px",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 14, color: "#e0e0e0", fontSize: 16, outline: "none",
              fontFamily: "monospace", marginBottom: 14,
            }}
          />
          <button
            onClick={handleConnect}
            style={{
              width: "100%", padding: "14px", borderRadius: 14, border: "none",
              background: "#22d3ee", color: "#000", fontWeight: 800,
              fontSize: 16, cursor: "pointer", letterSpacing: "0.02em",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            เชื่อมต่อ →
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.25)", lineHeight: 1.6 }}>
          รัน <code style={{ color: "#22d3ee", background: "rgba(34,211,238,0.1)", padding: "2px 6px", borderRadius: 4 }}>oracle-start</code> บนเครื่องก่อน<br/>แล้วใส่ IP:port ของเครื่องนั้น
        </div>
      </div>
    </div>
  );
}
