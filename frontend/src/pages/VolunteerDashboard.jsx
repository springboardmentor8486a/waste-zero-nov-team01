import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GlassCard from "../components/GlassCard";

function VolunteerDashboard() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);  // ✅ EMPTY
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    // ✅ NO DUMMY DATA - Real API call later
    setTimeout(() => {
      setOpportunities([]);  // Empty array
      setLoading(false);
    }, 500);
  }, []);

  const filteredOpportunities = opportunities
    .filter(opp => opp.title?.toLowerCase().includes(search.toLowerCase()))
    .filter(opp => filterStatus === "all" || opp.status === filterStatus);

  const handleJoin = (opp) => {
    if (!opp || opp.status !== "Open") {
      alert("This opportunity is closed or not available!");
      return;
    }
    alert(`✅ Join "${opp.title}" functionality will be implemented with backend!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 p-8 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center py-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Welcome back, {user?.email?.split('@')[0] || 'Volunteer'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover waste management opportunities near you
          </p>
        </div>

        {/* Search + Filter */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <input
            type="text"
            placeholder="Search opportunities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:col-span-2 p-4 border border-gray-200 rounded-2xl shadow-inner focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-4 border border-gray-200 rounded-2xl shadow-inner focus:ring-2 focus:ring-green-500 text-lg"
          >
            <option value="all">All Status </option>
            <option value="Open">Open </option>
            <option value="Closed">Closed </option>
            <option value="Completed">In progress </option>
          </select>
        </div>

        {/* ✅ EMPTY STATE - No Dummy Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12">
              <div className="text-6xl mb-6">📭</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">No Opportunities Yet</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                No cleanup events available right now. Check back later or browse all opportunities.
              </p>
              <Link
                to="/opportunities"
                className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all inline-block"
              >
                Browse All Opportunities
              </Link>
            </div>
          )}
          
          {/* Real opportunities will render here */}
          {filteredOpportunities.map((opp) => (
            <GlassCard key={opp._id} className="p-6 hover:shadow-2xl transition-all duration-300 h-full group">
              <div className="h-full flex flex-col space-y-4">
                <div className="h-48 rounded-2xl overflow-hidden bg-gray-100 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-emerald-500 flex items-center justify-center text-white font-bold text-xl">
                    {opp.title?.split(' ')[0] || 'Event'}
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {opp.title || 'Untitled Opportunity'}
                  </h3>
                  
                  <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                    {opp.description || 'No description available'}
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-gray-500">
                      <span>📍</span>
                      <span className="font-semibold">{opp.location || 'Location TBD'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <span>📅</span>
                      <span className="font-semibold">{opp.date || 'Date TBD'} | {opp.time || 'Time TBD'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <StatusBadge status={opp.status || 'Open'} />
                      <span className="font-bold text-sm text-emerald-600">
                        {opp.volunteers || 0}/{opp.max || 0}
                      </span>
                    </div>
                  </div>

                  {opp.requiredSkills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2">
                      {opp.requiredSkills.slice(0, 2).map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <Link
                    to={`/opportunities/${opp._id}`}
                    className="block w-full bg-black text-white py-3 px-4 rounded-xl font-bold text-center hover:bg-gray-800 shadow-lg transition-all text-sm"
                  >
                    👁️ View Details
                  </Link>
                  <button
                    onClick={() => handleJoin(opp)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-center shadow-lg transition-all text-sm ${
                      opp.status === "Open"
                        ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-emerald-500/50 hover:scale-[1.02]"
                        : "bg-gray-400 text-gray-200 cursor-not-allowed"
                    }`}
                    disabled={opp.status !== "Open"}
                  >
                    {opp.status === "Open" ? "✅ JOIN NOW" : "Closed"}
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    Open: "bg-green-100 text-green-800 border-green-200",
    Closed: "bg-red-100 text-red-800 border-red-200", 
    Completed: "bg-gray-100 text-gray-800 border-gray-200"
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
      {status || 'Open'}
    </span>
  );
}

export default VolunteerDashboard;