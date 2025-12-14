import React from "react";
import Sidebar from "../components/Sidebar";
import "../styles/password.css";
import { useNavigate } from "react-router-dom";

export default function ChangePassword(){
  const navigate = useNavigate();
  return (
    <div style={{display:"flex"}}>
      <Sidebar />
      <div className="main">
        <span className="back-btn" onClick={()=>navigate("/profile")}>&larr;</span>
        <h2>Change Password</h2>

        <div className="form-field">
          <label>Current Password</label>
          <input type="password" />
        </div>

        <div className="form-field">
          <label>New Password</label>
          <input type="password" />
        </div>

        <div className="form-field">
          <label>Confirm Password</label>
          <input type="password" />
        </div>

        <button className="change-pass-btn" style={{marginTop:20}} onClick={()=>navigate("/profile")}>Save</button>
      </div>
    </div>
  );
}
