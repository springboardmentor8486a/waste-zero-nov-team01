// src/components/Sidebar.jsx
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Sidebar() {
  const { user, logout } = useContext(AuthContext);

  let dark = false;
  let setDark = () => {};
  try {
    const theme = useTheme();
    if (theme) {
      dark = theme.dark;
      setDark = theme.setDark;
    }
  } catch (e) {}

  const linkClass =
    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100";
  const activeClass = "bg-gray-900 text-white hover:bg-gray-900";

  const renderLink = (to, label, end = false) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `${linkClass} ${isActive ? activeClass : ""}`
      }
    >
      {label}
    </NavLink>
  );

  const role = user?.role || "ngo";

  // Dashboard route is role‑based
  const dashboardPath =
    role === "volunteer" ? "/volunteer-dashboard" : "/dashboard";

  return (
    <aside className="w-64 min-h-screen border-r bg-white flex flex-col px-4 py-6">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-6">
        <img src="/logo.png" alt="WasteZero" className="w-8 h-8" />
        <span className="font-semibold text-lg">WasteZero</span>
      </div>

      {/* User section */}
      <div className="mb-6">
        <div className="text-xs text-gray-500 mb-1">Signed in as</div>
        <div className="text-sm font-medium">
          {user?.name || user?.email || "User"}
        </div>
        <div className="text-xs text-gray-500">
          {role.toLowerCase()}
        </div>
      </div>

      {/* MAIN MENU */}
      <h4
        style={{
          fontSize: 12,
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
        {renderLink(dashboardPath, "Dashboard", true)}

        {/* Common menu items */}
        {renderLink("/schedule-pickup", "Schedule Pickup")}
        {renderLink("/opportunities", "Opportunities")}
        {renderLink("/messages", "Messages")}
        {renderLink("/matches", "My Impact")}
      </nav>

      {/* SETTINGS */}
      <h4
        style={{
          fontSize: 12,
          marginBottom: 8,
          color: "#000000",
          fontWeight: 700,
          letterSpacing: "1px",
        }}
      >
        SETTINGS
      </h4>

      <nav className="flex flex-col gap-1 mb-6">
        {renderLink("/profile", "My Profile")}
        {renderLink("/settings", "Settings")}
        {renderLink("/help", "Help & Support")}
      </nav>

      {/* Bottom actions */}
      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={() => setDark(!dark)}
          className="text-xs text-gray-600 text-left px-3 py-2 rounded-lg hover:bg-gray-100"
        >
          {dark ? "Light Mode" : "Dark Mode"}
        </button>

        <button
          onClick={logout}
          className="px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 text-left"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;