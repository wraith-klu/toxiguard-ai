import { useState, useRef, useEffect } from "react";

const MOCK_BAD_WORDS = ["idiot", "stupid", "dumb", "hate", "kill", "ugly", "scam", "trash", "loser"];

const BENCHMARK_FEED_ITEMS = [
  { id: 1, user: "sarah_tech", text: "Release candidate v2.4 benchmarks look solid across all endpoints.", toxic: false, category: "Verified Safe" },
  { id: 2, user: "commenter_88", text: "You are an absolute idiot for deploying this framework.", toxic: true, category: "Targeted Insult" },
  { id: 3, user: "dev_architect", text: "Documentation links and ONNX runtime weights verified on GitHub.", toxic: false, category: "Verified Safe" },
  { id: 4, user: "bot_harasser", text: "I hate this group of people, they should leave the platform.", toxic: true, category: "Identity Attack" },
  { id: 5, user: "security_lead", text: "Latency tests show 48ms median on containerized inference.", toxic: false, category: "Verified Safe" },
];

export default function LiveDemo() {
  const [extensionActive, setExtensionActive] = useState(true);
  const [comments, setComments] = useState(BENCHMARK_FEED_ITEMS);
  const [newCommentText, setNewCommentText] = useState("");
  const [revealedComments, setRevealedComments] = useState({});
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      setCurrentTime(`${hours}:${minutes} ${ampm}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const text = newCommentText.trim();
    const lower = text.toLowerCase();
    const isToxic = MOCK_BAD_WORDS.some((w) => lower.includes(w)) || lower.includes("kill") || lower.includes("hate");

    let category = "Verified Safe";
    if (isToxic) {
      if (lower.includes("kill")) category = "Severe Threat";
      else if (lower.includes("hate")) category = "Identity Attack";
      else category = "Targeted Insult";
    }

    const newComment = {
      id: Date.now(),
      user: "operator_guest",
      text,
      toxic: isToxic,
      category,
    };

    setComments((prev) => [...prev, newComment]);
    setNewCommentText("");
  };

  const toggleRevealComment = (id) => {
    setRevealedComments((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="demo-device-frame">
      {/* Device Telemetry Header */}
      <div className="demo-device-header">
        <span className="demo-clock">{currentTime || "10:35 AM"}</span>
        <div className="demo-signal-group">
          <span className="demo-badge-indicator">LIVE FEED SIMULATOR</span>
        </div>
      </div>

      {/* Control Strip */}
      <div className="demo-filter-strip">
        <div className="demo-filter-status">
          <span className={`status-pill ${extensionActive ? "on" : "off"}`} />
          <div className="status-label-group">
            <span className="status-title">ToxiGuard Filter Active</span>
            <span className="status-desc">
              {extensionActive ? "Masking toxic classifications" : "Showing unfiltered raw stream"}
            </span>
          </div>
        </div>
        <button
          type="button"
          className="demo-toggle-btn"
          onClick={() => setExtensionActive(!extensionActive)}
          aria-label="Toggle live moderation filter"
        >
          {extensionActive ? "Disable Filter" : "Enable Filter"}
        </button>
      </div>

      {/* Social Post Benchmark */}
      <div className="demo-post-card">
        <div className="demo-post-author">
          <div className="author-glyph">TG</div>
          <div>
            <div className="author-line">
              <span className="author-name">ToxiGuard Core</span>
              <span className="author-handle">@toxiguard_ai</span>
            </div>
            <span className="author-sub">Inference Pipeline v3.2</span>
          </div>
        </div>
        <p className="demo-post-body">
          ONNX-compiled DeBERTa-v3 weights running locally. Evaluate live comments in the stream below to verify sub-second redaction.
        </p>
      </div>

      {/* Moderation Stream List */}
      <div className="demo-stream-container">
        {comments.map((item) => {
          const isMasked = extensionActive && item.toxic && !revealedComments[item.id];
          return (
            <div key={item.id} className={`demo-item-card ${item.toxic ? "is-flagged" : ""}`}>
              <div className="demo-item-header">
                <span className="demo-user">@{item.user}</span>
                {item.toxic ? (
                  <span className="category-pill-danger">{item.category}</span>
                ) : (
                  <span className="category-pill-safe">{item.category}</span>
                )}
              </div>

              {isMasked ? (
                <div className="masked-state-box">
                  <span className="masked-notice">Text hidden by ToxiGuard filter</span>
                  <button
                    type="button"
                    className="action-link-btn"
                    onClick={() => toggleRevealComment(item.id)}
                  >
                    View Original
                  </button>
                </div>
              ) : (
                <div className="revealed-state-box">
                  <p className="demo-item-text">{item.text}</p>
                  {extensionActive && item.toxic && revealedComments[item.id] && (
                    <button
                      type="button"
                      className="action-link-btn"
                      onClick={() => toggleRevealComment(item.id)}
                    >
                      Hide Text
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Input Row for Interactive Testing */}
      <form onSubmit={handleAddComment} className="demo-input-bar">
        <input
          type="text"
          placeholder="Test sample string (e.g. 'idiot', 'great project')..."
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          className="demo-text-field"
        />
        <button
          type="submit"
          className="demo-submit-btn"
          disabled={!newCommentText.trim()}
        >
          Send
        </button>
      </form>

      <style>{`
        .demo-device-frame {
          background: var(--app-surface);
          border: 1px solid var(--app-rule);
          border-radius: var(--radius-lg);
          box-shadow: var(--app-shadow-lg);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          max-height: 580px;
          text-align: left;
        }

        .demo-device-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-bottom: 1px solid var(--app-rule);
          background: var(--app-bg);
        }

        .demo-clock {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--app-ink-subtle);
        }

        .demo-badge-indicator {
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          color: var(--app-accent);
          letter-spacing: 0.08em;
          font-weight: 600;
        }

        .demo-filter-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          border-bottom: 1px solid var(--app-rule);
          background: var(--app-surface);
          gap: 12px;
        }

        .demo-filter-status {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-pill {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .status-pill.on {
          background: var(--color-success);
          box-shadow: 0 0 0 3px var(--color-success-soft);
        }

        .status-pill.off {
          background: var(--app-ink-subtle);
        }

        .status-label-group {
          display: flex;
          flex-direction: column;
        }

        .status-title {
          font-family: var(--font-sans);
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--app-ink);
        }

        .status-desc {
          font-size: 0.6875rem;
          color: var(--app-ink-subtle);
        }

        .demo-toggle-btn {
          font-family: var(--font-sans);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: var(--radius-xs);
          background: var(--app-bg);
          border: 1px solid var(--app-rule);
          color: var(--app-ink);
          cursor: pointer;
          transition: border-color var(--transition-fast), background var(--transition-fast);
        }

        .demo-toggle-btn:hover {
          border-color: var(--app-accent);
          background: var(--app-surface-hover);
        }

        .demo-post-card {
          padding: 14px;
          border-bottom: 1px solid var(--app-rule);
          background: var(--app-surface);
        }

        .demo-post-author {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .author-glyph {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: var(--app-accent-soft);
          color: var(--app-accent);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .author-line {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .author-name {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--app-ink);
        }

        .author-handle {
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          color: var(--app-ink-subtle);
        }

        .author-sub {
          display: block;
          font-size: 0.6875rem;
          color: var(--app-ink-subtle);
        }

        .demo-post-body {
          font-size: 0.8125rem;
          line-height: 1.5;
          color: var(--app-ink-muted);
          margin: 0;
        }

        .demo-stream-container {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: var(--app-bg);
        }

        .demo-item-card {
          padding: 10px 12px;
          border-radius: 8px;
          background: var(--app-surface);
          border: 1px solid var(--app-rule);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .demo-item-card.is-flagged {
          border-color: var(--color-danger-border);
        }

        .demo-item-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .demo-user {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--app-ink-subtle);
        }

        .category-pill-danger {
          font-family: var(--font-mono);
          font-size: 0.625rem;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--color-danger);
          background: var(--color-danger-soft);
          border: 1px solid var(--color-danger-border);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .category-pill-safe {
          font-family: var(--font-mono);
          font-size: 0.625rem;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--color-success);
          background: var(--color-success-soft);
          border: 1px solid var(--color-success-border);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .masked-state-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--color-danger-soft);
          border: 1px dashed var(--color-danger-border);
          padding: 6px 10px;
          border-radius: 6px;
        }

        .masked-notice {
          font-size: 0.75rem;
          color: var(--color-danger);
        }

        .revealed-state-box {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .demo-item-text {
          font-size: 0.8125rem;
          line-height: 1.45;
          color: var(--app-ink);
          margin: 0;
        }

        .action-link-btn {
          font-family: var(--font-sans);
          font-size: 0.6875rem;
          color: var(--app-accent);
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
          align-self: flex-start;
        }

        .demo-input-bar {
          display: flex;
          gap: 8px;
          padding: 10px 12px;
          border-top: 1px solid var(--app-rule);
          background: var(--app-surface);
        }

        .demo-text-field {
          flex: 1;
          background: var(--app-bg);
          border: 1px solid var(--app-rule);
          border-radius: 7px;
          color: var(--app-ink);
          font-family: var(--font-sans);
          font-size: 0.8125rem;
          padding: 8px 12px;
        }

        .demo-text-field:focus {
          outline: none;
          border-color: var(--app-accent);
          box-shadow: 0 0 0 3px var(--app-accent-soft);
        }

        .demo-submit-btn {
          background: var(--app-accent);
          color: #ffffff;
          border: 1px solid transparent;
          border-radius: 7px;
          font-size: 0.8125rem;
          font-weight: 600;
          padding: 8px 14px;
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .demo-submit-btn:hover:not(:disabled) {
          background: var(--app-accent-hover);
        }

        .demo-submit-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
