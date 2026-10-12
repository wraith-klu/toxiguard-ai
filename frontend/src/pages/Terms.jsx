import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function TermsOfService() {
  return (
    <div className="legal-page">
      <Header />

      <main className="legal-container">
        <header className="legal-header">
          <span className="category-pill">Legal Documentation</span>
          <h1 className="legal-title">Terms of Service</h1>
          <p className="legal-meta">
            Effective Date: October 12, 2026 · Last Updated: October 12, 2026 · Version: 2.4.0
          </p>
        </header>

        <article className="legal-content">
          <section className="legal-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              These Terms of Service govern your access to and use of ToxiGuard AI web applications, REST/WebSocket APIs,
              and browser companion extensions. By creating an account, generating API credentials, or issuing programmatic
              requests to our servers, you agree to be bound by these Terms. If accessing on behalf of an entity, you confirm
              legal authorization to bind that organization.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Permitted Use and Acceptable Practices</h2>
            <p>
              ToxiGuard AI provides automated text classification infrastructure for developers, digital community operators,
              and content publishing workflows. You agree to use the service in compliance with all relevant laws:
            </p>
            <ul>
              <li>
                <strong>Legitimate Moderation:</strong> You may integrate our API into forums, social feeds, comment sections,
                and internal chat tools to flag, mask, or quarantine abusive, harassing, or dangerous text.
              </li>
              <li>
                <strong>No Adversarial Probing:</strong> You may not systematically query the endpoints to extract model boundaries
                for the purpose of engineering circumvention tools or creating abusive content generators.
              </li>
              <li>
                <strong>No Service Disruption:</strong> You must not execute denial-of-service traffic, flood pipelines with
                malicious payloads, or probe endpoints for unauthenticated vulnerabilities.
              </li>
              <li>
                <strong>Rate Limit Integrity:</strong> Programmatic requests must adhere to published concurrency limits. You may not
                spin up redundant accounts to bypass API key rate restrictions.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Account Registration and Key Security</h2>
            <p>
              Operators are responsible for maintaining the strict confidentiality of their API keys. Any activity originating from
              your credentials will be attributed to your account. If you suspect an API key has leaked, revoke and regenerate it
              immediately through the Dashboard.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Intellectual Property Rights</h2>
            <p>
              ToxiGuard retains all ownership, copyright, and patent rights in the moderation platform, model pipelines, and software.
              You retain full, exclusive ownership of any original text payloads submitted for analysis. By transmitting text, you grant
              ToxiGuard only the ephemeral, temporary right to process the string in RAM for the fraction of a second required to return scores.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Service Levels and Accuracy Disclaimer</h2>
            <p>
              Automated classification systems rely on neural embeddings, heuristics, and statistical inference:
            </p>
            <ul>
              <li>
                <strong>Algorithmic Output:</strong> Scores, categories, and confidence levels represent statistical evaluations,
                not formal legal assessments of speech or intent.
              </li>
              <li>
                <strong>No Absolute Guarantee:</strong> While our multi-layer pipeline achieves high precision on benchmark datasets,
                we do not warrant that all harmful content will be intercepted or that non-abusive content will never be flagged.
              </li>
              <li>
                <strong>Human Oversight Recommended:</strong> For high-stakes decisions (such as permanent account bans or legal disclosures),
                operators are advised to maintain human-in-the-loop appeal workflows.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. Browser Extension Usage and Third-Party Sites</h2>
            <p>
              The ToxiGuard Chrome Extension interacts with client-side DOM structures on third-party web platforms. You acknowledge that:
            </p>
            <ul>
              <li>Third-party platform layouts may change, which may temporarily degrade comment detection until script updates are loaded.</li>
              <li>You remain solely responsible for complying with the Terms of Use of any third-party website on which you run the extension.</li>
              <li>The extension operates strictly locally without writing remote data back to third-party databases.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, ToxiGuard AI and its contributors shall not be liable for any indirect,
              incidental, consequential, or punitive damages resulting from the use or inability to use the moderation service,
              including lost revenues, community disruption, or errors in automated classification results.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Service Modifications and Quota Adjustments</h2>
            <p>
              We reserve the right to update API schemas, introduce new model versions, or adjust free-tier query allocations
              with reasonable advance notice. Continued use of the service following such changes constitutes agreement to the updated terms.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Termination and Account Suspension</h2>
            <p>
              We may immediately terminate or suspend access to API keys without prior notice if we identify severe violations of
              Section 2 (including denial-of-service attempts, fraudulent credentials, or automated attack traffic).
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Governing Contact and Disputes</h2>
            <p>
              For legal inquiries, enterprise licensing terms, or dispute resolutions, contact our legal counsel team at:
            </p>
            <p>
              <code>legal@toxiguard.ai</code> · ToxiGuard AI Safety Systems · Open Source Moderation Core
            </p>
          </section>
        </article>

        <div className="legal-back-nav">
          <Link to="/" className="btn-secondary">
            ← Return to Overview
          </Link>
          <Link to="/privacy" className="btn-secondary">
            Read Privacy Policy →
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
