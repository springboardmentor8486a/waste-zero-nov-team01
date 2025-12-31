import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Opportunities() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isNGO = user?.role === 'ngo';
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/opportunities");

      

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setOpportunities(data);
      } else {
        setOpportunities();
      }
    } catch (err) {
      console.error("Fetch opportunities error:", err);
      setError("Failed to load opportunities");
      setOpportunities();
    } finally {
      setLoading(false);
    }
  };

  const filteredOpportunities = opportunities
    .filter(opp => opp.title.toLowerCase().includes(search.toLowerCase()))
    .filter(opp => filterStatus === "all" || opp.status === filterStatus);

  const handleDeleted = (id) => {
    setOpportunities((prev) => prev.filter((opp) => opp._id !== id));
  };

  if (loading) {
    return <div className="text-center p-8">Loading opportunities...</div>;
  }

  if (error && opportunities.length === 0) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-slate-100 min-h-screen">
      {/* Header + Create button (NGO only) */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          {isNGO ? 'Opportunities' : 'Volunteer Opportunities'}
        </h1>
        {isNGO && (
          <Link
            to="/opportunities/create"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-green-700 shadow-lg transition-all"
          >
            + Create Opportunity
          </Link>
        )}
      </div>

      {/* Search + Filter */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <input
          type="text"
          placeholder="Search opportunities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:col-span-2 w-full p-4 border border-gray-200 rounded-2xl shadow-inner focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-4 border border-gray-200 rounded-2xl shadow-inner focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Status ({opportunities.length})</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
          <option value="In progress">In progress</option>
        </select>
      </div>

      {filteredOpportunities.length === 0 ? (
        <div className="text-center py-20 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border p-12">
          <p className="text-xl text-gray-500 mb-4">
            {search || filterStatus !== "all" ? "No matching opportunities" : "No opportunities yet"}
          </p>
          {isNGO && (
            <Link
              to="/opportunities/create"
              className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg"
            >
              Create First Opportunity
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opp) => (
            <OpportunityCard
              key={opp._id}
              opportunity={opp}
              isNGO={isNGO}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OpportunityCard({ opportunity, onDeleted, isNGO }) {
  const handleDelete = async () => {
    const sure = window.confirm(`Delete "${opportunity.title}"?`);
    if (!sure) return;

    try {
      const token = localStorage.getItem("wastezero_token");
      const res = await fetch(`http://localhost:5000/api/opportunities/${opportunity._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.message || "Failed to delete opportunity");
        return;
      }

      onDeleted(opportunity._id);
    } catch (err) {
      console.error("Delete opportunity error:", err);
      alert("Server error while deleting opportunity");
    }
  };

  const handleJoin = () => {
    if (window.confirm(`Join "${opportunity.title}"?
📍 ${opportunity.location}`)) {
      alert(` Joined "${opportunity.title}" successfully!`);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 h-full flex flex-col">
      <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
        {opportunity.title}
      </h3>

      <p className="text-gray-600 mb-3 line-clamp-2 text-sm leading-relaxed">
        {opportunity.description}
      </p>

      <div className="space-y-2 mb-4 text-xs">
        <div className="flex items-center text-sm text-gray-500">
          <span>📍 {opportunity.location}</span>
        </div>
        {opportunity.date && (
          <div className="flex items-center text-sm text-gray-500">
            <span>📅 {opportunity.date} | {opportunity.time}</span>
          </div>
        )}
        <div className="flex flex-wrap gap-1">
          {opportunity.requiredSkills?.slice(0, 2).map((skill, i) => (
            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <StatusBadge status={opportunity.status} />

      {/* ✅ Role-based buttons */}
      <div className="mt-6 flex gap-2 pt-4 border-t">
        {isNGO ? (
          <>
            <Link
              to={`/opportunities/${opportunity._id}`}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-blue-700"
            >
              View Details
            </Link>
            <Link
              to={`/opportunities/${opportunity._id}/edit`}
              className="px-3 py-2 rounded-lg bg-gray-200 text-sm font-medium hover:bg-gray-300"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700"
            >
              Delete
            </button>
          </>
        ) : (
          <Link
            to={`/opportunities/${opportunity._id}`}
            className="w-full bg-black text-white py-3 px-6 rounded-xl font-bold text-center hover:bg-gray-800 shadow-lg transition-all"
          >
             View Details
          </Link>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const color = status === "Open" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${color}`}>
      {status}
    </span>
  );
}

export default Opportunities;