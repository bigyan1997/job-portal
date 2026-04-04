import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  reviewed: "bg-blue-100 text-blue-700",
  shortlisted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
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

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-8 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {applications.length} application
              {applications.length !== 1 ? "s" : ""} submitted
            </p>
          </div>
          <Link
            to="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            Browse Jobs
          </Link>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg mb-5 flex items-center gap-2">
            ✅ {successMessage}
          </div>
        )}

        {/* Resume section */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-1">My Resume</h2>
          <p className="text-xs text-gray-400 mb-4">
            Upload your resume once and use it to apply to any job and get AI
            analysis
          </p>

          {resumeSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2 rounded-lg mb-3">
              ✅ {resumeSuccess}
            </div>
          )}

          {currentResume ? (
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">📄</span>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Resume uploaded
                  </p>

                  <a
                    href={`http://localhost:8000/${currentResume}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View current resume
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs text-blue-600 hover:underline cursor-pointer">
                  Replace
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={handleResumeDelete}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <label
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition ${
                resumeUploading
                  ? "border-blue-300 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
              }`}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleResumeUpload}
                className="hidden"
              />
              {resumeUploading ? (
                <>
                  <svg
                    className="animate-spin h-6 w-6 text-blue-500 mb-2"
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
                  <p className="text-sm text-blue-600">Uploading...</p>
                </>
              ) : (
                <>
                  <span className="text-3xl mb-2">📄</span>
                  <p className="text-sm font-medium text-gray-700">
                    Upload your resume
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PDF only · Click to browse
                  </p>
                </>
              )}
            </label>
          )}
        </div>

        {/* Applications section */}
        <h2 className="font-semibold text-gray-900 mb-4">My Applications</h2>

        {/* Empty state */}
        {applications.length === 0 && (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
            <p className="text-4xl mb-3">📋</p>
            <h3 className="text-gray-700 font-medium mb-1">
              No applications yet
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Start applying to jobs to see your applications here
            </p>
            <Link
              to="/"
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              Browse open jobs →
            </Link>
          </div>
        )}

        {/* Applications list */}
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              {/* Application header */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">
                        {app.job.title}
                      </h3>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[app.status]}`}
                      >
                        {app.status.charAt(0).toUpperCase() +
                          app.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {app.job.company} · {app.job.location}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Applied{" "}
                      {new Date(app.applied_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Match score circle */}
                  {app.match_score !== null ? (
                    <div
                      className={`flex-shrink-0 w-16 h-16 rounded-full flex flex-col items-center justify-center border-4 ${
                        app.match_score >= 70
                          ? "border-green-400 text-green-600"
                          : app.match_score >= 40
                            ? "border-yellow-400 text-yellow-600"
                            : "border-red-400 text-red-600"
                      }`}
                    >
                      <span className="text-lg font-bold leading-none">
                        {app.match_score}%
                      </span>
                      <span className="text-xs leading-none mt-0.5">match</span>
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-16 h-16 rounded-full flex flex-col items-center justify-center border-4 border-gray-200 text-gray-300 text-xs text-center leading-tight px-1">
                      AI pending
                    </div>
                  )}
                </div>

                {/* Expand button */}
                {(app.cover_letter || app.match_score !== null) && (
                  <button
                    onClick={() => toggleExpand(app.id)}
                    className="mt-3 text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {expandedId === app.id
                      ? "▲ Hide details"
                      : "▼ View AI insights & cover letter"}
                  </button>
                )}

                {/* AI pending notice */}
                {!app.cover_letter && app.match_score === null && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
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

              {/* Expanded AI details */}
              {expandedId === app.id && (
                <div className="border-t border-gray-100 p-5 bg-gray-50 space-y-5">
                  {/* Match score bar */}
                  {app.match_score !== null && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-gray-800">
                          Match Score
                        </h4>
                        <span className="text-sm font-bold text-gray-700">
                          {app.match_score}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all ${
                            app.match_score >= 70
                              ? "bg-green-500"
                              : app.match_score >= 40
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${app.match_score}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {app.match_score >= 70
                          ? "Strong match — you meet most requirements"
                          : app.match_score >= 40
                            ? "Moderate match — you meet some requirements"
                            : "Low match — consider upskilling before applying"}
                      </p>
                    </div>
                  )}

                  {/* Skills grid */}
                  {(app.matching_skills || app.missing_skills) && (
                    <div className="grid grid-cols-2 gap-4">
                      {app.matching_skills && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-2">
                            ✅ Skills you have
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {app.matching_skills.split(", ").map((skill, i) => (
                              <span
                                key={i}
                                className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {app.missing_skills && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-2">
                            ❌ Skills to develop
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {app.missing_skills.split(", ").map((skill, i) => (
                              <span
                                key={i}
                                className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full"
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
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-gray-800">
                          🤖 AI Generated Cover Letter
                        </h4>
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(app.cover_letter)
                          }
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Copy
                        </button>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-600 leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto">
                        {app.cover_letter}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
