// src/pages/Dashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="space-y-6">
     {/* Admin Dashboard header + stats */}
      <section className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Manage platform users, monitor activity, and generate reports.
          </p>
        </div>

        {/* Stats cards row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Users" value="0" />
          <StatCard title="Completed Pickups" value="0" />
          <StatCard title="Pending Pickups" value="0" />
          <StatCard title="Active Opportunities" value="0" />
        </div>
      </section>

      {/* Generate Reports section */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
          Generate Reports
        </h2>
        <p className="text-sm text-gray-500">
          Download platform statistics and activity reports.
        </p>

        <div className="flex flex-wrap gap-3">
          <ReportButton label="Users Report" />
          <ReportButton label="Pickup Report" />
          <ReportButton label="Opportunities Report" />
          <ReportButton label="Full Activity Report" />
        </div>
      </section>

      {/* Manage Users + Admin Logs */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Manage Users */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Manage Users</h3>
          </div>
          <input
            type="text"
            placeholder="Search users..."
            className="w-full rounded-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <p className="mt-3 text-xs text-gray-400">
            User list and permissions management coming soon.
          </p>
        </div>

        {/* Admin Logs */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Admin Logs</h3>
          </div>
          <p className="text-xs text-gray-400">
            Track important admin actions and platform changes here.
          </p>
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm flex flex-col gap-1">
      <span className="text-xs text-gray-500">{title}</span>
      <span className="text-2xl font-semibold text-gray-900">{value}</span>
    </div>
  );
}

function ReportButton({ label }) {
  return (
    <button className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-emerald-500 hover:text-emerald-700">
      {label}
    </button>
  );
}

export default Dashboard;