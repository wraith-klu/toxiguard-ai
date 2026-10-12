import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./InstallExtension.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

export default function InstallExtension() {
  const navigate = useNavigate();

  const installationSteps = [
    { n: "1", text: "Download the extension ZIP archive containing the manifest and compiled scripts." },
    { n: "2", text: "Extract the downloaded ZIP archive into a dedicated local directory on your machine." },
    { n: "3", text: <>Ensure your <a href={BACKEND_URL} target="_blank" rel="noopener noreferrer">FastAPI backend instance</a> is running locally or hosted on an accessible domain.</> },
    { n: "4", text: <>Open Google Chrome (or any Chromium browser) and enter <code>chrome://extensions</code> into the address bar.</> },
    { n: "5", text: <>Toggle <strong>Developer mode</strong> in the upper right corner of the Extensions dashboard.</> },
    { n: "6", text: <>Click <strong>Load unpacked</strong> and select the directory where you extracted the extension files.</> },
    { n: "7", text: "Verify the ToxiGuard shield icon appears in your browser toolbar." },
  ];

  const usageSteps = [
    { n: "1", text: "Select the ToxiGuard icon in the browser toolbar to open the control panel." },
    { n: "2", text: "Enter your registered API key or toggle the guest demonstration mode." },
    { n: "3", text: "Confirm the real-time filter toggle is set to Active." },
    { n: "4", text: "Navigate to Instagram or supported web forum comment sections." },
    { n: "5", text: "ToxiGuard scans dynamic feed items and visually masks comments that trigger moderation thresholds." },
    { n: "6", text: "Use the View Original button on any masked comment to inspect the underlying text." },
  ];

  return (
    <div className="install-page">
      <Header />

      <main className="install-main-container">
        {/* Header / Hero */}
        <header className="install-header">
          <span className="category-pill">Browser Extension</span>
          <h1 className="install-title">Install the ToxiGuard Extension</h1>
          <p className="install-lead">
            Client-side content safety for Chromium-based browsers. Evaluates dynamic comment
            threads in real time with zero server storage of viewed social pages.
          </p>

          <div className="install-cta-group">
            <a href="/extension.zip" download className="btn-primary">
              Download Extension Package (.zip)
            </a>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/dashboard")}
            >
              Open API Dashboard
            </button>
          </div>
          <p className="install-compatibility">
            Tested on Google Chrome, Brave, Arc, Microsoft Edge, and Chromium 114+
          </p>
        </header>

        {/* Installation Instructions */}
        <section className="install-section">
          <div className="section-title-wrap">
            <h2 className="install-section-title">Developer Mode Setup</h2>
            <p className="install-section-desc">
              Follow these seven steps to load the unpacked extension in your browser:
            </p>
          </div>

          <div className="install-step-list">
            {installationSteps.map((step) => (
              <div key={step.n} className="install-step-row">
                <span className="step-counter">{step.n}</span>
                <div className="step-content">
                  <p>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Verification and Operation */}
        <section className="install-section">
          <div className="section-title-wrap">
            <h2 className="install-section-title">Operational Workflow</h2>
            <p className="install-section-desc">
              How the extension interacts with active discussion threads:
            </p>
          </div>

          <div className="install-step-list">
            {usageSteps.map((step) => (
              <div key={step.n} className="install-step-row">
                <span className="step-counter">{step.n}</span>
                <div className="step-content">
                  <p>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy & Architecture Card */}
        <section className="install-note-card">
          <h3 className="note-card-title">Privacy and Security Guarantees</h3>
          <p className="note-card-text">
            The extension analyzes comment DOM nodes via MutationObservers only while activated.
            Account passwords, private direct messages, authentication cookies, and browsing histories
            are never intercepted, read, or transmitted to moderation servers.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="tg-logo-icon">◆</span>
            <span>ToxiGuard AI</span>
          </div>
          <div className="footer-links">
            <a href="/">Overview</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
          <div className="footer-copy">
            © {new Date().getFullYear()} ToxiGuard AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}