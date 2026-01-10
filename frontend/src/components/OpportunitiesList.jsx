// src/components/OpportunitiesList.jsx
import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

function OpportunitiesList({ items, onDeleted, onView }) {
  const handleDelete = async (id) => {
    const sure = window.confirm(
      "Are you sure you want to delete this opportunity?"
    );
    if (!sure) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/opportunities/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.message || "Failed to delete opportunity");
        return;
      }

      if (onDeleted) onDeleted(id);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Server error while deleting");
    }
  };

  return (
    <div className="wz-grid">
      {items.map((opp) => (
        <div key={opp._id} className="wz-card">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-1">{opp.title}</h3>

          {/* Description */}
          <p className="text-sm text-gray-700 mb-2 line-clamp-2">
            {opp.description}
          </p>

          {/* ✅ Location with icon */}
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <FaMapMarkerAlt className="mr-1 text-red-500" />
            <span>{opp.location}</span>
          </div>

          {/* ✅ Required skills */}
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-500 mb-1">
              Required skills
            </p>
            <div className="flex flex-wrap gap-2">
              {(opp.required_skills || opp.requiredSkills || []).length > 0 ? (
                (opp.required_skills || opp.requiredSkills).map((skill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs text-green-800 border border-green-200"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">
                  No specific skills mentioned
                </span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => onView && onView(opp._id)}
              className="px-3 py-1 rounded-md border border-gray-300 text-xs text-gray-800 hover:bg-gray-100"
            >
              View Details
            </button>

            <button
              onClick={() => handleDelete(opp._id)}
              className="px-3 py-1 rounded-md bg-red-600 text-xs text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OpportunitiesList;