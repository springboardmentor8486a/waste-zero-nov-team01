// src/utils/RequireAdmin.jsx - DEBUG MODE ✅
import React, { useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

function RequireAdmin({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // 🔥 DEBUG: Log user data on every check
  useEffect(() => {
    console.log("🔍 RequireAdmin DEBUG:", {
      hasUser: !!user,
      userRole: user?.role,
      roleType: typeof user?.role,
      fullUser: user,
      path: location.pathname
    });
  }, [user, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <div className="text-gray-500 dark:text-gray-300 text-sm">Checking admin permissions...</div>
        </div>
      </div>
    );
  }

  // No user
  if (!user) {
    console.log("❌ No user - redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🔥 FIXED: Case-insensitive + null-safe admin check
  const userRole = user.role?.toString().toLowerCase().trim();
  const isAdminUser = userRole === "admin";
  
  console.log("🔍 Role check:", { rawRole: user.role, normalizedRole: userRole, isAdmin: isAdminUser });

  if (!isAdminUser) {
    console.log("❌ Not admin - redirecting to unauthorized");
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  console.log("✅ Admin access granted!");
  return children;
}

// Unauthorized Component
RequireAdmin.Unauthorized = function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 shadow-2xl rounded-3xl p-8 text-center border border-red-200 dark:border-slate-700">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4">Access Denied</h1>
        <p className="text-gray-600 dark:text-slate-400 text-lg mb-8">Administrator privileges required.</p>
        <div className="space-y-3">
          <button onClick={() => window.history.back()} className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold rounded-xl">
            ← Go Back
          </button>
          <button onClick={() => window.location.href = "/"} className="w-full px-6 py-3 text-gray-600 dark:text-slate-400 hover:text-blue-600 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50">
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequireAdmin;
