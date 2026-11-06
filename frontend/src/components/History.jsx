import React from "react";

export default function History({ items = [], onSelect, onGoToAnalyze, onClear }) {
  if (!items.length) {
    return (
      <div className="glass history-empty-widget animate-fade-in">
        {/* Animated Hologram / Radar Graphic */}
        <div className="history-empty-graphic-wrap">
          <div className="history-radar-halo" />
          <svg
            width="140"
            height="140"
            viewBox="0 0 140 140"
            className="history-empty-radar"
          >
            <circle
              cx="70"
              cy="70"
              r="60"
              stroke="rgba(224, 122, 56, 0.18)"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="4 4"
            />
            <circle
              cx="70"
              cy="70"
              r="44"
              stroke="rgba(224, 122, 56, 0.28)"
              strokeWidth="1.5"
              fill="none"
            />
            <circle
              cx="70"
              cy="70"
              r="28"
              stroke="rgba(224, 122, 56, 0.42)"
              strokeWidth="1.5"
              fill="none"
            />
            <circle
              cx="70"
              cy="70"
              r="12"
              fill="var(--app-accent, #e07a38)"
              opacity="0.85"
            />
            {/* Radar sweep beam */}
            <line
              x1="70"
              y1="70"
              x2="70"
              y2="10"
              stroke="url(#radarGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="radar-sweep-beam"
            />
            <defs>
              <linearGradient id="radarGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="var(--app-accent, #e07a38)" stopOpacity="0" />
                <stop offset="100%" stopColor="var(--app-accent, #e07a38)" stopOpacity="1" />
              </linearGradient>
            </defs>
          </svg>

          <div className="history-graphic-icon-badge">
            <span role="img" aria-label="audit history">📜</span>
          </div>
        </div>

        {/* Content Heading & Explanation */}
        <div className="history-empty-content">
          <h3 className="history-empty-title">No History Recorded</h3>
          <p className="history-empty-desc">
            No moderation predictions have been logged in this session yet.
            Click the <strong style={{ color: "var(--app-accent, #e07a38)" }}>Analyze</strong> button on the Analyze tab to evaluate content and store your moderation audit history.
          </p>

          {/* Primary Action Button */}
          {onGoToAnalyze && (
            <button
              className="history-cta-btn"
              onClick={onGoToAnalyze}
            >
              <span>⚡ Click Analyze to Store History</span>
            </button>
          )}

          {/* Feature Highlights Grid */}
          <div className="history-empty-features">
            <div className="history-feat-card">
              <span className="history-feat-icon">🕒</span>
              <div>
                <strong>Audit Trail</strong>
                <p>Track all inputs with toxicity scores, confidence, and timestamps.</p>
              </div>
            </div>

            <div className="history-feat-card">
              <span className="history-feat-icon">🛡️</span>
              <div>
                <strong>Ensemble Decisions</strong>
                <p>Inspect multi-layer rule, DeBERTa, and LLM safety verdicts.</p>
              </div>
            </div>

            <div className="history-feat-card">
              <span className="history-feat-icon">🔁</span>
              <div>
                <strong>One-Click Re-run</strong>
                <p>Click any stored record to load it directly back into the analyzer.</p>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .history-empty-widget {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 48px 24px;
            margin-top: 16px;
            border-radius: var(--radius-lg, 16px);
            background: var(--surface-glass, rgba(255,255,255,0.03));
            border: 1px solid var(--border-color, rgba(224,122,56,0.18));
            backdrop-filter: blur(16px);
            position: relative;
            overflow: hidden;
          }

          .history-empty-graphic-wrap {
            position: relative;
            width: 140px;
            height: 140px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
          }

          .history-radar-halo {
            position: absolute;
            inset: 0;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(224, 122, 56, 0.22) 0%, transparent 70%);
            animation: haloPulse 3s ease-in-out infinite;
          }

          @keyframes haloPulse {
            0%, 100% { transform: scale(0.95); opacity: 0.5; }
            50% { transform: scale(1.15); opacity: 1; }
          }

          .history-empty-radar {
            width: 140px;
            height: 140px;
            filter: drop-shadow(0 0 12px rgba(224, 122, 56, 0.35));
          }

          .radar-sweep-beam {
            transform-origin: 70px 70px;
            animation: radarRotate 3.2s linear infinite;
          }

          @keyframes radarRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .history-graphic-icon-badge {
            position: absolute;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: var(--app-surface, #111726);
            border: 2px solid var(--app-accent, #e07a38);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.35rem;
            box-shadow: 0 4px 16px rgba(224, 122, 56, 0.4);
          }

          .history-empty-content {
            max-width: 580px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .history-empty-title {
            font-family: var(--font-heading, "DM Serif Display", serif);
            font-size: 1.6rem;
            color: var(--text-primary, #f8fafc);
            margin: 0 0 10px 0;
            font-weight: 700;
          }

          .history-empty-desc {
            font-size: 0.92rem;
            color: var(--text-secondary, #94a3b8);
            line-height: 1.6;
            margin: 0 0 24px 0;
          }

          .history-cta-btn {
            background: linear-gradient(135deg, #e07a38 0%, #ea580c 100%);
            color: #ffffff;
            font-weight: 700;
            font-size: 0.92rem;
            letter-spacing: 0.02em;
            padding: 12px 28px;
            border-radius: 10px;
            border: 1px solid rgba(224, 122, 56, 0.6);
            cursor: pointer;
            box-shadow: 0 6px 20px rgba(224, 122, 56, 0.45);
            transition: all 0.22s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 32px;
          }

          .history-cta-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 26px rgba(224, 122, 56, 0.65);
            background: linear-gradient(135deg, #ea8b4e 0%, #ea580c 100%);
          }

          .history-cta-btn:active {
            transform: translateY(0);
          }

          .history-empty-features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 14px;
            width: 100%;
            text-align: left;
          }

          .history-feat-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.07);
            border-radius: 10px;
            padding: 12px 14px;
            display: flex;
            gap: 10px;
            align-items: flex-start;
          }

          .history-feat-icon {
            font-size: 1.25rem;
            line-height: 1;
            margin-top: 2px;
          }

          .history-feat-card strong {
            display: block;
            font-size: 0.8rem;
            color: var(--text-primary, #f8fafc);
            margin-bottom: 2px;
          }

          .history-feat-card p {
            margin: 0;
            font-size: 0.72rem;
            color: var(--text-tertiary, #94a3b8);
            line-height: 1.4;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="glass history-panel animate-fade-in" style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h3 style={{ margin: 0, fontSize: "1.25rem" }}>📜 Analysis History</h3>
          <span style={{ fontSize: "0.75rem", background: "var(--app-accent-soft, rgba(224,122,56,0.15))", color: "var(--app-accent, #e07a38)", padding: "2px 8px", borderRadius: "12px", fontWeight: "600" }}>
            {items.length} logged
          </span>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          {onGoToAnalyze && (
            <button
              className="primary-btn"
              onClick={onGoToAnalyze}
              style={{ fontSize: "0.78rem", padding: "6px 14px" }}
            >
              ⚡ New Analysis
            </button>
          )}

          {onClear && (
            <button
              className="danger-btn"
              onClick={onClear}
              style={{ fontSize: "0.78rem", padding: "6px 12px", cursor: "pointer" }}
            >
              🗑️ Clear
            </button>
          )}
        </div>
      </div>

      <div className="history-list" style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "480px", overflowY: "auto" }}>
        {items.slice(-30).reverse().map((item, idx) => {
          const isToxic = Boolean(item.toxic);
          const pct = Math.round((item.confidence || 0) * 100);

          return (
            <div
              key={idx}
              className="history-item-card"
              onClick={() => onSelect && onSelect(item.text)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                gap: "12px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    padding: "3px 8px",
                    borderRadius: "6px",
                    fontSize: "0.72rem",
                    fontWeight: "700",
                    letterSpacing: "0.02em",
                    background: isToxic ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)",
                    color: isToxic ? "#f87171" : "#34d399",
                    border: `1px solid ${isToxic ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}`,
                    whiteSpace: "nowrap"
                  }}
                >
                  {isToxic ? `⚠️ Toxic ${pct}%` : `✅ Safe ${pct}%`}
                </span>

                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-primary, #f8fafc)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}
                  title={item.text}
                >
                  {item.text}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {item.timestamp && (
                  <span style={{ fontSize: "0.72rem", color: "var(--text-tertiary, #94a3b8)", whiteSpace: "nowrap" }}>
                    {item.timestamp}
                  </span>
                )}
                <span style={{ fontSize: "0.8rem", color: "var(--app-accent, #e07a38)", opacity: 0.8 }}>
                  Re-test ↗
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .history-item-card:hover {
          background: rgba(224, 122, 56, 0.08) !important;
          border-color: rgba(224, 122, 56, 0.3) !important;
          transform: translateX(2px);
        }
      `}</style>
    </div>
  );
}
