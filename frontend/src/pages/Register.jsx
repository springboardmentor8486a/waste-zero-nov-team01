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
        role: form.role,
        skills: form.skills.split(",").map((s) => s.trim()),
        location: form.location,
        bio: form.bio,
      };

      await register(payload); // /auth/register API
      alert("Registration successful. Please login.");
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (<div className="login-page">
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
          color: "#100a0aff",
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
          color: "#100a0aff",
        }}
      >
        Create Account
      </h2>
    </div>

    <p
      style={{
        textAlign: "center",
        fontSize: 12,
        color: "#6b7280",
        marginBottom: 14,
      }}
    >
      Join WasteZero as NGO or Volunteer
    </p>

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
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "7px 10px",
                borderRadius: 8,
                border: "1px solid #d4d4d4",
                fontSize: 10,
              }}
              required
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "7px 10px",
                borderRadius: 8,
                border: "1px solid #d4d4d4",
                fontSize: 13,
              }}
              required
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "7px 10px",
                borderRadius: 8,
                border: "1px solid #d4d4d4",
                fontSize: 13,
              }}
              required
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
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

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
              Skills (comma separated)
            </label>
            <input
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="Cleaning, Teaching, Fundraising"
              style={{
                width: "100%",
                padding: "7px 10px",
                borderRadius: 8,
                border: "1px solid #d4d4d4",
                fontSize: 13,
              }}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
              Location
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "7px 10px",
                borderRadius: 8,
                border: "1px solid #d4d4d4",
                fontSize: 13,
              }}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
              Bio
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
              style={{
                width: "100%",
                padding: "7px 10px",
                borderRadius: 8,
                border: "1px solid #d4d4d4",
                fontSize: 13,
                resize: "vertical",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "9px 0",
              borderRadius: 999,
              border: "none",
              background: loading ? "#6ee7b7" : "#16a34a",
              color: "white",
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "default" : "pointer",
            }}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p
          style={{
            marginTop: 10,
            fontSize: 12,
            textAlign: "center",
            color: "#4b5563",
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