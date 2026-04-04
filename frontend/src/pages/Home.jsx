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

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("");

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

  // fetch jobs when filters change
  useEffect(() => {
    const delay = setTimeout(fetchJobs, 400); // debounce search
    return () => clearTimeout(delay);
  }, [search, jobType]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <div className="bg-white border-b border-gray-200 px-6 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Find your next opportunity
          </h1>
          <p className="text-gray-500 mb-8">
            AI-powered job matching — upload your resume and get instant
            insights
          </p>

          {/* Search bar */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search jobs by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {JOB_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Job listings */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Results count */}
        {!loading && (
          <p className="text-sm text-gray-500 mb-4">
            {jobs.length} job{jobs.length !== 1 ? "s" : ""} found
            {search && ` for "${search}"`}
          </p>
        )}

        {/* Loading state */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/4 mb-4" />
                <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && jobs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <h3 className="text-gray-700 font-medium mb-1">No jobs found</h3>
            <p className="text-gray-400 text-sm">
              Try a different search or check back later
            </p>
          </div>
        )}

        {/* Job cards */}
        {!loading && jobs.length > 0 && (
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
