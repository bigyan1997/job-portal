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

  useEffect(() => {
    if (user?.resume) {
      setCurrentResume(user.resume);
    }
  }, [user?.resume]);

  const getResumeUrl = (resume) => {
    if (!resume) return null;
    if (resume.startsWith("http")) return resume;
    const cleaned = resume.replace(/^\/?media\//, "");
    return `https://res.cloudinary.com/dauaetfqc/raw/upload/${resume}`;
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
    if (!file.name.endsWith(".pdf")) {
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
      setResumeSuccess("Resume uploaded successfully!");
      setTimeout(() => setResumeSuccess(""), 3000);
    } catch {
      alert("Failed to upload resume");
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
      {/* Header */}
      <div style={{ background: "#0F1923", padding: "40px 24px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
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
        style={{ maxWidth: "760px", margin: "0 auto", padding: "32px 24px" }}
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
            <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
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
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
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
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <label
                  style={{
                    color: "#2563EB",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Replace
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    style={{ display: "none" }}
                  />
                </label>
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
            <label
              style={{
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
              <input
                type="file"
                accept=".pdf"
                onChange={handleResumeUpload}
                style={{ display: "none" }}
              />
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
            </label>
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
            style={{ color: "#9CA3AF", fontSize: "12px", whiteSpace: "nowrap" }}
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
              style={{ color: "#111827", fontWeight: 600, marginBottom: "8px" }}
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

        {/* Applications list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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
                    {/* Job info */}
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
                        {new Date(app.applied_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Match score */}
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

                  {/* Match bar */}
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

                  {/* Actions */}
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
                  </div>

                  {/* AI pending */}
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

                {/* Expanded details */}
                {isExpanded && (
                  <div
                    style={{
                      borderTop: "1px solid #F3F4F6",
                      padding: "20px",
                      background: "#FAFAFA",
                    }}
                  >
                    {/* Skills grid */}
                    {(app.matching_skills || app.missing_skills) && (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "20px",
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
                                flexWrap: "wrap",
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
                                      padding: "3px 10px",
                                      borderRadius: "999px",
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
                                flexWrap: "wrap",
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
                                      padding: "3px 10px",
                                      borderRadius: "999px",
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

                    {/* Cover letter */}
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
                              navigator.clipboard.writeText(app.cover_letter)
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
    </div>
  );
};

export default JobSeekerDashboard;
