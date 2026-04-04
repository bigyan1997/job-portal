import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  reviewed: "bg-blue-100 text-blue-700",
  shortlisted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const JOB_STATUS_STYLES = {
  active: "bg-green-100 text-green-700",
  draft: "bg-gray-100 text-gray-600",
  closed: "bg-red-100 text-red-700",
};

const EmployerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
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

  const getJobApplications = (jobId) => {
    return applications.filter((app) => app.job.id === jobId);
  };

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
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-8 animate-pulse" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Job Postings
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {jobs.length} job{jobs.length !== 1 ? "s" : ""} posted
            </p>
          </div>
          <Link
            to="/employer/post"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            + Post a Job
          </Link>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg mb-5 flex items-center gap-2">
            ✅ {successMessage}
          </div>
        )}

        {/* Empty state */}
        {jobs.length === 0 && (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
            <p className="text-4xl mb-3">📋</p>
            <h3 className="text-gray-700 font-medium mb-1">
              No jobs posted yet
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Post your first job to start receiving applications
            </p>
            <Link
              to="/employer/post"
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              Post a job →
            </Link>
          </div>
        )}

        {/* Jobs list */}
        <div className="space-y-4">
          {jobs.map((job) => {
            const jobApps = getJobApplications(job.id);
            const isExpanded = expandedJobId === job.id;

            return (
              <div
                key={job.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                {/* Job header */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${JOB_STATUS_STYLES[job.status]}`}
                        >
                          {job.status.charAt(0).toUpperCase() +
                            job.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {job.company} · {job.location} ·{" "}
                        {job.job_type.replace("_", " ")}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Posted{" "}
                        {new Date(job.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Applicant count */}
                    <div className="flex-shrink-0 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {jobApps.length}
                      </div>
                      <div className="text-xs text-gray-400">
                        applicant{jobApps.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-3">
                    {jobApps.length > 0 && (
                      <button
                        onClick={() =>
                          setExpandedJobId(isExpanded ? null : job.id)
                        }
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {isExpanded ? "▲ Hide applicants" : "▼ View applicants"}
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      View listing
                    </button>
                    <button
                      onClick={() => navigate(`/employer/edit/${job.id}`)}
                      className="text-sm text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="text-sm text-red-400 hover:text-red-600 ml-auto"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {/* ← closes <div className="p-5"> */}

                {/* Applicants list — outside p-5 but inside the card */}
                {isExpanded && (
                  <div className="border-t border-gray-100 divide-y divide-gray-100">
                    {jobApps.map((app) => (
                      <div key={app.id} className="p-4 bg-gray-50">
                        <div className="flex items-start justify-between gap-4">
                          {/* Applicant info */}
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                              {app.applicant.full_name?.[0]?.toUpperCase() ||
                                app.applicant.email[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {app.applicant.full_name || app.applicant.email}
                              </p>
                              <p className="text-xs text-gray-400">
                                {app.applicant.email}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
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

                          {/* Match score + status */}
                          <div className="flex items-center gap-3 flex-shrink-0">
                            {app.match_score !== null ? (
                              <div
                                className={`w-12 h-12 rounded-full flex flex-col items-center justify-center text-xs font-bold border-4 ${
                                  app.match_score >= 70
                                    ? "border-green-400 text-green-600"
                                    : app.match_score >= 40
                                      ? "border-yellow-400 text-yellow-600"
                                      : "border-red-400 text-red-600"
                                }`}
                              >
                                {app.match_score}%
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-full flex items-center justify-center border-4 border-gray-200 text-gray-300 text-xs text-center leading-tight">
                                AI...
                              </div>
                            )}

                            <select
                              value={app.status}
                              onChange={(e) =>
                                handleUpdateAppStatus(app.id, e.target.value)
                              }
                              className={`text-xs px-2.5 py-1.5 rounded-full font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${STATUS_STYLES[app.status]}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="shortlisted">Shortlisted</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </div>
                        </div>

                        {/* Skills */}
                        {(app.missing_skills || app.matching_skills) && (
                          <div className="mt-3 pl-12">
                            <div className="grid grid-cols-2 gap-4">
                              {/* Matching skills */}
                              {app.matching_skills && (
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">
                                    ✅ Matching skills:
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {app.matching_skills
                                      .split(", ")
                                      .slice(
                                        0,
                                        expandedSkills[`match-${app.id}`]
                                          ? undefined
                                          : 4,
                                      )
                                      .map((skill, i) => (
                                        <span
                                          key={i}
                                          className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
                                        >
                                          {skill}
                                        </span>
                                      ))}
                                    {app.matching_skills.split(", ").length >
                                      4 && (
                                      <button
                                        onClick={() =>
                                          toggleSkills(`match-${app.id}`)
                                        }
                                        className="text-xs text-blue-600 hover:underline px-1"
                                      >
                                        {expandedSkills[`match-${app.id}`]
                                          ? "Show less"
                                          : `+${app.matching_skills.split(", ").length - 4} more`}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Missing skills */}
                              {app.missing_skills && (
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">
                                    ❌ Missing skills:
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {app.missing_skills
                                      .split(", ")
                                      .slice(
                                        0,
                                        expandedSkills[`miss-${app.id}`]
                                          ? undefined
                                          : 4,
                                      )
                                      .map((skill, i) => (
                                        <span
                                          key={i}
                                          className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full"
                                        >
                                          {skill}
                                        </span>
                                      ))}
                                    {app.missing_skills.split(", ").length >
                                      4 && (
                                      <button
                                        onClick={() =>
                                          toggleSkills(`miss-${app.id}`)
                                        }
                                        className="text-xs text-blue-600 hover:underline px-1"
                                      >
                                        {expandedSkills[`miss-${app.id}`]
                                          ? "Show less"
                                          : `+${app.missing_skills.split(", ").length - 4} more`}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Cover letter */}
                        {app.cover_letter && (
                          <div className="mt-3 pl-12">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs text-gray-500">
                                Cover Letter:
                              </p>
                              <button
                                onClick={() =>
                                  navigator.clipboard.writeText(
                                    app.cover_letter,
                                  )
                                }
                                className="text-xs text-blue-600 hover:underline"
                              >
                                Copy
                              </button>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-xs text-gray-600 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
                              {app.cover_letter}
                            </div>
                          </div>
                        )}

                        {/* Resume link */}
                        {app.resume && (
                          <div className="mt-2 pl-12">
                            <a
                              href={`http://localhost:8000/${app.resume}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                            >
                              📄 View Resume
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
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

export default EmployerDashboard;
