import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const SubscriptionSuccess = () => {
  const { updateUser } = useAuth();
  const [checking, setChecking] = useState(true);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    // webhook might take a second to fire
    // retry fetching user every 2 seconds up to 5 times
    let attempts = 0;
    const maxAttempts = 5;

    const checkProStatus = async () => {
      try {
        const res = await api.get("/auth/me/");
        updateUser(res.data);

        if (res.data.is_pro) {
          setIsPro(true);
          setChecking(false);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkProStatus, 2000); // retry after 2 seconds
        } else {
          // give up after 5 attempts — show success anyway
          setChecking(false);
        }
      } catch (err) {
        console.error(err);
        setChecking(false);
      }
    };

    checkProStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center bg-white border border-gray-200 rounded-2xl p-10 max-w-md w-full">
        {checking ? (
          <>
            <div className="flex justify-center mb-4">
              <svg
                className="animate-spin h-10 w-10 text-blue-500"
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
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Activating your Pro plan...
            </h1>
            <p className="text-gray-500 text-sm">
              Please wait while we confirm your payment
            </p>
          </>
        ) : (
          <>
            <p className="text-5xl mb-4">{isPro ? "🎉" : "✅"}</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isPro ? "You're now Pro!" : "Payment received!"}
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              {isPro
                ? "You now have unlimited AI resume analyses. Start applying smarter!"
                : "Your payment was successful. Your Pro plan will be activated shortly."}
            </p>

            {isPro && (
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-6 text-left">
                <p className="text-sm font-medium text-green-700 mb-1">
                  ✅ Pro features unlocked:
                </p>
                <ul className="text-xs text-green-600 space-y-1">
                  <li>• Unlimited AI resume analyses</li>
                  <li>• Unlimited cover letter generation</li>
                  <li>• Priority support</li>
                </ul>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Link
                to="/"
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition inline-block"
              >
                Browse Jobs
              </Link>
              <Link
                to="/subscription"
                className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition inline-block"
              >
                View Plan
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
