import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NotFound = () => {
  const { user } = useAuth();

  const homeLink =
    user?.role === "employer"
      ? "/employer"
      : user?.role === "jobseeker"
        ? "/dashboard"
        : "/";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center">
        {/* Big 404 */}
        <h1 className="text-9xl font-bold text-gray-200">404</h1>

        {/* Message */}
        <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
          Page not found
        </h2>
        <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          <Link
            to={homeLink}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            Go home
          </Link>
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-gray-700 border border-gray-300 px-6 py-2.5 rounded-lg transition"
          >
            Browse jobs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
