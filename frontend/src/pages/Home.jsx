import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import JobCard from "../components/JobCard";
import api from "../api/axios";

const JOB_TYPES = [
  { value: "", label: "All Types" },
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "casual", label: "Casual" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "remote", label: "Remote" },
];

const STEPS = [
  {
    number: "01",
    icon: "📄",
    title: "Upload Your Resume",
    description:
      "Upload your PDF resume once. Our AI reads and understands your skills, experience and qualifications instantly.",
  },
  {
    number: "02",
    icon: "🤖",
    title: "AI Analyses Every Job",
    description:
      "For each job you're interested in, our AI matches your resume against the requirements and calculates a precise match score.",
  },
  {
    number: "03",
    icon: "✅",
    title: "Apply with Confidence",
    description:
      "Get a personalised AI-generated cover letter, see exactly which skills you have and which to develop, then apply in one click.",
  },
];

const FEATURES = [
  {
    icon: "🎯",
    title: "Precise Match Scores",
    description:
      "Know your chances before you apply. Our AI gives you a 0–100% match score so you can focus on the right jobs.",
    color: "#DBEAFE",
    textColor: "#1D4ED8",
  },
  {
    icon: "✉️",
    title: "AI Cover Letters",
    description:
      "Never stare at a blank page again. Get a personalised, job-specific cover letter generated in seconds.",
    color: "#DCFCE7",
    textColor: "#15803D",
  },
  {
    icon: "📊",
    title: "Skills Gap Analysis",
    description:
      "See exactly which skills you have and which you're missing — with actionable tips on how to add them to your resume.",
    color: "#EDE9FE",
    textColor: "#6D28D9",
  },
  {
    icon: "💬",
    title: "Direct Messaging",
    description:
      "Message employers directly from the platform. No emails, no third-party apps — everything in one place.",
    color: "#FEF9C3",
    textColor: "#A16207",
  },
  {
    icon: "🔖",
    title: "Save Jobs",
    description:
      "Bookmark jobs you're interested in and come back to them later. Never lose track of a great opportunity.",
    color: "#CCFBF1",
    textColor: "#0F766E",
  },
  {
    icon: "🔔",
    title: "Status Notifications",
    description:
      "Get email notifications when employers review, shortlist or update your application status.",
    color: "#FEE2E2",
    textColor: "#B91C1C",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Mitchell",
    role: "Software Engineer",
    company: "Hired at Atlassian",
    avatar: "S",
    color: "linear-gradient(135deg, #1E40AF, #3B82F6)",
    text: "The AI match score was a game changer. I stopped wasting time on jobs I wasn't qualified for and focused only on roles where I had 70%+. Got hired within 3 weeks.",
    rating: 5,
  },
  {
    name: "James Okafor",
    role: "Product Manager",
    company: "Hired at Canva",
    avatar: "J",
    color: "linear-gradient(135deg, #6D28D9, #8B5CF6)",
    text: "The AI-generated cover letters were surprisingly good. I edited them slightly to add my voice but the structure and content were spot on every time.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "UX Designer",
    company: "Hired at Afterpay",
    avatar: "P",
    color: "linear-gradient(135deg, #0F766E, #14B8A6)",
    text: "The skills gap analysis showed me exactly what I needed to add to my resume. I updated my portfolio and went from 45% to 82% match on my dream job.",
    rating: 5,
  },
];

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("");
  const [activeType, setActiveType] = useState("");
  const [location, setLocation] = useState("");
  const [datePosted, setDatePosted] = useState("");
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const fetchJobs = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (jobType) params.job_type = jobType;
      if (location) params.location = location;
      if (datePosted) params.date_posted = datePosted;
      if (sort) params.sort = sort;
      const res = await api.get("/jobs/", { params });
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => fetchJobs(false), 400);
    return () => clearTimeout(delay);
  }, [search, jobType, location, datePosted, sort]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await api.get("/jobs/bookmarks/");
        setBookmarkedIds(res.data.map((j) => j.id));
      } catch {}
    };
    if (user) fetchBookmarks();
  }, [user]);

  const handleTypeFilter = (value) => {
    setActiveType(value);
    setJobType(value);
  };
  const resetFilters = () => {
    setSearch("");
    setJobType("");
    setActiveType("");
    setLocation("");
    setDatePosted("");
    setSort("newest");
  };

  const hasActiveFilters =
    search || jobType || location || datePosted || sort !== "newest";

  const featuredJobs = jobs.slice(0, 3);

  return (
    <div style={{ minHeight: "100vh", background: "#F8F7F4" }}>
      <style>{`
        input::placeholder { color: #475569; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .featured-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
        .featured-card { transition: all 0.2s ease; }
        .step-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.08) !important; }
        .step-card { transition: all 0.2s ease; }
        .feature-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important; }
        .feature-card { transition: all 0.2s ease; }
        @media (max-width: 768px) {
          .hero-featured { display: none !important; }
          .hero-content { padding: 48px 20px 60px !important; }
          .hero-title { font-size: 36px !important; }
          .stats-row { gap: 24px !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #0A0F1C 0%, #0F1923 50%, #111827 100%)",
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
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-50px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}
        >
          <div
            style={{
              display: "flex",
              gap: "48px",
              alignItems: "center",
              minHeight: "520px",
            }}
          >
            {/* Left */}
            <div
              className="hero-content"
              style={{ flex: 1, padding: "80px 0", position: "relative" }}
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
                  AI-POWERED JOB MATCHING
                </span>
              </div>

              <h1
                className="hero-title"
                style={{
                  fontSize: "52px",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  lineHeight: 1.05,
                  marginBottom: "20px",
                  letterSpacing: "-0.03em",
                }}
              >
                Find your next
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  opportunity
                </span>
                <span style={{ color: "#fff" }}> with AI</span>
              </h1>

              <p
                style={{
                  color: "#64748B",
                  fontSize: "16px",
                  marginBottom: "32px",
                  maxWidth: "460px",
                  lineHeight: 1.7,
                }}
              >
                Upload your resume once. Our AI analyses every job, generates
                personalised cover letters and shows your exact match score.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginBottom: "40px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() =>
                    document
                      .querySelector(".filter-bar")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  style={{
                    background: "#2563EB",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    padding: "14px 28px",
                    fontWeight: 600,
                    fontSize: "15px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  🔍 Browse Jobs
                </button>
                {!authLoading && !user && (
                  <Link
                    to="/register"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      color: "#F1F5F9",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "12px",
                      padding: "14px 28px",
                      fontWeight: 600,
                      fontSize: "15px",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    Get started free →
                  </Link>
                )}
              </div>

              <div
                className="stats-row"
                style={{ display: "flex", gap: "36px", flexWrap: "wrap" }}
              >
                {[
                  { value: "10K+", label: "Active Jobs" },
                  { value: "50K+", label: "Professionals" },
                  { value: "98%", label: "Match Accuracy" },
                  { value: "2min", label: "Avg. Apply Time" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div
                      style={{
                        color: "#F1F5F9",
                        fontSize: "22px",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
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

            {/* Right — featured cards */}
            <div
              className="hero-featured"
              style={{
                width: "340px",
                flexShrink: 0,
                padding: "40px 0",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <p
                style={{
                  color: "#475569",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  marginBottom: "4px",
                }}
              >
                RECENTLY POSTED
              </p>
              {loading
                ? [1, 2, 3].map((i) => (
                    <div
                      key={i}
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: "14px",
                        border: "1px solid rgba(255,255,255,0.08)",
                        padding: "16px",
                        animation: "pulse 1.5s infinite",
                      }}
                    >
                      <div
                        style={{
                          height: "14px",
                          background: "rgba(255,255,255,0.08)",
                          borderRadius: "4px",
                          width: "60%",
                          marginBottom: "8px",
                        }}
                      />
                      <div
                        style={{
                          height: "10px",
                          background: "rgba(255,255,255,0.05)",
                          borderRadius: "4px",
                          width: "40%",
                        }}
                      />
                    </div>
                  ))
                : featuredJobs.map((job) => (
                    <Link
                      key={job.id}
                      to={`/jobs/${job.id}`}
                      className="featured-card"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: "14px",
                        border: "1px solid rgba(255,255,255,0.08)",
                        padding: "16px",
                        textDecoration: "none",
                        display: "block",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "10px",
                            flexShrink: 0,
                            background:
                              "linear-gradient(135deg, #1E40AF, #3B82F6)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: "15px",
                          }}
                        >
                          {job.company?.[0]?.toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              color: "#F1F5F9",
                              fontWeight: 600,
                              fontSize: "13px",
                              marginBottom: "2px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {job.title}
                          </p>
                          <p
                            style={{
                              color: "#64748B",
                              fontSize: "12px",
                              marginBottom: "8px",
                            }}
                          >
                            {job.company}
                          </p>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              flexWrap: "wrap",
                            }}
                          >
                            <span
                              style={{
                                background: "rgba(37,99,235,0.2)",
                                color: "#93C5FD",
                                fontSize: "10px",
                                fontWeight: 600,
                                padding: "2px 8px",
                                borderRadius: "999px",
                              }}
                            >
                              {job.job_type?.replace("_", " ").toUpperCase()}
                            </span>
                            <span
                              style={{ color: "#475569", fontSize: "11px" }}
                            >
                              📍 {job.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              {!loading && featuredJobs.length === 0 && (
                <div
                  style={{
                    color: "#475569",
                    fontSize: "13px",
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  No jobs posted yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div style={{ background: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
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
                fontSize: "36px",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginTop: "16px",
                marginBottom: "12px",
              }}
            >
              Land your dream job in 3 steps
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
              finding the right role.
            </p>
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
                className="step-card"
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
                    top: "20px",
                    right: "24px",
                    color: "#E5E7EB",
                    fontSize: "48px",
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {step.number}
                </div>
                <div style={{ fontSize: "40px", marginBottom: "20px" }}>
                  {step.icon}
                </div>
                <h3
                  style={{
                    color: "#111827",
                    fontSize: "18px",
                    fontWeight: 700,
                    marginBottom: "12px",
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

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            {!user ? (
              <Link
                to="/register"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#111827",
                  color: "#fff",
                  padding: "14px 32px",
                  borderRadius: "12px",
                  fontWeight: 600,
                  fontSize: "15px",
                  textDecoration: "none",
                }}
              >
                Get started free →
              </Link>
            ) : (
              <Link
                to="/"
                onClick={() =>
                  window.scrollTo({
                    top:
                      document.querySelector(".filter-bar")?.offsetTop || 600,
                    behavior: "smooth",
                  })
                }
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#111827",
                  color: "#fff",
                  padding: "14px 32px",
                  borderRadius: "12px",
                  fontWeight: 600,
                  fontSize: "15px",
                  textDecoration: "none",
                }}
              >
                Browse jobs →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div style={{ background: "#F8F7F4", padding: "80px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
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
                fontSize: "36px",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginTop: "16px",
                marginBottom: "12px",
              }}
            >
              Everything you need to get hired
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
              Built for job seekers who want to work smarter, not harder.
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
                className="feature-card"
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "28px",
                  border: "1px solid #F3F4F6",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: feature.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    marginBottom: "16px",
                  }}
                >
                  {feature.icon}
                </div>
                <h3
                  style={{
                    color: "#111827",
                    fontSize: "16px",
                    fontWeight: 700,
                    marginBottom: "8px",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    color: "#6B7280",
                    fontSize: "14px",
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

      {/* ── TESTIMONIALS ── */}
      <div style={{ background: "#0F1923", padding: "80px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span
              style={{
                background: "rgba(37,99,235,0.2)",
                color: "#93C5FD",
                fontSize: "11px",
                fontWeight: 700,
                padding: "5px 16px",
                borderRadius: "999px",
                letterSpacing: "0.08em",
              }}
            >
              TESTIMONIALS
            </span>
            <h2
              style={{
                color: "#F1F5F9",
                fontSize: "36px",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginTop: "16px",
                marginBottom: "12px",
              }}
            >
              People who found their dream job
            </h2>
            <p
              style={{
                color: "#64748B",
                fontSize: "16px",
                maxWidth: "480px",
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              Join thousands of professionals who've used JobPortal AI to land
              their next role.
            </p>
          </div>

          <div
            className="testimonials-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "20px",
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "20px",
                  padding: "28px",
                }}
              >
                <div
                  style={{ display: "flex", gap: "4px", marginBottom: "16px" }}
                >
                  {[...Array(t.rating)].map((_, j) => (
                    <span
                      key={j}
                      style={{ color: "#F59E0B", fontSize: "14px" }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p
                  style={{
                    color: "#CBD5E1",
                    fontSize: "14px",
                    lineHeight: 1.8,
                    marginBottom: "24px",
                    fontStyle: "italic",
                  }}
                >
                  "{t.text}"
                </p>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: t.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "16px",
                      flexShrink: 0,
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p
                      style={{
                        color: "#F1F5F9",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      {t.name}
                    </p>
                    <p style={{ color: "#64748B", fontSize: "12px" }}>
                      {t.role} · {t.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
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
          style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center" }}
        >
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>🚀</div>
          <h2
            style={{
              color: "#fff",
              fontSize: "36px",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: "16px",
            }}
          >
            Ready to find your next opportunity?
          </h2>
          <p
            style={{
              color: "#BFDBFE",
              fontSize: "16px",
              lineHeight: 1.7,
              marginBottom: "32px",
            }}
          >
            Join thousands of job seekers using AI to find better jobs, faster.
            It's free to get started.
          </p>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {!user ? (
              <>
                <Link
                  to="/register"
                  style={{
                    background: "#fff",
                    color: "#1D4ED8",
                    padding: "14px 32px",
                    borderRadius: "12px",
                    fontWeight: 700,
                    fontSize: "15px",
                    textDecoration: "none",
                  }}
                >
                  Create free account →
                </Link>
                <Link
                  to="/login"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    color: "#fff",
                    padding: "14px 32px",
                    borderRadius: "12px",
                    fontWeight: 600,
                    fontSize: "15px",
                    textDecoration: "none",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  Sign in
                </Link>
              </>
            ) : (
              <Link
                to="/"
                onClick={() =>
                  window.scrollTo({
                    top:
                      document.querySelector(".filter-bar")?.offsetTop || 600,
                    behavior: "smooth",
                  })
                }
                style={{
                  background: "#fff",
                  color: "#1D4ED8",
                  padding: "14px 32px",
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "15px",
                  textDecoration: "none",
                }}
              >
                Browse open jobs →
              </Link>
            )}
          </div>
          <p style={{ color: "#93C5FD", fontSize: "13px", marginTop: "20px" }}>
            No credit card required · 3 free AI analyses · Cancel anytime
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div
        className="filter-bar"
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #E5E7EB",
          position: "sticky",
          top: "60px",
          zIndex: 40,
        }}
      >
        <div
          style={{ maxWidth: "1100px", margin: "0 auto", padding: "12px 24px" }}
        >
          {/* Row 1 — Search inputs + filters */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            {/* Combined search bar */}
            <div
              style={{
                display: "flex",
                flex: 1,
                minWidth: "300px",
                background: "#F9FAFB",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              {/* Job title / keyword */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 14px",
                  gap: "8px",
                }}
              >
                <span
                  style={{ fontSize: "14px", color: "#9CA3AF", flexShrink: 0 }}
                >
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Job title, keywords or company"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
                  style={{
                    flex: 1,
                    border: "none",
                    background: "transparent",
                    fontSize: "13px",
                    color: "#111827",
                    outline: "none",
                    padding: "10px 0",
                  }}
                />
              </div>

              {/* Divider */}
              <div
                style={{ width: "1px", background: "#E5E7EB", margin: "8px 0" }}
              />

              {/* Location */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 14px",
                  gap: "8px",
                }}
              >
                <span
                  style={{ fontSize: "14px", color: "#9CA3AF", flexShrink: 0 }}
                >
                  📍
                </span>
                <input
                  type="text"
                  placeholder="Location e.g. Sydney NSW"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
                  style={{
                    flex: 1,
                    border: "none",
                    background: "transparent",
                    fontSize: "13px",
                    color: "#111827",
                    outline: "none",
                    padding: "10px 0",
                  }}
                />
                {location && (
                  <button
                    onClick={() => setLocation("")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#9CA3AF",
                      fontSize: "16px",
                      padding: 0,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Search button */}
              <button
                onClick={fetchJobs}
                style={{
                  background: "#2563EB",
                  color: "#fff",
                  border: "none",
                  padding: "0 20px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Find Jobs
              </button>
            </div>

            {/* Sort dropdown */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                padding: "10px 12px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                border: "1px solid #E5E7EB",
                background: "#fff",
                color: "#6B7280",
                outline: "none",
                flexShrink: 0,
              }}
            >
              <option value="newest">🕐 Newest</option>
              <option value="oldest">🕐 Oldest</option>
              <option value="most_applicants">👥 Most Applicants</option>
              <option value="salary_high">💰 Salary High-Low</option>
              <option value="salary_low">💰 Salary Low-High</option>
            </select>
          </div>

          {/* Row 2 — Job type pills + date filter */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "10px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "4px",
                overflowX: "auto",
                scrollbarWidth: "none",
                flex: 1,
              }}
            >
              {JOB_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleTypeFilter(type.value)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "999px",
                    whiteSpace: "nowrap",
                    fontSize: "12px",
                    fontWeight: 500,
                    cursor: "pointer",
                    border:
                      activeType === type.value
                        ? "1px solid #0F1923"
                        : "1px solid #E5E7EB",
                    background:
                      activeType === type.value ? "#0F1923" : "transparent",
                    color: activeType === type.value ? "#FFFFFF" : "#6B7280",
                    transition: "all 0.15s",
                    flexShrink: 0,
                  }}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Date posted */}
            <select
              value={datePosted}
              onChange={(e) => setDatePosted(e.target.value)}
              style={{
                padding: "6px 12px",
                borderRadius: "999px",
                fontSize: "12px",
                border: "1px solid #E5E7EB",
                background: "#fff",
                color: datePosted ? "#111827" : "#6B7280",
                outline: "none",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <option value="">📅 Any time</option>
              <option value="today">📅 Last 24 hours</option>
              <option value="week">📅 Last 7 days</option>
              <option value="month">📅 Last 30 days</option>
            </select>

            {/* Reset */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                style={{
                  padding: "6px 14px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: 500,
                  cursor: "pointer",
                  border: "1px solid #FECACA",
                  background: "#FEF2F2",
                  color: "#B91C1C",
                  flexShrink: 0,
                }}
              >
                ✕ Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── JOB LISTINGS ── */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "32px 24px",
          minHeight: "400px",
        }}
      >
        {!loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <p style={{ color: "#6B7280", fontSize: "14px" }}>
              <span style={{ color: "#111827", fontWeight: 600 }}>
                {jobs.length}
              </span>{" "}
              job{jobs.length !== 1 ? "s" : ""} found
              {search && (
                <span>
                  {" "}
                  for <span style={{ color: "#2563EB" }}>"{search}"</span>
                </span>
              )}
            </p>
            <span
              style={{
                fontSize: "12px",
                color: "#9CA3AF",
                background: "#F3F4F6",
                padding: "4px 12px",
                borderRadius: "999px",
              }}
            >
              Updated just now
            </span>
          </div>
        )}

        {loading && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "24px",
                  border: "1px solid #F3F4F6",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: "#F3F4F6",
                      flexShrink: 0,
                      animation: "pulse 1.5s infinite",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        height: "16px",
                        background: "#F3F4F6",
                        borderRadius: "4px",
                        width: "40%",
                        marginBottom: "8px",
                      }}
                    />
                    <div
                      style={{
                        height: "12px",
                        background: "#F9FAFB",
                        borderRadius: "4px",
                        width: "25%",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && jobs.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 24px",
              background: "#fff",
              borderRadius: "20px",
              border: "1px solid #F3F4F6",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <h3
              style={{ color: "#111827", fontWeight: 600, marginBottom: "8px" }}
            >
              No jobs found
            </h3>
            <p
              style={{
                color: "#9CA3AF",
                fontSize: "14px",
                marginBottom: "16px",
              }}
            >
              Try a different search term or adjust your filters
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                style={{
                  background: "#111827",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px 24px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Reset filters
              </button>
            )}
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "12px",
            }}
          >
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                bookmarkedIds={bookmarkedIds}
                onBookmarkChange={() => {
                  api
                    .get("/jobs/bookmarks/")
                    .then((res) => setBookmarkedIds(res.data.map((j) => j.id)))
                    .catch(() => {});
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
