import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      alert("All fields are required");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setSuccessMessage("");
      
      const token = localStorage.getItem("wastezero_token");
      await axios.post(
        "http://localhost:5000/api/auth/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "Failed to update password"
      );
    } finally {
      setLoading(false);
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

      {/* Tabs (Password active) */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          fontSize: "13px",
          marginBottom: "16px",
        }}
      >
        <span
          style={{ color: "#6b7280", cursor: "pointer" }}
          onClick={() => navigate("/profile")}
        >
          Profile
        </span>
        <span style={{ fontWeight: "700" }}>Password</span>
      </div>

      {/* Change Password block */}
      <h3
        style={{
          fontSize: "15px",
          fontWeight: "700",
          marginBottom: "4px",
        }}
      >
        Change Password
      </h3>
      <p
        style={{
          fontSize: "12px",
          color: "#6b7280",
          marginBottom: "16px",
        }}
      >
        Update your password to keep your account secure
      </p>

      <div style={{ maxWidth: "520px" }}>
        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>Current Password</label>
          <input
            type="password"
            style={inputStyle}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>New Password</label>
          <input
            type="password"
            style={inputStyle}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: "18px" }}>
          <label style={labelStyle}>Confirm New Password</label>
          <input
            type="password"
            style={inputStyle}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          style={{
            padding: "10px 32px",
            backgroundColor: loading ? "#9ca3af" : "#2563eb",
            color: "#ffffff",
            borderRadius: "6px",
            border: "none",
            fontSize: "14px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            opacity: loading ? 0.7 : 1,
          }}
          onMouseOver={(e) => !loading && (e.target.style.backgroundColor = "#1d4ed8")}
          onMouseOut={(e) => !loading && (e.target.style.backgroundColor = "#2563eb")}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

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
    </div>
  );
}

export default ChangePassword;
