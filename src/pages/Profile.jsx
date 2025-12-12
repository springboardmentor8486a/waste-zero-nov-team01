import React from "react";
import Sidebar from "../components/Sidebar";
import "../styles/profile.css";
import { useNavigate } from "react-router-dom";

export default function Profile(){
  const navigate = useNavigate();
  return (
    <div style={{display:"flex"}}>
      <Sidebar />
      <div className="main">
        <span className="back-btn" onClick={()=>navigate("/welcome")}>&larr;</span>
        <div className="profile-title">MY PROFILE</div>

        <div className="form-field">
          <label>Name</label>
          <input type="text" />
        </div>

        <div className="form-field">
          <label>Phone Number</label>
          <input type="text" />
        </div>

        <div className="form-field">
          <label>Email</label>
          <input type="text" />
        </div>

        <div className="form-field">
          <label>Location</label>
          <input type="text" />
        </div>

        <div className="form-field">
          <label>Skills</label>
          <input type="text" />
        </div>

        <button className="change-pass-btn" onClick={()=>navigate("/change-password")}>Change Password</button>
      </div>
    </div>
  );
}
