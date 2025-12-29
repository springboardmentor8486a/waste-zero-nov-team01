import React from "react";

const styles = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    fontFamily: '"Times New Roman", serif',
  },
  sidebar: {
    width: "260px",
    backgroundColor: "#f0f0f0",
    padding: "20px 15px",
    borderRight: "1px solid #ddd",
    overflowY: "auto",
    marginLeft: "20px",
  },
  main: {
    flex: 1,
    position: "relative",
    backgroundColor: "#fafafa",
  },
  topbar: {
    position: "absolute",
    top: "15px",
    right: "25px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  profileCircle: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    border: "1px solid #ddd",
  },
  profileText: {
    fontSize: "14px",
  },
  welcomeWrapper: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: "40px",
    letterSpacing: "3px",
    textShadow: "2px 2px 4px #bbb",
    marginLeft: "40px",
  },
};

export default function GlobalLayout({ children, sidebar }) {
  return (
    <div style={styles.layout}>
      <aside style={styles.sidebar}>{sidebar}</aside>

      <main style={styles.main}>
        <div style={styles.topbar}>
          <div style={styles.profileCircle}></div>
          <span style={styles.profileText}>profile</span>
        </div>

        <div style={styles.welcomeWrapper}>
          <h1 style={styles.welcomeText}>WELCOME TO WASTE ZERO</h1>
        </div>

        {children}
      </main>
    </div>
  );
}