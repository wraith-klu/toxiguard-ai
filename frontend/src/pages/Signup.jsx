import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../components/Toast";
import "./Signup.css";

const API = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.api_key) {
        localStorage.setItem("api_key", data.api_key);
        localStorage.setItem("user_email", email);
        toast.success("Account created successfully");
        navigate("/dashboard");
      } else {
        toast.error(data.detail || "Signup failed");
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

          <h2>Create Account</h2>
          <p className="auth-subtitle">Generate API keys and configure custom moderation rules</p>

          <form onSubmit={handleSignup} className="auth-form">
            <div className="form-group">
              <label htmlFor="signup-email">Work Email</label>
              <input
                id="signup-email"
                type="email"
                placeholder="developer@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-password">Password (Minimum 6 characters)</label>
              <input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Create Free Account"}
            </button>
          </form>

          <p className="auth-alt">
            Already registered?{" "}
            <Link to="/login" className="auth-link">
              Sign in
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
              <span className="auth-quote-tag">Production Ready</span>
              <p className="auth-quote-text">
                "Multi-layer NLP architecture built for sub-50ms inference at the edge."
              </p>
              <span className="auth-quote-author">DeBERTa-v3 & ONNX Runtime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}