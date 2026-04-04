import { Link } from "react-router-dom";

const SubscriptionCancel = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center bg-white border border-gray-200 rounded-2xl p-10 max-w-md w-full">
        <p className="text-5xl mb-4">😕</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment cancelled
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          No worries — you still have your free analyses. Upgrade anytime when
          you're ready.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            to="/subscription"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            View Plans
          </Link>
          <Link
            to="/"
            className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCancel;
