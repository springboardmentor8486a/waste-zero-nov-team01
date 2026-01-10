// src/pages/Opportunities.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaMapMarkerAlt } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

function Opportunities() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter state: 'all' | 'mine' (NGO can toggle)
  const [filter, setFilter] = useState('all');

  // Default NGOs to see their own opportunities on first load
  useEffect(() => {
    if (user?.role === 'ngo') setFilter('mine');
  }, [user?.role]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("wastezero_token");
        
        const res = await axios.get("http://localhost:5000/api/opportunities", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setOpportunities(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load opportunities.");
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  // Volunteer ki create/delete access ledu
  const isNGO = user?.role === "ngo";
  const pageTitle = isNGO ? "Opportunities" : "Volunteer Opportunities";

  // Memoized filtered list according to selected filter
  const filteredOpportunities = React.useMemo(() => {
    if (filter === 'mine' && isNGO) {
      const currentId = user?._id || user?.id;
      return opportunities.filter(o => {
        const owner = o.ngo_id?._id || o.ngo_id?.id || o.ngo_id;
        return String(owner) === String(currentId);
      });
    }
    return opportunities;
  }, [opportunities, filter, isNGO, user]);

  const handleLocalDelete = (id) => {
    setOpportunities((prev) => prev.filter((o) => o._id !== id));
  };

  const handleDelete = async (id) => {
    if (!isNGO) return; // Volunteer ki delete permission ledu

    const sure = window.confirm("Are you sure you want to delete this opportunity?");
    if (!sure) return;

    try {
      const token = localStorage.getItem("wastezero_token");
      const res = await fetch(`http://localhost:5000/api/opportunities/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.message || "Failed to delete opportunity");
        return;
      }

      handleLocalDelete(id);
      alert("Opportunity deleted successfully!");
    } catch (err) {
      alert("Server error while deleting");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading opportunities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-sm text-red-600 hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {pageTitle}
          </h1>
          <p className="text-gray-600 mt-1">
            {isNGO 
              ? "Create and manage volunteer opportunities" 
              : "Find opportunities that match your skills"
            }
          </p>

          {isNGO && (
            <div className="mt-3 flex items-center gap-3">
              <label className="text-xs text-gray-500">Show:</label>
              <div className="inline-flex rounded-lg bg-white border shadow-sm">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 text-sm ${filter === 'all' ? 'bg-emerald-600 text-white rounded-lg' : 'text-gray-700'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('mine')}
                  className={`px-3 py-1 text-sm ${filter === 'mine' ? 'bg-emerald-600 text-white rounded-lg' : 'text-gray-700'}`}
                >
                  My Opportunities
                </button>
              </div>
              <span className="text-xs text-gray-400">{filter === 'mine' ? `${opportunities.filter(o => {
                const owner = o.ngo_id?._id || o.ngo_id?.id || o.ngo_id;
                return String(owner) === String(user?._id || user?.id || user?.id);
              }).length} results` : `${opportunities.length} results`}</span>
            </div>
          )}
        </div>

        {isNGO && (
          <Link
            to="/opportunities/create"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all"
          >
            <span className="mr-2 text-lg">+</span>
            Create Opportunity
          </Link>
        )}
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpportunities.map((opp) => {
          const skills = opp.required_skills || opp.requiredSkills || opp.skills || [];
          
          return (
            <div
              key={opp._id}
              className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-green-300 transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {opp.title}
                    </h2>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <FaMapMarkerAlt className="mr-2 text-green-500" />
                      <span>{opp.location || "Location not specified"}</span>
                    </div>

                    {/* Duration & Date */}
                    <div className="text-sm text-gray-500 mb-4">
                      <span className="mr-4">
                        📅 {opp.date || "Date TBD"}
                      </span>
                      <span>⏱️ {opp.duration || "Flexible"}</span>
                    </div>

                    {/* Skills */}
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {skills.slice(0, 4).map((skill, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-800 border border-green-200"
                          >
                            {skill}
                          </span>
                        ))}
                        {skills.length > 4 && (
                          <span className="text-xs text-gray-500">
                            +{skills.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      opp.status === "open"
                        ? "bg-green-100 text-green-800"
                        : opp.status === "closed"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {opp.status?.toUpperCase() || "OPEN"}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-100">
                  <Link
                    to={`/opportunities/${opp._id}`}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl text-center font-semibold hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all text-sm"
                  >
                    {isNGO ? "View Details" : "View Details"}
                  </Link>
                  
                  {isNGO && (
                    <>
                      <Link
                        to={`/opportunities/${opp._id}/edit`}
                        className="px-4 py-3 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 shadow-md hover:shadow-lg transition-all text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(opp._id)}
                        className="px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 shadow-md hover:shadow-lg transition-all text-sm"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
          })}
      </div>

      {filteredOpportunities.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="text-gray-400 text-4xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {isNGO 
              ? (filter === 'mine' ? "You haven't created any opportunities yet" : "No opportunities created yet")
              : "No opportunities available"
            }
          </h3>
          <p className="text-gray-600 mb-6">
            {isNGO 
              ? "Create your first opportunity to get volunteers!" 
              : "Check back soon for new opportunities"
            }
          </p>
          {isNGO && (
            <Link
              to="/opportunities/create"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all"
            >
              Create First Opportunity
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default Opportunities;