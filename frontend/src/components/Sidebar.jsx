// src/components/Sidebar.jsx - UPDATED ✅
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

import {
  LayoutDashboard,
  HandHeart,
  MessageSquare,
  Leaf,
  User,
  HelpCircle,
  LogOut,
  ShieldCheck,
  Users,
  FileText,
  BarChart3,
  ClipboardList,
} from "lucide-react";

function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const theme = useTheme();
  const dark = theme?.dark || false;
  const setDark = theme?.setDark || (() => {});

  const role = user?.role?.toLowerCase() || "ngo"; // safe role

  const renderLink = (to, label, Icon, end = false) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
          isActive
            ? "bg-gray-900 text-white dark:bg-gray-900"
            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        }`
      }
    >
      <Icon size={18} className="shrink-0" />
      <span className="leading-none">{label}</span>
    </NavLink>
  );

  // Dashboard path based on role
  const dashboardPath =
    role === "volunteer" ? "/volunteer-dashboard" : "/dashboard";

  return (
    <aside className="w-64 min-h-screen border-r bg-white text-gray-800 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 flex flex-col px-4 py-6">
      {/* Logo */}
      <div className="flex items-center gap-1 mb-6">
        <img src="/logo.png" alt="WasteZero" className="w-15 h-15" />
        <span className="font-semibold text-lg text-green-600 dark:text-green-400">WasteZero</span>
      </div>

      {/* User Info */}
      <div className="mb-6 dark:border-b dark:border-slate-700 pb-4">
        <div className="text-xs text-blue-500 dark:text-blue-400 mb-1">Signed in as</div>
        <div className="text-sm font-medium text-gray-500 dark:text-slate-300">
          {user?.name || user?.email || "User"}
        </div>
        <div className="text-xs text-blue-500 dark:text-blue-400">{role}</div>
      </div>

      {/* MAIN MENU */}
      <h4 className="text-sm font-bold mb-2 text-black dark:text-slate-200">
        MAIN MENU
      </h4>
      <nav className="flex flex-col gap-1 mb-6">
        {renderLink(dashboardPath, "Dashboard", LayoutDashboard, true)}
        {renderLink("/opportunities", "Opportunities", HandHeart)}
        {renderLink("/messages", "Messages", MessageSquare)}
        {renderLink("/matches", "Matches", Leaf)}
      </nav>

      {/* ADMIN PANEL (only for admins) */}
      {role === "admin" && (
        <>
          <h4 className="text-sm font-bold mb-2 text-black dark:text-slate-200">
            ADMIN PANEL
          </h4>
          <nav className="flex flex-col gap-1 mb-6">
            {renderLink("/admin", "Admin Dashboard", ShieldCheck, true)}
            {renderLink("/admin/users", "User Management", Users)}
            {renderLink("/admin/opportunities", "Opportunity Moderation", ClipboardList)}
            {renderLink("/admin/reports", "Reports & Analytics", BarChart3)}
          </nav>
        </>
      )}

      {/* SETTINGS */}
      <h4 className="text-sm font-bold mb-2 text-black dark:text-slate-200">
        HELP & SUPPORT
      </h4>
      <nav className="flex flex-col gap-1 mb-6">
        {renderLink("/profile", "My Profile", User)}
        {renderLink("/help", "Help & Support", HelpCircle)}
      </nav>

      {/* THEME & LOGOUT */}
      <div className="mt-auto flex flex-col gap-2 dark:border-t dark:border-slate-700 pt-4">
        <button
          onClick={() => setDark(!dark)}
          className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
        </button>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg bg-red-500 dark:bg-red-600 text-white text-sm font-medium hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
