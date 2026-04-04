import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const JobDetail = () => {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasApplied, setHasApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  // AI analysis state
  const [analysing, setAnalysing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [analyseError, setAnalyseError] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  useEffect(() => {
    if (user?.is_pro) {
      setLimitReached(false);
    }
  }, [user]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}/`);
        setJob(res.data);
        if (user?.role === "jobseeker") {
          const applications = await api.get("/jobs/applications/");
          const applied = applications.data.some(
            (app) => app.job.id === parseInt(id),
          );
          setHasApplied(applied);
        }
      } catch {
        setError("Job not found");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, user]);

  const handleAnalyse = async () => {
    setAnalyseError("");
    setLimitReached(false);
    setAnalysing(true);
    try {
      const res = await api.post("/jobs/analyse/", { job_id: id });
      setAnalysis(res.data);
      setCoverLetter(res.data.cover_letter);

      // update user context so analyses count decrements in real time
      const updatedUser = await api.get("/auth/me/");
      updateUser(updatedUser.data);
    } catch (err) {
      if (err.response?.status === 402) {
        setLimitReached(true);
      } else {
        setAnalyseError(err.response?.data?.error || "Analysis failed");
      }
    } finally {
      setAnalysing(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      await api.post("/jobs/applications/", {
        job_id: id,
        cover_letter: coverLetter,
        // send analysis results so they get saved with the application
        match_score: analysis?.match_score ?? null,
        matching_skills: analysis?.matching_skills?.join(", ") ?? "",
        missing_skills: analysis?.missing_skills?.join(", ") ?? "",
      });
      navigate("/dashboard", {
        state: { message: "Application submitted successfully!" },
      });
    } catch (err) {
      alert(err.response?.data?.error || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  const jobTypeColors = {
    full_time: "bg-green-100 text-green-700",
    part_time: "bg-yellow-100 text-yellow-700",
    contract: "bg-purple-100 text-purple-700",
    internship: "bg-blue-100 text-blue-700",
    remote: "bg-teal-100 text-teal-700",
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return null;
    if (min && max)
      return `$${Number(min).toLocaleString()} – $${Number(max).toLocaleString()}`;
    if (min) return `From $${Number(min).toLocaleString()}`;
    return `Up to $${Number(max).toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="h-4 bg-gray-100 rounded w-1/3 mb-8" />
        <div className="space-y-3">
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-4xl mb-3">😕</p>
        <h3 className="text-gray-700 font-medium mb-1">{error}</h3>
        <Link to="/" className="text-blue-600 text-sm hover:underline">
          Back to jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1"
        >
          ← Back to jobs
        </button>

        {/* Job header */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <p className="text-gray-500 mt-1">{job.company}</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl flex-shrink-0">
              {job.company[0].toUpperCase()}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-3 mt-4">
            <span
              className={`text-xs px-3 py-1.5 rounded-full font-medium ${jobTypeColors[job.job_type]}`}
            >
              {job.job_type.replace("_", " ")}
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600">
              📍 {job.location}
            </span>
            {formatSalary(job.salary_min, job.salary_max) && (
              <span className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600">
                💰 {formatSalary(job.salary_min, job.salary_max)}
              </span>
            )}
            <span className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600">
              👥 {job.application_count} applicant
              {job.application_count !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Job description */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
          <h2 className="font-semibold text-gray-900 mb-3">About this role</h2>
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* Requirements */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
          <h2 className="font-semibold text-gray-900 mb-3">Requirements</h2>
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
            {job.requirements}
          </p>
        </div>

        {/* AI Analysis section — jobseekers only */}
        {user?.role === "jobseeker" && !hasApplied && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
            {/* No resume uploaded */}
            {!user?.resume && (
              <div className="text-center py-4">
                <p className="text-2xl mb-2">📄</p>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  No resume uploaded yet
                </p>
                <p className="text-xs text-gray-400 mb-3">
                  Upload your resume in your dashboard to analyse and apply to
                  jobs
                </p>
                <Link
                  to="/dashboard"
                  className="text-sm text-blue-600 font-medium hover:underline"
                >
                  Go to dashboard to upload resume →
                </Link>
              </div>
            )}

            {/* Has resume — show analyse button */}
            {/* Has resume — show analyse button or paywall */}
            {user?.resume && !analysis && (
              <div className="text-center py-4">
                <p className="text-2xl mb-2">🤖</p>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Ready to analyse your resume
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  Our AI will match your resume against this job and generate a
                  cover letter
                </p>

                {analyseError && (
                  <p className="text-xs text-red-500 mb-3">{analyseError}</p>
                )}

                {/* Paywall */}
                {limitReached ? (
                  <div className="border border-blue-200 bg-blue-50 rounded-xl p-6 text-left">
                    <div className="text-center mb-4">
                      <p className="text-2xl mb-2">⚡</p>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        You've used all 3 free analyses
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Upgrade to Pro for unlimited AI resume analyses, cover
                        letters and match scores
                      </p>
                    </div>

                    {/* Plan comparison */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Free
                        </p>
                        <p className="text-lg font-bold text-gray-900">$0</p>
                        <p className="text-xs text-gray-400">3 analyses</p>
                      </div>
                      <div className="bg-blue-600 rounded-lg p-3 text-center">
                        <p className="text-xs font-medium text-blue-200 mb-1">
                          Pro
                        </p>
                        <p className="text-lg font-bold text-white">$14.99</p>
                        <p className="text-xs text-blue-200">unlimited</p>
                      </div>
                    </div>

                    <Link
                      to="/subscription"
                      className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                      ⚡ Upgrade to Pro — $14.99/month
                    </Link>
                    <p className="text-xs text-gray-400 text-center mt-2">
                      Cancel anytime · Secure payment via Stripe
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleAnalyse}
                    disabled={analysing}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2 mx-auto"
                  >
                    {analysing ? (
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
                        Analysing...
                      </>
                    ) : (
                      <>
                        🔍 Analyse my resume for this job
                        {!user?.is_pro && (
                          <span className="text-xs bg-blue-500 px-2 py-0.5 rounded-full">
                            {3 - (user?.ai_analyses_used || 0)} left
                          </span>
                        )}
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Analysis results */}
            {analysis && (
              <div className="space-y-5">
                <h2 className="font-semibold text-gray-900">
                  AI Analysis Results
                </h2>

                {/* Match score */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-700">
                      Match Score
                    </p>
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-4 ${
                        analysis.match_score >= 70
                          ? "border-green-400 text-green-600"
                          : analysis.match_score >= 40
                            ? "border-yellow-400 text-yellow-600"
                            : "border-red-400 text-red-600"
                      }`}
                    >
                      {analysis.match_score}%
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        analysis.match_score >= 70
                          ? "bg-green-500"
                          : analysis.match_score >= 40
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${analysis.match_score}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {analysis.match_score >= 70
                      ? "Strong match — you meet most requirements"
                      : analysis.match_score >= 40
                        ? "Moderate match — you meet some requirements"
                        : "Low match — consider upskilling before applying"}
                  </p>
                </div>

                {/* Skills grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      ✅ Skills you have
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.matching_skills.map((skill, i) => (
                        <span
                          key={i}
                          className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      ❌ Skills to develop
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.missing_skills.map((skill, i) => (
                        <span
                          key={i}
                          className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cover letter editor */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">
                      🤖 AI Generated Cover Letter
                    </p>
                    <span className="text-xs text-gray-400">
                      You can edit this before applying
                    </span>
                  </div>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={10}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
                  />
                </div>

                {/* Apply buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {applying
                      ? "Submitting..."
                      : "✅ Apply with this cover letter"}
                  </button>
                  <button
                    onClick={() => {
                      setCoverLetter("");
                      handleApply();
                    }}
                    disabled={applying}
                    className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    Apply without cover letter
                  </button>
                </div>

                {/* Re-analyse — always show for Pro, hide for free users who hit limit */}
                {(!limitReached || user?.is_pro) && (
                  <button
                    onClick={handleAnalyse}
                    disabled={analysing}
                    className="text-xs text-gray-400 hover:text-gray-600 w-full text-center disabled:opacity-50"
                  >
                    {analysing
                      ? "Analysing..."
                      : user?.is_pro
                        ? "⚡ Re-analyse →"
                        : `Re-analyse → (${Math.max(0, 3 - (user?.ai_analyses_used || 0))} left)`}
                  </button>
                )}

                {/* Show upgrade prompt only for free users who hit limit */}
                {limitReached && !user?.is_pro && analysis && (
                  <div className="border border-blue-200 bg-blue-50 rounded-xl p-4 text-center">
                    <p className="text-sm font-medium text-gray-800 mb-1">
                      ⚡ You've used all 3 free analyses
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      Upgrade to Pro to re-analyse with updated resumes
                    </p>
                    <Link
                      to="/subscription"
                      className="text-sm text-blue-600 font-medium hover:underline"
                    >
                      Upgrade to Pro →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Already applied */}
        {user?.role === "jobseeker" && hasApplied && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
            <p className="text-green-700 font-medium">
              ✓ You have already applied to this job
            </p>
            <Link
              to="/dashboard"
              className="text-sm text-green-600 hover:underline mt-1 block"
            >
              View your application →
            </Link>
          </div>
        )}

        {/* Not logged in */}
        {!user && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <p className="text-gray-600 text-sm mb-3">
              Sign in to analyse your resume and apply
            </p>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition inline-block"
            >
              Sign in to apply
            </Link>
          </div>
        )}

        {/* Employer view */}
        {user?.role === "employer" && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
            <p className="text-sm text-gray-400">
              Employers cannot apply to jobs
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetail;
