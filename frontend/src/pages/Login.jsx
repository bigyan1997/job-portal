import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login/", formData);
      login(res.data.user, res.data.tokens);
      if (res.data.user.role === "employer") {
        navigate("/employer");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await api.post("/auth/google/", {
          access_token: tokenResponse.access_token,
        });
        login(res.data.user, res.data.tokens);
        if (res.data.user.role === "employer") {
          navigate("/employer");
        } else {
          navigate("/dashboard");
        }
      } catch {
        setError("Google login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError("Google login failed. Please try again."),
  });

  const inputStyle = {
    width: "100%",
    border: "1px solid #E5E7EB",
    borderRadius: "10px",
    padding: "11px 14px",
    fontSize: "14px",
    color: "#111827",
    outline: "none",
    background: "#fff",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  };

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: 600,
    color: "#6B7280",
    marginBottom: "6px",
    letterSpacing: "0.04em",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8F7F4", display: "flex" }}>
      <style>{`
        @media (max-width: 768px) {
          .auth-left-panel { display: none !important; }
          .auth-mobile-logo { display: flex !important; }
        }
        @media (min-width: 769px) {
          .auth-mobile-logo { display: none !important; }
        }
      `}</style>
      {/* Left panel — branding */}
      <div
        className="auth-left-panel"
        style={{
          width: "45%",
          background: "#0F1923",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "48px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #1E40AF, #3B82F6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#fff", fontSize: "18px", fontWeight: 700 }}>
              J
            </span>
          </div>
          <span style={{ color: "#F1F5F9", fontSize: "18px", fontWeight: 700 }}>
            JobPortal <span style={{ color: "#3B82F6" }}>AI</span>
          </span>
        </div>

        <h2
          style={{
            color: "#F1F5F9",
            fontSize: "32px",
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: "16px",
            letterSpacing: "-0.02em",
          }}
        >
          Find your next opportunity with AI
        </h2>
        <p
          style={{
            color: "#64748B",
            fontSize: "15px",
            lineHeight: 1.7,
            marginBottom: "48px",
          }}
        >
          Upload your resume once and let our AI match you to the perfect jobs,
          generate cover letters and show your exact match score.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { icon: "🤖", text: "AI-powered resume analysis" },
            { icon: "📄", text: "Auto-generated cover letters" },
            { icon: "📊", text: "Real-time match scoring" },
            { icon: "💬", text: "Direct messaging with employers" },
          ].map((item) => (
            <div
              key={item.text}
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              <span style={{ color: "#94A3B8", fontSize: "14px" }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "420px" }}>
          {/* Mobile logo */}
          <div
            className="auth-mobile-logo"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #1E40AF, #3B82F6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{ color: "#fff", fontSize: "14px", fontWeight: 700 }}
              >
                J
              </span>
            </div>
            <span
              style={{ color: "#111827", fontSize: "15px", fontWeight: 700 }}
            >
              JobPortal <span style={{ color: "#2563EB" }}>AI</span>
            </span>
          </div>

          <h1
            style={{
              color: "#111827",
              fontSize: "26px",
              fontWeight: 700,
              marginBottom: "6px",
              letterSpacing: "-0.02em",
            }}
          >
            Welcome back
          </h1>
          <p
            style={{ color: "#9CA3AF", fontSize: "14px", marginBottom: "28px" }}
          >
            Sign in to your account to continue
          </p>

          {error && (
            <div
              style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                color: "#B91C1C",
                padding: "12px 16px",
                borderRadius: "10px",
                marginBottom: "20px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div>
              <label style={labelStyle}>EMAIL</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              />
            </div>

            <div>
              <label style={labelStyle}>PASSWORD</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? "#93C5FD" : "#111827",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "13px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "opacity 0.15s",
                marginTop: "4px",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.opacity = "0.85";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              margin: "20px 0",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
            <span style={{ color: "#9CA3AF", fontSize: "12px" }}>
              or continue with
            </span>
            <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
          </div>

          {/* Google */}
          <button
            onClick={() => handleGoogleLogin()}
            disabled={loading}
            style={{
              width: "100%",
              border: "1px solid #E5E7EB",
              background: "#fff",
              color: "#374151",
              borderRadius: "10px",
              padding: "12px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F9FAFB")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
          >
            <svg style={{ width: "18px", height: "18px" }} viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <p
            style={{
              textAlign: "center",
              color: "#9CA3AF",
              fontSize: "14px",
              marginTop: "24px",
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#2563EB",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
