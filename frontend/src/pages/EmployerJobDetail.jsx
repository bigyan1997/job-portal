import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const STATUS_STYLES = {
  pending: { bg: "#FEF9C3", text: "#A16207" },
  reviewed: { bg: "#DBEAFE", text: "#1D4ED8" },
  shortlisted: { bg: "#DCFCE7", text: "#15803D" },
  rejected: { bg: "#FEE2E2", text: "#B91C1C" },
};

const EmployerJobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSkills, setExpandedSkills] = useState({});

  const toggleSkills = (key) => {
    setExpandedSkills((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const getResumeUrl = (resume) => {
    if (!resume) return null;
    if (resume.startsWith("http")) return resume;
    const cleaned = resume.replace(/^\/?media\//, "");
    return `https://res.cloudinary.com/dauaetfqc/raw/upload/${cleaned}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, appsRes] = await Promise.all([
          api.get(`/jobs/${id}/`),
          api.get("/jobs/applications/"),
        ]);
        setJob(jobRes.data);
        setApplications(
          appsRes.data.filter((app) => app.job.id === parseInt(id)),
        );
      } catch {
        navigate("/employer");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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
        style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px" }}
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

  const avgScore =
    applications.filter((a) => a.match_score !== null).length > 0
      ? Math.round(
          applications
            .filter((a) => a.match_score !== null)
            .reduce((s, a) => s + a.match_score, 0) /
            applications.filter((a) => a.match_score !== null).length,
        )
      : null;

  return (
    <div style={{ minHeight: "100vh", background: "#F8F7F4" }}>
      <style>{`
      @media (max-width: 768px) {
        .employer-detail-grid { grid-template-columns: 1fr !important; }
        .employer-skills-grid { grid-template-columns: 1fr !important; }
        .employer-job-info { display: none !important; }
        .employer-header-btns { flex-direction: column !important; }
      }
    `}</style>
      {/* Header */}
      <div style={{ background: "#0F1923", padding: "32px 24px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <button
            onClick={() => navigate("/employer")}
            style={{
              color: "#64748B",
              fontSize: "13px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            ← Back to dashboard
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1
                style={{
                  color: "#F1F5F9",
                  fontSize: "24px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  marginBottom: "6px",
                }}
              >
                {job.title}
              </h1>
              <p style={{ color: "#64748B", fontSize: "14px" }}>
                {job.company} · {job.location} ·{" "}
                {job.job_type.replace("_", " ")}
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => navigate(`/employer/edit/${id}`)}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "#F1F5F9",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Edit Job
              </button>
              <button
                onClick={() => navigate(`/jobs/${id}`)}
                style={{
                  background: "#2563EB",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                View Public Listing
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "32px", marginTop: "24px" }}>
            {[
              { value: applications.length, label: "Applicants" },
              {
                value: applications.filter((a) => a.status === "shortlisted")
                  .length,
                label: "Shortlisted",
              },
              {
                value: applications.filter((a) => a.status === "rejected")
                  .length,
                label: "Rejected",
              },
              {
                value: avgScore !== null ? `${avgScore}%` : "—",
                label: "Avg Match",
              },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    color: "#FFFFFF",
                    fontSize: "24px",
                    fontWeight: 700,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    color: "#94A3B8",
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

      <div
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}
      >
        <div
          className="employer-detail-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* Left — description (bigger, scrollable) */}
          <div>
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                border: "1px solid #F3F4F6",
                overflow: "hidden",
                marginBottom: "24px",
              }}
            >
              <div
                style={{ padding: "24px", borderBottom: "1px solid #F3F4F6" }}
              >
                <h3
                  style={{
                    color: "#111827",
                    fontSize: "16px",
                    fontWeight: 700,
                    marginBottom: "16px",
                  }}
                >
                  About this role
                </h3>
                <p
                  style={{
                    color: "#6B7280",
                    fontSize: "14px",
                    lineHeight: 1.8,
                    whiteSpace: "pre-line",
                  }}
                >
                  {job.description}
                </p>
              </div>
              <div style={{ padding: "24px" }}>
                <h3
                  style={{
                    color: "#111827",
                    fontSize: "16px",
                    fontWeight: 700,
                    marginBottom: "16px",
                  }}
                >
                  Requirements
                </h3>
                <p
                  style={{
                    color: "#6B7280",
                    fontSize: "14px",
                    lineHeight: 1.8,
                    whiteSpace: "pre-line",
                  }}
                >
                  {job.requirements}
                </p>
              </div>
            </div>

            {/* Applicants below description on left */}
            <h2
              style={{
                color: "#111827",
                fontSize: "16px",
                fontWeight: 700,
                marginBottom: "16px",
              }}
            >
              Applicants ({applications.length})
            </h2>

            {applications.length === 0 && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  border: "1px solid #F3F4F6",
                  padding: "48px 24px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>👥</div>
                <p style={{ color: "#6B7280", fontSize: "14px" }}>
                  No applicants yet
                </p>
              </div>
            )}

            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {applications.map((app) => {
                const statusStyle = STATUS_STYLES[app.status];
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
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "12px",
                          marginBottom: "16px",
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
                              width: "44px",
                              height: "44px",
                              borderRadius: "50%",
                              background:
                                "linear-gradient(135deg, #1E40AF, #3B82F6)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontWeight: 700,
                              fontSize: "16px",
                              flexShrink: 0,
                            }}
                          >
                            {app.applicant.full_name?.[0]?.toUpperCase() ||
                              app.applicant.email[0].toUpperCase()}
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
                              {app.applicant.full_name || "No name"}
                            </p>
                            <p style={{ color: "#9CA3AF", fontSize: "12px" }}>
                              {app.applicant.email}
                            </p>
                            <p
                              style={{
                                color: "#9CA3AF",
                                fontSize: "11px",
                                marginTop: "2px",
                              }}
                            >
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
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            flexShrink: 0,
                          }}
                        >
                          {app.match_score !== null && (
                            <div
                              style={{
                                width: "52px",
                                height: "52px",
                                borderRadius: "50%",
                                border: `3px solid ${app.match_score >= 70 ? "#22C55E" : app.match_score >= 40 ? "#EAB308" : "#EF4444"}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color:
                                  app.match_score >= 70
                                    ? "#15803D"
                                    : app.match_score >= 40
                                      ? "#A16207"
                                      : "#B91C1C",
                                fontSize: "12px",
                                fontWeight: 700,
                              }}
                            >
                              {app.match_score}%
                            </div>
                          )}
                          <select
                            value={app.status}
                            onChange={(e) =>
                              handleUpdateAppStatus(app.id, e.target.value)
                            }
                            style={{
                              background: statusStyle.bg,
                              color: statusStyle.text,
                              border: "none",
                              borderRadius: "999px",
                              padding: "6px 14px",
                              fontSize: "12px",
                              fontWeight: 600,
                              cursor: "pointer",
                              outline: "none",
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                          </select>

                          <button
                            onClick={async () => {
                              const res = await api.post(
                                "/messaging/conversations/start/",
                                {
                                  user_id: app.applicant.id,
                                  job_id: id,
                                },
                              );
                              navigate(
                                `/messages?conv=${res.data.conversation_id}`,
                              );
                            }}
                            style={{
                              background: "#EFF6FF",
                              color: "#2563EB",
                              border: "none",
                              borderRadius: "8px",
                              padding: "6px 12px",
                              fontSize: "12px",
                              fontWeight: 600,
                              cursor: "pointer",
                              whiteSpace: "nowrap",
                            }}
                          >
                            💬 Message
                          </button>
                        </div>
                      </div>

                      {/* Match bar */}
                      {app.match_score !== null && (
                        <div style={{ marginBottom: "16px" }}>
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

                      {/* Skills */}
                      {(app.matching_skills || app.missing_skills) && (
                        <div
                          className="employer-skills-grid"
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "16px",
                            marginBottom: "16px",
                          }}
                        >
                          {app.matching_skills && (
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
                                ✅ MATCHING
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
                                  .slice(
                                    0,
                                    expandedSkills[`match-${app.id}`]
                                      ? undefined
                                      : 3,
                                  )
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
                                        lineHeight: 1.5,
                                        marginBottom: "4px",
                                      }}
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                {app.matching_skills.split(", ").length > 3 && (
                                  <button
                                    onClick={() =>
                                      toggleSkills(`match-${app.id}`)
                                    }
                                    style={{
                                      color: "#2563EB",
                                      fontSize: "11px",
                                      background: "none",
                                      border: "none",
                                      cursor: "pointer",
                                    }}
                                  >
                                    {expandedSkills[`match-${app.id}`]
                                      ? "less"
                                      : `+${app.matching_skills.split(", ").length - 3} more`}
                                  </button>
                                )}
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
                                  marginBottom: "6px",
                                  letterSpacing: "0.05em",
                                }}
                              >
                                ❌ MISSING
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
                                  .slice(
                                    0,
                                    expandedSkills[`miss-${app.id}`]
                                      ? undefined
                                      : 3,
                                  )
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
                                        lineHeight: 1.5,
                                        marginBottom: "4px",
                                      }}
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                {app.missing_skills.split(", ").length > 3 && (
                                  <button
                                    onClick={() =>
                                      toggleSkills(`miss-${app.id}`)
                                    }
                                    style={{
                                      color: "#2563EB",
                                      fontSize: "11px",
                                      background: "none",
                                      border: "none",
                                      cursor: "pointer",
                                    }}
                                  >
                                    {expandedSkills[`miss-${app.id}`]
                                      ? "less"
                                      : `+${app.missing_skills.split(", ").length - 3} more`}
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Cover letter */}
                      {app.cover_letter && (
                        <div style={{ marginBottom: "12px" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "6px",
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
                              COVER LETTER
                            </p>
                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(app.cover_letter)
                              }
                              style={{
                                color: "#2563EB",
                                fontSize: "11px",
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
                              background: "#F9FAFB",
                              border: "1px solid #F3F4F6",
                              borderRadius: "10px",
                              padding: "12px 14px",
                              fontSize: "12px",
                              color: "#6B7280",
                              lineHeight: 1.7,
                              whiteSpace: "pre-line",
                              maxHeight: "140px",
                              overflowY: "auto",
                            }}
                          >
                            {app.cover_letter}
                          </div>
                        </div>
                      )}

                      {/* Resume */}
                      {(app.applicant?.resume || app.resume) && (
                        <a
                          href={getResumeUrl(
                            app.applicant?.resume || app.resume,
                          )}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            color: "#2563EB",
                            fontSize: "12px",
                            fontWeight: 500,
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          📄 View Resume
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — job details card (sticky) */}
          <div
            className="employer-job-info"
            style={{ position: "sticky", top: "80px" }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                border: "1px solid #F3F4F6",
                overflow: "hidden",
              }}
            >
              <div
                style={{ padding: "20px", borderBottom: "1px solid #F3F4F6" }}
              >
                <h2
                  style={{
                    color: "#111827",
                    fontSize: "14px",
                    fontWeight: 700,
                    marginBottom: "16px",
                  }}
                >
                  Job Info
                </h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {[
                    { label: "Company", value: job.company },
                    { label: "Location", value: job.location },
                    { label: "Type", value: job.job_type.replace("_", " ") },
                    { label: "Status", value: job.status },
                    {
                      label: "Posted",
                      value: new Date(job.created_at).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "short", day: "numeric" },
                      ),
                    },
                    {
                      label: "Salary",
                      value:
                        job.salary_min && job.salary_max
                          ? `$${Number(job.salary_min).toLocaleString()} – $${Number(job.salary_max).toLocaleString()}`
                          : "Not specified",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "8px",
                        paddingBottom: "12px",
                        borderBottom: "1px solid #F9FAFB",
                      }}
                    >
                      <span style={{ color: "#9CA3AF", fontSize: "12px" }}>
                        {item.label}
                      </span>
                      <span
                        style={{
                          color: "#374151",
                          fontSize: "12px",
                          fontWeight: 500,
                          textAlign: "right",
                        }}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick stats */}
              <div style={{ padding: "20px" }}>
                <h2
                  style={{
                    color: "#111827",
                    fontSize: "14px",
                    fontWeight: 700,
                    marginBottom: "16px",
                  }}
                >
                  Applicant Stats
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                  }}
                >
                  {[
                    {
                      value: applications.length,
                      label: "Total",
                      color: "#2563EB",
                    },
                    {
                      value: applications.filter(
                        (a) => a.status === "shortlisted",
                      ).length,
                      label: "Shortlisted",
                      color: "#15803D",
                    },
                    {
                      value: applications.filter((a) => a.status === "rejected")
                        .length,
                      label: "Rejected",
                      color: "#B91C1C",
                    },
                    {
                      value: avgScore !== null ? `${avgScore}%` : "—",
                      label: "Avg Match",
                      color: "#A16207",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      style={{
                        background: "#F9FAFB",
                        borderRadius: "10px",
                        padding: "12px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          color: stat.color,
                          fontSize: "20px",
                          fontWeight: 700,
                        }}
                      >
                        {stat.value}
                      </div>
                      <div
                        style={{
                          color: "#9CA3AF",
                          fontSize: "11px",
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerJobDetail;
