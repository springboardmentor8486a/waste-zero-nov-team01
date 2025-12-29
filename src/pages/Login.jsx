import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login(){
  const navigate = useNavigate();

  return (
    <div className="login-body">
      <div className="container">
        <div className="logo-box">
          <img src="/logo.jpg" alt="temporary logo"/>
          <p><b>waste zero</b><br/>Smarter Pickup Cleaner Cities</p>
        </div>

        <div className="role-select">
          <label style={{fontSize:18, fontWeight:"bold"}}>Select Role:</label><br/>
          <select>
            <option>Admin</option>
            <option>Volunteer</option>
            <option>User</option>
            <option>Pickup Staff</option>
          </select>
        </div>

        <form onSubmit={(e)=>{e.preventDefault(); navigate("/welcome");}}>
          <table style={{marginLeft:40}}>
            <tbody>
              <tr>
                <td>User Name :</td>
                <td className="b"><input type="text" placeholder="Enter Email or Username" /></td>
              </tr>
              <tr>
                <td>Password :</td>
                <td className="b"><input type="password" placeholder="Enter Your password" /></td>
              </tr>
              <tr>
                <td>OTP :</td>
                <td className="b"><input type="text" placeholder="Enter Code" /></td>
              </tr>
              <tr>
                <td>
                  <button id="button" type="submit">Login</button>
                </td>
                <td>
                  <h6>You Don't Have An Account?
                    <span className="signup-link" onClick={()=>navigate("/signup")}> Sign Up</span>
                  </h6>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
}
