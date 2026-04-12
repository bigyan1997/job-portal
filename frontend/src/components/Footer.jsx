import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Footer = () => {
  const { user } = useAuth();

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
          {(!user || user.role === "jobseeker") && (
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
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {[
                  { label: "Browse Jobs", to: "/" },
                  user && { label: "My Dashboard", to: "/dashboard" },
                  user && { label: "Saved Jobs", to: "/dashboard" },
                  user && { label: "Upgrade to Pro", to: "/subscription" },
                ]
                  .filter(Boolean)
                  .map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      style={{
                        color: "#475569",
                        fontSize: "14px",
                        textDecoration: "none",
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
          )}

          {/* For Employers */}
          {(!user || user.role === "employer") && (
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
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {[
                  user?.role === "employer" && {
                    label: "Post a Job",
                    to: "/employer/post",
                  },
                  user?.role === "employer" && {
                    label: "My Jobs",
                    to: "/employer",
                  },
                  user?.role === "employer" && {
                    label: "View Applicants",
                    to: "/employer",
                  },
                  !user && { label: "Post a Job", to: "/register" },
                  !user && { label: "Find Candidates", to: "/register" },
                ]
                  .filter(Boolean)
                  .map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      style={{
                        color: "#475569",
                        fontSize: "14px",
                        textDecoration: "none",
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
          )}

          {/* Cross-role CTA */}
          {user?.role === "jobseeker" && (
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
              <p
                style={{
                  color: "#475569",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  marginBottom: "12px",
                }}
              >
                Want to post a job and find the perfect candidate using AI?
              </p>
              <Link
                to="/register"
                style={{
                  display: "inline-block",
                  background: "#2563EB",
                  color: "#fff",
                  padding: "9px 18px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Post a Job →
              </Link>
            </div>
          )}

          {user?.role === "employer" && (
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
              <p
                style={{
                  color: "#475569",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  marginBottom: "12px",
                }}
              >
                Looking for your next opportunity? Let AI match you to the
                perfect role.
              </p>
              <Link
                to="/register"
                style={{
                  display: "inline-block",
                  background: "#2563EB",
                  color: "#fff",
                  padding: "9px 18px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Find Jobs →
              </Link>
            </div>
          )}

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
                !user && { label: "Sign In", to: "/login" },
                !user && { label: "Create Account", to: "/register" },
                user && { label: "Profile", to: "/profile" },
                user?.role === "jobseeker" && {
                  label: "Dashboard",
                  to: "/dashboard",
                },
                user?.role === "employer" && {
                  label: "My Jobs",
                  to: "/employer",
                },
              ]
                .filter(Boolean)
                .map((link) => (
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
