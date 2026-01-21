import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "NGO",
    skills: "",
    location: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        // backend usually expects lowercase role
        role: form.role.toLowerCase(), 
        skills: form.skills
          ? form.skills.split(",").map((s) => s.trim())
          : [],
        location: form.location,
        bio: form.bio,
      };

      await register(payload);

      // Redirect based on role
       if (payload.role === "volunteer") navigate("/volunteer-dashboard");
      else navigate("/dashboard"); // NGO
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-page min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <GlassCard>
        {/* Logo + titles block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <img
            src="/logo.png"
            alt="wastezero logo"
            style={{
              width: 50,
              height: 50,
              objectFit: "contain",
              marginBottom: 6,
            }}
          />

          <h2
            className="title"
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: document.documentElement.classList.contains('dark') ? "#e2e8f0" : "#100a0a",
              marginBottom: 2,
            }}
          >
            Waste Zero
          </h2>

          <h2
            className="subtitle"
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: document.documentElement.classList.contains('dark') ? "#cbd5e1" : "#100a0a",
            }}
          >
            Create Account
          </h2>
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            color: document.documentElement.classList.contains('dark') ? "#94a3b8" : "#6b7280",
            marginBottom: 14,
          }}
        >
          Join WasteZero as NGO or Volunteer
        </p>

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
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4, color: document.documentElement.classList.contains('dark') ? "#cbd5e1" : "#374151", fontWeight: 500 }}>
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100 text-xs px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4, color: document.documentElement.classList.contains('dark') ? "#cbd5e1" : "#374151", fontWeight: 500 }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4, color: document.documentElement.classList.contains('dark') ? "#cbd5e1" : "#374151", fontWeight: 500 }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4, color: document.documentElement.classList.contains('dark') ? "#cbd5e1" : "#374151", fontWeight: 500 }}>
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="NGO">NGO</option>
              <option value="VOLUNTEER">Volunteer</option>
            </select>
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4, color: document.documentElement.classList.contains('dark') ? "#cbd5e1" : "#374151", fontWeight: 500 }}>
              Skills (comma separated)
            </label>
            <input
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="Cleaning, Teaching, Fundraising"
              className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4, color: document.documentElement.classList.contains('dark') ? "#cbd5e1" : "#374151", fontWeight: 500 }}>
              Location
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4, color: document.documentElement.classList.contains('dark') ? "#cbd5e1" : "#374151", fontWeight: 500 }}>
              Bio
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100 text-sm px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-full border-0 text-white text-sm font-semibold transition-all duration-200 ${
              loading
                ? "bg-green-300 dark:bg-slate-500 cursor-default opacity-70"
                : "bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-600 dark:to-emerald-500 hover:shadow-lg hover:shadow-green-500/50 dark:hover:shadow-green-600/40 cursor-pointer"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p
          style={{
            marginTop: 10,
            fontSize: 12,
            textAlign: "center",
            color: document.documentElement.classList.contains('dark') ? "#94a3b8" : "#4b5563",
          }}
        >
          Already have an account?{" "}
          <Link to="/" style={{ color: "#16a34a", fontWeight: 600 }}>
            Login
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}

export default Register;