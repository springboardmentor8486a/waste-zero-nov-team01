import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../api/authApi";

function Profile() {
  const navigate = useNavigate();

  // form state
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    location: "",
    skills: "",
    bio: "",
  }); 

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
      await updateProfile(form);   // PUT/PATCH to backend
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
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
            style={inputStyle}
            value={form.email}
            onChange={handleChange}
          />
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
          <label style={labelStyle}>Skills</label>
          <input
            type="text"
            name="skills"
            style={inputStyle}
            value={form.skills}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: "18px" }}>
          <label style={labelStyle}>Bio</label>
          <input
            type="text"
            name="bio"
            style={inputStyle}
            value={form.bio}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="button"
            onClick={handleSave}
            style={{
              padding: "8px 28px",
              backgroundColor: "#111827",
              color: "#ffffff",
              borderRadius: "4px",
              border: "none",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Save
          </button>

          <button
            type="button"
            onClick={() => navigate("/change-password")}
            style={{
              padding: "8px 20px",
              backgroundColor: "#e5e7eb",
              color: "#111827",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;