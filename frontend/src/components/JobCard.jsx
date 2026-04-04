import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  const jobTypeColors = {
    full_time: { bg: "#DCFCE7", text: "#15803D", label: "Full Time" },
    part_time: { bg: "#FEF9C3", text: "#A16207", label: "Part Time" },
    contract: { bg: "#EDE9FE", text: "#6D28D9", label: "Contract" },
    internship: { bg: "#DBEAFE", text: "#1D4ED8", label: "Internship" },
    remote: { bg: "#CCFBF1", text: "#0F766E", label: "Remote" },
  };

  const typeStyle = jobTypeColors[job.job_type] || {
    bg: "#F3F4F6",
    text: "#374151",
    label: job.job_type,
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return null;
    if (min && max)
      return `$${Number(min).toLocaleString()} – $${Number(max).toLocaleString()}`;
    if (min) return `From $${Number(min).toLocaleString()}`;
    return `Up to $${Number(max).toLocaleString()}`;
  };

  const timeAgo = (dateStr) => {
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const salary = formatSalary(job.salary_min, job.salary_max);

  return (
    <Link
      to={`/jobs/${job.id}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          padding: "24px",
          border: "1px solid #F3F4F6",
          transition: "all 0.2s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.border = "1px solid #BFDBFE";
          e.currentTarget.style.boxShadow = "0 4px 24px rgba(37,99,235,0.08)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.border = "1px solid #F3F4F6";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
          {/* Company avatar */}
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #1E40AF, #3B82F6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "18px",
              flexShrink: 0,
            }}
          >
            {job.company[0].toUpperCase()}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Title + badge */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <h3
                  style={{
                    color: "#111827",
                    fontWeight: 600,
                    fontSize: "16px",
                    marginBottom: "4px",
                    lineHeight: 1.3,
                  }}
                >
                  {job.title}
                </h3>
                <p style={{ color: "#6B7280", fontSize: "14px" }}>
                  {job.company}
                </p>
              </div>

              <span
                style={{
                  background: typeStyle.bg,
                  color: typeStyle.text,
                  fontSize: "12px",
                  fontWeight: 500,
                  padding: "4px 12px",
                  borderRadius: "999px",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {typeStyle.label}
              </span>
            </div>

            {/* Meta row */}
            <div
              style={{
                display: "flex",
                gap: "20px",
                marginTop: "12px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  color: "#9CA3AF",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                📍 {job.location}
              </span>
              {salary && (
                <span
                  style={{
                    color: "#9CA3AF",
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  💰 {salary}
                </span>
              )}
              <span
                style={{
                  color: "#9CA3AF",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                👥 {job.application_count} applicant
                {job.application_count !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Description preview */}
            <p
              style={{
                color: "#6B7280",
                fontSize: "13px",
                marginTop: "12px",
                lineHeight: 1.6,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {job.description}
            </p>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "16px",
                paddingTop: "16px",
                borderTop: "1px solid #F9FAFB",
              }}
            >
              <span style={{ color: "#D1D5DB", fontSize: "12px" }}>
                {timeAgo(job.created_at)}
              </span>
              <span
                style={{
                  color: "#2563EB",
                  fontSize: "13px",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                View job →
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
