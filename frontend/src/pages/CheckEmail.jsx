import { Link, useLocation } from "react-router-dom";

const CheckEmail = () => {
  const location = useLocation();
  const email = location.state?.email || "your email";

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
            lineHeight: 1.6,
            marginBottom: "24px",
          }}
        >
          We sent a verification link to <strong>{email}</strong>. Click the
          link in the email to activate your account.
        </p>
        <p style={{ color: "#9CA3AF", fontSize: "13px", marginBottom: "24px" }}>
          Didn't receive it? Check your spam folder.
        </p>
        <Link
          to="/login"
          style={{
            color: "#2563EB",
            fontSize: "14px",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Back to login →
        </Link>
      </div>
    </div>
  );
};

export default CheckEmail;
