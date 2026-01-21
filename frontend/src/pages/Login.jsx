// src/pages/Login.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import GlassCard from "../components/GlassCard";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [role, setRole] = useState("NGO");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);

      // Redirect based on role
      switch (role.toLowerCase()) {
        case "volunteer":
          navigate("/volunteer-dashboard");
          break;
        case "admin":
          navigate("/admin");
          break;
        default: // NGO
          navigate("/ngo/dashboard");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <GlassCard>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 16,
            marginBottom: 18,
          }}
        >
          <img
            src="/logo.png"
            alt="wastezero logo"
            style={{
              width: 100,
              height: 100,
              objectFit: "contain",
              marginBottom: 6,
            }}
          />
          <div style={{ fontWeight: 700, fontSize: 20, color: "#16a34a" }}>
            WasteZero
          </div>
          <div style={{ fontSize: 12, color: "#6b7280", ...(document.documentElement.classList.contains('dark') && { color: "#94a3b8" }) }}>
            Welcome back, please login
          </div>
        </div>

        {error && (
          <div
            style={{
              marginBottom: 10,
              padding: "8px 12px",
              fontSize: 12,
              borderRadius: 8,
              background: document.documentElement.classList.contains('dark') ? "#7f1d1d" : "#fee2e2",
              color: document.documentElement.classList.contains('dark') ? "#fca5a5" : "#b91c1c",
              border: `1px solid ${document.documentElement.classList.contains('dark') ? "#991b1b" : "#fecaca"}`,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4, color: document.documentElement.classList.contains('dark') ? "#cbd5e1" : "#374151", fontWeight: 500 }}>
              Select Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="NGO">NGO</option>
              <option value="VOLUNTEER">Volunteer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Email */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4, color: document.documentElement.classList.contains('dark') ? "#cbd5e1" : "#374151", fontWeight: 500 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4, color: document.documentElement.classList.contains('dark') ? "#cbd5e1" : "#374151", fontWeight: 500 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Button row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 4,
            }}
          >
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-full border-0 text-white text-sm font-semibold transition-all duration-200 ${
                loading
                  ? "bg-gray-400 dark:bg-slate-500 cursor-default opacity-70"
                  : "bg-gradient-to-r from-emerald-500 to-green-500 dark:from-emerald-600 dark:to-green-500 hover:shadow-lg hover:shadow-emerald-500/50 dark:hover:shadow-emerald-600/40 cursor-pointer"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              style={{
                fontSize: 12,
                color: "#16a34a",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "none",
                padding: 0,
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
              onMouseOut={(e) => (e.target.style.textDecoration = "none")}
            >
              Forgot your password?
            </button>
          </div>

          {/* Register link */}
          <p
            style={{
              marginTop: 10,
              fontSize: 12,
              textAlign: "center",
              color: document.documentElement.classList.contains('dark') ? "#94a3b8" : "#4b5563",
            }}
          >
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#16a34a", fontWeight: 600, textDecoration: "none" }}>
              Register
            </Link>
          </p>
        </form>
      </GlassCard>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowForgotModal(false)}
        >
          <div
            style={{
              backgroundColor: document.documentElement.classList.contains('dark') ? "#0f172a" : "#ffffff",
              borderRadius: "12px",
              padding: "32px",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
              border: document.documentElement.classList.contains('dark') ? "1px solid #1e293b" : "1px solid #e5e7eb",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowForgotModal(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: document.documentElement.classList.contains('dark') ? "#94a3b8" : "#6b7280",
              }}
            >
              ×
            </button>

            <h2
              style={{
                fontSize: "20px",
                fontWeight: "700",
                marginBottom: "8px",
                color: document.documentElement.classList.contains('dark') ? "#ffffff" : "#111827",
              }}
            >
              Password Recovery
            </h2>

            <p
              style={{
                fontSize: "13px",
                color: document.documentElement.classList.contains('dark') ? "#cbd5e1" : "#6b7280",
                marginBottom: "20px",
              }}
            >
              Need help with your password? Contact our support team for assistance.
            </p>

            {/* Email Section */}
            <div
              style={{
                backgroundColor: document.documentElement.classList.contains('dark') ? "#1e293b" : "#f9fafb",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "16px",
                border: document.documentElement.classList.contains('dark') ? "1px solid #334155" : "1px solid #e5e7eb",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  color: document.documentElement.classList.contains('dark') ? "#94a3b8" : "#6b7280",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                📧 HELPLINE EMAIL
              </p>
              <a
                href="mailto:wastezero00@gmail.com"
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#16a34a",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
                onMouseOut={(e) => (e.target.style.textDecoration = "none")}
              >
                wastezero00@gmail.com
              </a>
            </div>

            {/* Contact Owner Section */}
            <div
              style={{
                backgroundColor: document.documentElement.classList.contains('dark') ? "#1e293b" : "#f9fafb",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "20px",
                border: document.documentElement.classList.contains('dark') ? "1px solid #334155" : "1px solid #e5e7eb",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  color: document.documentElement.classList.contains('dark') ? "#94a3b8" : "#6b7280",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                👤 CONTACT OWNER
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: document.documentElement.classList.contains('dark') ? "#e2e8f0" : "#111827",
                  marginBottom: "8px",
                }}
              >
                For urgent assistance, reach out to the owner directly.
              </p>
              <button
                onClick={() => {
                  const message = "Hi, I need help with password recovery for my WasteZero account.";
                  window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, "_blank");
                }}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  backgroundColor: "#25D366",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
                onMouseOver={(e) => (e.target.style.opacity = "0.9")}
                onMouseOut={(e) => (e.target.style.opacity = "1")}
              >
                💬 WhatsApp Owner
              </button>
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowForgotModal(false)}
              style={{
                width: "100%",
                padding: "10px 12px",
                backgroundColor: document.documentElement.classList.contains('dark') ? "#334155" : "#e5e7eb",
                color: document.documentElement.classList.contains('dark') ? "#e2e8f0" : "#111827",
                border: "none",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.opacity = "0.8")}
              onMouseOut={(e) => (e.target.style.opacity = "1")}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;