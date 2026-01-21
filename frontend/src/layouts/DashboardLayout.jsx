// src/layouts/DashboardLayout.jsx
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900 dark:bg-slate-900 dark:text-slate-100">
      {/* LEFT: Sidebar */}
      <Sidebar />

      {/* RIGHT: page content */}
      <div className="flex-1 flex flex-col">
        {/* TOP BAR: back arrow */}
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