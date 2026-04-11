import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer style={{ background: "#0F1923", padding: "60px 24px 32px" }}>
      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
        }
      `}</style>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "48px",
            marginBottom: "48px",
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
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
                style={{ color: "#F1F5F9", fontSize: "15px", fontWeight: 700 }}
              >
                JobPortal <span style={{ color: "#2563EB" }}>AI</span>
              </span>
            </div>
            <p
              style={{
                color: "#475569",
                fontSize: "14px",
                lineHeight: 1.7,
                maxWidth: "280px",
              }}
            >
              AI-powered job matching that helps you find the right role faster
              with personalised match scores and cover letters.
            </p>
          </div>

          {/* For Job Seekers */}
          <div>
            <p
              style={{
                color: "#F1F5F9",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "16px",
                letterSpacing: "0.04em",
              }}
            >
              FOR JOB SEEKERS
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {[
                { label: "Browse Jobs", to: "/" },
                { label: "My Dashboard", to: "/dashboard" },
                { label: "Saved Jobs", to: "/dashboard" },
                { label: "Upgrade to Pro", to: "/subscription" },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  style={{
                    color: "#475569",
                    fontSize: "14px",
                    textDecoration: "none",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#94A3B8")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#475569")
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* For Employers */}
          <div>
            <p
              style={{
                color: "#F1F5F9",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "16px",
                letterSpacing: "0.04em",
              }}
            >
              FOR EMPLOYERS
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {[
                { label: "Post a Job", to: "/employer/post" },
                { label: "My Jobs", to: "/employer" },
                { label: "View Applicants", to: "/employer" },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  style={{
                    color: "#475569",
                    fontSize: "14px",
                    textDecoration: "none",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#94A3B8")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#475569")
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Account */}
          <div>
            <p
              style={{
                color: "#F1F5F9",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "16px",
                letterSpacing: "0.04em",
              }}
            >
              ACCOUNT
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {[
                { label: "Sign In", to: "/login" },
                { label: "Create Account", to: "/register" },
                { label: "Profile", to: "/profile" },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  style={{
                    color: "#475569",
                    fontSize: "14px",
                    textDecoration: "none",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#94A3B8")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#475569")
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <p style={{ color: "#334155", fontSize: "13px" }}>
            © 2026 JobPortal AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
