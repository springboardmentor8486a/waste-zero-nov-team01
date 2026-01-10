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
    color: "#111111",
    fontWeight: "600",
    fontSize: "13px",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #e5e7eb",
    borderRadius: "2px",
    outline: "none",
    fontSize: "13px",
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
        padding: "16px 40px",
        maxWidth: "720px",
        margin: "0 auto",
      }}
    >
      {/* Loading state */}
      {loading && (
        <div style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>
          Loading your profile...
        </div>
      )}

      {!loading && (
        <>
          {/* My Profile heading */}
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "700",
              marginBottom: "4px",
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
              marginBottom: "16px",
            }}
          >
            <span style={{ fontWeight: "700" }}>Profile</span>
            <span style={{ color: "#6b7280", cursor: "pointer" }}>Password</span>
          </div>

          {/* Personal Information block */}
          <h3
            style={{
              fontSize: "15px",
              fontWeight: "700",
              marginBottom: "4px",
            }}
          >
            Personal Information
          </h3>
          <p
            style={{
              fontSize: "12px",
              color: "#6b7280",
              marginBottom: "16px",
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
                  backgroundColor: "#f9fafb",
                  color: "#6b7280",
                  cursor: "not-allowed",
                }}
                value={form.email}
                disabled
                title="Registered email cannot be changed"
              />
              <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
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

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={handleSave}
                disabled={updating}
                style={{
                  padding: "10px 24px",
                  backgroundColor: updating ? "#9ca3af" : "#10b981",
                  color: "#ffffff",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: updating ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  opacity: updating ? 0.7 : 1,
                }}
                onMouseOver={(e) => !updating && (e.target.style.backgroundColor = "#059669")}
                onMouseOut={(e) => !updating && (e.target.style.backgroundColor = "#10b981")}
              >
                {updating ? "Updating..." : "Update Profile"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/change-password")}
                style={{
                  padding: "10px 24px",
                  backgroundColor: "#e5e7eb",
                  color: "#111827",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#d1d5db")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#e5e7eb")}
              >
                Change Password
              </button>
            </div>

            {successMessage && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "12px 16px",
                  backgroundColor: "#d1fae5",
                  color: "#065f46",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>✓</span>
                {successMessage}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;