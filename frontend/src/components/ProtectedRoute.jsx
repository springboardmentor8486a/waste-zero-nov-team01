// src/components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // or show a spinner

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed for this route
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const fallbackPath =
      user.role === "admin" || user.role === "ngo"
        ? "/dashboard"
        : "/volunteer-dashboard";

    return <Navigate to={fallbackPath} replace />;
  }

  // All good
  return children;
};

export default ProtectedRoute;