// src/pages/CreateOpportunity.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateOpportunity() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    duration: "",
    date: "",
    skillsInput: "",
    status: "open", // default lower-case
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const validate = () => {
    if (!form.title.trim()) return "Title is required";
    if (!form.description.trim()) return "Description is required";
    if (!form.location.trim()) return "Location is required";
    if (!form.date) return "Date is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("wastezero_token");
      if (!token) {
        throw new Error("Please login again to create an opportunity");
      }

      const body = {
        title: form.title,
        description: form.description,
        location: form.location,
        duration: form.duration || "1 day",
        date: form.date,
        required_skills: form.skillsInput
          ? form.skillsInput
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        // status exactly enum values
        status: form.status, // "open" | "closed" | "in-progress"
        ngoName: "Green Earth",
      };

      const res = await fetch("http://localhost:5000/api/opportunities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Could not create opportunity");
      }

      alert("Opportunity created successfully!");
      navigate("/opportunities"); // same as list route
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: document.documentElement.classList.contains('dark') ? "1px solid #475569" : "1px solid #d1d5db",
    fontSize: "15px",
    backgroundColor: document.documentElement.classList.contains('dark') ? "#1e293b" : "#ffffff",
    color: document.documentElement.classList.contains('dark') ? "#e2e8f0" : "#000000",
    boxSizing: "border-box",
    marginTop: "4px",
  };

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: 600,
    color: document.documentElement.classList.contains('dark') ? "#cbd5e1" : "#01050bff",
  };

  return (
    <div
      style={{
        padding: "32px 16px",
        maxWidth: "640px",
        margin: "0 auto",
        backgroundColor: document.documentElement.classList.contains('dark') ? "#0f172a" : "#ffffff",
        minHeight: "100vh",
      }}
    >
{/* Back link + main heading */}
<div style={{ marginBottom: "24px" }}>
  {/* back to opportunities link */}
  <button
    type="button"
    onClick={() => navigate("/opportunities")}
    style={{
      border: "none",
      background: "none",
      color: document.documentElement.classList.contains('dark') ? "#94a3b8" : "#4b5563",
      fontSize: "14px",
      cursor: "pointer",
      marginBottom: "8px",
      display: "inline-flex",
      
    }}
  >
    <span style={{ fontSize: "16px" }}>←</span>
    <span>Back to Opportunities</span>
  </button>

  <h1
    style={{
      fontSize: "26px",
      fontWeight: "bold",
      color: document.documentElement.classList.contains('dark') ? "#ffffff" : "#080e0a",
      margin: 0,
    }}
  >
    Create New Opportunity
  </h1>
</div>

      {error && (
        <div
          style={{
            backgroundColor: document.documentElement.classList.contains('dark') ? "#7f1d1d" : "#fee2e2",
            color: document.documentElement.classList.contains('dark') ? "#fca5a5" : "#b91c1c",
            padding: "10px 12px",
            borderRadius: "8px",
            marginBottom: "16px",
            fontSize: "14px",
            border: document.documentElement.classList.contains('dark') ? "1px solid #991b1b" : "1px solid #fecaca",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Title *</label>
          <input
            style={inputStyle}
            type="text"
            name="title"
            placeholder="Beach Cleanup Drive"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Description *</label>
          <textarea
            name="description"
            rows={4}
            placeholder="Describe the volunteering opportunity..."
            value={form.description}
            onChange={handleChange}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Location *</label>
          <input
            style={inputStyle}
            type="text"
            name="location"
            placeholder="Hyderabad, Telangana"
            value={form.location}
            onChange={handleChange}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: 14,
          }}
        >
          <div>
            <label style={labelStyle}>Duration</label>
            <input
              style={inputStyle}
              type="text"
              name="duration"
              placeholder="1 day"
              value={form.duration}
              onChange={handleChange}
            />
          </div>
          <div>
            <label style={labelStyle}>Date *</label>
            <input
              style={inputStyle}
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Required skills (comma separated)</label>
          <input
            style={inputStyle}
            type="text"
            name="skillsInput"
            placeholder="cleaning, teamwork, communication"
            value={form.skillsInput}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="in-progress">In Progress</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#16a34a",
            color: "white",
            fontSize: "16px",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.8 : 1,
          }}
        >
          {loading ? "Creating..." : "Create Opportunity"}
        </button>
      </form>
    </div>
  );
}

export default CreateOpportunity;