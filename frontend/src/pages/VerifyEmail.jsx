import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const hasVerified = useRef(false); // ← prevent double call

  useEffect(() => {
    if (hasVerified.current) return; // ← skip if already called
    hasVerified.current = true;

    const verify = async () => {
      try {
        await api.get(`/auth/verify-email/${token}/`);
        setStatus("success");
        setTimeout(() => navigate("/login"), 3000);
      } catch {
        setStatus("error");
      }
    };
    verify();
  }, [token]);

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
        {status === "verifying" && (
          <>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
            <h1
              style={{
                color: "#111827",
                fontSize: "22px",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              Verifying your email...
            </h1>
            <p style={{ color: "#9CA3AF", fontSize: "14px" }}>
              Please wait a moment.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
            <h1
              style={{
                color: "#111827",
                fontSize: "22px",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              Email verified!
            </h1>
            <p
              style={{
                color: "#6B7280",
                fontSize: "14px",
                marginBottom: "24px",
              }}
            >
              Your account is now active. Redirecting you to login...
            </p>
            <Link
              to="/login"
              style={{
                background: "#111827",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              Go to Login →
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>❌</div>
            <h1
              style={{
                color: "#111827",
                fontSize: "22px",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              Invalid link
            </h1>
            <p
              style={{
                color: "#6B7280",
                fontSize: "14px",
                marginBottom: "24px",
              }}
            >
              This verification link is invalid or has already been used.
            </p>
            <Link
              to="/register"
              style={{
                background: "#111827",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              Sign up again →
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
