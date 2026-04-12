import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const STATUS_STYLES = {
  pending: { bg: "#FEF9C3", text: "#A16207", label: "Pending" },
  reviewed: { bg: "#DBEAFE", text: "#1D4ED8", label: "Reviewed" },
  shortlisted: { bg: "#DCFCE7", text: "#15803D", label: "Shortlisted" },
  rejected: { bg: "#FEE2E2", text: "#B91C1C", label: "Rejected" },
};

const JobSeekerDashboard = () => {
  const location = useLocation();
  const { user, updateUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(
    location.state?.message || "",
  );
  const [expandedId, setExpandedId] = useState(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeSuccess, setResumeSuccess] = useState("");
  const [currentResume, setCurrentResume] = useState(user?.resume || null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [savedLoading, setSavedLoading] = useState(true);
  const [atsData, setAtsData] = useState(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsAnalysing, setAtsAnalysing] = useState(false);
  const [atsMessage, setAtsMessage] = useState("Analysing your resume...");

  const handleATSAnalysis = async () => {
    setAtsAnalysing(true);
    setAtsMessage("Analysing your resume...");

    const messages = [
      "Analysing your resume...",
      "Checking ATS compatibility...",
      "Reviewing section headers...",
      "Analysing keywords and skills...",
      "Checking formatting...",
      "Nearly done...",
    ];

    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < messages.length) setAtsMessage(messages[i]);
    }, 3000);

    try {
      const res = await api.post("/jobs/ats-analysis/");
      clearInterval(interval);
      setAtsData(res.data);
      const updatedUser = await api.get("/auth/me/");
      updateUser(updatedUser.data);
    } catch (err) {
      clearInterval(interval);
      if (err.response?.status === 402) {
        alert(
          "You've used all 2 free ATS analyses. Upgrade to Pro for unlimited!",
        );
      } else {
        alert("ATS analysis failed. Please try again.");
      }
    } finally {
      setAtsAnalysing(false);
    }
  };

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await api.get("/jobs/bookmarks/");
        setSavedJobs(res.data);
      } catch (err) {
        console.error("Failed to fetch saved jobs", err);
      } finally {
        setSavedLoading(false);
      }
    };
    fetchSavedJobs();
  }, []);

  useEffect(() => {
    const fetchATSData = async () => {
      try {
        const res = await api.get("/jobs/ats-analysis/");
        if (res.data.analysed) setAtsData(res.data);
      } catch {}
    };
    fetchATSData();
  }, []);

  useEffect(() => {
    if (user?.resume) setCurrentResume(user.resume);
  }, [user?.resume]);

  const getResumeUrl = (resume) => {
    if (!resume) return null;
    if (resume.startsWith("http")) return resume;
    const cleaned = resume.replace(/^\/?media\//, "");
    return `https://res.cloudinary.com/dauaetfqc/raw/upload/${cleaned}`;
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/jobs/applications/");
        setApplications(res.data);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isPDF =
      file.name.toLowerCase().endsWith(".pdf") ||
      file.type === "application/pdf";
    if (!isPDF) {
      alert("Only PDF files are allowed");
      return;
    }
    setResumeUploading(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await api.post("/auth/resume/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCurrentResume(res.data.resume);
      updateUser(res.data);
      setAtsData(null);
      setResumeSuccess("Resume uploaded successfully!");
      setTimeout(() => setResumeSuccess(""), 3000);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to upload resume");
    } finally {
      setResumeUploading(false);
    }
  };

  const handleResumeDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your resume?")) return;
    try {
      await api.delete("/auth/resume/");
      setCurrentResume(null);
      updateUser({ ...user, resume: null });
    } catch {
      alert("Failed to delete resume");
    }
  };

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  const shortlisted = applications.filter(
    (a) => a.status === "shortlisted",
  ).length;
  const avgScore =
    applications.filter((a) => a.match_score !== null).length > 0
      ? Math.round(
          applications
            .filter((a) => a.match_score !== null)
            .reduce((s, a) => s + a.match_score, 0) /
            applications.filter((a) => a.match_score !== null).length,
        )
      : null;

  if (loading) {
    return (
      <div
        style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 24px" }}
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "12px",
              border: "1px solid #F3F4F6",
            }}
          >
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
        ))}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F8F7F4" }}>
      <style>{`
        @media (max-width: 768px) {
          .skills-grid { grid-template-columns: 1fr !important; }
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ background: "#0F1923", padding: "40px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <p
                style={{
                  color: "#64748B",
                  fontSize: "13px",
                  marginBottom: "6px",
                  letterSpacing: "0.05em",
                }}
              >
                MY DASHBOARD
              </p>
              <h1
                style={{
                  color: "#F1F5F9",
                  fontSize: "28px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                {user?.full_name || "Welcome back"}
              </h1>
            </div>
            <Link
              to="/"
              style={{
                background: "#2563EB",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              Browse Jobs
            </Link>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: "32px",
              marginTop: "28px",
              flexWrap: "wrap",
            }}
          >
            {[
              { value: applications.length, label: "Applications" },
              { value: shortlisted, label: "Shortlisted" },
              {
                value: applications.filter((a) => a.status === "reviewed")
                  .length,
                label: "Reviewed",
              },
              {
                value: avgScore !== null ? `${avgScore}%` : "—",
                label: "Avg Match Score",
              },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    color: "#FFFFFF",
                    fontSize: "26px",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    color: "#94A3B8",
                    fontSize: "13px",
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

      <div
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}
      >
        {/* Success message */}
        {successMessage && (
          <div
            style={{
              background: "#F0FDF4",
              border: "1px solid #BBF7D0",
              color: "#15803D",
              padding: "12px 16px",
              borderRadius: "10px",
              marginBottom: "20px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            ✅ {successMessage}
          </div>
        )}

        {/* Profile completion banner */}
        {!user?.profile_completed && (
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #FEF9C3",
              padding: "20px 24px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontSize: "18px" }}>📋</span>
                <p
                  style={{
                    color: "#111827",
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  Complete your profile
                </p>
                <span
                  style={{
                    background: "#FEF9C3",
                    color: "#A16207",
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: "999px",
                  }}
                >
                  {(([
                    user?.full_name,
                    user?.phone,
                    user?.bio,
                    user?.city,
                    user?.linkedin,
                    user?.portfolio,
                  ].filter(Boolean).length *
                    100) /
                    6) |
                    0}
                  % done
                </span>
              </div>
              <div
                style={{
                  background: "#F3F4F6",
                  borderRadius: "999px",
                  height: "6px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    borderRadius: "999px",
                    background: "#EAB308",
                    width: `${(([user?.full_name, user?.phone, user?.bio, user?.city, user?.linkedin, user?.portfolio].filter(Boolean).length * 100) / 6) | 0}%`,
                    transition: "width 0.3s",
                  }}
                />
              </div>
            </div>
            <Link
              to="/profile"
              style={{
                background: "#111827",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 600,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Complete Profile →
            </Link>
          </div>
        )}

        {/* Two column grid */}
        <div
          className="dashboard-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* LEFT COLUMN — Resume + Applications */}
          <div>
            {/* Resume card */}
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                border: "1px solid #F3F4F6",
                padding: "24px",
                marginBottom: "24px",
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
                    fontSize: "14px",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  My Resume
                </p>
                <div
                  style={{ flex: 1, height: "1px", background: "#E5E7EB" }}
                />
              </div>

              {resumeSuccess && (
                <div
                  style={{
                    background: "#F0FDF4",
                    border: "1px solid #BBF7D0",
                    color: "#15803D",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    marginBottom: "12px",
                    fontSize: "13px",
                  }}
                >
                  ✅ {resumeSuccess}
                </div>
              )}

              {currentResume ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#F9FAFB",
                    border: "1px solid #F3F4F6",
                    borderRadius: "12px",
                    padding: "14px 18px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #1E40AF, #3B82F6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: "18px",
                      }}
                    >
                      📄
                    </div>
                    <div>
                      <p
                        style={{
                          color: "#111827",
                          fontWeight: 600,
                          fontSize: "14px",
                          marginBottom: "2px",
                        }}
                      >
                        Resume uploaded
                      </p>
                      <a
                        href={getResumeUrl(currentResume)}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: "#2563EB",
                          fontSize: "12px",
                          textDecoration: "none",
                        }}
                      >
                        View current resume →
                      </a>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <button
                      onClick={() =>
                        document.getElementById("resume-replace-input").click()
                      }
                      style={{
                        color: "#2563EB",
                        fontSize: "13px",
                        fontWeight: 500,
                        cursor: "pointer",
                        background: "none",
                        border: "none",
                        padding: 0,
                      }}
                    >
                      Replace
                    </button>
                    <input
                      id="resume-replace-input"
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleResumeUpload}
                      style={{ display: "none" }}
                    />
                    <button
                      onClick={handleResumeDelete}
                      style={{
                        color: "#EF4444",
                        fontSize: "13px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    id="resume-upload-input"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleResumeUpload}
                    style={{ display: "none" }}
                  />
                  <button
                    onClick={() =>
                      document.getElementById("resume-upload-input").click()
                    }
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `2px dashed ${resumeUploading ? "#3B82F6" : "#E5E7EB"}`,
                      borderRadius: "12px",
                      padding: "40px 24px",
                      cursor: "pointer",
                      background: resumeUploading ? "#EFF6FF" : "transparent",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {resumeUploading ? (
                      <>
                        <svg
                          className="animate-spin h-8 w-8"
                          style={{ color: "#3B82F6", marginBottom: "12px" }}
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
                        <p
                          style={{
                            color: "#3B82F6",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          Uploading...
                        </p>
                      </>
                    ) : (
                      <>
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "12px",
                            background: "#F3F4F6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "22px",
                            marginBottom: "12px",
                          }}
                        >
                          📄
                        </div>
                        <p
                          style={{
                            color: "#111827",
                            fontSize: "14px",
                            fontWeight: 600,
                            marginBottom: "4px",
                          }}
                        >
                          Upload your resume
                        </p>
                        <p style={{ color: "#9CA3AF", fontSize: "12px" }}>
                          PDF only · Click to browse
                        </p>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Applications section */}
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
                  fontSize: "14px",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                My Applications
              </p>
              <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
              <span
                style={{
                  color: "#9CA3AF",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                }}
              >
                {applications.length} total
              </span>
            </div>

            {/* Empty state */}
            {applications.length === 0 && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  border: "1px solid #F3F4F6",
                  padding: "64px 24px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
                <h3
                  style={{
                    color: "#111827",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                >
                  No applications yet
                </h3>
                <p
                  style={{
                    color: "#9CA3AF",
                    fontSize: "14px",
                    marginBottom: "20px",
                  }}
                >
                  Start applying to jobs to track your applications here
                </p>
                <Link
                  to="/"
                  style={{
                    color: "#2563EB",
                    fontSize: "14px",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  Browse open jobs →
                </Link>
              </div>
            )}
            {/* ATS Score Card */}
            {currentResume && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  border: "1px solid #F3F4F6",
                  padding: "24px",
                  marginBottom: "24px",
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
                      fontSize: "14px",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}
                  >
                    🤖 ATS Resume Score
                  </p>
                  <div
                    style={{ flex: 1, height: "1px", background: "#E5E7EB" }}
                  />
                  {!user?.is_pro && (
                    <span
                      style={{
                        color: "#9CA3AF",
                        fontSize: "11px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {2 - (user?.ats_analyses_used || 0)} free left
                    </span>
                  )}
                </div>

                {/* Info note */}
                <div
                  style={{
                    background: "#F0F9FF",
                    border: "1px solid #BAE6FD",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    marginBottom: "16px",
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <span style={{ fontSize: "14px", flexShrink: 0 }}>ℹ️</span>
                  <p
                    style={{
                      color: "#0369A1",
                      fontSize: "12px",
                      lineHeight: 1.6,
                    }}
                  >
                    This analyses your resume for{" "}
                    <strong>ATS compatibility</strong> — not a specific job
                    match. ATS (Applicant Tracking Systems) are used by
                    employers to filter resumes before humans see them.
                  </p>
                </div>

                {!atsData ? (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div style={{ fontSize: "40px", marginBottom: "12px" }}>
                      📄
                    </div>
                    <p
                      style={{
                        color: "#111827",
                        fontWeight: 600,
                        fontSize: "15px",
                        marginBottom: "6px",
                      }}
                    >
                      Check your ATS score
                    </p>
                    <p
                      style={{
                        color: "#9CA3AF",
                        fontSize: "13px",
                        marginBottom: "20px",
                      }}
                    >
                      Find out how well your resume performs with Applicant
                      Tracking Systems
                    </p>
                    <button
                      onClick={handleATSAnalysis}
                      disabled={
                        atsAnalysing ||
                        (!user?.is_pro && user?.ats_analyses_used >= 2)
                      }
                      style={{
                        background: atsAnalysing
                          ? "#93C5FD"
                          : !user?.is_pro && user?.ats_analyses_used >= 2
                            ? "#F3F4F6"
                            : "#111827",
                        color: atsAnalysing
                          ? "#fff"
                          : !user?.is_pro && user?.ats_analyses_used >= 2
                            ? "#9CA3AF"
                            : "#fff",
                        border: "none",
                        borderRadius: "10px",
                        padding: "12px 28px",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor:
                          atsAnalysing ||
                          (!user?.is_pro && user?.ats_analyses_used >= 2)
                            ? "not-allowed"
                            : "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {atsAnalysing ? (
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
                          {atsMessage}
                        </>
                      ) : !user?.is_pro && user?.ats_analyses_used >= 2 ? (
                        "⚡ Upgrade for more analyses"
                      ) : (
                        "🔍 Analyse ATS Score"
                      )}
                    </button>
                    {atsAnalysing && (
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
                ) : (
                  <div>
                    {/* Score circle + summary */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        marginBottom: "20px",
                        padding: "16px",
                        background: "#F9FAFB",
                        borderRadius: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                          flexShrink: 0,
                          border: `5px solid ${atsData.ats_score >= 80 ? "#22C55E" : atsData.ats_score >= 60 ? "#EAB308" : "#EF4444"}`,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "20px",
                            fontWeight: 800,
                            color:
                              atsData.ats_score >= 80
                                ? "#15803D"
                                : atsData.ats_score >= 60
                                  ? "#A16207"
                                  : "#B91C1C",
                            lineHeight: 1,
                          }}
                        >
                          {atsData.ats_score}
                        </span>
                        <span
                          style={{
                            fontSize: "10px",
                            color: "#9CA3AF",
                            marginTop: "2px",
                          }}
                        >
                          / 100
                        </span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            color: "#111827",
                            fontWeight: 700,
                            fontSize: "15px",
                            marginBottom: "6px",
                          }}
                        >
                          {atsData.ats_score >= 80
                            ? "🎉 Excellent ATS score!"
                            : atsData.ats_score >= 60
                              ? "👍 Good, but room to improve"
                              : "⚠️ Needs improvement"}
                        </p>
                        <div
                          style={{
                            background: "#E5E7EB",
                            borderRadius: "999px",
                            height: "8px",
                            overflow: "hidden",
                            marginBottom: "6px",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              borderRadius: "999px",
                              width: `${atsData.ats_score}%`,
                              background:
                                atsData.ats_score >= 80
                                  ? "#22C55E"
                                  : atsData.ats_score >= 60
                                    ? "#EAB308"
                                    : "#EF4444",
                            }}
                          />
                        </div>
                        <p style={{ color: "#6B7280", fontSize: "12px" }}>
                          {atsData.ats_feedback?.summary}
                        </p>
                      </div>
                    </div>

                    {/* Breakdown */}
                    {atsData.ats_feedback?.breakdown && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          marginBottom: "16px",
                        }}
                      >
                        {atsData.ats_feedback.breakdown.map((item, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "10px",
                              padding: "10px 12px",
                              background:
                                item.status === "good"
                                  ? "#F0FDF4"
                                  : item.status === "warning"
                                    ? "#FEFCE8"
                                    : "#FEF2F2",
                              borderRadius: "10px",
                            }}
                          >
                            <span style={{ fontSize: "14px", flexShrink: 0 }}>
                              {item.status === "good"
                                ? "✅"
                                : item.status === "warning"
                                  ? "⚠️"
                                  : "❌"}
                            </span>
                            <div>
                              <p
                                style={{
                                  color: "#111827",
                                  fontSize: "13px",
                                  fontWeight: 600,
                                  marginBottom: "2px",
                                }}
                              >
                                {item.category}
                              </p>
                              <p
                                style={{
                                  color: "#6B7280",
                                  fontSize: "12px",
                                  lineHeight: 1.5,
                                }}
                              >
                                {item.message}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Strengths */}
                    {atsData.ats_feedback?.strengths?.length > 0 && (
                      <div style={{ marginBottom: "12px" }}>
                        <p
                          style={{
                            color: "#15803D",
                            fontSize: "12px",
                            fontWeight: 600,
                            marginBottom: "8px",
                            letterSpacing: "0.05em",
                          }}
                        >
                          💪 STRENGTHS
                        </p>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                          }}
                        >
                          {atsData.ats_feedback.strengths.map((s, i) => (
                            <p
                              key={i}
                              style={{
                                color: "#374151",
                                fontSize: "13px",
                                padding: "6px 10px",
                                background: "#F0FDF4",
                                borderRadius: "8px",
                              }}
                            >
                              • {s}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Top issues */}
                    {atsData.ats_feedback?.top_issues?.length > 0 && (
                      <div style={{ marginBottom: "16px" }}>
                        <p
                          style={{
                            color: "#B91C1C",
                            fontSize: "12px",
                            fontWeight: 600,
                            marginBottom: "8px",
                            letterSpacing: "0.05em",
                          }}
                        >
                          🔧 TOP ISSUES TO FIX
                        </p>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                          }}
                        >
                          {atsData.ats_feedback.top_issues.map((issue, i) => (
                            <p
                              key={i}
                              style={{
                                color: "#374151",
                                fontSize: "13px",
                                padding: "6px 10px",
                                background: "#FEF2F2",
                                borderRadius: "8px",
                              }}
                            >
                              • {issue}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Re-analyse button */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <p style={{ color: "#9CA3AF", fontSize: "11px" }}>
                        Last analysed{" "}
                        {new Date(atsData.ats_analysed_at).toLocaleDateString(
                          "en-AU",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </p>
                      <button
                        onClick={handleATSAnalysis}
                        disabled={
                          atsAnalysing ||
                          (!user?.is_pro && user?.ats_analyses_used >= 2)
                        }
                        style={{
                          color:
                            !user?.is_pro && user?.ats_analyses_used >= 2
                              ? "#9CA3AF"
                              : "#2563EB",
                          fontSize: "12px",
                          background: "none",
                          border: "none",
                          cursor:
                            !user?.is_pro && user?.ats_analyses_used >= 2
                              ? "not-allowed"
                              : "pointer",
                          fontWeight: 500,
                        }}
                      >
                        {atsAnalysing
                          ? "Analysing..."
                          : !user?.is_pro && user?.ats_analyses_used >= 2
                            ? "No analyses left"
                            : "Re-analyse →"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Applications list */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {applications.map((app) => {
                const statusStyle = STATUS_STYLES[app.status];
                const isExpanded = expandedId === app.id;
                return (
                  <div
                    key={app.id}
                    style={{
                      background: "#fff",
                      borderRadius: "16px",
                      border: "1px solid #F3F4F6",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ padding: "20px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: "16px",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              flexWrap: "wrap",
                              marginBottom: "6px",
                            }}
                          >
                            <h3
                              style={{
                                color: "#111827",
                                fontWeight: 700,
                                fontSize: "15px",
                              }}
                            >
                              {app.job.title}
                            </h3>
                            <span
                              style={{
                                background: statusStyle.bg,
                                color: statusStyle.text,
                                fontSize: "11px",
                                fontWeight: 600,
                                padding: "3px 10px",
                                borderRadius: "999px",
                                letterSpacing: "0.03em",
                              }}
                            >
                              {statusStyle.label}
                            </span>
                          </div>
                          <p
                            style={{
                              color: "#6B7280",
                              fontSize: "13px",
                              marginBottom: "4px",
                            }}
                          >
                            🏢 {app.job.company} · 📍 {app.job.location}
                          </p>
                          <p style={{ color: "#9CA3AF", fontSize: "12px" }}>
                            Applied{" "}
                            {new Date(app.applied_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>

                        {app.match_score !== null ? (
                          <div
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "50%",
                              flexShrink: 0,
                              border: `4px solid ${app.match_score >= 70 ? "#22C55E" : app.match_score >= 40 ? "#EAB308" : "#EF4444"}`,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              color:
                                app.match_score >= 70
                                  ? "#15803D"
                                  : app.match_score >= 40
                                    ? "#A16207"
                                    : "#B91C1C",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "15px",
                                fontWeight: 700,
                                lineHeight: 1,
                              }}
                            >
                              {app.match_score}%
                            </span>
                            <span
                              style={{
                                fontSize: "9px",
                                lineHeight: 1,
                                marginTop: "2px",
                                color: "#9CA3AF",
                              }}
                            >
                              match
                            </span>
                          </div>
                        ) : (
                          <div
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "50%",
                              flexShrink: 0,
                              border: "4px solid #E5E7EB",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#D1D5DB",
                              fontSize: "10px",
                              textAlign: "center",
                              lineHeight: 1.3,
                            }}
                          >
                            AI
                            <br />
                            pending
                          </div>
                        )}
                      </div>

                      {app.match_score !== null && (
                        <div style={{ marginTop: "14px" }}>
                          <div
                            style={{
                              background: "#F3F4F6",
                              borderRadius: "999px",
                              height: "5px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                borderRadius: "999px",
                                width: `${app.match_score}%`,
                                background:
                                  app.match_score >= 70
                                    ? "#22C55E"
                                    : app.match_score >= 40
                                      ? "#EAB308"
                                      : "#EF4444",
                              }}
                            />
                          </div>
                        </div>
                      )}

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                          marginTop: "14px",
                          paddingTop: "14px",
                          borderTop: "1px solid #F9FAFB",
                        }}
                      >
                        {(app.cover_letter || app.match_score !== null) && (
                          <button
                            onClick={() => toggleExpand(app.id)}
                            style={{
                              color: "#2563EB",
                              fontSize: "13px",
                              fontWeight: 500,
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: 0,
                            }}
                          >
                            {isExpanded
                              ? "▲ Hide details"
                              : "▼ View AI insights & cover letter"}
                          </button>
                        )}
                        <Link
                          to={`/jobs/${app.job.id}`}
                          style={{
                            color: "#6B7280",
                            fontSize: "13px",
                            textDecoration: "none",
                            marginLeft: "auto",
                          }}
                        >
                          View job →
                        </Link>
                        <button
                          onClick={async () => {
                            if (
                              !window.confirm(
                                "Are you sure you want to withdraw this application?",
                              )
                            )
                              return;
                            try {
                              await api.delete(`/jobs/applications/${app.id}/`);
                              setApplications(
                                applications.filter((a) => a.id !== app.id),
                              );
                            } catch {
                              alert("Failed to withdraw application");
                            }
                          }}
                          style={{
                            color: "#EF4444",
                            fontSize: "13px",
                            fontWeight: 500,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                          }}
                        >
                          Withdraw
                        </button>
                      </div>

                      {!app.cover_letter && app.match_score === null && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            marginTop: "10px",
                            color: "#9CA3AF",
                            fontSize: "12px",
                          }}
                        >
                          <svg
                            className="animate-spin h-3 w-3"
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
                          AI is analyzing your resume...
                        </div>
                      )}
                    </div>

                    {isExpanded && (
                      <div
                        style={{
                          borderTop: "1px solid #F3F4F6",
                          padding: "20px",
                          background: "#FAFAFA",
                        }}
                      >
                        {(app.matching_skills || app.missing_skills) && (
                          <div
                            className="skills-grid"
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "12px",
                              marginBottom: "20px",
                            }}
                          >
                            {app.matching_skills && (
                              <div>
                                <p
                                  style={{
                                    color: "#6B7280",
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    marginBottom: "8px",
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
                                  {app.matching_skills
                                    .split(", ")
                                    .map((skill, i) => (
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
                                          lineHeight: 1.4,
                                        }}
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                </div>
                              </div>
                            )}
                            {app.missing_skills && (
                              <div>
                                <p
                                  style={{
                                    color: "#6B7280",
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    marginBottom: "8px",
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
                                  {app.missing_skills
                                    .split(", ")
                                    .map((skill, i) => (
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
                                          lineHeight: 1.4,
                                        }}
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        {app.cover_letter && (
                          <div>
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
                              <button
                                onClick={() =>
                                  navigator.clipboard.writeText(
                                    app.cover_letter,
                                  )
                                }
                                style={{
                                  color: "#2563EB",
                                  fontSize: "12px",
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                }}
                              >
                                Copy
                              </button>
                            </div>
                            <div
                              style={{
                                background: "#fff",
                                border: "1px solid #F3F4F6",
                                borderRadius: "12px",
                                padding: "16px",
                                fontSize: "13px",
                                color: "#6B7280",
                                lineHeight: 1.8,
                                whiteSpace: "pre-line",
                                maxHeight: "240px",
                                overflowY: "auto",
                              }}
                            >
                              {app.cover_letter}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN — Saved Jobs */}
          <div style={{ position: "sticky", top: "80px" }}>
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                border: "1px solid #F3F4F6",
                padding: "24px",
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
                    fontSize: "14px",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  🔖 Saved Jobs
                </p>
                <div
                  style={{ flex: 1, height: "1px", background: "#E5E7EB" }}
                />
                <span
                  style={{
                    color: "#9CA3AF",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {savedJobs.length} saved
                </span>
              </div>

              {savedLoading && (
                <p style={{ color: "#9CA3AF", fontSize: "13px" }}>Loading...</p>
              )}

              {!savedLoading && savedJobs.length === 0 && (
                <div style={{ textAlign: "center", padding: "24px" }}>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                    🔖
                  </div>
                  <p
                    style={{
                      color: "#6B7280",
                      fontSize: "14px",
                      marginBottom: "4px",
                    }}
                  >
                    No saved jobs yet
                  </p>
                  <p style={{ color: "#9CA3AF", fontSize: "12px" }}>
                    Bookmark jobs from the listings to save them here
                  </p>
                </div>
              )}

              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {savedJobs.map((job) => (
                  <div
                    key={job.id}
                    style={{
                      background: "#F9FAFB",
                      border: "1px solid #F3F4F6",
                      borderRadius: "12px",
                      padding: "12px 14px",
                    }}
                  >
                    <p
                      style={{
                        color: "#111827",
                        fontWeight: 600,
                        fontSize: "13px",
                        marginBottom: "3px",
                      }}
                    >
                      {job.title}
                    </p>
                    <p
                      style={{
                        color: "#6B7280",
                        fontSize: "12px",
                        marginBottom: "8px",
                      }}
                    >
                      🏢 {job.company} · 📍 {job.location}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Link
                        to={`/jobs/${job.id}`}
                        style={{
                          color: "#2563EB",
                          fontSize: "12px",
                          fontWeight: 500,
                          textDecoration: "none",
                        }}
                      >
                        View →
                      </Link>
                      <button
                        onClick={async () => {
                          try {
                            await api.delete("/jobs/bookmarks/", {
                              data: { job_id: job.id },
                            });
                            setSavedJobs(
                              savedJobs.filter((j) => j.id !== job.id),
                            );
                          } catch {
                            alert("Failed to remove bookmark");
                          }
                        }}
                        style={{
                          color: "#EF4444",
                          fontSize: "12px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
