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
        }

        .mgr-card {
          padding: 24px;
          border-radius: var(--radius-lg, 16px);
        }

        .mgr-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding-bottom: 14px;
        }

        .mgr-card-title {
          font-size: 1.15rem;
          color: var(--text-primary, #ffffff);
          margin: 0 0 4px;
          font-weight: 700;
        }

        .mgr-card-subtitle {
          font-size: 0.825rem;
          color: var(--text-tertiary, #94a3b8);
          margin: 0;
        }

        .mgr-badge {
          font-size: 0.725rem;
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.3);
          padding: 4px 10px;
          border-radius: 6px;
          font-weight: 600;
        }

        .mgr-badge-purple {
          font-size: 0.725rem;
          background: rgba(168, 85, 247, 0.15);
          color: #c084fc;
          border: 1px solid rgba(168, 85, 247, 0.3);
          padding: 4px 10px;
          border-radius: 6px;
          font-weight: 600;
        }

        .mgr-key-form {
          display: grid;
          grid-template-columns: 2fr 1.5fr auto;
          gap: 12px;
          margin-bottom: 20px;
        }

        .mgr-input, .mgr-select {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-primary, #ffffff);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 0.875rem;
          outline: none;
        }

        .mgr-input:focus, .mgr-select:focus {
          border-color: #3b82f6;
        }

        .mgr-select option {
          background: #0f172a;
          color: #ffffff;
        }

        .mgr-generate-btn {
          white-space: nowrap;
          padding: 10px 18px;
        }

        .mgr-alert-banner {
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.3);
          padding: 14px 18px;
          border-radius: 10px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .mgr-alert-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 0.85rem;
          color: #fbbf24;
        }

        .mgr-secret-key-text {
          font-family: monospace;
          background: rgba(0, 0, 0, 0.4);
          padding: 4px 8px;
          border-radius: 4px;
          color: #ffffff;
          user-select: all;
        }

        .mgr-alert-actions {
          display: flex;
          gap: 8px;
        }

        .mgr-copy-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 0.8rem;
          cursor: pointer;
        }

        .mgr-copy-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .mgr-dismiss-btn {
          background: transparent;
          border: none;
          color: var(--text-tertiary, #94a3b8);
          font-size: 0.8rem;
          cursor: pointer;
        }

        .mgr-table-wrapper {
          overflow-x: auto;
        }

        .mgr-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.85rem;
        }

        .mgr-table th {
          padding: 10px 14px;
          color: var(--text-tertiary, #94a3b8);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          font-weight: 600;
        }

        .mgr-table td {
          padding: 12px 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          color: var(--text-secondary, #cbd5e1);
        }

        .mgr-cell-strong {
          color: var(--text-primary, #ffffff);
          font-weight: 600;
        }

        .mgr-mono {
          font-family: monospace;
        }

        .mgr-scope-tag {
          font-size: 0.725rem;
          padding: 3px 8px;
          border-radius: 4px;
          font-weight: 600;
        }

        .mgr-scope-tag.moderation-write {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }

        .mgr-scope-tag.read-only {
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
        }

        .mgr-scope-tag.analytics {
          background: rgba(168, 85, 247, 0.15);
          color: #c084fc;
        }

        .mgr-revoke-btn {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.775rem;
          cursor: pointer;
        }

        .mgr-revoke-btn:hover {
          background: rgba(239, 68, 68, 0.25);
        }

        .mgr-webhook-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 640px;
        }

        .mgr-form-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .mgr-label {
          font-size: 0.8rem;
          color: var(--text-tertiary, #94a3b8);
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
          gap: 8px;
          background: rgba(0, 0, 0, 0.2);
          padding: 12px;
          border-radius: 8px;
        }

        .mgr-event-check {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
          color: var(--text-primary, #ffffff);
          cursor: pointer;
        }

        .mgr-dispatch-btn {
          align-self: flex-start;
          margin-top: 6px;
        }

        .mgr-log-section {
          margin-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 16px;
        }

        .mgr-log-title {
          font-size: 0.95rem;
          color: var(--text-primary, #ffffff);
          margin: 0 0 12px;
        }

        .mgr-log-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mgr-log-card {
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 12px;
        }

        .mgr-log-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
          font-size: 0.8rem;
        }

        .mgr-log-status {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 700;
        }

        .mgr-log-event {
          color: var(--text-primary, #ffffff);
          font-weight: 600;
        }

        .mgr-log-time {
          color: var(--text-tertiary, #94a3b8);
          margin-left: auto;
        }

        .mgr-log-payload {
          margin: 0;
          font-size: 0.75rem;
          background: rgba(0, 0, 0, 0.4);
          padding: 10px;
          border-radius: 6px;
          color: #94a3b8;
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
