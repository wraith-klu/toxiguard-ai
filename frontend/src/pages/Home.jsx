import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import LiveDemo from "../components/LiveDemo";
import "./Home.css";

const ARCH_LAYERS = [
  {
    step: "01",
    layer: "Deterministic Rule Engine",
    detail: "Sub-millisecond regex filters, obfuscation normalization (leet-speak and symbol replacements), and keyword severity sets.",
    latency: "< 2ms",
  },
  {
    step: "02",
    layer: "Transformer Neural Classifier",
    detail: "Fine-tuned DeBERTa-v3 model compiled to ONNX runtime. Classifies threat, insult, identity attack, and profanity probabilities.",
    latency: "35ms",
  },
  {
    step: "03",
    layer: "Contextual LLM Verification",
    detail: "Targeted reasoning on edge classifications to evaluate conversational sarcasm, regional context, and non-literal expressions.",
    latency: "Edge Fallback",
  },
];

const CODE_EXAMPLES = {
  javascript: {
    raw: `// JavaScript / Node.js
const response = await fetch("https://api.toxiguard.ai/v1/analyze", {
  method: "POST",
  headers: {
    "Authorization": "Bearer tg_live_YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    text: "Review submission candidate text",
    languages: ["en", "hi", "hinglish"],
  }),
});

const result = await response.json();
// { is_toxic: false, confidence: 0.96, category: "safe" }`,
    highlighted: (
      <>
        <span className="syn-comment">// JavaScript / Node.js</span>
        {"\n"}
        <span className="syn-keyword">const</span> <span className="syn-def">response</span> = <span className="syn-keyword">await</span> <span className="syn-func">fetch</span>(<span className="syn-string">"https://api.toxiguard.ai/v1/analyze"</span>, {"{"}
        {"\n  "}<span className="syn-prop">method</span>: <span className="syn-string">"POST"</span>,
        {"\n  "}<span className="syn-prop">headers</span>: {"{"}
        {"\n    "}<span className="syn-string">"Authorization"</span>: <span className="syn-string">"Bearer tg_live_YOUR_API_KEY"</span>,
        {"\n    "}<span className="syn-string">"Content-Type"</span>: <span className="syn-string">"application/json"</span>,
        {"\n  "}{"}"},
        {"\n  "}<span className="syn-prop">body</span>: <span className="syn-built">JSON</span>.<span className="syn-func">stringify</span>({"{"}
        {"\n    "}<span className="syn-prop">text</span>: <span className="syn-string">"Review submission candidate text"</span>,
        {"\n    "}<span className="syn-prop">languages</span>: [<span className="syn-string">"en"</span>, <span className="syn-string">"hi"</span>, <span className="syn-string">"hinglish"</span>],
        {"\n  "}{"}"}),
        {"\n"}{"}"});
        {"\n\n"}
        <span className="syn-keyword">const</span> <span className="syn-def">result</span> = <span className="syn-keyword">await</span> <span className="syn-def">response</span>.<span className="syn-func">json</span>();
        {"\n"}
        <span className="syn-comment">// {"{ is_toxic: false, confidence: 0.96, category: \"safe\" }"}</span>
      </>
    ),
  },
  python: {
    raw: `# Python / Requests
import requests

response = requests.post(
    "https://api.toxiguard.ai/v1/analyze",
    headers={"Authorization": "Bearer tg_live_YOUR_API_KEY"},
    json={
        "text": "Review submission candidate text",
        "languages": ["en", "hi", "hinglish"],
    },
    timeout=5.0,
)

data = response.json()
# {"is_toxic": False, "confidence": 0.96, "category": "safe"}`,
    highlighted: (
      <>
        <span className="syn-comment"># Python / Requests</span>
        {"\n"}
        <span className="syn-keyword">import</span> <span className="syn-def">requests</span>
        {"\n\n"}
        <span className="syn-def">response</span> = <span className="syn-def">requests</span>.<span className="syn-func">post</span>(
        {"\n    "}<span className="syn-string">"https://api.toxiguard.ai/v1/analyze"</span>,
        {"\n    "}<span className="syn-prop">headers</span>={"{"}<span className="syn-string">"Authorization"</span>: <span className="syn-string">"Bearer tg_live_YOUR_API_KEY"</span>{"}"},
        {"\n    "}<span className="syn-prop">json</span>={"{"}
        {"\n        "}<span className="syn-string">"text"</span>: <span className="syn-string">"Review submission candidate text"</span>,
        {"\n        "}<span className="syn-string">"languages"</span>: [<span className="syn-string">"en"</span>, <span className="syn-string">"hi"</span>, <span className="syn-string">"hinglish"</span>],
        {"\n    "}{"}"},
        {"\n    "}<span className="syn-prop">timeout</span>=<span className="syn-num">5.0</span>,
        {"\n"})
        {"\n\n"}
        <span className="syn-def">data</span> = <span className="syn-def">response</span>.<span className="syn-func">json</span>()
        {"\n"}
        <span className="syn-comment"># {"{\"is_toxic\": False, \"confidence\": 0.96, \"category\": \"safe\"}"}</span>
      </>
    ),
  },
  curl: {
    raw: `curl -X POST https://api.toxiguard.ai/v1/analyze \\
  -H "Authorization: Bearer tg_live_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Review submission candidate text",
    "languages": ["en", "hi", "hinglish"]
  }'`,
    highlighted: (
      <>
        <span className="syn-func">curl</span> <span className="syn-prop">-X POST</span> <span className="syn-string">https://api.toxiguard.ai/v1/analyze</span> \
        {"\n  "}<span className="syn-prop">-H</span> <span className="syn-string">"Authorization: Bearer tg_live_YOUR_API_KEY"</span> \
        {"\n  "}<span className="syn-prop">-H</span> <span className="syn-string">"Content-Type: application/json"</span> \
        {"\n  "}<span className="syn-prop">-d</span> <span className="syn-string">'{`{
    "text": "Review submission candidate text",
    "languages": ["en", "hi", "hinglish"]
  }`}'</span>
      </>
    ),
  },
};

const FREQUENT_QUESTIONS = [
  {
    q: "How does the hybrid pipeline maintain sub-50ms latency under high load?",
    a: "Layer 1 regex rules execute in memory in under 2ms. The ONNX-compiled transformer model processes batch classifications on dedicated inference runtimes in approximately 35ms. Contextual LLM reasoning only triggers on ambiguous edge cases, keeping median API latency well under 50ms.",
  },
  {
    q: "What data retention policy applies to customer API payloads?",
    a: "ToxiGuard operates under a strict volatile memory evaluation policy. Submitted text fragments are scored in RAM and immediately discarded once confidence classifications and flags are returned. No raw input text is persisted on disk or used to retrain neural model weights.",
  },
  {
    q: "How does the Chrome extension handle dynamic single-page web applications?",
    a: "The extension listens to feed node mutations using standard MutationObserver APIs. When new comments enter the visible DOM, it evaluates the strings and injects a non-destructive CSS mask with a manual reveal button, without modifying platform server requests or reading authentication cookies.",
  },
  {
    q: "Can thresholds be calibrated for specific community standards?",
    a: "Yes. The API response provides granular probability distributions across severe toxicity, identity attacks, insults, profanity, and threat categories. Platform operators can enforce distinct threshold boundaries per category based on their specific community guidelines.",
  },
];

export default function Home() {
  const [activeLang, setActiveLang] = useState("javascript");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_EXAMPLES[activeLang].raw).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const toggleFaq = (idx) => {
    setOpenFaq((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="home-page">
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-copy-column">
            <span className="category-pill">Production Safety Engine</span>

            <h1 className="hero-heading">
              Hybrid content moderation<br />
              engineered for real&#8209;time applications.
            </h1>

            <p className="hero-lead">
              ToxiGuard combines deterministic rule filtering, fine-tuned transformer classification,
              and contextual reasoning into an API and browser extension. Flag toxic abuse, harassment,
              and coordinated spam before public distribution.
            </p>

            <div className="hero-action-group">
              <Link to="/signup" className="btn-primary">
                Deploy Free Account
              </Link>
              <Link to="/install" className="btn-secondary">
                Extension Setup
              </Link>
            </div>

            <div className="hero-tech-strip">
              <span className="tech-item">FastAPI Core</span>
              <span className="tech-separator">/</span>
              <span className="tech-item">DeBERTa-v3</span>
              <span className="tech-separator">/</span>
              <span className="tech-item">ONNX Edge Runtime</span>
              <span className="tech-separator">/</span>
              <span className="tech-item">Zero Retention</span>
            </div>
          </div>

          <div className="hero-product-column">
            <div className="product-visual-wrapper">
              <div className="visual-header-label">
                <span>Working Demonstration · Interactive Feed Simulation</span>
              </div>
              <LiveDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Pipeline Section */}
      <section className="pipeline-section">
        <div className="section-container">
          <div className="section-header-block">
            <span className="category-pill">Multi-Stage Pipeline</span>
            <h2 className="section-title">Three-Layer Verification Architecture</h2>
            <p className="section-summary">
              Every analyzed string evaluates through cascading filters to maintain sub-50ms latency
              while limiting false positives across ambiguous text.
            </p>
          </div>

          <div className="pipeline-grid">
            {ARCH_LAYERS.map((layer) => (
              <div key={layer.step} className="pipeline-card">
                <div className="card-top-row">
                  <span className="pipeline-step-badge">{layer.step}</span>
                  <span className="pipeline-latency">{layer.latency}</span>
                </div>
                <h3 className="pipeline-card-title">{layer.layer}</h3>
                <p className="pipeline-card-desc">{layer.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer API Integration Section */}
      <section className="developer-section">
        <div className="section-container">
          <div className="developer-layout">
            <div className="developer-text-column">
              <span className="category-pill">Developer Integration</span>
              <h2 className="section-title">Direct REST API Integration</h2>
              <p className="section-summary">
                Send plain text payloads directly from API gateways, ingestion webhooks,
                or serverless microservices. Receive deterministic classification tags,
                calibrated scores, and layer attribution flags.
              </p>
              <div className="integration-specs">
                <div className="spec-row">
                  <span className="spec-name">Protocol</span>
                  <span className="spec-val">HTTPS / JSON REST API</span>
                </div>
                <div className="spec-row">
                  <span className="spec-name">Authentication</span>
                  <span className="spec-val">Bearer Token (API Key)</span>
                </div>
                <div className="spec-row">
                  <span className="spec-name">Languages Supported</span>
                  <span className="spec-val">English, Hindi, Hinglish</span>
                </div>
              </div>
            </div>

            <div className="developer-code-column">
              <div className="code-block-card">
                <div className="code-block-header">
                  <div className="code-tabs">
                    <button
                      type="button"
                      className={`code-tab-btn ${activeLang === "javascript" ? "active" : ""}`}
                      onClick={() => setActiveLang("javascript")}
                    >
                      JavaScript
                    </button>
                    <button
                      type="button"
                      className={`code-tab-btn ${activeLang === "python" ? "active" : ""}`}
                      onClick={() => setActiveLang("python")}
                    >
                      Python
                    </button>
                    <button
                      type="button"
                      className={`code-tab-btn ${activeLang === "curl" ? "active" : ""}`}
                      onClick={() => setActiveLang("curl")}
                    >
                      cURL
                    </button>
                  </div>
                  <button
                    type="button"
                    className="code-copy-btn"
                    onClick={handleCopyCode}
                  >
                    {copied ? "Copied" : "Copy Snippet"}
                  </button>
                </div>
                <pre className="code-body">
                  <code>{CODE_EXAMPLES[activeLang].highlighted}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Extension Workflow Section */}
      <section className="extension-showcase-section">
        <div className="section-container">
          <div className="extension-split-layout">
            <div className="extension-copy-column">
              <span className="category-pill">Browser Extension</span>
              <h2 className="section-title">Client-Side Filtering in Chrome</h2>
              <p className="section-summary">
                The companion browser extension attaches to Instagram and web discussion feeds via
                DOM MutationObservers. It automatically masks abusive comments with a manual reveal toggle,
                preserving normal user interactions without modifying remote platform data.
              </p>
              <div className="extension-action-row">
                <Link to="/install" className="btn-primary">
                  Download Extension Package
                </Link>
                <Link to="/dashboard" className="btn-secondary">
                  Open Monitoring Console
                </Link>
              </div>
            </div>

            <div className="extension-preview-column">
              <div className="preview-card">
                <div className="preview-card-header">
                  <span className="preview-title">Extension Security Principles</span>
                </div>
                <div className="preview-card-body">
                  <div className="principle-item">
                    <h4>No Password or Cookie Interception</h4>
                    <p>The unpacked extension script accesses only the designated target comment nodes on page render.</p>
                  </div>
                  <div className="principle-item">
                    <h4>In-Memory Evaluation</h4>
                    <p>Evaluated strings are passed to client runtime listeners and discarded once visual masks apply.</p>
                  </div>
                  <div className="principle-item">
                    <h4>Local Operator Control</h4>
                    <p>Operators can adjust sensitivity thresholds and toggle filters on or off at any moment.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Technical Explanations Section */}
      <section className="faq-editorial-section">
        <div className="section-container">
          <div className="section-header-block">
            <span className="category-pill">Engineering Questions</span>
            <h2 className="section-title">Technical Specifications & Operations</h2>
            <p className="section-summary">
              Direct technical explanations addressing latency, pipeline architecture, and privacy enforcement.
            </p>
          </div>

          <div className="faq-accordion-list">
            {FREQUENT_QUESTIONS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className={`faq-entry-card ${isOpen ? "open" : ""}`}>
                  <button
                    type="button"
                    className="faq-question-trigger"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question-text">{item.q}</span>
                    <span className="faq-plus-icon">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && (
                    <div className="faq-answer-block">
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Action Strip */}
      <section className="action-strip-section">
        <div className="section-container">
          <div className="action-strip-card">
            <h2 className="action-strip-title">Deploy automated safety to your discussion channels.</h2>
            <p className="action-strip-desc">
              Create an account to generate API tokens or load the unpacked extension to verify local performance.
            </p>
            <div className="action-strip-buttons">
              <Link to="/signup" className="btn-primary">
                Create Free Account
              </Link>
              <Link to="/install" className="btn-secondary">
                Read Setup Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="tg-logo-icon">◆</span>
            <span>ToxiGuard AI</span>
          </div>
          <div className="footer-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/install">Extension</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <a
              href="https://github.com/wraith-klu/ToxiGuard-AI"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Repository
            </a>
          </div>
          <div className="footer-copy">
            © {new Date().getFullYear()} ToxiGuard AI. Silicon precision meets editorial craftsmanship.
          </div>
        </div>
      </footer>
    </div>
  );
}