// src/pages/admin/AdminLogs.jsx - COMPLETE ✅
import React, { useState, useEffect, useCallback } from "react";
import {
  FileText,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { getAdminLogs } from "../../api/adminApi";

function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10,
  });

  // Fetch logs
  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.currentPage,
        limit: pagination.pageSize,
      };

      const response = await getAdminLogs(params);

      setLogs(response.logs || []);
      setPagination({
        currentPage: response.currentPage || 1,
        totalPages: response.totalPages || 1,
        totalCount: response.totalCount || 0,
        pageSize: response.pageSize || 10,
      });
    } catch (err) {
      setError("Failed to load activity logs. Please try again.");
      console.error("Logs API Error:", err);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.pageSize]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Pagination handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: page }));
    }
  };

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
            <div className="p-6 border-b">
              <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded-lg w-80 mb-4"></div>
            </div>
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="p-6 border-b border-gray-100 dark:border-slate-700 flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-64"></div>
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-48"></div>
                </div>
              </div>
            ))}
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
          <h2 className="text-xl font-semibold mb-2">{error}</h2>
          <button
            onClick={fetchLogs}
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
        <FileText className="w-8 h-8 text-gray-600 dark:text-slate-400" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">
          Activity Logs
        </h1>
        <div className="text-sm text-gray-500 dark:text-slate-400 ml-2">
          ({pagination.totalCount.toLocaleString()} total actions)
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700/50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Target
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-slate-600/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      log.action.includes('created') ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      log.action.includes('approved') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      log.action.includes('deleted') || log.action.includes('rejected') ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}>
                      {log.action.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {log.adminName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
                        {log.adminName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                        {log.targetName || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-400">
                    {new Date(log.timestamp).toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* No logs */}
        {logs.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500 dark:text-slate-400">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-40" />
            <p className="text-lg">No activity logs found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white dark:bg-slate-800 shadow rounded-xl p-6 mt-8 border border-gray-100 dark:border-slate-700 flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-slate-400">
            Showing page {pagination.currentPage} of {pagination.totalPages} 
            ({pagination.totalCount.toLocaleString()} total)
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-sm font-medium rounded-lg">
              Page {pagination.currentPage}
            </span>
            
            <button
              onClick={() => goToPage(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLogs;

