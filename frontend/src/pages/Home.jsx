import { useState, useEffect } from "react";
import JobCard from "../components/JobCard";
import api from "../api/axios";

const JOB_TYPES = [
  { value: "", label: "All Types" },
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "remote", label: "Remote" },
];

const STATS = [
  { value: "10K+", label: "Active Jobs" },
  { value: "50K+", label: "Professionals" },
  { value: "98%", label: "Match Accuracy" },
  { value: "2min", label: "Avg. Apply Time" },
];

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("");
  const [activeType, setActiveType] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
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
    const delay = setTimeout(fetchJobs, 400);
    return () => clearTimeout(delay);
  }, [search, jobType]);

  const handleTypeFilter = (value) => {
    setActiveType(value);
    setJobType(value);
  };

  return (
    <div className="min-h-screen" style={{ background: "#F8F7F4" }}>
      {/* Hero */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #0F1923 0%, #1a2940 60%, #0F1923 100%)",
          padding: "80px 24px 100px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Accent circle */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-80px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{ maxWidth: "760px", margin: "0 auto", position: "relative" }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(59,130,246,0.15)",
              border: "1px solid rgba(59,130,246,0.3)",
              borderRadius: "999px",
              padding: "6px 16px",
              marginBottom: "28px",
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
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.05em",
              }}
            >
              AI-POWERED JOB MATCHING
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.1,
              marginBottom: "20px",
              letterSpacing: "-0.02em",
            }}
          >
            Find your next{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #3B82F6, #60A5FA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              opportunity
            </span>
          </h1>

          <p
            style={{
              color: "#94A3B8",
              fontSize: "18px",
              marginBottom: "40px",
              maxWidth: "520px",
              lineHeight: 1.6,
            }}
          >
            Upload your resume once. Our AI analyses every job, generates
            personalised cover letters, and shows your exact match score.
          </p>

          {/* Search */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              padding: "8px",
            }}
          >
            <div style={{ flex: 1, position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#475569",
                  fontSize: "16px",
                }}
              >
                🔍
              </span>
              <input
                type="text"
                placeholder="Search by job title, company or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  padding: "14px 16px 14px 44px",
                  color: "#F1F5F9",
                  fontSize: "15px",
                  outline: "none",
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
                padding: "14px 28px",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                letterSpacing: "0.01em",
              }}
            >
              Search Jobs
            </button>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: "40px",
              marginTop: "48px",
              flexWrap: "wrap",
            }}
          >
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    color: "#F1F5F9",
                    fontSize: "24px",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    color: "#64748B",
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

      {/* Filter pills */}
      <div
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #E5E7EB",
          padding: "0 24px",
          position: "sticky",
          top: "65px",
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: "760px",
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
                  activeType === type.value ? "none" : "1px solid #E5E7EB",
                background:
                  activeType === type.value ? "#0F1923" : "transparent",
                color: activeType === type.value ? "#FFFFFF" : "#6B7280",
                transition: "all 0.15s ease",
              }}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Job listings */}
      <div
        style={{ maxWidth: "760px", margin: "0 auto", padding: "32px 24px" }}
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
                  background: "#FFFFFF",
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
              background: "#FFFFFF",
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

        {/* Job cards */}
        {!loading && jobs.length > 0 && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        input::placeholder { color: #475569; }
        button:hover { opacity: 0.9; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default Home;
