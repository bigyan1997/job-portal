import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password/", { token, password });
      navigate("/login", {
        state: { message: "Password reset successfully! Please log in." },
      });
    } catch (err) {
      setError(err.response?.data?.error || "Invalid or expired reset link.");
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
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔐</div>
        <h1
          style={{
            color: "#111827",
            fontSize: "22px",
            fontWeight: 700,
            marginBottom: "8px",
          }}
        >
          Set new password
        </h1>
        <p style={{ color: "#6B7280", fontSize: "14px", marginBottom: "32px" }}>
          Choose a strong password for your account.
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
              textAlign: "left",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New password (min 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              padding: "12px 16px",
              fontSize: "14px",
              outline: "none",
              marginBottom: "12px",
              boxSizing: "border-box",
            }}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
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
            {loading ? "Resetting..." : "Reset Password →"}
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
      </div>
    </div>
  );
};

export default ResetPassword;
