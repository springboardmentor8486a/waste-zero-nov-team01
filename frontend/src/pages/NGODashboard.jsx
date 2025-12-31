// src/pages/Ngodashboard.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Ngodashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-8 space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user?.name || "NGO Partner"} 
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage your volunteering opportunities and track applications here.
        </p>
      </div>

      {/* Top cards: quick stats (static for now) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-xs text-gray-500 mb-1">Active Opportunities</p>
          <p className="text-2xl font-semibold text-gray-900">2</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-xs text-gray-500 mb-1">Total Applications</p>
          <p className="text-2xl font-semibold text-gray-900">0</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-xs text-gray-500 mb-1">Completed Drives</p>
          <p className="text-2xl font-semibold text-gray-900">0</p>
        </div>
      </div>

      {/* Main content: left info + right quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* NGO profile summary */}
        <section className="bg-white rounded-xl shadow-sm border p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            NGO Profile
          </h2>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium text-gray-800">Name: </span>
            {user?.name || "NGO Name"}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium text-gray-800">Email: </span>
            {user?.email}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium text-gray-800">Location: </span>
            {user?.location || "Not set"}
          </p>
          <p className="text-sm text-gray-600 mt-3">
            {user?.bio ||
              "Add a short description about your organization and the kind of volunteering work you do."}
          </p>
        </section>

        {/* Quick actions */}
        <section className="bg-white rounded-xl shadow-sm border p-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            Quick Actions
          </h2>

          <Link
            to="/opportunities/create"
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg"
          >
            + Create Opportunity
          </Link>

          <Link
            to="/opportunities"
            className="block w-full text-center border border-gray-300 text-sm font-medium text-gray-800 py-2.5 rounded-lg hover:bg-gray-50"
          >
            View All Opportunities
          </Link>

          <Link
            to="/profile"
            className="block w-full text-center text-xs text-blue-600 hover:underline mt-1"
          >
            Edit NGO profile
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Ngodashboard;