
import React from "react";
import { Link } from "react-router-dom";
import "./../styles/sidebar.css"; // optional if you want separate CSS

export default function Sidebar(){
  return (
    <div style={{width:260, background:"#eee", height:"100vh", padding:20, borderRight:"2px solid #ccc"}}>
      <div style={{marginBottom:20}}>
        <img src="/logo.jpg" alt="logo" style={{width:70, height:70}}/>
        <h2 style={{margin:"6px 0 0 0"}}>waste zero</h2>
        <p style={{margin:0, fontSize:12}}>WasteZero: Smarter Pickup Cleaner Cities</p>
      </div>

      <div style={{marginTop:10, marginBottom:8, fontWeight:"bold"}}>MENU BAR</div>
      <div style={{display:"grid", gap:8}}>
        <Link to="/profile" style={linkStyle}>Edit Profile</Link>
        <div style={linkStyle}>Dashboard</div>
        <div style={linkStyle}>Schedule Pickup</div>
        <div style={linkStyle}>Notifications</div>
        <div style={linkStyle}>Opportunities</div>
        <div style={linkStyle}>Create Opportunities</div>
        <div style={linkStyle}>Messages</div>
      </div>

      <div style={{marginTop:20, fontWeight:"bold"}}>SETTINGS</div>
      <div style={{display:"grid", gap:8, marginTop:8}}>
        <Link to="/profile" style={linkStyle}>My Profile</Link>
        <div style={linkStyle}>Settings</div>
      </div>
    </div>
  );
}

const linkStyle = {
  padding:"10px",
  background:"#e6e6e6",
  borderRadius:4,
  textAlign:"center",
  textDecoration:"none",
  color:"#222"
};
