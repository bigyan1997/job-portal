import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Subscription = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get("/auth/subscription/");
        setStatus(res.data);
      } catch (err) {
        console.error("Failed to fetch subscription status", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    try {
      const res = await api.post("/auth/subscription/create-checkout/");
      window.location.href = res.data.checkout_url;
    } catch (err) {
      alert(err.response?.data?.error || "Failed to start checkout");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleCancel = async () => {
    if (
      !window.confirm(
        "Are you sure you want to cancel your Pro subscription? You will keep access until the end of your billing period.",
      )
    )
      return;
    setCancelLoading(true);
    try {
      await api.post("/auth/subscription/cancel/");
      alert(
        "Subscription cancelled. You will keep Pro access until the end of your billing period.",
      );
    } catch (err) {
      alert(err.response?.data?.error || "Failed to cancel subscription");
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-8" />
        <div className="h-40 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Subscription</h1>
        <p className="text-sm text-gray-500 mb-8">
          Manage your AI analysis plan
        </p>

        {/* Current usage */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-5">
          <h2 className="font-semibold text-gray-900 mb-4">Current Usage</h2>

          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">AI Analyses Used</p>
            <p className="text-sm font-semibold text-gray-900">
              {status?.ai_analyses_used} /{" "}
              {status?.is_pro ? "∞" : status?.free_limit}
            </p>
          </div>

          {/* Progress bar — only for free users */}
          {!status?.is_pro && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div
                className={`h-2 rounded-full transition-all ${
                  status?.ai_analyses_used >= status?.free_limit
                    ? "bg-red-500"
                    : status?.ai_analyses_used >= 2
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                }`}
                style={{
                  width: `${Math.min((status?.ai_analyses_used / status?.free_limit) * 100, 100)}%`,
                }}
              />
            </div>
          )}

          {status?.is_pro ? (
            <p className="text-xs text-green-600 flex items-center gap-1">
              ✅ Pro plan — unlimited AI analyses
            </p>
          ) : status?.analyses_remaining === 0 ? (
            <p className="text-xs text-red-500">
              ❌ You have used all your free analyses — upgrade to continue
            </p>
          ) : (
            <p className="text-xs text-gray-400">
              {status?.analyses_remaining} free analyse
              {status?.analyses_remaining !== 1 ? "s" : ""} remaining
            </p>
          )}
        </div>

        {/* Plans */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          {/* Free plan */}
          <div
            className={`bg-white border rounded-xl p-5 ${!status?.is_pro ? "border-blue-400 ring-2 ring-blue-100" : "border-gray-200"}`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Free</h3>
              {!status?.is_pro && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  Current
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">$0</p>
            <p className="text-xs text-gray-400 mb-4">forever</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>3 AI resume analyses
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Apply to unlimited jobs
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Cover letter generation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400">✗</span>
                Unlimited AI analyses
              </li>
            </ul>
          </div>

          {/* Pro plan */}
          <div
            className={`border rounded-xl p-5 ${status?.is_pro ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-200"}`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3
                className={`font-semibold ${status?.is_pro ? "text-white" : "text-gray-900"}`}
              >
                Pro
              </h3>
              {status?.is_pro && (
                <span className="text-xs bg-white text-blue-600 px-2 py-0.5 rounded-full font-medium">
                  Current
                </span>
              )}
            </div>
            <p
              className={`text-2xl font-bold mb-1 ${status?.is_pro ? "text-white" : "text-gray-900"}`}
            >
              $14.99
            </p>
            <p
              className={`text-xs mb-4 ${status?.is_pro ? "text-blue-200" : "text-gray-400"}`}
            >
              per month
            </p>
            <ul className="space-y-2 text-sm">
              <li
                className={`flex items-center gap-2 ${status?.is_pro ? "text-blue-100" : "text-gray-600"}`}
              >
                <span className="text-green-400">✓</span>
                Unlimited AI analyses
              </li>
              <li
                className={`flex items-center gap-2 ${status?.is_pro ? "text-blue-100" : "text-gray-600"}`}
              >
                <span className="text-green-400">✓</span>
                Apply to unlimited jobs
              </li>
              <li
                className={`flex items-center gap-2 ${status?.is_pro ? "text-blue-100" : "text-gray-600"}`}
              >
                <span className="text-green-400">✓</span>
                Cover letter generation
              </li>
              <li
                className={`flex items-center gap-2 ${status?.is_pro ? "text-blue-100" : "text-gray-600"}`}
              >
                <span className="text-green-400">✓</span>
                Priority support
              </li>
            </ul>
          </div>
        </div>

        {/* Action buttons */}
        {!status?.is_pro ? (
          <button
            onClick={handleUpgrade}
            disabled={checkoutLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {checkoutLoading ? (
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
                Redirecting to checkout...
              </>
            ) : (
              "⚡ Upgrade to Pro — $14.99/month"
            )}
          </button>
        ) : (
          <div className="space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-green-700 font-medium">
                ✅ You are on the Pro plan
              </p>
              <p className="text-xs text-green-600 mt-1">
                Pro since{" "}
                {new Date(status.pro_since).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <button
              onClick={handleCancel}
              disabled={cancelLoading}
              className="w-full border border-red-300 text-red-500 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50 transition disabled:opacity-50"
            >
              {cancelLoading ? "Cancelling..." : "Cancel Subscription"}
            </button>
          </div>
        )}

        {/* Stripe badge */}
        <p className="text-center text-xs text-gray-400 mt-4">
          🔒 Payments securely processed by Stripe
        </p>
      </div>
    </div>
  );
};

export default Subscription;
