import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: "🤖",
    title: "AI-powered candidate matching",
    description:
      "Our AI automatically scores every applicant against your job requirements, so you spend time only on the best candidates.",
  },
  {
    icon: "📊",
    title: "Instant match scores",
    description:
      "Every applicant gets a 0–100% match score based on their resume vs your job description. No more guessing.",
  },
  {
    icon: "✉️",
    title: "See AI-generated cover letters",
    description:
      "Candidates apply with personalised AI cover letters tailored to your role — making it easier to evaluate them quickly.",
  },
  {
    icon: "💬",
    title: "Message candidates directly",
    description:
      "Chat with shortlisted applicants directly on the platform. No emails, no third-party tools.",
  },
  {
    icon: "📋",
    title: "Skills gap visibility",
    description:
      "See exactly which skills each applicant has and which they're missing — right on their application card.",
  },
  {
    icon: "⚡",
    title: "Post in minutes",
    description:
      "Create a detailed job listing in under 5 minutes. The more detail you add, the better our AI matches candidates.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Create your employer account",
    description: "Sign up for free as an employer. Takes less than 2 minutes.",
  },
  {
    number: "02",
    title: "Post your job",
    description:
      "Fill in the job title, description and requirements. Our AI uses this to match and score applicants.",
  },
  {
    number: "03",
    title: "Review AI-scored applicants",
    description:
      "Applicants start coming in with AI match scores. Filter, shortlist and message the best ones.",
  },
];

const ForEmployers = () => {
  return (
    <div style={{ minHeight: "100vh", background: "#F8F7F4" }}>
      <style>{`
        @media (max-width: 768px) {
          .hero-title { font-size: 32px !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .cta-buttons { flex-direction: column !important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #0A0F1C 0%, #0F1923 50%, #111827 100%)",
          padding: "80px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.03,
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(37,99,235,0.15)",
              border: "1px solid rgba(59,130,246,0.25)",
              borderRadius: "999px",
              padding: "6px 16px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#3B82F6",
              }}
            />
            <span
              style={{
                color: "#93C5FD",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.08em",
              }}
            >
              FOR EMPLOYERS
            </span>
          </div>

          <h1
            className="hero-title"
            style={{
              fontSize: "48px",
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.1,
              marginBottom: "20px",
              letterSpacing: "-0.03em",
            }}
          >
            Hire smarter with{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AI matching
            </span>
          </h1>

          <p
            style={{
              color: "#64748B",
              fontSize: "18px",
              lineHeight: 1.7,
              marginBottom: "40px",
              maxWidth: "560px",
              margin: "0 auto 40px",
            }}
          >
            Post a job for free and let our AI automatically score, rank and
            match candidates to your requirements — so you only spend time on
            the best applicants.
          </p>

          <div
            className="cta-buttons"
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "48px",
            }}
          >
            <Link
              to="/register"
              style={{
                background: "#2563EB",
                color: "#fff",
                padding: "15px 36px",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "16px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Post a Job for Free →
            </Link>
            <Link
              to="/login"
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "#F1F5F9",
                padding: "15px 36px",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "16px",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              Sign in as Employer
            </Link>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: "48px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "Free", label: "To post a job" },
              { value: "2 min", label: "To get started" },
              { value: "AI", label: "Powered matching" },
              { value: "100%", label: "Match accuracy" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    color: "#F1F5F9",
                    fontSize: "22px",
                    fontWeight: 700,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    color: "#475569",
                    fontSize: "12px",
                    marginTop: "2px",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div style={{ background: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span
              style={{
                background: "#DBEAFE",
                color: "#1D4ED8",
                fontSize: "11px",
                fontWeight: 700,
                padding: "5px 16px",
                borderRadius: "999px",
                letterSpacing: "0.08em",
              }}
            >
              HOW IT WORKS
            </span>
            <h2
              style={{
                color: "#111827",
                fontSize: "32px",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginTop: "16px",
                marginBottom: "12px",
              }}
            >
              Start hiring in 3 simple steps
            </h2>
          </div>

          <div
            className="steps-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "24px",
            }}
          >
            {STEPS.map((step, i) => (
              <div
                key={i}
                style={{
                  background: "#F9FAFB",
                  borderRadius: "20px",
                  padding: "32px",
                  border: "1px solid #F3F4F6",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "20px",
                    color: "#E5E7EB",
                    fontSize: "44px",
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {step.number}
                </div>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: "#DBEAFE",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#1D4ED8",
                    fontWeight: 800,
                    fontSize: "16px",
                    marginBottom: "16px",
                  }}
                >
                  {i + 1}
                </div>
                <h3
                  style={{
                    color: "#111827",
                    fontSize: "16px",
                    fontWeight: 700,
                    marginBottom: "10px",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    color: "#6B7280",
                    fontSize: "14px",
                    lineHeight: 1.7,
                  }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div style={{ background: "#F8F7F4", padding: "80px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span
              style={{
                background: "#DCFCE7",
                color: "#15803D",
                fontSize: "11px",
                fontWeight: 700,
                padding: "5px 16px",
                borderRadius: "999px",
                letterSpacing: "0.08em",
              }}
            >
              FEATURES
            </span>
            <h2
              style={{
                color: "#111827",
                fontSize: "32px",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginTop: "16px",
                marginBottom: "12px",
              }}
            >
              Everything you need to find the right hire
            </h2>
            <p
              style={{
                color: "#6B7280",
                fontSize: "16px",
                maxWidth: "480px",
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              Our AI does the heavy lifting so you can focus on what matters —
              finding the right person.
            </p>
          </div>

          <div
            className="features-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "16px",
            }}
          >
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "24px",
                  border: "1px solid #F3F4F6",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "14px" }}>
                  {feature.icon}
                </div>
                <h3
                  style={{
                    color: "#111827",
                    fontSize: "15px",
                    fontWeight: 700,
                    marginBottom: "8px",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    color: "#6B7280",
                    fontSize: "13px",
                    lineHeight: 1.7,
                  }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PREVIEW ── */}
      <div style={{ background: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span
              style={{
                background: "#EDE9FE",
                color: "#6D28D9",
                fontSize: "11px",
                fontWeight: 700,
                padding: "5px 16px",
                borderRadius: "999px",
                letterSpacing: "0.08em",
              }}
            >
              WHAT YOU GET
            </span>
            <h2
              style={{
                color: "#111827",
                fontSize: "32px",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginTop: "16px",
                marginBottom: "12px",
              }}
            >
              See what applicants look like
            </h2>
            <p
              style={{
                color: "#6B7280",
                fontSize: "16px",
                maxWidth: "480px",
                margin: "0 auto",
              }}
            >
              Every applicant comes with an AI match score, skills breakdown and
              cover letter.
            </p>
          </div>

          {/* Mock applicant card */}
          <div
            style={{
              background: "#F9FAFB",
              borderRadius: "20px",
              border: "1px solid #F3F4F6",
              padding: "28px",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "14px" }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #1E40AF, #3B82F6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "18px",
                  }}
                >
                  S
                </div>
                <div>
                  <p
                    style={{
                      color: "#111827",
                      fontWeight: 600,
                      fontSize: "15px",
                      marginBottom: "2px",
                    }}
                  >
                    Sarah Mitchell
                  </p>
                  <p style={{ color: "#9CA3AF", fontSize: "12px" }}>
                    sarah@example.com · Applied 2h ago
                  </p>
                </div>
              </div>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  border: "4px solid #22C55E",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    color: "#15803D",
                    fontSize: "14px",
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  87%
                </span>
                <span style={{ color: "#9CA3AF", fontSize: "9px" }}>match</span>
              </div>
            </div>

            <div
              style={{
                background: "#E5E7EB",
                borderRadius: "999px",
                height: "6px",
                overflow: "hidden",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: "999px",
                  width: "87%",
                  background: "#22C55E",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div>
                <p
                  style={{
                    color: "#6B7280",
                    fontSize: "11px",
                    fontWeight: 600,
                    marginBottom: "6px",
                    letterSpacing: "0.05em",
                  }}
                >
                  ✅ MATCHING SKILLS
                </p>
                {["React", "TypeScript", "REST APIs", "Git"].map((s) => (
                  <span
                    key={s}
                    style={{
                      display: "inline-block",
                      background: "#DCFCE7",
                      color: "#15803D",
                      fontSize: "11px",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      marginRight: "4px",
                      marginBottom: "4px",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div>
                <p
                  style={{
                    color: "#6B7280",
                    fontSize: "11px",
                    fontWeight: 600,
                    marginBottom: "6px",
                    letterSpacing: "0.05em",
                  }}
                >
                  ❌ MISSING SKILLS
                </p>
                {["AWS", "Docker"].map((s) => (
                  <span
                    key={s}
                    style={{
                      display: "inline-block",
                      background: "#FEE2E2",
                      color: "#B91C1C",
                      fontSize: "11px",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      marginRight: "4px",
                      marginBottom: "4px",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid #F3F4F6",
                borderRadius: "10px",
                padding: "14px",
                marginBottom: "16px",
              }}
            >
              <p
                style={{
                  color: "#6B7280",
                  fontSize: "11px",
                  fontWeight: 600,
                  marginBottom: "6px",
                  letterSpacing: "0.05em",
                }}
              >
                COVER LETTER
              </p>
              <p
                style={{ color: "#6B7280", fontSize: "13px", lineHeight: 1.7 }}
              >
                "I am excited to apply for the Senior React Developer role. With
                4 years of experience building scalable web applications using
                React and TypeScript..."
              </p>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                style={{
                  flex: 1,
                  background: "#DCFCE7",
                  color: "#15803D",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ✓ Shortlist
              </button>
              <button
                style={{
                  flex: 1,
                  background: "#EFF6FF",
                  color: "#2563EB",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                💬 Message
              </button>
              <button
                style={{
                  background: "#FEE2E2",
                  color: "#B91C1C",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                ✗
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)",
          padding: "80px 24px",
        }}
      >
        <div
          style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}
        >
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>🚀</div>
          <h2
            style={{
              color: "#fff",
              fontSize: "32px",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: "16px",
            }}
          >
            Ready to find your next great hire?
          </h2>
          <p
            style={{
              color: "#BFDBFE",
              fontSize: "16px",
              lineHeight: 1.7,
              marginBottom: "32px",
            }}
          >
            Post your first job for free. No credit card required. AI matching
            starts immediately.
          </p>
          <div
            className="cta-buttons"
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/register"
              style={{
                background: "#fff",
                color: "#1D4ED8",
                padding: "14px 36px",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "15px",
                textDecoration: "none",
              }}
            >
              Create Employer Account →
            </Link>
            <Link
              to="/login"
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
                padding: "14px 36px",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "15px",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              Sign in
            </Link>
          </div>
          <p style={{ color: "#93C5FD", fontSize: "13px", marginTop: "20px" }}>
            Free to post · AI matching included · No setup fees
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForEmployers;
