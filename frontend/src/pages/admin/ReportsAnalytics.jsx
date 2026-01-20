// src/pages/admin/ReportsAnalytics.jsx
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import {
  Download,
  Calendar,
  Users,
  ClipboardList,
  Heart,
  Filter,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { getAdminReports } from "../../api/adminApi";

function ReportsAnalytics() {
  const [reports, setReports] = useState({
    userGrowth: [],
    opportunityTrends: [],
    volunteerParticipation: [],
    summary: {
      totalUsers: 0,
      totalOpportunities: 0,
      totalVolunteers: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("30d");
  const [downloading, setDownloading] = useState(false);

  // Date range options
  const dateRanges = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "365d", label: "Last year" },
    { value: "all", label: "All time" },
  ];

  // Fetch reports
  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAdminReports({ period: dateRange });

      setReports(response);
    } catch (err) {
      setError("Failed to load reports. Please try again.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Download reports
  const downloadReport = async (format = "csv") => {
    try {
      setDownloading(true);

      if (format === "pdf") {
        // For PDF, fetch with auth token then open in new window
        const token = localStorage.getItem("wastezero_token");
        const url = `http://localhost:5000/api/admin/reports/download?format=${format}&period=${dateRange}`;
        
        const response = await fetch(url, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch report");
        }

        const html = await response.text();
        const blob = new Blob([html], { type: "text/html" });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
        
        // Clean up the blob URL after a delay
        setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
      } else {
        // For CSV, download as file
        const token = localStorage.getItem("wastezero_token");
        const url = `http://localhost:5000/api/admin/reports/download?format=${format}&period=${dateRange}`;
        
        const response = await fetch(url, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch report");
        }

        const csv = await response.text();
        const blob = new Blob([csv], { type: "text/csv" });
        const blobUrl = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", `reports-${dateRange}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(blobUrl);
      }
    } catch (err) {
      alert("Failed to download report");
      console.error("Download error:", err);
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  // Loading State
  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-4 h-12">
            <div className="h-10 w-10 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded-lg w-64"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 h-32"></div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 h-96"></div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 h-96"></div>
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
          <h2 className="text-xl font-semibold mb-2">Failed to load reports</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={fetchReports}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 mx-auto"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  // COLORS
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <BarChart className="w-8 h-8 text-gray-600 dark:text-slate-400" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Comprehensive platform insights and metrics
          </p>
        </div>
      </div>

      {/* Date Filter & Download */}
      <div className="bg-white dark:bg-slate-800 shadow rounded-xl p-6 mb-8 border border-gray-100 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
            <Calendar className="w-4 h-4" />
            <span>{dateRanges.find(r => r.value === dateRange)?.label}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {dateRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => downloadReport("csv")}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
            <button
              onClick={() => downloadReport("pdf")}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 shadow rounded-xl p-6 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400 uppercase tracking-wide font-medium">
                Total Users
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {reports.summary.totalUsers.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 shadow rounded-xl p-6 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <ClipboardList className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400 uppercase tracking-wide font-medium">
                Total Opportunities
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {reports.summary.totalOpportunities.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 shadow rounded-xl p-6 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
              <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400 uppercase tracking-wide font-medium">
                Total Participation
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {reports.summary.totalVolunteers.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* User Growth Chart - Stock Market Style */}
        <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-8 border border-gray-100 dark:border-slate-700">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Growth</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Cumulative user registrations over time</p>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={reports.userGrowth} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="0" vertical={false} stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280" 
                style={{ fontSize: '12px' }}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [value.toLocaleString(), 'Total Users']}
              />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorUsers)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Opportunity Creation Chart - Stock Market Style */}
        <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-8 border border-gray-100 dark:border-slate-700">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Opportunity Creation</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">New opportunities created weekly</p>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={reports.opportunityTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOpps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="0" vertical={false} stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [value.toLocaleString(), 'Opportunities']}
              />
              <Area 
                type="monotone" 
                dataKey="opportunities" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorOpps)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Volunteer Participation by Opportunity */}
        <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-8 border border-gray-100 dark:border-slate-700">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Opportunity Participation</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Users interested/participated in each opportunity</p>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={reports.volunteerParticipation}
              margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="0" vertical={true} stroke="#e5e7eb" />
              <XAxis 
                type="number"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                dataKey="name"
                type="category"
                stroke="#6b7280"
                style={{ fontSize: '11px' }}
                tick={{ fill: '#6b7280' }}
                width={200}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [value.toLocaleString() + ' participants', 'Users']}
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              />
              <Bar 
                dataKey="participants" 
                fill="#06b6d4"
                radius={[0, 8, 8, 0]}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default ReportsAnalytics;

