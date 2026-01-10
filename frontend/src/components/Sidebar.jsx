// src/components/Sidebar.jsx
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import { useTheme } from "../context/ThemeContext";
import {
  LayoutDashboard,
  CalendarCheck,
  HandHeart,
  MessageSquare,
  Leaf,
  User,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const theme = useTheme();
  
  // Safely get dark mode state and setter
  const dark = theme?.dark || false;
  const setDark = theme?.setDark || (() => {});

  const linkClass =
   "flex items-center gap-3 px-3 py-2 rounded-lg text-sm " +
  "text-gray-700 hover:bg-gray-100 " +
  "dark:text-gray-300 dark:hover:bg-gray-800";
  const activeClass = "bg-gray-900 text-white dark:bg-gray-900";

  const renderLink = (to, label, Icon, end = false) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm
       ${isActive ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"}`
    }
  >
    <Icon size={18} className="shrink-0" />
    <span className="leading-none">{label}</span>
  </NavLink>
);

  const role = user?.role || "ngo";

  // Dashboard route is role‑based
  const dashboardPath =
    role === "volunteer" ? "/volunteer-dashboard" : "/dashboard";

  return (
    <aside className="w-64 min-h-screen border-r bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100 flex flex-col px-4 py-6">
      {/* Logo */}
      <div className="flex items-center gap-1 mb-6">
        <img src="/logo.png" alt="WasteZero" className="w-15 h-15" />
        <span className="font-semibold text-lg text-green-600">WasteZero</span>
      </div>

      {/* User section */}
      <div className="mb-6">
        <div className="text-xs text-blue-500 mb-1">Signed in as</div>
        <div className="text-sm font-medium text-gray-500">
          {user?.name || user?.email || "User"}
        </div>
        <div className="text-xs text-blue-500">
          {role.toLowerCase()}
        </div>
      </div>

      {/* MAIN MENU */}
      <h4
        style={{
          fontSize: 15,
          marginBottom: 8,
          color: "#000000",
          fontWeight: 700,
          letterSpacing: "1px",
        }}
      >
        MAIN MENU
      </h4>

      <nav className="flex flex-col gap-1 mb-6">
        {/* Dashboard (role‑based path) */}
        {renderLink(dashboardPath, "Dashboard", LayoutDashboard, true)}

        {/* Common menu items */}
        {renderLink("/schedule-pickup", "Schedule Pickup", CalendarCheck)}
        {renderLink("/opportunities", "Opportunities",  HandHeart)}
        {renderLink("/messages", "Messages", MessageSquare)}
        {renderLink("/matches", "Matches", Leaf)}
      </nav>

      {/* SETTINGS */}
      <h4
        style={{
          fontSize: 15,
          marginBottom: 8,
          color: "#000000",
          fontWeight: 700,
          letterSpacing: "1px",
        }}
       
      >
        SETTINGS
      </h4>

      <nav className="flex flex-col gap-1 mb-6">
        {renderLink("/profile", "My Profile", User)}
        {renderLink("/settings", "Settings",  Settings)}
        {renderLink("/help", "Help & Support",  HelpCircle)}
      </nav>

      
      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={() => {
            console.log("Theme toggle clicked, current dark:", dark, "new dark:", !dark);
            setDark(!dark);
          }}
          className="flex items-center justify-between px-3 py-2 rounded-lg
          text-sm font-medium transition-colors
          text-gray-700 hover:bg-gray-100
          dark:text-gray-300 dark:hover:bg-gray-800"
          title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <span>{dark ? "🌙 Dark" : "☀️ Light"}</span>
        </button>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg
          bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;