import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/Toast";

import Home from "./pages/Home";

// Lazy-loaded pages for bundle splitting
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const InstallExtension = lazy(() => import("./pages/InstallExtension"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));

function RouteFallback() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--app-bg, #0b0f19)",
        color: "var(--app-accent, #3b82f6)",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
        fontSize: "0.95rem",
        letterSpacing: "0.05em",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span
          style={{
            display: "inline-block",
            width: "16px",
            height: "16px",
            border: "2px solid rgba(59, 130, 246, 0.3)",
            borderTopColor: "var(--app-accent, #3b82f6)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <span>LOADING TOXIGUARD MODULE...</span>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/install" element={<InstallExtension />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ToastProvider>
    </BrowserRouter>
  );
}