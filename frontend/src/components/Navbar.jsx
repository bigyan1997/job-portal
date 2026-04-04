import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold text-blue-600">
        JobPortal AI
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-6">
        <Link to="/" className="text-gray-600 hover:text-blue-600 transition">
          Jobs
        </Link>

        {/* not logged in */}
        {!user && (
          <>
            <Link
              to="/login"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Sign Up
            </Link>
          </>
        )}

        {/* jobseeker links */}
        {user?.role === "jobseeker" && (
          <>
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              My Applications
            </Link>
            <Link
              to="/subscription"
              className={`text-sm px-3 py-1.5 rounded-lg font-medium transition ${
                user?.is_pro
                  ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {user?.is_pro ? "⚡ Pro" : "Upgrade"}
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-500 transition"
            >
              Logout
            </button>
          </>
        )}

        {/* employer links */}
        {user?.role === "employer" && (
          <>
            <Link
              to="/employer"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              My Jobs
            </Link>
            <Link
              to="/employer/post"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Post a Job
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-500 transition"
            >
              Logout
            </button>
          </>
        )}

        {/* user avatar */}
        {user && (
          <Link
            to="/profile"
            className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm hover:ring-2 hover:ring-blue-400 transition"
          >
            {user.full_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
