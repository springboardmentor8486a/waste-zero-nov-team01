// src/pages/EditOpportunity.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function EditOpportunity() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 1) Load existing opportunity
  useEffect(() => {
    const fetchOne = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/opportunities/${id}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || `HTTP ${res.status}`);
        }
        const data = await res.json();

        setOpportunity({
          title: data.title || "",
          description: data.description || "",
          location: data.location || "",
          date: data.date ? data.date.substring(0, 10) : "",
          duration: data.duration || "",
          status: data.status || "open",
          // backend field: required_skills (array)
          requiredSkills: data.required_skills || [],
        });
      } catch (err) {
        console.error("Edit page load error:", err);
        setError("Failed to load opportunity");
      } finally {
        setLoading(false);
      }
    };

    fetchOne();
  }, [id]);

  // 2) Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOpportunity((o) => ({ ...o, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    const value = e.target.value;
    setOpportunity((o) => ({
      ...o,
      requiredSkills: value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!opportunity) return;

    setSaving(true);
    setError("");

    try {
      // ✅ same key as Login / CreateOpportunity
      const token = localStorage.getItem("wastezero_token");
      if (!token) {
        throw new Error("Please login again");
      }

      const body = {
        title: opportunity.title,
        description: opportunity.description,
        location: opportunity.location,
        duration: opportunity.duration,
        date: opportunity.date,
        required_skills: opportunity.requiredSkills || [],
        status: opportunity.status,
      };

      const res = await fetch(`http://localhost:5000/api/opportunities/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // ✅ Bearer + space + token
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to update opportunity");
      }

      navigate(`/opportunities/${id}`);
    } catch (err) {
      console.error("Update opportunity error:", err);
      setError(err.message || "Failed to update opportunity");
    } finally {
      setSaving(false);
    }
  };

  // 3) UI states
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!opportunity) return null;

  // 4) Form UI
  return (
    <div className="min-h-screen bg-gray-50 px-10 py-8">
      <div className="mb-4">
        <Link
          to="/opportunities"
          className="text-sm text-gray-500 underline hover:text-gray-700"
        >
          ← Back to Opportunities
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Opportunity</h1>
        <p className="text-sm text-gray-500 mt-1">
          Update the details of this volunteer opportunity
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Opportunity Details
          </h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            name="title"
            value={opportunity.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            required
            placeholder="Enter opportunity title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={opportunity.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 h-32 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-vertical"
            required
            placeholder="Describe the opportunity in detail..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={opportunity.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <input
              name="duration"
              value={opportunity.duration}
              onChange={handleChange}
              placeholder="e.g., 4 hours per session"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            name="location"
            value={opportunity.location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="e.g., Hyderabad, Telangana"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Required Skills (comma separated)
          </label>
          <input
            type="text"
            value={opportunity.requiredSkills.join(", ")}
            onChange={handleSkillsChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="e.g., teaching, communication, leadership"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter skills separated by commas
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
          <button
            type="button"
            onClick={() => navigate("/opportunities")}
            className="px-6 py-3 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || loading}
            className="px-6 py-3 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg
                  className="animate-spin -ml-1 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}