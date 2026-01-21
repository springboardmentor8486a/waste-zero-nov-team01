// src/pages/admin/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-slate-900">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main content area */}
      <main className="flex-1 p-6">
        {/* This renders the nested admin routes */}
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
