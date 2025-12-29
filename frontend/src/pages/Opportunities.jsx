// src/pages/Opportunities.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaMapMarkerAlt } from "react-icons/fa";

function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get("http://localhost:5000/api/opportunities");
        setOpportunities(res.data || []);
      } catch (err) {
        setError("Failed to load opportunities.");
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const handleLocalDelete = (id) => {
    setOpportunities((prev) => prev.filter((o) => o._id !== id));
  };

  const handleDelete = async (id) => {
    const sure = window.confirm(
      "Are you sure you want to delete this opportunity?"
    );
    if (!sure) return;

    try {
      const token = localStorage.getItem("wastezero_token");
      if (!token) {
  alert("Please login again to delete opportunities");
  return;
}
      const res = await fetch(
        `http://localhost:5000/api/opportunities/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization:`Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.message || "Failed to delete opportunity");
        return;
      }

      handleLocalDelete(id);
    } catch (err) {
      alert("Server error while deleting");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading opportunities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-900">
            Opportunities
          </h1>
        </div>

        <Link
          to="/opportunities/create"
          className="inline-flex items-center px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 shadow-sm"
        >
          <span className="mr-2 text-lg">+</span>
          Create Opportunity
        </Link>
      </div>

      {/* List */}
      <div className="mt-4 space-y-4">
        {opportunities.map((opp) => {
          const skills =
            opp.required_skills || opp.requiredSkills || opp.skills || [];

          return (
            <div
              key={opp._id}
              className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-blue-400 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {opp.title}
                  </h2>

                  {/* Location with icon */}
                  <div className="flex items-center text-sm text-gray-600">
                    <FaMapMarkerAlt className="mr-1 text-red-500" />
                    <span>{opp.location || "Location not specified"}</span>
                  </div>

                  {/* Required skills */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {skills.length > 0 ? (
                      skills.map((skill, i) => (
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

                {/* Status + actions */}
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      opp.status === "open"
                        ? "bg-green-100 text-green-800"
                        : opp.status === "closed"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {opp.status || "unknown"}
                  </span>

                  <div className="flex gap-2">
                    <Link
                      to={`/opportunities/${opp._id}`}
                      className="px-3 py-1 rounded-md border border-gray-300 text-xs text-gray-800 hover:bg-gray-100"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(opp._id)}
                      className="px-3 py-1 rounded-md bg-red-600 text-xs text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Opportunities;