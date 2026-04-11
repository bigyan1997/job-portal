import { useState, useCallback, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const locationRef = useRef(location.pathname);

  useEffect(() => {
    locationRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    if (!user) return;

    const fetchUnread = async () => {
      // Only poll when tab is visible and not already on the messages page
      if (document.hidden) return;
      if (locationRef.current === "/messages") return;
      try {
        const res = await api.get("/messaging/unread/");
        setUnreadCount(res.data.unread_count);
      } catch {}
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    setMenuOpen(false);
    setMobileOpen(false);
    if (location.pathname === "/messages") setUnreadCount(0);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname],
  );

  const MessagesLink = ({ mobile = false }) => (
    <Link
      to="/messages"
      onClick={() => mobile && setMobileOpen(false)}
      style={{
        color: isActive("/messages")
          ? "#111827"
          : mobile
            ? "#374151"
            : "#6B7280",
        fontSize: mobile ? "15px" : "14px",
        fontWeight: isActive("/messages") ? 600 : 400,
        textDecoration: "none",
        padding: mobile ? "12px 16px" : "6px 2px",
        borderBottom:
          !mobile &&
          (isActive("/messages")
            ? "2px solid #2563EB"
            : "2px solid transparent"),
        display: "flex",
        alignItems: "center",
        gap: "6px",
        borderRadius: mobile ? "8px" : 0,
        transition: "all 0.15s ease",
      }}
    >
      💬 Messages
      {unreadCount > 0 && (
        <span
          style={{
            background: "#EF4444",
            color: "#fff",
            fontSize: "10px",
            fontWeight: 700,
            minWidth: "18px",
            height: "18px",
            borderRadius: "999px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 4px",
          }}
        >
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-desktop { display: flex !important; }
          .nav-mobile-btn { display: none !important; }
        }
      `}</style>

      <nav
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #F3F4F6",
          padding: "0 20px",
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

        {/* Desktop center nav */}
        <div
          className="nav-desktop"
          style={{ alignItems: "center", gap: "28px" }}
        >
          <Link
            to="/"
            style={{
              color: isActive("/") ? "#111827" : "#6B7280",
              fontSize: "14px",
              fontWeight: isActive("/") ? 600 : 400,
              textDecoration: "none",
              padding: "6px 2px",
              borderBottom: isActive("/")
                ? "2px solid #2563EB"
                : "2px solid transparent",
            }}
          >
            Jobs
          </Link>

          {user?.role === "jobseeker" && (
            <>
              <Link
                to="/dashboard"
                style={{
                  color: isActive("/dashboard") ? "#111827" : "#6B7280",
                  fontSize: "14px",
                  fontWeight: isActive("/dashboard") ? 600 : 400,
                  textDecoration: "none",
                  padding: "6px 2px",
                  borderBottom: isActive("/dashboard")
                    ? "2px solid #2563EB"
                    : "2px solid transparent",
                }}
              >
                Dashboard
              </Link>
              <MessagesLink />
              <Link
                to="/dashboard#saved"
                style={{
                  color: isActive("/dashboard") ? "#111827" : "#6B7280",
                  fontSize: "14px",
                  fontWeight: 400,
                  textDecoration: "none",
                  padding: "6px 2px",
                  borderBottom: "2px solid transparent",
                }}
              >
                🔖 Saved
              </Link>
              <Link
                to="/profile"
                style={{
                  color: isActive("/profile") ? "#111827" : "#6B7280",
                  fontSize: "14px",
                  fontWeight: isActive("/profile") ? 600 : 400,
                  textDecoration: "none",
                  padding: "6px 2px",
                  borderBottom: isActive("/profile")
                    ? "2px solid #2563EB"
                    : "2px solid transparent",
                }}
              >
                Profile
              </Link>
            </>
          )}

          {user?.role === "employer" && (
            <>
              <Link
                to="/employer"
                style={{
                  color: isActive("/employer") ? "#111827" : "#6B7280",
                  fontSize: "14px",
                  fontWeight: isActive("/employer") ? 600 : 400,
                  textDecoration: "none",
                  padding: "6px 2px",
                  borderBottom: isActive("/employer")
                    ? "2px solid #2563EB"
                    : "2px solid transparent",
                }}
              >
                My Jobs
              </Link>
              <MessagesLink />
              <Link
                to="/profile"
                style={{
                  color: isActive("/profile") ? "#111827" : "#6B7280",
                  fontSize: "14px",
                  fontWeight: isActive("/profile") ? 600 : 400,
                  textDecoration: "none",
                  padding: "6px 2px",
                  borderBottom: isActive("/profile")
                    ? "2px solid #2563EB"
                    : "2px solid transparent",
                }}
              >
                Profile
              </Link>
            </>
          )}
        </div>

        {/* Desktop right side */}
        <div
          className="nav-desktop"
          style={{ alignItems: "center", gap: "12px" }}
        >
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
                }}
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
                }}
              >
                Get Started
              </Link>
            </>
          )}

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
              }}
            >
              {user?.is_pro ? "⚡ Pro" : "Upgrade"}
            </Link>
          )}

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
                  <div style={{ padding: "8px" }}>
                    {[
                      { to: "/profile", label: "👤 My Profile" },
                      user?.role === "jobseeker" && {
                        to: "/dashboard",
                        label: "📋 Dashboard",
                      },
                      user?.role === "jobseeker" && {
                        to: "/dashboard",
                        label: "🔖 Saved Jobs",
                      },
                      user?.role === "jobseeker" && {
                        to: "/messages",
                        label: `💬 Messages${unreadCount > 0 ? ` (${unreadCount})` : ""}`,
                      },
                      user?.role === "jobseeker" && {
                        to: "/subscription",
                        label: user?.is_pro
                          ? "⚡ Pro Plan"
                          : "⚡ Upgrade to Pro",
                      },
                      user?.role === "employer" && {
                        to: "/employer",
                        label: "💼 My Jobs",
                      },
                      user?.role === "employer" && {
                        to: "/messages",
                        label: `💬 Messages${unreadCount > 0 ? ` (${unreadCount})` : ""}`,
                      },
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
                  <div
                    style={{ padding: "8px", borderTop: "1px solid #F3F4F6" }}
                  >
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

        {/* Mobile right side */}
        <div
          className="nav-mobile-btn"
          style={{ alignItems: "center", gap: "10px" }}
        >
          {/* Unread badge on mobile */}
          {user && unreadCount > 0 && (
            <Link
              to="/messages"
              style={{ textDecoration: "none", position: "relative" }}
            >
              <span
                style={{
                  background: "#EF4444",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: "999px",
                }}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </Link>
          )}

          {/* Avatar or hamburger */}
          {user ? (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
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
          ) : (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                padding: "4px",
              }}
            >
              <span
                style={{
                  width: "22px",
                  height: "2px",
                  background: "#374151",
                  borderRadius: "2px",
                  display: "block",
                }}
              />
              <span
                style={{
                  width: "22px",
                  height: "2px",
                  background: "#374151",
                  borderRadius: "2px",
                  display: "block",
                }}
              />
              <span
                style={{
                  width: "22px",
                  height: "2px",
                  background: "#374151",
                  borderRadius: "2px",
                  display: "block",
                }}
              />
            </button>
          )}
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            top: "60px",
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 49,
          }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: "8px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* User info if logged in */}
            {user && (
              <div
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid #F3F4F6",
                  marginBottom: "8px",
                }}
              >
                <p
                  style={{
                    color: "#111827",
                    fontWeight: 600,
                    fontSize: "14px",
                    marginBottom: "2px",
                  }}
                >
                  {user.company_name || user.full_name || "User"}
                </p>
                <p style={{ color: "#9CA3AF", fontSize: "12px" }}>
                  {user.email}
                </p>
              </div>
            )}

            {/* Links */}
            {[
              { to: "/", label: "🔍 Browse Jobs" },
              user?.role === "jobseeker" && {
                to: "/dashboard",
                label: "📋 Dashboard",
              },
              user?.role === "jobseeker" && {
                to: "/dashboard",
                label: "🔖 Saved Jobs",
              },
              user?.role === "jobseeker" && {
                to: "/messages",
                label: `💬 Messages${unreadCount > 0 ? ` (${unreadCount})` : ""}`,
              },
              user?.role === "jobseeker" && {
                to: "/profile",
                label: "👤 Profile",
              },
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
                label: `💬 Messages${unreadCount > 0 ? ` (${unreadCount})` : ""}`,
              },
              user?.role === "employer" && {
                to: "/profile",
                label: "👤 Profile",
              },
              user?.role === "employer" && {
                to: "/employer/post",
                label: "➕ Post a Job",
              },
              !user && { to: "/login", label: "🔑 Log in" },
              !user && { to: "/register", label: "🚀 Get Started" },
            ]
              .filter(Boolean)
              .map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "block",
                    padding: "13px 16px",
                    borderRadius: "10px",
                    color: "#374151",
                    fontSize: "15px",
                    textDecoration: "none",
                    fontWeight: isActive(item.to) ? 600 : 400,
                    background: isActive(item.to) ? "#F3F4F6" : "transparent",
                    marginBottom: "2px",
                  }}
                >
                  {item.label}
                </Link>
              ))}

            {/* Logout */}
            {user && (
              <div
                style={{
                  borderTop: "1px solid #F3F4F6",
                  marginTop: "8px",
                  paddingTop: "8px",
                }}
              >
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    borderRadius: "10px",
                    color: "#EF4444",
                    fontSize: "15px",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  🚪 Log out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
