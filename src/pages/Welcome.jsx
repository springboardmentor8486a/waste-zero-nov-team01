import React from "react";
import Sidebar from "../components/Sidebar";
import "../styles/welcome.css";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div className="main">
        <div
          className="profile-icon"
          onClick={() => navigate("/profile")}
        ></div>
      


        <div
          className="profile-text"
          onClick={() => navigate("/profile")}
        >
          profile
        </div>

        {/* Welcome Text */}
        <div className="welcome-text">
          WELCOME TO WASTE ZERO
        </div>
          <div
  className="welcome-image"
  style={{ backgroundImage: "url('/welcome-bg.jpg')" }}
></div>
      </div>
    </div>
  );
}
