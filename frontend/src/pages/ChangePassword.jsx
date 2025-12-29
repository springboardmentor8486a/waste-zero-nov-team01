import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../api/authApi";   // make sure this exists

function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

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
    if (newPassword !== confirmNewPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await changePassword(
        {
          currentPassword,
          newPassword,
        },
        token
      );
      alert("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "Failed to update password"
      );
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
          onClick={() => navigate("/ngo/profile")}
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
          />
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>New Password</label>
          <input
            type="password"
            style={inputStyle}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "18px" }}>
          <label style={labelStyle}>Confirm New Password</label>
          <input
            type="password"
            style={inputStyle}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          style={{
            padding: "8px 32px",
            backgroundColor: "#2563eb",
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
      </div>
    </div>
  );
}

export default ChangePassword;