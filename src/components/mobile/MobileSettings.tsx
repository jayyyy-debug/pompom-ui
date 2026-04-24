import { useState } from "react";
import { getStoredHost, setStoredHost, clearStoredHost, getRecentHosts } from "../../lib/api";

export function MobileSettings() {
  const [host, setHost] = useState(getStoredHost() || "");
  const [saved, setSaved] = useState(false);
  const recent = getRecentHosts();

  const handleSave = () => {
    if (!host.trim()) {
      clearStoredHost();
    } else {
      setStoredHost(host.trim());
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      window.location.reload();
    }, 800);
  };

  const handleClear = () => {
    clearStoredHost();
    setHost("");
    setTimeout(() => window.location.reload(), 300);
  };

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "20px 16px 32px" }}>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, color: "#fff" }}>Settings</div>

      {/* Server config */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>maw Server</div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 16 }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
            Host:port ของ maw server (เช่น <code style={{ color: "#22d3ee" }}>192.168.1.10:3456</code>)
          </div>
          <input
            type="text"
            value={host}
            onChange={e => setHost(e.target.value)}
            placeholder="localhost:3456"
            style={{
              width: "100%", boxSizing: "border-box", padding: "12px 14px",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 12, color: "#e0e0e0", fontSize: 15, outline: "none",
              marginBottom: 12, fontFamily: "monospace",
            }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleSave}
              style={{
                flex: 1, padding: "12px", borderRadius: 12, border: "none",
                background: saved ? "#4ade80" : "#22d3ee", color: "#000",
                fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all 0.2s",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {saved ? "✓ บันทึกแล้ว" : "บันทึก & เชื่อมต่อ"}
            </button>
            {host && (
              <button
                onClick={handleClear}
                style={{
                  padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(239,68,68,0.3)",
                  background: "rgba(239,68,68,0.1)", color: "#ef4444",
                  fontWeight: 600, fontSize: 14, cursor: "pointer",
                  WebkitTapHighlightColor: "transparent",
                }}
              >ล้าง</button>
            )}
          </div>
        </div>

        {/* Recent hosts */}
        {recent.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 8 }}>ที่เคยเชื่อมต่อ</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {recent.map(h => (
                <button
                  key={h}
                  onClick={() => { setHost(h); }}
                  style={{
                    textAlign: "left", padding: "10px 14px", borderRadius: 10,
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.6)", fontSize: 14, fontFamily: "monospace",
                    cursor: "pointer", WebkitTapHighlightColor: "transparent",
                  }}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* App info */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>เกี่ยวกับ</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>app</span>
            <span style={{ color: "#f0f0f0", fontSize: 13, fontWeight: 600 }}>pompom-ui</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>base</span>
            <span style={{ color: "#f0f0f0", fontSize: 13, fontFamily: "monospace" }}>maw-ui fork</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>oracle</span>
            <span style={{ color: "#22d3ee", fontSize: 13, fontWeight: 600 }}>ปอมปอม</span>
          </div>
        </div>
      </div>

      {/* Navigation links to full UI */}
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 10 }}>เปิด UI เต็มรูปแบบ</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { label: "ARRA Office (Full)", href: "/office.html" },
            { label: "Fleet View",         href: "/fleet.html" },
            { label: "Dashboard",          href: "/dashboard.html" },
            { label: "Federation",         href: "/federation_2d.html" },
          ].map(link => (
            <a
              key={link.href}
              href={link.href}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 16px", borderRadius: 12,
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.6)", fontSize: 14, textDecoration: "none",
              }}
            >
              {link.label}
              <span style={{ color: "rgba(255,255,255,0.25)" }}>›</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
