import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/signup.css";

export default function Signup(){
  const navigate = useNavigate();
  return (
    <div className="signup-body">
      <div className="form-container">
        <div className="logo-section">
          <img src="/logo.jpg" className="logo" alt="logo"/>
          <div>
            <h2>waste zero</h2>
            <p>WasteZero: Smarter Pickup Cleaner Cities</p>
          </div>
        </div>

        <h3>create an account</h3>

        <div className="role-select">
          <label>Select Role:</label>
          <select>
            <option>Admin</option>
            <option>Volunteer</option>
            <option>User</option>
            <option>Pickup Staff</option>
          </select>
        </div>

        <input type="text" placeholder="enter your name" />
        <div className="form-row">
          <div>
            <input type="password" placeholder="enter password"/>
          </div>
          <div>
            <input type="password" placeholder="confirm password"/>
          </div>
        </div>

        <input type="email" placeholder="enter your email id" />
        <input type="text" placeholder="enter your location" />
        <textarea rows="3" placeholder="write your own bio"></textarea>

        <button onClick={()=>navigate("/login")}>Create Account</button>
      </div>
    </div>
  );
}
