import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const STATUS_STYLES = {
  pending: { bg: "#FEF9C3", text: "#A16207", label: "Pending" },
  reviewed: { bg: "#DBEAFE", text: "#1D4ED8", label: "Reviewed" },
  shortlisted: { bg: "#DCFCE7", text: "#15803D", label: "Shortlisted" },
  rejected: { bg: "#FEE2E2", text: "#B91C1C", label: "Rejected" },
};

const JOB_STATUS_STYLES = {
  active: { bg: "#DCFCE7", text: "#15803D" },
  draft: { bg: "#F3F4F6", text: "#6B7280" },
  closed: { bg: "#FEE2E2", text: "#B91C1C" },
};

const EmployerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(
    location.state?.message || "",
  );
  const [expandedSkills, setExpandedSkills] = useState({});

  const toggleSkills = (key) => {
    setExpandedSkills((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          api.get("/jobs/my-jobs/"),
          api.get("/jobs/applications/"),
        ]);
        setJobs(jobsRes.data);
        setApplications(appsRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const getJobApplications = (jobId) =>
    applications.filter((app) => app.job.id === jobId);

  const totalApplicants = applications.length;
  const shortlisted = applications.filter(
    (a) => a.status === "shortlisted",
  ).length;
  const avgScore =
    applications.filter((a) => a.match_score !== null).length > 0
      ? Math.round(
          applications
            .filter((a) => a.match_score !== null)
            .reduce((sum, a) => sum + a.match_score, 0) /
            applications.filter((a) => a.match_score !== null).length,
        )
      : null;

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/jobs/${jobId}/`);
      setJobs(jobs.filter((j) => j.id !== jobId));
    } catch {
      alert("Failed to delete job");
    }
  };

  const handleUpdateAppStatus = async (appId, newStatus) => {
    try {
      await api.patch(`/jobs/applications/${appId}/`, { status: newStatus });
      setApplications(
        applications.map((app) =>
          app.id === appId ? { ...app, status: newStatus } : app,
        ),
      );
    } catch {
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div
        style={{ maxWidth: "960px", margin: "0 auto", padding: "40px 24px" }}
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
      <div
        style={{
          background: "#0F1923",
          padding: "40px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
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
                EMPLOYER DASHBOARD
              </p>
              <h1
                style={{
                  color: "#F1F5F9",
                  fontSize: "28px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                {user?.company_name || user?.full_name || "My Dashboard"}
              </h1>
            </div>
            <Link
              to="/employer/post"
              style={{
                background: "#2563EB",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "14px",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              + Post a Job
            </Link>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: "32px",
              marginTop: "32px",
              flexWrap: "wrap",
            }}
          >
            {[
              { value: jobs.length, label: "Active Jobs" },
              { value: totalApplicants, label: "Total Applicants" },
              { value: shortlisted, label: "Shortlisted" },
              {
                value: avgScore !== null ? `${avgScore}%` : "—",
                label: "Avg Match Score",
              },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    color: "#FFFFFF",
                    fontSize: "28px",
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

      {/* Content */}
      <div
        style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 24px" }}
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
                    user?.company_name,
                    user?.phone,
                    user?.bio,
                    user?.city,
                    user?.linkedin,
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
                    width: `${(([user?.full_name, user?.company_name, user?.phone, user?.bio, user?.city, user?.linkedin].filter(Boolean).length * 100) / 6) | 0}%`,
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
        {/* Empty state */}
        {jobs.length === 0 && (
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              border: "1px solid #F3F4F6",
              padding: "80px 24px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
            <h3
              style={{ color: "#111827", fontWeight: 600, marginBottom: "8px" }}
            >
              No jobs posted yet
            </h3>
            <p
              style={{
                color: "#9CA3AF",
                fontSize: "14px",
                marginBottom: "20px",
              }}
            >
              Post your first job to start receiving applications
            </p>
            <Link
              to="/employer/post"
              style={{ color: "#2563EB", fontSize: "14px", fontWeight: 500 }}
            >
              Post a job →
            </Link>
          </div>
        )}

        {/* Jobs grid */}
        {/* Jobs grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "16px",
          }}
        >
          {jobs.map((job) => {
            const jobApps = getJobApplications(job.id);
            const jobStatusStyle = JOB_STATUS_STYLES[job.status];

            return (
              <div
                key={job.id}
                onClick={() => navigate(`/employer/jobs/${job.id}`)}
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  border: "1px solid #F3F4F6",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 24px rgba(37,99,235,0.08)";
                  e.currentTarget.style.borderColor = "#BFDBFE";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "#F3F4F6";
                }}
              >
                {/* Top bar */}
                <div
                  style={{
                    height: "3px",
                    background:
                      job.status === "active"
                        ? "linear-gradient(90deg, #2563EB, #3B82F6)"
                        : "#E5E7EB",
                  }}
                />

                <div style={{ padding: "20px" }}>
                  {/* Status + date */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                    }}
                  >
                    <span
                      style={{
                        background: jobStatusStyle.bg,
                        color: jobStatusStyle.text,
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: "999px",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {job.status.toUpperCase()}
                    </span>
                    <span style={{ color: "#9CA3AF", fontSize: "11px" }}>
                      {new Date(job.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      color: "#111827",
                      fontWeight: 700,
                      fontSize: "16px",
                      lineHeight: 1.3,
                      marginBottom: "8px",
                    }}
                  >
                    {job.title}
                  </h3>

                  {/* Meta */}
                  <p
                    style={{
                      color: "#6B7280",
                      fontSize: "12px",
                      marginBottom: "3px",
                    }}
                  >
                    🏢 {job.company}
                  </p>
                  <p
                    style={{
                      color: "#9CA3AF",
                      fontSize: "12px",
                      marginBottom: "3px",
                    }}
                  >
                    📍 {job.location}
                  </p>
                  <p
                    style={{
                      color: "#9CA3AF",
                      fontSize: "12px",
                      marginBottom: job.expires_at ? "3px" : "20px",
                    }}
                  >
                    💼 {job.job_type.replace("_", " ")}
                  </p>
                  {job.expires_at && (
                    <p
                      style={{
                        color:
                          new Date(job.expires_at) <
                          new Date(Date.now() + 3 * 86400000)
                            ? "#EF4444"
                            : "#9CA3AF",
                        fontSize: "12px",
                        marginBottom: "20px",
                      }}
                    >
                      📅 Closes{" "}
                      {new Date(job.expires_at).toLocaleDateString("en-AU", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  )}

                  {/* Applicants bar */}
                  <div
                    style={{
                      background: "#EFF6FF",
                      borderRadius: "10px",
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "16px",
                    }}
                  >
                    <span
                      style={{
                        color: "#1D4ED8",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      👥 {jobApps.length} applicant
                      {jobApps.length !== 1 ? "s" : ""}
                    </span>
                    {jobApps.filter((a) => a.match_score !== null).length >
                      0 && (
                      <span style={{ color: "#3B82F6", fontSize: "12px" }}>
                        Avg{" "}
                        {Math.round(
                          jobApps
                            .filter((a) => a.match_score !== null)
                            .reduce((s, a) => s + a.match_score, 0) /
                            jobApps.filter((a) => a.match_score !== null)
                              .length,
                        )}
                        % match
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div
                    style={{ display: "flex", gap: "8px" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => navigate(`/employer/edit/${job.id}`)}
                      style={{
                        flex: 1,
                        background: "#F3F4F6",
                        color: "#374151",
                        border: "none",
                        borderRadius: "8px",
                        padding: "9px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      style={{
                        background: "#FEE2E2",
                        color: "#B91C1C",
                        border: "none",
                        borderRadius: "8px",
                        padding: "9px 14px",
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
