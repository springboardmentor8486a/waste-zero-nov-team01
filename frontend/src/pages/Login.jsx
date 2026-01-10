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

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);

      if (role === "NGO") {
        navigate("/ngo/dashboard");
      } else {
        navigate("/volunteer-dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
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
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            Welcome back, please login
          </div>
        </div>

        {error && (
          <div
            style={{
              marginBottom: 10,
              padding: "6px 10px",
              fontSize: 12,
              borderRadius: 6,
              background: "#fee2e2",
              color: "#b91c1c",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
              Select Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="NGO">NGO</option>
              <option value="VOLUNTEER">Volunteer</option>
            </select>
          </div>

          {/* Email */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className={`px-6 py-2 rounded-full border-0 text-white text-sm font-semibold ${
                loading
                  ? "bg-gray-400 cursor-default"
                  : "bg-emerald-500 hover:bg-emerald-600 cursor-pointer"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <span style={{ fontSize: 12, color: "#16a34a" }}>
              Forgot your password?
            </span>
          </div>

          {/* Register link */}
          <p
            style={{
              marginTop: 10,
              fontSize: 12,
              textAlign: "center",
              color: "#4b5563",
            }}
          >
            Don’t have an account?{" "}
            <Link to="/register" style={{ color: "#16a34a", fontWeight: 600 }}>
              Register
            </Link>
          </p>
        </form>
      </GlassCard>
    </div>
  );
}

export default Login;