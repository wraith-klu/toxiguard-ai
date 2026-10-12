import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Header({ onLogout, isDashboard = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const apiKey = localStorage.getItem("api_key");
  const email = localStorage.getItem("user_email") || (apiKey ? "user@toxiguard.ai" : null);

  const isActive = (path) => location.pathname === path;

  const navLinks = isDashboard
    ? []
    : [
      { path: "/", label: "Overview" },
      { path: "/install", label: "Extension" },
      { path: "/privacy", label: "Privacy" },
      { path: "/terms", label: "Terms" },
    ];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getUsernameFromEmail = (emailStr) => {
    if (!emailStr) return "";
    const prefix = emailStr.split("@")[0];
    return prefix
      .split(/[\._-]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  
  const userName = email ? getUsernameFromEmail(email) : "";

  const handleDropdownLogout = () => {
    setDropdownOpen(false);
    localStorage.removeItem("api_key");
    localStorage.removeItem("token");
    localStorage.removeItem("user_email");
    if (onLogout) {
      onLogout();
    } else {
      navigate("/login");
    }
  };

  const getInitials = (emailStr) => {
    if (!emailStr) return "TG";
    const name = emailStr.split("@")[0];
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="tg-header">
      <div className="tg-header-inner">
        {/* Brand Wordmark */}
        <Link to="/" className="tg-brand-link">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--app-accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="tg-brand-shield"
            aria-hidden="true"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span className="tg-brand-title">ToxiGuard</span>
          <span className="tg-brand-pill">AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="tg-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`tg-nav-link ${isActive(link.path) ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Header Right Actions */}
        <div className="tg-header-actions">
          <ThemeToggle />

          {apiKey ? (
            <div className="tg-user-dropdown-container" ref={dropdownRef}>
              <button
                type="button"
                className="tg-user-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
              >
                <div className="tg-avatar-badge">{getInitials(email)}</div>
                <div className="tg-user-meta">
                  <span className="tg-user-name">{userName}</span>
                  <span className="tg-user-email">{email}</span>
                </div>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className={`tg-arrow-icon ${dropdownOpen ? "open" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="tg-dropdown-card">
                  <div className="tg-dropdown-header">
                    <strong>{userName}</strong>
                    <span>{email}</span>
                  </div>
                  <hr className="tg-dropdown-rule" />
                  <Link
                    to="/dashboard"
                    className="tg-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/install"
                    className="tg-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Extension Setup
                  </Link>
                  <hr className="tg-dropdown-rule" />
                  <button
                    type="button"
                    className="tg-dropdown-item tg-dropdown-logout"
                    onClick={handleDropdownLogout}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="tg-auth-actions">
              <Link to="/login" className="tg-btn-ghost">
                Sign In
              </Link>
              <Link to="/signup" className="tg-btn-primary">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="tg-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className={`tg-hamburger-bar ${mobileOpen ? "open" : ""}`} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="tg-mobile-drawer">
          <div className="tg-mobile-theme-row">
            <span>Interface Mode</span>
            <ThemeToggle />
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="tg-mobile-nav-link"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {apiKey ? (
            <div className="tg-mobile-auth-section">
              <Link
                to="/dashboard"
                className="tg-mobile-nav-link"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
              <button
                type="button"
                className="tg-mobile-nav-link tg-logout-link"
                onClick={() => {
                  setMobileOpen(false);
                  handleDropdownLogout();
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="tg-mobile-auth-section">
              <Link
                to="/login"
                className="tg-mobile-nav-link"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="tg-btn-primary tg-mobile-cta"
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        .tg-header {
          position: sticky;
          top: 0;
          height: 60px;
          background: var(--app-bg);
          border-bottom: 1px solid var(--app-rule);
          z-index: 100;
        }

        .tg-header-inner {
          max-width: 1120px;
          margin: 0 auto;
          height: 100%;
          padding: 0 max(1.25rem, 4vw);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .tg-brand-link {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: var(--app-ink);
        }

        .tg-brand-shield {
          flex-shrink: 0;
        }

        .tg-brand-title {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--app-ink);
        }

        .tg-brand-pill {
          font-family: var(--font-sans);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--app-accent);
          background: var(--app-accent-soft);
          padding: 2px 6px;
          border-radius: var(--radius-xs);
        }

        .tg-nav {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .tg-nav-link {
          font-family: var(--font-sans);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--app-ink-subtle);
          text-decoration: none;
          padding: 6px 12px;
          border-radius: 6px;
          transition: color var(--transition-fast), background var(--transition-fast);
        }

        .tg-nav-link:hover {
          color: var(--app-ink);
          background: var(--app-surface);
        }

        .tg-nav-link.active {
          color: var(--app-ink);
          font-weight: 600;
        }

        .tg-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .tg-auth-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tg-btn-ghost {
          font-family: var(--font-sans);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--app-ink);
          text-decoration: none;
          padding: 7px 14px;
          border-radius: 7px;
          border: 1px solid transparent;
          transition: background var(--transition-fast), border-color var(--transition-fast);
        }

        .tg-btn-ghost:hover {
          background: var(--app-surface);
          border-color: var(--app-rule);
        }

        .tg-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-sans);
          font-size: 0.875rem;
          font-weight: 600;
          color: #ffffff;
          background: var(--app-accent);
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 7px;
          border: 1px solid transparent;
          cursor: pointer;
          transition: background var(--transition-fast), transform var(--transition-fast);
        }

        .tg-btn-primary:hover {
          background: var(--app-accent-hover);
        }

        .tg-btn-primary:active {
          transform: scale(0.98);
        }

        .tg-user-trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--app-surface);
          border: 1px solid var(--app-rule);
          border-radius: 7px;
          padding: 4px 10px 4px 6px;
          cursor: pointer;
          color: var(--app-ink);
          transition: background var(--transition-fast), border-color var(--transition-fast);
        }

        .tg-user-trigger:hover {
          background: var(--app-surface-hover);
          border-color: var(--app-accent);
        }

        .tg-avatar-badge {
          width: 26px;
          height: 26px;
          border-radius: 5px;
          background: var(--app-accent-soft);
          color: var(--app-accent);
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tg-user-meta {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .tg-user-name {
          font-size: 0.75rem;
          font-weight: 600;
          line-height: 1.2;
          color: var(--app-ink);
        }

        .tg-user-email {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--app-ink-subtle);
          max-width: 100px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tg-arrow-icon {
          color: var(--app-ink-subtle);
          transition: transform var(--transition-fast);
        }

        .tg-arrow-icon.open {
          transform: rotate(180deg);
        }

        .tg-dropdown-card {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 210px;
          background: var(--app-surface);
          border: 1px solid var(--app-rule);
          border-radius: var(--radius-md);
          box-shadow: var(--app-shadow-lg);
          padding: 8px;
          z-index: 1000;
        }

        .tg-dropdown-header {
          padding: 6px 8px;
          display: flex;
          flex-direction: column;
        }

        .tg-dropdown-header strong {
          font-size: 0.8125rem;
          color: var(--app-ink);
        }

        .tg-dropdown-header span {
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          color: var(--app-ink-subtle);
          word-break: break-all;
        }

        .tg-dropdown-rule {
          border: none;
          border-top: 1px solid var(--app-rule);
          margin: 6px 0;
        }

        .tg-dropdown-item {
          display: block;
          width: 100%;
          padding: 7px 8px;
          border-radius: 5px;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--app-ink-muted);
          text-decoration: none;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: background var(--transition-fast), color var(--transition-fast);
        }

        .tg-dropdown-item:hover {
          background: var(--app-surface-hover);
          color: var(--app-ink);
        }

        .tg-dropdown-logout {
          color: var(--color-danger);
        }

        .tg-dropdown-logout:hover {
          background: var(--color-danger-soft);
          color: var(--color-danger);
        }

        .tg-mobile-toggle {
          display: none;
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
        }

        .tg-hamburger-bar {
          display: block;
          width: 20px;
          height: 2px;
          background: var(--app-ink);
          position: relative;
          transition: all 0.2s ease;
        }

        .tg-hamburger-bar::before,
        .tg-hamburger-bar::after {
          content: "";
          position: absolute;
          width: 20px;
          height: 2px;
          background: var(--app-ink);
          transition: all 0.2s ease;
        }

        .tg-hamburger-bar::before { top: -6px; }
        .tg-hamburger-bar::after { top: 6px; }

        .tg-hamburger-bar.open { background: transparent; }
        .tg-hamburger-bar.open::before { top: 0; transform: rotate(45deg); }
        .tg-hamburger-bar.open::after { top: 0; transform: rotate(-45deg); }

        .tg-mobile-drawer {
          display: none;
          flex-direction: column;
          background: var(--app-surface);
          border-bottom: 1px solid var(--app-rule);
          padding: 16px max(1.25rem, 4vw) 20px;
          gap: 8px;
        }

        .tg-mobile-theme-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--app-rule);
          margin-bottom: 4px;
          font-size: 0.8125rem;
          color: var(--app-ink-subtle);
        }

        .tg-mobile-nav-link {
          font-size: 0.9375rem;
          color: var(--app-ink-muted);
          text-decoration: none;
          padding: 10px 0;
          border-bottom: 1px solid var(--app-rule);
          display: block;
          background: none;
          border-left: none;
          border-right: none;
          border-top: none;
          text-align: left;
          cursor: pointer;
        }

        .tg-mobile-auth-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 8px;
        }

        .tg-mobile-cta {
          width: 100%;
          text-align: center;
          padding: 12px;
        }

        .tg-logout-link {
          color: var(--color-danger);
        }

        @media (max-width: 768px) {
          .tg-nav,
          .tg-header-actions {
            display: none;
          }
          .tg-mobile-toggle {
            display: block;
          }
          .tg-mobile-drawer {
            display: flex;
          }
        }
      `}</style>
    </header>
  );
}
