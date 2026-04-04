import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    company_name: user?.company_name || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    country: user?.country || "",
    linkedin: user?.linkedin || "",
    portfolio: user?.portfolio || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await api.put("/auth/profile/", formData);
      updateUser(res.data);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email[0].toUpperCase();

  const isEmployer = user?.role === "employer";

  const inputStyle = {
    width: "100%",
    border: "1px solid #E5E7EB",
    borderRadius: "10px",
    padding: "10px 14px",
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

  const sectionTitle = (title) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "20px",
        marginTop: "8px",
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
        {title}
      </p>
      <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F8F7F4" }}>
      {/* Header */}
      <div style={{ background: "#0F1923", padding: "40px 24px" }}>
        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              flexShrink: 0,
              background: isEmployer
                ? "linear-gradient(135deg, #6D28D9, #8B5CF6)"
                : "linear-gradient(135deg, #1E40AF, #3B82F6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            {initials}
          </div>
          <div>
            <h1
              style={{
                color: "#F1F5F9",
                fontSize: "22px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: "4px",
              }}
            >
              {user?.full_name || "No name set"}
            </h1>
            {isEmployer && user?.company_name && (
              <p
                style={{
                  color: "#94A3B8",
                  fontSize: "14px",
                  marginBottom: "6px",
                }}
              >
                {user.company_name}
              </p>
            )}
            <p
              style={{
                color: "#64748B",
                fontSize: "13px",
                marginBottom: "8px",
              }}
            >
              {user?.email}
            </p>
            <span
              style={{
                display: "inline-block",
                background: isEmployer
                  ? "rgba(109,40,217,0.2)"
                  : "rgba(37,99,235,0.2)",
                color: isEmployer ? "#A78BFA" : "#93C5FD",
                fontSize: "11px",
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: "999px",
                letterSpacing: "0.05em",
              }}
            >
              {isEmployer ? "EMPLOYER" : "JOB SEEKER"}
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div
        style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 24px" }}
      >
        {/* Success/Error */}
        {success && (
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
            ✅ {success}
          </div>
        )}
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
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #F3F4F6",
              padding: "28px",
              marginBottom: "16px",
            }}
          >
            {sectionTitle("Personal Information")}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              {/* Full name */}
              <div style={{ gridColumn: isEmployer ? "1" : "1 / -1" }}>
                <label style={labelStyle}>
                  {isEmployer ? "CONTACT NAME" : "FULL NAME"}
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder={isEmployer ? "e.g. Jane Smith" : "e.g. John Doe"}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>

              {/* Company name — employer only */}
              {isEmployer && (
                <div>
                  <label style={labelStyle}>COMPANY NAME</label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="e.g. Google Australia"
                    onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                </div>
              )}

              {/* Phone */}
              <div>
                <label style={labelStyle}>PHONE NUMBER</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="e.g. 0435 256 789"
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>

              {/* Bio */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>
                  {isEmployer ? "COMPANY DESCRIPTION" : "ABOUT ME"}
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  style={{ ...inputStyle, resize: "none", lineHeight: 1.7 }}
                  placeholder={
                    isEmployer
                      ? "Tell job seekers about your company, culture, and values..."
                      : "Tell employers a bit about yourself..."
                  }
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #F3F4F6",
              padding: "28px",
              marginBottom: "16px",
            }}
          >
            {sectionTitle(isEmployer ? "Company Location" : "Your Location")}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              {!isEmployer && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>STREET ADDRESS</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="e.g. 123 Main Street"
                    onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                </div>
              )}
              <div>
                <label style={labelStyle}>CITY</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="e.g. Sydney"
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>
              <div>
                <label style={labelStyle}>STATE / PROVINCE</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="e.g. NSW"
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>COUNTRY</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="e.g. Australia"
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>
            </div>
          </div>

          {/* Online presence */}
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #F3F4F6",
              padding: "28px",
              marginBottom: "24px",
            }}
          >
            {sectionTitle(
              isEmployer ? "Company Online Presence" : "Online Presence",
            )}

            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div>
                <label style={labelStyle}>
                  {isEmployer ? "COMPANY LINKEDIN" : "LINKEDIN URL"}
                </label>
                <div
                  style={{
                    display: "flex",
                    border: "1px solid #E5E7EB",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      padding: "10px 14px",
                      background: "#F9FAFB",
                      color: "#9CA3AF",
                      fontSize: "14px",
                      borderRight: "1px solid #E5E7EB",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    🔗
                  </span>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      fontSize: "14px",
                      border: "none",
                      outline: "none",
                      color: "#111827",
                    }}
                    placeholder={
                      isEmployer
                        ? "https://linkedin.com/company/yourcompany"
                        : "https://linkedin.com/in/yourname"
                    }
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>
                  {isEmployer ? "COMPANY WEBSITE" : "PORTFOLIO / WEBSITE"}
                </label>
                <div
                  style={{
                    display: "flex",
                    border: "1px solid #E5E7EB",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      padding: "10px 14px",
                      background: "#F9FAFB",
                      color: "#9CA3AF",
                      fontSize: "14px",
                      borderRight: "1px solid #E5E7EB",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    🌐
                  </span>
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      fontSize: "14px",
                      border: "none",
                      outline: "none",
                      color: "#111827",
                    }}
                    placeholder={
                      isEmployer
                        ? "https://yourcompany.com"
                        : "https://yourwebsite.com"
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save button */}
          <button
            type="submit"
            disabled={saving}
            style={{
              width: "100%",
              background: saving ? "#93C5FD" : "#111827",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "14px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: saving ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!saving) e.currentTarget.style.opacity = "0.85";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            {saving ? (
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
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
