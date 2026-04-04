import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Apply = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [resume, setResume] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}/`);
        setJob(res.data);
      } catch {
        setError("Job not found");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setResume(file);
    } else {
      setError("Please upload a PDF file");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setResume(file);
      setError("");
    } else {
      setError("Please upload a PDF file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) {
      setError("Please upload your resume");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // use FormData because we're sending a file
      const formData = new FormData();
      formData.append("job_id", id);
      formData.append("resume", resume);

      await api.post("/jobs/applications/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // redirect to dashboard after applying
      navigate("/dashboard", {
        state: {
          message: "Application submitted! AI is analyzing your resume...",
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.non_field_errors?.[0] ||
          "Failed to submit application",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="h-4 bg-gray-100 rounded w-1/3" />
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1"
        >
          ← Back to job
        </button>

        {/* Job summary */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
          <p className="text-xs text-gray-400 mb-1">Applying for</p>
          <h2 className="font-semibold text-gray-900">{job?.title}</h2>
          <p className="text-sm text-gray-500">
            {job?.company} · {job?.location}
          </p>
        </div>

        {/* Apply form */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            Submit your application
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Our AI will analyze your resume and generate a cover letter and
            match score
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Resume upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume (PDF only)
              </label>

              {/* Drag and drop area */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => document.getElementById("resume-input").click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                  dragOver
                    ? "border-blue-400 bg-blue-50"
                    : resume
                      ? "border-green-400 bg-green-50"
                      : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                }`}
              >
                <input
                  id="resume-input"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {resume ? (
                  <div>
                    <p className="text-2xl mb-2">✅</p>
                    <p className="text-sm font-medium text-green-700">
                      {resume.name}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      {(resume.size / 1024).toFixed(0)} KB · Click to change
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-3xl mb-2">📄</p>
                    <p className="text-sm font-medium text-gray-700">
                      Drag & drop your resume here
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      or click to browse · PDF only · Max 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* AI notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex gap-3">
              <span className="text-lg">🤖</span>
              <div>
                <p className="text-sm font-medium text-blue-800">
                  AI-powered application
                </p>
                <p className="text-xs text-blue-600 mt-0.5">
                  After submitting, our AI will read your resume and the job
                  description, generate a personalized cover letter, and give
                  you a match score with insights on what skills you have and
                  what's missing.
                </p>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || !resume}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
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
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Apply;
