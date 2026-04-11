import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const FAQ_ITEMS = [
  {
    q: "Can I cancel anytime?",
    a: "Yes, you can cancel your Pro subscription at any time. You'll keep Pro access until the end of your current billing period.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "All your applications, saved jobs and resume data are kept. You'll just lose access to unlimited AI analyses and revert to the free plan.",
  },
  {
    q: "Is my payment secure?",
    a: "Absolutely. All payments are processed securely by Stripe — we never store your card details.",
  },
  {
    q: "Can I upgrade mid-month?",
    a: "Yes! You get Pro access immediately after upgrading and you're billed from that day each month.",
  },
  {
    q: "What is an AI analysis?",
    a: "Each time you click 'Analyse my resume' for a job, that counts as one analysis. Pro users get unlimited analyses so you can apply to as many jobs as you want.",
  },
];

const Subscription = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get("/auth/subscription/");
        setStatus(res.data);
      } catch (err) {
        console.error("Failed to fetch subscription status", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    try {
      const res = await api.post("/auth/subscription/create-checkout/");
      window.location.href = res.data.checkout_url;
    } catch (err) {
      alert(err.response?.data?.error || "Failed to start checkout");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleCancel = async () => {
    if (
      !window.confirm(
        "Are you sure you want to cancel your Pro subscription? You will keep access until the end of your billing period.",
      )
    )
      return;
    setCancelLoading(true);
    try {
      await api.post("/auth/subscription/cancel/");
      alert(
        "Subscription cancelled. You will keep Pro access until the end of your billing period.",
      );
    } catch (err) {
      alert(err.response?.data?.error || "Failed to cancel subscription");
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#F8F7F4" }}>
        <div
          style={{
            background: "#0F1923",
            padding: "40px 24px",
            marginBottom: "32px",
          }}
        >
          <div style={{ maxWidth: "720px", margin: "0 auto" }}>
            <div
              style={{
                height: "28px",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "6px",
                width: "200px",
                marginBottom: "8px",
              }}
            />
            <div
              style={{
                height: "16px",
                background: "rgba(255,255,255,0.04)",
                borderRadius: "4px",
                width: "300px",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  const analysesPercent = status?.is_pro
    ? 100
    : Math.min((status?.ai_analyses_used / status?.free_limit) * 100, 100);

  return (
    <div style={{ minHeight: "100vh", background: "#F8F7F4" }}>
      <style>{`
        @media (max-width: 768px) {
          .plans-grid { grid-template-columns: 1fr !important; }
          .compare-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ background: "#0F1923", padding: "40px 24px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "28px" }}>⚡</span>
            <h1
              style={{
                color: "#F1F5F9",
                fontSize: "28px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              {status?.is_pro ? "You're on Pro" : "Upgrade to Pro"}
            </h1>
          </div>
          <p
            style={{ color: "#64748B", fontSize: "14px", marginBottom: "28px" }}
          >
            {status?.is_pro
              ? "Manage your Pro subscription and billing"
              : "Unlock unlimited AI analyses and get hired faster"}
          </p>

          {/* Usage bar */}
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px",
              padding: "20px 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <p
                style={{ color: "#94A3B8", fontSize: "13px", fontWeight: 500 }}
              >
                AI Analyses Used
              </p>
              <p
                style={{ color: "#F1F5F9", fontSize: "14px", fontWeight: 700 }}
              >
                {status?.ai_analyses_used} /{" "}
                {status?.is_pro ? "∞" : status?.free_limit}
              </p>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: "999px",
                height: "8px",
                overflow: "hidden",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: "999px",
                  width: `${analysesPercent}%`,
                  background: status?.is_pro
                    ? "linear-gradient(90deg, #22C55E, #16A34A)"
                    : analysesPercent >= 100
                      ? "#EF4444"
                      : analysesPercent >= 66
                        ? "#EAB308"
                        : "#3B82F6",
                  transition: "width 0.5s ease",
                }}
              />
            </div>
            {status?.is_pro ? (
              <p
                style={{ color: "#22C55E", fontSize: "12px", fontWeight: 500 }}
              >
                ✅ Pro plan — unlimited AI analyses
              </p>
            ) : status?.analyses_remaining === 0 ? (
              <p style={{ color: "#EF4444", fontSize: "12px" }}>
                ❌ All free analyses used — upgrade to continue
              </p>
            ) : (
              <p style={{ color: "#64748B", fontSize: "12px" }}>
                {status?.analyses_remaining} free{" "}
                {status?.analyses_remaining === 1 ? "analysis" : "analyses"}{" "}
                remaining
              </p>
            )}
          </div>
        </div>
      </div>

      <div
        style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 24px" }}
      >
        {/* ── SOCIAL PROOF ── */}
        <div
          style={{
            background: "linear-gradient(135deg, #1E40AF, #2563EB)",
            borderRadius: "14px",
            padding: "16px 24px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", marginRight: "4px" }}>
            {["S", "J", "P", "M"].map((l, i) => (
              <div
                key={i}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: `hsl(${i * 60 + 200}, 70%, 50%)`,
                  border: "2px solid #2563EB",
                  marginLeft: i > 0 ? "-8px" : 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                {l}
              </div>
            ))}
          </div>
          <p style={{ color: "#BFDBFE", fontSize: "14px" }}>
            <span style={{ color: "#fff", fontWeight: 700 }}>
              2,000+ professionals
            </span>{" "}
            are already on Pro and getting more interviews
          </p>
        </div>

        {/* ── PLANS ── */}
        <div
          className="plans-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {/* Free */}
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              border: `2px solid ${!status?.is_pro ? "#2563EB" : "#F3F4F6"}`,
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <h3
                style={{ color: "#111827", fontSize: "16px", fontWeight: 700 }}
              >
                Free
              </h3>
              {!status?.is_pro && (
                <span
                  style={{
                    background: "#DBEAFE",
                    color: "#1D4ED8",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "999px",
                  }}
                >
                  Current
                </span>
              )}
            </div>
            <p
              style={{
                color: "#111827",
                fontSize: "32px",
                fontWeight: 800,
                marginBottom: "4px",
              }}
            >
              $0
            </p>
            <p
              style={{
                color: "#9CA3AF",
                fontSize: "12px",
                marginBottom: "20px",
              }}
            >
              forever
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {[
                { text: "3 AI resume analyses", check: true },
                { text: "Apply to unlimited jobs", check: true },
                { text: "Cover letter generation", check: true },
                { text: "Skills gap analysis", check: true },
                { text: "Unlimited AI analyses", check: false },
                { text: "Priority support", check: false },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span
                    style={{
                      color: item.check ? "#22C55E" : "#D1D5DB",
                      fontSize: "14px",
                      flexShrink: 0,
                    }}
                  >
                    {item.check ? "✓" : "✗"}
                  </span>
                  <span
                    style={{
                      color: item.check ? "#374151" : "#9CA3AF",
                      fontSize: "13px",
                    }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro */}
          <div
            style={{
              background: "linear-gradient(135deg, #1E40AF, #2563EB)",
              borderRadius: "16px",
              border: "2px solid #2563EB",
              padding: "24px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: 700 }}>
                Pro ⚡
              </h3>
              {status?.is_pro && (
                <span
                  style={{
                    background: "#fff",
                    color: "#2563EB",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "999px",
                  }}
                >
                  Current
                </span>
              )}
            </div>
            <p
              style={{
                color: "#fff",
                fontSize: "32px",
                fontWeight: 800,
                marginBottom: "4px",
              }}
            >
              $14.99
            </p>
            <p
              style={{
                color: "#BFDBFE",
                fontSize: "12px",
                marginBottom: "20px",
              }}
            >
              per month
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {[
                "Unlimited AI resume analyses",
                "Apply to unlimited jobs",
                "Cover letter generation",
                "Skills gap analysis",
                "Resume improvement suggestions",
                "Priority support",
              ].map((text, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span
                    style={{
                      color: "#86EFAC",
                      fontSize: "14px",
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </span>
                  <span style={{ color: "#BFDBFE", fontSize: "13px" }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── PRO STATUS / UPGRADE CTA ── */}
        {status?.is_pro ? (
          <div style={{ marginBottom: "32px" }}>
            <div
              style={{
                background: "#F0FDF4",
                border: "1px solid #BBF7D0",
                borderRadius: "14px",
                padding: "20px 24px",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <p
                  style={{
                    color: "#15803D",
                    fontWeight: 700,
                    fontSize: "15px",
                    marginBottom: "4px",
                  }}
                >
                  ✅ You are on the Pro plan
                </p>
                <p style={{ color: "#16A34A", fontSize: "13px" }}>
                  Pro since{" "}
                  {new Date(status.pro_since).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div
                style={{
                  background: "#DCFCE7",
                  borderRadius: "10px",
                  padding: "10px 16px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    color: "#15803D",
                    fontSize: "11px",
                    fontWeight: 600,
                    marginBottom: "2px",
                  }}
                >
                  ANALYSES USED
                </p>
                <p
                  style={{
                    color: "#15803D",
                    fontSize: "20px",
                    fontWeight: 800,
                  }}
                >
                  {status?.ai_analyses_used}
                </p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              disabled={cancelLoading}
              style={{
                width: "100%",
                border: "1px solid #FECACA",
                background: "#fff",
                color: "#EF4444",
                borderRadius: "12px",
                padding: "13px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: cancelLoading ? "not-allowed" : "pointer",
                opacity: cancelLoading ? 0.6 : 1,
              }}
            >
              {cancelLoading ? "Cancelling..." : "Cancel Subscription"}
            </button>
          </div>
        ) : (
          <div style={{ marginBottom: "32px" }}>
            <button
              onClick={handleUpgrade}
              disabled={checkoutLoading}
              style={{
                width: "100%",
                background: checkoutLoading ? "#93C5FD" : "#111827",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                padding: "15px",
                fontSize: "16px",
                fontWeight: 700,
                cursor: checkoutLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              {checkoutLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Redirecting to checkout...
                </>
              ) : (
                "⚡ Upgrade to Pro — $14.99/month"
              )}
            </button>
            <p
              style={{
                textAlign: "center",
                color: "#9CA3AF",
                fontSize: "12px",
              }}
            >
              🔒 Secure payment via Stripe · Cancel anytime
            </p>
          </div>
        )}

        {/* ── PRO BENEFITS (shown to free users) ── */}
        {!status?.is_pro && (
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #F3F4F6",
              padding: "24px",
              marginBottom: "24px",
            }}
          >
            <h3
              style={{
                color: "#111827",
                fontSize: "15px",
                fontWeight: 700,
                marginBottom: "16px",
              }}
            >
              What you unlock with Pro
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              {[
                {
                  icon: "🤖",
                  title: "Unlimited AI Analyses",
                  desc: "Analyse as many jobs as you want",
                },
                {
                  icon: "✉️",
                  title: "Unlimited Cover Letters",
                  desc: "Get a personalised letter for every job",
                },
                {
                  icon: "📊",
                  title: "Skills Gap Analysis",
                  desc: "See exactly what you're missing",
                },
                {
                  icon: "✨",
                  title: "Resume Suggestions",
                  desc: "AI tips to improve your resume",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: "#F9FAFB",
                    borderRadius: "12px",
                    padding: "16px",
                  }}
                >
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                    {item.icon}
                  </div>
                  <p
                    style={{
                      color: "#111827",
                      fontWeight: 600,
                      fontSize: "13px",
                      marginBottom: "4px",
                    }}
                  >
                    {item.title}
                  </p>
                  <p style={{ color: "#9CA3AF", fontSize: "12px" }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FAQ ── */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            border: "1px solid #F3F4F6",
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          <h3
            style={{
              color: "#111827",
              fontSize: "15px",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            Frequently asked questions
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                style={{
                  borderBottom:
                    i < FAQ_ITEMS.length - 1 ? "1px solid #F3F4F6" : "none",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 0",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      color: "#111827",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    {item.q}
                  </span>
                  <span
                    style={{
                      color: "#9CA3AF",
                      fontSize: "18px",
                      flexShrink: 0,
                      marginLeft: "12px",
                      transition: "transform 0.2s",
                      transform:
                        openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <p
                    style={{
                      color: "#6B7280",
                      fontSize: "13px",
                      lineHeight: 1.7,
                      paddingBottom: "14px",
                    }}
                  >
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── STRIPE BADGE ── */}
        <p style={{ textAlign: "center", color: "#9CA3AF", fontSize: "12px" }}>
          🔒 Payments securely processed by Stripe
        </p>
      </div>
    </div>
  );
};

export default Subscription;
