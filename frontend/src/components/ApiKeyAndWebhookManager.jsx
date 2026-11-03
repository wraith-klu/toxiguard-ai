import { useState, useEffect } from "react";
import { useToast } from "./Toast";

const INITIAL_KEYS = [
  {
    id: "key_live_01",
    name: "Production Gateway Key",
    scope: "moderation-write",
    prefix: "tg_live_prod_9f2a",
    created: "2026-10-10",
    lastUsed: "Just now",
    status: "active",
  },
  {
    id: "key_ro_02",
    name: "Analytics & Telemetry Exporter",
    scope: "read-only",
    prefix: "tg_ro_metric_4c1e",
    created: "2026-10-12",
    lastUsed: "12 mins ago",
    status: "active",
  },
];

export default function ApiKeyAndWebhookManager() {
  const toast = useToast();
  const [keys, setKeys] = useState(() => {
    const saved = localStorage.getItem("tg_scoped_api_keys");
    return saved ? JSON.parse(saved) : INITIAL_KEYS;
  });

  // Modal / Form state for new key
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyScope, setNewKeyScope] = useState("moderation-write");
  const [newlyCreatedKey, setNewlyCreatedKey] = useState(null);

  // Webhook state
  const [webhookUrl, setWebhookUrl] = useState("https://api.myplatform.com/webhooks/toxiguard");
  const [webhookSecret, setWebhookSecret] = useState("whsec_99bf270c18d45e02");
  const [webhookEvents, setWebhookEvents] = useState({
    "comment.toxic_flagged": true,
    "user.threat_level_escalated": true,
    "system.rate_limit_warning": false,
  });
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchLog, setDispatchLog] = useState([]);

  useEffect(() => {
    localStorage.setItem("tg_scoped_api_keys", JSON.stringify(keys));
  }, [keys]);

  const handleCreateKey = (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      toast.show("Please provide a name for this key", "error");
      return;
    }

    const randomSuffix = Math.random().toString(36).substring(2, 10);
    const scopePrefix =
      newKeyScope === "read-only"
        ? "tg_ro_"
        : newKeyScope === "analytics"
        ? "tg_an_"
        : "tg_live_";
    const fullKey = `${scopePrefix}${randomSuffix}_${Date.now().toString(36)}`;
    const maskedPrefix = `${scopePrefix}${randomSuffix.substring(0, 4)}••••`;

    const newKeyObj = {
      id: `key_${Date.now()}`,
      name: newKeyName.trim(),
      scope: newKeyScope,
      prefix: maskedPrefix,
      created: new Date().toISOString().split("T")[0],
      lastUsed: "Never",
      status: "active",
    };

    setKeys([newKeyObj, ...keys]);
    setNewlyCreatedKey(fullKey);
    setNewKeyName("");
    toast.show("New scoped API key generated successfully", "success");
  };

  const handleRevokeKey = (id) => {
    setKeys(keys.filter((k) => k.id !== id));
    toast.show("API key revoked", "info");
  };

  const copyToClipboard = (text, label = "Key") => {
    navigator.clipboard.writeText(text);
    toast.show(`${label} copied to clipboard!`, "success");
  };

  const handleSimulateWebhook = async () => {
    if (!webhookUrl.trim() || !webhookUrl.startsWith("http")) {
      toast.show("Please enter a valid HTTP/HTTPS webhook endpoint", "error");
      return;
    }

    setIsDispatching(true);
    const start = performance.now();

    const samplePayload = {
      event: "comment.toxic_flagged",
      timestamp: new Date().toISOString(),
      data: {
        comment_id: `cmt_${Math.random().toString(36).substring(2, 8)}`,
        user: "flagged_commenter_42",
        confidence: 0.94,
        category: "Severe Toxicity",
        trigger_layer: "Layer 2: DeBERTa ONNX",
        text_masked: "I swear I will *** you tonight",
      },
      signature: `sha256=${Math.random().toString(16).substring(2, 34)}`,
    };

    // Simulate webhook dispatch delay
    await new Promise((r) => setTimeout(r, 650));
    const latency = Math.round(performance.now() - start);

    const logEntry = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      url: webhookUrl,
      event: samplePayload.event,
      statusCode: 200,
      latencyMs: latency,
      payload: samplePayload,
    };

    setDispatchLog([logEntry, ...dispatchLog.slice(0, 9)]);
    setIsDispatching(false);
    toast.show(`Simulated webhook delivered to ${webhookUrl} (200 OK, ${latency}ms)`, "success");
  };

  return (
    <div className="mgr-container animate-fade-in">
      {/* ================= API KEY SECTION ================= */}
      <div className="glass mgr-card">
        <div className="mgr-card-header">
          <div>
            <h3 className="mgr-card-title">Scoped API Keys</h3>
            <p className="mgr-card-subtitle">
              Issue scoped tokens for microservices, front-end SDKs, and ingest webhooks.
            </p>
          </div>
          <span className="mgr-badge">{keys.length} Active Tokens</span>
        </div>

        {/* Create Key Form */}
        <form onSubmit={handleCreateKey} className="mgr-key-form">
          <input
            type="text"
            className="mgr-input"
            placeholder="Key Label (e.g. Ingestion Bot, Analytics Pipeline)"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
          />

          <select
            className="mgr-select"
            value={newKeyScope}
            onChange={(e) => setNewKeyScope(e.target.value)}
          >
            <option value="moderation-write">Write: Full Moderation & Batch</option>
            <option value="read-only">Read-Only: Analytics & Feeds</option>
            <option value="analytics">Telemetry & Drift Monitoring Only</option>
          </select>

          <button type="submit" className="primary-btn mgr-generate-btn">
            + Generate Scoped Key
          </button>
        </form>

        {/* Once-only key reveal alert */}
        {newlyCreatedKey && (
          <div className="mgr-alert-banner">
            <div className="mgr-alert-content">
              <strong>Save your secret key now!</strong>
              <span className="mgr-secret-key-text">{newlyCreatedKey}</span>
            </div>
            <div className="mgr-alert-actions">
              <button
                type="button"
                className="mgr-copy-btn"
                onClick={() => copyToClipboard(newlyCreatedKey, "API Key")}
              >
                Copy Key
              </button>
              <button
                type="button"
                className="mgr-dismiss-btn"
                onClick={() => setNewlyCreatedKey(null)}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Keys Table */}
        <div className="mgr-table-wrapper">
          <table className="mgr-table">
            <thead>
              <tr>
                <th>Label</th>
                <th>Scope</th>
                <th>Token Prefix</th>
                <th>Created</th>
                <th>Last Activity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.id}>
                  <td className="mgr-cell-strong">{k.name}</td>
                  <td>
                    <span className={`mgr-scope-tag ${k.scope}`}>{k.scope}</span>
                  </td>
                  <td className="mgr-mono">{k.prefix}</td>
                  <td>{k.created}</td>
                  <td>{k.lastUsed}</td>
                  <td>
                    <button
                      type="button"
                      className="mgr-revoke-btn"
                      onClick={() => handleRevokeKey(k.id)}
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= WEBHOOK TESTER SECTION ================= */}
      <div className="glass mgr-card" style={{ marginTop: "24px" }}>
        <div className="mgr-card-header">
          <div>
            <h3 className="mgr-card-title">Live Webhook Simulator & Endpoint Tester</h3>
            <p className="mgr-card-subtitle">
              Verify your server's payload ingestion, HMAC signature verification, and latency response.
            </p>
          </div>
          <span className="mgr-badge-purple">HMAC SHA-256</span>
        </div>

        <div className="mgr-webhook-form">
          <div className="mgr-form-row">
            <label className="mgr-label">Destination Webhook URL</label>
            <input
              type="url"
              className="mgr-input"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-domain.com/webhooks/toxiguard"
            />
          </div>

          <div className="mgr-form-row">
            <label className="mgr-label">Signing Secret</label>
            <div className="mgr-secret-row">
              <input
                type="text"
                readOnly
                className="mgr-input mgr-mono"
                value={webhookSecret}
              />
              <button
                type="button"
                className="mgr-copy-btn"
                onClick={() => copyToClipboard(webhookSecret, "Webhook Secret")}
              >
                Copy Secret
              </button>
            </div>
          </div>

          <div className="mgr-form-row">
            <label className="mgr-label">Subscribed Events</label>
            <div className="mgr-events-checkboxes">
              {Object.keys(webhookEvents).map((evt) => (
                <label key={evt} className="mgr-event-check">
                  <input
                    type="checkbox"
                    checked={webhookEvents[evt]}
                    onChange={(e) =>
                      setWebhookEvents({ ...webhookEvents, [evt]: e.target.checked })
                    }
                  />
                  <span>{evt}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="primary-btn mgr-dispatch-btn"
            onClick={handleSimulateWebhook}
            disabled={isDispatching}
          >
            {isDispatching ? "Dispatching HTTP POST..." : "⚡ Send Test Webhook Event"}
          </button>
        </div>

        {/* Dispatch Log Stream */}
        {dispatchLog.length > 0 && (
          <div className="mgr-log-section">
            <h4 className="mgr-log-title">Recent Webhook Deliveries</h4>
            <div className="mgr-log-list">
              {dispatchLog.map((log) => (
                <div key={log.id} className="mgr-log-card">
                  <div className="mgr-log-meta">
                    <span className="mgr-log-status">200 OK</span>
                    <span className="mgr-log-event">{log.event}</span>
                    <span className="mgr-log-time">{log.time} · {log.latencyMs}ms</span>
                  </div>
                  <pre className="mgr-log-payload">
                    {JSON.stringify(log.payload, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .mgr-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .mgr-card {
          background: var(--app-surface) !important;
          border: 1px solid var(--app-rule) !important;
          border-radius: var(--radius-lg, 16px) !important;
          box-shadow: var(--app-shadow-md) !important;
          padding: 28px !important;
          transform: none !important;
        }

        .mgr-card:hover {
          transform: none !important;
          box-shadow: var(--app-shadow-md) !important;
        }

        .mgr-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--app-rule);
          padding-bottom: 16px;
          gap: 16px;
        }

        .mgr-card-title {
          font-family: var(--font-serif, "DM Serif Display", serif);
          font-size: 1.35rem;
          color: var(--app-ink, #f8fafc);
          margin: 0 0 6px;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .mgr-card-subtitle {
          font-family: var(--font-sans);
          font-size: 0.875rem;
          color: var(--app-ink-subtle, #94a3b8);
          margin: 0;
          line-height: 1.45;
        }

        .mgr-badge {
          font-size: 0.75rem;
          background: var(--app-accent-soft);
          color: var(--app-accent);
          border: 1px solid var(--app-accent);
          padding: 4px 12px;
          border-radius: var(--radius-full, 999px);
          font-weight: 600;
          white-space: nowrap;
          letter-spacing: 0.02em;
        }

        .mgr-badge-purple {
          font-size: 0.75rem;
          background: rgba(168, 85, 247, 0.12);
          color: #7c3aed;
          border: 1px solid rgba(168, 85, 247, 0.3);
          padding: 4px 12px;
          border-radius: var(--radius-full, 999px);
          font-weight: 600;
          white-space: nowrap;
          letter-spacing: 0.02em;
        }

        [data-theme="dark"] .mgr-badge-purple {
          color: #c084fc;
          border-color: rgba(168, 85, 247, 0.4);
        }

        .mgr-key-form {
          display: grid;
          grid-template-columns: 2fr 1.5fr auto;
          gap: 12px;
          margin-bottom: 24px;
        }

        .mgr-input, .mgr-select {
          background: var(--app-bg, #080c16);
          border: 1px solid var(--app-rule, rgba(255, 255, 255, 0.12));
          color: var(--app-ink, #f8fafc);
          border-radius: var(--radius-sm, 8px);
          padding: 11px 16px;
          font-family: var(--font-sans);
          font-size: 0.875rem;
          outline: none;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }

        .mgr-input::placeholder {
          color: var(--app-ink-subtle, #94a3b8);
          opacity: 0.7;
        }

        .mgr-input:focus, .mgr-select:focus {
          border-color: var(--app-accent, #e07a38);
          box-shadow: 0 0 0 3px var(--app-accent-soft);
        }

        .mgr-select {
          cursor: pointer;
        }

        .mgr-select option {
          background: var(--app-surface, #111726);
          color: var(--app-ink, #f8fafc);
        }

        .mgr-generate-btn {
          white-space: nowrap;
          padding: 11px 22px;
          background: var(--app-accent, #e07a38);
          color: #ffffff;
          font-weight: 600;
          border: none;
          border-radius: var(--radius-sm, 8px);
          cursor: pointer;
          transition: background var(--transition-fast), transform var(--transition-fast);
        }

        .mgr-generate-btn:hover {
          background: var(--app-accent-hover, #ea8b4e);
          transform: translateY(-1px);
        }

        .mgr-alert-banner {
          background: var(--color-warn-soft, rgba(245, 158, 11, 0.12));
          border: 1px solid var(--color-warn-border, rgba(245, 158, 11, 0.3));
          padding: 16px 20px;
          border-radius: var(--radius-md, 12px);
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .mgr-alert-content {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.875rem;
          color: var(--color-warn, #b45309);
        }

        .mgr-secret-key-text {
          font-family: var(--font-mono, monospace);
          font-size: 0.85rem;
          background: var(--app-bg, #080c16);
          border: 1px dashed var(--app-rule);
          padding: 6px 10px;
          border-radius: 6px;
          color: var(--app-ink, #f8fafc);
          user-select: all;
          display: inline-block;
        }

        .mgr-alert-actions {
          display: flex;
          gap: 10px;
        }

        .mgr-copy-btn {
          background: var(--app-surface);
          border: 1px solid var(--app-rule);
          color: var(--app-ink);
          border-radius: var(--radius-sm, 6px);
          padding: 8px 14px;
          font-size: 0.825rem;
          font-weight: 600;
          cursor: pointer;
          transition: background var(--transition-fast), border-color var(--transition-fast);
        }

        .mgr-copy-btn:hover {
          background: var(--app-surface-hover);
          border-color: var(--app-accent);
          color: var(--app-accent);
        }

        .mgr-dismiss-btn {
          background: transparent;
          border: 1px solid transparent;
          color: var(--app-ink-subtle);
          font-size: 0.825rem;
          font-weight: 500;
          padding: 8px 12px;
          cursor: pointer;
          transition: color var(--transition-fast);
        }

        .mgr-dismiss-btn:hover {
          color: var(--app-ink);
        }

        .mgr-table-wrapper {
          overflow-x: auto;
          border: 1px solid var(--app-rule);
          border-radius: var(--radius-md, 12px);
          background: var(--app-surface);
        }

        .mgr-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.875rem;
        }

        .mgr-table th {
          padding: 12px 18px;
          background: var(--app-bg);
          color: var(--app-ink-subtle);
          border-bottom: 1px solid var(--app-rule);
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .mgr-table td {
          padding: 14px 18px;
          border-bottom: 1px solid var(--app-rule);
          color: var(--app-ink-muted);
          vertical-align: middle;
        }

        .mgr-table tbody tr {
          transition: background var(--transition-fast);
        }

        .mgr-table tbody tr:hover {
          background: var(--app-surface-hover);
        }

        .mgr-table tbody tr:last-child td {
          border-bottom: none;
        }

        .mgr-cell-strong {
          color: var(--app-ink, #f8fafc) !important;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .mgr-mono {
          font-family: var(--font-mono, monospace);
          font-size: 0.825rem;
          background: var(--app-bg);
          border: 1px solid var(--app-rule);
          padding: 3px 8px;
          border-radius: 4px;
          color: var(--app-ink-muted);
        }

        .mgr-scope-tag {
          font-size: 0.75rem;
          padding: 3px 10px;
          border-radius: var(--radius-full, 999px);
          font-weight: 600;
          display: inline-block;
        }

        .mgr-scope-tag.moderation-write {
          background: var(--color-success-soft);
          color: var(--color-success);
          border: 1px solid var(--color-success-border);
        }

        .mgr-scope-tag.read-only {
          background: var(--color-info-soft);
          color: var(--color-info);
          border: 1px solid var(--color-info-border);
        }

        .mgr-scope-tag.analytics {
          background: rgba(168, 85, 247, 0.12);
          color: #7c3aed;
          border: 1px solid rgba(168, 85, 247, 0.25);
        }

        [data-theme="dark"] .mgr-scope-tag.analytics {
          color: #c084fc;
          border-color: rgba(168, 85, 247, 0.4);
        }

        .mgr-revoke-btn {
          background: var(--color-danger-soft);
          border: 1px solid var(--color-danger-border);
          color: var(--color-danger);
          padding: 5px 12px;
          border-radius: var(--radius-sm, 6px);
          font-size: 0.775rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mgr-revoke-btn:hover {
          background: var(--color-danger);
          color: #ffffff;
        }

        .mgr-webhook-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
          max-width: 680px;
        }

        .mgr-form-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mgr-label {
          font-size: 0.85rem;
          color: var(--app-ink);
          font-weight: 600;
        }

        .mgr-secret-row {
          display: flex;
          gap: 10px;
        }

        .mgr-secret-row .mgr-input {
          flex: 1;
        }

        .mgr-events-checkboxes {
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: var(--app-bg);
          border: 1px solid var(--app-rule);
          padding: 14px 18px;
          border-radius: var(--radius-sm, 8px);
        }

        .mgr-event-check {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.875rem;
          color: var(--app-ink);
          cursor: pointer;
          font-weight: 500;
        }

        .mgr-event-check input[type="checkbox"] {
          accent-color: var(--app-accent);
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .mgr-dispatch-btn {
          align-self: flex-start;
          margin-top: 8px;
          background: var(--app-accent);
          color: #ffffff;
          font-weight: 600;
          padding: 11px 22px;
          border: none;
          border-radius: var(--radius-sm, 8px);
          cursor: pointer;
          transition: background var(--transition-fast), transform var(--transition-fast);
        }

        .mgr-dispatch-btn:hover:not(:disabled) {
          background: var(--app-accent-hover);
          transform: translateY(-1px);
        }

        .mgr-dispatch-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .mgr-log-section {
          margin-top: 28px;
          border-top: 1px solid var(--app-rule);
          padding-top: 20px;
        }

        .mgr-log-title {
          font-family: var(--font-serif, "DM Serif Display", serif);
          font-size: 1.15rem;
          color: var(--app-ink);
          margin: 0 0 14px;
          font-weight: 700;
        }

        .mgr-log-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .mgr-log-card {
          background: var(--app-bg);
          border: 1px solid var(--app-rule);
          border-radius: var(--radius-sm, 8px);
          padding: 14px 18px;
        }

        .mgr-log-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
          font-size: 0.825rem;
        }

        .mgr-log-status {
          background: var(--color-success-soft);
          color: var(--color-success);
          border: 1px solid var(--color-success-border);
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 700;
          font-size: 0.75rem;
        }

        .mgr-log-event {
          color: var(--app-ink);
          font-weight: 600;
        }

        .mgr-log-time {
          color: var(--app-ink-subtle);
          margin-left: auto;
          font-size: 0.8rem;
        }

        .mgr-log-payload {
          margin: 0;
          font-size: 0.8rem;
          background: var(--app-surface);
          border: 1px solid var(--app-rule);
          padding: 12px 14px;
          border-radius: var(--radius-sm, 6px);
          color: var(--app-ink-muted);
          max-height: 180px;
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .mgr-key-form {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
