import { useState, useRef, useEffect, useCallback } from "react";
import type { AgentState, AgentEvent } from "../../lib/types";
import { agentColor } from "../../lib/constants";
import { ChibiPortrait } from "../ChibiPortrait";
import { FULL_COMMANDS } from "../../quickCommands";

interface Props {
  agents: AgentState[];
  selected: string | null;
  onSelectAgent: (name: string) => void;
  send: (data: any) => void;
  eventLog: AgentEvent[];
}

export function MobileTalk({ agents, selected, onSelectAgent, send, eventLog }: Props) {
  const [text, setText] = useState("");
  const [history, setHistory] = useState<{ ts: number; text: string; target: string }[]>([]);
  const [showQuick, setShowQuick] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const agent = agents.find(a => a.name === selected);
  const color = agent ? agentColor(agent.name) : "#22d3ee";

  // Scroll to bottom on new events
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [eventLog.length]);

  const handleSend = useCallback(() => {
    if (!text.trim() || !agent) return;
    send({ type: "send", target: agent.target, text: text + "\n" });
    setHistory(prev => [{ ts: Date.now(), text, target: agent.name }, ...prev.slice(0, 49)]);
    setText("");
    inputRef.current?.focus();
  }, [text, agent, send]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickCommands = FULL_COMMANDS.slice(0, 8);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Agent selector */}
      <div style={{ padding: "14px 16px 10px", background: "rgba(2,2,8,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>เลือก Agent</div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {agents.length === 0 && (
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>ยังไม่มี agent ออนไลน์</div>
          )}
          {agents.map(a => {
            const c = agentColor(a.name);
            const isSelected = a.name === selected;
            return (
              <button
                key={a.target}
                onClick={() => onSelectAgent(a.name)}
                style={{
                  flexShrink: 0, display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 12px", borderRadius: 12, border: `1.5px solid ${isSelected ? c + "80" : "rgba(255,255,255,0.08)"}`,
                  background: isSelected ? `${c}15` : "rgba(255,255,255,0.03)",
                  cursor: "pointer", transition: "all 0.15s", WebkitTapHighlightColor: "transparent",
                }}
              >
                <ChibiPortrait name={a.name} size={28} status={a.status === "crashed" ? "idle" : a.status} />
                <span style={{ fontSize: 13, fontWeight: isSelected ? 700 : 500, color: isSelected ? "#fff" : "rgba(255,255,255,0.5)", textTransform: "capitalize" }}>
                  {a.name.replace(/-oracle$/i, "").replace(/-/g, " ")}
                </span>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: a.status === "busy" ? "#fbbf24" : a.status === "ready" ? "#4ade80" : "#4b5563", flexShrink: 0 }} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Message feed */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8, overscrollBehavior: "contain" }}>
        {!agent && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.25)" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>💬</div>
            <div style={{ fontSize: 15 }}>เลือก agent ด้านบนเพื่อเริ่มคุย</div>
          </div>
        )}

        {agent && history.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.2)" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>
              <ChibiPortrait name={agent.name} size={60} status={agent.status === "crashed" ? "idle" : agent.status} />
            </div>
            <div style={{ fontSize: 14, marginTop: 8 }}>พิมพ์ข้อความเพื่อคุยกับ {agent.name.replace(/-oracle$/i, "")}</div>
          </div>
        )}

        {history.map((h, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{
              maxWidth: "80%", padding: "10px 14px", background: `${color}20`,
              border: `1px solid ${color}30`, borderRadius: "16px 16px 4px 16px",
              fontSize: 14, color: "#f0f0f0", lineHeight: 1.5,
            }}>
              {h.text}
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 4, textAlign: "right" }}>
                {new Date(h.ts).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick commands */}
      {showQuick && agent && (
        <div style={{ padding: "8px 16px", background: "rgba(10,10,20,0.95)", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 8, overflowX: "auto", flexShrink: 0 }}>
          {quickCommands.map((cmd, i) => (
            <button
              key={i}
              onClick={() => { setText(cmd.text); setShowQuick(false); inputRef.current?.focus(); }}
              style={{
                flexShrink: 0, padding: "6px 12px", borderRadius: 10,
                background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)",
                color: "#22d3ee", fontSize: 12, fontWeight: 600, cursor: "pointer",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {cmd.label}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div style={{ padding: "10px 12px", background: "rgba(10,10,20,0.98)", borderTop: "1px solid rgba(255,255,255,0.08)", flexShrink: 0, paddingBottom: "calc(10px + env(safe-area-inset-bottom, 0px))" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <button
            onClick={() => setShowQuick(v => !v)}
            disabled={!agent}
            style={{
              width: 42, height: 42, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
              background: showQuick ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.04)",
              color: showQuick ? "#22d3ee" : "rgba(255,255,255,0.4)", fontSize: 18, cursor: "pointer",
              flexShrink: 0, WebkitTapHighlightColor: "transparent",
            }}
          >⚡</button>

          <textarea
            ref={inputRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder={agent ? `พิมพ์ถึง ${agent.name.replace(/-oracle$/i, "")}...` : "เลือก agent ก่อน..."}
            disabled={!agent}
            rows={1}
            style={{
              flex: 1, padding: "10px 14px", background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14,
              color: "#e0e0e0", fontSize: 15, outline: "none", resize: "none",
              fontFamily: "inherit", maxHeight: 120, overflowY: "auto",
              lineHeight: 1.5, transition: "border-color 0.15s",
            }}
            onFocus={e => { e.currentTarget.style.borderColor = color + "60"; }}
            onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
          />

          <button
            onClick={handleSend}
            disabled={!agent || !text.trim()}
            style={{
              width: 42, height: 42, borderRadius: 12, border: "none",
              background: agent && text.trim() ? color : "rgba(255,255,255,0.05)",
              color: agent && text.trim() ? "#000" : "rgba(255,255,255,0.2)",
              fontSize: 18, fontWeight: 700, cursor: agent && text.trim() ? "pointer" : "default",
              flexShrink: 0, transition: "all 0.15s", WebkitTapHighlightColor: "transparent",
            }}
          >↑</button>
        </div>
      </div>
    </div>
  );
}
