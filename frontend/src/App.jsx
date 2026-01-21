import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

import DashboardLayout from "./layouts/DashboardLayout";
import Ngodashboard from "./pages/NGODashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";

import Opportunities from "./pages/Opportunities";
import OpportunityDetails from "./pages/OpportunityDetails";
import CreateOpportunity from "./pages/CreateOpportunity";
import EditOpportunity from "./pages/EditOpportunity";

import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Messages from "./pages/Messages";
import Help from "./pages/Help";
import Changepassword from "./pages/Changepassword";
import Matches from "./pages/Matches";
import Chat from "./pages/Chat";

// ADMIN PAGES
import RequireAdmin from "./utils/requireAdmin.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import UserManagement from "./pages/admin/UserManagement.jsx";
import OpportunityModeration from "./pages/admin/OpportunityModeration.jsx";
import ReportsAnalytics from "./pages/admin/ReportsAnalytics.jsx";
import AdminLogs from "./pages/admin/AdminLogs.jsx";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              {/* ================= PUBLIC ROUTES ================= */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* ================= ADMIN ROUTES ================= */}
              <Route
                path="/admin/*"
                element={
                  <RequireAdmin>
                    <AdminLayout />
                  </RequireAdmin>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="opportunities" element={<OpportunityModeration />} />
                <Route path="reports" element={<ReportsAnalytics />} />
                <Route path="logs" element={<AdminLogs />} />
              </Route>

              {/* ================= NGO + VOLUNTEER ROUTES ================= */}
              <Route
                path="/"
                element={
                  <ProtectedRoute allowedRoles={["ngo", "volunteer"]}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                {/* NGO DASHBOARD */}
                <Route
                  index
                  element={
                    <ProtectedRoute allowedRoles={["ngo"]}>
                      <Ngodashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["ngo"]}>
                      <Ngodashboard />
                    </ProtectedRoute>
                  }
                />

                {/* VOLUNTEER DASHBOARD */}
                <Route
                  path="volunteer-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["volunteer"]}>
                      <VolunteerDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* OLD NGO PATH → REDIRECT */}
                <Route path="ngo/dashboard" element={<Navigate to="/dashboard" replace />} />

                {/* OPPORTUNITIES */}
                <Route
                  path="opportunities"
                  element={
                    <ProtectedRoute allowedRoles={["volunteer", "ngo"]}>
                      <Opportunities />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="opportunities/create"
                  element={
                    <ProtectedRoute allowedRoles={["ngo"]}>
                      <CreateOpportunity />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="opportunities/:id"
                  element={
                    <ProtectedRoute allowedRoles={["volunteer", "ngo"]}>
                      <OpportunityDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="opportunities/:id/edit"
                  element={
                    <ProtectedRoute allowedRoles={["ngo"]}>
                      <EditOpportunity />
                    </ProtectedRoute>
                  }
                />

                {/* MATCHES / MESSAGES / CHAT */}
                <Route
                  path="matches"
                  element={
                    <ProtectedRoute allowedRoles={["volunteer", "ngo"]}>
                      <Matches />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="messages"
                  element={
                    <ProtectedRoute allowedRoles={["volunteer", "ngo"]}>
                      <Messages />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="chat/:receiverId"
                  element={
                    <ProtectedRoute allowedRoles={["volunteer", "ngo"]}>
                      <Chat />
                    </ProtectedRoute>
                  }
                />

                {/* USER SETTINGS */}
                <Route
                  path="profile"
                  element={
                    <ProtectedRoute allowedRoles={["volunteer", "ngo"]}>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <ProtectedRoute allowedRoles={["volunteer", "ngo"]}>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="change-password"
                  element={
                    <ProtectedRoute allowedRoles={["volunteer", "ngo"]}>
                      <Changepassword />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="help"
                  element={
                    <ProtectedRoute allowedRoles={["volunteer", "ngo"]}>
                      <Help />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* ================= CATCH-ALL ================= */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>

            {/* GLOBAL TOASTER */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  fontWeight: 500,
                },
              }}
            />
          </Router>
        </ThemeProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;