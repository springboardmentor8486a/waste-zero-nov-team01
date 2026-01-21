// src/pages/Settings.jsx
import React, { useState } from "react";

function Settings() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [theme, setTheme] = useState("light");

  const handleSave = (e) => {
    e.preventDefault();
    // TODO: backend API call
    alert("Settings saved (demo)");
  };

  return (
    <div style={{ padding: "24px 40px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px" }}>
        Settings
      </h2>
      <p style={{ color: "#6b7280", marginBottom: "24px" }}>
        Manage your notifications and account preferences.
      </p>

      <form
        onSubmit={handleSave}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          padding: "24px",
          maxWidth: "600px",
        }}
      >
        {/* Notifications section */}
        <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>
          Notifications
        </h3>

        <label style={{ display: "flex", alignItems: "center", marginBottom: "8px", gap: "8px" }}>
          <input
            type="checkbox"
            checked={emailAlerts}
            onChange={(e) => setEmailAlerts(e.target.checked)}
          />
          <span>Email alerts</span>
        </label>

        <label style={{ display: "flex", alignItems: "center", marginBottom: "16px", gap: "8px" }}>
          <input
            type="checkbox"
            checked={smsAlerts}
            onChange={(e) => setSmsAlerts(e.target.checked)}
          />
          <span>SMS alerts</span>
        </label>

        {/* Theme section */}
        <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>
          Appearance
        </h3>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          style={{
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            padding: "8px 10px",
            fontSize: "14px",
            marginBottom: "24px",
            width: "220px",
          }}
        >
          <option value="light">Light mode</option>
          <option value="dark">Dark mode</option>
        </select>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <button
            type="button"
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              backgroundColor: "#ffffff",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings;