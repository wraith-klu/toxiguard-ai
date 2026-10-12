import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <Header />

      <main className="legal-container">
        <header className="legal-header">
          <span className="category-pill">Legal Documentation</span>
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-meta">
            Effective Date: October 12, 2026 · Last Updated: October 12, 2026 · Version: 2.4.0
          </p>
        </header>

        <article className="legal-content">
          <section className="legal-section">
            <h2>1. Overview and Operational Scope</h2>
            <p>
              ToxiGuard AI provides automated text classification and content moderation infrastructure via RESTful APIs,
              WebSocket endpoints, and a browser companion extension. This Privacy Policy outlines our precise technical
              data practices regarding content submitted for analysis and personal account information.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Moderation Payloads and In-Memory Processing</h2>
            <p>
              When client software issues moderation queries to our analysis endpoints:
            </p>
            <ul>
              <li>
                <strong>Volatile Memory Only:</strong> Incoming text strings are loaded into volatile RAM, evaluated across
                deterministic regex filters, neural transformer embeddings, and contextual reasoning layers, and immediately discarded.
              </li>
              <li>
                <strong>Zero Disk Retention:</strong> We do not write, log, or persist the raw text content of moderation queries to disk,
                relational databases, or object storage.
              </li>
              <li>
                <strong>No Model Retraining:</strong> Customer payload strings are never utilized to train, retrain, or calibrate
                public or proprietary machine learning weights.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Information We Collect and Process</h2>
            <p>
              We collect only the minimum operational data required to provide authentication and manage API quota allocations:
            </p>
            <ul>
              <li>
                <strong>Account Credentials:</strong> Email addresses and cryptographically hashed passwords using salted Argon2/PBKDF2.
              </li>
              <li>
                <strong>API Keys and Identity:</strong> Unique pseudorandom tokens generated to authorize access and prevent rate abuse.
              </li>
              <li>
                <strong>Aggregated Telemetry:</strong> Numerical metrics including request timestamps, response latencies, HTTP status codes,
                and high-level toxicity category flags. None of these records contain the underlying textual content analyzed.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Browser Companion Extension Practices</h2>
            <p>
              The ToxiGuard Chrome Extension operates on a local-first architecture:
            </p>
            <ul>
              <li>
                <strong>Active DOM Inspection:</strong> The extension script executes MutationObservers solely within user-authorized web pages
                (such as social platform discussion feeds) to detect newly rendered comment elements.
              </li>
              <li>
                <strong>No Cookie or Credential Extraction:</strong> The extension does not read, intercept, or transmit user session tokens,
                passwords, private direct messages, or unrelated tab navigation histories.
              </li>
              <li>
                <strong>Local Masking:</strong> Flagged comments are visually masked through local CSS modification. The original text remains
                accessible to the user via the local Reveal toggle.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Data Security Measures</h2>
            <p>
              All communication between client applications and ToxiGuard endpoints is encrypted in transit using Transport Layer Security
              (TLS 1.3). Access to backend production nodes requires multi-factor authentication, key-based SSH, and network-isolated VPC policies.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Third-Party Compute and Subprocessors</h2>
            <p>
              ToxiGuard hosts its primary inference infrastructure on enterprise cloud providers with SOC 2 Type II certifications.
              When optional external LLM reasoning layers are activated, requests are routed exclusively through commercial API endpoints
              with enterprise zero-data-retention agreements explicitly enabled.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Data Subject Rights (GDPR and CCPA)</h2>
            <p>
              Under applicable data protection frameworks including GDPR (EU) and CCPA/CPRA (California), registered account holders have the right to:
            </p>
            <ul>
              <li>Request an export of their account credentials and aggregated usage logs.</li>
              <li>Request the complete deletion of their registered user account and associated API keys.</li>
              <li>Object to or restrict the processing of account-level telemetry.</li>
            </ul>
            <p>
              Because raw text moderation payloads are never stored, we maintain no records linking individual submitted text samples to specific user identities.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Data Retention Periods</h2>
            <p>
              Account credentials remain active until an account is closed or deleted by the user. Aggregated telemetry counters (e.g., total calls per day)
              are retained for a rolling 90-day window for system capacity planning and then purged.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Policy Updates</h2>
            <p>
              We may revise this Privacy Policy to reflect architectural adjustments or regulatory requirements. Material changes will be communicated
              via email notice to registered operators and highlighted in the dashboard 14 days prior to implementation.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Contact and Data Protection Officer</h2>
            <p>
              For privacy inquiries, data deletion requests, or regulatory audits, contact our compliance engineering team at:
            </p>
            <p>
              <code>privacy@toxiguard.ai</code> · ToxiGuard AI Safety Systems · Open Source Moderation Core
            </p>
          </section>
        </article>

        <div className="legal-back-nav">
          <Link to="/" className="btn-secondary">
            ← Return to Overview
          </Link>
          <Link to="/terms" className="btn-secondary">
            Read Terms of Service →
          </Link>
        </div>
      </main>

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

      <style>{`
        .legal-page {
          min-height: 100vh;
          background: var(--app-bg);
          color: var(--app-ink);
          display: flex;
          flex-direction: column;
        }

        .legal-container {
          max-width: 820px;
          margin: 0 auto;
          padding: 60px max(1.25rem, 4vw) 80px;
          flex: 1;
          width: 100%;
        }

        .legal-header {
          border-bottom: 1px solid var(--app-rule);
          padding-bottom: 32px;
          margin-bottom: 40px;
        }

        .category-pill {
          display: inline-block;
          font-family: var(--font-sans);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--app-accent);
          background: var(--app-accent-soft);
          padding: 4px 10px;
          border-radius: var(--radius-xs);
          margin-bottom: 16px;
        }

        .legal-title {
          font-family: var(--font-serif);
          font-size: clamp(2.2rem, 4.2vw, 3rem);
          line-height: 1.15;
          letter-spacing: -0.025em;
          margin: 0 0 12px;
          color: var(--app-ink);
        }

        .legal-meta {
          font-family: var(--font-mono);
          font-size: 0.8125rem;
          color: var(--app-ink-subtle);
          margin: 0;
        }

        .legal-content {
          display: flex;
          flex-direction: column;
          gap: 36px;
          line-height: 1.7;
          font-size: 0.98rem;
          color: var(--app-ink-muted);
        }

        .legal-section h2 {
          font-family: var(--font-sans);
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--app-ink);
          letter-spacing: -0.015em;
          margin: 0 0 14px;
        }

        .legal-section p {
          margin: 0 0 12px;
        }

        .legal-section ul {
          margin: 10px 0 14px 20px;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .legal-section li {
          line-height: 1.6;
        }

        .legal-section strong {
          color: var(--app-ink);
        }

        .legal-section code {
          font-family: var(--font-mono);
          background: var(--app-surface);
          border: 1px solid var(--app-rule);
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.85em;
          color: var(--app-ink);
        }

        .legal-back-nav {
          margin-top: 56px;
          padding-top: 32px;
          border-top: 1px solid var(--app-rule);
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          padding: 10px 18px;
          background: var(--app-surface);
          border: 1px solid var(--app-rule);
          border-radius: 7px;
          color: var(--app-ink);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: background var(--transition-fast), border-color var(--transition-fast);
        }

        .btn-secondary:hover {
          background: var(--app-surface-hover);
          border-color: var(--app-accent);
        }
      `}</style>
    </div>
  );
}
