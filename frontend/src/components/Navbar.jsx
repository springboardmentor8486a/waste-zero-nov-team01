import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        padding: "1rem 2rem",
        borderBottom: "1px solid #e5e7eb",
        marginBottom: "1.5rem",
      }}
    >
      <Link
        to="/opportunities"
        style={{ fontSize: "1.25rem", fontWeight: "600", textDecoration: "none", color: "#111827" }}
      >
        WasteZero Dashboard
      </Link>
    </nav>
  );
}

export default Navbar;