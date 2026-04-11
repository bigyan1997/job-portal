import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const JobDetail = () => {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasApplied, setHasApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  const [analysingMessage, setAnalysingMessage] = useState("Analysing...");
  const [analysis, setAnalysis] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [analyseError, setAnalyseError] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (user?.is_pro) setLimitReached(false);
  }, [user]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}/`);
        setJob(res.data);
        if (user?.role === "jobseeker") {
          const applications = await api.get("/jobs/applications/");
          const applied = applications.data.some(
            (app) => app.job.id === parseInt(id),
          );
          setHasApplied(applied);
        }
      } catch {
        setError("Job not found");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, user]);

  const handleAnalyse = async () => {
    setAnalyseError("");
    setLimitReached(false);
    setAnalysing(true);
    setAnalysingMessage("Reading your resume...");

    const messages = [
      "Reading your resume...",
      "Matching skills to job requirements...",
      "Calculating match score...",
      "Generating cover letter...",
      "Almost done...",
    ];

    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < messages.length) {
        setAnalysingMessage(messages[i]);
      }
    }, 4000);

    try {
      const res = await api.post("/jobs/analyse/", { job_id: id });
      clearInterval(interval);
      setAnalysis(res.data);
      setCoverLetter(res.data.cover_letter);
      const updatedUser = await api.get("/auth/me/");
      updateUser(updatedUser.data);
    } catch (err) {
      clearInterval(interval);
      if (err.response?.status === 402) {
        setLimitReached(true);
      } else {
        setAnalyseError(err.response?.data?.error || "Analysis failed");
      }
    } finally {
      setAnalysing(false);
    }
  };

  const handleSuggestImprovements = async () => {
    // If already fetched, just toggle visibility
    if (suggestions) {
      setShowSuggestions((prev) => !prev);
      return;
    }
    setSuggestionsLoading(true);
    setShowSuggestions(true);
    try {
      const res = await api.post("/jobs/suggest-improvements/", {
        job_id: id,
        missing_skills: analysis.missing_skills,
      });
      setSuggestions(res.data);
    } catch (err) {
      alert("Failed to get suggestions");
      setShowSuggestions(false);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const handleApply = async (overrideCoverLetter) => {
    setApplying(true);
    const letter =
      overrideCoverLetter !== undefined ? overrideCoverLetter : coverLetter;
    try {
      await api.post("/jobs/applications/", {
        job_id: id,
        cover_letter: letter,
        match_score: analysis?.match_score ?? null,
        matching_skills: analysis?.matching_skills?.join(", ") ?? "",
        missing_skills: analysis?.missing_skills?.join(", ") ?? "",
      });
      navigate("/dashboard", {
        state: { message: "Application submitted successfully!" },
      });
    } catch (err) {
      alert(err.response?.data?.error || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return null;
    if (min && max)
      return `$${Number(min).toLocaleString()} – $${Number(max).toLocaleString()}`;
    if (min) return `From $${Number(min).toLocaleString()}`;
    return `Up to $${Number(max).toLocaleString()}`;
  };

  const JOB_TYPE_STYLES = {
    full_time: { bg: "#DCFCE7", text: "#15803D", label: "Full Time" },
    part_time: { bg: "#FEF9C3", text: "#A16207", label: "Part Time" },
    contract: { bg: "#EDE9FE", text: "#6D28D9", label: "Contract" },
    internship: { bg: "#DBEAFE", text: "#1D4ED8", label: "Internship" },
    remote: { bg: "#CCFBF1", text: "#0F766E", label: "Remote" },
  };

  const typeStyle = job
    ? JOB_TYPE_STYLES[job.job_type] || {
        bg: "#F3F4F6",
        text: "#374151",
        label: job?.job_type,
      }
    : {};

  const Paywall = () => (
    <div
      style={{
        background: "#0F1923",
        borderRadius: "16px",
        padding: "32px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "32px", marginBottom: "12px" }}>⚡</div>
      <h3
        style={{
          color: "#F1F5F9",
          fontSize: "18px",
          fontWeight: 700,
          marginBottom: "8px",
        }}
      >
        You've used all 3 free analyses
      </h3>
      <p style={{ color: "#64748B", fontSize: "14px", marginBottom: "24px" }}>
        Upgrade to Pro for unlimited AI resume analyses, cover letters and match
        scores
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            padding: "16px",
            textAlign: "center",
          }}
        >
          <p
            style={{ color: "#64748B", fontSize: "12px", marginBottom: "4px" }}
          >
            Free
          </p>
          <p style={{ color: "#F1F5F9", fontSize: "24px", fontWeight: 700 }}>
            $0
          </p>
          <p style={{ color: "#475569", fontSize: "12px" }}>3 analyses</p>
        </div>
        <div
          style={{
            background: "linear-gradient(135deg, #1D4ED8, #2563EB)",
            borderRadius: "12px",
            padding: "16px",
            textAlign: "center",
          }}
        >
          <p
            style={{ color: "#BFDBFE", fontSize: "12px", marginBottom: "4px" }}
          >
            Pro
          </p>
          <p style={{ color: "#fff", fontSize: "24px", fontWeight: 700 }}>
            $14.99
          </p>
          <p style={{ color: "#93C5FD", fontSize: "12px" }}>unlimited</p>
        </div>
      </div>
      <Link
        to="/subscription"
        style={{
          display: "block",
          background: "#2563EB",
          color: "#fff",
          padding: "12px",
          borderRadius: "10px",
          fontWeight: 600,
          fontSize: "14px",
          textDecoration: "none",
          marginBottom: "8px",
        }}
      >
        ⚡ Upgrade to Pro — $14.99/month
      </Link>
      <p style={{ color: "#475569", fontSize: "12px" }}>
        Cancel anytime · Secure payment via Stripe
      </p>
    </div>
  );

  if (loading) {
    return (
      <div
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" }}
      >
        <div
          style={{
            height: "20px",
            background: "#F3F4F6",
            borderRadius: "4px",
            width: "30%",
            marginBottom: "32px",
          }}
        />
        <div
          style={{
            height: "200px",
            background: "#F9FAFB",
            borderRadius: "16px",
          }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>😕</div>
        <h3 style={{ color: "#111827", fontWeight: 600, marginBottom: "8px" }}>
          Job not found
        </h3>
        <Link
          to="/"
          style={{ color: "#2563EB", fontSize: "14px", textDecoration: "none" }}
        >
          ← Back to jobs
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F8F7F4" }}>
      <style>{`
      @media (max-width: 768px) {
        .skills-grid-detail { grid-template-columns: 1fr !important; }
      }
    `}</style>
      {/* Header */}
      <div style={{ background: "#0F1923", padding: "40px 24px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              color: "#64748B",
              fontSize: "13px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            ← Back to jobs
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <div style={{ flex: 1 }}>
              {/* Company avatar + name */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #1E40AF, #3B82F6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "18px",
                    flexShrink: 0,
                  }}
                >
                  {job.company[0].toUpperCase()}
                </div>
                <p style={{ color: "#94A3B8", fontSize: "14px" }}>
                  {job.company}
                </p>
              </div>

              <h1
                style={{
                  color: "#F1F5F9",
                  fontSize: "28px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  marginBottom: "16px",
                }}
              >
                {job.title}
              </h1>

              {/* Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <span
                  style={{
                    background: typeStyle.bg,
                    color: typeStyle.text,
                    fontSize: "12px",
                    fontWeight: 600,
                    padding: "5px 14px",
                    borderRadius: "999px",
                  }}
                >
                  {typeStyle.label}
                </span>
                <span
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "#94A3B8",
                    fontSize: "12px",
                    padding: "5px 14px",
                    borderRadius: "999px",
                  }}
                >
                  📍 {job.location}
                </span>
                {formatSalary(job.salary_min, job.salary_max) && (
                  <span
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      color: "#94A3B8",
                      fontSize: "12px",
                      padding: "5px 14px",
                      borderRadius: "999px",
                    }}
                  >
                    💰 {formatSalary(job.salary_min, job.salary_max)}
                  </span>
                )}
                <span
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "#94A3B8",
                    fontSize: "12px",
                    padding: "5px 14px",
                    borderRadius: "999px",
                  }}
                >
                  👥 {job.application_count} applicant
                  {job.application_count !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        style={{ maxWidth: "760px", margin: "0 auto", padding: "32px 24px" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Description */}
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #F3F4F6",
              padding: "28px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <p
                style={{
                  color: "#111827",
                  fontSize: "15px",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                About this role
              </p>
              <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
            </div>
            <p
              style={{
                color: "#6B7280",
                fontSize: "14px",
                lineHeight: 1.9,
                whiteSpace: "pre-line",
              }}
            >
              {job.description}
            </p>
          </div>

          {/* Requirements */}
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #F3F4F6",
              padding: "28px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <p
                style={{
                  color: "#111827",
                  fontSize: "15px",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                Requirements
              </p>
              <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
            </div>
            <p
              style={{
                color: "#6B7280",
                fontSize: "14px",
                lineHeight: 1.9,
                whiteSpace: "pre-line",
              }}
            >
              {job.requirements}
            </p>
          </div>

          {/* Not logged in */}
          {!user && (
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                border: "1px solid #F3F4F6",
                padding: "32px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔐</div>
              <p
                style={{
                  color: "#111827",
                  fontWeight: 600,
                  fontSize: "16px",
                  marginBottom: "8px",
                }}
              >
                Sign in to apply
              </p>
              <p
                style={{
                  color: "#9CA3AF",
                  fontSize: "14px",
                  marginBottom: "20px",
                }}
              >
                Analyse your resume and apply with an AI cover letter
              </p>
              <Link
                to="/login"
                style={{
                  display: "inline-block",
                  background: "#111827",
                  color: "#fff",
                  padding: "12px 32px",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: "14px",
                  textDecoration: "none",
                }}
              >
                Sign in to apply
              </Link>
            </div>
          )}

          {/* Employer view */}
          {user?.role === "employer" && (
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                border: "1px solid #F3F4F6",
                padding: "24px",
                textAlign: "center",
              }}
            >
              <p style={{ color: "#9CA3AF", fontSize: "14px" }}>
                Employers cannot apply to jobs
              </p>
            </div>
          )}

          {/* Already applied */}
          {user?.role === "jobseeker" && hasApplied && (
            <div
              style={{
                background: "#F0FDF4",
                borderRadius: "16px",
                border: "1px solid #BBF7D0",
                padding: "32px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>✅</div>
              <p
                style={{
                  color: "#15803D",
                  fontWeight: 600,
                  fontSize: "16px",
                  marginBottom: "8px",
                }}
              >
                Already applied!
              </p>
              <Link
                to="/dashboard"
                style={{
                  color: "#15803D",
                  fontSize: "14px",
                  textDecoration: "none",
                  fontWeight: 500,
                  display: "block",
                  marginBottom: "12px",
                }}
              >
                View your application →
              </Link>
              <button
                onClick={async () => {
                  try {
                    const res = await api.post(
                      "/messaging/conversations/start/",
                      {
                        user_id: job.employer_id,
                        job_id: id,
                      },
                    );
                    navigate(`/messages?conv=${res.data.conversation_id}`);
                  } catch (err) {
                    alert("Failed to start conversation");
                  }
                }}
                style={{
                  background: "#111827",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px 24px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                💬 Message Employer
              </button>
            </div>
          )}

          {/* Jobseeker — not applied yet */}
          {user?.role === "jobseeker" && !hasApplied && (
            <>
              {/* No resume */}
              {!user?.resume && (
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    border: "1px solid #F3F4F6",
                    padding: "32px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "36px", marginBottom: "12px" }}>
                    📄
                  </div>
                  <p
                    style={{
                      color: "#111827",
                      fontWeight: 600,
                      fontSize: "16px",
                      marginBottom: "8px",
                    }}
                  >
                    No resume uploaded
                  </p>
                  <p
                    style={{
                      color: "#9CA3AF",
                      fontSize: "14px",
                      marginBottom: "20px",
                    }}
                  >
                    Upload your resume to analyse and apply to jobs
                  </p>
                  <Link
                    to="/dashboard"
                    style={{
                      display: "inline-block",
                      background: "#111827",
                      color: "#fff",
                      padding: "12px 32px",
                      borderRadius: "10px",
                      fontWeight: 600,
                      fontSize: "14px",
                      textDecoration: "none",
                    }}
                  >
                    Upload Resume →
                  </Link>
                </div>
              )}

              {/* Has resume — paywall or analyse button */}
              {user?.resume && !analysis && (
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    border: "1px solid #F3F4F6",
                    padding: "28px",
                  }}
                >
                  {(!user?.is_pro && user?.ai_analyses_used >= 3) ||
                  limitReached ? (
                    /* Paywall */
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "36px", marginBottom: "12px" }}>
                        ⚡
                      </div>
                      <h3
                        style={{
                          color: "#111827",
                          fontSize: "18px",
                          fontWeight: 700,
                          marginBottom: "8px",
                        }}
                      >
                        You've used all 3 free analyses
                      </h3>
                      <p
                        style={{
                          color: "#6B7280",
                          fontSize: "14px",
                          marginBottom: "24px",
                        }}
                      >
                        Upgrade to Pro for unlimited AI resume analyses, cover
                        letters and match scores
                      </p>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "12px",
                          maxWidth: "400px",
                          margin: "0 auto 20px",
                        }}
                      >
                        <div
                          style={{
                            background: "#F9FAFB",
                            border: "1px solid #F3F4F6",
                            borderRadius: "12px",
                            padding: "20px",
                            textAlign: "center",
                          }}
                        >
                          <p
                            style={{
                              color: "#6B7280",
                              fontSize: "13px",
                              marginBottom: "4px",
                            }}
                          >
                            Free
                          </p>
                          <p
                            style={{
                              color: "#111827",
                              fontSize: "28px",
                              fontWeight: 700,
                            }}
                          >
                            $0
                          </p>
                          <p style={{ color: "#9CA3AF", fontSize: "13px" }}>
                            3 analyses
                          </p>
                        </div>
                        <div
                          style={{
                            background:
                              "linear-gradient(135deg, #1D4ED8, #2563EB)",
                            borderRadius: "12px",
                            padding: "20px",
                            textAlign: "center",
                          }}
                        >
                          <p
                            style={{
                              color: "#BFDBFE",
                              fontSize: "13px",
                              marginBottom: "4px",
                            }}
                          >
                            Pro
                          </p>
                          <p
                            style={{
                              color: "#fff",
                              fontSize: "28px",
                              fontWeight: 700,
                            }}
                          >
                            $14.99
                          </p>
                          <p style={{ color: "#93C5FD", fontSize: "13px" }}>
                            unlimited
                          </p>
                        </div>
                      </div>
                      <Link
                        to="/subscription"
                        style={{
                          display: "inline-block",
                          background: "#2563EB",
                          color: "#fff",
                          padding: "13px 40px",
                          borderRadius: "10px",
                          fontWeight: 600,
                          fontSize: "15px",
                          textDecoration: "none",
                          marginBottom: "8px",
                        }}
                      >
                        ⚡ Upgrade to Pro — $14.99/month
                      </Link>
                      <p
                        style={{
                          color: "#9CA3AF",
                          fontSize: "12px",
                          marginTop: "8px",
                        }}
                      >
                        Cancel anytime · Secure payment via Stripe
                      </p>
                    </div>
                  ) : (
                    /* Analyse button */
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "40px", marginBottom: "16px" }}>
                        🤖
                      </div>
                      <p
                        style={{
                          color: "#111827",
                          fontWeight: 700,
                          fontSize: "18px",
                          marginBottom: "8px",
                        }}
                      >
                        Ready to analyse your resume
                      </p>
                      <p
                        style={{
                          color: "#9CA3AF",
                          fontSize: "14px",
                          marginBottom: "24px",
                        }}
                      >
                        Our AI will match your resume against this job and
                        generate a personalised cover letter
                      </p>
                      {analyseError && (
                        <p
                          style={{
                            color: "#EF4444",
                            fontSize: "13px",
                            marginBottom: "12px",
                          }}
                        >
                          {analyseError}
                        </p>
                      )}
                      <button
                        onClick={handleAnalyse}
                        disabled={analysing}
                        style={{
                          background: analysing ? "#93C5FD" : "#111827",
                          color: "#fff",
                          border: "none",
                          borderRadius: "10px",
                          padding: "14px 40px",
                          fontSize: "15px",
                          fontWeight: 600,
                          cursor: analysing ? "not-allowed" : "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {analysing ? (
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
                            {analysingMessage}
                          </>
                        ) : (
                          <>
                            🔍 Analyse my resume for this job
                            {!user?.is_pro && (
                              <span
                                style={{
                                  background: "rgba(255,255,255,0.15)",
                                  fontSize: "12px",
                                  padding: "2px 10px",
                                  borderRadius: "999px",
                                }}
                              >
                                {Math.max(0, 3 - (user?.ai_analyses_used || 0))}{" "}
                                left
                              </span>
                            )}
                          </>
                        )}
                      </button>
                      {analysing && (
                        <p
                          style={{
                            color: "#9CA3AF",
                            fontSize: "12px",
                            marginTop: "12px",
                          }}
                        >
                          This usually takes 15–30 seconds. Please don't refresh
                          the page.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Analysis results */}
              {analysis && (
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    border: "1px solid #F3F4F6",
                    padding: "28px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "24px",
                    }}
                  >
                    <p
                      style={{
                        color: "#111827",
                        fontSize: "15px",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      AI Analysis Results
                    </p>
                    <div
                      style={{ flex: 1, height: "1px", background: "#E5E7EB" }}
                    />
                  </div>

                  {/* Match score */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                      marginBottom: "24px",
                      padding: "20px",
                      background: "#F9FAFB",
                      borderRadius: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "50%",
                        flexShrink: 0,
                        border: `4px solid ${analysis.match_score >= 70 ? "#22C55E" : analysis.match_score >= 40 ? "#EAB308" : "#EF4444"}`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color:
                          analysis.match_score >= 70
                            ? "#15803D"
                            : analysis.match_score >= 40
                              ? "#A16207"
                              : "#B91C1C",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: 700,
                          lineHeight: 1,
                        }}
                      >
                        {analysis.match_score}%
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          color: "#9CA3AF",
                          marginTop: "2px",
                        }}
                      >
                        match
                      </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          color: "#111827",
                          fontWeight: 600,
                          fontSize: "15px",
                          marginBottom: "8px",
                        }}
                      >
                        {analysis.match_score >= 70
                          ? "Strong match!"
                          : analysis.match_score >= 40
                            ? "Moderate match"
                            : "Low match"}
                      </p>
                      <div
                        style={{
                          background: "#E5E7EB",
                          borderRadius: "999px",
                          height: "8px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            borderRadius: "999px",
                            width: `${analysis.match_score}%`,
                            background:
                              analysis.match_score >= 70
                                ? "#22C55E"
                                : analysis.match_score >= 40
                                  ? "#EAB308"
                                  : "#EF4444",
                          }}
                        />
                      </div>
                      <p
                        style={{
                          color: "#9CA3AF",
                          fontSize: "12px",
                          marginTop: "6px",
                        }}
                      >
                        {analysis.match_score >= 70
                          ? "You meet most of the requirements for this role"
                          : analysis.match_score >= 40
                            ? "You meet some requirements — consider upskilling"
                            : "This role may be a stretch — consider other options"}
                      </p>
                    </div>
                  </div>

                  {/* Skills grid */}
                  <div
                    className="skills-grid-detail"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "20px",
                      marginBottom: "24px",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          color: "#6B7280",
                          fontSize: "11px",
                          fontWeight: 600,
                          marginBottom: "10px",
                          letterSpacing: "0.05em",
                        }}
                      >
                        ✅ SKILLS YOU HAVE
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        {analysis.matching_skills.map((skill, i) => (
                          <span
                            key={i}
                            style={{
                              background: "#DCFCE7",
                              color: "#15803D",
                              fontSize: "11px",
                              padding: "4px 10px",
                              borderRadius: "8px",
                              display: "block",
                              wordBreak: "break-word",
                              lineHeight: 1.5,
                              marginBottom: "4px",
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p
                        style={{
                          color: "#6B7280",
                          fontSize: "11px",
                          fontWeight: 600,
                          marginBottom: "10px",
                          letterSpacing: "0.05em",
                        }}
                      >
                        ❌ SKILLS TO DEVELOP
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        {analysis.missing_skills.map((skill, i) => (
                          <span
                            key={i}
                            style={{
                              background: "#FEE2E2",
                              color: "#B91C1C",
                              fontSize: "11px",
                              padding: "4px 10px",
                              borderRadius: "8px",
                              display: "block",
                              wordBreak: "break-word",
                              lineHeight: 1.5,
                              marginBottom: "4px",
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Improve resume button */}
                  {analysis.missing_skills.length > 0 && (
                    <div style={{ marginBottom: "24px" }}>
                      <button
                        onClick={handleSuggestImprovements}
                        disabled={suggestionsLoading}
                        style={{
                          width: "100%",
                          background:
                            "linear-gradient(135deg, #1D4ED8, #2563EB)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "10px",
                          padding: "14px",
                          fontSize: "14px",
                          fontWeight: 600,
                          cursor: suggestionsLoading
                            ? "not-allowed"
                            : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                      >
                        {suggestionsLoading ? (
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
                            Generating suggestions...
                          </>
                        ) : (
                          <>
                            {showSuggestions
                              ? "Hide suggestions ↑"
                              : "✨ How to add missing skills to my resume"}
                          </>
                        )}
                      </button>

                      {/* Suggestions panel */}
                      {showSuggestions && suggestions && (
                        <div
                          style={{
                            marginTop: "16px",
                            background: "#F8F7FF",
                            border: "1px solid #DDD6FE",
                            borderRadius: "12px",
                            padding: "20px",
                          }}
                        >
                          <p
                            style={{
                              color: "#5B21B6",
                              fontSize: "13px",
                              fontWeight: 700,
                              marginBottom: "16px",
                              letterSpacing: "0.05em",
                            }}
                          >
                            ✨ AI RESUME IMPROVEMENT SUGGESTIONS
                          </p>

                          {suggestions.general_tips && (
                            <div
                              style={{
                                background: "#EDE9FE",
                                borderRadius: "8px",
                                padding: "12px 14px",
                                marginBottom: "16px",
                              }}
                            >
                              <p
                                style={{
                                  color: "#5B21B6",
                                  fontSize: "13px",
                                  lineHeight: 1.6,
                                }}
                              >
                                💡 {suggestions.general_tips}
                              </p>
                            </div>
                          )}

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "12px",
                            }}
                          >
                            {suggestions.suggestions?.map((s, i) => (
                              <div
                                key={i}
                                style={{
                                  background: "#fff",
                                  border: "1px solid #DDD6FE",
                                  borderRadius: "10px",
                                  padding: "16px",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: "8px",
                                  }}
                                >
                                  <span
                                    style={{
                                      background: "#EDE9FE",
                                      color: "#5B21B6",
                                      fontSize: "11px",
                                      fontWeight: 700,
                                      padding: "3px 10px",
                                      borderRadius: "999px",
                                    }}
                                  >
                                    {s.skill}
                                  </span>
                                  <span
                                    style={{
                                      color: "#9CA3AF",
                                      fontSize: "11px",
                                    }}
                                  >
                                    📍 {s.where_to_add}
                                  </span>
                                </div>
                                <p
                                  style={{
                                    color: "#374151",
                                    fontSize: "13px",
                                    lineHeight: 1.6,
                                    marginBottom: "8px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  "{s.suggested_text}"
                                </p>
                                {s.tip && (
                                  <p
                                    style={{
                                      color: "#6B7280",
                                      fontSize: "12px",
                                      lineHeight: 1.5,
                                    }}
                                  >
                                    💬 {s.tip}
                                  </p>
                                )}
                                <button
                                  onClick={() =>
                                    navigator.clipboard.writeText(
                                      s.suggested_text,
                                    )
                                  }
                                  style={{
                                    marginTop: "8px",
                                    color: "#2563EB",
                                    fontSize: "12px",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    fontWeight: 500,
                                  }}
                                >
                                  Copy →
                                </button>
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={() => setShowSuggestions(false)}
                            style={{
                              marginTop: "12px",
                              color: "#9CA3AF",
                              fontSize: "12px",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              width: "100%",
                              textAlign: "center",
                            }}
                          >
                            Hide suggestions
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Cover letter */}
                  <div style={{ marginBottom: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                      }}
                    >
                      <p
                        style={{
                          color: "#6B7280",
                          fontSize: "11px",
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                        }}
                      >
                        🤖 AI GENERATED COVER LETTER
                      </p>
                      <span style={{ color: "#9CA3AF", fontSize: "12px" }}>
                        You can edit this before applying
                      </span>
                    </div>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={10}
                      style={{
                        width: "100%",
                        border: "1px solid #E5E7EB",
                        borderRadius: "10px",
                        padding: "14px 16px",
                        fontSize: "13px",
                        color: "#6B7280",
                        lineHeight: 1.8,
                        resize: "vertical",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  {/* Apply buttons */}
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <button
                      onClick={handleApply}
                      disabled={applying}
                      style={{
                        flex: 1,
                        background: applying ? "#93C5FD" : "#111827",
                        color: "#fff",
                        border: "none",
                        borderRadius: "10px",
                        padding: "14px",
                        fontSize: "15px",
                        fontWeight: 600,
                        cursor: applying ? "not-allowed" : "pointer",
                      }}
                    >
                      {applying
                        ? "Submitting..."
                        : "✅ Apply with cover letter"}
                    </button>
                    <button
                      onClick={() => handleApply("")}
                      disabled={applying}
                      style={{
                        flex: 1,
                        background: "transparent",
                        color: "#6B7280",
                        border: "1px solid #E5E7EB",
                        borderRadius: "10px",
                        padding: "14px",
                        fontSize: "14px",
                        fontWeight: 500,
                        cursor: applying ? "not-allowed" : "pointer",
                      }}
                    >
                      Apply without cover letter
                    </button>
                  </div>

                  {/* Re-analyse */}
                  {(!limitReached || user?.is_pro) && (
                    <button
                      onClick={handleAnalyse}
                      disabled={analysing}
                      style={{
                        color: "#9CA3AF",
                        fontSize: "13px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        width: "100%",
                        textAlign: "center",
                      }}
                    >
                      {user?.is_pro
                        ? "⚡ Re-analyse →"
                        : `Re-analyse → (${Math.max(0, 3 - (user?.ai_analyses_used || 0))} left)`}
                    </button>
                  )}

                  {limitReached && !user?.is_pro && (
                    <div
                      style={{
                        background: "#F9FAFB",
                        borderRadius: "10px",
                        padding: "14px",
                        textAlign: "center",
                        marginTop: "8px",
                      }}
                    >
                      <p
                        style={{
                          color: "#374151",
                          fontSize: "13px",
                          fontWeight: 600,
                          marginBottom: "4px",
                        }}
                      >
                        ⚡ Upgrade for unlimited re-analyses
                      </p>
                      <Link
                        to="/subscription"
                        style={{
                          color: "#2563EB",
                          fontSize: "12px",
                          textDecoration: "none",
                          fontWeight: 500,
                        }}
                      >
                        View Pro plan →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
