import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const JOB_TYPES = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "casual", label: "Casual" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "remote", label: "Remote" },
];

const PostJob = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    company: user?.company_name || "",
    location: user?.city ? `${user.city} ${user.state || ""}`.trim() : "",
    job_type: "full_time",
    description: "",
    requirements: "",
    salary_min: "",
    salary_max: "",
    expires_at: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { ...formData };
      if (payload.expires_at) {
        payload.expires_at = new Date(
          payload.expires_at + "T23:59:59",
        ).toISOString();
      } else {
        delete payload.expires_at;
      }
      await api.post("/jobs/", payload);
      navigate("/employer", { state: { message: "Job posted successfully!" } });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    border: "1px solid #E5E7EB",
    borderRadius: "10px",
    padding: "11px 14px",
    fontSize: "14px",
    color: "#111827",
    outline: "none",
    background: "#fff",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  };

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: 600,
    color: "#6B7280",
    marginBottom: "6px",
    letterSpacing: "0.04em",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8F7F4" }}>
      {/* Header */}
      <div style={{ background: "#0F1923", padding: "40px 24px" }}>
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
          <button
            onClick={() => navigate(-1)}
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
            ← Back
          </button>
          <h1
            style={{
              color: "#F1F5F9",
              fontSize: "28px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: "8px",
            }}
          >
            Post a new job
          </h1>
          <p style={{ color: "#64748B", fontSize: "14px" }}>
            The more detail you provide, the better our AI can match and score
            applicants
          </p>
        </div>
      </div>

      {/* Content */}
      <div
        style={{ maxWidth: "780px", margin: "0 auto", padding: "32px 24px" }}
      >
        {error && (
          <div
            style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#B91C1C",
              padding: "12px 16px",
              borderRadius: "10px",
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Basic info */}
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #F3F4F6",
              padding: "28px",
              marginBottom: "16px",
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
                  fontSize: "14px",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                Basic Information
              </p>
              <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {/* Title */}
              <div>
                <label style={labelStyle}>
                  JOB TITLE <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  placeholder="e.g. Senior React Developer"
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>

              {/* Company + Location */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div>
                  <label style={labelStyle}>
                    COMPANY <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    placeholder="e.g. Acme Inc."
                    onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                </div>
                <div>
                  <label style={labelStyle}>
                    LOCATION <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    placeholder="e.g. Sydney NSW"
                    onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                </div>
              </div>

              {/* Job type */}
              <div>
                <label style={labelStyle}>
                  JOB TYPE <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {JOB_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, job_type: type.value })
                      }
                      style={{
                        padding: "8px 18px",
                        borderRadius: "999px",
                        fontSize: "13px",
                        fontWeight: 500,
                        cursor: "pointer",
                        border:
                          formData.job_type === type.value
                            ? "1px solid #0F1923"
                            : "1px solid #E5E7EB",
                        background:
                          formData.job_type === type.value ? "#0F1923" : "#fff",
                        color:
                          formData.job_type === type.value ? "#fff" : "#6B7280",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Salary */}
              <div>
                <label style={labelStyle}>
                  SALARY RANGE{" "}
                  <span style={{ color: "#9CA3AF", fontWeight: 400 }}>
                    (optional)
                  </span>
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#9CA3AF",
                        fontSize: "14px",
                      }}
                    >
                      $
                    </span>
                    <input
                      type="number"
                      name="salary_min"
                      value={formData.salary_min}
                      onChange={handleChange}
                      style={{ ...inputStyle, paddingLeft: "28px" }}
                      placeholder="Min e.g. 60000"
                      onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                      onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                    />
                  </div>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#9CA3AF",
                        fontSize: "14px",
                      }}
                    >
                      $
                    </span>
                    <input
                      type="number"
                      name="salary_max"
                      value={formData.salary_max}
                      onChange={handleChange}
                      style={{ ...inputStyle, paddingLeft: "28px" }}
                      placeholder="Max e.g. 90000"
                      onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                      onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                    />
                  </div>
                </div>
              </div>

              {/* Expiry date */}
              <div>
                <label style={labelStyle}>
                  CLOSING DATE{" "}
                  <span style={{ color: "#9CA3AF", fontWeight: 400 }}>
                    (optional)
                  </span>
                </label>
                <p
                  style={{
                    color: "#9CA3AF",
                    fontSize: "12px",
                    marginBottom: "8px",
                  }}
                >
                  Applications will close on this date and the job will be
                  automatically closed
                </p>
                <input
                  type="date"
                  name="expires_at"
                  value={formData.expires_at}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #F3F4F6",
              padding: "28px",
              marginBottom: "16px",
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
                  fontSize: "14px",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                Job Description
              </p>
              <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div>
                <label style={labelStyle}>
                  ABOUT THIS ROLE <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <p
                  style={{
                    color: "#9CA3AF",
                    fontSize: "12px",
                    marginBottom: "8px",
                  }}
                >
                  Describe the role, responsibilities, and your company culture
                </p>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={7}
                  placeholder="We are looking for a passionate developer to join our team..."
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    lineHeight: 1.7,
                    minHeight: "160px",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  REQUIREMENTS <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <p
                  style={{
                    color: "#9CA3AF",
                    fontSize: "12px",
                    marginBottom: "8px",
                  }}
                >
                  List skills, experience and qualifications — our AI uses this
                  to score applicants
                </p>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  required
                  rows={7}
                  placeholder={`- 3+ years of React experience\n- Strong knowledge of TypeScript\n- Experience with REST APIs`}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    lineHeight: 1.7,
                    minHeight: "160px",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>
            </div>
          </div>

          {/* AI notice */}
          <div
            style={{
              background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
              border: "1px solid #BFDBFE",
              borderRadius: "12px",
              padding: "16px 20px",
              marginBottom: "20px",
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: "20px", flexShrink: 0 }}>🤖</span>
            <div>
              <p
                style={{
                  color: "#1D4ED8",
                  fontSize: "13px",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
              >
                AI-powered applicant matching
              </p>
              <p
                style={{ color: "#3B82F6", fontSize: "12px", lineHeight: 1.6 }}
              >
                The more detailed your description and requirements, the better
                our AI can match, score and rank applicants against your job
                posting.
              </p>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "#93C5FD" : "#111827",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "15px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.opacity = "0.85";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            {loading ? (
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
                Posting...
              </>
            ) : (
              "Post Job →"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
