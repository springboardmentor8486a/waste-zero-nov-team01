// src/layouts/NGOLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // path correct aithe ok

function DashboardLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Left sidebar */}
      <Sidebar />

      {/* Right content area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top navbar kavali ante ikkada petti */}
        {/* <Navbar /> */}

        {/* Main page content */}
        <main style={{ padding: "16px", flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;