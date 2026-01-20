import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { updateProfile } from "../api/authApi";

function Profile() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // form state
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    location: "",
    skills: "",
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Load current user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem("wastezero_token");
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data;
        setForm({
          fullName: userData.name || "",
          email: userData.email || "",
          location: userData.location || "",
          skills: Array.isArray(userData.skills) ? userData.skills.join(", ") : userData.skills || "",
          bio: userData.bio || "",
        });
      } catch (err) {
        console.error("Failed to load user data:", err);
        // Fallback to auth context
        if (user) {
          setForm({
            fullName: user.name || "",
            email: user.email || "",
            location: user.location || "",
            skills: Array.isArray(user.skills) ? user.skills.join(", ") : user.skills || "",
            bio: user.bio || "",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]); 

  const labelStyle = {
    display: "block",
    marginBottom: "4px",
    color: document.documentElement.classList.contains('dark') ? "#cbd5e1" : "#111111",
    fontWeight: "600",
    fontSize: "13px",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: document.documentElement.classList.contains('dark') ? "1px solid #475569" : "1px solid #e5e7eb",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px",
    backgroundColor: document.documentElement.classList.contains('dark') ? "#0f172a" : "#ffffff",
    color: document.documentElement.classList.contains('dark') ? "#e2e8f0" : "#111111",
    transition: "all 0.2s",
  };

  // generic change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // save click
  const handleSave = async () => {
    try {
      setUpdating(true);
      setSuccessMessage("");
      
      const token = localStorage.getItem("wastezero_token");
      
      // Convert skills string to array
      const skillsArray = form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      const payload = {
        name: form.fullName,
        email: form.email,
        location: form.location,
        skills: skillsArray,
        bio: form.bio,
      };

      const res = await axios.put("http://localhost:5000/api/users/me", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update form with response data
      setForm({
        fullName: res.data.name || "",
        email: res.data.email || "",
        location: res.data.location || "",
        skills: Array.isArray(res.data.skills) ? res.data.skills.join(", ") : "",
        bio: res.data.bio || "",
      });

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to update profile: " + (err.response?.data?.message || err.message));
    } finally {
      setUpdating(false);
    }
  }; 

  return (
    <div
      style={{
        padding: "24px 40px",
        maxWidth: "720px",
        margin: "0 auto",
        minHeight: "100vh",
        backgroundColor: document.documentElement.classList.contains('dark') ? "transparent" : "transparent",
      }}
    >
      {/* Loading state */}
      {loading && (
        <div style={{ padding: "20px", textAlign: "center", color: document.documentElement.classList.contains('dark') ? "#94a3b8" : "#6b7280" }}>
          Loading your profile...
        </div>
      )}

      {!loading && (
        <>
          {/* My Profile heading */}
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "800",
              marginBottom: "8px",
              background: document.documentElement.classList.contains('dark') ? "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)" : "linear-gradient(135deg, #424141 0%, #374151 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            My Profile
          </h2>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              fontSize: "13px",
              marginBottom: "24px",
              color: document.documentElement.classList.contains('dark') ? "#cbd5e1" : "#687179",
              borderBottom: document.documentElement.classList.contains('dark') ? "1px solid #475569" : "1px solid #e5e7eb",
              paddingBottom: "12px",
            }}
          >
            <span style={{ fontWeight: "700", paddingBottom: "8px", borderBottom: "2px solid #10b981" }}>Profile</span>
            <span style={{ color: document.documentElement.classList.contains('dark') ? "#64748b" : "#9ca3af", cursor: "pointer", transition: "all 0.2s" }}></span>
          </div>

          {/* Personal Information block */}
          <div
            style={{
              backgroundColor: document.documentElement.classList.contains('dark') ? "#2a384e" : "#ffffff",
              border: document.documentElement.classList.contains('dark') ? "1px solid #334155" : "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: document.documentElement.classList.contains('dark') ? "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" : "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                marginBottom: "8px",
                color: document.documentElement.classList.contains('dark') ? "#e2e8f0" : "#111111",
              }}
            >
              Personal Information
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: document.documentElement.classList.contains('dark') ? "#94a3b8" : "#424244",
                marginBottom: "20px",
              }}
            >
              Update your personal information and profile details
            </p>

            {/* Form: full name, email, location, skills, bio, buttons */}
            <div style={{ maxWidth: "520px" }}>
            <div style={{ marginBottom: "14px" }}>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                name="fullName"
                style={inputStyle}
                value={form.fullName}
                onChange={handleChange}
              />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                name="email"
                style={{
                  ...inputStyle,
                  backgroundColor: document.documentElement.classList.contains('dark') ? "#0f172a" : "#f9fafb",
                  color: document.documentElement.classList.contains('dark') ? "#64748b" : "#6b7280",
                  cursor: "not-allowed",
                }}
                value={form.email}
                disabled
                title="Registered email cannot be changed"
              />
              <p style={{ fontSize: "11px", color: document.documentElement.classList.contains('dark') ? "#64748b" : "#000000", marginTop: "4px" }}>
                Your registered email cannot be changed
              </p>
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={labelStyle}>Location</label>
              <input
                type="text"
                name="location"
                style={inputStyle}
                value={form.location}
                onChange={handleChange}
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle}>Skills (comma-separated)</label>
              <input
                type="text"
                name="skills"
                placeholder="e.g., JavaScript, React, Node.js"
                style={inputStyle}
                value={form.skills}
                onChange={handleChange}
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle}>Bio</label>
              <textarea
                name="bio"
                placeholder="Tell us about yourself..."
                style={{ ...inputStyle, minHeight: "80px", fontFamily: "inherit" }}
                value={form.bio}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "20px" }}>
              <button
                type="button"
                onClick={handleSave}
                disabled={updating}
                style={{
                  padding: "12px 28px",
                  background: updating ? "#9ca3af" : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#ffffff",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: updating ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  opacity: updating ? 0.7 : 1,
                  boxShadow: updating ? "none" : "0 4px 12px rgba(16, 185, 129, 0.3)",
                }}
                onMouseOver={(e) => !updating && (e.target.style.boxShadow = "0 6px 16px rgba(16, 185, 129, 0.4)", e.target.style.transform = "translateY(-2px)")}
                onMouseOut={(e) => !updating && (e.target.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.3)", e.target.style.transform = "translateY(0)")}
              >
                {updating ? "Updating..." : "✓ Update Profile"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/change-password")}
                style={{
                  padding: "12px 28px",
                  backgroundColor: document.documentElement.classList.contains('dark') ? "#334155" : "#e5e7eb",
                  color: document.documentElement.classList.contains('dark') ? "#e2e8f0" : "#111827",
                  borderRadius: "8px",
                  border: document.documentElement.classList.contains('dark') ? "1px solid #475569" : "1px solid #d1d5db",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = document.documentElement.classList.contains('dark') ? "#475569" : "#d1d5db", e.target.style.transform = "translateY(-2px)")}
                onMouseOut={(e) => (e.target.style.backgroundColor = document.documentElement.classList.contains('dark') ? "#334155" : "#e5e7eb", e.target.style.transform = "translateY(0)")}
              >
                🔒 Change Password
              </button>
            </div>

            {successMessage && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "14px 16px",
                  backgroundColor: document.documentElement.classList.contains('dark') ? "#064e3b" : "#d1fae5",
                  color: document.documentElement.classList.contains('dark') ? "#86efac" : "#065f46",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  border: document.documentElement.classList.contains('dark') ? "1px solid #10b981" : "1px solid #86efac",
                  boxShadow: document.documentElement.classList.contains('dark') ? "0 4px 6px rgba(16, 185, 129, 0.2)" : "none",
                }}
              >
                <span style={{ fontSize: "16px" }}>✓</span>
                {successMessage}
              </div>
            )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;