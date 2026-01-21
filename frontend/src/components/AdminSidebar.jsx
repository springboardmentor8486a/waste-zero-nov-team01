// src/components/AdminSidebar.jsx - ADMIN ONLY
import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

import {
  ShieldCheck,
  Users,
  ClipboardList,
  BarChart3,
  FileText,
  LogOut,
} from "lucide-react";

function AdminSidebar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const dark = theme?.dark || false;
  const setDark = theme?.setDark || (() => {});

  const renderLink = (to, label, Icon, end = false) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
          isActive
            ? "bg-gray-900 text-white dark:bg-slate-700 dark:text-white"
            : "text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700/50"
        }`
      }
    >
      <Icon size={18} className="shrink-0" />
      <span className="leading-none">{label}</span>
    </NavLink>
  );

  return (
    <aside className="w-64 min-h-screen border-r bg-white text-gray-800 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 flex flex-col px-4 py-6">
      {/* Logo */}
      <div className="flex items-center gap-1 mb-6">
        <img src="/logo.png" alt="WasteZero" className="w-15 h-15" />
        <span className="font-semibold text-lg text-green-600">WasteZero</span>
      </div>

      {/* User Info */}
      <div className="mb-6">
        <div className="text-xs text-blue-500 dark:text-blue-400 mb-1">Signed in as</div>
        <div className="text-sm font-medium text-gray-500 dark:text-slate-400">
          {user?.name || user?.email || "Admin"}
        </div>
        <div className="text-xs text-blue-500">admin</div>
      </div>

      {/* ADMIN PANEL */}
      <h4 className="text-sm font-bold mb-2 text-black dark:text-slate-200">
        ADMIN PANEL
      </h4>
      <nav className="flex flex-col gap-1 mb-6">
        {renderLink("/admin", "Admin Dashboard", ShieldCheck, true)}
        {renderLink("/admin/users", "User Management", Users)}
        {renderLink("/admin/opportunities", "Opportunity Moderation", ClipboardList)}
        {renderLink("/admin/reports", "Reports & Analytics", BarChart3)}
        {renderLink("/admin/logs", "Activity Logs", FileText)}
      </nav>

      {/* THEME & LOGOUT */}
      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={() => setDark(!dark)}
          className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700/50 transition-colors"
          title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <span>{dark ? "🌙 Dark" : "☀️ Light"}</span>
        </button>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
