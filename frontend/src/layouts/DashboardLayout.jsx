// src/layouts/DashboardLayout.jsx
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { FaBell, FaUserCircle } from "react-icons/fa";

const DashboardLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900 dark:bg-slate-900 dark:text-slate-100">
      {/* LEFT: Sidebar */}
      <Sidebar />

      {/* RIGHT: page content */}
      <div className="flex-1 flex flex-col">
        {/* TOP BAR: back arrow + search + icons */}
        <header className="px-8 pt-6">
          <div className="flex items-center w-full gap-4">
            {/* GLOBAL BACK ARROW */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <span className="text-lg leading-none">←</span>
            </button>

            {/* Full-width search bar */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search pickups, opportunities..."
                className="w-full border border-gray-300 rounded-full px-4 py-2 pr-16 text-sm
                           focus:outline-none focus:ring-2 focus:ring-green-500
                           bg-white text-gray-900
                           dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
              />

              {/* Icons inside search bar on right */}
              <div className="absolute inset-y-0 right-4 flex items-center gap-3 text-gray-600 dark:text-slate-200">
                <button type="button" className="hover:text-gray-800 dark:hover:text-white text-lg">
                  <FaBell />
                </button>
                <button type="button" className="hover:text-gray-800 dark:hover:text-white text-xl">
                  <FaUserCircle />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;