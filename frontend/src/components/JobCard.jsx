import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
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

  const timeAgo = (dateStr) => {
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <Link to={`/jobs/${job.id}`} className="block">
      <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-300 transition group">
        {/* Top row */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
              {job.title}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">{job.company}</p>
          </div>

          {/* Company avatar */}
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
            {job.company[0].toUpperCase()}
          </div>
        </div>

        {/* Middle row */}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${jobTypeColors[job.job_type]}`}
          >
            {job.job_type.replace("_", " ")}
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            📍 {job.location}
          </span>
          {formatSalary(job.salary_min, job.salary_max) && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              💰 {formatSalary(job.salary_min, job.salary_max)}
            </span>
          )}
        </div>

        {/* Description preview */}
        <p className="text-sm text-gray-600 mt-3 line-clamp-2">
          {job.description}
        </p>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {timeAgo(job.created_at)}
          </span>
          <span className="text-xs text-gray-400">
            {job.application_count} applicant
            {job.application_count !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
