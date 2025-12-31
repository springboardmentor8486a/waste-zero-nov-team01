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
      await login(email, password);        // /api/auth/login call via context

      // role batti navigate
      if (role === "NGO") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
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
    <div className="login-page">
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
              style={{
                width: "100%",
                padding: "7px 10px",
                borderRadius: 8,
                border: "1px solid #d4d4d4",
                fontSize: 13,
              }}
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
              style={{
                width: "100%",
                padding: "7px 10px",
                borderRadius: 8,
                border: "1px solid #d4d4d4",
                fontSize: 13,
              }}
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
              style={{
                width: "100%",
                padding: "7px 10px",
                borderRadius: 8,
                border: "1px solid #d4d4d4",
                fontSize: 13,
              }}
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
              style={{
                padding: "8px 22px",
                borderRadius: 999,
                border: "none",
                background: loading ? "#9ca3af" : "#39d353",
                color: "white",
                fontSize: 13,
                fontWeight: 600,
                cursor: loading ? "default" : "pointer",
              }}
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