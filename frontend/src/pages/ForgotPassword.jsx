import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/forgot-password/", { email });
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8F7F4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid #F3F4F6",
          padding: "48px 40px",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {!sent ? (
          <>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔑</div>
            <h1
              style={{
                color: "#111827",
                fontSize: "22px",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              Forgot your password?
            </h1>
            <p
              style={{
                color: "#6B7280",
                fontSize: "14px",
                marginBottom: "32px",
              }}
            >
              Enter your email and we'll send you a reset link.
            </p>

            {error && (
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  color: "#B91C1C",
                  padding: "12px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  marginBottom: "16px",
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  border: "1px solid #E5E7EB",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  fontSize: "14px",
                  outline: "none",
                  marginBottom: "16px",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  background: loading ? "#93C5FD" : "#111827",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "13px",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Sending..." : "Send Reset Link →"}
              </button>
            </form>

            <Link
              to="/login"
              style={{
                display: "block",
                marginTop: "20px",
                color: "#6B7280",
                fontSize: "13px",
                textDecoration: "none",
              }}
            >
              ← Back to login
            </Link>
          </>
        ) : (
          <>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📧</div>
            <h1
              style={{
                color: "#111827",
                fontSize: "22px",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              Check your email
            </h1>
            <p
              style={{
                color: "#6B7280",
                fontSize: "14px",
                marginBottom: "24px",
                lineHeight: 1.6,
              }}
            >
              We sent a password reset link to <strong>{email}</strong>. Click
              the link in the email to reset your password.
            </p>
            <p
              style={{
                color: "#9CA3AF",
                fontSize: "12px",
                marginBottom: "24px",
              }}
            >
              Didn't receive it? Check your spam folder.
            </p>
            <Link
              to="/login"
              style={{
                display: "inline-block",
                background: "#111827",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              Back to login →
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
