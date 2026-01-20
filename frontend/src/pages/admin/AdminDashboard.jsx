// src/pages/admin/AdminDashboard.jsx - CLEAN VERSION (NO LAYOUT - PURE DASHBOARD CONTENT)
import React, { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  Heart,
  Briefcase,
  Activity,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getAdminOverview } from "../../api/adminApi";

function AdminDashboard() {
  // States
  const [overview, setOverview] = useState({
    totalUsers: 0,
    activeNGOs: 0,
    activeVolunteers: 0,
    totalOpportunities: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch overview data from API
  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAdminOverview();
      setOverview({
        totalUsers: data.totalUsers || 0,
        activeNGOs: data.activeNGOs || 0,
        activeVolunteers: data.activeVolunteers || 0,
        totalOpportunities: data.totalOpportunities || 0,
      });
      setRecentActivities(data.recentActivity || []);

      setUserGrowthData(data.userGrowth || [
        { month: "Jan", users: 20 },
        { month: "Feb", users: 35 },
        { month: "Mar", users: 40 },
        { month: "Apr", users: 55 },
        { month: "May", users: 60 },
      ]);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleRetry = () => {
    fetchOverview();
  };

  // Loading State
  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded-lg w-48 mb-8"></div>
          
          {/* Skeleton Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 shadow rounded-lg p-4 h-24 flex items-center space-x-4"
                >
                  <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-24"></div>
                  </div>
                </div>
              ))}
          </div>

          {/* Skeleton Chart */}
          <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6 mb-8">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-32 mb-6"></div>
            <div className="h-64 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
          </div>

          {/* Skeleton Activity */}
          <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-32 mb-6"></div>
            <div className="space-y-3">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
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
          <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100 mb-2">
            Unable to load dashboard
          </h2>
          <p className="text-gray-600 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={handleRetry}
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
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-slate-100">
        Admin Dashboard
      </h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6 hover:shadow-lg transition-shadow border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <Users size={28} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-gray-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wide">
                Total Users
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {overview.totalUsers.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6 hover:shadow-lg transition-shadow border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-100 dark:bg-pink-900/20 rounded-xl">
              <Heart size={28} className="text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <div className="text-gray-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wide">
                Active Volunteers
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {overview.activeVolunteers.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6 hover:shadow-lg transition-shadow border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <Briefcase size={28} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-gray-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wide">
                Active NGOs
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {overview.activeNGOs.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6 hover:shadow-lg transition-shadow border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
              <Activity size={28} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-gray-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wide">
                Total Opportunities
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {overview.totalOpportunities.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* USER GROWTH CHART */}
        <div className="bg-white dark:bg-slate-800 shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-slate-100">
            User Growth (Monthly)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userGrowthData}>
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip />
              <Bar dataKey="users" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white dark:bg-slate-800 shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-slate-100 flex items-center gap-2">
            Recent Activity
            {recentActivities.length > 0 && (
              <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full font-medium">
                {recentActivities.length}
              </span>
            )}
          </h2>
          <div className="max-h-96 overflow-y-auto">
            {recentActivities.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.timestamp}
                    className="group flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-600/50 rounded-lg transition-colors"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm leading-tight">
                        {formatActivityMessage(activity)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                        {formatTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Helper functions
  function getActivityIcon(type) {
    const icons = {
      UPDATE_USER_STATUS: "👤",
      DELETE_OPPORTUNITY: "🗑️",
      new_opportunity: "🎯",
      new_user: "👤",
      ngo_update: "🏛️",
      volunteer_signup: "🙋",
    };
    return icons[type] || "📋";
  }

  function formatActivityMessage(activity) {
    const messages = {
      UPDATE_USER_STATUS: `User status updated: ${activity.details?.newStatus || "status changed"}`,
      DELETE_OPPORTUNITY: `Opportunity deleted by admin`,
      new_opportunity: `${activity.details?.ngoName || "NGO"} posted new opportunity`,
      new_user: `New user registered: ${activity.details?.userName || "User"}`,
      ngo_update: `${activity.details?.ngoName || "NGO"} updated profile`,
      volunteer_signup: `${activity.details?.volunteerName || "Volunteer"} signed up`,
    };
    return messages[activity.type] || `${activity.adminName || "Admin"} performed action: ${activity.type?.replace(/_/g, ' ').toLowerCase() || "activity logged"}`;
  }

  function formatTime(timestamp) {
    return new Date(timestamp).toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }
}

export default AdminDashboard;

