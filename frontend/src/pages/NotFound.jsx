import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-card">
        <span className="notfound-code">404</span>
        <h1 className="notfound-title">Page not found</h1>
        <p className="notfound-desc">
          The requested resource does not exist or has been relocated to another endpoint.
        </p>
        <Link to="/" className="btn-secondary">
          ← Return to Overview
        </Link>
      </div>

      <style>{`
        .notfound-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--app-bg);
          color: var(--app-ink);
          padding: 24px;
        }

        .notfound-card {
          max-width: 440px;
          text-align: center;
          background: var(--app-surface);
          border: 1px solid var(--app-rule);
          border-radius: var(--radius-md);
          padding: 48px 32px;
          box-shadow: var(--app-shadow-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .notfound-code {
          font-family: var(--font-mono);
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1;
          color: var(--app-accent);
          margin-bottom: 12px;
        }

        .notfound-title {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          margin: 0 0 10px;
          color: var(--app-ink);
        }

        .notfound-desc {
          font-family: var(--font-sans);
          font-size: 0.875rem;
          line-height: 1.55;
          color: var(--app-ink-subtle);
          margin: 0 0 24px;
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          padding: 10px 18px;
          background: var(--app-bg);
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
