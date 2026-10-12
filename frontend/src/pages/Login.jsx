import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../components/Toast";
import "./Login.css";

const API = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.api_key) {
        localStorage.setItem("api_key", data.api_key);
        localStorage.setItem("user_email", email);
        if (data.token) localStorage.setItem("token", data.token);

        toast.success("Welcome back");
        navigate("/dashboard");
      } else {
        toast.error(data.detail || "Invalid credentials");
      }
    } catch (err) {
      toast.error("Cannot connect to server");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Form */}
        <div className="auth-card">
          <Link to="/" className="auth-brand">
            <span className="auth-brand-icon">◆</span>
            <span className="auth-brand-text">ToxiGuard AI</span>
          </Link>

          <h2>Sign In</h2>
          <p className="auth-subtitle">Access your moderation credentials and dashboard</p>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                placeholder="operator@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Authenticating..." : "Sign In to Dashboard"}
            </button>
          </form>

          <p className="auth-alt">
            Need an account?{" "}
            <Link to="/signup" className="auth-link">
              Create an account
            </Link>
          </p>

          <button
            type="button"
            className="back-home-btn"
            onClick={() => navigate("/")}
          >
            ← Back to Overview
          </button>
        </div>

        {/* Right Media Panel */}
        <div className="auth-right">
          <video
            className="auth-media-video"
            src="/auth-bg.mp4"
            poster="/auth-bg.jpg"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="auth-right-overlay">
            <div className="auth-quote-block">
              <span className="auth-quote-tag">Deterministic Moderation</span>
              <p className="auth-quote-text">
                "Zero data retention pipelines for real-time community safety."
              </p>
              <span className="auth-quote-author">ToxiGuard Core v3.2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}