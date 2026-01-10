// src/pages/SchedulePickup.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const categories = ["Plastic", "Paper", "E‑waste", "Organic", "Mixed"];

function SchedulePickup() {
  const { user } = useAuth();
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("Scheduled");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user?.id) {
      setError("Please login to schedule a pickup.");
      return;
    }
    if (!category || !date || !time) {
      setError("Please fill all required fields.");
      return;
    }

    const scheduled_time = `${date}T${time}:00`;

    try {
      setSubmitting(true);
      await api.post("/pickups", {
        user_id: user.id,
        category,
        scheduled_time,
        status,
      });
      setSuccess("Pickup scheduled successfully!");
      setCategory("");
      setDate("");
      setTime("");
      setStatus("Scheduled");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to schedule pickup. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Schedule Pickup
          </h1>
          <p className="text-sm text-gray-500">
            Arrange waste collection and manage your pickup history.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: form */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              Schedule New Pickup
            </h2>

            {error && (
              <div className="mb-3 text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-lg">
                {success}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {submitting ? "Scheduling..." : "Schedule Pickup"}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: placeholder for Pickup History (later hook to /pickups table) */}
        <div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm h-full">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">
              Your Pickup History
            </h2>
            <p className="text-xs text-gray-500">
              Schedule your first pickup to see history here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SchedulePickup;