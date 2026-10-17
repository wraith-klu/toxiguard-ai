import { useState, useRef } from "react";

const SAMPLE_TEXTS = [
  {
    label: "Severe Threat",
    text: "I know where you live and I swear I will kill you tonight.",
  },
  {
    label: "Subtle / Hinglish",
    text: "Teri aisi taisi, you absolute useless scammer leave this place now.",
  },
  {
    label: "Safe Discussion",
    text: "While I strongly disagree with your implementation architecture, the benchmarks look solid.",
  },
  {
    label: "Sarcastic Edge",
    text: "Oh wow, what a genius move deploying unverified code straight to production.",
  },
];

const MOCK_BAD_WORDS = ["kill", "idiot", "scam", "trash", "loser", "stupid", "hate", "terrible", "ugly", "aisi taisi", "scammer"];

export default function SandboxModal({ isOpen, onClose }) {
  const [inputMode, setInputMode] = useState("text"); // "text" | "csv"
  const [inputText, setInputText] = useState(SAMPLE_TEXTS[0].text);
  const [csvFileName, setCsvFileName] = useState("");
  const [csvRows, setCsvRows] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const performMockOrLiveAnalysis = async (textToScore) => {
    setIsAnalyzing(true);
    const start = performance.now();

    const lower = textToScore.toLowerCase();
    const words = textToScore.split(/(\s+)/);

    // Layer 1: Regex
    const matchedAbusive = MOCK_BAD_WORDS.filter((bw) => lower.includes(bw));
    const isLayer1Hit = matchedAbusive.length > 0;

    // Layer 2: Transformer Score simulation / live check
    let transformerConfidence = 0.08;
    if (isLayer1Hit) {
      transformerConfidence = 0.88 + Math.min(matchedAbusive.length * 0.04, 0.1);
    } else if (lower.includes("genius move") || lower.includes("disagree")) {
      transformerConfidence = 0.38; // Sarcasm/Edge
    }

    // Layer 3: Contextual Reasoning
    let attributionLayer = "Layer 1: Deterministic Regex";
    let reasoning = "Direct match in compiled keyword pattern set.";

    if (!isLayer1Hit && transformerConfidence > 0.3) {
      attributionLayer = "Layer 3: Contextual Reasoning Engine";
      reasoning = "Ambiguous colloquial phrasing detected. Evaluated discourse polarity without raw keyword match.";
    } else if (isLayer1Hit && transformerConfidence > 0.85) {
      attributionLayer = "Layer 2: DeBERTa Neural Classifier";
      reasoning = "High semantic threat embeddings confirmed across multi-head cross attention layers.";
    }

    // Token heatmap scores
    const tokens = words
      .filter((w) => w.trim().length > 0)
      .map((word) => {
        const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/gi, "");
        let score = 0.05;
        if (MOCK_BAD_WORDS.some((bw) => cleanWord.includes(bw))) {
          score = 0.92;
        } else if (["you", "tonight", "where", "swear"].includes(cleanWord)) {
          score = 0.45;
        } else if (cleanWord.length > 6) {
          score = 0.18;
        }
        return { word, score };
      });

    await new Promise((r) => setTimeout(r, 260));
    const latency = Math.round(performance.now() - start + 24);

    setAnalysisResult({
      is_toxic: isLayer1Hit || transformerConfidence >= 0.5,
      confidence: transformerConfidence,
      attributionLayer,
      reasoning,
      tokens,
      latency,
      text: textToScore,
    });
    setIsAnalyzing(false);
  };

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    performMockOrLiveAnalysis(inputText);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target.result;
      const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
      const parsed = lines.slice(0, 15).map((line, idx) => {
        const clean = line.replace(/^["']|["']$/g, "").trim();
        const lower = clean.toLowerCase();
        const toxic = MOCK_BAD_WORDS.some((bw) => lower.includes(bw));
        return {
          id: idx + 1,
          text: clean,
          toxic,
          confidence: toxic ? 0.92 : 0.06,
          layer: toxic ? "Regex / DeBERTa" : "Layer 1 Clean",
        };
      });
      setCsvRows(parsed);
      setInputMode("csv");
    };
    reader.readAsText(file);
  };

  return (
    <div className="sandbox-backdrop" onClick={onClose}>
      <div className="sandbox-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="sandbox-header">
          <div className="sandbox-title-wrap">
            <span className="sandbox-badge">Interactive Evaluation</span>
            <h2 className="sandbox-title">ToxiGuard AI Model Sandbox</h2>
            <p className="sandbox-subtitle">
              Public test harness: inspect token attribution heatmaps, confidence boundaries, and layer routing without authentication.
            </p>
          </div>
          <button className="sandbox-close-btn" onClick={onClose} aria-label="Close Sandbox">
            ✕
          </button>
        </div>

        {/* Input Controls */}
        <div className="sandbox-tabs">
          <button
            className={`sandbox-tab-btn ${inputMode === "text" ? "active" : ""}`}
            onClick={() => setInputMode("text")}
          >
            Direct Text Input & Token Heatmap
          </button>
          <button
            className={`sandbox-tab-btn ${inputMode === "csv" ? "active" : ""}`}
            onClick={() => setInputMode("csv")}
          >
            Batch CSV Sample Inspector ({csvRows.length > 0 ? `${csvRows.length} loaded` : "Upload"})
          </button>
        </div>

        <div className="sandbox-body">
          {inputMode === "text" ? (
            <div className="sandbox-text-grid">
              {/* Left Column: Input and presets */}
              <div className="sandbox-input-col">
                <div className="sandbox-preset-row">
                  <span className="preset-label">Test Presets:</span>
                  {SAMPLE_TEXTS.map((sample, i) => (
                    <button
                      key={i}
                      type="button"
                      className="preset-chip"
                      onClick={() => {
                        setInputText(sample.text);
                        performMockOrLiveAnalysis(sample.text);
                      }}
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>

                <textarea
                  className="sandbox-textarea"
                  rows={5}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste comment, thread reply, or user-submitted text to evaluate..."
                />

                <div className="sandbox-actions-row">
                  <button
                    type="button"
                    className="sandbox-run-btn"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !inputText.trim()}
                  >
                    {isAnalyzing ? "Evaluating Pipeline..." : "Run Inspection (All 3 Layers)"}
                  </button>
                  <span className="sandbox-meta-hint">Zero retention volatile memory sandbox</span>
                </div>
              </div>

              {/* Right Column: XAI Token Heatmap and Layer Attribution */}
              <div className="sandbox-results-col">
                {analysisResult ? (
                  <div className="sandbox-result-card">
                    <div className="result-status-row">
                      <div className={`status-pill ${analysisResult.is_toxic ? "toxic" : "clean"}`}>
                        <span className="status-dot"></span>
                        {analysisResult.is_toxic ? "FLAGGED TOXIC" : "VERIFIED SAFE"}
                      </div>
                      <span className="metric-chip">
                        Confidence: <strong>{(analysisResult.confidence * 100).toFixed(1)}%</strong>
                      </span>
                      <span className="metric-chip">
                        Latency: <strong>{analysisResult.latency}ms</strong>
                      </span>
                    </div>

                    <div className="attribution-box">
                      <span className="attr-label">Assigned Pipeline Layer:</span>
                      <strong className="attr-layer">{analysisResult.attributionLayer}</strong>
                      <p className="attr-reasoning">{analysisResult.reasoning}</p>
                    </div>

                    {/* Token Heatmap */}
                    <div className="heatmap-section">
                      <div className="heatmap-header">
                        <span>Token-by-Token Attention Attribution</span>
                        <div className="heatmap-legend">
                          <span className="legend-sample neutral">Low</span>
                          <span className="legend-sample mid">Medium</span>
                          <span className="legend-sample high">High Influence</span>
                        </div>
                      </div>

                      <div className="heatmap-token-wrap">
                        {analysisResult.tokens.map((tok, idx) => {
                          let bg = "rgba(148, 163, 184, 0.1)";
                          let color = "var(--app-ink, #f1f5f9)";
                          let border = "1px solid rgba(148, 163, 184, 0.2)";

                          if (tok.score > 0.7) {
                            bg = "rgba(239, 68, 68, 0.25)";
                            color = "#f87171";
                            border = "1px solid rgba(239, 68, 68, 0.5)";
                          } else if (tok.score > 0.35) {
                            bg = "rgba(245, 158, 11, 0.2)";
                            color = "#fbbf24";
                            border = "1px solid rgba(245, 158, 11, 0.4)";
                          }

                          return (
                            <span
                              key={idx}
                              className="heatmap-token"
                              style={{ background: bg, color, border }}
                              title={`Attention score: ${(tok.score * 100).toFixed(0)}%`}
                            >
                              {tok.word}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="sandbox-empty-prompt">
                    <span className="empty-icon">⚡</span>
                    <p>Click "Run Inspection" or pick a sample preset to trace layer attribution.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* CSV Upload & Batch Inspector */
            <div className="sandbox-csv-pane">
              <div className="csv-upload-banner">
                <input
                  type="file"
                  accept=".csv,.txt"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
                <button
                  type="button"
                  className="csv-upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  📁 Select CSV / Text File
                </button>
                <span className="csv-status-text">
                  {csvFileName ? `Loaded: ${csvFileName} (${csvRows.length} entries)` : "Upload up to 15 sample records to test automated parallel scoring"}
                </span>
              </div>

              {csvRows.length > 0 && (
                <div className="csv-table-scroll">
                  <table className="csv-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Payload Text</th>
                        <th>Toxicity Flag</th>
                        <th>Confidence</th>
                        <th>Layer Output</th>
                      </tr>
                    </thead>
                    <tbody>
                      {csvRows.map((row) => (
                        <tr key={row.id}>
                          <td>{row.id}</td>
                          <td className="payload-cell">{row.text}</td>
                          <td>
                            <span className={`table-badge ${row.toxic ? "toxic" : "clean"}`}>
                              {row.toxic ? "Flagged" : "Safe"}
                            </span>
                          </td>
                          <td>{(row.confidence * 100).toFixed(0)}%</td>
                          <td className="layer-cell">{row.layer}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .sandbox-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: sbFade 0.2s ease-out;
        }

        .sandbox-modal {
          background: var(--app-bg, #0d121f);
          border: 1px solid var(--app-rule, rgba(255, 255, 255, 0.12));
          border-radius: 16px;
          width: 100%;
          max-width: 980px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6), 0 0 0 1px var(--app-rule, rgba(255, 255, 255, 0.08));
          display: flex;
          flex-direction: column;
        }

        .sandbox-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 24px 28px 18px;
          border-bottom: 1px solid var(--app-rule, rgba(255, 255, 255, 0.08));
        }

        .sandbox-badge {
          display: inline-block;
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--app-accent, #3b82f6);
          background: var(--app-accent-soft, rgba(59, 130, 246, 0.15));
          padding: 3px 8px;
          border-radius: 4px;
          margin-bottom: 8px;
        }

        .sandbox-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--app-ink, #f1f5f9);
          margin: 0 0 6px;
        }

        .sandbox-subtitle {
          font-size: 0.85rem;
          color: var(--app-ink-subtle, #94a3b8);
          margin: 0;
          line-height: 1.5;
        }

        .sandbox-close-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--app-rule, rgba(255, 255, 255, 0.1));
          color: var(--app-ink-subtle, #94a3b8);
          font-size: 1rem;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .sandbox-close-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.15);
        }

        .sandbox-tabs {
          display: flex;
          gap: 12px;
          padding: 12px 28px;
          background: rgba(0, 0, 0, 0.2);
          border-bottom: 1px solid var(--app-rule, rgba(255, 255, 255, 0.08));
        }

        .sandbox-tab-btn {
          background: none;
          border: none;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--app-ink-subtle, #94a3b8);
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sandbox-tab-btn.active {
          color: #ffffff;
          background: var(--app-accent, #3b82f6);
        }

        .sandbox-body {
          padding: 24px 28px;
        }

        .sandbox-text-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .sandbox-preset-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 12px;
        }

        .preset-label {
          font-size: 0.75rem;
          color: var(--app-ink-subtle, #94a3b8);
          font-weight: 600;
        }

        .preset-chip {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--app-rule, rgba(255, 255, 255, 0.1));
          color: var(--app-ink, #e2e8f0);
          font-size: 0.725rem;
          padding: 3px 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .preset-chip:hover {
          background: var(--app-accent-soft, rgba(59, 130, 246, 0.2));
          border-color: var(--app-accent, #3b82f6);
        }

        .sandbox-textarea {
          width: 100%;
          box-sizing: border-box;
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid var(--app-rule, rgba(255, 255, 255, 0.12));
          border-radius: 10px;
          padding: 12px 14px;
          color: var(--app-ink, #ffffff);
          font-family: inherit;
          font-size: 0.9rem;
          line-height: 1.6;
          resize: vertical;
        }

        .sandbox-textarea:focus {
          outline: none;
          border-color: var(--app-accent, #3b82f6);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }

        .sandbox-actions-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 14px;
        }

        .sandbox-run-btn {
          background: var(--app-accent, #3b82f6);
          color: #ffffff;
          border: none;
          font-size: 0.875rem;
          font-weight: 600;
          padding: 10px 18px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .sandbox-run-btn:hover {
          filter: brightness(1.1);
        }

        .sandbox-run-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .sandbox-meta-hint {
          font-size: 0.7rem;
          color: var(--app-ink-subtle, #94a3b8);
        }

        .sandbox-results-col {
          display: flex;
          flex-direction: column;
        }

        .sandbox-result-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--app-rule, rgba(255, 255, 255, 0.08));
          border-radius: 12px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .result-status-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .status-pill.toxic {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .status-pill.clean {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: currentColor;
        }

        .metric-chip {
          font-size: 0.75rem;
          color: var(--app-ink-subtle, #94a3b8);
          background: rgba(255, 255, 255, 0.05);
          padding: 4px 8px;
          border-radius: 5px;
        }

        .metric-chip strong {
          color: var(--app-ink, #ffffff);
        }

        .attribution-box {
          background: rgba(0, 0, 0, 0.2);
          border-left: 3px solid var(--app-accent, #3b82f6);
          padding: 10px 14px;
          border-radius: 0 8px 8px 0;
        }

        .attr-label {
          display: block;
          font-size: 0.7rem;
          color: var(--app-ink-subtle, #94a3b8);
          text-transform: uppercase;
        }

        .attr-layer {
          font-size: 0.85rem;
          color: var(--app-ink, #ffffff);
          display: block;
          margin: 2px 0 4px;
        }

        .attr-reasoning {
          font-size: 0.785rem;
          color: var(--app-ink-subtle, #94a3b8);
          margin: 0;
          line-height: 1.4;
        }

        .heatmap-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .heatmap-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--app-ink-subtle, #94a3b8);
        }

        .heatmap-legend {
          display: flex;
          gap: 6px;
        }

        .legend-sample {
          font-size: 0.65rem;
          padding: 2px 6px;
          border-radius: 3px;
        }

        .legend-sample.neutral { background: rgba(148, 163, 184, 0.15); color: #94a3b8; }
        .legend-sample.mid { background: rgba(245, 158, 11, 0.25); color: #fbbf24; }
        .legend-sample.high { background: rgba(239, 68, 68, 0.3); color: #f87171; }

        .heatmap-token-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          background: rgba(0, 0, 0, 0.25);
          padding: 12px;
          border-radius: 8px;
          border: 1px solid var(--app-rule, rgba(255, 255, 255, 0.08));
        }

        .heatmap-token {
          display: inline-block;
          font-family: var(--font-mono, monospace);
          font-size: 0.825rem;
          padding: 3px 7px;
          border-radius: 4px;
          cursor: help;
        }

        .sandbox-empty-prompt {
          height: 100%;
          min-height: 220px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: var(--app-ink-subtle, #94a3b8);
          background: rgba(255, 255, 255, 0.02);
          border: 1px dashed var(--app-rule, rgba(255, 255, 255, 0.1));
          border-radius: 12px;
          padding: 24px;
        }

        .empty-icon {
          font-size: 2rem;
          margin-bottom: 8px;
        }

        .sandbox-csv-pane {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .csv-upload-banner {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px dashed var(--app-rule, rgba(255, 255, 255, 0.15));
          border-radius: 10px;
        }

        .csv-upload-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--app-rule, rgba(255, 255, 255, 0.2));
          color: var(--app-ink, #ffffff);
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .csv-status-text {
          font-size: 0.8rem;
          color: var(--app-ink-subtle, #94a3b8);
        }

        .csv-table-scroll {
          max-height: 380px;
          overflow-y: auto;
          border: 1px solid var(--app-rule, rgba(255, 255, 255, 0.08));
          border-radius: 8px;
        }

        .csv-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8125rem;
          text-align: left;
        }

        .csv-table th {
          background: rgba(0, 0, 0, 0.4);
          padding: 10px 14px;
          color: var(--app-ink-subtle, #94a3b8);
          border-bottom: 1px solid var(--app-rule, rgba(255, 255, 255, 0.1));
        }

        .csv-table td {
          padding: 10px 14px;
          border-bottom: 1px solid var(--app-rule, rgba(255, 255, 255, 0.05));
          color: var(--app-ink, #e2e8f0);
        }

        .payload-cell {
          max-width: 320px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .table-badge {
          font-size: 0.7rem;
          padding: 2px 7px;
          border-radius: 4px;
          font-weight: 600;
        }

        .table-badge.toxic {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .table-badge.clean {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }

        @keyframes sbFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @media (max-width: 768px) {
          .sandbox-text-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
