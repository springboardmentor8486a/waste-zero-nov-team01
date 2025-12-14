
import React from "react";

export default function Header({title}) {
  return (
    <div style={{padding: "16px 24px", borderBottom: "1px solid #ddd", display:"flex", alignItems:"center", gap:20}}>
      <img src="/logo.png" alt="logo" style={{width:60, height:60, borderRadius:8}}/>
      <div>
        <h2 style={{margin:0}}>{title ?? "waste zero"}</h2>
        <div style={{fontSize:12, color:"#666"}}>WasteZero: Smarter Pickup Cleaner Cities</div>
      </div>
    </div>
  );
}
