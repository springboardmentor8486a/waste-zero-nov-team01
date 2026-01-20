// src/pages/admin/UserManagement.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Users,
  Search,
  User,
  MapPin,
  Circle,
  Loader2,
  AlertCircle,
  ChevronDown,
  Filter,
} from "lucide-react";
import { getAllAdminUsers, updateUserStatus } from "../../api/adminApi";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    role: "all",
    status: "all",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState({});
  const debounceTimer = useRef(null);
  const searchInputRef = useRef(null);

  // Fetch users
  const fetchUsers = useCallback(async (term = searchTerm, filterValues = filters) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllAdminUsers({
        search: term || undefined,
        role: filterValues.role === "all" ? undefined : filterValues.role,
        status: filterValues.status === "all" ? undefined : filterValues.status,
      });

      setUsers(response.users || []);
    } catch (err) {
      setError("Failed to load users. Please try again.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchUsers(searchTerm, filters);
    }, 500);
    return () => clearTimeout(debounceTimer.current);
  }, [searchTerm, filters, fetchUsers]);

  // Focus search input after loading
  useEffect(() => {
    if (!loading && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [loading]);

  // Update user status
  const handleUpdateUserStatus = async (userId, status) => {
    try {
      setUpdatingStatus((prev) => ({ ...prev, [userId]: true }));

      await updateUserStatus(userId, status);

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, status } : user
        )
      );
    } catch (err) {
      alert("Failed to update user status");
      console.error("Status update error:", err);
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filters.role === "all" || user.role === filters.role;
    const matchesStatus = filters.status === "all" || user.status === filters.status;
    
    return matchesSearch && matchesRole && matchesStatus;
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
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="h-10 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
                  ))}
              </div>
            </div>
            <div className="overflow-hidden">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="p-6 border-b border-gray-100 dark:border-slate-700 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-32"></div>
                      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-64"></div>
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
          <h2 className="text-xl font-semibold mb-2">Failed to load users</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={fetchUsers}
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
        <Users className="w-8 h-8 text-gray-600 dark:text-slate-400" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">
          User Management
        </h1>
        <div className="text-sm text-gray-500 dark:text-slate-400 ml-2">
          ({filteredUsers.length} users)
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
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              onKeyPress={(e) => e.key === "Enter" && fetchUsers()}
            />
          </div>

          {/* Filters */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              value={filters.role}
              onChange={(e) =>
                setFilters({ ...filters, role: e.target.value })
              }
              className="p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="volunteer">Volunteer</option>
              <option value="ngo">NGO</option>
              <option value="admin">Admin</option>
            </select>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700/50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-600/30 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-slate-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                      user.role === 'ngo' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      <Circle className={`w-3 h-3 ${user.status === 'active' ? 'fill-green-500' : 'fill-red-500'}`} />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400">
                      <MapPin className="w-4 h-4" />
                      {user.location || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium px-3 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        View
                      </button>
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleUpdateUserStatus(user.id, user.status === 'active' ? 'suspended' : 'active')}
                          disabled={updatingStatus[user.id]}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                            user.status === 'active'
                              ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-800/30'
                              : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-800/30'
                          } ${updatingStatus[user.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {updatingStatus[user.id] ? (
                            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                          ) : (
                            user.status === 'active' ? 'Suspend' : 'Activate'
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-slate-400">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-40" />
            <p className="text-lg">No users found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* User Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white dark:bg-slate-800 z-10 border-b border-gray-200 dark:border-slate-700 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  User Profile
                </h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedUser.name}</h3>
                  <p className="text-gray-500 dark:text-slate-400">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-400 mb-2">Role</label>
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-xl font-medium">
                    {selectedUser.role}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-400 mb-2">Status</label>
                  <span className={`px-4 py-2 rounded-xl font-medium text-sm ${
                    selectedUser.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {selectedUser.status}
                  </span>
                </div>
                {selectedUser.location && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-400 mb-2">Location</label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <span className="font-medium text-gray-900 dark:text-white">{selectedUser.location}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;

