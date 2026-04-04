import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const JOB_TYPES = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "remote", label: "Remote" },
];

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    job_type: "full_time",
    description: "",
    requirements: "",
    salary_min: "",
    salary_max: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/jobs/", formData);
      navigate("/employer", {
        state: { message: "Job posted successfully!" },
      });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Post a new job</h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details below — our AI will use this to match and
            analyze applicants
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-5 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Senior React Developer"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Company + Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Acme Inc."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Sydney NSW"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Job type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Type <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {JOB_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, job_type: type.value })
                    }
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                      formData.job_type === type.value
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salary Range{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="salary_min"
                  value={formData.salary_min}
                  onChange={handleChange}
                  placeholder="Min e.g. 60000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  name="salary_max"
                  value={formData.salary_max}
                  onChange={handleChange}
                  placeholder="Max e.g. 90000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-400 mb-1">
                Describe the role, responsibilities, and your company culture
              </p>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                placeholder="We are looking for a passionate developer to join our team..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requirements <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-400 mb-1">
                List the skills, experience, and qualifications needed — the AI
                uses this to score applicants
              </p>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                required
                rows={6}
                placeholder="- 3+ years of React experience&#10;- Strong knowledge of TypeScript&#10;- Experience with REST APIs"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* AI notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex gap-3">
              <span className="text-lg">🤖</span>
              <p className="text-xs text-blue-600">
                The more detailed your description and requirements, the better
                our AI can match and score applicants against your job posting.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
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
                "Post Job"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
