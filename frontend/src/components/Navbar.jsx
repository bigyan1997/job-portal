import { useState, useCallback, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname],
  );

  const navLink = (to, label) => (
    <Link
      to={to}
      style={{
        color: isActive(to) ? "#111827" : "#6B7280",
        fontSize: "14px",
        fontWeight: isActive(to) ? 600 : 400,
        textDecoration: "none",
        padding: "6px 2px",
        borderBottom: isActive(to)
          ? "2px solid #2563EB"
          : "2px solid transparent",
        transition: "all 0.15s ease",
      }}
    >
      {label}
    </Link>
  );

  return (
    <nav
      style={{
        background: "#FFFFFF",
        borderBottom: "1px solid #F3F4F6",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "60px",
        boxShadow: "none",
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "8px",
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
          <span style={{ color: "#fff", fontSize: "14px", fontWeight: 700 }}>
            J
          </span>
        </div>
        <span
          style={{
            color: "#111827",
            fontSize: "15px",
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          JobPortal <span style={{ color: "#2563EB" }}>AI</span>
        </span>
      </Link>

      {/* Center nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
        {navLink("/", "Jobs")}

        {user?.role === "jobseeker" && (
          <>
            {navLink("/dashboard", "My Applications")}
            {navLink("/messages", "Messages")}
            {navLink("/profile", "Profile")}
          </>
        )}

        {user?.role === "employer" && (
          <>
            {navLink("/employer", "My Jobs")}
            {navLink("/messages", "Messages")}
            {navLink("/profile", "Profile")}
          </>
        )}
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Not logged in */}
        {!user && (
          <>
            <Link
              to="/login"
              style={{
                color: "#6B7280",
                fontSize: "14px",
                fontWeight: 500,
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#F9FAFB")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              Log in
            </Link>
            <Link
              to="/register"
              style={{
                background: "#111827",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 500,
                textDecoration: "none",
                padding: "8px 18px",
                borderRadius: "8px",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Get Started
            </Link>
          </>
        )}

        {/* Jobseeker — Pro badge + post job button */}
        {user?.role === "jobseeker" && (
          <Link
            to="/subscription"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: user?.is_pro
                ? "linear-gradient(135deg, #F59E0B, #D97706)"
                : "#F3F4F6",
              color: user?.is_pro ? "#fff" : "#6B7280",
              fontSize: "12px",
              fontWeight: 600,
              padding: "6px 14px",
              borderRadius: "999px",
              textDecoration: "none",
              letterSpacing: "0.01em",
            }}
          >
            {user?.is_pro ? "⚡ Pro" : "Upgrade"}
          </Link>
        )}

        {/* Employer — post job CTA */}
        {user?.role === "employer" && (
          <Link
            to="/employer/post"
            style={{
              background: "#2563EB",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
              padding: "8px 18px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1D4ED8")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#2563EB")}
          >
            + Post a Job
          </Link>
        )}

        {/* Avatar dropdown */}
        {user && (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background:
                  user.role === "employer"
                    ? "linear-gradient(135deg, #6D28D9, #8B5CF6)"
                    : "linear-gradient(135deg, #1E40AF, #3B82F6)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: "13px",
              }}
            >
              {user.company_name?.[0]?.toUpperCase() ||
                user.full_name?.[0]?.toUpperCase() ||
                user.email[0].toUpperCase()}
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "44px",
                  right: 0,
                  background: "#fff",
                  borderRadius: "12px",
                  border: "1px solid #F3F4F6",
                  width: "220px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                  zIndex: 100,
                }}
                onMouseLeave={() => setMenuOpen(false)}
              >
                {/* User info */}
                <div
                  style={{
                    padding: "14px 16px",
                    borderBottom: "1px solid #F3F4F6",
                  }}
                >
                  <p
                    style={{
                      color: "#111827",
                      fontWeight: 600,
                      fontSize: "13px",
                      marginBottom: "2px",
                    }}
                  >
                    {user.company_name || user.full_name || "User"}
                  </p>
                  <p style={{ color: "#9CA3AF", fontSize: "11px" }}>
                    {user.email}
                  </p>
                  <span
                    style={{
                      display: "inline-block",
                      marginTop: "6px",
                      background:
                        user.role === "employer" ? "#EDE9FE" : "#DBEAFE",
                      color: user.role === "employer" ? "#6D28D9" : "#1D4ED8",
                      fontSize: "10px",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "999px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {user.role === "employer" ? "EMPLOYER" : "JOB SEEKER"}
                  </span>
                </div>

                {/* Links */}
                <div style={{ padding: "8px" }}>
                  {[
                    { to: "/profile", label: "👤 My Profile" },
                    user?.role === "jobseeker" && {
                      to: "/dashboard",
                      label: "📋 My Applications",
                    },
                    user?.role === "jobseeker" && {
                      to: "/messages",
                      label: "💬 Messages",
                    }, // ← add
                    user?.role === "jobseeker" && {
                      to: "/subscription",
                      label: user?.is_pro ? "⚡ Pro Plan" : "⚡ Upgrade to Pro",
                    },
                    user?.role === "employer" && {
                      to: "/employer",
                      label: "💼 My Jobs",
                    },
                    user?.role === "employer" && {
                      to: "/messages",
                      label: "💬 Messages",
                    }, // ← add
                    user?.role === "employer" && {
                      to: "/employer/post",
                      label: "➕ Post a Job",
                    },
                  ]
                    .filter(Boolean)
                    .map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMenuOpen(false)}
                        style={{
                          display: "block",
                          padding: "9px 12px",
                          borderRadius: "8px",
                          color: "#374151",
                          fontSize: "13px",
                          textDecoration: "none",
                          transition: "background 0.1s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#F9FAFB")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        {item.label}
                      </Link>
                    ))}
                </div>

                {/* Logout */}
                <div style={{ padding: "8px", borderTop: "1px solid #F3F4F6" }}>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      color: "#EF4444",
                      fontSize: "13px",
                      textAlign: "left",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#FEF2F2")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    🚪 Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
