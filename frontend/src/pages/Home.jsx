import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import JobCard from "../components/JobCard";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const JOB_TYPES = [
  { value: "", label: "All Types" },
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "remote", label: "Remote" },
];

const Home = () => {
  const { user } = useAuth();
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("");
  const [activeType, setActiveType] = useState("");

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await api.get("/jobs/bookmarks/");
        setBookmarkedIds(res.data.map((j) => j.id));
      } catch {}
    };
    if (user) fetchBookmarks();
  }, [user]);

  const fetchJobs = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (jobType) params.job_type = jobType;
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
  }, [search, jobType]);

  const handleTypeFilter = (value) => {
    setActiveType(value);
    setJobType(value);
  };

  const featuredJobs = jobs.slice(0, 3);

  return (
    <div style={{ minHeight: "100vh", background: "#F8F7F4" }}>
      <style>{`
        input::placeholder { color: #475569; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .featured-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
        .featured-card { transition: all 0.2s ease; }
        @media (max-width: 768px) {
          .hero-featured { display: none !important; }
          .hero-content { padding: 48px 20px 60px !important; }
          .hero-title { font-size: 36px !important; }
          .stats-row { gap: 24px !important; }
        }
      `}</style>

      {/* Hero */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #0A0F1C 0%, #0F1923 50%, #111827 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.03,
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Blue glow */}
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
            {/* Left — text + search */}
            <div
              className="hero-content"
              style={{ flex: 1, padding: "80px 0", position: "relative" }}
            >
              {/* Badge */}
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

              {/* Search bar */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "14px",
                  padding: "6px",
                  marginBottom: "40px",
                }}
              >
                <div style={{ flex: 1, position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#475569",
                      fontSize: "15px",
                    }}
                  >
                    🔍
                  </span>
                  <input
                    type="text"
                    placeholder="Search by job title, company or location..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      padding: "13px 14px 13px 42px",
                      color: "#F1F5F9",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <button
                  onClick={fetchJobs}
                  style={{
                    background: "#2563EB",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "13px 24px",
                    fontWeight: 600,
                    fontSize: "14px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Search Jobs
                </button>
              </div>

              {/* Stats */}
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

            {/* Right — featured job cards */}
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
                            background: `linear-gradient(135deg, #1E40AF, #3B82F6)`,
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

      {/* Filter pills */}
      <div
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #E5E7EB",
          padding: "0 24px",
          position: "sticky",
          top: "60px",
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            gap: "4px",
            overflowX: "auto",
            padding: "12px 0",
            scrollbarWidth: "none",
          }}
        >
          {JOB_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => handleTypeFilter(type.value)}
              style={{
                padding: "8px 18px",
                borderRadius: "999px",
                whiteSpace: "nowrap",
                fontSize: "13px",
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
              }}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Job listings */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "32px 24px",
          minHeight: "400px",
        }}
      >
        {/* Results header */}
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

        {/* Loading skeleton */}
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

        {/* Empty state */}
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
            <p style={{ color: "#9CA3AF", fontSize: "14px" }}>
              Try a different search term or check back later
            </p>
          </div>
        )}

        {/* Job cards grid */}
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
                  const fetchBookmarks = async () => {
                    const res = await api.get("/jobs/bookmarks/");
                    setBookmarkedIds(res.data.map((j) => j.id));
                  };
                  fetchBookmarks();
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
