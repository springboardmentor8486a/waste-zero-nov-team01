// src/pages/admin/OpportunityModeration.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ClipboardList,
  Search,
  Filter,
  MapPin,
  Eye,
  Trash2,
  Loader2,
  AlertCircle,
  Building,
  Clock,
} from "lucide-react";
import { getAllAdminOpportunities, deleteAdminOpportunity } from "../../api/adminApi";

function OpportunityModeration() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    ngo: "all",
    location: "all",
  });
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const debounceTimer = useRef(null);
  const searchInputRef = useRef(null);

  // Fetch opportunities
  const fetchOpportunities = useCallback(async (term = searchTerm, filterValues = filters) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        search: term || undefined,
        status: filterValues.status === "all" ? undefined : filterValues.status,
        ngo: filterValues.ngo === "all" ? undefined : filterValues.ngo,
        location: filterValues.location === "all" ? undefined : filterValues.location,
      };

      const response = await getAllAdminOpportunities(params);

      setOpportunities(response.opportunities || []);
    } catch (err) {
      setError("Failed to load opportunities. Please try again.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchOpportunities(searchTerm, filters);
    }, 500);
    return () => clearTimeout(debounceTimer.current);
  }, [searchTerm, filters, fetchOpportunities]);

  // Focus search input after loading
  useEffect(() => {
    if (!loading && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [loading]);

  // Delete opportunity
  const handleDeleteOpportunity = async (opportunityId) => {
    if (!window.confirm("Are you sure you want to remove this opportunity?")) return;

    try {
      setDeletingId(opportunityId);

      await deleteAdminOpportunity(opportunityId);

      setOpportunities((prev) => prev.filter((opp) => opp.id !== opportunityId));
    } catch (err) {
      alert("Failed to delete opportunity");
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // Filter opportunities
  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.ngoName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === "all" || opp.status === filters.status;
    const matchesNGO = filters.ngo === "all" || opp.ngoName === filters.ngo;
    const matchesLocation = filters.location === "all" || opp.location === filters.location;
    
    return matchesSearch && matchesStatus && matchesNGO && matchesLocation;
  });

  // Loading State
  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen">
        <div className="animate-pulse">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-10 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded-lg w-64"></div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded-lg w-80 mb-4"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="overflow-hidden">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="p-6 border-b border-gray-100 dark:border-slate-700 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-64"></div>
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-48"></div>
                  </div>
                  <div className="w-24 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to load opportunities</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={fetchOpportunities}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 mx-auto"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <ClipboardList className="w-8 h-8 text-gray-600 dark:text-slate-400" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">
          Opportunity Moderation
        </h1>
        <div className="text-sm text-gray-500 dark:text-slate-400 ml-2">
          ({filteredOpportunities.length} opportunities)
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-slate-800 shadow rounded-xl p-6 mb-8 border border-gray-100 dark:border-slate-700">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search opportunities by title or NGO..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filters */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={filters.ngo}
              onChange={(e) => setFilters({ ...filters, ngo: e.target.value })}
              className="p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All NGOs</option>
              {[...new Set(opportunities.map((o) => o.ngoName))].map((ngo) => (
                <option key={ngo} value={ngo}>{ngo}</option>
              ))}
            </select>
            <select
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Locations</option>
              {[...new Set(opportunities.map((o) => o.location))].map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Opportunities Table */}
      <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700/50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Opportunity
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  NGO
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredOpportunities.map((opp) => (
                <tr
                  key={opp.id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-600/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                        {opp.title.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 dark:text-white truncate">
                          {opp.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-slate-400 truncate">
                          {opp.description?.substring(0, 80)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-medium rounded-full">
                      {opp.ngoName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                      opp.status === 'approved' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                        : opp.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {opp.status.charAt(0).toUpperCase() + opp.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate max-w-[120px]">{opp.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                    {new Date(opp.createdAt).toLocaleDateString('de-DE')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedOpportunity(opp)}
                        className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteOpportunity(opp.id)}
                        disabled={deletingId === opp.id}
                        className={`p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ${
                          deletingId === opp.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title="Remove opportunity"
                      >
                        {deletingId === opp.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOpportunities.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-slate-400">
            <ClipboardList className="w-16 h-16 mx-auto mb-4 opacity-40" />
            <p className="text-lg">No opportunities found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Opportunity Details Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white dark:bg-slate-800 z-10 border-b border-gray-200 dark:border-slate-700 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Opportunity Details
                </h2>
                <button
                  onClick={() => setSelectedOpportunity(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl font-bold text-white">
                  {selectedOpportunity.title.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedOpportunity.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      <span>{selectedOpportunity.ngoName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedOpportunity.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(selectedOpportunity.createdAt).toLocaleDateString('de-DE')}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-400 mb-3">
                  Description
                </label>
                <p className="text-gray-700 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                  {selectedOpportunity.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-slate-700">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-400 mb-2">
                    Status
                  </label>
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    selectedOpportunity.status === 'approved'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : selectedOpportunity.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {selectedOpportunity.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-400 mb-2">
                    Slots Available
                  </label>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedOpportunity.slotsAvailable}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OpportunityModeration;

