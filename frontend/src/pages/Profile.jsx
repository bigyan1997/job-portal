import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    company_name: user?.company_name || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    country: user?.country || "",
    linkedin: user?.linkedin || "",
    portfolio: user?.portfolio || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await api.put("/auth/profile/", formData);
      updateUser(res.data);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email[0].toUpperCase();

  const isEmployer = user?.role === "employer";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-5">
          {/* Avatar + name */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0 ${
                  isEmployer ? "bg-purple-600" : "bg-blue-600"
                }`}
              >
                {initials}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">
                  {user?.full_name || "No name set"}
                </p>
                {isEmployer && user?.company_name && (
                  <p className="text-sm text-gray-600 font-medium">
                    {user.company_name}
                  </p>
                )}
                <p className="text-sm text-gray-500">{user?.email}</p>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium mt-1 inline-block ${
                    isEmployer
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {isEmployer ? "Employer" : "Job Seeker"}
                </span>
              </div>
            </div>
          </div>

          {/* Success/Error */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg mb-5">
              ✅ {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full name — both roles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isEmployer ? "Contact Name" : "Full Name"}
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder={isEmployer ? "e.g. Jane Smith" : "e.g. John Doe"}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Company name — employer only */}
            {isEmployer && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="e.g. Google Australia"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Phone — both roles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 0430 556 905"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Bio — different label per role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isEmployer ? "Company Description" : "About Me"}
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                placeholder={
                  isEmployer
                    ? "Tell job seekers about your company, culture, and values..."
                    : "Tell employers a bit about yourself..."
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Location section */}
            <div className="border-t border-gray-100 pt-5">
              <p className="text-sm font-medium text-gray-700 mb-4">
                {isEmployer ? "Company Location" : "Your Location"}
              </p>

              <div className="space-y-4">
                {/* Address — jobseeker only */}
                {!isEmployer && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="e.g. 123 Main Street"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* City + State — both roles */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Sydney"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State / Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="e.g. NSW"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Country — both roles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="e.g. Australia"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Online presence */}
            <div className="border-t border-gray-100 pt-5">
              <p className="text-sm font-medium text-gray-700 mb-4">
                {isEmployer ? "Company Online Presence" : "Online Presence"}
              </p>
              <div className="space-y-4">
                {/* LinkedIn — both roles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isEmployer ? "Company LinkedIn" : "LinkedIn URL"}
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                    <span className="px-3 py-2.5 bg-gray-50 text-gray-400 text-sm border-r border-gray-300">
                      🔗
                    </span>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder={
                        isEmployer
                          ? "https://linkedin.com/company/yourcompany"
                          : "https://linkedin.com/in/yourname"
                      }
                      className="flex-1 px-4 py-2.5 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                {/* Portfolio — jobseeker only | Website — employer only */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isEmployer ? "Company Website" : "Portfolio / Website"}
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                    <span className="px-3 py-2.5 bg-gray-50 text-gray-400 text-sm border-r border-gray-300">
                      🌐
                    </span>
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      placeholder={
                        isEmployer
                          ? "https://yourcompany.com"
                          : "https://yourwebsite.com"
                      }
                      className="flex-1 px-4 py-2.5 text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
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
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
